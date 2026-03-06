import * as types from './actionTypes';
import {browserHistory} from 'react-router';
import {apiHost} from '../api_host.js';

export const getCoursesBase = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("coursesBase")
        let json = JSON.parse(storage);
				storage && dispatch({ type: types.COURSES_BASE, payload: json });

        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'baseCourses', value: true } });
        return fetch(`${apiHost}ebi/courseEntry/${personId}`, {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'baseCourses', value: false } });
		        dispatch({ type: types.COURSES_BASE, payload: response });
            localStorage.setItem("coursesBase", JSON.stringify(response));
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'baseCourses', value: false } }));
    }
}


export const getCourseDescription = (personId, courseEntryId) => {
    return dispatch => {
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseDescription', value: true } });
        return fetch(`${apiHost}ebi/courseEntry/description/${personId}/${courseEntryId}`, {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseDescription', value: false } });
		        dispatch({ type: types.COURSE_DESCRIPTION, payload: response });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseDescription', value: false } }));
    }
}

export const clearCourseDescription = () => {
    return dispatch => dispatch({ type: types.COURSE_DESCRIPTION, payload: '' });
}

export const addOrUpdateCourse = (personId, course, runFunction=()=>{}) => {
    return dispatch => {
        dispatch({type: types.PREREQUISITE_UPDATE, payload: {courseEntryId: course.courseEntryId, prerequisites: course.prerequisitesReceive} });
        dispatch({type: types.COURSE_ENTRY_UPDATE_ADD, payload: {courses: true} });
        dispatch({type: types.FETCHING_RECORD, payload: {courses: true} });
        return fetch(`${apiHost}ebi/courseEntry/` + personId, {
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
            body: JSON.stringify(course),
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
            dispatch({type: types.FETCHING_RECORD, payload: {courses: false} });
						dispatch(getCoursesBase(personId));
            dispatch(runFunction);
						if (!course.courseEntryId) {
                let newCourse = response.filter(m => m.courseName === course.courseName)[0] || {}
								browserHistory.push	(`/courseToSchedule/new/${newCourse.courseEntryId}`)
						}
        })
        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courses', value: false } }));
    }
}

export const removeCourse = (personId, courseEntryId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseEntry/remove/` + personId + `/` + courseEntryId, {
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
						dispatch(getCoursesBase(personId));
        })
    }
}

export const duplicateCourse = (personId, courseEntryId, courseName) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseEntry/duplicate/` + personId + `/` + courseEntryId + `/` + courseName, {
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
            dispatch({ type: types.COURSES_BASE, payload: response });
        })
    }
}
