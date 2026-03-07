import { useEffect } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import ContributorReportView from '../views/ContributorReportView'
import * as actionContributorReport from '../actions/contributor-report'
import * as actionReportFilter from '../actions/report-filter'
import * as actionReportFilterOptions from '../actions/report-filter-options'
import * as fromContributorReport from '../reducers/contributor-report'
import * as fromReportFilterOptions from '../reducers/report-filter-options'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectContributorReport, selectReportFilter } from '../store'

const mapStateToProps = (state, props) => {
    const {editType, workId, personId, languageId, sections, editTypeCount, langOrEditorCount} = props.params
    let me = selectMe(state)
    //1.The report object comes from the wepapi in its entirety without being filtered so that filtering can be fast on the client.
    let contributorReport = selectContributorReport(state)

    let filterList = selectReportFilter(state)
    let filterOptions = filterList && filterList.length > 0 && filterList.filter(m => !m.scratchFlag)
    filterOptions = filterOptions && filterOptions.length > 0
        && filterOptions.map(m => ({id: m.reportFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let filterScratch = filterList && filterList.length > 0 && filterList.filter(m => m.scratchFlag)[0]
    if (workId) filterScratch = {...filterScratch, workIds: [workId] }
    if (personId) filterScratch = {...filterScratch, editorIds: [personId] }
    if (sections) filterScratch = {...filterScratch, sectionIds: [sections] }
    let workOptions = fromReportFilterOptions.selectWorkOptions(state.reportFilterOptions)
    let nativeLanguageOptions = fromReportFilterOptions.selectNativeLanguageOptions(state.reportFilterOptions)
    let translateLanguageOptions = fromReportFilterOptions.selectTranslateLanguageOptions(state.reportFilterOptions)
    let editorOptions = fromReportFilterOptions.selectEditorOptions(state.reportFilterOptions)
    let sectionOptions = fromReportFilterOptions.selectSectionOptions(state.reportFilterOptions)

    //The report options:
    let reportTable = {}; //This will contain the headings and data arrays for the EditTable component
    let editTypeOptions = []
    let needEditTypeOptions = false

    if (editType === "edit") {
        if (workId === 'works' && personId === 'editors') {
            reportTable = fromContributorReport.selectEditWorksEditorsOneCount(contributorReport, editTypeCount);  //done
            needEditTypeOptions = true
        } else if (workId === 'works' && personId) {
            reportTable = fromContributorReport.selectEditWorks_EditorCounts(contributorReport, personId); //done
        } else if (workId && personId === 'editors') {
            reportTable = fromContributorReport.selectEditWorkEditorsCounts(contributorReport);  //done
        } else if (workId && personId && sections) {
            reportTable = fromContributorReport.selectEditWorkEditorSectionsCounts(contributorReport, workId, personId); //done
        } else if (workId === 'works') {
            reportTable = fromContributorReport.selectEditWorksEditorsOneCount(contributorReport, editTypeCount);  //done
            needEditTypeOptions = true
        } else if (workId) { //This also covers if a single PersonId was chosen
            reportTable = fromContributorReport.selectEditWorkEditorsCounts(contributorReport, workId); //done
        } else {
            reportTable = fromContributorReport.selectEditWorksEditorsOneCount(contributorReport, editTypeCount);  //done
            needEditTypeOptions = true
        }
        editTypeOptions = needEditTypeOptions
            ? [     {id: "edits", label: 'Edits'},
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
            : []
    } else if (editType === "translate") {
        if (workId === 'works' && languageId === 'languages' && personId === "editors") {
            reportTable = fromContributorReport.selectWorksLangsEditorsOneCount(contributorReport, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        } else if (workId === 'works' && languageId === 'languages' && personId) {
            reportTable = fromContributorReport.selectWorksLangsEditorOneCount(contributorReport, personId, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        } else if (workId === 'works' && languageId && personId === "editors") {
            reportTable = fromContributorReport.selectWorksLangEditorsOneCount(contributorReport, languageId, editTypeCount, state.languageList); //done
        } else if (workId && languageId === 'languages' && personId === "editors") {
            reportTable = fromContributorReport.selectWorkLangsEditorsOneCount(contributorReport, workId, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        } else if (workId === "works" && languageId && personId) {
            reportTable = fromContributorReport.selectWorksLangEditorCounts(contributorReport, languageId, personId, state.languageList); //done
        } else if (workId && languageId === 'languages' && personId) {
            reportTable = fromContributorReport.selectWorkLangsEditorCounts(contributorReport, workId, personId, state.languageList); //done
        } else if (workId && languageId && personId) {
            reportTable = fromContributorReport.selectWorkLangEditorSectionsCounts(contributorReport, workId, languageId, personId, state.languageList); //done
        } else if (workId && languageId && personId && sections) {
            reportTable = fromContributorReport.selectWorkLangEditorSectionsCounts(contributorReport, workId, languageId, personId, state.languageList); //done
        } else if (workId === 'works' && languageId === 'languages') {
            reportTable = fromContributorReport.selectWorksLangsEditorsOneCount(contributorReport, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        } else if (workId === 'works' && languageId) {
            reportTable = fromContributorReport.selectWorksLangEditorsOneCount(contributorReport, languageId, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        } else if (workId && languageId === 'languages') {
            reportTable = fromContributorReport.selectWorkLangsEditorsOneCount(contributorReport, workId, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        } else if (workId && languageId) {
            reportTable = fromContributorReport.selectWorkLangEditorsCounts(contributorReport, workId, languageId, state.languageList); //done
        } else if (workId) {
            reportTable = fromContributorReport.selectWorkLangsEditorsOneCount(contributorReport, workId, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        } else if (langOrEditorCount === "editors") {
            reportTable = fromContributorReport.selectWorksLangsCountEditors(contributorReport, state.languageList); //done
        } else if (langOrEditorCount === "languages") {
            reportTable = fromContributorReport.selectWorksEditorsCountLangs(contributorReport)
        } else {
            reportTable = fromContributorReport.selectWorksLangsEditorsOneCount(contributorReport, editTypeCount, state.languageList); //done
            needEditTypeOptions = true
        }
        editTypeOptions = needEditTypeOptions
            ? [     {id: "transCompletePercent", label: '% Complete'},
                    {id: "transInProcessPercent", label: '% In Process'},
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
            : []
    }

    const tabs = [{
            id: "edit",
            label: "Edit Native Language",
        },
        {
            id: "translate",
            label: "Translation",
        },
    ]

    const reportOptGroup = [
        {
            label: 'Editing______________________',
            editOrTranslate: 'edit',
            options: [
                {
                    id: 'editWorksEditors',
                    label: 'Edit counts by editors by document',
                    pathLink: 'e/edit/works/editors',
                },
            ]
        },
        {
            label: 'Translating____________________',
            editOrTranslate: 'translate',
            options: [

                {
                    id: 'transCompletePercent',
                    label: 'Translation counts by document by language',
                    pathLink: 't/translate/works/languages/editors',
                },
                {
                    id: 'worksLangsCountEditors',
                    label: 'Quantity of editors by document and by language',
                    pathLink: 't/translate/works/languages/editors/noSections/le/editors',
                },
                {
                    id: 'worksEditorsCountLangs',
                    label: 'Quantity of languages by document and by editors',
                    pathLink: 't/translate/works/languages/editors/noSections/le/languages',
                },
            ]
        }
    ]

    return {
        personId: me.personId,
        langCode: me.langCode,
        reportTable,
        filterList,
        filterOptions,
        filterScratch,
        savedFilterIdCurrent: filterScratch && filterScratch.savedFilterIdCurrent,
        workOptions,
        nativeLanguageOptions,
        translateLanguageOptions,
        editorOptions,
        sectionOptions,
        editTypeOptions,
        tabs,
        reportOptGroup,
    }
}

const bindActionsToDispatch = (dispatch) => ({
    initContributorReport: (personId) => dispatch(actionContributorReport.init(personId)),
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
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {personId, getPageLangs, langCode, initContributorReport, initReportFilter, initReportFilterOptions} = props
          initContributorReport(personId)
          initReportFilter(personId)
          initReportFilterOptions(personId)
          getPageLangs(personId, langCode, 'ContributorReportView')
      
  }, [])

  const {filterList} = props
        if (!filterList || filterList.length === 0) return null
        return <ContributorReportView {...props} />
}

export default Container
