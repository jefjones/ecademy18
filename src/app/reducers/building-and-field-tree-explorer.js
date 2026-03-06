import * as types from '../actions/actionTypes';
import {combineReducers} from 'redux';

const myLocations = (state = [], action) => {
    switch(action.type) {
        case types.BUILDING_AND_FIELD_MY_LOCATIONS:
            return action.payload;

        default:
            return state;
    }
}

const buildingAndFields = (state = [], action) => {
    switch(action.type) {
        case types.BUILDING_AND_FIELD_SETTINGS:
            return action.payload;

        default:
            return state;
    }
}


export default combineReducers({ myLocations, buildingAndFields });

export const selectBuildingAndFieldTreeExplorer = (state) => state;
