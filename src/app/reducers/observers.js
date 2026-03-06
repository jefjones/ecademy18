import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.OBSERVERS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectObservers = (state) => state;
