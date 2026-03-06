import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const getPickupLanes = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("pickupLanes")
				!!storage && dispatch({ type: types.PICKUP_LANE_INIT, payload: JSON.parse(storage) })

				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'pickupLanes', value: true } })
        return fetch(`${apiHost}ebi/pickupLanes/` + personId, {
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
			                return response.json()
			            } else {
			                const error = new Error(response.statusText)
			                error.response = response
			                throw error
			            }
			        })
			        .then(response => {
			            dispatch({ type: types.PICKUP_LANE_INIT, payload: response })
									localStorage.setItem("pickupLanes", JSON.stringify(response))
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'pickupLanes', value: false } })
			        })
			        .catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'pickupLanes', value: false } }))
    }
}

export const addOrUpdatePickupLaneDetail = (personId, pickupLaneDetail) => {
    if (!pickupLaneDetail.pickupLaneTableId) pickupLaneDetail.pickupLaneTableId = guidEmpty
    if (!pickupLaneDetail.pickupLaneDetailId) pickupLaneDetail.pickupLaneDetailId = guidEmpty

    return dispatch => {
        return fetch(`${apiHost}ebi/pickupLane/addOrUpdateDetail/${personId}/${pickupLaneDetail.pickupLaneTableId}/${pickupLaneDetail.pickupLaneDetailId}/${pickupLaneDetail.positionNumber}/${pickupLaneDetail.latitude}/${pickupLaneDetail.longitude}`, {
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
            //body: JSON.stringify(pickupLaneDetail)
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
            dispatch({ type: types.PICKUP_LANE_INIT, payload: response })
						localStorage.setItem("pickupLane", JSON.stringify(response))
        })
    }
}

export const removePickupLaneDetail = (personId, pickupLaneDetailId) => {
    return dispatch => {
				dispatch({ type: types.PICKUP_LANE_REMOVE, payload: pickupLaneDetailId })
        return fetch(`${apiHost}ebi/pickupLane/removeDetail/` + personId + `/` + pickupLaneDetailId, {
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
                return response.json()
            } else {
                const error = new Error(response.statusText)
                error.response = response
                throw error
            }
        })
        .then(response => {
            dispatch({ type: types.PICKUP_LANE_INIT, payload: response })
						localStorage.setItem("pickupLane", JSON.stringify(response))
        })
    }
}

export const removePickupLaneTable = (personId, pickupLaneTableId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/pickupLane/removeTable/` + personId + `/` + pickupLaneTableId, {
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
                return response.json()
            } else {
                const error = new Error(response.statusText)
                error.response = response
                throw error
            }
        })
        .then(response => {
            dispatch({ type: types.PICKUP_LANE_INIT, payload: response })
						localStorage.setItem("pickupLane", JSON.stringify(response))
        })
    }
}

export const addOrUpdatePickupLaneTable = (personId, newPickupLaneName, pickupLaneTableId=guidEmpty) => {
		pickupLaneTableId = pickupLaneTableId ? pickupLaneTableId : guidEmpty

    return dispatch => {
        return fetch(`${apiHost}ebi/pickupLane/newPickupLaneName/${personId}/${encodeURIComponent(newPickupLaneName)}/${pickupLaneTableId}`, {
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
                return response.json()
            } else {
                const error = new Error(response.statusText)
                error.response = response
                throw error
            }
        })
        .then(response => {
            dispatch({ type: types.PICKUP_LANE_INIT, payload: response })
						localStorage.setItem("pickupLane", JSON.stringify(response))
        })
    }
}
