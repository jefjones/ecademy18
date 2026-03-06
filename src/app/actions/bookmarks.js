import * as types from './actionTypes';
import getBookmarks from '../services/bookmarks.js';
import {apiHost} from '../api_host.js';

function setBookmarks( bookmarks={}) {
    return { type: types.BOOKMARKS_INIT, payload: bookmarks };
}

export const init = (personId, chapterId, languageId) => dispatch => {
  return getBookmarks(personId, chapterId, languageId).then( n => dispatch(setBookmarks(n)))
};

export const saveNewBookmark = (personId, chapterId, languageId, hrefId, name) => {
    return dispatch =>
      fetch(`${apiHost}ebi/bookmark`, {
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
            personId,
            chapterId,
            languageId,
            hrefId,
            name,
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
          dispatch({ type: types.BOOKMARKS_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const deleteBookmark = (personId, chapterId, languageId, hrefId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/bookmark/delete`, {
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
            personId,
            chapterId,
            languageId,
            hrefId,
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
          dispatch({ type: types.BOOKMARKS_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}
