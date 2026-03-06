import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getFinanceBillings = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeBillings', value: true } })
	      return fetch(`${apiHost}ebi/financeBillings/` + personId, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeBillings', value: false } })
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeBillings', value: false } }))
   	}
}

export const removeFinanceBilling = (personId, financeBillingId) => {
  return dispatch => {
		dispatch({ type: types.FINANCE_BILLING_REMOVE, payload: financeBillingId })
    fetch(`${apiHost}ebi/financeBilling/remove/` + personId + `/` + financeBillingId, {
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
	}
}

export const removeFinanceBillingFromList = (personId, financeBillingIds) => {
    return dispatch => {
          dispatch({ type: types.FINANCE_BILLING_IDS_LIST_REMOVE, payload: financeBillingIds })
    }
}
