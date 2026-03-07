import { useEffect, useState } from 'react'
import GradebookEntryView from '../views/GradebookEntryView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionGradebookEntry from '../actions/gradebook-entry'
import * as actionPersonConfig from '../actions/person-config'
import * as actionStudentAssignments from '../actions/student-assignments'
import * as actionResponseVisitedType from '../actions/response-visited-type'
import * as actionPenspringTransfer from '../actions/penspring-transfer'
import * as actionCourseWeightedScore from '../actions/course-weighted-score'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionContentTypes from '../actions/content-types'
import * as actionStandardsRating from '../actions/standards-rating'
import * as actionPassFailRating from '../actions/pass-fail-rating'
import * as actionAssignmentPendingReview from '../actions/assignments-pending-review'
import * as actionLearningPathways from '../actions/learning-pathways'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectStudents, selectCoursesScheduled, selectCompanyConfig, selectGradebook, selectContentTypes, selectPersonConfig, selectAccessRoles,
					selectFetchingRecord, selectGradeScale, selectCourseWeightedScore, selectIntervals, selectStandardsRating, selectSchoolYears,
					selectLearningPathways, selectPassFailRating, selectCoursesBase, selectMyFrequentPlaces} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let courseScheduledId = props.params && props.params.courseScheduledId
		let accessRoles = selectAccessRoles(state)
		let students = selectStudents(state)
		let personConfig = selectPersonConfig(state)
		let companyConfig = selectCompanyConfig(state)
		let baseCourses = selectCoursesBase(state)

		let courses = selectCoursesScheduled(state)
		courses = courses && courses.length > 0 && courses.reduce((acc, m) => {
				let hasInterval = m.intervals && m.intervals.length > 0 && m.intervals.filter(m => m.intervalId === personConfig.intervalId)[0]
				if (hasInterval && hasInterval.intervalId) {
						acc = acc && acc.length > 0 ? acc.concat(m) : [m]
				}
				return acc
			},
		[])

		if (courses && courses.length > 0 && !accessRoles.admin) {
				if (accessRoles.facilitator) {
						courses = courses.filter(m => {
								let found = false
								m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
										if (t.id === me.personId) found = true
								})
								return found
						})
				} else if (accessRoles.learner) {
						courses = courses.filter(m => m.studentList.indexOf(me.personId) > -1)
				} else if (accessRoles.observer) {
						courses = courses.reduce((acc, m) => {
								students && students.length > 0 && students.forEach(s => {
										if (m.studentList.indexOf(s.personId) > -1) {
												acc = acc ? acc.concat(m) : [m]
										}
								})
								return acc
						}, [])
				}
		}

		let course = courseScheduledId && courses && courses.length > 0
				? courses.filter(m => m.courseScheduledId === courseScheduledId)[0]
				: props.params && props.params.id
						? baseCourses && baseCourses.length > 0 && baseCourses.filter(m => m.courseEntryId === props.params.id)[0]
						: {}

		let standardsRatings = selectStandardsRating(state)
		standardsRatings = course && course.standardsRatingTableId && standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === course.standardsRatingTableId)

		let gradebook = selectGradebook(state)
		let gradeScales = selectGradeScale(state)
		gradeScales = gradeScales && gradeScales.length > 0 && gradebook && gradebook.gradeScaleTableId
				&& gradeScales.filter(m => m.gradeScaleTableId === gradebook.gradeScaleTableId)

		let visitedColor = {
				VISITED: '#c7c9c3',
				HIDE: '#4c8e10',
				DELETED: '',
				ATTENTION: '#f61010'
		}

		let hiddenResponseCount = 0
		gradebook && gradebook.studentScores && gradebook.studentScores.length > 0 && gradebook.studentScores.forEach(m => {
				m.scoreResponses && m.scoreResponses.length > 0 && m.scoreResponses.forEach(s => {
						s.textResponses && s.textResponses.length > 0 && s.textResponses.forEach(t => {
								if (t.responseVisitedTypeCode === "HIDE") hiddenResponseCount++
						})
						s.websiteLinks && s.websiteLinks.length > 0 && s.websiteLinks.forEach(t => {
								if (t.responseVisitedTypeCode === "HIDE") hiddenResponseCount++
						})
						s.fileUploadUrls && s.fileUploadUrls.length > 0 && s.fileUploadUrls.forEach(t => {
								if (t.responseVisitedTypeCode === "HIDE") hiddenResponseCount++
						})
				})
		})

		let weightedScores = selectCourseWeightedScore(state)
		let contentTypes = selectContentTypes(state)

		weightedScores && weightedScores.length > 0 && weightedScores.forEach(m => {
				if (!m.scorePercent) {
						contentTypes = contentTypes && contentTypes.length > 0 && contentTypes.filter(c => c.id !== m.contentTypeId)
				}
		})

		if (course && course.courseEntryId && !course.gradingType) course.gradingType = companyConfig.gradingType
		if (course && course.courseEntryId && !course.schoolYearId) course.schoolYearId = personConfig.schoolYearId || companyConfig.schoolYearId

    return {
        personId: me.personId,
        langCode: me.langCode,
				gradebook,
				students,
        courses,
				course,
				baseCourses,
        contentTypes,
				weightedScores,
				visitedColor,
				hiddenResponseCount,
        courseScheduledId,
				studentPersonId: props.params && props.params.studentPersonId,
				contentTypeId: props.params && props.params.contentTypeId,
				courseEntryId: gradebook && gradebook.courseEntryId,
				gradeScales,
        companyConfig,
				personConfig,
				accessRoles,
				fetchingRecord: selectFetchingRecord(state),
				intervals: selectIntervals(state),
				standardsRatings,
				passFailRatings: selectPassFailRating(state),
				schoolYears: selectSchoolYears(state),
				learningPathways: selectLearningPathways(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    gradebookInit: (personId, courseScheduledId, jumpToAssignmentId, assignmentId, clearRedux) => dispatch(actionGradebookEntry.init(personId, courseScheduledId, jumpToAssignmentId, assignmentId, clearRedux)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		clearGradebook: () => dispatch(actionGradebookEntry.clearGradebook()),
		setGradebookScore: (personId, courseScheduledId, studentPersonId, assignmentId, score, runFunction) => dispatch(actionGradebookEntry.setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, score, runFunction)),
    setLocalGradebookScore: (studentPersonId, assignmentId, score) => dispatch(actionGradebookEntry.setLocalGradebookScore(studentPersonId, assignmentId, score)),
		getStudentOverallGrade: (personId, studentPersonId, courseScheduledId) => dispatch(actionGradebookEntry.getGradebookOverallGrade(personId, studentPersonId, courseScheduledId)),
		updatePersonConfigCourse: (personId, courseScheduledId, jumpToAssignmentId)  => dispatch(actionPersonConfig.updatePersonConfigCourse(personId, courseScheduledId, jumpToAssignmentId)),
		addOrUpdateStudentResponse: (personId, courseEntryId, courseScheduledId, studentResponse, assignmentId, callInitFunction) => dispatch(actionStudentAssignments.addOrUpdateStudentResponse(personId, courseEntryId, courseScheduledId, studentResponse, assignmentId, callInitFunction)),
		removeStudentResponse: (personId, studentAssignmentResponseId, deleteFile) => dispatch(actionStudentAssignments.removeStudentResponse(personId, studentAssignmentResponseId, deleteFile)),
		setResponseVisitedType: (personId, studentAssignmentResponseId, ResponseVisitedTypeCode) => dispatch(actionResponseVisitedType.setResponseVisitedType(personId, studentAssignmentResponseId, ResponseVisitedTypeCode)),
		getCourseWeightedScore: (courseEntryId) => dispatch(actionCourseWeightedScore.init(courseEntryId)),
		getStudentAssignments: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		updatePersonConfig: (personId, field, value, runFunction)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		getCoursesScheduled: (personId, clearRedux) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId, clearRedux)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		setPenspringTransfer: (personId, work) => dispatch(actionPenspringTransfer.setPenspringTransfer(personId, work)),
		getAssignmentsPendingReview: (personId) => dispatch(actionAssignmentPendingReview.getAssignmentsPendingReview(personId)),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
		setPassFailSequence: (studentPersonId, assignmentId, nextSequence, courseScheduledId, personId) => dispatch(actionGradebookEntry.setPassFailSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId)),
		getStandardsRating: (personId) => dispatch(actionStandardsRating.getStandardsRating(personId)),
		getPassFailRatings: (personId) => dispatch(actionPassFailRating.init(personId)),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		setGradeOverwrite: (personId, courseScheduledId, studentPersonId, intervalId, field, value) => dispatch(actionGradebookEntry.setGradeOverwrite(personId, courseScheduledId, studentPersonId, intervalId, field, value)),
		setGradebookScoreColumnZero: (personId, courseScheduledId, assignmentId, multScore, runFunction) => dispatch(actionGradebookEntry.setGradebookScoreColumnZero(personId, courseScheduledId, assignmentId, multScore, runFunction)),
		finalizeGradebookGrades: (personId, courseScheduledId, intervalId) => dispatch(actionGradebookEntry.finalizeGradebookGrades(personId, courseScheduledId, intervalId)),
		setEditMode: (assignmentId, studentPersonId) => dispatch(actionGradebookEntry.setEditMode(assignmentId, studentPersonId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setStandardLevelSequence: (studentPersonId, assignmentId, nextSequence, courseScheduledId, personId) => dispatch(actionStandardsRating.setStandardLevelSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId)),
		setStandardLevelSequenceMultiple: (assignmentId, nextSequence, courseScheduledId, personId, runFunction) => dispatch(actionStandardsRating.setStandardLevelSequenceMultiple(assignmentId, nextSequence, courseScheduledId, personId, runFunction)),
		setLocalGradebookOverwritePercent: (studentPersonId, intervalId, gradePercent) => dispatch(actionGradebookEntry.setLocalGradebookOverwritePercent(studentPersonId, intervalId, gradePercent)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, getContentTypes, getCourseWeightedScore, courseEntryId, getStandardsRating,
    								getLearningPathways, getPassFailRatings} = props; //, gradebookInit, courseScheduledId
    				getPageLangs(personId, langCode, 'GradebookEntryView')
    				getContentTypes(personId)
    				getCourseWeightedScore(courseEntryId)
    				getStandardsRating(personId)
    				getPassFailRatings(personId)
    				getLearningPathways(personId)
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {personId, setMyVisitedPage, course, gradebookInit, courseScheduledId} = props
    				
    
    				if ((!isInit && courseScheduledId) || courseScheduledId !== state.courseScheduledId) {
    						gradebookInit(personId, courseScheduledId)
    						props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Gradebook: ${course && course.courseName}`})
    						setIsInit(true); setCourseScheduledId(courseScheduledId)
    				}
    		
  }, [])

  return <GradebookEntryView {...props} />
}

export default Container
