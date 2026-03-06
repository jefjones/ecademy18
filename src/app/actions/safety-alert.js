import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import * as actionBuildingAndField from './building-and-field-settings.js';

export const getSafetyAlerts = (personId, safetyAlertId='00000000-0000-0000-0000-000000000000') => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'safetyAdminAlert', value: true } });
	      return fetch(`${apiHost}ebi/safetyAlert/get/` + personId + `/` + safetyAlertId, {
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
	          dispatch({ type: types.SAFETY_ALERT_INIT, payload: response });
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'safetyAdminAlert', value: false } });
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'safetyAdminAlert', value: false } }));
   	}
}

export const addSafetyAlert = (personId, fileData, safetyAlertTypeId, note) => {
  return dispatch =>
    fetch(`${apiHost}ebi/safetyAlert/add/` + personId + `/` + safetyAlertTypeId + `/` + note, {
      method: 'post',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/form-data', //json
          'Access-Control-Allow-Credentials' : 'true',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
          "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
          "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
      fileData,
    },
		fileData)
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
				dispatch({ type: types.SAFETY_ALERT_INIT, payload: response });
		})
}

export const confirmSafetyAlert = (personId, adminConfirm) => {
  return dispatch =>
    fetch(`${apiHost}ebi/safetyAlert/confirm/` + personId, {
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
    .then(() => dispatch(getSafetyAlerts(personId)));
}

export const clearSafetyAlertLocations = (personId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/safetyAlert/locations/clear/` + personId, {
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

export const toggleSafetyAlertLocation = (personId, recordType, recordId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndField/toggleSafetyAlertLocation/` + personId + `/` + recordType + `/` + recordId, {
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
        .then(() => dispatch(actionBuildingAndField.getBuildingAndFieldSettings(personId, false)))
    }
}

export const dismissSafetyAlert = (personId, safetyRecordId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/safetyAlert/dismiss/` + personId + `/` + safetyRecordId, {
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
        .then(() => dispatch(getSafetyAlerts(personId)));
    }
}
