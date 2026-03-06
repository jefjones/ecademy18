import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.REGISTRATIONS_LIST:
            return action.payload;

        default:
            return state;
    }
}

export const selectRegistrationsList = (state) => state;
