import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getBenchmarkTestClassComparison = (personId, benchmarkTestId) => {
    return dispatch => {
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTestClassComparison', value: true } })
        return fetch(`${apiHost}ebi/benchmarkTestClassComparison/${personId}/${benchmarkTestId}`, {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTestClassComparison', value: false } })
            dispatch({type: types.BENCHMARK_TEST_CLASS_COMPARISON, payload: response})
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTestClassComparison', value: false } }))
    }
}

export const getBenchmarkTestStudentComparison = (personId, benchmarkTestId) => {
    return dispatch => {
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTestStudentComparison', value: true } })
        return fetch(`${apiHost}ebi/benchmarkTestStudentComparison/${personId}/${benchmarkTestId}`, {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTestStudentComparison', value: false } })
            dispatch({type: types.BENCHMARK_TEST_STUDENT_COMPARISON, payload: response})
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'benchmarkTestStudentComparison', value: false } }))
    }
}
