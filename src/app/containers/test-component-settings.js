import React, {Component} from 'react';
import TestComponentSettingsView from '../views/TestComponentSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionTestSettings from '../actions/test-settings';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectTestSettings, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		var testComponents = selectTestSettings(state) && selectTestSettings(state).testComponents;

    return {
        personId: me.personId,
        langCode: me.langCode,
        testComponents,
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    removeTestComponent: (personId, testComponentId) => dispatch(actionTestSettings.removeTestComponent(personId, testComponentId)),
    addOrUpdateTestComponent: (personId, testComponent) => dispatch(actionTestSettings.addOrUpdateTestComponent(personId, testComponent)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = this.props;
        getPageLangs(personId, langCode, 'TestComponentSettingsView');
        getTestSettings(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Test Component Settings`});
    }

    render() {
        return <TestComponentSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
