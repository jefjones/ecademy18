import React, {Component} from 'react';
import AssessmentPendingEssayView from '../views/AssessmentPendingEssayView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionAssessmentCorrect from '../actions/assessment-correct.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectStudents, selectAccessRoles, selectFetchingRecord, selectAssessmentPendingEssay } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

		let testTypeFilter = [{
				label: 'All',
				id: 'all',
			},
			{
				label: 'Quiz',
				id: 'QUIZ',
			},
			{
				label: 'Exams',
				id: 'MIDTERM',
			},
			{
				label: 'Final',
				id: 'FINAL',
			},
		];

    return {
        personId: me.personId,
        langCode: me.langCode,
				testTypeFilter,
        accessRoles: selectAccessRoles(state),
        studentFullName: me.fname + ' ' + me.lname,
        studentPersonId: props.params && props.params.studentPersonId,
        assessmentId: props.params && props.params.assessmentId,
        students: selectStudents(state),
				fetchingRecord: selectFetchingRecord(state),
				assessmentPendingEssay: selectAssessmentPendingEssay(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getAssessmentsPendingEssay: (personId) => dispatch(actionAssessmentCorrect.getAssessmentsPendingEssay(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getAssessmentsPendingEssay} = this.props;
        getPageLangs(personId, langCode, 'AssessmentPendingEssayView');
				getAssessmentsPendingEssay(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Assessment pending essay`});
    }

    render() {
			return <AssessmentPendingEssayView {...this.props} />;
    }
}

export default storeConnector(Container);
