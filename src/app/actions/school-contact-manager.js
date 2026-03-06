import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getSchoolContacts = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("schoolContact");
				!!storage && dispatch({ type: types.SCHOOL_CONTACT_INIT, payload: JSON.parse(storage) })
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'schoolContactManager', value: true } });

        return fetch(`${apiHost}ebi/schoolContact/` + personId, {
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
			            dispatch({type: types.SCHOOL_CONTACT_INIT, payload: response});
									localStorage.setItem("schoolContact", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'schoolContactManager', value: false } });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'schoolContactManager', value: false } }));
    }
}

export const addOrUpdateSchoolContact = (personId, schoolContact) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/schoolContact/${personId}`, {
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
                schoolContactId: schoolContact.schoolContactId ? schoolContact.schoolContactId : '00000000-0000-0000-0000-000000000000',
                schoolName: schoolContact.schoolName,
                address: schoolContact.address,
                contactName: schoolContact.contactName,
                role: schoolContact.role,
                emailAddress: schoolContact.emailAddress,
                phoneNumber: schoolContact.phoneNumber,
                returnDate: schoolContact.returnDate,
                note: schoolContact.note,
                entryPersonId: schoolContact.entryPersonId,
                entryDate: schoolContact.entryDate,
                usStateId: schoolContact.usStateId,
                latitude: schoolContact.latitude,
                longitude: schoolContact.longitude,
            })
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
            dispatch({ type: types.SCHOOL_CONTACT_INIT, payload: response });
        })
    }
}

export const removeSchoolContact = (personId, schoolContactId) => {
    return dispatch => {
        dispatch({ type: types.SCHOOL_CONTACT_REMOVE, payload: schoolContactId });
        return fetch(`${apiHost}ebi/schoolContact/remove/` + personId + `/` + schoolContactId, {
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
    }
}

export const removeSchoolContactFileUpload = (personId, fileUploadId) => {
    return dispatch => {
        dispatch({ type: types.SCHOOL_CONTACT_FILE_REMOVE, payload: fileUploadId });
        return fetch(`${apiHost}ebi/schoolContact/removeFileUpload/` + personId + `/` + fileUploadId, {
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
