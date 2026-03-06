import * as types from './actionTypes'
import getDeclineIdleList from '../services/decline-idle-list'


function setDeclineIdleList( declineIdle={}) {
    return { type: types.DECLINE_IDLE_LIST_INIT, payload: declineIdle }
}

export const init = () => dispatch =>
    getDeclineIdleList().then( n => dispatch( setDeclineIdleList(n)) )
