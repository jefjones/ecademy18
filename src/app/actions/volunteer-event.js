import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {browserHistory} from 'react-router';

export const getVolunteerEvents = (personId, volunteerEventId='00000000-0000-0000-0000-000000000000') => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'volunteerEvents', value: true } });
	      return fetch(`${apiHost}ebi/volunteerEvent/get/` + personId + `/` + volunteerEventId, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'volunteerEvents', value: false } });
	          dispatch({ type: types.VOLUNTEER_EVENT_INIT, payload: response });
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'volunteerEvents', value: false } }));
   	}
}

export const addVolunteerEvent = (personId, volunteerEvent) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteerEvent/add/` + personId, {
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
      body: JSON.stringify(volunteerEvent)
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
				browserHistory.push(`/volunteerCheckInOut/${response.volunteerEventId}`)
				dispatch(getVolunteerEvents(personId))
		})
}

export const confirmVolunteerHour = (personId, adminConfirm) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteerEvent/confirmHour/` + personId, {
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
    .then(() => dispatch(getVolunteerEvents(personId)));
}

export const setVolunteerCheckOut = (personId, checkOutDetails) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteerEvent/checkOutDetails/` + personId, {
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
			body: JSON.stringify(checkOutDetails)
    })
    .then(() => dispatch(getVolunteerEvents(personId, checkOutDetails.volunteerEventId)));
}


export const removeVolunteerHours = (personId, volunteerEventId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteerEvent/remove/` + personId + `/` + volunteerEventId, {
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
    .then(() => dispatch(getVolunteerEvents(personId)));
}
