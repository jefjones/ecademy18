import React, {Component} from 'react';
import FinanceBillingAddView from '../views/FinanceBillingAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceBilling from '../actions/finance-billing.js';
import * as actionFinanceFeeTypes from '../actions/finance-fee-types.js';
import * as actionFinanceGroups from '../actions/finance-groups.js';
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers.js';
import * as actionFinanceGLCodes from '../actions/finance-gl-codes.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {doSort} from  '../utils/sort.js';

import { selectMe, selectMyFrequentPlaces, selectFinanceFeeTypes, selectStudents, selectFinanceBillings, selectFinanceGroups, selectFinanceLowIncomeWaivers,
					selectFinanceGLCodes } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let financeBillings = selectFinanceBillings(state);
		let financeBillingId = props.params && props.params.financeBillingId;
		let financeBilling = financeBillingId && financeBillings && financeBillings.length > 0 && financeBillings.filter(m => m.financeBillingId === financeBillingId)[0];
		let financeFeeTypes = selectFinanceFeeTypes(state);
		financeFeeTypes = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => !m.isCourseTypeByUser && !m.isCredit && !m.isCourse)
		financeFeeTypes = doSort(financeFeeTypes, { sortField: 'label', isAsc: true, isNumber: false });
		let addLunchBilling = props.params.addLunchBilling;
		let financeFeeType = addLunchBilling === 'addLunchBilling' && financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.label === 'Lunch')[0]
		let financeFeeTypeId = financeFeeType && financeFeeType.financeFeeTypeId ? financeFeeType.financeFeeTypeId : '';

		let refundOptions = [
				{ label: 'Not refundable', id: 'NotRefundable' },
				{ label: '100% refundable', id: 'FULLREFUNDABLE' },
				{ label: 'Refund schedule', id: 'REFUNDSCHEDULE' },
		]
		if (financeBilling && !financeBilling.refundType) financeBilling.refundType = 'REFUNDSCHEDULE';

    return {
        personId: me.personId,
        langCode: me.langCode,
				financeBillingId,
				financeBilling,
				financeBillings,
				financeFeeTypes,
				financeFeeTypeId, //If this is for adding lunch billing.
				students: selectStudents(state),
				financeGroups: selectFinanceGroups(state),
				paramPersonId: props.params.paramPersonId,
				refundOptions,
				financeGLCodes: selectFinanceGLCodes(state),
				financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
		getFinanceGroups: (personId) => dispatch(actionFinanceGroups.getFinanceGroups(personId)),
		getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
		getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceFeeTypes, getFinanceBillings, getFinanceGroups, getFinanceGLCodes, getFinanceLowIncomeWaivers} = this.props;
        getPageLangs(personId, langCode, 'FinanceBillingAddView');
				getFinanceFeeTypes(personId);
				getFinanceBillings(personId);
				getFinanceGroups(personId);
				getFinanceGLCodes(personId);
				getFinanceLowIncomeWaivers(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Billing`});
    }

    render() {
        return <FinanceBillingAddView {...this.props} />;
    }
}

export default storeConnector(Container);
