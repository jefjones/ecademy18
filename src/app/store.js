import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {ALLOW_REDUX_DEV_TOOLS} from './env';
import isBrowser from 'is-in-browser';
import { routerReducer as routing } from 'react-router-redux';
import system, * as fromSystem from './reducers/system';

import fetchingRecord, * as fromFetchingRecord from './reducers/fetching-record';
import me, * as fromMe from './reducers/login';
import loggedIn, * as fromLoggedIn from './reducers/logged-in';
import languageList, * as fromLanguageList from './reducers/language-list';
import countries, * as fromCountry from './reducers/countries';
import usStates, * as fromUSState from './reducers/us-states';
import learnerFilter, * as fromLearnerFilter from './reducers/learner-filter';
import calendar, * as fromCalendar from './reducers/calendar-events';
import courseFilter, * as fromCourseFilter from './reducers/course-filter';
import personConfig, * as fromPersonConfig from './reducers/person-config';
import companyConfig, * as fromCompanyConfig from './reducers/company-config';
import myProfile, * as fromMyProfile from './reducers/my-profile';
import learners, * as fromLearners from './reducers/learners';
import observers, * as fromObservers from './reducers/observers';
import guardians, * as fromGuardians from './reducers/guardians';
import learnerOutcomes, * as fromLearnerOutcomes from './reducers/learner-outcomes';
import learnerOutcomeTargets, * as fromLearnerOutcomeTargets from './reducers/learner-outcome-targets';
import learningPathways, * as fromLearningPathways from './reducers/learning-pathways';
import learningFocusAreas, * as fromLearningFocusAreas from './reducers/learning-focus-areas';
import courseTypes, * as fromCourseTypes from './reducers/course-types';
import contentTypes, * as fromContentTypes from './reducers/content-types';
import questionTypes, * as fromQuestionTypes from './reducers/question-types';
import intervals, * as fromIntervals from './reducers/semester-intervals';
import schoolYears, * as fromSchoolYears from './reducers/school-years';
import courses, * as fromCourses from './reducers/course-entry';
import assessment, * as fromAssessment from './reducers/assessment';
import mentorsAssigned, * as fromMentorsAssigned from './reducers/mentors-assigned';
import accessRoles, * as fromAccessRoles from './reducers/access-roles';
import assessmentQuestions, * as fromAssessmentQuestions from './reducers/assessment-questions';
import assignments, * as fromAssignments from './reducers/assignments';
import studentAssignments, * as fromStudentAssignments from './reducers/student-assignments';
import discussionEntries, * as fromDiscussionEntries from './reducers/discussion-entries';
import classPeriods, * as fromClassPeriods from './reducers/class-periods';
import alerts, * as fromAlerts from './reducers/alerts';
import scheduleAssignByMath, * as fromScheduleAssignByMath from './reducers/schedule-assign-by-math';
import scheduleAssignMathNames, * as fromScheduleAssignMathNames from './reducers/schedule-assign-math-names';
import courseAttendanceRoll, * as fromCourseAttendanceRoll from './reducers/course-attendance-roll';
import courseAttendanceDays, * as fromCourseAttendanceDays from './reducers/course-attendance-days';
import courseAttendanceAdmin, * as fromCourseAttendanceAdmin from './reducers/course-attendance-admin';
import courseAttendanceSingle, * as fromCourseAttendanceSingle from './reducers/course-attendance-single';
import courseAttendanceClassReport, * as fromCourseAttendanceClassReport from './reducers/course-attendance-class-report';
import gradebook, * as fromGradebook from './reducers/gradebook-entry';
import gradebookSummary, * as fromGradebookSummary from './reducers/gradebook-summary';
import studentGradebooks, * as fromStudentGradebooks from './reducers/student-gradebooks';
import ratingBook, * as fromRatingBook from './reducers/rating-book';
import gradeScale, * as fromGradeScale from './reducers/grade-scale';
import gradeLevel, * as fromGradeLevel from './reducers/grade-level';
import coursePrerequisites, * as fromCoursePrerequisites from './reducers/course-prerequisites';
import howLearnOfUsList, * as fromHowLearnOfUs from './reducers/how-learn-of-us';
import gender, * as fromGender from './reducers/gender';
import maritalStatus, * as fromMaritalStatus from './reducers/marital-status';
import assessmentCorrect, * as fromAssessmentCorrect from './reducers/assessment-correct';
import assessmentCorrectSummary, * as fromAssessmentCorrectSummary from './reducers/assessment-correct-summary';
import assessmentCorrectSameAllStudents, * as fromAssessmentCorrectSameAllStudents from './reducers/assessment-correct-same-all-students';
import assessmentPendingEssay, * as fromAssessmentPendingEssay from './reducers/assessment-pending-essay';
import assignmentsPendingReview, * as fromAssignmentsPendingReview from './reducers/assignments-pending-review';
import ratingBarReport, * as fromRatingBarReport from './reducers/rating-bar-report';
import voiceRecording, * as fromVoiceRecording from './reducers/voice-recording';
import registration, * as fromRegistration from './reducers/registration';
import registrationsList, * as fromRegistrationsList from './reducers/registrations-list';
import isRegistration, * as fromIsRegistration from './reducers/is-registration';
import announcements, * as fromAnnouncements from './reducers/announcements';
import mentorSummary, * as fromMentorSummary from './reducers/mentor-summary-edit';
import regGuardianContact, * as fromRegGuardianContact from './reducers/reg-guardian-contact';
import regStudent, * as fromRegStudent from './reducers/reg-student';
import relationTypes, * as fromRelationTypes from './reducers/relation-types';
import registrationCustodies, * as fromRegistrationCustody from './reducers/registration-custody';
import studentSchedule, * as fromStudentSchedule from './reducers/student-schedule';
import studentScheduleWeek, * as fromStudentScheduleWeek from './reducers/student-schedule-week';
import gradeReport, * as fromGradeReport from './reducers/grade-report';
import courseDocuments, * as fromCourseDocuments from './reducers/course-documents';
import announcementAttachments, * as fromAnnouncementAttachments from './reducers/announcement-attachments';
import openRegistrations, * as fromOpenRegistrations from './reducers/open-registrations';
import userPersonClipboard, * as fromUserPersonClipboard from './reducers/user-person-clipboard';
import courseClipboard, * as fromCourseClipboard from './reducers/course-clipboard';
import courseNewRequested, * as fromCourseNewRequested from './reducers/course-new-requested';
import penspringTransfer, * as fromPenspringTransfer from './reducers/penspring-transfer';
import courseWeightedScore, * as fromCourseWeightedScore from './reducers/course-weighted-score';
import messageSave, * as fromMessageSave from './reducers/message-save';
import courseWaitList, * as fromCourseWaitList from './reducers/report-course-wait-list';
import courseRecommendations, * as fromCourseRecommendations from './reducers/course-recommendation';
import attendanceReport, * as fromAttendanceReport from './reducers/attendance-report';
import courseGradeLevels, * as fromCourseGradeLevels from './reducers/course-grade-levels';
import messageGroups, * as fromMessageGroups from './reducers/message-groups';
import gradRequirements, * as fromGradRequirements from './reducers/grad-requirements';
import savedStudentSearch, * as fromSavedStudentSearch from './reducers/saved-student-search';
import paymentProcessingResponse, * as fromPaymentProcessingResponse from './reducers/payment-process-response';
import registrationPending, * as fromRegistrationPending from './reducers/registration-pending';
import registrationCourses, * as fromRegistrationCourses from './reducers/registration-courses';
import currentEnrollmentPreReq, * as fromCurrentEnrollmentPreReq from './reducers/current-enrollment-pre-req';
import departments, * as fromDepartment from './reducers/department';
import reportStudentRegistration, * as fromReportStudentRegistration from './reducers/report-student-registration';
import reportCourseSeatStatus, * as fromReportCourseSeatStatus from './reducers/report-course-seat-status';
import reportStudentCourseAssign, * as fromReportStudentCourseAssign from './reducers/report-student-course-assign';
import multStudentSchedules, * as fromMultStudentSchedules from './reducers/mult-student-schedules';
import countsMainMenu, * as fromCountsMainMenu from './reducers/counts-main-menu';
import organizationNames, * as fromOrganizationNames from './reducers/organization-names';
import fileFields, * as fromFileFields from './reducers/file-fields';
import studentAssignmentAssign, * as fromStudentAssignmentAssign from './reducers/student-assignment-assign';
import teacherSchedule, * as fromTeacherSchedule from './reducers/teacher-schedule';
import standardsRating, * as fromStandardsRating from './reducers/standards-rating';
import passFailRating, * as fromPassFailRating from './reducers/pass-fail-rating';
import duenos, * as fromDuenos from './reducers/duenos';
import carpool, * as fromCarpool from './reducers/carpool';
import checkInOrOut, * as fromCheckInOrOut from './reducers/curbside-check-in-out';
import buildingAndFieldTreeExplorer, * as fromBuildingAndFieldTreeExplorer from './reducers/building-and-field-tree-explorer';
import mapDirections, * as fromMapDirections from './reducers/map-directions';
import safetyAlertTypes, * as fromSafetyAlertTypes from './reducers/safety-alert-types';
import safetyAlerts, * as fromSafetyAlerts from './reducers/safety-alerts';
import volunteerTypes, * as fromVolunteerTypes from './reducers/volunteer-types';
import volunteerEvents, * as fromVolunteerEvents from './reducers/volunteer-event';
import volunteerOpportunities, * as fromVolunteerOpportunities from './reducers/volunteer-opportunity';
import attendanceSchool, * as fromAttendanceSchool from './reducers/attendance-school';
import lunchMenuOptions, * as fromLunchMenuOptions from './reducers/lunch-menu-options';
import lunchMenuMonth, * as fromLunchMenuMonth from './reducers/lunch-menu-month';
import lunchMenuStudentDay, * as fromLunchMenuStudentDay from './reducers/lunch-menu-student-day';
import adminResponsePendings, * as fromAdminResponsePendings from './reducers/admin-response-pendings';
import behaviorIncidentTypes, * as fromBehaviorIncidentTypes from './reducers/behavior-incident-types';
import behaviorIncidentResponseTypes, * as fromBehaviorIncidentResponseTypes from './reducers/behavior-incident-response-types';
import behaviorIncidents, * as fromBehaviorIncidents from './reducers/behavior-incident';
import financeBillings, * as fromFinanceBillings from './reducers/finance-billing';
import financeCredits, * as fromFinanceCredits from './reducers/finance-credit';
import lockers, * as fromLockers from './reducers/lockers';
import paddlelocks, * as fromPaddlelocks from './reducers/paddlelocks';
import lockerStudentAssigns, * as fromLockerStudentAssigns from './reducers/locker-student-assigns';
import testSettings, * as fromTestSettings from './reducers/test-settings';
import transcripts, * as fromTranscripts from './reducers/transcripts';
import schoolContacts, * as fromSchoolContacts from './reducers/school-contact-manager';
import carContacts, * as fromCarContacts from './reducers/car-contact-manager';
import jefFeatures, * as fromJefFeatures from './reducers/jef-feature';
import colleges, * as fromColleges from './reducers/colleges';
import studentDocuments, * as fromStudentDocuments from './reducers/student-documents';
import myFrequentPlaces, * as fromMyFrequentPlaces from './reducers/my-frequent-places';
import myVisitedPages, * as fromMyVisitedPages from './reducers/my-visited-pages';
import personConfigCalendar, * as fromPersonConfigCalendar from './reducers/person-config-calendar';
import tutorialVideos, * as fromTutorialVideos from './reducers/tutorial-videos';
import studentBaseCourseRequest, * as fromStudentBaseCourseRequests from './reducers/student-base-course-request';
import courseAssignByAdmins, * as fromCourseAssignByAdmins from './reducers/course-assign-by-admin';
import distributedCourses, * as fromDistributedCourses from './reducers/distributed-courses';
import absenceUnexcused, * as fromAbsenceUnexcused from './reducers/absence-unexcused';
import doctors, * as fromDoctors from './reducers/doctors';
import doctorNoteInvites, * as fromDoctorNoteInvites from './reducers/doctor-note-invite';
import doctorNoteInviteId, * as fromDoctorNoteInviteLogin from './reducers/doctor-note-invite-login';
import schools, * as fromSchools from './reducers/schools';
import doctorNotes, * as fromDoctorNotes from './reducers/doctor-notes';
import users, * as fromUsers from './reducers/users';
import benchmarkTests, * as fromBenchmarkTests from './reducers/benchmark-tests';
import standards, * as fromStandards from './reducers/standards';
import benchmarkTestClassComparison, * as fromBenchmarkTestClassComparison from './reducers/benchmark-test-class-comparison';
import benchmarkTestStudentComparison, * as fromBenchmarkTestStudentComparison from './reducers/benchmark-test-student-comparison';
import financeFeeTypes, * as fromFinanceFeeTypes from './reducers/finance-fee-types';
import financeCreditTypes, * as fromFinanceCreditTypes from './reducers/finance-credit-types';
import financePaymentTypes, * as fromFinancePaymentTypes from './reducers/finance-payment-types';
import financeGroups, * as fromFinanceGroups from './reducers/finance-groups';
import financeGLCodes, * as fromFinanceGLCodes from './reducers/finance-gl-codes';
import financeWaiverSchedules, * as fromFinanceWaiverSchedule from './reducers/finance-waiver-schedule';
import financeLowIncomeWaivers, * as fromFinanceLowIncomeWaivers from './reducers/finance-low-income-waivers';
import financeRefunds, * as fromFinanceRefunds from './reducers/finance-refund';
import financePayments, * as fromFinancePayments from './reducers/finance-payment';
import financeLunches, * as fromFinanceLunches from './reducers/finance-lunch';
import financeAccountSummaries, * as fromFinanceAccountSummaries from './reducers/finance-account-summaries';
import financeTransfers, * as fromFinanceTransfers from './reducers/finance-transfer';
import financeCourseFees, * as fromFinanceCourseFees from './reducers/finance-course-fee';
import lunchReducedApply, * as fromLunchReducedApply from './reducers/lunch-reduced-apply';
import pickupLanes, * as fromPickupLanes from './reducers/pickup-lane-settings';
import regSelfServceCourseCount, * as fromRegSelfServceCourseCount from './reducers/reg-self-service-course-count';
import studentCourseAssigns, * as fromStudentCourseAssigns from './reducers/student-course-assigns';
import students, * as fromStudents from './reducers/students';
import theStudent, * as fromTheStudent from './reducers/the-student';
import pageLangs, * as fromPageLangs from './reducers/page-langs';
import studentListByCourse, * as fromStudentListByCourse from './reducers/student-list-by-course';
import studentChosenSession, * as fromStudentChosenSession from './reducers/student-chosen-session';
//Penspring imports
import contacts, * as fromContacts from './reducers/contacts';
import editReview, * as fromEditReview from './reducers/EditReview/edit-review.js';
import editDetails, * as fromEditDetails from './reducers/edit-details.js';
import editorInviteName, * as fromEditorInviteName from './reducers/editor-invite-name';
import editorInvitePending, * as fromEditorInvitePending from './reducers/editor-invite-pending';
import editorInviteGUIDResponse, * as fromEditorInviteResponse from './reducers/editor-invite-response';
import editorInviteWorkAssign, * as fromEditorInviteWorkAssign from './reducers/editor-invite-work';
import editSeverityList, * as fromEditSeverityList from './reducers/edit-severity-list';
import genreList, * as fromGenreList from './reducers/genre-list';
import groupTypes, * as fromGroupTypes from './reducers/group-types';
import groups, * as fromGroups from './reducers/groups';
import peerGroup, * as fromPeerGroup from './reducers/peer-group';
import declineIdleList, * as fromDeclineIdleList from './reducers/decline-idle-list';
import colorsEditor, * as fromColorsEditor from './reducers/colors-editor';
import workStatusList, * as fromWorkStatusList from './reducers/work-status-list';
import works, * as fromWorks from './reducers/works';
import worksTreeData, * as fromWorksTreeData from './reducers/works-tree-data';
import chaptersList, * as fromChapters from './reducers/chapters';
import openCommunity, * as fromOpenCommunity from './reducers/open-community';
import contributorReport, * as fromContributorReport from './reducers/contributor-report';
import accessReport, * as fromAccessReport from './reducers/access-report';
import groupWorkAssignAccess, * as fromGroupWorkAssignAccess from './reducers/group-work-assign-access';
import groupEditReport, * as fromGroupEditReport from './reducers/group-edit-report';
import draftSettings, * as fromDraftSettings from './reducers/draft-settings';
import draftComparison from './reducers/draft-comparison';
import translatedSentence from './reducers/translated-sentence';
import editMicroReplace, * as fromEditMicroReplace from './reducers/edit-micro-replace';
import editFilter from './reducers/edit-filter';
import leftSidePanelOpen, * as fromLeftSidePanel from './reducers/left-side-panel';
import workFilter, * as fromWorkFilter from './reducers/work-filter';
import openCommunityFilter, * as fromOpenCommunityFilter from './reducers/open-community-filter';
import reportFilter, * as fromReportFilter from './reducers/report-filter';
import reportFilterOptions from './reducers/report-filter-options';
import contactFilter, * as fromContactFilter from './reducers/contact-filter';
import workId_current, * as fromWorkIdCurrent from './reducers/workId-current';
import groupId_current from './reducers/groupId-current';
import chapterId_current, * as fromChapterIdCurrent from './reducers/chapterId-current';
import languageId_current, * as fromLanguageIdCurrent from './reducers/languageId-current';
import personId_current, * as fromPersonIdCurrent from './reducers/personId-current';
import bookmarks from './reducers/bookmarks';
import translations, * as fromTranslations from './reducers/translations';
import textProcessingProgress, * as fromTextProcessingProgress from './reducers/text-processing-progress';
import myWorksFileTreeExplorer, * as fromMyWorksFileTreeExplorer from './reducers/my-works-file-tree-explorer';
import landingSteps, * as fromLandingSteps from './reducers/landing-steps';
import workEditReview, * as fromWorkEditReview from './reducers/work-edit-review';
import galleryList, * as fromGalleryList from './reducers/gallery-list';
import proxynizationTempPassword, * as fromProxynizationTempPassword from './reducers/reg-billing-preference';


