import React, {Component} from 'react';
import CourseAssignByAdminAddView from '../views/CourseAssignByAdminAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseAssignByAdmin from '../actions/course-assign-by-admin';
import * as actionLearningPathways from '../actions/learning-pathways.js';
import * as actionDepartment from '../actions/department.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectCoursesBase, selectPersonConfig, selectLearningPathways,
					selectFetchingRecord, selectGradeLevels, selectCoursesScheduled } from '../store.js'; //, selectDepartments

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
				me,
				langCode: me.langCode,
        personId: me.personId,
				baseCourses: selectCoursesBase(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				students: selectStudents(state),
				learningPathways: selectLearningPathways(state),
				personConfig: selectPersonConfig(state),
				fetchingRecord: selectFetchingRecord(state),
				//departments: selectDepartments(state),
				gradeLevels: selectGradeLevels(state),
				coursesScheduled: selectCoursesScheduled(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		addCourseAssignByAdmin: (studentPersonId, courseAssignByAdmin, runFunction) => dispatch(actionCourseAssignByAdmin.addCourseAssignByAdmin(studentPersonId, courseAssignByAdmin, runFunction)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		getDepartments: (personId) => dispatch(actionDepartment.init(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
		    const {getPageLangs, langCode, personId, setMyVisitedPage, getDepartments, getLearningPathways} = this.props;
		    getPageLangs(personId, langCode, 'CourseAssignByAdminAddView');
				getLearningPathways(personId);
				getDepartments(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Course Assign by Admin`});
	  }

	  render() {
	    	return <CourseAssignByAdminAddView {...this.props} />;
	  }
}

export default storeConnector(Container);
