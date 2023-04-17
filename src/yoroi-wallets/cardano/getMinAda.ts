import BigNumber from 'bignumber.js'

import {DefaultAsset, Token} from '../types'
import {CardanoMobile, cardanoValueFromMultiToken} from '.'
import {MultiToken} from './MultiToken'
import {getCardanoNetworkConfigById} from './networks'

export const getMinAda = async (selectedToken: Token, defaultAsset: DefaultAsset) => {
  const networkConfig = getCardanoNetworkConfigById(defaultAsset.networkId)
  const fakeAmount = new BigNumber('0') // amount doesn't matter for calculating min UTXO amount
  const fakeMultitoken = new MultiToken(
    [
      {
        identifier: defaultAsset.identifier,
        networkId: defaultAsset.networkId,
        amount: fakeAmount,
      },
      {
        identifier: selectedToken.identifier,
        networkId: selectedToken.networkId,
        amount: fakeAmount,
      },
    ],
    {
      defaultNetworkId: defaultAsset.networkId,
      defaultIdentifier: defaultAsset.identifier,
    },
  )
  const minAmount = await CardanoMobile.minAdaRequired(
    await cardanoValueFromMultiToken(fakeMultitoken),
    await CardanoMobile.BigNum.fromStr(networkConfig.MINIMUM_UTXO_VAL),
  )
  // if the user is sending a token, we need to make sure the resulting utxo
  // has at least the minimum amount of ADA in it
  return minAmount.toStr()
}
