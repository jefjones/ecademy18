import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.CLASS_PERIODS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectClassPeriods = (state) => state;
