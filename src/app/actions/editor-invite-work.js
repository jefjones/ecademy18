import * as types from './actionTypes.js';
import { browserHistory } from 'react-router';
import {apiHost} from '../api_host.js';

export function init() {
    return { type: types.EDITOR_INVITE_WORK_CHAPTERS_INIT, payload: [] };
}

export function setWorkAssign(workId="", chapterIdList=[], languageIdList=[], deleteChoice=false) {
    return { type: types.EDITOR_INVITE_WORK_CHAPTERS, payload: {workId, chapterIdList, languageIdList, deleteChoice }};
}

export function sendEditorInvite(user_PersonId, editorInviteName, editorInviteWorkAssign=[]) {  //The work assign object cna be empty.
  return dispatch =>
    fetch(`${apiHost}ebi/inviteNewEditor`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "http://*",
        'Access-Control-Allow-Origins' : '*',
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
      body: JSON.stringify({
        from_PersonId: user_PersonId,
        to_EmailAddress: editorInviteName.emailAddress,
        to_Phone: editorInviteName.phone,
        to_FirstName: editorInviteName.firstName,
        to_LastName: editorInviteName.lastName,
        to_PersonId: editorInviteName.to_PersonId, //this is for the existing contact record when it is detected that they are not yet a Penspring user.
        inviteMessage: editorInviteName.inviteMessage,
        editorInviteWorkAssign,
      }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
          return response.json();
        //dispatch(loginSuccess(response.json()));
      } else {
        const error = new Error(response.statusText);
        throw error;
      }
    })
    .then(response => {
        dispatch ({ type: types.EDITOR_INVITE_PENDING, payload: response });
        dispatch ({ type: types.EDITOR_INVITE_NAME_EMAIL, payload: {} }); //Blank out the invite name and email so that the controls will not fill in next time.
        dispatch ({ type: types.EDITOR_INVITE_WORK_CHAPTERS, payload: {} }); //Blank out the invite name and email so that the controls will not fill in next time.
        browserHistory.push('/firstNav');
    })
    //.catch(error => { console.l og('request failed', error); });
}
