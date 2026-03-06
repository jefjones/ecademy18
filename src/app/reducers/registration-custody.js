import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.REGISTRATION_CUSTODY_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectRegistrationCustodies = (state) => state;
