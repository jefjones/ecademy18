import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_DOCUMENTS_INIT: {
            return action.payload;
        }

         default:
            return state;
    }
}

export const selectCourseDocuments = (state) => state;
