import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId, studentPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/ratingBarReport/` + personId + `/` + studentPersonId, {
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
            dispatch({type: types.RATING_BAR_REPORT_INIT, payload: response});
        })
    }
}
