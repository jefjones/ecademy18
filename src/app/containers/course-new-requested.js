import React, {Component} from 'react';
import CourseNewRequestedView from '../views/CourseNewRequestedView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseNewRequested from '../actions/course-new-requested';
import * as actionLearningPathways from '../actions/learning-pathways.js';
import * as actionIntervals from '../actions/semester-intervals.js';
import * as actionClassPeriods from '../actions/class-periods.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCourseNewRequested, selectCompanyConfig, selectAccessRoles, selectLearners, selectClassPeriods, selectCourseTypes,
					selectPersonConfig, selectLearningPathways, selectIntervals, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

		let courseNewRequested = selectCourseNewRequested(state);
		let accessRoles = selectAccessRoles(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId: accessRoles.learner ? me.personId : props.params && props.params.studentPersonId ? props.params.studentPersonId : '',
				courseNewRequested,
        companyConfig: selectCompanyConfig(state),
				accessRoles,
				students: selectLearners(state),
				classPeriods: selectClassPeriods(state),
				learningPathways: selectLearningPathways(state),
				courseTypes: selectCourseTypes(state),
				personConfig: selectPersonConfig(state),
				intervals: selectIntervals(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getCourseNewRequested: (personId) => dispatch(actionCourseNewRequested.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		//Let's not save the personconfig or even use previous settings on this page since it will throw off the other search page.
		//updatePersonConfig: (personId, field, value) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		getIntervals: (personId) => dispatch(actionIntervals.init(personId)),
		getClassPeriods: (personId) => dispatch(actionClassPeriods.init(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
		    const {getPageLangs, langCode, personId, setMyVisitedPage, getCourseNewRequested, getLearningPathways, getIntervals, getClassPeriods} = this.props;
		    getPageLangs(personId, langCode, 'CourseNewRequestedView');
				getCourseNewRequested(personId);
				getLearningPathways(personId);
				getIntervals(personId);
				getClassPeriods(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `New Courses Requested`});
	  }

	  render() {
	    	return <CourseNewRequestedView {...this.props} />;
	  }
}

export default storeConnector(Container);
