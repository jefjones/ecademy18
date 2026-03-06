import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.SCHOOL_YEAR_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectSchoolYears = (state) => state;
