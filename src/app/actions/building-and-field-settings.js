import * as types from './actionTypes';
import {apiHost} from '../api_host.js';

export const getBuildingAndFieldSettings = (personId, init=true) => {
    return dispatch => {
				if (init) {
						let storage = localStorage.getItem("buildingAndFieldSettings");
						storage && dispatch({ type: types.BUILDING_AND_FIELD_SETTINGS, payload: JSON.parse(storage) });
				}

        return fetch(`${apiHost}ebi/buildingAndFieldTreeExplorer/settings/` + personId, {
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
            dispatch({ type: types.BUILDING_AND_FIELD_SETTINGS, payload: response });
						localStorage.setItem("buildingAndFieldSettings", JSON.stringify(response));
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const getMyCommonLocations = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("buildingAndFieldMyLocations");
				storage && dispatch({ type: types.BUILDING_AND_FIELD_MY_LOCATIONS, payload: JSON.parse(storage) });

        return fetch(`${apiHost}ebi/buildingAndFieldTreeExplorer/myLocations/` + personId, {
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
            dispatch({ type: types.BUILDING_AND_FIELD_MY_LOCATIONS, payload: response });
						localStorage.setItem("buildingAndFieldMyLocations", JSON.stringify(response));
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const toggleExpanded = (personId, id, forceExpanded=false) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndFieldTreeExplorer/toggleExpanded/` + personId + `/` + id + `/` + forceExpanded, {
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
				.then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const toggleAllExpanded = (personId, expandAll) => {
		expandAll = !!expandAll ? expandAll : false;
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndFieldTreeExplorer/toggleExpanded/all/` + personId + `/` + expandAll, {
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
        .then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const addOrUpdateBuildingAndField = (personId, incomingRecord) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndField/building/addOrUpdate/` + personId, {
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
						body: JSON.stringify(incomingRecord)
        })
        .then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const addOrUpdateBuildingAndFielddLevel = (personId, incomingRecord) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndField/level/addOrUpdate/` + personId, {
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
						body: JSON.stringify(incomingRecord)
        })
        .then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const addOrUpdateLevelEntrance = (personId, incomingRecord) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndField/entrance/addOrUpdate/` + personId, {
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
						body: JSON.stringify(incomingRecord)
        })
        .then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const addOrUpdateRoom = (personId, incomingRecord) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndField/room/addOrUpdate/` + personId, {
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
						body: JSON.stringify(incomingRecord)
        })
        .then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const deleteRecord = (personId, recordType, recordId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndField/delete/` + personId + `/` + recordType + `/` + recordId, {
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
        .then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const toggleFrequentMine = (personId, recordType, recordId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/buildingAndField/toggleFrequentMine/` + personId + `/` + recordType + `/` + recordId, {
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
        .then(() => {
						dispatch(getBuildingAndFieldSettings(personId, false));
				})
    }
}

export const clearBuildingAndFieldSettings = () => {
    return dispatch => {
        dispatch({ type: types.BUILDING_AND_FIELD_SETTINGS, payload: [] });
				localStorage.setItem("buildingAndFieldSettings", JSON.stringify([]));
    }
}
