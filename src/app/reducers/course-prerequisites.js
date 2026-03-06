import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_PREREQUISITES:
            return action.payload;

        default:
            return state;
    }
}

export const selectCoursePrerequisites = (state) => state;
