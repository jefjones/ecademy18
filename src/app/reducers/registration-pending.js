import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.REGISTRATION_PENDING_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectRegistrationPending = (state) => state;
