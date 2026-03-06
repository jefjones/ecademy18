import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.DOCTOR_NOTES_INIT:
            return action.payload;

				case types.DOCTOR_NOTE_UPDATE_APPROVE: {
						let newState = Object.asign([], state);
						let selectedDoctorNotes = action.payload;
						newState = newState && newState.length > 0 && newState.filter(m => selectedDoctorNotes.indexOf(m.doctorNoteId) === -1);
						return newState;
				}
        default:
            return state;
    }
}

export const selectDoctorNotes = (state) => state;
