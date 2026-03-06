import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.FINANCE_CREDIT_INIT:
            return action.payload

				case types.FINANCE_CREDIT_REMOVE: {
						let newState = Object.assign({}, state)
						const financeCreditTransactionId = action.payload
						newState && newState.length > 0 && newState.filter(m => m.financeCreditTransactionId !== financeCreditTransactionId)
						return newState
				}

        default:
            return state
    }
}

export const selectFinanceCredits = (state) => state
