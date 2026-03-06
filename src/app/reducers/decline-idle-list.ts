import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.DECLINE_IDLE_LIST_INIT:
            return action.payload

        default:
            return state
    }
}

 export const selectDeclineIdleList = (state) => state
