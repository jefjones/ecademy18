import { useEffect } from 'react'
import EditReviewView from '../views/EditReviewView/EditReviewView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as actionWorkEditReview from '../actions/work-edit-review'
import * as actionChapter from '../actions/chapters'
import * as actionEditReview from '../actions/edit-review'
import * as fromEditReview from '../reducers/EditReview/edit-review'
import * as actionTranslatedSentence from '../actions/translated-sentence'
import * as actionLeftSidePanel from '../actions/left-side-panel'
import * as actionPersonConfig from '../actions/person-config'
import * as actionEditMicroReplace from '../actions/edit-micro-replace'
import * as fromBookmarks from '../reducers/bookmarks'
import * as actionBookmarks from '../actions/bookmarks'
import * as fromDraftComparison from '../reducers/draft-comparison'
import * as actionDraftComparison from '../actions/draft-comparison'
import * as actionTextProcessingProgress from '../actions/text-processing-progress'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionPageLang from '../actions/language-list'
//import {wait} from '../utils/wait';
import {guidEmpty} from '../utils/guidValidate'
//import * as actionGradebook from '../actions/grade-book';  part of the score function that isn't working due to the cursor location management or EditorDiv.

import { selectMe, selectWorkEditReview, selectLeftSidePanelOpen, selectPersonConfig, selectEditMicroReplace, assignColorsEditor, selectTextProcessingProgress,
					selectEditReview, selectEditDetails, selectLanguageIdCurrent, selectFetchingRecord, selectLanguageList} from '../store'

//Chapter Text and the ContentEditable Views:
// 1. The author's side (whic is the right side, currently) - This is the current user's workspace which is to remain clean of any edit marks except....
//      a. Author - Only the red edits will exist which prompt the user to make a choice and move on.
//          But when the author is making edits, the author's side remains clean and the right side will have blue marks of anything that she has edited
//          which will then go away after the author commits changes.  If she doesn't commit changes when leaving the page, the uncommitted
//          changes will remain visible on the right side (but, again, not on the author's side).
//      b. Editor - no marks will ever show on the editor's pane which is the left, currently.  But the right side will have the editor's edits which she can use to reverse as well
//          as to review what she has suggested.
// 2. The editor's side (right side,currently) - For any user's tab it will show what they have suggested for edits.  The editors' color is red in their tab but the author's
//      color is blue in her own tab.  And the edit navigation component will have the count of the edits in the open tab only.
//  Keep in mind that although the editor's-side tabs only contain the edits for the given editor, the author's pane on the left will have everyone's
//      edits in red that are pending a decision.  Of course, the editor's pane is available for making a choice for which edited text she wants, if any.

