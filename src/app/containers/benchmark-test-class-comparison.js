import React, {Component} from 'react';
import BenchmarkTestClassComparisonView from '../views/BenchmarkTestClassComparisonView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBenchmarkTextReport from '../actions/benchmark-test-report.js';
import * as actionBenchmarkTests from '../actions/benchmark-tests.js';
import * as actionStandardardsRating from '../actions/standards-rating.js';
import {guidEmpty} from '../utils/guidValidate.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFetchingRecord, selectStandardsRating, selectBenchmarkTestClassComparison, selectBenchmarkTests} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let benchmarkTestClassComparison = selectBenchmarkTestClassComparison(state);
		let standardsRatings = selectStandardsRating(state);
		let standardsRatingTableId = '';
		benchmarkTestClassComparison && benchmarkTestClassComparison.length > 0 && benchmarkTestClassComparison.forEach(m => {
				if (m.standardsRatingTableId && m.standardsRatingTableId !== guidEmpty) {
						standardsRatingTableId = m.standardsRatingTableId
				}
		});
		standardsRatings = standardsRatingTableId && standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId);

    return {
        personId: me.personId,
        langCode: me.langCode,
				benchmarkTestId: props.params.benchmarkTestId,
				benchmarkTestClassComparison,
				standardsRatings,
				standardsRatingTableId,
				benchmarkTests: selectBenchmarkTests(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getBenchmarkTestClassComparison: (personId, benchmarkTestId) => dispatch(actionBenchmarkTextReport.getBenchmarkTestClassComparison(personId, benchmarkTestId)),
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
        const {getPageLangs, langCode, personId, setMyVisitedPage, getBenchmarkTestClassComparison, getBenchmarkTests, benchmarkTestId, getStandardsRating} = this.props;
        getPageLangs(personId, langCode, 'BenchmarkTestClassComparisonView');
				benchmarkTestId && benchmarkTestId !== guidEmpty && getBenchmarkTestClassComparison(personId, benchmarkTestId);
				getBenchmarkTests(personId);
				getStandardsRating(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Benchmark Test Class Comparison`});
    }

    render() {
        return <BenchmarkTestClassComparisonView {...this.props} />;
    }
}

export default storeConnector(Container);
