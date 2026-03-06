import * as types from '../actions/actionTypes'

export default function(state={}, action) {
    switch(action.type) {
        case types.FETCHING_RECORD: {
						const {field, value} = action.payload
            let newFetch = Object.assign({}, state)
						newFetch[field] = value
            return newFetch
        }
        default:
            return state
    }
}

export const selectFetchingRecord = (state) => state
