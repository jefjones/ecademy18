import * as types from './actionTypes';

export const setLoggedIn = (loggedIn) => {
    return { type: types.LOGGED_IN_SET, payload: loggedIn };
}
