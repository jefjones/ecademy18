import * as types from './actionTypes'
import {apiHost} from '../api_host'
import * as actionContacts from './contacts'
import * as actionWorks from './works'

//This just saves off the FriendWorkAssign record to the database,
//But it needs to update the Works.editorAssign object before it saves off to the database.
//If isAdd is set to "skip" that would infer that this is an update to the language or chapters selection.
export const setEditorAssign = (isAdd, workId, personId, owner_personId, chapters, languages) => {
    if (!languages || (languages && languages.length === 0)) {
        languages = "1"
    }
    isAdd = isAdd === "skip" ? true : isAdd; //This needs to be converted back to boolean for the webApi object that expects boolean.

    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {editorAssign: true} })

        if ((isAdd !== "skip" && !isAdd && workId && personId && owner_personId)
                || (isAdd && workId && personId && owner_personId && chapters && languages)) {

            return fetch(`${apiHost}ebi/editorWorkAssign`, {
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
                    isAdd: isAdd,
                    workId: workId,
                    personId: personId,
                    owner_personId: owner_personId,
                    chapters: chapters.toString(),
                    languages: languages.toString()
                }),
            })
            .then(response => {
                dispatch({type: types.FETCHING_RECORD, payload: {editorAssign: false} })
                if (response.status >= 200 && response.status < 300) {
                    return response.json()
                } else {
                    const error = new Error(response.statusText)
                    error.response = response
                    throw error
                }
            })
            .then(response => {
                dispatch({ type: types.WORK_EDITOR_ASSIGN_UPDATE, payload: {workId, editorAssign: response }})
                //Be aware that the response contains ALL of the editors which have been granted access to the work.  So for the
                //  contact update, the work assignments belonging only to that contact will need to be considered.
                //dispatch({ type: types.CONTACT_EDITOR_ASSIGN_UPDATE, payload: {personId, workId, editorAssign: response }});
                dispatch(actionContacts.init(owner_personId))
                dispatch(actionWorks.init(owner_personId))
            })
            .catch(error => {
                dispatch({type: types.FETCHING_RECORD, payload: {editorAssign: false} })
            })
            //   } else {
            //       console.l og('not a valid record, yet');  // DON'T DELETE this console_log
        } else {
            return dispatch({type: types.FETCHING_RECORD, payload: {editorAssign: false} })
        }
    }
}
