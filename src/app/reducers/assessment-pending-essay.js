import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ASSESSMENT_PENDING_ESSAY:
            return action.payload;

        default:
            return state;
    }
}

export const selectAssessmentPendingEssay = (state) => state;
