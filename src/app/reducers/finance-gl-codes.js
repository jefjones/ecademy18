import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.FINANCE_GL_CODES_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectFinanceGLCodes = (state) => state;
