import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'
import {apiHost} from '../api_host'

export const init = (personId, personType) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentClipboard', value: true } })
        return fetch(`${apiHost}ebi/userPersonClipboard/` + personId + `/` + personType, {
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
            dispatch({ type: types.USER_PERSON_CLIPBOARD_INIT, payload: response })
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentClipboard', value: false } })
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentClipboard', value: false } }))
    }
}

export const resetUserPersonClipboard = (personId, userPersonClipboard, sendTo='') => {
    return dispatch => {
				//localStorage.setItem("userPersonClipboard", JSON.stringify(userPersonClipboard));

				dispatch({ type: types.USER_PERSON_CLIPBOARD_UPDATE, payload: userPersonClipboard })
	      fetch(`${apiHost}ebi/userPersonClipboard/reset/` + personId, {
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
	        body: JSON.stringify(userPersonClipboard),
	      })
				.then(() => {
						//dispatch(init(personId, userPersonClipboard.personType)) //don't do this since after changing the clipboard above, this will come second and replace what was in the database instead.
						if (sendTo) {
								sendTo.indexOf('/') > -1 ?  navigate(sendTo) : navigate('/' + sendTo)
						}
				})
		}
}

export const addUserPersonClipboard = (personId, userPersonClipboard) => {
    return dispatch => {
				dispatch({ type: types.USER_PERSON_CLIPBOARD_ADD, payload: userPersonClipboard })
	      fetch(`${apiHost}ebi/userPersonClipboard/add/` + personId, {
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
		        body: JSON.stringify(userPersonClipboard),
	      })
				.then(() => dispatch(init(personId, userPersonClipboard.personType)))
		}
}

export const removeAllUserPersonClipboard = (personId, personType, runFunction=() => {}) => {
    return dispatch => {
				dispatch({ type: types.USER_PERSON_CLIPBOARD_UPDATE, payload: {} })
	      fetch(`${apiHost}ebi/userPersonClipboard/removeAll/` + personId, {
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
	      })
				.then(() => dispatch(runFunction))
		}
}

export const removeStudentUserPersonClipboard = (personId, chosenPersonId, personType) => {
    return dispatch => {
				dispatch({ type: types.USER_PERSON_CLIPBOARD_REMOVE, payload: chosenPersonId })
	      fetch(`${apiHost}ebi/userPersonClipboard/removePerson/` + personId + `/` + chosenPersonId, {
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
	      })
				.then(() => dispatch(init(personId, personType)))
		}
}
