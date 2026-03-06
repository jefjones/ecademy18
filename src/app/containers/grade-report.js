import React, {Component} from 'react';
import GradeReportView from '../views/GradeReportView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionGradeReport from '../actions/grade-report';
import * as actionStudent from '../actions/student';
import * as actionPersonConfig from '../actions/person-config';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {guidEmpty} from '../utils/guidValidate.js';
import { selectMe, selectGradeReport, selectCompanyConfig, selectAccessRoles, selectStudents, selectFetchingRecord, selectSchoolYears,
					selectIntervals, selectPersonConfig, selectMyFrequentPlaces, selectStudentChosenSession } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let personConfig = selectPersonConfig(state);
		let studentChosenSession = selectStudentChosenSession(state);
		let studentPersonId = (props.params && props.params.studentPersonId && props.params.studentPersonId !== '0' && props.params.studentPersonId !== guidEmpty) || studentChosenSession;
		let gradeReport = selectGradeReport(state) || {};

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId,
				students: selectStudents(state),
				schoolYearId: (props.params && props.params.schoolYearId) || 9,
				gradeReport,
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				fetchingRecord: selectFetchingRecord(state),
				intervals: selectIntervals(state),
				schoolYears: selectSchoolYears(state),
				personConfig,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getGradeReport: (personId, studentPersonId, schoolYearId) => dispatch(actionGradeReport.getGradeReport(personId, studentPersonId, schoolYearId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getStudents: (personId) => dispatch(actionStudent.getStudents(personId)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
		removeStudentGradeFinal: (personId, studentPersonId, courseScheduledId, intervalId) => dispatch(actionGradeReport.removeStudentGradeFinal(personId, studentPersonId, courseScheduledId, intervalId)),
		setPersonConfigChoice: (personId, configKey, value) => dispatch(actionPersonConfig.setPersonConfigChoice(personId, configKey, value)),
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
		    const {getPageLangs, langCode, personId, getGradeReport, studentPersonId, schoolYearId} = this.props;
		    getPageLangs(personId, langCode, 'GradeReportView');
				getGradeReport(personId, studentPersonId, schoolYearId);
	  }

		componentDidUpdate() {
				const {personId, setMyVisitedPage, getGradeReport, studentPersonId, schoolYearId, students} = this.props;
				const {isInit} = this.state;

				let studentName = students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0];
				if (studentName && studentName.label) studentName = studentName.label;

				if (studentName && (!isInit || studentPersonId !== this.state.studentPersonId)) {
						getGradeReport(personId, studentPersonId, schoolYearId);
						this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Grade Report: ${studentName}`});
						this.setState({ isInit: true, studentPersonId });
				}
		}

	  render() {
	    return <GradeReportView {...this.props} />;
	  }
}

export default storeConnector(Container);
