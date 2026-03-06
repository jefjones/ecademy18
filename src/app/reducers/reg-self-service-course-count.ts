import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.REG_SELF_SERVICE_COURSE_COUNT:
            return action.payload

        default:
            return state
    }
}

export const selectRegSelfServiceCourseCount = (state) => state
