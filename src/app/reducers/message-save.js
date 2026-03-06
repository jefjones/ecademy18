import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.MESSAGE_COMPOSE_SAVE:
            return action.payload;

        default:
            return state;
    }
}

export const selectMessageSave = (state) => state;
