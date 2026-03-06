import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.SCHEDULE_PERSONAL_INIT:
            return action.payload ? action.payload : state

        default:
            return state
    }
}

export const selectSchedulePersonal = (state) => state
