import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("passFailRating");
				!!storage && dispatch({ type: types.PASS_FAIL_RATING_INIT, payload: JSON.parse(storage) });

        return fetch(`${apiHost}ebi/passFailRating/` + personId, {
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
			            dispatch({ type: types.PASS_FAIL_RATING_INIT, payload: response });
									localStorage.setItem("passFailRating", JSON.stringify(response));
			        })
			        //.catch(error => { console.l og('request failed', error); });
    }
}

export const setPassFailRating = (personId, name, sequence) => {
		//Do not allow a blank sequence to go through.  0 is okay.
		name = name ? name : 'EMPTY'
    return !sequence && sequence !== 0 ? null : dispatch => {
        return fetch(`${apiHost}ebi/passFailRating/set/` + personId + `/` + name + `/` + sequence, {
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
			            dispatch(init(personId));
			        })
			        //.catch(error => { console.l og('request failed', error); });
    }
}

export const removePassFailRating = (personId, passFailRatingId) => {
		return dispatch =>
	      fetch(`${apiHost}ebi/passFailRating/remove/` + personId + `/` + passFailRatingId, {
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
	          dispatch(init(personId));
	      })
	        //.catch(error => { console.l og('request failed', error); });
}
