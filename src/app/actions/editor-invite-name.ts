import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'

export function setNameAndEmail(firstName="", lastName="", emailAddress="", phone="", inviteMessage="") {
    navigate("/editorInviteWorkAssign")
    return { type: types.EDITOR_INVITE_NAME_EMAIL, payload: {firstName, lastName, emailAddress, phone, inviteMessage }}
}
