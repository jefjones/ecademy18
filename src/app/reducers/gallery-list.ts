import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.GALLEY_LIST_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectGalleryList = (state) => state