const mapStateToProps = (state, props) => {
    const personId = selectMe(state).personId
		const editorFirstName  = selectMe(state).fname
    let workSummary = selectWorkEditReview(state)

    //Draft comparison is only for the author.  But we'll send in the data objects since the data will be blank from the database and it won't be a burden
    const isDraftView = fromDraftComparison.selectIsDraftView(state.draftComparison) || false
    const editorColors = assignColorsEditor(state)
    const draftComparison = fromDraftComparison.selectDraftComparisons(state.draftComparison)
    const tabsData = isDraftView
        ? fromDraftComparison.selectDraftTabs(state.draftComparison)
        : fromEditReview.selectEditorTabs(state.editReview, personId, workSummary, 0, selectMe(state).fname, editorColors); //personId

		let isAuthor = workSummary && workSummary.authorPersonId === personId
		let isEditor = workSummary && workSummary.authorPersonId !== personId
    //For the author, the left editing pane will show the author's latest text (authorWorkspace if it exists or chapterText otherwise)
    //   with red edits (text and icons) from all editors. In that left editing pane, the author's replaced sentences, breaks, and moved sentences will be in place but without any marks.
    //   For the author, the right pane will show the same but with the blue edits (text and icons) for the author's changes.
    //For the editor, the left editing pane will never show any colored edits (text or icons).  But the right pane will show the editor's edits in red.
    //The other tabs in the right editing pane will show edits for only that given editor or all edits in the author's tab.
    //Right-side editing pane:
		let chapterTabText = state.editReview && fromEditReview.selectChapterTabText(state.editReview.editorTabChosen, state.editReview.editDetails, state.editReview.chapterText, workSummary && workSummary.authorPersonId, personId, '', false, workSummary, editorColors, state.editReview.showEditorTabDiff); //'' is the tabPersonChosen which we are not setting by force here.
    //Left-side editing pane: (The author always gets the authorWorkspace, but the editor gets the chapterTextWriterSide with their own editDetails but without the icons or colored text on the writer side.)
    //The hrefId-s need to be standard ~! before being sent to selectChapterTextWriterSide, which should be the case since this is coming from chapterText.  But just to make sure convert them here.
    let chapterText_standard = state && state.editReview && state.editReview.chapterText && state.editReview.chapterText.length > 0  && state.editReview.chapterText.replace(/\~\^/g, '~!'); //eslint-disable-line
    let chapterTextWriterSide = workSummary && workSummary.authorPersonId !== personId && state.editReview && fromEditReview.selectChapterTextWriterSide(state.editReview.editDetails, chapterText_standard, workSummary && workSummary.authorPersonId, personId)
    chapterTextWriterSide = chapterTextWriterSide && chapterTextWriterSide.length > 0  && chapterTextWriterSide.replace(/\~\!/g, '~^'); //eslint-disable-line

		//We took away the author Workspace.  But we were also having trouble bringin up the author's text after changing documents.
		//2019-04-15, I'm putting back the author Workspace since we are having trouble with going next/prev sentence from the left-slider-pane.
		//let authorWorkspace = state.editReview && fromEditReview.selectChapterTabText(state.editReview.editorTabChosen, state.editReview.editDetails, state.editReview.chapterText, workSummary && workSummary.authorPersonId, personId, '', false, workSummary, editorColors, false);
		let authorWorkspace = fromEditReview.selectAuthorWorkspace(state.editReview); //This is the author's side.
		authorWorkspace = isAuthor
				? authorWorkspace
						? authorWorkspace
						: `<div style="color: silver">Start writing here...</div>`
				: chapterTextWriterSide
		let languages = selectLanguageList(state)
		let languageId_current = workSummary && workSummary.languageOptions && workSummary.languageOptions.length === 1 ? workSummary.languageOptions[0].id : workSummary.languageId_current
		let language = languages && languages.length > 0 && languages.filter(m => m.id === languageId_current)[0]
		workSummary.languageName = language && language.label
		let workId = props.params && props.params.workId

    return {
				isLMSTransfer: props.params && props.params.isLMSTransfer === 'LMStransfer' ? true : false,
				workId,
				editorFirstName,
        isAuthor,
        isEditor,
        authorWorkspace, //This is the author's side.
        chapterTextWriterSide, //This is the editor's side.
        chapterTabText, //This is the right-side according to the tab that is chosen.
        personId,
				langCode: selectMe(state).langCode,
        authorPersonId: workSummary && workSummary.authorPersonId,
        languageId: selectLanguageIdCurrent(state),
        draftComparison,
        isDraftView,
        workSummary,
        tabsData,
        isTranslation: workSummary && workSummary.nativeLanguageId !== workSummary.languageId_current,
        translatedSentence: state.translatedSentence,
        leftSidePanelOpen: selectLeftSidePanelOpen(state),
        editDetails: selectEditDetails(state),
        hrefCommentByMe: fromEditReview.selectEditDetailCommentByMe(state.editReview, personId),
        personConfig: selectPersonConfig(state),
        bookmarkOptions: fromBookmarks.selectBookmarkOptions(state.bookmarks),
        bookmarks: fromBookmarks.selectBookmarks(state.bookmarks),
        editMicroReplace: selectEditMicroReplace(state),
        textProcessingProgress: selectTextProcessingProgress(state),
        editReview: selectEditReview(state, personId, workSummary && workSummary.authorPersonId, workSummary && workSummary.nativeLanguageId),
        editListOptions: fromEditReview.selectEditListOptions(state.editReview, workSummary && workSummary.authorPersonId, personId),
        fetchingRecord: selectFetchingRecord(state),
        editorColors,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setDraftTabSelected: (draftComparisonId) => dispatch(actionDraftComparison.setDraftTabSelected(draftComparisonId)),
    toggleDraftView: () => dispatch(actionDraftComparison.toggleDraftView()),
    setBookmarks: (personId, chapterId, languageId) => dispatch(actionBookmarks.init(personId, chapterId, languageId)),
    saveNewBookmark: (personId, chapterId, languageId, hrefId, name)  => dispatch(actionBookmarks.saveNewBookmark(personId, chapterId, languageId, hrefId, name)),
    setDraftComparison: (personId, workId, chapterId, languageId) => dispatch(actionDraftComparison.init(personId, workId, chapterId, languageId)),
    deleteBookmark: (personId, chapterId, languageId, hrefId) => dispatch(actionBookmarks.deleteBookmark(personId, chapterId, languageId, hrefId)),
    setVisitedHrefId: (workId, hrefId, hrefSentence) => dispatch(actionWorks.setVisitedHrefId(workId, hrefId, hrefSentence)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
		setPenspringHomeworkSubmitted: (personId, workId) => dispatch(actionWorks.setPenspringHomeworkSubmitted(personId, workId)),
		setPenspringDistributeSubmitted: (personId, workId) => dispatch(actionWorks.setPenspringDistributeSubmitted(personId, workId)),
    saveLastVisitedHrefId: (personId, workId, chapterId, languageId, prevHrefId) => dispatch(actionWorks.saveLastVisitedHrefId(personId, workId, chapterId, languageId, prevHrefId)),
    updateContent: (personId, authorPersonId, workId, chapterId, languageId, chapterText, includeHistory, trackFetch) => dispatch(actionEditReview.updateContent(personId, authorPersonId, workId, chapterId, languageId, chapterText, includeHistory, trackFetch)),
    updateAuthorWorkspace: (personId, workId, chapterId, languageId, authorWorkspace) => dispatch(actionEditReview.updateAuthorWorkspace(personId, workId, chapterId, languageId, authorWorkspace)),
    setEditDetail: (personId, workId, chapterId, languageId, hrefId, editText, isComment, editTypeName, position, moveArrayHrefId) => dispatch(actionChapter.setEditDetail(personId, workId, chapterId, languageId, hrefId, editText, isComment, editTypeName, position, moveArrayHrefId)),
    setMultipleEditDetail: (personId, workId, chapterId, languageId, hrefIdSelections) => dispatch(actionChapter.setMultipleEditDetail(personId, workId, chapterId, languageId, hrefIdSelections)),
    blankOutEditMicroReplace: () => dispatch(actionEditMicroReplace.blankOutEditMicroReplace()),
    setEditVote: (voterPersonId, chapterId, languageId, editDetailId, voteType, trollEditText, voterComment, isComment) => dispatch(actionChapter.setEditVote(voterPersonId, chapterId, languageId, editDetailId, voteType, trollEditText, voterComment, isComment)),
    setAcceptedEdit: (personId, workId, chapterId, languageId, acceptedEditDetailId, isAuthorAcceptedEdit) => dispatch(actionChapter.setAcceptedEdit(personId, workId, chapterId, languageId, acceptedEditDetailId, isAuthorAcceptedEdit)),
    deleteEditDetail: (personId, editDetailId) => dispatch(actionChapter.deleteEditDetail(personId, editDetailId)),
    restoreEditDetail: (personId, editDetailId) => dispatch(actionChapter.restoreEditDetail(personId, editDetailId)),
    toggleLeftSidePanelOpen: () => dispatch(actionLeftSidePanel.toggleLeftSidePanelOpen()),
    getTranslation: (personId, workId, languageId, hrefId, chapterId, translateText)  => dispatch(actionTranslatedSentence.getTranslation(personId, workId, languageId, hrefId, chapterId, translateText)),
    clearTranslation: () => dispatch(actionTranslatedSentence.clearTranslation()),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
    updatePersonConfigNotPersist: (personId)  => dispatch(actionPersonConfig.updatePersonConfigNotPersist(personId)),
    getTextProcessingProgress: (personId) => dispatch(actionTextProcessingProgress.getTextProcessingProgress(personId)),
    setBlankTextProcessingProgress: (personId) => dispatch(actionTextProcessingProgress.setBlankTextProcessingProgress(personId)),
    setModeChosen: (modeChosen) => dispatch(actionEditReview.setModeChosen(modeChosen)),
    setEditorTabChosen: (editorTabChosen) => dispatch(actionEditReview.setEditorTabChosen(editorTabChosen)),
    setSentenceChosen: (sentenceChosen) => dispatch(actionEditReview.setSentenceChosen(sentenceChosen)),
    setEditChosen: (editChosen) => dispatch(actionEditReview.setEditChosen(editChosen)),
    setIconPosition: (iconPosition) => dispatch(actionEditReview.setIconPosition(iconPosition)),
    setSentenceMoveChosen: (sentenceMoveChosen) => dispatch(actionEditReview.setSentenceMoveChosen(sentenceMoveChosen)),
    setBreakNewChosen: (breakNewChosen) => dispatch(actionEditReview.setBreakNewChosen(breakNewChosen)),
    setBreakDeleteChosen: (breakDeleteChosen) => dispatch(actionEditReview.setBreakDeleteChosen(breakDeleteChosen)),
    setChapterWasChanged: () => dispatch(actionEditReview.setChapterWasChanged()),
    getChapterText: (personId, workId, chapterId, languageId) => dispatch(actionEditReview.getChapterText(personId, workId, chapterId, languageId)),
    getAuthorWorkspace: (personId, workId, chapterId) => dispatch(actionEditReview.getAuthorWorkspace(personId, workId, chapterId)),
    getEditDetails: (personId, workId, chapterId, languageId, includeHistory) => dispatch(actionEditReview.getEditDetails(personId, workId, chapterId, languageId, includeHistory)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapter.deleteChapter(personId, workId, chapterId)),
    resolveFetchingRecordChapterText: () => dispatch(actionFetchingRecord.resolveFetchingRecordChapterText()),
    resolveFetchingRecordAuthorWorkspace: () => dispatch(actionFetchingRecord.resolveFetchingRecordAuthorWorkspace()),
		resolveFetchingRecordWorkEditReview: () => dispatch(actionFetchingRecord.resolveFetchingRecordWorkEditReview()),
		clearAuthorWorkspace: () => dispatch(actionEditReview.clearAuthorWorkspace()),
    clearChapterText: () => dispatch(actionEditReview.clearChapterText()),
		toggleShowEditorTabDiff: () => dispatch(actionEditReview.toggleShowEditorTabDiff()),
		getWorkEditReview: (personId, workId) => dispatch(actionWorkEditReview.getWorkEditReview(personId, workId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		//  part of the score function that isn't working due to the cursor location management or EditorDiv.
		//setGradebookScoreByPenspring: (personId, studentAssignmentResponseId, score) => dispatch(actionGradebook.setGradebookScoreByPenspring(personId, studentAssignmentResponseId, score)),

})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {personId, workId, getWorkEditReview, workSummary, params, languageId, getEditDetails, setBookmarks, setDraftComparison, getChapterText,
                      getAuthorWorkspace, setEditorTabChosen, getPageLangs, langCode} = props
    
    				getWorkEditReview(personId, workId)
            getEditDetails(personId, workId, workSummary.chapterId_current, languageId)
            params && params.isdraft && setDraftComparison(personId, workSummary.workId, workSummary.chapterId_current, languageId); //If draftview is set on, then this will automatically set the view parameter in the draftComparison store.  There is a toggle function to turn it off.
            setBookmarks(personId, workSummary.chapterId_current, languageId); //WE NEED THE WORKID HERE AND NOT JUST THE CHAPTERiD_CURRENT!
            getChapterText(personId, workId, '', languageId)
            getAuthorWorkspace(personId, workId, '')
            if (params && !params.chosenTabPersonId) { //We want the Title Page to be chosen by default which is value 0
                setEditorTabChosen(personId)
            }
    				getPageLangs(personId, langCode, 'EditReviewView')
        
  }, [])

  const {workId, workSummary, fetchingRecord} = props
          return workId && workSummary && workSummary.authorPersonId && workSummary.authorPersonId !== guidEmpty && fetchingRecord && !fetchingRecord.workEditReview
  						? <EditReviewView {...props} />
  						: null
}

export default Container
