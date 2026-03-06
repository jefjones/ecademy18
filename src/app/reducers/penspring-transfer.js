import * as types  from '../actions/actionTypes';

export default function(state = '', action) {
  switch (action.type) {
    case types.PENSPRING_TRANSFER_FILE_ID:
      return action.payload ? action.payload : '';

    default:
        return state;
  }
}

export const selectPenspringTransfer = (state) => state;
