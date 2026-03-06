import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getCarContacts = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("carContact")
				!!storage && dispatch({ type: types.CAR_CONTACT_INIT, payload: JSON.parse(storage) })
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'carContactManager', value: true } })

        return fetch(`${apiHost}ebi/carContact/` + personId, {
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
			            dispatch({type: types.CAR_CONTACT_INIT, payload: response})
									localStorage.setItem("carContact", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'carContactManager', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'carContactManager', value: false } }))
    }
}

export const addOrUpdateCarContact = (personId, carContact) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carContact/${personId}`, {
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
            body: JSON.stringify({
                carContactId: carContact.carContactId ? carContact.carContactId : '00000000-0000-0000-0000-000000000000',
                ownerName: carContact.ownerName,
                address: carContact.address,
                contactName: carContact.contactName,
                role: carContact.role,
                emailAddress: carContact.emailAddress,
                phoneNumber: carContact.phoneNumber,
                returnDate: carContact.returnDate,
                note: carContact.note,
                entryPersonId: carContact.entryPersonId,
                entryDate: carContact.entryDate,
                usStateId: carContact.usStateId,
                latitude: carContact.latitude,
                longitude: carContact.longitude,
            })
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
            dispatch({ type: types.CAR_CONTACT_INIT, payload: response })
        })
    }
}

export const removeCarContact = (personId, carContactId) => {
    return dispatch => {
        dispatch({ type: types.CAR_CONTACT_REMOVE, payload: carContactId })
        return fetch(`${apiHost}ebi/carContact/remove/` + personId + `/` + carContactId, {
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
    }
}

export const removeCarContactFileUpload = (personId, fileUploadId) => {
    return dispatch => {
        dispatch({ type: types.CAR_CONTACT_FILE_REMOVE, payload: fileUploadId })
        return fetch(`${apiHost}ebi/carContact/removeFileUpload/` + personId + `/` + fileUploadId, {
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
