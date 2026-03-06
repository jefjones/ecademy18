import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId) => {
    return dispatch => {
			  let storage = localStorage.getItem("openRegistrations")
			  storage && dispatch({ type: types.OPEN_REGISTRATIONS_INIT, payload: JSON.parse(storage) });

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'openRecommendations', value: true } });
        return fetch(`${apiHost}ebi/openRegistrations/` + personId, {
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
            dispatch({ type: types.OPEN_REGISTRATIONS_INIT, payload: response });
						localStorage.setItem("openRegistrations", JSON.stringify(response));
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'openRecommendations', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'openRecommendations', value: false } }));
    }
}

export const addOrUpdateOpenRegistration = (personId, openRegistration) => {
    return dispatch =>
      fetch(`${apiHost}ebi/openRegistration/addOrUpdate/` + personId, {
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
        body: JSON.stringify(openRegistration),
      })
      .then(() => dispatch(init(personId)))
}

export const removeOpenRegistration = (personId, openRegistrationTableId) => {
    return dispatch => {
        dispatch({ type: types.OPEN_REGISTRATIONS_REMOVE, payload: openRegistrationTableId });
        fetch(`${apiHost}ebi/openRegistration/remove/` + personId + `/` + openRegistrationTableId, {
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
        })
        .then(() => dispatch(init(personId)))
    }
}

export const removeStudentOpenRegistration = (personId, openRegistrationTableId, studentPersonId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/openRegistration/removeStudent/` + personId + `/` + openRegistrationTableId + `/` + studentPersonId, {
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
      })
      .then(() => dispatch(init(personId)))
}
