import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.FACILITATORS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectUsers = (state) => state;
