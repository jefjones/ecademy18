import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_CHOSEN_SESSION:
            return action.payload ? action.payload : null;

        default:
            return state;
    }
}

export const selectStudentChosenSession = (state) => state;
