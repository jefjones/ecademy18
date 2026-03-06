import * as types from './actionTypes'
import {apiHost} from '../api_host'
import * as actionStudentSchedule from './student-schedule'

export const addLearnerCourseAssign = (personId, students, courses, runFunction=() => {}) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/learnerCourseAssigns/` + personId, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
            body: JSON.stringify({
              students,
              courses,
            }),
        })
				.then(() => dispatch(runFunction))
    }
}

export const toggleLearnerCourseAssignInterval = (personId, studentPersonId, courseScheduledId, intervalId) => {
    return dispatch => {
        dispatch({type: types.STUDENT_COURSE_ASSIGN_INTERVALID, payload: {studentPersonId, courseScheduledId, intervalId} })
        return fetch(`${apiHost}ebi/learnerCourseAssign/toggleInterval/${personId}/${studentPersonId}/${courseScheduledId}/${intervalId}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
        })
        .then(dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId)))
    }
}
