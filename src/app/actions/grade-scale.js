import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("gradeScale");
				!!storage && dispatch({ type: types.GRADE_SCALE_INIT, payload: JSON.parse(storage) });

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradeScaleSettings', value: true } });
        return fetch(`${apiHost}ebi/gradeScale/` + personId, {
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
			            dispatch({ type: types.GRADE_SCALE_INIT, payload: response });
									localStorage.setItem("gradeScale", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradeScaleSettings', value: false } });
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradeScaleSettings', value: false } }));
    }
}

export const addOrUpdateGradeScaleDetail = (personId, gradeScaleDetail) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeScale/addOrUpdateDetail/` + personId, {
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
            body: JSON.stringify(gradeScaleDetail)
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
            dispatch({ type: types.GRADE_SCALE_INIT, payload: response });
        })
    }
}

export const removeGradeScaleDetail = (personId, gradeScaleDetailId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeScale/removeDetail/` + personId + `/` + gradeScaleDetailId, {
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
            dispatch({ type: types.GRADE_SCALE_INIT, payload: response });
        })
    }
}

export const removeGradeScaleTable = (personId, gradeScaleTableId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeScale/removeTable/` + personId + `/` + gradeScaleTableId, {
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
            dispatch({ type: types.GRADE_SCALE_INIT, payload: response });
        })
    }
}

export const addNewGradeScaleName = (personId, newGradeScaleName) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeScale/newGradeScaleName/` + personId + `/` + encodeURIComponent(newGradeScaleName), {
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
            dispatch({ type: types.GRADE_SCALE_INIT, payload: response });
        })
    }
}
