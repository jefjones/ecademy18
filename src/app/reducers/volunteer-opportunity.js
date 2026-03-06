import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.VOLUNTEER_OPPORTUNITY_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectVolunteerOpportunities = (state) => state;
