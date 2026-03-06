import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.TEST_SETTINGS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectTestSettings = (state) => state;
