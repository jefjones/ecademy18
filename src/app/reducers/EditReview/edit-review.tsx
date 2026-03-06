import * as types from '../../actions/actionTypes'
import {combineReducers} from 'redux'
import {doSort} from '../../utils/sort'
import * as serviceEditReview from '../../services/edit-review'

/*
    AUTHOR:  When this is the author, here is how her tab and the edit counts will look:
    1. TAB:
        a. All edits will be color-coded without bothering to attempt color-codes for each author.
        b. The author's changes as well as accepted edits from the editors will be maintained in this tab only as far as icons and color codes are concerned.
            i. The author's changes mentioned above remain only for the session until she leaves the page or until she saved explicitly with the save button
                The purpose for this is to back it out if she decides against it.
    2. Jump controls
        a. When in EDIT mode, the drop down list will contain all edits for all editors and the prev/next arrows will also reflect what is in the list (which is a match that is always the case in all tabs)
        b. When not in EDIT mode, the drop down list and prev/next arrows reflect the changes of that mode chosen:  paragraph breaks (new or delete-exsiting) and moved sentences.
        c. The function assigned to the sentence clicking changes by mode (for both author and editor)
            i. However, the sentence click will pick up on icon clicks and change the mode accordingly.  But the tab will not change to the suggester/editor of that sentence-move or break-change.
        d. Emphatically, the difference between the author and editor when it comes to the jump controls is that the count in the author's case considers ALL editors.
            But when an editor tab is chosen, the counts consist only of that editor's work for the given mode.
    3. The two work tool icons: (1) Left pane (paper stack icon) or (2) editor-suggester icon (person icon)
        a. The paper stack icon is enabled only in edit mode and is always enabled when it is in edit mode.  The author can go work on the single editor in the left pane exclusive if she prefers.
        b. The person icon will be enabled ONLY when the sentence chosen has been edited by just one editor.  And it only enables if that one editor is not the chosen tab and when the given sentence is chosen.
        c. The author has freestyle editing.  The editor does not.  A click in EDIT mode will take the editor to the left pane.  Copying and pasting are disabled for the editor.

    EDITOR:
    1. Tab
        a. All sentence-edits will be color-coded, but in an editor's tab, the text is only changed according to this editor's entry.
        b. The editor's color will be darker than the others.
        c. The author's changes will not be color-coded and the author's pending changes will also be shown as if they have been saved to the chapterText record in the database.
    2. Jump controls
        a. The drop down list will contain the edits of this editor only.  The prev/next buttons will reflect the same count.
            i. And this applies to all edit modes.
        b. The paragraph-breaks and moved sentences will be shown for other editors as well.  This editor can vote on those changes accordingly.
        c. The function assigned to the sentence clicking changes by mode (for both author and editor)
    3. The two work tool icons: (1) Left pane (paper stack icon) or (2) editor-suggester icon (person icon)
        a. When in EDIT mode, the editor is forced to go to the left pane.
        b. The person icon will be enabled ONLY when the sentence chosen has been edited by just one editor.  And it only enables if that one editor is not the chosen tab and when the given sentence is chosen.
        c. The author has freestyle editing.  The editor does not.  A click in EDIT mode will take the editor to the left pane.  Copying and pasting are disabled for the editor.
*/


const modeChosen = (state='edit', action) => { //Set the state to blank so that when the chapterTabText arrives, the mode can be set along with its sentenceClickFunction.
    switch(action.type) {
        case types.EDIT_MODE_CHOSEN_SET:
            return action.payload ? action.payload : state

        default:
            return state
    }
}

const editorTabChosen = (state=0, action) => {
    switch(action.type) {
        case types.EDITOR_TAB_CHOSEN_SET:
            return action.payload ? action.payload : state

        default:
            return state
    }
}

const sentenceChosen = (state='', action) => {  //See editChosen below.  Sometimes it is the same as sentenceChosen.
    switch(action.type) {
        case types.SENTENCE_CHOSEN_SET:
            return action.payload

        default:
            return state
    }
}

