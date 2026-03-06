import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getFinanceWaiverSchedules = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("financeWaiverSchedule")
				!!storage && dispatch({ type: types.FINANCE_WAIVER_SCHEDULE_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeWaiverSchedule', value: true } })
        return fetch(`${apiHost}ebi/financeWaiverSchedules/` + personId, {
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
			            dispatch({ type: types.FINANCE_WAIVER_SCHEDULE_INIT, payload: response })
									localStorage.setItem("financeWaiverSchedule", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeWaiverSchedule', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeWaiverSchedule', value: false } }))
    }
}

export const addOrUpdateFinanceWaiverSchedule = (personId, financeWaiverSchedule) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeWaiverSchedule/` + personId, {
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
            body: JSON.stringify(financeWaiverSchedule)
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
            dispatch({ type: types.FINANCE_WAIVER_SCHEDULE_INIT, payload: response })
						localStorage.setItem("financeWaiverSchedule", JSON.stringify(response))
        })
    }
}

export const removeFinanceWaiverSchedule = (personId, financeWaiverScheduleId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeWaiverSchedule/remove/` + personId + `/` + financeWaiverScheduleId, {
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
            dispatch({ type: types.FINANCE_WAIVER_SCHEDULE_INIT, payload: response })
						localStorage.setItem("financeWaiverSchedule", JSON.stringify(response))
        })
    }
}
