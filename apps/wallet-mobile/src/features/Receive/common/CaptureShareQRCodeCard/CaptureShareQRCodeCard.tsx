import {useTheme} from '@yoroi/theme'
import React from 'react'
import {StyleSheet, useWindowDimensions, View} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import QRCode from 'react-native-qrcode-svg'

import {Spacer, Text} from '../../../../components'
import {YoroiLogoIllustration} from '../../illustrations/YoroiLogo'

type ShareProps = {
  address?: string
  title?: string
  addressDetails?: AddressDetailsProps
}

type AddressDetailsProps = {
  address: string
  stakingHash?: string
  spendingHash?: string
  title?: string
}

export const CaptureShareQRCodeCard = ({address}: ShareProps) => {
  const logoWidth = 35
  const logoHeight = 37

  const {styles, colors} = useStyles()

  return (
    <View style={[styles.touchableCard]}>
      <LinearGradient
        style={[StyleSheet.absoluteFill, {opacity: 1}]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={colors.backgroundGradientCard}
      />

      <YoroiLogoIllustration height={logoHeight} width={logoWidth} />

      <View style={styles.addressContainer}>
        <View style={styles.qrCode}>
          <QRCode value={address} size={158} color={colors.black} />
        </View>

        <Spacer height={16} />

        <Text style={[styles.textAddress, {color: colors.transparent}]}>{address}</Text>
      </View>
    </View>
  )
}

const useStyles = () => {
  const SCREEN_WIDTH = useWindowDimensions().width
  const {theme} = useTheme()

  const styles = StyleSheet.create({
    qrCode: {
      backgroundColor: theme.color.gray.min,
      padding: 10,
      borderRadius: 8,
    },
    addressContainer: {
      alignItems: 'center',
    },
    touchableCard: {
      borderRadius: 10,
      width: SCREEN_WIDTH - 34,
      alignItems: 'center',
      maxHeight: 458,
      flex: 1,
      minHeight: 394,
      alignSelf: 'center',
      overflow: 'hidden',
      paddingVertical: 15,
      gap: 32,
      justifyContent: 'center',
    },
    textAddress: {
      textAlign: 'center',
      maxWidth: 300,
      ...theme.typography['body-1-l-regular'],
    },
  })

  const colors = {
    black: theme.color.gray.max,
    transparent: 'transparent',
    backgroundGradientCard: theme.color.gradients['blue-green'],
  }

  return {styles, colors} as const
}
