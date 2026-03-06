import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {guidEmpty} from '../utils/guidValidate.js';

//This doesn't seem to be used anywhere.
export const getAnnouncementsAdmin = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("announcementsAdmin");
				storage && dispatch({ type: types.ANNOUNCEMENTS_ADMIN, payload: JSON.parse(storage) });

        return fetch(`${apiHost}ebi/announcements/admin/` + personId, {
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
            dispatch({ type: types.ANNOUNCEMENTS_ADMIN, payload: response });
						localStorage.setItem("announcementsAdmin", JSON.stringify(response));
        })
    }
}

export const getAnnouncementsRecipient = (personId, editType) => {
		if (!editType) editType = 'EMPTY'; //This could be 'reply' in which case we set the recipient back to the sender.
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: true } });
        return fetch(`${apiHost}ebi/announcements/recipient/` + personId + `/` + editType, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: false } });
            dispatch({ type: types.ANNOUNCEMENT_LIST, payload: response });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: false } }));
    }
}

export const getMessageSingleFullThread = (announcementId) => {
    return dispatch => {
				dispatch({ type: types.ANNOUNCEMENT_SINGLE_FULL_THREAD, payload: {} });
        return fetch(`${apiHost}ebi/announcement/` + announcementId, {
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
            dispatch({ type: types.ANNOUNCEMENT_SINGLE_FULL_THREAD, payload: response });
        })
    }
}

export const addOrUpdateAnnouncement = (personId, announcement, announcementId) => {
		announcement.sendOnDateTime = announcement.startTime
				? announcement.startDate + 'T' + announcement.startTime
				: announcement.startDate;

    return dispatch => {
        return fetch(`${apiHost}ebi/announcement/add/` + personId + `/` + announcementId, {
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
						body:  JSON.stringify(announcement),
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
            dispatch({ type: types.ANNOUNCEMENTS_ADMIN, payload: response });
						dispatch(getAnnouncementsRecipient(personId));
        })
    }
}

export const removeAnnouncementAdmin = (personId, announcementId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/announcement/remove/admin/` + personId + `/` + announcementId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
						}
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
            dispatch({ type: types.ANNOUNCEMENTS_ADMIN, payload: response });
        })
    }
}

//This one is done by the user to indicate that they don't want to see the announcement in their list any more.
export const removeRecipientPersonal = (personId, announcementId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/announcement/remove/personal/` + personId + `/` + announcementId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
						}
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
            dispatch({ type: types.ANNOUNCEMENT_LIST, payload: response });
        })
    }
}

export const removeRecipientAdmin = (personId, announcementId, recipientPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/announcement/removeRecipient/` + personId + `/` + announcementId + `/` + recipientPersonId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
						}
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
            dispatch({ type: types.ANNOUNCEMENTS_ADMIN, payload: response });
        })
    }
}

export const setStudentsSelected = (studentList, reply_announcementId='') => {
    return dispatch => {
				dispatch({ type: types.ANNOUNCEMENT_STUDENT_LIST, payload: studentList });
				if (reply_announcementId) dispatch({ type: types.ANNOUNCEMENT_REPLY_ID, payload: reply_announcementId });
    }
}

export const setAsSeenByRecipient = (personId, announcementId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/announcement/seenByRecipient/` + personId + `/` + announcementId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
						}
				})
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
								//dispatch(getAnnouncementsRecipient(personId)); //Don't do this since this is called by the other lists (sentBy and deletedBy) and that would then reset the announcement list to recipient when it could be set to one of the other lists which would replace it back to recipients..
            }
        })
    }
}

export const getAnnouncementsSentBy = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: true } });
        return fetch(`${apiHost}ebi/announcement/sentBy/` + personId, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: false } });
            dispatch({ type: types.ANNOUNCEMENTS_SENT_BY, payload: response });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: false } }));
    }
}

export const getAnnouncementsDeleted = (personId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: true } });
        return fetch(`${apiHost}ebi/announcement/deleted/` + personId, {
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
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: false } });
            dispatch({ type: types.ANNOUNCEMENTS_DELETED, payload: response });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'announcementList', value: false } }));
    }
}

export const clearAnnouncementList = (personId) => {
		return dispatch => {
				dispatch({type: types.FETCHING_RECORD, payload: {announcementsSentBy: 'ready'} });
				dispatch({type: types.FETCHING_RECORD, payload: {announcementsRecipient: 'ready'} });
				dispatch({type: types.FETCHING_RECORD, payload: {announcementsDeleted: 'ready'} });
				dispatch({ type: types.ANNOUNCEMENT_LIST, payload: 'EMPTY' });
				dispatch({ type: types.ANNOUNCEMENTS_SENT_BY, payload: 'EMPTY' });
				dispatch({ type: types.ANNOUNCEMENTS_DELETED, payload: 'EMPTY' });
		}
}

export const removeAnnouncement = (personId, announcementId, recipientPersonId, listType='recipient', deleteType='single') => {
		if (!recipientPersonId) recipientPersonId = guidEmpty;
    return dispatch => {
				//dispatch(clearAnnouncementList());
        return fetch(`${apiHost}ebi/announcement/remove/personal/` + personId + `/` + announcementId + `/` + recipientPersonId + `/` + listType + `/` + deleteType, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
						}
				})
        // .then(() => {
				// 	if (listType === 'recipient') dispatch(getAnnouncementsRecipient(personId));
				// 	if (listType === 'sentBy') dispatch(getAnnouncementsSentBy(personId));
				// 	if (listType === 'deleted') dispatch(getAnnouncementsDeleted(personId));
        // })
    }
}
