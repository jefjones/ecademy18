import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getWorkEditReview = (personId, workId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {workEditReview: true} });
        return fetch(`${apiHost}ebi/work/editReview/${personId}/${workId}`, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {workEditReview: false} }); //This is being used in particular to keep the chapterText accurate between documents on the EditReviewView page.
            dispatch({ type: types.WORK_EDIT_REVIEW, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}
