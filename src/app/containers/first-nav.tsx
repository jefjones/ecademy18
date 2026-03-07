
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import LangContext from '../context/LangContext'
import FirstNavView from '../views/FirstNavView'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import * as actionLogin from '../actions/login'
import * as actionIPAddress from '../actions/ip-address'
import * as actionPersonConfig from '../actions/person-config'
import * as loginUser from '../actions/login'
//First Nav actions:
import * as actionGradeReport from '../actions/grade-report'
import * as actionAccessRoles from '../actions/access-roles'
import * as actionCourseEntry from '../actions/course-entry'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionAssessment from '../actions/assessment'
import * as actionLearners from '../actions/learners'
import * as actionStudent from '../actions/student'
import * as actionRegistration from '../actions/registration'
import * as actionRegistrationPending from '../actions/registration-pending'
import * as actionRegStudent from '../actions/reg-student'
import * as actionGuardianContact from '../actions/reg-guardian-contact'
import * as actionAnnouncement from '../actions/announcements'
import * as actionStudentAssignments from '../actions/student-assignments'
import * as actionCourseDocuments from '../actions/course-documents'
import * as actionAssessmentCorrect from '../actions/assessment-correct'
import * as assignmentsPendingReview from '../actions/assignments-pending-review'
import * as actionObservers from '../actions/observers'
import * as actionStudentSchedule from '../actions/student-schedule'
import * as actionOpenRegistrations from '../actions/open-registrations'
import * as fromOpenRegistration from '../reducers/open-registrations'
import * as actionUserPersonClipboard from '../actions/user-person-clipboard'
import * as actionCourseClipboard from '../actions/course-clipboard'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionCourseRecommendation from '../actions/course-recommendation'
import * as actionRelationTypes from '../actions/relation-types'
import * as actionRegistrationCustodies from '../actions/registration-custody'
import * as actionCountsMainMenu from '../actions/counts-main-menu'
import * as actionCompanyConfig from '../actions/company-config'
import * as actionGuardians from '../actions/guardians'
import * as actionVolunteerEvent from '../actions/volunteer-event'
import * as actionAdminResponsePendings from '../actions/admin-response-pendings'
import * as actionAssignments from '../actions/assignment-list'
import * as actionSafetyAlert from '../actions/safety-alert'
import * as actionCheckInOrOut from '../actions/curbside-check-in-out'
import * as actionRegBillingPreference from '../actions/reg-billing-preference'
import * as actionAbsenceUnexcused from '../actions/absence-unexcused'
import * as actionWorks from '../actions/works'
import * as actionChapters from '../actions/chapters'
import * as actionGroups from '../actions/groups'
import * as actionEditorInvitePending from '../actions/editor-invite-pending'
import {doSort} from '../utils/sort'
import { selectMe, selectFetchingRecord, selectPersonConfig, selectCoursesBase, selectStudents, selectUsers, selectCalendarEvents,
						selectAccessRoles, selectCompanyConfig, selectRegistration, selectRegistrationCustodies, selectRegistrationPersonId,
						selectRelationTypes, selectStudentSchedule, selectCoursesScheduled, selectOpenRegistrations, selectUserPersonClipboard,
						selectCourseClipboard, selectCourseRecommendations, selectCountsMainMenu, selectGuardians, selectDuenos,
						selectIntervals, selectCoursesScheduledSimple, selectSchoolYears, selectGradeLevels, selectVolunteerEvents,
					  selectAdminResponsePendings, selectMyFrequentPlaces, selectMyVisitedPages, selectDoctorNoteInviteId, selectDoctorNoteInvites,
						selectDoctors, selectPageLangs, selectStudentChosenSession, selectWorkSummaryCurrent, selectGroupIdCurrent, selectGroups,
						selectEditorInvitePending	} from '../store'

