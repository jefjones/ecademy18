import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getAbsenceUnexcused = (personId, isPendingApproval) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'absenceUnexcused', value: true } })
        return fetch(`${apiHost}ebi/absenceUnexcused/` + personId + `/` + isPendingApproval, {
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
			            dispatch({type: types.ABSENCE_UNEXCUSED_INIT, payload: response})
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'absenceUnexcused', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'absenceUnexcused', value: false } }))
    }
}

export const setAbsenceExcused = (personId, absenceUnexcused) => {
    return dispatch => {
				dispatch({type: types.ABSENCE_UNEXCUSED_UPDATE, payload: absenceUnexcused})
        return fetch(`${apiHost}ebi/absenceUnexcused/` + personId, {
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
            body: JSON.stringify(absenceUnexcused)
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

export const reduxAbsenceExcusedFiles = (fileUploads) => {
    return dispatch => {
				dispatch({type: types.ABSENCE_UNEXCUSED_FILE_UPLOADS, payload: fileUploads})
		}
}

export const removeAbsenceExcusedFileUpload = (personId, fileUploadId) => {
    return dispatch => {
				dispatch({type: types.ABSENCE_UNEXCUSED_FILE_DELETE, payload: fileUploadId})
        return fetch(`${apiHost}ebi/absenceUnexcused/removeFile/` + personId + `/` + fileUploadId, {
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

export const approveAbsenceExcused = (personId, excusedAbsenceIds, declineOrApprove, note='') => {
    return dispatch => {
				dispatch({type: types.ABSENCE_UNEXCUSED_APPROVE, payload: excusedAbsenceIds})
				excusedAbsenceIds = excusedAbsenceIds.join('^')
        return fetch(`${apiHost}ebi/absenceUnexcused/reviewResponse/${personId}/${excusedAbsenceIds}/${declineOrApprove}/${encodeURIComponent(note)}`, {
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
