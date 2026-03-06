import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'
import * as registration from '../actions/registration'

export const getStudents = (personId, registrationPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/regStudent/` + personId + `/` + registrationPersonId, {
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
						dispatch({ type: types.REGISTRATION_STUDENT, payload: response })
        })
    }
}

export const addOrUpdateStudent = (personId, person, peopleApprovedToPickup, accreditation, medical, background, stayOrFinish, schoolYearId) => {
	 	if (person && (!person.personId || person.personId === "0")) {
				person.personId = guidEmpty
		}
		//The names in the receiving object are slightly different
		person.Fname = person.firstName
		person.Mname = person.middleName
		person.Lname = person.lastName
		person.username = person.username
		person.emailAddress = person.emailAddress

    return dispatch => {
        return fetch(`${apiHost}ebi/regStudent/` + personId, {
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
							schoolYearId,
							personData: person,
              peopleApprovedToPickup,
							accreditation,
							medical,
							background,
						}),
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
        })
    }
}

export const removeRegStudent = (personId, studentPersonId, schoolYearId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/regStudent/remove/` + personId + `/` + studentPersonId + `/` + schoolYearId, {
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

export const removeRegStudentFileUpload = (personId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/regStudent/removeFileUpload/` + personId + `/` + fileUploadId, {
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

export const setFinalized = (studentPersonId) => { //We are probably going to need to track the schoolYearId in here somewhere.  This is used by Manheim.
    return dispatch => {
        return fetch(`${apiHost}ebi/regStudent/setFinalized/` + studentPersonId, {
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
						dispatch({ type: types.REGISTRATION_STUDENT_FINALIZE, payload: '' })
        })
    }
}
