import React, {Component} from 'react';
import AttendanceReportView from '../views/AttendanceReportView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionAttendanceReport from '../actions/attendance-report';
import * as actionCourseAttendance from '../actions/course-attendance';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionStudent from '../actions/student.js';
import {guidEmpty} from '../utils/guidValidate.js';
import { selectMe, selectMyFrequentPlaces, selectAttendanceReport, selectCompanyConfig, selectAccessRoles, selectStudents, selectFetchingRecord,
 					selectPersonConfig, selectIntervals, selectStudentChosenSession} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let personConfig = selectPersonConfig(state);
    let studentChosenSession = selectStudentChosenSession(state);
		let studentPersonId = (props.params && props.params.studentPersonId && props.params.studentPersonId !== '0' && props.params.studentPersonId !== guidEmpty) || studentChosenSession;
		let intervalId = props.params && props.params.intervalId;
		let students = selectStudents(state);
		students = students && students.length > 0 && students.filter(m => m.studentType !== 'DE');

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId,
				intervalId,
				students,
				//schoolYearId: (props.params && props.params.schoolYearId) || 9,
				attendanceReport: selectAttendanceReport(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				fetchingRecord: selectFetchingRecord(state),
				personConfig,
				intervals: selectIntervals(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		setCourseAttendance: (personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction) => dispatch(actionCourseAttendance.setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getAttendanceReport: (personId, studentPersonId, intervalId) => dispatch(actionAttendanceReport.getAttendanceReport(personId, studentPersonId, intervalId)),
		setEditMode: (studentPersonId, courseScheduledId, day) => dispatch(actionAttendanceReport.setEditMode(studentPersonId, courseScheduledId, day)),
		updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
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

		componentDidMount(prevProps) {
		    const {getPageLangs, langCode, personId, getAttendanceReport, studentPersonId, intervalId} = this.props;
		    getPageLangs(personId, langCode, 'AttendanceReportView');
				studentPersonId && getAttendanceReport(personId, studentPersonId, intervalId);
	  }

		componentDidUpdate() {
				const {personId, setMyVisitedPage, getAttendanceReport, studentPersonId, intervalId, students} = this.props;
				const {isInit} = this.state;

				let studentName = students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0];
				if (studentName && studentName.label) studentName = studentName.label;

				if (intervalId && studentName && (!isInit || studentPersonId !== this.state.studentPersonId)) {
						getAttendanceReport(personId, studentPersonId, intervalId);
						this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Attendance Report: ${studentName}`});
						this.setState({ isInit: true, studentPersonId });
				}
		}

	  render() {
				const {students} = this.props;
	    	return students && students.length > 0 ? <AttendanceReportView {...this.props} /> : null;
	  }
}


export default storeConnector(Container);
