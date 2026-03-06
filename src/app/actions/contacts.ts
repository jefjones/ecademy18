import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'
import getContacts from '../services/contacts'
import getPersonIdCurrent from '../services/personId-current'
import {apiHost} from '../api_host'

function setContacts( contacts={} ) {
    !!contacts && localStorage.setItem("contacts", JSON.stringify(contacts))
    return { type: types.CONTACTS_INIT, payload: contacts }
}

export const init = (personId) => dispatch =>
    getContacts(personId).then( n => dispatch( setContacts(n)) )

function setPersonIdCurrent( personId_current ) {
    return { type: types.CONTACT_CURRENT_SET_SELECTED, payload: personId_current }
}

export const initPersonIdCurrent = (personId) => dispatch =>
    getPersonIdCurrent(personId).then( n => {
        dispatch( setPersonIdCurrent(n.contactPersonId))
    })

export const setContactCurrentSelected = (personId, contactPersonId, goToPage) => {
    return dispatch =>
      fetch(`${apiHost}ebi/recentContact/`, {
        method: 'put',
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
              contactPersonId,
          }),
      })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
            dispatch({ type: types.CONTACT_CURRENT_SET_SELECTED, payload: contactPersonId })
            if (goToPage) {
                navigate(goToPage)
            }
        }
      })
}
