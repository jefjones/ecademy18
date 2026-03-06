import * as types from './actionTypes'
import getInvitesPending from '../services/editor-invite-pending'
import * as actionWork from './works'
import {apiHost} from '../api_host'

function setPending( editorInvitesPending=[] ) {
    return { type: types.EDITOR_INVITE_PENDING, payload: editorInvitesPending }
}

export const init = (personId) => dispatch => {
    return getInvitesPending(personId).then( n => dispatch( setPending(n)))
}

export const deleteInvite = (personId, friendInvitationId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/inviteNewEditor/delete/` + personId + `/` + friendInvitationId, {
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
        dispatch ({ type: types.EDITOR_INVITE_PENDING, payload: response })
    })
    //.catch(error => { console.l og('request failed', error); });
}

export const acceptInvite = (personId, friendInvitationId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/inviteNewEditor/accept/` + personId + `/` + friendInvitationId, {
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
        dispatch({ type: types.EDITOR_INVITE_PENDING, payload: response })
        dispatch(actionWork.init(personId))
    })
    //.catch(error => { console.l og('request failed', error); });
}

export const resendInvite = (personId, friendInvitationId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/inviteNewEditor/resend/` + personId + `/` + friendInvitationId, {
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
    //.catch(error => { console.l og('request failed', error); });
}
