import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getUsers = (personId) => {
    return dispatch => {
				// let storage = localStorage.getItem("users")
				// storage && dispatch({ type: types.USERS_INIT, payload: JSON.parse(storage) });
        // dispatch({type: types.FETCHING_RECORD, payload: {users: true} });

        return fetch(`${apiHost}ebi/users/` + personId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            } else {
                const error = new Error(response.statusText)
                error.response = response
                throw error
            }
        })
        .then(response => {
            dispatch({ type: types.USERS_INIT, payload: response })
            dispatch({type: types.FETCHING_RECORD, payload: {users: false} })
						//localStorage.setItem("users", JSON.stringify(response));
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const addUser = (personId, users) => {
    return dispatch =>
      fetch(`${apiHost}ebi/users/add/` + personId, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
        },
        body: JSON.stringify(users),
      })
      .then(response => {
          dispatch(getUsers(personId))
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const removeUser = (personId, userPersonId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/user/remove/` + personId + `/` + userPersonId, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
        },
      })
      .then(response => {
          dispatch(getUsers(personId))
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const updateUser = (personId, user) => {
    return dispatch =>
      fetch(`${apiHost}ebi/user/update/` + personId, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
        },
        body: JSON.stringify(user),
      })
      .then(response => {
          dispatch(getUsers(personId))
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const sendTeacherLoginInstructions = (personId, teacherPersonId) => {
    return dispatch =>
        fetch(`${apiHost}ebi/user/sendLoginInstructions/` + personId + `/` + teacherPersonId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
        })
}
