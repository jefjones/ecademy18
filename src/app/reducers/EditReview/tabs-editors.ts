import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const tabs = (state = [], action) => {
    switch(action.type) {
        case types.TABS_EDITORS_INIT:
            return action.payload
        case types.TABS_EDITORS_SET_COUNTS:
            let newTabsEditors = Object.assign([], state)
            let editCounts = action.payload
            newTabsEditors = newTabsEditors && newTabsEditors.length > 0 &&
                newTabsEditors.map(tab => {
                    editCounts && editCounts.length > 0 &&
                        editCounts.forEach(m => {
                            if (tab.personId === m.personId) {
                                tab.editCount = m.editCount
                            }
                        })
                        return tab
                    })
            return newTabsEditors ? newTabsEditors : state
        default:
            return state
    }
}

const chosenTab = (state = 0, action) => {
    switch(action.type) {
        case types.TABS_EDITORS_SET_SELECTED:
            return action.payload ? action.payload : state

        default:
            return state
    }
}

export default combineReducers({chosenTab, tabs})

export const selectTabsEditors = (state) => ({
    chosenTab: state.chosenTab,
    tabs: state.tabs && state.tabs.map(m => ({
        label: m.firstName,
        id: m.personId,
        editCount: m.editCount
    }))
})
