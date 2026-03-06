import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.CONTENT_TYPES_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectContentTypes = (state) => state;
