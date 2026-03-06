import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId, courseEntryId) => {
    return dispatch => {
        //dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} }); //This is intentionally set to assignments which is where the courseDocuments need to show up.
        return fetch(`${apiHost}ebi/courseDocuments/` + personId + `/` + courseEntryId, {
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
            //dispatch({type: types.FETCHING_RECORD, payload: {assignments: false} });
            dispatch({type: types.COURSE_DOCUMENTS_INIT, payload: response})
        })
    }
}

export const removeCourseDocumentFile = (personId, courseDocumentId) => {
    return dispatch => {
				//dispatch({type: types.FETCHING_RECORD, payload: {courseDocuments: true} });
        return fetch(`${apiHost}ebi/courseDocuments/remove/` + personId + `/` + courseDocumentId, {
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
						//dispatch({type: types.FETCHING_RECORD, payload: {courseDocuments: 'ready'} });
            dispatch({ type: types.COURSE_DOCUMENTS_INIT, payload: response })
        })
    }
}

export const saveCourseWebsiteLink = (personId, courseEntryId, websiteLink, websiteTitle) => {
		// websiteLink = websiteLink && websiteLink.toLowerCase().indexOf('https://') > -1
		// 		? websiteLink.toLowerCase().substring(8)
		// 		: websiteLink && websiteLink.toLowerCase().indexOf('http://') > -1
		// 				? websiteLink.toLowerCase().substring(7)
		// 				: websiteLink;
						
    return dispatch => {
        return fetch(`${apiHost}ebi/courseDocuments/addWebsiteLink/` + personId, { // + `/` + courseEntryId + `/` + encodeURIComponent(websiteLink) + `/` + encodeURIComponent(websiteTitle)
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
								courseEntryId,
								websiteLink: encodeURIComponent(websiteLink),
								websiteTitle: encodeURIComponent(websiteTitle)
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
            dispatch(init(personId, courseEntryId))
        })
    }
}
