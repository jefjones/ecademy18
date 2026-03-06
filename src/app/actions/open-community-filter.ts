import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/openCommunityFilters/init/` + personId, {
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
          dispatch({ type: types.OPEN_COMMUNITY_FILTERS_INIT, payload: response })
      })
}

export const updateFilterDefaultFlag = (personId, savedFilterIdCurrent, setValue) => {
    setValue = setValue ? "true" : "false"
    return dispatch =>
      fetch(`${apiHost}ebi/openCommunityFilters/setDefault/` + personId + `/` + savedFilterIdCurrent + `/` + setValue, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header"
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
          //The default flag choice will reach back to the other open community  filter records in order to reset the default flag FROM those records to the current one.  That's why we need to get all of the openCommunityFilters back here again.
          dispatch({ type: types.OPEN_COMMUNITY_FILTERS_INIT, payload: response })
      })
  }

export const updateFilterByField = (personId, field, value) => {
    if (field === "nativeLanguageIds" || field === "translateLanguageIds" || field === "genreIds" || field === "editSeverityIds") {
        value = value.toString()
    }

  let sendValue = value ? value : '~!EMPTY'
  return dispatch =>
    fetch(`${apiHost}ebi/openCommunityFilters/setField/` + personId + `/` + field + `/` + sendValue, {
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
        //The default flag choice will reach back to the other open community filter records in order to reset the default flag FROM those records to the current one.  That's why we need to get all of the openCommunityFilters back here again.
        dispatch({ type: types.OPEN_COMMUNITY_FILTERS_INIT, payload: response })
    })
}

export const saveNewSavedSearch = (personId, savedSearchName) => {
  return dispatch =>
    fetch(`${apiHost}ebi/openCommunityFilters/saveNewSavedSearch/` + personId + `/` + savedSearchName, {
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
         //And we will be setting the savedfilterId_current to the new openCommunityFilterId so that the saved search list will include the new one.
         //And the save New textbox will be blanked out.
         dispatch({ type: types.OPEN_COMMUNITY_FILTERS_INIT, payload: response })
     })
}

export const updateSavedSearch = (personId, openCommunityFilterId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/openCommunityFilters/updateSavedSearch/` + personId + `/` + openCommunityFilterId, {
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
        dispatch({ type: types.OPEN_COMMUNITY_FILTERS_INIT, payload: response })
    })
}

export const deleteSavedSearch = (personId, openCommunityFilterId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/openCommunityFilters/deleteSavedSearch/` + personId + `/` + openCommunityFilterId, {
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
        dispatch({ type: types.OPEN_COMMUNITY_FILTERS_INIT, payload: response })
    })
}

//In the case of choosing a saved search, we don't need to go to the webApi
//  Just set the scratch openCommunityFilter according to the chosen saved search.
export const chooseSavedSearch = (personId, openCommunityFilterId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/openCommunityFilters/chooseSavedSearch/` + personId + `/` + openCommunityFilterId, {
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
          dispatch({ type: types.OPEN_COMMUNITY_FILTERS_INIT, payload: response })
      })
}

export const clearFilters = (personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/openCommunityFilters/reset/` + personId, {
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
          dispatch(init(personId)); //This is used in order to pick up the list options again in the service.
      })
}
