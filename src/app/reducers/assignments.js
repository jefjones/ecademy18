import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ASSIGNMENTS_INIT: {
            return action.payload;
        }

				case types.ASSIGNMENT_UPDATE: {
						let newState = Object.assign([], state);
						const assignment = action.payload;
						newState = newState && newState.length > 0 && newState.filter(m => m.assignmentId !== assignment.assignmentId);
						newState = newState && newState.length ? newState.concat(assignment) : [assignment];
            return newState;
        }

        default:
           return state;
    }
}

export const selectAssignments = (state) => state;
