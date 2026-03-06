import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.SCHEDULE_ASSIGN_MATH_NAMES_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectScheduleAssignMathNames = (state) => state;
