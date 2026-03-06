import { useEffect } from 'react'
import OpenCommunityView from '../views/OpenCommunityView/OpenCommunityView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as actionChapters from '../actions/chapters'
import * as actionPersonConfig from '../actions/person-config'
import * as actionOpenCommunity from '../actions/open-community'
import * as fromWorks from '../reducers/works'
import * as actionWorkFilter from '../actions/work-filter'
import * as actionEditSeverityList from '../actions/edit-severity-list'
import * as actionOpenCommunityFilter from '../actions/open-community-filter'
import * as fromService from '../services/open-community'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectWorkSummary, selectPersonConfig, selectLanguageList, selectEditSeverityList, selectDeclineIdleList, selectGenreList,
            selectOpenCommunity, selectWorkFilter, selectOpenCommunityFilter} from '../store'

const mapStateToProps = (state, props) => {
    const personConfig = selectPersonConfig(state)
    let openCommunityFull = selectOpenCommunity(state)
    const personId = selectMe(state).personId
    const editSeverityOptions = selectEditSeverityList(state)

    //Work and Work Summary details
    let works = fromWorks.selectWorks(state.works)
    works = works && works.length > 0 && works.filter(m => !m.hasOpenCommunityEntry)
    let workFilterList = selectWorkFilter(state)
    let workFilterOptions = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => !m.scratchFlag)
    workFilterOptions = workFilterOptions && workFilterOptions.length > 0
        && workFilterOptions.map(m => ({id: m.workFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let workFilterScratch = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => m.scratchFlag)[0]
    works = fromService.filterWorks(works, workFilterScratch, personId)
    let workSummaries = works && works.length > 0 && works.map(({workId}) => selectWorkSummary(state, workId))
    let workOptions = workSummaries && workSummaries.length > 0 && workSummaries.map(m => ({ id: m.workId, label: m.title }))

    //Open Community details;
    let openCommunityFilterList = selectOpenCommunityFilter(state)
    let openCommunityFilterOptions = openCommunityFilterList && openCommunityFilterList.length > 0 && openCommunityFilterList.filter(m => !m.scratchFlag)
    openCommunityFilterOptions = openCommunityFilterOptions && openCommunityFilterOptions.length > 0
        && openCommunityFilterOptions.map(m => ({id: m.openCommunityFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let openCommunityFilterScratch = openCommunityFilterList && openCommunityFilterList.length > 0 && openCommunityFilterList.filter(m => m.scratchFlag)[0]
    let openCommunityToVol = fromService.filterOpenCommunity(openCommunityFull, openCommunityFilterScratch, personId)

  return {
        personId,
        langCode: selectMe(state).langCode,
        personConfig,
        workSummaries,
        modifyEntry: props.params && props.params.workId ? workSummaries && workSummaries.length > 0 && workSummaries.filter(m => m.workId === props.params.workId)[0] : [],
        workOptions,
        editSeverityOptions,
        declineIdleOptions: selectDeclineIdleList(state),
        genreOptions: selectGenreList(state),
        languageOptions: selectLanguageList(state),
        wordCountOptions: fromService.getWordCountOptions(),
        editorsCountOptions: fromService.getEditorsCountOptions(),
        openCommunityFull,
        openCommunityToVol,
        tabs: fromService.getTabs(),
        tabEntryCounts: fromService.getTabEntryCounts(openCommunityFull, personId, workOptions),
        workFilterOptions,
        workFilterScratch,
        savedWorkFilterIdCurrent: workFilterScratch && workFilterScratch.savedFilterIdCurrent,
        openCommunityFilterList,
        openCommunityFilterOptions,
        openCommunityFilterScratch,
        savedOpenCommunityFilterIdCurrent: openCommunityFilterScratch && openCommunityFilterScratch.savedFilterIdCurrent,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    initWorkFilter: (personId) => dispatch(actionWorkFilter.init(personId)),
    initOpenCommunityFilter: (personId) => dispatch(actionOpenCommunityFilter.init(personId)),
    initOpenCommunity: (personId) => dispatch(actionOpenCommunity.init(personId)),
    initEditSeverityList: (personId) => dispatch(actionEditSeverityList.init()),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    //Work filter related functions:
    updateFilterByField_work: (personId, field, value) => dispatch(actionWorkFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag_work: (personId, savedFilterIdCurrent, setValue) => dispatch(actionWorkFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    clearFilters_work: (personId) => dispatch(actionWorkFilter.clearFilters(personId)),
    saveNewSavedSearch_work: (personId, savedSearchName) => dispatch(actionWorkFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch_work: (personId, workFilterId) => dispatch(actionWorkFilter.updateSavedSearch(personId, workFilterId)),
    deleteSavedSearch_work: (personId, workFilterId) => dispatch(actionWorkFilter.deleteSavedSearch(personId, workFilterId)),
    chooseSavedSearch_work: (personId, workFilterId) => dispatch(actionWorkFilter.chooseSavedSearch(personId, workFilterId)),
    //Open Community filter related functions
    updateFilterByField_openCommunity: (personId, field, value) => dispatch(actionOpenCommunityFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag_openCommunity: (personId, savedFilterIdCurrent, setValue) => dispatch(actionOpenCommunityFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    clearFilters_openCommunity: (personId) => dispatch(actionOpenCommunityFilter.clearFilters(personId)),
    saveNewSavedSearch_openCommunity: (personId, savedSearchName) => dispatch(actionOpenCommunityFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch_openCommunity: (personId, workFilterId) => dispatch(actionOpenCommunityFilter.updateSavedSearch(personId, workFilterId)),
    deleteSavedSearch_openCommunity: (personId, workFilterId) => dispatch(actionOpenCommunityFilter.deleteSavedSearch(personId, workFilterId)),
    chooseSavedSearch_openCommunity: (personId, workFilterId) => dispatch(actionOpenCommunityFilter.chooseSavedSearch(personId, workFilterId)),
    //Open Community entry functions
    saveOpenCommunityEntry: (personId, workId, selectedChapters, selectedLanguages, editNativeLanguage, selectedGenres, dueDate, editorsCount, declineIdleId, editSeverityId, openCommunityEntryId) => dispatch(actionOpenCommunity.saveOpenCommunityEntry(personId, workId, selectedChapters, selectedLanguages, editNativeLanguage, selectedGenres, dueDate, editorsCount, declineIdleId, editSeverityId, openCommunityEntryId)),
    removeOpenCommunityEntry: (personId, workId, openCommunityEntryId) => dispatch(actionOpenCommunity.removeOpenCommunityEntry(personId, workId, openCommunityEntryId)),
    commitOpenCommunityEntry: (personId, openCommunityEntryId, chapterIds, languageIds, nativeLanguageEdit) => dispatch(actionOpenCommunity.commitOpenCommunityEntry(personId, openCommunityEntryId, chapterIds, languageIds, nativeLanguageEdit)),
    uncommitOpenCommunityEntry: (personId, openCommunityEntryId) => dispatch(actionOpenCommunity.uncommitOpenCommunityEntry(personId, openCommunityEntryId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, initOpenCommunityFilter, initEditSeverityList, initWorkFilter, initOpenCommunity, personId} = props
            initOpenCommunity(personId)
            initWorkFilter(personId)
            initOpenCommunityFilter(personId)
            initEditSeverityList()
            getPageLangs(personId, langCode, 'OpenCommunityView')
        
  }, [])

  const {editSeverityOptions, declineIdleOptions, genreOptions, languageOptions, openCommunityFilterList} = props
          if (!editSeverityOptions || editSeverityOptions.length === 0
                  || !openCommunityFilterList || openCommunityFilterList.length === 0
                  || !declineIdleOptions || declineIdleOptions.length === 0
                  || !genreOptions || genreOptions.length === 0
                  || !languageOptions || languageOptions.length === 0)
              return null
          return (
              <OpenCommunityView {...props} />
          )
}

export default Container
