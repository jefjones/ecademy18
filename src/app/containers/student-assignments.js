import React, {Component} from 'react';
import StudentAssignmentsView from '../views/StudentAssignmentsView';
import { connect } from 'react-redux';
import {guidEmpty} from '../utils/guidValidate';
import * as actionStudentAssignments from '../actions/student-assignments.js';
import * as actionCourseDocuments from '../actions/course-documents.js';
import * as actionGradebook from '../actions/gradebook-entry.js';
import * as actionContentTypes from '../actions/content-types.js';
//import * as actionVoiceRecording from '../actions/voice-recording.js';
import * as actionResponseVisitedType from '../actions/response-visited-type.js';
import * as actionPenspringTransfer from '../actions/penspring-transfer.js';
import * as actionAssignmentPendingReview from '../actions/assignments-pending-review';
import * as actionLanguageList from '../actions/language-list';
import * as actionCourses from '../actions/course-to-schedule';
import * as actionStandardsRating from '../actions/standards-rating.js';
import * as actionStandards from '../actions/standards.js';
import * as actionPassFailRating from '../actions/pass-fail-rating.js';
import * as actionGradebookEntry from '../actions/gradebook-entry';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionStudentSchedule from '../actions/student-schedule.js';
import * as actionCourseToSchedule from '../actions/course-to-schedule.js';
import { selectMe, selectFetchingRecord, selectStudentAssignments, selectCompanyConfig, selectCoursesScheduled, selectVoiceRecording,
 					selectCourseDocuments, selectAccessRoles, selectCourseTypes, selectContentTypes, selectStudents, selectGradeScale,
					selectLanguageList, selectPenspringTransfer, selectCourseWeightedScore, selectPassFailRating, selectStandardsRating,
					selectMyFrequentPlaces, selectStandards, selectPersonConfig, selectStudentCourseAssigns} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let accessRoles = selectAccessRoles(state);
		let gradeScale = selectGradeScale(state);
    let courses = selectCoursesScheduled(state);
    let studentCourseAssigns = selectStudentCourseAssigns(state);
    let course = courses && courses.length > 0 && courses.filter(m => m.courseScheduledId === props.params.courseScheduledId)[0];
		gradeScale = gradeScale && gradeScale.length > 0 && course && course.gradeScaleTableId && gradeScale.filter(m => m.gradeScaleTableId === course.gradeScaleTableId);
		let studentPersonId = props.params && props.params.studentPersonId;
    let courseScheduledId = props.params.courseScheduledId;
		let students = [];

    if (courseScheduledId && courseScheduledId !== "0" && courseScheduledId !== guidEmpty && studentCourseAssigns && studentCourseAssigns.length > 0) {
        students = courseScheduledId && courseScheduledId !== "0" && courseScheduledId !== guidEmpty && selectStudents(state);
        students = students && students.length > 0 && students.reduce((acc, m) => {
            let found = false;
            studentCourseAssigns.forEach(s => { if (s.id === m.id) found = true; });
            if (found) {
                let alreadyExists = acc && acc.length > 0 && acc.filter(e => e.id === m.id)[0];
                alreadyExists = alreadyExists && alreadyExists.id ? true : false;
                if (!alreadyExists) {
                    acc = acc && acc.length > 0 ? acc.concat(m) : [m];
                }
            }
            return acc;
        }, []);
    }

		let studentFullName = '';
		let studentFirstName = '';
		studentPersonId && students && students.length > 0 && students.forEach(m => {
				if (m.studentPersonId === studentPersonId) {
						studentFullName = m.firstName + ' ' + m.lastName;
						studentFirstName = m.firstName;
				}
		})
		let assignmentsInfo = selectStudentAssignments(state);
    let sequenceCount = assignmentsInfo && assignmentsInfo.length;
    let sequences = [];
    for(var i = 1; i <= sequenceCount; i++) {
        let option = { id: String(i), value: String(i), label: String(i)};
        sequences = sequences ? sequences.concat(option) : [option];
    }

		let visitedColor = {
				VISITED: '#c7c9c3',
				HIDE: '#4c8e10',
				DELETED: '',
				ATTENTION: '#f61010'
		};

		let weightedScores = selectCourseWeightedScore(state);
		let contentTypes = selectContentTypes(state);
    let standardsRatings = selectStandardsRating(state);
		let standards = selectStandards(state);
		standardsRatings = course && course.standardsRatingTableId && standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === course.standardsRatingTableId);

		// weightedScores && weightedScores.length > 0 && weightedScores.forEach(m => {
		// 		if (m.scorePercent) {
		// 				contentTypes = contentTypes && contentTypes.length > 0 && contentTypes.filter(c => c.id !== m.contentTypeId);
		// 		}
		// })
		if (assignmentsInfo && assignmentsInfo.assignments && assignmentsInfo.assignments.length > 0) {
				contentTypes = contentTypes && contentTypes.length > 0 && contentTypes.filter(c => {
						let hasFound = false
						assignmentsInfo.assignments.forEach(m => {
									if (c.id === m.contentTypeId) hasFound = true;
						});
						return hasFound
				});
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId: studentPersonId || (accessRoles.learner && me.personId),
				studentFullName: studentFullName || (accessRoles.learner && me.fname + ' ' + me.lname),  //This is used for the observer in case there are more than one student that this observer has in the same class.
				studentFirstName: studentFirstName || (accessRoles.learner && me.fname),
        companyConfig: selectCompanyConfig(state),
				students,
				contentTypes,
				weightedScores,
        assignmentsInfo,
				visitedColor,
				course,
        sequences,
				courseEntryId: course && course.courseEntryId,
				courseScheduledId: props.params.courseScheduledId,
        chosenAssignmentId: props.params && props.params.chosenAssignmentId,
				courseDocuments: selectCourseDocuments(state),
        fetchingRecord: selectFetchingRecord(state),
        voiceRecording: selectVoiceRecording(state),
				accessRoles,
				courseTypes: selectCourseTypes(state),
				gradeScale,
				languageList: selectLanguageList(state),
				penspringTransfer: selectPenspringTransfer(state),
				standardsRatings,
        standards,
				passFailRatings: selectPassFailRating(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
        personConfig: selectPersonConfig(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionLanguageList.getPageLangs(personId, langCode, page)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId, clearRedux) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId, clearRedux)),
		courseDocumentsInit: (personId, courseEntryId) => dispatch(actionCourseDocuments.init(personId, courseEntryId)),
		addOrUpdateStudentResponse: (personId, courseEntryId, courseScheduledId, studentResponse, assignmentId, initFunction, studentPersonId) => dispatch(actionStudentAssignments.addOrUpdateStudentResponse(personId, courseEntryId, courseScheduledId, studentResponse, assignmentId, initFunction, studentPersonId)),
		removeStudentResponse: (personId, studentAssignmentResponseId, deleteFile) => dispatch(actionStudentAssignments.removeStudentResponse(personId, studentAssignmentResponseId, deleteFile)),
		saveAssignmentWebsiteLink: (personId, assignmentId, websiteLink) => dispatch(actionStudentAssignments.saveAssignmentWebsiteLink(personId, assignmentId, websiteLink)),
		setGradebookScore: (personId, courseScheduledId, studentPersonId, assignmentId, score, runFunction) => dispatch(actionGradebook.setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, score, runFunction)),
		setGradebookScorePreBlur: (personId, courseScheduledId, studentPersonId, assignmentId, score) => dispatch(actionGradebook.setGradebookScorePreBlur(personId, courseScheduledId, studentPersonId, assignmentId, score)),
		setResponseVisitedType: (personId, studentAssignmentResponseId, ResponseVisitedTypeCode) => dispatch(actionResponseVisitedType.setResponseVisitedType(personId, studentAssignmentResponseId, ResponseVisitedTypeCode)),
		clearPenspringTransfer: (personId) => dispatch(actionPenspringTransfer.clearPenspringTransfer(personId)),
		createWorkAndPenspringTransfer: (personId, work, initFunction) => dispatch(actionPenspringTransfer.createWorkAndPenspringTransfer(personId, work, initFunction)),
		setPenspringTransfer: (personId, work) => dispatch(actionPenspringTransfer.setPenspringTransfer(personId, work)),
		getAssignmentsPendingReview: (personId) => dispatch(actionAssignmentPendingReview.getAssignmentsPendingReview(personId)),
		getLanguageList: () => dispatch(actionLanguageList.init()),
		getCoursesScheduled: (personId) => dispatch(actionCourses.getCoursesScheduled(personId)),
    getStandardsRating: (personId) => dispatch(actionStandardsRating.getStandardsRating(personId)),
    getStandards: (personId) => dispatch(actionStandards.getStandards(personId)),
		setPassFailSequence: (studentPersonId, assignmentId, nextSequence, courseScheduledId, personId, runFunction) => dispatch(actionGradebookEntry.setPassFailSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId, runFunction)),
		getPassFailRatings: (personId) => dispatch(actionPassFailRating.init(personId)),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
		setGradeOverwrite: (personId, courseScheduledId, studentPersonId, intervalId, field, value) => dispatch(actionGradebookEntry.setGradeOverwrite(personId, courseScheduledId, studentPersonId, intervalId, field, value)),
    setAssignmentEditMode: (assignmentId) => dispatch(actionStudentAssignments.setAssignmentEditMode(assignmentId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
    setStandardLevelSequence: (studentPersonId, assignmentId, nextSequence, courseScheduledId, personId) => dispatch(actionStandardsRating.setStandardLevelSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId)),
    getStudentCoursesAssigns: (personId, courseScheduledId) => dispatch(actionCourseToSchedule.getStudentCoursesAssigns(personId, courseScheduledId)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		constructor(props) {
				super(props);

				this.state = {
						isInit: false,
				}
		}

	  componentDidMount() {
				const {getPageLangs, langCode, personId, studentPersonId, getLanguageList, studentAssignmentsInit, courseScheduledId, getContentTypes, getPassFailRatings, getStandardsRating,
                getStandards, getStudentCoursesAssigns, accessRoles} = this.props;
        getPageLangs(personId, langCode, 'StudentAssignmentsView');
				getLanguageList();
				studentAssignmentsInit(personId, studentPersonId, courseScheduledId);
        getStandardsRating(personId);
				getStandards(personId);
				getPassFailRatings(personId);
				getContentTypes(personId);
        if (accessRoles.facilitator || accessRoles.admin) getStudentCoursesAssigns(personId, courseScheduledId);
	  }

		componentDidUpdate() {
				const {personId, setMyVisitedPage, courseScheduledId, studentFullName, studentPersonId, studentAssignmentsInit, course} = this.props;
				const {isInit} = this.state;

				if (courseScheduledId && studentFullName && (!isInit || studentPersonId !== this.state.studentPersonId)) {
						studentAssignmentsInit(personId, studentPersonId, courseScheduledId);
						this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Assignments: ${studentFullName} ${course && course.courseName}`});
						this.setState({ isInit: true, studentPersonId });
				}
		}

	  render() {
	    return <StudentAssignmentsView {...this.props} />;
		}
}
export default storeConnector(Container);
