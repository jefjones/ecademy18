import React, {Component} from 'react';
import ReportRecommendCourseView from '../views/ReportRecommendCourseView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseRecommendation from '../actions/course-recommendation.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {  selectMe, selectReportRecommendCourseName, selectReportRecommendByTeacher, selectReportRecommendByStudent } from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);

    return {
				personId: me.personId,
				langCode: me.langCode,
        reportRecommendCourseName: selectReportRecommendCourseName(state),
				reportRecommendByTeacher: selectReportRecommendByTeacher(state),
				reportRecommendByStudent: selectReportRecommendByStudent(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getReportCourseCount: (personId) => dispatch(actionCourseRecommendation.getReportCourseCount(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getReportByTeacher: (personId) => dispatch(actionCourseRecommendation.getReportByTeacher(personId)),
		getReportByStudent: (personId) => dispatch(actionCourseRecommendation.getReportByStudent(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
      const {getPageLangs, langCode, setMyVisitedPage, getReportCourseCount, getReportByTeacher, getReportByStudent, personId} = this.props;
      getPageLangs(personId, langCode, 'ReportRecommendCourseView');
      getReportCourseCount(personId);
			getReportByTeacher(personId);
			getReportByStudent(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Course Recommendation Report`});
  }

  render() {
    return <ReportRecommendCourseView {...this.props} />;
	}
}
export default storeConnector(Container);
