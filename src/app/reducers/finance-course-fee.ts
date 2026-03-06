import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.FINANCE_COURSE_FEE_INIT:
            return action.payload

				case types.FINANCE_COURSE_FEE_REMOVE: {
						let newState = Object.assign([], state)
						const financeCourseFeeId = action.payload
						newState = newState && newState.length > 0 && newState.filter(m => m.financeCourseFeeId !== financeCourseFeeId)
						return newState
				}

        default:
            return state
    }
}

export const selectFinanceCourseFees = (state) => state
