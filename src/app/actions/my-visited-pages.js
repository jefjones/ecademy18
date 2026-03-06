import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getMyVisitedPages = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("myVisitedPages");
				!!storage && dispatch({ type: types.MY_VISITED_PAGES_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/myVisitedPages/` + personId, {
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
			                return response.json();
			            } else {
			                const error = new Error(response.statusText);
			                error.response = response;
			                throw error;
			            }
			        })
			        .then(response => {
			            dispatch({type: types.MY_VISITED_PAGES_INIT, payload: response});
									localStorage.setItem("myVisitedPages", JSON.stringify(response));
			        })
    }
}

export const setMyVisitedPage = (personId, myVisitedPage) => {
		return dispatch => {
				dispatch({ type: types.MY_VISITED_PAGES_ADD, payload: myVisitedPage });
        return fetch(`${apiHost}ebi/myVisitedPage/` + personId, {
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
            body: JSON.stringify(myVisitedPage)
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => {
            dispatch({ type: types.MY_VISITED_PAGES_INIT, payload: response });
        })
    }
}

export const removeMyFrequencePlace = (personId, myVisitedPageId) => {
    return dispatch => {
				dispatch({ type: types.MY_VISITED_PAGES_REMOVE, payload: myVisitedPageId });
        return fetch(`${apiHost}ebi/myVisitedPage/remove/` + personId + `/` + myVisitedPageId, {
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
}
