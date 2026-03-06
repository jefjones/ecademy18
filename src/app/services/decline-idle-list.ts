import {apiHost} from '../api_host'

export default () => (
    fetch(`${apiHost}ebi/declineIdle`, {
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
        .then(res => {
            return (
                res.map(e => {
                    return {
                        id: e.declineIdleId,
                        value: e.declineIdleId,
                        label: e.name,
                    }
              })
            )
        }
    )
)
