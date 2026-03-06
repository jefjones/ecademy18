import * as types  from '../actions/actionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case types.PAYMENT_PROCESS_RESPONSE:
      return action.payload

    default:
        return state
  }
}

export const selectPaymentProcessingResponse = (state) => state
