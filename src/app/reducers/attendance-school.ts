import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.ATTENDANCE_SCHOOL_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectAttendanceSchool = (state) => state
