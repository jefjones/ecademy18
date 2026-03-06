import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("contentTypes")
				!!storage && dispatch({ type: types.CONTENT_TYPES_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'contentTypeSettings', value: true } })
        return fetch(`${apiHost}ebi/contentTypes/` + personId, {
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
			            dispatch({ type: types.CONTENT_TYPES_INIT, payload: response })
									localStorage.setItem("contentTypes", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'contentTypeSettings', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'contentTypeSettings', value: false } }))
    }
}

export const addOrUpdateContentType = (personId, contentType) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/contentType/` + personId, {
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
            body: JSON.stringify(contentType)
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
            dispatch({ type: types.CONTENT_TYPES_INIT, payload: response })
        })
    }
}

export const removeContentType = (personId, contentTypeId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/contentType/remove/` + personId + `/` + contentTypeId, {
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
            dispatch({ type: types.CONTENT_TYPES_INIT, payload: response })
        })
    }
}

export const toggleBenchmarkTests = (personId, setOn) => {
		setOn = setOn ? 'true' : 'false'
    return dispatch => {
        return fetch(`${apiHost}ebi/contentType/toggleBenchmarkTests/${personId}/${setOn}`, {
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
            dispatch({ type: types.CONTENT_TYPES_INIT, payload: response })
        })
    }
}
