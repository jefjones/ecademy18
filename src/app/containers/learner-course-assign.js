import React, {Component} from 'react';
import LearnerCourseAssignView from '../views/LearnerCourseAssignView';
import { connect } from 'react-redux';
import {guidEmpty} from '../utils/guidValidate.js';
import * as actionUserPersonClipboard from '../actions/user-person-clipboard.js';
import * as actionCourseClipboard from '../actions/course-clipboard.js';
import * as actionPageLang from '../actions/language-list';
import * as actionAnnouncement from '../actions/announcements';
import * as actionLearnerCourseAssign from '../actions/learner-course-assign';
import * as actionCourseRecommendation from '../actions/course-recommendation';
import * as actionLearnerFilter from '../actions/learner-filter.js';
import * as actionCourseFilter from '../actions/course-filter.js';
import * as actionCourseToSchedule from '../actions/course-to-schedule.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionStudentSchedule from '../actions/student-schedule.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectLearningPathways, selectUsers, selectStudents, selectMe, selectLearnerFilter, selectCoursesScheduled,
					selectCoursesBase, selectCourseFilter, selectCompanyConfig, selectAccessRoles, selectGradeLevels, selectUserPersonClipboard,
					selectCourseClipboard, selectMyFrequentPlaces, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let companyConfig = selectCompanyConfig(state);
		let accessRoles = selectAccessRoles(state);
    const {personal, timeTarget, studentPersonId, courseScheduledId} = props.params;

    let learnerHeadings = [{label: ''}, {label: companyConfig.isMcl ? 'Learner Name' : 'Student Name', tightText: true}, {label: 'Birth Date', tightText: true}];
    let courseHeadings = [{label: ''}, {label: 'Name', tightText: true}, {label: companyConfig.isMcl ? 'Facilitator' : 'Teacher', tightText: true}, {label: 'Schedule', tightText: true}];
    let conflictHeadings = [{label: ''}, {label: companyConfig.isMcl ? 'Learner Name' : 'Student Name', tightText: true}, {label: 'Conflict', tightText: true}];

    //help:  We still need to get the course assignments in order to determine if there are any conflicts.  But do that on a one-by-one basis for each student.
    let students = selectStudents(state);
		let userPersonClipboard = selectUserPersonClipboard(state);
		let clipboardStudents = [];
		if (students && students.length > 0 && userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0) {
				clipboardStudents = students.filter(m => userPersonClipboard.personList.indexOf(m.studentPersonId) > -1);
		}

		let courseEntries = selectCoursesBase(state);
		let scheduledCourses = selectCoursesScheduled(state);
		let clipboard = selectCourseClipboard(state);
		let clipboardCourses = [];
		let courseListType = companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor)
				? 'courseEntry'
				: 'courseScheduled';

		if (clipboard && clipboard.courseList && clipboard.courseList.length > 0) {
				if (clipboard.courseListType === 'courseEntry' && courseEntries && courseEntries.length > 0) {
						clipboardCourses = courseEntries.filter(m => clipboard.courseList.indexOf(m.courseEntryId) > -1) || [];
				} else if (scheduledCourses && scheduledCourses.length > 0) {
						clipboardCourses = scheduledCourses.filter(m => clipboard.courseList.indexOf(m.courseScheduledId) > -1) || [];
				}
		}

    let learnerFilterList = selectLearnerFilter(state);
    let learnerFilterOptions = learnerFilterList && learnerFilterList.length > 0 && learnerFilterList.filter(m => !m.scratchFlag);
    learnerFilterOptions = learnerFilterOptions && learnerFilterOptions.length > 0
        && learnerFilterOptions.map(m => ({id: m.learnerFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}));
    let filterScratch_learner = learnerFilterList && learnerFilterList.length > 0 && learnerFilterList.filter(m => m.scratchFlag)[0];

    if (students && filterScratch_learner.birthDateFrom && filterScratch_learner.birthDateTo) {
        students = students.filter(w => w.birthDate >= filterScratch_learner.birthDateFrom && w.birthDate <= filterScratch_learner.birthDateTo);
    } else if (students && filterScratch_learner.birthDateFrom) {
        students = students.filter(w => w.birthDate >= filterScratch_learner.birthDateFrom);
    } else if (students && filterScratch_learner.birthDateTo) {
        students = students.filter(w => w.birthDate <= filterScratch_learner.birthDateTo);
    }
    if (students && filterScratch_learner.learningPathwayId) {
        students = !!students.courses && students.courses.filter(w => w.learningPathwayId === filterScratch_learner.learningPathwayId);
    }
    if (students && filterScratch_learner.learningFocusAreaId) {
        students = !!students.courses && students.courses.filter(w => w.learningFocusAreaId === filterScratch_learner.learningFocusAreaId);
    }
    if (students && filterScratch_learner.selectedLearnerOutcomeTargets) {
        students = !!students.learnerOutcomes && students.learnerOutcomes.filter(w => w.gradeTarget === filterScratch_learner.selectedLearnerOutcomeTargets);
    }
    if (students && filterScratch_learner.selectedLearnerOutcomes) {
        students = !!students.courses && students.courses.filter(w => filterScratch_learner.selectedLearnerOutcomes.includes(w.learnerOutcomeId));
    }
    if (students && filterScratch_learner.facilitatorPersonId && filterScratch_learner.facilitatorPersonId !== guidEmpty) {
        students = !!students.courses && students.courses.filter(w => w.facilitatorPersonId === filterScratch_learner.facilitatorPersonId);
    }
    if (students && filterScratch_learner.mentorPersonId && filterScratch_learner.mentorPersonId !== guidEmpty) {
        students = students.filter(w => w.mentorPersonId === filterScratch_learner.mentorPersonId);
    }

    if (students && filterScratch_learner.loProficient) {
        students = !!students.learnerOutcomes && students.learnerOutcomes.filter(w => w.rating === 'proficient');
    }
    if (students && filterScratch_learner.loInProgress) {
        students = !!students.learnerOutcomes && students.learnerOutcomes.filter(w => w.rating === 'inProgress');
    }
    if (students && filterScratch_learner.loNotStarted) {
        students = !!students.learnerOutcomes && students.learnerOutcomes.filter(w => w.rating === 'notStarted' || !w.rating);
    }

    /* Courses and course filters */
    let courseFilterList = selectCourseFilter(state);
    let courseFilterOptions = courseFilterList && courseFilterList.length > 0 && courseFilterList.filter(m => !m.scratchFlag);
    courseFilterOptions = courseFilterOptions && courseFilterOptions.length > 0
        && courseFilterOptions.map(m => ({id: m.courseFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}));
    let filterScratch_course = courseFilterList && courseFilterList.length > 0 && courseFilterList.filter(m => m.scratchFlag)[0];
		let courses = scheduledCourses;

    if (courses && filterScratch_course.learningPathwayId) {
        courses = !!courses && courses.filter(w => w.learningPathwayId === filterScratch_course.learningPathwayId);
    }
    if (courses && filterScratch_course.learningFocusAreaId) {
        courses = !!courses && courses.filter(w => w.learningFocusAreaId === filterScratch_course.learningFocusAreaId);
    }
    if (courses && filterScratch_course.selectedLearnerOutcomeTargets) {
        courses = !!courses.learnerOutcomes && courses.learnerOutcomes.filter(w => w.gradeTarget === filterScratch_course.selectedLearnerOutcomeTargets);
    }
    if (courses && filterScratch_course.selectedLearnerOutcomes) {
        courses = !!courses && courses.filter(w => filterScratch_course.selectedLearnerOutcomes.includes(w.learnerOutcomeId));
    }
    if (courses && filterScratch_course.facilitatorPersonId && filterScratch_course.facilitatorPersonId !== guidEmpty) {
        courses = !!courses && courses.filter(m => {
						let found = false;
						m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
								if (t.id === filterScratch_course.facilitatorPersonId) found = true;
						});
						return found;
				});
    }

    return {
				clipboardStudents,
				langCode: me.langCode,
				clipboardCourses,
				courseListType,
        personal,
        timeTarget,
				courseScheduledId,
        studentPersonId, //This implies that this param that is coming in is the student who is logged in and signing up for a course OR that the admin is assigning a new course to this student.
        personId: me.personId,
        students,
        courses,
        mentors: selectUsers(state, 'Mentor'),
        facilitators: selectUsers(state, 'Facilitator'),
        learningPathways: selectLearningPathways(state),
        // learnerOutcomes: selectLearnerOutcomes(state),
        // learnerOutcomeTargets: selectLearnerOutcomeTargets(state),
        // learningFocusAreas: selectLearningFocusAreas(state),
        learnerFilterOptions,
        courseFilterOptions,
        filterScratch_learner,
        filterScratch_course,
        savedFilterIdCurrent_learner: filterScratch_learner && filterScratch_learner.savedFilterIdCurrent,
        savedFilterIdCurrent_course: filterScratch_course && filterScratch_course.savedFilterIdCurrent,
        learnerHeadings,
        courseHeadings,
        conflictHeadings,
        companyConfig,
				accessRoles,
				gradeLevels: selectGradeLevels(state),
				scheduledCourses: selectCoursesScheduled(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		addLearnerCourseAssign: (personId, students, courses, getStudentSchedule_personId) => dispatch(actionLearnerCourseAssign.addLearnerCourseAssign(personId, students, courses, getStudentSchedule_personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addLearnerCourseRecommended: (personId, students, courses) => dispatch(actionCourseRecommendation.addLearnerCourseRecommended(personId, students, courses)),
    coursesInit: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
    learnerFilterInit: (personId) => dispatch(actionLearnerFilter.init(personId)),
    courseFilterInit: (personId) => dispatch(actionCourseFilter.init(personId)),
    clearFilters_learner: (personId) => dispatch(actionLearnerFilter.clearFilters(personId)),
    clearFilters_course: (personId) => dispatch(actionCourseFilter.clearFilters(personId)),
    saveNewSavedSearch_learner: (personId, savedSearchName) => dispatch(actionLearnerFilter.saveNewSavedSearch(personId, savedSearchName)),
    saveNewSavedSearch_course: (personId, savedSearchName) => dispatch(actionCourseFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.updateSavedSearch(personId, learnerFilterId)),
    updateSavedSearch_course: (personId, learnerFilterId) => dispatch(actionCourseFilter.updateSavedSearch(personId, learnerFilterId)),
    deleteSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.deleteSavedSearch(personId, learnerFilterId)),
    deleteSavedSearch_course: (personId, learnerFilterId) => dispatch(actionCourseFilter.deleteSavedSearch(personId, learnerFilterId)),
    chooseSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.chooseSavedSearch(personId, learnerFilterId)),
    chooseSavedSearch_course: (personId, learnerFilterId) => dispatch(actionCourseFilter.chooseSavedSearch(personId, learnerFilterId)),
    updateFilterByField_learner: (personId, field, value) => dispatch(actionLearnerFilter.updateFilterByField(personId, field, value)),
    updateFilterByField_course: (personId, field, value) => dispatch(actionCourseFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag_learner: (personId, savedFilterIdCurrent, setValue) => dispatch(actionLearnerFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    updateFilterDefaultFlag_course: (personId, savedFilterIdCurrent, setValue) => dispatch(actionCourseFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		removeAllUserPersonClipboard: (personId, personType) => dispatch(actionUserPersonClipboard.removeAllUserPersonClipboard(personId, personType)),
		removeStudentUserPersonClipboard: (personId, chosenPersonId, personType) => dispatch(actionUserPersonClipboard.removeStudentUserPersonClipboard(personId, chosenPersonId, personType)),
		singleRemoveCourseClipboard: (personId, chosenCourseId, courseListType) => dispatch(actionCourseClipboard.singleRemoveCourseClipboard(personId, chosenCourseId, courseListType)),
		removeAllCourseClipboard: (personId, courseListType) => dispatch(actionCourseClipboard.removeAllCourseClipboard(personId, courseListType)),
		getUserPersonClipboard: (personId, personType) => dispatch(actionUserPersonClipboard.init(personId, personType)),
		getCourseClipboard: (personId, courseListType) => dispatch(actionCourseClipboard.init(personId, courseListType)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
    mergeAllProps
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getUserPersonClipboard, getCourseClipboard, companyConfig, accessRoles} = this.props;
        getPageLangs(personId, langCode, 'LearnerCourseAssignView');
				getUserPersonClipboard(personId, 'STUDENT');
				getCourseClipboard(personId, companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor)
						? 'courseEntry'
						: 'courseScheduled')
				this.props.location && this.props.location.pathname && this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Assign Course to Student`});
    }

    render() {
        return <LearnerCourseAssignView {...this.props} />;
    }
}

export default storeConnector(Container);
