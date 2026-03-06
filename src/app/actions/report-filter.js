import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import * as actionReportFilterOptions from './report-filter-options.js';

export const init = (personId, groupId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/reportFilters/init/` + personId + `/` + groupId, {
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
          dispatch({ type: types.REPORT_FILTERS_INIT, payload: response });
      })
}

export const updateFilterDefaultFlag = (personId, savedFilterIdCurrent, setValue) => {
    setValue = setValue ? "true" : "false";
    return dispatch =>
      fetch(`${apiHost}ebi/reportFilters/setDefault/` + personId + `/` + savedFilterIdCurrent + `/` + setValue, {
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
          //We don't call the init function here because our scratch record may have settings from a user's choice which may include calling back up a saved search record.
          //A init() function call sets the scratch record back to the default (initial) settings.
          //The default flag choice will reach back to the other open community  filter records in order to reset the default flag FROM those records to the current one.  That's why we need to get all of the reportFilters back here again.
          dispatch({ type: types.REPORT_FILTERS_INIT, payload: response });
      })
  }

export const updateFilterByField = (personId, field, value) => {
    if (field === "workIds" || field === "nativeLanguageIds" || field === "translateLanguageIds" || field === "editorIds" || field === "sectionIds") {
        value = value && value.toString();
    }
  let sendValue = value ? value : '~!EMPTY';
  return dispatch =>
    fetch(`${apiHost}ebi/reportFilters/setField/` + personId + `/` + field + `/` + sendValue, {
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
        //We don't call the init function here because our scratch record may have settings from a user's choice which may include calling back up a saved search record.
        //A init() function call sets the scratch record back to the default (initial) settings.
        //The default flag choice will reach back to the other open community filter records in order to reset the default flag FROM those records to the current one.  That's why we need to get all of the reportFilters back here again.
        dispatch(actionReportFilterOptions.updateSectionsOptions(personId));
        dispatch({ type: types.REPORT_FILTERS_INIT, payload: response.filters });
        dispatch({ type: types.CONTRIBUTOR_REPORT_INIT, payload: response.report });
    })
}

export const saveNewSavedSearch = (personId, savedSearchName) => {
  return dispatch =>
    fetch(`${apiHost}ebi/reportFilters/saveNewSavedSearch/` + personId + `/` + savedSearchName, {
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
         //We will need to set the new saved search as the chosen one, so we need to get all the records back again
         //And we will be setting the savedfilterId_current to the new reportFilterId so that the saved search list will include the new one.
         //And the save New textbox will be blanked out.
         dispatch({ type: types.REPORT_FILTERS_INIT, payload: response });
     })
}

export const updateSavedSearch = (personId, reportFilterId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/reportFilters/updateSavedSearch/` + personId + `/` + reportFilterId, {
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
        dispatch({ type: types.REPORT_FILTERS_INIT, payload: response });
    })
}

export const deleteSavedSearch = (personId, reportFilterId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/reportFilters/deleteSavedSearch/` + personId + `/` + reportFilterId, {
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
        dispatch({ type: types.REPORT_FILTERS_INIT, payload: response });
    })
}

//In the case of choosing a saved search, we don't need to go to the webApi
//  Just set the scratch reportFilter according to the chosen saved search.
export const chooseSavedSearch = (personId, reportFilterId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/reportFilters/chooseSavedSearch/` + personId + `/` + reportFilterId, {
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
          dispatch({ type: types.REPORT_FILTERS_INIT, payload: response.filters });
          dispatch({ type: types.CONTRIBUTOR_REPORT_INIT, payload: response.report });
          dispatch(actionReportFilterOptions.updateSectionsOptions());
      })
}

export const clearFilters = (personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/reportFilters/reset/` + personId, {
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
          dispatch(init(personId)); //This is used in order to pick up the list options again in the service.
      })
}
