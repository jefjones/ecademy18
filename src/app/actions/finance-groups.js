import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getFinanceGroups = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("financeGroups");
				!!storage && dispatch({ type: types.FINANCE_GROUPS_INIT, payload: JSON.parse(storage) });

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeGroups', value: true } });
        return fetch(`${apiHost}ebi/financeGroups/` + personId, {
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
			            dispatch({ type: types.FINANCE_GROUPS_INIT, payload: response });
									localStorage.setItem("financeGroups", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeGroups', value: false } });
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeGroups', value: false } }));
    }
}

export const addOrUpdateFinanceGroup = (personId, financeGroup) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeGroup/` + personId, {
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
            body: JSON.stringify(financeGroup)
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
            dispatch({ type: types.FINANCE_GROUPS_INIT, payload: response });
						localStorage.setItem("financeGroups", JSON.stringify(response));
        })
    }
}

export const removeFinanceGroup = (personId, financeGroupId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeGroup/remove/` + personId + `/` + financeGroupId, {
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
            dispatch({ type: types.FINANCE_GROUPS_INIT, payload: response });
						localStorage.setItem("financeGroups", JSON.stringify(response));
        })
    }
}
