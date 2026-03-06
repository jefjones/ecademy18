import React, {Component} from 'react';
import CourseWeightedScoreView from '../views/CourseWeightedScoreView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCourseWeightedScore from '../actions/course-weighted-score';
import * as actionContentTypes from '../actions/content-types.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCourseWeightedScore, selectCompanyConfig, selectCoursesBase, selectContentTypes, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let courseEntryId = props.params && props.params.courseEntryId;
		let courses = selectCoursesBase(state);
		let course = (courseEntryId && courses && courses.length > 0 && courses.filter(m => m.courseEntryId === courseEntryId)[0]) || {}
		let weightedScores = selectCourseWeightedScore(state);
		let contentTypes = selectContentTypes(state);

		// //In case there is not a currently entered weightedScore set of records.
		if (!weightedScores || weightedScores.length === 0) {
				weightedScores = contentTypes && contentTypes.length > 0 && contentTypes.map(m => ({
						contentTypeId: m.id,
						contentTypeName: m.label,
						scorePercent: '',
						courseEntryId,
						blankRecords: true
				}))
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
				courseEntryId,
				course,
				contentTypes,
        weightedScores,
				companyConfig: selectCompanyConfig(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getCourseWeightedScore: (courseEntryId) => dispatch(actionCourseWeightedScore.init(courseEntryId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updateCourseWeightedScores: (personId, courseEntryId, weightedScores) => dispatch(actionCourseWeightedScore.updateCourseWeightedScores(personId, courseEntryId, weightedScores)),
		clearCourseWeightedScores: () => dispatch(actionCourseWeightedScore.clearCourseWeightedScores()),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getCourseWeightedScore, courseEntryId, getContentTypes} = this.props;
        getPageLangs(personId, langCode, 'CourseWeightedScoreView');
        getCourseWeightedScore(courseEntryId);
				getContentTypes(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Course Weighted Score`});
    }

    render() {
        return this.props.courseEntryId ? <CourseWeightedScoreView {...this.props} /> : null;
    }
}

export default storeConnector(Container);
