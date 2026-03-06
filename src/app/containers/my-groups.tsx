import { useEffect } from 'react'
import MyGroupsView from '../views/MyGroupsView'
import { useSelector, useDispatch } from 'react-redux'
import {doSort} from '../utils/sort'
import * as actionWorkFilter from '../actions/work-filter'
import * as actionWorks from '../actions/works'
import * as actionGroups from '../actions/groups'
import * as actionPeerGroup from '../actions/peer-group'
import * as actionChapters from '../actions/chapters'
import * as fromWorks from '../reducers/works'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectWorkFilter, selectFetchingRecord, selectGroups } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    //0. If this page is hit with the "init" parameter and there isn't a selectworkIdCurrent, then reroute the user to the Add New Document page,
    //1. Filter the works list, if any filters are chosen.
    //2. Loop through the work records, marking the currently chosen Work (so that it might be designated with some background color in a list later).
    let me = selectMe(state)
    let works = fromWorks.selectWorks(state.works)
    let workFilterList = selectWorkFilter(state)
    let workFilterOptions = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => !m.scratchFlag)
    workFilterOptions = workFilterOptions && workFilterOptions.length > 0
        && workFilterOptions.map(m => ({id: m.workFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let filterScratch = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => m.scratchFlag)[0]

    if (works && filterScratch.searchText) {
        works = works.filter(w => w.title && w.title.toLowerCase().indexOf(filterScratch.searchText.toLowerCase()) > -1)
    }

    if (works && !filterScratch.mine) {
        works = works.filter(w => w.personId !== me.personId)
    }

    if (works && !filterScratch.others) {
        works = works.filter(w => w.personId === me.personId)
    }

    if (works && !filterScratch.active) {
        works = works.filter(w => !w.active)
    }

    if (works && !filterScratch.completed) {
        works = works.filter(w => !w.completed)
    }

    if (works && filterScratch.dueDateFrom && filterScratch.dueDateTo) {
        works = works.filter(w => w.dueDate >= filterScratch.dueDateFrom && w.dueDate <= filterScratch.dueDateTo)
    } else if (works && filterScratch.dueDateFrom) {
        works = works.filter(w => w.dueDate >= filterScratch.dueDateFrom)
    } else if (works && filterScratch.dueDateTo) {
        works = works.filter(w => w.dueDate <= filterScratch.dueDateTo)
    }

    let sortByHeadings = {
        sortField: filterScratch.orderByChosen,
        isAsc: filterScratch.orderSortChosen === 'asc' ? true : false,
        isNumber: false //None of the options are numbers in this case
    }

    works = doSort(works, sortByHeadings)

    return {
        workFilterOptions,
        filterScratch,
        savedFilterIdCurrent: filterScratch && filterScratch.savedFilterIdCurrent,
        groupSummaries: selectGroups(state),
        personId: me.personId,
        langCode: me.langCode,
        fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    workFilterInit: (personId) => dispatch(actionWorkFilter.init(personId)),
    groupInit: (personId) => dispatch(actionGroups.init(personId)),
    removeMember: (personId, groupId, member_personId) => dispatch(actionGroups.removeMember(personId, groupId, member_personId)),
    setGroupCurrentSelected: (personId, groupId, masterWorkId, memberWorkId, goToPage) => dispatch(actionGroups.setGroupCurrentSelected(personId, groupId, masterWorkId, memberWorkId, goToPage)),
    deleteGroup: (personId, groupId) => dispatch(actionGroups.deleteGroup(personId, groupId)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    clearFilters: (personId) => dispatch(actionWorkFilter.clearFilters(personId)),
    saveNewSavedSearch: (personId, savedSearchName) => dispatch(actionWorkFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch: (personId, workFilterId) => dispatch(actionWorkFilter.updateSavedSearch(personId, workFilterId)),
    deleteSavedSearch: (personId, workFilterId) => dispatch(actionWorkFilter.deleteSavedSearch(personId, workFilterId)),
    chooseSavedSearch: (personId, workFilterId) => dispatch(actionWorkFilter.chooseSavedSearch(personId, workFilterId)),
    updateFilterByField: (personId, field, value) => dispatch(actionWorkFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag: (personId, savedFilterIdCurrent, setValue) => dispatch(actionWorkFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    deletePeerGroup: (personId, peerGroupId) => dispatch(actionPeerGroup.deletePeerGroup(personId, peerGroupId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, groupInit, workFilterInit, personId} = props
          workFilterInit(personId)
          groupInit(personId)
          getPageLangs(personId, langCode, 'MyGroupsView')
      
  }, [])

  return <MyGroupsView {...props} />
}

export default Container
