import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccessReportView from '../views/AccessReportView';
import * as actionReportFilter from '../actions/report-filter.js';
import * as actionReportFilterOptions from '../actions/report-filter-options.js';
import * as actionAccessReport from '../actions/access-report.js';
import * as fromAccessReport from '../reducers/access-report.js';
import * as actionPageLang from '../actions/language-list';
import { selectMe, selectGroups, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    const {groupChosen} = props.params;
    let me = selectMe(state);
    let group = selectGroups(state) && selectGroups(state).filter(m => m.groupId === groupChosen)[0];
    let reportTable = fromAccessReport.selectAccessReportTable(state.accessReport, groupChosen);
    let workOptions = fromAccessReport.selectWorkOptions(state.accessReport);
    let editorOptions = fromAccessReport.selectEditorOptions(state.accessReport);
    //Notice that the work and editor options are related to the group and the language options below are the old reportFilterOptions, but we aren't using languages in this report ... yet.
    let nativeLanguageOptions = []; //fromReportFilterOptions.selectNativeLanguageOptions(state.reportFilterOptions);
    let translateLanguageOptions = []; //fromReportFilterOptions.selectTranslateLanguageOptions(state.reportFilterOptions);
    //The report object comes from the wepapi in its entirety without being filtered so that filtering can be fast on the client.

    return {
        reportTable,
        groupChosen,
        group,
        personId: me.personId,
        langCode: me.langCode,
        workOptions,
        nativeLanguageOptions,
        translateLanguageOptions,
        editorOptions,
        fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = (dispatch) => ({
    initAccessReport: (personId, groupId) => dispatch(actionAccessReport.init(personId, groupId)),
    groupModifyWorkAccess: (personId, workAssign, groupChosen, peerGroupId, peerGroup_workId) => dispatch(actionAccessReport.groupModifyWorkAccess(personId, workAssign, groupChosen, peerGroupId, peerGroup_workId)),
    initReportFilter: (personId) => dispatch(actionReportFilter.init(personId)),
    initReportFilterOptions: (personId) => dispatch(actionReportFilterOptions.init(personId)),
    updateFilterByField: (personId, field, value) => dispatch(actionReportFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag: (personId, savedFilterIdCurrent, setValue) => dispatch(actionReportFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    clearFilters: (personId) => dispatch(actionReportFilter.clearFilters(personId)),
    saveNewSavedSearch: (personId, savedSearchName) => dispatch(actionReportFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch: (personId, workFilterId) => dispatch(actionReportFilter.updateSavedSearch(personId, workFilterId)),
    deleteSavedSearch: (personId, workFilterId) => dispatch(actionReportFilter.deleteSavedSearch(personId, workFilterId)),
    chooseSavedSearch: (personId, workFilterId) => dispatch(actionReportFilter.chooseSavedSearch(personId, workFilterId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const mergeAllProps = (store, actions) => ({
    ...store,
    ...actions,
});


const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
  mergeAllProps
);

class Container extends Component {
  componentDidMount() {
      const {personId, getPageLangs, langCode, initAccessReport, initReportFilter, initReportFilterOptions, groupChosen} = this.props;
      initAccessReport(personId, groupChosen);
      initReportFilter(personId, groupChosen);
      initReportFilterOptions(personId, groupChosen);
      getPageLangs(personId, langCode, 'AccessReportView');
  }

  render() {
      return <AccessReportView {...this.props} />
  }
}

export default storeConnector(Container);
