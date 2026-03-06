import * as types from '../actions/actionTypes'

export default function(state={}, action) {
    switch(action.type) {
        case types.DRAFT_COMPARISON_INIT: {
            return action.payload ? action.payload : state
        }
        case types.DRAFT_COMPARISON_TAB_SET: {
            return {
                ...state,
                chosenTab: action.payload
            }
        }
        case types.DRAFT_VIEW_TOGGLE: {
            return {
                ...state,
                isDraftView: !state.isDraftView
            }
        }
        default:
            return state
    }
}

//The structure of the comparison is in key-value pairs:
/*
    [draftComparisonId]: {
        draftComparisonId:
        draftDate:
        chapterText:
        isCurrent:
    }
*/

export const selectIsDraftView = (state) => state.isDraftView
export const selectDraftComparisons = (state) => state.comparisons
export const selectDraftTabs = (state) => {
    let draftComparisons = Object.keys(state.comparisons).reduce((acc, c) => state.comparisons[c] ? acc.concat(state.comparisons[c]) : acc, [])
    draftComparisons = draftComparisons && draftComparisons.length > 0 &&
        draftComparisons.map(m => {
            return ({
                label: m.name.substring(0,25),
                id: m.draftComparisonId,
                isCurrent: m.isCurrent,
            })
        })

    return {
        chosenTab: state.chosenTab,
        tabs: draftComparisons
    }
}
