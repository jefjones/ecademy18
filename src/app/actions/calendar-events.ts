import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {formatYYYY_MM_DD} from '../utils/dateFormatYYYY_MM_DD'

export const getCalendarEvents = (personId, calendarDateRange) => {
    return dispatch => {
		  	dispatch({type: types.FETCHING_RECORD, payload: {calendarEvents: true} })
	      return fetch(`${apiHost}ebi/calendarEvents/` + personId, {
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
		        body: JSON.stringify(calendarDateRange)
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
			  		dispatch({type: types.FETCHING_RECORD, payload: {calendarEvents: "ready"} })
	          dispatch({ type: types.CALENDAR_EVENTS_INIT, payload: response })
	      })
   	}
}

export const addCalendarEvent = (personId, calendarEvent, calendarDateRange) => {
  return dispatch =>
    fetch(`${apiHost}ebi/calendarEvent/add/` + personId, {
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
      body: JSON.stringify(calendarEvent)
    })
    .then(response => dispatch(getCalendarEvents(personId, calendarDateRange)))
}

export const removeCalendarEvent = (personId, calendarEventId) => {
    return dispatch => {
			dispatch({ type: types.CALENDAR_EVENTS_REMOVE, payload: calendarEventId })
      return fetch(`${apiHost}ebi/calendarEvent/remove/` + personId + `/` + calendarEventId, {
	        method: 'post',
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
   }
}

export const getCalendarEventTypes = (personId, viewRange, targetDate) => {
    targetDate = targetDate ? formatYYYY_MM_DD(targetDate) : ''
    return dispatch => {
	      return fetch(`${apiHost}ebi/calendarEventTypes/` + personId, {
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
	          viewRange,
	          targetDate
	        })
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
	          dispatch({ type: types.CALENDAR_EVENT_TYPES_INIT, payload: response })
	      })
   	}
}

export const getCalendarEventConfig = (personId) => {
    return dispatch => {
	      return fetch(`${apiHost}ebi/calendarEventConfig/get/` + personId, {
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
	          dispatch({ type: types.CALENDAR_EVENT_CONFIG_INIT, payload: response })
	      })
   	}
}

export const setCalendarEventConfig = (personId, calendarEventTypes, calendarDateRange) => {
    return dispatch => {
	      return fetch(`${apiHost}ebi/calendarEventConfig/set/` + personId, {
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
						calendarEventTypes,
	          //viewRange, //We are not saving off the viewRange and targetDate, yet.  I need to find out how to tie into the big calendar to set them on clicking on those details.
	          //targetDate //And, the targetDate is not being received as a date so the entire object is set to null on the backend.
	        })
	      })
	      .then(response => {
						dispatch(getCalendarEventConfig(personId))
						dispatch(getCalendarEvents(personId, calendarDateRange))
				})
   	}
}
