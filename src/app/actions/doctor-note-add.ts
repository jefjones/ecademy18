import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getDoctorNotes = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNotes', value: true } })
        return fetch(`${apiHost}ebi/doctorNotes/${personId}`, {
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
			            dispatch({type: types.DOCTOR_NOTES_INIT, payload: response})
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNotes', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNotes', value: false } }))
    }
}

// export const approveDoctorNotes = (personId, selectedDoctorNotes, declineOrApprove, note) => {
//     return dispatch => {
// 				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNotes', value: true } });
// 				dispatch({ type: types.DOCTOR_NOTE_UPDATE_APPROVE, payload: selectedDoctorNotes });
//         return fetch(`${apiHost}ebi/doctorNotes/review/${personId}`, {
// 			            method: 'post',
// 			            headers: {
// 			                'Accept': 'application/json',
// 			                'Content-Type': 'application/json',
// 			                'Access-Control-Allow-Credentials' : 'true',
// 			                "Access-Control-Allow-Origin": "*",
// 			                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
// 			                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
// 			                "Authorization": "Bearer " + localStorage.getItem("authToken"),
// 			            },
// 									body: JSON.stringify({
// 											selectedDoctorNotes,
// 											note,
// 											declineOrApprove,
// 									})
// 			        })
// 			        .then(response => {
// 			            if (response.status >= 200 && response.status < 300) {
// 			                return response.json();
// 			            } else {
// 			                const error = new Error(response.statusText);
// 			                error.response = response;
// 			                throw error;
// 			            }
// 			        })
// 			        .then(response => {
// 			            dispatch({type: types.DOCTOR_NOTES_INIT, payload: response});
// 									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNotes', value: false } });
// 			        })
// 							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNotes', value: false } }));
//     }
// }

export const addOrUpdateDoctorNote = (personId, doctorNote) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/doctorNote/` + personId, {
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
            body: JSON.stringify(doctorNote)
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

export const removeDoctorNote = (personId, doctorNoteId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/doctorNote/remove/${personId}/${doctorNoteId}`, {
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

export const removeDoctorNoteFileUpload = (personId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/doctorNote/removeFile/` + personId + `/` + fileUploadId, {
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
