import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getBenchmarkTests = (personId) => {
    return dispatch => {
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTests', value: true } })
        return fetch(`${apiHost}ebi/benchmarkTests/${personId}`, {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTests', value: false } })
            dispatch({type: types.BENCHMARK_TESTS_INIT, payload: response})
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTests', value: false } }))
    }
}

export const addOrUpdateBenchmarkTest = (personId, benchmarkTest) => {
		benchmarkTest.personId = benchmarkTest.personId ? benchmarkTest.personId : personId

    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: true} })
        return fetch(`${apiHost}ebi/benchmarkTests/addOrUpdate/` + personId, {
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
            body: JSON.stringify(benchmarkTest),
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
            dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: 'ready'} })
            dispatch({ type: types.BENCHMARK_TESTS_INIT, payload: response })
        })
    }
}

export const removeBenchmarkTest = (personId, benchmarkTestId, runFunction=() => {}) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTest: true} })
        return fetch(`${apiHost}ebi/benchmarkTests/remove/` + personId + `/` + benchmarkTestId, {
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
            dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: 'ready'} })
            dispatch({ type: types.BENCHMARK_TESTS_INIT, payload: response })
						dispatch(runFunction)
        })
    }
}

export const reorderBenchmarkTests = (personId, benchmarkTestId, newSequence) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: true} })
        return fetch(`${apiHost}ebi/benchmarkTests/reorder/` + personId + `/` + benchmarkTestId  + `/` + newSequence, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: 'ready'} })
            dispatch({ type: types.BENCHMARK_TESTS_INIT, payload: response })
        })
    }
}

export const rateBenchmarkTest = (personId, benchmarkTestId, rating) => {
		rating = rating ? rating : '0'

    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: true} })
        return fetch(`${apiHost}ebi/benchmarkTests/rate/` + personId + `/` + benchmarkTestId  + `/` + rating, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: 'ready'} })
            dispatch({ type: types.BENCHMARK_TESTS_INIT, payload: response })
        })
    }
}

export const sharedTeachersBenchmarkTest = (personId, benchmarkTestId, sharedTeachers) => {

    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: true} })
        return fetch(`${apiHost}ebi/benchmarkTests/sharedTeachers/${personId}/${benchmarkTestId}`, {
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
            body: JSON.stringify(sharedTeachers),
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
            dispatch({type: types.FETCHING_RECORD, payload: {benchmarkTests: 'ready'} })
            dispatch({ type: types.BENCHMARK_TESTS_INIT, payload: response })
        })
    }
}
