import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("courseTypes")
				storage && dispatch({ type: types.COURSE_TYPES_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseTypesSettings', value: true } })
        return fetch(`${apiHost}ebi/courseTypes/` + personId, {
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
			            dispatch({ type: types.COURSE_TYPES_INIT, payload: response })
									localStorage.setItem("courseTypes", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseTypesSettings', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseTypesSettings', value: false } }))
    }
}

export const addOrUpdateCourseType = (personId, courseType) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseType/` + personId, {
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
            body: JSON.stringify(courseType)
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
            dispatch({ type: types.COURSE_TYPES_INIT, payload: response })
        })
    }
}

export const removeCourseType = (personId, courseTypeId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseType/remove/` + personId + `/` + courseTypeId, {
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
            dispatch({ type: types.COURSE_TYPES_INIT, payload: response })
        })
    }
}
