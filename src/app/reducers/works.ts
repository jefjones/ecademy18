import * as types from '../actions/actionTypes'
import numberFormat from '../utils/numberFormat'
import {doSort} from '../utils/sort'

export default function(state = {}, action) {
    switch(action.type) {
        case types.WORKS_INIT:
            !!action.payload && localStorage.setItem("works", JSON.stringify(action.payload))
            return action.payload

        case types.WORK_NEW_ADD: {
            let work = action.payload
            let newState = state && state.length > 0 && state.filter(m => m.workId !== work.workId)
            return newState ? newState.concat(work) : [work]
        }
        case types.WORK_NEW_UPDATE: {
            let work = action.payload
            let newState = state && state.length > 0 && state.filter(m => m.workId !== work.workId)
            return newState ? newState.concat(work) : [work]
        }

				case types.WORK_PENSPRING_SUBMITTED: {
						let workId = action.payload
						let newState = [...state]
						newState = newState && newState.length > 0 && newState.map(m => {
								if (m.workId === workId) {
										m.isHomeworkSubmitted = true
										m.homeworkSubmittedDate = new Date()
								}
								return m
						})
						return newState
				}

				case types.WORK_PENSPRING_DISTRIBUTED: {
						let workId = action.payload
						let newState = [...state]
						newState = newState && newState.length > 0 && newState.map(m => {
								if (m.workId === workId) {
										m.publishedDate = new Date()
								}
								return m
						})
						return newState
				}

        case types.OPEN_COMMUNITY_UPDATE: {
            let {workId, setValue} = action.payload
            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            newWork.hasOpenCommunityEntry = setValue
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }

        case types.WORK_CURRENT_SET_SELECTED: {
            let {workId, chapterId, languageId, languageName} = action.payload
            //In this case, there is a call out there that only returns the workId for the workId_current setting.
            //If this comes back with the WorkId set to null, then just return the state and do not update..
            if (!state || !workId) {
                return state
            }
            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            if (!!newWork) {
                newWork.chapterId_current = chapterId ? chapterId : ''
                newWork.languageId_current = languageId ? languageId : newWork.languageId_current
                newWork.languageName_current = languageName ? languageName : newWork.languageName_current
                let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
                return newState ? newState.concat(newWork) : [newWork]
            }
            return state
        }
        case types.WORK_DELETE: {
            let workId = action.payload
            let newWorkList = Object.assign([], state)
            delete newWorkList[workId]
            return newWorkList
        }
        case types.WORK_SET_VISITED_HREFID: {
            let {workId, hrefId, hrefSentence} = action.payload
            let newWork = (state && state.length > 0 && state.filter(m => m.workId === workId)[0]) || {}
            newWork.lastVisitedHrefId = hrefId
            newWork.lastVisitedHrefSentence = hrefSentence
            newWork.lastUpdate = new Date()
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }
        case types.WORK_EDITOR_ASSIGN_UPDATE: {
            let {workId, editorAssign} = action.payload
            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            newWork.editorAssign = editorAssign
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }
        case types.WORK_CHAPTER_DUEDATE_UPDATE: {
            const {workId, chapterId, dueDate} = action.payload

            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            let chapterOptions = newWork && Object.assign([], newWork.chapterOptions)
            chapterOptions = chapterOptions && chapterOptions.length> 0 && chapterOptions.map(m => {
                if (m.chapterId === chapterId) {
                    m.dueDate = dueDate
                }
                return m
            })
            newWork.chapterOptions = chapterOptions
            newWork.chapterDueDate = dueDate
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }

        case types.WORK_UPDATE_CHAPTERS: {
            //Here, we want to leave the existing chapterText values alone since they could be lengthy (if they have been downloaded by now)
            //  and just update the structure.
            //Be sure to check to see if the ChapterId exists or not.  If not, then add it instead of update.
            const {workId, chapters} = action.payload
            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            const oldChapters = newWork.chapterOptions
            let newChapters = []
            let temp = {}
            chapters.forEach(chap => {
                temp = {
                    label: chap.label,
                    id: chap.id,
                    chapterId: chap.id,
                    name: chap.name,
                    chapterNbr: chap.chapterNbr,
                    chapterText: '',
                    sectionCount: chap.sectionCount,
                    workStatusId: chap.workStatusId,
                    wordCount: chap.wordCount,
                    lastUpdate: chap.lastUpdate,
                    dueDate: chap.dueDate,
                    sentenceCount: chap.sentenceCount,
                    editsPending: chap.editsPending,
                    editsProcessed: chap.editsProcessed,
                    editorsCount: chap.editorsCount,
                    workStatusName: chap.workStatusName,
                    editSeverityName: chap.EditSeverityName,
                    authorComment: chap.authorComment,
                    editorComments: chap.editorComments,
                }
                if (oldChapters.filter(m => m.chapterId === chap.chapterId)) {
                    let filter = oldChapters.filter(m => m.chapterId === chap.chapterId)[0]; //Notice that we get this one from the old table since we don't want to bring the text over (again) which could be big..
                    temp.chapterText = filter && filter.chapterText
                }
                newChapters = newChapters.length > 0 ? newChapters.concat(temp) : [temp]
            })
            newWork.chapterOptions = newChapters
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }
        case types.WORK_CHAPTER_DELETE: {
            const {workId, chapterOptions} = action.payload
            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            newWork.chapterOptions = chapterOptions
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }
        case types.WORK_CHAPTEROPTIONS_UPDATE: {
            const {workId, chapterOptions} = action.payload
            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            newWork.chapterOptions = chapterOptions
            newWork.sectionCount = chapterOptions && chapterOptions.length
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }
        case types.WORK_CHAPTER_RESEQUENCE: {
            const {workId, chapterOptions} = action.payload
            let newWork = state && state.length > 0 && state.filter(m => m.workId === workId)[0]
            newWork.chapterOptions = chapterOptions
            let newState = state && state.length > 0 && state.filter(m => m.workId !== workId)
            return newState ? newState.concat(newWork) : [newWork]
        }
        default:
            return state
    }
}


