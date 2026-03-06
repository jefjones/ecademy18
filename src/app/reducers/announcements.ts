import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const announcementEdit  = (state = {}, action) => {
    switch(action.type) {
        case types.ANNOUNCEMENT_EDIT:
            return !action.payload || (action.payload && action.payload.subject === '') ? {} : action.payload

        default:
            return state
    }
}

const chosenMessageGroupId  = (state = '', action) => {
    switch(action.type) {
        case types.MESSAGE_GROUPID_CHOSEN:
            return action.payload

        default:
            return state
    }
}

const announcementList  = (state = [], action) => {
    switch(action.type) {
        case types.ANNOUNCEMENT_LIST:
						return action.payload === 'EMPTY'
								? ''
								: action.payload
										? action.payload
										: ''

        default:
            return state
    }
}

const announcementsAdmin  = (state = {}, action) => {
    switch(action.type) {
        case types.ANNOUNCEMENTS_ADMIN:
            return action.payload

        default:
            return state
    }
}

const studentsSelected  = (state = [], action) => {
    switch(action.type) {
        case types.ANNOUNCEMENT_STUDENT_LIST:
            return action.payload ? action.payload : []

        default:
            return state
    }
}

const announcmentReplyId  = (state = '', action) => {
    switch(action.type) {
        case types.ANNOUNCEMENT_REPLY_ID:
            return action.payload === 'EMPTY'
								? ''
								: action.payload
								 		? action.payload
										: ''
        default:
            return state
    }
}

const announcementsSentBy  = (state = [], action) => {
    switch(action.type) {
        case types.ANNOUNCEMENTS_SENT_BY:
            return action.payload === 'EMPTY'
								? ''
								: action.payload
								 		? action.payload
										: ''
        default:
            return state
    }
}

const announcementsDeleted = (state = [], action) => {
    switch(action.type) {
        case types.ANNOUNCEMENTS_DELETED:
            return action.payload === 'EMPTY'
								? ''
								: action.payload
								 		? action.payload
										: ''
        default:
            return state
    }
}

const messageFullThread = (state = [], action) => {
    switch(action.type) {
        case types.ANNOUNCEMENT_SINGLE_FULL_THREAD:
            return action.payload === 'EMPTY'
								? ''
								: action.payload
								 		? action.payload
										: ''
        default:
            return state
    }
}

export default combineReducers({ announcementEdit, announcementList, announcementsAdmin, studentsSelected, announcmentReplyId, announcementsSentBy,
 																	announcementsDeleted, messageFullThread, chosenMessageGroupId})

export const selectAnnouncementEdit = (state) => state.announcementEdit
export const selectAnnouncementList = (state) => state.announcementList
export const selectAnnouncementsAdmin = (state) => state.announcementsAdmin
export const selectStudentsSelected = (state) => state.studentsSelected
export const selectAnnouncementReplyId = (state) => state.announcementReplyId
export const selectAnnouncementsSentBy = (state) => state.announcementsSentBy
export const selectAnnouncementsDeleted = (state) => state.announcementsDeleted
export const selectMessageFullThread = (state) => state.messageFullThread
export const selectChosenMessageGroupId = (state) => state.chosenMessageGroupId
