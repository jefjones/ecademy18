import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getMyWorks = (personId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {fileTreeExplorer: true} });
				let storage = localStorage.getItem("works_mine");
				storage && dispatch({ type: types.WORKS_MINE, payload: JSON.parse(storage) });

        return fetch(`${apiHost}ebi/myWorkFileTreeExplorer/mine/` + personId, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {fileTreeExplorer: 'ready'} });
            dispatch({ type: types.WORKS_MINE, payload: response });
						localStorage.setItem("works_mine", JSON.stringify(response));
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const getWorksSharedWithMe = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("works_others");
				storage && dispatch({ type: types.WORKS_SHARED_WITH_ME, payload: JSON.parse(storage) });

        return fetch(`${apiHost}ebi/myWorkFileTreeExplorer/others/` + personId, {
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
            dispatch({ type: types.WORKS_SHARED_WITH_ME, payload: response });
						localStorage.setItem("works_others", JSON.stringify(response));
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const toggleExpanded = (workFolderId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/myWorkFileTreeExplorer/toggleExpanded/` + workFolderId, {
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
        .then(dispatch({ type: types.WORK_FOLDER_TOGGLE_EXPANDED, payload: workFolderId }))
    }
}

export const toggleAllExpanded = (personId, expandAll) => {
		expandAll = !!expandAll ? expandAll : false;
    return dispatch => {
        return fetch(`${apiHost}ebi/myWorkFileTreeExplorer/toggleExpanded/all/` + personId + `/` + expandAll, {
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
        .then(() => {
						dispatch(getMyWorks(personId));
						dispatch(getWorksSharedWithMe(personId));
				})
    }
}
