import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ACCESS_ROLES:
            return action.payload;

        default:
            return state;
    }
}

 export const selectAccessRoles = (state) => state;
