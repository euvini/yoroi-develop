import {useTheme} from '@yoroi/theme'
import _ from 'lodash'
import * as React from 'react'
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'

import {Button, KeyboardAvoidingView, Spacer, StatusBar, TextInput} from '../../../components'
import {ModalScreenWrapper} from '../../../components/ModalScreenWrapper/ModalScreenWrapper'
import {useCopy} from '../../../legacy/useCopy'
import {useSelectedWallet} from '../../../SelectedWallet'
import {useHideBottomTabBar, useReceiveAddresses} from '../../../yoroi-wallets/hooks'
import {mocks} from '../common/mocks'
import {ShareQRCodeCard} from '../common/ShareQRCodeCard/ShareQRCodeCard'
import {SkeletonAdressDetail} from '../common/SkeletonAddressDetail/SkeletonAddressDetail'
import {useStrings} from '../common/useStrings'

export const SpecificAmountScreen = () => {
  useHideBottomTabBar()
  const strings = useStrings()
  const wallet = useSelectedWallet()
  const receiveAddresses = useReceiveAddresses(wallet)

  const HEIGHT_SCREEN = useWindowDimensions().height
  const HEIGHT_MODAL = (HEIGHT_SCREEN / 100) * 80

  const [amount, setAmount] = React.useState<string>('')

  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const [isCopying, copy] = useCopy()

  const {colors, styles} = useStyles()

  const currentAddress = _.last(receiveAddresses)

  const generateLink = () => {
    Keyboard.dismiss()
    setIsModalVisible(true)
  }

  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={styles.root}>
          <StatusBar type="light" />

          <Spacer height={24} />

          <View style={styles.content}>
            <View style={styles.screen}>
              <Text style={styles.textAddressDetails}>{strings.specificAmountDescription}</Text>

              <TextInput label={strings.ADALabel} keyboardType="number-pad" onChangeText={setAmount} maxLength={4} />

              <View style={styles.textSection}>
                <Text style={[styles.textAddressDetails, {color: colors.gray}]}>{strings.address}</Text>

                <Text style={styles.textAddressDetails}>{currentAddress}</Text>
              </View>
            </View>

            <Button
              shelleyTheme
              onPress={generateLink}
              disabled={amount === '' ? true : false}
              title={strings.generateLink}
              style={styles.button}
            />

            <Spacer height={24} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {isModalVisible && (
        <ModalScreenWrapper
          title={strings.multipleAdress}
          height={HEIGHT_MODAL}
          onClose={() => {
            setIsModalVisible(false)
          }}
        >
          <View style={styles.root}>
            <ScrollView>
              {mocks.specificAddressAmount !== null ? (
                <ShareQRCodeCard
                  title={`${amount} ADA`}
                  address={mocks.specificAddressAmount}
                  onLongPress={() => copy(mocks.specificAddressAmount)}
                />
              ) : (
                <View style={styles.root}>
                  <SkeletonAdressDetail />
                </View>
              )}

              <Spacer height={32} />
            </ScrollView>

            <Button
              shelleyTheme
              onPress={() => {
                copy(mocks.specificAddressAmount)
              }}
              disabled={amount === '' ? true : false}
              title={strings.copyLinkBtn}
              iconImage={require('../../../assets/img/copy.png')}
              isCopying={isCopying}
              copiedTxt={strings.copyLinkMsg}
              style={styles.button}
            />

            <Spacer height={16} />
          </View>
        </ModalScreenWrapper>
      )}
    </SafeAreaView>
  )
}

const useStyles = () => {
  const {theme} = useTheme()

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.color['white-static'],
    },
    content: {
      paddingHorizontal: 16,
      flex: 1,
    },
    textAddressDetails: {
      fontWeight: '400',
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Rubik-Regular',
      color: theme.color.gray[900],
    },
    textSection: {
      gap: 4,
      width: '100%',
    },
    screen: {
      gap: 16,
      flex: 2,
    },
    button: {
      backgroundColor: theme.color.primary[500],
    },
  })

  const colors = {
    gray: theme.color.gray[600],
  }

  return {styles, colors} as const
}
