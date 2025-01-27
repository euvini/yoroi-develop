import {Chain, Resolver} from '@yoroi/types'
import {
  TargetAction,
  TransferAction,
  TransferActionType,
  TransferState,
  combinedReducers,
  defaultTransferState,
} from './state'

describe('State Actions', () => {
  it('unknown', () => {
    const action = {type: 'UNKNOWN'} as any
    const state = combinedReducers(defaultTransferState, action)
    expect(state).toEqual(defaultTransferState)
  })

  describe('Transfer Actions', () => {
    describe('UnsignedTxChanged', () => {
      it('set', () => {
        const action: TransferAction = {
          type: TransferActionType.UnsignedTxChanged,
          unsignedTx,
        }
        const state = combinedReducers(defaultTransferState, action)
        expect(state).toEqual({...defaultTransferState, unsignedTx})
      })

      it('reset', () => {
        const action: TransferAction = {
          type: TransferActionType.UnsignedTxChanged,
          unsignedTx: undefined,
        }
        const state = combinedReducers(
          {...defaultTransferState, unsignedTx},
          action,
        )
        expect(state).toEqual(defaultTransferState)
      })
    })

    describe('MemoChanged', () => {
      it('set', () => {
        const action: TransferAction = {
          type: TransferActionType.MemoChanged,
          memo: 'akakakak',
        }
        const state = combinedReducers(defaultTransferState, action)
        expect(state).toEqual({...defaultTransferState, memo: 'akakakak'})
      })
    })

    describe('TokenSelectedChanged', () => {
      it('set', () => {
        const action: TransferAction = {
          type: TransferActionType.TokenSelectedChanged,
          tokenId: 'akakakak',
        }
        const state = combinedReducers(defaultTransferState, action)
        expect(state).toEqual({
          ...defaultTransferState,
          selectedTokenId: 'akakakak',
        })
      })
    })

    describe('Reset', () => {
      const mockedState: TransferState = {
        ...defaultTransferState,
        selectedTokenId: 'token-id',
        unsignedTx,
        memo: 'asdfgh',
      }

      it('set', () => {
        const action: TransferAction = {
          type: TransferActionType.Reset,
        }
        const state = combinedReducers(mockedState, action)
        expect(state).toEqual(defaultTransferState)
      })
    })
  })

  describe('Target Actions', () => {
    describe('ReceiverResolveChanged', () => {
      const prevState: TransferState = {
        selectedTargetIndex: 0,
        selectedTokenId: '',
        unsignedTx: undefined,
        memo: '',
        targets: [
          {
            receiver: {
              resolve: '',
              as: 'address',
              selectedNameServer: undefined,
              addressRecords: undefined,
            },
            entry: {
              address: '',
              amounts: {},
            },
          },
          {
            receiver: {
              resolve: 'address2',
              as: 'address',
              addressRecords: undefined,
              selectedNameServer: undefined,
            },
            entry: {
              address: 'address2',
              amounts: {},
            },
          },
        ],
      }

      it('set address', () => {
        const action: TargetAction = {
          type: TransferActionType.ReceiverResolveChanged,
          resolve: 'address',
        }

        const state = combinedReducers(prevState, action)
        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: 'address',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })

      it('set domain', () => {
        const action: TargetAction = {
          type: TransferActionType.ReceiverResolveChanged,
          resolve: 'test.ada',
        }

        const state = combinedReducers(prevState, action)
        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: 'test.ada',
                as: 'domain',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })
    })

    describe('AddressRecordsFetched', () => {
      const prevState: TransferState = {
        selectedTargetIndex: 0,
        selectedTokenId: '',
        unsignedTx: undefined,
        memo: '',
        targets: [
          {
            receiver: {
              resolve: '',
              as: 'address',
              selectedNameServer: undefined,
              addressRecords: undefined,
            },
            entry: {
              address: '',
              amounts: {},
            },
          },
          {
            receiver: {
              resolve: 'address2',
              as: 'address',
              addressRecords: undefined,
              selectedNameServer: undefined,
            },
            entry: {
              address: 'address2',
              amounts: {},
            },
          },
        ],
      }

      it('set: one record', () => {
        const action: TargetAction = {
          type: TransferActionType.AddressRecordsFetched,
          addressRecords: {
            [Resolver.NameServer.Cns]:
              'addr1qxjkgj7t3nvzkhsy0pjhuty0a65x26p2tvsdk3wsjkq8mp8yqjptk3jgl32tllqxzawy48jly69hpkj5hak7f44dw80sqfylvs',
          },
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: 'cns',
                addressRecords: {
                  cns: 'addr1qxjkgj7t3nvzkhsy0pjhuty0a65x26p2tvsdk3wsjkq8mp8yqjptk3jgl32tllqxzawy48jly69hpkj5hak7f44dw80sqfylvs',
                },
              },
              entry: {
                address:
                  'addr1qxjkgj7t3nvzkhsy0pjhuty0a65x26p2tvsdk3wsjkq8mp8yqjptk3jgl32tllqxzawy48jly69hpkj5hak7f44dw80sqfylvs',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })

      it('set: multi record', () => {
        const action: TargetAction = {
          type: TransferActionType.AddressRecordsFetched,
          addressRecords: {
            [Resolver.NameServer.Cns]:
              'addr1qxjkgj7t3nvzkhsy0pjhuty0a65x26p2tvsdk3wsjkq8mp8yqjptk3jgl32tllqxzawy48jly69hpkj5hak7f44dw80sqfylvs',
            [Resolver.NameServer.Unstoppable]:
              'addr1qxjkgj7t3nvzkhsy0pjhuty0a65x26p2tvsdk3wsjkq8mp8yqjptk3jgl32tllqxzawy48jly69hpkj5hak7f44dw80sqfylvs',
          },
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: undefined,
                addressRecords: {
                  cns: 'addr1qxjkgj7t3nvzkhsy0pjhuty0a65x26p2tvsdk3wsjkq8mp8yqjptk3jgl32tllqxzawy48jly69hpkj5hak7f44dw80sqfylvs',
                  unstoppable:
                    'addr1qxjkgj7t3nvzkhsy0pjhuty0a65x26p2tvsdk3wsjkq8mp8yqjptk3jgl32tllqxzawy48jly69hpkj5hak7f44dw80sqfylvs',
                },
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })

      it('set: undefined', () => {
        const action: TargetAction = {
          type: TransferActionType.AddressRecordsFetched,
          addressRecords: undefined,
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: undefined,
                addressRecords: undefined,
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })

      it('set: bad record', () => {
        const action: TargetAction = {
          type: TransferActionType.AddressRecordsFetched,
          addressRecords: {
            [Resolver.NameServer.Cns]: undefined,
          },
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: 'cns',
                addressRecords: {
                  cns: undefined,
                },
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })
    })

    describe('NameServerSelectedChanged', () => {
      const prevState: TransferState = {
        selectedTargetIndex: 0,
        selectedTokenId: '',
        unsignedTx: undefined,
        memo: '',
        targets: [
          {
            receiver: {
              resolve: '',
              as: 'address',
              selectedNameServer: undefined,
              addressRecords: undefined,
            },
            entry: {
              address: '',
              amounts: {},
            },
          },
          {
            receiver: {
              resolve: 'address2',
              as: 'address',
              addressRecords: undefined,
              selectedNameServer: undefined,
            },
            entry: {
              address: 'address2',
              amounts: {},
            },
          },
        ],
      }
      it('set', () => {
        const action: TargetAction = {
          type: TransferActionType.NameServerSelectedChanged,
          nameServer: Resolver.NameServer.Cns,
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: 'cns',
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })

      it('set: undefined', () => {
        const action: TargetAction = {
          type: TransferActionType.NameServerSelectedChanged,
          nameServer: undefined,
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: undefined,
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })

      it('set: domain', () => {
        const action: TargetAction = {
          type: TransferActionType.NameServerSelectedChanged,
          nameServer: undefined,
        }

        const prevState_: TransferState = {
          selectedTargetIndex: 0,
          selectedTokenId: '',
          unsignedTx: undefined,
          memo: '',
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'domain',
                selectedNameServer: undefined,
                addressRecords: undefined,
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
          ],
        }

        const state = combinedReducers(prevState_, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: '',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'domain',
                selectedNameServer: undefined,
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
          ],
        })
      })
    })

    describe('AmountChanged', () => {
      it('set', () => {
        const action: TargetAction = {
          type: TransferActionType.AmountChanged,
          quantity: '12344',
        }

        const prevState: TransferState = {
          selectedTargetIndex: 0,
          selectedTokenId: 'fake-token-id',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: undefined,
                addressRecords: undefined,
              },
              entry: {
                address: '',
                amounts: {['fake-token-id']: '1'},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: 'fake-token-id',
          memo: '',
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
              },
              entry: {
                address: '',
                amounts: {
                  'fake-token-id': '12344',
                },
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })
    })

    describe('AmountRemoved', () => {
      it('set', () => {
        const action: TargetAction = {
          type: TransferActionType.AmountRemoved,
          tokenId: 'fake-token-id',
        }

        const prevState: TransferState = {
          selectedTargetIndex: 0,
          selectedTokenId: 'fake-token-id',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                selectedNameServer: undefined,
                addressRecords: undefined,
              },
              entry: {
                address: '',
                amounts: {['fake-token-id']: '1'},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        }

        const state = combinedReducers(prevState, action)

        expect(state).toEqual({
          selectedTargetIndex: 0,
          selectedTokenId: 'fake-token-id',
          memo: '',
          unsignedTx: undefined,
          targets: [
            {
              receiver: {
                resolve: '',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: '',
                amounts: {},
              },
            },
            {
              receiver: {
                resolve: 'address2',
                as: 'address',
                addressRecords: undefined,
                selectedNameServer: undefined,
              },
              entry: {
                address: 'address2',
                amounts: {},
              },
            },
          ],
        })
      })
    })
  })
})

const unsignedTx: Chain.Cardano.UnsignedTx & {mock: true} = {
  entries: [
    {
      address: 'address1',
      amounts: {'': '99999'},
    },
  ],
  fee: {'': '12345'},
  metadata: {},
  change: [{address: 'change_address', amounts: {'': '1'}}],
  staking: {
    registrations: [],
    deregistrations: [],
    delegations: [],
    withdrawals: [],
  },
  voting: {},
  unsignedTx: {} as any,
  mock: true,
  governance: false,
}
