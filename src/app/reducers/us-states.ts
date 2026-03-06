import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.US_STATE_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectUSStates = (state) => state