// create the master reducer
const rootReducer = combineReducers({
		absenceUnexcused,
		accessReport,
		accessRoles,
		adminResponsePendings,
		alerts,
		announcementAttachments,
		announcements,
		assessment,
		assessmentCorrect,
		assessmentCorrectSameAllStudents,
		assessmentCorrectSummary,
		assessmentPendingEssay,
		assessmentQuestions,
		assignments,
		assignmentsPendingReview,
		attendanceReport,
		attendanceSchool,
		behaviorIncidentResponseTypes,
		behaviorIncidentTypes,
		behaviorIncidents,
		benchmarkTestClassComparison,
		benchmarkTestStudentComparison,
		benchmarkTests,
		bookmarks,
		buildingAndFieldTreeExplorer,
		calendar,
		carContacts,
		carpool,
		chapterId_current,
		chaptersList,
		checkInOrOut,
		classPeriods,
		colleges,
		colorsEditor,
		companyConfig,
		contactFilter,
		contacts,
		contentTypes,
		contributorReport,
		countries,
		countsMainMenu,
		courseAssignByAdmins,
		courseAttendanceAdmin,
		courseAttendanceClassReport,
		courseAttendanceDays,
		courseAttendanceRoll,
		courseAttendanceSingle,
		courseClipboard,
		courseDocuments,
		courseFilter,
		courseGradeLevels,
		courseNewRequested,
		coursePrerequisites,
		courseRecommendations,
		courseTypes,
		courseWaitList,
		courseWeightedScore,
		courses,
		currentEnrollmentPreReq,
		declineIdleList,
		departments,
		discussionEntries,
		distributedCourses,
		doctorNoteInviteId,
		doctorNoteInvites,
		doctorNotes,
		doctors,
		draftComparison,
		draftSettings,
		duenos,
		editDetails,
		editFilter,
		editMicroReplace,
		editReview,
		editSeverityList,
		editorInviteGUIDResponse,
		editorInviteName,
		editorInvitePending,
		editorInviteWorkAssign,
		fetchingRecord,
		fileFields,
		financeAccountSummaries,
		financeBillings,
		financeCourseFees,
		financeCreditTypes,
		financeCredits,
		financeFeeTypes,
		financeGLCodes,
		financeGroups,
		financeLowIncomeWaivers,
		financeLunches,
		financePaymentTypes,
		financePayments,
		financeRefunds,
		financeTransfers,
		financeWaiverSchedules,
		galleryList,
		gender,
		genreList,
		gradRequirements,
		gradeLevel,
		gradeReport,
		gradeScale,
		gradebook,
		gradebookSummary,
		groupEditReport,
		groupId_current,
		groupTypes,
		groupWorkAssignAccess,
		groups,
		guardians,
		howLearnOfUsList,
		intervals,
		isRegistration,
		jefFeatures,
		landingSteps,
		languageId_current,
		languageList,
		learnerFilter,
		learnerOutcomeTargets,
		learnerOutcomes,
		learners,
		learningFocusAreas,
		learningPathways,
		leftSidePanelOpen,
		lockerStudentAssigns,
		lockers,
		loggedIn,
		lunchMenuMonth,
		lunchMenuOptions,
		lunchMenuStudentDay,
		lunchReducedApply,
		mapDirections,
		maritalStatus,
		me,
		mentorSummary,
		mentorsAssigned,
		messageGroups,
		messageSave,
		multStudentSchedules,
		myFrequentPlaces,
		myProfile,
		myVisitedPages,
		myWorksFileTreeExplorer,
		observers,
		openCommunity,
		openCommunityFilter,
		openRegistrations,
		organizationNames,
		paddlelocks,
		pageLangs,
		passFailRating,
		paymentProcessingResponse,
		peerGroup,
		penspringTransfer,
		personConfig,
		personConfigCalendar,
		personId_current,
		pickupLanes,
		proxynizationTempPassword,
		questionTypes,
		ratingBarReport,
		ratingBook,
		regGuardianContact,
		regSelfServceCourseCount,
		regStudent,
		registration,
		registrationCourses,
		registrationCustodies,
		registrationPending,
		registrationsList,
		relationTypes,
		reportCourseSeatStatus,
		reportFilter,
		reportFilterOptions,
		reportStudentCourseAssign,
		reportStudentRegistration,
		routing,
		safetyAlertTypes,
		safetyAlerts,
		savedStudentSearch,
		scheduleAssignByMath,
		scheduleAssignMathNames,
		schoolContacts,
		schoolYears,
		schools,
		standards,
		standardsRating,
		studentAssignmentAssign,
		studentAssignments,
		studentBaseCourseRequest,
		studentChosenSession,
		studentCourseAssigns,
		studentDocuments,
		studentGradebooks,
		studentListByCourse,
		studentSchedule,
		studentScheduleWeek,
		students,
		system,
		teacherSchedule,
		testSettings,
		textProcessingProgress,
		theStudent,
		transcripts,
		translatedSentence,
		translations,
		tutorialVideos,
		usStates,
		userPersonClipboard,
		users,
		voiceRecording,
		volunteerEvents,
		volunteerOpportunities,
		volunteerTypes,
		workEditReview,
		workFilter,
		workId_current,
		workStatusList,
		works,
		worksTreeData,
});

