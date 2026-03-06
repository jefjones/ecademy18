import { useEffect, useState } from 'react'
import styles from './EditReviewView.css'
const p = 'EditReviewView'
import L from '../../components/PageLanguage'
import EditTools from '../../components/EditTools'
import EditListNavigator from '../../components/EditListNavigator'
import SearchTextTool from '../../components/SearchTextTool'
import BookmarkTool from '../../components/BookmarkTool'
import MessageModal from '../../components/MessageModal'
import ProgressModal from '../../components/ProgressModal'
import ImageUploadFileModal from '../../components/ImageUploadFileModal'
import SentenceEdits from '../../components/SentenceEdits'
import EditorInstructions from '../../components/EditorInstructions'
import LoadingModal from '../../components/LoadingModal'
import TabPage from '../../components/TabPage'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateMoment from '../../components/DateMoment'
import Button from '../../components/Button'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import Icon from '../../components/Icon'
import TextEditorTools from '../../components/TextEditorTools'
import ContextEditReview from '../../components/ContextEditReview'
import SlidingPane from 'material-ui/Drawer'; //http://www.material-ui.com
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import classes from 'classnames'
import * as serviceEditReview from '../../services/edit-review'
import debounce from 'lodash/debounce'
import {ScrollSync, ScrollSyncPane} from 'react-scroll-sync'
import ReactToPrint from "react-to-print"
import MediaQuery from 'react-responsive'
import {doSort} from '../../utils/sort'
//import Media from "react-media";

let savedCursorPosition = null

const colorEditPending = "#e6f4ff"
const colorEditPending_RGB = "rgb(230, 244, 255)"
const colorCurrentFocus = "yellow"
const colorEditHistory = "#FDFADC"
const colorFullVersionView = "#F7FAF8"
const colorMoveSentence = "#e6f4ff"; //"#f9cec9"

// let colorMyEdit = "rgba(20, 167, 26, 0.05)";
// let colorMineAndOtherEditor = "rgba(20, 167, 48, 0.1)";
// let colorOtherEditor = "rgba(230, 155, 5, .1)";

const borderRadius  = "4px"
/*
    TRANSLATION:  If this is a translation of the native language of this work, the following will happen:
    1. isTranslation prop will be set to true.
    2. The contentEditable will not be editable.
    3. Clicking on a sentence will open up the left panel.
        a.  If the sentence has NOT been translated, the api for the translator (bing or google) will be hit and a translation will be waiting
        b.  If it has been translated, the previous api translation would have been saved to be presented again if a change needs to be made without having to make the api call again.
        c.  The user can then choose the translation which will then go into the single editor.  Or the user can make their own translation.
    4. The left panel setting for going previous and next will be set by force so that the user can continue to translate
         each sentence one at a time.

    EDITING NATIVE LANGUAGE
    1. When leaving the current sentence
        a. The previous sentence will be checked for change.
            i. If a different sentence with its hrefId is detected, that sentence only is sent to the webapi
            ii. On the server-side, if it is the author, the sentence will be applied directly to the chapterText and new chapterText will be sent background
                  If it is the editor, the editDetail record will be saved and the editDetails record as a whole will be sent back (to include any other editors' edits completed since the last refresh)

    VIEWS
    1. The main view (left)
         a. The author will see red text (edited text) and red icons for comments, break changes, moved sentence(s) and new image(s).
              i. The author can change freely and his right menu will accumulate his blue changes (text and icons) until commit again.
              ii. The left will save to authorChapterText in the chapter record and override chapterText for the author until commit (even between sessions).
         b. The editor will not see any red. (The purpose is for the editor to have a clean view and flow for undistracted editing.)
    2. The right side will contain a comparison full-view of the author and the editor (but only one of those users at a time, of course).
         a. The author will see her original text plus any of her current edits (not yet committed) in blue - text or icons.
             i. The edits kept in place during the session (before commit) will be available to be reversed.
             ii. The author needs to click on the submit icon (floppy disk) in order to commit the edit Details.
                 If a commit was not done in a session, those edits will still be displayed.  That gives the author a chance to reverse them easily.
         b. The editor will see all of their own edits in red (text or icons) but no one else's.  They have the chance to reverse them out.
         c. The editor will see ALL edits in the author's tab if they care to see what others have done.
         d. Any user in any other user's full-view can click on an icon or a sentence in order to agree, disagree, or block-vote.
         e. Any edits that belong to the current user will find in the pop-down tool options that they can reverse the edit (delete the edit detail record).

    TOP TOOLS
    1. Mobile
        a. Only three icons and the drop-down caret will be displayed. (Plus the floppy disk for saving for the user)
        b. The pop-down menu will have the edit modes, search, and bookmark
    2. Tablet and Desktop
        a. All tools will be displayed.  There will not be a pop-down menu.

    hrefIds
    1. The writerside has its HrefIds changed from ~! to ~^ so that the functions through the process will highlight the right-side and not the left.  But those two ID types need to be managed throughout the processes.
*/

