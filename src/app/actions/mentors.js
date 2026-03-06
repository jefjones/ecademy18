import {apiHost} from '../api_host.js';

export const addFacilitatorAsMentor = (personId, facilitatorPersonId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/mentors/addFacilitator/` + personId + `/` + facilitatorPersonId, {
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
}
