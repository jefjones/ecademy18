import React, {Component} from 'react';
import NewSchoolCheckListView from '../views/NewSchoolCheckListView';
import * as actionCompanyConfig from '../actions/company-config';
import * as actionPageLang from '../actions/language-list';
import * as actionAnnouncement from '../actions/announcements.js';
import * as actionStudentSchedule from '../actions/student-schedule.js';
import * as actionStudentAssignments from '../actions/student-assignments.js';
import * as actionUserPersonClipboard from '../actions/user-person-clipboard.js';
import * as actionStudent from '../actions/student.js';
import { connect } from 'react-redux';
import {selectMe, selectCompanyConfig, selectCountsMainMenu, selectSchoolYears, selectStudents, selectGradeLevels, selectStudentSchedule} from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
		let countsAll = selectCountsMainMenu(state);
		let countsMainMenu = countsAll && countsAll.mainMenu;

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
		};

    return {
			personId: me.personId,
			langCode: me.langCode,
			companyConfig: selectCompanyConfig(state),
			counts,
			schoolYears: selectSchoolYears(state),
			students: selectStudents(state),
			gradeLevels: selectGradeLevels(state),
			studentSchedule: selectStudentSchedule(state),
			showLogout: true,
			showForceFirstNav: true,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		setCompanyConfig: (personId, field, value) => dispatch(actionCompanyConfig.setCompanyConfig(personId, field, value)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		resetUserPersonClipboard: (personId, userPersonClipboard, sendTo) => dispatch(actionUserPersonClipboard.resetUserPersonClipboard(personId, userPersonClipboard, sendTo)),
		getStudents: (personId) => dispatch(actionStudent.getStudents(personId)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, personId, getStudents} = this.props;
				getPageLangs(personId, langCode, 'NewSchoolCheckListView');
				getStudents(personId);
		}

    render() {
        return <NewSchoolCheckListView {...this.props} />
    }
}

export default storeConnector(Container);
