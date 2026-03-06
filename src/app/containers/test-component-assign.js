import React, {Component} from 'react';
import TestComponentAssignView from '../views/TestComponentAssignView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionTestSettings from '../actions/test-settings';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectTestSettings, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		var testSettings = selectTestSettings(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        testSettings,
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    removeTestComponentAssign: (personId, testComponentAssignId) => dispatch(actionTestSettings.removeTestComponentAssign(personId, testComponentAssignId)),
    addTestComponentAssign: (personId, testComponentAssign) => dispatch(actionTestSettings.addTestComponentAssign(personId, testComponentAssign)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = this.props;
        getPageLangs(personId, langCode, 'TestComponentAssignView');
        getTestSettings(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Test Component Assign`});
    }

    render() {
        return <TestComponentAssignView {...this.props} />;
    }
}

export default storeConnector(Container);
