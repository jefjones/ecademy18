import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.STANDARDS_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectStandards = (state) => state
