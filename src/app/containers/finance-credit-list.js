import React, {Component} from 'react';
import FinanceCreditListView from '../views/FinanceCreditListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceCredit from '../actions/finance-credit.js';
import * as actionFinanceCreditTypes from '../actions/finance-credit-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceCredits, selectFinanceCreditTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page.
				students: selectStudents(state),
				financeCredits: selectFinanceCredits(state),
				financeCreditTypes: selectFinanceCreditTypes(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceCredits: (personId) => dispatch(actionFinanceCredit.getFinanceCredits(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeFinanceCredit: (personId, financeCreditId) => dispatch(actionFinanceCredit.removeFinanceCredit(personId, financeCreditId)),
		getFinanceCreditTypes: (personId) => dispatch(actionFinanceCreditTypes.getFinanceCreditTypes(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceCredits, getFinanceCreditTypes } = this.props;
    	getPageLangs(personId, langCode, 'FinanceCreditListView');
	    getFinanceCredits(personId);
			getFinanceCreditTypes(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Credit List`});
  }

  render() {
    return <FinanceCreditListView {...this.props} />;
  }
}

export default storeConnector(Container);
