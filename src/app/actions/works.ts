import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'
import {init as fromChaptersInit} from './chapters'
import * as fromEditReview from './edit-review'
import * as fileTreeSubContents from './file-tree-sub-contents'
import * as fromGroups from './groups'
import * as guid from '../utils/guidValidate'
import {apiHost} from '../api_host'

export const init = (personId, includeAssignmentWorkId) => {
    return dispatch => {
        dispatch({type: types.FETCHING_RECORD, payload: {works: true} })
        return fetch(`${apiHost}ebi/works/` + personId + `/` + includeAssignmentWorkId, {
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
            dispatch({ type: types.WORKS_INIT, payload: response })
            dispatch({type: types.FETCHING_RECORD, payload: {works: false} })
            if (includeAssignmentWorkId && includeAssignmentWorkId !== guid.emptyGuid()) {
                dispatch({ type: types.WORK_CURRENT_SET_SELECTED, payload: {workId: includeAssignmentWorkId}})
                navigate(`/editReview/${includeAssignmentWorkId}`)
            }
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const setWorks = ( works ) => {
    return { type: types.WORKS_INIT, payload: works }
}

export const setWorkIdCurrent = ( workId_current ) => {
    return { type: types.WORK_CURRENT_SET_SELECTED, payload: {workId: workId_current}}
}


export const initWorkIdCurrent = (personId) => {
    return dispatch => {
				let storage = localStorage.getItem("recentWork")
				if (storage) {
						let response = JSON.parse(storage)
						dispatch( setWorkIdCurrent(response.workId))
						dispatch({ type: types.CHAPTER_CURRENT_SET_SELECTED, payload: response.chapterId })
						dispatch({ type: types.LANGUAGE_CURRENT_SET_SELECTED, payload: response.languageId })
						dispatch(fromChaptersInit(personId, response.workId))
				}

        return fetch(`${apiHost}ebi/recentWork/` + personId, {
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
						dispatch( setWorkIdCurrent(response.workId))
						dispatch({ type: types.CHAPTER_CURRENT_SET_SELECTED, payload: response.chapterId })
						dispatch({ type: types.LANGUAGE_CURRENT_SET_SELECTED, payload: response.languageId })
						dispatch(fromChaptersInit(personId, response.workId))
						localStorage.setItem("recentWork", JSON.stringify(response))
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const setVisitedHrefId = ( workId, hrefId, hrefSentence ) => {
    return { type: types.WORK_SET_VISITED_HREFID, payload: {workId, hrefId, hrefSentence} }
}

//The only difference between saveLastVisitedHrefId is that this has hrefId and doesn't have goToPage, and includes languageId.
export const saveLastVisitedHrefId = (personId, workId, chapterId, languageId, prevHrefId) => {
    return dispatch => {
      dispatch({ type: types.SENTENCE_CHOSEN_SET, payload: prevHrefId })
      fetch(`${apiHost}ebi/recentWork`, {
        method: 'put',
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
              workId,
              chapterId,
              languageId,
              prevHrefId,
          }),
      })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
        }
      })
  }
}

export const setWorkCurrentSelected = (personId, workId, chapterId, languageId, goToPage) => {
    chapterId = !chapterId ? guid.emptyGuid() : chapterId
    languageId = !languageId ? 0 : languageId

    return dispatch => {
        //The return will tell us that the chapterId was changed and will send us the chapterText back.
        fetch(`${apiHost}ebi/recentWork`, {
            method: 'put',
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
                  workId,
                  chapterId,
                  languageId,
              }),
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
            //Since we want the freedom to send in a recentWork without specifying a chapterId or languageId, let's get the recentWork
            //  back as the response and set those values accordingly.
            //let languageName = response.name;
            dispatch({ type: types.WORK_CURRENT_SET_SELECTED, payload: {workId: response.workId, chapterId_current: response.chapterId, chapterId: response.chapterId, languageId: response.languageId} })
            if (response.isChapterChange) {
                dispatch({ type: types.CHAPTER_TEXT_INIT, payload: response.chapterText })
                dispatch({ type: types.CHAPTER_CHANGED, payload: true })
            }
            if (goToPage && goToPage !== "STAY") {
                navigate(goToPage)
            }
        })
  }
}

export const addOrUpdateDocument = (workRecord, isFileUpload) => {
    //The only difference here beween a new or updated document is whether an existing workId is present.
    return dispatch => {
        fetch(`${apiHost}ebi/work/` + workRecord.personId, {
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
            body: JSON.stringify(workRecord),
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
            dispatch({ type: workRecord.workId ? types.WORK_NEW_UPDATE : types.WORK_NEW_ADD, payload: response })
            dispatch(setWorkCurrentSelected(response.personId, response.workId, response.chapterId_current, response.languageId_current, isFileUpload === "/assignmentDashboard" ? '/assignmentDashboard' : isFileUpload === "STAY" ? 'STAY' : (isFileUpload ? '/workUploadFile' : `/editReview/${response.workId}`)))
            if (workRecord.groupId) {
                dispatch(fromGroups.setGroupCurrentSelected(response.personId, workRecord.groupId, response.workId, '', 'STAY'))
            } else {
                dispatch(fromEditReview.resetEditReview())
            }
						dispatch(fileTreeSubContents.getMyWorks(workRecord.personId))
        })
        //.catch(error => { console.l og('request failed', error); });
    }
}

export const deleteWork = (personId, workId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/work/delete/` + personId + `/` + workId, {
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
            return response.json()
        } else {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      .then(response => {
        dispatch({ type: types.WORK_DELETE, payload: workId })
        dispatch(fromGroups.init(personId))
        dispatch(init(personId)); //This is this Works actions page's init function.
        dispatch(initWorkIdCurrent(personId))
      })
      //.catch(error => { console.l og('request failed', error); });
}

export const downloadWork = (personId, workId, chapterId, languageId) => {
    return dispatch =>
      fetch(`${apiHost}ebi/work/download/` + personId, {
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
              workId,
              chapterId,
              languageId
          }),
      })
}


export const updateGroupWorkStatus = (personId, groupId, workId, groupWorkStatusName) => {
    return dispatch =>
      fetch(`${apiHost}ebi/work/groupStatus/update/` + personId + `/` + groupId + `/` + workId + `/` + groupWorkStatusName, {
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
          dispatch({ type: types.GROUP_EDIT_REPORT_INIT, payload: response })
      })
}

export const addOrUpdateFolder = (folderRecord) => {
    return dispatch => {
        fetch(`${apiHost}ebi/fileFolder/` + folderRecord.personId, {
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
            body: JSON.stringify(folderRecord),
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
            dispatch(fileTreeSubContents.getMyWorks(folderRecord.personId))
        })
    }
}


export const setPenspringHomeworkSubmitted = (personId, workId) => {
    return dispatch => {
        fetch(`${apiHost}ebi/work/set/penspringSubmitted/` + personId + `/` + workId, {
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
						dispatch({ type: types.WORK_PENSPRING_SUBMITTED, payload: workId })
        })
    }
}

export const setPenspringDistributeSubmitted = (personId, workId) => {
    return dispatch => {
        fetch(`${apiHost}ebi/work/set/penspringDistribute/` + personId + `/` + workId, {
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
						dispatch({ type: types.WORK_PENSPRING_DISTRIBUTED, payload: workId })
        })
    }
}
