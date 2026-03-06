import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENTS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectStudents = (state) => state;
