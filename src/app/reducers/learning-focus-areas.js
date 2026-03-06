import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.LEARNING_FOCUS_AREAS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectLearningFocusAreas = (state) => state;
