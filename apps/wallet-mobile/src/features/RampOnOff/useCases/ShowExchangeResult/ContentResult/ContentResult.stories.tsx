import {storiesOf} from '@storybook/react-native'
import React from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'

import banxaLogo from '../../../../../assets/img/banxa.png'
import {ContentResult} from './ContentResult'

storiesOf('RampOnOff ShowContentResult', module)
  .addDecorator((story) => <View style={styles.container}>{story()}</View>)
  .add('initial', () => (
    <ContentResult title="Provider">
      <View style={styles.boxProvider}>
        <Image style={styles.banxaLogo} source={banxaLogo} />

        <Text style={styles.contentValueText}>Banxa</Text>
      </View>
    </ContentResult>
  ))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  boxProvider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentValueText: {
    fontSize: 16,
    fontFamily: 'Rubik',
    lineHeight: 24,
    color: '#000000',
  },
  banxaLogo: {
    width: 24,
    height: 24,
  },
})