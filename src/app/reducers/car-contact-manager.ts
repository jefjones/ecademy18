import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.CAR_CONTACT_INIT:
            return action.payload

        case types.CAR_CONTACT_FILE_REMOVE: {
            let newState = Object.assign([], state)
            const fileUploadId = action.payload
            newState = newState && newState.length > 0 && newState.map(m => {
                m.fileUploads = m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.filter(f => f.fileUploadId !== fileUploadId)
                return m
            })
            return newState
        }

        case types.CAR_CONTACT_REMOVE: {
            let newState = Object.assign([], state)
            const carContactId = action.payload
            newState = newState && newState.length > 0 && newState.filter(m => m.carContactId !== carContactId)
            return newState
        }

        default:
            return state
    }
}

export const selectCarContacts = (state) => state
