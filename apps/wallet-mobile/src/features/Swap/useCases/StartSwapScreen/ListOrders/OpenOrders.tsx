import React from 'react'
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native'

import {BottomSheetModal, Button, Icon, Spacer, Text, TextInput} from '../../../../../components'
import {COLORS} from '../../../../../theme'
import {
  ExpandableInfoCard,
  ExpandableInfoCardSkeleton,
} from '../../../common/SelectPool/ExpendableCard/ExpandableInfoCard'
import {useStrings} from '../../../common/strings'
import {Orders} from './ListOrders'

<<<<<<< HEAD
export const OpenOrders = ({orders, loading = false}: {orders: Orders; loading?: boolean}) => {
  const [bottomSheetState, setBottomSheetState] = React.useState<{
    isOpen: boolean
    title: string
    content?: React.ReactNode
  }>({
    isOpen: false,
    title: '',
    content: '',
  })
  const [confirmationModal, setConfirmationModal] = React.useState(false)
  const strings = useStrings()
  const [spendingPassword, setSpendingPassword] = React.useState('')

  if (loading) {
    return <OpenOrdersSkeleton />
  }
=======
const mockOpenOrders: OpenOrderListType = [
  {
    label: (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon.YoroiNightly size={24} />

        <Spacer width={4} />

        <Text>ADA/</Text>

        <Spacer width={4} />

        <Icon.Assets size={24} />

        <Spacer width={4} />

        <Text>USDA</Text>
      </View>
    ),

    mainInfo: [
      {label: 'Token price', value: '3 ADA'},
      {label: 'Token amount', value: '3 USDA'},
    ],
    hiddenInfo: [
      {
        label: 'Min ADA',
        value: '2 ADA',
      },
      {
        label: 'Min Received',
        value: '2.99 USDA',
      },
      {
        label: 'Fees',
        value: '2 ADA',
      },
    ],
    buttonAction: () => {
      console.log('button pressed')
    },
    buttonText: 'CANCEL ORDER',
  },
  {
    label: (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon.YoroiNightly size={24} />

        <Spacer width={4} />

        <Text>ADA/</Text>

        <Spacer width={4} />

        <Icon.Assets size={24} />

        <Spacer width={4} />

        <Text>USDA</Text>
      </View>
    ),

    mainInfo: [
      {label: 'Token price', value: '3 ADA'},
      {label: 'Token amount', value: '3 USDA'},
    ],
    hiddenInfo: [
      {
        label: 'Min ADA',
        value: '2 ADA',
      },
      {
        label: 'Min Received',
        value: '2.99 USDA',
      },
      {
        label: 'Fees',
        value: '2 ADA',
      },
    ],
    buttonAction: () => {
      console.log('button pressed')
    },
    buttonText: 'CANCEL ORDER',
  },
]

export const OpenOrders = () => {
  // TODO
  // const data = useOrderByStatusOpen({
  //   onError: (err) => {
  //     console.log(err)
  //   },
  // })
>>>>>>> develop

  return (
    <View style={styles.container}>
      <View style={styles.flex}>
        {orders.map((order) => (
          <ExpandableInfoCard
            key={`${order.assetFromLabel}-${order.assetToLabel}-${order.date}`}
            label={<Label assetFromLabel={order.assetFromLabel} assetToLabel={order.assetToLabel} />}
            hiddenInfo={[
              {
                label: strings.listOrdersTotal,
                value: order.total,
              },
              {
                label: strings.listOrdersLiquidityPool,
                value: (
                  <LiquidityPool
                    liquidityPoolIcon={order.liquidityPoolIcon}
                    liquidityPoolName={order.liquidityPoolName}
                    poolUrl={order.poolUrl}
                  />
                ),
              },
              {
                label: strings.listOrdersTimeCreated,
                value: order.date,
              },
              {
                label: strings.listOrdersTxId,
                value: <TxLink txId={order.txId} txLink={order.txLink} />,
              },
            ]}
            mainInfo={[
              {label: strings.listOrdersSheetAssetPrice, value: order.tokenPrice},
              {label: strings.listOrdersSheetAssetAmount, value: order.tokenAmount},
            ]}
            buttonText={strings.listOrdersSheetButtonText.toLocaleUpperCase()}
            onPress={() => {
              setBottomSheetState({
                isOpen: true,
                title: strings.listOrdersSheetTitle,
                content: (
                  <ModalContent
                    assetFromIcon={order.assetFromIcon}
                    assetToIcon={order.assetToIcon}
                    confirmationModal={confirmationModal}
                    onConfirm={() => {
                      setBottomSheetState({isOpen: false, title: '', content: ''})
                      setConfirmationModal(true)
                    }}
                    onBack={() => {
                      setBottomSheetState({isOpen: false, title: '', content: ''})
                    }}
                    assetFromLabel={order.assetFromLabel}
                    assetToLabel={order.assetToLabel}
                  />
                ),
              })
            }}
            withBoxShadow
          />
        ))}
      </View>

      <BottomSheetModal
        isOpen={bottomSheetState.isOpen}
        title={bottomSheetState.title}
        content={bottomSheetState.content}
        onClose={() => {
          setBottomSheetState({isOpen: false, title: '', content: ''})
        }}
      />

      <BottomSheetModal
        isOpen={confirmationModal}
        title={strings.signTransaction}
        content={
          <>
            <Text style={styles.modalText}>{strings.enterSpendingPassword}</Text>

            <TextInput
              secureTextEntry
              enablesReturnKeyAutomatically
              placeholder={strings.spendingPassword}
              value={spendingPassword}
              onChangeText={setSpendingPassword}
              autoComplete="off"
            />

            <Spacer fill />

            <Button testID="swapButton" shelleyTheme title={strings.sign} />
          </>
        }
        onClose={() => {
          setConfirmationModal(false)
        }}
      />
    </View>
  )
}

const TxLink = ({txLink, txId}: {txLink: string; txId: string}) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(txLink)} style={styles.txLink}>
      <Text style={styles.txLinkText}>{txId}</Text>
    </TouchableOpacity>
  )
}

