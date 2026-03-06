import * as types from '../actions/actionTypes';

export default function(state = false, action) {
    switch(action.type) {
        case types.LEFT_SIDE_PANEL_TOGGLE:
            let openToggle = !state;
            return openToggle;
        default:
            return state;
    }
}

export const selectLeftSidePanelOpen = (state) => state;
