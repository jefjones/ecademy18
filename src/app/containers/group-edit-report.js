import React, { Component } from 'react';
import { connect } from 'react-redux';
import GroupEditReportView from '../views/GroupEditReportView';
import * as actionGroupEditReport from '../actions/group-edit-report.js';
import * as fromGroupEditReport from '../reducers/group-edit-report.js';
import * as actionReportFilter from '../actions/report-filter.js';
import * as actionReportFilterOptions from '../actions/report-filter-options.js';
import * as fromReportFilterOptions from '../reducers/report-filter-options.js';
import * as actionPageLang from '../actions/language-list';
import * as guid from '../utils/GuidValidate.js';
import { selectMe, selectReportFilter, selectGroupIdCurrent } from '../store.js';

const mapStateToProps = (state, props) => {
    const {editTypeCount, workId, personId} = props.params;
    let me = selectMe(state);

    let filterList = selectReportFilter(state);
    let filterOptions = filterList && filterList.length > 0 && filterList.filter(m => !m.scratchFlag);
    filterOptions = filterOptions && filterOptions.length > 0
        && filterOptions.map(m => ({id: m.reportFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}));
    let filterScratch = filterList && filterList.length > 0 && filterList.filter(m => m.scratchFlag)[0];
    if (filterScratch) filterScratch.workIds = (!!workId && workId !== guid.emptyGuid() && filterScratch) ? [workId] : filterScratch.workIds;
    if (filterScratch) filterScratch.editorIds = (!!personId && personId !== guid.emptyGuid() && filterScratch) ? [personId] : filterScratch.editorIds;

    let workOptions = fromReportFilterOptions.selectWorkOptions(state.reportFilterOptions);
    let nativeLanguageOptions = fromReportFilterOptions.selectNativeLanguageOptions(state.reportFilterOptions);
    let translateLanguageOptions = fromReportFilterOptions.selectTranslateLanguageOptions(state.reportFilterOptions);
    let editorOptions = fromReportFilterOptions.selectEditorOptions(state.reportFilterOptions);
    //let sectionOptions = fromReportFilterOptions.selectSectionOptions(state.reportFilterOptions);

    //The report options:
    let reportTable = {}; //This will contain the headings and data arrays for the EditTable component
    let editTypeOptions = [];
    let needEditTypeOptions = false;

    if (!!state.groupEditReport && state.groupEditReport.length > 0) {
        if (workId === 'works' && personId) {
            reportTable = fromGroupEditReport.selectEditWorks_EditorCounts(state.groupEditReport, personId);
        } else if (workId === 'works') {
            reportTable = fromGroupEditReport.selectEditWorksEditorsOneCount(state.groupEditReport, editTypeCount);
            needEditTypeOptions = true;
        } else if (workId || (workId && personId === 'editors')) { //This also covers if a single PersonId was chosen
            reportTable = fromGroupEditReport.selectEditWorkEditorsCounts(state.groupEditReport, workId);
        }
    }

    editTypeOptions = needEditTypeOptions
        ? [
                {id: "edits", label: 'Edits'},
                {id: "pendingEdits", label: 'Pending Edits'},
                {id: "comments", label: 'Comments'},
                {id: "pendingComments", label: 'Pending Comments'},
                {id: "upVotes", label: 'Up Vote'},
                {id: "downVotes", label: 'Down Vote'},
                {id: "trollVotes", label: 'Troll Vote'},
                {id: "acceptedEdits", label: 'Accepted'},
                {id: "nonAcceptedEdits", label: 'Not Accepted'},
                {id: "wordCount", label: 'Word Count'},
                {id: "sentenceCount", label: 'Sentence Count'},
            ]
        : [];

    return {
        personId: me.personId,
        langCode: me.langCode,
        currentGroupId: selectGroupIdCurrent(state),
        reportTable,
        editTypeOptions,
        filterList,
        filterOptions,
        filterScratch,
        savedFilterIdCurrent: filterScratch && filterScratch.savedFilterIdCurrent,
        workOptions,
        nativeLanguageOptions,
        translateLanguageOptions,
        editorOptions,
        //sectionOptions,
        paramWorkId: workId,
        paramPersonId: personId,
    }
};

const bindActionsToDispatch = (dispatch) => ({
    initGroupEditReport: (personId, groupId) => dispatch(actionGroupEditReport.init(personId, groupId)),
    initReportFilter: (personId) => dispatch(actionReportFilter.init(personId)),
    initReportFilterOptions: (personId, groupId) => dispatch(actionReportFilterOptions.init(personId, groupId)),
    updateFilterByField: (personId, field, value) => dispatch(actionReportFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag: (personId, savedFilterIdCurrent, setValue) => dispatch(actionReportFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    clearFilters: (personId) => dispatch(actionReportFilter.clearFilters(personId)),
    saveNewSavedSearch: (personId, savedSearchName) => dispatch(actionReportFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch: (personId, workFilterId) => dispatch(actionReportFilter.updateSavedSearch(personId, workFilterId)),
    deleteSavedSearch: (personId, workFilterId) => dispatch(actionReportFilter.deleteSavedSearch(personId, workFilterId)),
    chooseSavedSearch: (personId, workFilterId) => dispatch(actionReportFilter.chooseSavedSearch(personId, workFilterId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
      const {personId, getPageLangs, langCode, currentGroupId, initGroupEditReport, initReportFilter, initReportFilterOptions} = this.props;
      initGroupEditReport(personId, currentGroupId);
      initReportFilter(personId, currentGroupId);  //Report filter really doesn't do anything different with groupId at the moment. It's just that I implemented there by mistake when I needed to do it on the filter options instead.  I just left it in case there would be a future variation.
      initReportFilterOptions(personId, currentGroupId);
      getPageLangs(personId, langCode, 'GroupEditReportView');
  }

  render() {
      //const {filterList, groupEditReport} = this.props;
      //if (!groupEditReport || !filterList || filterList.length === 0) return null;
      return <GroupEditReportView {...this.props} />
  }
}

export default storeConnector(Container);
