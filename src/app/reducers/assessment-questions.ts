import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.ASSESSMENT_QUESTIONS_INIT: {
            return action.payload
        }

				case types.ASSESSMENT_QUESTION_ANSWER_SET: { //ASSESSMENT_QUESTIONS_UPDATE
						const {assessmentQuestionId, answer} = action.payload
						let newState = [...state]
						newState = newState && newState.length > 0 && newState.map(m => {
								if (m.assessmentQuestionId === assessmentQuestionId) {
										m.learnerAnswer = {...m.learnerAnswer, learnerAnswer: answer};  //question.learnerAnswer.learnerAnswer
								}
								return m
						})

            return newState
        }

				case types.ASSESSMENT_CORRECT_SCORE_UPDATE: {
						const {assessmentQuestionId, score} = action.payload
						let newState = [...state]
						newState = newState && newState.length > 0 && newState.map(m => {
								if (m.assessmentQuestionId === assessmentQuestionId) {
										m.learnerAnswer = {...m.learnerAnswer, score};  //question.learnerAnswer.learnerAnswer
								}
								return m
						})

            return newState
        }

				case types.ASSESSMENT_QUESTION_CLEAR:
						return []

        default:
            return state
    }
}

export const selectAssessmentQuestions = (state) => state
