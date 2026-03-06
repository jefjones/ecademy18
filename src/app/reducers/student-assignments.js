import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_ASSIGNMENTS_INIT:
            return !action.payload || action.payload.length === 0  ? [] : action.payload;

				case types.STUDENT_ASSIGNMENT_SCORE_ENTRY: {
						let {assignmentId, score} = action.payload
						let newState = Object.assign({}, state);
						let assignments = newState.assignments;
						assignments = assignments && assignments.length > 0 && assignments.map(m => {
								if (m.assignmentId === assignmentId) {
										m.score = score === 'EMPTY' ? '' : score;
										if (m.scoredAnswers && m.scoredAnswers.length > 0) {
												m.scoredAnswers = m.scoredAnswers && m.scoredAnswers.length > 0 && m.scoredAnswers.map(s => {
														s.score = m.score;
														return s;
												})
										} else {
												let assignment = newState && newState.assignments && newState.assignments.length > 0 && newState.assignments.filter(a => a.assignmentId === assignmentId)[0];
												let standards = []
												if (assignment && assignment.assignmentId) standards = assignment.standards;
												m.scoredAnswers = [{
														score: score,
														pointsPossible: assignment.totalPoints,
														standards: standards,
												}];
										}
								}
	              return m;
						});
						newState.assignments = assignments;
						return newState;
				}

        case types.GRADEBOOK_SCORE_UPDATE_RATING: {
						const {assignmentId, nextSequence} = action.payload;
            let newState = Object.assign({}, state);
            let foundRecord = false;
            let assignments = newState.assignments && newState.assignments.length > 0 && newState.assignments.map(m => {
                if (m.assignmentId === assignmentId)
                    m.knowledgeRatingSequence = nextSequence;
                    foundRecord = true;
                return m;
            })
            if (!foundRecord) {
								let option = {contentTypeId: '', assignmentId, knowledgeRatingSequence: nextSequence };
								assignments = assignments ? assignments.concat(option) : [option];
						}
            newState.assignments = assignments;
            return newState;
				}

        case types.ASSIGNMENT_SCORE_EDIT_MODE_SET: {
          const {assignmentId} = action.payload;
          let newState = Object.assign({}, state);
          //StudentOverallGrades
          let assignments = newState.assignments && newState.assignments.length > 0 && newState.assignments.map(m => {
              //m.editMode = false;
              if (m.assignmentId === assignmentId)
                  m.editMode = true;
              return m;
          })
          newState.assignments = assignments;
          return newState;
        }

        default:
            return state;
    }
}

export const selectStudentAssignments = (state) => state;
