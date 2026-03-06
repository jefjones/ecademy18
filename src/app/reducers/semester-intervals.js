import * as types from '../actions/actionTypes';
import {guidEmpty} from '../utils/guidValidate';
import {doSort} from '../utils/sort.js';

export default function(state = [], action) {
    switch(action.type) {
        case types.SEMESTER_INTERVAL_INIT:
            return action.payload;

        case types.SEMESTER_INTERVAL_ADD_UPDATE:
            const interval = action.payload;
            let newState = Object.assign([], state);
            if (interval.intervalId && interval.intervalId !== guidEmpty) {
                newState = newState && newState.length > 0 && newState.filter(m => m.intervalId !== interval.intervalId);
            }
            newState = newState && newState.length > 0 ? newState.concat(interval) : [interval];
            newState = doSort(newState, { sortField: 'sequence', isAsc: true, isNumber: true })
            return newState;

        default:
            return state;
    }
}

export const selectIntervals = (state) => state;
