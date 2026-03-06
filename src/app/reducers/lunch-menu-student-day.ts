import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.LUNCH_MENU_STUDENT_DAY_INIT: {
            return action.payload
        }

        default:
            return state
    }
}

export const selectLunchMenuStudentDays = (state) => state
