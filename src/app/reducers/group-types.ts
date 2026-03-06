import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.GROUP_TYPES_INIT:
            return action.payload

        default:
            return state
    }
}

 export const selectGroupTypes = (state) => state
