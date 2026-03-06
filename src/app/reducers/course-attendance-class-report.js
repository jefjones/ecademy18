import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_ATTENDANCE_CLASS_REPORT:
            return !action.payload || action.payload.length === 0 ? [] : action.payload; //This does need to blank out when choosing an assignment that doesn't have any records yet.

        default:
            return state;
    }
}

export const selectCourseAttendanceClassReport = (state) => state;
