import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const clearTranslation = () => {
    return { type: types.TRANSLATED_SENTENCE_SET, payload: "" };
}

export const getTranslation = (personId, workId, languageId, hrefId, chapterId, textToTranslate) => {
    return dispatch =>
        fetch(`${apiHost}ebi/translation`, {
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
                workId,
                languageId,
                hrefId,
                chapterId,
                textToTranslate,
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
              dispatch({ type: types.TRANSLATED_SENTENCE_SET, payload: response });
          })
}
