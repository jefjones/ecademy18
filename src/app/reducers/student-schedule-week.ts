import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_SCHEDULE_WEEK_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectStudentScheduleWeek = (state) => state
