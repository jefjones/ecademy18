import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getCheckInOrOuts = (personId, curbsideCheckInOrOutId='00000000-0000-0000-0000-000000000000') => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'curbsideAdminCheckin', value: true } });
	      return fetch(`${apiHost}ebi/checkInOrOut/get/` + personId + `/` + curbsideCheckInOrOutId, {
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
	          dispatch({ type: types.CHECK_IN_OUT_INIT, payload: response });
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'curbsideAdminCheckin', value: false } });
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'curbsideAdminCheckin', value: false } }));
   	}
}

export const getCheckInOrOutReasons = (personId) => {
    return dispatch => {
		  	dispatch({type: types.FETCHING_RECORD, payload: {calendarEvents: true} });
	      return fetch(`${apiHost}ebi/checkInOrOut/reasons/` + personId, {
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
	          dispatch({ type: types.CHECK_IN_OUT_REASONS_INIT, payload: response });
	      })
   	}
}

export const addCheckInOrOut = (personId, checkInOrOut) => {
  return dispatch =>
    fetch(`${apiHost}ebi/checkInOrOut/add/` + personId, {
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
      body: JSON.stringify(checkInOrOut)
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
				dispatch({ type: types.CHECK_IN_OUT_INIT, payload: response });
		})
}

export const confirmCheckInOrOut = (personId, adminConfirm) => {
  return dispatch =>
    fetch(`${apiHost}ebi/checkInOrOut/confirm/` + personId, {
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
			body: JSON.stringify(adminConfirm)
    })
    .then(response => dispatch(getCheckInOrOuts(personId)));
}
