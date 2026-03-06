import React, {Component} from 'react';
import FinanceRefundListView from '../views/FinanceRefundListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceRefund from '../actions/finance-refund.js';
import * as actionFinanceBilling from '../actions/finance-billing.js';
import * as actionFinanceFeeTypes from '../actions/finance-fee-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceBillings, selectFinanceFeeTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents, selectFinanceRefunds } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				financeRefunds: selectFinanceRefunds(state),
				students: selectStudents(state),
				financeBillings: selectFinanceBillings(state),
				financeFeeTypes: selectFinanceFeeTypes(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceRefunds: (personId) => dispatch(actionFinanceRefund.getFinanceRefunds(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		removeFinanceBilling: (personId, financeBillingId) => dispatch(actionFinanceBilling.removeFinanceBilling(personId, financeBillingId)),
		getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceBillings, getFinanceFeeTypes, getFinanceRefunds} = this.props;
    	getPageLangs(personId, langCode, 'FinanceRefundListView');
	    getFinanceBillings(personId);
			getFinanceFeeTypes(personId);
			getFinanceRefunds(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Refund List`});
  }

  render() {
    return <FinanceRefundListView {...this.props} />;
  }
}

export default storeConnector(Container);
