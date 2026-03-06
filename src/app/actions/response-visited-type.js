import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const setResponseVisitedType = (personId, studentAssignmentResponseId, responseVisitedTypeCode) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/responseVisitedType/` + personId + `/` + studentAssignmentResponseId + `/` + responseVisitedTypeCode, {
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
						dispatch({ type: types.GRADEBOOK_RESPONSE_VISITED_UPDATE, payload: { studentAssignmentResponseId, responseVisitedTypeCode } });
				})
    }
}
