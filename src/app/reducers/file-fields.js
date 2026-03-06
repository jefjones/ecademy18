import * as types from '../actions/actionTypes';
import {combineReducers} from 'redux';

const list = (state = [], action) => {
    switch(action.type) {
        case types.FILE_FIELDS_INIT:
            return action.payload;

        default:
            return state;
    }
}

const personConfigStudentBulkEntry = (state = [], action) => {
    switch(action.type) {
        case types.PERSON_CONFIG_STUDENT_BULK_ENTRY:
            return action.payload;

        default:
            return state;
    }
}

const studentBulkEntryDetails = (state = [], action) => {
    switch(action.type) {
        case types.STUDENT_BULK_ENTRY_DETAILS :
            return action.payload;

        default:
            return state;
    }
}

export default combineReducers({ list, personConfigStudentBulkEntry, studentBulkEntryDetails });

export const selectFileFields = (state) => state.list;
export const selectPersonConfigStudentBulkEntry = (state) => state.personConfigStudentBulkEntry;
export const selectStudentBulkEntryDetails = (state) => state.studentBulkEntryDetails;
