import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId, groupId) => {
    return dispatch => {
      dispatch({type: types.FETCHING_RECORD, payload: {groupWork: true} })

      return fetch(`${apiHost}ebi/groupEditReport/` + personId + `/` + groupId, {
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
          dispatch({ type: types.GROUP_EDIT_REPORT_INIT, payload: response })
          dispatch({type: types.FETCHING_RECORD, payload: {groupWork: false} })
      })
   }
}
