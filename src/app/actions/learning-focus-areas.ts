import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {

    return dispatch => {
				let storage = localStorage.getItem("learningFocusAreas")
				storage && dispatch({ type: types.LEARNING_FOCUS_AREAS_INIT, payload: JSON.parse(storage) })

        dispatch({type: types.FETCHING_RECORD, payload: {learningFocusAreas: true} })

        return fetch(`${apiHost}ebi/learningFocusAreas/` + personId, {
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
                return response.json()
            } else {
                const error = new Error(response.statusText)
                error.response = response
                throw error
            }
        })
        .then(response => {
            dispatch({ type: types.LEARNING_FOCUS_AREAS_INIT, payload: response })
            dispatch({type: types.FETCHING_RECORD, payload: {learningFocusAreas: false} })
						localStorage.setItem("learningFocusAreas", JSON.stringify(response))
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}
