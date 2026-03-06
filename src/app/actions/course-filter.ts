import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/courseFilters/init/` + personId, {
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
          dispatch({ type: types.COURSE_FILTERS_INIT, payload: response })
      })
}

export const updateFilterDefaultFlag = (personId, savedFilterIdCurrent, setValue) => {
    setValue = setValue ? "true" : "false"
    return dispatch =>
      fetch(`${apiHost}ebi/courseFilters/setDefault/` + personId + `/` + savedFilterIdCurrent + `/` + setValue, {
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
          //We don't call the init function here because our scratch record may have settings from a user's choice which may include calling back up a saved search record.
          //A init() function call sets the scratch record back to the default (initial) settings.
          //The default flag choice will reach back to the other work filter records in order to reset the default flag FROM those records to the current one.  That's why we need to get all of the courseFilters back here again.
          dispatch({ type: types.COURSE_FILTERS_INIT, payload: response })
      })
  }

export const updateFilterByField = (personId, field, value) => {
  let sendValue = value ? value : '~!EMPTY'
  return dispatch =>
    fetch(`${apiHost}ebi/courseFilters/setField/` + personId + `/` + field + `/` + sendValue, {
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
        //We don't call the init function here because our scratch record may have settings from a user's choice which may include calling back up a saved search record.
        //A init() function call sets the scratch record back to the default (initial) settings.
        //The default flag choice will reach back to the other work filter records in order to reset the default flag FROM those records to the current one.  That's why we need to get all of the courseFilters back here again.
        dispatch({ type: types.COURSE_FILTERS_INIT, payload: response })
    })
}

export const saveNewSavedSearch = (personId, savedSearchName) => {
  return dispatch =>
    fetch(`${apiHost}ebi/courseFilters/saveNewSavedSearch/` + personId + `/` + savedSearchName, {
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
         //We will need to set the new saved search as the chosen one, so we need to get all the records back again
         //And we will be setting the savedfilterId_current to the new courseFilterId so that the saved search list will include the new one.
         //And the save New textbox will be blanked out.
         dispatch({ type: types.COURSE_FILTERS_INIT, payload: response })
     })
}

export const updateSavedSearch = (personId, courseFilterId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/courseFilters/updateSavedSearch/` + personId + `/` + courseFilterId, {
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
        dispatch({ type: types.COURSE_FILTERS_INIT, payload: response })
    })
}

export const deleteSavedSearch = (personId, courseFilterId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/courseFilters/deleteSavedSearch/` + personId + `/` + courseFilterId, {
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
        dispatch({ type: types.COURSE_FILTERS_INIT, payload: response })
    })
}

//In the case of choosing a saved search, we don't need to go to the webApi
//  Just set the scratch courseFilter according to the chosen saved search.
export const chooseSavedSearch = (personId, courseFilterId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/courseFilters/chooseSavedSearch/` + personId + `/` + courseFilterId, {
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
          dispatch({ type: types.COURSE_FILTERS_INIT, payload: response })
      })
}

export const clearFilters = (personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/courseFilters/reset/` + personId, {
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
          //in this case we do call the init() function since it will set the scratch record back to the default (initial) settings.
          dispatch(init(personId)); //This is used in order to pick up the list options again in the service.
      })
}
