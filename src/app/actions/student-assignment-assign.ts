import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId, courseScheduledId, jumpToAssignmentId='00000000-0000-0000-0000-000000000000', assignmentId='00000000-0000-0000-0000-000000000000', clearRedux=true) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/studentAssignmentAssign/` + personId + `/` + courseScheduledId + `/` + jumpToAssignmentId + `/` + assignmentId, {
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
            dispatch({type: types.STUDENT_ASSIGNMENT_ASSIGN, payload: response})
        })
    }
}

export const clearStudentAssignmentAssign = () => {
		return dispatch => {
				dispatch({type: types.STUDENT_ASSIGNMENT_ASSIGN, payload: []})
		}
}

export const setStudentAssignmentAssign = (studentPersonId, assignmentId, runFunction=() => {}) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/studentAssignmentAssign/set/` + studentPersonId + `/` + assignmentId, {
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
        .then(() => dispatch(runFunction))
    }
}
