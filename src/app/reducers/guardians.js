import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.GUARDIANS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectGuardians = (state) => {
		return state && state.length > 0 && state.map(m => {
				let nameList = m.studentFirstNames.join(', ');
				nameList = nameList.length > 30 ? nameList.substring(0,30) + '...' : nameList
				m.label = m.lastName + ', ' + m.firstName + ' (' + nameList + ')';
				return m;
		});
}
