import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.DOCTORS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectDoctors = (state) => state;
