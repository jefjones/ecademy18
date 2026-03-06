import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.GRADE_LEVEL_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectGradeLevels = (state) => state
