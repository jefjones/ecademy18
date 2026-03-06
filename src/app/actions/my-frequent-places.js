import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getMyFrequentPlaces = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("myFrequentPlaces");
				!!storage && dispatch({ type: types.MY_FREQUENT_PLACES_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/myFrequentPlaces/` + personId, {
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
			            dispatch({type: types.MY_FREQUENT_PLACES_INIT, payload: response});
									localStorage.setItem("myFrequentPlaces", JSON.stringify(response));
			        })
    }
}

export const setMyFrequentPlaceHome = (personId, myFrequentPlace) => {
		//Notice that this is the home version which toggles isHomePage on and off for the frequence place.  The other function toggles the entire record on or off.
    return dispatch => {
				dispatch({ type: types.MY_FREQUENT_PLACES_TOGGLE_HOME, payload: myFrequentPlace });
        return fetch(`${apiHost}ebi/myFrequentPlace/home/` + personId, {
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
            body: JSON.stringify(myFrequentPlace)
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
            dispatch({ type: types.MY_FREQUENT_PLACES_INIT, payload: response });
        })
    }
}

export const setMyFrequentPlace = (personId, myFrequentPlace, isHomeChoice) => {
		//Notice that there is a Home version that turns on and off isHomePage setting.  This current function is to toggle the entire frequent place.
		if (isHomeChoice === 'HOME') {
				return setMyFrequentPlaceHome(personId, myFrequentPlace);
		} else {
				return dispatch => {
						dispatch({ type: types.MY_FREQUENT_PLACES_ADD, payload: myFrequentPlace });
		        return fetch(`${apiHost}ebi/myFrequentPlace/` + personId, {
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
		            body: JSON.stringify(myFrequentPlace)
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
		            dispatch({ type: types.MY_FREQUENT_PLACES_INIT, payload: response });
		        })
		    }
		}
}

export const removeMyFrequencePlace = (personId, myFrequentPlaceId) => {
    return dispatch => {
				dispatch({ type: types.MY_FREQUENT_PLACES_REMOVE, payload: myFrequentPlaceId });
        return fetch(`${apiHost}ebi/myFrequentPlace/remove/` + personId + `/` + myFrequentPlaceId, {
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
