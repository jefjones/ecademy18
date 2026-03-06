import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {guidEmpty} from '../utils/guidValidate.js'

export const init = (personId, schoolCode='EMPTY', doctorNoteInviteId='') => {
		personId = personId ? personId : guidEmpty;
		if (!schoolCode || schoolCode === '') schoolCode = 'EMPTY';

    return dispatch => {
      fetch(`${apiHost}ebi/companyConfig/${personId}/${schoolCode}/${doctorNoteInviteId}`, {
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
          dispatch({ type: types.COMPANY_CONFIG_INIT, payload: response });
      })
	 }
}

export const setCompanyConfig = (personId, field, value) => {
		value = value === 0 ? 0 : !value ? 'EMPTY' : value;

    return dispatch => {
      fetch(`${apiHost}ebi/companyConfig/set/` + personId + `/` + field + `/` + value, {
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
      .then(() => dispatch(init(personId)));
	 }
}


export const toggleCompanyFeature = (personId, feature) => {
    return dispatch => {
			dispatch({ type: types.COMPANY_CONFIG_UPDATE, payload: feature });
      fetch(`${apiHost}ebi/companyFeature/toggle/` + personId + `/` + feature, {
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
      .then(() => dispatch(init(personId)));
	 }
}

export const removeLogoFileUpload = (personId, logoFileUploadId) => {
    return dispatch => {
      fetch(`${apiHost}ebi/companyConfig/removeLogo/` + personId + `/` + logoFileUploadId, {
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
      .then(() => dispatch(init(personId)));
	 }
}

export const removeSignatureFileUpload = (personId, signatureFileUploadId) => {
    return dispatch => {
      fetch(`${apiHost}ebi/companyConfig/removeSignature/` + personId + `/` + signatureFileUploadId, {
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
      .then(() => dispatch(init(personId)));
	 }
}

export const removeOfficialSealFileUpload = (personId, officialSealFileUploadId) => {
    return dispatch => {
      fetch(`${apiHost}ebi/companyConfig/removeOfficialSeal/` + personId + `/` + officialSealFileUploadId, {
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
      .then(() => dispatch(init(personId)));
	 }
}
