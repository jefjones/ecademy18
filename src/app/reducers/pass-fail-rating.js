import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.PASS_FAIL_RATING_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectPassFailRating = (state) => state;
