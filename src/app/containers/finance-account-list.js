import React, {Component} from 'react';
import FinanceAccountListView from '../views/FinanceAccountListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceAccountSummaries from '../actions/finance-account-summaries.js';
import * as actionFinanceGroups from '../actions/finance-groups.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceAccountSummaries, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces, selectFetchingRecord, selectStudents,
 					selectFinanceGroups} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

		let viewOptions = [
				{ label: 'All', id: 'All' },
				{ label: 'Billing due', id: 'BillingDue' },
				{ label: 'Lunch due', id: 'LunchDue' },
				{ label: 'Lunch credit', id: 'LunchCredit' },
				{ label: 'Credit positive', id: 'CreditPositive' },
		];

    return {
        personId: me.personId,
        langCode: me.langCode,
				viewOptions,
				onlyAccountSummariesDue: props.params.onlyAccountSummariesDue,
				students: selectStudents(state),
				financeAccountSummaries: selectFinanceAccountSummaries(state),
				financeGroups: selectFinanceGroups(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceAccountSummaries: (personId) => dispatch(actionFinanceAccountSummaries.getFinanceAccountSummaries(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinanceGroups: (personId) => dispatch(actionFinanceGroups.getFinanceGroups(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceAccountSummaries, getFinanceGroups } = this.props;
    	getPageLangs(personId, langCode, 'FinanceAccountListView');
	    getFinanceAccountSummaries(personId);
			getFinanceGroups(personId);
      this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Finance Account List`});
  }

  render() {
    return <FinanceAccountListView {...this.props} />;
  }
}

export default storeConnector(Container);
