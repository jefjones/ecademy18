import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const learnerPathways  = (state = [], action) => {
    switch(action.type) {
        case types.MENTOR_SUMMARY_PATHWAYS:
            return !action.payload || action.payload.length === 0 ? [] : action.payload

        default:
            return state
    }
}

const pathwayComments  = (state = [], action) => {
    switch(action.type) {
        case types.MENTOR_PATHWAY_COMMENTS:
            return !action.payload || action.payload.length === 0 ? [] : action.payload

        default:
            return state
    }
}

export default combineReducers({ learnerPathways, pathwayComments })

export const selectLearnerPathways = (state) => state.learnerPathways
export const selectPathwayComments = (state) => state.pathwayComments