const editChosen = (state='', action) => {  //This editChosen is sometimes the same and sometimes it is different than the sentenceChosen. It is the icon chosen for paragraph break or moved sentence.
    switch(action.type) {
        case types.EDIT_CHOSEN_SET:
            return action.payload;  //This can be blank, so allow it to set itself to empty or blank.

        default:
            return state
    }
}

const iconPosition = (state='', action) => {  //This editChosen is sometimes the same and sometimes it is different than the sentenceChosen. It is the icon chosen for paragraph break or moved sentence.
    switch(action.type) {
        case types.EDIT_ICON_POSITION_SET:
            return action.payload;  //This can be blank, so allow it to set itself to empty or blank.

        default:
            return state
    }
}

const breakNewChosen = (state='', action) => {
    switch(action.type) {
        case types.PARAGRAPH_NEW_BREAK_CHOSEN_SET:
            return action.payload

        default:
            return state
    }
}

const breakDeleteChosen = (state='', action) => {
    switch(action.type) {
        case types.PARAGRAPH_DELETE_BREAK_CHOSEN_SET:
            return action.payload

        default:
            return state
    }
}

const moveChosen = (state='', action) => {
    switch(action.type) {
        case types.SENTENCE_MOVE_CHOSEN_SET:
            return action.payload

        default:
            return state
    }
}

const imageNewChosen = (state='', action) => {
    switch(action.type) {
        case types.IMAGE_NEW_CHOSEN_SET:
            return action.payload

        default:
            return state
    }
}

const editDetails = (state=[], action) => {
    switch(action.type) {
        case types.EDIT_DETAILS_INIT:
            return action.payload ? action.payload : []; //This could come in blank intentionally, so don't set it to state if the action.payload is empty.  It would keep the previous state which has changed.

        case types.EDIT_DETAILS_ACCEPTED_UPDATE: {
            const {acceptedEditDetailId, isAuthorAcceptedEdit} = action.payload
            if (!isAuthorAcceptedEdit) return state
            return state && state.length > 0 ? state.filter(m => m.editDetailId !== acceptedEditDetailId) : state
        }

        case types.EDIT_DETAIL_TEMP_NEW: {
            //Help toDo:  This might not be the way to go.
            const {personId, chapterId, editText, editTypeName} = action.payload
            let newEditDetail = {personId, chapterId, editText, editTypeName, pendingFlag: true}
            return state && state.length > 0 ? state.push(newEditDetail) : [newEditDetail]
        }
        default:
            return state
    }
}

const chapterText = (state="", action) => {
    switch(action.type) {
        case types.CHAPTER_TEXT_INIT:
            return action.payload;  //This can come through as blank in order to initialize a new chapter where the user is going to be writing or pasting in new text.

        default:
            return state
    }
}

const authorWorkspace = (state="", action) => {
    switch(action.type) {
        case types.AUTHOR_WORKSPACE_INIT:
            return action.payload;  //This can come through as blank in order to initialize a new chapter where the user is going to be writing or pasting in new text.

        default:
            return state
    }
}

const isChapterChange = (state=false, action) => {
    switch(action.type) {
        case types.CHAPTER_CHANGED:
            return action.payload;  //This is to determine that the ChapterText needs to be updated.

        default:
            return state
    }
}


const showEditorTabDiff = (state=true, action) => {
    switch(action.type) {
        case types.EDIT_REVIEW_EDITOR_TAB_DIFF:
            return !state;  //This is to turn off or on the editor tab differences.

        default:
            return state
    }
}


export default combineReducers({ modeChosen, editorTabChosen, sentenceChosen, editChosen, iconPosition, breakNewChosen, breakDeleteChosen, moveChosen,
                                    imageNewChosen, editDetails, chapterText, isChapterChange, authorWorkspace, showEditorTabDiff })

//Translation:  If this is in translation mode, the editDetails will consist of the chosen language.
//    And there wouldn't be paragraph break changes nor moved sentences in translation mode.
//Sentence chosen:  This helps us not only in getting the original Text to show for edits and translations, but it will indicate
//    the edit list option to be chosen.

