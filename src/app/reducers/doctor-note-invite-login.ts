import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.DOCTOR_NOTE_INVITE_LOGIN:
            return action.payload

        default:
            return state
    }
}

export const selectDoctorNoteInviteId = (state) => state
