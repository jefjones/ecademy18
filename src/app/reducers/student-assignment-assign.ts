import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_ASSIGNMENT_ASSIGN:
            return action.payload

        default:
            return state
    }
}

export const selectStudentAssignmentAssign = (state) => state
