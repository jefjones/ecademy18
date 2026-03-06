import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {guidEmpty} from '../utils/guidValidate.js';

export const init = (personId, courseEntryId) => {
    return dispatch => {
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignments', value: true } });
        return fetch(`${apiHost}ebi/assignments/` + personId + `/` + courseEntryId, {
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
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignments', value: false } });
            dispatch({type: types.ASSIGNMENTS_INIT, payload: response});
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignments', value: false } }));
    }
}

export const addOrUpdateAssignment = (personId, assignment) => {
    debugger
		assignment.personId = assignment.personId ? assignment.personId : personId;
		assignment.assignmentId = assignment.assignmentId ? assignment.assignmentId : guidEmpty;
		assignment.coursesSpecific = assignment.coursesSpecific ? assignment.coursesSpecific : [];

    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} });
        dispatch({ type: types.ASSIGNMENTS_INIT, payload: assignment });
        return fetch(`${apiHost}ebi/assignments/addOrUpdate/` + personId, {
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
            body: JSON.stringify(assignment),
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
            dispatch({type: types.FETCHING_RECORD, payload: {assignments: 'ready'} });
            dispatch({ type: types.ASSIGNMENTS_INIT, payload: response });
        })
    }
}

export const removeAssignment = (personId, assignmentId, runFunction=() => {}) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignments', value: true } });
        return fetch(`${apiHost}ebi/assignments/remove/` + personId + `/` + assignmentId, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'assignments', value: false } });
            dispatch({ type: types.ASSIGNMENTS_INIT, payload: response });
						dispatch(runFunction);
        })
    }
}


export const saveAssignmentWebsiteLink = (personId, assignmentId, websiteLink) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} });
        return fetch(`${apiHost}ebi/assignments/websiteLink/` + personId, { // + `/` + assignmentId + `/` + encodeURIComponent(websiteLink)
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
						body: JSON.stringify({ assignmentId,  websiteLink: encodeURIComponent(websiteLink)})
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
						dispatch({type: types.FETCHING_RECORD, payload: {assignments: 'ready'} });
            dispatch({ type: types.ASSIGNMENTS_INIT, payload: response });
        })
    }
}


export const removeAssignmentFile = (personId, assignmentId, assignmentFileId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} });
        return fetch(`${apiHost}ebi/assignments/removeFileUpload/${personId}/${assignmentId}/${assignmentFileId}`, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {assignments: 'ready'} });
            dispatch({ type: types.ASSIGNMENTS_INIT, payload: response });
        })
    }
}

export const removeAssignmentWebsiteLink = (personId, assignmentId, assignmentWebsiteLinkId) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} });
        return fetch(`${apiHost}ebi/assignments/removeWebsiteLink/` + personId + `/` + assignmentId  + `/` + assignmentWebsiteLinkId, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {assignments: 'ready'} });
            dispatch({ type: types.ASSIGNMENTS_INIT, payload: response });
        })
    }
}


export const reorderAssignments = (personId, assignmentId, newSequence) => {
    return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {assignments: true} });
        return fetch(`${apiHost}ebi/assignments/reorder/` + personId + `/` + assignmentId  + `/` + newSequence, {
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
						dispatch({type: types.FETCHING_RECORD, payload: {assignments: 'ready'} });
            dispatch({ type: types.ASSIGNMENTS_INIT, payload: response });
        })
    }
}

export const getDownloadFileTest = (fileUploadId) => {
  return dispatch => {
    return fetch(`${apiHost}ebi/testFileDownload/` + fileUploadId, {
      method: 'get',
      headers: {
        'Accept': 'application/octet-stream',
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
          return response;
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
  }
}
