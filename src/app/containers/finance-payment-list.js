import React, {Component} from 'react';
import FinancePaymentListView from '../views/FinancePaymentListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinancePayment from '../actions/finance-payment.js';
import * as actionFinancePaymentTypes from '../actions/finance-payment-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceBillings, selectFinancePaymentTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents, selectFinancePayments } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				financePayments: selectFinancePayments(state),
				students: selectStudents(state),
				financeBillings: selectFinanceBillings(state),
				financePaymentTypes: selectFinancePaymentTypes(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinancePayments: (personId) => dispatch(actionFinancePayment.getFinancePayments(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinancePaymentBillings: (personId, financePaymentTableId, runFunction) => dispatch(actionFinancePayment.getFinancePaymentBillings(personId, financePaymentTableId, runFunction)),
		getFinancePaymentTypes: (personId) => dispatch(actionFinancePaymentTypes.getFinancePaymentTypes(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinancePaymentTypes, getFinancePayments} = this.props;
    	getPageLangs(personId, langCode, 'FinancePaymentListView');
			getFinancePayments(personId);
			getFinancePaymentTypes(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Payment`});
  }

  render() {
    return <FinancePaymentListView {...this.props} />;
  }
}

export default storeConnector(Container);
