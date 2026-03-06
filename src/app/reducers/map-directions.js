import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.MAP_DIRECTIONS_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectMapDirections = (state) => {
		return state && state.length > 0 && state.map(m => ({
				...m,
				id: m.mapDirectionId,
				value: m.mapDirectionId,
				label: m.name,
		}));
}
