import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getRegSelfServiceCourseCount = (personId) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {regSelfServiceCourseCount: true} });
        return fetch(`${apiHost}ebi/regSelfServiceStatus/` + personId, {
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
                  dispatch({type: types.FETCHING_RECORD, payload: {regSelfServiceCourseCount: false} });
			            dispatch({ type: types.REG_SELF_SERVICE_COURSE_COUNT, payload: response });
			        })
    }
}
