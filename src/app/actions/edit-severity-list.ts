import * as types from './actionTypes'
import getEditSeverityList from '../services/edit-severity-list'


function setEditSeverityList( editSeverityList=[]) {
    return { type: types.EDIT_SEVERITY_LIST_INIT, payload: editSeverityList }
}

export const init = () => dispatch =>
    getEditSeverityList().then( n => dispatch( setEditSeverityList(n)) )
