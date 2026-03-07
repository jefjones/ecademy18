import { useEffect } from 'react'
import EditorInviteWorkView from '../views/EditorInviteWorkView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import {doSort} from '../utils/sort'
import * as actionContacts from '../actions/contacts'
import * as actionWorkFilter from '../actions/work-filter'
import * as actionWorks from '../actions/works'
import * as actionChapters from '../actions/chapters'
import * as actionEditorInvitePending from '../actions/editor-invite-pending'
import * as fromWorks from '../reducers/works'
import * as editorInviteWork from '../actions/editor-invite-work'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'

import { selectWorkSummary, selectWorkSummaryCurrent, selectMe, selectWorkFilter, selectLanguageList, selectEditorInviteName,
            selectEditorInviteWorkAssign, selectEditorInvitePending, selectPersonConfig } from '../store'

//ToDO:  In case this route is called without access, make sure that the current PersonId owns this document in order to give access.

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    const editorInviteName = selectEditorInviteName(state)
    const editorInviteWorkAssign = selectEditorInviteWorkAssign(state);  //These work assign records are strictly on hold for this person being invited.
    let works = fromWorks.selectWorks(state.works)
    let workFilterList = selectWorkFilter(state)
    let me = selectMe(state)
    let currentWorkSummary = selectWorkSummaryCurrent(state)
    let workFilterOptions = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => !m.scratchFlag)
    workFilterOptions = workFilterOptions && workFilterOptions.length > 0
        && workFilterOptions.map(m => ({id: m.workFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let filterScratch = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => m.scratchFlag)[0]

    if (works && filterScratch.searchText) {
        works = works.filter(w => w.title && w.title.toLowerCase().indexOf(filterScratch.searchText.toLowerCase()) > -1)
    }

    //We are forcing the owner-type to be "mine" and the status to be "active".  This might be confusing if a user has a savedSearch that varies
    //  from those two settings. It will not be managing their expectations properly.  We may have to add a note to the page. Those controls are hidden on this view.
    works = works && works.filter(w => w.personId === me.personId)
    works = works && works.filter(w => w.active)

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
    let workSummaries = works && works.length > 0 && works.map(({workId}) => selectWorkSummary(state, workId))

    return {
        workFilterOptions,
        filterScratch,
        savedFilterIdCurrent: filterScratch && filterScratch.savedFilterIdCurrent,
        owner_personId: me.personId,
        personId: me.personId,
        langCode: me.langCode,
        currentWorkSummary,
        workSummaries,
        languageOptions: selectLanguageList(state),
        editorInviteName,
        editorInviteWorkAssign,
        editorInvitePending: selectEditorInvitePending(state),
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    init: (personId) => dispatch(actionWorkFilter.init(personId)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    setContactCurrentSelected: (personId, contactPersonId, href) => dispatch(actionContacts.setContactCurrentSelected(personId, contactPersonId, href)),
    sendEditorInvite: (user_PersonId, editorInviteName, editorInviteWorkAssign) => dispatch(editorInviteWork.sendEditorInvite(user_PersonId, editorInviteName, editorInviteWorkAssign)),
    setWorkAssign: (workId, chapterIdList, languageIdList, deleteChoice) => dispatch(editorInviteWork.setWorkAssign(workId, chapterIdList, languageIdList, deleteChoice)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    deleteInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.deleteInvite(personId, friendInvitationId)),
    acceptInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.acceptInvite(personId, friendInvitationId)),
    resendInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.resendInvite(personId, friendInvitationId)),
    clearFilters: (personId) => dispatch(actionWorkFilter.clearFilters(personId)),
    saveNewSavedSearch: (personId, savedSearchName) => dispatch(actionWorkFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch: (personId, workFilterId) => dispatch(actionWorkFilter.updateSavedSearch(personId, workFilterId)),
    deleteSavedSearch: (personId, workFilterId) => dispatch(actionWorkFilter.deleteSavedSearch(personId, workFilterId)),
    chooseSavedSearch: (personId, workFilterId) => dispatch(actionWorkFilter.chooseSavedSearch(personId, workFilterId)),
    updateFilterByField: (personId, field, value) => dispatch(actionWorkFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag: (personId, savedFilterIdCurrent, setValue) => dispatch(actionWorkFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {personId, getPageLangs, langCode, init, owner_personId} = props
          init(owner_personId)
          getPageLangs(personId, langCode, 'EditorInviteWorkView')
      
  }, [])

  if (!props.workSummaries) return null
        return <EditorInviteWorkView {...props} />
}

export default Container
