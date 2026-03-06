import * as types from '../actions/actionTypes';

export default function(state = {}, action) {
    switch(action.type) {
        case types.REGISTRATION_INIT:
            return action.payload;

				case types.FINALIZE_REGISTRATION: {
						let registration = Object.assign({}, state);
						registration.finalizedDate = new Date();
						return registration;
				}

				case types.REGISTRATION_RELATION_UPDATE: {
						const {guardianPersonId, studentPersonId, relationTypeId} = action.payload;
						let registration = Object.assign({}, state);
						let students = registration.students;
						let student = {}
						students = students && students.length > 0 && students.filter(m => {
								if (m.personData && m.personData.personId === studentPersonId) {
										student = m;
										return false;
								}
								return true;
						});
						if (student && student.personData) {
								let relations = student.relations;
								relations = relations && relations.length > 0 && relations.filter(m => m.guardianPersonId !== guardianPersonId);
								let option = {
									guardianPersonId,
									relationTypeId,
								}
								relations = relations && relations.length > 0 ? relations.concat(option) : [option];
								student.relations = relations;

								students = students && students.length > 0 ? students.concat(student) : [student];
						}
						registration.students = students;

						return registration;
				}

				case types.REGISTRATION_CUSTODY_UPDATE: {
						const {guardianPersonId, studentPersonId, registrationCustodyId} = action.payload;
						let registration = Object.assign({}, state);
						let students = registration.students;
						let student = {}
						students = students && students.length > 0 && students.filter(m => {
								if (m.personData && m.personData.personId === studentPersonId) {
										student = m;
										return false;
								}
								return true;
						});
						if (student && student.personData) {
								let localCustodies = student.custody;
								localCustodies = localCustodies && localCustodies.length > 0 && localCustodies.filter(m => m.guardianPersonId !== guardianPersonId);
								let option = {
									guardianPersonId,
									registrationCustodyId,
								}
								localCustodies = localCustodies && localCustodies.length > 0 ? localCustodies.concat(option) : [option];
								student.custody = localCustodies;

								students = students && students.length > 0 ? students.concat(student) : [student];
						}
						registration.students = students;

						return registration;
				}

        default:
            return state;
    }
}

export const selectRegistration = (state) => {
	return state
			? state
			: {
					guardianContacts: {
							hasPrimaryGuardian: false,
							primaryGuardians: [],
							hasSecondaryGuardian: false,
							secondaryGuardians: [],
							hasEmergencyContact: false,
							emergencyContacts: [],
					},
					students: [{}],
			}
}
