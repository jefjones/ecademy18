import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.ASSESSMENT_INIT:
            return action.payload

				case types.ASSESSMENT_PUBLISH_TOGGLE: {
						let newState = Object.assign([], state)
						if (newState) newState.isPublished = !newState.isPublished
						return newState
				}

				case types.ASSESSMENT_SETTING: {
						let newState = Object.assign({}, state)
						const {field, value} = action.payload
						if (field) newState[field] = value === 'EMPTY' ? false : value
						return newState
				}

        default:
            return state
    }
}

export const selectAssessment = (state) => state
