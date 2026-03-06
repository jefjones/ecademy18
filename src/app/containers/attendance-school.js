import React, {Component} from 'react';
import AttendanceSchoolView from '../views/AttendanceSchoolView';
import {doSort} from '../utils/sort.js';
import * as actionPageLang from '../actions/language-list';
import { connect } from 'react-redux';
import * as actionAttendanceSchool from '../actions/attendance-school.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectAttendanceSchool, selectAccessRoles, selectCompanyConfig, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let attendanceSchool = selectAttendanceSchool(state);
		let companyConfig = selectCompanyConfig(state);
		let studentList = [];
		attendanceSchool && attendanceSchool.length > 0 && attendanceSchool.forEach(m => {
				let foundRecord = false;
				studentList && studentList.length > 0 && studentList.forEach(v => {
						if (v.id === m.studentPersonId) foundRecord = true;
				})
				if (!foundRecord)
						studentList = studentList.concat({
								id: m.studentPersonId,
								label: companyConfig.studentNameFirst === 'FIRSTNAME' ? m.studentFirstName + ' ' + m.studentLastName : m.studentLastName + ', ' + m.studentFirstName
						});
		})

		studentList = doSort(studentList, { sortField: 'label', isAsc: true, isNumber: false });

    return {
        personId: me.personId,
        langCode: me.langCode,
				attendanceSchool,
				studentList,
				accessRoles: selectAccessRoles(state),
				companyConfig,
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getAttendanceSchool: (personId) => dispatch(actionAttendanceSchool.init(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, personId, setMyVisitedPage, getAttendanceSchool} = this.props;
				getPageLangs(personId, langCode, 'AttendanceSchoolView');
				getAttendanceSchool(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Attendance (school)`});
		}

    render() {
        return <AttendanceSchoolView {...this.props} />;
    }
}
export default storeConnector(Container);
