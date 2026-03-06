import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.BEHAVIOR_INCIDENT_RESPONSE_TYPES_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectBehaviorIncidentResponseTypes = (state) => state
