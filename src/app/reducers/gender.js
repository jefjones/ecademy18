import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.GENDER_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectGender = (state) => state;
