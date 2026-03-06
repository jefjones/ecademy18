import * as types from '../actions/actionTypes'
import * as guid from '../utils/GuidValidate'

export default function(state = guid.emptyGuid(), action) {
    switch(action.type) {
        case types.WORK_CURRENT_SET_SELECTED: {
            const {workId} = action.payload
            !!workId && localStorage.setItem("workId_current", JSON.stringify(workId))
            return workId ? workId : action.payload
        }
        default:
            return state
    }
}

export const selectWorkIdCurrent = (state) => guid.isGuidNotEmpty(state) && state !== "EMPTY" ? state : guid.emptyGuid()
