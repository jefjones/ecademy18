import * as types from './actionTypes';
import {browserHistory} from 'react-router';
import {apiHost} from '../api_host.js';

export const addOrUpdatePeerGroup = (peerGroup, subGroups) => {
    return dispatch =>
      fetch(`${apiHost}ebi/peerGroup/addOrUpdate`, {
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
            peerGroup,
            subGroups,
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
        dispatch({ type: types.GROUPS_INIT, payload: response });
        browserHistory.push("/groupSettings/" + peerGroup.groupId);
      })
}

export const deletePeerGroup = (personId, peerGroupId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/peerGroup/delete/` + personId + `/` + peerGroupId, {
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
        dispatch({ type: types.GROUPS_INIT, payload: response });
      })
}
