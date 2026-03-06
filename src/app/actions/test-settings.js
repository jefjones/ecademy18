import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {guidEmpty} from '../utils/guidValidate.js';

export const getTestSettings = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("testSettings");
				!!storage && dispatch({ type: types.TEST_SETTINGS_INIT, payload: JSON.parse(storage) })
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'testSettings', value: true } });

        return fetch(`${apiHost}ebi/testSettings/` + personId, {
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
			            dispatch({type: types.TEST_SETTINGS_INIT, payload: response});
									localStorage.setItem("testSettings", JSON.stringify(response));
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'testSettings', value: false } });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'testSettings', value: false } }));
    }
}

export const addOrUpdateTest = (personId, test) => {
		test.testId = test.testId ? test.testId : guidEmpty;
    return dispatch => {
        return fetch(`${apiHost}ebi/test/add/` + personId, {
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
            body: JSON.stringify(test)
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
            dispatch({ type: types.TEST_SETTINGS_INIT, payload: response });
        })
    }
}

export const removeTest = (personId, testId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/test/remove/` + personId + `/` + testId, {
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
            dispatch({ type: types.TEST_SETTINGS_INIT, payload: response });
        })
    }
}

export const addOrUpdateTestComponent = (personId, testComponent) => {
		testComponent.testComponentId = testComponent.testComponentId ? testComponent.testComponentId : guidEmpty;
    return dispatch => {
        return fetch(`${apiHost}ebi/testComponent/add/` + personId, {
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
            body: JSON.stringify(testComponent)
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
            dispatch({ type: types.TEST_SETTINGS_INIT, payload: response });
        })
    }
}

export const removeTestComponent = (personId, testComponentId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/testComponent/remove/` + personId + `/` + testComponentId, {
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
            dispatch({ type: types.TEST_SETTINGS_INIT, payload: response });
        })
    }
}

export const addTestComponentAssign = (personId, testComponentAssign) => {
		testComponentAssign.testComponentAssignId = testComponentAssign.testComponentAssignId ? testComponentAssign.testComponentAssignId : guidEmpty;
    return dispatch => {
        return fetch(`${apiHost}ebi/testComponentAssign/add/` + personId, {
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
            body: JSON.stringify(testComponentAssign)
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
            dispatch({ type: types.TEST_SETTINGS_INIT, payload: response });
        })
    }
}

export const removeTestComponentAssign = (personId, testComponentAssignId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/testComponentAssign/remove/` + personId + `/` + testComponentAssignId, {
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
            dispatch({ type: types.TEST_SETTINGS_INIT, payload: response });
        })
    }
}

export const addOrUpdateTestScore = (personId, testScore) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/testScore/addOrUpdate/` + personId, {
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
						body: JSON.stringify(testScore)
        })
    }
}
