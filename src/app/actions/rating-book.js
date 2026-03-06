import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId, studentPersonId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'ratingBook', value: true } });
        return fetch(`${apiHost}ebi/ratingBook/` + personId + `/` + studentPersonId, {
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
            dispatch({type: types.RATING_BOOK_INIT, payload: response});
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'ratingBook', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'ratingBook', value: false } }));
    }
}

export const setRatingBook = (personId, studentPersonId, learnerOutcomeId, rating) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/ratingBook/set/` + personId + `/` + studentPersonId + `/` + learnerOutcomeId + `/` + rating, {
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
            dispatch({ type: types.RATING_BOOK_INIT, payload: response });
        })
    }
}
