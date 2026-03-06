import React, {Component} from 'react';
import TestScoreAddView from '../views/TestScoreAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionTestSettings from '../actions/test-settings';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectTestSettings, selectStudents } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		var testSettings = selectTestSettings(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        testSettings,
				students: selectStudents(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    addOrUpdateTestScore: (personId, testScore) => dispatch(actionTestSettings.addOrUpdateTestScore(personId, testScore)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = this.props;
        getPageLangs(personId, langCode, 'TestScoreAddView');
        getTestSettings(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Test Score`});
    }

    render() {
        return <TestScoreAddView {...this.props} />;
    }
}

export default storeConnector(Container);
