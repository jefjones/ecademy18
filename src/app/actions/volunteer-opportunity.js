import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getVolunteerOpportunities = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'olunteerOpportunities', value: true } });
	      return fetch(`${apiHost}ebi/volunteerOpportunities/get/` + personId, {
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
	          dispatch({ type: types.VOLUNTEER_OPPORTUNITY_INIT, payload: response });
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'olunteerOpportunities', value: false } });
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'olunteerOpportunities', value: false } }));
   	}
}

export const addOrUpdateVolunteerOpportunity = (personId, volunteerOpportunity) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteerOpportunity/add/` + personId, {
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
      body: JSON.stringify(volunteerOpportunity)
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
		.then(response => dispatch(getVolunteerOpportunities(personId)))
}


export const removeVolunteerOpportunity = (personId, volunteerOpportunityId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteerOpportunity/remove/` + personId + `/` + volunteerOpportunityId, {
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
    .then(() => dispatch(getVolunteerOpportunities(personId)));
}

export const addVolunteer = (personId, volunteerOpportunityDateId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteer/add/` + personId + `/` + volunteerOpportunityDateId, {
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
    .then(() => dispatch(getVolunteerOpportunities(personId)));
}

export const removeVolunteer = (personId, volunteerOpportunityDateId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/volunteer/remove/` + personId + `/` + volunteerOpportunityDateId, {
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
    .then(() => dispatch(getVolunteerOpportunities(personId)));
}
