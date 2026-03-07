import * as types from './actionTypes'
import {apiHost} from '../api_host'
import * as guid from '../utils/guidValidate'

//The chapter text and edit details will be picked up separately.  There ought to be a server-side process to see if the chapterText has changed
//  before having to call it up again.  And then the edit details (edit or translation) will need to be overwritten to get the resulting chapterText
//  for the editor's version in pending process or the final language.  This is processed on the client-side (which will have to be tested to be disable
//  to handle the processing properly or timely.

//Consider sending a flag indicating that we are already in the page that is reading ChapterText, so if there ARE NOT any changes, don't update!
//  Send back the value of "NO-UPDATE" and do not do anything with it in the reducer.

//EDIT DETAILS
export const getEditDetails = (personId, workId, chapterId, languageId, includeHistory=false) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {editDetails: true} })
        return fetch(`${apiHost}ebi/chapter/editDetails/` + personId + `/` + workId + `/` + chapterId + `/` + languageId + '/' + includeHistory, {
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
            dispatch({type: types.FETCHING_RECORD, payload: {editDetails: false} })
            dispatch({ type: types.EDIT_DETAILS_INIT, payload: response })
        })
    }
}

export const getChapterText = (personId, workId, chapterId, languageId) => {
		chapterId = chapterId ? chapterId : 0
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {chapterText: true} }); //We'll let this resolve in the container using the componentDidUpdate to set it to false.
        return fetch(`${apiHost}ebi/chapter/content/${personId}/${workId}/${chapterId}/${languageId}`, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {chapterText: 'ready'} })
            dispatch({ type: types.CHAPTER_TEXT_INIT, payload: response })
            //dispatch({type: types.FETCHING_RECORD, payload: {chapterText: false} }); //We'll let this resolve in the container using the componentDidUpdate to set it to false.
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const clearChapterText = () => {
    return dispatch => {
	      dispatch({ type: types.CHAPTER_TEXT_INIT, payload: "" })
    }
}

export const getAuthorWorkspace = (personId, workId, chapterId=0) => {
		chapterId = chapterId ? chapterId : 0
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {authorWorkspace: true} })
        return fetch(`${apiHost}ebi/chapter/authorWorkspace/${personId}/${workId}/${chapterId}`, {
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
            dispatch({type: types.FETCHING_RECORD, payload: {authorWorkspace: 'ready'} })
            dispatch({ type: types.AUTHOR_WORKSPACE_INIT, payload: response })
        })
    }
}

export const clearAuthorWorkspace = () => {
    return dispatch => {
	      dispatch({ type: types.AUTHOR_WORKSPACE_INIT, payload: "" })
    }
}

export const updateContent = (personId, authorPersonId, workId, chapterId, languageId, authorWorkspace, includeHistory=false, trackFetch=false) => {

    chapterId = guid.isGuidNotEmpty(chapterId) ? chapterId : guid.emptyGuid()
    personId = guid.isGuidNotEmpty(personId) ? personId : guid.emptyGuid()
    authorPersonId = guid.isGuidNotEmpty(authorPersonId) ? authorPersonId : guid.emptyGuid()
    workId = guid.isGuidNotEmpty(workId) ? workId : guid.emptyGuid()
    authorWorkspace = authorWorkspace.replace(/\~\^/g, '~!');  //eslint-disable-line

    return dispatch => {
        if (trackFetch) dispatch({type: types.FETCHING_RECORD, payload: {authorWorkspace: true} })

        return fetch(`${apiHost}ebi/chapter/content/` + personId, {
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
                authorPersonId,
                workId,
                chapterId,
                languageId,
                authorWorkspace,
								chapterText: authorWorkspace, //This is the new line as we ignore the authorWorkspace which can be reinstated once we make the personConfig.authorWorkspaceOn feature.
            }),
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
            dispatch({ type: types.CHAPTER_TEXT_INIT, payload: response.chapterText })
            dispatch({ type: types.AUTHOR_WORKSPACE_INIT, payload: response.authorWorkspace })
            //dispatch(getEditDetails(personId, chapterId, languageId, includeHistory));
            if (trackFetch) dispatch({type: types.FETCHING_RECORD, payload: {authorWorkspace: 'ready'} })
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const updateAuthorWorkspace = (personId, workId, chapterId, languageId, authorWorkspace) => {
    chapterId = guid.isGuidNotEmpty(chapterId) ? chapterId : guid.emptyGuid()
    personId = guid.isGuidNotEmpty(personId) ? personId : guid.emptyGuid()
    workId = guid.isGuidNotEmpty(workId) ? workId : guid.emptyGuid()
    authorWorkspace = authorWorkspace.replace(/\~\^/g, '~!'); //eslint-disable-line

    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {updateChapterText: true} })
        return fetch(`${apiHost}ebi/chapter/authorWorkspace/` + personId, {
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
                workId,
                chapterId,
                languageId,
                authorWorkspace,
            }),
        })
    }
}

