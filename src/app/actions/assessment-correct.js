import * as types from './actionTypes';
import {browserHistory} from 'react-router';
import {apiHost} from '../api_host.js';

export const correctAssessment = (personId, studentPersonId, assessmentId, assignmentId, runFunction=()=>{}) => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_CORRECT_INIT, payload: []});
        return fetch(`${apiHost}ebi/assessmentQuestion/correct/${personId}/${studentPersonId}/${assessmentId}/${assignmentId}`, {
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
            dispatch({type: types.ASSESSMENT_CORRECT_INIT, payload: response});
						dispatch(runFunction);
        })
    }
}

export const getCorrectedAssessment = (personId, studentPersonId, assessmentId, assignmentId) => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_CORRECT_INIT, payload: []});
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assessmentCorrect', value: true } });
        return fetch(`${apiHost}ebi/assessmentCorrected/${personId}/${studentPersonId}/${assessmentId}/${assignmentId}`, {
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
            dispatch({type: types.ASSESSMENT_CORRECT_INIT, payload: response});
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assessmentCorrect', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assessmentCorrect', value: false } }));
    }
}

export const getSameCorrectedAssessmentAllStudents = (personId, assessmentId, assessmentQuestionId) => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_CORRECT_SAME_ALL_STUDENTS, payload: []});
        return fetch(`${apiHost}ebi/assessmentCorrected/getSameAllStudents/` + personId + `/` + assessmentId  + `/` + assessmentQuestionId, {
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
            dispatch({type: types.ASSESSMENT_CORRECT_SAME_ALL_STUDENTS, payload: response});
        })
    }
}


export const retakeTest = (personId, assignmentId, assessmentId, runFunction) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/retake/${personId}/${assignmentId}/${assessmentId}`, {
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
            dispatch({type: types.ASSESSMENT_CORRECT_INIT, payload: response});
          runFunction()
        })
    }
}

export const getAssessmentsPendingEssay = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assessmentPendingEssay', value: true } });
        return fetch(`${apiHost}ebi/assessmentPendingEssay/` + personId, {
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
            dispatch({type: types.ASSESSMENT_PENDING_ESSAY, payload: response});
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assessmentPendingEssay', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assessmentPendingEssay', value: false } }));
    }
}

export const teacherEssayResponse = (personId, teacherResponse) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentPendingEssay/teacherResponse/` + personId, {
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
						body: JSON.stringify(teacherResponse),
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
            dispatch({type: types.ASSESSMENT_PENDING_ESSAY, payload: response});
						dispatch(getCorrectedAssessment(personId, teacherResponse.studentPersonId, teacherResponse.assessmentId));
        })
    }
}

export const setLocalScore = (assessmentQuestionId, score) => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_CORRECT_SCORE_UPDATE, payload: { assessmentQuestionId, score }});
    }
}

export const clearAssessmentCorrect = () => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_CORRECT_CLEAR, payload: {}});
    }
}
