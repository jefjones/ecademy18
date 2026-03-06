import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.LEARNING_PATHWAYS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectLearningPathways = (state) => state;
