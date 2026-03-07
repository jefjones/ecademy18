import { useEffect } from 'react'
import StudentBaseCourseRequestView from '../views/StudentBaseCourseRequestView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import {doSort} from '../utils/sort'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionPersonConfig from '../actions/person-config'
import * as actionStudentBaseCourseRequest from '../actions/student-base-course-request'
import * as actionCurrentEnrollment from '../actions/current-enrollment-pre-req'
import * as fromOpenRegistration from '../reducers/open-registrations'
import * as actionOpenRegistrations from '../actions/open-registrations'
import * as actionCourseRecommendation from '../actions/course-recommendation'
import * as actionGradReqirements from '../actions/grad-requirements'
import * as actionCoursePrerequisites from '../actions/course-prerequisites'
import * as actionLearningPathways from '../actions/learning-pathways'
import * as actionDepartment from '../actions/department'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectStudentBaseCourseRequests, selectCompanyConfig, selectAccessRoles, selectStudents, selectCourseTypes,
					selectCoursesBase, selectPersonConfig, selectLearningPathways, selectIntervals, selectAlerts, selectCourseRecommendations,
					selectMyProfile, selectGradRequirements, selectCoursePrerequisites, selectPartialNameText, selectFetchingRecord,
					selectCurrentEnrollmentPreReq, selectDepartments, selectSeatsStatistics, selectDoNotAddCourses } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let myProfile = selectMyProfile(state)
		let studentBaseCourseRequests = selectStudentBaseCourseRequests(state)
		let companyConfig = selectCompanyConfig(state)
		let students = selectStudents(state)
		let baseCourses = selectCoursesBase(state)
		let learningPathways = selectLearningPathways(state)
		let accessRoles = selectAccessRoles(state)
		let gradRequirements = selectGradRequirements(state)
		gradRequirements = doSort(gradRequirements, { sortField: 'sequence', isAsc: true, isNumber: true })
		let studentPersonId = accessRoles.learner ? me.personId : props.params && props.params.studentPersonId ? props.params.studentPersonId : ''
		if (!me.salta && companyConfig.urlcode === 'Manheim') {
				baseCourses = baseCourses && baseCourses.length > 0 && baseCourses
						.filter(m =>
								!!m.isCourseRecommended
									|| (m.courseGradeLevelNinth && myProfile.gradeLevel === 8)
									|| (m.courseGradeLevelTenth && myProfile.gradeLevel === 9)
									|| (m.courseGradeLevelEleventh && myProfile.gradeLevel === 10)
									|| (m.courseGradeLevelTwelfth && myProfile.gradeLevel === 11)
									|| (m.courseGradeLevelThirteenth && myProfile.gradeLevel === 12)
						)
		}
		//baseCourses = doSort(baseCourses, { sortField: 'courseName', isAsc: true, isNumber: true });
		let student = studentPersonId && students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0]
		let gradeLevelName = student && student.gradeLevelName ? student.gradeLevelName : ''

    return {
				me,
				langCode: me.langCode,
        personId: me.personId,
				gradeLevelName,
				finalizedDate: studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests[0].finalizedDate,
				studentPersonId,
				studentBaseCourseRequests,
				baseCourses,
        companyConfig,
				accessRoles,
				students,
				learningPathways,
				courseTypes: selectCourseTypes(state),
				personConfig: selectPersonConfig(state),
				intervals: selectIntervals(state),
				alerts: selectAlerts(state),
				courseRecommendations: selectCourseRecommendations(state),
				gradRequirements,
				coursePrerequisites: selectCoursePrerequisites(state),
				fetchingRecord: selectFetchingRecord(state),
				currentEnrollmentPreReq: selectCurrentEnrollmentPreReq(state),
				departments: selectDepartments(state),
				seatsStatistics: selectSeatsStatistics(state),
				openRegistration: fromOpenRegistration.selectOpenRegistration(state.openRegistrations, me.personId),
				doNotAddCourses: selectDoNotAddCourses(state),
				partialNameText: selectPartialNameText(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getStudentBaseCourseRequests: (personId, studentPersonId) => dispatch(actionStudentBaseCourseRequest.getStudentBaseCourseRequests(personId, studentPersonId)),
		addStudentBaseCourseRequest: (studentPersonId, studentBaseCourseRequest, runFunction) => dispatch(actionStudentBaseCourseRequest.addStudentBaseCourseRequest(studentPersonId, studentBaseCourseRequest, runFunction)),
		setFinalizeStudentBaseCourseRequests: (personId, studentPersonId) => dispatch(actionStudentBaseCourseRequest.setFinalizeStudentBaseCourseRequests(personId, studentPersonId)),
		removeStudentBaseCourseRequest: (personId, studentBaseCourseRequestId, runFunction) => dispatch(actionStudentBaseCourseRequest.removeStudentBaseCourseRequest(personId, studentBaseCourseRequestId, runFunction)),
		declineCourseAssignByAdmin: (personId, courseAssignByAdminId, studentPersonId) => dispatch(actionStudentBaseCourseRequest.declineCourseAssignByAdmin(personId, courseAssignByAdminId, studentPersonId)),
		removeCourseRecommendation: (personId, studentPersonId, courseEntryId, type) => dispatch(actionCourseRecommendation.removeCourseRecommendation(personId, studentPersonId, courseEntryId, type)),

		updatePersonConfig: (personId, field, value) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getCurrentEnrollmentPreReq: (personId, studentPersonId) => dispatch(actionCurrentEnrollment.getCurrentEnrollmentPreReq(personId, studentPersonId)),
		getOpenRegistrations: (personId) => dispatch(actionOpenRegistrations.init(personId)),
		getGradRequirements: (studentPersonId) => dispatch(actionGradReqirements.init(studentPersonId)),
		getCoursePrerequisites: (personId) => dispatch(actionCoursePrerequisites.getCoursePrerequisites(personId)),
		clearStudentCourseAssignNameSearch: () => dispatch(actionCourseToSchedule.clearStudentCourseAssignNameSearch()),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		getDepartments: (personId) => dispatch(actionDepartment.init(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, setMyVisitedPage, getStudentBaseCourseRequests, studentPersonId,getCurrentEnrollmentPreReq, getGradRequirements, getDepartments,
    								getLearningPathways} = props
    				if (studentPersonId) {
    						getStudentBaseCourseRequests(personId, studentPersonId)
    						getCurrentEnrollmentPreReq(personId, studentPersonId)
    						getGradRequirements(studentPersonId)
    				}
    			    getPageLangs(personId, langCode, 'StudentBaseCourseRequestView')
    				getLearningPathways(personId)
    				getDepartments(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Student Base Course Request`})
    	  
  }, [])

  return <StudentBaseCourseRequestView {...props} />
}

export default Container
