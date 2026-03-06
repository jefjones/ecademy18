import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("lunchMenuOptions")
				!!storage && dispatch({ type: types.LUNCH_MENU_OPTIONS_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/lunchMenuOptions/` + personId, {
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
			            dispatch({type: types.LUNCH_MENU_OPTIONS_INIT, payload: response})
									localStorage.setItem("lunchMenuOption", JSON.stringify(response))
			        })
    }
}

export const addOrUpdateLunchMenuOption = (personId, lunchMenuOption) => {
		if (lunchMenuOption && !lunchMenuOption.lunchMenuOptionId) lunchMenuOption.lunchMenuOptionId = guidEmpty
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchMenuOption/` + personId, {
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
            body: JSON.stringify(lunchMenuOption)
        })
				.then(() => dispatch(init(personId)))
    }
}

export const removeLunchMenuOption = (personId, lunchMenuOptionId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchMenuOption/remove/` + personId + `/` + lunchMenuOptionId, {
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
				.then(() => dispatch(init(personId)))
    }
}

export const getLunchMenuMonth = (personId, month) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchMenuMonth/` + personId + `/` + month, {
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
            dispatch({type: types.LUNCH_MENU_MONTH_INIT, payload: response})
        })
    }
}

export const setLunchMenuDay = (personId, day, lunchMenuOptionId) => {
		let month = day ? Number(day.substring(5,7)) : ''

    return dispatch => {
        return fetch(`${apiHost}ebi/lunchMenuDay/set/` + personId + `/` + day + `/` + lunchMenuOptionId, {
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
				.then(() => dispatch(getLunchMenuMonth(personId, --month)))
    }
}

export const getLunchMenuStudentDays = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchMenuStudentDays/` + personId, {
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
            dispatch({type: types.LUNCH_MENU_STUDENT_DAY_INIT, payload: response})
        })
    }
}

export const toggleLunchMenuStudentDay = (personId, day, studentPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/lunchMenuStudentDay/toggle/` + personId + `/` + day + `/` + studentPersonId, {
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
				.then(() => dispatch(getLunchMenuStudentDays(personId)))
    }
}
