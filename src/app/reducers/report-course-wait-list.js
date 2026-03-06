import * as types from '../actions/actionTypes';
import {combineReducers} from 'redux';

const report = (state = [], action) => {
    switch(action.type) {
        case types.COURSE_WAIT_LIST_REPORT_INIT:
            return action.payload;

        default:
            return state;
    }
}

const doNotAddCourses = (state = [], action) => {
    switch(action.type) {
        case types.DO_NOT_ADD_COURSE_INIT:
            return action.payload;

				case types.TOGGLE_DO_NOT_ADD_COURSE: {
						const courseEntryId = action.payload;
						let newState = Object.assign([], state);
						let exists = newState && newState.length > 0 && newState.filter(m => m.courseEntryId === courseEntryId)[0]
						newState = exists && exists.courseEntryId
								? newState.filter(m => m.courseEntryId !== courseEntryId)
								: newState && newState.length > 0
										? newState.concat({courseEntryId})
										: [{courseEntryId}]
						return newState;
				}

        default:
            return state;
    }
}

export default combineReducers({report, doNotAddCourses});

export const selectDoNotAddCourses = (state) => state.doNotAddCourses;
export const selectReportExcelCourseWaitList = (state) => state.report;
