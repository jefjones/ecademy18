import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'
import * as loggedIn from './logged-in'
import * as personConfig from './person-config'
import * as companyConfig from './company-config'
import * as accessRoles from '../actions/access-roles'
import * as student from './student'
import * as maritalStatus from './marital-status'
import * as genders from './gender'
import * as countries from './countries'
import * as gradeLevel from './grade-level'
import * as howLearnOfUs from './how-learn-of-us'
import * as relationTypes from './relation-types'
import * as registrationCustody from './registration-custody'
import * as registration from '../actions/registration'
import * as usStates from '../actions/us-states'
import * as languageList from './language-list'
import * as intervals from './semester-intervals'
import * as schoolYears from './school-years'
import * as tutorialVideos from './tutorial-videos'
import {guidEmpty} from '../utils/guidValidate'

import {apiHost} from '../api_host'

export const setRegistrationSchoolCode = (schoolCode) => {
    return { type: types.SCHOOL_CODE_INIT, payload: schoolCode }
}

export const getRegistration = (personId, registrationPersonId, schoolYearId='60418981-dd92-462b-a791-c8d21c0f810e') => {
    return dispatch => {
				let storage = localStorage.getItem("registration")
				storage && dispatch({ type: types.REGISTRATION_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/registration/` + personId + `/` + registrationPersonId + `/` + schoolYearId, {
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
						dispatch({ type: types.REGISTRATION_INIT, payload: response })
						localStorage.setItem("registration", JSON.stringify(response))
        })
		}
}

export const getRegistrationByStudent = (personId, studentPersonId, schoolYearId) => {
    if (!schoolYearId) schoolYearId = guidEmpty
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {studentProfile: true} })
        fetch(`${apiHost}ebi/registrationReport/studentProfile/` + personId + `/` + studentPersonId + `/` + schoolYearId, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {studentProfile: false} })
						dispatch({ type: types.REGISTRATION_INIT, payload: response })
        })
		}
}

export function loginError(error) {
    return { error, type: types.LOGGED_FAILED }
}

export function logout() {
    return { type: types.LOGGED_OUT }
}

export function loginRequest(email, password) {
    const user = {email: email, password: password}
    return { user, type: types.LOGIN_ATTEMPT }
}

export function forgotPassword(emailAddress, phone) {
    emailAddress = emailAddress ? emailAddress : 'empty'
    phone = phone ? phone : 'empty'

    return dispatch =>
    fetch(`${apiHost}ebi/person/forgotPassword/` + emailAddress + `/` + phone, {
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
    .then(response => response.json())
    .then(response => dispatch({ type: types.PASSWORD_RESET_REQUEST, payload: response }))
}

export function setResetPasswordResponse(resetPasswordCode, emailAddress, password) {
    return dispatch =>
    fetch(`${apiHost}ebi/person/resetPassword/` + resetPasswordCode + `/` + emailAddress + `/` + password, {
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
    .then(response => response.json())
    .then(response => {
        dispatch({ type: types.PASSWORD_RESET_COMPLETE, payload: response })
				alert("Your password has been reset.  You will be redirected to the login page to login with your new password.")
				navigate('/login')
    })
}

export function registrationLogin(userData, schoolCode, adminPersonId='00000000-0000-0000-0000-000000000000', registrationPersonId='00000000-0000-0000-0000-000000000000') {
    return dispatch =>
		    fetch(`${apiHost}ebi/person/login/` + adminPersonId + `/` + registrationPersonId, {
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
		            isNewAccount: userData.isNewAccount,
								isParentRegistration: true,
								schoolCode,
								companyId: userData.companyId,
		            firstName: userData.firstName,
		            lastName: userData.lastName,
		            fullName: userData.fullName,
		            username: userData.username,
                emailAddress: userData.emailAddress,
		            password: userData.clave,
		            //type: userData.type,
		            socialMediaId: userData.socialMediaId,
		            socialMediaType: userData.socialMediaType,
		            recaptchaResponse: userData.recaptchaResponse,
								schoolYearId: userData.schoolYearId,
		        }),
		    })
		    .then(response => {
		        if (response.status >= 200 && response.status < 300) {
		            return response.json()
		        } else {
		            throw new Error('Invalid Login')
		        }
		    })
		    .then(response => {
		        if (response.loginPerson.fullName === "MATCHING EMAIL ADDRESS FOUND") {
		            dispatch({ type: types.LOGIN_MATCHING_RECORD, payload: "MATCHING EMAIL ADDRESS FOUND" })
		        } else {
		            localStorage.setItem("authToken", JSON.stringify(response.token).replace(/"/g, ''))
								localStorage.setItem("person", JSON.stringify(response))
		            let personId = response.loginPerson.personId
		            Promise.all([dispatch({ type: types.LOGGED_SUCCESSFULLY, payload: response.loginPerson }),
		                dispatch(loggedIn.setLoggedIn(true))])
		                .then(
		                    dispatch(personConfig.init(personId)),
												dispatch(companyConfig.init(personId)),
												dispatch(accessRoles.getAccessRoles(personId)),
												dispatch(maritalStatus.init(personId)),
												dispatch(intervals.init(personId)),
												dispatch(schoolYears.init(personId)),
												dispatch(genders.init(personId)),
												dispatch(countries.init(personId)),
												dispatch(usStates.init()),
												dispatch(gradeLevel.init()),
												dispatch(howLearnOfUs.init()),
		                    dispatch(accessRoles.getAccessRoles(personId)),
												dispatch(registration.getRegistration(personId, personId)),
												dispatch(relationTypes.init(personId)),
												dispatch(registrationCustody.init(personId)),
												dispatch(languageList.init()),
												dispatch(tutorialVideos.getTutorialVideos()),
		                    dispatch(student.getStudents(personId)))
		                .then(navigate("/firstNav/10")) //schoolYearId: 10
		            }
		        }
		    )
		    .catch(response => {
		        dispatch({ type: types.LOGGED_FAILED})
		    })
}

export const sendLoginInstructions = (personId, studentPersonId) => {
    return dispatch =>
        fetch(`${apiHost}ebi/registration/sendLoginInstructions/` + personId + `/` + studentPersonId, {
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


export const initNextYearRegistration = (personId, schoolYearId='60418981-dd92-462b-a791-c8d21c0f810e') => {
    return dispatch =>
        fetch(`${apiHost}ebi/registration/nextYear/` + personId + `/` + schoolYearId, {
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
						dispatch(getRegistration(personId, personId, schoolYearId))
        })
}


export const addPreviousStudentThisYear = (personId, studentPersonId, schoolYearId='60418981-dd92-462b-a791-c8d21c0f810e') => {
    schoolYearId = '60418981-dd92-462b-a791-c8d21c0f810e'; //SchoolYearId: 2021 is 60418981-DD92-462B-A791-C8D21C0F810E
    return dispatch =>
        fetch(`${apiHost}ebi/registration/addPrevStudent/${personId}/${studentPersonId}/${schoolYearId}`, {
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
						dispatch(getRegistration(personId, personId, schoolYearId))
        })
}


export const updateStudentProfile = (personId, studentPersonId, withdrawnDate, selfPaced, newNote, schoolYearId) => {
    return dispatch =>
        fetch(`${apiHost}ebi/registration/updateStudentProfile/` + personId + `/` + studentPersonId + `/` + (withdrawnDate || ' ') + `/` + (selfPaced || ' ') + `/` + (encodeURIComponent(newNote) || 'EMPTY') + `/` + schoolYearId, {
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
						dispatch(getRegistrationByStudent(personId, studentPersonId, schoolYearId))
        })
}

export const removeStudentAdminNote = (personId, studentPersonId, studentAdminNoteId, schoolYearId) => {
    return dispatch =>
        fetch(`${apiHost}ebi/registration/remove/studentAdminNote/` + personId + `/` + studentAdminNoteId, {
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
						dispatch(getRegistrationByStudent(personId, studentPersonId, schoolYearId))
        })
}

export const removeStudentDocumentFile = (personId, studentDocumentId) => {
    return dispatch => {
				//dispatch({type: types.FETCHING_RECORD, payload: {courseDocuments: true} });
        return fetch(`${apiHost}ebi/studentDocuments/remove/` + personId + `/` + studentDocumentId, {
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
        .then(() => {
						dispatch({ type: types.STUDENT_DOCUMENTS_REMOVE, payload: studentDocumentId })
        })
    }
}
