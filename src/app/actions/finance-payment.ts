import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getFinancePayments = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePayments', value: true } })
	      return fetch(`${apiHost}ebi/financePayments/` + personId, {
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
	          dispatch({ type: types.FINANCE_PAYMENT_INIT, payload: response })
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePayments', value: false } })
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePayments', value: false } }))
   	}
}

export const getFinancePaymentBillings = (personId, financePaymentTableId, runFunction=()=>{}) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePaymentBillings', value: true } })
	      return fetch(`${apiHost}ebi/financePaymentBillings/${personId}/${financePaymentTableId}`, {
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
	          dispatch({ type: types.FINANCE_BILLING_INIT, payload: response })
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePaymentBillings', value: false } })
						dispatch(runFunction())
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financePayments', value: false } }))
   	}
}

export const addOrUpdateFinancePayment = (personId, financePayment, runFunction=() => {}) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financePayment/add/` + personId, {
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
            body: JSON.stringify(financePayment)
        })
        .then(() => {
            dispatch(getFinancePayments(personId))
            dispatch(runFunction)
        })
    }
}
