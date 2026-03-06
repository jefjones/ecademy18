import React, {Component} from 'react';
import FinancePaymentTypesView from '../views/FinancePaymentTypesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinancePaymentTypes from '../actions/finance-payment-types';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinancePaymentTypes, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        financePaymentTypes: selectFinancePaymentTypes(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinancePaymentTypes: (personId) => dispatch(actionFinancePaymentTypes.getFinancePaymentTypes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinancePaymentType: (personId, financePaymentTypeId) => dispatch(actionFinancePaymentTypes.removeFinancePaymentType(personId, financePaymentTypeId)),
    addOrUpdateFinancePaymentType: (personId, financePaymentType) => dispatch(actionFinancePaymentTypes.addOrUpdateFinancePaymentType(personId, financePaymentType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getFinancePaymentTypes, personId} = this.props;
        getPageLangs(personId, langCode, 'FinancePaymentTypesView');
        getFinancePaymentTypes(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Finance Payment Types`});
    }

    render() {
        return <FinancePaymentTypesView {...this.props} />;
    }
}

export default storeConnector(Container);