// Reexport scoped selectors here:
export const selectMe = (state) => (
    fromMe.selectMe(state.me)
);

export const selectFetchingRecord = (state) => (
    fromFetchingRecord.selectFetchingRecord(state.fetchingRecord)
);

export const selectLoggedIn = (state) => (
    fromLoggedIn.selectLoggedIn(state.loggedIn)
);

export const selectLanguageList = (state) => (
    fromLanguageList.selectLanguageList(state.languageList)
);

export const selectLearners = (state) => (
    fromLearners.selectLearners(state.learners)
);

export const selectLearnersSimple = (state) => (
    fromLearners.selectLearnersSimple(state.learners)
);

export const selectGuardians = (state) => (
    fromGuardians.selectGuardians(state.guardians)
);

export const selectCoursesBase = (state) => (
    fromCourses.selectCoursesBase(state.courses)
);

export const selectCoursesScheduled = (state) => (
    fromCourses.selectCoursesScheduled(state.courses)
);

export const selectCoursesScheduledSimple = (state) => (
    fromCourses.selectCoursesScheduledSimple(state.courses)
);

export const selectCourseToSchedule = (state) => (
    fromCourses.selectCourseToSchedule(state.courses)
);

export const selectSeatsStatistics = (state) => (
    fromCourses.selectSeatsStatistics(state.courses)
);

