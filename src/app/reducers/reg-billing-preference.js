import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.PROXYNIZATION_TEMP_PASSWORD:
            return action.payload;

        default:
            return state;
    }
}

export const selectProxynizationTempPassword = (state) => state;
