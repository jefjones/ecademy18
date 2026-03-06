import * as types  from '../actions/actionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case types.LANDING_STEPS_INIT:
      return action.payload

    default:
        return state
  }
}

export const selectLandingSteps = (state) => state
