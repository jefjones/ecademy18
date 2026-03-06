import React, {Component} from 'react';
import StudentProfileView from '../views/StudentProfileView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionRegistration from '../actions/registration';
import * as loginUser from '../actions/login.js';
import * as actionAnnouncement from '../actions/announcements.js';
import * as actionStudentDocuments from '../actions/student-documents.js';
import * as actionGradeLevel from '../actions/grade-level.js';
import * as actionPersonConfig from '../actions/person-config';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectRegistration, selectAccessRoles, selectFetchingRecord, selectCompanyConfig, selectSchoolYears, selectPersonConfig,
					selectStudents, selectStudentDocuments} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let studentProfile = selectRegistration(state);
		let studentPersonId = props.params && props.params.studentPersonId;
		let students = selectStudents(state);
		students = studentProfile && studentProfile.primaryGuardian && students && students.length > 0 && students.filter(m => m.primaryGuardianPersonId === studentProfile.primaryGuardian.personId);

    return {
				personId: me.personId,
				langCode: me.langCode,
				studentProfile,
				students,
				schoolYearId: (props.params && props.params.schoolYearId),
				studentPersonId,
				accessRoles: selectAccessRoles(state),
				fetchingRecord: selectFetchingRecord(state),
				companyConfig: selectCompanyConfig(state),
				schoolYears: selectSchoolYears(state),
				personConfig: selectPersonConfig(state),
				studentDocuments: selectStudentDocuments(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getRegistrationByStudent: (personId, studentPersonId, schoolYearId) => dispatch(actionRegistration.getRegistrationByStudent(personId, studentPersonId, schoolYearId)),
		login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
		sendLoginInstructions: (personId, primaryGuardianPersonId) => dispatch(actionRegistration.sendLoginInstructions(personId, primaryGuardianPersonId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		updateStudentProfile: (personId, studentPersonId, withdrawnDate, selfPaced, newNote, schoolYearId) => dispatch(actionRegistration.updateStudentProfile(personId, studentPersonId, withdrawnDate, selfPaced, newNote, schoolYearId)),
		removeStudentAdminNote: (personId, studentPersonId, studentAdminNoteId, schoolYearId) => dispatch(actionRegistration.removeStudentAdminNote(personId, studentPersonId, studentAdminNoteId, schoolYearId)),
		getStudentDocuments: (personId, studentPersonId) => dispatch(actionStudentDocuments.getStudentDocuments(personId, studentPersonId)),
		removeStudentDocumentFile: (personId, studentDocumentId) => dispatch(actionStudentDocuments.removeStudentDocumentFile(personId, studentDocumentId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const{getPageLangs, langCode, setMyVisitedPage, getRegistrationByStudent, personId, studentPersonId, schoolYearId, getStudentDocuments} = this.props;
				getPageLangs(personId, langCode, 'StudentProfileView');
				getRegistrationByStudent(personId, studentPersonId, schoolYearId);
				getStudentDocuments(personId, studentPersonId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Student Profile`});
		}

	  render() {
				const {fetchingRecord} = this.props;
	    	return fetchingRecord && !fetchingRecord.studentProfile ? <StudentProfileView {...this.props} /> : null;
	  }
}

export default storeConnector(Container);
