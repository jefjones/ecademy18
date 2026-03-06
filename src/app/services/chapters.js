import {apiHost} from '../api_host.js';

export default (personId, workId) => (
    fetch(`${apiHost}ebi/chapters/list/` + personId + `/` + workId, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
        }})
        .then(response =>
            response.ok ? response.json() : Promise.reject(response) )
        .then(res => res && res.map(res => ({ label: res.name, id: res.chapterId }))
    )
);
