import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ASSESSMENT_CORRECT_INIT:
            return action.payload;

        case types.ASSESSMENT_CORRECT_SCORE_UPDATE :{
						let newState = Object.assign({}, state);
						const {assessmentQuestionId, score} = action.payload;
            let details = newState.details;

            details = details && details.length > 0 && details.map(m => {
                if (m.assessmentQuestionId === assessmentQuestionId) m.score = !isNaN(score) && Number(score);
                return m;
            })
            newState.details = details;
						return newState;
				}

				case types.ASSESSMENT_CORRECT_CLEAR:
						return {};

        default:
            return state;
    }
}

export const selectAssessmentCorrect = (state) => state;
