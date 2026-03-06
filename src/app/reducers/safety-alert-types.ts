import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.SAFETY_ALERT_TYPES_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectSafetyAlertTypes = (state) => {
		return state && state.length > 0 && state.map(m => ({
				...m,
				id: m.safetyAlertTypeId,
				value: m.safetyAlertTypeId,
				label: m.name,
		}))
}
