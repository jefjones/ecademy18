import React, {Component} from 'react';
import CourseAttendanceView from '../views/CourseAttendanceView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionStudent from '../actions/student.js';
import * as actionCourseAttendance from '../actions/course-attendance';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionCourseToSchedule from '../actions/course-to-schedule.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {guidEmpty} from '../utils/guidValidate';
import moment from 'moment';
import { selectMe, selectMyFrequentPlaces, selectCourseAttendanceRoll, selectCoursesScheduled, selectCourseAttendanceDays, selectAccessRoles,
 					selectStudents, selectPersonConfig, selectIntervals, selectCompanyConfig, selectSchoolYears, selectFetchingRecord,
          selectStudentCourseAssigns} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let personConfig = selectPersonConfig(state);
		let accessRoles = selectAccessRoles(state);
    let coursesScheduled = selectCoursesScheduled(state) && selectCoursesScheduled(state);
    let studentCourseAssigns = selectStudentCourseAssigns(state);
		coursesScheduled = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => m.courseTypeName !== 'DE');
		if (!accessRoles.admin && accessRoles.facilitator) {
				coursesScheduled = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => {
						let found = false;
						m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
								if (t.id === me.personId) found = true;
						});
						return found;
				});
		}
		let courseScheduledId = props.params && props.params.courseScheduledId;
		let course = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => m.courseScheduledId === courseScheduledId)[0];
		let courseName = course && course.courseName;
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

		let attendance = selectCourseAttendanceRoll(state);
		let courseDates = selectCourseAttendanceDays(state);
		let courseDay = '';
		if (attendance && attendance.length > 0) courseDay = attendance[0].attendanceDate;
		//If the attendance date is not there, then see if today's date does exists
		//If not found still, then get the date in the courseDates list which is the first day found before today's date.
		if (!courseDay) {
				let todayDate = moment();
				courseDay = courseDates && courseDates.length > 0 && courseDates.filter(m => m.id === todayDate.format('YYYY-MM-DD'))[0];
				if (!courseDay) {
						let prevDay = courseDates && courseDates.length > 0 && courseDates[0].id;
						courseDates && courseDates.length > 0 && courseDates.forEach(m => {
								if (moment(m.id).isBefore(todayDate)) {
										prevDay = m.id;
								} else {
										courseDay = prevDay;
								}
						})
				}
		}
		courseDay = courseDay ? moment(courseDay).format('YYYY-MM-DD') : '';

    return {
        personId: me.personId,
        langCode: me.langCode,
				courseDay,
				students,
        attendance,
        courseDates,
				courseName,
        courseScheduledId,
        coursesScheduled,
				personConfig,
				accessRoles,
				intervals: selectIntervals(state),
				companyConfig: selectCompanyConfig(state),
				schoolYears: selectSchoolYears(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
        studentCourseAssigns,
    }
};

const bindActionsToDispatch = dispatch => ({
    getSingleCourseAttendance: (personId, courseScheduledId, day, studentList) => dispatch(actionCourseAttendance.getSingleCourseAttendance(personId, courseScheduledId, day, studentList)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setAllPresentAttendance: (personId, courseScheduledId, courseDay, studentList) => dispatch(actionCourseAttendance.setAllPresentAttendance(personId, courseScheduledId, courseDay, studentList)),
    courseAttendanceDatesInit: (personId, courseScheduledId) => dispatch(actionCourseAttendance.courseAttendanceDatesInit(personId, courseScheduledId)),
		clearAttendanceDates: () => dispatch(actionCourseAttendance.clearAttendanceDates()),
		courseAttendanceDatesSetBlank: () => dispatch(actionCourseAttendance.courseAttendanceDatesSetBlank()),
    setCourseAttendance: (personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction) => dispatch(actionCourseAttendance.setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getStudents: (personId) => dispatch(actionStudent.getStudents(personId)),
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
        const {getPageLangs, langCode, personId, courseAttendanceDatesInit, courseScheduledId, getStudentCoursesAssigns} = this.props;
        getPageLangs(personId, langCode, 'CourseAttendanceView');
				if (courseScheduledId && courseScheduledId !== "0" && courseScheduledId !== guidEmpty) {
            courseAttendanceDatesInit(personId, courseScheduledId);
            getStudentCoursesAssigns(personId, courseScheduledId);
        }
    }

		componentDidUpdate() {
				const {personId, setMyVisitedPage, getSingleCourseAttendance, courseDay, courseScheduledId, courseName, getStudentCoursesAssigns} = this.props
				const {isInit} = this.state;

				if (courseDay && courseName && (!isInit || courseScheduledId !== this.state.courseScheduledId)) {
						getSingleCourseAttendance(personId, courseScheduledId, courseDay);
						this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Attendance: ${courseName}`});
						this.setState({ isInit: true, courseScheduledId });
            getStudentCoursesAssigns(personId, courseScheduledId);
				}
		}

    render() {
				return <CourseAttendanceView {...this.props} />;
    }
}

export default storeConnector(Container);
