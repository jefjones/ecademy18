import React, {Component} from 'react';
import ReportCourseWaitListView from '../views/ReportCourseWaitListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionWaitList from '../actions/course-wait-list.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {  selectMe, selectReportExcelCourseWaitList, selectCoursesBase, selectDoNotAddCourses, selectFetchingRecord, selectCompanyConfig,
						selectUsers, selectClassPeriods, selectLearningPathways, selectIntervals, selectDepartments} from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);

    return {
				personId: me.personId,
				langCode: me.langCode,
        reportExcelCourseWaitList: selectReportExcelCourseWaitList(state),
				coursesBase: selectCoursesBase(state),
				doNotAddCourses: selectDoNotAddCourses(state),
				fetchingRecord: selectFetchingRecord(state),
				companyConfig: selectCompanyConfig(state),
				teachers: selectUsers(state),
				classPeriods: selectClassPeriods(state),
				learningPathways: selectLearningPathways(state),
				intervals: selectIntervals(state),
				departments: selectDepartments(state),

    }
};

const bindActionsToDispatch = dispatch => ({
		getReportCourseWaitListCount: (personId) => dispatch(actionWaitList.getReportCourseWaitListCount(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleDoNotAddCourse: (personId, courseEntryId) => dispatch(actionWaitList.toggleDoNotAddCourse(personId, courseEntryId)),
		getDoNotAddCourse: (personId) => dispatch(actionWaitList.getDoNotAddCourse(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
      const {getPageLangs, langCode, personId, setMyVisitedPage, getReportCourseWaitListCount, getDoNotAddCourse} = this.props;
      getPageLangs(personId, langCode, 'ReportCourseWaitListView');
      getReportCourseWaitListCount(personId);
			getDoNotAddCourse(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Course Wait List`});
  }

  render() {
    return <ReportCourseWaitListView {...this.props} />;
	}
}
export default storeConnector(Container);
