import AssetFingerprint from '@emurgo/cip14-js'
import {Swap, Balance} from '@yoroi/types'
import {OpenSwap} from '@yoroi/openswap'
import {isString} from '@yoroi/common'

import {Quantities} from '../utils/quantities'
import {supportedProviders} from '../translators/constants'
import {asQuantity} from '../utils/asQuantity'

export const transformersMaker = (
  primaryTokenId: Balance.Token['info']['id'],
) => {
  const asOpenswapTokenId = (yoroiTokenId: string) => {
    const [policyId, assetName = ''] = yoroiTokenId.split('.') as [
      string,
      string?,
    ]
    // we dont convert to '.' or 'lovelace' only ''
    return {
      policyId,
      assetName,
    }
  }

  const asOpenswapPriceTokenAddress = (yoroiTokenId: string) => {
    const [policyId, name = ''] = yoroiTokenId.split('.') as [string, string?]
    // we dont convert to '.' or 'lovelace' only ''
    return {
      policyId,
      name,
    }
  }

  const asYoroiTokenId = ({
    policyId,
    name,
  }: {
    policyId: string
    name: string
  }): Balance.Token['info']['id'] => {
    const possibleTokenId = `${policyId}.${name}`
    // openswap is inconsistent about ADA
    // sometimes is '.', '' or 'lovelace'
    const isPrimaryToken =
      possibleTokenId === '.' || possibleTokenId === 'lovelace.'
    if (policyId === '' || isPrimaryToken) return primaryTokenId
    return `${policyId}.${name}`
  }

  const asOpenswapAmount = (yoroiAmount: Balance.Amount) => {
    const {tokenId, quantity: amount} = yoroiAmount
    const {policyId, assetName} = asOpenswapTokenId(tokenId)
    return {
      amount,
      assetName,
      policyId,
    } as const
  }

  const asYoroiOpenOrder = (openswapOrder: OpenSwap.OpenOrder) => {
    const {from, to, deposit, ...rest} = openswapOrder
    const [policyId, name = ''] = primaryTokenId.split('.') as [string, string?]
    return {
      ...rest,
      from: asYoroiAmount(from),
      to: asYoroiAmount(to),
      deposit: asYoroiAmount({
        amount: deposit,
        address: {
          policyId,
          name,
        },
      }),
    } as const
  }

  const asYoroiCompletedOrder = (openswapOrder: OpenSwap.CompletedOrder) => {
    const {txHash, fromAmount, fromToken, toAmount, toToken} = openswapOrder
    const from = {
      amount: fromAmount,
      token: `${fromToken.address.policyId}.${fromToken.address.name}`,
    }
    const to = {
      amount: toAmount,
      token: `${toToken.address.policyId}.${toToken.address.name}`,
    }

    return {
      txHash: txHash,
      from: asYoroiAmount(from),
      to: asYoroiAmount(to),
    } as const
  }

  const asYoroiBalanceToken = (
    openswapToken: OpenSwap.Token,
  ): Balance.Token => {
    const {info, price} = openswapToken
    const balanceToken: Balance.Token = {
      info: {
        id: asYoroiTokenId(info.address),
        group: info.address.policyId,
        fingerprint: asTokenFingerprint({
          policyId: info.address.policyId,
          assetNameHex: info.address.name,
        }),
        name: asUtf8(info.address.name),
        decimals: info.decimalPlaces,
        description: info.description,
        image: info.image,
        kind: 'ft',
        symbol: info?.sign,
        icon: undefined,
        ticker: info.symbol,
        metadatas: {},
      },
      price: {
        ...price,
      },
      status: info.status,
      supply: {
        ...info.supply,
      },
    }
    return balanceToken
  }

  const asYoroiPool = (
    openswapLiquidityPool: OpenSwap.LiquidityPool,
  ): Swap.Pool | null => {
    const {
      batcherFee,
      poolFee,
      lvlDeposit,
      lpToken,
      tokenA,
      tokenB,
      provider,
      poolId,
    } = openswapLiquidityPool

    if (provider && !isSupportedProvider(provider)) return null

    const pool: Swap.Pool = {
      tokenA: asYoroiAmount(tokenA),
      tokenB: asYoroiAmount(tokenB),
      ptPriceTokenA: tokenA.priceAda.toString(),
      ptPriceTokenB: tokenB.priceAda.toString(),
      deposit: asYoroiAmount({amount: lvlDeposit, address: undefined}),
      lpToken: asYoroiAmount(lpToken),
      batcherFee: asYoroiAmount({amount: batcherFee, address: undefined}),
      fee: poolFee,
      price: 0,
      poolId,
      provider,
    }
    return pool
  }

  const asYoroiAmount = (openswapAmount: {
    address?: {
      policyId: string
      name: string
    }
    // openswap is inconsistent about ADA
    // sometimes is '.', '' or 'lovelace'
    token?: string
    amount?: string
  }): Balance.Amount => {
    const {amount, address, token} = openswapAmount ?? {}

    let policyId = ''
    let name = ''

    if (address) {
      policyId = address.policyId
      name = address.name
    } else if (isString(token)) {
      const tokenParts = token.split('.') as [string, string?]
      policyId = tokenParts[0]
      name = tokenParts[1] ?? ''
    }

    const yoroiAmount: Balance.Amount = {
      quantity: asQuantity(amount ?? Quantities.zero),
      tokenId: asYoroiTokenId({policyId, name}),
    } as const

    return yoroiAmount
  }

  /**
   *  Filter out pools that are not supported by Yoroi
   *
   * @param openswapLiquidityPools
   * @returns {Swap.Pool[]}
   */
  const asYoroiPools = (
    openswapLiquidityPools: OpenSwap.LiquidityPool[],
  ): Swap.Pool[] => {
    if (openswapLiquidityPools?.length > 0)
      return openswapLiquidityPools
        .map(asYoroiPool)
        .filter((pool): pool is Swap.Pool => pool !== null)

    return []
  }

  const asYoroiBalanceTokens = (
    openswapTokens: OpenSwap.Token[],
  ): Balance.Token[] => openswapTokens.map(asYoroiBalanceToken)

  return {
    asOpenswapTokenId,
    asOpenswapPriceTokenAddress,
    asOpenswapAmount,

    asYoroiTokenId,
    asYoroiAmount,
    asYoroiBalanceToken,
    asYoroiBalanceTokens,
    asYoroiCompletedOrder,
    asYoroiOpenOrder,
    asYoroiPool,
    asYoroiPools,
  }
}

// TODO: later replace for @yoroi/wallets
export const asTokenFingerprint = ({
  policyId,
  assetNameHex = '',
}: {
  policyId: string
  assetNameHex: string | undefined
}) => {
  const assetFingerprint = AssetFingerprint.fromParts(
    Buffer.from(policyId, 'hex'),
    Buffer.from(assetNameHex, 'hex'),
  )
  return assetFingerprint.fingerprint()
}

export const asUtf8 = (hex: string) => Buffer.from(hex, 'hex').toString('utf-8')

function isSupportedProvider(
  provider: string,
): provider is Swap.SupportedProvider {
  return supportedProviders.includes(provider as Swap.SupportedProvider)
}
