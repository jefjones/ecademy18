import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import * as actionCountsMainMenu from './counts-main-menu';

export const init = (personId, clearRedux=false) => {
    return dispatch => {
        let json = 0;
				if (clearRedux) {
						dispatch({ type: types.LEARNERS_WIDE_LIST_INIT, payload: [] });
				} else {
					  let storage = localStorage.getItem("learners")
            json = JSON.parse(storage);
					  storage && dispatch({ type: types.LEARNERS_WIDE_LIST_INIT, payload: json });
				}
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'learnerSearch', value: true } });

        return fetch(`${apiHost}ebi/learners/wideList/${personId}/${(json && json.length) || 0}`, {
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
            if (response && response.length === 1 && response[0].label === 'SameCount') {
                //do nothing
            } else {
                dispatch({ type: types.LEARNERS_WIDE_LIST_INIT, payload: response });
                localStorage.setItem("learners", JSON.stringify(response));
            }
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'learnerSearch', value: false } });
        })
        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'learnerSearch', value: false } }));
    }
}

export const getLearnersSimple = (personId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/learners/simpleList/` + personId, {
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
            dispatch({ type: types.LEARNERS_SIMPLE_LIST_INIT, payload: response });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const addLearner = (personId, learners) => {
    return dispatch =>
      fetch(`${apiHost}ebi/learners/add/` + personId, {
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
        body: JSON.stringify(learners),
      })
      .then(response => {
					dispatch(init(personId));
        	dispatch(getLearnersSimple(personId));
					dispatch(actionCountsMainMenu.getCountsMainMenu(personId));
      })
}

export const removeLearner = (personId, studentPersonId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/learner/remove/` + personId + `/` + studentPersonId, {
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
      })
      .then(response => {
          dispatch(init(personId));
      })
}

export const updateLearner = (personId, learner) => {
    return dispatch =>
      fetch(`${apiHost}ebi/learner/update/` + personId, {
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
        body: JSON.stringify(learner),
      })
      .then(response => {
          dispatch(init(personId));
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const processStudentBulkEntry = (personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/studentAdd/studentBulkEntryDetails/process/` + personId, {
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
