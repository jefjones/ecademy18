import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const recommendations = (state = [], action) => {
    switch(action.type) {
        case types.COURSE_RECOMMENDATIONS_INIT:
            return action.payload

        default:
            return state
    }
}

const reportRecommendCourseName = (state = [], action) => {
    switch(action.type) {
        case types.COURSE_RECOMMENDATIONS_REPORT_COURSE_NAME:
            return action.payload

        default:
            return state
    }
}

const reportRecommendByTeacher = (state = [], action) => {
    switch(action.type) {
        case types.COURSE_RECOMMENDATIONS_REPORT_BY_TEACHER:
            return action.payload

        default:
            return state
    }
}

const reportRecommendByStudent = (state = [], action) => {
    switch(action.type) {
        case types.COURSE_RECOMMENDATIONS_REPORT_BY_STUDENT:
            return action.payload

        default:
            return state
    }
}

export default combineReducers({recommendations, reportRecommendCourseName, reportRecommendByTeacher, reportRecommendByStudent})

export const selectCourseRecommendations = (state) => state.recommendations
export const selectReportRecommendCourseName = (state) => state.reportRecommendCourseName
export const selectReportRecommendByTeacher = (state) => state.reportRecommendByTeacher
export const selectReportRecommendByStudent = (state) => state.reportRecommendByStudent