export const selectEditDetails = (state) => {
    let edits = state && state.editDetails && state.chapterText && state.editDetails.length > 0 && state.editDetails.reduce((acc, edit) => {
        if (state.chapterText.indexOf(edit.hrefId) > -1) {  //Cut out the edits which are no longer valid because the author may have deleted the sentences entirely.
            acc = acc ? acc.concat(edit) : [edit]
        }
        return acc
    }, [])
    return edits || []
}

export const selectEditDetailCommentByMe = (state, personId, hrefId="") => {
    let hrefIdChosen = hrefId ? hrefId : state && state.sentenceChosen
    let theReturn = state && state.editDetails && state.editDetails.length > 0 &&
        state.editDetails.filter(m => m.personId === personId && m.hrefId === hrefIdChosen && m.isComment)
    return (theReturn && theReturn[0]) ? theReturn[0].editText : ''
}

export const selectModeCounts = (state, authorPersonId) => {
    let modeCounts = {}
    if (state && state.modeChosen && state.editDetails && state.editDetails.length > 0) {
        modeCounts.editCount = [...new Set(state.editDetails.filter(m => m.editTypeName === 'edit' && m.pendingFlag && m.personid !== authorPersonId).map(m => m.hrefId))].length
        modeCounts.breakNewCount = [...new Set(state.editDetails.filter(m => m.editTypeName === 'breakNew' && m.pendingFlag && m.personid !== authorPersonId).map(m => m.position + m.hrefId))].length
        modeCounts.breakDeleteCount = [...new Set(state.editDetails.filter(m => m.editTypeName === 'breakDelete' && m.pendingFlag && m.personid !== authorPersonId).map(m => m.position + m.hrefId))].length
        modeCounts.sentenceMoveCount = [...new Set(state.editDetails.filter(m => m.editTypeName === 'sentenceMove' && m.pendingFlag && m.personid !== authorPersonId).map(m => m.position + m.hrefId))].length
        modeCounts.imageNewCount = [...new Set(state.editDetails.filter(m => m.editTypeName === 'imageNew' && m.pendingFlag && m.personid !== authorPersonId).map(m => m.position + m.hrefId))].length
    }
    return modeCounts
}

//Includes the hrefId-s and position values from whatever edit mode is currently modeChosen
export const selectEditListOptions = (state, authorPersonId, personId) => {
    let editListOptions = []
    let totalCount = 0
    let loopCount = 1
    let edits = selectEditDetails(state)
    let currentTabPersonId = state.editorTabChosen ? state.editorTabChosen : personId
    if (authorPersonId === currentTabPersonId) {
        edits = edits && edits.length > 0 && edits.filter(m => m.personId !== currentTabPersonId || m.isComment)
    } else {
        edits = edits && edits.length > 0 && edits.filter(m => m.personId === currentTabPersonId)
    }
    if (state && state.chapterText && edits && edits.length > 0) {
        editListOptions = edits.reduce((acc, edit) => {
            return state.chapterText.indexOf(edit.hrefId) > -1
                ? acc.concat({
                        id: edit.editTypeName === 'edit'
                            ? edit.hrefId //Notice that this one is the only hrefId.  the others are all editDetailId derivatives
                            : edit.editTypeName === 'breakNew'
                                ? 'breakNew' + edit.position + '^^!' + edit.editDetailId
                                : edit.editTypeName === 'breakDelete'
                                    ? 'breakDelete' + edit.position + '^^!' + edit.editDetailId
                                    : edit.editTypeName === 'imageNew'
                                        ? 'imageNew' + edit.position + '^^!' + edit.editDetailId
                                        : edit.editTypeName === 'sentenceMove'
                                            ? 'target' + edit.position + '^^!' + edit.editDetailId
                                            : edit.editTypeName === 'textNew'
                                                ? 'textNew' + edit.position + '^^!' + edit.editDetailId
                                                : '',
                        editDetailId: edit.editDetailId,
                        label: edit.editTypeNameFriendly,
                        editTypeName: edit.editTypeName,
                        hrefId: edit.hrefId,
                        position: edit.position,
                        personId: edit.personId,
                        personName: edit.personName,
                        firstName: edit.firstName,
                        locationIndex: state.chapterText.indexOf(edit.hrefId),
                    })
                : acc
            }, [])

        totalCount = editListOptions.length
        let totalText = totalCount === 1 ? totalCount + ' edit' : totalCount + ' edits'
        editListOptions.unshift({ id: 0, value: 0, label: totalText, locationIndex: 0})
        editListOptions = doSort(editListOptions, {sortField: 'locationIndex', isAsc: true, isNumber: true})
        loopCount = 1
        editListOptions = editListOptions.map(m => {
            if (m.id === 0) return m; //Return the first one without changing the label.
            m.label = loopCount + ' of ' + totalCount + ' - ' + m.label
            loopCount++
            return m
        })
    } else {
        editListOptions = editListOptions.concat({ id: 0, value: 0, label: '0 edits'})
    }
    return editListOptions || []
}

