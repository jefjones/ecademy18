import React, {Component} from 'react';
import ReportStudentRegistrationView from '../views/ReportStudentRegistrationView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionStudentRegistration from '../actions/report-student-registration.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {  selectMe, selectReportStudentRegistration, selectReportCourseSeatStatus, selectReportStudentCourseAssign } from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);

    return {
				personId: me.personId,
				langCode: me.langCode,
				reportStudentRegistration: selectReportStudentRegistration(state),
        reportCourseSeatStatus: selectReportCourseSeatStatus(state),
				reportStudentCourseAssign: selectReportStudentCourseAssign(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getReportStudentRegistration: (personId) => dispatch(actionStudentRegistration.getReportStudentRegistration(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getReportCourseSeatStatus: (personId) => dispatch(actionStudentRegistration.getReportCourseSeatStatus(personId)),
		getReportStudentCourseAssign: (personId) => dispatch(actionStudentRegistration.getReportStudentCourseAssign(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
	      const {getPageLangs, langCode, personId, setMyVisitedPage, getReportStudentRegistration, getReportCourseSeatStatus, getReportStudentCourseAssign} = this.props;
	      getPageLangs(personId, langCode, 'ReportStudentRegistrationView');
				getReportStudentRegistration(personId);
	      getReportCourseSeatStatus(personId);
				getReportStudentCourseAssign(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Student Registration Report`});
	  }

	  render() {
		    return <ReportStudentRegistrationView {...this.props} />;
		}
}
export default storeConnector(Container);
