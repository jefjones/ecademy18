import {apiHost} from '../api_host.js';

export const setGradebookScoreByPenspring = (personId, studentAssignmentResponseId, score) => {
		score = score === 0
				? 0
				: !score
						? 'EMPTY'
						: score;
						
    return dispatch =>
      fetch(`${apiHost}ebi/gradebook/penspring/${personId}/${studentAssignmentResponseId}/${score}`, {
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
