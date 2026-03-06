import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getAdminResponsePendings = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/adminResponsePending/get/` + personId, {
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
            dispatch({ type: types.ADMIN_RESPONSE_PENDINGS_INIT, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const pickupAdminResponsePending = (personId, adminResponsePendingId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/adminResponsePending/pickup/${personId}/${adminResponsePendingId}`, {
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
      .then(() =>   dispatch(getAdminResponsePendings(personId)))
}

export const responseAdminResponsePending = (personId, adminResponsePendingId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/adminResponsePending/response/${personId}/${adminResponsePendingId}`, {
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
      .then(() => dispatch(getAdminResponsePendings(personId)))
}

export const resetAdminResponsePending = (personId, adminResponsePendingId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/adminResponsePending/reset/${personId}/${adminResponsePendingId}`, {
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
      .then(() => dispatch(getAdminResponsePendings(personId)))
}
