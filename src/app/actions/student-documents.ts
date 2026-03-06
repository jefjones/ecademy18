import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getStudentDocuments = (personId, studentPersonId) => {
    return dispatch => {
        //dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} }); //This is intentionally set to assignments which is where the studentDocuments need to show up.
        return fetch(`${apiHost}ebi/studentDocuments/` + personId + `/` + studentPersonId, {
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
            //dispatch({type: types.FETCHING_RECORD, payload: {assignments: false} });
            dispatch({type: types.STUDENT_DOCUMENTS_INIT, payload: response})
        })
    }
}

export const removeStudentDocumentFile = (personId, studentDocumentId) => {
    return dispatch => {
				//dispatch({type: types.FETCHING_RECORD, payload: {studentDocuments: true} });
        return fetch(`${apiHost}ebi/studentDocuments/remove/` + personId + `/` + studentDocumentId, {
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
						//dispatch({type: types.FETCHING_RECORD, payload: {studentDocuments: 'ready'} });
            dispatch({ type: types.STUDENT_DOCUMENTS_INIT, payload: response })
        })
    }
}
