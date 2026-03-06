import * as types from './actionTypes'
import * as works from '../actions/works'
import * as contacts from '../actions/contacts'
import * as personConfig from '../actions/person-config'
import {apiHost} from '../api_host'

export const setEditorInviteGUIDResponse = (inviteCode, firstName, lastName, emailAddress, createNew) => {
    return { type: types.EDITOR_INVITE_RESPONSE, payload: {inviteCode, firstName, lastName, emailAddress, createNew} }
}

export const getEditorInviteWorkAssign = (personId, inviteResponse) => {
    return dispatch =>
        fetch(`${apiHost}ebi/inviteEditorResponse/` + personId + `/` + inviteResponse.inviteCode, {
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
            //This is almost identical to the login action response because when the user has an invitation to an author's documents
            //    the back-end will look for the same email address in the FriendInvitation record as well as merge any person
            //    records along with their contacts and their other authors and work assign records.  So the work list can increase,
            //    as well as the contact list and personConfig records, etc.
            if (!!response.personId) {
                dispatch(contacts.init(response.personId))
                dispatch(works.init(response.personId))
                dispatch(works.initWorkIdCurrent(response.personId))
                //dispatch(contacts.initPersonIdCurrent(response.personId)); //We really don't care about the current contact.
                dispatch(personConfig.init(response.personId))
            }
        })
        //.catch(error => { console.l og('The invite code may be empty or does not apply to this user.', error); }); //DON'T DELETE
}
