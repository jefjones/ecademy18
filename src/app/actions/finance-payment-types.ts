import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getFinancePaymentTypes = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("financePaymentTypes")
				!!storage && dispatch({ type: types.FINANCE_PAYMENT_TYPES_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePaymentTypes', value: true } })
        return fetch(`${apiHost}ebi/financePaymentTypes/` + personId, {
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
			            dispatch({ type: types.FINANCE_PAYMENT_TYPES_INIT, payload: response })
									localStorage.setItem("financePaymentTypes", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePaymentTypes', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePaymentTypes', value: false } }))
    }
}

export const addOrUpdateFinancePaymentType = (personId, financePaymentType) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financePaymentType/` + personId, {
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
            body: JSON.stringify(financePaymentType)
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
            dispatch({ type: types.FINANCE_PAYMENT_TYPES_INIT, payload: response })
						localStorage.setItem("financePaymentTypes", JSON.stringify(response))
        })
    }
}

export const removeFinancePaymentType = (personId, financePaymentTypeId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financePaymentType/remove/` + personId + `/` + financePaymentTypeId, {
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
            dispatch({ type: types.FINANCE_PAYMENT_TYPES_INIT, payload: response })
						localStorage.setItem("financePaymentTypes", JSON.stringify(response))
        })
    }
}
