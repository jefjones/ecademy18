import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const mine = (state = [], action) => {
    switch(action.type) {
        case types.WORKS_MINE:
            return action.payload
				case types.WORK_FOLDER_TOGGLE_EXPANDED: {
						let workFolderId = action.payload
						let newState = Object.assign({}, state)
						newState.folders = findAndSetExpandedFolder(workFolderId, newState && newState.folders)
            return newState
				}

        default:
            return state
    }
}

const others = (state = [], action) => {
    switch(action.type) {
        case types.WORKS_SHARED_WITH_ME:
            return action.payload
				case types.WORK_FOLDER_TOGGLE_EXPANDED: {
						const workFolderId = action.payload
						const newState = Object.assign({}, state)
						newState.folders = findAndSetExpandedFolder(workFolderId, newState && newState.folders)
            return newState
				}

        default:
            return state
    }
}


export default combineReducers({ mine, others })

export const selectMyWorksFileTreeExplorer = (state) => state

function findAndSetExpandedFolder(workFolderId, workFolders) {
		if (workFolders && workFolders.length > 0) {
				return workFolders.map(m => {
						if (m.workFolderId === workFolderId) m.isExpanded = !m.isExpanded
						if (m.subContents) m.subContentsfolders = findAndSetExpandedFolder(workFolderId, m.subContents.folders)
						return m
				})
		}
		return workFolders
}
