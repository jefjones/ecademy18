import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getCourseRecommendations = (personId, type) => {
    return dispatch => {
				let storage = localStorage.getItem("courseRecommendations")
				storage && dispatch({ type: types.COURSE_RECOMMENDATIONS_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseRecommendations', value: true } })
        return fetch(`${apiHost}ebi/courseRecommendations/` + personId + `/` + type, {
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
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseRecommendations', value: false } })
			            dispatch({type: types.COURSE_RECOMMENDATIONS_INIT, payload: response})
									localStorage.setItem("courseRecommendations", JSON.stringify(response))
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseRecommendations', value: false } }))
    }
}

export const addLearnerCourseRecommended = (personId, students, courses) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseRecommendation/` + personId, {
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
              students,
              courses,
            }),
        })
				.then(() => dispatch(getCourseRecommendations(personId, 'Teacher')))
    }
}

export const removeCourseRecommendation = (personId, studentPersonId, courseEntryId, type) => {
    return dispatch => {
				dispatch({ type: types.COURSE_RECOMMENDATION_REMOVE, payload: {studentPersonId, courseEntryId} })
        return fetch(`${apiHost}ebi/courseRecommendation/remove/` + studentPersonId + `/` + courseEntryId, {
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
        .then(() => dispatch(getCourseRecommendations(personId, type)))
    }
}


export const removeAllMyCourseRecommendations = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseRecommendation/allRemove/` + personId, {
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
        .then(() => dispatch(getCourseRecommendations(personId, "Teacher")))
    }
}

export const getReportCourseCount = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseRecommendation/courseCount/` + personId, {
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
			            dispatch({type: types.COURSE_RECOMMENDATIONS_REPORT_COURSE_NAME, payload: response})
			        })
    }
}

export const getReportByTeacher = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseRecommendation/byTeacher/` + personId, {
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
			            dispatch({type: types.COURSE_RECOMMENDATIONS_REPORT_BY_TEACHER, payload: response})
			        })
    }
}

export const getReportByStudent = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseRecommendation/byStudent/` + personId, {
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
			            dispatch({type: types.COURSE_RECOMMENDATIONS_REPORT_BY_STUDENT, payload: response})
			        })
    }
}
