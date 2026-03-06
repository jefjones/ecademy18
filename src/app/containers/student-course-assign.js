import React, {Component} from 'react';
import StudentCourseAssignView from '../views/StudentCourseAssignView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import {doSort} from '../utils/sort.js';
import {guidEmpty} from '../utils/guidValidate.js';
import * as actionLearnerCourseAssign from '../actions/learner-course-assign';
import * as actionCourseToSchedule from '../actions/course-to-schedule';
import * as actionCourseEntry from '../actions/course-entry';

import * as actionMe from '../actions/login';
import * as actionPersonConfig from '../actions/person-config';
import * as actionStudentSchedule from '../actions/student-schedule';
import * as actionRegStudent from '../actions/reg-student';
import * as actionAlerts from '../actions/alerts';
import * as actionCurrentEnrollment from '../actions/current-enrollment-pre-req';
import * as fromOpenRegistration from '../reducers/open-registrations';
import * as actionOpenRegistrations from '../actions/open-registrations.js';
import * as actionCourseRecommendation from '../actions/course-recommendation.js';
import * as actionWaitList from '../actions/course-wait-list.js';
import * as actionGradReqirements from '../actions/grad-requirements.js';
import * as actionCoursePrerequisites from '../actions/course-prerequisites.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCoursesScheduled, selectCompanyConfig, selectAccessRoles, selectStudents, selectClassPeriods, selectCourseTypes,
					selectPersonConfig, selectLearningPathways, selectIntervals, selectStudentSchedule,  selectAlerts, selectGradeLevels,
					selectCourseRecommendations,  selectMyProfile, selectGradRequirements, selectCoursePrerequisites, selectPartialNameText,
					selectFetchingRecord, selectCurrentEnrollmentPreReq, selectDepartments, selectSeatsStatistics, selectDoNotAddCourses,
				 	selectCourseDescription} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let companyConfig = selectCompanyConfig(state);
		let myProfile = selectMyProfile(state);
		let gradeLevels = selectGradeLevels(state);
		let students = selectStudents(state);
		let scheduledCourses = selectCoursesScheduled(state);
		let courseRecommendations = selectCourseRecommendations(state);
		let uniqueTeachers = scheduledCourses && scheduledCourses.coursesScheduled && scheduledCourses.coursesScheduled.length > 0
				? [...new Set(scheduledCourses.coursesScheduled.map(m => m.facilitatorName))]
				: [];

		//Get the next grade level up in order to see the classes according to their grade level for next year.
		let currentGrade = myProfile.gradeLevel && gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.name == myProfile.gradeLevel)[0]; //eslint-disable-line
		let currentSequence = currentGrade && currentGrade.sequence;
		let nextYearGradeLevel = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.sequence === currentSequence+1*1)[0];
		let nextYearGradeLevelName = nextYearGradeLevel && nextYearGradeLevel.name;

		let teachers = uniqueTeachers && uniqueTeachers.length > 0 && uniqueTeachers.map(m => ({ id: m, label: m }))
		let learningPathways = selectLearningPathways(state);
		let accessRoles = selectAccessRoles(state);
		let gradRequirements = selectGradRequirements(state);
		gradRequirements = doSort(gradRequirements, { sortField: 'sequence', isAsc: true, isNumber: true });
		let classPeriods = selectClassPeriods(state);
		// if (classPeriods && classPeriods.length > 0) {
		// 	  classPeriods = classPeriods.filter(m => m.classPeriodId !== 17 && m.classPeriodId !== 18).map(m => {
		// 				if (m.id === 20) m.label = '5th Credit (optional)';
		// 				return m;
		// 		});
		// }
		let studentPersonId = accessRoles.learner ? me.personId : props.params && props.params.studentPersonId ? props.params.studentPersonId : '';
		if (!(me.salta && !!me.bypassGradeRestriction) && nextYearGradeLevelName) {
				scheduledCourses = scheduledCourses && scheduledCourses.length > 0 && scheduledCourses.filter(m => {
						let found = false;
						courseRecommendations && courseRecommendations.length > 0 && courseRecommendations.forEach(c => {
								if (c.courseEntryId === m.courseEntryId) found = true;
						});
						m.gradeLevelNames && m.gradeLevelNames.length > 0 && m.gradeLevelNames.forEach(g => {
								if (g == nextYearGradeLevelName)	found = true; //eslint-disable-line
						});
						return found;
				});
		}

		//Cut out the courses that are Learning Support if this is NOT an IEP student
		if (studentPersonId && studentPersonId !== guidEmpty && myProfile && myProfile.personId && scheduledCourses && scheduledCourses.length > 0) {
				//'6' is the Learning Support department id
				if (!myProfile.iep) scheduledCourses = scheduledCourses.filter(m => {
						let test = m.departmentId != 6 ? true : false; //eslint-disable-line
						return m.departmentId != 6; //eslint-disable-line
				});
		}

		if (scheduledCourses && scheduledCourses.length > 0) scheduledCourses = scheduledCourses.filter(m => !m.courseEntryIsInactive & !m.courseScheduledIsInactive && !m.isInactive);
		scheduledCourses = doSort(scheduledCourses, { sortField: 'sortSequence', isAsc: true, isNumber: true });

    return {
				me,
        personId: me.personId,
				langCode: me.langCode,
				myProfile,
				studentPersonId,
				studentSchedule: selectStudentSchedule(state),
				scheduledCourses,
        companyConfig,
				accessRoles,
				students,
				teachers,
				classPeriods,
				learningPathways,
				courseTypes: selectCourseTypes(state),
				personConfig: selectPersonConfig(state),
				intervals: selectIntervals(state),
				alerts: selectAlerts(state),
				courseRecommendations,
				gradRequirements,
				coursePrerequisites: selectCoursePrerequisites(state),
				fetchingRecord: selectFetchingRecord(state),
				currentEnrollmentPreReq: selectCurrentEnrollmentPreReq(state),
				departments: selectDepartments(state),
				seatsStatistics: selectSeatsStatistics(state),
				openRegistration: fromOpenRegistration.selectOpenRegistration(state.openRegistrations, me.personId),
				doNotAddCourses: selectDoNotAddCourses(state),
				partialNameText: selectPartialNameText(state),
				courseDescription: selectCourseDescription(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addLearnerCourseAssign: (personId, learners, courses, getStudentSchedule_personId) => dispatch(actionLearnerCourseAssign.addLearnerCourseAssign(personId, learners, courses, getStudentSchedule_personId)),
		removeCourseToSchedule: (personId, courseScheduledId) => dispatch(actionCourseToSchedule.removeCourseToSchedule(personId, courseScheduledId)),
		updatePersonConfig: (personId, field, value) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		removeStudentSchedule: (courseScheduledId, studentPersonId) => dispatch(actionStudentSchedule.removeStudentSchedule(courseScheduledId, studentPersonId)),
		addStudentSchedule: (course, studentPersonId) => dispatch(actionStudentSchedule.addStudentSchedule(course, studentPersonId)),
		removeStudentCourseAssign: (personId, studentPersonId, courseScheduledId, runFunction) => dispatch(actionStudentSchedule.removeStudentCourseAssign(personId, studentPersonId, courseScheduledId, runFunction)),
		setFinalized: (studentPersonId) => dispatch(actionRegStudent.setFinalized(studentPersonId)),
		removeCourseRecommendation: (personId, studentPersonId, courseEntryId, byType) => dispatch(actionCourseRecommendation.removeCourseRecommendation(personId, studentPersonId, courseEntryId, byType)),
		getCourseRecommendations: (personId, type) => dispatch(actionCourseRecommendation.getCourseRecommendations(personId, type)),
		getCurrentEnrollmentPreReq: (personId, studentPersonId) => dispatch(actionCurrentEnrollment.getCurrentEnrollmentPreReq(personId, studentPersonId)),
		getCoursesSeatsStatistics: (personId) => dispatch(actionCourseToSchedule.getCoursesSeatsStatistics(personId)),
		getOpenRegistrations: (personId) => dispatch(actionOpenRegistrations.init(personId)),
		getAlerts: (personId) => dispatch(actionAlerts.init(personId)),
		getDoNotAddCourse: (personId) => dispatch(actionWaitList.getDoNotAddCourse(personId)),
		getGradRequirements: (studentPersonId) => dispatch(actionGradReqirements.init(studentPersonId)),
		getCoursePrerequisites: (personId) => dispatch(actionCoursePrerequisites.getCoursePrerequisites(personId)),
		clearStudentCourseAssignNameSearch: () => dispatch(actionCourseToSchedule.clearStudentCourseAssignNameSearch()),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		getCourseDescription: (personId, courseEntryId) => dispatch(actionCourseEntry.getCourseDescription(personId, courseEntryId)),
		clearCourseDescription: () => dispatch(actionCourseEntry.clearCourseDescription()),
		toggleBypassGradeRestriction: () => dispatch(actionMe.toggleBypassGradeRestriction()),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
		    const {getPageLangs, langCode, personId, setMyVisitedPage, getStudentSchedule, studentPersonId, getAlerts, getCurrentEnrollmentPreReq, getDoNotAddCourse, getGradRequirements,
								getCoursePrerequisites} = this.props;
				if (studentPersonId) {
						getStudentSchedule(personId, studentPersonId)
						getCurrentEnrollmentPreReq(personId, studentPersonId);
						getGradRequirements(studentPersonId);
				}
				getPageLangs(personId, langCode, 'StudentCourseAssignView');
				getAlerts(personId);
				getDoNotAddCourse(personId);
				getCoursePrerequisites(personId)
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Student Course Assign`});
	  }

	  render() {
				const {coursePrerequisites} = this.props;
	    	return coursePrerequisites && coursePrerequisites.length > 0 ? <StudentCourseAssignView {...this.props} /> : null;
	  }
}

export default storeConnector(Container);
