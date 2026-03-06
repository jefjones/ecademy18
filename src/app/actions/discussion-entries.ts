import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'
//const AbortController = require('abort-controller');
//const controller = new AbortController()
//let hasActiveRequest = false;

export const init = (personId, courseEntryId, assignmentId='00000000-0000-0000-0000-000000000000') => {
		// if (hasActiveRequest) {
		// 		controller.abort();
		// 		hasActiveRequest = false;
		// }

    return dispatch => {
				//hasActiveRequest = true;
        dispatch({type: types.FETCHING_RECORD, payload: {discussionEntries: true} }); //This one is for the loading in general for the automatic scroll
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'discusionEntry', value: true } }); //This one is for the table loading
        return fetch(`${apiHost}ebi/discussionEntries/` + personId + `/` + courseEntryId + `/` + assignmentId, {
						//signal: controller.signal,
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
						//hasActiveRequest = false;
						dispatch({type: types.FETCHING_RECORD, payload: {discussionEntries: "ready"} }); //This one is for the loading in general.
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'discusionEntry', value: false } }); //This one is for the table loading
            dispatch({type: types.DISCUSSION_ENTRIES_INIT, payload: response})
        })
				.catch(error => {
					//hasActiveRequest = false;
					dispatch({ type: types.FETCHING_RECORD, payload: {field: 'discusionEntry', value: false } })
				})
    }
}

export const addOrUpdateDiscussionEntry = (personId, studentPersonId, courseEntryId, discussionEntry) => {
	  discussionEntry.discussionEntryId = discussionEntry.discussionEntryId
	      ? discussionEntry.discussionEntryId
	      : guidEmpty

    return dispatch => {
        //dispatch({type: types.FETCHING_RECORD, payload: {discussionEntries: true} });
				//dispatch({type: types.DISCUSSION_ENTRIES_ADD_OR_UPDATE, payload: discussionEntry});
        return fetch(`${apiHost}ebi/discussionEntries/addOrUpdate/` + personId + `/` + studentPersonId + `/` + courseEntryId, {
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
            body: JSON.stringify(discussionEntry),
        })
    }
}

export const removeDiscussionEntry = (personId, discussionEntryId) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {discussionEntries: true} })
				dispatch({ type: types.DISCUSSION_ENTRIES_REMOVE, payload: discussionEntryId })
        return fetch(`${apiHost}ebi/discussionEntries/remove/` + personId + `/` + discussionEntryId, {
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

export const removeDiscussionEntryByAdmin = (personId, discussionEntryId, studentPersonId, whyRemove) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {discussionEntries: true} })
				dispatch({ type: types.DISCUSSION_ENTRIES_REMOVE, payload: discussionEntryId })
        return fetch(`${apiHost}ebi/discussionEntries/removeByAdmin/` + personId, {
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
								personId,
								discussionEntryId,
								studentPersonId,
								whyRemove,
						})
        })
    }
}


export const saveDiscussionEntryWebsiteLink = (personId, discussionEntryId, websiteLink) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/discussionEntries/websiteLink/` + personId + `/` + discussionEntryId, {
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
						body: JSON.stringify(websiteLink)
        })
    }
}


export const removeDiscussionEntryFileUpload = (personId, discussionFileUploadId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/discussionEntries/removeFileUpload/` + personId + `/` + discussionFileUploadId, {
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

export const removeDiscussionEntryWebsiteLink = (personId, discussionWebsiteLinkId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/discussionEntries/removeWebsiteLink/` + personId + `/` + discussionWebsiteLinkId, {
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

export const saveVoiceRecording = (personId, voiceRecording) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/discussionEntry/voiceRecording/` + personId, {
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
    }
}
