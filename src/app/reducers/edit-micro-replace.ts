import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.EDIT_DOM_MICRO_REPLACE: {
            return action.payload
        }
        default:
            return state
    }
}

export const selectEditMicroReplace = (state) => state
