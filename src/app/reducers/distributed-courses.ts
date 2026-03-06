import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.DISTRIBUTED_COURSES_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectDistributedCourses = (state) => state
