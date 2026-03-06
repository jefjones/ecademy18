import React, {Component} from 'react';
import TestSettingsView from '../views/TestSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionTestSettings from '../actions/test-settings';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectTestSettings, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		var tests = selectTestSettings(state) && selectTestSettings(state).tests;

    return {
        personId: me.personId,
        langCode: me.langCode,
        tests,
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    removeTest: (personId, testId) => dispatch(actionTestSettings.removeTest(personId, testId)),
    addOrUpdateTest: (personId, test) => dispatch(actionTestSettings.addOrUpdateTest(personId, test)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = this.props;
        getPageLangs(personId, langCode, 'TestSettingsView');
        getTestSettings(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Test Settings`});
    }

    render() {
        return <TestSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
