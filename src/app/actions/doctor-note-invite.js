import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import { browserHistory } from 'react-router';
import * as loggedIn from './logged-in';
import * as personConfig from './person-config';
import * as companyConfig from './company-config';
import * as accessRoles from '../actions/access-roles.js';
import * as student from './student';
import * as genders from './gender';
import * as countries from './countries';
import * as usStates from '../actions/us-states.js';
import * as languageList from './language-list';
import * as tutorialVideos from './tutorial-videos';
import {guidEmpty} from '../utils/guidValidate.js';

export const getDoctorNoteInvites = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNoteInvitesSettings', value: true } });
        return fetch(`${apiHost}ebi/doctorNoteInvite/` + personId, {
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
			                return response.json();
			            } else {
			                const error = new Error(response.statusText);
			                error.response = response;
			                throw error;
			            }
			        })
			        .then(response => {
			            dispatch({type: types.DOCTOR_NOTE_INVITES_INIT, payload: response});
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNoteInvitesSettings', value: false } });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'doctorNoteInvitesSettings', value: false } }));
    }
}

export const addOrUpdateDoctorNoteInvite = (personId, doctorNoteInvite) => {
    return dispatch => {
				dispatch({type: types.DOCTOR_NOTE_INVITES_UPDATE, payload: doctorNoteInvite});
        return fetch(`${apiHost}ebi/doctorNoteInvite/add/` + personId, {
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
            body: JSON.stringify(doctorNoteInvite)
        })
    }
}

export const removeDoctorNoteInvite = (personId, doctorNoteInviteId) => {
    return dispatch => {
				dispatch({type: types.DOCTOR_NOTE_INVITES_DELETE, payload: doctorNoteInviteId});
        return fetch(`${apiHost}ebi/doctorNoteInvite/remove/` + personId + `/` + doctorNoteInviteId, {
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


export const setDoctorNoteInviteIdLogin = (doctorNoteInviteId) => {
    return dispatch => {
				dispatch({type: types.DOCTOR_NOTE_INVITE_LOGIN, payload: doctorNoteInviteId});
		}
}


export function loginDoctorOffice(office) {
		if (!office.doctorNoteInviteId || office.doctorNoteInviteId === '0') office.doctorNoteInviteId = guidEmpty;
		office.password = office.clave;

    return dispatch =>
		    fetch(`${apiHost}ebi/person/login/doctor`, {
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
		        body: JSON.stringify(office),
		    })
		    .then(response => {
		        if (response.status >= 200 && response.status < 300) {
		            return response.json();
		        } else {
		            throw new Error('Invalid Login');
		        }
		    })
		    .then(response => {
		        if (response.loginPerson.fullName === "MATCHING EMAIL ADDRESS FOUND") {
		            dispatch({ type: types.LOGIN_MATCHING_RECORD, payload: "MATCHING EMAIL ADDRESS FOUND" });
		        } else {
		            localStorage.setItem("authToken", JSON.stringify(response.token).replace(/"/g, ''))
								localStorage.setItem("person", JSON.stringify(response))
		            let personId = response.loginPerson.personId;
		            Promise.all([dispatch({ type: types.LOGGED_SUCCESSFULLY, payload: response.loginPerson }),
		                dispatch(loggedIn.setLoggedIn(true))])
		                .then(
		                    dispatch(personConfig.init(personId)),
												dispatch(companyConfig.init(personId)),
												dispatch(accessRoles.getAccessRoles(personId)),
												dispatch(genders.init(personId)),
												dispatch(countries.init(personId)),
												dispatch(usStates.init()),
												dispatch(languageList.init()),
												dispatch(tutorialVideos.getTutorialVideos()),
		                    dispatch(student.getStudents(personId)))
		                .then(browserHistory.push("/firstNav"))
		            }
		        }
		    )
		    .catch(response => {
		        dispatch({ type: types.LOGGED_FAILED});
		    })
}
