/**
 * routes.tsx — React Router v6
 *
 * Migration from React Router v3:
 *  - `component={X}` → `element={<X />}`
 *  - `<IndexRoute>` → `<Route index element={<X />} />`
 *  - Route nesting uses `<Outlet />` inside parent components
 *  - Base path moved to `<BrowserRouter basename={APP_WEB_BASE_PATH}>` in _client.tsx
 *  - Authentication guard uses a layout route (<EnsureLoggedIn> renders <Outlet />)
 */

import { Routes, Route } from 'react-router-dom';

// Layouts / shells
import App from './containers/app';
import EnsureLoggedIn from './containers/ensure-logged-in';
import NotFound from './containers/not-found';

// Public pages
import Login from './containers/landing';
import Landing from './containers/landing';
import PrivacyPolicy from './containers/privacy-policy';
import InitStudentLogin from './containers/init-student-login';
import ForgotPassword from './containers/password-forgot';
import ResetPassword from './containers/password-reset';
import CreateNewSchool from './containers/create-new-school';
import Logout from './containers/logout';
import RegistrationNew from './containers/registration';
import DoctorInviteLogin from './containers/doctor-invite-login';

/* ── Penspring routes ──────────────────────────────────────────────── */
import EditReview from './containers/edit-review';
import WorkSettings from './containers/work-settings';
import MyWorks from './containers/my-works';
import MyContacts from './containers/my-contacts';
import GiveAccessToEditors from './containers/give-access-to-editors';
import GiveAccessToWorks from './containers/give-access-to-works';
import WorkAddNew from './containers/work-add-new';
import WorkUploadFile from './containers/work-upload-file';
import WorkNewAfterNav from './containers/work-new-after-nav';
import ChapterUploadFile from './containers/chapter-upload-file';
import WorkDownload from './containers/work-download';
import DraftSettings from './containers/draft-settings';
import EditorInviteNameEmail from './containers/editor-invite-name';
import EditorInviteWorkAssign from './containers/editor-invite-work';
import WorkSections from './containers/work-sections';
import AddOrUpdateChapter from './containers/chapter-add-update';
import MergeChapters from './containers/chapter-merge';
import SplitChapter from './containers/chapter-splitter';
import OpenCommunity from './containers/open-community';
import ContributorReport from './containers/contributor-report';
import GroupTypeChoice from './containers/group-type-choice';
import GroupAddNew from './containers/group-add-new';
import GroupSettings from './containers/group-settings';
import MyGroups from './containers/my-groups';
import PeerGroupAddOrUpdate from './containers/peer-group-add-update';
import GroupWorkAssign from './containers/group-work-assign';
import GroupMemberAdd from './containers/group-member-add';
import GroupMemberUpdate from './containers/group-member-update';
import AccessReport from './containers/access-report';
import GroupEditReport from './containers/group-edit-report';
import MyGroupsReport from './containers/my-groups-report';
import AssignmentDashboard from './containers/assignment-dashboard';
import GalleryList from './containers/gallery-list';
import GalleryAdd from './containers/gallery-add';

