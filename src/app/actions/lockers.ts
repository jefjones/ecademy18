import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getLockers = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("lockers")
				!!storage && dispatch({ type: types.LOCKERS_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lockerSettings', value: true } })
        return fetch(`${apiHost}ebi/lockers/` + personId, {
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
			            dispatch({type: types.LOCKERS_INIT, payload: response})
									localStorage.setItem("lockers", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lockerSettings', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lockerSettings', value: false } }))
    }
}

export const removeLocker = (personId, lockerId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/locker/remove/` + personId + `/` + lockerId, {
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
            dispatch({ type: types.LOCKERS_INIT, payload: response })
        })
    }
}

export const addOrUpdateLocker = (personId, locker) => {
    if (!locker.lockerId) locker.lockerId = '00000000-0000-0000-0000-000000000000'
    if (!locker.companyId) locker.companyId = '00000000-0000-0000-0000-000000000000'
    return dispatch => {
        return fetch(`${apiHost}ebi/locker/` + personId, {
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
            body: JSON.stringify(locker),
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
            dispatch({ type: types.LOCKERS_INIT, payload: response })
        })
    }
}

export const getLockerStudentAssign = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("lockerStudentAssign")
				!!storage && dispatch({ type: types.LOCKER_STUDENT_ASSIGN_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lockerAssign', value: true } })
        return fetch(`${apiHost}ebi/locker/assign/` + personId, {
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
			            dispatch({type: types.LOCKER_STUDENT_ASSIGN_INIT, payload: response})
									localStorage.setItem("lockerStudentAssign", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lockerAssign', value: false } })
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'lockerAssign', value: false } }))
    }
}

export const setLockerStudentAssign = (personId, assign) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/locker/assign/` + personId, {
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
            body: JSON.stringify(assign)
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
            dispatch({ type: types.LOCKER_STUDENT_ASSIGN_INIT, payload: response })
						localStorage.setItem("lockerStudentAssign", JSON.stringify(response))
        })
    }
}

export const removeLockerStudentAssign = (personId, lockerStudentAssignId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/locker/assign/remove/` + personId + `/` + lockerStudentAssignId, {
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
            dispatch({ type: types.LOCKER_STUDENT_ASSIGN_INIT, payload: response })
						localStorage.setItem("lockerStudentAssign", JSON.stringify(response))
        })
    }
}
