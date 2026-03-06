import * as types from '../actions/actionTypes';

export default function(state = "", action) {
    switch(action.type) {
        case types.EDITOR_INVITE_RESPONSE:
            return action.payload ? action.payload : state;
        default:
            return state;
    }
}

export const selectEditorInviteGUIDResponse = (state) => state;
