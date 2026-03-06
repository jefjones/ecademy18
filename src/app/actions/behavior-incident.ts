import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getBehaviorIncidents = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'behaviorIncidentList', value: true } })
	      return fetch(`${apiHost}ebi/behaviorIncident/get/${personId}` , {
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
	          dispatch({ type: types.BEHAVIOR_INCIDENT_INIT, payload: response })
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'behaviorIncidentList', value: false } })
	      })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'behaviorIncidentList', value: false } }))
   	}
}


export const addOrUpdateBehaviorIncident = (personId, behaviorIncident) => {
  return dispatch =>
    fetch(`${apiHost}ebi/behaviorIncident/addIncident/${personId}`, {
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
      body: JSON.stringify(behaviorIncident)
    })
    .then(() => dispatch(getBehaviorIncidents(personId)))
}

export const removeBehaviorIncident = (personId, behaviorIncidentId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/behaviorIncident/remove/` + personId + `/` + behaviorIncidentId, {
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
    .then(() => dispatch(getBehaviorIncidents(personId)))
}

export const removeBehaviorIncidentFile = (personId, behaviorIncidentId) => {
  return dispatch =>
    fetch(`${apiHost}ebi/behaviorIncident/file/remove/${personId}/${behaviorIncidentId}`, {
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
    .then(() => dispatch(getBehaviorIncidents(personId)))
}

export const getFilterGroups = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("behaviorIncidentFilterGroups")
				storage && dispatch({ type: types.BEHAVIOR_INCIDENT_FILTER_GROUPS, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/behaviorIncident/filterGroups/` + personId, {
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
						dispatch({ type: types.BEHAVIOR_INCIDENT_FILTER_GROUPS, payload: response })
						localStorage.setItem("behaviorIncidentFilterGroups", JSON.stringify(response))
        })
    }
}

export const addOrUpdateFilterGroup = (personId, filterGroup) => {
		if (filterGroup && !filterGroup.behaviorIncidentFilterGroupId) filterGroup.behaviorIncidentFilterGroupId = '00000000-0000-0000-0000-000000000000'
    return dispatch => {
        return fetch(`${apiHost}ebi/behaviorIncident/filterGroup/` + personId, {
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
            body: JSON.stringify(filterGroup),
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
						dispatch(getFilterGroups(personId))
						dispatch({ type: types.MESSAGE_GROUPID_CHOSEN, payload: response })
        })
    }
}

export const removeFilterGroup = (personId, behaviorIncidentFilterGroupId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/behaviorIncident/filterGroup/remove/` + personId + `/` + behaviorIncidentFilterGroupId, {
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
						dispatch(getFilterGroups(personId))
        })
    }
}
