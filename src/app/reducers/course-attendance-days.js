import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_ATTENDANCE_DAYS_INIT:
            return !action.payload || action.payload.length === 0 ? [] : action.payload;

        default:
            return state;
    }
}

export const selectCourseAttendanceDays = (state) => state;
