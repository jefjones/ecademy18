import * as types from '../actions/actionTypes';
import {combineReducers} from 'redux';

const wideList = (state = [], action) => {
    switch(action.type) {
        case types.LEARNERS_WIDE_LIST_INIT:
            return action.payload;

        default:
            return state;
    }
}

const simpleList = (state = [], action) => {
    switch(action.type) {
        case types.LEARNERS_SIMPLE_LIST_INIT:
            return action.payload;

        default:
            return state;
    }
}

export default combineReducers({ wideList, simpleList });

export const selectLearners = (state) => state.wideList;
export const selectLearnersSimple = (state) => state.simpleList;
