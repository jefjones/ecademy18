import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getFinanceLowIncomeWaivers = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("financeLowIncomeWaivers")
				!!storage && dispatch({ type: types.FINANCE_LOW_INCOME_WAIVERS_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeLowIncomeWaivers', value: true } })
        return fetch(`${apiHost}ebi/financeLowIncomeWaivers/` + personId, {
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
			            dispatch({ type: types.FINANCE_LOW_INCOME_WAIVERS_INIT, payload: response })
									localStorage.setItem("financeLowIncomeWaivers", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeLowIncomeWaivers', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeLowIncomeWaivers', value: false } }))
    }
}

export const addOrUpdateFinanceLowIncomeWaiver = (personId, financeLowIncomeWaiver) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeLowIncomeWaiver/` + personId, {
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
            body: JSON.stringify(financeLowIncomeWaiver)
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
            dispatch({ type: types.FINANCE_LOW_INCOME_WAIVERS_INIT, payload: response })
						localStorage.setItem("financeLowIncomeWaivers", JSON.stringify(response))
        })
    }
}

export const removeFinanceLowIncomeWaiver = (personId, financeLowIncomeWaiverId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeLowIncomeWaiver/remove/` + personId + `/` + financeLowIncomeWaiverId, {
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
            dispatch({ type: types.FINANCE_LOW_INCOME_WAIVERS_INIT, payload: response })
						localStorage.setItem("financeLowIncomeWaivers", JSON.stringify(response))
        })
    }
}
