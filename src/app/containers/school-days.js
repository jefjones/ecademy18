import React, {Component} from 'react';
import SchoolDaysSettingsView from '../views/SchoolDaysSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCompanyConfig from '../actions/company-config';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCompanyConfig } from '../store.js';

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
    setCompanyConfig: (personId, field, value) => dispatch(actionCompanyConfig.setCompanyConfig(personId, field, value)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
        getPageLangs(personId, langCode, 'SchoolDaysSettingsView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `School Days`});
    }

    render() {
        return <SchoolDaysSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
