import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.MY_FREQUENT_PLACES_INIT:
            return action.payload

				case types.MY_FREQUENT_PLACES_REMOVE: {
						const myFrequentPlaceId = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.filter(m => m.myFrequentPlaceId !== myFrequentPlaceId)
						return newState
				}

				case types.MY_FREQUENT_PLACES_ADD: {
						const {pageName, path} = action.payload
						let newState = Object.assign([], state)
            let exists = newState && newState.length > 0 && newState.filter(m => m.pageName === pageName)[0]
            if (exists && exists.pageName) {
                newState = newState.filter(m => m.pageName !== pageName)
            } else {
    						let option = {
    								pageName,
    								path
    						}
    						newState = newState && newState.length > 0 ? newState.concat(option) : [option]
            }
						return newState
				}

				case types.MY_FREQUENT_PLACES_TOGGLE_HOME: {
						const {path, isHomePage} = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.map(m => {
								if (m.path === path) {
										m.isHomePage = isHomePage
								}
								return m
						})
						return newState
				}

        default:
            return state
    }
}

export const selectMyFrequentPlaces = (state) => state
