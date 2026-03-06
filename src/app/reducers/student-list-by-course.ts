import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_STUDENT_LIST:
            return action.payload

        default:
            return state
    }
}

export const selectStudentListByCourse = (state) => state
