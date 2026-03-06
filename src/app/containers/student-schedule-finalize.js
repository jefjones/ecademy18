import React, {Component} from 'react';
import StudentScheduleFinalizeView from '../views/StudentScheduleFinalizeView';
import * as actionStudentSchedule from '../actions/student-schedule.js';
import * as actionPageLang from '../actions/language-list';
import * as actionAnnouncement from '../actions/announcements.js';
import * as actionUserPersonClipboard from '../actions/user-person-clipboard.js';
import * as actionStudentAssignments from '../actions/student-assignments.js';
import * as actionCourseDocuments from '../actions/course-documents.js';
import * as actionStudent from '../actions/student.js';
import * as fromOpenRegistration from '../reducers/open-registrations';
import { connect } from 'react-redux';
import { selectMe, selectCoursesScheduled, selectCompanyConfig, selectAccessRoles, selectPersonConfig, selectMyProfile, selectStudentSchedule, selectTheStudent,
					selectCoursesBase, selectStudents, selectGradeLevels, selectUserPersonClipboard, selectMultStudentSchedules} from '../store.js';

const mapStateToProps = (state, props) => {
	    let me = selectMe(state);
		let myProfile = selectMyProfile(state);
		let companyConfig = selectCompanyConfig(state);
		let scheduledCourses = selectCoursesScheduled(state);
		let accessRoles = selectAccessRoles(state);
		let studentPersonId = accessRoles.learner ? me.personId : props.params && props.params.studentPersonId ? props.params.studentPersonId : '';
		let students = selectStudents(state);
		let student = selectTheStudent(state);
		let gradeLevel = selectGradeLevels(state) && selectGradeLevels(state).length > 0 && selectGradeLevels(state).filter(m => m.id === (student && student.gradeLevelId))[0];
		let gradeLevelName = gradeLevel && gradeLevel.label;
		let studentName = student && student.label;

		if (accessRoles.learner) {
				studentName = companyConfig.studentNameFirst === 'FIRSTNAME' ? me.fname + ' ' + me.lname : me.lname + ', ' + me.fname;
				gradeLevelName = myProfile && myProfile.gradeLevel;
		}
		let userPersonClipboard = selectUserPersonClipboard(state);
		let clipboardStudents = [];
		if (students && students.length > 0 && userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0) {
				clipboardStudents = students.filter(m => userPersonClipboard.personList.indexOf(m.personId || m.studentPersonId) > -1);
		}

    return {
				me,
				langCode: me.langCode,
				clipboardStudents,
        personId: me.personId,
				student,
				myProfile,
				studentPersonId,
				studentName,
				gradeLevelName,
				studentSchedule: selectStudentSchedule(state),
				scheduledCourses,
				baseCourses: selectCoursesBase(state),
        companyConfig,
				accessRoles,
				personConfig: selectPersonConfig(state),
				multStudentSchedules: selectMultStudentSchedules(state),
				students,
				openRegistration: fromOpenRegistration.selectOpenRegistration(state.openRegistrations, me.personId),
    }
};

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getMultStudentSchedules: (personId, studentPersonIds, schoolYearId) => dispatch(actionStudentSchedule.getMultStudentSchedules(personId, studentPersonIds, schoolYearId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		removeAllUserPersonClipboard: (personId, personType) => dispatch(actionUserPersonClipboard.removeAllUserPersonClipboard(personId, personType)),
		removeStudentUserPersonClipboard: (personId, chosenPersonId, personType) => dispatch(actionUserPersonClipboard.removeStudentUserPersonClipboard(personId, chosenPersonId, personType)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		courseDocumentsInit: (personId, courseEntryId) => dispatch(actionCourseDocuments.init(personId, courseEntryId)),
		getTheStudent: (personId, studentPersonId) => dispatch(actionStudent.getTheStudent(personId, studentPersonId)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const{getPageLangs, langCode, getTheStudent, personId, studentPersonId} = this.props;
				getPageLangs(personId, langCode, 'StudentScheduleFinalizeView');
				getTheStudent(personId, studentPersonId);
		}

	  render() {
	    	return <StudentScheduleFinalizeView {...this.props} />;
	  }
}

export default storeConnector(Container);
