import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.MY_VISITED_PAGES_INIT:
            return action.payload;

				case types.MY_VISITED_PAGES_REMOVE: {
						const myVisitedPageId = action.payload;
						let newState = Object.assign([], state);
						newState = newState && newState.length > 0 && newState.filter(m => m.myVisitedPageId !== myVisitedPageId);
						return newState;
				}

				case types.MY_VISITED_PAGES_ADD: {
						const {path, description} = action.payload;
						let newState = Object.assign([], state);
            let previousEntry = newState && newState.length > 0 && newState[0];
            let isMatch = previousEntry && previousEntry.path === path;
            if (!isMatch) {
    						let option = {
    								path,
    								description
    						}
    						newState = newState && newState.length > 0 ? newState.concat(option) : [option];
            }
						return newState;
				}

        default:
            return state;
    }
}

export const selectMyVisitedPages = (state) => state;
