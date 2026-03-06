import { useEffect } from 'react'
import GiveAccessToWorksView from '../views/GiveAccessToWorksView'
import { useSelector, useDispatch } from 'react-redux'
import {doSort} from '../utils/sort'
import * as actionContacts from '../actions/contacts'
import * as actionWorkFilter from '../actions/work-filter'
import * as actionWorks from '../actions/works'
import * as actionChapters from '../actions/chapters'
import * as fromContacts from '../reducers/contacts'
import * as fromWorks from '../reducers/works'
import * as actionEditorAssign from '../actions/editor-assign'
import * as actionEditorInvitePending from '../actions/editor-invite-pending'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'

import { selectWorkSummaryCurrent, selectWorkSummary, selectMe, selectWorkFilter, selectPersonIdCurrent,
            selectLanguageList, selectFetchingRecord, selectEditorInvitePending, selectPersonConfig } from '../store'

//ToDO:  In case this route is called without access, make sure that the current PersonId owns this document in order to give access.

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    //1. Filter the contacts list, if any filters are chosen.
    //2. Loop through the contacts records, marking the currently chosen contact (so that it might be designated with some background color in a list later).
    let contact = fromContacts.selectContactById(state.contacts, selectPersonIdCurrent(state))
    contact.languageNames = "English"; //ToDO Get this from the personProfile record from the database.
    contact.projectName = ""; //ToDo - start tracking documents grouped by projectName.
    contact.assignedCount = fromWorks.selectEditorAssignCountByPersonId(state.works, contact.personId)
    let works = fromWorks.selectWorks(state.works)
    let workFilterList = selectWorkFilter(state)
    let me = selectMe(state)
    let workFilterOptions = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => !m.scratchFlag)
    workFilterOptions = workFilterOptions && workFilterOptions.length > 0
        && workFilterOptions.map(m => ({id: m.workFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let filterScratch = workFilterList && workFilterList.length > 0 && workFilterList.filter(m => m.scratchFlag)[0]

    if (works && filterScratch.searchText) {
        works = works.filter(w => w.title && w.title.toLowerCase().indexOf(filterScratch.searchText.toLowerCase()) > -1)
    }

    if (works && !filterScratch.mine) {
        works = works.filter(w => w.authors && !w.authors.includes(me.personId))
    }

    if (works && !filterScratch.others) {
        works = works.filter(w => w.authors && w.authors.includes(me.personId))
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
    let workSummaries = works.filter(m => m.personId === me.personId).map(({workId}) => selectWorkSummary(state, workId))
    let currentWorkSummary = selectWorkSummaryCurrent(state)

    return {
        workFilterOptions,
        filterScratch,
        savedFilterIdCurrent: filterScratch && filterScratch.savedFilterIdCurrent,
        personId: contact.personId,
        owner_personId: me.personId,
        langCode: me.langCode,
        languageId: contact.languageId,
        currentWorkSummary,
        workSummaries,
        contactSummary: contact,
        languageOptions: selectLanguageList(state),
        fetchingRecord: selectFetchingRecord(state),
        editorInvitePending: selectEditorInvitePending(state),
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    init: (personId) => dispatch(actionWorkFilter.init(personId)),
    setEditorAssign: (isAdd, workId, personId, owner_personId, chapters, languages) => dispatch(actionEditorAssign.setEditorAssign(isAdd, workId, personId, owner_personId, chapters, languages)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    setContactCurrentSelected: (personId, contactPersonId, href) => dispatch(actionContacts.setContactCurrentSelected(personId, contactPersonId, href)),
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
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, init, personId} = props
          init(personId)
          getPageLangs(personId, langCode, 'GiveAccessToWorksView')
      
  }, [])

  if (!props.workSummaries) return null
        return <GiveAccessToWorksView {...props} />
}

export default Container
