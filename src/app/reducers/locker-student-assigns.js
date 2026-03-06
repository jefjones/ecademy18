import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.LOCKER_STUDENT_ASSIGN_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectLockerStudentAssigns = (state) => state;
