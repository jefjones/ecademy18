import * as types from '../actions/actionTypes';

export default function(state = {}, action) {
    switch(action.type) {
        case types.LUNCH_REDUCED_APPLY_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectLunchReducedApply = (state) => state;
