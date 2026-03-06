import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getStudents = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("students")
				!!storage && dispatch({ type: types.STUDENTS_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'students', value: true } })
        return fetch(`${apiHost}ebi/students/` + personId, {
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
			            dispatch({type: types.STUDENTS_INIT, payload: response})
									localStorage.setItem("students", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'students', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'students', value: false } }))
    }
}

export const getTheStudent = (personId, studentPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/theStudent/${personId}/${studentPersonId}`, {
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
			            dispatch({type: types.THE_STUDENT_INIT, payload: response})
			        })
    }
}


export const setStudentChosenSession = (studentPersonId) => {
    return dispatch => dispatch({ type: types.STUDENT_CHOSEN_SESSION, payload: studentPersonId })
}
