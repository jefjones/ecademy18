import * as types from '../actions/actionTypes';
import * as guid from '../utils/GuidValidate.js';

export default function(state = 0, action) {
    switch(action.type) {
        case types.CHAPTER_CURRENT_SET_SELECTED: {
            !!action.payload && localStorage.setItem("chapterId_current", JSON.stringify(action.payload));
            return action.payload ? action.payload : state;
        }
        case types.WORK_CURRENT_SET_SELECTED: {
            const {chapterId} = action.payload;
            return chapterId ? chapterId : state;
        }
        default:
            return state;
    }
}

export const selectChapterIdCurrent = (state) => guid.isGuidNotEmpty(state) ? state : guid.emptyGuid();
