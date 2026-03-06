import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("interval");
				!!storage && dispatch({ type: types.SEMESTER_INTERVAL_INIT, payload: JSON.parse(storage) });
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'intervalsSettings', value: true } });

        return fetch(`${apiHost}ebi/intervals/` + personId, {
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
			            dispatch({ type: types.SEMESTER_INTERVAL_INIT, payload: response });
									localStorage.setItem("interval", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'intervalsSettings', value: false } });
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'intervalsSettings', value: false } }));
    }
}

export const addOrUpdateInterval = (personId, interval) => {
    return dispatch => {
        dispatch({ type: types.SEMESTER_INTERVAL_ADD_UPDATE, payload: interval });
        return fetch(`${apiHost}ebi/interval/` + personId, {
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
            body: JSON.stringify(interval)
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
            dispatch({ type: types.SEMESTER_INTERVAL_INIT, payload: response });
        })
    }
}

export const removeInterval = (personId, intervalId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/interval/remove/` + personId + `/` + intervalId, {
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
            dispatch({ type: types.SEMESTER_INTERVAL_INIT, payload: response });
        })
    }
}
