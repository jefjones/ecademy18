import * as types from '../actions/actionTypes';

export default function(state = 0, action) {
    switch(action.type) {
        case types.LANGUAGE_CURRENT_SET_SELECTED: {
            !!action.payload && localStorage.setItem("languageId_current", JSON.stringify(action.payload));
            return action.payload ? action.payload : state;
        }
        case types.WORK_CURRENT_SET_SELECTED: {
            const {languageId} = action.payload;
            return languageId ? languageId : state;
        }
        default:
            return state;
    }
}

export const selectLanguageIdCurrent = (state) => state;
