import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.LUNCH_MENU_OPTIONS_INIT: {
            return action.payload
        }

        default:
            return state
    }
}

export const selectLunchMenuOptions = (state) => {
		return state && state.length > 0 && state.map(m => ({
				...m,
				id: m.lunchMenuOptionId,
				label: m.name,
		}))
}
