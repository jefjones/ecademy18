import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSES_ASSIGNED_TO_ME:
            return !action.payload && action.payload.length === 0 ? [] : action.payload

        default:
            return state
    }
}

export const selectCoursesAssignedToMe = (state) => state
