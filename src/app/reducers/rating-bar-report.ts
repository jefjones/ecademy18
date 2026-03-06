import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.RATING_BAR_REPORT_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectRatingBarReport = (state) => state
