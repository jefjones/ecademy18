import * as types from '../actions/actionTypes'
//import {guidEmpty} from '../utils/guidValidate';

export default function(state = {}, action) {
    switch(action.type) {
        case types.DISCUSSION_ENTRIES_INIT: {
            return action.payload
        }

				//This freezes the browser for some reason.  I worked on it for three hours and couldn't get it to work.
				// case types.DISCUSSION_ENTRIES_ADD_OR_UPDATE: {
				// 		let discussionEntry = action.payload;
				// 		let newState = Object.assign({}, state);
				// 		let discussionEntries = newState.discussionEntries;
				// 		//if (discussionEntry && discussionEntry.discussionEntryId && discussionEntry.discussionEntryId !== guidEmpty) {
				// 				discussionEntries = discussionEntries && discussionEntries.length > 0
				// 						&& discussionEntries.filter(m => m.discussionEntryId !== discussionEntry.discussionEntryId);
				// 		//}
				// 		discussionEntries.push(discussionEntry);
				// 		newState.discussionEntries = discussionEntries;
        //     return newState;
        // }

				case types.DISCUSSION_ENTRIES_REMOVE: {
						let discussionEntryId = action.payload
						let newState = Object.assign({}, state)
						newState.discussionEntries = newState && newState.discussionEntries && newState.discussionEntries.length > 0
								&& newState.discussionEntries.filter(m => m.discussionEntryId !== discussionEntryId)
            return newState
        }

         default:
            return state
    }
}

export const selectDiscussionEntries = (state) => state
