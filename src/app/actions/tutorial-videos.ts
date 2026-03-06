import * as types from './actionTypes'
import { apiHost } from '../api_host'

export const getTutorialVideos = () => {
    return dispatch => {
        let storage = localStorage.getItem("tutorialVideos")
        storage && dispatch({ type: types.TUTORIAL_VIDEOS_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/tutorialVideos/`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json()
                } else {
                    const error = new Error(response.statusText)
                    error.response = response
                    throw error
                }
            })
            .then(response => {
                dispatch({ type: types.TUTORIAL_VIDEOS_INIT, payload: response })
                localStorage.setItem("tutorialVideos", JSON.stringify(response))
            })
    }
}
