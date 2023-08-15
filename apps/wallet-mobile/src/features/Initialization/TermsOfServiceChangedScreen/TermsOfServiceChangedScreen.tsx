import * as React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

import {Button, Spacer, StatusBar, YoroiLogo} from '../../../components'
import {BlueCheckbox} from '../../../components/BlueCheckbox'
import {COLORS} from '../../../theme'
import {useNavigateTo, useStrings} from '../common'

export const TermsOfServiceChangedScreen = () => {
  const [accepted, setAccepted] = React.useState(false)
  const navigateTo = useNavigateTo()

  const onPressContinue = () => {
    navigateTo.analyticsChanged()
  }

  const onPressCheckbox = () => {
    setAccepted((checked) => !checked)
  }

  const strings = useStrings()

  const onTosLinkPress = () => {
    navigateTo.readTermsOfService()
  }
  const onPrivacyLinkPress = () => {
    navigateTo.readPrivacyPolicy()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar type="dark" />

      <YoroiLogo />

      <Spacer height={80} />

      <Text style={styles.title}>{strings.title}</Text>

      <Spacer height={24} />

      <Text style={styles.description}>{strings.description}</Text>

      <Spacer height={24} />

      <BlueCheckbox checked={accepted} onPress={onPressCheckbox} style={styles.checkbox}>
        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxText}>{`${strings.tosIAgreeWith} `}</Text>

          <TouchableOpacity onPress={onTosLinkPress}>
            <Text style={[styles.checkboxText, styles.checkboxLink]}>{strings.tosAgreement}</Text>
          </TouchableOpacity>

          <Text style={styles.checkboxText}>{` ${strings.tosAnd} `}</Text>

          <TouchableOpacity onPress={onPrivacyLinkPress}>
            <Text style={[styles.checkboxText, styles.checkboxLink]}>{strings.privacyPolicy}</Text>
          </TouchableOpacity>
        </View>
      </BlueCheckbox>

      <Spacer fill />

      <Button title={strings.continue} shelleyTheme disabled={!accepted} onPress={onPressContinue} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'flex-start',
  },
  checkboxRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Rubik',
    lineHeight: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Rubik',
    lineHeight: 24,
    textAlign: 'center',
  },
  checkboxText: {
    fontFamily: 'Rubik',
    fontSize: 16,
    lineHeight: 18,
  },
  checkboxLink: {
    color: COLORS.DARK_BLUE,
    textDecorationLine: 'underline',
  },
})
