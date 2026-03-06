import React, {Component} from 'react';
import BaseCoursesView from '../views/BaseCoursesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseEntry from '../actions/course-entry';
import * as actionCourseToSchedule from '../actions/course-to-schedule';
import * as actionPersonConfig from '../actions/person-config';
import * as actionCourseClipboard from '../actions/course-clipboard';
import * as actionLearningPathways from '../actions/learning-pathways.js';
import * as actionCourseTypes from '../actions/course-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {doSort} from '../utils/sort.js';
import { selectMe, selectCoursesBase, selectCoursesScheduled, selectCourseTypes, selectLearningPathways, selectLearningFocusAreas, selectPersonConfig,
					selectCompanyConfig, selectCourseClipboard, selectAccessRoles, selectMyFrequentPlaces, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let baseCourses = selectCoursesBase(state);
		baseCourses = doSort(baseCourses, { sortField: 'courseName', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
				baseCourses,
				scheduledCourses: selectCoursesScheduled(state),
				courseClipboard: selectCourseClipboard(state),
				courseTypes: selectCourseTypes(state),
				learningPathways: selectLearningPathways(state),
				focusAreas: selectLearningFocusAreas(state),
				companyConfig: selectCompanyConfig(state),
        personConfig: selectPersonConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		removeCourse: (personId, courseEntryId) => dispatch(actionCourseEntry.removeCourse(personId, courseEntryId)),
		duplicateCourse: (personId, courseEntryId, courseName) => dispatch(actionCourseEntry.duplicateCourse(personId, courseEntryId, courseName)),
		addCourseClipboard: (personId, courseClipboard) => dispatch(actionCourseClipboard.addCourseClipboard(personId, courseClipboard)),
		resetCourseClipboard: (personId, courseClipboard, sendTo) => dispatch(actionCourseClipboard.resetCourseClipboard(personId, courseClipboard, sendTo)),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		getCourseTypes: (personId) => dispatch(actionCourseTypes.init(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setPersonConfigChoice: (personId, configKey, value) => dispatch(actionPersonConfig.setPersonConfigChoice(personId, configKey, value)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, getLearningPathways, getCourseTypes, setMyVisitedPage } = this.props;
    	getPageLangs(personId, langCode, 'BaseCoursesView');
			getLearningPathways(personId);
			getCourseTypes(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Course List (base)`});
  }

  render() {
    return <BaseCoursesView {...this.props} />;
  }
}

export default storeConnector(Container);
