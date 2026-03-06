import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getStandards = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("standards");
				!!storage && dispatch({ type: types.STANDARDS_INIT, payload: JSON.parse(storage) });
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'standards', value: true } });

        return fetch(`${apiHost}ebi/standards/` + personId, {
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
			            dispatch({ type: types.STANDARDS_INIT, payload: response });
									localStorage.setItem("standards", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'standards', value: false } });
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'standards', value: false } }));
    }
}

export const addOrUpdateInterval = (personId, standard) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/standard/` + personId, {
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
            body: JSON.stringify(standard)
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
            dispatch({ type: types.STANDARDS_INIT, payload: response });
        })
    }
}

export const removeInterval = (personId, standardSchoolId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/standard/remove/` + personId + `/` + standardSchoolId, {
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
            dispatch({ type: types.STANDARDS_INIT, payload: response });
        })
    }
}