export const selectPartialNameText = (state) => (
    fromCourses.selectPartialNameText(state.courses)
);

export const selectCourseDescription = (state) => (
    fromCourses.selectCourseDescription(state.courses)
);

export const selectStudentSchedule = (state) => (
    fromStudentSchedule.selectStudentSchedule(state.studentSchedule)
);

export const selectStudentScheduleWeek = (state) => (
    fromStudentScheduleWeek.selectStudentScheduleWeek(state.studentScheduleWeek)
);

export const selectAssessment = (state) => (
    fromAssessment.selectAssessment(state.assessment)
);

export const selectLearnerOutcomes = (state) => (
    fromLearnerOutcomes.selectLearnerOutcomes(state.learnerOutcomes)
);

export const selectLearnerOutcomeTargets = (state) => (
    fromLearnerOutcomeTargets.selectLearnerOutcomeTargets(state.learnerOutcomeTargets)
);

export const selectLearningPathways = (state) => (
    fromLearningPathways.selectLearningPathways(state.learningPathways)
);

export const selectLearningFocusAreas = (state) => (
    fromLearningFocusAreas.selectLearningFocusAreas(state.learningFocusAreas)
);

export const selectCourseTypes = (state) => (
    fromCourseTypes.selectCourseTypes(state.courseTypes)
);

export const selectContentTypes = (state) => (
    fromContentTypes.selectContentTypes(state.contentTypes)
);

export const selectLearnerFilter = (state) => (
    fromLearnerFilter.selectLearnerFilter(state.learnerFilter)
);

export const selectCourseFilter = (state) => (
    fromCourseFilter.selectCourseFilter(state.courseFilter)
);


export const selectPersonConfig = (state) => (
    fromPersonConfig.selectPersonConfig(state.personConfig || 0)
);

export const selectCompanyConfig = (state) => (
    fromCompanyConfig.selectCompanyConfig(state.companyConfig)
);

export const selectHTTPResponseCode = (state) => (
    fromSystem.selectHTTPResponseCode(state.system)
);

export const selectAllApplicationErrors = (state) => (
    fromSystem.selectAllApplicationErrors(state.system)
);

export const selectApplicationError = (state, id) => (
    fromSystem.selectApplicationError(state.system, id)
);

export const selectMyProfile = (state) => (
    fromMyProfile.selectMyProfile(state.myProfile)
);

export const selectMentorsAssigned = (state) => (
    fromMentorsAssigned.selectMentorsAssigned(state.mentorsAssigned)
);

export const selectCalendarEvents = (state) => (
    fromCalendar.selectCalendarEvents(state.calendar)
);

export const selectCalendarEventTypes = (state) => (
    fromCalendar.selectCalendarEventTypes(state.calendar)
);

export const selectCalendarEventConfig = (state) => (
    fromCalendar.selectCalendarEventConfig(state.calendar)
);

export const selectAccessRoles = (state) => (
    fromAccessRoles.selectAccessRoles(state.accessRoles)
);

