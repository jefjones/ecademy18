import React, {Component} from 'react';
import FinanceTransferAddView from '../views/FinanceTransferAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceAccountSummaries from '../actions/finance-account-summaries.js';
import * as actionFinanceTransfer from '../actions/finance-transfer.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectFinanceAccountSummaries } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		//If this page is called from the financeTransferList, then this is an intended reversal of a transfer, but that needs to be done by the user "manually"
		//	in case credit amounts have changed and funds do not exist to make that reversed transfer.

    return {
				fromPersonId: props.params.fromPersonId || props.params.paramPersonId,
				langCode: me.langCode,
				toPersonId: props.params.toPersonId,
        personId: me.personId,
				financeAccountSummaries: selectFinanceAccountSummaries(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceAccountSummaries: (personId) => dispatch(actionFinanceAccountSummaries.getFinanceAccountSummaries(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addFinanceTransfer: (personId, financeTransfer) => dispatch(actionFinanceTransfer.addFinanceTransfer(personId, financeTransfer)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceAccountSummaries} = this.props;
        getPageLangs(personId, langCode, 'FinanceTransferAddView');
				getFinanceAccountSummaries(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Transfer (Finance)`});
    }

    render() {
        return <FinanceTransferAddView {...this.props} />;
    }
}

export default storeConnector(Container);
