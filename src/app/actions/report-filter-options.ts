import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId, groupId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/reportFilterOptions/init/` + personId + `/` + groupId, {
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
          dispatch({ type: types.REPORT_FILTERS_OPTIONS_INIT, payload: response })
      })
}

export const updateSectionsOptions = (personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/reportFilterOptions/sections/` + personId, {
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
          dispatch({ type: types.REPORT_FILTERS_OPTIONS_SECTIONS, payload: response })
      })
}
