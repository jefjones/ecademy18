import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getLunchReducedApply = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchReducedApply/` + personId, {
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
  			          dispatch({type: types.LUNCH_REDUCED_APPLY_INIT, payload: response});
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lunchReducedApply', value: false } });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lunchReducedApply', value: false } }));
    }
}

export const addOrUpdateLunchReducedApplyTable = (personId, lunchReducedApply) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchReducedApply/main/` + personId, {
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
            body: JSON.stringify(lunchReducedApply)
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
            dispatch({ type: types.LUNCH_REDUCED_APPLY_INIT, payload: response });
        })
    }
}

export const removeLunchReducedApply = (personId, lunchReducedApplyTableId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchReducedApply/remove/` + personId + `/` + lunchReducedApplyTableId, {
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
            dispatch({ type: types.LUNCH_REDUCED_APPLY_INIT, payload: response });
        })
    }
}

export const addOrUpdateLunchReducedApplyStudents = (personId, lunchReducedApplyTableId, lunchReducedStudents) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchReducedApply/students/` + personId + `/` + lunchReducedApplyTableId, {
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
            body: JSON.stringify(lunchReducedStudents),
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
            dispatch({ type: types.LUNCH_REDUCED_APPLY_INIT, payload: response });
        })
    }
}

export const addOrUpdateLunchReducedApplyAdults = (personId, lunchReducedApplyTableId, lunchReducedAdults) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchReducedApply/adults/` + personId + `/` + lunchReducedApplyTableId, {
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
            body: JSON.stringify(lunchReducedAdults),
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
            dispatch({ type: types.LUNCH_REDUCED_APPLY_INIT, payload: response });
        })
    }
}
