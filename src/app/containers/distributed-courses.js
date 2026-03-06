import React, {Component} from 'react';
import DistributedCoursesView from '../views/DistributedCoursesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionDistributedCourses from '../actions/distributed-courses';
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectDistributedCourses, selectPersonConfig, selectFetchingRecord,
					selectGradeLevels } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				distributedCourses: selectDistributedCourses(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				students: selectStudents(state),
				personConfig: selectPersonConfig(state),
				fetchingRecord: selectFetchingRecord(state),
				gradeLevels: selectGradeLevels(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getDistributedCourses: (personId) => dispatch(actionDistributedCourses.getDistributedCourses(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		activateDistributedCourses: (personId, courseAssignByAdminId) => dispatch(actionDistributedCourses.activateDistributedCourses(personId, courseAssignByAdminId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
		    const {getPageLangs, langCode, personId, setMyVisitedPage, getDistributedCourses} = this.props;
		    getPageLangs(personId, langCode, 'DistributedCoursesView');
				getDistributedCourses(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Distributed Courses`});
	  }

	  render() {
	    	return <DistributedCoursesView {...this.props} />;
	  }
}

export default storeConnector(Container);
