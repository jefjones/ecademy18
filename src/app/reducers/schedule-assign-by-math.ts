import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.SCHEDULE_ASSIGN_BY_MATH_INIT:
            return action.payload; //This does need to blank out when choosing an assignment that doesn't have any records yet.

        default:
            return state
    }
}

export const selectScheduleAssignByMath = (state) => state
