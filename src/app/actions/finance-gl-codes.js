import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getFinanceGLCodes = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("financeGLCodes");
				!!storage && dispatch({ type: types.FINANCE_GL_CODES_INIT, payload: JSON.parse(storage) });

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeGLCodes', value: true } });
        return fetch(`${apiHost}ebi/financeGLCodes/` + personId, {
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
			            dispatch({ type: types.FINANCE_GL_CODES_INIT, payload: response });
									localStorage.setItem("financeGLCodes", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeGLCodes', value: false } });
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeGLCodes', value: false } }));
    }
}

export const addOrUpdateFinanceGLCode = (personId, financeGLCode) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeGLCode/` + personId, {
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
            body: JSON.stringify(financeGLCode)
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
            dispatch({ type: types.FINANCE_GL_CODES_INIT, payload: response });
						localStorage.setItem("financeGLCodes", JSON.stringify(response));
        })
    }
}

export const removeFinanceGLCode = (personId, financeGLCodeId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeGLCode/remove/` + personId + `/` + financeGLCodeId, {
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
            dispatch({ type: types.FINANCE_GL_CODES_INIT, payload: response });
						localStorage.setItem("financeGLCodes", JSON.stringify(response));
        })
    }
}
