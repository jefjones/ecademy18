import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import * as companyConfig from './company-config';

export const removeCompanyDocumentFile = (personId, companyDocumentId) => {
    return dispatch => {
				dispatch({type: types.COMPANY_DOCUMENT_REMOVE, payload: companyDocumentId });
        return fetch(`${apiHost}ebi/companyDocuments/remove/` + personId + `/` + companyDocumentId, {
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

export const saveCompanyWebsiteLink = (personId, companyId, websiteLink, websiteTitle) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/companyDocuments/addWebsiteLink/` + personId, {
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
						body: JSON.stringify({
								companyId,
								websiteLink: encodeURIComponent(websiteLink),
								title: encodeURIComponent(websiteTitle)
						})
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
						dispatch(companyConfig.init());
        })
    }
}
