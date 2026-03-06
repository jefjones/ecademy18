import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.FINANCE_LOW_INCOME_WAIVERS_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectFinanceLowIncomeWaivers = (state) => state
