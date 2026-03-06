import React, {Component} from 'react';
import CourseAssignByAdminListView from '../views/CourseAssignByAdminListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseAssignByAdmin from '../actions/course-assign-by-admin';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectCourseAssignByAdmins, selectPersonConfig, selectFetchingRecord,
					selectGradeLevels } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				courseAssignByAdmins: selectCourseAssignByAdmins(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				students: selectStudents(state),
				personConfig: selectPersonConfig(state),
				fetchingRecord: selectFetchingRecord(state),
				gradeLevels: selectGradeLevels(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getCourseAssignByAdmins: (personId) => dispatch(actionCourseAssignByAdmin.getCourseAssignByAdmins(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeCourseAssignByAdmin: (personId, courseAssignByAdminId, runFunction) => dispatch(actionCourseAssignByAdmin.removeCourseAssignByAdmin(personId, courseAssignByAdminId, runFunction)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
		    const {getPageLangs, langCode, personId, setMyVisitedPage, getCourseAssignByAdmins} = this.props;
		    getPageLangs(personId, langCode, 'CourseAssignByAdminListView');
				getCourseAssignByAdmins(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Course Assign by Admin List`});
	  }

	  render() {
	    	return <CourseAssignByAdminListView {...this.props} />;
	  }
}

export default storeConnector(Container);
