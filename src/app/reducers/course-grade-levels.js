import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_GRADE_LEVELS:
						const courseGradeLevels = action.payload;
						var result = courseGradeLevels.reduce((acc, {courseEntryId, ...courseGradeLevels}) => {
								acc = {
										 ...acc,
										[courseEntryId]: {
												...courseGradeLevels,
												courseEntryId,
										}
								}
								return acc;
						}, {});

            return result;

        default:
            return state;
    }
}

 export const selectCourseGradeLevels = (state) => state;
