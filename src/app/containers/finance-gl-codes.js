import React, {Component} from 'react';
import FinanceGLCodesView from '../views/FinanceGLCodesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceGLCodes from '../actions/finance-gl-codes';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceGLCodes, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeGLCodes: selectFinanceGLCodes(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceGLCode: (personId, financeGLCodeId) => dispatch(actionFinanceGLCodes.removeFinanceGLCode(personId, financeGLCodeId)),
    addOrUpdateFinanceGLCode: (personId, financeGLCode) => dispatch(actionFinanceGLCodes.addOrUpdateFinanceGLCode(personId, financeGLCode)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getFinanceGLCodes, personId} = this.props;
        getPageLangs(personId, langCode, 'FinanceGLCodesView');
        getFinanceGLCodes(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Finance GL Codes`});
    }

    render() {
        return <FinanceGLCodesView {...this.props} />;
    }
}

export default storeConnector(Container);
