import * as types  from '../actions/actionTypes';

export default function(state = {}, action) {
  switch (action.type) {
    case types.PERSON_CONFIG_INIT:
      !!action.payload && localStorage.setItem("personConfig", JSON.stringify(action.payload));
      return action.payload

    default:
        return state;
  }
}

export const selectPersonConfig = (state) => state;
