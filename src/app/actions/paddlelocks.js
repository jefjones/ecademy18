import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getPaddlelocks = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("paddLelocks");
				!!storage && dispatch({ type: types.PADDLELOCKS_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'paddleLockSettings', value: true } });
        return fetch(`${apiHost}ebi/paddLelocks/` + personId, {
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
			            dispatch({type: types.PADDLELOCKS_INIT, payload: response});
									localStorage.setItem("paddLelocks", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'paddleLockSettings', value: false } });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'paddleLockSettings', value: false } }));
    }
}

export const addOrUpdatePaddlelock = (personId, paddlelock) => {
    if (!paddlelock.paddlelockId) paddlelock.paddlelockId = '00000000-0000-0000-0000-000000000000';
    if (!paddlelock.companyId) paddlelock.companyId = '00000000-0000-0000-0000-000000000000';

    return dispatch => {
        return fetch(`${apiHost}ebi/paddlelock/` + personId, {
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
            body: JSON.stringify(paddlelock)
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
            dispatch({ type: types.PADDLELOCKS_INIT, payload: response });
        })
    }
}

export const removePaddlelock = (personId, paddlelockId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/paddlelock/remove/` + personId + `/` + paddlelockId, {
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
            dispatch({ type: types.PADDLELOCKS_INIT, payload: response });
        })
    }
}
