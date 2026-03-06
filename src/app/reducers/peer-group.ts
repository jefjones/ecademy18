import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.PEER_GROUP_INIT:
            return action.payload

        case types.PEER_GROUP_DELETE:
            const peerGroupId = action.payload
            return state.filter(m => m.groupId !== peerGroupId)

        default:
            return state
    }
}

export const selectPeerGroup = (state) => state
