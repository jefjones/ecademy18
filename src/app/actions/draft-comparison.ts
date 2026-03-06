import * as types from './actionTypes'
import getDraftComparison from '../services/draft-comparison'

function setDraftComparison( draftData={} ) {
    return { type: types.DRAFT_COMPARISON_INIT, payload: draftData }
}

export const init = (personId, workId, chapterId, languageId) => dispatch => {
    return getDraftComparison(personId, workId, chapterId, languageId).then( n => dispatch( setDraftComparison(n)))
}

export const toggleDraftView = () => ({ type: types.DRAFT_VIEW_TOGGLE, payload: null })

export const setDraftTabSelected = (draftComparisonId) => ({ type: types.DRAFT_COMPARISON_TAB_SET, payload: draftComparisonId })
