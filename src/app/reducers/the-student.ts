import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.THE_STUDENT_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectTheStudent = (state) => state
