import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getCourseGradeLevels = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("courseGradeLevels")
				storage && dispatch({ type: types.COURSE_GRADE_LEVELS, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/courseGradeLevels/` + personId, {
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
            dispatch({ type: types.COURSE_GRADE_LEVELS, payload: response })
						localStorage.setItem("courseGradeLevels", JSON.stringify(response))
				})
    }
}
