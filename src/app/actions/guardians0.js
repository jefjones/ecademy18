import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId) => {
    return dispatch => {
			  let storage = localStorage.getItem("guardians")
			  storage && dispatch({ type: types.GUARDIANS_INIT, payload: JSON.parse(storage) });

        dispatch({type: types.FETCHING_RECORD, payload: {guardians: true} });

        return fetch(`${apiHost}ebi/guardians/` + personId, {
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
            dispatch({ type: types.GUARDIANS_INIT, payload: response });
            dispatch({type: types.FETCHING_RECORD, payload: {guarians: false} });
						localStorage.setItem("guardians", JSON.stringify(response));
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}
