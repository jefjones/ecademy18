import * as types from '../actions/actionTypes'
import * as guid from '../utils/GuidValidate'

export default function(state = {}, action) {
    switch(action.type) {
        case types.CONTACTS_INIT:
            return action.payload

        case types.CONTACT_EDITOR_ASSIGN_UPDATE: {
            //It is possible that editorAssign is blank because this particular work access has been deleted for this editor.
            //Be aware that the editorResponse records contain ALL of the editors which have been granted access to the work.  So for the
            //  contact update, the work assignments belonging only to that contact will need to be considered.
            let {personId, workId, editorAssign} = action.payload
            personId = guid.isGuidNotEmpty(personId) ? personId : 0
            workId = guid.isGuidNotEmpty(workId) ? workId : 0
            let newEditorAssign = state[personId].editorAssign
            newEditorAssign = newEditorAssign.filter(m => m.workId !== workId); //This takes the work away in preparation to update the work, if it was changed and not deleted altogether..
            let contactEditorAssign = editorAssign && editorAssign.length > 0 && editorAssign.filter(m => m.editorPersonId === personId && m.workId === workId)
            newEditorAssign = newEditorAssign ? newEditorAssign.concat(contactEditorAssign) : contactEditorAssign

            return {
                 ...state,
                [personId]: {
                    ...state[personId],
                    personId: personId,
                    editorAssign: newEditorAssign,
                }
            }
        }
        default:
            return state
    }
}

export const selectContacts = (state) => state
export const selectContactById = (state, personId) => personId && state[personId]
export const selectContactsArray = (state) => Object.keys(state).reduce((acc, contact) => state[contact] ? acc.concat(state[contact]) : acc, [])
export const selectContactsByListIds = (state, personIds) => {
    let result = {}
    personIds && personIds.length > 0 &&
        personIds.forEach(personId => {
            let contact = selectContactById(state, personId)
            result = {
                 ...result,
                [contact.personId]: {
                    fullName: contact.fullName
                }
            }
        })
    return result
}

//export const selectContactsSummary
