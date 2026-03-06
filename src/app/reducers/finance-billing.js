import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.FINANCE_BILLING_INIT:
            return action.payload;

				case types.FINANCE_BILLING_REMOVE: {
						let newState = Object.assign([], state);
						const financeBillingId = action.payload;
						newState = newState && newState.length > 0 && newState.filter(m => m.financeBillingId !== financeBillingId);
						return newState;
				}

				case types.FINALIZE_REGISTRATION:
					  let newState = Object.assign({}, state);
						newState.finalizedDate = new Date();
						return newState;

        case types.FINANCE_BILLING_IDS_LIST_REMOVE: {
            let newState = Object.assign({}, state);
            const financeBillingIds = action.payload;
            if (financeBillingIds && financeBillingIds.length > 0) {
                newState = newState && newState.length > 0 && newState.filter(m => financeBillingIds.indexOf(m.financeBillingId) === -1);
            }
            return newState;
        }

        default:
            return state;
    }
}

export const selectFinanceBillings = (state) => state;
