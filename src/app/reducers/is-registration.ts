import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'

const schoolCode = (state = '', action) => {
    switch(action.type) {
        case types.SCHOOL_CODE_INIT:
            return action.payload

        default:
            return state
    }
}

const registrationPersonId = (state = '', action) => {
    switch(action.type) {
        case types.REGISTRATION_PERSON_ID_INIT:
            return action.payload

        default:
            return state
    }
}

export default combineReducers({ schoolCode,  registrationPersonId })

export const selectSchoolCode = (state) => state.schoolCode
export const selectRegistrationPersonId = (state) => state.registrationPersonId
