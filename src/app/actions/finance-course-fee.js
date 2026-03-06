import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getFinanceCourseFees = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCourseFees', value: true } });
	      return fetch(`${apiHost}ebi/financeCourseFees/` + personId, {
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
	          dispatch({ type: types.FINANCE_COURSE_FEE_INIT, payload: response });
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCourseFees', value: false } });
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'financeCourseFees', value: false } }));
   	}
}


export const addOrUpdateFinanceCourseFee = (personId, financeCourseFee) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/financeCourseFee/add/` + personId, {
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
            body: JSON.stringify(financeCourseFee)
        })
        .then(() => dispatch(getFinanceCourseFees(personId)));
    }
}

export const removeFinanceCourseFee = (personId, financeCourseFeeId) => {
  return dispatch => {
		dispatch({ type: types.FINANCE_COURSE_FEE_REMOVE, payload: financeCourseFeeId });
    fetch(`${apiHost}ebi/financeCourseFee/remove/` + personId + `/` + financeCourseFeeId, {
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
