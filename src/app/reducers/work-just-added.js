import * as types from '../actions/actionTypes';

export default function(state={}, action) {
    switch(action.type) {
        case types.WORK_JUST_ADDED_SET:
            return action.payload;
        default:
            return state;
    }
}

export const selectWorkJustAdded = (state) => state;