export const selectWorkById = (state, workId) => state && state.length > 0 && state.filter(m => m.workId === workId)[0]

export const selectWorkSummary = (state, workId, workId_current, me_personId) => {
    const work = selectWorkById(state, workId)
    if (!work || !work.workId) return

    let hasChapter = work && work.chapterId_current && work.chapterOptions && work.chapterOptions.length > 0 && work.chapterOptions.filter(m => m.chapterId === work.chapterId_current)[0]
    let chapterName_current = !hasChapter
        ? work.chapterName_current
        : hasChapter.name

    let chapterNbr_current = !hasChapter
        ? work.chapterNbr_current
        : hasChapter.chapterNbr

    return {
        ...work,
        chapterName_current,
        chapterNbr_current,
        isCurrentWork: workId === workId_current,
        isUserOwner: me_personId === work.personId,
        sectionCount: work.chapterOptions && work.chapterOptions.length,
        dueDate: work.chapterDueDate,
        wordCount: work.chapterWordCount,
        sentenceCount: work.chapterSentenceCount,
    }
}

export const selectWorks = (state) => state && state.length > 0 && state.map(({workId}) => selectWorkSummary(state, workId))

export const selectChaptersArray = (state, workId) => {
    let work = selectWorks(state).filter(m => m.workId === workId)[0]
    return work ? work.chapterOptions : []
}

