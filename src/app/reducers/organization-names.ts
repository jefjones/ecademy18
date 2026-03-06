import * as types  from '../actions/actionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case types.ORGANIZATION_NAMES_INIT:
      return action.payload

    default:
        return state
  }
}

export const selectOrganizationNames = (state) => state
