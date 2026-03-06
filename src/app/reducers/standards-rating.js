import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.STANDARDS_RATING_INIT:
            return action.payload;

				case types.STANDARDS_RATING_COLOR_UPDATE: {
						let newState = Object.assign([], state);
						const {standardsRatingDetailId, color} = action.payload;
						newState = newState && newState.length > 0 && newState.map(m => {
								if (m.standardsRatingDetailId === standardsRatingDetailId) m.color = color;
								return m;
						});
						return newState;
				}

				case types.STANDARDS_RATING_REMOVE: {
						let newState = Object.assign([], state);
						const standardsRatingDetailId = action.payload;
						newState = newState && newState.length > 0 && newState.filter(m => m.standardsRatingDetailId !== standardsRatingDetailId)
						return newState;
				}

        default:

            return state;
    }
}

export const selectStandardsRating = (state) => state;
