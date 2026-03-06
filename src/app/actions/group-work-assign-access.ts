import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId, groupId, masterWorkId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groupWorkAssignAccess/` + personId + `/` + groupId + `/` + masterWorkId, {
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
              return response.json()
          } else {
              const error = new Error(response.statusText)
              error.response = response
              throw error
          }
      })
      .then(response => {
          dispatch({ type: types.GROUP_WORK_ASSIGN_ACCESS_INIT, payload: response })
      })
}

export const addUpdateGroupWorkAssignAccess = (accessAssigned) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groupWorkAssignAccess`, {
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
        body: JSON.stringify(accessAssigned),
      })
      .then(response => {
          if (response.status >= 200 && response.status < 300) {
              return response.json()
          } else {
              const error = new Error(response.statusText)
              error.response = response
              throw error
          }
      })
      .then(response => {
          dispatch({ type: types.GROUP_WORK_ASSIGN_ACCESS_INIT, payload: response })
      })
}

export const copyPeerGroupGroupWorkAssignAccess = (personId, masterWorkId, previousPeerGroupId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groupWorkAssignAccess/copyPeerGroup/` + personId + `/` + masterWorkId + `/` + previousPeerGroupId, {
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
              return response.json()
          } else {
              const error = new Error(response.statusText)
              error.response = response
              throw error
          }
      })
      .then(response => {
          dispatch({ type: types.GROUP_WORK_ASSIGN_ACCESS_INIT, payload: response })
      })
}
