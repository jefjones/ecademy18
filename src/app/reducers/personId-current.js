import * as types from '../actions/actionTypes';
import * as guid from '../utils/GuidValidate.js';

export default function(state = 0, action) {
    switch(action.type) {
        case types.CONTACT_CURRENT_SET_SELECTED:
            return action.payload ? action.payload : state;

        default:
            return state;
    }
}

export const selectPersonIdCurrent = (state) => guid.isGuidNotEmpty(state) ? state : 0;
