import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.LOCKERS_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectLockers = (state) => {
		return state && state.length > 0 && state.map(m => ({
				...m,
				id: m.lockerId,
				label: m.name,
		})) 
}
