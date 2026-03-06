import React, {Component} from 'react';
import CourseAttendanceSingleView from '../views/CourseAttendanceSingleView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseAttendance from '../actions/course-attendance';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionStudent from '../actions/student.js';
import {formatYYYY_MM_DD} from '../utils/dateFormatYYYY_MM_DD.js';
import {guidEmpty} from '../utils/guidValidate.js';
import { selectMe, selectMyFrequentPlaces, selectCourseAttendanceSingle, selectStudents, selectCourseAttendanceDays, selectCompanyConfig, selectAccessRoles,
 					selectFetchingRecord, selectPersonConfig, selectStudentChosenSession} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let personConfig = selectPersonConfig(state);
		let students = selectStudents(state);
		//Just consider the students who are Academy.
		students = students && students.length > 0 && students.filter(m => m.studentType !== "DE");
    let attendanceSingle = selectCourseAttendanceSingle(state);
    let studentChosenSession = selectStudentChosenSession(state);
    let studentPersonId = (props.params && props.params.studentPersonId) || studentChosenSession;
		let studentName = students && students.length > 0 && studentPersonId && studentPersonId !== guidEmpty
				? students.filter(m => m.id === studentPersonId)[0]
				: ''

		studentName = studentName && studentName.firstName
				? studentName.firstName + ' ' + studentName.lastName
				: '';

    return {
        studentPersonId,
        langCode: me.langCode,
				studentName,
        personId: me.personId,
        attendanceSingle,
				personConfig,
				accessRoles: selectAccessRoles(state),
        courseDates: selectCourseAttendanceDays(state),
        courseScheduledId: props.params && props.params.courseScheduledId,
        students,
        companyConfig: selectCompanyConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getCourseAttendanceSingle: (personId, studentPersonId, dayFrom, dayTo) => dispatch(actionCourseAttendance.getCourseAttendanceSingle(personId, studentPersonId, dayFrom, dayTo)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setCourseAttendance: (personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction) => dispatch(actionCourseAttendance.setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction)),
		clearCourseAttendanceSingle: () => dispatch(actionCourseAttendance.clearCourseAttendanceSingle()),
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

    componentDidMount() {
        const {getPageLangs, langCode, personId, getCourseAttendanceSingle, studentPersonId} = this.props;
        getPageLangs(personId, langCode, 'CourseAttendanceSingleView');
        //We want to have the entire view of the learner's attendance to start with up to today (since the future hasn't happened yet).
        let today = formatYYYY_MM_DD(new Date());
        if (studentPersonId) getCourseAttendanceSingle(personId, studentPersonId, today, today);
    }

		componentDidUpdate() {
				const {personId, setMyVisitedPage, getCourseAttendanceSingle, studentPersonId, dayFrom, dayTo, studentName} = this.props;
				const {isInit} = this.state;

				if (studentName && (!isInit || studentPersonId !== this.state.studentPersonId)) {
						getCourseAttendanceSingle(personId, studentPersonId, dayFrom, dayTo)
						this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Attendance (single): ${studentName}`});
						this.setState({ isInit: true, studentPersonId });
				}
		}

    render() {
        return <CourseAttendanceSingleView {...this.props} />
    }
}

export default storeConnector(Container);
