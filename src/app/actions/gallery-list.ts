import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getGalleryList = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'galleryList', value: true } })
        return fetch(`${apiHost}ebi/galleryList/${personId}`, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'galleryList', value: false } })
						dispatch({ type: types.GALLEY_LIST_INIT, payload: response })
						localStorage.setItem("galleryList", JSON.stringify(response))
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'galleryList', value: false } }))
    }
}

export const addOrUpdateGalleryFile = (personId, galleryFile) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/galleryList/${personId}`, {
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
            body: JSON.stringify(galleryFile)
        })
    }
}


export const removeGalleryFileUpload = (personId, galleryFileId) => {
    return dispatch => {
        dispatch({ type: types.CAR_CONTACT_FILE_REMOVE, payload: galleryFileId })
        return fetch(`${apiHost}ebi/galleryList/removeFileUpload/${personId}/${galleryFileId}`, {
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
    }
}