export const selectAssessmentQuestions = (state) => (
    fromAssessmentQuestions.selectAssessmentQuestions(state.assessmentQuestions)
);

export const selectQuestionTypes = (state) => (
    fromQuestionTypes.selectQuestionTypes(state.questionTypes)
);

export const selectClassPeriods = (state) => (
    fromClassPeriods.selectClassPeriods(state.classPeriods)
);

export const selectScheduleAssignByMath = (state) => (
    fromScheduleAssignByMath.selectScheduleAssignByMath(state.scheduleAssignByMath)
);

export const selectScheduleAssignMathNames = (state) => (
    fromScheduleAssignMathNames.selectScheduleAssignMathNames(state.scheduleAssignMathNames)
);

export const selectCourseAttendanceRoll = (state) => (
    fromCourseAttendanceRoll.selectCourseAttendanceRoll(state.courseAttendanceRoll)
);

export const selectCourseAttendanceAdmin = (state) => (
    fromCourseAttendanceAdmin.selectCourseAttendanceAdmin(state.courseAttendanceAdmin)
);

export const selectCourseAttendanceSingle = (state) => (
    fromCourseAttendanceSingle.selectCourseAttendanceSingle(state.courseAttendanceSingle)
);

export const selectCourseAttendanceClassReport = (state) => (
    fromCourseAttendanceClassReport.selectCourseAttendanceClassReport(state.courseAttendanceClassReport)
);

export const selectCourseAttendanceDays = (state) => (
    fromCourseAttendanceDays.selectCourseAttendanceDays(state.courseAttendanceDays)
);

export const selectGradebook = (state) => (
    fromGradebook.selectGradebook(state.gradebook)
);

export const selectGradebookSummary = (state) => (
    fromGradebookSummary.selectGradebookSummary(state.gradebookSummary)
);

export const selectStudentGradebooks = (state) => (
    fromStudentGradebooks.selectStudentGradebooks(state.studentGradebooks)
);

export const selectRatingBook = (state) => (
    fromRatingBook.selectRatingBook(state.ratingBook)
);

export const selectGradeScale = (state) => (
    fromGradeScale.selectGradeScale(state.gradeScale)
);

export const selectGradeLevels = (state) => (
    fromGradeLevel.selectGradeLevels(state.gradeLevel)
);

export const selectHowLearnOfUsList = (state) => (
    fromHowLearnOfUs.selectHowLearnOfUsList(state.howLearnOfUsList)
);

export const selectAssessmentCorrect = (state) => (
    fromAssessmentCorrect.selectAssessmentCorrect(state.assessmentCorrect)
);

export const selectAssessmentCorrectSummary = (state) => (
    fromAssessmentCorrectSummary.selectAssessmentCorrectSummary(state.assessmentCorrectSummary)
);

export const selectAssessmentCorrectSameAllStudents = (state) => (
    fromAssessmentCorrectSameAllStudents.selectAssessmentCorrectSameAllStudents(state.assessmentCorrectSameAllStudents)
);

export const selectAssessmentPendingEssay = (state) => (
    fromAssessmentPendingEssay.selectAssessmentPendingEssay(state.assessmentPendingEssay)
);

export const selectAssignmentsPendingReview = (state) => (
    fromAssignmentsPendingReview.selectAssignmentsPendingReview(state.assignmentsPendingReview)
);

export const selectRatingBarReport = (state) => (
    fromRatingBarReport.selectRatingBarReport(state.ratingBarReport)
);

export const selectVoiceRecording = (state) => (
    fromVoiceRecording.selectVoiceRecording(state.voiceRecording)
);

export const selectRegistration = (state) => (
    fromRegistration.selectRegistration(state.registration)
);

export const selectRegistrationsList = (state) => (
    fromRegistrationsList.selectRegistrationsList(state.registrationsList)
);

export const selectSchoolCode = (state) => (
    fromIsRegistration.selectSchoolCode(state.isRegistration)
);

export const selectRegistrationPersonId = (state) => (
    fromIsRegistration.selectRegistrationPersonId(state.isRegistration)
);

export const selectAnnouncementList = (state) => (
    fromAnnouncements.selectAnnouncementList(state.announcements)
);

export const selectMessageFullThread = (state) => (
    fromAnnouncements.selectMessageFullThread(state.announcements)
);

export const selectAnnouncementsSentBy = (state) => (
    fromAnnouncements.selectAnnouncementsSentBy(state.announcements)
);

export const selectAnnouncementsDeleted = (state) => (
    fromAnnouncements.selectAnnouncementsDeleted(state.announcements)
);

export const selectAnnouncementsAdmin = (state) => (
    fromAnnouncements.selectAnnouncementsAdmin(state.announcements)
);

export const selectStudentsSelected = (state) => (
    fromAnnouncements.selectStudentsSelected(state.announcements)
);

export const selectLearnerPathways = (state) => (
    fromMentorSummary.selectLearnerPathways(state.mentorSummary)
);

export const selectPathwayComments = (state) => (
    fromMentorSummary.selectPathwayComments(state.mentorSummary)
);

export const selectIntervals = (state) => (
    fromIntervals.selectIntervals(state.intervals)
);

export const selectSchoolYears = (state) => (
    fromSchoolYears.selectSchoolYears(state.schoolYears)
);

export const selectMaritalStati = (state) => (
    fromMaritalStatus.selectMaritalStati(state.maritalStatus)
);

export const selectGender = (state) => (
    fromGender.selectGender(state.gender)
);

export const selectCountries = (state) => (
    fromCountry.selectCountries(state.countries)
);

export const selectUSStates = (state) => (
    fromUSState.selectUSStates(state.usStates)
);

export const selectRegGuardianContact = (state) => (
    fromRegGuardianContact.selectRegGuardianContact(state.regGuardianContact)
);

export const selectRegStudent = (state) => (
    fromRegStudent.selectRegStudent(state.regStudent)
);

export const selectRelationTypes = (state) => (
    fromRelationTypes.selectRelationTypes(state.relationTypes)
);

export const selectRegistrationCustodies = (state) => (
    fromRegistrationCustody.selectRegistrationCustodies(state.registrationCustodies)
);

export const selectDiscussionEntries = (state) => (
    fromDiscussionEntries.selectDiscussionEntries(state.discussionEntries)
);

export const selectAssignments = (state) => (
    fromAssignments.selectAssignments(state.assignments)
);

export const selectCourseDocuments = (state) => (
    fromCourseDocuments.selectCourseDocuments(state.courseDocuments)
);

export const selectStudentAssignments = (state) => (
    fromStudentAssignments.selectStudentAssignments(state.studentAssignments)
);

export const selectObservers = (state) => (
    fromObservers.selectObservers(state.observers)
);

export const selectOpenRegistrations = (state) => (
    fromOpenRegistrations.selectOpenRegistrations(state.openRegistrations)
);

export const selectUserPersonClipboard = (state) => (
    fromUserPersonClipboard.selectUserPersonClipboard(state.userPersonClipboard)
);

