import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

import {COLORS} from '../../theme'
import {Icon} from '../Icon'
import {Spacer} from '../Spacer'

export type ExpandableInfoCardProps = {
  adornment: React.ReactNode
  extended: boolean
  children: React.ReactNode
  header: React.ReactNode
  footer?: React.ReactNode
  withBoxShadow?: boolean
}

export const ExpandableInfoCard = ({
  children,
  extended,
  adornment,
  header,
  withBoxShadow = false,
  footer = null,
}: ExpandableInfoCardProps) => {
  return (
    <View>
      <Spacer height={8} />

      <View style={[styles.container, withBoxShadow && styles.shadowProp]}>
        {header}

        <Spacer height={8} />

        {children}

        <Spacer height={8} />

        {extended && adornment}

        {footer}

        <Spacer height={8} />
      </View>

      <Spacer height={8} />
    </View>
  )
}

export const HeaderWrapper = ({
  children,
  extended,
  onPress,
}: {
  children: React.ReactNode
  extended: boolean
  onPress: () => void
}) => {
  return (
    <View style={styles.flexBetween}>
      {children}

      <TouchableOpacity onPress={onPress}>
        {extended ? <Icon.Chevron direction="up" size={24} /> : <Icon.Chevron direction="down" size={24} />}
      </TouchableOpacity>
    </View>
  )
}

export const Footer = ({label, onPress}: {label: string; onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

export const HiddenInfoWrapper = ({
  label,
  info,
  onPress,
  value,
}: {
  label: string
  info?: React.ReactNode
  onPress?: () => void
  value: React.ReactNode
}) => {
  return (
    <View>
      <View style={styles.flexBetween}>
        <View style={styles.flex}>
          <Text style={[styles.text, styles.gray]}>{label}</Text>

          <Spacer width={8} />

          {info !== undefined && (
            <TouchableOpacity onPress={onPress}>
              <Icon.Info size={24} />
            </TouchableOpacity>
          )}
        </View>

        {typeof value === 'string' ? <Text style={styles.text}>{value}</Text> : value}
      </View>

      <Spacer height={8} />
    </View>
  )
}

export const MainInfoWrapper = ({label, value, isLast = false}: {label: string; value?: string; isLast?: boolean}) => {
  return (
    <View>
      <View style={styles.flexBetween}>
        <Text style={styles.gray}>{`${label}`}</Text>

        {value !== undefined && <Text style={styles.text}>{`${value}`}</Text>}
      </View>

      {!isLast && <Spacer height={8} />}
    </View>
  )
}

export const ExpandableInfoCardSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: 160, borderRadius: 8}}></View>
    </SkeletonPlaceholder>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.TEXT_GRAY3,
    padding: 16,
    width: '100%',
    height: 'auto',
    backgroundColor: COLORS.WHITE,
  },
  shadowProp: {
    backgroundColor: COLORS.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    borderWidth: 0,
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    textAlign: 'left',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#242838',
  },
  gray: {
    color: '#6B7384',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
  },
  buttonLabel: {
    fontSize: 14,
    paddingTop: 13,
    fontWeight: '500',
    fontFamily: 'Rubik-Medium',
  },
})
