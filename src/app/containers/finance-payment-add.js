import React, {Component} from 'react';
import FinancePaymentAddView from '../views/FinancePaymentAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinancePayment from '../actions/finance-payment.js';
import * as actionFinancePaymentTypes from '../actions/finance-payment-types.js';
import * as actionFinanceBilling from '../actions/finance-billing.js';
import * as actionFinanceFeeTypes from '../actions/finance-fee-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionFinanceAccountSummaries from '../actions/finance-account-summaries.js';
import * as actionGuardians from '../actions/guardians.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceBillings, selectFinanceFeeTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces, selectGuardians,
					selectFetchingRecord, selectStudents, selectFinancePaymentTypes, selectFinanceAccountSummaries } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let accessRoles = selectAccessRoles(state);
		let financeBillings = selectFinanceBillings(state);
		financeBillings = financeBillings && financeBillings.length > 0 && financeBillings.filter(m => !m.isPaid && !(m.financeRefunds && m.financeRefunds.length > 0));

		let financePaymentTypes = selectFinancePaymentTypes(state);
		if (!accessRoles.admin && !accessRoles.frontdesk && !accessRoles.finance)
				financePaymentTypes = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.label.indexOf('Cash') === -1);


    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				students: selectStudents(state),
				guardians: selectGuardians(state),
				financeBillings,
				financeFeeTypes: selectFinanceFeeTypes(state),
				financeAccountSummaries: selectFinanceAccountSummaries(state),
				addNewLunchPayment: props.params.addNewLunchPayment,
        companyConfig: selectCompanyConfig(state),
				accessRoles,
				financePaymentTypes,
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeFinanceBilling: (personId, financeBillingId) => dispatch(actionFinanceBilling.removeFinanceBilling(personId, financeBillingId)),
		getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
		getFinancePaymentTypes: (personId) => dispatch(actionFinancePaymentTypes.getFinancePaymentTypes(personId)),
		addOrUpdateFinancePayment: (personId, financePayment, runFunction) => dispatch(actionFinancePayment.addOrUpdateFinancePayment(personId, financePayment, runFunction)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		getFinanceAccountSummaries: (personId) => dispatch(actionFinanceAccountSummaries.getFinanceAccountSummaries(personId)),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getGuardians, getFinanceBillings, getFinanceFeeTypes, getFinancePaymentTypes, getFinanceAccountSummaries } = this.props;
    	getPageLangs(personId, langCode, 'FinancePaymentAddView');
	    getFinanceBillings(personId);
			getFinanceFeeTypes(personId);
			getFinancePaymentTypes(personId);
			getFinanceAccountSummaries(personId);
			getGuardians(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Payment`});
  }

  render() {
    return <FinancePaymentAddView {...this.props} />;
  }
}

export default storeConnector(Container);
