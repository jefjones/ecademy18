import React, {Component} from 'react';
import LearnerSearchView from '../views/LearnerSearchView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionAnnouncement from '../actions/announcements.js';
import * as actionStudentSchedule from '../actions/student-schedule.js';
import * as actionUserPersonClipboard from '../actions/user-person-clipboard.js';
import * as actionSaveStudentSearch from '../actions/saved-student-search.js';
import * as actionCourseToSchedule from '../actions/course-to-schedule.js';
import * as actionGuardians from '../actions/guardians.js';
import * as actionGradeLevel from '../actions/grade-level';
import * as actionPersonConfig from '../actions/person-config';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {doSort} from '../utils/sort.js';
import { 	selectUsers, selectStudents, selectMe, selectLearnerFilter, selectCompanyConfig, selectAccessRoles, selectCoursesScheduled,
					selectGradeLevels, selectGuardians, selectFetchingRecord, selectUserPersonClipboard, selectSavedStudentSearch, selectPersonConfig,
				 	selectSchoolYears, selectMyFrequentPlaces, selectStudentCourseAssigns} from '../store.js';
					//selectLearnerOutcomes, selectLearningPathways, selectLearningFocusAreas, selectLearnerOutcomeTargets, selectMentors,


// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let personConfig = selectPersonConfig(state);

    let students = selectStudents(state);
    let learnerFilterList = selectLearnerFilter(state);
    let learnerFilterOptions = learnerFilterList && learnerFilterList.length > 0 && learnerFilterList.filter(m => !m.scratchFlag);
    learnerFilterOptions = learnerFilterOptions && learnerFilterOptions.length > 0
        && learnerFilterOptions.map(m => ({id: m.learnerFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}));
    let filterScratch_learner = learnerFilterList && learnerFilterList.length > 0 && learnerFilterList.filter(m => m.scratchFlag)[0];
		let coursesScheduled = selectCoursesScheduled(state);
		let accessRoles = selectAccessRoles(state);
		let companyConfig = selectCompanyConfig(state);

		if (accessRoles.facilitator && companyConfig.urlcode === 'Manheim') {
				//coursesScheduled = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => m.facilitatorPersonId === me.personId);
				coursesScheduled = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => {
						let found = false;
						m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
								if (t.id === me.personId) {
										found = true;
								}
						});
						return found;
				});
		}
		if (personConfig && personConfig.intervalList) {
				coursesScheduled = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.reduce((acc, m) => {
						let hasInterval = m.intervals && m.intervals.length > 0 && m.intervals.filter(f => personConfig.intervalList.toLowerCase().indexOf(f.intervalId.toLowerCase()) > -1)[0];
						if (hasInterval && hasInterval.intervalId) {
								acc = acc && acc.length > 0 ? acc.concat(m) : [m];
						}
						return acc;
					},
				[]);
		}

		coursesScheduled = doSort(coursesScheduled, { sortField: 'label', isAsc: true, isNumber: false })

		let months = [
				{id: 0, label: ''},
				{id: 1, label: 'January'}, //Notice that this starts at 1 unlike the other month arrays which start at 0 since that is consistent with sql server.
				{id: 2, label: 'February'},
				{id: 3, label: 'March'},
				{id: 4, label: 'April'},
				{id: 5, label: 'May'},
				{id: 6, label: 'June'},
				{id: 7, label: 'July'},
				{id: 8, label: 'August'},
				{id: 9, label: 'September'},
				{id: 10, label: 'October'},
				{id: 11, label: 'November'},
				{id: 12, label: 'December'},
		];

		let guardians = companyConfig && companyConfig.urlcode === 'Manheim' ? [] : selectGuardians(state); //Manheim doesn't need the guardians.
		let gradeLevels = selectGradeLevels(state);
		if (companyConfig && companyConfig.urlcode === 'Manheim') {
				gradeLevels = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.label === '8' || m.label === '9' || m.label === '10' || m.label === '11');
		}

		let credits = [];
		if (companyConfig && companyConfig.urlcode === 'Manheim') {
				for(var i = 0; i <= 10; i++) {
						credits.push({ id: i, label: i })
				}
		}

		let prevSearchList = ['Last', '-2', '-3', '-4', '-5'];

    return {
        personId: me.personId,
        langCode: me.langCode,
        students,
				fetchingRecord: selectFetchingRecord(state),
				months,
				credits,
        facilitators: selectUsers(state, 'Facilitator'),
				guardians,
				coursesScheduled,
        learnerFilterOptions,
        filterScratch_learner,
        savedFilterIdCurrent_learner: filterScratch_learner && filterScratch_learner.savedFilterIdCurrent,
				accessRoles,
				gradeLevels,
				companyConfig,
				userPersonClipboard: selectUserPersonClipboard(state),
				savedStudentSearch: selectSavedStudentSearch(state),
				prevSearchList,
				personConfig,
				schoolYears: selectSchoolYears(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				studentCourseAssigns: selectStudentCourseAssigns(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    //learnerFilterInit: (personId) => dispatch(actionLearnerFilter.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    //clearFilters_learner: (personId) => dispatch(actionLearnerFilter.clearFilters(personId)),
    // saveNewSavedSearch_learner: (personId, savedSearchName) => dispatch(actionLearnerFilter.saveNewSavedSearch(personId, savedSearchName)),
    // updateSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.updateSavedSearch(personId, learnerFilterId)),
    // deleteSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.deleteSavedSearch(personId, learnerFilterId)),
    // chooseSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.chooseSavedSearch(personId, learnerFilterId)),
    // updateFilterByField_learner: (personId, field, value) => dispatch(actionLearnerFilter.updateFilterByField(personId, field, value)),
    // updateFilterDefaultFlag_learner: (personId, savedFilterIdCurrent, setValue) => dispatch(actionLearnerFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		resetUserPersonClipboard: (personId, userPersonClipboard, sendTo) => dispatch(actionUserPersonClipboard.resetUserPersonClipboard(personId, userPersonClipboard, sendTo)),
		getUserPersonClipboard: (personId) => dispatch(actionUserPersonClipboard.init(personId)),
		addUserPersonClipboard: (personId, userPersonClipboard) => dispatch(actionUserPersonClipboard.addUserPersonClipboard(personId, userPersonClipboard)),
		removeStudentUserPersonClipboard: (personId, chosenPersonId, personType) => dispatch(actionUserPersonClipboard.removeStudentUserPersonClipboard(personId, chosenPersonId, personType)),
		getSavedStudentSearch: (personId) => dispatch(actionSaveStudentSearch.init(personId)),
		saveStudentSearch: (personId, studentSearch) => dispatch(actionSaveStudentSearch.saveStudentSearch(personId, studentSearch)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		getStudentCoursesAssigns: (personId, courseScheduledId) => dispatch(actionCourseToSchedule.getStudentCoursesAssigns(personId, courseScheduledId)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, personId, setMyVisitedPage, getSavedStudentSearch, getGuardians, getGradeLevels, getUserPersonClipboard} = this.props;
				getPageLangs(personId, langCode, 'LearnerSearchView');
				getSavedStudentSearch(personId);
				getGuardians(personId);
				getGradeLevels(personId);
				getUserPersonClipboard(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Search for Student (Advanced)`});
		}

    render() {
        return <LearnerSearchView {...this.props} />;
    }
}

export default storeConnector(Container);
