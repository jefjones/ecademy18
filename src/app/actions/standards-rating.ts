import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const getStandardsRating = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("standardsRating")
				!!storage && dispatch({ type: types.STANDARDS_RATING_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'standardsRating', value: true } })
        return fetch(`${apiHost}ebi/standardsRating/` + personId, {
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
			            dispatch({ type: types.STANDARDS_RATING_INIT, payload: response })
									localStorage.setItem("standardsRating", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'standardsRating', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'standardsRating', value: false } }))
    }
}

export const setStandardsRatingColor = (personId, standardsRatingDetailId, color) => {
    return dispatch => {
				dispatch({ type: types.STANDARDS_RATING_COLOR_UPDATE, payload: {standardsRatingDetailId, color} })
        return fetch(`${apiHost}ebi/standardsRating/updateColor/${personId}/${standardsRatingDetailId}/${encodeURIComponent(color)}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            }
        })
    }
}

export const addOrUpdateStandardsRatingDetail = (personId, standardsRatingDetail) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/standardsRating/addOrUpdateDetail/` + personId, {
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
            body: JSON.stringify(standardsRatingDetail)
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
            dispatch({ type: types.STANDARDS_RATING_INIT, payload: response })
						localStorage.setItem("standardsRating", JSON.stringify(response))
        })
    }
}

export const removeStandardsRatingDetail = (personId, standardsRatingDetailId) => {
    return dispatch => {
				dispatch({ type: types.STANDARDS_RATING_REMOVE, payload: standardsRatingDetailId })
        return fetch(`${apiHost}ebi/standardsRating/removeDetail/` + personId + `/` + standardsRatingDetailId, {
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
            dispatch({ type: types.STANDARDS_RATING_INIT, payload: response })
						localStorage.setItem("standardsRating", JSON.stringify(response))
        })
    }
}

export const removeStandardsRatingTable = (personId, standardsRatingTableId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/standardsRating/removeTable/` + personId + `/` + standardsRatingTableId, {
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
            dispatch({ type: types.STANDARDS_RATING_INIT, payload: response })
						localStorage.setItem("standardsRating", JSON.stringify(response))
        })
    }
}

export const addOrUpdateStandardsRatingTable = (personId, newStandardsRatingName, fromGradeLevelId, toGradeLevelId, standardsRatingTableId, isLevelOnly=false) => {
		standardsRatingTableId = standardsRatingTableId ? standardsRatingTableId : guidEmpty

    return dispatch => {
        return fetch(`${apiHost}ebi/standardsRating/newStandardsRatingName/${personId}/${encodeURIComponent(newStandardsRatingName)}/${fromGradeLevelId}/${toGradeLevelId}/${standardsRatingTableId}/${isLevelOnly}`, {
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
            dispatch({ type: types.STANDARDS_RATING_INIT, payload: response })
						localStorage.setItem("standardsRating", JSON.stringify(response))
        })
    }
}

export const setStandardLevelSequence = (studentPersonId, assignmentId, nextSequence, courseScheduledId, personId, runFunction=()=>{}) => {
    return dispatch => {
				dispatch({type: types.GRADEBOOK_SCORE_UPDATE_RATING, payload: {studentPersonId, assignmentId, nextSequence}})
				dispatch({type: types.GRADEBOOK_STUDENT_ASSIGNMENT_STANDARD_BASED, payload: {studentPersonId, assignmentId, nextSequence}})

        return fetch(`${apiHost}ebi/gradeBook/set/standardLevelSequence/` + studentPersonId + `/` + assignmentId + `/` + nextSequence + `/` + courseScheduledId + `/` + personId, {
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

export const setStandardLevelSequenceMultiple = (assignmentId, nextSequence, courseScheduledId, personId, runFunction=()=>{}) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/gradeBook/setMultiple/standardLevelSequence/` + assignmentId + `/` + nextSequence + `/` + courseScheduledId + `/` + personId, {
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
