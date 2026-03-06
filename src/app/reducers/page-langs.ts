import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
				case types.PAGE_LANGS: {
						let newState = Object.assign([], state)
						const {page, langCode, pageLangs} = action.payload
						newState = newState && newState.length > 0 && newState.filter(m => !(m.page === page && m.langCode === langCode))
						newState = newState && newState.length > 0 ? newState.concat(pageLangs) : [pageLangs]
            return newState
        }

        default:
           return state
    }
}

export const selectPageLangs = (state) => state