const LiquidityPool = ({
  liquidityPoolIcon,
  liquidityPoolName,
  poolUrl,
}: {
  liquidityPoolIcon: React.ReactNode
  liquidityPoolName: string
  poolUrl: string
}) => {
  return (
    <View style={styles.liquidityPool}>
      {liquidityPoolIcon}

      <Spacer width={3} />

      <TouchableOpacity onPress={() => Linking.openURL(poolUrl)} style={styles.liquidityPoolLink}>
        <Text style={styles.liquidityPoolText}>{liquidityPoolName}</Text>
      </TouchableOpacity>
    </View>
  )
}

const Label = ({assetFromLabel, assetToLabel}: {assetFromLabel: string; assetToLabel: string}) => {
  return (
    <View style={styles.label}>
      <Icon.YoroiNightly size={24} />

      <Spacer width={4} />

      <Text>{assetFromLabel}</Text>

      <Text>/</Text>

      <Spacer width={4} />

      <Icon.Assets size={24} />

      <Spacer width={4} />

      <Text>{assetToLabel}</Text>
    </View>
  )
}

const OpenOrdersSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.flex}>
      {[null, null, null, null].map(() => (
        <>
          <ExpandableInfoCardSkeleton />

          <Spacer height={20} />
        </>
      ))}
    </View>
  </View>
)

const ModalContent = ({
  onConfirm,
  onBack,
  assetFromIcon,
  assetFromLabel,
  assetToIcon,
  assetToLabel,
}: {
  onConfirm: () => void
  onBack: () => void
  confirmationModal: boolean
  assetFromIcon: React.ReactNode
  assetFromLabel: string
  assetToLabel: string
  assetToIcon: React.ReactNode
}) => {
  const strings = useStrings()
  return (
    <View>
      <ModalContentHeader
        assetFromIcon={assetFromIcon}
        assetFromLabel={assetFromLabel}
        assetToIcon={assetToIcon}
        assetToLabel={assetToLabel}
      />

      <Spacer height={10} />

      {/* TODO: add real values */}
      <ModalContentRow label={strings.listOrdersSheetAssetPrice} value="3 ADA" />

      <Spacer height={10} />

      {/* TODO: add real values */}
      <ModalContentRow label={strings.listOrdersSheetAssetAmount} value="3 USDA" />

      <Spacer height={10} />

      {/* TODO: add real values */}
      <ModalContentRow label={strings.listOrdersSheetTotalReturned} value="11 ADA" />

      <Spacer height={10} />

      {/* TODO: add real values */}
      <ModalContentRow label={strings.listOrdersSheetCancellationFee} value="0.17 ADA" />

      <ModalContentLink />

      <Spacer height={10} />

      <ModalContentButtons onConfirm={onConfirm} onBack={onBack} />
    </View>
  )
}

const ModalContentHeader = ({
  assetFromIcon,
  assetFromLabel,
  assetToIcon,
  assetToLabel,
}: {
  assetFromIcon: React.ReactNode
  assetFromLabel: string
  assetToIcon: React.ReactNode
  assetToLabel: string
}) => {
  const strings = useStrings()
  return (
    <>
      <Text style={styles.contentTitle}>{strings.listOrdersSheetContentTitle}</Text>

      <Spacer height={10} />

      <View style={styles.modalContentTitle}>
        <View style={styles.modalContentTitle}>
          {assetFromIcon}

          <Spacer width={2} />

          <Text>{assetFromLabel}</Text>
        </View>

        <Spacer width={5} />

        <Text>/</Text>

        <Spacer width={5} />

        <View style={styles.modalContentTitle}>
          {assetToIcon}

          <Spacer width={2} />

          <Text>{assetToLabel}</Text>
        </View>
      </View>
    </>
  )
}

const ModalContentRow = ({label, value}: {label: string; value: string}) => {
  return (
    <View style={styles.contentRow}>
      <Text style={styles.contentLabel}>{label}</Text>

      <Text style={styles.contentValue}>{value}</Text>
    </View>
  )
}

const ModalContentLink = () => {
  const strings = useStrings()
  return (
    // TODO: add real link
    <TouchableOpacity onPress={() => Linking.openURL('https://google.com')} style={styles.link}>
      <Text style={styles.linkText}>{strings.listOrdersSheetLink}</Text>
    </TouchableOpacity>
  )
}

const ModalContentButtons = ({onBack, onConfirm}: {onBack: () => void; onConfirm: () => void}) => {
  const strings = useStrings()
  return (
    <View style={styles.buttons}>
      <Button
        title={strings.listOrdersSheetBack}
        style={{backgroundColor: 'transparent'}}
        onPress={onBack}
        block
        withoutBackground
        outlineShelley
        shelleyTheme
      />

      <Spacer width={20} />

      <Button title={strings.listOrdersSheetConfirm} onPress={onConfirm} style={{backgroundColor: '#FF1351'}} block />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: 10,
  },
  flex: {
    flex: 1,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentTitle: {
    color: '#242838',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  contentLabel: {
    color: '#6B7384',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  contentValue: {
    color: '#000',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  modalText: {
    paddingHorizontal: 70,
    textAlign: 'center',
    paddingBottom: 8,
  },
  modalContentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: '#4B6DDE',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txLink: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txLinkText: {
    color: '#4B6DDE',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  liquidityPool: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liquidityPoolLink: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liquidityPoolText: {
    color: '#4B6DDE',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
})