function EditReviewView(props) {
  const [hasInitialized, setHasInitialized] = useState(false)
  const [tinyEditorInitialized, setTinyEditorInitialized] = useState(false)
  const [sidePanel_open, setSidePanel_open] = useState(this.props.mediaQuery === 'large' || this.props.leftSidePanelOpen)
  const [sidePanel_docked, setSidePanel_docked] = useState(this.props.mediaQuery === 'large')
  const [errors, setErrors] = useState({})
  const [alreadyProcessed, setAlreadyProcessed] = useState(false)
  const [editDetailsUpdated, setEditDetailsUpdated] = useState('empty')
  const [currentHrefId, setCurrentHrefId] = useState('')
  const [currentSentence, setCurrentSentence] = useState('')
  const [stopKeypress, setStopKeypress] = useState(false)
  const [pointerSearchText, setPointerSearchText] = useState(0)
  const [pointerEditText, setPointerEditText] = useState(-1)
  const [pointedEditHrefId, setPointedEditHrefId] = useState('')
  const [searchText, setSearchText] = useState('')
  const [arraySearchTextFound, setArraySearchTextFound] = useState([])
  const [pointerBookmark, setPointerBookmark] = useState(-1)
  const [bookmarkChosen, setBookmarkChosen] = useState('')
  const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
  const [isShowingMissingBookmarkModal, setIsShowingMissingBookmarkModal] = useState(false)
  const [isShowingMovedSentenceError, setIsShowingMovedSentenceError] = useState(false)
  const [isShowingCutPasteMessage, setIsShowingCutPasteMessage] = useState(false)
  const [isShowingImageUpload, setIsShowingImageUpload] = useState(false)
  const [isShowingPenspringHomework, setIsShowingPenspringHomework] = useState(false)
  const [textSelection, setTextSelection] = useState({})
  const [isShowingProgress, setIsShowingProgress] = useState(false)
  const [isShowingProgress_imageEntry, setIsShowingProgress_imageEntry] = useState(false)
  const [timerId_progress, setTimerId_progress] = useState(null)
  const [timerId_editDetails, setTimerId_editDetails] = useState(null)
  const [timerId_imageEntry, setTimerId_imageEntry] = useState(null)
  const [searchChoice, setSearchChoice] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [newText, setNewText] = useState({ hrefId: '', position: '' })
  const [position, setPosition] = useState('')
  const [newBreak, setNewBreak] = useState({ hrefId: '', position: '' })
  const [deleteBreak, setDeleteBreak] = useState({hrefId: '', position: '' })
  const [moveSentence, setMoveSentence] = useState({hrefId: '', moveArrayHrefId: [], position: '', stepCount: 0 })
  const [moveArrayHrefId, setMoveArrayHrefId] = useState([])
  const [stepCount, setStepCount] = useState(0)
  const [newImage, setNewImage] = useState({ hrefId: '', position: '' })
  const [savedCursorPosition, setSavedCursorPosition] = useState(null)
  const [isShowingLoadingModal, setIsShowingLoadingModal] = useState(false)
  const [isShowingUpdateContentModal, setIsShowingUpdateContentModal] = useState(false)
  const [fetchingRecord, setFetchingRecord] = useState(this.props.fetchingRecord && this.props.fetchingRecord.chapterText)
  const [isShowingEndOfDocument, setIsShowingEndOfDocument] = useState(false)
  const [saveWorkSpaceTime, setSaveWorkSpaceTime] = useState(new Date())
  const [hideEditorsVersions, setHideEditorsVersions] = useState(props.isEditor || (props.tabsData && props.tabsData.tabs && props.tabsData.tabs.length > 1) ? false : true)
  const [saveSelection, setSaveSelection] = useState(undefined)
  const [restoreSelection, setRestoreSelection] = useState(undefined)
  const [tabsInit, setTabsInit] = useState(undefined)
  const [hasSetEditorsVersions, setHasSetEditorsVersions] = useState(undefined)
  const [pendingNewImage, setPendingNewImage] = useState(undefined)
  const [mediaQuerySize, setMediaQuerySize] = useState(undefined)
  const [hrefId, setHrefId] = useState(undefined)
  const [localHomeworkSubmitDate, setLocalHomeworkSubmitDate] = useState(undefined)
  const [isShowingPenspringDistribute, setIsShowingPenspringDistribute] = useState(undefined)
  const [localDistributeSubmitDate, setLocalDistributeSubmitDate] = useState(undefined)

  useEffect(() => {
    
            const {leftSidePanelOpen, toggleLeftSidePanelOpen, setBlankTextProcessingProgress, personId} = props
            handleLoadingModalOpen()
            leftSidePanelOpen && toggleLeftSidePanelOpen(); //If the left side is open, then close it.
            //document.getElementById("editorDiv").focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
            window.scrollTo(0, 1)
            setBlankTextProcessingProgress(personId)
            setSaveSelection(serviceEditReview.setSaveSelectionFunction(window, document))
            setRestoreSelection(serviceEditReview.setRestoreSelectionFunction(window, document))
    				//`<div style="color: silver">Start writing here...</div>`
    				document.getElementById('editorDiv').addEventListener('keyup', checkInitialPromptText); //This gets removed as soon as the start text is identified and removed.
    				document.getElementById('editorDiv').addEventListener('keydown', checkEscapeKeyAndAutoSave); //keydown is required here in order to override the Ctrl+S default behavior of the browser so that it can be used to save the text by the author.
    				document.getElementById('editorDiv').addEventListener('click', setCursorAtBeginningIfInit)
            //isAuthor && document.getElementById('editorDiv').addEventListener('blur', handleSaveAuthorWorkspace);  //Don't do this.  The editor's cursor gets lost
            //setTimerId_editDetails(setInterval(() => handleGetEditDetails(), 30000));
        
    return () => {
      
              // const {saveLastVisitedHrefId, personId, workSummary, workId, updatePersonConfigNotPersist, toggleDraftView, isDraftView, setBlankTextProcessingProgress,
      				// 				leftSidePanelOpen, toggleLeftSidePanelOpen, isAuthor, clearAuthorWorkspace, clearChapterText} = props;
      				const {clearAuthorWorkspace, clearChapterText} = props
      
              // leftSidePanelOpen && toggleLeftSidePanelOpen();
      				// isAuthor && handleSaveAuthorWorkspace();
      				// saveLastVisitedHrefId(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, currentHrefId);
              // if (isAuthor) {
              //     //handleAuthorProcessText(); //Yes, do this after all : [Don't do this here.  The author needs to commit the changes, otherwise, this could happen at any time and make an unintended update.]
              // }
              // updatePersonConfigNotPersist(personId); //We might not want to use this is we just want the user to choose a personConfig action and not have to confirm that they want it long term by making a second choice.
              // isDraftView && toggleDraftView();
              clearInterval(timerId_progress)
              clearInterval(timerId_editDetails)
              clearInterval(timerId_imageEntry)
              // setBlankTextProcessingProgress(personId);
              document.getElementById('editorDiv').innerHTML = ''; //This needs to clear out to get ready for the next authorWorkspace which might be a different document.  Otherwise, the previous one shows up.  Not good.
      				clearChapterText()
              clearAuthorWorkspace()
              document.getElementById('editorDiv').removeEventListener('keyup', checkForKeypress)
      				document.getElementById('editorDiv').removeEventListener('keydown', checkInitialPromptText)
      				document.getElementById('editorDiv').removeEventListener('click', setCursorAtBeginningIfInit)
              //isAuthor && document.getElementById('editorDiv').removeEventListener('blur', handleSaveAuthorWorkspace);
          
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            //This is necessary in order to set the tab with the chapterText properly.  ChapterText comes through late so that the tabText
            //  would just appear without any edit backgrounds since the process occurred before the ChapterText was complete.
            const {personId, editReview, setEditorTabChosen, tabsData, isAuthor, isEditor, fetchingRecord, authorWorkspace, pendingNewImage,
    							resolveFetchingRecordAuthorWorkspace } = props
            
            if (currentHrefId) highlightSentence(currentHrefId)
    
    				if (!tabsInit && tabsData && tabsData.tabs && tabsData.tabs.length > 1) {
    						setTabsInit(true); setHideEditorsVersions(isEditor || (tabsData.tabs.length > 1) ? false : true)
    						if (isEditor) {
    								let tabChoice = 1
    								tabsData.tabs.forEach((m, i) => {
    										if (m.id === personId) tabChoice = i
    								})
    								setEditorTabChosen(tabsData.tabs[tabChoice].id)
    						} else if (isAuthor) {
    								setEditorTabChosen(tabsData.tabs[1].id)
    						}
    				}
    
    				//if (isEditor && editReview && editReview.length > 0 && !hasSetEditorsVersions) setHasSetEditorsVersions(true); setHideEditorsVersions(false)
    
            //This is specifically for the authorWorkspace when it is the author.  We want an initial copy of the authorWorkspace and then no React updates to it! The author commits their changes when they are ready.
    				//This has changed for the time being.  The authorWorkspace might be an add-on feature controlled by personConfig.authorWorkspaceOn ... later.
            if (isAuthor && (fetchingRecord.authorWorkspace === 'ready' || (!document.getElementById('editorDiv').innerHTML && authorWorkspace && authorWorkspace.length > 0))) {
                if (pendingNewImage) {
                    //if (authorWorkspace.indexOf(pendingNewImage) > -1) {
                        setPendingNewImage('')
                        if (authorWorkspace) document.getElementById('editorDiv').innerHTML = authorWorkspace
                        resolveFetchingRecordAuthorWorkspace()
                        //setSentenceClickFunction('edit', true); //true is force
                    //}
                } else {
                    if (authorWorkspace) document.getElementById('editorDiv').innerHTML = authorWorkspace
                    resolveFetchingRecordAuthorWorkspace()
                    setSentenceClickFunction(editReview.modeChosen, true); //true is force
                }
            }
            if (!hasInitialized) {
                // if (isAuthor && authorWorkspace && authorWorkspace.length > 0) {
                //     if (authorWorkspace) document.getElementById('editorDiv').innerHTML = authorWorkspace;
                // }
                setHasInitialized(true)
                //handleEditModeChosen('edit');
                setSentenceClickFunction(editReview.modeChosen, true); //true is force
            }
            //if (isEditor) {
                setSentenceClickFunction(editReview.modeChosen, true); //true is force
            //}
            // //Help toDo:  Is this needed?
            // // if ((!alreadyProcessed || (editDetailsUpdated === 'empty' && editDetails && editDetails.length > 0)) && tabsData && tabsData.tabs.length > 0) {
            // //     isDraftView ? handleDraftTabs(editReview.editorTabChosen) : handleEditorTabChosen(editReview.editorTabChosen);
            // //     setAlreadyProcessed(true);
            // //     if (editDetails && editDetails.length > 0) {        //         setEditDetailsUpdated('notEmpty')
            // //     }
            // //     handleEditorTabChosen(params.chosenTabPersonId);
            // //     //setEditorTabText(editReview.editorTabChosen); //I don't think that this is needed since editReview store handles the automated update.
            // // }
    
            if (isEditor || (isAuthor && editReview.modeChosen !== 'edit')) {
                setSpansEvent('beforepaste', avoidCopyPaste)
                setSpansEvent('beforecopy', avoidCopyPaste)
                setSpansEvent('beforecut', avoidCopyPaste)
                setSpansEvent('paste', avoidCopyPaste)
                setSpansEvent('copy', avoidCopyPaste)
                setSpansEvent('cut', avoidCopyPaste)
            } else {
                setSpansEvent('beforepaste', () => {})
                setSpansEvent('beforecopy', () => {})
                setSpansEvent('beforecut', () => {})
                setSpansEvent('paste', () => {})
                setSpansEvent('copy', () => {})
                setSpansEvent('cut', () => {})
            }
    
    				//This is used here so that when the file comes up or the first time that it won't set the focus in the editors - both for the prpose of the mobile phone's keyboard that woudl come up immediately so that the user can't see most of the page to get used to it.  Plus, when starting to write a file, it seems to jump around at first.
    				if (document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML !== "" && document.getElementById('editorDiv').innerHTML !== `<div style="color: silver">Start writing here...</div>`) {
    						document.getElementById('editorDiv').focus()
    						delayedRestoreSelection(document.getElementById('editorDiv'), savedCursorPosition)
    						if (document.getElementById('tabView')) {
    				        let spans = document.getElementById('tabView').getElementsByTagName('svg')
    				        for(let i = 0; i < spans.length; i++) {
    				            if (spans && spans[i] && spans[i].id) {
    				                spans[i].onclick = () => {
    														handleEditChosen(spans[i].id)
    														showContextEditReview(event, spans[i].id)
    												}
    				                spans[i].oncontextmenu = (event) => {
    				                    event.stopPropagation()
    				                    event.preventDefault()
    				                    showContextEditReview(event, spans[i].id)
    				                }
    				            }
    								}
    		        }
    			 	}
        
  }, [])

  const setSavedCursorPosition = () => {
    
    				
    				savedCursorPosition = saveSelection(document.getElementById('editorDiv'))
    		
  }

  const showContextEditReview = (event, icon_elementId) => {
    
    				const {leftSidePanelOpen} = props
    				
            handleEditChosen(icon_elementId)
    				let minusLeftPanelWidth = (sidePanel_open || leftSidePanelOpen) ? 300 : 0
    
            document.getElementById('contextEditReview').style.display = 'inline'
            document.getElementById('contextEditReview').style.position = 'absolute'
            document.getElementById('contextEditReview').style.left = event.clientX - 30 - minusLeftPanelWidth
            document.getElementById('contextEditReview').style.top = event.clientY + 7
        
  }

  const writerHrefId = (elementId) => {
    
            if (elementId && elementId.length > 0 && elementId.indexOf('~!') > -1) {
                let newElementId = elementId.replace(/\~\!/g, '~^');  //eslint-disable-line
                return newElementId
            }
            return elementId
        
  }

  const standardHrefId = (elementId) => {
    
            if (elementId && elementId.length > 0 && elementId.indexOf('~^') > -1) {
                let newElementId = elementId.replace(/\~\^/g, '~!');  //eslint-disable-line
                return newElementId
            }
            return elementId
        
  }

  const setMediaQuery = (size) => {
    
            setMediaQuerySize(size)
        
  }

  const handleShowInstructions = (boolShow) => {
    
            setShowInstructions(boolShow)
        
  }

  const highlightSentence = (hrefId, color=colorCurrentFocus, writerSide) => {
    
            const {isAuthor} = props
            hrefId = writerSide ? writerHrefId(hrefId) : standardHrefId(hrefId)
    				let theOtherhrefIdType = hrefId.indexOf('~^') > -1 ? hrefId.replace('~^', '~!') : hrefId.replace('~!', '~^')
            if (document.getElementById(hrefId)) {
                if (color !== colorEditPending) {
                    document.getElementById(hrefId).style.color = "black"
                    document.getElementById(hrefId).style.backgroundColor = color
                    document.getElementById(hrefId).style.borderRadius = borderRadius
                } else if (color === colorEditPending) {
                    document.getElementById(hrefId).style.color = "red"
                    document.getElementById(hrefId).style.backgroundColor = 'white'
                }
            }
    				if (!(isAuthor && theOtherhrefIdType.indexOf('~^') > -1) && document.getElementById(theOtherhrefIdType)) {
                if (color !== colorEditPending) {
                    document.getElementById(theOtherhrefIdType).style.color = "black"
                    document.getElementById(theOtherhrefIdType).style.backgroundColor = color
                    document.getElementById(theOtherhrefIdType).style.borderRadius = borderRadius
                } else if (color === colorEditPending) {
                    document.getElementById(theOtherhrefIdType).style.color = "red"
                    document.getElementById(theOtherhrefIdType).style.backgroundColor = 'white'
                }
            }
        
  }

  const setIconChosen = (editChosen) => {
    
            decreaseAllIconOpacity(editChosen.id)
            if (editChosen.editTypeName !== "edit") {
                if (editChosen.editTypeName === "sentenceMove") {
                    if (document.getElementById('target' + editChosen.position + editChosen.id)) document.getElementById('target' + editChosen.position + editChosen.id).style.opacity = 1
                    if (document.getElementById('moveBegin' + editChosen.position + editChosen.id)) document.getElementById('moveBegin' + editChosen.position + editChosen.id).style.opacity = 1
                    if (document.getElementById('moveEnd' + editChosen.position + editChosen.id)) document.getElementById('moveEnd' + editChosen.position + editChosen.id).style.opacity = 1
                } else {
                    if (document.getElementById(editChosen.editTypeName + editChosen.position + editChosen.id)) document.getElementById(editChosen.editTypeName + editChosen.position + editChosen.id).style.opacity = 1
                }
            }
        
  }

  const createTarget = (beginOrEnd) => {
    
            let target = "<svg id='target"
            target += beginOrEnd === "Begin" ? "Begin'" : "End'"
            target += " style=' cursor:pointer; position: relative; top: 2px; width: 18px; height: 18px;' viewBox='0 0 20 20'><g><path d='M9.5 1c-0.276 0-0.5 0.224-0.5 0.5v4c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-4c0-0.276-0.224-0.5-0.5-0.5z' fill='#0000FF'></path><path d='M9.5 15c-0.276 0-0.5 0.224-0.5 0.5v4c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-4c0-0.276-0.224-0.5-0.5-0.5z' fill='#0000FF'></path><path d='M5 10.5c0-0.276-0.224-0.5-0.5-0.5h-4c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h4c0.276 0 0.5-0.224 0.5-0.5z' fill='#0000FF'></path><path d='M18.5 10h-4c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5z' fill='#0000FF'></path><path d='M16.21 9c-0.216 0-0.414-0.14-0.479-0.357-0.628-2.111-2.263-3.746-4.374-4.374-0.265-0.079-0.415-0.357-0.337-0.622s0.357-0.415 0.622-0.337c1.187 0.353 2.28 1.006 3.161 1.886s1.533 1.974 1.886 3.161c0.079 0.265-0.072 0.543-0.337 0.622-0.048 0.014-0.096 0.021-0.143 0.021z' fill='#0000FF'></path><path d='M11.5 17.71c-0.216 0-0.414-0.14-0.479-0.357-0.079-0.265 0.072-0.543 0.337-0.622 2.11-0.628 3.745-2.263 4.374-4.374 0.079-0.265 0.357-0.415 0.622-0.337s0.415 0.357 0.337 0.622c-0.353 1.187-1.006 2.28-1.886 3.161s-1.973 1.533-3.161 1.886c-0.048 0.014-0.096 0.021-0.143 0.021z' fill='#0000FF'></path><path d='M7.5 17.71c-0.047 0-0.095-0.007-0.143-0.021-1.187-0.353-2.28-1.005-3.161-1.886s-1.533-1.973-1.886-3.161c-0.079-0.265 0.072-0.543 0.337-0.622s0.543 0.072 0.622 0.337c0.628 2.11 2.263 3.745 4.374 4.373 0.265 0.079 0.415 0.357 0.337 0.622-0.065 0.217-0.264 0.358-0.479 0.358z' fill='#0000FF'></path><path d='M2.79 9c-0.047 0-0.095-0.007-0.143-0.021-0.265-0.079-0.415-0.357-0.337-0.622 0.353-1.187 1.006-2.28 1.886-3.161s1.973-1.533 3.161-1.886c0.265-0.079 0.543 0.072 0.622 0.337s-0.072 0.543-0.337 0.622c-2.11 0.628-3.745 2.263-4.373 4.374-0.065 0.217-0.264 0.358-0.479 0.358z' fill='#0000FF'></path></g></svg>"
    
            return target
        
  }

  const handleGetEditDetails = () => {
    
            const {personId, workSummary, includeHistory, getEditDetails} = props
            getEditDetails(personId, workSummary.workId, workSummary.chapterId_current, workSummary.languageId_current, includeHistory)
        
  }

  const findBeginOrEnd = (elementId) => {
    
            if (elementId.indexOf('Begin') > -1) {
                return 'Begin'
            } else if (elementId.indexOf('End') > -1) {
                return 'End'
            } else {
                return ''
            }
        
  }

  const handleRemoveEvent = () => {
    
            setSpansEvent('click', () => {})
            setSpansEvent('keyup', () => {})
            setSpansEvent('keydown', () => {})
            setSpansEvent('blur', () => {})
            setSpansEvent('mouseup', () => {})
        
  }

  const handleAddEvent = () => {
    
            setSpansEvent('keyup', checkForKeypress); //This keyup event is always added and not taken a way between mode changes.  This however is for the use of the bookmark tool in order to add a bookmark name.
            //setSpansEvent('keydown', checkForEnterKeypress);
            setSentenceClickFunction(props.editReview.modeChosen)
        
  }

  const handleSentenceChosen = (hrefId, skipScrollTo=false) => {
    
            const {setSentenceChosen} = props
            
            hrefId = writerHrefId(hrefId)
            let sentenceHrefId = hrefId.substring(hrefId.indexOf('~'))
            revertEditBackgroundColorByPendingOrNot(standardHrefId(currentHrefId))
            let elementFound = document.getElementById(sentenceHrefId)
            if (elementFound) {
                !skipScrollTo && editorDivScrollTo(elementFound)
                setCurrentHrefId(elementFound.id); setCurrentSentence(elementFound.innerHTML)
                if (hrefId.indexOf('breakNew') > -1 || hrefId.indexOf('breakDelete') > -1) {
                    highlightSentence(hrefId)
                } else {
                    highlightSentence(sentenceHrefId)
                }
            }
            handleEditChosen(hrefId)
            setSentenceChosen(sentenceHrefId)
        
  }

  const handleAcceptEditDetail = (personId, workId, workSummary, acceptedEditDetailId, isAuthorAcceptedEdit) => {
    
            const {setAcceptedEdit} = props
            
            let editDetailId = acceptedEditDetailId ? acceptedEditDetailId : currentHrefId && currentHrefId.substring(currentHrefId.indexOf('^^!') + 3)
            handleWorkspaceEditAccept(editDetailId)
            // let moveSentence = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === acceptedEditDetailId)[0];
            // if (moveSentence) {
            //     handleCleanMoveEditDetail(personId, acceptedEditDetailId); //Clean out the svg-s before the moves are done, otherwise there is svg details to work around which causes errors.
            //     document.getElementById('editorDiv').innerHTML = serviceEditReview.setMovedTextIntoPlace(document.getElementById('editorDiv').innerHTML, moveSentence);
            // }
            setAcceptedEdit(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, editDetailId, isAuthorAcceptedEdit)
            handleEditChosen(''); //Blank out the edit chosen now that the edit is gone.
        
  }

  const handleDeleteEditDetail = (editDetailId) => {
    
            const {personId, deleteEditDetail, editDetails, editReview, setEditorTabChosen} = props
            
            handleCleanMoveEditDetail(personId, editDetailId)
            //It is possible that the editReview.editCounts.editDetailId did not return an editDetailId.  This is a catch below to pick it up in case it didn't make it.
            let catchEditDetailId = ''
            if (!editDetailId) catchEditDetailId = editDetails.filter(m => m.editTypeName === editReview.modeChosen && m.hrefId === currentHrefId && !m.isComment)[0].editDetailId
            deleteEditDetail(personId, editDetailId || catchEditDetailId)
            if (editReview.modeChosen === 'edit') {
                let findEditDetail = editDetails.filter(m => m.editDetailId === editDetailId)
                let previousOriginalText = findEditDetail && findEditDetail.length > 0 ? findEditDetail[0].authorText : false
                let hrefId = findEditDetail && findEditDetail.length > 0 ? findEditDetail[0].hrefId : false
                if (previousOriginalText && hrefId) {
                    document.getElementById(hrefId).innerHTML = previousOriginalText
                }
            }
            //If the editor does not have any more edits, their tab will disappear.  Set the tab to the currently entered person in that case.
            let editorEditCount = editDetails && editDetails.length > 0
                && editDetails.filter(m => m.personId === editReview.editorTabChosen && m.editTypeName === editReview.modeChosen && m.editDetailId !== editDetailId)
            if (!editorEditCount || editorEditCount.length === 0) {
                setEditorTabChosen(personId)
            }
        
  }

  const handleCleanMoveEditDetail = (personId, editDetailId) => {
    
            const {editDetails} = props
            let cleanSentenceMove = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId && m.editTypeName === 'sentenceMove')[0]
            if (cleanSentenceMove) {
                if (cleanSentenceMove.hrefId)  {
                    document.getElementById(cleanSentenceMove.hrefId).style.backgroundColor = ''
                    document.getElementById(cleanSentenceMove.hrefId).style.color = 'black'
                }
                if (cleanSentenceMove && cleanSentenceMove.moveArrayHrefId && cleanSentenceMove.moveArrayHrefId.length > 0) {
                    for(let i = 0; i < cleanSentenceMove.moveArrayHrefId.length; i++) {
                        document.getElementById(cleanSentenceMove.moveArrayHrefId[i]).style.backgroundColor = ''
                        document.getElementById(cleanSentenceMove.moveArrayHrefId[i]).style.color = 'black'
                    }
                    if (document.getElementById('target'+cleanSentenceMove.hrefId)) document.getElementById('target'+cleanSentenceMove.hrefId).parentNode.removeChild(document.getElementById('target'+cleanSentenceMove.hrefId))
                    if (document.getElementById('moveBegin'+cleanSentenceMove.hrefId)) document.getElementById('moveBegin'+cleanSentenceMove.hrefId).parentNode.removeChild(document.getElementById('moveBegin'+cleanSentenceMove.hrefId))
                    if (document.getElementById('moveEnd'+cleanSentenceMove.hrefId)) document.getElementById('moveEnd'+cleanSentenceMove.hrefId).parentNode.removeChild(document.getElementById('moveEnd'+cleanSentenceMove.hrefId))
                }
            }
        
  }

  const editorDivScrollTo = (element: Element | null, minus=170) => {
    
            // //const duration = 500;
            // let topPos = element && element.offsetTop;
            // topPos -= minus;
            // topPos = topPos < 0 ? 0 : topPos;
            element?.scrollIntoView()
            //node.scrollTop = topPos;
            //document.getElementById('editorDiv').scrollTop = topPos;
    
            //https://stackoverflow.com/questions/25020582/scrolling-to-an-anchor-using-transition-css3
            //This is intended for a smooth transition, but it didn't work right off.  So I'm leaving this for later when we can get someone else's help on it.
            // if (document.getElementById('editorDiv').scrollTop === topPos) return;
            // let diff = topPos - document.getElementById('editorDiv').scrollTop;
            // let scrollStep = Math.PI / (duration / 10);
            // let count = 0, currPos;
            // let start = element.scrollTop;
            // let scrollInterval = setInterval(function(){
            //     if (document.getElementById('editorDiv').scrollTop !== topPos) {
            //         count++;
            //         currPos = start + diff * (0.5 - 0.5 * Math.cos(count * scrollStep));
            //         document.getElementById('editorDiv').scrollTop = currPos;
            //     }
            //     else { clearInterval(scrollInterval); }
            // },10);
        
  }

  const deleteEditStepRecords = () => {
    
            
            //These two removals include the newBreka, deleteBreak and part of the moveSentence removal, as well.
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
    
            if (newBreak && newBreak.hrefId) revertEditBackgroundColorByPendingOrNot(newBreak.hrefId)
            if (deleteBreak && deleteBreak.hrefId) revertEditBackgroundColorByPendingOrNot(deleteBreak.hrefId)
            if (moveSentence && moveSentence.hrefId) revertEditBackgroundColorByPendingOrNot(moveSentence.hrefId)
            if (newImage && newImage.hrefId) revertEditBackgroundColorByPendingOrNot(newImage.hrefId)
    
            if (moveSentence && moveSentence.moveArrayHrefId && moveSentence.moveArrayHrefId.length > 0) {
                if (document.getElementById('target'+moveSentence.hrefId)) document.getElementById('target'+moveSentence.hrefId).parentNode.removeChild(document.getElementById('target'+moveSentence.hrefId))
                if (document.getElementById('target'+moveSentence.position+moveSentence.hrefId)) document.getElementById('target'+moveSentence.position+moveSentence.hrefId).parentNode.removeChild(document.getElementById('target'+moveSentence.position+moveSentence.hrefId))
                if (document.getElementById('moveBegin'+moveSentence.hrefId)) document.getElementById('moveBegin'+moveSentence.hrefId).parentNode.removeChild(document.getElementById('moveBegin'+moveSentence.hrefId))
                if (document.getElementById('moveEnd'+moveSentence.hrefId)) document.getElementById('moveEnd'+moveSentence.hrefId).parentNode.removeChild(document.getElementById('moveEnd'+moveSentence.hrefId))
                for(let i = 0; i < moveSentence.moveArrayHrefId.length; i++) revertEditBackgroundColorByPendingOrNot(moveSentence.moveArrayHrefId[i])
            }
            //This needs to come last so the sentences have a chance to return back to their background color, depending on if there is an edit fount there or not.
            setNewBreak({ hrefId: '', position: '' }); setDeleteBreak({hrefId: '', position: '' }); setMoveSentence({hrefId: '', moveArrayHrefId: '', position: '', stepCount: 0 }); setNewImage({hrefId: '', position: '' }); setShowInstructions(false)
        
  }

  const setAddInstructions = (setBool) => {
    
            if (setBool === false) {
                deleteEditStepRecords()
                handleEditModeChosen('edit')
            }
            setShowInstructions(setBool)
        
  }

  const handleEditModeChosen = (choice, event) => {
    
            const {editReview, updateAuthorWorkspace, isAuthor, personId, workId, workSummary, leftSidePanelOpen, toggleLeftSidePanelOpen} = props
            highlightSentence(currentHrefId, '', true)
            leftSidePanelOpen && toggleLeftSidePanelOpen()
    
            if (choice === 'edit') {
                setShowInstructions(false)
                //setSentenceClickFunction('edit');
            } else if (isAuthor) {
                	updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
            }
            deleteEditStepRecords(); //Reset all of the records if the editMode changes.
            if (editReview.modeChosen !== choice) {
                props.setModeChosen(choice)
                setSentenceClickFunction(choice)
            }
        
  }

  const avoidCopyPaste = (e) => {
    
            e.preventDefault()
            e.returnValue = false
            handleCutPasteMessageOpen()
        
  }

  const setCursorAtBeginningIfInit = () => {
    
    				if (document.getElementById('editorDiv').innerHTML === `<div style="color: silver">Start writing here...</div>`) {
    						let el = document.getElementById("editorDiv")
    						let range = document.createRange()
    						let sel = window.getSelection()
    						range.setStart(el.childNodes[0].childNodes[0], 0)
    						range.collapse(true)
    						sel.removeAllRanges()
    						sel.addRange(range)
    				}
    				setSavedCursorPosition()
    		
  }

  const checkInitialPromptText = (evt) => {
    
    				//const {isAuthor} = props;
    				if (document.getElementById('editorDiv').innerHTML === `<div style="color: silver">Start writing here...</div>`) {
    						document.getElementById('editorDiv').innerHTML = document.getElementById('editorDiv').innerHTML.replace(`<div style="color: silver">Start writing here...</div>`, ``)
    				}
            document.getElementById('editorDiv').removeEventListener('keydown', checkInitialPromptText)
    				// if (isAuthor && evt.key === 'Tab') {
    				// 		evt.preventDefault();  // this will prevent us from tabbing out of the editor
    		    //      const editor = document.getElementById("editorDiv");
    		    //      const doc = editor.ownerDocument.defaultView;
    		    //      let sel = doc.getSelection();
    		    //      let range = sel.getRangeAt(0);
    				// 		 let tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0");
    		    //      //const tabNode = document.createTextNode("\u0009");
    		    //      range.insertNode(tabNode);
    		    //      range.setStartAfter(tabNode);
    		    //      range.setEndAfter(tabNode);
    		    //      sel.removeAllRanges();
    		    //      sel.addRange(range);
    				//  }
    				//  setSavedCursorPosition();
        
  }

  const checkEscapeKeyAndAutoSave = (evt) => {
    
    				const {isAuthor, leftSidePanelOpen, toggleLeftSidePanelOpen} = props
            if (evt.key === 'Escape') {
                leftSidePanelOpen && toggleLeftSidePanelOpen()
                hideContextEditReviewMenu()
            }
    				if (isAuthor) {
    						handleSaveAuthorWorkspace(evt.key === 'Enter' || evt.key === '' || !evt.key)
    						//setSavedCursorPosition();  This happens in handleSaveAuthorWorkspace if it is not skipUpdate = true
    				}
            if (evt.key === 's' && evt.ctrlKey) {
                evt && evt.stopPropagation()
                evt && evt.preventDefault()
                saveByButtonPress()
                evt && evt.stopPropagation()
                evt && evt.preventDefault()
            }
        
  }

  const hideContextEditReviewMenu = () => {
    
            if(document.getElementById('contextEditReview')) document.getElementById('contextEditReview').style.display = 'none'
        
  }

  const handleTextSelectionChange = (event) => {
    
            // const {editReview} = props;
            // 
            // savedCursorPosition = saveSelection(document.getElementById('editorDiv'), editReview.sentenceChosen);
            // if (savedCursorPosition.isHrefIdChange) {
            //     sentenceClick(null, savedCursorPosition.newElement);
            // }
        
  }

  const handleProgressClose = () => {
    
            const {setBlankTextProcessingProgress, personId} = props
            setIsShowingProgress(false)
            clearInterval(timerId_progress)
            setBlankTextProcessingProgress(personId)
        
  }

  const handleProgressOpen = () => {
    
            const {getTextProcessingProgress, personId} = props
            setIsShowingProgress(true); setTimerId_progress(setInterval(() => getTextProcessingProgress(personId), 1000))
        
  }

  const handleImageEntryProgressOpen = () => {
    return setIsShowingProgress_imageEntry(true)
  }

  const handleImageEntryProgressClose = () => {
    return setIsShowingProgress_imageEntry(false)
  }

  const getSelectionContainerElement = () => {
    
            let range, sel, container
            if (document.selection && document.selection.createRange) {
                // IE case
                range = document.selection.createRange()
                return range.parentElement()
            } else if (window.getSelection) {
                sel = window.getSelection()
                if (sel.getRangeAt) {
                    if (sel.rangeCount > 0) {
                        range = sel.getRangeAt(0)
                    }
                } else {
                    // Old WebKit selection object has no getRangeAt, so
                    // create a range from other selection properties
                    range = document.createRange()
                    range.setStart(sel.anchorNode, sel.anchorOffset)
                    range.setEnd(sel.focusNode, sel.focusOffset)
    
                    // Handle the case when the selection was selected backwards (from the end to the start in the document)
                    if (range.collapsed !== sel.isCollapsed) {
                        range.setStart(sel.focusNode, sel.focusOffset)
                        range.setEnd(sel.anchorNode, sel.anchorOffset)
                    }
                }
    
                if (range) {
                   container = range.commonAncestorContainer
    
                   // Check if the container is a text node and return its parent if so
                   return container.nodeType === 3 ? container.parentNode : container
                }
            }
        
  }

  const checkForEnterKeypress = (evt) => {
    
            //The author should be able to use the Enter key on their own tab.
            const {isEditor} = props
            
            savedCursorPosition = saveSelection(document.getElementById('editorDiv'))
            if (evt.key === 'Enter' && isEditor) {
                evt && evt.stopPropagation()
                evt && evt.preventDefault()
                return false
            }
        
  }

  const checkForKeypress = (evt) => {
    
            const {editReview, isEditor, isAuthor} = props
             //restoreSelection
    
            if (editReview.modeChosen === 'edit' &&
                    (evt.key === 'ArrowUp'
                    || evt.key === 'ArrowDown'
                    || evt.key === 'ArrowLeft'
                    || evt.key === 'ArrowRight'
                    || evt.key === 'End'
                    || evt.key === 'Home'
                    || (evt.key === 'Backspace' && isEditor)
                    || (evt.key === 'Delete' && isEditor)
                    || evt.key === 'PageUp'
                    || evt.key === 'PageDown')) {
                let newElement = checkEventForValidHrefId(null, null, getSelectionContainerElement())
                //if (!savedCursorPosition) savedCursorPosition = saveSelection(document.getElementById('editorDiv'), newElement && newElement.id);
                if (newElement && newElement.id && newElement.nodeName === "SPAN") {
                    if (newElement && savedCursorPosition && (savedCursorPosition.isHrefIdChange || !savedCursorPosition.isHrefIdChange)) { //The ! statement handles the situation when the user starts and there isn't a sentence chosen yet.
                        if (isEditor) {
                            sentenceClick(null, newElement)
                        }
                    }
                    if (isAuthor && editReview.modeChosen === 'edit') {
                        savedCursorPosition = saveSelection(document.getElementById('editorDiv'), newElement && newElement.id)
                        sentenceClick(null, newElement)
                        //20020306 document.getElementById('editorDiv').focus();
                        //20020306 restoreSelection(document.getElementById('editorDiv'), savedCursorPosition);
                    }
                }
            } else if (isAuthor && editReview.modeChosen === 'edit') {
                //sentenceClick(null);
            }
            //This is a problem here since it is refreshing the state and the cursor is lost when the author is logged in.
            //document.getElementById(writerHrefId(currentHrefId)) && setCurrentSentence(document.getElementById(writerHrefId(currentHrefId)).innerHTML);
    
            if (isAuthor) {
                savedCursorPosition = saveSelection(document.getElementById('editorDiv'), currentHrefId)
                handleSaveAuthorWorkspace();  //This is controlled by lodash's debounce so that it really only gets launched every few seconds and not on every change.
            }
    
            if (evt.key === 'Escape') {
                props.leftSidePanelOpen && props.toggleLeftSidePanelOpen()
                hideContextEditReviewMenu()
            }
        
  }

  const saveByButtonPress = () => {
    
    				const {updateAuthorWorkspace, personId, workId, workSummary} = props
    				handleAuthorProcessText() //This was put in as we did away with the "commit changes" button which we will probably use again for a feature called personConfig.authorWorkspaceOn
            let authorWorkspace = document.getElementById('editorDiv')
            let svgs = authorWorkspace.querySelectorAll('[id^=target]')
            for(let i = 0; i < svgs.length; i++) {
                if (svgs[i]) {
                    svgs[i].parentNode.removeChild(svgs[i])
                }
            }
            updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, authorWorkspace.innerHTML)
            setSaveWorkSpaceTime(new Date())
    		
  }

  const handleAuthorProcessText = () => {
    
            const {personId, authorPersonId, authorWorkspace, workId, workSummary, updateContent, personConfig, isAuthor} = props
    				
            if (isAuthor) {
                let chapterTextSend = document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML
                if (authorWorkspace !== chapterTextSend) {
                    deleteEditStepRecords()
                    cleanSVGs("target")
                    //remove the background style of any hrefId's (notice the left-side hrefId type: ~^)
                    let hrefSpans = document.querySelectorAll('[id^="~^"]')
                    for(let i = 0; i < hrefSpans.length; i++) {
                        if (hrefSpans && hrefSpans[i]) {
                            hrefSpans[i].style.backgroundColor = ''
                            hrefSpans[i].style.color = ''
                        }
                    }
                    //The hrefId type gets changed back to standard in updateContent before it gets sent off, ~!
                    updateContent(personId, authorPersonId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv') ? document.getElementById('editorDiv').innerHTML : '', personConfig.historySentenceView, true); //true is trackFetch
                }
    						document.getElementById('editorDiv').focus()
    						restoreSelection(document.getElementById('editorDiv'), savedCursorPosition)
            }
        
  }

  const cleanSVGs = (prefix) => {
    
            //Be aware that the icons are generally svg's, but the
            let svgs = document.querySelectorAll('[id^=' + prefix + ']')
            for(let i = 0; i < svgs.length; i++) {
                if (svgs[i]) {
                    svgs[i].parentNode.removeChild(svgs[i])
                }
            }
        
  }

  const jumpToEdit = (strNextOrPrev) => {
    
            const {editDetails, editReview} = props
            let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN')
            let reachedCurrentHrefId = false
            let indexCount = strNextOrPrev === "NEXT" ? 0 : spans.length
            function indexCheck(indexValue) {
                return  strNextOrPrev === "NEXT" ? indexValue < spans.length : indexValue > 0
            }
    
            let nextPointer = pointerEditText
            let totalCount = editDetails && editDetails.length > 0 && editDetails.filter(m => m.personId === editReview.editorTabChosen).length
            if (strNextOrPrev === "PREV") {
                nextPointer -= 1
                nextPointer = nextPointer < 0 ? 0 : nextPointer
            } else if (strNextOrPrev === "NEXT") {
                nextPointer += 1
                nextPointer = nextPointer > totalCount-1 ? totalCount-1 : nextPointer
            }
            if (pointerEditHrefId === '') {
    
            }
            setPointerEditText(nextPointer)
    
            for(indexCount; indexCheck(indexCount); strNextOrPrev === "NEXT" ? indexCount++ : indexCount--) {
                if (spans[indexCount] && String(spans[indexCount].id).indexOf('~!') > -1
                        && (!currentHrefId || reachedCurrentHrefId || (currentHrefId === spans[indexCount].id))) {
    
                    reachedCurrentHrefId = true
                    if (currentHrefId === spans[indexCount].id) continue; //Go one more to get past this one before looking for the next in the code below.
    
                    if (spans[indexCount].style.backgroundColor) {
                        //document.getElementById(spans[indexCount].id).focus();
                        revertEditBackgroundColorByPendingOrNot(currentHrefId);  //Set the previous one back to its edit background color instead of yellow highlighted
                        highlightSentence(spans[indexCount].id)
                        editorDivScrollTo(document.getElementById(spans[indexCount].id))
                        handleSentenceChosen(currentHrefId)
                        break
                    }
                }
            }
        
  }

  const saveEditOrComment = (hrefId) => {
    return (authorSentence) => (isComment) => (editText) => (acceptedEditDetailId, isAuthorAcceptedEdit) => {
            const {updateAuthorWorkspace, personId, workId, workSummary, setEditDetail, setAcceptedEdit, originalSentence, editReview, draftComparison} = props
  }

  const handleWorkspaceEditAccept = (editDetailId) => {
    
            const {editDetails, updateAuthorWorkspace, personId, workId, workSummary, editorColors} = props
            let edit = (editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]) || []
            if (!!edit) {
                if (edit.editTypeName === 'edit' && document.getElementById(writerHrefId(edit.hrefId))) {
                    highlightSentence(writerHrefId(edit.hrefId), colorCurrentFocus, true); //Blank out the highlight. //true is for writerSide hrefId type.
                    if (!edit.isComment) {
                       document.getElementById(writerHrefId(edit.hrefId)).innerHTML = edit.editText
                       handleSaveAuthorWorkspace()
                    }
                } else if (edit.editTypeName === 'breakNew') {
                    let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html")
                    htmlDoc = serviceEditReview.breakNewAuthorWorkspace(htmlDoc, writerHrefId(edit.hrefId), edit.position, editorColors)
                    document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML
                    highlightSentence(writerHrefId(edit.hrefId), '', true); //Blank out the highlight. //true is for writerSide hrefId type.
                    updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
                } else if (edit.editTypeName === 'breakDelete') {
                    let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html")
                    htmlDoc = serviceEditReview.breakDeleteAuthorWorkspace(htmlDoc, writerHrefId(edit.hrefId), edit.position, editorColors)
                    document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML
                    highlightSentence(writerHrefId(edit.hrefId), '', true); //Blank out the highlight. //true is for writerSide hrefId type.
                    updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
                } if (edit.editTypeName === 'sentenceMove') {
                    let htmlBody = document.getElementById('editorDiv').innerHTML
                    let moveArrayHrefId = (edit.moveArrayHrefId && edit.moveArrayHrefId.length > 0) ? edit.moveArrayHrefId.map(m => m.replace(/\~\!/g, '~^')) : []; //eslint-disable-line
                    htmlBody = serviceEditReview.sentenceMoveAuthorWorkspace(htmlBody, {hrefId: writerHrefId(edit.hrefId), moveArrayHrefId, position: edit.position})
                    document.getElementById('editorDiv').innerHTML = htmlBody
                    updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
                } if (edit.editTypeName === 'imageNew') {
                    let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html")
                    htmlDoc = serviceEditReview.imageNewAuthorWorkspace(htmlDoc, writerHrefId(edit.hrefId), edit.position, edit.htmlImage64)
                    document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML
                    updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
                }
            }
        
  }

  const restoreEditOrComment = (editDetailId) => {
    
            const {restoreEditDetail, personId, editDetails} = props
    
            let thisEdit = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
            if (thisEdit) {
                if (!thisEdit.isComment) {
                    document.getElementById("~!" + thisEdit.hrefId).innerHTML = thisEdit.authorText
                    setCurrentSentence(thisEdit.authorText)
                }
                restoreEditDetail(personId, editDetailId)
            }
        
  }

  const handleEditVote = (editDetailId, voteType, originatorPersonId, trollEditText, voterComment, isComment, isParagraph) => {
    
            const { personId, workSummary, setEditVote } = props
            //isParagraph won't be used, I'm sure.  The EditDetail record handles sentence edits, new paragraph, delete paragraph and move sentence(s).
            setEditVote(personId, workSummary.chapterId_current, workSummary.languageId_current, editDetailId, voteType, trollEditText, voterComment, isComment)
        
  }

  const setNextHrefId = (isPrevious) => {
    
            //This will be used the the left side-over panel in order to go to the next sentence automatically without closing and opening again.
            //1. Find the next HrefId by taking the currentHrefId (which is really the current HrefId) and loop through the editorDiv.
            //2. Get the original sentence
            //3. Get the editDetailsByHrefId
            //4. Set the highlight on the sentence.
            //e.preventDefault();
            let {toggleLeftSidePanelOpen, setVisitedHrefId, personId, workSummary, workId, isTranslation, getTranslation} = props
            let {currentHrefId} = state
            let newHrefId = ""
    
            let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN')
            let reachedCurrentHrefId = false
            let pointerHrefId = currentHrefId;  // eslint-disable-line
    
            //This loop would be easier if we were just getting the next HrefId, but the arrangement must also handle the previous.
            for(let i = 0; i < spans.length; i++) {
                if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0
                        && document.getElementById(spans[i].id).innerHTML !== ""
                        && document.getElementById(spans[i].id).innerHTML.replace(/<br>/g, "").replace(/&nbsp;/g, "").replace(/ /g, "") !== ""
                        && document.getElementById(spans[i].id).innerText !== "") {
                    if (reachedCurrentHrefId || (currentHrefId === spans[i].id)) {
                        if (isPrevious === "PREV") {
                            newHrefId = pointerHrefId
                        } else {
                            reachedCurrentHrefId = true
                            if (currentHrefId === spans[i].id) continue; //Go one more to get past this one before looking for the next in the code below.
                            newHrefId = spans[i].id
                        }
                        editorDivScrollTo(document.getElementById(newHrefId))
                        break
                    }
                    pointerHrefId = spans[i].id; //This is to be used in the case of isPreviouis is set to "PREV"
                }
            }
            //When it comes to the last sentence then the currentHrefId will equal the newHrefId, so close the left panel.
            //Give a message that the user has come to the end?
            if (newHrefId && standardHrefId(currentHrefId) !== standardHrefId(newHrefId)) {
                isTranslation && getTranslation(personId, workId, workSummary.languageId_current, newHrefId, workSummary.chapterId_current, document.getElementById(newHrefId).innerText)
                handleSentenceChosen(newHrefId)
                setVisitedHrefId(workId, newHrefId, document.getElementById(newHrefId).innerHTML)
            } else {
                toggleLeftSidePanelOpen()
                handleEndOfDocumentOpen()
            }
        
  }

  const checkEventForValidHrefId = (e, searchParam, element=null) => {
     //If e is null, then we will fallback on element (which comes from sentenceClick so far).
            if (e) element = e.target
            let searchText = searchParam ? searchParam : '~'
            //if (props.leftSidePanelOpen) return;  //HELP here...put this back.
            let count = 0
            while (element && (element.nodeName === "SPAN" || element.nodeName === "svg") && (!element.id || element.id.indexOf(searchText) !== 0) && count < 10) {
                element = element.parentNode
                count++
            }
            if (element && !(element.id && element.id.indexOf(searchText) === 0)) {
                element = element.nearestViewportElement
                while (element && (element.nodeName === "SPAN" || element.nodeName === "svg") && (!element.id || element.id.indexOf(searchText) !== 0) && count < 10) {
                    element = element.parentNode
                    count++
                }
            }
            return element && (element.nodeName === "SPAN" || element.nodeName === "svg") && element.id && element.id.indexOf(searchText) === 0 ? element : null
        
  }

  const jumpToBreakNew = (beginOrEnd, evt, hrefIdIncoming) => {
    
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
            decreaseAllIconOpacity(hrefIdIncoming)
            props.setIconPosition(beginOrEnd)
            let skipScrollTo = true
            handleSentenceChosen(hrefIdIncoming, skipScrollTo)
            handleEditModeChosen('breakNew')
            document.getElementById(hrefIdIncoming).style.opacity = 1
            if (document.getElementById('breakNew' + beginOrEnd + hrefIdIncoming)) document.getElementById('breakNew' + beginOrEnd + hrefIdIncoming).style.opacity = 1
            sentenceClick(null, document.getElementById(hrefIdIncoming))
            highlightSentence(hrefIdIncoming)
        
  }

  const jumpToBreakDelete = (beginOrEnd, evt, hrefIdIncoming) => {
    
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
            decreaseAllIconOpacity(hrefIdIncoming)
            props.setIconPosition(beginOrEnd)
            let skipScrollTo = true
            handleSentenceChosen(hrefIdIncoming, skipScrollTo)
            handleEditModeChosen('breakDelete')
            document.getElementById(hrefIdIncoming).style.opacity = 1
            if (document.getElementById('breakDelete' + beginOrEnd + hrefIdIncoming)) document.getElementById('breakDelete' + beginOrEnd + hrefIdIncoming).style.opacity = 1
            sentenceClick(null, document.getElementById(hrefIdIncoming))
            highlightSentence(hrefIdIncoming)
        
  }

  const jumpToMoveBegin = (elementIdOrEvent, prefix="") => {
    
            const {editDetails} = props;  //, personId, editReview
            //if elementId is null or is an object...?
            let elementId = ''; //The different between hrefId and elementId is that the elementId is the moveBegin~!<number> and the hrefId is the ~!<number>
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
            if (!elementIdOrEvent) return
            if (elementIdOrEvent !== null && typeof elementIdOrEvent === 'object') {
                elementId = elementIdOrEvent.currentTarget.id
                elementIdOrEvent && elementIdOrEvent.stopPropagation()
                elementIdOrEvent && elementIdOrEvent.preventDefault()
            } else {
                elementId = elementIdOrEvent
            }
            if (elementId.indexOf('~!') === -1) return
            let sendBeginOrEnd = prefix ? prefix : elementId
            props.setIconPosition(findBeginOrEnd(sendBeginOrEnd))
            let hrefId = elementId && elementId.substring(elementId.indexOf('~!'))
            if (hrefId) {
                moveSentenceChangeStyle(hrefId, sendBeginOrEnd)
                //Fscroll to the move Begin icon
                let moveSentenceDetail = editDetails && editDetails.length > 0
                    && editDetails.filter(m => m.hrefId === hrefId && m.editTypeName === 'sentenceMove')[0]
    
                if (moveSentenceDetail && moveSentenceDetail.moveArrayHrefId[0]) {
                    editorDivScrollTo(document.getElementById(moveSentenceDetail.moveArrayHrefId[0]))
                }
                //handleEditModeChosen('sentenceMove');
                let skipScrollTo = true
                handleSentenceChosen(hrefId, skipScrollTo)
            }
        
  }

  const jumpToTarget = (elementIdOrEvent, beginOrEnd) => {
    
            props.setIconPosition(beginOrEnd)
            let elementId = ''; //The different between hrefId and elementId is that the elementId is the moveBegin~!<number> and the hrefId is the ~!<number>
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
            if (!elementIdOrEvent) return
            if (elementIdOrEvent !== null && typeof elementIdOrEvent === 'object') {
                elementId = elementIdOrEvent.currentTarget.id
            } else {
                elementId = elementIdOrEvent
            }
            if (elementId.indexOf('~!') === -1) return
            let hrefId = elementId && elementId.substring(elementId.indexOf('~!'))
            moveSentenceChangeStyle(hrefId, beginOrEnd)
            editorDivScrollTo(document.getElementById(hrefId))
            //handleEditModeChosen('sentenceMove');
            document.getElementById(elementId) && sentenceClick(null, document.getElementById(elementId))
        
  }

  const jumpToImageNew = (beginOrEnd, evt, hrefIdIncoming) => {
    
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
            decreaseAllIconOpacity(hrefIdIncoming)
            props.setIconPosition(beginOrEnd)
            let skipScrollTo = true
            handleSentenceChosen(hrefIdIncoming, skipScrollTo)
            handleEditModeChosen('imageNew')
            document.getElementById(hrefIdIncoming).style.opacity = 1
            if (document.getElementById('imageNew' + beginOrEnd + hrefIdIncoming)) document.getElementById('imageNew' + beginOrEnd + hrefIdIncoming).style.opacity = 1
            sentenceClick(null, document.getElementById(hrefIdIncoming))
            highlightSentence(hrefIdIncoming)
        
  }

  const revertEditBackgroundColorByPendingOrNot = (hrefId) => {
    
            const {editDetails} = props
            hrefId = standardHrefId(hrefId)
    
            if (document.getElementById(writerHrefId(hrefId))) {
                document.getElementById(writerHrefId(hrefId)).style.backgroundColor = ''
                document.getElementById(writerHrefId(hrefId)).style.color = 'black'
            }
    
            if (document.getElementById(hrefId)) {
                if (editDetails && editDetails.length > 0) {
                    if (!!editDetails.filter(p => p.pendingFlag && p.hrefId === hrefId && p.editTypeName === 'edit' && !p.isComment)[0]) {
                        highlightSentence(hrefId, colorEditPending)
                    } else if (!!editDetails.filter(p => !p.pendingFlag && p.hrefId === hrefId && p.editTypeName === 'edit' && !p.isComment)[0]) {
                        highlightSentence(hrefId, colorEditHistory)
                    //We don't color code moved sentences any more.  We just color any sentence that has had text changed.  Not even comments on a sentence will color code a sentence.
                    // } else if (!!editDetails.filter(p => p.pendingFlag && p.moveArrayHrefId.indexOf(hrefId) > -1)[0]) {
                    //     highlightSentence(hrefId, colorMoveSentence);
                    } else {
                        document.getElementById(hrefId).style.backgroundColor = ''
                        document.getElementById(hrefId).style.color = 'black'
                    }
                } else {
                    document.getElementById(hrefId).style.backgroundColor = ''
                    document.getElementById(hrefId).style.color = 'black'
                }
            }
        
  }

  const decreaseAllIconOpacity = (hrefId) => {
    
            const {editDetails, editReview} = props
            let sentenceMoves = editDetails.filter(m => m.editTypeName === 'sentenceMove')
            //This sets the other targets and move icons to grayed out
            if (sentenceMoves && sentenceMoves.length > 0) {
                sentenceMoves.forEach(m => {
                    if (m.hrefId !== hrefId && editReview.modeChosen === 'sentenceMove') {
                        if (document.getElementById('moveBegin' + m.hrefId)) document.getElementById('moveBegin' + m.hrefId).style.opacity = 1
                        if (document.getElementById('moveEnd' + m.hrefId)) document.getElementById('moveEnd' + m.hrefId).style.opacity = 1
                        if (document.getElementById('targetBegin' + m.hrefId)) document.getElementById('targetBegin' + m.hrefId).style.opacity = 1
                        if (document.getElementById('targetEnd' + m.hrefId)) document.getElementById('targetEnd' + m.hrefId).style.opacity = 1
                    }
                })
            }
    
            let breakNews = editDetails.filter(m => m.editTypeName === 'breakNew')
            //This sets the other targets and move icons to grayed out
            if (breakNews && breakNews.length > 0) {
                breakNews.forEach(m => {
                    if (m.hrefId !== hrefId && editReview.modeChosen === 'breakNew') {
                        if (document.getElementById('breakNewBegin' + m.hrefId)) document.getElementById('breakNewBegin' + m.hrefId).style.opacity = 1
                        if (document.getElementById('breakNewEnd' + m.hrefId)) document.getElementById('breakNewEnd' + m.hrefId).style.opacity = 1
                    }
                })
            }
    
            let breakDeletes = editDetails.filter(m => m.editTypeName === 'breakDelete')
            //This sets the other targets and move icons to grayed out
            if (breakDeletes && breakDeletes.length > 0) {
                breakDeletes.forEach(m => {
                    if (m.hrefId !== hrefId && editReview.modeChosen === 'breakDelete') {
                        if (document.getElementById('breakDeleteBegin' + m.hrefId)) document.getElementById('breakDeleteBegin' + m.hrefId).style.opacity = 1
                        if (document.getElementById('breakDeleteEnd' + m.hrefId)) document.getElementById('breakDeleteEnd' + m.hrefId).style.opacity = 1
                    }
                })
            }
    
            let imageNews = editDetails.filter(m => m.editTypeName === 'imageNew')
            //This sets the other targets and move icons to grayed out
            if (imageNews && imageNews.length > 0) {
                imageNews.forEach(m => {
                    if (m.hrefId !== hrefId && editReview.modeChosen === 'imageNew') {
                        if (document.getElementById('imageNewBegin' + m.hrefId)) document.getElementById('imageNewBegin' + m.hrefId).style.opacity = 1
                        if (document.getElementById('imageNewEnd' + m.hrefId)) document.getElementById('imageNewEnd' + m.hrefId).style.opacity = 1
                    }
                })
            }
        
  }

  const moveSentenceChangeStyle = (hrefId, beginOrEnd) => {
    
            decreaseAllIconOpacity(hrefId)
            if (document.getElementById('target' + beginOrEnd + hrefId)) document.getElementById('target' + beginOrEnd + hrefId).style.opacity = 1
            if (document.getElementById('moveBegin' + hrefId)) document.getElementById('moveBegin' + hrefId).style.opacity = 1
            if (document.getElementById('moveEnd' + hrefId)) document.getElementById('moveEnd' + hrefId).style.opacity = 1
        
  }

  const isMoveSentenceUsedAlready = (elementId) => {
    
            //Check both the editDetail records for this person as well as the current sentenceMove record
            const {personId, editDetails} = props
            
            //It's okay to use the same sentence in the first steps where the moved sentence range is chosen since a second click on the starting sentence means that there is just the one sentence that needs to move.
            if (moveSentence.stepCount >= 3 && (moveSentence.hrefId === elementId || moveSentence.moveArrayHrefId.indexOf(elementId) > -1)) return true
            let isATarget = editDetails && editDetails.length > 0 && editDetails.filter(m => m.personId === personId && m.editTypeName === 'sentenceMove' && m.hrefId === elementId)[0]
            if (isATarget && isATarget.length > 0) return true
            let isInMoveArray = editDetails && editDetails.length > 0 && editDetails.filter(m => m.personId === personId && m.editTypeName === 'sentenceMove' && m.moveArrayHrefId.indexOf(elementId) > -1)[0]
            if (isInMoveArray && isInMoveArray.length > 0) return true
            return false
        
  }

  const textNewLastStep = (position, evt) => {
    
            const {setEditDetail, isAuthor, personId, workId, workSummary, leftSidePanelOpen, toggleLeftSidePanelOpen} = props
            
            evt && evt.stopPropagation()
            evt && evt.preventDefault()
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
    
            if (isAuthor) {
                //the author should not have access to this edit type since she can type freely in the editor anyway.
            } else {
                setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, standardHrefId(newText.hrefId), '', false, 'textNew', position)
                !leftSidePanelOpen && toggleLeftSidePanelOpen()
            }
            setNewText({hrefId: '', position: ''}); setShowInstructions(false); //start over since this one is sent in.
            if (newText.hrefId && document.getElementById(newText.hrefId)) {
                let skipScrollTo = true
                handleSentenceChosen(newText.hrefId, skipScrollTo)
            }
        
  }

  const breakNewLastStep = (position, evt) => {
    
            const {updateAuthorWorkspace, setEditDetail, isAuthor, personId, workId, workSummary, editorColors} = props
            
            evt && evt.stopPropagation()
            evt && evt.preventDefault()
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
            handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode
    
            //If the icon already exists, then just let this go without doing anything else.
            if (document.getElementById('breakNew' + position + newBreak.hrefId)) {
                setNewBreak({hrefId: '', position: ''}); setShowInstructions(false); //start over since this one is sent in.
                return
            }
            if (isAuthor) {
                let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html")
                htmlDoc = serviceEditReview.breakNewAuthorWorkspace(htmlDoc, writerHrefId(newBreak.hrefId), position, editorColors)
                document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML
                highlightSentence(writerHrefId(newBreak.hrefId), '', true); //Blank out the highlight. //true is for writerSide hrefId type.
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
            } else {
                setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, standardHrefId(newBreak.hrefId), '', false, 'breakNew', position)
            }
            setNewBreak({hrefId: '', position: ''}); setShowInstructions(false); //start over since this one is sent in.
            if (newBreak.hrefId && document.getElementById(newBreak.hrefId)) {
                let skipScrollTo = true
                handleSentenceChosen(newBreak.hrefId, skipScrollTo)
            }
        
  }

  const breakDeleteLastStep = (position, evt) => {
    
            const {updateAuthorWorkspace, setEditDetail, personId, workId, workSummary, isAuthor, editorColors} = props
            
            evt && evt.stopPropagation()
            evt && evt.preventDefault()
            if (isAuthor) {
                let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html")
                htmlDoc = serviceEditReview.breakDeleteAuthorWorkspace(htmlDoc, writerHrefId(deleteBreak.hrefId), position, editorColors)
                document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML
                highlightSentence(writerHrefId(deleteBreak.hrefId), '', true); //Blank out the highlight. //'' is color, true is writerSide
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
            } else {
                setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, standardHrefId(deleteBreak.hrefId), '', false, 'breakDelete', position)
            }
    
            setDeleteBreak({hrefId: '', position: ''}); setShowInstructions(false); //start over since this one is sent in.
            if (deleteBreak.hrefId && document.getElementById(writerHrefId(deleteBreak.hrefId))) {
                let skipScrollTo = true
                handleSentenceChosen(writerHrefId(deleteBreak.hrefId), skipScrollTo)
            }
            handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode
        
  }

  const imageNewLastStep = (position) => {
    
            const {setEditDetail, isAuthor, personId, workId, workSummary} = props
            
    
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
    
            if (isAuthor) {
                highlightSentence(newImage.hrefId, '', true); //Blank out the highlight. //true is writerSide hrefId type
            } else {
                setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, newImage.hrefId, '', false, 'imageNew', position)
            }
            if (newImage.hrefId && document.getElementById(newImage.hrefId)) {
                handleSentenceChosen(newImage.hrefId)
                handleImageUploadOpen()
            }
            setNewImage({...newImage, position}); setShowInstructions(false)
        
  }

  const textNewClick = (e) => {
    
            
            //if (props.leftSidePanelOpen) return;  //Help to do ... put this back.
    
            if (checkEventForValidHrefId(e, 'targetBegin')) {
                textNewLastStep('Begin')
                return
            } else if (checkEventForValidHrefId(e, 'targetEnd')) {
                textNewLastStep('End')
                return
            }
    
            e && e.stopPropagation()
            e && e.preventDefault()
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
    
            //This is arranged so that if this is a valid HrefId and not a target and if the hrefId for this New Break was already entered but now the hrefId is different,
            //  Then we will let a new sentence be chosen over and over until the user decides to choose a target.
            let element = checkEventForValidHrefId(e)
            if (!element) return
    
            if (element && element.id && element.nodeName === "SPAN") {
                let skipScrollTo = true
                //Delete any targets that might be out there in case the user chose a different sentence after all.
                if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
                if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
    
                handleSentenceChosen(element.id, skipScrollTo)
                if (!newText.hrefId || newText.hrefId !== element.id) {
                    isEditor && highlightSentence(element.id, colorCurrentFocus, true); //true is writerSide hrefid type. ~^
    
                    //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                    //The target needs an onclick event in order to receive the action and set position.
                    let originalNode = document.getElementById(element.id)
                    if (!document.getElementById('textNewBegin' + element.id)) {
                        let targetBegin = document.createRange().createContextualFragment(createTarget('Begin'))
                        targetBegin.onclick = () => textNewLastStep('Begin')
                        originalNode.parentNode.insertBefore(targetBegin.childNodes[0], originalNode)
                    }
                    if (!document.getElementById('textNewEnd' + element.id)) {
                        let targetEnd = document.createRange().createContextualFragment(createTarget('End'))
                        targetEnd.onclick = () => textNewLastStep('End')
                        let nextSibling = originalNode.nextSibling
                        if (nextSibling) {
                            originalNode.parentNode.insertBefore(targetEnd.childNodes[0], nextSibling)
                        } else {
                            originalNode.parentNode.appendChild(targetEnd.childNodes[0])
                        }
                    }
                    setNewBreak({ hrefId: element.id }); setShowInstructions(true)
                }
            }
        
  }

  const breakNewClick = (e) => {
    
            
            //if (props.leftSidePanelOpen) return;  //Help to do ... put this back.
    
            if (checkEventForValidHrefId(e, 'targetBegin')) {
                breakNewLastStep('Begin')
                return
            } else if (checkEventForValidHrefId(e, 'targetEnd')) {
                breakNewLastStep('End')
                return
            }
    
            e && e.stopPropagation()
            e && e.preventDefault()
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
    
            //This is arranged so that if this is a valid HrefId and not a target and if the hrefId for this New Break was already entered but now the hrefId is different,
            //  Then we will let a new sentence be chosen over and over until the user decides to choose a target.
            let element = checkEventForValidHrefId(e)
            if (!element) return
    
            if (element && element.id && element.nodeName === "SPAN") {
                let skipScrollTo = true
                //Delete any targets that might be out there in case the user chose a different sentence after all.
                if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
                if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
    
                handleSentenceChosen(element.id, skipScrollTo)
                if (!newBreak.hrefId || newBreak.hrefId !== element.id) {
                    highlightSentence(element.id, colorCurrentFocus, true); //true is writerSide hrefid type. ~^
    
                    //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                    //The target needs an onclick event in order to receive the action and set position.
                    let originalNode = document.getElementById(element.id)
                    if (!document.getElementById('breakNewBegin' + element.id)) {
                        let targetBegin = document.createRange().createContextualFragment(createTarget('Begin'))
                        targetBegin.onclick = () => breakNewLastStep('Begin')
                        originalNode.parentNode.insertBefore(targetBegin.childNodes[0], originalNode)
                    }
                    if (!document.getElementById('breakNewEnd' + element.id)) {
                        let targetEnd = document.createRange().createContextualFragment(createTarget('End'))
                        targetEnd.onclick = () => breakNewLastStep('End')
                        let nextSibling = originalNode.nextSibling
                        if (nextSibling) {
                            originalNode.parentNode.insertBefore(targetEnd.childNodes[0], nextSibling)
                        } else {
                            originalNode.parentNode.appendChild(targetEnd.childNodes[0])
                        }
                    }
                    setNewBreak({ hrefId: element.id }); setShowInstructions(true)
                }
            }
        
  }

  const breakDeleteClick = (e) => {
    
            
            e && e.preventDefault()
            e && e.stopPropagation()
            //if (props.leftSidePanelOpen) return; //Help to do ... put this back.
            //The first two conditions here are necessary since the click event is not getting changed.  We are already changing the click with addEventListener so often
            //  that we don't want to complicate matters, so we will just detect the last step of choosing the target and take it from there with a return, which I know is a bit ugly.
            let element
            if (checkEventForValidHrefId(e, 'targetBegin')) {
                breakDeleteLastStep('Begin')
                return
            } else if (checkEventForValidHrefId(e, 'targetEnd')) {
                breakDeleteLastStep('End')
                return
            } else {
                element = checkEventForValidHrefId(e)
                if (!element) return
            }
            //Take highlight off of the current sentence if it is the highlight color.
            if (document.getElementById(currentHrefId) && document.getElementById(currentHrefId).style.background === colorCurrentFocus) {
                revertEditBackgroundColorByPendingOrNot(currentHrefId)
            }
    
            if (element && element.id && element.nodeName === "SPAN") {
                if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
                if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
                let skipScrollTo = true
                handleSentenceChosen(element.id, skipScrollTo)
                //Help to do:  We really should be highlighting the entire paragraph and have the targets on the extremes.
                highlightSentence(element.id, colorCurrentFocus, true); //true is LeftSide
                let originalNode = document.getElementById(element.id)
                let spans = originalNode.parentNode.childNodes
                let firstChild
                for(let i = 0; i < spans.length; i++) {
                    if (!firstChild && spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                        firstChild = spans[i]
                        break
                    }
                }
                let lastChild;  //Going backwards from the end to the beginning in order to find the first span that has an hrefId.
                spans = originalNode.parentNode.childNodes
                for(let i = spans.length; i >= 0 ; i--) {
                    if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                        lastChild = spans[i]
                        break
                    }
                }
                //Begin target
                if (!document.getElementById('breakDeleteBegin' + element.id)) {
                    let targetBegin = document.createRange().createContextualFragment(createTarget('Begin'))
                    targetBegin.onclick = () => breakDeleteLastStep('Begin')
                    firstChild.parentNode.insertBefore(targetBegin.firstElementChild, firstChild); //.childNodes[0]
                }
                //End target
                if (!document.getElementById('breakDeleteEnd' + element.id)) {
                    let targetEnd = document.createRange().createContextualFragment(createTarget('End'))
                    targetEnd.onclick =  () => breakDeleteLastStep('End')
                    let nextSibling = lastChild.nextSibling
                    if (nextSibling) {
                        originalNode.parentNode.insertBefore(targetEnd.firstElementChild, nextSibling); //.childNodes[0]
                    } else {
                        originalNode.parentNode.appendChild(targetEnd.firstElementChild); //.childNodes[0]
                    }
                }
                setDeleteBreak({ hrefId: element.id }); setShowInstructions(true)
            }
        
  }

  const sentenceMoveLastStep = (position, event) => {
    
            const {updateAuthorWorkspace, setEditDetail, isAuthor, personId, workId, workSummary} = props
            
            event.stopPropagation()
            event.preventDefault()
            document.getElementById(moveSentence.hrefId).style.backgroundColor = ''; //Clear the highlight of the target sentence.
            document.getElementById(moveSentence.hrefId).style.color = 'black'; //Clear the highlight of the target sentence.
            for(let i = 0; i < moveSentence.moveArrayHrefId.length; i++) {
                document.getElementById(moveSentence.moveArrayHrefId[i]).style.backgroundColor = ''
                document.getElementById(moveSentence.moveArrayHrefId[i]).style.color = 'black'
            }
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
    
            if (isAuthor) {
                let htmlBody = document.getElementById('editorDiv').innerHTML
                htmlBody = serviceEditReview.sentenceMoveAuthorWorkspace(htmlBody, {...moveSentence, position} )
                document.getElementById('editorDiv').innerHTML = htmlBody
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML)
            } else {
                setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, moveSentence.hrefId, '', false, 'sentenceMove', position, moveSentence.moveArrayHrefId)
            }
            let skipScrollTo = true
            handleSentenceChosen(moveSentence.hrefId, skipScrollTo)
            setMoveSentence({hrefId: '', moveArrayHrefId: '', position: '', stepCount: 0}); setShowInstructions(false); //start over since this one is sent in.
            handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode
        
  }

  const sentenceMoveClick = (e) => {
    
            
            e && e.stopPropagation()
            e && e.preventDefault()
            let element
    
            if (checkEventForValidHrefId(e, 'targetBegin')) {
                sentenceMoveLastStep('Begin', e)
                return
            } else if (checkEventForValidHrefId(e, 'targetEnd')) {
                sentenceMoveLastStep('End', e)
                return
            } else {
                element = checkEventForValidHrefId(e)
                if (!element) return
                //Just in case this is a second or third click for a target sentence, revert the previously currentHrefId and delete the target icons.
                //let skipScrollTo = true;
                //handleSentenceChosen(element.id, skipScrollTo);
                if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
                if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
            }
    
            if (element && element.id && element.nodeName === "SPAN") {
                //First check to see if this sentence is involved in in a moved sentence edit by this same user.
                if (isMoveSentenceUsedAlready(element.id)) {
                    handleMovedSentenceErrorOpen()
                    return
                }
    
                if (!moveSentence.stepCount || moveSentence.stepCount <= 1) {
                    //if (currentHrefId !== element.id)
                    handleSentenceChosen(element.id, true); //revertEditBackgroundColorByPendingOrNot(currentHrefId);
                    let moveArrayHrefId = [element.id]
                    highlightSentence(element.id, colorMoveSentence, true); //true is writerSide hrefId type
                    setMoveSentence({ ...moveSentence, moveArrayHrefId, stepCount: 2 }); setShowInstructions(true)
                } else if (moveSentence.stepCount === 2) {
                    //If the end sentence is the same as the first
                    //     no need to update the moveArrayHrefId, but set stepCount to 3
                    //else
                    //     get the index location in HtmlDoc of the end and beginning sentences
                    //     if the end sentence comes before the start,
                    //         set this incoming sentence as the moveArrayHrefId single array value
                    //     end if
                    //end if
                    //Get the HtmlDoc and find the start hrefId
                    //Loop through the arrays and record each hrefId until you come to the end hrefId
                    //Record the moveArray and set the stepCount to 3
                    let moveArrayHrefId = ''
                    let beginHrefId = ''
                    let endHrefId = ''
    
                    if (element.id === moveSentence.moveArrayHrefId[0]) {
                        moveArrayHrefId = [element.id]
                        setMoveSentence({ ...moveSentence, moveArrayHrefId, stepCount: 3 })
                    } else {
                        let html = document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML
                        moveArrayHrefId = moveSentence.moveArrayHrefId
                        beginHrefId = moveSentence.moveArrayHrefId[0]
                        endHrefId = element.id
                        let beginIndex = html.indexOf(moveSentence.moveArrayHrefId[0])
                        let endIndex = html.indexOf(element.id)
                        if (beginIndex > endIndex) {
                            moveArrayHrefId = [element.id]
                            beginHrefId = element.id
                            endHrefId = moveSentence.moveArrayHrefId[0]
                            highlightSentence(beginHrefId, colorMoveSentence, true); //true is writerSide hrefId type
                        }
                        let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN')
                        let foundBegin = false
    
                        for(let i = 0; i < spans.length; i++) {
                            if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') > -1) {
                                if (foundBegin) {
                                    moveArrayHrefId.push(spans[i].id)
                                    highlightSentence(spans[i].id, colorMoveSentence, true); //true is writerSide hrefId type
                                    if (spans[i].id === endHrefId) {
                                        break
                                    }
                                }
                                if (!foundBegin && spans[i].id === beginHrefId) {
                                    foundBegin = true
                                }
                            }
                        }
                        setMoveSentence({ ...moveSentence, moveArrayHrefId, stepCount: 3 })
                    }
                } else { //if (moveSentence.stepCount === 3) {
                    //Help to do:  Don't let the user choose a sentence that is in one of the chosen sentences to be moved.
                    setMoveSentence({ moveArrayHrefId: moveSentence.moveArrayHrefId, hrefId: element.id, stepCount: 4 })
                    highlightSentence(moveSentence.hrefId, '', true); //true is writerSide hrefId type
                    highlightSentence(element.id, colorCurrentFocus, true); //true is writerSide hrefId type
    
                    //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                    //The target needs an onclick event in order to receive the action and set position.
                    let frag = document.createRange().createContextualFragment(createTarget('Begin'))
                    let frag2 = document.createRange().createContextualFragment(createTarget('End'))
                    let originalNode = document.getElementById(element.id)
                    let beforeNode = originalNode.parentNode.insertBefore(frag.childNodes[0], originalNode)
                    if (beforeNode) beforeNode.onclick = (event) => sentenceMoveLastStep('Begin', event)
                    let nextSibling = originalNode.nextSibling
                    let afterNode
                    if (nextSibling) {
                        afterNode = originalNode.parentNode.insertBefore(frag2.childNodes[0], nextSibling)
                    } else {
                        afterNode = originalNode.parentNode.appendChild(frag2.childNodes[0])
                    }
                    if (afterNode) afterNode.onclick = (event) => sentenceMoveLastStep('End', event)
                }
            }
        
  }

  const sentenceClick = (e, elementIncoming=null) => {
    
            //Note:  The currentHrefId should be non-standard HrefId for the left side:  ~^
            //On click off of a sentence to another sentence
            //0. Put a yellow highlight on the selected sentence throughout the process until the user clicks off to another sentence.
            //      a. When the user leaves this sentence, set the background according to the presence of an edit (colored) or not (no color).
            //1. Compare the sentence that was just left in order to see if it changed.
            //      a. If it changed,
            //          i.  Send off the EditDetail record to the database
            //          ii. Get all of the EditDetail records again (unless this proves to be excessive overhead)
            //                 which will include the new EditDetail with its new EditDetailId
            //          iii. The Redux store will be updated with the new editDetail records
            let {setEditDetail, setVisitedHrefId, isAuthor, personId, workId, workSummary, tabsData, setSentenceChosen,
                    draftComparison, isDraftView, isTranslation, toggleLeftSidePanelOpen, getTranslation, editReview, leftSidePanelOpen,
                    editDetails, isEditor} = props
            let {searchChoice, saveSelection, restoreSelection, currentHrefId, currentSentence} = state
            e && e.stopPropagation()
            e && e.preventDefault()
            //hideContextEditReviewMenu();
    
            let element = e && e.target
            if (!element) {
                element = elementIncoming
            }
            //Don't propagate this action if the left side panel is open.
            //if (props.leftSidePanelOpen) return;
            let editorSentence = ""
            element = checkEventForValidHrefId(e, '', element); //If e is null, then we will fall back on element.
    
            if (!element || !element.id || element.id.indexOf("~") !== 0 || element.nodeName !== 'SPAN') {
                revertEditBackgroundColorByPendingOrNot(standardHrefId(currentHrefId))
                return
            }
    
            //If we are in the draftComparison, don't let the editor do anything to a draftComparison
            let thisUserDraft = draftComparison && draftComparison[editReview.editorTabChosen].isCurrent
            let canBeChanged = !isDraftView || (isDraftView && draftComparison && tabsData && !thisUserDraft) ? true : false
            let isNewChange = false
    
            //It is necessary to reach back and get the editor's potentially changed sentence by the hrefId (this is the left-side version ~^)
            if (document.getElementById(currentHrefId)) {
               editorSentence = document.getElementById(currentHrefId).innerHTML
    
               if ((!draftComparison || (draftComparison && draftComparison[editReview.editorTabChosen].isCurrent))
                        && currentSentence !== editorSentence && canBeChanged && editorSentence.indexOf("<svg id='erased") === -1) {
                   setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, standardHrefId(currentHrefId), editorSentence, false, 'edit'); //The author has freestyle editing which saves editDetails but then saves chapterText directly, but don't run a function that will recall the redux store
                   isNewChange = true
               }
           }
    
           let isEditText = element && element.id && editDetails && editDetails.length> 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === standardHrefId(element.id))[0]
    
           if (isNewChange) {
              highlightSentence(standardHrefId(currentHrefId), colorEditPending)
           } else if (document.getElementById(standardHrefId(currentHrefId))) {
               revertEditBackgroundColorByPendingOrNot(standardHrefId(currentHrefId))
           }
           if (element && element.id && element.id.indexOf("~") === 0 && element.nodeName === 'SPAN') {
               highlightSentence(standardHrefId(element.id))
               isEditor && highlightSentence(element.id, colorCurrentFocus, true); //true is left side
           }
    
                //0 index is the first character so that we are only picking up sentence hrefIds and not the icon ids which start with something like targetBegin or breakNewEnd, for example.
           if (element && element.id && currentHrefId !== element.id && element.id.indexOf("~") === 0 && element.nodeName === 'SPAN') {
                savedCursorPosition = saveSelection(document.getElementById('editorDiv'), element.id)
                handleEditChosen(element.id)
                setSentenceChosen(element.id)
                if (document.getElementById(standardHrefId(currentHrefId)))
                    revertEditBackgroundColorByPendingOrNot(standardHrefId(currentHrefId))
    
                setCurrentHrefId(writerHrefId(element.id)); set//this is a global variable.  This should be the left-side hrefId type(~^
                    currentSentence: document.getElementById(writerHrefId(element.id)) ? document.getElementById(writerHrefId(element.id)).innerHTML : '')
    
                setVisitedHrefId(workId, standardHrefId(element.id), element.innerHTML); //The author has freestyle editing which saves editDetails but then saves chapterText directly, but don't run a fucntion that will recall the redux store
                if (isTranslation) {
                    let sendText = element.innerText
                    //If there is any HTML within the innerText at all, it needs to be contained in a valid HTML tag, such as a <span>
                    sendText = sendText.indexOf(">") > -1 ? "<span>" + sendText + "</span>" : sendText
                    getTranslation(personId, workId, workSummary.languageId_current, standardHrefId(element.id), workSummary.chapterId_current, sendText)
                }
                //The difference between the author and the editor is that the author should be able to edit freely. Except translation mode should not allow editing either.
                //   The only way for the editor to modify sentences is to click on a sentence and use the single editor control in the left pane.
                //Don't open up the left side pane if the bookmarkTools or SearchTools are open.
                //And keep this outside of the condition statement above.  We want this to toggle open if the user clicks on the same sentence that they returned to after opening the left pane initially.
           }
           let openLeftSide = true
           if (searchChoice === "BookmarkTool" || searchChoice === "SearchTextTool") {
               openLeftSide = false
           } else if (!(isAuthor && !!isEditText) && !isEditor) {
               openLeftSide = false
           } else if (editReview && editReview.modeChosen !== 'edit') {
               openLeftSide = false
           }
           if (openLeftSide && !leftSidePanelOpen) toggleLeftSidePanelOpen()
           restoreSelection(document.getElementById('editorDiv'), savedCursorPosition)
        
  }

  const imageNewClick = (e) => {
    
            
            //if (props.leftSidePanelOpen) return;  //Help to do ... put this back.
    
            //If the current user is not on their own tab, they cannot create a moveSentence edit.
            e && e.stopPropagation()
            e && e.preventDefault()
            //This is necessary here since the click event is not getting changed.  We are already changing the click with addEventListener so often
            //  that we don't want to complicate matters, so we will just detect the last step of choosing the target and take it from there with a return, which I know is a bit ugly.
            if (checkEventForValidHrefId(e, 'targetBegin')) {
                imageNewLastStep('Begin')
                return
            } else if (checkEventForValidHrefId(e, 'targetEnd')) {
                imageNewLastStep('End')
                return
            }
    
            //Take highlight off of the current sentence if it is the highlight color.
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
    
            //This is arranged so that if this is a valid HrefId and not a target and if the hrefId for this New Image was already entered but now the hrefId is different,
            //  Then we will let a new sentence be chosen over and over until the user decides to choose a target.
            let element = checkEventForValidHrefId(e)
            if (!element) return
    
            if (element && element.id && element.nodeName === "SPAN") {
                let skipScrollTo = true
                //Delete any targets that might be out there in case the user chose a different sentence after all.
                if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'))
                if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'))
    
                handleSentenceChosen(element.id, skipScrollTo)
                if (!newImage.hrefId || newImage.hrefId !== element.id) {
                    highlightSentence(element.id, colorCurrentFocus, true); //true is left-side hrefId type.
                    setNewImage({ hrefId: element.id }); setShowInstructions(true)
    
                    //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                    //The target needs an onclick event in order to receive the action and set position.
                    let frag = document.createRange().createContextualFragment(createTarget('Begin'))
                    let frag2 = document.createRange().createContextualFragment(createTarget('End'))
                    let originalNode = document.getElementById(element.id)
                    originalNode.parentNode.insertBefore(frag.childNodes[0], originalNode)
                    let nextSibling = originalNode.nextSibling
                    if (nextSibling) {
                        originalNode.parentNode.insertBefore(frag2.childNodes[0], nextSibling)
                    } else {
                        originalNode.parentNode.appendChild(frag2.childNodes[0])
                    }
    
                    if (document.getElementById('targetBegin')) document.getElementById('targetBegin').onclick = () => imageNewLastStep('Begin')
                    if (document.getElementById('targetEnd')) document.getElementById('targetEnd').onclick = () => imageNewLastStep('End')
    
                }
            }
        
  }

  const setDraftTabText = (tabDraftComparisonId) => {
    
            //This is only an option for the author
            const {draftComparison, editDetails, authorPersonId} = props
            
            document.getElementById('editorDiv').contentEditable = false
            if (draftComparison[tabDraftComparisonId].isCurrent) {
                document.getElementById('editorDiv').style.backgroundColor = ""
                document.getElementById('editorDiv').style.color = "black"
                document.getElementById('editorDiv').innerHTML = localChapterText
            } else {
                document.getElementById('editorDiv').style.backgroundColor = colorFullVersionView
                document.getElementById('editorDiv').innerHTML = draftComparison[tabDraftComparisonId].chapterText
            }
            editDetails && editDetails.length > 0 && editDetails.forEach(m => {
                if (document.getElementById(m.hrefId)) {
                    if (m.pendingFlag) {
                        highlightSentence(m.hrefId, colorEditPending)
                    } else if (document.getElementById(m.hrefId).style.backgroundColor !== colorEditPending
                                && document.getElementById(m.hrefId).style.backgroundColor !== colorEditPending_RGB) {
                        highlightSentence(m.hrefId, colorEditHistory)
                    }
                    if (draftComparison[tabDraftComparisonId].isCurrent && m.personId === authorPersonId && !m.isComment) {
                        document.getElementById(m.hrefId).innerHTML = m.editText
                    }
                }
            })
            setScrollByHrefId(currentHrefId)
        
  }

  const setScrollByHrefId = (scrollToHrefId) => {
    
            if (document.getElementById(scrollToHrefId)) {
                editorDivScrollTo(document.getElementById(scrollToHrefId))
            }
        
  }

  const handleEditorTabChosen = (newTab_personId) => {
    
            props.setEditorTabChosen(newTab_personId)
        
  }

  const handleDraftTabs = (draftComparisonId) => {
    
            const {setDraftTabSelected} = props
            setDraftTabSelected(draftComparisonId)
            setDraftTabText(draftComparisonId)
        
  }

  const submitSearchText = (value) => {
    
            setSearchText(value)
            let arrFound = searchForMatchingText(value)
            jumpToSearch('FIRST', arrFound)
        
  }

  const setBookmark = (evt) => {
    
            let {setVisitedHrefId, workId, bookmarks} = props
            let newPointer = 0
            let chosenHrefId = evt.target.value
    
            for(let i = 0; i < bookmarks.length; i++) {
                if (bookmarks[i] === evt.target.value) {
                    newPointer = i
                }
            }
    
            setBookmarkChosen(evt.target.value); setPointerBookmark(newPointer)
    
            let elementFound = document.getElementById(chosenHrefId)
            if (elementFound) {
                handleSentenceChosen(elementFound.id)
                setVisitedHrefId(workId, evt.target.value, elementFound.innerHTML)
            }
        
  }

  const searchForMatchingText = (textToSearch) => {
    
            //Notice that we are sending in the textToSearch value rather than depending on the state.
            //The state seems to be behind one character consistently.  So, send in the whole text.
            //The state will still be used to keep the value in the inputText control.
            //1. Take the searchText
            //2. Search through the editorDiv for matches
            //3. Keep track of the hrefId-s where the matches are found and place those hrefIds into an array
            let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN')
            let arrayFound = []
            if (textToSearch) {
                for(let i = 0; i < spans.length; i++) {
                    if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0  //Notice that 0 is the first character so that we are looking for valid hrefIds.
                            && document.getElementById(spans[i].id).innerHTML !== ""
                            && document.getElementById(spans[i].id).innerHTML !== "<br>"
                            && document.getElementById(spans[i].id).innerText.toLowerCase().indexOf(textToSearch.toLowerCase()) > -1) {
                        arrayFound = arrayFound ? arrayFound.concat(spans[i].id) : [spans[i].id]
                    }
                }
            }
            setArraySearchTextFound(arrayFound)
            return arrayFound
        
  }

  const jumpToSearch = (jumpTo, arrayFound) => {
    
            //1. Take the current pointer value and set it according to the jumpTo value
            //2. If the value in the array doesn't exist but the array is greater than 0, then give the limitation of the last or first
            let {setVisitedHrefId, workId} = props
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
    
            arrayFound = arrayFound ? arrayFound : arraySearchTextFound
            let nextPointer = pointerSearchText
            if (jumpTo === "FIRST") {
                nextPointer = 0
                nextPointer = nextPointer < 0 ? 0 : nextPointer
            } else if (jumpTo === "PREV") {
                nextPointer -= 1
                nextPointer = nextPointer < 0 ? 0 : nextPointer
            } else if (jumpTo === "NEXT") {
                nextPointer += 1
                nextPointer = nextPointer > arrayFound.length-1 ? arrayFound.length-1 : nextPointer
            } else if (jumpTo === "LAST") {
                nextPointer = arrayFound.length-1; //Because the array is zero based and so should be pointer be zero based.
            }
            setPointerSearchText(nextPointer)
    
            let elementFound = document.getElementById(arrayFound[nextPointer])
            if (elementFound) {
                setIconChosen(arrayFound[nextPointer])
                handleSentenceChosen(arrayFound[nextPointer])
                setVisitedHrefId(workId, arrayFound[nextPointer], elementFound.innerHTML)
            }
        
  }

  const jumpToBookmark = (jumpTo, arrayFound) => {
    
            //1. Take the current pointer value and set it according to the jumpTo value
            //2. If the value in the array doesn't exist but the array is greater than 0, then give the limitation of the last or first
            let {setVisitedHrefId, workId, bookmarks} = props
            revertEditBackgroundColorByPendingOrNot(currentHrefId)
    
            //If the list is empty and this is the first time that this is chosen, then set the nextPointer to 0 when clicking Next or Prev.
            //And set the chosenBookmark so that the list reflects the name of which bookmark the user is on.
            arrayFound = arrayFound ? arrayFound : bookmarks
            let nextPointer = pointerBookmark
            if (jumpTo === "FIRST") {
                nextPointer = 0
                nextPointer = nextPointer < 0 ? 0 : nextPointer
            } else if (jumpTo === "PREV") {
                nextPointer = !bookmarkChosen ? 0 : nextPointer - 1
                nextPointer = nextPointer < 0 ? 0 : nextPointer
            } else if (jumpTo === "NEXT") {
                nextPointer = !bookmarkChosen ? 0 : nextPointer + 1
                nextPointer = nextPointer > arrayFound.length-1 ? arrayFound.length-1 : nextPointer
            } else if (jumpTo === "LAST") {
                nextPointer = arrayFound.length-1; //Because the array is zero based and so should be pointer be zero based.
            }
            setPointerBookmark(nextPointer); setBookmarkChosen(arrayFound[nextPointer])
    
            let elementFound = document.getElementById(arrayFound[nextPointer])
            if (elementFound) {
                handleSentenceChosen(arrayFound[nextPointer])
                setVisitedHrefId(workId, arrayFound[nextPointer], elementFound.innerHTML)
            }
        
  }

  const setEditModeDropDownList = (editDetailId) => {
    
            let {editDetails} = props
            let edit = editDetails && editDetails.length> 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
            let editDetailId_chosen = ""
            if (edit.editTypeName === "edit") {
                editDetailId_chosen = edit.hrefId
            } else if (edit.editTypeName === 'breakNew') {
                editDetailId_chosen = 'breakNew' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'breakDelete') {
                editDetailId_chosen =  'breakDelete' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'imageNew') {
                editDetailId_chosen =  'imageNew' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'sentenceMove') {
                editDetailId_chosen =  'target' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'textNew') {
                editDetailId_chosen =  'textNew' + edit.position + '^^!' + edit.editDetailId
            }
            setEditDetailId_chosen(editDetailId_chosen)
        
  }

  const setEditOptionTools = (newChoice) => {
    
            
            //If a second click is made on search or bookmark, then have it make the tool disappear.
            if (newChoice === 'returnSearchText' || (newChoice === 'SearchTextTool' && searchChoice === 'SearchTextTool')) {
                searchTextDiv.className = styles.hidden
                setSearchChoice(''); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
            } else if (newChoice === 'returnBookmark' || (newChoice === 'BookmarkTool' && searchChoice === 'BookmarkTool')) {
                bookmarkDiv.className = styles.hidden
                setSearchChoice(''); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
            } else if (newChoice === 'SearchTextTool') {
                bookmarkDiv.className = styles.hidden
                searchTextDiv.className = styles.visible
                setSearchChoice('SearchTextTool'); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
            } else if (newChoice === 'BookmarkTool') {
                searchTextDiv.className = styles.hidden
                bookmarkDiv.className = styles.visible
                setSearchChoice('BookmarkTool'); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
            }
        
  }

  const handleSaveNewBookmark = (newBookmarkName) => {
    
            const {personId, workSummary, saveNewBookmark, editReview} = props
            saveNewBookmark(personId, workSummary.chapterId_current, workSummary.languageId_current, editReview.sentenceChosen, newBookmarkName)
        
  }

  const handleDeleteBookmark = () => {
    
            const {personId, workSummary, deleteBookmark} = props
            
            deleteBookmark(personId, workSummary.chapterId_current, workSummary.languageId_current, bookmarkChosen); //bookmarkChosen is the hrefId
            setIsShowingDeleteModal(false); setBookmarkChosen('')
        
  }

  const handleMissingBookmarkClose = () => {
    return setIsShowingMissingBookmarkModal(false)
        handleDeleteClose = () => setIsShowingDeleteModal(false)
        handleDeleteOpen = () => {
            
  }

  const handleDeleteClose = () => {
    return setIsShowingDeleteModal(false)
        handleDeleteOpen = () => {
            
  }

  const handleDeleteOpen = () => {
    
            
            if (!bookmarkChosen || bookmarkChosen === "- -") {
                setIsShowingMissingBookmarkModal(true)
                return
            }
            setIsShowingDeleteModal(true)
        
  }

  const handleMovedSentenceErrorOpen = () => {
    
            setIsShowingMovedSentenceError(true)
            deleteEditStepRecords(); //Reset all of the records if the editMode changes.
        
  }

  const handleMovedSentenceErrorClose = () => {
    return setIsShowingMovedSentenceError(false)
        handleCutPasteMessageOpen = () => setIsShowingCutPasteMessage(true)
        handleCutPasteMessageClose = () => setIsShowingCutPasteMessage(false)
        handleLoadingModalOpen = () => setIsShowingLoadingModal(true)
        handleLoadingModalClose = () => setIsShowingLoadingModal(false)
        handleUpdateContentModalOpen = () => setIsShowingUpdateContentModal(true)
        handleUpdateContentModalClose = () => setIsShowingUpdateContentModal(false)
        handleEndOfDocumentOpen = () => setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleCutPasteMessageOpen = () => {
    return setIsShowingCutPasteMessage(true)
        handleCutPasteMessageClose = () => setIsShowingCutPasteMessage(false)
        handleLoadingModalOpen = () => setIsShowingLoadingModal(true)
        handleLoadingModalClose = () => setIsShowingLoadingModal(false)
        handleUpdateContentModalOpen = () => setIsShowingUpdateContentModal(true)
        handleUpdateContentModalClose = () => setIsShowingUpdateContentModal(false)
        handleEndOfDocumentOpen = () => setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleCutPasteMessageClose = () => {
    return setIsShowingCutPasteMessage(false)
        handleLoadingModalOpen = () => setIsShowingLoadingModal(true)
        handleLoadingModalClose = () => setIsShowingLoadingModal(false)
        handleUpdateContentModalOpen = () => setIsShowingUpdateContentModal(true)
        handleUpdateContentModalClose = () => setIsShowingUpdateContentModal(false)
        handleEndOfDocumentOpen = () => setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleLoadingModalOpen = () => {
    return setIsShowingLoadingModal(true)
        handleLoadingModalClose = () => setIsShowingLoadingModal(false)
        handleUpdateContentModalOpen = () => setIsShowingUpdateContentModal(true)
        handleUpdateContentModalClose = () => setIsShowingUpdateContentModal(false)
        handleEndOfDocumentOpen = () => setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleLoadingModalClose = () => {
    return setIsShowingLoadingModal(false)
        handleUpdateContentModalOpen = () => setIsShowingUpdateContentModal(true)
        handleUpdateContentModalClose = () => setIsShowingUpdateContentModal(false)
        handleEndOfDocumentOpen = () => setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleUpdateContentModalOpen = () => {
    return setIsShowingUpdateContentModal(true)
        handleUpdateContentModalClose = () => setIsShowingUpdateContentModal(false)
        handleEndOfDocumentOpen = () => setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleUpdateContentModalClose = () => {
    return setIsShowingUpdateContentModal(false)
        handleEndOfDocumentOpen = () => setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleEndOfDocumentOpen = () => {
    return setIsShowingEndOfDocument(true)
        handleEndOfDocumentClose = () => setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleEndOfDocumentClose = () => {
    return setIsShowingEndOfDocument(false)
        handleImageUploadOpen = () => setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleImageUploadOpen = () => {
    return setIsShowingImageUpload(true)
        handleImageUploadClose = () => {
            
  }

  const handleImageUploadClose = () => {
    
            
            highlightSentence(newImage.hrefId, '', true); //true is writerSide hrefId type.
            handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode
    				setIsShowingImageUpload(false)
        
  }

  const handlePenspringHomeworkOpen = () => {
    return setIsShowingPenspringHomework(true)
        handlePenspringHomeworkClose = () => setIsShowingPenspringHomework(false)
    		handlePenspringHomework = () => {
    				const {personId, workSummary, setPenspringHomeworkSubmitted} = props
  }

  const handlePenspringHomeworkClose = () => {
    return setIsShowingPenspringHomework(false)
    		handlePenspringHomework = () => {
    				const {personId, workSummary, setPenspringHomeworkSubmitted} = props
  }

  const handlePenspringHomework = () => {
    
    				const {personId, workSummary, setPenspringHomeworkSubmitted} = props
    				setPenspringHomeworkSubmitted(personId, workSummary.workId)
    				saveByButtonPress()
    				handlePenspringHomeworkClose()
    				setLocalHomeworkSubmitDate(new Date())
    		
  }

  const handlePenspringDistributeOpen = () => {
    return setIsShowingPenspringDistribute(true)
        handlePenspringDistributeClose = () => setIsShowingPenspringDistribute(false)
    		handlePenspringDistribute = () => {
    				const {personId, workSummary, setPenspringDistributeSubmitted} = props
  }

  const handlePenspringDistributeClose = () => {
    return setIsShowingPenspringDistribute(false)
    		handlePenspringDistribute = () => {
    				const {personId, workSummary, setPenspringDistributeSubmitted} = props
  }

  const handlePenspringDistribute = () => {
    
    				const {personId, workSummary, setPenspringDistributeSubmitted} = props
    				setPenspringDistributeSubmitted(personId, workSummary.workId)
    				handlePenspringDistributeClose()
    				setLocalDistributeSubmitDate(new Date())
    		
  }

  const handleSubmitImageAndWait = () => {
    
            
            handleImageUploadClose()
            handleImageEntryProgressOpen()
            setPendingNewImage('imageNew' + newImage.position + newImage.hrefId); set//The component Did Update function is looking for this match in the authorWorkspace.
                isShowingImageUpload(false); setNewImage({hrefId: '', position: ''}); setShowInstructions(false); setTimerId_imageEntry(setInterval(() => handleImageReceive(), 3000)); //pendingNewImage is what allows the authorWorkspace to load again with the new image this time (in Component Did Update)
        
  }

  const handleImageReceive = () => {
    
          const {getAuthorWorkspace, personId, workId, workSummary} = props
          
          if (document.getElementById(pendingNewImage)) {
              clearInterval(timerId_imageEntry)
              handleImageEntryProgressClose()
              setPendingNewImage('')
          } else {
              getAuthorWorkspace(personId, workId, workSummary.chapterId_current)
          }
        
  }

  const setSpansEvent = (userAction, doFunction, whichSide='both') => {
     //both, leftSide, editViewSide
            let searchPrefix = whichSide === 'writerSide'
                ? '[id^="~^"]'
                : whichSide === 'editViewSide'
                    ? '[id^="~!"]'
                    : '[id^="~!"], [id^="~^"]'; //both sides.
    
            let spans = document.querySelectorAll(searchPrefix)
            for(let i = 0; i < spans.length; i++) {
                if (spans && spans[i]) {
                    if (userAction === "click") {
                        spans[i].onclick = doFunction
                    } else if (userAction === "contextmenu") {
                        spans[i].onkeyup = doFunction
                    } else if (userAction === "keyup") {
                        spans[i].onkeyup = doFunction
                    } else if (userAction === "keydown") {
                        spans[i].onkeydown = doFunction
                    } else if (userAction === "blur") {
                        spans[i].onblur = doFunction
                    } else if (userAction === "mouseup") {
                        spans[i].onmouseup = doFunction
                    } else if (userAction === "beforepaste") {
                        spans[i].onbeforepaste = doFunction
                    } else if (userAction === "beforecopy") {
                        spans[i].onbeforecopy = doFunction
                    } else if (userAction === "beforecut") {
                        spans[i].onbeforecut = doFunction
                    } else if (userAction === "paste") {
                        spans[i].onpaste = doFunction
                    } else if (userAction === "copy") {
                        spans[i].oncopy = doFunction
                    } else if (userAction === "cut") {
                        spans[i].oncut = doFunction
                    }
                }
            }
        
  }

  const setSentenceClickFunction = (modeChosen, force=false) => {
    
            if (!modeChosen || modeChosen === 'edit') {
                setSpansEvent('click', sentenceClick, 'writerSide')
                setSpansEvent('click', sentenceClick, 'editViewSide')
                setSpansEvent('mouseup', handleTextSelectionChange)
                setSpansEvent('keyup', checkForKeypress, 'writerSide')
                //setSpansEvent('keydown', checkForEnterKeypress, 'writerSide');
            } else {
                setSpansEvent('blur', () => {})
                setSpansEvent('mouseup', () => {})
                // setSpansEvent('keyup', () => {});
                // setSpansEvent('keydown', () => {});
                if (modeChosen === 'textNew') {
                    setSpansEvent('click', textNewClick, 'writerSide')
                } else if (modeChosen === 'breakNew') {
                        setSpansEvent('click', breakNewClick, 'writerSide')
                } else if (modeChosen === 'breakDelete') {
                    setSpansEvent('click', breakDeleteClick, 'writerSide')
                } else if (modeChosen === 'sentenceMove') {
                    setSpansEvent('click', sentenceMoveClick, 'writerSide')
                } else if (modeChosen === 'imageNew') {
                    setSpansEvent('click', imageNewClick, 'writerSide')
                }
            }
        
  }

  const handlePointerMove = (moveDirection, idName, modeListOptions) => {
    
            const {setSentenceChosen, editDetails} = props
            
            let movePointer = document.getElementById(idName).selectedIndex
            if (moveDirection === "NEXT") {
                movePointer++
                if (movePointer >= modeListOptions.length) {
                    movePointer = Number(modeListOptions.length) - Number(1)
                }
            } else if (moveDirection === "PREV") {
                movePointer--
            }
            //Now that the movePointer has served as the index pointer, it is possible that it will show the last edit being past the count by 1.
            if (movePointer > modeListOptions.length) {
                movePointer = modeListOptions.length
            } else if (movePointer < 1) {
                movePointer = 1; //0 is the label header which will not have a valid editDetailId.
            }
            highlightSentence(writerHrefId(currentHrefId), 'white'); //This is the right-side.
            revertEditBackgroundColorByPendingOrNot(currentHrefId); //This is the left-side which automatically converts to the hrefd to standard ~!.
    
            let edit = editDetails && editDetails.length> 0 && editDetails.filter(m => m.editDetailId === modeListOptions[movePointer].editDetailId)[0]
            let editElementId = ""
            let newCurrentHrefId = ""
            let newCurrentSentence = ""
            if (edit.editTypeName === "edit") {
                editElementId = edit.hrefId
                newCurrentHrefId = edit.hrefId
                newCurrentSentence = document.getElementById(writerHrefId(edit.hrefId)).innerHTML
                setSentenceChosen(modeListOptions[movePointer].hrefId)
            } else if (edit.editTypeName === 'breakNew') {
                editElementId = 'breakNew' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'breakDelete') {
                editElementId = 'breakDelete' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'imageNew') {
                editElementId = 'imageNew' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'sentenceMove') {
                editElementId = 'target' + edit.position + '^^!' + edit.editDetailId
            } else if (edit.editTypeName === 'textNew') {
                editElementId = 'textNew' + edit.position + '^^!' + edit.editDetailId
            }
            setCurrentHrefId(newCurrentHrefId); setCurrentSentence(newCurrentSentence)
            handleEditChosen(editElementId)
            editorDivScrollTo(document.getElementById(standardHrefId(edit.hrefId)))
        
  }

  const handleEditOwner = () => {
    
            const {editDetails} = props
            
            let editText = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === currentHrefId)[0]
    
            let editDetailId = currentHrefId && currentHrefId.indexOf('^^!') > -1
                ? currentHrefId.substring(currentHrefId.indexOf('^^!')+3)
                : ''
    
            let edit = editDetailId
                ? editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
                : editText
    
            props.setEditorTabChosen(edit.personId)
        
  }

  const handleEditChosen = (elementId) => {
    
            const {setEditChosen, setSentenceChosen} = props
            
            currentHrefId && revertEditBackgroundColorByPendingOrNot(currentHrefId)
    
            if (currentHrefId && (currentHrefId.indexOf('target') > -1 || currentHrefId.indexOf('move') > -1)) {
                let suffix = currentHrefId && currentHrefId.substring(currentHrefId.indexOf('^^!'))
                highlightSentence('targetBegin' + suffix, '')
                highlightSentence('targetEnd' + suffix, '')
                highlightSentence('moveBegin' + suffix, '')
                highlightSentence('moveEnd' + suffix, '')
            }
    
            if (elementId && (elementId.indexOf('target') > -1 || elementId.indexOf('move') > -1)) {
                let suffix = elementId && elementId.substring(elementId.indexOf('^^!'))
                highlightSentence('targetBegin' + suffix, colorCurrentFocus)
                highlightSentence('targetEnd' + suffix, colorCurrentFocus)
                highlightSentence('moveBegin' + suffix, colorCurrentFocus)
                highlightSentence('moveEnd' + suffix, colorCurrentFocus)
            } else {
                highlightSentence(elementId, colorCurrentFocus)
            }
            let currentSentence = document.getElementById(elementId) ? document.getElementById(elementId).innerHTML : ''
            setCurrentHrefId(elementId); setCurrentSentence(currentSentence)
            setEditChosen(elementId)
            setSentenceChosen(elementId)
        
  }

  const handleHideEditorsVersions = () => {
    return setHideEditorsVersions(!hideEditorsVersions)
    
    		onChangeLanguage = (event) => {
    				const {setWorkCurrentSelected, personId, workSummary} = props
  }

  const onChangeLanguage = (event) => {
    
    				const {setWorkCurrentSelected, personId, workSummary} = props
    				setWorkCurrentSelected(personId, workSummary.workId, workSummary.chapterId_current, Number(event.target.value), "STAY")
    		
  }

  const {tabsData, workSummary, personId, authorPersonId, updatePersonConfig, personConfig, editDetails, leftSidePanelOpen,
                  workId, toggleLeftSidePanelOpen, bookmarkOptions, bookmarks, isDraftView, toggleDraftView, modeCounts,
                  isTranslation, getTranslation,  translatedSentence, textProcessingProgress, editListOptions, editorColors,
                  deleteWork, deleteChapter, setWorkCurrentSelected, chapterTabText, isAuthor, editReview={}, authorWorkspace,
  								toggleShowEditorTabDiff, editorFirstName} = props
          
  
          let editDetailsByHrefId = editDetails && editDetails.length > 0 && editDetails.filter(m => m.hrefId === standardHrefId(editReview.sentenceChosen) && m.editTypeName === 'edit')
          let tabsFunction = isDraftView ? handleDraftTabs : handleEditorTabChosen;  //eslint-disable-line
          let tabNav = isDraftView ? toggleDraftView : () => {}
          let navText = isDraftView && `Close Drafts`
  				let toolScreenWidth = (tabsData && tabsData.tabs && tabsData.tabs.length > 1) ? 900 + (tabsData.tabs.length * 50) : 900
  				toolScreenWidth += leftSidePanelOpen ? 250 : 0
  
          let languageOptions = workSummary.languageOptions
          if (languageOptions && languageOptions.length > 0) languageOptions = doSort(languageOptions, { sortField: 'label', isAsc: true, isNumber: false })
  
          return (
              <div>
                  <MuiThemeProvider>
                      <SlidingPane open={ sidePanel_open || leftSidePanelOpen } width={295}>
                          <SentenceEdits
                              open={false}
                              docked={sidePanel_docked}
                              isTranslation={isTranslation}
                              translatedSentence={translatedSentence}
                              getTranslation={getTranslation}
                              onSetOpen={toggleLeftSidePanelOpen}
                              personId={personId}
                              authorPersonId={authorPersonId}
                              editText={currentSentence}
                              leftSidePanelOpen={leftSidePanelOpen}
                              editDetailsByHrefId={editDetailsByHrefId}
                              hrefId={standardHrefId(currentHrefId)}
                              chapterId={workSummary && workSummary.chapterId_current}
                              saveEdit={saveEditOrComment(currentHrefId)(currentSentence)}
                              saveEditVote={handleEditVote}
                              deleteEditOrComment={handleDeleteEditDetail}
                              editReview={editReview}
                              restoreEditOrComment={restoreEditOrComment}
                              toggleLeftSidePanelOpen={toggleLeftSidePanelOpen}
                              setSentenceChosen={handleSentenceChosen}
                              originalSentence={editReview && editReview.originalSentenceText}
                              setTabSelected={handleEditorTabChosen}
                              setNextHrefId={setNextHrefId}
                              updatePersonConfig={updatePersonConfig}
                              personConfig={personConfig}
                              editorColors={editorColors}
  														workSummary={workSummary}
                              saveEditOrComment={saveEditOrComment(currentHrefId)(currentSentence)} />
                      </SlidingPane>
                  </MuiThemeProvider>
  
                  <div className={classes(styles.container, (sidePanel_open || leftSidePanelOpen ? styles.leftSliderHoldSpace : ''))}>
                      <ScrollSync>
                          <div className={styles.row}>
  														{!hideEditorsVersions &&
  		                            <div className={styles.oneSide}>
                                      <div className={styles.setHeightEditor}>
      		                                <div className={styles.toolSection}>
      		                                    <div className={classes((hideEditorsVersions ? '' : styles.row), styles.moreTopRight)}>
      		                                        <div className={styles.fullViewHeader}><L p={p} t={`Editors' Versions`}/></div>
      																						<div onClick={handleHideEditorsVersions} className={styles.linkHide}>
      																								(hide)
      																						</div>
      		                                        {editListOptions &&
      		                                            <EditListNavigator idName={'editList'} editDetailId_chosen={currentHrefId} editListOptions={editListOptions}
      		                                                handlePointerMove={handlePointerMove} setEditChosen={handleEditChosen}/>
      		                                        }
      		                                    </div>
      																				<MediaQuery maxWidth={toolScreenWidth}>
      																						{(matches) => {
      																								if (matches) {
      																										return (
      																											<div className={styles.row}>
      																													<TextEditorTools className={styles.textEditorTools} editReview={editReview} editMode={editReview.modeChosen}
      																																 personId={personId} authorPersonId={workSummary.authorPersonId} editChosen={currentHrefId}
      																																 deleteEditDetail={handleDeleteEditDetail} setEditReviewVote={handleEditVote} workSummary={workSummary}
      																																 workId={workId} setAcceptedEdit={handleAcceptEditDetail} editDetails={editDetails}
      																																 standardHrefId={standardHrefId} handleEditOwner={handleEditOwner}
      																																 toggleShowEditorTabDiff={toggleShowEditorTabDiff}/>
      																													<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.linkShow, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/></a>} content={() => componentRef}/>
      																											</div>
      																										)
      																							} else {
      																									return (
      																											<div></div>
      																									)
      																							}
      																						}}
      																				</MediaQuery>
      																				{!hideEditorsVersions &&
      				                                    <div className={classes(styles.tabPage, styles.row)}>
      				                                        <TabPage tabsData={tabsData} onClick={handleEditorTabChosen} navClose={tabNav} navText={navText}
      				                                            showZeroCount={true} showListAfterQuantity={5}/>
      																								<MediaQuery minWidth={toolScreenWidth}>
      																	                  {(matches) => {
      																		                    if (matches) {
      																			                      return (
      																															<div className={styles.row}>
      																																	<TextEditorTools className={styles.textEditorTools} editReview={editReview} editMode={editReview.modeChosen}
      													                                               personId={personId} authorPersonId={workSummary.authorPersonId} editChosen={currentHrefId}
      													                                               deleteEditDetail={handleDeleteEditDetail} setEditReviewVote={handleEditVote} workSummary={workSummary}
      													                                               workId={workId} setAcceptedEdit={handleAcceptEditDetail} editDetails={editDetails}
      													                                               standardHrefId={standardHrefId} handleEditOwner={handleEditOwner}
      																																				 toggleShowEditorTabDiff={toggleShowEditorTabDiff}/>
      																																	<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.linkShow, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/></a>} content={() => componentRef}/>
      																															</div>
      																														)
      																											} else {
      																		                      return (
      																		                        	<div></div>
      																		                      )
      																	                    }
      																										}}
      																								</MediaQuery>
      				                                    </div>
      																				}
      		                                </div>
                                      </div>
  		                                {!hideEditorsVersions &&
  																				<ScrollSyncPane>
  				                                    <div className={classes(styles.editorDivEditor, styles.editorBorder)}>
  				                                        <div className={styles.contentEditable}
  				                                            id="tabView" contentEditable={false}
  																										ref={el => (componentRef = el)}
  				                                            dangerouslySetInnerHTML={{__html: chapterTabText}} />
  				                                    </div>
  																						<div id={`contextEditReview`} style={{display: 'none'}}>
  						                                    <ContextEditReview editDetails={editDetails} isAuthor={personId === workSummary.authorPersonId}
  						                                        editReview={editReview} personId={personId} editChosen={currentHrefId} deleteEditDetail={handleDeleteEditDetail}
  						                                        setEditReviewVote={handleEditVote} workSummary={workSummary} workId={workId}
  						                                        setAcceptedEdit={handleAcceptEditDetail} standardHrefId={standardHrefId}
  						                                        hideContextEditReviewMenu={hideContextEditReviewMenu}/>
  						                                </div>
  		                                		</ScrollSyncPane>
  																		}
  		                            </div>
  														}
                              <div className={styles.columnSpacer}>
                              </div>
                              <div className={styles.oneSide}>
                                  <div className={styles.setHeightAuthor}>
      																{showInstructions &&
      																		<div className={styles.instructions}>
      																				<EditorInstructions editMode={editReview.modeChosen} newBreak={newBreak} deleteBreak={deleteBreak}
      																						moveSentence={moveSentence} newImage={newImage}
      																						cancelRecord={() => setAddInstructions(false)} />
      																		</div>
      																}
      																{!showInstructions &&
      		                                <div className={classes(styles.toolSection, (hideEditorsVersions ? styles.rowWrap : styles.rowNowrap))}>
      																				<div className={styles.row}>
      																						{hideEditorsVersions &&
      																								<div className={styles.editorPosition}>
      																										<div className={styles.labelSmall}>Editors</div>
      																										<div onClick={handleHideEditorsVersions} className={classes(styles.linkShow, styles.row)}>
      																												show
      																												<div className={styles.count}>{(tabsData && tabsData.tabs && String(Number(tabsData.tabs.length)-Number(1))) || 0}</div>
      																										</div>
      																								</div>
      																						}
      				                                    <EditTools modeCounts={modeCounts}
      				                                        setEditOptionTools={setEditOptionTools} editorTabChosen={editReview.editorTabChosen}
      				                                        setEditMode={handleEditModeChosen} editReview={editReview} currentSentence={currentSentence}
      				                                        personId={personId} authorPersonId={authorPersonId} workSummary={workSummary} deleteWork={deleteWork}
      				                                        deleteChapter={deleteChapter} setWorkCurrentSelected={setWorkCurrentSelected} setAddInstructions={setAddInstructions}
      				                                        sentenceChosen={currentHrefId} counts={editReview.editCounts}
      				                                        saveEditOrComment={saveEditOrComment(currentHrefId || currentHrefId)(currentSentence)}
      				                                        showInstructions={showInstructions} handleShowInstructions={handleShowInstructions}
      				                                        deleteEditDetail={handleDeleteEditDetail} toggleLeftSidePanelOpen={toggleLeftSidePanelOpen}
      				                                        workId={workId} chapterId={workSummary.chapterId_current} languageId={workSummary.languageId_current}
      																								toggleShowEditorTabDiff={toggleShowEditorTabDiff}/>
      																				</div>
      																				{isAuthor && personConfig.authorWorkspaceOn &&
      																						//This was used when we had the "commit changes" button which we will probably use again for a feature called personConfig.authorWorkspaceOn
      																						<div>
      																								<Button label={<L p={p} t={`Commit changes`}/>} onClick={handleAuthorProcessText} addClassName={styles.commitButton}/>
      																						</div>
      		                                    }
      																				{workSummary.languageOptions && workSummary.languageOptions.length > 1 &&
      																						<div className={styles.moreLeft}>
      																								<SelectSingleDropDown
      																										id={`translateLanguages`}
      																										label={``}
      																										value={workSummary.languageId_current}
      																										options={workSummary.languageOptions}
      																										noBlank={true}
      																										error={''}
      																										height={`medium`}
      																										onChange={onChangeLanguage}/>
      																						</div>
      																				}
      																				{workSummary.languageOptions && workSummary.languageOptions.length === 1 &&
      																						<div className={styles.labelLanguage}>{workSummary.languageName}</div>
      																				}
      		                                </div>
      																}
                                      <div>
                                          {!isAuthor && !showInstructions &&
      																				<div className={styles.row}>
      		                                        <div className={styles.chooseSentence}>
      																								<L p={p} t={`Click on a sentence to edit`}/>
      																						</div>
      																						<div className={styles.fullViewHeader}>
      																								<L p={p} t={`${editorFirstName}'s Version`}/>
      																						</div>
      																				</div>
                                          }
      																		{isAuthor && !showInstructions &&
      																				<div className={styles.row}>
                                                  <span className={styles.workspaceSave}><L p={p} t={`Your workspace was saved at`}/></span>
                                                  <DateMoment date={saveWorkSpaceTime} format={'h:mm:ss a'} className={styles.timeDisplay}/>
      																						{!hideEditorsVersions &&
      																								<div className={styles.fullViewHeader}>
      																										<L p={p} t={`${editorFirstName}'s Version`}/>
      																								</div>
      																						}
      																						{workSummary.isHomework && !workSummary.isHomeworkSubmitted && !localHomeworkSubmitDate &&
      																								<ButtonWithIcon label={<div className={styles.lineHeight}>Submit<br/><div className={styles.smallText}><L p={p} t={`Homework`}/></div></div>}
      																										icon={'checkmark0'} onClick={handlePenspringHomeworkOpen}/>
      																						}
      																						{workSummary.isHomework && (workSummary.isHomeworkSubmitted || localHomeworkSubmitDate) &&
      																								<TextDisplay label={<L p={p} t={`Homework submitted`}/>} text={<DateMoment date={workSummary.homeworkSubmittedDate || localHomeworkSubmitDate}
      																										format={'D MMM  h:mm a'} minusHours={0}/>} nowrap={true}/>
      				                                    }
  
      																						{workSummary.isDistributableAssignment && !workSummary.publishedDate && !localDistributeSubmitDate &&
      																								<ButtonWithIcon label={<div className={styles.lineHeight}><L p={p} t={`Publish`}/><br/><div className={styles.smallText}><L p={p} t={`Assignment`}/></div></div>}
      																										icon={'earth'} onClick={handlePenspringDistributeOpen}/>
      																						}
      																						{workSummary.isDistributableAssignment && (workSummary.publishedDate || localDistributeSubmitDate) &&
      																								<TextDisplay label={<L p={p} t={`Published assignment`}/>}text={<DateMoment date={workSummary.publishedDate || localDistributeSubmitDate}
      																										format={'D MMM  h:mm a'} minusHours={6}/>} nowrap={true}/>
      				                                    }
  
      																						{isAuthor &&
                                                      <div className={styles.raiseUp}>
  															                          <ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'floppy_disk0'} onClick={saveByButtonPress}/>
                                                      </div>
      																						}
      																				</div>
                                          }
                                          {!showInstructions &&
                                              <div>
                                                  <div className={styles.secondRow}>
                                                      <div ref={ref => {searchTextDiv = ref}} className={styles.hidden}>
                                                          <SearchTextTool
                                                              pointer={arraySearchTextFound && arraySearchTextFound.length > 0 ? pointerSearchText + 1 : 0}
                                                              totalCount={arraySearchTextFound && arraySearchTextFound.length > 0 && arraySearchTextFound.length}
                                                              jumpToSearch={jumpToSearch} searchText={searchText} submitSearchText={submitSearchText}
                                                              setEditOptionTools={() => setEditOptionTools('returnSearchText')}/>
                                                      </div>
                                                  </div>
                                                  <div ref={ref => {bookmarkDiv = ref}} className={styles.hidden}>
                                                      <BookmarkTool
                                                          pointer={bookmarks && bookmarks.length > 0 ? pointerBookmark + 1 : 0}
                                                          totalCount={bookmarks && bookmarks.length > 0 && bookmarks.length}
                                                          jumpToBookmark={jumpToBookmark} bookmarkChosen={bookmarkChosen} bookmarkOptions={bookmarkOptions}
                                                          setBookmark={setBookmark} saveNewBookmark={handleSaveNewBookmark}
                                                          deleteBookmark={handleDeleteOpen} originalSentence={currentSentence}
                                                          setEditOptionTools={() => setEditOptionTools('returnBookmark')}
                                                          handleRemoveEvent={handleRemoveEvent} handleAddEvent={handleAddEvent}/>
                                                  </div>
                                              </div>
                                          }
                                          {isShowingDeleteModal &&
                                            <MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Delete this Bookmark?`}/>}
                                               explain={<L p={p} t={`Are you sure you want to delete this bookmark?`}/>} isConfirmType={true}
                                               onClick={handleDeleteBookmark} />
                                          }
                                          {isShowingMissingBookmarkModal &&
                                            <MessageModal handleClose={handleMissingBookmarkClose} heading={<L p={p} t={`A Bookmark is not Chosen?`}/>}
                                               explainJSX={<L p={p} t={`Please choose a bookmark before attempting to delete a bookmark?`}/>} isConfirmType={false}
                                               onClick={handleMissingBookmarkClose} />
                                          }
                                      </div>
                                  </div>
                                  <ScrollSyncPane>
                                      <div className={classes(styles.editorDivAuthor, styles.editorBorder)}>
                                          <div id="editorDiv" className={styles.contentEditable}
                                              contentEditable={!isTranslation && isAuthor && editReview.modeChosen === 'edit'}
  																						dangerouslySetInnerHTML={{__html: authorWorkspace
  																								? authorWorkspace
  																								: isAuthor
  																										? `<div style="color: silver">Start writing here...</div>`
  																										: ``
  																						}}
  																				/>
                                      </div>
                                  </ScrollSyncPane>
                              </div>
                          </div>
                      </ScrollSync>
                  </div>
  		            {isShowingProgress &&
  		                <ProgressModal handleClose={handleProgressClose} heading={<L p={p} t={`Text Processing Progress`}/>}
  		                    progress={textProcessingProgress}/>
  		            }
  		            {isShowingProgress_imageEntry &&
  		                <ProgressModal handleClose={handleProgressClose} heading={<L p={p} t={`Please wait for the new image to load`}/>}/>
  		            }
  		            {isShowingMovedSentenceError &&
  		                <MessageModal handleClose={handleMovedSentenceErrorClose} heading={<L p={p} t={`Move Sentence Error`}/>}
  		                   explainJSX={<L p={p} t={`It is not allowed to choose a sentence that is already involved in a move.`}/>} isConfirmType={false}
  		                   onClick={handleMovedSentenceErrorClose} />
  		            }
  		            {isShowingCutPasteMessage &&
  		                <MessageModal handleClose={handleCutPasteMessageClose} heading={<L p={p} t={`Cut or Paste Error`}/>}
  		                   explainJSX={<L p={p} t={`You are not allowed to cut and paste on this page.  In order to move text, choose the Move mode and see the instructions.`}/>} isConfirmType={false}
  		                   onClick={handleCutPasteMessageClose} />
  		            }
  		            {isShowingEndOfDocument &&
  		                <MessageModal handleClose={handleEndOfDocumentClose} heading={<L p={p} t={`End of Document`}/>}
  		                   explainJSX={<L p={p} t={`You have reached the end of the document.`}/>} isConfirmType={false}
  		                   onClick={handleEndOfDocumentClose} />
  		            }
  								{isShowingPenspringHomework &&
  		                <MessageModal handleClose={handlePenspringHomeworkClose} heading={<L p={p} t={`Submit this homework?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to submit this homework?  The teacher will be able to see your penspring file with your assignment in eCademy app.`}/>} isConfirmType={true}
  		                   onClick={handlePenspringHomework} />
  		            }
  								{isShowingPenspringDistribute &&
  		                <MessageModal handleClose={handlePenspringDistributeOpen} heading={`Distribute this homework?`}
  		                   explainJSX={<L p={p} t={`Are you sure you want to distribute this homework?  The assignment will be copied to each student as if they were the oroginal authors.  You will become an editor to each assignment.  You will be able to see the penspring file in the eCademyApp gradebook when the student completes and submits their work.`}/>}
  											 isConfirmType={true} onClick={handlePenspringDistribute} />
  		            }
  		            {isShowingUpdateContentModal &&
  		                <LoadingModal handleClose={handleUpdateContentModalClose} loadingText={<L p={p} t={`Reprocessing`}/>} isLoading={fetchingRecord && !fetchingRecord.updateChapterText} />
  		            }
  		            {isShowingImageUpload &&
  		                <ImageUploadFileModal handleClose={handleImageUploadClose} sectionName={workSummary && workSummary.chapterName_current}
  		                    sentenceText={currentSentence} position={newImage.position} workId={workSummary && workSummary.workId} hrefId={currentHrefId}
  		                    chapterId={workSummary && workSummary.chapterId_current} languageId={workSummary && workSummary.languageId_current}
  		                    handleGetEditDetails={handleGetEditDetails} personId={personId} authorPersonId={workSummary && workSummary.authorPersonId}
  		                    handleSubmitImageAndWait={handleSubmitImageAndWait}/>
  		            }
  		        </div>
  		    )
}

// {isShowingLoadingModal &&
//     <LoadingModal handleClose={this.handleLoadingModalClose} loadingText={`Loading`} isLoading={fetchingRecord && !fetchingRecord.chapterText && !fetchingRecord.editDetails} />
// }

//value={chapterText}


// <Media query="(max-width: 799px)">
//   {matches =>
//     matches ? (
//       <p>The document is less than 600px wide.</p>
//     ) : (
//       <p ref={ref => {this.testThis = ref}}>The document is GREATER than 600px wide.</p>
//     )
//   }
// </Media>

//<Media query="(max-width: 599px)" ren der={() => <p>The document is less than 600px wide.</p>} />


//dangerouslySetInnerHTML={{__html: chapterTextWriterSide}}


//Scoring an assignment
						//score: '', part of the score function that isn't working due to the cursor location management or EditorDiv.
						//import InputText from '../../components/InputText';  part of the score function that isn't working due to the cursor location management or EditorDiv.

						//Due to the restoreSelection in the EditorDiv, this became a big problem as it was not yet possible to keep the user control in the editor control.  Not good. Not worth losing the coordinated cursor in editorDiv
						// onBlurScore = (event) => {
						// 		const {setGradebookScoreByPenspring, personId, workSummary } = this.props;
						// 		setGradebookScoreByPenspring(personId, workSummary.studentAssignmentResponseId, event.target.value);
						// }
						//
						// handleScore = (event) => {
						// 		this.setState({ score: event.target.value, isScoreUpdateOnly: true });
						// 		event.stopPropagation();
						// 		event.preventDefault();
						// }
						//
						// {/*!workSummary.isHomework
						// 		? ''
						// 		: workSummary.canEditScore || workSummary.accessRoleName === 'Facilitator' || true
						// 				? <div className={styles.inputBox}>
						// 							<InputText size={"super-short"}
						// 									label={`score  (${workSummary.totalPoints})`}
						// 									value={score || (workSummary && workSummary.score) || ''}
						// 									numberOnly={true}
						// 									onChange={(event) => this.handleScore(event)}
						// 									onBlur={(event) => this.onBlurScore(event)} />
						// 					</div>
						// 				: <TextDisplay label={`Score (${workSummary.totalPoints})`} text={workSummary.score || '- -'} />
						// */}



//<div className={styles.lineHeight}>Save<br/><div className={styles.smallText}><span>auto: </span><DateMoment date={saveWorkSpaceTime} format={'h:mm:ss a'} className={styles.buttonTimeDisplay}/></div></div>
//I took out the auto save message from the button since I was having trouble with chapterText bleeding over into the next document while making use of ComponentWillUnmount.  There were errors.
export default EditReviewView
