import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.GROUP_WORK_ASSIGN_ACCESS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectGroupWorkAssignAccess = (state) => state;
