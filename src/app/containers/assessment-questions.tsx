import { useEffect } from 'react'
import AssessmentQuestionsView from '../views/AssessmentQuestionsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBenchmarkTests from '../actions/benchmark-tests'
import * as actionAssessmentQuestions from '../actions/assessment-questions'
import * as actionAssessment from '../actions/assessment'
import * as actionVoiceRecording from '../actions/voice-recording'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionQuestionTypes from '../actions/question-types'
import * as actionStandards from '../actions/standards'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFetchingRecord, selectAssessmentQuestions, selectAssessment, selectQuestionTypes, selectCompanyConfig, selectBenchmarkTests,
					selectCoursesBase, selectVoiceRecording, selectAccessRoles, selectStandards } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let assessment = selectAssessment(state)
		let benchmarkTests = selectBenchmarkTests(state)
		let benchmarkTestId = props.params && props.params.benchmarkTestId
		let benchmarkTest = benchmarkTestId && benchmarkTests && benchmarkTests.length > 0 && benchmarkTests.filter(m => m.benchmarkTestId === benchmarkTestId)[0]
    let course = selectCoursesBase(state)
    course = course.length > 0 && assessment && assessment.courseEntryId && course.filter(m => m.courseEntryId === assessment.courseEntryId)[0]
		let assessmentQuestions = selectAssessmentQuestions(state)
    let sequenceCount = assessmentQuestions && assessmentQuestions.length
    let sequences = []
    for(let i = 1; i <= sequenceCount; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }
		let retakeOptions = []
		for(let i = 0; i <= 10; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        retakeOptions = retakeOptions ? retakeOptions.concat(option) : [option]
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
				benchmarkTests,
				benchmarkTestId,
				benchmarkTest,
        companyConfig: selectCompanyConfig(state),
        assessment,
        sequences,
				retakeOptions,
				accessRoles: selectAccessRoles(state),
        assessmentQuestions,
        courseEntryId: props.params.courseEntryId,
				courseEntryName: course && course.courseName,
				gradingType: course && course.gradingType,
        assessmentId:  props.params.assessmentId,
        questionTypes: selectQuestionTypes(state),
        //learnerOutcomes,
        fetchingRecord: selectFetchingRecord(state),
        voiceRecording: selectVoiceRecording(state),
				standards: selectStandards(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getAssessment: (personId, assessmentId) => dispatch(actionAssessment.getAssessment(personId, assessmentId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    assessmentQuestionsInit: (personId, studentPersonId, assessmentId, assignmentId) => dispatch(actionAssessmentQuestions.init(personId, studentPersonId, assessmentId, assignmentId)),
		addOrUpdateAssessmentItem: (personId, assessmentId, assessmentQuestion) => dispatch(actionAssessmentQuestions.addOrUpdateAssessmentItem(personId, assessmentId, assessmentQuestion)),
    addOrUpdateAssessmentItemMatching: (personId, assessmentId, assessmentQuestion) => dispatch(actionAssessmentQuestions.addOrUpdateAssessmentItemMatching(personId, assessmentId, assessmentQuestion)),
    removeAssessmentQuestion: (personId, assessmentId, assessmentQuestionId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestion(personId, assessmentId, assessmentQuestionId)),
    saveAssessmentQuestionWebsiteLink: (personId, assessmentQuestionId, websiteLink) => dispatch(actionAssessmentQuestions.saveAssessmentQuestionWebsiteLink(personId, assessmentQuestionId, websiteLink)),
    removeAssessmentQuestionWebsiteLink: (personId, assessmentQuestionId, websiteLink) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionWebsiteLink(personId, assessmentQuestionId, websiteLink)),
		removeAssessmentQuestionFileUpload: (personId, assessmentQuestionId, fileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionFileUpload(personId, assessmentQuestionId, fileUploadId)),
		removeAssessmentQuestionAnswerOption: (personId, assessmentQuestionId, answerIndex, runFunction) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionAnswerOption(personId, assessmentQuestionId, answerIndex, runFunction)),
		removeAssessmentQuestionQuestionFile: (personId, assessmentQuestionId, fileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionQuestionFile(personId, assessmentQuestionId, fileUploadId)),
		removeAssessmentQuestionAnswerFile: (personId, assessmentQuestionId, fileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionAnswerFile(personId, assessmentQuestionId, fileUploadId)),
		removeAssessmentQuestionToMatchFile: (personId, assessmentQuestionId, fileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionToMatchFile(personId, assessmentQuestionId, fileUploadId)),
    removeAssessmentQuestionSolutionFile: (personId, assessmentQuestionId, fileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionSolutionFile(personId, assessmentQuestionId, fileUploadId)),

		removeAssessmentQuestionQuestionRecording: (personId, assessmentQuestionId, recordingFileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionQuestionRecording(personId, assessmentQuestionId, recordingFileUploadId)),
		removeAssessmentQuestionAnswerRecording: (personId, assessmentQuestionId, recordingFileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionAnswerRecording(personId, assessmentQuestionId, recordingFileUploadId)),
    removeAssessmentQuestionSolutionRecording: (personId, assessmentQuestionId, recordingFileUploadId) => dispatch(actionAssessmentQuestions.removeAssessmentQuestionSolutionRecording(personId, assessmentQuestionId, recordingFileUploadId)),

		reorderAssessmentQuestions: (personId, assessmentQuestionId, newSequence) => dispatch(actionAssessmentQuestions.reorderAssessmentQuestions(personId, assessmentQuestionId, newSequence)),
    togglePublishedAssessment: (personId, assessmentId) => dispatch(actionAssessment.togglePublishedAssessment(personId, assessmentId)),
    resolveFetchingRecordAssessmentQuestions: () => dispatch(actionFetchingRecord.resolveFetchingRecordAssessmentQuestions()),
    addVoiceRecording: (personId, assessmentQuestionId, blobThing) => dispatch(actionVoiceRecording.addVoiceRecording(personId, assessmentQuestionId, blobThing)),
    getVoiceRecording: (personId, assessmentQuestionId) => dispatch(actionVoiceRecording.getVoiceRecording(personId, assessmentQuestionId)),
		updateAssessmentTotalPoints: (personId, assessmentQuestionId, subTotalPoints) => dispatch(actionAssessment.updateAssessmentTotalPoints(personId, assessmentQuestionId, subTotalPoints)),
		getQuestionTypes: (personId) => dispatch(actionQuestionTypes.init(personId)),
		updateAssessmentSettings: (personId, assessmentId, field, value) => dispatch(actionAssessment.updateAssessmentSettings(personId, assessmentId, field, value)),
		getStandards: (personId) => dispatch(actionStandards.getStandards(personId)),
		getBenchmarkTests: (personId) => dispatch(actionBenchmarkTests.getBenchmarkTests(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, personId, setMyVisitedPage, getStandards, assessmentId, getAssessment, assessmentQuestionsInit, getQuestionTypes, getBenchmarkTests, assignmentId} = props
          getPageLangs(personId, langCode, 'AssessmentQuestionsView')
          getBenchmarkTests(personId)
          assessmentQuestionsInit(personId, personId, assessmentId, assignmentId)
    			getAssessment(personId, assessmentId)
    			getQuestionTypes(personId)
    			getStandards(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Assessment Questions`})
      
  }, [])

  const {fetchingRecord} = props
      return fetchingRecord && !fetchingRecord.assessment  ? <AssessmentQuestionsView {...props} /> : null
}

export default Container
