import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.REGISTRATION_GUARDIAN_CONTACT:
            return action.payload

        default:
            return state
    }
}

export const selectRegGuardianContact = (state) => state
