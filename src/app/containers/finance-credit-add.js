import React, {Component} from 'react';
import FinanceCreditAddView from '../views/FinanceCreditAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceCredit from '../actions/finance-credit.js';
import * as actionFinanceCreditTypes from '../actions/finance-credit-types.js';
import * as actionFinanceGroups from '../actions/finance-groups.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {doSort} from  '../utils/sort.js';

import { selectMe, selectMyFrequentPlaces, selectFinanceCreditTypes, selectStudents, selectFinanceCredits, selectFinanceGroups } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let financeCredits = selectFinanceCredits(state);
		let financeCreditTransactionId = props.params && props.params.financeCreditTransactionId;
		let financeCredit = financeCreditTransactionId && financeCredits && financeCredits.length > 0 && financeCredits.filter(m => m.financeCreditTransactionId === financeCreditTransactionId)[0];
		let financeCreditTypes = selectFinanceCreditTypes(state);
		financeCreditTypes = doSort(financeCreditTypes, { sortField: 'label', isAsc: true, isNumber: false });

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				financeCreditTransactionId,
				financeCredit,
				financeCredits,
				financeCreditTypes,
				students: selectStudents(state),
				financeGroups: selectFinanceGroups(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceCredits: (personId) => dispatch(actionFinanceCredit.getFinanceCredits(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinanceCreditTypes: (personId) => dispatch(actionFinanceCreditTypes.getFinanceCreditTypes(personId)),
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
        const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceCreditTypes, getFinanceCredits, getFinanceGroups} = this.props;
        getPageLangs(personId, langCode, 'FinanceCreditAddView');
				getFinanceCreditTypes(personId);
				getFinanceCredits(personId);
				getFinanceGroups(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Credit`});
    }

    render() {
        return <FinanceCreditAddView {...this.props} />;
    }
}

export default storeConnector(Container);
