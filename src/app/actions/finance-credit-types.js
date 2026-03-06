import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getFinanceCreditTypes = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("financeCreditTypes");
				!!storage && dispatch({ type: types.FINANCE_CREDIT_TYPES_INIT, payload: JSON.parse(storage) });

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCreditTypes', value: true } });
        return fetch(`${apiHost}ebi/financeCreditTypes/` + personId, {
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
			            dispatch({ type: types.FINANCE_CREDIT_TYPES_INIT, payload: response });
									localStorage.setItem("financeCreditTypes", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCreditTypes', value: false } });
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCreditTypes', value: false } }));
    }
}

export const addOrUpdateFinanceCreditType = (personId, financeCreditType) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeCreditType/` + personId, {
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
            body: JSON.stringify(financeCreditType)
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
            dispatch({ type: types.FINANCE_CREDIT_TYPES_INIT, payload: response });
						localStorage.setItem("financeCreditTypes", JSON.stringify(response));
        })
    }
}

export const removeFinanceCreditType = (personId, financeCreditTypeId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeCreditType/remove/` + personId + `/` + financeCreditTypeId, {
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
            dispatch({ type: types.FINANCE_CREDIT_TYPES_INIT, payload: response });
						localStorage.setItem("financeCreditTypes", JSON.stringify(response));
        })
    }
}
