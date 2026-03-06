import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.WORK_STATUS_LIST_INIT:
            return action.payload

        default:
            return state
    }
}

 export const selectWorkStatusList = (state) => state