export const selectCourseClipboard = (state) => (
    fromCourseClipboard.selectCourseClipboard(state.courseClipboard)
);

export const selectAlerts = (state) => (
    fromAlerts.selectAlerts(state.alerts)
);

export const selectAnnouncementAttachments = (state) => (
    fromAnnouncementAttachments.selectAnnouncementAttachments(state.announcementAttachments)
);

export const selectCourseNewRequested = (state) => (
    fromCourseNewRequested.selectCourseNewRequested(state.courseNewRequested)
);

export const selectPenspringTransfer = (state) => (
    fromPenspringTransfer.selectPenspringTransfer(state.penspringTransfer)
);

export const selectCourseWeightedScore = (state) => (
    fromCourseWeightedScore.selectCourseWeightedScore(state.courseWeightedScore)
);

export const selectMessageSave = (state) => (
    fromMessageSave.selectMessageSave(state.messageSave)
);

export const selectDoNotAddCourses = (state) => (
    fromCourseWaitList.selectDoNotAddCourses(state.courseWaitList)
);

export const selectReportExcelCourseWaitList = (state) => (
    fromCourseWaitList.selectReportExcelCourseWaitList(state.courseWaitList)
);

export const selectCourseRecommendations = (state) => (
    fromCourseRecommendations.selectCourseRecommendations(state.courseRecommendations)
);

export const selectReportRecommendCourseName = (state) => (
    fromCourseRecommendations.selectReportRecommendCourseName(state.courseRecommendations)
);

export const selectReportRecommendByTeacher = (state) => (
    fromCourseRecommendations.selectReportRecommendByTeacher(state.courseRecommendations)
);

export const selectReportRecommendByStudent = (state) => (
    fromCourseRecommendations.selectReportRecommendByStudent(state.courseRecommendations)
);

export const selectGradeReport = (state) => (
    fromGradeReport.selectGradeReport(state.gradeReport)
);

export const selectAttendanceReport = (state) => (
    fromAttendanceReport.selectAttendanceReport(state.attendanceReport)
);

export const selectCourseGradeLevels = (state) => (
    fromCourseGradeLevels.selectCourseGradeLevels(state.courseGradeLevels)
);

export const selectMessageGroups = (state) => (
    fromMessageGroups.selectMessageGroups(state.messageGroups)
);

export const selectGradRequirements = (state) => (
    fromGradRequirements.selectGradRequirements(state.gradRequirements)
);

export const selectCoursePrerequisites = (state) => (
    fromCoursePrerequisites.selectCoursePrerequisites(state.coursePrerequisites)
);

export const selectSavedStudentSearch = (state) => (
    fromSavedStudentSearch.selectSavedStudentSearch(state.savedStudentSearch)
);

export const selectPaymentProcessingResponse = (state) => (
    fromPaymentProcessingResponse.selectPaymentProcessingResponse(state.paymentProcessingResponse)
);

export const selectRegistrationPending = (state) => (
    fromRegistrationPending.selectRegistrationPending(state.registrationPending)
);

export const selectRegistrationCourses = (state) => (
    fromRegistrationCourses.selectRegistrationCourses(state.registrationCourses)
);

export const selectCurrentEnrollmentPreReq = (state) => (
    fromCurrentEnrollmentPreReq.selectCurrentEnrollmentPreReq(state.currentEnrollmentPreReq)
);

export const selectDepartments = (state) => (
    fromDepartment.selectDepartments(state.departments)
);

export const selectReportStudentRegistration = (state) => (
    fromReportStudentRegistration.selectReportStudentRegistration(state.reportStudentRegistration)
);

export const selectMultStudentSchedules = (state) => (
    fromMultStudentSchedules.selectMultStudentSchedules(state.multStudentSchedules)
);

export const selectReportCourseSeatStatus = (state) => (
    fromReportCourseSeatStatus.selectReportCourseSeatStatus(state.reportCourseSeatStatus)
);

export const selectReportStudentCourseAssign = (state) => (
    fromReportStudentCourseAssign.selectReportStudentCourseAssign(state.reportStudentCourseAssign)
);

export const selectCountsMainMenu = (state) => (
    fromCountsMainMenu.selectCountsMainMenu(state.countsMainMenu)
);

export const selectOrganizationNames = (state) => (
    fromOrganizationNames.selectOrganizationNames(state.organizationNames)
);

export const selectFileFields = (state) => (
    fromFileFields.selectFileFields(state.fileFields)
);

export const selectStudentAssignmentAssign = (state) => (
    fromStudentAssignmentAssign.selectStudentAssignmentAssign(state.studentAssignmentAssign)
);

export const selectTeacherSchedule = (state) => (
    fromTeacherSchedule.selectTeacherSchedule(state.teacherSchedule)
);

export const selectStandardsRating = (state) => (
    fromStandardsRating.selectStandardsRating(state.standardsRating)
);

export const selectDuenos = (state) => (
    fromDuenos.selectDuenos(state.duenos)
);

export const selectCarpool = (state) => (
    fromCarpool.selectCarpool(state.carpool)
);

export const selectCheckInOrOuts = (state) => (
    fromCheckInOrOut.selectCheckInOrOuts(state.checkInOrOut)
);

export const selectCheckInOrOutReasons = (state) => (
    fromCheckInOrOut.selectCheckInOrOutReasons(state.checkInOrOut)
);

export const selectBuildingAndFieldTreeExplorer = (state) => (
    fromBuildingAndFieldTreeExplorer.selectBuildingAndFieldTreeExplorer(state.buildingAndFieldTreeExplorer)
);

export const selectMapDirections = (state) => (
    fromMapDirections.selectMapDirections(state.mapDirections)
);

export const selectSafetyAlertTypes = (state) => (
    fromSafetyAlertTypes.selectSafetyAlertTypes(state.safetyAlertTypes)
);

export const selectSafetyAlerts = (state) => (
    fromSafetyAlerts.selectSafetyAlerts(state.safetyAlerts)
);

export const selectVolunteerTypes = (state) => (
    fromVolunteerTypes.selectVolunteerTypes(state.volunteerTypes)
);

export const selectVolunteerEvents = (state) => (
    fromVolunteerEvents.selectVolunteerEvents(state.volunteerEvents)
);

export const selectVolunteerOpportunities = (state) => (
    fromVolunteerOpportunities.selectVolunteerOpportunities(state.volunteerOpportunities)
);

export const selectAttendanceSchool = (state) => (
    fromAttendanceSchool.selectAttendanceSchool(state.attendanceSchool)
);

export const selectLunchMenuOptions = (state) => (
    fromLunchMenuOptions.selectLunchMenuOptions(state.lunchMenuOptions)
);

export const selectLunchMenuMonth = (state) => (
    fromLunchMenuMonth.selectLunchMenuMonth(state.lunchMenuMonth)
);

export const selectLunchMenuStudentDays = (state) => (
    fromLunchMenuStudentDay.selectLunchMenuStudentDays(state.lunchMenuStudentDay)
);

export const selectAdminResponsePendings = (state) => (
    fromAdminResponsePendings.selectAdminResponsePendings(state.adminResponsePendings)
);