function mapStateToProps(state, props) {
		let accessRoles = selectAccessRoles(state)
		let companyConfig = selectCompanyConfig(state)
		let studentSchedule = selectStudentSchedule(state)
		//let registrationPending = selectRegistrationPending(state);
		let students = selectStudents(state)
		let countsAll = selectCountsMainMenu(state)
		let countsMainMenu = countsAll && countsAll.mainMenu

    let counts = {
        myCalendar: '',
        learningOpportunities: countsMainMenu.coursesScheduled,
        learners: countsMainMenu.students,
        facilitators: countsMainMenu.teachers,
				messagesInbox: countsMainMenu.messages,
				teacherAssignmentsPendingReview: countsMainMenu.assignmentsWaitingForReview,
				teacherAssessmentPendingEssays: countsMainMenu.testsWaitingForEssayResponse,
				openRegistrations: countsMainMenu.openRegistration,
				clipboardStudents: countsMainMenu.clipboardStudents,
				clipboardCourses: countsMainMenu.clipboardCourses,
				courseRecommendations: countsMainMenu.courseRecommendations,
				registrationPending: countsMainMenu.registrations,
				hasOpenedSettings: countsMainMenu.hasOpenedSettings,
				learnerCourseAssigns: countsMainMenu.learnerCourseAssigns,
				courseAssignments: countsMainMenu.courseAssignments,
				curbsideCheckInOrOuts: countsMainMenu.curbsideCheckInOrOuts,
				volunteerCheckInOrOuts: countsMainMenu.volunteerCheckInOrOuts,
				safetyAlerts: countsMainMenu.safetyAlerts,
				personalBillingBalance: countsMainMenu.personalBillingBalance,
				absenceUnexcused: countsMainMenu.absenceUnexcused,
				excusedAbsenceRequests: countsMainMenu.excusedAbsenceRequests,
				doctorNoteInvitesPending: countsMainMenu.doctorNoteInvitesPending,
    }

		let isNewSchoolCheckList = counts && (!counts.learners || !counts.facilitators || !counts.learningOpportunities || !companyConfig.hasOpenedSettings || !counts.learnerCourseAssigns || !counts.courseAssignments) ? true : false
		let belowMinimalCountNewSchool = counts && (counts.learners <= 5 || counts.facilitators <= 2 || counts.learningOpportunities <= 2 || counts.learnerCourseAssigns <= 1 || counts.courseAssignments <= 1) ? true : false
		let personId = selectMe(state).personId
		let courseEntries = selectCoursesBase(state)
		studentSchedule = doSort(studentSchedule, { sortField: 'classPeriodName', isAsc: true, isNumber: false })
		let groupId = selectGroupIdCurrent(state)
    let group = selectGroups(state) && selectGroups(state).length > 0 && selectGroups(state).filter(m => m.groupId === groupId)[0]

    return {
				me: selectMe(state),
				studentChosenSession: selectStudentChosenSession(state),
				schoolYearId: (props.params && props.params.schoolYearId) || 10,
        isLoggedIn: state.loggedIn,
        redirectUrl: state.redirectUrl,
        personId,
        personName: selectMe(state).fname + ' ' + selectMe(state).lname,
        fetchingRecord: selectFetchingRecord(state),
        personConfig: selectPersonConfig(state),
        //FirstNav props:
        accessRoles,
        calendarEvents: selectCalendarEvents(state) || [],
				firstName:  selectMe(state).preferredName ? selectMe(state).preferredName : selectMe(state).firstName ? selectMe(state).firstName : selectMe(state).fname,
				studentSchedule,
				students,
				guardians: selectGuardians(state),
				admins: selectUsers(state, 'Admin'),
				duenos: selectDuenos(state),
				intervals: selectIntervals(state),
				facilitators: selectUsers(state, 'Facilitator'),
				userPersonClipboard: selectUserPersonClipboard(state),
				courseClipboard: selectCourseClipboard(state),
				scheduledCourses: selectCoursesScheduled(state),
				courseEntries,
				courseRecommendations: selectCourseRecommendations(state),
				//parent registration data:
				relationTypes: selectRelationTypes(state),
				registrationCustodies: selectRegistrationCustodies(state),
				registration: selectRegistration(state),
        counts,
				isNewSchoolCheckList,
				belowMinimalCountNewSchool,
				companyConfig,
				registrationPersonId: selectRegistrationPersonId(state),
				coursesScheduledSimple: selectCoursesScheduledSimple(state),
				openRegistrations: selectOpenRegistrations(state),
				openRegistration: fromOpenRegistration.selectOpenRegistration(state.openRegistrations, personId),
				schoolYears: selectSchoolYears(state),
				gradeLevels: selectGradeLevels(state),
				volunteerEvents: selectVolunteerEvents(state),
				adminResponsePendings: selectAdminResponsePendings(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				myVisitedPages: selectMyVisitedPages(state),
				doctorNoteInviteId: selectDoctorNoteInviteId(state),
				doctorNoteInvites: selectDoctorNoteInvites(state),
				doctors: selectDoctors(state),
				pageLangs: selectPageLangs(state),
				workSummary: selectWorkSummaryCurrent(state),
				groupSummary: group,
				groupSummaries: selectGroups(state),
				editorInvitePending: selectEditorInvitePending(state),
		}
}

const bindActionsToDispatch = dispatch => ({
	  getIpAddress: () => dispatch(actionIPAddress.getIpAddress()),
	  logout: () => dispatch(actionLogin.logout()),
	  updatePersonConfig: (personId, field, value, runFunction)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
	  //First nav actions:
	  getAccessRoles: (personId) => dispatch(actionAccessRoles.getAccessRoles(personId)),
		getCoursesBase: (personId) => dispatch(actionCourseEntry.getCoursesBase(personId)),
	  getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		removeCourseToSchedule: (personId, courseScheduledId) => dispatch(actionCourseToSchedule.removeCourseToSchedule(personId, courseScheduledId)),
	  removeLearner: (personId, studentPersonId) => dispatch(actionLearners.removeLearner(personId, studentPersonId)),
	  removeCourse: (personId, courseEntryId) => dispatch(actionCourseEntry.removeCourse(personId, courseEntryId)),
	  removeAssessment: (personId, assessmentId) => dispatch(actionAssessment.removeAssessment(personId, assessmentId)),
		removeAnnouncement: (personId, announcementId, recipientPersonId, listType, deleteType) => dispatch(actionAnnouncement.removeAnnouncement(personId, announcementId, recipientPersonId, listType, deleteType)),
		setAsSeenByRecipient: (personId, announcementId) => dispatch(actionAnnouncement.setAsSeenByRecipient(personId, announcementId)),
		getAnnouncementsRecipient: (personId) => dispatch(actionAnnouncement.getAnnouncementsRecipient(personId)),
		getAnnouncementsSentBy: (personId) => dispatch(actionAnnouncement.getAnnouncementsSentBy(personId)),
		getAnnouncementsDeleted: (personId) => dispatch(actionAnnouncement.getAnnouncementsDeleted(personId)),
		clearAnnouncementList: () => dispatch(actionAnnouncement.clearAnnouncementList()),
		resolveFetchingRecordAnnouncements: () => dispatch(actionFetchingRecord.resolveFetchingRecordAnnouncements()),
	  //Registration nav actions:
	  initRegistration: (personId) => dispatch(actionRegistration.initRegistration(personId)),
		initNextYearRegistration: (personId, schoolYearId) => dispatch(actionRegistration.initNextYearRegistration(personId, schoolYearId)),
		addPreviousStudentThisYear: (personId, studentPersonId, schoolYearId) => dispatch(actionRegistration.addPreviousStudentThisYear(personId, studentPersonId, schoolYearId)),
		updateRegStudent: (personId, student, studentPersonId, isDelete) => dispatch(actionRegistration.updateRegStudent(personId, student, studentPersonId, isDelete)),
	  removeRegStudent: (personId, studentPersonId, schoolYearId) => dispatch(actionRegStudent.removeRegStudent(personId, studentPersonId, schoolYearId)),
	  removeGuardianContact: (personId, contactPersonId, personType, schoolYearId) => dispatch(actionGuardianContact.removeGuardianContact(personId, contactPersonId, personType, schoolYearId)),
	  updateBillingPreference: (personId, billing) => dispatch(actionRegistration.updateBillingPreference(personId, billing)),
		updatePayment: (personId, payment) => dispatch(actionRegistration.updatePayment(personId, payment)),
		addOrUpdateRelation: (personId, guardianPersonId, studentPersonId, relationTypeId, schoolYearId) => dispatch(actionGuardianContact.addOrUpdateRelation(personId, guardianPersonId, studentPersonId, relationTypeId, schoolYearId)),
		addOrUpdateCustody: (personId, guardianPersonId, studentPersonId, registrationCustodyId, schoolYearId) => dispatch(actionGuardianContact.addOrUpdateCustody(personId, guardianPersonId, studentPersonId, registrationCustodyId, schoolYearId)),
		getRegistration: (personId, registrationPersonId, schoolYearId) => dispatch(actionRegistration.getRegistration(personId, registrationPersonId, schoolYearId)),
		setRegistrationFinalizedDate: (personId, registrationPersonId, schoolYearId) => dispatch(actionRegistrationPending.setRegistrationFinalizedDate(personId, registrationPersonId, schoolYearId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		getAssessmentsPendingEssay: (personId) => dispatch(actionAssessmentCorrect.getAssessmentsPendingEssay(personId)),
		courseDocumentsInit: (personId, courseEntryId) => dispatch(actionCourseDocuments.init(personId, courseEntryId)),
		getAssignmentsPendingReview: (personId) => dispatch(assignmentsPendingReview.getAssignmentsPendingReview(personId)),
		getObservers: (personId) => dispatch(actionObservers.init(personId)),
		getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		removeStudentCourseAssign: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentSchedule.removeStudentCourseAssign(personId, studentPersonId, courseScheduledId)),
		resolveFetchingRecordPendingReview: (personId) => dispatch(actionFetchingRecord.resolveFetchingRecordPendingReview(personId)),
		removeOpenRegistration: (personId, openRegistrationTableId) => dispatch(actionOpenRegistrations.removeOpenRegistration(personId, openRegistrationTableId)),
		removeAllUserPersonClipboard: (personId, personType, runFunction) => dispatch(actionUserPersonClipboard.removeAllUserPersonClipboard(personId, personType, runFunction)),
		removeStudentUserPersonClipboard: (personId, chosenPersonId, personType) => dispatch(actionUserPersonClipboard.removeStudentUserPersonClipboard(personId, chosenPersonId, personType)),
		resetUserPersonClipboard: (personId, userPersonClipboard, sendTo) => dispatch(actionUserPersonClipboard.resetUserPersonClipboard(personId, userPersonClipboard, sendTo)),
		removeAllCourseClipboard: (personId, courseListType) => dispatch(actionCourseClipboard.removeAllCourseClipboard(personId, courseListType)),
		singleRemoveCourseClipboard: (personId, chosenCourseId, courseListType) => dispatch(actionCourseClipboard.singleRemoveCourseClipboard(personId, chosenCourseId, courseListType)),
		resetCourseClipboard: (personId, courseClipboard, sendTo) => dispatch(actionCourseClipboard.resetCourseClipboard(personId, courseClipboard, sendTo)),
		removeCourseRecommendation: (personId, studentPersonId, courseEntryId, byType) => dispatch(actionCourseRecommendation.removeCourseRecommendation(personId, studentPersonId, courseEntryId, byType)),
		removeAllMyCourseRecommendations: (personId) => dispatch(actionCourseRecommendation.removeAllMyCourseRecommendations(personId)),
		getCourseRecommendations: (personId, type) => dispatch(actionCourseRecommendation.getCourseRecommendations(personId, type)),
		getRegistrationPending: (personId) => dispatch(actionRegistrationPending.init(personId)),
		login: (userData, inviteResponse, salta) => dispatch(loginUser.login(userData, inviteResponse, salta)),
		getOpenRegistrations: (personId) => dispatch(actionOpenRegistrations.init(personId)),
		getUserPersonClipboard: (personId, personType) => dispatch(actionUserPersonClipboard.init(personId, personType)),
		getStudents: (personId) => dispatch(actionStudent.getStudents(personId)),
		getCourseClipboard: (personId, courseListType) => dispatch(actionCourseClipboard.init(personId, courseListType)),
		getRelationTypes: () => dispatch(actionRelationTypes.init()),
		getRegistrationCustodies: () => dispatch(actionRegistrationCustodies.init()),
		getCountsMainMenu: (personId) => dispatch(actionCountsMainMenu.getCountsMainMenu(personId)),
		setCompanyConfig: (personId, field, value) => dispatch(actionCompanyConfig.setCompanyConfig(personId, field, value)),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		removeVolunteerHours: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.removeVolunteerHours(personId, volunteerEventId)),
		getVolunteerEvents: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.getVolunteerEvents(personId, volunteerEventId)),
		getAdminResponsePendings: (personId) => dispatch(actionAdminResponsePendings.getAdminResponsePendings(personId)),
		pickupAdminResponsePending: (personId, adminResponsePendingId) => dispatch(actionAdminResponsePendings.pickupAdminResponsePending(personId, adminResponsePendingId)),
		responseAdminResponsePending: (personId, adminResponsePendingId) => dispatch(actionAdminResponsePendings.responseAdminResponsePending(personId, adminResponsePendingId)),
		resetAdminResponsePending: (personId, adminResponsePendingId) => dispatch(actionAdminResponsePendings.resetAdminResponsePending(personId, adminResponsePendingId)),
		assignmentsInit: (personId, courseEntryId) => dispatch(actionAssignments.init(personId, courseEntryId)),
		confirmSafetyAlert: (personId, adminConfirm) => dispatch(actionSafetyAlert.confirmSafetyAlert(personId, adminConfirm)),
		confirmCheckInOrOut: (personId, adminConfirm) => dispatch(actionCheckInOrOut.confirmCheckInOrOut(personId, adminConfirm)),
		confirmVolunteerHour: (personId, adminConfirm) => dispatch(actionVolunteerEvent.confirmVolunteerHour(personId, adminConfirm)),
		finalizeNonLiahonaRegistration: (personId, schoolYearId) => dispatch(actionRegBillingPreference.finalizeNonLiahonaRegistration(personId, schoolYearId)),
		getRegistrationByStudent: (personId, studentPersonId, schoolYearId) => dispatch(actionRegistration.getRegistrationByStudent(personId, studentPersonId, schoolYearId)),
		setStudentCourseAssignNameSearch: (partialNameText) => dispatch(actionCourseToSchedule.setStudentCourseAssignNameSearch(partialNameText)),
		getAbsenceUnexcused: (personId, isPendingApproval) => dispatch(actionAbsenceUnexcused.getAbsenceUnexcused(personId, isPendingApproval)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
		getTheStudent: (personId, studentPersonId) => dispatch(actionStudent.getTheStudent(personId, studentPersonId)),
		getGradeReport: (personId, studentPersonId, schoolYearId) => dispatch(actionGradeReport.getGradeReport(personId, studentPersonId, schoolYearId)),
		deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
		deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
		deleteGroup: (personId, groupId) => dispatch(actionGroups.deleteGroup(personId, groupId)),
		setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
		setGroupCurrentSelected: (personId, groupId, masterWorkId, memberWorkId, goToPage) => dispatch(actionGroups.setGroupCurrentSelected(personId, groupId, masterWorkId, memberWorkId, goToPage)),
		deleteInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.deleteInvite(personId, friendInvitationId)),
	  acceptInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.acceptInvite(personId, friendInvitationId)),
	  resendInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.resendInvite(personId, friendInvitationId)),
		resetCache: (personId) => dispatch(actionLogin.resetCache(personId)),
})


const alertOptions = {
	  position: 'top center',
	  timeout: 4000,
	  offset: '30px',
	  transition: 'scale'
}

function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const {accessRoles, pageLangs} = props
          return accessRoles
  						?  <LangContext.Provider value={pageLangs}>
  									<AlertProvider template={AlertTemplate} {...alertOptions}>
  								  		<FirstNavView {...props} />
  						   		</AlertProvider>
  							 </LangContext.Provider>
  					  : null
}

export default Container
