import * as types from '../actions/actionTypes';

export default function(state = {}, action) {
    switch(action.type) {
        case types.REGISTRATION_STUDENT:
            return action.payload;

        default:
            return state;
    }
}

export const selectRegStudent = (state) => state;
