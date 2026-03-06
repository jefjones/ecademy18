import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.ADMIN_RESPONSE_PENDINGS_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectAdminResponsePendings = (state) => state
