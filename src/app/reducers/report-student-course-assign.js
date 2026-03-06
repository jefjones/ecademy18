import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.REPORT_STUDENT_COURSE_ASSIGN_INIT:
            return action.payload;

        default:
            return state;
    }
}
export const selectReportStudentCourseAssign = (state) => state;
