import * as types from './actionTypes'
import getEditFilter from '../services/edit-filter'

function setEditFilter( editFilter={} ) {
    return { type: types.EDIT_FILTER_INIT, payload: editFilter }
}

export const init = (personId) => dispatch =>
    dispatch( setEditFilter(getEditFilter(personId)))

export const updateEditFilter = (personId, editFilter) => {
    return { type: types.EDIT_FILTER_UPDATE, payload: { personId, editFilter }}
}
