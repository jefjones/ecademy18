import { useEffect, useState } from 'react'
import AssignmentEntryView from '../views/AssignmentEntryView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAssignments from '../actions/assignment-list'
//import * as actionVoiceRecording from '../actions/voice-recording';
import * as actionCourseWeightedScore from '../actions/course-weighted-score'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionContentTypes from '../actions/content-types'
import * as actionCourseTypes from '../actions/course-types'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionCourseEntry from '../actions/course-entry'
import * as actionStandards from '../actions/standards'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionBechmarkTests from '../actions/benchmark-tests'

import { selectMe, selectAssignments, selectCompanyConfig, selectCoursesBase, selectCourseTypes, selectContentTypes, selectCoursesScheduled,
					selectCourseWeightedScore, selectIntervals, selectPersonConfig, selectStudents, selectStandards, selectBenchmarkTests,
					selectStudentCourseAssigns} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
		let students = selectStudents(state)
		let courses = selectCoursesBase(state)
		let coursesScheduled = selectCoursesScheduled(state)
		let studentCourseAssigns = selectStudentCourseAssigns(state)
		//coursesScheduled = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => m.intervalId === personConfig.intervalId);
    let course = courses && courses.length > 0 && courses.filter(m => m.courseEntryId === props.params.courseEntryId)[0]; //courseEntryId is an integer.
		let assignments = selectAssignments(state)
		let assignment = assignments && assignments.length > 0 ? assignments.filter(m => m.assignmentId === props.params.assignmentId)[0] : {}

		//Considering the spring semester, the sequence will be presented by taking the starting sequence and going to the last sequence plus one.
		//The reason for this is that the entire semester is considered the assignment list for a course.  When adding a new assignment,
		//	there was a problem with getting the new sequence right.  So, now, we will start with the beginning assignment by semester
		//	and keep the sequence numbers according to the semester and not just a 1...n list by the simple count of assignments in the list.
		//This is taking the strong expectation that the assignment IS coming back ordered by sequence.
		let sequenceStart = 1
		let sequenceEnd = 1

		if (assignments && assignments.length > 0) {
				sequenceStart = assignments[0].sequence
				sequenceEnd = assignments[assignments.length-1].sequence
				sequenceEnd++
		}

    let sequences = []
    for(let i = sequenceStart; i <= sequenceEnd; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }
		let coursesRelated = props.params.courseEntryId && coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => m.courseEntryId === props.params.courseEntryId)
		let insertSequence = (props.params && props.params.insertSequence) || sequenceEnd

		if ((!assignment || !assignment.assignmentId) && studentCourseAssigns && studentCourseAssigns.length > 0) {
				let studentsAssigned = []
				students && students.length > 0 && students.forEach(m => {
						coursesRelated && coursesRelated.length > 0 && coursesRelated.forEach(c => {
								studentCourseAssigns.forEach(s => {
										if (s.id === m.id && studentsAssigned.indexOf(m.personId) === -1)
												studentsAssigned = studentsAssigned ? studentsAssigned.concat(m.personId) : [m.personId]
								})
						})
				})

				assignment = {
						assignmentId: '',
						sequence: insertSequence,
						courseEntryId: '',
						title: '',
						subtitle: '',
						contentTypeId: '',
						instructions: '',
						totalPoints: 0,
						mustComplete: true,
						gradable: true,
						dueDate: '',
						gradingTypes: [],
						studentsAssigned,
				}
		}

		let weightedScores = selectCourseWeightedScore(state)
		let contentTypes = selectContentTypes(state)

		weightedScores && weightedScores.length > 0 && weightedScores.forEach(m => {
				if (!m.scorePercent) {
						contentTypes = contentTypes && contentTypes.length > 0 && contentTypes.filter(c => c.id !== m.contentTypeId)
				}
		})

    return {
        personId: me.personId,
        langCode: me.langCode,
				courseEntryId: props.params && props.params.courseEntryId,
				course,
				students,
				coursesRelated,
				assignment,
				assignmentId: props.params && props.params.assignmentId,
				insertSequence,
				contentTypes,
				courseTypes: selectCourseTypes(state),
        sequences,
        //voiceRecording: selectVoiceRecording(state),
				//accessRoles: selectAccessRoles(state),
				companyConfig: selectCompanyConfig(state),
				intervals: selectIntervals(state),
				personConfig,
				standards: selectStandards(state),
				benchmarkTests: selectBenchmarkTests(state),
				studentCourseAssigns,
    }
}

const bindActionsToDispatch = dispatch => ({
    addOrUpdateAssignment: (personId, assignment) => dispatch(actionAssignments.addOrUpdateAssignment(personId, assignment)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeAssignment: (personId, assignmentId, runFunction) => dispatch(actionAssignments.removeAssignment(personId, assignmentId, runFunction)),
    removeAssignmentWebsiteLink: (personId, assignmentId, assignmentWebsiteLinkId) => dispatch(actionAssignments.removeAssignmentWebsiteLink(personId, assignmentId, assignmentWebsiteLinkId)),
    removeAssignmentFile: (personId, assignmentId, assignmentFileId) => dispatch(actionAssignments.removeAssignmentFile(personId, assignmentId, assignmentFileId)),
    resolveFetchingRecordAssignmentEntry: () => dispatch(actionFetchingRecord.resolveFetchingRecordAssignmentEntry()),
		getCourseWeightedScore: (courseEntryId) => dispatch(actionCourseWeightedScore.init(courseEntryId)),
		assignmentsInit: (personId, courseEntryId) => dispatch(actionAssignments.init(personId, courseEntryId)),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
		getCourseTypes: (personId) => dispatch(actionCourseTypes.init(personId)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		getCoursesBase: (personId) => dispatch(actionCourseEntry.getCoursesBase(personId)),
		getStandards: (personId) => dispatch(actionStandards.getStandards(personId)),
		getBenchmarkTests: (personId) => dispatch(actionBechmarkTests.getBenchmarkTests(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		getStudentCoursesAssignsByBase: (personId, courseEntryId) => dispatch(actionCourseToSchedule.getStudentCoursesAssignsByBase(personId, courseEntryId)),

    // addVoiceRecording: (personId, assignmentId, blobThing) => dispatch(actionVoiceRecording.addVoiceRecording(personId, assignmentId, blobThing)),
    // getVoiceRecording: (personId, assignmentId) => dispatch(actionVoiceRecording.getVoiceRecording(personId, assignmentId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
          const {getPageLangs, langCode, personId, getStandards, getCourseWeightedScore, courseEntryId, getContentTypes, getCourseTypes, getCoursesBase, setMyVisitedPage, getBenchmarkTests,
    							getStudentCoursesAssignsByBase} = props
    			getPageLangs(personId, langCode, 'AssignmentEntryView')
    			getCourseWeightedScore(courseEntryId)
    			getContentTypes(personId)
    			getCourseTypes(personId)
    			getCoursesBase(personId)
    			getStandards(personId)
    			getBenchmarkTests(personId)
    			getStudentCoursesAssignsByBase(personId, courseEntryId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Assignment Entry`})
    	
  }, [])

  return <AssignmentEntryView {...props} />
}
export default Container
