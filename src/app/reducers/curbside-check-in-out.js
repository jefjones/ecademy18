import * as types from '../actions/actionTypes';
import {combineReducers} from 'redux';

const reasons = (state = [], action) => {
	switch(action.type) {
			case types.CHECK_IN_OUT_REASONS_INIT:
					return action.payload;

			default:
					return state;
	}
}

const records  = (state = [], action) => {
    switch(action.type) {
        case types.CHECK_IN_OUT_INIT:
            return action.payload;

        case types.CHECK_IN_OUT_CONFIRM:
            const {id} = action.payload;
            let records = state;
            records = records && records.length > 0 && records.map(m => {if (m.id !== id) m.confirmed = true; return m;});
            return records;

        default:
            return state;
    }
}

export default combineReducers({ reasons, records });

export const selectCheckInOrOuts = (state) => state.records;
export const selectCheckInOrOutReasons = (state) => {
		return state && state.reasons && state.reasons.length > 0 && state.reasons.map((m, i) => ({
				...m,
				id: m.checkInOrOutReasonTypeId,
				value: m.checkInOrOutReasonTypeId,
				label: m.name,
		}));
}
