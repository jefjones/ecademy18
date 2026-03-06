import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_ASSIGN_BY_ADMIN_INIT:
            return action.payload;

				case types.COURSE_ASSIGN_BY_ADMIN_REMOVE: {
						const courseAssignByAdminId = action.payload;
						let newState = Object.assign([], state);
						newState = newState && newState.length > 0 && newState.filter(m => m.courseAssignByAdminId !== courseAssignByAdminId);
						return newState;
				}

        default:
            return state;
    }
}

export const selectCourseAssignByAdmins = (state) => state;
