import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.RATING_BOOK_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectRatingBook = (state) => state;
