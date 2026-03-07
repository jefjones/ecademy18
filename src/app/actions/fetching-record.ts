import * as types from './actionTypes'

export const waitingForFileUpload = () => {
    return { type: types.FETCHING_RECORD, payload: {waitingForFileUpload: true} }
}

export const fileUploadHasArrived = () => {
    return { type: types.FETCHING_RECORD, payload: {waitingForFileUpload: false} }
}

export const resolveFetchingRecordChapterText = () => {
    return { type: types.FETCHING_RECORD, payload: {chapterText: false} }
}

export const resolveFetchingRecordAuthorWorkspace = () => {
    return { type: types.FETCHING_RECORD, payload: {authorWorkspace: false} }
}

export const resolveFetchingRecordCourseContent = () => {
    return { type: types.FETCHING_RECORD, payload: {courseContent: false} }
}

export const resolveFetchingRecordAssessment = () => {
    return { type: types.FETCHING_RECORD, payload: {assessment: false} }
}

export const resolveFetchingRecordAssessmentLearner = () => {
    return { type: types.FETCHING_RECORD, payload: {assessmentLearner: false} }
}

export const resolveFetchingRecordAssessmentQuestions = () => {
    return { type: types.FETCHING_RECORD, payload: {assessmentQuestions: false} }
}

export const resolveFetchingRecordCoursesAssignedToMe = () => {
    return { type: types.FETCHING_RECORD, payload: {coursesAssignedToMe: false} }
}

export const resolveFetchingRecordCourseAttendance = () => {
    return { type: types.FETCHING_RECORD, payload: {courseAttendance: false} }
}

export const resolveFetchingRecordCourseAttendanceSingle = () => {
    return { type: types.FETCHING_RECORD, payload: {courseAttendanceSingle: false} }
}

export const resolveFetchingRecordCourses = () => {
    return { type: types.FETCHING_RECORD, payload: {courses: false} }
}

export const resolveFetchingRecordCalendarEvents = () => {
    return { type: types.FETCHING_RECORD, payload: {calendarEvents: false} }
}

export const resolveFetchingRecordCourseToSchedule = () => {
    return { type: types.FETCHING_RECORD, payload: {courseToSchedule: false} }
}

export const resolveFetchingRecordScheduledCourses = () => {
    return { type: types.FETCHING_RECORD, payload: {scheduledCourses: false} }
}

export const resolveFetchingRecordLearnerCourseContent = () => {
    return { type: types.FETCHING_RECORD, payload: {learnerCourseContent: false} }
}

export const resolveFetchingRecordDiscussionEntries = () => {
    return { type: types.FETCHING_RECORD, payload: {discussionEntries: false} }
}

export const resolveFetchingRecordCourseDocuments = () => {
    return { type: types.FETCHING_RECORD, payload: {courseDocuments: false} }
}

export const resolveFetchingRecordAssignmentEntry = () => {
    return { type: types.FETCHING_RECORD, payload: {assignmentEntry: false} }
}

export const resolveFetchingRecordPendingReview = () => {
    return { type: types.FETCHING_RECORD, payload: {pendingReview: false} }
}

export const resolveFetchingRecordMyProfile = () => {
    return { type: types.FETCHING_RECORD, payload: {myProfile: false} }
}

export const resolveFetchingRecordAnnouncements = () => {
    return { type: types.FETCHING_RECORD, payload: {announcementsRecipient: false, announcementsSentBy: false, announcementsDeleted: false} }
}

export const resolveFetchingReportStudentRegistration = () => {
    return { type: types.FETCHING_RECORD, payload: {reportStudentRegistration: false} }
}

export const resolveFetchingRecordWorkEditReview = () => {
    return { type: types.FETCHING_RECORD, payload: {workEditReview: false} }
}

export const resolveFetchingRecordFileTreeExplorer = () => {
    return { type: types.FETCHING_RECORD, payload: {fileTreeExplorer: false} }
}
