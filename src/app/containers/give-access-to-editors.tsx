import { useEffect } from 'react'
import GiveAccessToEditorsView from '../views/GiveAccessToEditorsView'
import { useSelector, useDispatch } from 'react-redux'
import {doSort} from '../utils/sort'
import * as actionContactFilter from '../actions/contact-filter'
import * as fromMe from '../reducers/login'
import * as fromContacts from '../reducers/contacts'
import * as actionChapters from '../actions/chapters'
import * as fromWorks from '../reducers/works'
import * as actionWorks from '../actions/works'
import * as actionEditorAssign from '../actions/editor-assign'
import * as actionEditorInvitePending from '../actions/editor-invite-pending'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'

import { selectWorkSummaryCurrent, selectContactFilter, selectWorkIdCurrent, selectLanguageList, selectEditorInvitePending,
            selectPersonConfig } from '../store'

//ToDO:  In case this route is called without access, make sure that the current PersonId owns this document in order to give access.

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    //0. Loop through the contacts and add hasActiveDocument, hasOnlyCompletedDocument, editorSoonestDueDate, editorlastUpdate
    //1. Filter the contacts list, if any filters are chosen.
    //2. Loop through the contacts records, marking the currently chosen contact (so that it might be designated with some background color in a list later).
    let contacts = fromContacts.selectContactsArray(state.contacts).map(c => {
        c.languageNames = "English"; //ToDO Get this from the personProfile record from the database.
        return c
    })
    let me = fromMe.selectMe(state.me)
    contacts = contacts.filter(c => c.personId !== me.personId)
    let contactFilterList = selectContactFilter(state)
    let contactFilterOptions = contactFilterList && contactFilterList.length > 0 && contactFilterList.filter(m => !m.scratchFlag)
    contactFilterOptions = contactFilterOptions && contactFilterOptions.length > 0
        && contactFilterOptions.map(m => ({id: m.contactFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let filterScratch = contactFilterList && contactFilterList.length > 0 && contactFilterList.filter(m => m.scratchFlag)[0]

    if (contacts && filterScratch.searchText) {
        contacts = contacts.filter(c => c.fullName && c.fullName.toLowerCase().indexOf(filterScratch.searchText.toLowerCase()) > -1)
    }

    if (contacts && !filterScratch.editors) {
        contacts = contacts.filter(c => !fromWorks.isContactAnEditor(state.works, c.personId) ? c : '')
    }

    if (contacts && !filterScratch.notAssigned) {
      contacts = contacts.filter(c => fromWorks.isContactAnEditor(state.works, c.personId) ? c : '')
    }

      //Get the editors who are assigned to works that are NOT active.  Notice that we will be ignoring non-editors.
    if (contacts && !filterScratch.active) {
        contacts = contacts.filter(c => { // eslint-disable-line
            if (!fromWorks.isContactAnEditor(state.works, c.personId)) {
                return c
            } else if (!c.hasActiveDocument) {
                return c
            }
        })
    }

    // //Get the editors who are assigned to works that are NOT completed.  Notice that we will be ignoring non-editors.
    if (contacts && !filterScratch.completed) {
        contacts = contacts.filter(c => {  // eslint-disable-line
            if (!fromWorks.isContactAnEditor(state.works, c.personId)) {
                return c
            } else if (!c.hasCompletedDocument) {
                return c
            }
        })
    }

    if (contacts && filterScratch.dueDateFrom && filterScratch.dueDateTo) {
        contacts = contacts.filter(c => c.editorSoonestDueDate >= filterScratch.dueDateFrom && c.editorSoonestDueDate <= filterScratch.dueDateTo)
    } else if (contacts && filterScratch.dueDateFrom) {
        contacts = contacts.filter(c => c.editorSoonestDueDate >= filterScratch.dueDateFrom)
    } else if (contacts && filterScratch.dueDateTo) {
        contacts = contacts.filter(c => c.editorSoonestDueDate <= filterScratch.dueDateTo)
    }

    let sortByHeadings = {
        sortField: filterScratch.orderByChosen,
        isAsc: filterScratch.orderSortChosen === 'asc' ? true : false,
        isNumber: false //None of the options are numbers in this case
    }
    contacts = doSort(contacts, sortByHeadings)

    const currentWork = fromWorks.selectWorkById(state.works, selectWorkIdCurrent(state) || 0)

    return {
        workId: currentWork.workId,
        personId: me.personId,
        langCode: me.langCode,
        owner_personId: me.personId,
        languageId: currentWork.languageId,
        workSummary: selectWorkSummaryCurrent(state),
        contactFilterOptions,
        filterScratch,
        savedFilterIdCurrent: filterScratch && filterScratch.savedFilterIdCurrent,
        contactSummaries: contacts,
        chapterOptions: currentWork && currentWork.chapterOptions,
        languageOptions: selectLanguageList(state),
        editorInvitePending: selectEditorInvitePending(state),
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    init: (personId) => dispatch(actionContactFilter.init(personId)),
    setEditorAssign: (isAdd, workId, personId, owner_personId, chapters, languages) => dispatch(actionEditorAssign.setEditorAssign(isAdd, workId, personId, owner_personId, chapters, languages)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    deleteInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.deleteInvite(personId, friendInvitationId)),
    acceptInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.acceptInvite(personId, friendInvitationId)),
    resendInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.resendInvite(personId, friendInvitationId)),
    saveNewSavedSearch: (personId, savedSearchName) => dispatch(actionContactFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch: (personId, contactFilterId) => dispatch(actionContactFilter.updateSavedSearch(personId, contactFilterId)),
    deleteSavedSearch: (personId, contactFilterId) => dispatch(actionContactFilter.deleteSavedSearch(personId, contactFilterId)),
    chooseSavedSearch: (personId, contactFilterId) => dispatch(actionContactFilter.chooseSavedSearch(personId, contactFilterId)),
    updateFilterByField: (personId, field, value) => dispatch(actionContactFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag: (personId, savedFilterIdCurrent, setValue) => dispatch(actionContactFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
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
            getPageLangs(personId, langCode, 'GiveAccessToEditorsView')
        
  }, [])

  if (!props.contactSummaries) return null
          return <GiveAccessToEditorsView {...props} />
}

export default Container
