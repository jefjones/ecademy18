import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.REPORT_COURSE_SEAT_STATUS_INIT:
            return action.payload

        default:
            return state
    }
}
export const selectReportCourseSeatStatus = (state) => state
