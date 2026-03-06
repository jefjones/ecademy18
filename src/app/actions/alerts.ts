import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("alerts")
				!!storage && dispatch({ type: types.COURSE_SIGNUP_ALERTS_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/alerts/` + personId, {
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
			            dispatch({type: types.COURSE_SIGNUP_ALERTS_INIT, payload: response})
									localStorage.setItem("alerts", JSON.stringify(response))
			        })
    }
}

export const addOrUpdateAlert = (personId, alert) => {
    return dispatch => {
				dispatch({ type: types.COURSE_SIGNUP_ALERT_ADD_OR_REMOVE, payload: alert })
        return fetch(`${apiHost}ebi/alert/addOrUpdate/` + personId, {
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
            body: JSON.stringify(alert)
        })
        .then(response => {
            dispatch(init(personId))
        })
    }
}

export const removeAlert = (personId, alertWhenId, courseScheduledId) => {
    return dispatch => {
				dispatch({ type: types.COURSE_SIGNUP_ALERT_REMOVE, payload: courseScheduledId })
        return fetch(`${apiHost}ebi/alert/remove/` + personId + `/` + alertWhenId, {
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
    }
}
