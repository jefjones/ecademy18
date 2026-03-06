import React, {Component} from 'react';
import FinanceLowIncomeWaiversView from '../views/FinanceLowIncomeWaiversView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceLowIncomeWaivers, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceLowIncomeWaiver: (personId, financeLowIncomeWaiverId) => dispatch(actionFinanceLowIncomeWaivers.removeFinanceLowIncomeWaiver(personId, financeLowIncomeWaiverId)),
    addOrUpdateFinanceLowIncomeWaiver: (personId, financeLowIncomeWaiver) => dispatch(actionFinanceLowIncomeWaivers.addOrUpdateFinanceLowIncomeWaiver(personId, financeLowIncomeWaiver)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getFinanceLowIncomeWaivers, personId} = this.props;
        getPageLangs(personId, langCode, 'FinanceLowIncomeWaiversView');
        getFinanceLowIncomeWaivers(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Finance Low Income Waiver`});
    }

    render() {
        return <FinanceLowIncomeWaiversView {...this.props} />;
    }
}

export default storeConnector(Container);
