import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.REPORT_STUDENT_REGISTRATION_INIT:
            return action.payload;

        default:
            return state;
    }
}
export const selectReportStudentRegistration = (state) => state;
