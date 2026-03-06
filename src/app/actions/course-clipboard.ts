import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'
import {apiHost} from '../api_host'

export const init = (personId, courseListType) => {
    return dispatch => {
			  let storage = localStorage.getItem("courseClipboard")
			  storage && dispatch({ type: types.COURSE_CLIPBOARD_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseClipboard', value: true } })
        return fetch(`${apiHost}ebi/courseClipboard/` + personId + `/` + courseListType, {
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
            dispatch({ type: types.COURSE_CLIPBOARD_INIT, payload: response })
						localStorage.setItem("courseClipboard", JSON.stringify(response))
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseClipboard', value: false } })
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseClipboard', value: false } }))
    }
}

export const resetCourseClipboard = (personId, courseClipboard, sendTo='') => {
    return dispatch => {
				dispatch({ type: types.COURSE_CLIPBOARD_UPDATE, payload: courseClipboard })
	      fetch(`${apiHost}ebi/courseClipboard/reset/` + personId, {
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
	        body: JSON.stringify(courseClipboard),
	      })
				.then(() => {
						//dispatch(init(personId, courseClipboard.courseListType)) //don't do this since after changing the clipboard above, this will come second and replace what was in the database instead.
						if (sendTo) {
								sendTo.indexOf('/') > -1 ?  navigate(sendTo) : navigate('/' + sendTo)
						}
				})
		}
}

export const addCourseClipboard = (personId, courseClipboard) => {
    return dispatch => {
				dispatch({ type: types.COURSE_CLIPBOARD_ADD, payload: courseClipboard })
	      fetch(`${apiHost}ebi/courseClipboard/add/` + personId, {
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
		        body: JSON.stringify(courseClipboard),
	      })
				.then(() => dispatch(init(personId, courseClipboard.courseListType)))
		}
}

export const removeAllCourseClipboard = (personId, courseListType) => {
    return dispatch => {
				dispatch({ type: types.COURSE_CLIPBOARD_INIT, payload: [] })
	      fetch(`${apiHost}ebi/courseClipboard/removeAll/` + personId, {
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
				//.then(() => dispatch(init(personId, courseListType)))
		}
}

export const singleRemoveCourseClipboard = (personId, removeCourseId, courseListType) => {
    return dispatch => {
				dispatch({ type: types.COURSE_CLIPBOARD_REMOVE, payload: removeCourseId })
	      fetch(`${apiHost}ebi/courseClipboard/removeCourse/` + personId + `/` + removeCourseId, {
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
				//.then(() => dispatch(init(personId, courseListType)))
		}
}
