import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const mainMenu = (state = [], action) => {
    switch(action.type) {
        case types.COUNTS_MAIN_MENU:
            return action.payload

        default:
            return state
    }
}

const messages = (state = [], action) => {
    switch(action.type) {
        case types.COUNTS_MESSAGES:
            return action.payload === 'EMPTY'
								? ''
								: action.payload
								 		? action.payload
										: ''
        default:
            return state
    }
}

export default combineReducers({ mainMenu, messages })

export const selectCountsMainMenu = (state) => state
