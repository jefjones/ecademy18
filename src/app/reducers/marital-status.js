import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.MARITAL_STATUS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectMaritalStati = (state) => state;
