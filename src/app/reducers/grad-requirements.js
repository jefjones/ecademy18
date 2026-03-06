import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.GRAD_REQUIREMENTS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectGradRequirements = (state) => state;
