import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.QUESTION_TYPES_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectQuestionTypes = (state) => state
