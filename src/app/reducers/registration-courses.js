import * as types from '../actions/actionTypes';

export default function(state = {}, action) {
    switch(action.type) {
        case types.REGISTRATION_COURSES_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectRegistrationCourses = (state) => state;
