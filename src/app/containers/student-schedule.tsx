import { useEffect, useState } from 'react'
import StudentScheduleView from '../views/StudentScheduleView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionStudent from '../actions/student'
import * as actionStudentSchedule from '../actions/student-schedule'
import * as actionSchedMath from '../actions/schedule-assign-by-math'
import * as actionStudentSched from '../actions/student-schedule'
import * as actionStudentAssignments from '../actions/student-assignments'
import * as actionCourseDocuments from '../actions/course-documents'
import * as actionPersonConfig from '../actions/person-config'
import * as actionLearnerCourseAssign from '../actions/learner-course-assign'
import * as fromOpenRegistration from '../reducers/open-registrations'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionClassPeriods from '../actions/class-periods'
import * as actionCourseTypes from '../actions/course-types'
import * as actionLearningPathways from '../actions/learning-pathways'
import * as actionOpenRegistrations from '../actions/open-registrations'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionGradebookEntry from '../actions/gradebook-entry'
import {guidEmpty} from '../utils/guidValidate'
import { selectMe, selectStudentSchedule, selectCompanyConfig, selectAccessRoles, selectStudents, selectScheduleAssignMathNames,
					selectFetchingRecord, selectPersonConfig, selectIntervals, selectLearningPathways, selectCourseTypes, selectTheStudent,
				 	selectClassPeriods, selectUsers, selectCoursesScheduled, selectSchoolYears, selectMyFrequentPlaces, selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
		let students = selectStudents(state)
		let studentChosenSession = selectStudentChosenSession(state)
		let studentPersonId = (props.params && props.params.studentPersonId && props.params.studentPersonId !== '0' && props.params.studentPersonId !== guidEmpty && props.params.studentPersonId) || studentChosenSession
		let student = selectTheStudent(state)
		let mathNames = selectScheduleAssignMathNames(state)
		let studentSchedule = selectStudentSchedule(state)
		if (mathNames && mathNames.length > 0) {
				//This cuts back the math names for those which have at least one course assigned to them.
				mathNames = mathNames.filter(m => m.courseSchedCount)
		}

		let scheduledCourses = selectCoursesScheduled(state)
		//if (scheduledCourses && scheduledCourses.length > 0) scheduledCourses = scheduledCourses.filter(m => !m.courseEntryIsInactive & !m.courseScheduledIsInactive && !m.isInactive);

		//We are leaning on using the schoolYearId found in the PersonConfigure table with the Company record backup.  So we are sort of ignoring schoolYearId here.

    return {
				me,
				langCode: me.langCode,
        personId: me.personId,
				studentFirstName: student && student.firstName,
				studentLastName: student && student.lastName,
				studentPersonId,
				students,
				student,
				schoolYearId: (props.params && props.params.schoolYearId) || 9,
				studentSchedule,
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				mathNames,
				fetchingRecord: selectFetchingRecord(state),
				personConfig,
				intervals: selectIntervals(state),
				learningPathways: selectLearningPathways(state),
				courseTypes: selectCourseTypes(state),
				classPeriods: selectClassPeriods(state),
				facilitators: selectUsers(state, 'Facilitator'),
				scheduledCourses,
				openRegistration: fromOpenRegistration.selectOpenRegistration(state.openRegistrations, me.personId),
				schoolYears: selectSchoolYears(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		removeStudentCourseAssign: (personId, studentPersonId, courseScheduledId, runFunction) => dispatch(actionStudentSchedule.removeStudentCourseAssign(personId, studentPersonId, courseScheduledId, runFunction)),
 		removeOrRefundStudentCourseAssign: (personId, studentPersonId, courseScheduledId, financeBillingRefunds) => dispatch(actionStudentSchedule.removeOrRefundStudentCourseAssign(personId, studentPersonId, courseScheduledId, financeBillingRefunds)),
		blankOutStudentScheduleLocal: ()  => dispatch(actionStudentSchedule.blankOutStudentScheduleLocal()),
		getScheduleMathNames: (personId) => dispatch(actionSchedMath.getScheduleMathNames(personId)),
		setStudentScheduleByMathName: (personId, studentPersonId, scheduleAssignByMathId) => dispatch(actionStudentSched.setStudentScheduleByMathName(personId, studentPersonId, scheduleAssignByMathId)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		courseDocumentsInit: (personId, courseEntryId) => dispatch(actionCourseDocuments.init(personId, courseEntryId)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		addLearnerCourseAssign: (personId, students, courses, getStudentSchedule_personId) => dispatch(actionLearnerCourseAssign.addLearnerCourseAssign(personId, students, courses, getStudentSchedule_personId)),
		setLearnerCourseAssignAccredited: (personId, learnerCourseAssignId, value, studentPersonId) => dispatch(actionStudentSched.setLearnerCourseAssignAccredited(personId, learnerCourseAssignId, value, studentPersonId)),
		clearStudentScheduleLocal: () => dispatch(actionStudentSched.clearStudentScheduleLocal()),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		getClassPeriods: (personId) => dispatch(actionClassPeriods.init(personId)),
		getCourseTypes: (personId) => dispatch(actionCourseTypes.init(personId)),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		getOpenRegistrations: (personId) => dispatch(actionOpenRegistrations.init(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
		toggleLearnerCourseAssignInterval: (personId, studentPersonId, courseScheduledId, intervalId) => dispatch(actionLearnerCourseAssign.toggleLearnerCourseAssignInterval(personId, studentPersonId, courseScheduledId, intervalId)),
		finalizeGradeStudentSchedule: (personId, studentPersonId, courseScheduledIds, intervalId) => dispatch(actionGradebookEntry.finalizeGradeStudentSchedule(personId, studentPersonId, courseScheduledIds, intervalId)),
		getTheStudent: (personId, studentPersonId) => dispatch(actionStudent.getTheStudent(personId, studentPersonId)),
		getStudents: (personId) => dispatch(actionStudent.getStudents(personId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
    		    const {getPageLangs, langCode, getScheduleMathNames, personId, accessRoles, getClassPeriods, getTheStudent, studentPersonId, getCourseTypes, getLearningPathways,
    								getOpenRegistrations, getStudentSchedule} = props
    
    				getPageLangs(personId, langCode, 'StudentScheduleView')
    				getStudentSchedule(personId, studentPersonId)
    				if (accessRoles.admin) getScheduleMathNames(personId)
    				getClassPeriods(personId)
    				getCourseTypes(personId)
    				getLearningPathways(personId)
    				getOpenRegistrations(personId)
    				getTheStudent(personId, studentPersonId)
    	  
  }, [])

  return <StudentScheduleView {...props} />
}
export default Container
