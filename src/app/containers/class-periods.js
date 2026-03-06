import React, {Component} from 'react';
import ClassPeriodsSettingsView from '../views/ClassPeriodsSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionClassPeriods from '../actions/class-periods';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectClassPeriods, selectFetchingRecord } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let periodsList = [];

    for(var i = 1; i < 10; i++ ) {
        let newPeriod = {id: i, label: i};
        periodsList = periodsList.length > 0 ? periodsList.concat(newPeriod) : [newPeriod];
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        classPeriods: selectClassPeriods(state),
        periodsList,
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    classPeriodsInit: (personId) => dispatch(actionClassPeriods.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeClassPeriod: (personId, classPeriodId) => dispatch(actionClassPeriods.removeClassPeriod(personId, classPeriodId)),
    addOrUpdateClassPeriod: (personId, classPeriod) => dispatch(actionClassPeriods.addOrUpdateClassPeriod(personId, classPeriod)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, classPeriodsInit, personId} = this.props;
        getPageLangs(personId, langCode, 'ClassPeriodsSettingsView');
        classPeriodsInit(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Class Periods`});
    }

    render() {
        return <ClassPeriodsSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
