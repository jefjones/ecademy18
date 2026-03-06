import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.ASSESSMENT_CORRECT_SAME_ALL_STUDENTS:
            return action.payload

        default:
            return state
    }
}

export const selectAssessmentCorrectSameAllStudents = (state) => state