/* ── LearnerSphere routes ──────────────────────────────────────────── */
import LearnerAdd from './containers/learner-add';
import UserAdd from './containers/user-add';
import LearnerOutcomeAdd from './containers/learner-outcome-add';
import CourseEntry from './containers/course-entry';
import CourseToSchedule from './containers/course-to-schedule';
import LearnerCourseAssign from './containers/learner-course-assign';
import CalendarEventAdd from './containers/calendar-event-add';
import AssessmentQuestions from './containers/assessment-questions';
import AssessmentLearner from './containers/assessment-learner';
import LearnerSearch from './containers/learner-search';
import MentorsNotAssigned from './containers/mentor-not-assigned';
import MentorsReassign from './containers/mentor-reassign';
import FacilitatorMentorSet from './containers/facilitator-mentor-set';
import MessagesAndReminders from './containers/messages-reminders';
import CalendarAndEvents from './containers/calendar-events';
import ScheduleAssignByMath from './containers/schedule-assign-by-math';
import CourseAttendance from './containers/course-attendance';
import CourseAttendanceAdmin from './containers/course-attendance-admin';
import CourseAttendanceSingle from './containers/course-attendance-single';
import GradebookEntry from './containers/gradebook-entry';
import GradebookSummary from './containers/gradebook-summary';
import RatingBook from './containers/rating-book';
import AssessmentCorrect from './containers/assessment-correct';
import AssessmentPendingEssay from './containers/assessment-pending-essay';
import AssignmentsPendingReview from './containers/assignments-pending-review';
import AnnouncementEdit from './containers/announcement-edit';
import AnnouncementManage from './containers/announcement-manage';
import MentorSummaryEdit from './containers/mentor-summary-edit';
import BaseCourses from './containers/base-courses';
import ScheduledCourses from './containers/scheduled-courses';
import RegInstructions from './containers/reg-instructions';
import RegPoliciesAcademy from './containers/reg-policies-academy';
import RegPoliciesElementary from './containers/reg-policies-elementary';
import RegGuardiansContacts from './containers/reg-guardian-contact';
import RegStudents from './containers/reg-student';
import RegBillingPreference from './containers/reg-billing-preference';
import RegBillingPreference_simple from './containers/reg-billing-preference-simple';
import StudentSchedule from './containers/student-schedule';
import StudentScheduleWeek from './containers/student-schedule-week';
import GradeReport from './containers/grade-report';
import StudentProfile from './containers/student-profile';
import DiscussionClass from './containers/discussion-entries';
import AssignmentList from './containers/assignment-list';
import AssignmentEntry from './containers/assignment-entry';
import StudentAssignments from './containers/student-assignments';
import StudentCourseAssign from './containers/student-course-assign';
import OpenRegistration from './containers/open-registrations';
import AlertCourseSchedule from './containers/alerts-course';
import CourseNewRequested from './containers/course-new-requested';
import CourseWeightedScore from './containers/course-weighted-score';
import AttendanceReport from './containers/attendance-report';
import ReportRecommendCourse from './containers/report-recommend-course';
import RegistrationPending from './containers/registration-pending';
import ReportStudentRegistration from './containers/report-student-registration';
import StudentScheduleFinalize from './containers/student-schedule-finalize';
import ClassPeriodsSettings from './containers/class-periods';
import LearningPathwaysSettings from './containers/learning-pathways';
import IntervalsSettings from './containers/semester-intervals';
import GradeScaleSettings from './containers/grade-scale';
import StandardsRatingSettings from './containers/standards-rating';
import ContentTypesSettings from './containers/content-types';
import CourseTypesSettings from './containers/course-types';
import StudentAddOptions from './containers/student-add-options';
import StudentAddManual from './containers/student-add-manual';
import StudentAddBulk from './containers/student-add-bulk';
import StudentAddBulkConfirm from './containers/student-add-bulk-confirm';
import StudentAssignmentAssign from './containers/student-assignment-assign';
import TeacherSchedule from './containers/teacher-schedule';
import SchoolDays from './containers/school-days';
import PassFailRating from './containers/pass-fail-rating';
import NewSchoolCheckList from './containers/new-school-check-list';
import CarpoolAreas from './containers/carpool-areas';
import Carpool from './containers/carpool';
import CurbsideCheckInOrOut from './containers/curbside-check-in-out';
import CurbsideAdminCheckInOrOut from './containers/curbside-admin-check-in-out';
import SchoolSettings from './containers/school-settings';
import BuildingAndFieldSettings from './containers/building-and-field-settings';
import BuildingAndFieldFrequentMine from './containers/building-and-field-frequent-mine';
import SafetyAlertAdd from './containers/safety-alert-add';
import SafetyAdminAlerts from './containers/safety-admin-alerts';
import VolunteerCheckInOut from './containers/volunteer-check-in-out';
import VolunteerHours from './containers/volunteer-hours';
import VolunteerOpportunityAdd from './containers/volunteer-opportunity-add';
import VolunteerOpportunities from './containers/volunteer-opportunities';
import AttendanceSchool from './containers/attendance-school';
import LunchMenuOptionSetup from './containers/lunch-menu-options';
import LunchMenuMonth from './containers/lunch-menu-month';
import LunchMenuStudentsDay from './containers/lunch-menu-student-day';
import SystemFeatures from './containers/system-features';
import BehaviorIncidentList from './containers/behavior-incident-list';
import BehaviorIncidentAdd from './containers/behavior-incident-add';
import BehaviorIncidentReport from './containers/behavior-incident-report';
import FinanceBillingAdd from './containers/finance-billing-add';
import VolunteerTypes from './containers/volunteer-types';
import BehaviorIncidentTypes from './containers/behavior-incident-types';
import LockerSettings from './containers/locker-settings';
import PaddleLockSettings from './containers/paddle-lock-settings';
import LockerAssignments from './containers/locker-assignments';
import AssignLocker from './containers/assign-locker';
import AssessmentCorrectSameAll from './containers/assessment-correct-same-all-students';
import AssessmentCorrectSummary from './containers/assessment-correct-summary';
import TestSettings from './containers/test-settings';
import TestComponentSettings from './containers/test-component-settings';
import TestComponentAssign from './containers/test-component-assign';
import TestScoreAdd from './containers/test-score-add';
import Transcripts from './containers/transcripts-view';
import TranscriptAdd from './containers/transcript-add';
import TranscriptTestAdd from './containers/transcript-test-add';
import SchoolContactManager from './containers/school-contact-manager';
import CarContactManager from './containers/car-contact-manager';
import TutorialVideo from './containers/tutorial-videos';
import ReimbursementRequestAdd from './containers/reimbursement-request-add';
import ReportWaitList from './containers/course-wait-list';
import GeoLocation from './containers/geolocation';
import StudentBaseCourseRequest from './containers/student-base-course-request';
import CourseAssignByAdminAdd from './containers/course-assign-by-admin-add';
import CourseAssignByAdminList from './containers/course-assign-by-admin-list';
import DistributedCourses from './containers/distributed-courses';
import ProfileResetPassword from './containers/profile-reset-password';
import PasswordResetAdmin from './containers/password-reset-admin';
import AbsenceUnexcused from './containers/absence-unexcused';
import DoctorNoteInvite from './containers/doctor-note-invite';
import DoctorNoteAdd from './containers/doctor-note-add';
import DoctorNotes from './containers/doctor-note-list';
import DoctorNoteInviteList from './containers/doctor-note-invite-list';
import BenchmarkTestList from './containers/benchmark-test-list';
import BenchmarkTestClassComparison from './containers/benchmark-test-class-comparison';
import BenchmarkTestStudentComparison from './containers/benchmark-test-student-comparison';
import FinanceFeeTypes from './containers/finance-fee-types';
import FinanceCreditTypes from './containers/finance-credit-types';
import FinanceGroups from './containers/finance-groups';
import FinanceGLCodes from './containers/finance-gl-codes';
import FinanceWaiverSchedule from './containers/finance-waiver-schedule';
import FinanceLowIncomeWaivers from './containers/finance-low-income-waivers';
import FinanceBillingList from './containers/finance-billing-list';
import FinanceCreditAdd from './containers/finance-credit-add';
import FinanceCreditList from './containers/finance-credit-list';
import FinanceRefundAdd from './containers/finance-refund-add';
import FinanceRefundList from './containers/finance-refund-list';
import FinancePaymentAdd from './containers/finance-payment-add';
import FinancePaymentList from './containers/finance-payment-list';
import FinancePaymentReceipt from './containers/finance-payment-receipt';
import FinanceLunchList from './containers/finance-lunch-list';
import FinanceTransferAdd from './containers/finance-transfer-add';
import FinanceTransferList from './containers/finance-transfer-list';
import FinanceAccountList from './containers/finance-account-list';
import FinanceCourseFeeAdd from './containers/finance-course-fee-add';
import LunchReducedInstructions from './containers/lunch-reduced-instructions';
import LunchReducedApply from './containers/lunch-reduced-apply';
import PickupLaneSettings from './containers/pickup-lane-settings';
import RegSelfServiceCourseCount from './containers/reg-self-service-course-count';
import FirstNav from './containers/first-nav';
import MyProfile from './containers/my-profile';

