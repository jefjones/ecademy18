import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getFinanceFeeTypes = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("financeFeeTypes")
				!!storage && dispatch({ type: types.FINANCE_FEE_TYPES_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeFeeTypes', value: true } })
        return fetch(`${apiHost}ebi/financeFeeTypes/` + personId, {
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
			            dispatch({ type: types.FINANCE_FEE_TYPES_INIT, payload: response })
									localStorage.setItem("financeFeeTypes", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeFeeTypes', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeFeeTypes', value: false } }))
    }
}

export const addOrUpdateFinanceFeeType = (personId, financeFeeType) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeFeeType/` + personId, {
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
            body: JSON.stringify(financeFeeType)
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
            dispatch({ type: types.FINANCE_FEE_TYPES_INIT, payload: response })
						localStorage.setItem("financeFeeTypes", JSON.stringify(response))
        })
    }
}

export const removeFinanceFeeType = (personId, financeFeeTypeId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeFeeType/remove/` + personId + `/` + financeFeeTypeId, {
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
            dispatch({ type: types.FINANCE_FEE_TYPES_INIT, payload: response })
						localStorage.setItem("financeFeeTypes", JSON.stringify(response))
        })
    }
}
