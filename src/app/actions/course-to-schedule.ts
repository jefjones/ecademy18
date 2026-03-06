import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const setLocalCourseScheduled = (field, value) => {
    return dispatch => dispatch({ type: types.COURSE_TO_SCHEDULE_UPDATE, payload: {field, value} })
}

export const clearCourseToSchedule = () => {
    return dispatch => dispatch({ type: types.COURSE_TO_SCHEDULE, payload: {} })
}

export const getCoursesScheduled = (personId, clearRedux=false, smallData=false) => {
    return dispatch => {
        let json = 0
				if (!clearRedux) {
						let storage = localStorage.getItem("scheduled")
            json = JSON.parse(storage)
						storage && dispatch({ type: types.COURSES_SCHEDULED, payload: json })
				} else {
						dispatch({ type: types.COURSES_SCHEDULED, payload: [] })
				}

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'scheduledCourses', value: true } })
				return !personId || personId === '00000000-0000-0000-0000-000000000000'
						? null
						: fetch(`${apiHost}ebi/courseToSchedule/scheduled/${personId}/${(json && json.length) || 0}`, {
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
		            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'scheduledCourses', value: false } })
                // if (response && response.length === 1 && response[0].label === 'SameCount') {
                //     //do nothing
                // } else {
                    dispatch({ type: types.COURSES_SCHEDULED, payload: response })
                    localStorage.setItem("scheduled", JSON.stringify(response))
                //}
                //localStorage.setItem("isLoggingIn", false);
		        })
						.catch(error => {
                dispatch({ type: types.FETCHING_RECORD, payload: {field: 'scheduledCourses', value: false } })
            })
    }
}

export const getCoursesSeatsStatistics = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseToSchedule/updateSeatStats/` + personId, {
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
						dispatch({ type: types.COURSES_SEATS_STATISTICS, payload: response })
        })
    }
}

export const addOrUpdateCourseToSchedule = (personId, course) => {
		course.standardsRatingTableId = course.standardsRatingTableId ? course.standardsRatingTableId : guidEmpty
    if (course && course.fromDate && course.fromDate.indexOf('null') > -1) course.fromDate = '2020-09-01'
    if (course && course.toDate && course.toDate.indexOf('null') > -1) course.toDate = '2021-05-28'

    return dispatch => {
        dispatch({ type: types.COURSE_SCHEDULED_ADD_UPDATE, payload: course })
        dispatch({type: types.FETCHING_RECORD, payload: {courses: true} })
        return fetch(`${apiHost}ebi/courseToSchedule/` + personId, {
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
                courseScheduledId: course.courseScheduledId,
                courseEntryId: course.courseEntryId,
                courseTypeId: course.courseTypeId,
                gradeScaleTableId: course.gradeScaleTableId,
                schoolYearId: course.schoolYearId,
                location: course.location,
                offCampus: course.offCampus,
                onCampus: course.onCampus,
                online: course.online,
                selfPaced: course.selfPaced,
                code: typeof course.code === 'string' ? course.code : '',
                section: course.section,
                maxSeats: course.maxSeats,
                fromDate: course.fromDate,
                toDate: course.toDate,
                teachers: course.teachers,
                daysScheduled: course.daysScheduled,
                intervals: course.intervals,
                isInactive: course.isInactive,
            }),
        })
    }
}

export const removeCourseToSchedule = (personId, courseScheduledId) => {
    return dispatch => {
				dispatch({type: types.COURSES_SCHEDULED_REMOVE, payload: courseScheduledId })
        return fetch(`${apiHost}ebi/courseToSchedule/remove/` + personId + `/` + courseScheduledId, {
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


export const setStudentCourseAssignNameSearch = (partialNameText) => {
    return dispatch => dispatch({ type: types.COURSE_TO_SCHEDULE_NAME_SEARCH, payload: partialNameText })
}

export const clearStudentCourseAssignNameSearch = () => {
    return dispatch => dispatch({ type: types.COURSE_TO_SCHEDULE_NAME_SEARCH, payload: '' })
}

export const getStudentCoursesAssigns = (personId, courseScheduledId) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {studentCourseAssign: true} })
        return fetch(`${apiHost}ebi/courseToSchedule/studentAssigns/${personId}/${courseScheduledId}`, {
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
            dispatch({type: types.FETCHING_RECORD, payload: {studentCourseAssign: "ready"} })
						dispatch({ type: types.STUDENT_COURSE_ASSIGNS, payload: response })
        })
    }
}

export const getStudentCoursesAssignsByBase = (personId, courseEntryId) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {studentCourseAssign: true} })
        return fetch(`${apiHost}ebi/courseToSchedule/studentAssignsByBase/${personId}/${courseEntryId}`, {
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
            dispatch({type: types.FETCHING_RECORD, payload: {studentCourseAssign: "ready"} })
						dispatch({ type: types.STUDENT_COURSE_ASSIGNS, payload: response })
        })
    }
}

export const getStudentCoursesAssignsByTeacher = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseToSchedule/studentAssignsByTeacher/${personId}`, {
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
						dispatch({ type: types.STUDENT_COURSE_ASSIGNS, payload: response })
        })
    }
}

export const getCourseDaysScheduled = (personId, courseScheduledId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseToSchedule/daysScheduled/${personId}/${courseScheduledId}`, {
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
						dispatch({ type: types.COURSE_DAYS_SCHEDULED, payload: {courseScheduledId, daysScheduled: response} })
        })
    }
}


export const getStudentListByCourse = (personId, courseScheduledId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseToSchedule/studentList/${personId}/${courseScheduledId}`, {
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
						dispatch({ type: types.COURSE_STUDENT_LIST, payload: response })
        })
    }
}

export const clearStudentListByCourse = () => {
    return dispatch => dispatch({ type: types.COURSE_STUDENT_LIST, payload: [] })
}
