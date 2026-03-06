import React, {Component} from 'react';
import TeacherScheduleView from '../views/TeacherScheduleView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionTeacherSchedule from '../actions/teacher-schedule';
import * as actionPersonConfig from '../actions/person-config';
import * as actionIntervals from '../actions/semester-intervals.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import moment from 'moment';
import { selectMe, selectMyFrequentPlaces, selectTeacherSchedule, selectUsers, selectCompanyConfig, selectPersonConfig, selectSchoolYears,
					selectIntervals } from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
		let schoolYears = selectSchoolYears(state);
		let personConfig = selectPersonConfig(state);
		let schoolYear = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === personConfig.schoolYearId)[0];
		schoolYear = schoolYear && schoolYear.label;
		let teacherSchedule = selectTeacherSchedule(state);
		let calendarEvents = [];
		let daysOfWeek =['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

		schoolYear && teacherSchedule && teacherSchedule.courses && teacherSchedule.courses.length > 0 && teacherSchedule.courses.forEach(m => {
				let year = m.semesterFromMonth > 6 ? schoolYear.substring(0,4) : schoolYear.substring(5);
				let fromDate = moment.utc(`${year}-${m.semesterFromMonth+1}-${m.semesterFromDay} 00:00:00.000`);
				let fromMondayDate = moment(fromDate);
				fromMondayDate = fromMondayDate.isoWeekday(0);
				year = m.semesterToMonth > 6 ? schoolYear.substring(0,4) : schoolYear.substring(5);
				let toDate = moment.utc(`${year}-${m.semesterToMonth+1}-${m.semesterToDay} 00:00:00.000`);
				let pointerDate = fromMondayDate;

				m.scheduleDays && m.scheduleDays.length > 0 && m.scheduleDays.forEach(s => {
						pointerDate = fromMondayDate.clone().day(daysOfWeek.indexOf(s.dayOfTheWeek));
						while(pointerDate.isSameOrBefore(toDate)){
								if (pointerDate.isSameOrAfter(fromDate) && pointerDate.isSameOrBefore(toDate)) {
										let startTime = moment(s.startTime);
										let endTime = moment(s.startTime).add(s.duration, 'minutes');
										calendarEvents.push({
								        title: m.courseName,
								        start: new Date(pointerDate.format('YYYY-MM-DD') + " " + startTime.format('HH:mm')),
								        end: new Date(pointerDate.format('YYYY-MM-DD') + " " + endTime.format('HH:mm')),
								        isAllDay: false,
										})
								}
								pointerDate.add(7, 'days');
						}
				})
		})

    return {
        personId: me.personId,
        langCode: me.langCode,
        teacherSchedule,
				calendarEvents,
				facilitatorPersonId: props.params.facilitatorPersonId,
				facilitators: selectUsers(state, 'Facilitator'),
				companyConfig: selectCompanyConfig(state),
				personConfig,
				schoolYears,
				intervals: selectIntervals(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTeacherSchedule: (personId, facilitatorPersonId) => dispatch(actionTeacherSchedule.init(personId, facilitatorPersonId)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		getIntervals: (personId) => dispatch(actionIntervals.init(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
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
        const {getPageLangs, langCode, personId, getTeacherSchedule, facilitatorPersonId, getIntervals} = this.props;
        getPageLangs(personId, langCode, 'TeacherScheduleView');
        facilitatorPersonId && getTeacherSchedule(personId, facilitatorPersonId);
				getIntervals(personId);
    }

		componentDidUpdate() {
				const {personId, setMyVisitedPage, getTeacherSchedule, facilitatorPersonId, teacherSchedule, facilitators} = this.props;
				const {isInit} = this.state;

				let teacherName = facilitators && facilitators.length > 0 && facilitators.filter(m => m.id === facilitatorPersonId)[0];
				if (teacherName && teacherName.label) teacherName = teacherName.label;

				if (teacherSchedule && teacherSchedule.firstName && (!isInit || facilitatorPersonId !== this.state.facilitatorPersonId)) {
						getTeacherSchedule(personId, facilitatorPersonId);
						this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Teacher Schedule: ${teacherName}`});
						this.setState({ isInit: true, facilitatorPersonId });
				}
		}

    render() {
        return <TeacherScheduleView {...this.props} />;
    }
}

export default storeConnector(Container);
