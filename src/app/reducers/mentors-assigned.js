import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.MENTORS_ASSIGNED_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectMentorsAssigned = (state) => state;
