import {useFocusEffect} from '@react-navigation/native'
import {useTheme} from '@yoroi/theme'
import * as React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Animated, {Layout} from 'react-native-reanimated'
import {SafeAreaView} from 'react-native-safe-area-context'

import {Button, Spacer, useModal} from '../../../components'
import {useMetrics} from '../../../metrics/metricsManager'
import {useSelectedWallet} from '../../../SelectedWallet'
import {useAddressModeManager} from '../../../wallet-manager/useAddressModeManager'
import {BIP32_HD_GAP_LIMIT} from '../common/contants'
import {useReceive} from '../common/ReceiveProvider'
import {ShowAddressLimitInfo} from '../common/ShowAddressLimitInfo/ShowAddressLimitInfo'
import {SmallAddressCard} from '../common/SmallAddressCard/SmallAddressCard'
import {useMultipleAddressesInfo} from '../common/useMultipleAddressesInfo'
import {useNavigateTo} from '../common/useNavigateTo'
import {useReceiveAddressesStatus} from '../common/useReceiveAddressesStatus'
import {useStrings} from '../common/useStrings'
import {QRs} from '../illustrations/QRs'

type AddressInfo = {
  isUsed?: boolean
  address: string
}

export const ListMultipleAddressesScreen = () => {
  const strings = useStrings()
  const {styles} = useStyles()
  const wallet = useSelectedWallet()
  const navigate = useNavigateTo()
  const {track} = useMetrics()

  const {addressMode} = useAddressModeManager()
  const addresses = useReceiveAddressesStatus(addressMode)
  const {selectedAddressChanged} = useReceive()

  React.useEffect(() => {
    wallet.generateNewReceiveAddressIfNeeded()
  }, [wallet])

  const {openModal} = useModal()
  const {isShowingMultipleAddressInfo} = useMultipleAddressesInfo()

  React.useEffect(() => {
    isShowingMultipleAddressInfo && openModal(strings.multiplePresentation, <Modal />, modalHeight)
  }, [isShowingMultipleAddressInfo, openModal, strings.multiplePresentation])

  const addressInfos = toAddressInfos(addresses)
  const hasReachedGapLimit = addresses.unused.length >= BIP32_HD_GAP_LIMIT

  const renderAddressInfo = React.useCallback(
    ({item}: {item: AddressInfo}) => (
      <SmallAddressCard
        address={item.address}
        isUsed={item.isUsed}
        onPress={() => {
          selectedAddressChanged(item.address)
          navigate.receiveDetails()
        }}
        // date={}  // TODO define with project
      />
    ),
    [navigate, selectedAddressChanged],
  )

  const handleOnGenerateNewReceiveAddress = () => {
    track.receiveGenerateNewAddressClicked()
    wallet.generateNewReceiveAddress()
  }

  useFocusEffect(
    React.useCallback(() => {
      track.receivePageListViewed()
    }, [track]),
  )

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right', 'bottom']}>
      {hasReachedGapLimit && (
        <>
          <ShowAddressLimitInfo />

          <Spacer height={16} />
        </>
      )}

      <Animated.FlatList
        data={addressInfos}
        keyExtractor={(addressInfo) => addressInfo.address}
        renderItem={renderAddressInfo}
        layout={Layout}
        showsVerticalScrollIndicator={false}
      />

      <Animated.View style={[styles.footer, {display: hasReachedGapLimit ? 'none' : 'flex'}]} layout={Layout}>
        <Button
          shelleyTheme
          title={strings.generateButton}
          disabled={hasReachedGapLimit}
          onPress={handleOnGenerateNewReceiveAddress}
          style={styles.button}
        />
      </Animated.View>
    </SafeAreaView>
  )
}

const modalHeight = 520
const Modal = () => {
  const {styles, colors} = useStyles()
  const strings = useStrings()

  const {hideMultipleAddressesInfo} = useMultipleAddressesInfo()

  const {closeModal} = useModal()
  const handleOnCloseModal = () => {
    hideMultipleAddressesInfo()
    closeModal()
  }

  return (
    <View style={styles.modal}>
      <QRs />

      <Text style={[styles.details, {color: colors.details}]}>{strings.multiplePresentationDetails}</Text>

      <Spacer fill />

      <View style={styles.buttonContainer}>
        <Button shelleyTheme title={strings.ok} onPress={handleOnCloseModal} style={styles.button} />
      </View>

      <Spacer height={24} />
    </View>
  )
}

const useStyles = () => {
  const {theme} = useTheme()

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.color.gray.min,
      padding: 16,
    },
    modal: {
      flex: 1,
      backgroundColor: theme.color['bottom-sheet-background'],
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    footer: {
      backgroundColor: theme.color.gray.min,
      paddingTop: 16,
    },
    details: {
      ...theme.typography['body-1-l-regular'],
    },
    buttonContainer: {
      alignSelf: 'stretch',
      backgroundColor: theme.color.gray.min,
    },
    button: {
      backgroundColor: theme.color.primary[500],
    },
  })

  const colors = {
    buttonBackgroundBlue: theme.color.primary[600],
    learnMore: theme.color.primary[500],
    details: theme.color.gray[900],
  }

  return {styles, colors} as const
}

const toAddressInfos = (addresses: {unused: string[]; used: string[]}): AddressInfo[] => {
  const unusedAddresses = addresses.unused.map((address) => ({
    address,
    isUsed: false,
  }))

  const usedAddresses = addresses.used.map((address) => ({
    address,
    isUsed: true,
  }))

  return [...unusedAddresses, ...usedAddresses]
}
