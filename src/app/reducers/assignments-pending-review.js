import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ASSIGNMENTS_PENDING_REVIEW:
            return action.payload;

        default:
            return state;
    }
}

export const selectAssignmentsPendingReview = (state) => state;
