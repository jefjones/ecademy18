import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.WORK_EDIT_REVIEW:
            return action.payload

        default:
            return state
    }
}

export const selectWorkEditReview = (state) => state
