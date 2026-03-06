import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.GROUPS_INIT:
            !!action.payload && localStorage.setItem("groups", JSON.stringify(action.payload));
            return action.payload;

        case types.GROUPS_DELETE:
            const groupId = action.payload
            return state.filter(m => m.groupId !== groupId);;

        default:
            return state;
    }
}

export const selectGroups = (state) => state;
export const selectGroupById = (state, groupId) => state && state.length > 0 && state.filter(m => m.groupId === groupId)[0];
