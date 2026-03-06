import * as types from '../actions/actionTypes';
import {guidEmpty} from '../utils/guidValidate.js';

export default function(state = [], action) {
    switch(action.type) {
        case types.DOCTOR_NOTE_INVITES_INIT:
            return action.payload;

				case types.DOCTOR_NOTE_INVITES_UPDATE: {
						let newState = Object.assign([], state);
						let doctorNoteInvite = action.payload;
						if (doctorNoteInvite.doctorNoteInviteId && doctorNoteInvite.doctorNoteInviteId !== guidEmpty) {
								newState = newState && newState.length > 0 && newState.filter(m => m.doctorNoteInviteId !== doctorNoteInvite.doctorNoteInviteId);
						} else {
							  newState = newState && newState.length > 0 ? newState.concat(doctorNoteInvite) : [doctorNoteInvite];
						}
						return newState;
				}

				case types.DOCTOR_NOTE_INVITES_DELETE: {
						let newState = Object.assign([], state);
						let doctorNoteInviteId = action.payload;
						newState = newState && newState.length > 0 && newState.filter(m => m.doctorNoteInviteId !== doctorNoteInviteId);
						return newState;
				}

        default:
            return state;
    }
}

export const selectDoctorNoteInvites = (state) => state;
