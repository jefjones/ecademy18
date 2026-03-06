import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const init = (personId, courseScheduledId, jumpToAssignmentId='00000000-0000-0000-0000-000000000000', assignmentId='00000000-0000-0000-0000-000000000000', clearRedux=true) => {
		assignmentId = assignmentId ? assignmentId : '00000000-0000-0000-0000-000000000000'

    return dispatch => {
				clearRedux && dispatch({type: types.GRADEBOOK_INIT, payload: []})
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradebookEntry', value: true } })
        return fetch(`${apiHost}ebi/gradebook/` + personId + `/` + courseScheduledId + `/` + jumpToAssignmentId + `/` + assignmentId, {
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
            dispatch({type: types.GRADEBOOK_INIT, payload: response})
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradebookEntry', value: false } })
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradebookEntry', value: false } }))
    }
}

export const clearGradebook = () => {
		return dispatch => {
				dispatch({type: types.GRADEBOOK_INIT, payload: []})
		}
}

export const setGradebookScorePreBlur = (personId, courseScheduledId, studentPersonId, assignmentId, score, runFunction=() => {}) => {
		//This function is the handleScore entry part of the StudentAssignment page (and probably the Gradebook Review), but as soon as the
		//	user leave the edit control (blur) then setGradebookScore is called and the score is updated on the server.
		score = score === '' && score !== 0 ? 'EMPTY' : score;  //blank means not yet included in the grade.  0 means now it can be calculated as incomplete.
    return dispatch => {
				dispatch({type: types.STUDENT_ASSIGNMENT_SCORE_ENTRY, payload: { assignmentId, score }})
    }
}

export const setLocalGradebookScore = (studentPersonId, assignmentId, score) => {
    return dispatch => {
				dispatch({type: types.GRADEBOOK_STUDENT_ASSIGNMENT_SCORE, payload: { studentPersonId, assignmentId, score }})
    }
}

export const setLocalGradebookOverwritePercent = (studentPersonId, intervalId, gradePercent) => {
    return dispatch => {
				dispatch({type: types.GRADEBOOK_GRADE_OVERWRITE, payload: { studentPersonId, intervalId, field: 'gradePercent', value: gradePercent }})
    }
}

export const getGradebookOverallGrade = (personId, studentPersonId, courseScheduledId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/gradebookStudent/overallGrade/${personId}/${studentPersonId}/${courseScheduledId}`, {
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
						dispatch({type: types.GRADEBOOK_STUDENT_OVERALLGRADE, payload: {studentPersonId, overallGrade: response} })
        })
    }
}

export const setGradebookScore = (personId, courseScheduledId, studentPersonId, assignmentId, score, runFunction=()=>{}) => {
		//let scoreNotIncluded = score === 'x' ? true : false;  //We took the x away.  Now the teacher can go to Student Assigment Assign to take away an assignment that they don't want to include in the student's specific assignment list and grade.
		//score = score === 'x' || (score === '' && score !== 0) ? 'EMPTY' : score;
		score = score === '' && score !== 0 ? 'EMPTY' : score;  //blank means not yet included in the grade.  0 means, now it can be calculated as incomplete.
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeBook/add/` + personId + `/` + courseScheduledId + `/` + studentPersonId + `/` + score + `/` + assignmentId, {
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
						dispatch(runFunction)
						if (studentPersonId && studentPersonId !== guidEmpty && courseScheduledId && courseScheduledId !== guidEmpty)  {
								dispatch(getGradebookOverallGrade(personId, studentPersonId, courseScheduledId))
						}
        })
    }
}

export const setGradebookScoreColumnZero = (personId, courseScheduledId, assignmentId, multScore, runFunction=() => {}) => {
		multScore = multScore ? multScore : '0'
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeBook/setColumnZero/` + personId + `/` + courseScheduledId + `/` + assignmentId + `/` + multScore, {
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
				.then(() => dispatch(runFunction))
    }
}

export const getGradebookSummary = (personId, courseScheduledId) => {
    return dispatch => {
				dispatch({type: types.GRADEBOOK_SUMMARY_INIT, payload: []})
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradebookSummary', value: true } })
        return fetch(`${apiHost}ebi/gradebook/summary/${personId}/${courseScheduledId}`, {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradebookSummary', value: false } })
            dispatch({type: types.GRADEBOOK_SUMMARY_INIT, payload: response})
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'gradebookSummary', value: false } }))
    }
}

export const setPassFailSequence = (studentPersonId, assignmentId, nextSequence, courseScheduledId, personId, runFunction=()=>{}) => {
    return dispatch => {
				dispatch({type: types.GRADEBOOK_SCORE_UPDATE_PASSFAIL, payload: {studentPersonId, assignmentId, nextSequence}})
        return fetch(`${apiHost}ebi/gradeBook/set/passFail/` + studentPersonId + `/` + assignmentId + `/` + nextSequence + `/` + courseScheduledId + `/` + personId, {
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
							.then(() => dispatch(runFunction))
    }
}

export const setGradeOverwrite = (personId, courseScheduledId, studentPersonId, intervalId, field, value) => {
		if (!value || value === '') value = 'EMPTY'
    return dispatch => {
				dispatch({type: types.GRADEBOOK_GRADE_OVERWRITE, payload: {studentPersonId, intervalId, field, value}})
        return fetch(`${apiHost}ebi/gradeBook/set/gradeOverwrite/${personId}/${courseScheduledId}/${studentPersonId}/${intervalId}/${field}/${value}`, {
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
				.then(dispatch(init(personId, courseScheduledId, guidEmpty, guidEmpty, false)))
    }
}

export const finalizeGradebookGrades = (personId, courseScheduledId, intervalId) => {
    return dispatch => {
				dispatch({type: types.GRADEBOOK_FINALIZE_GRADE_DATE, payload: null })
        return fetch(`${apiHost}ebi/gradeBook/finalizeGrades/${personId}/${courseScheduledId}/${intervalId}`, {
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

export const finalizeGradeStudentSchedule = (personId, studentPersonId, courseScheduledIds, intervalId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeBook/finalizeGrades/student/schedule/${personId}/${studentPersonId}/${intervalId}`, {
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
						body: JSON.stringify(courseScheduledIds)
        })
    }
}

export const setEditMode = (assignmentId, studentPersonId) => {
    return dispatch => {
				dispatch({type: types.STUDENT_SCORE_EDIT_MODE_SET, payload: { assignmentId, studentPersonId }})
    }
}
