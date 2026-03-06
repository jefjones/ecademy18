import * as types from './actionTypes'
import {apiHost} from '../api_host'

export const getIpAddress = () => {
    return dispatch =>
      fetch(`https://freegeoip.net/json/?callback=?`, {
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
            //console.l og('response', response);
        }
      })
}
