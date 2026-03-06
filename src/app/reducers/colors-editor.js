import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COLORS_EDITOR_INIT:
            return action.payload;

        default:
            return state;
    }
}

 export const selectColorsEditor = (state) => state;

 export const assignColorsEditor = (state, editDetails) => {
     let uniquePersonId = editDetails && editDetails.length > 0 ? [...new Set(editDetails.map(m => m.personId))] : [];
     let colors = state;
     let editorColors = {};

     for(var i = 0; i < uniquePersonId.length && i < colors.length; i++) {
         //The firstName is in the editDetails records.  Just pick on that matches one of the uniquePersonIds and record it in the tab records.
         editorColors = Object.assign({}, editorColors, {
             [uniquePersonId[i]]: colors[i].hexColor
         })
     };
     return editorColors;
 }