export const selectBehaviorIncidentTypes = (state) => (
    fromBehaviorIncidentTypes.selectBehaviorIncidentTypes(state.behaviorIncidentTypes)
);

export const selectBehaviorIncidentResponseTypes = (state) => (
    fromBehaviorIncidentResponseTypes.selectBehaviorIncidentResponseTypes(state.behaviorIncidentResponseTypes)
);

export const selectBehaviorIncidents = (state) => (
    fromBehaviorIncidents.selectBehaviorIncidents(state.behaviorIncidents)
);

export const selectBehaviorIncidentFilterGroups = (state) => (
    fromBehaviorIncidents.selectBehaviorIncidentFilterGroups(state.behaviorIncidents)
);

export const selectLockers = (state) => (
    fromLockers.selectLockers(state.lockers)
);

export const selectLockerStudentAssigns = (state) => (
    fromLockerStudentAssigns.selectLockerStudentAssigns(state.lockerStudentAssigns)
);

export const selectPaddlelocks = (state) => (
    fromPaddlelocks.selectPaddlelocks(state.paddlelocks)
);

export const selectPassFailRating = (state) => (
    fromPassFailRating.selectPassFailRating(state.passFailRating)
);

export const selectTestSettings = (state) => (
    fromTestSettings.selectTestSettings(state.testSettings)
);

export const selectTranscripts = (state) => (
    fromTranscripts.selectTranscripts(state.transcripts)
);

export const selectSchoolContacts = (state) => (
    fromSchoolContacts.selectSchoolContacts(state.schoolContacts)
);

export const selectCarContacts = (state) => (
    fromCarContacts.selectCarContacts(state.carContacts)
);

export const selectJefFeatures = (state) => (
    fromJefFeatures.selectJefFeatures(state.jefFeatures)
);

export const selectColleges = (state) => (
    fromColleges.selectColleges(state.colleges)
);

export const selectStudentDocuments = (state) => (
    fromStudentDocuments.selectStudentDocuments(state.studentDocuments)
);

export const selectMyFrequentPlaces = (state) => (
    fromMyFrequentPlaces.selectMyFrequentPlaces(state.myFrequentPlaces)
);

export const selectMyVisitedPages = (state) => (
    fromMyVisitedPages.selectMyVisitedPages(state.myVisitedPages)
);

export const selectPersonConfigCalendar = (state) => (
    fromPersonConfigCalendar.selectPersonConfigCalendar(state.personConfigCalendar, state.users && state.users.length > 0 && state.users.filter(m => m.userRole === 'Facilitator'), state.learners.wideList, state.courses.scheduled)
);

export const selectTutorialVideos = (state) => (
    fromTutorialVideos.selectTutorialVideos(state.tutorialVideos)
);

export const selectStudentBaseCourseRequests = (state) => (
    fromStudentBaseCourseRequests.selectStudentBaseCourseRequests(state.studentBaseCourseRequest)
);

export const selectCourseAssignByAdmins = (state) => (
    fromCourseAssignByAdmins.selectCourseAssignByAdmins(state.courseAssignByAdmins)
);

export const selectDistributedCourses = (state) => (
    fromDistributedCourses.selectDistributedCourses(state.distributedCourses)
);

export const selectAbsenceUnexcused = (state) => (
    fromAbsenceUnexcused.selectAbsenceUnexcused(state.absenceUnexcused)
);

export const selectDoctors = (state) => (
    fromDoctors.selectDoctors(state.doctors)
);

export const selectDoctorNoteInvites = (state) => (
    fromDoctorNoteInvites.selectDoctorNoteInvites(state.doctorNoteInvites)
);

export const selectDoctorNoteInviteId = (state) => (
    fromDoctorNoteInviteLogin.selectDoctorNoteInviteId(state.doctorNoteInviteId)
);

export const selectSchools = (state) => (
    fromSchools.selectSchools(state.schools)
);

export const selectDoctorNotes = (state) => (
    fromDoctorNotes.selectDoctorNotes(state.doctorNotes)
);

export const selectUsers = (state, userRole) => (
    fromUsers.selectUsers(state.users, userRole)
);

export const selectBenchmarkTests = (state) => (
    fromBenchmarkTests.selectBenchmarkTests(state.benchmarkTests)
);

export const selectStandards = (state) => (
    fromStandards.selectStandards(state.standards)
);

export const selectBenchmarkTestClassComparison = (state) => (
    fromBenchmarkTestClassComparison.selectBenchmarkTestClassComparison(state.benchmarkTestClassComparison)
);

export const selectBenchmarkTestStudentComparison = (state) => (
    fromBenchmarkTestStudentComparison.selectBenchmarkTestStudentComparison(state.benchmarkTestStudentComparison)
);

export const selectFinanceFeeTypes = (state) => (
		fromFinanceFeeTypes.selectFinanceFeeTypes(state.financeFeeTypes)
);

export const selectFinanceCreditTypes = (state) => (
		fromFinanceCreditTypes.selectFinanceCreditTypes(state.financeCreditTypes)
);

export const selectFinancePaymentTypes = (state) => (
		fromFinancePaymentTypes.selectFinancePaymentTypes(state.financePaymentTypes)
);

export const selectFinanceGroups = (state) => (
		fromFinanceGroups.selectFinanceGroups(state.financeGroups)
);

export const selectFinanceGLCodes = (state) => (
		fromFinanceGLCodes.selectFinanceGLCodes(state.financeGLCodes)
);

export const selectFinanceWaiverSchedules = (state) => (
		fromFinanceWaiverSchedule.selectFinanceWaiverSchedules(state.financeWaiverSchedules)
);

export const selectFinanceLowIncomeWaivers = (state) => (
		fromFinanceLowIncomeWaivers.selectFinanceLowIncomeWaivers(state.financeLowIncomeWaivers)
);

export const selectFinanceBillings = (state) => (
    fromFinanceBillings.selectFinanceBillings(state.financeBillings)
);

export const selectFinanceCredits = (state) => (
    fromFinanceCredits.selectFinanceCredits(state.financeCredits)
);

export const selectFinanceRefunds = (state) => (
    fromFinanceRefunds.selectFinanceRefunds(state.financeRefunds)
);

export const selectFinancePayments = (state) => (
    fromFinancePayments.selectFinancePayments(state.financePayments)
);

export const selectFinanceLunches = (state) => (
    fromFinanceLunches.selectFinanceLunches(state.financeLunches)
);

export const selectFinanceAccountSummaries = (state) => (
    fromFinanceAccountSummaries.selectFinanceAccountSummaries(state.financeAccountSummaries)
);

export const selectFinanceTransfers = (state) => (
    fromFinanceTransfers.selectFinanceTransfers(state.financeTransfers)
);

export const selectFinanceCourseFees = (state) => (
    fromFinanceCourseFees.selectFinanceCourseFees(state.financeCourseFees)
);

export const selectLunchReducedApply = (state) => (
    fromLunchReducedApply.selectLunchReducedApply(state.lunchReducedApply)
);

