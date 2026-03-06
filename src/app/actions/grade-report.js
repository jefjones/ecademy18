import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {guidEmpty} from '../utils/guidValidate.js';

export const getGradeReport = (personId, studentPersonId, schoolYearId=9) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {gradeReport: true} });
				dispatch({ type: types.GRADE_REPORT_INIT, payload: [] });
        return (!studentPersonId || studentPersonId === guidEmpty)
						? null
						: fetch(`${apiHost}ebi/gradeReport/` + personId + `/` + studentPersonId + `/` + schoolYearId, {
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
									dispatch({type: types.FETCHING_RECORD, payload: {gradeReport: false} });
									dispatch({ type: types.GRADE_REPORT_INIT, payload: response });
			        })
    }
}

export const removeStudentGradeFinal = (personId, studentPersonId, courseScheduledId, intervalId) => {
    return dispatch => {
        dispatch({ type: types.STUDENT_GRADE_FINAL_REMOVE, payload: {courseScheduledId, intervalId} });
        return fetch(`${apiHost}ebi/gradeReport/removeStudentGradeFinal/${personId}/${studentPersonId}/${courseScheduledId}/${intervalId}`, {
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
