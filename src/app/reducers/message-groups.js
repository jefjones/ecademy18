import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.MESSAGE_GROUPS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectMessageGroups = (state) => state;
