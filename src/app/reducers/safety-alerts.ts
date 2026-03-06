import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.SAFETY_ALERT_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectSafetyAlerts = (state) => state
