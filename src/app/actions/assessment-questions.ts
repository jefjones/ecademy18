import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const init = (personId, studentPersonId, assessmentId, assignmentId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/${personId}/${studentPersonId}/${assessmentId}/${assignmentId}` , {
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
            dispatch({type: types.ASSESSMENT_QUESTIONS_INIT, payload: response})
        })
    }
}

export const addOrUpdateAssessmentItem = (personId, assessmentId, assessmentQuestion) => {
	if (typeof assessmentQuestion.questionText === 'object')
			assessmentQuestion.questionText = Object.values(assessmentQuestion.questionText).join('~^')
	if (typeof assessmentQuestion.toMatchText === 'object')
			assessmentQuestion.toMatchText = Object.values(assessmentQuestion.toMatchText).join('~^')
	if (typeof assessmentQuestion.correctAnswer === 'object')
			assessmentQuestion.correctAnswer = Object.values(assessmentQuestion.correctAnswer).join(',');  //This one is not ~^.  It is a comma delimited.

  assessmentQuestion.assessmentQuestionId = assessmentQuestion.assessmentQuestionId
      ? assessmentQuestion.assessmentQuestionId
      : guidEmpty

	assessmentQuestion.assessmentId = assessmentQuestion.assessmentId
      ? assessmentQuestion.assessmentId
      : guidEmpty

	assessmentQuestion.solutionFileUploadId = assessmentQuestion.solutionFileUploadId
			? assessmentQuestion.solutionFileUploadId
			: guidEmpty

	assessmentQuestion.pointsPossible = isNaN(assessmentQuestion.pointsPossible) ? 0 : Number(assessmentQuestion.pointsPossible)
	assessmentQuestion.solutionText = assessmentQuestion.solutionText ? assessmentQuestion.solutionText : ''

	assessmentQuestion.fileUploads = ""
	assessmentQuestion.websiteLinks = ""
	assessmentQuestion.entryDate = null

    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/addOrUpdate/` + personId + `/` + assessmentId, {
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
            body: JSON.stringify(assessmentQuestion),
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const addOrUpdateAssessmentItemMatching = (personId, assessmentId, assessmentQuestion) => {
		if (typeof assessmentQuestion.questionText === 'object')
				assessmentQuestion.questionText = Object.values(assessmentQuestion.questionText).join('~^')
		if (typeof assessmentQuestion.toMatchText === 'object')
				assessmentQuestion.toMatchText = Object.values(assessmentQuestion.toMatchText).join('~^')
		if (typeof assessmentQuestion.correctAnswer === 'object')
				assessmentQuestion.correctAnswer = Object.values(assessmentQuestion.correctAnswer).join(',');  //This one is not ~^.  It is a comma deimiter

	  assessmentQuestion.assessmentQuestionId = assessmentQuestion.assessmentQuestionId
	      ? assessmentQuestion.assessmentQuestionId
	      : guidEmpty

		assessmentQuestion.assessmentId = assessmentQuestion.assessmentId
	      ? assessmentQuestion.assessmentId
	      : guidEmpty

		assessmentQuestion.pointsPossible = isNaN(assessmentQuestion.pointsPossible) ? 0 : Number(assessmentQuestion.pointsPossible)
		assessmentQuestion.standardIds = assessmentQuestion.standardIds && assessmentQuestion.standardIds.length > 0 && assessmentQuestion.standardIds.join(',')

    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/matching/addOrUpdate/${personId}/${assessmentId}/${assessmentQuestion.assessmentQuestionId}/${encodeURIComponent(assessmentQuestion.questionText)}/${encodeURIComponent(assessmentQuestion.toMatchText)}/${assessmentQuestion.pointsPossible}/${assessmentQuestion.correctAnswer}/${encodeURIComponent(assessmentQuestion.solutionText || 'EMPTY')}/${assessmentQuestion.standardIds || 'EMPTY'}`, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestion = (personId, assessmentId, assessmentQuestionId) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {assessmentQuestions: true} })
        return fetch(`${apiHost}ebi/assessmentQuestions/remove/` + personId + `/` + assessmentId + `/` + assessmentQuestionId, {
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
            dispatch({type: types.FETCHING_RECORD, payload: {assessmentQuestions: 'ready'} })
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}


export const saveAssessmentQuestionWebsiteLink = (personId, assessmentQuestionId, websiteLink) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/websiteLink/` + personId + `/` + assessmentQuestionId + `/` + websiteLink, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionFileUpload = (personId, assessmentQuestionId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeFileUpload/` + personId + `/` + assessmentQuestionId  + `/` + fileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionQuestionFile = (personId, assessmentQuestionId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeQuestionFile/` + personId + `/` + assessmentQuestionId  + `/` + fileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionAnswerFile = (personId, assessmentQuestionId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeAnswerFile/` + personId + `/` + assessmentQuestionId  + `/` + fileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionToMatchFile = (personId, assessmentQuestionId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeToMatchFile/` + personId + `/` + assessmentQuestionId  + `/` + fileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionAnswerOption = (personId, assessmentQuestionId, answerIndex, runFunction=()=>{}) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeAnswerOption/` + personId + `/` + assessmentQuestionId  + `/` + answerIndex, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
						dispatch(runFunction)
        })
    }
}

export const removeAssessmentQuestionSolutionFile = (personId, assessmentQuestionId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeSolutionFile/` + personId + `/` + assessmentQuestionId  + `/` + fileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionQuestionRecording = (personId, assessmentQuestionId, recordingFileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeQuestionRecording/` + personId + `/` + assessmentQuestionId  + `/` + recordingFileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionAnswerRecording = (personId, assessmentQuestionId, recordingFileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeAnswerRecording/` + personId + `/` + assessmentQuestionId  + `/` + recordingFileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionSolutionRecording = (personId, assessmentQuestionId, recordingFileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeSolutionRecording/` + personId + `/` + assessmentQuestionId  + `/` + recordingFileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const removeAssessmentQuestionWebsiteLink = (personId, assessmentQuestionId, websiteLink) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/removeWebsiteLink/` + personId + `/` + assessmentQuestionId  + `/` + websiteLink, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}


export const reorderAssessmentQuestions = (personId, assessmentQuestionId, newSequence) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestions/reorder/` + personId + `/` + assessmentQuestionId  + `/` + newSequence, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const addOrUpdateAssessmentAnswer = (personId, assessmentQuestionId, answer, assignmentId) => {
		if ((typeof answer === 'object' && answer.length === 0) || !answer) {
				answer = 'EMPTYANSWER'
		}
    return dispatch => {
				dispatch({type: types.ASSESSMENT_QUESTION_ANSWER_SET, payload: {assessmentQuestionId, answer}})
        return fetch(`${apiHost}ebi/assessmentQuestion/learnerAnswer/${personId}/${assessmentQuestionId}/${answer}/${assignmentId}`, {
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
            dispatch({type: types.ASSESSMENT_QUESTIONS_INIT, payload: response})
        })
    }
}

export const updateTeacherAssessmentLearnerAnswer = (personId, studentPersonId, assessmentQuestionId, score, assignmentId) => {
		score = score || score === 0 ? score : 'EMPTYSCORE'
    return dispatch => {
				//dispatch({type: types.ASSESSMENT_QUESTIONS_INIT, payload: []});
        return fetch(`${apiHost}ebi/assessmentQuestion/teacherUpdateLearnerAnswer/${personId}/${studentPersonId}/${assessmentQuestionId}/${score}/${assignmentId}`, {
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
        //     if (response.status >= 200 && response.status < 300) {
        //         return response.json();
        //     } else {
        //         const error = new Error(response.statusText);
        //         error.response = response;
        //         throw error;
        //     }
        // })
        // .then(response => {
        //     dispatch({type: types.ASSESSMENT_QUESTIONS_INIT, payload: response});
        // })
    }
}

export const saveVoiceRecording = (personId, voiceRecording) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentQuestion/voiceRecording/` + personId, {
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
            body: JSON.stringify({
                voiceRecording,
            })
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
            dispatch({type: types.ASSESSMENT_QUESTIONS_INIT, payload: response})
        })
    }
}

export const removeLearnerAnswerFile = (personId, assessmentQuestionId, fileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/assessmentLearner/removeFileUpload/` + personId + `/` + assessmentQuestionId  + `/` + fileUploadId, {
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
            dispatch({ type: types.ASSESSMENT_QUESTIONS_INIT, payload: response })
        })
    }
}

export const updateAssessmentLocalAnswer = (assessmentId, assessmentQuestionId, answer) => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_QUESTION_ANSWER_SET, payload: {assessmentId, assessmentQuestionId, answer} })
    }
}

export const clearAssessmentQuestion = () => {
    return dispatch => {
				dispatch({type: types.ASSESSMENT_QUESTION_CLEAR, payload: {} })
    }
}
