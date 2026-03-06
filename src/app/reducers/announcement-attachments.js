import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ANNOUNCEMENT_ATTACHMENTS_INIT: {
            return action.payload;
        }

         default:
            return state;
    }
}

export const selectAnnouncementAttachments = (state) => state;
