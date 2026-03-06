import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_GRADEBOOKS_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectStudentGradebooks = (state) => state
