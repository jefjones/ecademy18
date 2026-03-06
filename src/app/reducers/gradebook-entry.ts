import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.GRADEBOOK_INIT:
            return action.payload

				case types.GRADEBOOK_FINALIZE_GRADE_DATE:
						let newStateGrade = Object.assign({}, state)
						newStateGrade.studentGradeFinalDate = new Date()
						return newStateGrade

				case types.GRADEBOOK_STUDENT_ASSIGNMENT_SCORE :{
						let newState = Object.assign({}, state)
						const {studentPersonId, assignmentId, score} = action.payload
						let studentScores = newState.studentScores
						let foundRecord = false
						if (score !== 0 && !score) {
								studentScores = newState.studentScores.length > 0 && newState.studentScores.filter(m => !(m.studentPersonId === studentPersonId && m.assignmentId === assignmentId))
						} else {
								studentScores = newState.studentScores && newState.studentScores.length > 0 && newState.studentScores.filter(m => {
										if (m.studentPersonId === studentPersonId && m.assignmentId === assignmentId) {
												m.score = score
                        m.editMode = true
												foundRecord = true
												if (m.scoredAnswers && m.scoredAnswers.length > 0) {
														m.scoredAnswers = m.scoredAnswers && m.scoredAnswers.length > 0 && m.scoredAnswers.map(s => {
																s.score = m.score
																return s
														})
												} else {
														let assignment = newState && newState.assignments && newState.assignments.length > 0 && newState.assignments.filter(a => a.assignmentId === assignmentId)[0]
														let standards = []
														if (assignment && assignment.assignmentId) standards = assignment.standards
														m.scoredAnswers = [{
																score: score,
																pointsPossible: assignment.totalPoints,
																standards: standards,
														}]
												}
										}
										return m
								})
								if (!foundRecord) {
										let newScore = {
												studentPersonId,
												assignmentId,
												score: Number(score),
                        editMode: true,
										}
										studentScores = studentScores && studentScores.length > 0 ? studentScores.concat(newScore) : [newScore]
								}
						}
						newState.studentScores = studentScores
						return newState
				}

				case types.GRADEBOOK_STUDENT_ASSIGNMENT_STANDARD_BASED :{
						let newState = Object.assign({}, state)
						const {studentPersonId, assignmentId, nextSequence} = action.payload
						let studentScores = newState.studentScores
						let foundRecord = false
						studentScores = newState.studentScores && newState.studentScores.length > 0 && newState.studentScores.filter(m => {
								if (m.studentPersonId === studentPersonId && m.assignmentId === assignmentId) {
										foundRecord = true
										m.score = 0
										m.knowledgeRatingSequence = nextSequence
								}
								return m
						})
						if (!foundRecord) {
								let newScore = {
										studentPersonId,
										assignmentId,
										score: 0,
										knowledgeRatingSequence: nextSequence,
								}
								studentScores = studentScores && studentScores.length > 0 ? studentScores.concat(newScore) : [newScore]
						}
						newState.studentScores = studentScores
						return newState
				}

				case types.GRADEBOOK_RESPONSE_VISITED_UPDATE: {
						const {studentAssignmentResponseId, responseVisitedTypeCode} = action.payload
						let newState = Object.assign({}, state)
						newState.studentScores = state && state.studentScores && state.studentScores.length > 0 && state.studentScores.map(m => {
								m.scoreResponses = m.scoreResponses && m.scoreResponses.length > 0 && m.scoreResponses.map(s => {
										s.textResponses = s.textResponses && s.textResponses.length > 0 && s.textResponses.map(t => {
												if (t.id === studentAssignmentResponseId) t.responseVisitedTypeCode = responseVisitedTypeCode
												return t
										})
										s.websiteLinks = s.websiteLinks && s.websiteLinks.length > 0 && s.websiteLinks.map(t => {
												if (t.id === studentAssignmentResponseId) t.responseVisitedTypeCode = responseVisitedTypeCode
												return t
										})
										s.fileUploadUrls = s.fileUploadUrls && s.fileUploadUrls.length > 0 && s.fileUploadUrls.map(t => {
												if (t.id === studentAssignmentResponseId) t.responseVisitedTypeCode = responseVisitedTypeCode
												return t
										})
										return s
								})
								return m
						})
						return newState
				}

				case types.GRADEBOOK_STUDENT_OVERALLGRADE: {
						const {studentPersonId, overallGrade} = action.payload
						let newState = Object.assign({}, state)
						// //StudentOverallGrades
						// let currentStudentOverallGrades = newState && newState.studentOverallGrades && newState.studentOverallGrades.length > 0
						// 		&& newState.studentOverallGrades.filter(m => m.personId !== studentPersonId);
						// newState.studentOverallGrades = currentStudentOverallGrades && currentStudentOverallGrades.length > 0
						// 		? currentStudentOverallGrades.concat(studentOverallGrades)
						// 		: studentOverallGrades;
            let students = newState && newState.students
            students = students && students.length > 0 && students.map(m => {
                if (m.personId === studentPersonId)  m.overallGrade = overallGrade
                return m
            })

            newState.students = students

						// //StudentOverallGrades
						// let currentStudentContentScores = newState && newState.studentContentScores && newState.studentContentScores.length > 0
						// 		&& newState.studentContentScores.filter(m => m.studentPersonId !== studentPersonId);
						// newState.studentContentScores = currentStudentContentScores && currentStudentContentScores.length > 0
						// 		? currentStudentContentScores.concat(studentContentScores)
						// 		: studentContentScores;

						return newState
				}

				case types.STUDENT_SCORE_EDIT_MODE_SET: {
					const {assignmentId, studentPersonId} = action.payload
					let newState = Object.assign({}, state)
					//StudentOverallGrades
					let foundRecord = false; //It is possible that the user is trying to put in a score of a blank field that is avoiding putting
																	 //	in too many edit controls since it overwhelms the browser.  so create the new record if it is not found.
					let studentScores = newState.studentScores && newState.studentScores.length > 0 && newState.studentScores.map(m => {
							if (m.studentPersonId === studentPersonId && m.assignmentId === assignmentId)
									m.editMode = true
							return m
					})
					if (!foundRecord) {
							let thisStudentScores = studentScores && studentScores.length > 0 && studentScores.filter(m => m.studentPersonId === studentPersonId)
							let option = {
									editMode: true,
									studentPersonId,
									assignmentId,
									isPublished: true,
							}
							thisStudentScores = thisStudentScores && thisStudentScores.length > 0 ? thisStudentScores.concat(option) : [option]
							studentScores = studentScores && studentScores.length > 0 && studentScores.filter(m => m.studentPersonId !== studentPersonId)
							studentScores = studentScores && studentScores.length > 0 ? studentScores.concat(thisStudentScores) : [thisStudentScores]
					}
					newState.studentScores = studentScores
					return newState
				}

        case types.GRADEBOOK_GRADE_OVERWRITE: {
            const {studentPersonId, intervalId, field, value} = action.payload
            let newState = Object.assign({}, state)
            let gradeOverwrites = newState.gradeOverwrites
            gradeOverwrites = gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => {
                let found = false
                if (m.studentPersonId === studentPersonId && m.intervalId === intervalId) {
                    found = true
                }
                return !found; //Cut out the one that matches - the one which is found.
            })
            let option = {studentPersonId, intervalId, [field]: value === 'EMPTY' ? '' : value}
            gradeOverwrites = gradeOverwrites && gradeOverwrites.length > 0 ? gradeOverwrites.concat(option) : [option]
            newState.gradeOverwrites = gradeOverwrites
            return newState
        }

        default:
            return state
    }
}

export const selectGradebook = (state) => state
