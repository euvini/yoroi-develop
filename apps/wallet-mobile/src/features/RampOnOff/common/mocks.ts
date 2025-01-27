import {RampOnOffState} from './RampOnOffProvider'

export const mockExchangeStateDefault: RampOnOffState = {
  orderType: 'buy',
  amount: {
    isTouched: true,
    disabled: false,
    error: undefined,
    displayValue: '',
    value: 0,
  },
  canExchange: false,
} as const

export const mockExchangeStateWithNotEnoughError: RampOnOffState = {
  orderType: 'sell',
  amount: {
    isTouched: true,
    disabled: false,
    error: 'Not Enough Balance',
    displayValue: '3000',
    value: 3000 * 10 ** 6,
  },
  canExchange: false,
} as const
