import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_WEIGHTED_SCORE_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectCourseWeightedScore = (state) => state
