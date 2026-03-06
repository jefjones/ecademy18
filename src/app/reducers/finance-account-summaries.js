import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.FINANCE_ACCOUNT_SUMMARIES_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectFinanceAccountSummaries = (state) => state;
