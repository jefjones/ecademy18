import React, {Component} from 'react';
import FinancePaymentReceiptView from '../views/FinancePaymentReceiptView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinancePayment from '../actions/finance-payment.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceBillings, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces, selectFetchingRecord,
					selectFinancePayments } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let financePaymentTableId = props.params.financePaymentTableId;
		let financePayments = selectFinancePayments(state);
		let financePayment = financePaymentTableId && financePayments && financePayments.length > 0 && financePayments.filter(m => m.financePaymentTableId === financePaymentTableId)[0];

    return {
        personId: me.personId,
        langCode: me.langCode,
				financePaymentTableId,
				financePayments,
				financePayment,
				financeBillings: selectFinanceBillings(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinancePayments: (personId) => dispatch(actionFinancePayment.getFinancePayments(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinancePaymentBillings: (personId, financePaymentTableId) => dispatch(actionFinancePayment.getFinancePaymentBillings(personId, financePaymentTableId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinancePaymentBillings, getFinancePayments, financePaymentTableId } = this.props;
    	getPageLangs(personId, langCode, 'FinancePaymentReceiptView');
			financePaymentTableId && getFinancePaymentBillings(personId, financePaymentTableId);
	    getFinancePayments(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Payment Receipt`});
  }

  render() {
    return <FinancePaymentReceiptView {...this.props} />;
  }
}

export default storeConnector(Container);
