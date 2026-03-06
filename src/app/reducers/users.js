import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.USERS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectUsers = (state, userRole) => (state && state.length > 0 && state.filter(m => m.userRole && userRole && m.userRole.toLowerCase() === userRole.toLowerCase())) || [];
