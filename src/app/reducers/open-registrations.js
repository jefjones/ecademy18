import * as types  from '../actions/actionTypes';

export default function(state = [], action) {
  switch (action.type) {
    case types.OPEN_REGISTRATIONS_INIT:
      return action.payload;

    case types.OPEN_REGISTRATIONS_REMOVE: {
        let newState = Object.assign([], state);
        const openRegistrationTableId = action.payload
        newState = newState && newState.length > 0 && newState.filter(m => m.openRegistrationTableId !== openRegistrationTableId);
        return newState;
    }

    default:
        return state;
  }
}

export const selectOpenRegistrations = (state) => state;

export const selectOpenRegistration = (state, personId) => {
		let openRegistrations = state;
		let openRegistration = {};
		if (personId) {
				openRegistrations && openRegistrations.length > 0 && openRegistrations.forEach(m => {
						m.studentList && m.studentList.length > 0 && m.studentList.forEach(s => {
								if (s.studentPersonId === personId) openRegistration = m;
						})
				})
		}
		if (openRegistration && openRegistration.openDateTo) {
				let today = new Date();
				let openDateFrom = openRegistration.openDateFrom ? new Date(openRegistration.openDateFrom) : '';
				let openDateTo = openRegistration.openDateTo ? new Date(openRegistration.openDateTo) : '';
				openDateTo = openDateTo.setDate(openDateTo.getDate() + 1);
				if (openDateFrom && today >= openDateFrom && today <= openDateTo) {
						openRegistration.isOpen = true;
				} else if (today <= openDateTo) {
						openRegistration.isOpen = true;
				}
		}
		return openRegistration;
}
