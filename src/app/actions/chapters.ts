import * as types from './actionTypes'
import getChapters from '../services/chapters'
import { navigate, navigateReplace, goBack } from './'
import * as actionEditReview from './edit-review'
import * as actionWorks from './works'
import * as guid from '../utils/GuidValidate'
import {apiHost} from '../api_host'

function setChapters( chapters=[] ) {
    return { type: types.CHAPTERS_LIST_INIT, payload: chapters }
}

export const init = (personId, workId) => dispatch => {
    return getChapters(personId, workId).then( n => dispatch( setChapters(n)))
}

export const setEditDetail = (personId, workId, chapterId, languageId, hrefId, editText, isComment, editTypeName='', position='', moveArrayHrefId=[], includeHistory=false) => {
    hrefId = hrefId && hrefId.length > 0 && hrefId.replace(/\~\^/g, '~!'); //eslint-disable-line
    moveArrayHrefId = (moveArrayHrefId && moveArrayHrefId.length > 0) ? moveArrayHrefId.map(m => m.replace(/\~\^/g, '~!')) : []; //eslint-disable-line
    return dispatch => {
        //Help toDo:  I'm trying to help the editReview contentEditable not flash back to the previous sentence and then flash again with the new updated sentence after the editDetail is saved in the database and returns.
        //if (!isComment) dispatch({ type: types.EDIT_DETAIL_TEMP_NEW, payload: {personId, chapterId, editText, editTypeName} });
        fetch(`${apiHost}ebi/sentence/set/` + personId, {
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
                workId,
                chapterId,
                languageId,
                hrefId,
                text: editText,
                isComment,
                editTypeName,
                position,
                moveArrayHrefId,
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
            //The edit_details_Update is causing the tinyMCE editor to flash and jump back to the top.  So just track this from the beginning of the page call in the local state.
            //    for the near future, we'll need to check the database for changes as we go as a subscription to keep the user up to date.  But somehow we've got to keep the editor from jumping.
            //dispatch({ type: types.EDIT_DETAILS_UPDATE, payload: {personId, workId, chapterId, languageId, hrefId, authorText, editText, isComment} });
            //dispatch({ type: types.CHAPTER_TEXT_INIT, payload: response.ChapterText });

            //This is intended to reload the entire chapter (as long as it does not make the screen flash or move the user's scrolled location)
            //dispatch(actionChapterText.init(personId, workId, chapterId, languageId));
            //This is intended to reload the entire EditDetail records (as long as it does not make the screen flash or move the user's scrolled location)
            dispatch(actionEditReview.getEditDetails(personId, workId, chapterId, languageId, includeHistory))
            //dispatch(actionChapterText.init(personId, workId, chapterId, languageId));  Don't do this since it will refresh the DOM and cause the cursor to jump to the beginning of the text.
            //dispatch({ type: types.EDIT_DOM_MICRO_REPLACE, payload: response});

        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const setMultipleEditDetail = (personId, workId, chapterId, languageId, hrefIdSelections) => {

    return dispatch =>
    fetch(`${apiHost}ebi/sentence/set/selection/` + personId, {
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
            personId: personId,
            workId: workId,
            chapterId: chapterId,
            languageId: languageId,
            sentenceSelection: hrefIdSelections,
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
        //The edit_details_Update is causing the tinyMCE editor to flash and jump back to the top.  So just track this from the beginning of the page call in the local state.
        //    for the near future, we'll need to check the database for changes as we go as a subscription to keep the user up to date.  But somehow we've got to keep the editor from jumping.
        //dispatch({ type: types.EDIT_DETAILS_UPDATE, payload: {personId, workId, chapterId, languageId, hrefId, authorText, editText, isComment} });
        //dispatch({ type: types.CHAPTER_TEXT_INIT, payload: response.ChapterText });

        //This is intended to reload the entire chapter (as long as it does not make the screen flash or move the user's scrolled location)
        //dispatch(actionChapterText.init(personId, workId, chapterId, languageId));
        //This is intended to reload the entire EditDetail records (as long as it does not make the screen flash or move the user's scrolled location)
        dispatch(actionEditReview.getEditDetails(personId, workId, chapterId, languageId, false))
        //dispatch(actionChapterText.init(personId, workId, chapterId, languageId));

    })
    //.catch(error => { console.l og('request failed', error); });
}

export const applyAuthorsEdits = (personId, workId, chapterId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/sentence/updateAuthorEdits/` + personId + `/` + workId + `/` + chapterId, {
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
        //Get the chapterText???
    })
    //.catch(error => { console.l og('request failed', error); });
}


export const deleteEditDetail = (personId, editDetailId, includeHistory=false) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/edit/delete`, {
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
            personId: personId,
            editDetailId: editDetailId,
        })
    })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            // const error = new Error(response.statusText);
            // error.response = response;
            // throw error;
        }
    })
    .then(response => {
        dispatch(actionEditReview.getEditDetails(personId, response.workId, response.chapterId, response.languageId, includeHistory))
        dispatch(actionEditReview.getChapterText(personId, response.workId, response.chapterId, response.languageId))
    })
    //.catch(error => { console.l og('request failed', error); });
}