//The other settings:
export const setModeChosen = ( modeChosen="") => {
    return { type: types.EDIT_MODE_CHOSEN_SET, payload: modeChosen }
}

export const setEditorTabChosen = ( editorTabChosen=0) => { //0 is Title Page to start.
    return { type: types.EDITOR_TAB_CHOSEN_SET, payload: editorTabChosen }
}

export const setSentenceChosen = ( sentenceChosen="") => {
    return { type: types.SENTENCE_CHOSEN_SET, payload: sentenceChosen }
}

export const setEditChosen = ( editChosen="") => {
    return { type: types.EDIT_CHOSEN_SET, payload: editChosen }
}

export const setIconPosition = ( iconPosition="") => {
    return { type: types.EDIT_ICON_POSITION_SET, payload: iconPosition }
}

export const setSentenceMoveChosen = ( sentenceMoveChosen="") => {
    return { type: types.SENTENCE_MOVE_CHOSEN_SET, payload: sentenceMoveChosen }
}

export const setBreakNewChosen = ( breakNewChosen="") => {
    return { type: types.PARAGRAPH_NEW_BREAK_CHOSEN_SET, payload: breakNewChosen }
}

export const setBreakDeleteChosen = ( breakDeleteChosen="") => {
    return { type: types.PARAGRAPH_DELETE_BREAK_CHOSEN_SET, payload: breakDeleteChosen }
}

export const setImageNewChosen = ( imageNewChosen="") => {
    return { type: types.IMAGE_NEW_CHOSEN_SET, payload: imageNewChosen }
}

export const resetEditReview = () => dispatch => {
    dispatch({ type: types.EDIT_DETAILS_INIT, payload: [] })
    dispatch({ type: types.EDIT_MODE_CHOSEN_SET, payload: '' })
    dispatch({ type: types.EDITOR_TAB_CHOSEN_SET, payload: '' })
    dispatch({ type: types.SENTENCE_CHOSEN_SET, payload: '' })
    dispatch({ type: types.SENTENCE_MOVE_CHOSEN_SET, payload: '' })
    dispatch({ type: types.PARAGRAPH_NEW_BREAK_CHOSEN_SET, payload: '' })
    dispatch({ type: types.PARAGRAPH_DELETE_BREAK_CHOSEN_SET, payload: '' })
    dispatch({ type: types.IMAGE_NEW_CHOSEN_SET, payload: '' })
    dispatch({ type: types.CHAPTER_TEXT_INIT, payload: "" })
    return
}

export const setChapterWasChanged = () => dispatch => {
    dispatch({ type: types.CHAPTER_CHANGED, payload: false })
}

export const toggleShowEditorTabDiff = () => dispatch => {
    dispatch({ type: types.EDIT_REVIEW_EDITOR_TAB_DIFF })
}
