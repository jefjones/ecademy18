import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.JEF_FEATURES_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectJefFeatures = (state) =>
		state && state.length > 0 && state.map(m => ({
					...m,
					id: m.jefFeatureId,
					label: m.name,
		}));
