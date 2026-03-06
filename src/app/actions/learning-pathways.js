import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("learningPathways");
				storage && dispatch({ type: types.LEARNING_PATHWAYS_INIT, payload: JSON.parse(storage) });

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'learningPathwaySettings', value: true } });
        return fetch(`${apiHost}ebi/learningPathways/` + personId, {
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
			            dispatch({ type: types.LEARNING_PATHWAYS_INIT, payload: response });
									localStorage.setItem("learningPathways", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'learningPathwaySettings', value: false } });
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'learningPathwaySettings', value: false } }));
    }
}

export const addOrUpdateLearningPathway = (personId, learningPathway) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/learningPathway/` + personId, {
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
            body: JSON.stringify(learningPathway)
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
            dispatch({ type: types.LEARNING_PATHWAYS_INIT, payload: response });
        })
    }
}

export const removeLearningPathway = (personId, learningPathwayId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/learningPathway/remove/` + personId + `/` + learningPathwayId, {
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
            dispatch({ type: types.LEARNING_PATHWAYS_INIT, payload: response });
        })
    }
}
