import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (courseEntryId) => {
    return dispatch => {
				dispatch({ type: types.COURSE_WEIGHTED_SCORE_INIT, payload: [] });

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseWeightedScore', value: true } });
        return fetch(`${apiHost}ebi/courseWeightedScore/` + courseEntryId, {
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
            dispatch({ type: types.COURSE_WEIGHTED_SCORE_INIT, payload: response });
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseWeightedScore', value: false } });
        })
        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseWeightedScore', value: false } }));
    }
}

export const updateCourseWeightedScores = (personId, courseEntryId, weightedScores) => {
    return dispatch =>
      fetch(`${apiHost}ebi/courseWeightedScore/update/` + personId + `/` + courseEntryId, {
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
        body: JSON.stringify(weightedScores),
      })
			.then(response => {
					dispatch({ type: types.COURSE_WEIGHTED_SCORE_INIT, payload: response });
			})
      //.catch(error => { console.l og('request failed', error); });
}

export const clearCourseWeightedScores = () => {
    return dispatch => dispatch({ type: types.COURSE_WEIGHTED_SCORE_INIT, payload: [] });
}
