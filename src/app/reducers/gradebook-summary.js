import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.GRADEBOOK_SUMMARY_INIT:
            return action.payload;

				case types.GRADEBOOK_SCORE_UPDATE_RATING: {
						const {studentPersonId, assignmentId, nextSequence} = action.payload;
						let gradebook = Object.assign({}, state);
						let studentScores = gradebook && gradebook.studentScores;
						let foundRecord = false;
						if (studentScores && studentScores.length > 0) {
								studentScores = studentScores.map(m => {
										if (m.studentPersonId === studentPersonId && m.assignmentId === assignmentId) {
												m.knowledgeRatingSequence = nextSequence;
												foundRecord = true;
										}
										return m;
								})
						}
						if (!foundRecord) {
								let option = {contentTypeId: '', studentPersonId, assignmentId, knowledgeRatingSequence: nextSequence };
								studentScores = studentScores ? studentScores.concat(option) : [option];
						}
						gradebook.studentScores = studentScores;
						return gradebook;
				}

				case types.GRADEBOOK_SCORE_UPDATE_PASSFAIL: {
						const {studentPersonId, assignmentId, nextSequence} = action.payload;
						let gradebook = Object.assign({}, state);
						let studentScores = gradebook && gradebook.studentScores;
						let foundRecord = false;
						if (studentScores && studentScores.length > 0) {
								studentScores = studentScores.map(m => {
										if (m.studentPersonId === studentPersonId && m.assignmentId === assignmentId) {
												m.passFailSequence = nextSequence;
												foundRecord = true;
										}
										return m;
								})
						}
						if (!foundRecord) {
								let option = {contentTypeId: '', studentPersonId, assignmentId, passFailSequence: nextSequence };
								studentScores = studentScores ? studentScores.concat(option) : [option];
						}
						gradebook.studentScores = studentScores;
						return gradebook;
				}

				case types.GRADEBOOK_SCORE_UPDATE_TRADITIONAL: {
						const {studentPersonId, assignmentId, score} = action.payload;
						let gradebook = Object.assign({}, state);
						let studentScores = gradebook && gradebook.studentScores;
						let foundRecord = false;
						if (studentScores && studentScores.length > 0) {
								studentScores = studentScores.map(m => {
										if (m.studentPersonId === studentPersonId && m.assignmentId === assignmentId) {
												m.score = score;
												foundRecord = true;
										}
										return m;
								})
						}
						if (!foundRecord) {
								let option = {contentTypeId: '', studentPersonId, assignmentId, score };
								studentScores = studentScores ? studentScores.concat(option) : [option];
						}
						gradebook.studentScores = studentScores;
						return gradebook;
				}

        default:
            return state;
    }
}

export const selectGradebookSummary = (state) => state;
