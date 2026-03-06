import * as types from './actionTypes'
import {apiHost} from '../api_host'

function setOpenCommunity( openCommunity=[] ) {
    return { type: types.OPEN_COMMUNITY_INIT, payload: openCommunity }
}

export const init = (personId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/openCommunityEntry/` + personId, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
          }
        })
        .then(response =>
            response.ok ? response.json() : Promise.reject(response) )
        .then(res => dispatch( setOpenCommunity(res)) )
}

export const saveOpenCommunityEntry = (personId, workId, selectedChapters, selectedLanguages, editNativeLanguage, selectedGenres,
                                        dueDate, editorsCount, declineIdleId, editSeverityId, openCommunityEntryId=0) => {
    return dispatch =>
    fetch(`${apiHost}ebi/openCommunityEntry/` + personId, {
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
        body: JSON.stringify({
            workId,
            chapterIds: selectedChapters,
            editNativeLanguage: editNativeLanguage,
            translateLanguageIds: selectedLanguages,
            GenreIds: selectedGenres,
            dueDate,
            editorsCount,
            declineIdleId,
            editSeverityId,
            openCommunityEntryId,
        }),
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
        dispatch({ type: types.OPEN_COMMUNITY_UPDATE, payload: { workId, setValue: true, openCommunity: response} })
    })
    //.catch(error => { console.l og('request failed', error); });
}


export const removeOpenCommunityEntry = (personId, workId, openCommunityEntryId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/openCommunityEntry/remove/` + personId + `/` + openCommunityEntryId, {
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
        dispatch({ type: types.OPEN_COMMUNITY_UPDATE, payload: { workId, setValue: false, openCommunity: response} })
    })
    //.catch(error => { console.l og('request failed', error); });
}

export const commitOpenCommunityEntry = (personId, openCommunityEntryId, chapterIds, languageIds, nativeLanguageEdit) => {
    return dispatch =>
    fetch(`${apiHost}ebi/openCommunityEntry/commit/` + personId, {
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
        body: JSON.stringify({
            openCommunityEntryId,
            chapterIds,
            languageIds,
            nativeLanguageEdit,
        }),
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
        dispatch({ type: types.OPEN_COMMUNITY_INIT, payload: response })
    })
    //.catch(error => { console.l og('request failed', error); });
}

export const uncommitOpenCommunityEntry = (personId, openCommunityEntryId) => {
    return dispatch =>
    fetch(`${apiHost}ebi/openCommunityEntry/uncommit/` + personId + `/` + openCommunityEntryId, {
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
        dispatch({ type: types.OPEN_COMMUNITY_INIT, payload: response })
    })
    //.catch(error => { console.l og('request failed', error); });
}