export const selectEditorTabChosen = (state, user_personId) => state && state.editorTabChosen ? state.editorTabChosen : user_personId

 //The tabs are set according to the editMode chosen and only if the given editor has at least one entry.  Order by the highest number of edits first.
export const selectEditorTabs = (state, current_personId, workSummary, user_personId, user_firstName, editorColors) => {
    //First, we need the author's name.  Notice that we prominently let Author be in the name place and the first name in the count place which is smaller and colored differently.
    let tabs = [{
        id: workSummary && workSummary.authorPersonId,
        label: workSummary && workSummary.firstName,
        sequence: 99998,
        isAuthor: true,
    }]

    if (state && state.editDetails && state.editDetails.length > 0) {
        let uniquePersonId = [...new Set(state.editDetails.filter(m => m.personId !== workSummary.authorPersonId).map(m => m.personId))]

        for(let i = 0; i < uniquePersonId.length; i++) {
            let editor = state.editDetails.filter(m => m.personId === uniquePersonId[i]);  //eslint-disable-line
            tabs = tabs.concat({
                id: editor[0].personId,  //eslint-disable-line
                label: editor[0].firstName,  //eslint-disable-line
                count: editor.length,   //eslint-disable-line
                sequence: editor.length,   //eslint-disable-line
                editorColor: editorColors[editor[0].personId]
            })
        }
    }
    //Make sure that the current user is in the tabs just in case he did not have any editDetails for the given edit mode.
    let currentUser = tabs && tabs.length > 0 && tabs.filter(m => m.id === current_personId)[0]
    if (!currentUser && current_personId !== workSummary.authorPersonId) {
        tabs = tabs.concat({
            id: current_personId,
            label: user_firstName,
            count: 0,
            sequence: 99997,
            editorColor: editorColors[user_personId]
        })
    }
    tabs = doSort(tabs, { sortField: 'sequence', isAsc: false, isNumber: true })

    return {
        chosenTab: state && state.editorTabChosen ? state.editorTabChosen : user_personId,
        tabs,
    }
}

function showTitlePageTabText(workSummary) {
    return "<div style='margin-top: 50px; text-align: center; position: relative: left: -40px;'>" +
                "<div style='margin-bottom: 10px;'><h2>" + workSummary.workName + "</h2></div>" +
                "<div style='margin-bottom: 10px;'>by " + workSummary.authorName + "</div>" +
                "<div style='cursor: pointer;'><i> see instructions <svg style='width: 14px; position: relative; top: 4px;' viewBox='0 0 32 32'><g><path d='M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z' fill='#000000'></path><path d='M20 24h-8v-2h2v-6h-2v-2h6v8h2z' fill='#000000'></path><path d='M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z' fill='#000000'></path></g></svg></i></div>" +
            "</div>"
}

