import * as types from './actionTypes'

export const saveMessage = (subject, message) => {
    return dispatch => {
	      dispatch({type: types.MESSAGE_COMPOSE_SAVE, payload: {subject, message}})
    }
}
