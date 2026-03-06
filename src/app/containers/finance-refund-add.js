import React, {Component} from 'react';
import FinanceRefundAddView from '../views/FinanceRefundAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceBilling from '../actions/finance-billing.js';
import * as actionFinanceFeeTypes from '../actions/finance-fee-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceBillings, selectFinanceFeeTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let financeBillings = selectFinanceBillings(state);
		financeBillings = financeBillings && financeBillings.length > 0 && financeBillings.filter(m => m.isPaid && !(m.financeRefunds && m.financeRefunds.length > 0));

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				students: selectStudents(state),
				financeBillings,
				financeFeeTypes: selectFinanceFeeTypes(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeFinanceBillingFromList: (personId, financeBillingIds) => dispatch(actionFinanceBilling.removeFinanceBillingFromList(personId, financeBillingIds)),
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
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceBillings, getFinanceFeeTypes } = this.props;
    	getPageLangs(personId, langCode, 'FinanceRefundAddView');
	    getFinanceBillings(personId);
			getFinanceFeeTypes(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Refund`});
  }

  render() {
    return <FinanceRefundAddView {...this.props} />;
  }
}

export default storeConnector(Container);
