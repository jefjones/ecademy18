import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getAssessment = (personId, assessmentId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessment/${personId}/${assessmentId}`, {
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
            dispatch({type: types.ASSESSMENT_INIT, payload: response });
        })
    }
}

export const updateAssessmentTotalPoints = (personId, assessmentId, subTotalPoints) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentEntry/updatePoints/` + personId + `/` + assessmentId + `/` + subTotalPoints, {
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

export const updateAssessmentSettings = (personId, assessmentId, field, value) => {
		value = value || value === '0' || value === 0 ? value : 'EMPTY';
    return dispatch => {
				dispatch({type: types.ASSESSMENT_SETTING, payload: {assessmentId, field, value} });
        return fetch(`${apiHost}ebi/assessmentEntry/updateSetting/${personId}/${assessmentId}/${field}/${value}`, {
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

export const removeAssessment = (personId, assessmentId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessment/remove/` + personId + `/` + assessmentId, {
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

export const togglePublishedAssessment = (personId, assessmentId) => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_PUBLISH_TOGGLE, payload: assessmentId });
        return fetch(`${apiHost}ebi/assessment/publish/` + personId + `/` + assessmentId, {
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
