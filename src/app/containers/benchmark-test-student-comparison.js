import React, {Component} from 'react';
import BenchmarkTestStudentComparisonView from '../views/BenchmarkTestStudentComparisonView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBenchmarkTextReport from '../actions/benchmark-test-report.js';
import * as actionBenchmarkTests from '../actions/benchmark-tests.js';
import * as actionStandardardsRating from '../actions/standards-rating.js';
import {guidEmpty} from '../utils/guidValidate.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFetchingRecord, selectStandardsRating, selectBenchmarkTestStudentComparison, selectBenchmarkTests, selectAccessRoles} from '../store.js';

//The difference between the class comparison and the student comparison report is right HERE:  We will split out the various students into their own listed
//	from the TestAssign's ScoredAnswer.
//			Class
//			   testAssign
//						ScoredAnswers (which goes to the StandardsAssignmentResult component for standards circle display)
//
//  which will be converted now to:
//			Class
//			   StudentTest
//			   		TestAssign (in order to list the scored answers to the first test taking, second test taking, third test taking, .... to the last attempt)
//								ScoredAnswers (which goes to the StandardsAssignmentResult component for standards circle display)
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let benchmarkTestStudentComparison = selectBenchmarkTestStudentComparison(state);
		let standardsRatings = selectStandardsRating(state);
		let standardsRatingTableId = '';
		benchmarkTestStudentComparison && benchmarkTestStudentComparison.length > 0 && benchmarkTestStudentComparison.forEach(m => {
				if (m.standardsRatingTableId && m.standardsRatingTableId !== guidEmpty) {
						standardsRatingTableId = m.standardsRatingTableId
				}
		});
		standardsRatings = standardsRatingTableId && standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId);

    return {
        personId: me.personId,
        langCode: me.langCode,
				benchmarkTestId: props.params.benchmarkTestId,
				benchmarkTestStudentComparison,
				standardsRatings,
				standardsRatingTableId,
				benchmarkTests: selectBenchmarkTests(state),
				fetchingRecord: selectFetchingRecord(state),
				accessRoles: selectAccessRoles(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getBenchmarkTestStudentComparison: (personId, benchmarkTestId) => dispatch(actionBenchmarkTextReport.getBenchmarkTestStudentComparison(personId, benchmarkTestId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getBenchmarkTests: (personId) => dispatch(actionBenchmarkTests.getBenchmarkTests(personId)),
		getStandardsRating: (personId) => dispatch(actionStandardardsRating.getStandardsRating(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getBenchmarkTestStudentComparison, getBenchmarkTests, benchmarkTestId, getStandardsRating} = this.props;
        getPageLangs(personId, langCode, 'BenchmarkTestStudentComparisonView');
				benchmarkTestId && benchmarkTestId !== guidEmpty && getBenchmarkTestStudentComparison(personId, benchmarkTestId);
				getBenchmarkTests(personId);
				getStandardsRating(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Benchmark Test Student Comparison`});
    }

    render() {
        return <BenchmarkTestStudentComparisonView {...this.props} />;
    }
}

export default storeConnector(Container);
