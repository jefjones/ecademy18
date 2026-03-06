import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.DRAFT_SETTINGS_INIT: {
            return action.payload ? action.payload : state
        }
        default:
            return state
    }
}

export const selectDraftSettings = (state) => state
