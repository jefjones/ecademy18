import { useEffect } from 'react'
import AssessmentLearnerView from '../views/AssessmentLearnerView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBenchmarkTests from '../actions/benchmark-tests'
import * as actionAssessmentQuestions from '../actions/assessment-questions'
import * as actionAssessment from '../actions/assessment'
import * as actionAssessmentCorrect from '../actions/assessment-correct'
import * as actionPenspringTransfer from '../actions/penspring-transfer'
import * as actionStandardsRating from '../actions/standards-rating'
import * as actionStandards from '../actions/standards'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFetchingRecord, selectAssessmentQuestions, selectAssessment, selectQuestionTypes, selectCompanyConfig,
					selectStudentSchedule, selectAccessRoles, selectBenchmarkTests } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let assessment = selectAssessment(state)
		let benchmarkTests = selectBenchmarkTests(state)
		let benchmarkTestId = props.params && props.params.benchmarkTestId
		let benchmarkTest = benchmarkTestId && benchmarkTests && benchmarkTests.length > 0 && benchmarkTests.filter(m => m.benchmarkTestId === benchmarkTestId)[0]
    let course = selectStudentSchedule(state)
    course = course.length > 0 && assessment && assessment.courseEntryId && course.filter(m => m.courseEntryId === assessment.courseEntryId)[0]
    // let learnerOutcomesList = course && course.learnerOutcomesList ? course.learnerOutcomesList : [];
    // let learnerOutcomes = selectLearnerOutcomes(state);
    // learnerOutcomes = learnerOutcomes && learnerOutcomes.filter(m => learnerOutcomesList.indexOf(m.learnerOutcomeId) > -1);
		let assessmentQuestions = selectAssessmentQuestions(state)
    let sequenceCount = assessmentQuestions && assessmentQuestions.length
    let sequences = []
    for(let i = 1; i <= sequenceCount; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }
		if (props.params && props.params.isRetakeQuiz && props.params.isRetakeQuiz !== 'notRetake')
				assessmentQuestions = assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.map(m => m.learnerAnswer = '')

    return {
        personId: me.personId,
        langCode: me.langCode,
        companyConfig: selectCompanyConfig(state),
				assignmentId: props.params.assignmentId,
				benchmarkTest,
				benchmarkTestId,
				course,
        assessment,
        sequences,
        assessmentQuestions,
        assessmentId:  props.params.assessmentId,
        questionTypes: selectQuestionTypes(state),
        //learnerOutcomes,
        fetchingRecord: selectFetchingRecord(state),
				accessRoles: selectAccessRoles(state),
				courseScheduledId: props.params && props.params.courseScheduledId,
    }
}

const bindActionsToDispatch = dispatch => ({
    getAssessment: (personId, assessmentId) => dispatch(actionAssessment.getAssessment(personId, assessmentId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    assessmentQuestionsInit: (personId, studentPersonId, assessmentId, assignmentId) => dispatch(actionAssessmentQuestions.init(personId, studentPersonId, assessmentId, assignmentId)),
    addOrUpdateAssessmentAnswer: (personId, assessmentQuestionId, answer, assignmentId) => dispatch(actionAssessmentQuestions.addOrUpdateAssessmentAnswer(personId, assessmentQuestionId, answer, assignmentId)),
    correctAssessment: (personId, studentPersonId, assessmentId, assignmentId, runFunction) => dispatch(actionAssessmentCorrect.correctAssessment(personId, studentPersonId, assessmentId, assignmentId, runFunction)),
		createWorkAndPenspringTransfer: (personId, work, initFunction) => dispatch(actionPenspringTransfer.createWorkAndPenspringTransfer(personId, work, initFunction)),
		setPenspringTransfer: (personId, work) => dispatch(actionPenspringTransfer.setPenspringTransfer(personId, work)),
		removeLearnerAnswerFile: (personId, assessmentQuestionId, fileUploadId) => dispatch(actionAssessmentQuestions.removeLearnerAnswerFile(personId, assessmentQuestionId, fileUploadId)),
		updateAssessmentLocalAnswer: (assessmentId, assessmentQuestionId, answer) => dispatch(actionAssessmentQuestions.updateAssessmentLocalAnswer(assessmentId, assessmentQuestionId, answer)),
		getBenchmarkTests: (personId) => dispatch(actionBenchmarkTests.getBenchmarkTests(personId)),
		getStandardsRating: (personId) => dispatch(actionStandardsRating.getStandardsRating(personId)),
		getStandards: (personId) => dispatch(actionStandards.getStandards(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, personId, setMyVisitedPage, assessmentId, assessmentQuestionsInit, getAssessment, getBenchmarkTests, assignmentId, getStandardsRating, getStandards} = props
          getPageLangs(personId, langCode, 'AssessmentLearnerView')
          assessmentQuestionsInit(personId, personId, assessmentId, assignmentId)
          getAssessment(personId, assessmentId)
    			getBenchmarkTests(personId)
    			getStandardsRating(personId)
    			getStandards(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Student Assessment`})
      
  }, [])

  const {assessment} = props
      return assessment && assessment.assessmentId ? <AssessmentLearnerView {...props} /> : null
}

export default Container
