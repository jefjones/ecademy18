import * as types  from '../actions/actionTypes'

export default function(state=[], action) {
  switch (action.type) {
    case types.EDITOR_INVITE_PENDING:
        return action.payload
    default:
        return state
  }
}

export const selectEditorInvitePending = (state) => state
