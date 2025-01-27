import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {isString} from '@yoroi/common'
import _ from 'lodash'
import React from 'react'
import {useIntl} from 'react-intl'
import {Platform, SectionList, SectionListProps, StyleSheet, View} from 'react-native'

import {Spacer, Text} from '../../components'
import {ShowBuyBanner} from '../../features/RampOnOff/common/ShowBuyBanner/ShowBuyBanner'
import {formatDateRelative} from '../../legacy/format'
import {useMetrics} from '../../metrics/metricsManager'
import {useSelectedWallet} from '../../SelectedWallet'
import {useTransactionInfos} from '../../yoroi-wallets/hooks'
import {TransactionInfo} from '../../yoroi-wallets/types'
import {TxHistoryListItem} from './TxHistoryListItem'

type ListProps = SectionListProps<TransactionInfo>

type Props = Partial<ListProps> & {
  onScroll: ListProps['onScroll']
}
export const TxHistoryList = (props: Props) => {
  const key = useRemountOnFocusHack()
  const wallet = useSelectedWallet()
  const {track} = useMetrics()

  useFocusEffect(
    React.useCallback(() => {
      track.transactionsPageViewed()
    }, [track]),
  )

  const transactionsInfo = useTransactionInfos(wallet)
  const groupedTransactions = getTransactionsByDate(transactionsInfo)

  return (
    <View style={styles.container}>
      <SectionList
        {...props}
        key={key}
        ListHeaderComponent={<ShowBuyBanner />}
        contentContainerStyle={{
          paddingHorizontal: 18,
          flexGrow: 1,
          height: 'auto',
        }}
        renderItem={({item}) => <TxHistoryListItem transaction={item} />}
        ItemSeparatorComponent={() => <Spacer height={16} />}
        renderSectionHeader={({section: {data}}) => <DayHeader ts={data[0].submittedAt} />}
        sections={groupedTransactions}
        renderSectionFooter={() => <Spacer height={12} />}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        nestedScrollEnabled={true}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        testID="txHistoryList"
      />
    </View>
  )
}

// workaround for https://emurgo.atlassian.net/browse/YOMO-199
// related to https://github.com/facebook/react-native/issues/15694
export const useRemountOnFocusHack = () => {
  const [key, setKey] = React.useState(0)
  const navigation = useNavigation()

  React.useEffect(() => {
    if (Platform.OS !== 'ios') {
      return
    }

    const unsubscribe = navigation.addListener('focus', () => {
      setKey((key) => key + 1)
    })

    return unsubscribe
  }, [key, navigation])

  return key
}

type DayHeaderProps = {
  ts: unknown
}

const DayHeader = ({ts}: DayHeaderProps) => {
  const intl = useIntl()

  return (
    <View style={styles.dayHeaderRoot}>
      <Text testID="dayHeaderText">{isString(ts) ? formatDateRelative(ts, intl) : ''}</Text>
    </View>
  )
}

const getTransactionsByDate = (transactions: Record<string, TransactionInfo>) =>
  _(transactions)
    .filter((t) => t.submittedAt != null)
    .sortBy((t) => t.submittedAt)
    .reverse()
    .groupBy((t) => t.submittedAt?.substring(0, '2001-01-01'.length))
    .values()
    .map((data) => ({data}))
    .value()

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayHeaderRoot: {
    paddingBottom: 4,
    paddingHorizontal: 20,
  },
})
