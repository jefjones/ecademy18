import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import * as guid from '../utils/GuidValidate.js';

export const init = (personId, groupId) => {
    groupId = groupId ? groupId : guid.emptyGuid();
    return dispatch => {
      dispatch({type: types.FETCHING_RECORD, payload: {accessReport: true} });
      return fetch(`${apiHost}ebi/accessReport/` + personId + `/` + groupId, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
        }
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
          dispatch({type: types.FETCHING_RECORD, payload: {accessReport: false} });
          dispatch({ type: types.ACCESS_REPORT_INIT, payload: response });
      })
   }
}

export const groupModifyWorkAccess = (personId, workAssign, groupId, peerGroupId, peerGroup_workId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/accessReport/modifyAccess/`, {
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
            personId,
            workAssign,
            groupId,
            peerGroupId,
            peerGroup_workId,
        }),
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
          dispatch({ type: types.ACCESS_REPORT_INIT, payload: response });
      })
}
