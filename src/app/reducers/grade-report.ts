import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.GRADE_REPORT_INIT:
            return !action.payload && action.payload.length === 0 ? [] : action.payload

        case types.STUDENT_GRADE_FINAL_REMOVE:
            const {courseScheduledId, intervalId} = action.payload
            let newState = Object.assign([], state)
            let courseGrades = newState.courseGrades
            courseGrades = courseGrades && courseGrades.length > 0 && courseGrades.filter(m => !(m.courseScheduledId === courseScheduledId && m.intervalId === intervalId))
            newState.courseGrades = courseGrades
            return newState

        default:
            return state
    }
}

export const selectGradeReport = (state) => state
