import * as types  from '../actions/actionTypes';

export default function(state = {}, action) {
  switch (action.type) {
    case types.COURSE_CLIPBOARD_INIT:
      	return action.payload;

		case types.COURSE_CLIPBOARD_UPDATE: {
	      return action.payload;
		}

		case types.COURSE_CLIPBOARD_ADD: {
				let newState = Object.assign({}, state);
				let newList = action.payload;
				let newCourseList = newList.courseList;
				newCourseList && newCourseList.length > 0 && newCourseList.forEach(newId => {
						let exists = newState.courseList && newState.courseList.length > 0 && newState.courseList.filter(currentId => currentId === newId)[0];
						if (exists) {
								newState.courseList = newState.courseList && newState.courseList.length > 0 && newState.courseList.filter(currentId => currentId !== newId);
						} else {
								newState.courseList = newState.courseList ? newState.courseList.concat(newId) : [newId];
						}
				})
	      return newState;
		}

		case types.COURSE_CLIPBOARD_REMOVE: {
				let newState = Object.assign({}, state);
				let removeCourseId = action.payload;
				if (removeCourseId && newState.courseList.indexOf(removeCourseId) > -1)
						newState.courseList = newState.courseList.filter(f => f !== removeCourseId);
      	return newState;
		}

    default:
        return state;
  	}
}

export const selectCourseClipboard = (state) => state;
