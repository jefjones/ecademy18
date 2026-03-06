import React, {Component} from 'react';
import ScheduleAssignByMathView from '../views/ScheduleAssignByMathView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionSchedMath from '../actions/schedule-assign-by-math';
import * as actionCoursesSched from '../actions/course-to-schedule';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionIntervals from '../actions/semester-intervals.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCoursesScheduled, selectScheduleAssignByMath, selectScheduleAssignMathNames, selectPersonConfig, selectCompanyConfig,
 					selectIntervals, selectFetchingRecord} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let scheduledCourses = selectCoursesScheduled(state);
		if (scheduledCourses && scheduledCourses.length > 0) scheduledCourses = scheduledCourses.filter(m => m.courseTypeName === 'Academy');

    return {
        personId: me.personId,
        langCode: me.langCode,
        scheduleAssignByMathId: props.params && props.params.scheduleAssignByMathId,
        mathNames: selectScheduleAssignMathNames(state),
        scheduleAssignByMathList: selectScheduleAssignByMath(state),
        scheduledCourses,
				personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
				intervals: selectIntervals(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getScheduleMathNames: (personId) => dispatch(actionSchedMath.getScheduleMathNames(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getCoursesScheduled: (personId) => dispatch(actionCoursesSched.getCoursesScheduled(personId)),
    getScheduleAssignByMath: (personId, scheduleAssignByMathId) => dispatch(actionSchedMath.getScheduleAssignByMath(personId, scheduleAssignByMathId)),
    removeScheduleAssignByMath: (personId, scheduleAssignByMathId, scheduleAssignByMathCourseAssignId) => dispatch(actionSchedMath.removeScheduleAssignByMath(personId, scheduleAssignByMathId, scheduleAssignByMathCourseAssignId)),
    setScheduleAssignByMath: (personId, selectedCourses, scheduleAssignByMathId) => dispatch(actionSchedMath.setScheduleAssignByMath(personId, selectedCourses, scheduleAssignByMathId)),
		updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getIntervals: (personId)  => dispatch(actionIntervals.init(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getCoursesScheduled, getScheduleMathNames, getScheduleAssignByMath, getIntervals} = this.props;
        getPageLangs(personId, langCode, 'ScheduleAssignByMathView');
        getScheduleAssignByMath(personId, 0);  //Blank this out to start with.
        getScheduleMathNames(personId);
        //getCoursesScheduled(personId);  This is already done at login for everyone.
				getIntervals(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Schedule Assign by Admin`});
    }

    render() {
        return this.props.scheduledCourses && this.props.mathNames ? <ScheduleAssignByMathView {...this.props} /> : null;
    }
}

export default storeConnector(Container);
