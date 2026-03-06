import React, {Component} from 'react';
import FinanceFeeTypesView from '../views/FinanceFeeTypesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceFeeTypes from '../actions/finance-fee-types';
import * as actionFinanceGLCodes from '../actions/finance-gl-codes';
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {doSort} from '../utils/sort.js';
import { selectMe, selectFinanceFeeTypes, selectFetchingRecord, selectSchoolYears, selectFinanceGLCodes, selectFinanceWaiverSchedules, selectFinanceLowIncomeWaivers } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

		let refundOptions = [
				{ label: 'Not refundable', id: 'NotRefundable' },
				{ label: '100% refundable', id: 'FULLREFUNDABLE' },
				{ label: 'Refund schedule', id: 'REFUNDSCHEDULE' },
		]

    let financeFeeTypes = selectFinanceFeeTypes(state);
    financeFeeTypes = doSort(financeFeeTypes, { sortField: 'label', isAsc: true, isNumber: false });

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeFeeTypes,
				fetchingRecord: selectFetchingRecord(state),
				schoolYears: selectSchoolYears(state),
				financeGLCodes: selectFinanceGLCodes(state),
				financeWaiverSchedules: selectFinanceWaiverSchedules(state),
				financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				refundOptions,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceFeeType: (personId, financeFeeTypeId) => dispatch(actionFinanceFeeTypes.removeFinanceFeeType(personId, financeFeeTypeId)),
    addOrUpdateFinanceFeeType: (personId, financeFeeType) => dispatch(actionFinanceFeeTypes.addOrUpdateFinanceFeeType(personId, financeFeeType)),
		getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
		getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceFeeTypes, getFinanceGLCodes, getFinanceLowIncomeWaivers} = this.props;
        getPageLangs(personId, langCode, 'FinanceFeeTypesView');
        getFinanceFeeTypes(personId);
				getFinanceGLCodes(personId);
				getFinanceLowIncomeWaivers(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Finance Fee Types`});
    }

    render() {
        return <FinanceFeeTypesView {...this.props} />;
    }
}

export default storeConnector(Container);