export const selectChapterSummary = (state, workId, workId_current, chapter, me_personId) => {
    const work = selectWorkById(state, workId)
    if (!work || !chapter) return

    let languageOptions = work.languageOptions
    if (languageOptions && languageOptions.length > 0) languageOptions = doSort(languageOptions, {sortField: 'label', isAsc: true, isNumber: false})

    return {
        isCurrentWork: workId === workId_current,
        isUserOwner: me_personId === work.personId,
        workId: work.workId,
        title: chapter.name,
        description: work.description,
        author: work.authorName,
        authorPersonId: work.personId,
        //entryDate: work.entryDate,  We don't have an entry date specifically for a chapter. But I think that we should
        dueDate: chapter.dueDate,
        lastUpdate: work.lastUpdate,
        wordCount: numberFormat(work.chapterOptions.filter(m => m.chapterId === chapter.chapterId)[0].wordCount),
        sentenceCount: chapter.sentenceCount,
        editsPending: chapter.editsPending,
        editsProcessed: chapter.editsProcessed,
        editorsCount: chapter.editorsCount,
        sectionCount: work.chapterOptions.length,
        chapterName_current: chapter && chapter.name,
        chapterNbr_current: chapter && chapter.chapterNbr,
        chapterId_current: work.chapterId_current,
        chapterId: chapter.chapterId,
        languageId_current: work.languageId_current,
        chapterNbr: chapter.chapterNbr,
        chapterOptions: work.chapterOptions, //I don't think this one is useful since it is all chapters and we are showing one chapter at a time, so that this is repeated throughout all chapters.
        sequenceOptions: work.chapterOptions.map(m => ({label: m.chapterNbr, id: m.chapterNbr})),
        languagesCount: work.languagesCount,
        languageId: work.languageId_current || work.languageId,
        languageName_current: work.languageName_current,
        languageOptions,
        chapterName: chapter.name,
        workStatusId: chapter.workStatusId,
        hrefId: '',
        hrefSentence: '',
        editorAssign: chapter.editorAssign,
        lastVisitedHrefId: '',
        fileName: '',
        workStatusName: chapter && chapter.workStatusName,
        editSeverityName: chapter && chapter.editSeverityName,
        authorComment: chapter && chapter.authorComment,
        editorComments: chapter && chapter.editorComments,
      }
}


export const hasActiveDocument = (state, personId) => state && state.length > 0 &&
    selectWorks(state).map(m => m.editorAssign && m.editorAssign.length > 0 && m.editorAssign.editorPersonId === personId && m.isActive)

export const hasCompletedDocument = (state, personId) => state && state.length > 0 &&
        selectWorks(state).map(m => m.editorAssign && m.editorAssign.length > 0 && m.editorAssign.editorPersonId === personId && m.completed)

export const selectEditorAssignCountByPersonId = (state, personId) => (state && state.length > 0 &&
        selectWorks(state).filter(m => m.editorAssign && m.editorAssign.length > 0 && m.editorAssign.editorPersonId === personId).length) || 0

export const selectEditorSoonestDueDate = (state, personId) => {
    let soonestDueDate = ""
    state && state.length > 0 && selectWorks(state).forEach(m => {
        if ((!soonestDueDate && m.dueDate) || (m.dueDate < soonestDueDate)) {
            soonestDueDate = m.dueDate
        }
    })
    return soonestDueDate
}

export const isContactAnEditor = (state, personId) => state && state.length > 0 &&
    selectWorks(state).map(m => m.editorAssign && m.editorAssign.length > 0 && m.editorAssign.editorPersonId === personId)

export const selectEditorAssignByPersonAndWorkId = (state, workId, personId) => {
    let editorAssign = []
    let works = selectWorks(state)

    if (works && works.length > 0) {
        let work = works.filter(m => m.workId === workId)[0]
        editorAssign = work.editorAssign
        if (work && editorAssign) {
            editorAssign = editorAssign.filter(m => m.editorPersonId === personId)
        }
    }
    return editorAssign
}

export const selectEditorAssignLanguageList = (state, personId, workId) => state && state.length > 0 &&
    selectWorks(state).filter(m => m.workId === workId)
        .editorAssign.filter(m => m.editorPersonId === personId)
            .reduce((acc, assign) => acc = acc.includes(assign.languageId) ? acc : acc.concat(assign.languageId), [])
