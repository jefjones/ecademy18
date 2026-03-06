import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_COURSE_ASSIGNS:
            return action.payload

        default:
            return state
    }
}

export const selectStudentCourseAssigns = (state) => state
