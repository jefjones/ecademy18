import * as types from './actionTypes';

export const toggleLeftSidePanelOpen = () => {
    //This is a toggle action so that there is not a payload send along.
    return { type: types.LEFT_SIDE_PANEL_TOGGLE, payload: null };
}
