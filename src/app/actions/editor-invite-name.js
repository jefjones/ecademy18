import * as types from './actionTypes.js';
import { browserHistory } from 'react-router';

export function setNameAndEmail(firstName="", lastName="", emailAddress="", phone="", inviteMessage="") {
    browserHistory.push("/editorInviteWorkAssign");
    return { type: types.EDITOR_INVITE_NAME_EMAIL, payload: {firstName, lastName, emailAddress, phone, inviteMessage }};
}
