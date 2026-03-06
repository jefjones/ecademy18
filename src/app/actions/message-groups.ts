import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getMessageGroups = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("messageGroups")
				storage && dispatch({ type: types.MESSAGE_GROUPS_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/messageGroups/` + personId, {
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
						dispatch({ type: types.MESSAGE_GROUPS_INIT, payload: response })
						localStorage.setItem("messageGroups", JSON.stringify(response))
        })
    }
}

export const addOrUpdateMessageGroup = (personId, messageGroup) => {
		if (messageGroup && !messageGroup.messageGroupId) messageGroup.messageGroupId = '00000000-0000-0000-0000-000000000000'

    return dispatch => {
        return fetch(`${apiHost}ebi/messageGroups/` + personId, {
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
            body: JSON.stringify(messageGroup),
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
						dispatch(getMessageGroups(personId))
						dispatch({ type: types.MESSAGE_GROUPID_CHOSEN, payload: response })
        })
    }
}

export const removeMessageGroup = (personId, messageGroupId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/messageGroups/remove/` + personId + `/` + messageGroupId, {
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
						dispatch(getMessageGroups(personId))
        })
    }
}
