import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_SIGNUP_ALERTS_INIT:
            return action.payload

				case types.COURSE_SIGNUP_ALERT_ADD_OR_REMOVE: {
						const alert = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.filter(m => m.courseScheduledId !== alert.courseScheduledId)
						newState = newState && newState.length > 0 ? newState.concat(alert) : [alert]
						return newState
				}

				case types.COURSE_SIGNUP_ALERT_REMOVE: {
						const courseScheduledId = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.filter(m => m.courseScheduledId !== courseScheduledId)
            return newState
				}

        default:
            return state
    }
}

export const selectAlerts = (state) => state
