import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getDistributedCourses = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'distributedCourses', value: true } })
        return fetch(`${apiHost}ebi/distributedCourses/` + personId, {
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
			            dispatch({type: types.DISTRIBUTED_COURSES_INIT, payload: response})
									localStorage.setItem("distributedCourses", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'distributedCourses', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'distributedCourses', value: false } }))
    }
}

export const activateDistributedCourses = (personId, studentPersonIdList) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/distributedCourses/` + personId, {
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
									body: JSON.stringify(studentPersonIdList)
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
			            dispatch({type: types.DISTRIBUTED_COURSES_INIT, payload: response})
									localStorage.setItem("distributedCourses", JSON.stringify(response))
			        })
    }
}
