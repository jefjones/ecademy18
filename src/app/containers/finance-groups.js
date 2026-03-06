import React, {Component} from 'react';
import FinanceGroupsView from '../views/FinanceGroupsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceGroups from '../actions/finance-groups';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceGroups, selectFetchingRecord, selectSchoolYears, selectCoursesScheduled, selectGradeLevels } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeGroups: selectFinanceGroups(state),
				fetchingRecord: selectFetchingRecord(state),
				schoolYears: selectSchoolYears(state),
				coursesScheduled: selectCoursesScheduled(state),
				gradeLevels: selectGradeLevels(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceGroups: (personId) => dispatch(actionFinanceGroups.getFinanceGroups(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceGroup: (personId, financeGroupId) => dispatch(actionFinanceGroups.removeFinanceGroup(personId, financeGroupId)),
    addOrUpdateFinanceGroup: (personId, financeGroup) => dispatch(actionFinanceGroups.addOrUpdateFinanceGroup(personId, financeGroup)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getFinanceGroups, personId} = this.props;
        getPageLangs(personId, langCode, 'FinanceGroupsView');
        getFinanceGroups(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Finance Groups`});
    }

    render() {
        return <FinanceGroupsView {...this.props} />;
    }
}

export default storeConnector(Container);
