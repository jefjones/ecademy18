import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.FINANCE_TRANSFER_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectFinanceTransfers = (state) => state;
