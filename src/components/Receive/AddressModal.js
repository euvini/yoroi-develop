// @flow

import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {View} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import QRCode from 'react-native-qrcode-svg'
import {injectIntl, defineMessages, type IntlShape} from 'react-intl'

import {
  externalAddressIndexSelector,
  isHWSelector,
  walletMetaSelector,
} from '../../selectors'
import {formatPath} from '../../crypto/commonUtils'
import {Text, Button, Modal} from '../UiKit'

import styles from './styles/AddressModal.style'

import type {AddressDTOCardano, KeyHashesCardano} from '../../crypto/Address.dto'
import type {ComponentType} from 'react'
import type {WalletMeta} from '../../state'

const messages = defineMessages({
  walletAddress: {
    id: 'components.receive.addressmodal.walletAddress',
    defaultMessage: '!!!Your wallet address',
    description: 'some desc',
  },
  BIP32path: {
    id: 'components.receive.addressmodal.BIP32path',
    defaultMessage: '!!!BIP32 path:',
    description: 'some desc',
  },
  copyLabel: {
    id: 'components.receive.addressmodal.copyLabel',
    defaultMessage: '!!!Copy address',
    description: 'some desc',
  },
  copiedLabel: {
    id: 'components.receive.addressmodal.copiedLabel',
    defaultMessage: '!!!Copied',
    description: 'some desc',
  },
  spending: {
    id: 'components.receive.addressmodal.spendingKeyHash',
    defaultMessage: '!!!Spending',
    description: 'some desc',
  },
  staking: {
    id: 'components.receive.addressmodal.stakingKeyHash',
    defaultMessage: '!!!Staking',
    description: 'some desc',
  },
  title: {
    id: 'components.receive.addressmodal.title',
    defaultMessage: '!!!Title',
    description: 'some desc',
  },
  verifyLabel: {
    id: 'components.receive.addressverifymodal.title',
    defaultMessage: '!!!Verify Address on Ledger',
  },
})

type Props = {|
  addressInfo: ?AddressDTOCardano,
  index?: number,
  intl: IntlShape,
  onRequestClose: () => any,
  visible: boolean,
  onAddressVerify: () => void,
  isHW: boolean,
  walletMeta: WalletMeta,
|}

type State = {
  isCopied: boolean,
  keyHashes: KeyHashesCardano | null
}

class AddressModal extends React.Component<Props, State> {
  state = {isCopied: false, keyHashes: null}

  /* eslint-disable-next-line react/sort-comp */
  _hideModalTimeoutId = null

  async componentDidMount(): Promise<void> {
    const {addressInfo} = this.props
    this.setState({
      keyHashes: await addressInfo?.getKeyHashes(),
    })
  }

  componentWillUnmount() {
    if (this._hideModalTimeoutId) clearTimeout(this._hideModalTimeoutId)
  }

  _copyAddress = () => {
    if (this.props.addressInfo == null) return
    Clipboard.setString(this.props.addressInfo.address)
    this.setState({isCopied: true})

    // To avoid reading the clipboard, we simply reset state once the modal
    // is closed
    this._hideModalTimeoutId = setTimeout(() => {
      this.props.onRequestClose()
      this.setState({isCopied: false})
    }, 1000)
  }

  render() {
    const {
      isCopied,
      keyHashes,
    } = this.state
    const {
      addressInfo,
      index,
      intl,
      onRequestClose,
      visible,
      onAddressVerify,
      isHW,
      walletMeta,
    } = this.props

    return (
      <Modal visible={visible} onRequestClose={onRequestClose} showCloseIcon>
        <View style={styles.container}>
          <Text style={styles.title}>
            {intl.formatMessage(messages.title).toUpperCase()}
          </Text>
          <QRCode
            value={addressInfo?.address}
            size={140}
            backgroundColor="white"
            color="black"
          />
          <View style={styles.info}>
            <Text style={styles.subtitle}>
              {intl.formatMessage(messages.walletAddress)}
            </Text>
            <Text secondary monospace>
              {addressInfo?.address}
            </Text>
            <Text style={styles.subtitle}>
              {intl.formatMessage(messages.BIP32path)}
            </Text>
            <Text secondary monospace>
              {index != null && (
                <>
                  {formatPath(
                    0,
                    'External',
                    index,
                    walletMeta.walletImplementationId,
                  )}
                </>
              )}
            </Text>
            <Text style={styles.subtitle}>
              {intl.formatMessage(messages.staking)}
            </Text>
            <Text secondary monospace>
              {keyHashes?.staking}
            </Text>
            <Text style={styles.subtitle}>
              {intl.formatMessage(messages.spending)}
            </Text>
            <Text secondary monospace>
              {keyHashes?.spending}
            </Text>
          </View>
        </View>

        <Button
          onPress={this._copyAddress}
          title={
            isCopied
              ? intl.formatMessage(messages.copiedLabel)
              : intl.formatMessage(messages.copyLabel)
          }
        />
        {isHW && (
          <Button
            onPress={onAddressVerify}
            title={intl.formatMessage(messages.verifyLabel)}
            style={styles.button}
          />
        )}
      </Modal>
    )
  }
}

type ExternalProps = {|
  addressInfo: ?AddressDTOCardano,
  onRequestClose: () => any,
  visible: boolean,
  intl: IntlShape,
  onAddressVerify: () => void,
|}

export default injectIntl(
  (compose(
    connect(
      (state, {addressInfo}) => ({
        index: externalAddressIndexSelector(state)[(addressInfo?.address)],
        isHW: isHWSelector(state),
        walletMeta: walletMetaSelector(state),
      }),
      null,
    ),
  )(AddressModal): ComponentType<ExternalProps>),
)
