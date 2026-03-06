import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getReportStudentRegistration = (personId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {reportStudentRegistration: true} })
        return fetch(`${apiHost}ebi/reportStudentRegistration/` + personId, {
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
			        .then(response => {
			            if (response.status >= 200 && response.status < 300) {
			                return response.json()
			            } else {
			                const error = new Error(response.statusText)
			                error.response = response
			                throw error
			            }
			        })
			        .then(response => {
									dispatch({type: types.FETCHING_RECORD, payload: {reportStudentRegistration: "ready"} })
			            dispatch({type: types.REPORT_STUDENT_REGISTRATION_INIT, payload: response})
			        })
    }
}

export const getReportCourseSeatStatus = (personId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {reportCourseSeatStatus: true} })
        return fetch(`${apiHost}ebi/reportCourseSeatStatus/` + personId, {
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
			        .then(response => {
			            if (response.status >= 200 && response.status < 300) {
			                return response.json()
			            } else {
			                const error = new Error(response.statusText)
			                error.response = response
			                throw error
			            }
			        })
			        .then(response => {
									dispatch({type: types.FETCHING_RECORD, payload: {reportCourseSeatStatus: "ready"} })
			            dispatch({type: types.REPORT_COURSE_SEAT_STATUS_INIT, payload: response})
			        })
    }
}

export const getReportStudentCourseAssign = (personId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {reportStudentCourseAssign: true} })
        return fetch(`${apiHost}ebi/reportStudentCourseAssign/` + personId, {
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
			        .then(response => {
			            if (response.status >= 200 && response.status < 300) {
			                return response.json()
			            } else {
			                const error = new Error(response.statusText)
			                error.response = response
			                throw error
			            }
			        })
			        .then(response => {
									dispatch({type: types.FETCHING_RECORD, payload: {reportStudentCourseAssign: "ready"} })
			            dispatch({type: types.REPORT_STUDENT_COURSE_ASSIGN_INIT, payload: response})
			        })
    }
}
