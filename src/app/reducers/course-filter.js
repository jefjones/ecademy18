import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_FILTERS_INIT:
            const courseFilter = action.payload;
            if (courseFilter && courseFilter[0].selectedLearnerOutcomes && typeof courseFilter[0].selectedLearnerOutcomes !== 'object') {
                courseFilter[0].selectedLearnerOutcomes = courseFilter[0].selectedLearnerOutcomes.split(",");
                courseFilter[0].selectedLearnerOutcomes = courseFilter[0].selectedLearnerOutcomes.map(m => parseInt(m));
            }
            if (courseFilter && courseFilter[0].selectedLearnerOutcomeTargets && typeof courseFilter[0].selectedLearnerOutcomeTargets !== 'object') {
                courseFilter[0].selectedLearnerOutcomeTargets = courseFilter[0].selectedLearnerOutcomeTargets.split(",");
            }

            return courseFilter ? courseFilter : state;

        default:
            return state;
    }
}

export const selectCourseFilter = (state) => state;