/* ─────────────────────────────────────────────────────────────────────
   AppRoutes

   NOTE for container authors:
   • URL params (previously this.props.params.xxx) are now accessed via
     the useParams() hook or via the withRouter() HOC in
     src/app/hocs/withRouter.tsx.
   • Programmatic navigation (previously this.props.router.push('/path'))
     is now this.props.navigate('/path') when using the withRouter HOC,
     or the useNavigate() hook in functional components.
   ──────────────────────────────────────────────────────────────────── */
const AppRoutes = () => (
  <Routes>
    {/* ── Root shell ─────────────────────────────────────────────── */}
    <Route element={<App />}>

      {/* ── Public routes ─────────────────────────────────────── */}
      <Route index element={<Login />} />
      <Route path="landing" element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="login/:createNew" element={<Login />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="createNewSchool" element={<CreateNewSchool />} />
      <Route path="newLogin/:newLoginPersonId" element={<Login />} />
      <Route path="initStudentLogin/:personId/:username" element={<InitStudentLogin />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />
      <Route path="forgotPassword/:salta" element={<ForgotPassword />} />
      <Route path="resetPassword/:resetCode/:emailAddress" element={<ResetPassword />} />
      <Route path="regLogin/:schoolCode" element={<RegistrationNew />} />
      <Route path="reg/:schoolRegistrationCode" element={<RegistrationNew />} />
      <Route path="doctor/:doctorNoteInviteId" element={<DoctorInviteLogin />} />
      <Route path="logout" element={<Logout />} />

      {/* ── Authenticated routes (EnsureLoggedIn renders <Outlet />) ── */}
      <Route element={<EnsureLoggedIn />}>
        <Route path="profileResetPassword/:personId" element={<ProfileResetPassword />} />
        <Route path="profileResetPassword/:personId/:name" element={<ProfileResetPassword />} />
        <Route path="passwordResetAdmin" element={<PasswordResetAdmin />} />
        <Route path="myProfile" element={<MyProfile />} />

        {/* Learner admin */}
        <Route path="learnerAdd" element={<LearnerAdd />} />
        <Route path="learnerAdd/:studentPersonId" element={<LearnerAdd />} />
        <Route path="userAdd/:userRole" element={<UserAdd />} />
        <Route path="userAdd/:userRole/:userPersonId" element={<UserAdd />} />
        <Route path="learnerOutcomeAdd" element={<LearnerOutcomeAdd />} />

        {/* Courses */}
        <Route path="courseEntry" element={<CourseEntry />} />
        <Route path="courseEntry/:courseEntryId" element={<CourseEntry />} />
        <Route path="courseToSchedule" element={<CourseToSchedule />} />
        <Route path="courseToSchedule/:courseEntryId" element={<CourseToSchedule />} />
        <Route path="courseToSchedule/:newOrEdit/:id" element={<CourseToSchedule />} />
        <Route path="learnerCourseAssign" element={<LearnerCourseAssign />} />
        <Route path="learnerCourseAssign/set/course/:courseScheduledId" element={<LearnerCourseAssign />} />
        <Route path="learnerCourseAssign/:studentPersonId" element={<LearnerCourseAssign />} />
        <Route path="learnerCourseAssign/:personal/:timeTarget" element={<LearnerCourseAssign />} />

        {/* Calendar */}
        <Route path="calendarEventAdd" element={<CalendarEventAdd />} />
        <Route path="calendarEventAdd/:scheduleDate/:fromDate/:toDate" element={<CalendarEventAdd />} />
        <Route path="calendarAndEvents" element={<CalendarAndEvents />} />

        {/* Navigation */}
        <Route path="learnerSearch" element={<LearnerSearch />} />
        <Route path="mentorsNotAssigned" element={<MentorsNotAssigned />} />
        <Route path="mentorsReassign" element={<MentorsReassign />} />
        <Route path="facilitatorMentorSet" element={<FacilitatorMentorSet />} />
        <Route path="messagesAndReminders" element={<MessagesAndReminders />} />
        <Route path="forceFirstNav" element={<FirstNav />} />
        <Route path="firstNav" element={<FirstNav />} />
        <Route path="firstNav/:schoolYearId" element={<FirstNav />} />

        {/* Assessment */}
        <Route path="assessmentQuestions" element={<AssessmentQuestions />} />
        <Route path="assessmentQuestions/:assessmentId" element={<AssessmentQuestions />} />
        <Route path="assessmentQuestions/:assessmentId/:benchmarkTestId" element={<AssessmentQuestions />} />
        <Route path="scheduleAssignByMath" element={<ScheduleAssignByMath />} />
        <Route path="assessmentLearner/:assignmentId/:assessmentId" element={<AssessmentLearner />} />
        <Route path="assessmentLearner/:assignmentId/:assessmentId/:isRetakeQuiz" element={<AssessmentLearner />} />
        <Route path="assessmentLearner/:assignmentId/:assessmentId/:isRetakeQuiz/:courseScheduledId" element={<AssessmentLearner />} />
        <Route path="assessmentLearner/:assignmentId/:assessmentId/:isRetakeQuiz/:courseScheduledId/:benchmarkTestId" element={<AssessmentLearner />} />
        <Route path="assessmentCorrect/:assignmentId/:assessmentId/:studentPersonId" element={<AssessmentCorrect />} />
        <Route path="assessmentCorrect/:assignmentId/:assessmentId/:studentPersonId/:courseScheduledId" element={<AssessmentCorrect />} />
        <Route path="assessmentCorrect/:assignmentId/:assessmentId/:studentPersonId/:courseScheduledId/:benchmarkTestId" element={<AssessmentCorrect />} />
        <Route path="assessmentPendingEssay" element={<AssessmentPendingEssay />} />
        <Route path="assessmentCorrectSameAll/:assignmentId/:assessmentId" element={<AssessmentCorrectSameAll />} />
        <Route path="assessmentCorrectSameAll/:assignmentId/:assessmentId/:assessmentQuestionId" element={<AssessmentCorrectSameAll />} />
        <Route path="assessmentCorrectSummary/:assignmentId/:assessmentId" element={<AssessmentCorrectSummary />} />

        {/* Attendance */}
        <Route path="courseAttendance" element={<CourseAttendance />} />
        <Route path="courseAttendance/:courseScheduledId" element={<CourseAttendance />} />
        <Route path="courseAttendanceAdmin" element={<CourseAttendanceAdmin />} />
        <Route path="courseAttendanceSingle" element={<CourseAttendanceSingle />} />
        <Route path="courseAttendanceSingle/:studentPersonId" element={<CourseAttendanceSingle />} />
        <Route path="attendanceReport/:studentPersonId/:intervalId" element={<AttendanceReport />} />
        <Route path="attendanceSchool" element={<AttendanceSchool />} />

        {/* Gradebook */}
        <Route path="gradebookEntry" element={<GradebookEntry />} />
        <Route path="gradebookEntry/:courseScheduledId" element={<GradebookEntry />} />
        <Route path="gradebookEntry/:courseScheduledId/:studentPersonId" element={<GradebookEntry />} />
        <Route path="gradebookEntry/:courseScheduledId/:studentPersonId/contentType/:contentTypeId" element={<GradebookEntry />} />
        <Route path="gradebookSummary" element={<GradebookSummary />} />
        <Route path="gradebookSummary/:courseScheduledId" element={<GradebookSummary />} />
        <Route path="ratingBook" element={<RatingBook />} />
        <Route path="ratingBook/:studentPersonId" element={<RatingBook />} />

        {/* Assignments */}
        <Route path="assignmentsPendingReview" element={<AssignmentsPendingReview />} />
        <Route path="assignmentList/:courseEntryId" element={<AssignmentList />} />
        <Route path="assignmentList/:courseEntryId/:intervalId" element={<AssignmentList />} />
        <Route path="assignmentList/:courseEntryId/assignmentId/:assignmentId" element={<AssignmentList />} />
        <Route path="assignmentEntry/:courseEntryId" element={<AssignmentEntry />} />
        <Route path="assignmentEntry/:courseEntryId/:assignmentId" element={<AssignmentEntry />} />
        <Route path="assignmentEntry/:courseEntryId/:assignmentId/:insertSequence" element={<AssignmentEntry />} />
        <Route path="studentAssignments/:courseScheduledId" element={<StudentAssignments />} />
        <Route path="studentAssignments/:courseScheduledId/:studentPersonId" element={<StudentAssignments />} />
        <Route path="studentAssignments/:courseScheduledId/:studentPersonId/:chosenAssignmentId" element={<StudentAssignments />} />
        <Route path="studentAssignmentAssign" element={<StudentAssignmentAssign />} />
        <Route path="studentAssignmentAssign/:courseScheduledId" element={<StudentAssignmentAssign />} />
        <Route path="studentAssignmentAssign/:courseScheduledId/:studentPersonId" element={<StudentAssignmentAssign />} />
        <Route path="studentAssignmentAssign/:courseScheduledId/:studentPersonId/contentType/:contentTypeId" element={<StudentAssignmentAssign />} />

        {/* Announcements */}
        <Route path="announcementEdit" element={<AnnouncementEdit />} />
        <Route path="announcementEdit/:editType/:announcementId" element={<AnnouncementEdit />} />
        <Route path="announcementEdit/:editType/:announcementId/:fromPersonId/:fromFirstName/:fromLastName" element={<AnnouncementEdit />} />
        <Route path="announcementEdit/:editType/:carpoolRequestId/:toPersonId/:toPersonName" element={<AnnouncementEdit />} />
        <Route path="announcementManage" element={<AnnouncementManage />} />

        {/* Courses – base & scheduled */}
        <Route path="baseCourses" element={<BaseCourses />} />
        <Route path="scheduledCourses" element={<ScheduledCourses />} />
        <Route path="scheduledCourses/:courseScheduledId" element={<ScheduledCourses />} />
        <Route path="courseNewRequested" element={<CourseNewRequested />} />
        <Route path="courseWeightedScore/:courseEntryId" element={<CourseWeightedScore />} />
        <Route path="courseAssignByAdminAdd" element={<CourseAssignByAdminAdd />} />
        <Route path="courseAssignByAdminList" element={<CourseAssignByAdminList />} />
        <Route path="distributedCourses" element={<DistributedCourses />} />
        <Route path="studentCourseAssign" element={<StudentCourseAssign />} />
        <Route path="studentCourseAssign/:studentPersonId" element={<StudentCourseAssign />} />

        {/* Mentor */}
        <Route path="mentorSummaryEdit" element={<MentorSummaryEdit />} />

        {/* Registration */}
        <Route path="regInstructions" element={<RegInstructions />} />
        <Route path="regGuardianContact/:contactPersonId/:personType" element={<RegGuardiansContacts />} />
        <Route path="regGuardianContact/:contactPersonId/:personType/:schoolYearId" element={<RegGuardiansContacts />} />
        <Route path="regStudent/:studentPersonId" element={<RegStudents />} />
        <Route path="regStudent/:studentPersonId/:pickUpLast" element={<RegStudents />} />
        <Route path="regStudent/:studentPersonId/schoolYear/:schoolYearId" element={<RegStudents />} />
        <Route path="regPoliciesAcademy" element={<RegPoliciesAcademy />} />
        <Route path="regPoliciesElementary" element={<RegPoliciesElementary />} />
        <Route path="regBillingPreference/:schoolYearId" element={<RegBillingPreference />} />
        <Route path="regBillingPreference_simple" element={<RegBillingPreference_simple />} />
        <Route path="registrationPending" element={<RegistrationPending />} />
        <Route path="openRegistration" element={<OpenRegistration />} />
        <Route path="openRegistration/:openRegistrationTableId" element={<OpenRegistration />} />
        <Route path="regSelfServiceCourseCount" element={<RegSelfServiceCourseCount />} />

        {/* Student schedules */}
        <Route path="studentSchedule" element={<StudentSchedule />} />
        <Route path="studentSchedule/:studentPersonId" element={<StudentSchedule />} />
        <Route path="studentScheduleWeek" element={<StudentScheduleWeek />} />
        <Route path="studentScheduleWeek/:studentPersonId" element={<StudentScheduleWeek />} />
        <Route path="studentScheduleFinalize" element={<StudentScheduleFinalize />} />
        <Route path="studentScheduleFinalize/:studentPersonId" element={<StudentScheduleFinalize />} />
        <Route path="teacherSchedule" element={<TeacherSchedule />} />
        <Route path="teacherSchedule/:facilitatorPersonId" element={<TeacherSchedule />} />

        {/* Grade / profile */}
        <Route path="gradeReport" element={<GradeReport />} />
        <Route path="gradeReport/:studentPersonId" element={<GradeReport />} />
        <Route path="studentProfile/:studentPersonId" element={<StudentProfile />} />
        <Route path="studentProfile/:studentPersonId/:schoolYearId" element={<StudentProfile />} />
        <Route path="studentBaseCourseRequest/:studentPersonId" element={<StudentBaseCourseRequest />} />

        {/* Discussion */}
        <Route path="discussionClass/:courseEntryId" element={<DiscussionClass />} />
        <Route path="discussionClass/:courseEntryId/:discussionEntryId" element={<DiscussionClass />} />

        {/* Alerts */}
        <Route path="alertCourseSchedule/:courseScheduledId" element={<AlertCourseSchedule />} />
        <Route path="alertCourseSchedule/:courseScheduledId/:alertWhenId" element={<AlertCourseSchedule />} />

        {/* Reports */}
        <Route path="reportRecommendCourse" element={<ReportRecommendCourse />} />
        <Route path="reportStudentRegistration" element={<ReportStudentRegistration />} />
        <Route path="reportWaitList" element={<ReportWaitList />} />

        {/* Settings */}
        <Route path="classPeriods" element={<ClassPeriodsSettings />} />
        <Route path="learningPathways" element={<LearningPathwaysSettings />} />
        <Route path="intervals" element={<IntervalsSettings />} />
        <Route path="gradeScale" element={<GradeScaleSettings />} />
        <Route path="standardsRating" element={<StandardsRatingSettings />} />
        <Route path="contentTypes" element={<ContentTypesSettings />} />
        <Route path="courseTypes" element={<CourseTypesSettings />} />
        <Route path="schoolSettings" element={<SchoolSettings />} />
        <Route path="schoolDays" element={<SchoolDays />} />
        <Route path="schoolContactManager" element={<SchoolContactManager />} />
        <Route path="buildingAndFieldSettings" element={<BuildingAndFieldSettings />} />
        <Route path="buildingAndFieldFrequentMine" element={<BuildingAndFieldFrequentMine />} />
        <Route path="passFailRating" element={<PassFailRating />} />
        <Route path="newSchoolCheckList" element={<NewSchoolCheckList />} />
        <Route path="systemFeatures" element={<SystemFeatures />} />
        <Route path="pickupLaneSettings" element={<PickupLaneSettings />} />

        {/* Student add */}
        <Route path="studentAddOptions" element={<StudentAddOptions />} />
        <Route path="studentAddManual" element={<StudentAddManual />} />
        <Route path="studentAddManual/:studentPersonId" element={<StudentAddManual />} />
        <Route path="studentAddBulk" element={<StudentAddBulk />} />
        <Route path="studentAddBulkConfirm" element={<StudentAddBulkConfirm />} />

        {/* Carpool */}
        <Route path="carpoolAreas" element={<CarpoolAreas />} />
        <Route path="carpool" element={<Carpool />} />
        <Route path="carContactManager" element={<CarContactManager />} />
        <Route path="curbside" element={<CurbsideCheckInOrOut />} />
        <Route path="curbsideAdmin" element={<CurbsideAdminCheckInOrOut />} />

        {/* Safety */}
        <Route path="safetyAlertAdd" element={<SafetyAlertAdd />} />
        <Route path="safetyAdminAlerts" element={<SafetyAdminAlerts />} />

        {/* Volunteer */}
        <Route path="volunteerCheckInOut" element={<VolunteerCheckInOut />} />
        <Route path="volunteerCheckInOut/:volunteerEventId" element={<VolunteerCheckInOut />} />
        <Route path="volunteerHours" element={<VolunteerHours />} />
        <Route path="volunteerOpportunityAdd" element={<VolunteerOpportunityAdd />} />
        <Route path="volunteerOpportunities" element={<VolunteerOpportunities />} />
        <Route path="volunteerTypes" element={<VolunteerTypes />} />

        {/* Lunch */}
        <Route path="lunchMenuOptionSetup" element={<LunchMenuOptionSetup />} />
        <Route path="lunchMenuMonth" element={<LunchMenuMonth />} />
        <Route path="lunchMenuStudentsDay" element={<LunchMenuStudentsDay />} />
        <Route path="lunchReducedInstructions" element={<LunchReducedInstructions />} />
        <Route path="lunchReducedApply" element={<LunchReducedApply />} />

        {/* Behavior */}
        <Route path="behaviorIncidentList" element={<BehaviorIncidentList />} />
        <Route path="behaviorIncidentAdd" element={<BehaviorIncidentAdd />} />
        <Route path="behaviorIncidentAdd/:behaviorIncidentId" element={<BehaviorIncidentAdd />} />
        <Route path="behaviorIncidentTypes" element={<BehaviorIncidentTypes />} />
        <Route path="behaviorIncidentReport" element={<BehaviorIncidentReport />} />

        {/* Finance */}
        <Route path="financeBillingAdd" element={<FinanceBillingAdd />} />
        <Route path="financeBillingAdd/:financeBillingId" element={<FinanceBillingAdd />} />
        <Route path="financeBillingAdd/paid/:billingPaidId" element={<FinanceBillingAdd />} />
        <Route path="financeBillingAdd/lunch/:addLunchBilling" element={<FinanceBillingAdd />} />
        <Route path="financeBillingAdd/person/:paramPersonId" element={<FinanceBillingAdd />} />
        <Route path="financeBillingAdd/lunch/:addLunchBilling/person/:paramPersonId" element={<FinanceBillingAdd />} />
        <Route path="financeBillingList" element={<FinanceBillingList />} />
        <Route path="financeBillingList/person/:paramPersonId" element={<FinanceBillingList />} />
        <Route path="financeBillingList/:onlyBillingDue" element={<FinanceBillingList />} />
        <Route path="financeFeeTypes" element={<FinanceFeeTypes />} />
        <Route path="financeCreditTypes" element={<FinanceCreditTypes />} />
        <Route path="financeGroups" element={<FinanceGroups />} />
        <Route path="financeGLCodes" element={<FinanceGLCodes />} />
        <Route path="financeWaiverSchedule" element={<FinanceWaiverSchedule />} />
        <Route path="financeLowIncomeWaivers" element={<FinanceLowIncomeWaivers />} />
        <Route path="financeCreditAdd" element={<FinanceCreditAdd />} />
        <Route path="financeCreditAdd/:financeCreditTransactionId" element={<FinanceCreditAdd />} />
        <Route path="financeCreditAdd/person/:paramPersonId" element={<FinanceCreditAdd />} />
        <Route path="financeCreditList" element={<FinanceCreditList />} />
        <Route path="financeCreditList/person/:paramPersonId" element={<FinanceCreditList />} />
        <Route path="financeRefundAdd" element={<FinanceRefundAdd />} />
        <Route path="financeRefundAdd/person/:paramPersonId" element={<FinanceRefundAdd />} />
        <Route path="financeRefundList" element={<FinanceRefundList />} />
        <Route path="financeRefundList/person/:paramPersonId" element={<FinanceRefundList />} />
        <Route path="financePaymentAdd" element={<FinancePaymentAdd />} />
        <Route path="financePaymentAdd/person/:paramPersonId" element={<FinancePaymentAdd />} />
        <Route path="financePaymentAdd/lunch/:addNewLunchPayment" element={<FinancePaymentAdd />} />
        <Route path="financePaymentAdd/lunch/:addNewLunchPayment/person/:paramPersonId" element={<FinancePaymentAdd />} />
        <Route path="financePaymentList" element={<FinancePaymentList />} />
        <Route path="financePaymentList/person/:paramPersonId" element={<FinancePaymentList />} />
        <Route path="financePaymentReceipt" element={<FinancePaymentReceipt />} />
        <Route path="financePaymentReceipt/:financePaymentTableId" element={<FinancePaymentReceipt />} />
        <Route path="financeLunchList" element={<FinanceLunchList />} />
        <Route path="financeLunchList/person/:paramPersonId" element={<FinanceLunchList />} />
        <Route path="financeTransferAdd" element={<FinanceTransferAdd />} />
        <Route path="financeTransferAdd/new/person/:paramPersonId" element={<FinanceTransferAdd />} />
        <Route path="financeTransferAdd/:fromPersonId/:toPersonId" element={<FinanceTransferAdd />} />
        <Route path="financeTransferList" element={<FinanceTransferList />} />
        <Route path="financeTransferList/person/:paramPersonId" element={<FinanceTransferList />} />
        <Route path="financeAccountList" element={<FinanceAccountList />} />
        <Route path="financeCreditFeeAdd" element={<FinanceCourseFeeAdd />} />

        {/* Lockers */}
        <Route path="lockerAssignments" element={<LockerAssignments />} />
        <Route path="lockerSettings" element={<LockerSettings />} />
        <Route path="paddleLockSettings" element={<PaddleLockSettings />} />
        <Route path="assignLocker" element={<AssignLocker />} />
        <Route path="assignLocker/:lockerStudentAssignId" element={<AssignLocker />} />

        {/* Tests / transcripts */}
        <Route path="testSettings" element={<TestSettings />} />
        <Route path="testComponentSettings" element={<TestComponentSettings />} />
        <Route path="testComponentAssign" element={<TestComponentAssign />} />
        <Route path="testScoreAdd" element={<TestScoreAdd />} />
        <Route path="transcripts" element={<Transcripts />} />
        <Route path="transcripts/:studentPersonId" element={<Transcripts />} />
        <Route path="transcriptAdd" element={<TranscriptAdd />} />
        <Route path="transcriptAdd/:studentPersonId" element={<TranscriptAdd />} />
        <Route path="transcriptTestAdd" element={<TranscriptTestAdd />} />
        <Route path="transcriptTestAdd/:studentPersonId" element={<TranscriptTestAdd />} />
        <Route path="benchmarkTestList" element={<BenchmarkTestList />} />
        <Route path="benchmarkTestClassComparison" element={<BenchmarkTestClassComparison />} />
        <Route path="benchmarkTestClassComparison/:benchmarkTestId" element={<BenchmarkTestClassComparison />} />
        <Route path="benchmarkTestStudentComparison" element={<BenchmarkTestStudentComparison />} />
        <Route path="benchmarkTestStudentComparison/:benchmarkTestId" element={<BenchmarkTestStudentComparison />} />

        {/* Doctor notes */}
        <Route path="doctorNoteInvite" element={<DoctorNoteInvite />} />
        <Route path="doctorNoteAdd" element={<DoctorNoteAdd />} />
        <Route path="doctorNoteAdd/:doctorNoteInviteId" element={<DoctorNoteAdd />} />
        <Route path="doctorNotes" element={<DoctorNotes />} />
        <Route path="doctorNoteInviteList" element={<DoctorNoteInviteList />} />

        {/* Other */}
        <Route path="absenceUnexcused" element={<AbsenceUnexcused />} />
        <Route path="absenceUnexcused/:pendingApproval" element={<AbsenceUnexcused />} />
        <Route path="reimbursementRequestAdd" element={<ReimbursementRequestAdd />} />
        <Route path="reimbursementRequestAdd/:reimbursementRequestId" element={<ReimbursementRequestAdd />} />
        <Route path="geoLocation" element={<GeoLocation />} />
        <Route path="tutorialVideos" element={<TutorialVideo />} />
        <Route path="tutorialVideos/:label" element={<TutorialVideo />} />

        {/* ── Penspring (authenticated) ─────────────────────────── */}
        <Route path="workSettings" element={<WorkSettings />} />
        <Route path="myWorks" element={<MyWorks />} />
        <Route path="myWorks/group/:groupChosen" element={<MyWorks />} />
        <Route path="myWorks/:init" element={<MyWorks />} />
        <Route path="myContacts" element={<MyContacts />} />
        <Route path="giveAccessToEditors" element={<GiveAccessToEditors />} />
        <Route path="giveAccessToWorks" element={<GiveAccessToWorks />} />
        <Route path="editReview" element={<EditReview />} />
        <Route path="editReview/:workId" element={<EditReview />} />
        <Route path="editReview/:isLMSTransfer/:workId" element={<EditReview />} />
        <Route path="editReview/draft/:isdraft" element={<EditReview />} />
        <Route path="editReview/:workId/:chosenTabPersonId/:hrefId" element={<EditReview />} />
        <Route path="workAddNew" element={<WorkAddNew />} />
        <Route path="workAddNew/:groupChosen" element={<WorkAddNew />} />
        <Route path="workUploadFile" element={<WorkUploadFile />} />
        <Route path="workNewAfterNav" element={<WorkNewAfterNav />} />
        <Route path="chapterUploadFile" element={<ChapterUploadFile />} />
        <Route path="workDownload" element={<WorkDownload />} />
        <Route path="draftSettings" element={<DraftSettings />} />
        <Route path="editorInviteNameEmail" element={<EditorInviteNameEmail />} />
        <Route path="editorInviteNameEmail/:groupChosen" element={<EditorInviteNameEmail />} />
        <Route path="editorInviteWorkAssign" element={<EditorInviteWorkAssign />} />
        <Route path="workSections" element={<WorkSections />} />
        <Route path="addOrUpdateChapter" element={<AddOrUpdateChapter />} />
        <Route path="addOrUpdateChapter/:chapterId" element={<AddOrUpdateChapter />} />
        <Route path="mergeChapters" element={<MergeChapters />} />
        <Route path="splitChapter" element={<SplitChapter />} />
        <Route path="openCommunity" element={<OpenCommunity />} />

        {/* Contributor reports */}
        <Route path="report/e/:editType" element={<ContributorReport />} />
        <Route path="report/e/:editType/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/e/:editType/:workId" element={<ContributorReport />} />
        <Route path="report/e/:editType/:workId/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/e/:editType/:workId/:personId" element={<ContributorReport />} />
        <Route path="report/e/:editType/:workId/:personId/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/e/:editType/:workId/:personId/:sections" element={<ContributorReport />} />
        <Route path="report/e/:editType/:workId/:personId/:sections/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/t/:editType" element={<ContributorReport />} />
        <Route path="report/t/:editType/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId/:languageId" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId/:languageId/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId/:languageId/:personId" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId/:languageId/:personId/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId/:languageId/:personId/:sections" element={<ContributorReport />} />
        <Route path="report/t/:editType/:workId/:languageId/:personId/:sections/editCount/:editTypeCount" element={<ContributorReport />} />
        <Route path="report/t/:editType/works/languages/editors/noSections/le/:langOrEditorCount" element={<ContributorReport />} />
        <Route path="report/t/:editType/works/languages/editors/noSections/le/:langOrEditorCount/editCount/:editTypeCount" element={<ContributorReport />} />

        {/* Groups */}
        <Route path="groupTypeChoice" element={<GroupTypeChoice />} />
        <Route path="groupAddNew/:groupTypeName" element={<GroupAddNew />} />
        <Route path="groupSettings" element={<GroupSettings />} />
        <Route path="groupSettings/:groupChosen" element={<GroupSettings />} />
        <Route path="myGroups" element={<MyGroups />} />
        <Route path="myGroupsReport" element={<MyGroupsReport />} />
        <Route path="groupMemberAdd" element={<GroupMemberAdd />} />
        <Route path="groupMemberUpdate/:memberPersonId" element={<GroupMemberUpdate />} />
        <Route path="accessReport" element={<AccessReport />} />
        <Route path="accessReport/:groupChosen" element={<AccessReport />} />
        <Route path="groupEditReport/e/:editType" element={<GroupEditReport />} />
        <Route path="groupEditReport/e/:editType/:workId/editCount/:editTypeCount" element={<GroupEditReport />} />
        <Route path="groupEditReport/e/:editType/:workId" element={<GroupEditReport />} />
        <Route path="groupEditReport/e/:editType/:workId/:personId" element={<GroupEditReport />} />
        <Route path="peerGroupAddOrUpdate/:groupChosen" element={<PeerGroupAddOrUpdate />} />
        <Route path="peerGroupAddOrUpdate/:groupChosen/:peerGroupId" element={<PeerGroupAddOrUpdate />} />
        <Route path="groupWorkAssign/:groupChosen/:masterWorkId" element={<GroupWorkAssign />} />
        <Route path="assignmentDashboard" element={<AssignmentDashboard />} />
        <Route path="assignmentDashboard/:groupChosen" element={<AssignmentDashboard />} />
        <Route path="assignmentDashboard/:groupChosen/:masterWorkId" element={<AssignmentDashboard />} />

        {/* Gallery */}
        <Route path="galleryList" element={<GalleryList />} />
        <Route path="galleryAdd" element={<GalleryAdd />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Route>
  </Routes>
);

export default AppRoutes;
