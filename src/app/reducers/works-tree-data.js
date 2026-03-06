import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.WORKS_TREE_DATA_INIT: {
            return action.payload;
        }

         default:
            return state;
    }
}


export const selectWorksTreeData = (state) => {
  return state;
}
