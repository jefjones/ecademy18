import * as types from './actionTypes';
import getDraftSettings from '../services/draft-settings.js';
import {apiHost} from '../api_host.js';

function setDraftSettings( draftSettings=[] ) {
    return { type: types.DRAFT_SETTINGS_INIT, payload: draftSettings };
}

export const init = (personId, workId, chapterId, languageId) => dispatch => {
    return getDraftSettings(personId, workId, chapterId, languageId).then( n => dispatch( setDraftSettings(n)))
};

export const addDraftSetting = (personId, workId, chapterId, languageId, name, isFromCurrent, isFromDataRecovery) => {
    return dispatch => {
        fetch(`${apiHost}ebi/draftComparison/add/` + personId, {
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
                personId,
                chapterId,
                name,
                languageId,
                isFromCurrent,
                isFromDataRecovery,
            }),
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
            dispatch({ type: types.DRAFT_SETTINGS_INIT, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const deleteDraftSetting = (personId, draftComparisonId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/draftComparison/delete/` + personId + `/` + draftComparisonId, {
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
        }),
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
          dispatch({ type: types.DRAFT_SETTINGS_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const toggleDraftSettingChosen = (personId, draftComparisonId, isChosen) => {
    return dispatch =>
      fetch(`${apiHost}ebi/draftComparison/toggle/` + personId + `/` + draftComparisonId + `/` + isChosen, {
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
        }),
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
          dispatch({ type: types.DRAFT_SETTINGS_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}
