import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'registrationPending', value: true } })
        return fetch(`${apiHost}ebi/registrationPending/` + personId, {
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
						dispatch({ type: types.REGISTRATION_PENDING_INIT, payload: response })
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'registrationPending', value: false } })
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'registrationPending', value: false } }))
    }
}

export const setRegistrationPaidDate = (personId, registrationTableId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/registrationPending/setPaidDate/` + personId + `/` + registrationTableId, {
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
        .then(() => dispatch(init(personId)))
    }
}


export const setRegistrationAcceptedDenied = (personId, registrationTableId, studentPersonId, regApprovedOrDenied, regReviewNote) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/registrationPending/setReview/` + personId + `/` + registrationTableId + `/` + studentPersonId + `/` + regApprovedOrDenied + `/` + regReviewNote, {
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
        .then(() => dispatch(init(personId)))
    }
}

export const setRegistrationFinalizedDate = (personId, registrationPersonId, schoolYearId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/registrationPending/setFinalizedDate/` + personId + `/` + registrationPersonId + `/` + schoolYearId, {
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
        .then(() => dispatch(init(personId)))
    }
}

export const updateRegistrationStatus = (personId, registrationTableId, registrationStatus) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/registrationPending/setStatus/` + personId + `/` + registrationTableId + `/` + registrationStatus, {
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
        .then(() => dispatch(init(personId)))
    }
}
