import { useEffect } from 'react'
import AssessmentCorrectView from '../views/AssessmentCorrectView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBenchmarkTests from '../actions/benchmark-tests'
import * as actionAssessmentCorrect from '../actions/assessment-correct'
import * as actionAssessmentQuestions from '../actions/assessment-questions'
import * as actionAssessment from '../actions/assessment'
import * as actionPenspringTransfer from '../actions/penspring-transfer'
import * as actionStandardsRating from '../actions/standards-rating'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAssessmentQuestions, selectAssessment, selectAssessmentCorrect, selectStudents, selectAccessRoles, selectStandardsRating,
 					selectFetchingRecord, selectBenchmarkTests } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let assessmentQuestions = selectAssessmentQuestions(state)
		let assessmentCorrect = selectAssessmentCorrect(state)
		let benchmarkTests = selectBenchmarkTests(state)
		let benchmarkTestId = props.params && props.params.benchmarkTestId
		let benchmarkTest = benchmarkTestId && benchmarkTests && benchmarkTests.length > 0 && benchmarkTests.filter(m => m.benchmarkTestId === benchmarkTestId)[0]
    let studentPersonId = props.params && props.params.studentPersonId
		let students = selectStudents(state)
    let accessRoles = selectAccessRoles(state)
    let student = studentPersonId && students && students.length > 0 && students.filter(m => m.personId === studentPersonId)[0]
    students = assessmentCorrect && assessmentCorrect.studentsCompleted && assessmentCorrect.studentsCompleted.length > 0
				? students.length > 0 && students.filter(m => {
							let foundStudent = false
							assessmentCorrect.studentsCompleted && assessmentCorrect.studentsCompleted.length > 0 && assessmentCorrect.studentsCompleted.forEach(s => {
									if (m.id === s.id) foundStudent = true
							})
							return foundStudent
					})
				: []
		let assessment = selectAssessment(state)
		let standardsRatings = selectStandardsRating(state)
		standardsRatings = assessmentCorrect && assessmentCorrect.standardsRatingTableId && standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === assessmentCorrect.standardsRatingTableId)
		let correctionTypeFilter = [{
				label: 'All',
				id: 'all',
			},
			{
				label: 'Pending essays',
				id: 'pendingEssays',
			},
			{
				label: 'Wrong answers',
				id: 'wrongAnswers',
			},
			{
				label: 'Correct answer',
				id: 'correctAnswers',
			},
		]

		let questionTypeFilter = [{
				label: 'All',
				id: 'all',
			},
			{
				label: 'Essays',
				id: 'ESSAY',
			},
			{
				label: 'Multiple Choice',
				id: 'MULTIPLECHOICE',
			},
  			{
				label: 'Multiple Answer',
				id: 'MULTIPLEANSWER',
			},
			{
				label: 'True or False',
				id: 'TRUEFALSE',
			},
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
				assignmentId: props.params.assignmentId,
				benchmarkTest,
				benchmarkTestId,
				standardsRatings,
				correctionTypeFilter,
				questionTypeFilter,
        accessRoles,
        studentFullName: accessRoles.learner ? me.fname + ' ' + me.lname : student && student.firstName + ' ' + student.lastName,
        studentPersonId: props.params && props.params.studentPersonId,
        assessmentId: props.params && props.params.assessmentId,
        students,
				assessment,
				assessmentQuestions,
        assessmentCorrect: assessmentCorrect,
				fetchingRecord: selectFetchingRecord(state),
				courseScheduledId: props.params && props.params.courseScheduledId,
    }
}

const bindActionsToDispatch = dispatch => ({
		getAssessment: (personId, assessmentId) => dispatch(actionAssessment.getAssessment(personId, assessmentId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		assessmentQuestionsInit: (personId, studentPersonId, assessmentId, assignmentId) => dispatch(actionAssessmentQuestions.init(personId, studentPersonId, assessmentId, assignmentId)),
    getCorrectedAssessment: (personId, studentPersonId, assessmentId, assignmentId) => dispatch(actionAssessmentCorrect.getCorrectedAssessment(personId, studentPersonId, assessmentId, assignmentId)),
		retakeTest: (personId, assignmentId, assessmentId) => dispatch(actionAssessmentCorrect.retakeTest(personId, assignmentId, assessmentId)),
		teacherEssayResponse: (personId, teacherResponse) => dispatch(actionAssessmentCorrect.teacherEssayResponse(personId, teacherResponse)),
		setPenspringTransfer: (personId, work) => dispatch(actionPenspringTransfer.setPenspringTransfer(personId, work)),
		updateTeacherAssessmentLearnerAnswer: (personId, studentPersonId, assessmentQuestionId, score, assignmentId) => dispatch(actionAssessmentQuestions.updateTeacherAssessmentLearnerAnswer(personId, studentPersonId, assessmentQuestionId, score, assignmentId)),
    setLocalScore: (assessmentQuestionId, score) => dispatch(actionAssessmentCorrect.setLocalScore(assessmentQuestionId, score )),
		clearAssessmentQuestion: () => dispatch(actionAssessmentQuestions.clearAssessmentQuestion()),
		clearAssessmentCorrect: () => dispatch(actionAssessmentCorrect.clearAssessmentCorrect()),
		getBenchmarkTests: (personId) => dispatch(actionBenchmarkTests.getBenchmarkTests(personId)),
		getStandardsRating: (personId) => dispatch(actionStandardsRating.getStandardsRating(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, getCorrectedAssessment, studentPersonId, assessmentId, getAssessment, assessmentQuestionsInit,
    								setMyVisitedPage, getBenchmarkTests, getStandardsRating, assignmentId, studentFullName} = props
            getPageLangs(personId, langCode, 'AssessmentCorrectView')
    				getAssessment(personId, assessmentId)
            getCorrectedAssessment(personId, studentPersonId, assessmentId, assignmentId)
    				assessmentQuestionsInit(personId, studentPersonId, assessmentId, assignmentId)
    				getBenchmarkTests(personId)
    				getStandardsRating(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Correct Assessment (${studentFullName})`})
        
  }, [])

  return <AssessmentCorrectView {...props} />
}

export default Container
