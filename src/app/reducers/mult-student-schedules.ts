import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.MULT_STUDENT_SCHEDULES_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectMultStudentSchedules = (state) => state
