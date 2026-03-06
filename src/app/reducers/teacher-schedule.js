import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.TEACHER_SCHEDULE_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectTeacherSchedule = (state) => state;
