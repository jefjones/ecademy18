import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getPersonConfigCalendar = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("personConfigCalendar");
				!!storage && dispatch({ type: types.PERSON_CONFIG_CALENDAR_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/personConfigCalendar/` + personId, {
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
			            response && dispatch({type: types.PERSON_CONFIG_CALENDAR_INIT, payload: response});
									response && localStorage.setItem("personConfigCalendar", JSON.stringify(response));
			        })
    }
}

export const setPersonConfigCalendar = (personId, field, value, runFunction=()=>{}) => {
		return dispatch => {
				dispatch({ type: types.PERSON_CONFIG_CALENDAR_UPDATE, payload: {field, value} });
        return fetch(`${apiHost}ebi/personConfigCalendar/set/` + personId + `/` + field + `/` + (value || 'EMPTY'), {
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
				.then(() => dispatch(runFunction))
    }
}


//This setCalendarViewRange call causes the browser to freeze ... probably due to the local redux update when the timer is going off every 10 seconds.
// export const setCalendarViewRange = (viewRange) => {
//     return dispatch => {
// 				dispatch({ type: types.PERSON_CONFIG_CALENDAR_VIEW_RANGE_SET, payload: viewRange });
// 		}
// }
