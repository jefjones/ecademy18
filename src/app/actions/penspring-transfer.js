import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const createWorkAndPenspringTransfer = (personId, work, initFunction=() => {}) => {
    return dispatch => {
      fetch(`${apiHost}ebi/penspringTransfer/createWork/` + personId, {
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
				body: JSON.stringify(work),
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
          dispatch({ type: types.PENSPRING_TRANSFER_FILE_ID, payload: response });
					dispatch(initFunction);
      })
	 }
}

export const setPenspringTransfer = (personId, work) => {
    return dispatch => {
      fetch(`${apiHost}ebi/penspringTransfer/sendOver/` + personId, {
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
				body: JSON.stringify(work),
      })
	 }
}

export const clearPenspringTransfer = (personId, work) => {
		return dispatch => {
				dispatch({ type: types.PENSPRING_TRANSFER_FILE_ID, payload: '' });
		}
}
