import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AccessReportView from '../views/AccessReportView'
import * as actionReportFilter from '../actions/report-filter'
import * as actionReportFilterOptions from '../actions/report-filter-options'
import * as actionAccessReport from '../actions/access-report'
import * as fromAccessReport from '../reducers/access-report'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectGroups, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    const {groupChosen} = props.params
    let me = selectMe(state)
    let group = selectGroups(state) && selectGroups(state).filter(m => m.groupId === groupChosen)[0]
    let reportTable = fromAccessReport.selectAccessReportTable(state.accessReport, groupChosen)
    let workOptions = fromAccessReport.selectWorkOptions(state.accessReport)
    let editorOptions = fromAccessReport.selectEditorOptions(state.accessReport)
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
}

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
})




function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {personId, getPageLangs, langCode, initAccessReport, initReportFilter, initReportFilterOptions, groupChosen} = props
          initAccessReport(personId, groupChosen)
          initReportFilter(personId, groupChosen)
          initReportFilterOptions(personId, groupChosen)
          getPageLangs(personId, langCode, 'AccessReportView')
      
  }, [])

  return <AccessReportView {...props} />
}

export default Container
