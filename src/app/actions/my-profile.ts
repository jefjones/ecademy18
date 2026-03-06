import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getMyProfile = (personId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {myProfile: true} })
		    fetch(`${apiHost}ebi/myProfile/` + personId, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {myProfile: 'ready'} })
		        dispatch({ type: types.MY_PROFILE_INIT, payload: response })
   })
		    //.catch(error => { console.l og('request failed', error); });
		}
}

export const setMyProfile = (personId, field, value) => {
    return dispatch => {
				dispatch({ type: types.MY_PROFILE_UPDATE, payload: {field, value} })
		    fetch(`${apiHost}ebi/myProfile/${personId}`, {
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
		        body: JSON.stringify({personId, field, value}),
		    })
		}
}
