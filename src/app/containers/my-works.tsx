import { useEffect } from 'react'
import MyWorksView from '../views/MyWorksView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import {doSort} from '../utils/sort'
import * as fromWorks from '../reducers/works'
import * as actionWorkFilter from '../actions/work-filter'
import * as actionWorks from '../actions/works'
import * as actionFileTreeSubContents from '../actions/file-tree-sub-contents'
import * as actionChapters from '../actions/chapters'
import * as actionEditReview from '../actions/edit-review'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionPersonConfig from '../actions/person-config'
import * as actionGradebook from '../actions/grade-book'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectWorkFilter, selectWorkSummaryCurrent, selectFetchingRecord, selectGroups, selectPersonConfig, selectMyWorksFileTreeExplorer } from '../store'

const mapStateToProps = (state, props) => {
    //0. If this page is hit with the "init" parameter and there isn't a selectworkIdCurrent, then reroute the user to the Add New Document page,
    //1. Filter the works list, if any filters are chosen.
    //2. Loop through the work records, marking the currently chosen Work (so that it might be designated with some background color in a list later).
    let me = selectMe(state)
    let group = props && props.params && props.params.groupChosen && selectGroups(state).filter(m => m.groupId === props.params.groupChosen)[0]
    const workSummary = selectWorkSummaryCurrent(state)
    let works = fromWorks.selectWorks(state.works)
    let workFilterList = selectWorkFilter(state)
    let workFilterOptions = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => !m.scratchFlag)
    workFilterOptions = workFilterOptions && workFilterOptions.length > 0
        && workFilterOptions.map(m => ({id: m.workFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let filterScratch = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => m.scratchFlag)[0]

    if (!!group) works = works && works.length > 0 && works.filter(w => w.groupId === group.groupId)
    if (works && filterScratch.searchText) works = works && works.length > 0 && works.filter(w => w.title && w.title.toLowerCase().indexOf(filterScratch.searchText.toLowerCase()) > -1)
    if (works && !filterScratch.mine) works = works && works.length > 0 && works.filter(w => w.personId !== me.personId)
    if (works && !filterScratch.others) works = works && works.length > 0 && works.filter(w => w.personId === me.personId)
    if (works && !filterScratch.active) works = works && works.length > 0 && works.filter(w => !w.active)
    if (works && !filterScratch.completed) works = works && works.length > 0 && works.filter(w => !w.completed)
    if (works && filterScratch.dueDateFrom && filterScratch.dueDateTo) {
        works = works && works.length > 0 && works.filter(w => w.dueDate >= filterScratch.dueDateFrom && w.dueDate <= filterScratch.dueDateTo)
    } else if (works && filterScratch.dueDateFrom) {
        works = works && works.length > 0 && works.filter(w => w.dueDate >= filterScratch.dueDateFrom)
    } else if (works && filterScratch.dueDateTo) {
        works = works && works.length > 0 && works.filter(w => w.dueDate <= filterScratch.dueDateTo)
    }

    let sortByHeadings = {
        sortField: filterScratch.orderByChosen,
        isAsc: filterScratch.orderSortChosen === 'asc' ? true : false,
        isNumber: false //None of the options are numbers in this case
    }

    works = doSort(works, sortByHeadings)

    return {
        group,
        workFilterOptions,
        filterScratch,
        savedFilterIdCurrent: filterScratch && filterScratch.savedFilterIdCurrent,
        workSummaries: works,
        workSummary,
        fileTreeExplorer: selectMyWorksFileTreeExplorer(state),
        personId: me.personId,
        langCode: me.langCode,
        fetchingRecord: selectFetchingRecord(state),
        personConfig: selectPersonConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getMyWorks: (personId) => dispatch(actionFileTreeSubContents.getMyWorks(personId)),
		getWorksSharedWithMe: (personId) => dispatch(actionFileTreeSubContents.getWorksSharedWithMe(personId)),
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
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getAuthorWorkspace: (personId, workId, chapterId) => dispatch(actionEditReview.getAuthorWorkspace(personId, workId, chapterId)),
		setPenspringHomeworkSubmitted: (personId, workId) => dispatch(actionWorks.setPenspringHomeworkSubmitted(personId, workId)),
		resolveFetchingRecordFileTreeExplorer: () => dispatch(actionFetchingRecord.resolveFetchingRecordFileTreeExplorer()),
		setGradebookScoreByPenspring: (personId, studentAssignmentResponseId, score) => dispatch(actionGradebook.setGradebookScoreByPenspring(personId, studentAssignmentResponseId, score)),
		toggleExpanded: (workFolderId) => dispatch(actionFileTreeSubContents.toggleExpanded(workFolderId)),
		toggleAllExpanded: (personId, expandAll) => dispatch(actionFileTreeSubContents.toggleAllExpanded(personId, expandAll)),
		setPenspringDistributeSubmitted: (personId, workId) => dispatch(actionWorks.setPenspringDistributeSubmitted(personId, workId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    	      const {getPageLangs, langCode, getMyWorks, getWorksSharedWithMe, personId} = props
    				getMyWorks(personId)
    				getWorksSharedWithMe(personId)
            getPageLangs(personId, langCode, 'MyWorksView')
    	  
  }, [])

  return <MyWorksView {...props} />
}

export default Container
