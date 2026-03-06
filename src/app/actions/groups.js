import * as types from './actionTypes';
import {browserHistory} from 'react-router';
import getGroupsIdCurrent from '../services/groupsId-current.js';
import {apiHost} from '../api_host.js';
import * as guid from '../utils/GuidValidate.js';

export const init = (personId) => {

    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {groups: true} });

        return fetch(`${apiHost}ebi/groups/` + personId, {
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
            dispatch({ type: types.GROUPS_INIT, payload: response });
            dispatch({type: types.FETCHING_RECORD, payload: {groups: false} });
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

function setGroupsIdCurrent( groupsId_current ) {
    return { type: types.GROUPS_CURRENT_SET_SELECTED, payload: groupsId_current};
}

export const initGroupsIdCurrent = (personId) => dispatch =>
    getGroupsIdCurrent(personId).then( n => {
        dispatch( setGroupsIdCurrent(n));
    });

export const setGroupCurrentSelected = (personId, groupId, masterWorkId, memberWorkId, goToPage) => {
    masterWorkId = guid.isGuidNotEmpty(masterWorkId) ? masterWorkId : guid.emptyGuid();
    memberWorkId = guid.isGuidNotEmpty(memberWorkId) ? memberWorkId : guid.emptyGuid();

    return dispatch => {
        fetch(`${apiHost}ebi/groups/setRecentGroup`, {
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
              body: JSON.stringify({
                  personId,
                  groupId,
                  masterWorkId,
                  memberWorkId,
              }),
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
            dispatch({ type: types.GROUPS_CURRENT_SET_SELECTED, payload: groupId });
            masterWorkId && masterWorkId !== guid.emptyGuid() && dispatch({ type: types.WORK_CURRENT_SET_SELECTED, payload: masterWorkId });
            dispatch({ type: types.GROUPS_INIT, payload: response });
            if (goToPage && goToPage !== "STAY") {
                browserHistory.push(`/` + goToPage);
            }
        })
  }
}

export const addNewGroup = (personId, groupTypeName, groupName, languageChosen, internalId, description) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groups/addOrUpdate`, {
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
        body: JSON.stringify({
            personId,
            groupName,
            groupTypeName,
            internalId,
            description,
            languageId: languageChosen,
        }),
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
        dispatch({ type: types.GROUPS_INIT, payload: response });
        let newGroup = response && response.length > 0 && response.filter(m => m.groupName === groupName)[0];
        let newGroupId = !!newGroup ? newGroup.groupId : '';
        dispatch({ type: types.GROUPS_CURRENT_SET_SELECTED, payload: newGroupId});
        browserHistory.push("/groupMemberAdd");
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const updateGroup = (personId, groupId, groupName, internalId, description, goToPage) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groups/addOrUpdate`, {
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
        body: JSON.stringify({
            personId,
            groupId,
            groupName,
            internalId,
            description,
        }),
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
        dispatch({ type: types.GROUPS_INIT, payload: response });
        if (goToPage !== "STAY") {
            browserHistory.push(goToPage);
        }
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const deleteGroup = (personId, groupId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groups/delete/` + personId + `/` + groupId, {
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
        body: JSON.stringify({
        }),
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
        dispatch({ type: types.GROUPS_DELETE, payload: groupId });
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const setGroupMembers = (personId, groupId, members) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groups/members/update`, {
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
        body: JSON.stringify({
            personId,
            groupId,
            members
        }),
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
        dispatch({ type: types.GROUPS_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const removeMember = (personId, groupId, member_personId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groups/member/remove/` + personId + `/` + groupId + `/` + member_personId, {
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
        body: JSON.stringify({
        }),
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
        dispatch({ type: types.GROUPS_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const updateGroupMember = (personId, groupId, member) => {
    return dispatch =>
      fetch(`${apiHost}ebi/groups/updateMember/` + personId + `/` + groupId, {
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
        body: JSON.stringify(member),
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
          dispatch({ type: types.GROUPS_INIT, payload: response });
      })
      //.catch(error => { console.l og('request failed', error); });
}
