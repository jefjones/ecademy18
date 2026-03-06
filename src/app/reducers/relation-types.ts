import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.RELATION_TYPES_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectRelationTypes = (state) => state
