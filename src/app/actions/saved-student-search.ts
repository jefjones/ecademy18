import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const init = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/savedStudentSearch/` + personId, {
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
			            dispatch({ type: types.SAVED_STUDENT_SEARCH_INIT, payload: response })
			        })
    }
}

export const saveStudentSearch = (personId, studentSearch) => {

		if (studentSearch.selectedGradeLevels) studentSearch.selectedGradeLevels = studentSearch.selectedGradeLevels.join()
		if (studentSearch.selectedCredits) studentSearch.selectedCredits = studentSearch.selectedCredits.join()
		if (!studentSearch.facilitatorPersonId) studentSearch.facilitatorPersonId = guidEmpty
		if (!studentSearch.guardianPersonId) studentSearch.guardianPersonId = guidEmpty

    return dispatch => {
        return fetch(`${apiHost}ebi/savedStudentSearch/` + personId, {
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
									body: JSON.stringify(studentSearch),
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
			            dispatch({ type: types.SAVED_STUDENT_SEARCH_INIT, payload: response })
			        })
    }
}
