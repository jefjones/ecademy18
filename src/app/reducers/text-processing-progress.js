import * as types from '../actions/actionTypes';

export default function(state = {}, action) {
    switch(action.type) {
        case types.TEXT_PROCESSING_PROGRESS_GET:
            return action.payload;

        default:
            return state;
    }
}

export const selectTextProcessingProgress = (state) => state;
