import React from 'react'
import {Alert, Platform, ScrollView, StyleSheet, View} from 'react-native'
import DeviceInfo from 'react-native-device-info'

import {Button, Spacer, Text} from '../../../../components'
import {spacing} from '../../../../theme'
import {HARDWARE_WALLETS, useLedgerPermissions} from '../../../../yoroi-wallets/hw'
import {useStrings} from '../../common/strings'

type Props = {
  onSelectUSB: () => void
  onSelectBLE: () => void
}

const useIsUsbSupported = () => {
  const [isUSBSupported, setUSBSupported] = React.useState(false)
  React.useEffect(() => {
    DeviceInfo.getApiLevel().then((sdk) =>
      setUSBSupported(Platform.OS === 'android' && sdk >= HARDWARE_WALLETS.LEDGER_NANO.USB_MIN_SDK),
    )
  }, [])

  return isUSBSupported
}

export const LedgerTransportSwitchView = ({onSelectUSB, onSelectBLE}: Props) => {
  const strings = useStrings()
  const isUSBSupported = useIsUsbSupported()

  const {request} = useLedgerPermissions({
    onError: () => Alert.alert(strings.error, strings.bluetoothError),
    onSuccess: onSelectBLE,
  })

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.content}>
        <Text style={styles.paragraph}>{strings.bluetoothExplanation}</Text>

        <Button
          outlineShelley
          onPress={() => request()}
          title={strings.bluetoothButton}
          testID="connectWithBLEButton"
        />

        <Spacer height={16} />

        <Text style={styles.paragraph}>{strings.usbExplanation}</Text>

        <Button
          outlineShelley
          onPress={onSelectUSB}
          title={strings.usbButton}
          disabled={!isUSBSupported || !HARDWARE_WALLETS.LEDGER_NANO.ENABLE_USB_TRANSPORT}
          testID="connectWithUSBButton"
        />

        <Text style={styles.infoText}>{strings.usbConnectionIsBlocked}</Text>
      </View>
    </ScrollView>
  )
}

export const LedgerTransportSwitch = LedgerTransportSwitchView

const styles = StyleSheet.create({
  scrollView: {
    paddingRight: 10,
  },
  paragraph: {
    marginBottom: spacing.paragraphBottomMargin,
    fontSize: 14,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    marginBottom: 24,
  },
  infoText: {
    paddingTop: 16,
    flex: 1,
    width: '100%',
  },
})
