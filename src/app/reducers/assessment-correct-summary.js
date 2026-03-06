import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ASSESSMENT_CORRECT_SUMMARY_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectAssessmentCorrectSummary = (state) => state;
