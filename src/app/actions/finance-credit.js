import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getFinanceCredits = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCredits', value: true } });
	      return fetch(`${apiHost}ebi/financeCredits/` + personId, {
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
	              return response.json();
	          } else {
	              const error = new Error(response.statusText);
	              error.response = response;
	              throw error;
	          }
	      })
	      .then(response => {
	          dispatch({ type: types.FINANCE_CREDIT_INIT, payload: response });
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCredits', value: false } });
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCredits', value: false } }));
   	}
}

export const removeFinanceCredit = (personId, financeCreditTransactionId) => {
  return dispatch => {
		dispatch({ type: types.FINANCE_CREDIT_REMOVE, payload: financeCreditTransactionId });
    fetch(`${apiHost}ebi/financeCredit/remove/` + personId + `/` + financeCreditTransactionId, {
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