export const selectChapterTextWriterSide = (editDetails, chapterText, authorPersonId, personId) => {
    //Author's editing pane is ChapterActiveText.  Editor's editing pane is ChapterTabText
    //For the author's editing pane, it will show the author's latest text (authorWorkspace if it exists or chapterText otherwise)
    //   with red edits (text and icons) from all editors. In editor's editing pane, the author's replaced sentences, breaks, and moved sentences will be in place but without any marks.
    //   For the author, her pane will show the same but with the blue edits (text and icons) for the author's changes.
    //For the editor, her editing pane will never show any colored edits (text or icons).  But the tabbed pane will show the editor's edits with track changes.
    //The other tabs in the active editing pane will show edits for only that given editor .
    //EXCEPT for comments.  Comments from anyone will show up in the text as red comment icons for everyone in any editing pane.
    let newText = chapterText
    if (!newText) return ""
    let htmlDoc = new DOMParser().parseFromString(newText, "text/html")
    newText = newText.replace(/\~\^/g, '~!'); //eslint-disable-line

    if (editDetails && editDetails.length > 0) {
        let editsFiltered = []
        let showColorCode = false
        let showEditIcons = false
        let replaceEditsBreaksAndSentences = true

        editsFiltered = editDetails.filter(m => m.personId === personId)
        if (editsFiltered && editsFiltered.length > 0) {
            let showDiffWords = false
            htmlDoc = serviceEditReview.showChapterTextEdits(htmlDoc, newText, editsFiltered, authorPersonId, showColorCode, showEditIcons, replaceEditsBreaksAndSentences, showDiffWords)
        }
    }
    let chapterTextResult = htmlDoc && htmlDoc.body && htmlDoc.body.innerHTML
        //Switch the left side's hrefIds to ~^  The right side preserves the ~! in the hrefIds.  The left sides gets switched back before being sent to the database.
    chapterTextResult = chapterTextResult.replace(/\~\!/g, '~^'); //eslint-disable-line
    return chapterTextResult || ''
}

export const selectChapterTabText = (editorTabChosen, editDetails, chapterText, authorPersonId, personId, tabChosen_personId=0, forceTabChosen=false, workSummary, editorColors, showEditorTabDiff=true) => {
    //Chapter Text and the ContentEditable Views:
    // 1. The main view (left)
    //      a. The author will see red text (edited text) and red icons for comments, break changes, moved sentence(s) and new image(s).
    //           i. The author can change freely and his right menu will accumulate his blue changes (text and icons) until commit again.
    //           ii. The left will save to authorChapterText in the chapter record and override chapterText for the author until commit (even between sessions).
    //      b. The editor will not see any red. (The purpose is for the editor to have a clean view and flow for undistracted editing.)
    // 2. The right side will contain a comparison full-view of the author and the editor (but only one of those users at a time, of course).
    //      a. The author will see her original text plus any of her current edits (not yet committed) in blue - text or icons.
    //          i. The edits kept in place during the session (before commit) will be available to be reversed.
    //          ii. The author needs to click on the submit icon (floppy disk) in order to commit the edit Details.
    //              If a commit was not done in a session, those edits will still be displayed.  That gives the author a chance to reverse them easily.
    //      b. The editor will see all of their own edits in red (text or icons) but no one else's.  They have the chance to reverse them out.
    //      c. The editor will see ALL edits in the author's tab if they care to see what others have done.
    //      d. Any user in any other user's full-view can click on an icon or a sentence in order to agree, disagree, or block-vote.
    //      e. Any edits that belong to the current user will find in the pop-down tool options that they can reverse the edit (delete the edit detail record).
    let tabPersonId = editorTabChosen ? editorTabChosen : tabChosen_personId
    if (forceTabChosen && tabChosen_personId) { //This is for the updating of the content when leaving the editReview page and the tab is not set to the author's before updating content to the database.
        tabPersonId = tabChosen_personId
    }
    if (tabPersonId === 0) return showTitlePageTabText(workSummary)

    let newText = chapterText
    if (!newText) return ""
    let htmlDoc = new DOMParser().parseFromString(newText, "text/html")

    if (editDetails && editDetails.length > 0) {
        let editsFiltered = []
        let showColorCode = true
        let showEditIcons = true
        let replaceEditsBreaksAndSentences = true
        let showDiffWords = false

        if (authorPersonId === personId && authorPersonId === tabPersonId) {
            //Author sees all of her own edits marked in the right editing pane
            replaceEditsBreaksAndSentences = false
            editsFiltered = editDetails
            if (editsFiltered && editsFiltered.length > 0) {
                htmlDoc = serviceEditReview.showChapterTextEdits(htmlDoc, newText, editsFiltered, authorPersonId, showColorCode, showEditIcons, replaceEditsBreaksAndSentences, showDiffWords, editorColors)
            }
        } else {
            //Editor see their own edits and comments.
            if (authorPersonId === tabPersonId) {
                replaceEditsBreaksAndSentences = false
                editsFiltered = editDetails.filter(m => m.personId !== authorPersonId || m.isComment)
            } else {
                showDiffWords = showEditorTabDiff
                editsFiltered = editDetails.filter(m => m.personId === tabPersonId)
            }
            if (editsFiltered && editsFiltered.length > 0) {
                htmlDoc = serviceEditReview.showChapterTextEdits(htmlDoc, newText, editsFiltered, authorPersonId, showColorCode, showEditIcons, replaceEditsBreaksAndSentences, showDiffWords, editorColors)
            }
        }
    }

    let result = htmlDoc && htmlDoc.body ? htmlDoc.body.innerHTML : ''
    //result = result && result.replace(/�/g, '');
    return result
}

