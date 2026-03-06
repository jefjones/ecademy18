import * as types from '../actions/actionTypes'

export default function(state = false, action) {
    switch(action.type) {
        case types.LOGGED_IN_SET:
            return action.payload
        default:
            return state
    }
}

export const selectLoggedIn = (state) => state
