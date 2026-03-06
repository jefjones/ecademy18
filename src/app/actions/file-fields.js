import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = () => {
    return dispatch => {
			let storage = localStorage.getItem("fileFields");
			!!storage && dispatch({ type: types.FILE_FIELDS_INIT, payload: JSON.parse(storage) });

			return fetch(`${apiHost}ebi/fileFields`, {
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
		            dispatch({ type: types.FILE_FIELDS_INIT, payload: response });
								localStorage.setItem("fileFields", JSON.stringify(response));
		        })
		        //.catch(error => { console.l og('request failed', error); });
    }
}

export const getPersonConfigFileFields = (personId) => {
    return dispatch => {
			dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentAddBulkConfirm', value: true } });
			return fetch(`${apiHost}ebi/studentAdd/personConfigFileFields/` + personId, {
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
		            dispatch({ type: types.PERSON_CONFIG_STUDENT_BULK_ENTRY, payload: response });
								dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentAddBulkConfirm', value: false } });
		        })
		        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentAddBulkConfirm', value: false } }));
    }
}

export const setPersonConfigFileFields = (personId, personConfigStudentBulkEntry) => {
    return dispatch => {
			return fetch(`${apiHost}ebi/studentAdd/personConfigFileFields/` + personId, {
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
								body: JSON.stringify(personConfigStudentBulkEntry),
		        })
    }
}

export const getStudentBulkEntryDetails = (personId) => {
    return dispatch => {
			return fetch(`${apiHost}ebi/studentAdd/studentBulkEntryDetails/` + personId, {
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
		            dispatch({ type: types.STUDENT_BULK_ENTRY_DETAILS, payload: response });
		        })
		        //.catch(error => { console.l og('request failed', error); });
    }
}