export const selectChapterTextOriginal = (state) => state && state.chapterText ? state.chapterText : '';  //Because the chapterText that makes it to the interface with the edits that belong to the tab-editor.

export const selectOriginalSentence = (state, authorPersonId, personId, hrefId="") => {
    let hrefIdChosen = hrefId ? hrefId : state && state.sentenceChosen
    if (!hrefIdChosen) return ""
    hrefIdChosen = hrefIdChosen.replace(/\~\^/g, '~!'); //eslint-disable-line
    let newText = state && state.chapterText
    let htmlDoc = new DOMParser().parseFromString(newText, "text/html")
    let originalNode = htmlDoc.getElementById(hrefIdChosen)
    return originalNode && originalNode.innerHTML ? originalNode.innerHTML : ''
}

export const selectSentenceText = (state, hrefId="") => {
    if (state.sentenceChosen) {
        let newText = state && state.chapterText
        let htmlDoc = new DOMParser().parseFromString(newText, "text/html")
        let originalNode = htmlDoc.getElementById(state.sentenceChosen)
        return originalNode && originalNode.innerHTML ? originalNode.innerHTML : ''
    }
    return ""
}

export const selectEditOwner = (state) => {
    if (state.editDetails && state.editDetails.length > 0) {
        let editDetail = state.editDetails.filter(m => m.hrefId === state.editChosen && m.editTypeName === state.modeChosen)
        if (editDetail.length === 1) {
            return editDetail && editDetail.length > 0 ? editDetail[0].personId : ''
        }
    }
    return ""
}

