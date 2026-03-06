import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getScheduleAssignByMath = (personId, scheduleAssignByMathId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/scheduleAssignByMath/` + personId + `/` + scheduleAssignByMathId, {
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
            dispatch({type: types.SCHEDULE_ASSIGN_BY_MATH_INIT, payload: response});
        })
    }
}

export const getScheduleMathNames = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'scheduleAssignByMath', value: true } });
        return fetch(`${apiHost}ebi/scheduleMathNames/` + personId, {
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
            dispatch({type: types.SCHEDULE_ASSIGN_MATH_NAMES_INIT, payload: response});
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'scheduleAssignByMath', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'scheduleAssignByMath', value: false } }));
    }
}

export const setScheduleAssignByMath = (personId, selectedCourses, scheduleAssignByMathId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/scheduleAssignByMath/` + personId, {
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
            body: JSON.stringify({scheduleAssignByMathId, selectedCourses})
        })
        .then(response => {
            dispatch(getScheduleAssignByMath(personId));
        })
    }
}

export const removeScheduleAssignByMath = (personId, scheduleAssignByMathId, scheduleAssignByMathCourseAssignId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/scheduleAssignByMath/remove/` + personId + `/` + scheduleAssignByMathId + `/` + scheduleAssignByMathCourseAssignId, {
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
            dispatch(getScheduleAssignByMath(personId));
        })
    }
}
