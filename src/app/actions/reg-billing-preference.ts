import * as types from './actionTypes'
import {apiHost} from '../api_host'
import * as registration from '../actions/registration'

export const getProxynizationTempPassword = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/proxynization/tempPassword/` + personId, {
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
            let tempPassword = response.substring(response.indexOf('temporaryPassword'))
            tempPassword = tempPassword.substring(18, tempPassword.indexOf('&'))
            dispatch({ type: types.PROXYNIZATION_TEMP_PASSWORD, payload: tempPassword })
        })
    }
}

export const addOrUpdateBilling = (personId, billing, schoolYearId) => {
    return dispatch => {
				dispatch({ type: types.PAYMENT_PROCESS_RESPONSE, payload: {} })
        return fetch(`${apiHost}ebi/registration/billing/` + personId + `/` + schoolYearId, {
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
            body: JSON.stringify(billing),
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
						dispatch(registration.getRegistration(personId, personId, schoolYearId))
						//dispatch({ type: types.PAYMENT_PROCESS_RESPONSE, payload: response }); //JSON.parse(response) });
            let token = response
            dispatch({ type: types.PROXYNIZATION_TOKEN, payload: token })

        })
    }
}


export const clearPaymentProcessingResponse = () => {
    return dispatch => {
				dispatch({ type: types.PAYMENT_PROCESS_RESPONSE, payload: {} })
		}
}



export const finalizeNonLiahonaRegistration = (personId) => {
    return dispatch => {
				dispatch({ type: types.FINALIZE_REGISTRATION, payload: null })
        return fetch(`${apiHost}ebi/registration/finalizeNonLiahona/` + personId, {
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
						dispatch(registration.getRegistration(personId, personId))
        })
    }
}
