import * as types from './actionTypes';
import getColorsEditorList from '../services/colors-editor.js';


function setColorsEditorList( colorsEditor={}) {
    return { type: types.COLORS_EDITOR_INIT, payload: colorsEditor };
}

export const init = () => dispatch =>
    getColorsEditorList().then( n => dispatch( setColorsEditorList(n)) );
