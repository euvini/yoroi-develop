import {BigNumber} from 'bignumber.js'
import React from 'react'
import {defineMessages, useIntl} from 'react-intl'
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useSelector} from 'react-redux'

import TwoActionView from '../../../../../legacy/components/Common/TwoActionView'
import HWInstructions from '../../../../../legacy/components/Ledger/HWInstructions'
import {Text, TextInput} from '../../../../../legacy/components/UiKit'
import {CONFIG} from '../../../../../legacy/config/config'
import {getNetworkConfigById} from '../../../../../legacy/config/networks'
import {MultiToken} from '../../../../../legacy/crypto/MultiToken'
import {confirmationMessages, txLabels} from '../../../../../legacy/i18n/global-messages'
import {defaultNetworkAssetSelector} from '../../../../../legacy/selectors'
import {COLORS} from '../../../../../legacy/styles/config'
import {formatTokenWithText} from '../../../../../legacy/utils/format'
import {useSelectedWallet} from '../../../../SelectedWallet'
import type {Deregistration, Withdrawal} from '../WithdrawalDialog'

type Props = {
  withdrawals: Array<Withdrawal> | null
  deregistrations: Array<Deregistration> | null
  balance: BigNumber
  finalBalance: BigNumber
  fees: BigNumber
  onConfirm: (event: Record<string, unknown>, password?: string | void) => void
  onCancel: () => void
  useUSB?: boolean
}

export const TransferSummary = ({
  withdrawals,
  deregistrations,
  balance,
  finalBalance,
  fees,
  onConfirm,
  onCancel,
  useUSB,
}: Props) => {
  const strings = useStrings()
  const wallet = useSelectedWallet()
  const defaultAsset = useSelector(defaultNetworkAssetSelector)
  const [password, setPassword] = React.useState(CONFIG.DEBUG.PREFILL_FORMS ? CONFIG.DEBUG.PASSWORD : '')

  return (
    <TwoActionView
      title={strings.confirmTx}
      primaryButton={{
        label: strings.confirmButton,
        onPress: (event) => onConfirm(event, password),
      }}
      secondaryButton={{onPress: () => onCancel()}}
    >
      <Item>
        <Text>{strings.balanceLabel}</Text>
        <Text style={styles.balanceAmount}>{formatTokenWithText(balance, defaultAsset)}</Text>
      </Item>

      <Item>
        <Text>{strings.fees}</Text>
        <Text style={styles.balanceAmount}>{formatTokenWithText(fees, defaultAsset)}</Text>
      </Item>

      <Item>
        <Text>{strings.finalBalanceLabel}</Text>
        <Text style={styles.balanceAmount}>{formatTokenWithText(finalBalance, defaultAsset)}</Text>
      </Item>

      {withdrawals && withdrawals.length > 0 && <Withdrawals withdrawals={withdrawals} />}

      {deregistrations && deregistrations.length > 0 && <Deregistrations deregistrations={deregistrations} />}

      {wallet.isHW && <HWInstructions useUSB={useUSB} addMargin />}

      {!wallet.isEasyConfirmationEnabled && !wallet.isHW && (
        <View style={styles.input}>
          <PasswordInput secureTextEntry value={password} label={strings.password} onChangeText={setPassword} />
        </View>
      )}
    </TwoActionView>
  )
}

const Withdrawals: React.FC<{withdrawals: Array<Withdrawal>}> = ({withdrawals}) => {
  const wallet = useSelectedWallet()
  const strings = useStrings()

  return (
    <Item>
      <Text>{strings.withdrawals}</Text>
      {withdrawals.map((withdrawal) => (
        <TouchableOpacity
          key={withdrawal.address}
          activeOpacity={0.5}
          onPress={() =>
            Linking.openURL(getNetworkConfigById(wallet.networkId).EXPLORER_URL_FOR_ADDRESS(withdrawal.address))
          }
        >
          <Text secondary>{withdrawal.address}</Text>
        </TouchableOpacity>
      ))}
    </Item>
  )
}

const Deregistrations: React.FC<{deregistrations: Array<Deregistration>}> = ({deregistrations}) => {
  const wallet = useSelectedWallet()
  const defaultAsset = useSelector(defaultNetworkAssetSelector)
  const strings = useStrings()
  const refundAmount = formatTokenWithText(
    deregistrations
      .reduce(
        (sum, curr) => (curr.refund == null ? sum : sum.joinAddCopy(curr.refund)),
        new MultiToken([], {
          defaultNetworkId: defaultAsset.networkId,
          defaultIdentifier: defaultAsset.identifier,
        }),
      )
      .getDefault(),
    defaultAsset,
  ).toString()

  return (
    <>
      <Item>
        <Text>{strings.stakeDeregistration}</Text>
        {deregistrations.map((deregistration) => (
          <TouchableOpacity
            key={deregistration.rewardAddress}
            activeOpacity={0.5}
            onPress={() =>
              Linking.openURL(
                getNetworkConfigById(wallet.networkId).EXPLORER_URL_FOR_ADDRESS(deregistration.rewardAddress),
              )
            }
          >
            <Text secondary>{deregistration.rewardAddress}</Text>
          </TouchableOpacity>
        ))}
      </Item>

      <Item>
        <Text>{strings.unregisterExplanation({refundAmount})}</Text>
      </Item>
    </>
  )
}

const Item = (props) => <View {...props} style={styles.item} />
const PasswordInput = TextInput

const useStrings = () => {
  const intl = useIntl()

  return {
    fromLabel: intl.formatMessage(messages.fromLabel),
    balanceLabel: intl.formatMessage(messages.balanceLabel),
    confirmButton: intl.formatMessage(confirmationMessages.commonButtons.confirmButton),
    finalBalanceLabel: intl.formatMessage(messages.finalBalanceLabel),
    unregisterExplanation: (args) => intl.formatMessage(messages.unregisterExplanation, args),

    confirmTx: intl.formatMessage(txLabels.confirmTx),
    password: intl.formatMessage(txLabels.password),
    fees: intl.formatMessage(txLabels.fees),
    withdrawals: intl.formatMessage(txLabels.withdrawals),
    stakeDeregistration: intl.formatMessage(txLabels.stakeDeregistration),
  }
}

const messages = defineMessages({
  fromLabel: {
    id: 'components.walletinit.restorewallet.upgradeconfirmmodal.fromLabel',
    defaultMessage: '!!!From',
  },
  balanceLabel: {
    id: 'components.walletinit.restorewallet.upgradeconfirmmodal.balanceLabel',
    defaultMessage: '!!!Recovered balance',
  },
  finalBalanceLabel: {
    id: 'components.walletinit.restorewallet.upgradeconfirmmodal.finalBalanceLabel',
    defaultMessage: '!!!Final balance',
  },
  unregisterExplanation: {
    id: 'components.transfer.transfersummarymodal.unregisterExplanation',
    defaultMessage:
      '!!!This transaction will unregister one or more staking ' +
      'keys, giving you back your {refundAmount} from your deposit',
  },
})

const styles = StyleSheet.create({
  item: {
    paddingBottom: 5,
  },
  input: {
    paddingTop: 16,
  },
  balanceAmount: {
    color: COLORS.POSITIVE_AMOUNT,
    lineHeight: 24,
    fontSize: 16,
  },
})