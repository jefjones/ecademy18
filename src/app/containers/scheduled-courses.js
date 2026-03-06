import React, {Component} from 'react';
import ScheduledCoursesView from '../views/ScheduledCoursesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseToSchedule from '../actions/course-to-schedule';
import * as actionPersonConfig from '../actions/person-config';
import * as actionCourseClipboard from '../actions/course-clipboard';
import * as actionCourseWeightedScore from '../actions/course-weighted-score';
import * as actionClassPeriods from '../actions/class-periods.js';
import * as actionCourseTypes from '../actions/course-types.js';
import * as actionLearningPathways from '../actions/learning-pathways.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCoursesScheduled, selectCompanyConfig, selectAccessRoles, selectStudents, selectUsers, selectClassPeriods,
 					selectCourseTypes, selectPersonConfig, selectCourseClipboard, selectIntervals, selectSchoolYears, selectLearningPathways,
					selectMyFrequentPlaces, selectFetchingRecord, selectStudentListByCourse, selectSeatsStatistics,  } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let courseScheduledId = props.params && props.params.courseScheduledId;
		let scheduledCourses = selectCoursesScheduled(state);

		let courseEntryId = '';
		if (courseScheduledId && scheduledCourses && scheduledCourses.length > 0) {
				let course = scheduledCourses.filter(m => m.courseScheduledId === courseScheduledId)[0];
				if (course && course.courseEntryId ) courseEntryId = course.courseEntryId;
		}

    let accessRoles = selectAccessRoles(state);
    if (!accessRoles.admin && scheduledCourses && scheduledCourses.length > 0) scheduledCourses = scheduledCourses.filter(m => !m.courseEntryIsInactive & !m.courseScheduledIsInactive && !m.isInactive);


    return {
        personId: me.personId,
        langCode: me.langCode,
				courseScheduledId,
				courseEntryId,
				courseClipboard: selectCourseClipboard(state),
				scheduledCourses,
        companyConfig: selectCompanyConfig(state),
				accessRoles,
				students: selectStudents(state),
				facilitators: selectUsers(state, 'Facilitator'),
				classPeriods: selectClassPeriods(state),
				courseTypes: selectCourseTypes(state),
				personConfig: selectPersonConfig(state),
				intervals: selectIntervals(state),
				schoolYears: selectSchoolYears(state),
				learningPathways: selectLearningPathways(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
        studentListByCourse: selectStudentListByCourse(state),
        seatsStatistics: selectSeatsStatistics(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getCoursesScheduled: (personId, clearRedux) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId, clearRedux)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeCourseToSchedule: (personId, courseScheduledId) => dispatch(actionCourseToSchedule.removeCourseToSchedule(personId, courseScheduledId)),
    updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		setPersonConfigChoice: (personId, configKey, value) => dispatch(actionPersonConfig.setPersonConfigChoice(personId, configKey, value)),
		addCourseClipboard: (personId, courseClipboard) => dispatch(actionCourseClipboard.addCourseClipboard(personId, courseClipboard)),
		resetCourseClipboard: (personId, courseClipboard, sendTo) => dispatch(actionCourseClipboard.resetCourseClipboard(personId, courseClipboard, sendTo)),
		clearCourseWeightedScores: () => dispatch(actionCourseWeightedScore.clearCourseWeightedScores()),
		getCourseClipboard: (personId, courseListType) => dispatch(actionCourseClipboard.init(personId, courseListType)),
		getClassPeriods: (personId) => dispatch(actionClassPeriods.init(personId)),
		getCourseTypes: (personId) => dispatch(actionCourseTypes.init(personId)),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		singleRemoveCourseClipboard: (personId, chosenCourseId, courseListType) => dispatch(actionCourseClipboard.singleRemoveCourseClipboard(personId, chosenCourseId, courseListType)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getStudentListByCourse: (personId, courseScheduledId) => dispatch(actionCourseToSchedule.getStudentListByCourse(personId, courseScheduledId)),
    clearStudentListByCourse: () => dispatch(actionCourseToSchedule.clearStudentListByCourse()),
    getCoursesSeatsStatistics: (personId) => dispatch(actionCourseToSchedule.getCoursesSeatsStatistics(personId)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
		    const {getPageLangs, langCode, personId, setMyVisitedPage, clearCourseWeightedScores, getCourseClipboard, getClassPeriods, getCourseTypes,
                getLearningPathways, getCoursesSeatsStatistics} = this.props;
		    getPageLangs(personId, langCode, 'ScheduledCoursesView');
				clearCourseWeightedScores();
				getCourseClipboard(personId, 'courseScheduled');
				getClassPeriods(personId);
				getCourseTypes(personId);
				getLearningPathways(personId);
        getCoursesSeatsStatistics(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Scheduled Courses`});
	  }

	  render() {
	    	return <ScheduledCoursesView {...this.props} />;
	  }
}

export default storeConnector(Container);
