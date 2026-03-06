import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const init = (personId) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {learnerOutcomes: true} })

        return fetch(`${apiHost}ebi/learnerOutcomes/` + personId, {
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
            dispatch({ type: types.LEARNER_OUTCOMES_INIT, payload: response })
            dispatch({type: types.FETCHING_RECORD, payload: {learnerOutcomes: false} })
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const addLearnerOutcome = (personId, learnerOutcomes) => {
    return dispatch =>
      fetch(`${apiHost}ebi/learnerOutcomes/add/` + personId, {
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
        body: JSON.stringify(learnerOutcomes),
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
        dispatch({ type: types.LEARNER_OUTCOMES_INIT, payload: response })
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const removeLearnerOutcome = (personId, learnerOutcomeId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/learnerOutcome/remove/` + personId + `/` + learnerOutcomeId, {
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
            return response.json()
        } else {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      .then(response => {
        dispatch({ type: types.LEARNER_OUTCOMES_INIT, payload: response })
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const updateLearnerOutcome = (personId, learnerOutcome) => {
    return dispatch =>
      fetch(`${apiHost}ebi/learnerOutcome/update/` + personId, {
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
        body: JSON.stringify(learnerOutcome),
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
          dispatch({ type: types.LEARNER_OUTCOMES_INIT, payload: response })
      })
      //.catch(error => { console.l og('request failed', error); });
}
