import * as types from '../actions/actionTypes';

export default function(state = {}, action) {
    switch(action.type) {
        case types.EDIT_FILTER_INIT:
            return action.payload;

        case types.EDIT_FILTER_UPDATE: {
            let {personId, editFilter} = action.payload;
            let filterNew = Object.assign({}, state);
            filterNew.personId = personId ? personId : filterNew.personId;
            filterNew.status = editFilter.status ? editFilter.status : filterNew.status;
            filterNew.vote = editFilter.vote ? editFilter.vote : filterNew.vote;
            filterNew.editType = editFilter.editType ? editFilter.editType : filterNew.editType;
            filterNew.sort = editFilter.sort ? editFilter.sort : filterNew.sort;
            return filterNew;
        }
        default:
            return state;
    }
}

export const selectEditFilter = (state) => state;
