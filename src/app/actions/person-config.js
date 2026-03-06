import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const init = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("personConfig");
				storage && dispatch({ type: types.PERSON_CONFIG_INIT, payload: JSON.parse(storage) });

        return fetch(`${apiHost}ebi/personConfig/` + personId, {
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
            dispatch({ type: types.PERSON_CONFIG_INIT, payload: response });
						localStorage.setItem("personConfig", JSON.stringify(response));
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}


export const updatePersonConfig = (personId, field, value, runFunction=() => {}) => {
		if (!value) value = 'EMPTY';

    return dispatch =>
      fetch(`${apiHost}ebi/personConfig/` + personId + `/` + field + `/` + value, {
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
          dispatch({ type: types.PERSON_CONFIG_INIT, payload: response });
					dispatch(runFunction);
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const updatePersonConfigCourse = (personId, courseScheduledId, jumpToAssignmentId='00000000-0000-0000-0000-000000000000') => {
		if (!jumpToAssignmentId || jumpToAssignmentId === '0') {
				jumpToAssignmentId = '00000000-0000-0000-0000-000000000000';
		}
    //The only difference here beween a new or updated document is whether an existing workId is present.
    return dispatch =>
      fetch(`${apiHost}ebi/personConfig/course/` + personId + `/` + courseScheduledId + `/` + jumpToAssignmentId, {
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
        body: JSON.stringify({}),
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
          dispatch({ type: types.PERSON_CONFIG_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const updatePersonConfigNotPersist = (personId) => {
    //This is to turn off any configurations that were not intended to be kept persistently, but one of the pairs of fields were kept in order
    //  to temporarily control the interface, like NextSentenceAuto and NextSentenceAutoKeepON
    return dispatch =>
      fetch(`${apiHost}ebi/personConfig/notPersist/` + personId , {
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
          dispatch({ type: types.PERSON_CONFIG_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const setPersonConfigChoice = (personId, configKey, value) => {
    return dispatch => {
        dispatch({ type: types.PERSON_CONFIG_CHOICE_UPDATE, payload: {configKey, value} });
        fetch(`${apiHost}ebi/personConfigureChoice/set/${personId}/${configKey}/${value || 'EMPTY'}` , {
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
        .then(() => dispatch(init(personId, true)));
    }
}
