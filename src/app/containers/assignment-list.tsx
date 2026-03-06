import { useEffect, useState } from 'react'
import AssignmentListView from '../views/AssignmentListView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAssignments from '../actions/assignment-list'
import * as actionCourseDocuments from '../actions/course-documents'
import * as actionCourseWeightedScore from '../actions/course-weighted-score'
import * as actionPersonConfig from '../actions/person-config'
//import * as actionVoiceRecording from '../actions/voice-recording';
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionCourseEntry from '../actions/course-entry'
import * as actionPenspringTransfer from '../actions/penspring-transfer'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFetchingRecord, selectAssignments, selectCompanyConfig, selectCoursesBase, selectVoiceRecording, selectLanguageList,
 					selectCourseDocuments, selectAccessRoles, selectCourseTypes, selectContentTypes, selectCoursesScheduled, selectCourseWeightedScore,
					selectIntervals, selectPersonConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let courses = selectCoursesBase(state)
    let coursesScheduled = selectCoursesScheduled(state)
    let course = courses && courses.length > 0 && courses.filter(m => m.courseEntryId === props.params.courseEntryId)[0]
		let assignments = selectAssignments(state)
    let sequenceCount = assignments && assignments.length
		let firstSequence = assignments && assignments.length && assignments[0].sequence
    let sequences = []
    for(let i = firstSequence; i <= String(Number(sequenceCount) + Number(firstSequence) + 2*1); i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }

		let weightedScores = selectCourseWeightedScore(state)
		let contentTypes = selectContentTypes(state)

		weightedScores && weightedScores.length > 0 && weightedScores.forEach(m => {
				if (!m.scorePercent) {
						contentTypes = contentTypes && contentTypes.length > 0 && contentTypes.filter(c => c.id !== m.contentTypeId)
				}
		})

		let assignmentId = props.params && props.params.assignmentId
		let assignment = {}
		if (assignmentId && assignments && assignments.length > 0) {
				assignment = assignments.filter(m => m.assignmentId === assignmentId)[0]
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
				assignmentId,
				assignment,
				companyConfig: selectCompanyConfig(state),
        personConfig: selectPersonConfig(state),
				contentTypes,
        assignments,
				course,
				coursesScheduled,
        sequences,
        courseEntryId: props.params.courseEntryId,
				courseDocuments: selectCourseDocuments(state),
        fetchingRecord: selectFetchingRecord(state),
        voiceRecording: selectVoiceRecording(state),
				accessRoles: selectAccessRoles(state),
				courseTypes: selectCourseTypes(state),
				intervals: selectIntervals(state),
				languageList: selectLanguageList(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		assignmentsInit: (personId, courseEntryId) => dispatch(actionAssignments.init(personId, courseEntryId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    courseDocumentsInit: (personId, courseEntryId) => dispatch(actionCourseDocuments.init(personId, courseEntryId)),
		saveCourseWebsiteLink: (personId, courseEntryId, websiteLink, websiteTitle) => dispatch(actionCourseDocuments.saveCourseWebsiteLink(personId, courseEntryId, websiteLink, websiteTitle)),
		removeCourseDocumentFile: (personId, courseDocumentId, fileUploadId) => dispatch(actionCourseDocuments.removeCourseDocumentFile(personId, courseDocumentId, fileUploadId)),
    reorderAssignments: (personId, assignmentId, newSequence) => dispatch(actionAssignments.reorderAssignments(personId, assignmentId, newSequence)),
		saveAssignmentWebsiteLink: (personId, assignmentId, websiteLink) => dispatch(actionAssignments.saveAssignmentWebsiteLink(personId, assignmentId, websiteLink)),
		getCourseWeightedScore: (courseEntryId) => dispatch(actionCourseWeightedScore.init(courseEntryId)),
		updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		getCoursesBase: (personId) => dispatch(actionCourseEntry.getCoursesBase(personId)),
		createWorkAndPenspringTransfer: (personId, work, initFunction) => dispatch(actionPenspringTransfer.createWorkAndPenspringTransfer(personId, work, initFunction)),
		setPenspringTransfer: (personId, work) => dispatch(actionPenspringTransfer.setPenspringTransfer(personId, work)),
		removeAssignment: (personId, assignmentId, runFunction) => dispatch(actionAssignments.removeAssignment(personId, assignmentId, runFunction)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getDownloadFileTest: (fileUploadId) => dispatch(actionAssignments.getDownloadFileTest(fileUploadId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)
  const [courseEntryId_state, setCourseEntryId] = useState(undefined)

  useEffect(() => {
    
          const {getPageLangs, langCode, personId, getCourseWeightedScore, courseDocumentsInit, courseEntryId, assignmentsInit, getCoursesBase} = props
          getPageLangs(personId, langCode, 'AssignmentListView')
    			getCourseWeightedScore(courseEntryId)
          assignmentsInit(personId, courseEntryId)
    			courseDocumentsInit(personId, courseEntryId)
    			getCoursesBase(personId)
      
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {personId, setMyVisitedPage, assignmentsInit, courseEntryId, course} = props
    			if (course && course.courseName && (!isInit || courseEntryId !== courseEntryId_state)) {
    					assignmentsInit(personId, courseEntryId)
    					props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Assignments: ${course && course.courseName}`})
    					setIsInit(true); setCourseEntryId(courseEntryId)
    			}
    	
  }, [])

  return <AssignmentListView {...props} />
}
export default Container
