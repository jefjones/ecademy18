import * as types from '../actions/actionTypes';

export default function(state = {}, action) {
    switch(action.type) {
        case types.LEARNER_FILTERS_INIT:
            const learnerFilter = action.payload;
            if (learnerFilter && learnerFilter[0].selectedLearnerOutcomes && typeof learnerFilter[0].selectedLearnerOutcomes !== 'object') {
                learnerFilter[0].selectedLearnerOutcomes = learnerFilter[0].selectedLearnerOutcomes.split(",");
                learnerFilter[0].selectedLearnerOutcomes = learnerFilter[0].selectedLearnerOutcomes.map(m => parseInt(m));
            }
            if (learnerFilter && learnerFilter[0].selectedLearnerOutcomeTargets && typeof learnerFilter[0].selectedLearnerOutcomeTargets !== 'object') {
                learnerFilter[0].selectedLearnerOutcomeTargets = learnerFilter[0].selectedLearnerOutcomeTargets.split(",");
            }

            return learnerFilter ? learnerFilter : state;

        default:
            return state;
    }
}

export const selectLearnerFilter = (state) => state;
