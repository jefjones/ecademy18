import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getLearnerPathways = (personId, studentPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/mentorComments/pathways/` + personId + `/` + studentPersonId, {
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
            dispatch({type: types.MENTOR_SUMMARY_PATHWAYS, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const getMentorComments = (personId, studentPersonId, limitReturn=0) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/mentorComments/get/` + personId + `/` + studentPersonId + `/` + limitReturn, {
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
            dispatch({type: types.MENTOR_PATHWAY_COMMENTS, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const setMentorCommentReadBy = (personId, mentorCommentId, readByPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/mentorComment/readBy/` + personId + `/` + mentorCommentId + `/` + readByPersonId, {
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
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const addOrUpdateMentorComment = (personId, mentorComment) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/mentorComment/addOrUpdate/` + personId, {
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
						body: JSON.stringify(mentorComment)
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
            dispatch({type: types.MENTOR_PATHWAY_COMMENTS, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const removeMentorComment = (personId, mentorCommentId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/mentorComment/remove/` + personId + `/` + mentorCommentId, {
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
            dispatch({type: types.MENTOR_PATHWAY_COMMENTS, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}
