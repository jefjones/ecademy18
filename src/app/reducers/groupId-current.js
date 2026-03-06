import * as types from '../actions/actionTypes';

export default function(state = 0, action) {
    switch(action.type) {
        case types.GROUPS_CURRENT_SET_SELECTED: {
            const groupId = action.payload;
            !!groupId && localStorage.setItem("groupId_current", JSON.stringify(groupId));
            return groupId ? groupId : state;
        }
        default:
            return state;
    }
}

export const selectGroupIdCurrent = (state) => state;