export const selectEditCounts = (state, personId) => {
    let counts = {}
    if (state && state.sentenceChosen && state.editDetails && state.editDetails.length > 0) {
        counts.sentenceEdits = state.editDetails.filter(m => m.editTypeName === state.modeChosen && m.hrefId === state.editChosen && !m.isComment).length
        if (counts.sentenceEdits !== 1) {
            counts.sentenceEdits = state.editDetails.filter(m => m.editTypeName === state.modeChosen && m.hrefId === state.editChosen && m.position === state.iconPosition && !m.isComment).length
        }
        if (counts.sentenceEdits === 1) {
            counts.upVotes = state.editDetails.filter(m => m.hrefId === state.sentenceChosen && m.position === state.iconPosition).reduce((acc, vote) => vote.agreeCount ? acc += vote.agreeCount : acc, 0)
            counts.downVotes = state.editDetails.filter(m => m.hrefId === state.sentenceChosen && m.position === state.iconPosition).reduce((acc, vote) => vote.disagreeCount ? acc += vote.disagreeCount : acc, 0)
            counts.trollVotes = state.editDetails.filter(m => m.hrefId === state.sentenceChosen && m.position === state.iconPosition).reduce((acc, vote) => vote.trollCount ? acc += vote.trollCount : acc, 0)
            let editDetail = state.editDetails.filter(m => m.hrefId === state.sentenceChosen  && m.position === state.iconPosition && !m.isComment)[0]
            counts.editDetailId = editDetail && editDetail.editDetailId ? editDetail.editDetailId : ''
            counts.sentenceText = editDetail && editDetail.editText ? editDetail.editText : '';; //This is used for reporting troll entries.
        } else {
            counts.upVotes = ''
            counts.downVotes = ''
            counts.trollVotes = ''
            counts.editDetailId = ''
            counts.sentenceText = ''
        }

        if (state.modeChosen === 'edit') {
            counts.canVoteOrAccept = state.editDetails.filter(m => m.hrefId === state.sentenceChosen
                                                                && !m.isComment
                                                                && m.editTypeName === state.modeChosen
                                                                && m.personId === state.editorTabChosen
                                                                && state.editorTabChosen
                                                                && m.personId !== personId)[0]

            counts.canDelete = state.editDetails.filter(m => m.hrefId === state.sentenceChosen
                                                            && !m.isComment
                                                            && m.personId === personId)[0]
        } else if (state.modeChosen !== 'edit') {
            //We want the author or editors to accept or vote on this sentenceMove only when the editor who owns the moved sentence(s) has their tab chosen so that there is not confusion about what they are agreeing to.
            counts.canVoteOrAccept = state.editDetails.filter(m => m.hrefId === state.sentenceChosen
                                                                && m.editTypeName === state.modeChosen
                                                                && m.personId === state.editorTabChosen
                                                                && m.personId !== personId)[0]

            counts.canDelete = state.editDetails.filter(m => m.hrefId === state.sentenceChosen
                                                            && m.editTypeName === state.modeChosen
                                                            && m.personId === personId)[0]
        }
    }
    return counts
}


//We won't be sending in the editDetails and chapterText as part of this final editReview object to the view.
//  But we will send the chosen settings, original sentence for the currently chosen sentence as well as the modeCounts
//Remember that the chapterText is the original text.
//  It is the chapterTabText that we send over separately considering the chosen editor's/author's tab.
export const selectEditReview = (state, personId, authorPersonId, workLanguageId, currentLanguageId) => {
    return ({
        modeCounts: selectModeCounts(state, authorPersonId),
        modeChosen: state.modeChosen,
        editorTabChosen: state.editorTabChosen,
        sentenceChosen: state.sentenceChosen,
        editChosen: state.editChosen,
        iconPosition: state.iconPosition,
        sentenceText: selectSentenceText(state),
        originalSentenceText: selectOriginalSentence(state, authorPersonId, personId),
        hrefCommentByMe: selectEditDetailCommentByMe(state, personId),
        breakNewChosen: state.breakNewChosen,
        breakDeleteChosen: state.breakDeleteChosen,
        moveChosen: state.moveChosen,
        imageNewChosen: state.imageNewChosen,
        editCounts: selectEditCounts(state, personId),
        isTranslation: workLanguageId !== currentLanguageId,
        editOwner: selectEditOwner(state),
        editDetails: state.editDetails,
        isChapterChange,
				showEditorTabDiff: state.showEditorTabDiff,
    })
}

export const selectAuthorWorkspace = (state) => {
    let result = (state && state.authorWorkspace && state.authorWorkspace.length > 0) ? state.authorWorkspace.replace(/\~\!/g, '~^') : ""; //eslint-disable-line
    //result = result && result.replace(/�/g, '&nbsp;');
    return result
}
