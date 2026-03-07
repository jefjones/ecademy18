import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const init = (personId, studentPersonId, courseScheduledId, clearRedux=true) => {
    return dispatch => {
        clearRedux && dispatch({type: types.STUDENT_ASSIGNMENTS_INIT, payload: []}); //Clear it out before calling the next one.
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentAssignments', value: true } })
        return fetch(`${apiHost}ebi/studentAssignments/` + personId + `/` + studentPersonId + `/` + courseScheduledId , {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentAssignments', value: false } })
            dispatch({type: types.STUDENT_ASSIGNMENTS_INIT, payload: response})
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentAssignments', value: false } }))
    }
}

export const addOrUpdateStudentResponse = (personId, courseEntryId, courseScheduledId, studentResponse, assignmentId, initFunction=() => {}, studentPersonId) => {
		//studentResponse.personId = personId; //if this isTeacherResponse, then this personId should be the student.
		studentResponse.courseEntryId = courseEntryId
		studentResponse.assignmentId = assignmentId
    assignmentId = typeof assignmentId === "object" || !assignmentId
        ? guidEmpty
        : assignmentId

		let sendStudentResponse = {
				personId: studentResponse.personId, //This needs to be the student personId even on a teacher response.
				studentAssignmentResponseId: studentResponse.studentTextResponse && studentResponse.studentTextResponse.id, //I don't think that this is valid any more.
				assignmentId: studentResponse.assignmentId,
				title: studentResponse.assignmentTitle || studentResponse.title,
				contentTypeCode: studentResponse.contentTypeCode,
				contentTypeId: studentResponse.contentTypeId,
				contentTypeName: studentResponse.contentTypeName,
				courseScheduledId: courseScheduledId,
				courseEntryId: courseEntryId,
				gradingType: studentResponse.gradingType || '',
				isTeacherResponse: studentResponse.isTeacherResponse || false,
				responseTypeName: studentResponse.responseTypeName || '',
				score: null,
				newWebsiteLink: studentResponse.newWebsiteLink || '',
				newTextResponse: studentResponse.newTextResponse || '',
		}

    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {studentAssignments: true} })
        return fetch(`${apiHost}ebi/studentAssignmentResponse/` + personId + `/` + courseEntryId + `/` + courseScheduledId + `/` + assignmentId, {
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
            body: JSON.stringify(sendStudentResponse),
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
            dispatch({type: types.FETCHING_RECORD, payload: {studentAssignments: 'ready'} })
            dispatch({type: types.STUDENT_ASSIGNMENTS_INIT, payload: response})
						dispatch(init(personId, studentPersonId || personId, courseScheduledId))
            dispatch(initFunction)
        })
    }
}

export const removeStudentResponse = (personId, studentAssignmentResponseId, deleteFile='') => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {studentAssignments: true} })
        return fetch(`${apiHost}ebi/studentAssignmentResponse/remove/` + personId + `/` + studentAssignmentResponseId + `/` + deleteFile, {
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
            dispatch({type: types.FETCHING_RECORD, payload: {studentAssignments: 'ready'} })
            dispatch({ type: types.STUDENT_ASSIGNMENTS_INIT, payload: response })
        })
    }
}

export const setAssignmentEditMode = (assignmentId) => {
    return dispatch => {
        dispatch({type: types.ASSIGNMENT_SCORE_EDIT_MODE_SET, payload: { assignmentId }})
    }
}

export const saveAssignmentWebsiteLink = (personId, assignmentId, websiteLink) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} })
        return fetch(`${apiHost}ebi/assignments/websiteLink/` + personId, {
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
            body: JSON.stringify({ assignmentId, websiteLink: encodeURIComponent(websiteLink) })
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
            dispatch({type: types.FETCHING_RECORD, payload: {assignments: 'ready'} })
            dispatch({ type: types.ASSIGNMENTS_INIT, payload: response })
        })
    }
}
