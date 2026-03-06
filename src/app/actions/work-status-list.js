import * as types from './actionTypes';
import getWorkStatusList from '../services/work-status-list.js';


function setWorkStatusList( editSeveity={}) {
    return { type: types.WORK_STATUS_LIST_INIT, payload: editSeveity };
}

export const init = () => dispatch =>
    getWorkStatusList().then( n => dispatch( setWorkStatusList(n)) );
