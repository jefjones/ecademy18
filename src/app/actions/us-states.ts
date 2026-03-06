import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = () => {
    return dispatch => {
				let storage = localStorage.getItem("usStates")
				storage && dispatch({ type: types.US_STATE_INIT, payload: JSON.parse(storage) })
				
        return fetch(`${apiHost}ebi/usStates`, {
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
			            dispatch({ type: types.US_STATE_INIT, payload: response })
									localStorage.setItem("usStates", JSON.stringify(response))
			        })
			        //.catch(error => { console.l og('request failed', error); });
    }
}
