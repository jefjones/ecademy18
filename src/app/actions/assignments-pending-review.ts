import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getAssignmentsPendingReview = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignmentsPendingReview', value: true } })
        return fetch(`${apiHost}ebi/assignmentsPendingReview/` + personId, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignmentsPendingReview', value: false } })
            dispatch({type: types.ASSIGNMENTS_PENDING_REVIEW, payload: response})
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignmentsPendingReview', value: false } }))
    }
}

export const setTeacherViewed = (personId, studentAssignmentFileId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assignmentsPendingReview/setTeacherViewed/` + personId + `/` + studentAssignmentFileId, {
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
