import React, {Component} from 'react';
import LunchMenuOptionSetupView from '../views/LunchMenuOptionSetupView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionLunchMenuOptions from '../actions/lunch-menu-options';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectLunchMenuOptions } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let lunchMenuOptions = selectLunchMenuOptions(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        lunchMenuOptions,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getLunchMenuOptions: (personId) => dispatch(actionLunchMenuOptions.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeLunchMenuOption: (personId, carpoolAreaId) => dispatch(actionLunchMenuOptions.removeLunchMenuOption(personId, carpoolAreaId)),
    addOrUpdateLunchMenuOption: (personId, carpoolArea) => dispatch(actionLunchMenuOptions.addOrUpdateLunchMenuOption(personId, carpoolArea)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getLunchMenuOptions, personId} = this.props;
        getPageLangs(personId, langCode, 'LunchMenuOptionSetupView');
        getLunchMenuOptions(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Lunch Menu Options`});
    }

    render() {
        return <LunchMenuOptionSetupView {...this.props} />;
    }
}

export default storeConnector(Container);
