import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.OPEN_COMMUNITY_INIT: {
            return action.payload ? action.payload : state;
        }
        case types.OPEN_COMMUNITY_UPDATE: {
            const {openCommunity} = action.payload;
            return openCommunity ? openCommunity : [];
        }
        default:
            return state;
    }
}

export const selectOpenCommunity = (state) => state;
