import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.CURRENT_ENROLLMENT_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectCurrentEnrollmentPreReq = (state) => state;
