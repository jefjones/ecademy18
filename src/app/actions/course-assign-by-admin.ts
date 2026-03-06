import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getCourseAssignByAdmins = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAssignByAdmin', value: true } })
        return fetch(`${apiHost}ebi/courseAssignByAdmins/` + personId, {
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
			            dispatch({type: types.COURSE_ASSIGN_BY_ADMIN_INIT, payload: response})
									localStorage.setItem("courseAssignByAdmin", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAssignByAdmin', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAssignByAdmin', value: false } }))
    }
}

export const addCourseAssignByAdmin = (studentPersonId, courseAssignByAdmin, runFunction=()=>{}) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseAssignByAdmin/` + studentPersonId, {
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
									body: JSON.stringify(courseAssignByAdmin)
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
									dispatch(runFunction)
			            dispatch({type: types.COURSE_ASSIGN_BY_ADMIN_INIT, payload: response})
									localStorage.setItem("courseAssignByAdmin", JSON.stringify(response))
			        })
    }
}

export const removeCourseAssignByAdmin = (personId, courseAssignByAdminId, runFunction=()=>{}) => {
    return dispatch => {
				dispatch({ type: types.COURSE_ASSIGN_BY_ADMIN_REMOVE, payload: courseAssignByAdminId })
        return fetch(`${apiHost}ebi/courseAssignByAdmin/remove/` + personId + `/` + courseAssignByAdminId, {
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
