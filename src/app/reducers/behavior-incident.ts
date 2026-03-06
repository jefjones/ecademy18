import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const incidents  = (state = [], action) => {
    switch(action.type) {
        case types.BEHAVIOR_INCIDENT_INIT:
            return action.payload

        default:
            return state
    }
}

const filterGroups  = (state = [], action) => {
    switch(action.type) {
        case types.BEHAVIOR_INCIDENT_FILTER_GROUPS:
            return action.payload

        default:
            return state
    }
}

export default combineReducers({ incidents, filterGroups})

export const selectBehaviorIncidents = (state) => state.incidents
export const selectBehaviorIncidentFilterGroups = (state) => {
    return state.filterGroups && state.filterGroups.length > 0 && state.filterGroups.reduce((acc, m) => {
        let option = {
            ...m,
            id: m.behaviorIncidentFilterGroupId,
            label: m.groupName,
            behaviorIncidentFilterGroupId: m.behaviorIncidentFilterGroupId,
            groupName: m.groupName
        }
        return acc && acc.length > 0 ? acc.concat(option) : [option]
    },[])
}
