import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.SAVED_STUDENT_SEARCH_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectSavedStudentSearch = (state) => {
	let newState = [...state];

	newState = newState && newState.length > 0 && newState.map(m => ({
			...m,
			selectedGradeLevels: m.selectedGradeLevels && m.selectedGradeLevels.split(","),
			selectedCredits: m.selectedCredits && m.selectedCredits.split(",")
	}));

	return newState;
}