export const restoreEditDetail = (personId, editDetailId, includeHistory=false) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/edit/restore`, {
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
            personId: personId,
            editDetailId: editDetailId,
        })
    })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            return false
            // const error = new Error(response.statusText);
            // error.response = response;
            // throw error;
        }
    })
    .then(response => {
        dispatch(actionEditReview.getEditDetails(personId, response.workId, response.chapterId, response.languageId, includeHistory))
        return true
    })
    //.catch(error => { console.l og('request failed', error); });
}

export const setEditVote = (voterPersonId, chapterId, languageId, editDetailId, voteType, trollEditText, voterComment, isComment, includeHistory=false) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/edit/vote/` + includeHistory, {
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
            editDetailId,
            agreeFlag: voteType === 'AGREE' ? true : false,
            disagreeFlag: voteType === 'DISAGREE' ? true : false,
            trollFlag: voteType === 'TROLL' ? true : false,
            voterPersonId,
            trollEditText,
            chapterId,
            languageId,
            isComment,
            voterComment
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
        dispatch({ type: types.EDIT_DETAILS_INIT, payload: response })
    })
    //.catch(error => { console.l og('request failed', error); });
}

export const setAcceptedEdit = (personId, workId, chapterId, languageId, acceptedEditDetailId, isAuthorAcceptedEdit, includeHistory=false) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/edit/accepted/` + personId + `/` + acceptedEditDetailId + `/` + isAuthorAcceptedEdit, {
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
        isAuthorAcceptedEdit && dispatch({ type: types.EDIT_DETAILS_ACCEPTED_UPDATE, payload: {personId, acceptedEditDetailId, isAuthorAcceptedEdit} })
        //isAuthorAcceptedEdit && dispatch({ type: types.CHAPTER_TEXT_INIT, payload: response });
        //dispatch(actionEditReview.getChapterText(personId, workId, chapterId, languageId));
        dispatch(actionEditReview.getEditDetails(personId, workId, chapterId, languageId, includeHistory))
    })
    //.catch(error => { console.l og('request failed', error); });  //DELETE DON'T
}

export const updateChapterDueDate = (personId, workId, chapterId, languageId, dueDate) => {
    return dispatch =>
        fetch(`${apiHost}ebi/chapter/dueDate/` + personId + `/` + dueDate, {
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
            dispatch({ type: types.WORK_CHAPTER_DUEDATE_UPDATE, payload: {workId, chapterId, languageId, dueDate} })
        })
}

export const addOrUpdateChapter = (personId, workId, chapter, isFileUpload, isUpdate) => {
    return dispatch =>
        fetch(`${apiHost}ebi/chapter/addorupdate`, {
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
                workId,
                chapterId: chapter.id || chapter.chapterId || guid.emptyGuid,
                name: chapter.name,
                sequence: chapter.chapterNbr,
                workStatusId: chapter.workStatusId,
                editSeverityId: chapter.editSeverityId,
                comment: chapter.comment,
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
            const chapterOptions = response
            let newChapterid = response && response.length > 0 && !!response.filter(m => m.name === chapter.name)[0] && response.filter(m => m.name === chapter.name)[0].chapterId
            //The entire chapterOptions will be returned for the given work.  I also need to get the current (new) chapterId back..
            dispatch({ type: types.WORK_UPDATE_CHAPTERS, payload: {workId, chapters: chapterOptions}})
            dispatch({ type: types.CHAPTER_TEXT_INIT, payload: ''});  //Update the current ChapterText to blank to start a new section in case the chapterText is populaed from another section, which could feasibly be the case.
            dispatch({ type: types.EDIT_DETAILS_INIT, payload: ''});  //Same as above.
            dispatch({ type: types.CHAPTER_CURRENT_SET_SELECTED, payload: newChapterid})
            dispatch({ type: types.WORK_CURRENT_SET_SELECTED, payload: {workId, chapterId: newChapterid, languageId: '', languageName: ''} }); //The blank languageIds will be filled in by the reducer with the actual current chosen langaugeid and name.
            dispatch(actionWorks.setWorkCurrentSelected(personId, workId, newChapterid, '', "STAY"))
            navigate(isFileUpload ? "/chapterUploadFile" : (isUpdate ? "/workSections" : `/editReview/${workId}`))
        })
}

export const deleteChapter = (personId, workId, chapterId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/delete/` + personId + '/' + workId + '/' + chapterId, {
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
        dispatch({ type: types.WORK_CHAPTER_DELETE, payload: { workId, chapterOptions: response} })
    })
}


export const mergeChapters = (personId, workId, fromChapterId, toChapterId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/merge/` + personId + '/' + workId + '/' + fromChapterId + '/' + toChapterId, {
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
        //The entire chapterOptions will be returned for the given work.
        dispatch({ type: types.WORK_CHAPTEROPTIONS_UPDATE, payload: { workId, chapterOptions: response} })
    })
}

export const onChangeSequence = (personId, workId, chapterId, sequence) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/sequence/` + personId + '/' + workId + '/' + chapterId + '/' + sequence, {
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
        //The entire chapterOptions will be returned for the given work.
        dispatch({ type: types.WORK_CHAPTER_RESEQUENCE, payload: { workId, chapterOptions: response} })
    })
}

export const splitChapter = (personId, workId, chapterId, newSections) => {
    return dispatch =>
    fetch(`${apiHost}ebi/chapter/splitSection`, {
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
            workId,
            chapterId,
            newSplits: newSections,
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
        //The entire chapterOptions will be returned for the given work.
        dispatch({ type: types.WORK_CHAPTEROPTIONS_UPDATE, payload: { workId, chapterOptions: response} })
        navigate("/workSections")
    })
}


export const updateChapterComment = (personId, workId, chapterId, comment) => {
    comment = !comment ? 'EMPTY' : comment

    return dispatch =>
    fetch(`${apiHost}ebi/chapter/comment/` + personId + '/' + workId + '/' + chapterId + '/' + comment, {
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
        //The entire chapterOptions will be returned for the given work.
        dispatch({ type: types.WORK_CHAPTEROPTIONS_UPDATE, payload: { workId, chapterOptions: response} })
    })
}
