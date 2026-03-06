import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getCoursePrerequisites = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("coursePrerequisites")
				storage && dispatch({ type: types.COURSE_PREREQUISITES, payload: JSON.parse(storage) })
				dispatch({type: types.FETCHING_RECORD, payload: {coursePrerequisites: true} })
        return fetch(`${apiHost}ebi/coursePrerequisites/${personId}`, {
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
            dispatch({ type: types.COURSE_PREREQUISITES, payload: response })
						localStorage.setItem("coursePrerequisites", JSON.stringify(response))
						dispatch({type: types.FETCHING_RECORD, payload: {coursePrerequisites: 'ready'} })
				})
    }
}
