import React, {Component} from 'react';
import FinanceCreditTypesView from '../views/FinanceCreditTypesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceCreditTypes from '../actions/finance-credit-types';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceCreditTypes, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeCreditTypes: selectFinanceCreditTypes(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceCreditTypes: (personId) => dispatch(actionFinanceCreditTypes.getFinanceCreditTypes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceCreditType: (personId, financeCreditTypeId) => dispatch(actionFinanceCreditTypes.removeFinanceCreditType(personId, financeCreditTypeId)),
    addOrUpdateFinanceCreditType: (personId, financeCreditType) => dispatch(actionFinanceCreditTypes.addOrUpdateFinanceCreditType(personId, financeCreditType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getFinanceCreditTypes, personId} = this.props;
        getPageLangs(personId, langCode, 'FinanceCreditTypesView');
        getFinanceCreditTypes(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Credit Types`});
    }

    render() {
        return <FinanceCreditTypesView {...this.props} />;
    }
}

export default storeConnector(Container);