export const selectPickupLanes = (state) => (
    fromPickupLanes.selectPickupLanes(state.pickupLanes)
);

export const selectRegSelfServiceCourseCount = (state) => (
    fromRegSelfServceCourseCount.selectRegSelfServiceCourseCount(state.regSelfServceCourseCount)
);

export const selectStudentCourseAssigns = (state) => (
    fromStudentCourseAssigns.selectStudentCourseAssigns(state.studentCourseAssigns)
);

export const selectStudents = (state) => (
    fromStudents.selectStudents(state.students)
);

export const selectTheStudent = (state) => (
    fromTheStudent.selectTheStudent(state.theStudent)
);

export const selectPageLangs = (state) => (
    fromPageLangs.selectPageLangs(state.pageLangs)
);

export const selectStudentListByCourse = (state) => (
    fromStudentListByCourse.selectStudentListByCourse(state.studentListByCourse)
);

export const selectStudentChosenSession = (state) => (
    fromStudentChosenSession.selectStudentChosenSession(state.studentChosenSession)
);

export const selectGalleryList = (state) => (
    fromGalleryList.selectGalleryList(state.galleryList)
);

//Penspring files *******************************************************************
export const selectGenreList = (state) => fromGenreList.selectGenreList(state.genreList)
export const selectGroupTypes = (state) => fromGroupTypes.selectGroupTypes(state.groupTypes)
export const selectGroups = (state) => fromGroups.selectGroups(state.groups)
export const selectPeerGroup = (state) => fromPeerGroup.selectPeerGroup(state.peerGroup)
export const selectDeclineIdleList = (state) => fromDeclineIdleList.selectDeclineIdleList(state.declineIdleList)
export const selectColorsEditor = (state) => fromColorsEditor.selectColorsEditor(state.colorsEditor)
export const assignColorsEditor = (state) => fromColorsEditor.assignColorsEditor(state.colorsEditor, state.editReview.editDetails)
export const selectWorkStatusList = (state) => fromWorkStatusList.selectWorkStatusList(state.workStatusList)
export const selectEditSeverityList = (state) => fromEditSeverityList.selectEditSeverityList(state.editSeverityList)
export const selectEditorInviteName = (state) => fromEditorInviteName.selectEditorInviteName(state.editorInviteName)
export const selectEditorInvitePending = (state) => fromEditorInvitePending.selectEditorInvitePending(state.editorInvitePending)
export const selectEditorInviteGUIDResponse = (state) => fromEditorInviteResponse.selectEditorInviteGUIDResponse(state.editorInviteGUIDResponse)
export const selectEditorInviteWorkAssign = (state) => fromEditorInviteWorkAssign.selectEditorInviteWorkAssign(state.editorInviteWorkAssign)
export const selectWorks = (state) => fromWorks.selectWorks(state.works)
export const selectWorkEditReview = (state) => fromWorkEditReview.selectWorkEditReview(state.workEditReview)
export const selectWorksTreeData = (state) => fromWorksTreeData.selectWorksTreeData(state.worksTreeData)
export const selectChaptersList = (state) => fromChapters.selectChaptersList(state.chaptersList)
export const selectDraftSettings = (state) => fromDraftSettings.selectDraftSettings(state.draftSettings)
export const selectOpenCommunity = (state) => fromOpenCommunity.selectOpenCommunity(state.openCommunity)
export const selectContributorReport = (state) => fromContributorReport.selectContributorReport(state.contributorReport)
export const selectAccessReport = (state) => fromAccessReport.selectAccessReport(state.accessReport)
export const selectGroupWorkAssignAccess = (state) => fromGroupWorkAssignAccess.selectGroupWorkAssignAccess(state.groupWorkAssignAccess)
export const selectGroupEditReport = (state) => fromGroupEditReport.selectGroupEditReport(state.groupEditReport)
export const selectEditMicroReplace = (state) => fromEditMicroReplace.selectEditMicroReplace(state.editMicroReplace)
export const selectWorkSummary = (state, workId) => fromWorks.selectWorkSummary(state.works, workId, workId_current, me.personId);
export const selectWorkSummaryCurrent = (state) => fromWorks.selectWorkSummary(state.works, state.workId_current, state.workId_current, state.me.personId);
export const selectWorkFilter = (state) => fromWorkFilter.selectWorkFilter(state.workFilter)
export const selectContactFilter = (state) => fromContactFilter.selectContactFilter(state.contactFilter)
export const selectOpenCommunityFilter = (state) => fromOpenCommunityFilter.selectOpenCommunityFilter(state.openCommunityFilter)
export const selectReportFilter = (state) => fromReportFilter.selectReportFilter(state.reportFilter)
export const selectLeftSidePanelOpen = (state) => fromLeftSidePanel.selectLeftSidePanelOpen(state.leftSidePanelOpen)
export const selectWorkIdCurrent = (state) => fromWorkIdCurrent.selectWorkIdCurrent(state.workId_current)
export const selectGroupIdCurrent = (state) => state.groupId_current;
export const selectChapterIdCurrent = (state) => fromChapterIdCurrent.selectChapterIdCurrent(state.chapterId_current)
export const selectLanguageIdCurrent = (state) => fromLanguageIdCurrent.selectLanguageIdCurrent(state.languageId_current)
export const selectPersonIdCurrent = (state) => fromPersonIdCurrent.selectPersonIdCurrent(state.personId_current || 0)
export const selectTranslations = (state) => fromTranslations.selectTranslations(state.translations)
export const selectContacts = (state) => fromContacts.selectContacts(state.contacts)
export const selectTextProcessingProgress = (state) => fromTextProcessingProgress.selectTextProcessingProgress(state.textProcessingProgress)
export const selectEditReview = (state, personId, authorPersonId, workLanguageId) => fromEditReview.selectEditReview(state.editReview, personId, authorPersonId, workLanguageId, state.languageId_current);
export const selectEditDetails = (state) => fromEditDetails.selectEditDetails(state.editDetails);
export const selectChapterText = (state) => fromEditReview.selectChapterTextOriginal(state.editReview)
export const selectMyWorksFileTreeExplorer = (state) => fromMyWorksFileTreeExplorer.selectMyWorksFileTreeExplorer(state.myWorksFileTreeExplorer);
export const selectLandingSteps = (state) => fromLandingSteps.selectLandingSteps(state.landingSteps)
export const selectProxynizationTempPassword = (state) => fromProxynizationTempPassword.selectProxynizationTempPassword(state.proxynizationTempPassword)

// do I have state in localstorage if so set it
const initialState = isBrowser
  ? window.__INITIAL_STATE__ || {}
  : {};


const reduxMiddleware = compose(
    applyMiddleware(thunk),
    isBrowser && ALLOW_REDUX_DEV_TOOLS==="1" && typeof window.devToolsExtension !== "undefined"
      ? window.devToolsExtension()
      : f => f
);

// export a store creator factory with initial state if present...
export default () => createStore( rootReducer, initialState, reduxMiddleware );
