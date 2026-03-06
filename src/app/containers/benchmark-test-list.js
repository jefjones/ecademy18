import React, {Component} from 'react';
import BenchmarkTestListView from '../views/BenchmarkTestListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBenchmarkTests from '../actions/benchmark-tests.js';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import { selectMe, selectFetchingRecord, selectBenchmarkTests, selectCompanyConfig, selectAccessRoles, selectPersonConfig,
					selectUsers, selectMyFrequentPlaces } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let benchmarkTests = selectBenchmarkTests(state);
    let sequenceCount = benchmarkTests && benchmarkTests.length;
		let firstSequence = benchmarkTests && benchmarkTests.length && benchmarkTests[0].sequence;
		firstSequence = firstSequence ? firstSequence : 1;
    let sequences = [];
    for(var i = firstSequence; i <= String(Number(sequenceCount) + Number(firstSequence)); i++) {
        let option = { id: String(i), value: String(i), label: String(i)};
        sequences = sequences ? sequences.concat(option) : [option];
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
				companyConfig: selectCompanyConfig(state),
        personConfig: selectPersonConfig(state),
        benchmarkTests,
				facilitators: selectUsers(state, 'Facilitator'),
        sequences,
        fetchingRecord: selectFetchingRecord(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getBenchmarkTests: (personId) => dispatch(actionBenchmarkTests.getBenchmarkTests(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addOrUpdateBenchmarkTest: (personId, benchmarkTest) => dispatch(actionBenchmarkTests.addOrUpdateBenchmarkTest(personId, benchmarkTest)),
		rateBenchmarkTest: (personId, benchmarkTestId, rating) => dispatch(actionBenchmarkTests.rateBenchmarkTest(personId, benchmarkTestId, rating)),
    reorderBenchmarkTests: (personId, benchmarkTestId, newSequence) => dispatch(actionBenchmarkTests.reorderBenchmarkTests(personId, benchmarkTestId, newSequence)),
		updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		removeBenchmarkTest: (personId, benchmarkTestId, runFunction) => dispatch(actionBenchmarkTests.removeBenchmarkTest(personId, benchmarkTestId, runFunction)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		sharedTeachersBenchmarkTest: (personId, benchmarkTestId, sharedTeachers) => dispatch(actionBenchmarkTests.sharedTeachersBenchmarkTest(personId, benchmarkTestId, sharedTeachers)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
	constructor(props) {
			super(props);

			this.state = {
					isInit: false,
			}
	}

  componentDidMount() {
      const {getPageLangs, langCode, personId, setMyVisitedPage, getBenchmarkTests} = this.props;
      getPageLangs(personId, langCode, 'BenchmarkTestListView');
      getBenchmarkTests(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Benchmark test list`});
  }

  render() {
    return <BenchmarkTestListView {...this.props} />;
	}
}
export default storeConnector(Container);
