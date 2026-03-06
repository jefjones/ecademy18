import React, {Component} from 'react';
import FinanceBillingListView from '../views/FinanceBillingListView';
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

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId,
				onlyBillingDue: props.params.onlyBillingDue,
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
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
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
    	getPageLangs(personId, langCode, 'FinanceBillingListView');
	    getFinanceBillings(personId);
			getFinanceFeeTypes(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Billing List`});
  }

  render() {
    return <FinanceBillingListView {...this.props} />;
  }
}

export default storeConnector(Container);
