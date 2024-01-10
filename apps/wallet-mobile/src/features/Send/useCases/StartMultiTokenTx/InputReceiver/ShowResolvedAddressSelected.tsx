import {nameServerName} from '@yoroi/resolver'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

import {Spacer} from '../../../../../components'
import {useSend} from '../../../common/SendContext'
import {useStrings} from '../../../common/strings'

export const ShowResolvedAddressSelected = () => {
  const strings = useStrings()
  const {targets, selectedTargetIndex} = useSend()
  const {selectedNameServer} = targets[selectedTargetIndex].receiver
  const {address} = targets[selectedTargetIndex].entry

  const hide = address.length === 0 || selectedNameServer == null

  if (hide) return null

  const serverName = nameServerName[selectedNameServer]
  const shortenAddress = shortenString(address)
  const resolvedAddressInfo = `${strings.resolvedAddress}: ${shortenAddress}`

  return (
    <View>
      <Spacer height={4} />

      <View style={styles.row}>
        <Text style={styles.serverName} numberOfLines={1}>
          {serverName}
        </Text>

        <Text style={styles.address} numberOfLines={1}>
          {resolvedAddressInfo}
        </Text>
      </View>
    </View>
  )
}

const shortenString = (text: string) => {
  if (text.length > 16) {
    return text.substring(0, 8) + '...' + text.substring(text.length - 8)
  }
  return text
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serverName: {
    fontFamily: 'Rubik',
    fontSize: 12,
    fontWeight: '400',
    color: '#4A5065',
  },
  address: {
    fontFamily: 'Rubik',
    fontSize: 12,
    fontWeight: '400',
    color: '#8A92A3',
  },
})