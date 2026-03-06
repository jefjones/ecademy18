import React, {Component} from 'react';
import LunchReducedApplyView from '../views/LunchReducedApplyView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionLunchReducedApply from '../actions/lunch-reduced-apply';
import * as actionUsStates from '../actions/us-states';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFetchingRecord, selectStudents, selectLunchReducedApply, selectUSStates } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        students: selectStudents(state),
        lunchReducedApply: selectLunchReducedApply(state),
				fetchingRecord: selectFetchingRecord(state),
        uSStates: selectUSStates(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getLunchReducedApply: (personId) => dispatch(actionLunchReducedApply.getLunchReducedApply(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateLunchReducedApplyTable: (personId, lunchReducedApply) => dispatch(actionLunchReducedApply.addOrUpdateLunchReducedApplyTable(personId, lunchReducedApply)),
    removeLunchReducedApply: (personId, lunchReducedApplyTableId) => dispatch(actionLunchReducedApply.removeLunchReducedApply(personId, lunchReducedApplyTableId)),
    addOrUpdateLunchReducedApplyStudents: (personId, lunchReducedApplyTableId, lunchReducedStudents) => dispatch(actionLunchReducedApply.addOrUpdateLunchReducedApplyStudents(personId, lunchReducedApplyTableId, lunchReducedStudents)),
    addOrUpdateLunchReducedApplyAdults: (personId, lunchReducedApplyTableId, lunchReducedAdults) => dispatch(actionLunchReducedApply.addOrUpdateLunchReducedApplyAdults(personId, lunchReducedApplyTableId, lunchReducedAdults)),
    getUsStates: () => dispatch(actionUsStates.init()),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getLunchReducedApply, personId, getUsStates} = this.props;
        getPageLangs(personId, langCode, 'LunchReducedApplyView');
        getLunchReducedApply(personId);
        getUsStates();
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Apply for Reduced Lunch`});
    }

    render() {
        return <LunchReducedApplyView {...this.props} />;
    }
}

export default storeConnector(Container);
