import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {guidEmpty} from '../utils/guidValidate.js';

export const getTranscripts = (personId, studentPersonId, includeInternal=false) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'transcripts', value: true } });
        return (!studentPersonId || studentPersonId === guidEmpty)
						? null
						: fetch(`${apiHost}ebi/transcripts/` + personId + `/` + studentPersonId + `/` + includeInternal, {
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
									dispatch({ type: types.TRANSCRIPTS_INIT, payload: response });
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'transcripts', value: false } });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'transcripts', value: false } }));
    }
}

export const addOrUpdateTranscript = (personId, transcript) => {
		transcript.transcriptId = transcript.transcriptId ? transcript.transcriptId : '00000000-0000-0000-0000-000000000000';

    return dispatch =>
        fetch(`${apiHost}ebi/transcript/` + personId, {
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
							body: JSON.stringify(transcript),
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
							dispatch({ type: types.TRANSCRIPTS_INIT, payload: response });
					})
}

export const removeTranscript = (personId, transcriptId) => {
    return dispatch => {
				dispatch({ type: types.TRANSCRIPT_REMOVE, payload: transcriptId });
        return fetch(`${apiHost}ebi/transcript/remove/` + personId + `/` + transcriptId, {
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
			}
}

//*****************  TESTs for transcripts ***************************/
export const addOrUpdateTranscriptTest = (personId, transcriptTest) => {
		transcriptTest.transcriptTestId = transcriptTest.transcriptTestId ? transcriptTest.transcriptTestId : '00000000-0000-0000-0000-000000000000';

    return dispatch =>
        fetch(`${apiHost}ebi/transcriptTest/` + personId, {
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
							body: JSON.stringify(transcriptTest),
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
							dispatch({ type: types.TRANSCRIPTS_INIT, payload: response });
					})
}

export const removeTranscriptTest = (personId, transcriptTestId) => {
    return dispatch =>
        fetch(`${apiHost}ebi/transcriptTest/remove/` + personId + `/` + transcriptTestId, {
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
							dispatch({ type: types.TRANSCRIPTS_INIT, payload: response });
					})
}

export const updateGraduationDate = (personId, studentPersonId, graduationDate) => {
    return dispatch =>
        fetch(`${apiHost}ebi/transcript/graduationDate/` + personId + `/` + studentPersonId + `/` + graduationDate, {
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
							dispatch({ type: types.TRANSCRIPTS_INIT, payload: response });
					})
}
