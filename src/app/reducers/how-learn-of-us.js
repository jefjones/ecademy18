import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.HOW_LEARN_OF_US_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectHowLearnOfUsList = (state) => state;
