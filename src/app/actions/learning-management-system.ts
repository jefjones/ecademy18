import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'
import * as works from './works'
import * as fileTreeSubContents from './file-tree-sub-contents'
import * as groups from './groups'
import * as contacts from './contacts'
import * as workFilter from './work-filter'
import * as contactFilter from './contact-filter'
import * as languageList from './language-list'
import * as genreList from './genre-list'
import * as groupTypes from './group-types'
import * as declineIdleList from './decline-idle-list'
import * as colorsEditor from './colors-editor'
import * as workStatusList from './work-status-list'
import * as editSeverityList from './edit-severity-list'
import * as loggedIn from './logged-in'
import * as personConfig from './person-config'
import * as editorInvitePending from './editor-invite-pending'
import * as editReview from './edit-review'
import * as workEditReview from '../actions/work-edit-review'
import {apiHost} from '../api_host'

export function loginError(error) {
    return { error, type: types.LOGGED_FAILED }
}

export function lmsLogin(personId, workId) { //Only sendTo if this is a salta function to get to a specific document as a student or teacher.
		//It is most likely that the workId could be blank.  We pick it up from recentWorks which is where it is stored in this case for now.
    return dispatch =>
    fetch(`${apiHost}ebi/person/learningManagementSystemLogin`, {
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
        body: JSON.stringify(personId),
    })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            throw new Error('Invalid Login')
        }
    })
    .then(response => {
				if (response.loginPerson.fullName === "NOTVALID") {
            dispatch({ type: types.LOGGED_FAILED })
        } else {
            localStorage.setItem("authToken", JSON.stringify(response.token).replace(/"/g, ''))
						localStorage.setItem("person", JSON.stringify(response.loginPerson))
            let personId = response.loginPerson.personId
						let workId = response.penspringTransferSite && response.penspringTransferSite.penspringWorkId

            Promise.all([dispatch({ type: types.LOGGED_SUCCESSFULLY, payload: response.loginPerson }),
                dispatch(loggedIn.setLoggedIn(true))])
                .then(Promise.all([
                    dispatch(contacts.init(personId)),
										dispatch(works.init(personId)),
                    dispatch(workEditReview.getWorkEditReview(personId, workId)),
										dispatch(fileTreeSubContents.getMyWorks(personId)),
										dispatch(fileTreeSubContents.getWorksSharedWithMe(personId)),
                    dispatch(works.initWorkIdCurrent(personId)),
                    dispatch(groups.init(personId)),
										dispatch(groups.initGroupsIdCurrent(personId)),
										dispatch(editReview.getChapterText(personId, workId, 0, 1)),
										dispatch(editReview.getAuthorWorkspace(personId, workId, 0)),
                    dispatch(personConfig.init(personId))])
                .then(
                    dispatch(workFilter.init(personId)),
                    dispatch(contactFilter.init(personId)),
                    dispatch(languageList.init()),
                    dispatch(genreList.init()),
                    dispatch(groupTypes.init()),
                    dispatch(declineIdleList.init()),
                    dispatch(colorsEditor.init()),
                    dispatch(workStatusList.init()),
                    dispatch(editSeverityList.init()),
                    dispatch(editorInvitePending.init(personId)))
                .then(response.penspringTransferSite.transferCode === 'STARTWRITING'
										? navigate(`/editReview/LMStransfer/${workId}`)
										: response.penspringTransferSite.transferCode === 'FILEUPLOAD'
												? navigate("/firstNav/workUploadFile")
											  : navigate("/firstNav")))
            }
        }
    )
    .catch(response => {
        dispatch({ type: types.LOGGED_FAILED})
    })
}
