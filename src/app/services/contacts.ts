import {apiHost} from '../api_host'

export default (personId) => (
  fetch(`${apiHost}ebi/person/` + personId, {
      method: 'get',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials' : 'true',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
          "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
          "Authorization": "Bearer " + localStorage.getItem("authToken").replace(/"/g, ''),
      }})
        .then(response =>
            response.ok ? response.json() : Promise.reject(response) )
        .then(res => {
            return (
                res && res.reduce((acc, {personId, ...contact}) => {
                  acc = {
                       ...acc,
                      [personId]: {
                          ...contact,
                          personId,
                      }
                  }
                  return acc
              }, {})
            )
        }
    )
)
