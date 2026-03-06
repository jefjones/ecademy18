import React, {Component} from 'react';
import SystemFeaturesView from '../views/SystemFeaturesView';
import * as actionCompanyConfig from '../actions/company-config';
import * as actionPageLang from '../actions/language-list';
import * as actionContentTypes from '../actions/content-types.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { connect } from 'react-redux';
import {selectMe, selectCompanyConfig} from '../store.js';

const mapStateToProps = (state, props) => {
	let me = selectMe(state);
    return {
				personId: me.personId,
				langCode: me.langCode,
				companyConfig: selectCompanyConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleCompanyFeature: (personId, feature) => dispatch(actionCompanyConfig.toggleCompanyFeature(personId, feature)),
		toggleBenchmarkTests: (personId, setOn) => dispatch(actionContentTypes.toggleBenchmarkTests(personId, setOn)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
        getPageLangs(personId, langCode, 'SystemFeaturesView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `System Features`});
    }

    render() {
        return <SystemFeaturesView {...this.props} />
    }
}

export default storeConnector(Container);
