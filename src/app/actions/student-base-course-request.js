import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getStudentBaseCourseRequests = (personId, studentPersonId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentBaseCourseRequests', value: true } });
        return fetch(`${apiHost}ebi/studentBaseCourseRequests/` + personId + `/` + studentPersonId, {
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
			                return response.json();
			            } else {
			                const error = new Error(response.statusText);
			                error.response = response;
			                throw error;
			            }
			        })
			        .then(response => {
			            dispatch({type: types.STUDENT_BASE_COURSE_REQUEST_INIT, payload: response});
									localStorage.setItem("studentBaseCourseRequests", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentBaseCourseRequests', value: false } });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentBaseCourseRequests', value: false } }));
    }
}

export const addStudentBaseCourseRequest = (studentPersonId, studentBaseCourseRequest, runFunction=()=>{}) => {
    return dispatch => {
				dispatch({ type: types.STUDENT_BASE_COURSE_REQUEST_ADD, payload: studentBaseCourseRequest })
        return fetch(`${apiHost}ebi/studentBaseCourseRequest/` + studentPersonId, {
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
									body: JSON.stringify(studentBaseCourseRequest)
			        })
			        .then(response => {
			            if (response.status >= 200 && response.status < 300) {
			                return response.json();
			            } else {
			                const error = new Error(response.statusText);
			                error.response = response;
			                throw error;
			            }
			        })
			        .then(response => {
									dispatch(runFunction)
			            dispatch({type: types.STUDENT_BASE_COURSE_REQUEST_INIT, payload: response});
									localStorage.setItem("studentBaseCourseRequests", JSON.stringify(response));
			        })
    }
}

export const setFinalizeStudentBaseCourseRequests = (personId, studentPersonId) => {
    return dispatch => {
				dispatch({ type: types.STUDENT_BASE_COURSE_REQUEST_FINALIZE, payload: null })
        return fetch(`${apiHost}ebi/studentBaseCourseRequests/finalize/` + personId + `/` + studentPersonId, {
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
    }
}

export const removeStudentBaseCourseRequest = (personId, studentBaseCourseRequestId, runFunction=()=>{}) => {
    return dispatch => {
				dispatch({ type: types.STUDENT_BASE_COURSE_REQUEST_REMOVE, payload: studentBaseCourseRequestId })
        return fetch(`${apiHost}ebi/studentBaseCourseRequest/remove/` + personId + `/` + studentBaseCourseRequestId, {
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
				.then(() => dispatch(runFunction))
    }
}



export const declineCourseAssignByAdmin = (personId, courseAssignByAdminId, studentPersonId) => {
    return dispatch => {
				dispatch({ type: types.COURSE_ASSIGN_BY_ADMIN_DECLINE, payload: {courseAssignByAdminId, studentPersonId} })
        return fetch(`${apiHost}ebi/courseAssignByAdmin/decline/` + personId + `/` + courseAssignByAdminId + `/` + studentPersonId, {
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
    }
}
