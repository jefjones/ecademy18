import * as types from '../actions/actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'
import * as registration from '../actions/registration'

export const addOrUpdatePerson = (personId, person, schoolYearId) => {
	 	if (person && (!person.personId || person.personId === "0")) {
				person.personId = guidEmpty
		}
     
    return dispatch => {
        return fetch(`${apiHost}ebi/regGuardianContact/` + personId + '/' + schoolYearId, {
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
            body: JSON.stringify(person),
        })
        .then(response => {
						dispatch(registration.getRegistration(personId, personId, schoolYearId))
        })
    }
}

export const addOrUpdateRelation = (personId, guardianPersonId, studentPersonId, relationTypeId, schoolYearId) => {
    return dispatch => {
				dispatch({ type: types.REGISTRATION_RELATION_UPDATE, payload: {guardianPersonId, studentPersonId, relationTypeId} })
        return fetch(`${apiHost}ebi/regGuardianContactRelation/` + personId + `/` + guardianPersonId + `/` + studentPersonId + `/` + relationTypeId + `/` + schoolYearId, {
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
				// .then(response => {
				// 		dispatch(registration.getRegistration(personId, personId));
        // })
    }
}

export const addOrUpdateCustody = (personId, guardianPersonId, studentPersonId, registrationCustodyId, schoolYearId) => {
    return dispatch => {
				dispatch({ type: types.REGISTRATION_CUSTODY_UPDATE, payload: {guardianPersonId, studentPersonId, registrationCustodyId} })
        return fetch(`${apiHost}ebi/regGuardianContactCustody/` + personId + `/` + guardianPersonId + `/` + studentPersonId + `/` + registrationCustodyId + `/` + schoolYearId, {
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

export const removeGuardianContact = (personId, contactPersonId, personType, schoolYearId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/regGuardianContact/remove/` + personId + `/` + contactPersonId + `/` + personType + `/` + schoolYearId, {
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
						dispatch(registration.getRegistration(personId, personId, schoolYearId))
        })
    }
}
