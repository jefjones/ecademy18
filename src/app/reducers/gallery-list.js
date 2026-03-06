import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.GALLERY_liSt_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectGalleryList = (state) => state;
