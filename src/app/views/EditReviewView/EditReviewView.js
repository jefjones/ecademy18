import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './EditReviewView.css';
const p = 'EditReviewView';
import L from '../../components/PageLanguage';
import EditTools from '../../components/EditTools';
import EditListNavigator from '../../components/EditListNavigator';
import SearchTextTool from '../../components/SearchTextTool';
import BookmarkTool from '../../components/BookmarkTool';
import MessageModal from '../../components/MessageModal';
import ProgressModal from '../../components/ProgressModal';
import ImageUploadFileModal from '../../components/ImageUploadFileModal';
import SentenceEdits from '../../components/SentenceEdits';
import EditorInstructions from '../../components/EditorInstructions';
import LoadingModal from '../../components/LoadingModal';
import TabPage from '../../components/TabPage';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateMoment from '../../components/DateMoment';
import Button from '../../components/Button';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import TextDisplay from '../../components/TextDisplay';
import Icon from '../../components/Icon';
import TextEditorTools from '../../components/TextEditorTools';
import ContextEditReview from '../../components/ContextEditReview';
import SlidingPane from 'material-ui/Drawer'; //http://www.material-ui.com
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import classes from 'classnames';
import * as serviceEditReview from '../../services/edit-review.js';
import debounce from 'lodash/debounce';
import {ScrollSync, ScrollSyncPane} from 'react-scroll-sync';
import ReactToPrint from "react-to-print";
import MediaQuery from 'react-responsive';
import {doSort} from '../../utils/sort';
//import Media from "react-media";

let savedCursorPosition = null;

const colorEditPending = "#e6f4ff";
const colorEditPending_RGB = "rgb(230, 244, 255)";
const colorCurrentFocus = "yellow";
const colorEditHistory = "#FDFADC";
const colorFullVersionView = "#F7FAF8";
const colorMoveSentence = "#e6f4ff"; //"#f9cec9"

// let colorMyEdit = "rgba(20, 167, 26, 0.05)";
// let colorMineAndOtherEditor = "rgba(20, 167, 48, 0.1)";
// let colorOtherEditor = "rgba(230, 155, 5, .1)";

const borderRadius  = "4px";
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

export default class EditReviewView extends Component {
    //If this is a new document, then include the Save button for the author, but if the author leaves the page with or without
    //  saving, then save the chapterText and process it for hrefId-s anyway.
    constructor(props) {
        super(props);

        this.state = {
            hasInitialized: false,
            tinyEditorInitialized: false,
            sidePanel_open: this.props.mediaQuery === 'large' || this.props.leftSidePanelOpen,
            sidePanel_docked: this.props.mediaQuery === 'large',
            errors: {},
            alreadyProcessed: false, //This is to be sure to get the ChapterText so that the tabText will be set right for Me
            editDetailsUpdated: 'empty',
            currentHrefId: '',
            currentSentence: '',
            stopKeypress: false,
            pointerSearchText: 0,
            pointerEditText: -1, //We need to start with -1 since it counts up from one and adds one to go from a zero-based length.
            pointedEditHrefId: '',
            searchText: '',
            arraySearchTextFound: [],
            pointerBookmark: -1, //Need to start with -1 since it is incremented by one before being sent to the bookmark tool and it needs to start as 0.
            bookmarkChosen: '', //this is an hrefId
            isShowingDeleteModal: false,
            isShowingMissingBookmarkModal: false,
            isShowingMovedSentenceError: false,
            isShowingCutPasteMessage: false,
            isShowingImageUpload: false,
						isShowingPenspringHomework: false,
            textSelection: {},
            isShowingProgress: false,
            isShowingProgress_imageEntry: false,
            timerId_progress: null,
            timerId_editDetails: null,
            timerId_imageEntry: null,
            searchChoice: '',
            showInstructions: false,
            newText: { hrefId: '', position: '' },
            newBreak: { hrefId: '', position: '' },
            deleteBreak: {hrefId: '', position: '' },
            moveSentence: {hrefId: '', moveArrayHrefId: [], position: '', stepCount: 0 },
            newImage: { hrefId: '', position: '' },
            savedCursorPosition: null,
            isShowingLoadingModal: false,
            isShowingUpdateContentModal: false,
            fetchingRecord: this.props.fetchingRecord && this.props.fetchingRecord.chapterText,
            isShowingEndOfDocument: false,
            saveWorkSpaceTime: new Date(),
						hideEditorsVersions: props.isEditor || (props.tabsData && props.tabsData.tabs && props.tabsData.tabs.length > 1) ? false : true,
        };
    }

		componentDidMount() {
        const {leftSidePanelOpen, toggleLeftSidePanelOpen, setBlankTextProcessingProgress, personId} = this.props;
        this.handleLoadingModalOpen();
        leftSidePanelOpen && toggleLeftSidePanelOpen(); //If the left side is open, then close it.
        //document.getElementById("editorDiv").focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        window.scrollTo(0, 1);
        setBlankTextProcessingProgress(personId);
        this.setState({saveSelection: serviceEditReview.setSaveSelectionFunction(window, document) });
        this.setState({restoreSelection: serviceEditReview.setRestoreSelectionFunction(window, document) })
				//`<div style="color: silver">Start writing here...</div>`
				document.getElementById('editorDiv').addEventListener('keyup', this.checkInitialPromptText); //This gets removed as soon as the start text is identified and removed.
				document.getElementById('editorDiv').addEventListener('keydown', this.checkEscapeKeyAndAutoSave); //keydown is required here in order to override the Ctrl+S default behavior of the browser so that it can be used to save the text by the author.
				document.getElementById('editorDiv').addEventListener('click', this.setCursorAtBeginningIfInit);
        //isAuthor && document.getElementById('editorDiv').addEventListener('blur', this.handleSaveAuthorWorkspace);  //Don't do this.  The editor's cursor gets lost
        //this.setState({ timerId_editDetails: setInterval(() => this.handleGetEditDetails(), 30000) });
    }

		componentDidUpdate() {
        //This is necessary in order to set the tab with the chapterText properly.  ChapterText comes through late so that the tabText
        //  would just appear without any edit backgrounds since the process occurred before the ChapterText was complete.
        const {personId, editReview, setEditorTabChosen, tabsData, isAuthor, isEditor, fetchingRecord, authorWorkspace, pendingNewImage,
							resolveFetchingRecordAuthorWorkspace } = this.props;
        const {currentHrefId, tabsInit, hasInitialized} = this.state;
        if (currentHrefId) this.highlightSentence(currentHrefId);

				if (!tabsInit && tabsData && tabsData.tabs && tabsData.tabs.length > 1) {
						this.setState({
								tabsInit: true,
								hideEditorsVersions: isEditor || (tabsData.tabs.length > 1) ? false : true,
						});
						if (isEditor) {
								let tabChoice = 1;
								tabsData.tabs.forEach((m, i) => {
										if (m.id === personId) tabChoice = i;
								})
								setEditorTabChosen(tabsData.tabs[tabChoice].id);
						} else if (isAuthor) {
								setEditorTabChosen(tabsData.tabs[1].id);
						}
				}

				//if (isEditor && editReview && editReview.length > 0 && !hasSetEditorsVersions) this.setState({ hasSetEditorsVersions: true, hideEditorsVersions: false })

        //This is specifically for the authorWorkspace when it is the author.  We want an initial copy of the authorWorkspace and then no React updates to it! The author commits their changes when they are ready.
				//This has changed for the time being.  The authorWorkspace might be an add-on feature controlled by personConfig.authorWorkspaceOn ... later.
        if (isAuthor && (fetchingRecord.authorWorkspace === 'ready' || (!document.getElementById('editorDiv').innerHTML && authorWorkspace && authorWorkspace.length > 0))) {
            if (pendingNewImage) {
                //if (authorWorkspace.indexOf(pendingNewImage) > -1) {
                    this.setState({ pendingNewImage: '' });
                    if (authorWorkspace) document.getElementById('editorDiv').innerHTML = authorWorkspace;
                    resolveFetchingRecordAuthorWorkspace();
                    //this.setSentenceClickFunction('edit', true); //true is force
                //}
            } else {
                if (authorWorkspace) document.getElementById('editorDiv').innerHTML = authorWorkspace;
                resolveFetchingRecordAuthorWorkspace();
                this.setSentenceClickFunction(editReview.modeChosen, true); //true is force
            }
        }
        if (!hasInitialized) {
            // if (isAuthor && authorWorkspace && authorWorkspace.length > 0) {
            //     if (authorWorkspace) document.getElementById('editorDiv').innerHTML = authorWorkspace;
            // }
            this.setState({ hasInitialized: true });
            //this.handleEditModeChosen('edit');
            this.setSentenceClickFunction(editReview.modeChosen, true); //true is force
        }
        //if (isEditor) {
            this.setSentenceClickFunction(editReview.modeChosen, true); //true is force
        //}
        // //Help toDo:  Is this needed?
        // // if ((!alreadyProcessed || (editDetailsUpdated === 'empty' && editDetails && editDetails.length > 0)) && tabsData && tabsData.tabs.length > 0) {
        // //     isDraftView ? this.handleDraftTabs(editReview.editorTabChosen) : this.handleEditorTabChosen(editReview.editorTabChosen);
        // //     this.setState({ alreadyProcessed: true });
        // //     if (editDetails && editDetails.length > 0) {        //         this.setState({ editDetailsUpdated: 'notEmpty'})
        // //     }
        // //     this.handleEditorTabChosen(params.chosenTabPersonId);
        // //     //this.setEditorTabText(editReview.editorTabChosen); //I don't think that this is needed since editReview store handles the automated update.
        // // }

        if (isEditor || (isAuthor && editReview.modeChosen !== 'edit')) {
            this.setSpansEvent('beforepaste', this.avoidCopyPaste);
            this.setSpansEvent('beforecopy', this.avoidCopyPaste);
            this.setSpansEvent('beforecut', this.avoidCopyPaste);
            this.setSpansEvent('paste', this.avoidCopyPaste);
            this.setSpansEvent('copy', this.avoidCopyPaste);
            this.setSpansEvent('cut', this.avoidCopyPaste);
        } else {
            this.setSpansEvent('beforepaste', () => {});
            this.setSpansEvent('beforecopy', () => {});
            this.setSpansEvent('beforecut', () => {});
            this.setSpansEvent('paste', () => {});
            this.setSpansEvent('copy', () => {});
            this.setSpansEvent('cut', () => {});
        }

				//This is used here so that when the file comes up or the first time that it won't set the focus in the editors - both for the prpose of the mobile phone's keyboard that woudl come up immediately so that the user can't see most of the page to get used to it.  Plus, when starting to write a file, it seems to jump around at first.
				if (document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML !== "" && document.getElementById('editorDiv').innerHTML !== `<div style="color: silver">Start writing here...</div>`) {
						document.getElementById('editorDiv').focus();
						this.delayedRestoreSelection(document.getElementById('editorDiv'), savedCursorPosition);
						if (document.getElementById('tabView')) {
				        let spans = document.getElementById('tabView').getElementsByTagName('svg');
				        for(let i = 0; i < spans.length; i++) {
				            if (spans && spans[i] && spans[i].id) {
				                spans[i].onclick = () => {
														this.handleEditChosen(spans[i].id);
														this.showContextEditReview(event, spans[i].id);
												}
				                spans[i].oncontextmenu = (event) => {
				                    event.stopPropagation();
				                    event.preventDefault();
				                    this.showContextEditReview(event, spans[i].id);
				                }
				            }
								}
		        }
			 	}
    }

		setSavedCursorPosition = () => {
				const {saveSelection} = this.state;
				savedCursorPosition = saveSelection(document.getElementById('editorDiv'));
		}

    showContextEditReview = (event, icon_elementId) => {
				const {leftSidePanelOpen} = this.props;
				const {sidePanel_open} = this.state;
        this.handleEditChosen(icon_elementId);
				let minusLeftPanelWidth = (sidePanel_open || leftSidePanelOpen) ? 300 : 0

        document.getElementById('contextEditReview').style.display = 'inline';
        document.getElementById('contextEditReview').style.position = 'absolute';
        document.getElementById('contextEditReview').style.left = event.clientX - 30 - minusLeftPanelWidth;
        document.getElementById('contextEditReview').style.top = event.clientY + 7;
    }

    writerHrefId = (elementId) => {
        if (elementId && elementId.length > 0 && elementId.indexOf('~!') > -1) {
            let newElementId = elementId.replace(/\~\!/g, '~^');  //eslint-disable-line
            return newElementId;
        }
        return elementId;
    }

    standardHrefId = (elementId) => {
        if (elementId && elementId.length > 0 && elementId.indexOf('~^') > -1) {
            let newElementId = elementId.replace(/\~\^/g, '~!');  //eslint-disable-line
            return newElementId;
        }
        return elementId;
    }

    setMediaQuery = (size) => {
        this.setState({ mediaQuerySize: size });
    }

    handleShowInstructions = (boolShow) => {
        this.setState({ showInstructions: boolShow});
    }

    highlightSentence = (hrefId, color=colorCurrentFocus, writerSide) => {
        const {isAuthor} = this.props;
        hrefId = writerSide ? this.writerHrefId(hrefId) : this.standardHrefId(hrefId);
				let theOtherhrefIdType = hrefId.indexOf('~^') > -1 ? hrefId.replace('~^', '~!') : hrefId.replace('~!', '~^');
        if (document.getElementById(hrefId)) {
            if (color !== colorEditPending) {
                document.getElementById(hrefId).style.color = "black";
                document.getElementById(hrefId).style.backgroundColor = color;
                document.getElementById(hrefId).style.borderRadius = borderRadius;
            } else if (color === colorEditPending) {
                document.getElementById(hrefId).style.color = "red";
                document.getElementById(hrefId).style.backgroundColor = 'white';
            }
        }
				if (!(isAuthor && theOtherhrefIdType.indexOf('~^') > -1) && document.getElementById(theOtherhrefIdType)) {
            if (color !== colorEditPending) {
                document.getElementById(theOtherhrefIdType).style.color = "black";
                document.getElementById(theOtherhrefIdType).style.backgroundColor = color;
                document.getElementById(theOtherhrefIdType).style.borderRadius = borderRadius;
            } else if (color === colorEditPending) {
                document.getElementById(theOtherhrefIdType).style.color = "red";
                document.getElementById(theOtherhrefIdType).style.backgroundColor = 'white';
            }
        }
    }

    setIconChosen = (editChosen) => {
        this.decreaseAllIconOpacity(editChosen.id);
        if (editChosen.editTypeName !== "edit") {
            if (editChosen.editTypeName === "sentenceMove") {
                if (document.getElementById('target' + editChosen.position + editChosen.id)) document.getElementById('target' + editChosen.position + editChosen.id).style.opacity = 1;
                if (document.getElementById('moveBegin' + editChosen.position + editChosen.id)) document.getElementById('moveBegin' + editChosen.position + editChosen.id).style.opacity = 1;
                if (document.getElementById('moveEnd' + editChosen.position + editChosen.id)) document.getElementById('moveEnd' + editChosen.position + editChosen.id).style.opacity = 1;
            } else {
                if (document.getElementById(editChosen.editTypeName + editChosen.position + editChosen.id)) document.getElementById(editChosen.editTypeName + editChosen.position + editChosen.id).style.opacity = 1;
            }
        }
    }
    createTarget = (beginOrEnd) => {
        let target = "<svg id='target";
        target += beginOrEnd === "Begin" ? "Begin'" : "End'";
        target += " style=' cursor:pointer; position: relative; top: 2px; width: 18px; height: 18px;' viewBox='0 0 20 20'><g><path d='M9.5 1c-0.276 0-0.5 0.224-0.5 0.5v4c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-4c0-0.276-0.224-0.5-0.5-0.5z' fill='#0000FF'></path><path d='M9.5 15c-0.276 0-0.5 0.224-0.5 0.5v4c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-4c0-0.276-0.224-0.5-0.5-0.5z' fill='#0000FF'></path><path d='M5 10.5c0-0.276-0.224-0.5-0.5-0.5h-4c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h4c0.276 0 0.5-0.224 0.5-0.5z' fill='#0000FF'></path><path d='M18.5 10h-4c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5z' fill='#0000FF'></path><path d='M16.21 9c-0.216 0-0.414-0.14-0.479-0.357-0.628-2.111-2.263-3.746-4.374-4.374-0.265-0.079-0.415-0.357-0.337-0.622s0.357-0.415 0.622-0.337c1.187 0.353 2.28 1.006 3.161 1.886s1.533 1.974 1.886 3.161c0.079 0.265-0.072 0.543-0.337 0.622-0.048 0.014-0.096 0.021-0.143 0.021z' fill='#0000FF'></path><path d='M11.5 17.71c-0.216 0-0.414-0.14-0.479-0.357-0.079-0.265 0.072-0.543 0.337-0.622 2.11-0.628 3.745-2.263 4.374-4.374 0.079-0.265 0.357-0.415 0.622-0.337s0.415 0.357 0.337 0.622c-0.353 1.187-1.006 2.28-1.886 3.161s-1.973 1.533-3.161 1.886c-0.048 0.014-0.096 0.021-0.143 0.021z' fill='#0000FF'></path><path d='M7.5 17.71c-0.047 0-0.095-0.007-0.143-0.021-1.187-0.353-2.28-1.005-3.161-1.886s-1.533-1.973-1.886-3.161c-0.079-0.265 0.072-0.543 0.337-0.622s0.543 0.072 0.622 0.337c0.628 2.11 2.263 3.745 4.374 4.373 0.265 0.079 0.415 0.357 0.337 0.622-0.065 0.217-0.264 0.358-0.479 0.358z' fill='#0000FF'></path><path d='M2.79 9c-0.047 0-0.095-0.007-0.143-0.021-0.265-0.079-0.415-0.357-0.337-0.622 0.353-1.187 1.006-2.28 1.886-3.161s1.973-1.533 3.161-1.886c0.265-0.079 0.543 0.072 0.622 0.337s-0.072 0.543-0.337 0.622c-2.11 0.628-3.745 2.263-4.373 4.374-0.065 0.217-0.264 0.358-0.479 0.358z' fill='#0000FF'></path></g></svg>";

        return target;
    }

    handleGetEditDetails = () => {
        const {personId, workSummary, includeHistory, getEditDetails} = this.props;
        getEditDetails(personId, workSummary.workId, workSummary.chapterId_current, workSummary.languageId_current, includeHistory);
    }

    findBeginOrEnd = (elementId) => {
        if (elementId.indexOf('Begin') > -1) {
            return 'Begin';
        } else if (elementId.indexOf('End') > -1) {
            return 'End';
        } else {
            return '';
        }
    }

    handleRemoveEvent = () => {
        this.setSpansEvent('click', () => {});
        this.setSpansEvent('keyup', () => {});
        this.setSpansEvent('keydown', () => {});
        this.setSpansEvent('blur', () => {});
        this.setSpansEvent('mouseup', () => {});
    }

    handleAddEvent = () => {
        this.setSpansEvent('keyup', this.checkForKeypress); //This keyup event is always added and not taken a way between mode changes.  This however is for the use of the bookmark tool in order to add a bookmark name.
        //this.setSpansEvent('keydown', this.checkForEnterKeypress);
        this.setSentenceClickFunction(this.props.editReview.modeChosen);
    }

    handleSentenceChosen = (hrefId, skipScrollTo=false) => {
        const {setSentenceChosen} = this.props;
        const {currentHrefId} = this.state;
        hrefId = this.writerHrefId(hrefId);
        let sentenceHrefId = hrefId.substring(hrefId.indexOf('~'));
        this.revertEditBackgroundColorByPendingOrNot(this.standardHrefId(currentHrefId));
        let elementFound = document.getElementById(sentenceHrefId);
        if (elementFound) {
            !skipScrollTo && this.editorDivScrollTo(elementFound);
            this.setState({ currentHrefId: elementFound.id, currentSentence: elementFound.innerHTML});
            if (hrefId.indexOf('breakNew') > -1 || hrefId.indexOf('breakDelete') > -1) {
                this.highlightSentence(hrefId);
            } else {
                this.highlightSentence(sentenceHrefId);
            }
        }
        this.handleEditChosen(hrefId);
        setSentenceChosen(sentenceHrefId);
    }

    handleAcceptEditDetail = (personId, workId, workSummary, acceptedEditDetailId, isAuthorAcceptedEdit) => {
        const {setAcceptedEdit} = this.props;
        const {currentHrefId} = this.state;
        let editDetailId = acceptedEditDetailId ? acceptedEditDetailId : currentHrefId && currentHrefId.substring(currentHrefId.indexOf('^^!') + 3);
        this.handleWorkspaceEditAccept(editDetailId);
        // let moveSentence = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === acceptedEditDetailId)[0];
        // if (moveSentence) {
        //     this.handleCleanMoveEditDetail(personId, acceptedEditDetailId); //Clean out the svg-s before the moves are done, otherwise there is svg details to work around which causes errors.
        //     document.getElementById('editorDiv').innerHTML = serviceEditReview.setMovedTextIntoPlace(document.getElementById('editorDiv').innerHTML, moveSentence);
        // }
        setAcceptedEdit(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, editDetailId, isAuthorAcceptedEdit);
        this.handleEditChosen(''); //Blank out the edit chosen now that the edit is gone.
    }

    handleDeleteEditDetail = (editDetailId) => {
        const {personId, deleteEditDetail, editDetails, editReview, setEditorTabChosen} = this.props;
        const {currentHrefId} = this.state;
        this.handleCleanMoveEditDetail(personId, editDetailId);
        //It is possible that the editReview.editCounts.editDetailId did not return an editDetailId.  This is a catch below to pick it up in case it didn't make it.
        let catchEditDetailId = '';
        if (!editDetailId) catchEditDetailId = editDetails.filter(m => m.editTypeName === editReview.modeChosen && m.hrefId === currentHrefId && !m.isComment)[0].editDetailId;
        deleteEditDetail(personId, editDetailId || catchEditDetailId);
        if (editReview.modeChosen === 'edit') {
            let findEditDetail = editDetails.filter(m => m.editDetailId === editDetailId);
            let previousOriginalText = findEditDetail && findEditDetail.length > 0 ? findEditDetail[0].authorText : false;
            let hrefId = findEditDetail && findEditDetail.length > 0 ? findEditDetail[0].hrefId : false;
            if (previousOriginalText && hrefId) {
                document.getElementById(hrefId).innerHTML = previousOriginalText;
            }
        }
        //If the editor does not have any more edits, their tab will disappear.  Set the tab to the currently entered person in that case.
        let editorEditCount = editDetails && editDetails.length > 0
            && editDetails.filter(m => m.personId === editReview.editorTabChosen && m.editTypeName === editReview.modeChosen && m.editDetailId !== editDetailId);
        if (!editorEditCount || editorEditCount.length === 0) {
            setEditorTabChosen(personId);
        }
    }

    handleCleanMoveEditDetail = (personId, editDetailId) => {
        const {editDetails} = this.props;
        let cleanSentenceMove = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId && m.editTypeName === 'sentenceMove')[0];
        if (cleanSentenceMove) {
            if (cleanSentenceMove.hrefId)  {
                document.getElementById(cleanSentenceMove.hrefId).style.backgroundColor = '';
                document.getElementById(cleanSentenceMove.hrefId).style.color = 'black';
            }
            if (cleanSentenceMove && cleanSentenceMove.moveArrayHrefId && cleanSentenceMove.moveArrayHrefId.length > 0) {
                for(let i = 0; i < cleanSentenceMove.moveArrayHrefId.length; i++) {
                    document.getElementById(cleanSentenceMove.moveArrayHrefId[i]).style.backgroundColor = '';
                    document.getElementById(cleanSentenceMove.moveArrayHrefId[i]).style.color = 'black';
                }
                if (document.getElementById('target'+cleanSentenceMove.hrefId)) document.getElementById('target'+cleanSentenceMove.hrefId).parentNode.removeChild(document.getElementById('target'+cleanSentenceMove.hrefId));
                if (document.getElementById('moveBegin'+cleanSentenceMove.hrefId)) document.getElementById('moveBegin'+cleanSentenceMove.hrefId).parentNode.removeChild(document.getElementById('moveBegin'+cleanSentenceMove.hrefId));
                if (document.getElementById('moveEnd'+cleanSentenceMove.hrefId)) document.getElementById('moveEnd'+cleanSentenceMove.hrefId).parentNode.removeChild(document.getElementById('moveEnd'+cleanSentenceMove.hrefId));
            }
        }
    }

    editorDivScrollTo = (element, minus=170) => {
        // //const duration = 500;
        // let topPos = element && element.offsetTop;
        // topPos -= minus;
        // topPos = topPos < 0 ? 0 : topPos;
        let node = ReactDOM.findDOMNode(element);
        node.scrollIntoView();
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

    deleteEditStepRecords = () => {
        const {newBreak, deleteBreak, moveSentence, newImage} = this.state;
        //These two removals include the newBreka, deleteBreak and part of the moveSentence removal, as well.
        if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
        if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));

        if (newBreak && newBreak.hrefId) this.revertEditBackgroundColorByPendingOrNot(newBreak.hrefId);
        if (deleteBreak && deleteBreak.hrefId) this.revertEditBackgroundColorByPendingOrNot(deleteBreak.hrefId);
        if (moveSentence && moveSentence.hrefId) this.revertEditBackgroundColorByPendingOrNot(moveSentence.hrefId);
        if (newImage && newImage.hrefId) this.revertEditBackgroundColorByPendingOrNot(newImage.hrefId);

        if (moveSentence && moveSentence.moveArrayHrefId && moveSentence.moveArrayHrefId.length > 0) {
            if (document.getElementById('target'+moveSentence.hrefId)) document.getElementById('target'+moveSentence.hrefId).parentNode.removeChild(document.getElementById('target'+moveSentence.hrefId));
            if (document.getElementById('target'+moveSentence.position+moveSentence.hrefId)) document.getElementById('target'+moveSentence.position+moveSentence.hrefId).parentNode.removeChild(document.getElementById('target'+moveSentence.position+moveSentence.hrefId));
            if (document.getElementById('moveBegin'+moveSentence.hrefId)) document.getElementById('moveBegin'+moveSentence.hrefId).parentNode.removeChild(document.getElementById('moveBegin'+moveSentence.hrefId));
            if (document.getElementById('moveEnd'+moveSentence.hrefId)) document.getElementById('moveEnd'+moveSentence.hrefId).parentNode.removeChild(document.getElementById('moveEnd'+moveSentence.hrefId));
            for(let i = 0; i < moveSentence.moveArrayHrefId.length; i++) this.revertEditBackgroundColorByPendingOrNot(moveSentence.moveArrayHrefId[i]);
        }
        //This needs to come last so the sentences have a chance to return back to their background color, depending on if there is an edit fount there or not.
        this.setState({
            newBreak: { hrefId: '', position: '' },
            deleteBreak: {hrefId: '', position: '' },
            moveSentence: {hrefId: '', moveArrayHrefId: '', position: '', stepCount: 0 },
            newImage: {hrefId: '', position: '' },
            showInstructions: false,
        });
    }

    setAddInstructions = (setBool) => {
        if (setBool === false) {
            this.deleteEditStepRecords();
            this.handleEditModeChosen('edit');
        }
        this.setState({ showInstructions: setBool });
    }

    handleEditModeChosen = (choice, event) => {
        const {editReview, updateAuthorWorkspace, isAuthor, personId, workId, workSummary, leftSidePanelOpen, toggleLeftSidePanelOpen} = this.props;
        this.highlightSentence(this.state.currentHrefId, '', true);
        leftSidePanelOpen && toggleLeftSidePanelOpen();

        if (choice === 'edit') {
            this.setState({ showInstructions: false });
            //this.setSentenceClickFunction('edit');
        } else if (isAuthor) {
            	updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
        }
        this.deleteEditStepRecords(); //Reset all of the records if the editMode changes.
        if (editReview.modeChosen !== choice) {
            this.props.setModeChosen(choice);
            this.setSentenceClickFunction(choice);
        }
    }

    avoidCopyPaste = (e) => {
        e.preventDefault();
        e.returnValue = false;
        this.handleCutPasteMessageOpen();
    }

		setCursorAtBeginningIfInit = () => {
				if (document.getElementById('editorDiv').innerHTML === `<div style="color: silver">Start writing here...</div>`) {
						var el = document.getElementById("editorDiv");
						var range = document.createRange();
						var sel = window.getSelection();
						range.setStart(el.childNodes[0].childNodes[0], 0);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
				}
				this.setSavedCursorPosition();
		}

		checkInitialPromptText = (evt) => {
				//const {isAuthor} = this.props;
				if (document.getElementById('editorDiv').innerHTML === `<div style="color: silver">Start writing here...</div>`) {
						document.getElementById('editorDiv').innerHTML = document.getElementById('editorDiv').innerHTML.replace(`<div style="color: silver">Start writing here...</div>`, ``);
				}
        document.getElementById('editorDiv').removeEventListener('keydown', this.checkInitialPromptText);
				// if (isAuthor && evt.key === 'Tab') {
				// 		evt.preventDefault();  // this will prevent us from tabbing out of the editor
		    //      var editor = document.getElementById("editorDiv");
		    //      var doc = editor.ownerDocument.defaultView;
		    //      var sel = doc.getSelection();
		    //      var range = sel.getRangeAt(0);
				// 		 var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0");
		    //      //var tabNode = document.createTextNode("\u0009");
		    //      range.insertNode(tabNode);
		    //      range.setStartAfter(tabNode);
		    //      range.setEndAfter(tabNode);
		    //      sel.removeAllRanges();
		    //      sel.addRange(range);
				//  }
				//  this.setSavedCursorPosition();
    }

    checkEscapeKeyAndAutoSave = (evt) => {
				const {isAuthor, leftSidePanelOpen, toggleLeftSidePanelOpen} = this.props;
        if (evt.key === 'Escape') {
            leftSidePanelOpen && toggleLeftSidePanelOpen();
            this.hideContextEditReviewMenu();
        }
				if (isAuthor) {
						this.handleSaveAuthorWorkspace(evt.key === 'Enter' || evt.key === '' || !evt.key);
						//this.setSavedCursorPosition();  This happens in handleSaveAuthorWorkspace if it is not skipUpdate = true
				}
        if (evt.key === 's' && evt.ctrlKey) {
            evt && evt.stopPropagation();
            evt && evt.preventDefault();
            this.saveByButtonPress();
            evt && evt.stopPropagation();
            evt && evt.preventDefault();
        }
    }

    hideContextEditReviewMenu = () => {
        if(document.getElementById('contextEditReview')) document.getElementById('contextEditReview').style.display = 'none';
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {fetchingRecord} = this.props;

        if (nextProps.editDetails !== this.props.editDetails
                || nextProps.editReview !== this.props.editReview
                || nextProps.workSummary !== this.props.workSummary
                || nextProps.authorWorkspace !== this.props.authorWorkspace
                || nextState !== this.state
                || !!this.state.pendingNewImage
                || (fetchingRecord && fetchingRecord.authorWorkspace)) {
            return true
        } else {
            return false;
        }
    }

    handleTextSelectionChange = (event) => {
        // const {editReview} = this.props;
        // const {saveSelection} = this.state;
        // savedCursorPosition = saveSelection(document.getElementById('editorDiv'), editReview.sentenceChosen);
        // if (savedCursorPosition.isHrefIdChange) {
        //     this.sentenceClick(null, savedCursorPosition.newElement);
        // }
    }

    componentWillUnmount() {
        // const {saveLastVisitedHrefId, personId, workSummary, workId, updatePersonConfigNotPersist, toggleDraftView, isDraftView, setBlankTextProcessingProgress,
				// 				leftSidePanelOpen, toggleLeftSidePanelOpen, isAuthor, clearAuthorWorkspace, clearChapterText} = this.props;
				const {clearAuthorWorkspace, clearChapterText} = this.props;

        // leftSidePanelOpen && toggleLeftSidePanelOpen();
				// isAuthor && this.handleSaveAuthorWorkspace();
				// saveLastVisitedHrefId(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, this.state.currentHrefId);
        // if (isAuthor) {
        //     //this.handleAuthorProcessText(); //Yes, do this after all : [Don't do this here.  The author needs to commit the changes, otherwise, this could happen at any time and make an unintended update.]
        // }
        // updatePersonConfigNotPersist(personId); //We might not want to use this is we just want the user to choose a personConfig action and not have to confirm that they want it long term by making a second choice.
        // isDraftView && toggleDraftView();
        clearInterval(this.state.timerId_progress);
        clearInterval(this.state.timerId_editDetails);
        clearInterval(this.state.timerId_imageEntry);
        // setBlankTextProcessingProgress(personId);
        document.getElementById('editorDiv').innerHTML = ''; //This needs to clear out to get ready for the next authorWorkspace which might be a different document.  Otherwise, the previous one shows up.  Not good.
				clearChapterText();
        clearAuthorWorkspace();
        document.getElementById('editorDiv').removeEventListener('keyup', this.checkForKeypress);
				document.getElementById('editorDiv').removeEventListener('keydown', this.checkInitialPromptText);
				document.getElementById('editorDiv').removeEventListener('click', this.setCursorAtBeginningIfInit);
        //isAuthor && document.getElementById('editorDiv').removeEventListener('blur', this.handleSaveAuthorWorkspace);
    }

    handleProgressClose = () => {
        const {setBlankTextProcessingProgress, personId} = this.props;
        this.setState({ isShowingProgress: false })
        clearInterval(this.state.timerId_progress);
        setBlankTextProcessingProgress(personId);
    }

    handleProgressOpen = () => {
        const {getTextProcessingProgress, personId} = this.props;
        this.setState({
            isShowingProgress: true,
            timerId_progress: setInterval(() => getTextProcessingProgress(personId), 1000)
        });
    }

    handleImageEntryProgressOpen = () => this.setState({ isShowingProgress_imageEntry: true });
    handleImageEntryProgressClose = () => this.setState({ isShowingProgress_imageEntry: false });

    getSelectionContainerElement = () => {
        var range, sel, container;
        if (document.selection && document.selection.createRange) {
            // IE case
            range = document.selection.createRange();
            return range.parentElement();
        } else if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt) {
                if (sel.rangeCount > 0) {
                    range = sel.getRangeAt(0);
                }
            } else {
                // Old WebKit selection object has no getRangeAt, so
                // create a range from other selection properties
                range = document.createRange();
                range.setStart(sel.anchorNode, sel.anchorOffset);
                range.setEnd(sel.focusNode, sel.focusOffset);

                // Handle the case when the selection was selected backwards (from the end to the start in the document)
                if (range.collapsed !== sel.isCollapsed) {
                    range.setStart(sel.focusNode, sel.focusOffset);
                    range.setEnd(sel.anchorNode, sel.anchorOffset);
                }
            }

            if (range) {
               container = range.commonAncestorContainer;

               // Check if the container is a text node and return its parent if so
               return container.nodeType === 3 ? container.parentNode : container;
            }
        }
    }

    checkForEnterKeypress = (evt) => {
        //The author should be able to use the Enter key on their own tab.
        const {isEditor} = this.props;
        const {saveSelection} = this.state;
        savedCursorPosition = saveSelection(document.getElementById('editorDiv'));
        if (evt.key === 'Enter' && isEditor) {
            evt && evt.stopPropagation();
            evt && evt.preventDefault();
            return false;
        }
    }

    checkForKeypress = (evt) => {
        const {editReview, isEditor, isAuthor} = this.props;
        const {currentHrefId, saveSelection} = this.state; //restoreSelection

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
            let newElement = this.checkEventForValidHrefId(null, null, this.getSelectionContainerElement());
            //if (!savedCursorPosition) savedCursorPosition = saveSelection(document.getElementById('editorDiv'), newElement && newElement.id);
            if (newElement && newElement.id && newElement.nodeName === "SPAN") {
                if (newElement && savedCursorPosition && (savedCursorPosition.isHrefIdChange || !savedCursorPosition.isHrefIdChange)) { //The ! statement handles the situation when the user starts and there isn't a sentence chosen yet.
                    if (isEditor) {
                        this.sentenceClick(null, newElement);
                    }
                }
                if (isAuthor && editReview.modeChosen === 'edit') {
                    savedCursorPosition = saveSelection(document.getElementById('editorDiv'), newElement && newElement.id);
                    this.sentenceClick(null, newElement);
                    //20020306 document.getElementById('editorDiv').focus();
                    //20020306 restoreSelection(document.getElementById('editorDiv'), savedCursorPosition);
                }
            }
        } else if (isAuthor && editReview.modeChosen === 'edit') {
            //this.sentenceClick(null);
        }
        //This is a problem here since it is refreshing the state and the cursor is lost when the author is logged in.
        //document.getElementById(this.writerHrefId(currentHrefId)) && this.setState({currentSentence: document.getElementById(this.writerHrefId(currentHrefId)).innerHTML });

        if (isAuthor) {
            savedCursorPosition = saveSelection(document.getElementById('editorDiv'), currentHrefId);
            this.handleSaveAuthorWorkspace();  //This is controlled by lodash's debounce so that it really only gets launched every few seconds and not on every change.
        }

        if (evt.key === 'Escape') {
            this.props.leftSidePanelOpen && this.props.toggleLeftSidePanelOpen();
            this.hideContextEditReviewMenu();
        }
    }

    handleSaveAuthorWorkspace = debounce((skipUpdate=false) => {
        const {updateAuthorWorkspace, personId, workId, workSummary} = this.props;
        //const {restoreSelection} = this.state;
				if (!skipUpdate) {
		        this.setSavedCursorPosition();
						this.handleAuthorProcessText() //This was put in as we did away with the "commit changes" button which we will probably use again for a feature called personConfig.authorWorkspaceOn
		        let authorWorkspace = document.getElementById('editorDiv');
		        let svgs = authorWorkspace.querySelectorAll('[id^=target]');
		        for(let i = 0; i < svgs.length; i++) {
		            if (svgs[i]) {
		                svgs[i].parentNode.removeChild(svgs[i]);
		            }
		        }
		        updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, authorWorkspace.innerHTML);
		        this.setState({ saveWorkSpaceTime: new Date(), tabsInit: false })
						//20020306 document.getElementById('editorDiv').focus();
						//20020306 restoreSelection(document.getElementById('editorDiv'), savedCursorPosition);
				}
    }, 5000);

		delayedRestoreSelection = debounce((editorDivControl, savedCursorPosition) => {
				const {restoreSelection} = this.state;
				restoreSelection(editorDivControl, savedCursorPosition)
		}, 1000);

		saveByButtonPress = () => {
				const {updateAuthorWorkspace, personId, workId, workSummary} = this.props;
				this.handleAuthorProcessText() //This was put in as we did away with the "commit changes" button which we will probably use again for a feature called personConfig.authorWorkspaceOn
        let authorWorkspace = document.getElementById('editorDiv');
        let svgs = authorWorkspace.querySelectorAll('[id^=target]');
        for(let i = 0; i < svgs.length; i++) {
            if (svgs[i]) {
                svgs[i].parentNode.removeChild(svgs[i]);
            }
        }
        updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, authorWorkspace.innerHTML);
        this.setState({ saveWorkSpaceTime: new Date() })
		}

    handleAuthorProcessText = () => {
        const {personId, authorPersonId, authorWorkspace, workId, workSummary, updateContent, personConfig, isAuthor} = this.props;
				const {restoreSelection} = this.state;
        if (isAuthor) {
            let chapterTextSend = document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML;
            if (authorWorkspace !== chapterTextSend) {
                this.deleteEditStepRecords();
                this.cleanSVGs("target");
                //remove the background style of any hrefId's (notice the left-side hrefId type: ~^)
                let hrefSpans = document.querySelectorAll('[id^="~^"]');
                for(let i = 0; i < hrefSpans.length; i++) {
                    if (hrefSpans && hrefSpans[i]) {
                        hrefSpans[i].style.backgroundColor = '';
                        hrefSpans[i].style.color = '';
                    }
                }
                //The hrefId type gets changed back to standard in updateContent before it gets sent off, ~!
                updateContent(personId, authorPersonId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv') ? document.getElementById('editorDiv').innerHTML : '', personConfig.historySentenceView, true); //true is trackFetch
            }
						document.getElementById('editorDiv').focus();
						restoreSelection(document.getElementById('editorDiv'), savedCursorPosition);
        }
    }

    cleanSVGs = (prefix) => {
        //Be aware that the icons are generally svg's, but the
        let svgs = document.querySelectorAll('[id^=' + prefix + ']');
        for(let i = 0; i < svgs.length; i++) {
            if (svgs[i]) {
                svgs[i].parentNode.removeChild(svgs[i]);
            }
        }
    }

    jumpToEdit = (strNextOrPrev) => {
        const {editDetails, editReview} = this.props;
        const {pointerEditText, pointerEditHrefId, currentHrefId} = this.state
        let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN');
        let reachedCurrentHrefId = false;
        let indexCount = strNextOrPrev === "NEXT" ? 0 : spans.length;
        function indexCheck(indexValue) {
            return  strNextOrPrev === "NEXT" ? indexValue < spans.length : indexValue > 0;
        }

        let nextPointer = pointerEditText;
        let totalCount = editDetails && editDetails.length > 0 && editDetails.filter(m => m.personId === editReview.editorTabChosen).length;
        if (strNextOrPrev === "PREV") {
            nextPointer -= 1;
            nextPointer = nextPointer < 0 ? 0 : nextPointer;
        } else if (strNextOrPrev === "NEXT") {
            nextPointer += 1;
            nextPointer = nextPointer > totalCount-1 ? totalCount-1 : nextPointer;
        }
        if (pointerEditHrefId === '') {

        }
        this.setState({pointerEditText: nextPointer});

        for(indexCount; indexCheck(indexCount); strNextOrPrev === "NEXT" ? indexCount++ : indexCount--) {
            if (spans[indexCount] && String(spans[indexCount].id).indexOf('~!') > -1
                    && (!currentHrefId || reachedCurrentHrefId || (currentHrefId === spans[indexCount].id))) {

                reachedCurrentHrefId = true;
                if (currentHrefId === spans[indexCount].id) continue; //Go one more to get past this one before looking for the next in the code below.

                if (spans[indexCount].style.backgroundColor) {
                    //document.getElementById(spans[indexCount].id).focus();
                    this.revertEditBackgroundColorByPendingOrNot(currentHrefId);  //Set the previous one back to its edit background color instead of yellow highlighted
                    this.highlightSentence(spans[indexCount].id);
                    this.editorDivScrollTo(document.getElementById(spans[indexCount].id));
                    this.handleSentenceChosen(currentHrefId);
                    break;
                }
            }
        }
    }

    saveEditOrComment = (hrefId) => (authorSentence) => (isComment) => (editText) => (acceptedEditDetailId, isAuthorAcceptedEdit) => {
        const {updateAuthorWorkspace, personId, workId, workSummary, setEditDetail, setAcceptedEdit, originalSentence, editReview, draftComparison} = this.props;
        if (!isComment && acceptedEditDetailId) this.handleWorkspaceEditAccept(acceptedEditDetailId);
        if (originalSentence !== editText || isComment) {
            //Even if this is a match because the editor agreed with another editor, we're letting it go in because the edit still
            //  needs to show up for the agreeing editor.  And they might end up changing it a little bit more anyway.  So this will need to
            //  be cut out if it still matches when the author goes to see the list of edits.  That is some overhead for the server but I
            //  think that it is necessary to keep the true flow of edits for the agreeing editor.
            setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, hrefId, editText, isComment, 'edit');
            if (editText === '[<i>erased</i>]') {
                let htmlBody = document.getElementById('editorDiv').innerHTML;
                htmlBody = serviceEditReview.eraseSentenceAuthorWorkspace(htmlBody, this.writerHrefId(hrefId));
                document.getElementById('editorDiv').innerHTML = htmlBody;
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
                //this.handleEditModeChosen('edit');
                document.getElementById(this.standardHrefId(hrefId)).innerHTML = '<strike>' + document.getElementById(this.standardHrefId(hrefId)).innerHTML + '</strike>';
            }
        }
        if (!isComment) {
            setAcceptedEdit(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, acceptedEditDetailId, isAuthorAcceptedEdit);
            if (!(personId === workSummary.authorPersonId && editText === '[<i>erased</i>]') &&
                  (!draftComparison || (draftComparison && draftComparison[editReview.editorTabChosen].isCurrent))) {
                if (document.getElementById(hrefId)) document.getElementById(hrefId).innerHTML = editText;
            }
        }
        this.revertEditBackgroundColorByPendingOrNot(hrefId);
    }

    handleWorkspaceEditAccept = (editDetailId) => {
        const {editDetails, updateAuthorWorkspace, personId, workId, workSummary, editorColors} = this.props;
        let edit = (editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]) || [];
        if (!!edit) {
            if (edit.editTypeName === 'edit' && document.getElementById(this.writerHrefId(edit.hrefId))) {
                this.highlightSentence(this.writerHrefId(edit.hrefId), colorCurrentFocus, true); //Blank out the highlight. //true is for writerSide hrefId type.
                if (!edit.isComment) {
                   document.getElementById(this.writerHrefId(edit.hrefId)).innerHTML = edit.editText;
                   this.handleSaveAuthorWorkspace();
                }
            } else if (edit.editTypeName === 'breakNew') {
                let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html");
                htmlDoc = serviceEditReview.breakNewAuthorWorkspace(htmlDoc, this.writerHrefId(edit.hrefId), edit.position, editorColors)
                document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML;
                this.highlightSentence(this.writerHrefId(edit.hrefId), '', true); //Blank out the highlight. //true is for writerSide hrefId type.
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
            } else if (edit.editTypeName === 'breakDelete') {
                let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html");
                htmlDoc = serviceEditReview.breakDeleteAuthorWorkspace(htmlDoc, this.writerHrefId(edit.hrefId), edit.position, editorColors)
                document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML;
                this.highlightSentence(this.writerHrefId(edit.hrefId), '', true); //Blank out the highlight. //true is for writerSide hrefId type.
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
            } if (edit.editTypeName === 'sentenceMove') {
                let htmlBody = document.getElementById('editorDiv').innerHTML;
                let moveArrayHrefId = (edit.moveArrayHrefId && edit.moveArrayHrefId.length > 0) ? edit.moveArrayHrefId.map(m => m.replace(/\~\!/g, '~^')) : []; //eslint-disable-line
                htmlBody = serviceEditReview.sentenceMoveAuthorWorkspace(htmlBody, {hrefId: this.writerHrefId(edit.hrefId), moveArrayHrefId, position: edit.position});
                document.getElementById('editorDiv').innerHTML = htmlBody;
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
            } if (edit.editTypeName === 'imageNew') {
                let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html");
                htmlDoc = serviceEditReview.imageNewAuthorWorkspace(htmlDoc, this.writerHrefId(edit.hrefId), edit.position, edit.htmlImage64)
                document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML;
                updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
            }
        }
    }

    restoreEditOrComment = (editDetailId) => {
        const {restoreEditDetail, personId, editDetails} = this.props;

        let thisEdit = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0];
        if (thisEdit) {
            if (!thisEdit.isComment) {
                document.getElementById("~!" + thisEdit.hrefId).innerHTML = thisEdit.authorText;
                this.setState({ currentSentence: thisEdit.authorText });
            }
            restoreEditDetail(personId, editDetailId);
        }
    }

    handleEditVote = (editDetailId, voteType, originatorPersonId, trollEditText, voterComment, isComment, isParagraph) => {
        const { personId, workSummary, setEditVote } = this.props;
        //isParagraph won't be used, I'm sure.  The EditDetail record handles sentence edits, new paragraph, delete paragraph and move sentence(s).
        setEditVote(personId, workSummary.chapterId_current, workSummary.languageId_current, editDetailId, voteType, trollEditText, voterComment, isComment);
    }

    setNextHrefId = (isPrevious) => {
        //This will be used the the left side-over panel in order to go to the next sentence automatically without closing and opening again.
        //1. Find the next HrefId by taking the currentHrefId (which is really the current HrefId) and loop through the editorDiv.
        //2. Get the original sentence
        //3. Get the editDetailsByHrefId
        //4. Set the highlight on the sentence.
        //e.preventDefault();
        let {toggleLeftSidePanelOpen, setVisitedHrefId, personId, workSummary, workId, isTranslation, getTranslation} = this.props;
        let {currentHrefId} = this.state;
        let newHrefId = "";

        let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN');
        let reachedCurrentHrefId = false;
        let pointerHrefId = currentHrefId;  // eslint-disable-line

        //This loop would be easier if we were just getting the next HrefId, but the arrangement must also handle the previous.
        for(var i = 0; i < spans.length; i++) {
            if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0
                    && document.getElementById(spans[i].id).innerHTML !== ""
                    && document.getElementById(spans[i].id).innerHTML.replace(/<br>/g, "").replace(/&nbsp;/g, "").replace(/ /g, "") !== ""
                    && document.getElementById(spans[i].id).innerText !== "") {
                if (reachedCurrentHrefId || (currentHrefId === spans[i].id)) {
                    if (isPrevious === "PREV") {
                        newHrefId = pointerHrefId;
                    } else {
                        reachedCurrentHrefId = true;
                        if (currentHrefId === spans[i].id) continue; //Go one more to get past this one before looking for the next in the code below.
                        newHrefId = spans[i].id;
                    }
                    this.editorDivScrollTo(document.getElementById(newHrefId));
                    break;
                }
                pointerHrefId = spans[i].id; //This is to be used in the case of isPreviouis is set to "PREV"
            }
        }
        //When it comes to the last sentence then the currentHrefId will equal the newHrefId, so close the left panel.
        //Give a message that the user has come to the end?
        if (newHrefId && this.standardHrefId(currentHrefId) !== this.standardHrefId(newHrefId)) {
            isTranslation && getTranslation(personId, workId, workSummary.languageId_current, newHrefId, workSummary.chapterId_current, document.getElementById(newHrefId).innerText);
            this.handleSentenceChosen(newHrefId);
            setVisitedHrefId(workId, newHrefId, document.getElementById(newHrefId).innerHTML);
        } else {
            toggleLeftSidePanelOpen();
            this.handleEndOfDocumentOpen();
        }
    }

    checkEventForValidHrefId = (e, searchParam, element=null) => { //If e is null, then we will fallback on element (which comes from sentenceClick so far).
        if (e) element = e.target;
        let searchText = searchParam ? searchParam : '~';
        //if (this.props.leftSidePanelOpen) return;  //HELP here...put this back.
        let count = 0;
        while (element && (element.nodeName === "SPAN" || element.nodeName === "svg") && (!element.id || element.id.indexOf(searchText) !== 0) && count < 10) {
            element = element.parentNode;
            count++;
        }
        if (element && !(element.id && element.id.indexOf(searchText) === 0)) {
            element = element.nearestViewportElement;
            while (element && (element.nodeName === "SPAN" || element.nodeName === "svg") && (!element.id || element.id.indexOf(searchText) !== 0) && count < 10) {
                element = element.parentNode;
                count++;
            }
        }
        return element && (element.nodeName === "SPAN" || element.nodeName === "svg") && element.id && element.id.indexOf(searchText) === 0 ? element : null;
    }

    jumpToBreakNew = (beginOrEnd, evt, hrefIdIncoming) => {
        this.revertEditBackgroundColorByPendingOrNot(this.state.currentHrefId);
        this.decreaseAllIconOpacity(hrefIdIncoming);
        this.props.setIconPosition(beginOrEnd);
        let skipScrollTo = true;
        this.handleSentenceChosen(hrefIdIncoming, skipScrollTo);
        this.handleEditModeChosen('breakNew');
        document.getElementById(hrefIdIncoming).style.opacity = 1;
        if (document.getElementById('breakNew' + beginOrEnd + hrefIdIncoming)) document.getElementById('breakNew' + beginOrEnd + hrefIdIncoming).style.opacity = 1;
        this.sentenceClick(null, document.getElementById(hrefIdIncoming));
        this.highlightSentence(hrefIdIncoming);
    }

    jumpToBreakDelete = (beginOrEnd, evt, hrefIdIncoming) => {
        this.revertEditBackgroundColorByPendingOrNot(this.state.currentHrefId);
        this.decreaseAllIconOpacity(hrefIdIncoming);
        this.props.setIconPosition(beginOrEnd);
        let skipScrollTo = true;
        this.handleSentenceChosen(hrefIdIncoming, skipScrollTo);
        this.handleEditModeChosen('breakDelete');
        document.getElementById(hrefIdIncoming).style.opacity = 1;
        if (document.getElementById('breakDelete' + beginOrEnd + hrefIdIncoming)) document.getElementById('breakDelete' + beginOrEnd + hrefIdIncoming).style.opacity = 1;
        this.sentenceClick(null, document.getElementById(hrefIdIncoming));
        this.highlightSentence(hrefIdIncoming);
    }

    jumpToMoveBegin = (elementIdOrEvent, prefix="") => {
        const {editDetails} = this.props;  //, personId, editReview
        //if elementId is null or is an object...?
        let elementId = ''; //The different between hrefId and elementId is that the elementId is the moveBegin~!<number> and the hrefId is the ~!<number>
        this.revertEditBackgroundColorByPendingOrNot(this.state.currentHrefId);
        if (!elementIdOrEvent) return;
        if (elementIdOrEvent !== null && typeof elementIdOrEvent === 'object') {
            elementId = elementIdOrEvent.currentTarget.id;
            elementIdOrEvent && elementIdOrEvent.stopPropagation();
            elementIdOrEvent && elementIdOrEvent.preventDefault();
        } else {
            elementId = elementIdOrEvent;
        }
        if (elementId.indexOf('~!') === -1) return;
        let sendBeginOrEnd = prefix ? prefix : elementId;
        this.props.setIconPosition(this.findBeginOrEnd(sendBeginOrEnd));
        let hrefId = elementId && elementId.substring(elementId.indexOf('~!'));
        if (hrefId) {
            this.moveSentenceChangeStyle(hrefId, sendBeginOrEnd);
            //Fscroll to the move Begin icon
            let moveSentenceDetail = editDetails && editDetails.length > 0
                && editDetails.filter(m => m.hrefId === hrefId && m.editTypeName === 'sentenceMove')[0];

            if (moveSentenceDetail && moveSentenceDetail.moveArrayHrefId[0]) {
                this.editorDivScrollTo(document.getElementById(moveSentenceDetail.moveArrayHrefId[0]));
            }
            //this.handleEditModeChosen('sentenceMove');
            let skipScrollTo = true;
            this.handleSentenceChosen(hrefId, skipScrollTo);
        }
    }

    jumpToTarget = (elementIdOrEvent, beginOrEnd) => {
        this.props.setIconPosition(beginOrEnd);
        let elementId = ''; //The different between hrefId and elementId is that the elementId is the moveBegin~!<number> and the hrefId is the ~!<number>
        this.revertEditBackgroundColorByPendingOrNot(this.state.currentHrefId);
        if (!elementIdOrEvent) return;
        if (elementIdOrEvent !== null && typeof elementIdOrEvent === 'object') {
            elementId = elementIdOrEvent.currentTarget.id;
        } else {
            elementId = elementIdOrEvent;
        }
        if (elementId.indexOf('~!') === -1) return;
        let hrefId = elementId && elementId.substring(elementId.indexOf('~!'));
        this.moveSentenceChangeStyle(hrefId, beginOrEnd);
        this.editorDivScrollTo(document.getElementById(hrefId));
        //this.handleEditModeChosen('sentenceMove');
        document.getElementById(elementId) && this.sentenceClick(null, document.getElementById(elementId));
    }

    jumpToImageNew = (beginOrEnd, evt, hrefIdIncoming) => {
        this.revertEditBackgroundColorByPendingOrNot(this.state.currentHrefId);
        this.decreaseAllIconOpacity(hrefIdIncoming);
        this.props.setIconPosition(beginOrEnd);
        let skipScrollTo = true;
        this.handleSentenceChosen(hrefIdIncoming, skipScrollTo);
        this.handleEditModeChosen('imageNew');
        document.getElementById(hrefIdIncoming).style.opacity = 1;
        if (document.getElementById('imageNew' + beginOrEnd + hrefIdIncoming)) document.getElementById('imageNew' + beginOrEnd + hrefIdIncoming).style.opacity = 1;
        this.sentenceClick(null, document.getElementById(hrefIdIncoming));
        this.highlightSentence(hrefIdIncoming);
    }

    revertEditBackgroundColorByPendingOrNot = (hrefId) => {
        const {editDetails} = this.props;
        hrefId = this.standardHrefId(hrefId);

        if (document.getElementById(this.writerHrefId(hrefId))) {
            document.getElementById(this.writerHrefId(hrefId)).style.backgroundColor = '';
            document.getElementById(this.writerHrefId(hrefId)).style.color = 'black';
        }

        if (document.getElementById(hrefId)) {
            if (editDetails && editDetails.length > 0) {
                if (!!editDetails.filter(p => p.pendingFlag && p.hrefId === hrefId && p.editTypeName === 'edit' && !p.isComment)[0]) {
                    this.highlightSentence(hrefId, colorEditPending);
                } else if (!!editDetails.filter(p => !p.pendingFlag && p.hrefId === hrefId && p.editTypeName === 'edit' && !p.isComment)[0]) {
                    this.highlightSentence(hrefId, colorEditHistory);
                //We don't color code moved sentences any more.  We just color any sentence that has had text changed.  Not even comments on a sentence will color code a sentence.
                // } else if (!!editDetails.filter(p => p.pendingFlag && p.moveArrayHrefId.indexOf(hrefId) > -1)[0]) {
                //     this.highlightSentence(hrefId, colorMoveSentence);
                } else {
                    document.getElementById(hrefId).style.backgroundColor = '';
                    document.getElementById(hrefId).style.color = 'black';
                }
            } else {
                document.getElementById(hrefId).style.backgroundColor = '';
                document.getElementById(hrefId).style.color = 'black';
            }
        }
    }

    decreaseAllIconOpacity = (hrefId) => {
        const {editDetails, editReview} = this.props;
        let sentenceMoves = editDetails.filter(m => m.editTypeName === 'sentenceMove');
        //This sets the other targets and move icons to grayed out
        if (sentenceMoves && sentenceMoves.length > 0) {
            sentenceMoves.forEach(m => {
                if (m.hrefId !== hrefId && editReview.modeChosen === 'sentenceMove') {
                    if (document.getElementById('moveBegin' + m.hrefId)) document.getElementById('moveBegin' + m.hrefId).style.opacity = 1;
                    if (document.getElementById('moveEnd' + m.hrefId)) document.getElementById('moveEnd' + m.hrefId).style.opacity = 1;
                    if (document.getElementById('targetBegin' + m.hrefId)) document.getElementById('targetBegin' + m.hrefId).style.opacity = 1;
                    if (document.getElementById('targetEnd' + m.hrefId)) document.getElementById('targetEnd' + m.hrefId).style.opacity = 1;
                }
            })
        }

        let breakNews = editDetails.filter(m => m.editTypeName === 'breakNew');
        //This sets the other targets and move icons to grayed out
        if (breakNews && breakNews.length > 0) {
            breakNews.forEach(m => {
                if (m.hrefId !== hrefId && editReview.modeChosen === 'breakNew') {
                    if (document.getElementById('breakNewBegin' + m.hrefId)) document.getElementById('breakNewBegin' + m.hrefId).style.opacity = 1;
                    if (document.getElementById('breakNewEnd' + m.hrefId)) document.getElementById('breakNewEnd' + m.hrefId).style.opacity = 1;
                }
            })
        }

        let breakDeletes = editDetails.filter(m => m.editTypeName === 'breakDelete');
        //This sets the other targets and move icons to grayed out
        if (breakDeletes && breakDeletes.length > 0) {
            breakDeletes.forEach(m => {
                if (m.hrefId !== hrefId && editReview.modeChosen === 'breakDelete') {
                    if (document.getElementById('breakDeleteBegin' + m.hrefId)) document.getElementById('breakDeleteBegin' + m.hrefId).style.opacity = 1;
                    if (document.getElementById('breakDeleteEnd' + m.hrefId)) document.getElementById('breakDeleteEnd' + m.hrefId).style.opacity = 1;
                }
            })
        }

        let imageNews = editDetails.filter(m => m.editTypeName === 'imageNew');
        //This sets the other targets and move icons to grayed out
        if (imageNews && imageNews.length > 0) {
            imageNews.forEach(m => {
                if (m.hrefId !== hrefId && editReview.modeChosen === 'imageNew') {
                    if (document.getElementById('imageNewBegin' + m.hrefId)) document.getElementById('imageNewBegin' + m.hrefId).style.opacity = 1;
                    if (document.getElementById('imageNewEnd' + m.hrefId)) document.getElementById('imageNewEnd' + m.hrefId).style.opacity = 1;
                }
            })
        }
    }

    moveSentenceChangeStyle = (hrefId, beginOrEnd) => {
        this.decreaseAllIconOpacity(hrefId);
        if (document.getElementById('target' + beginOrEnd + hrefId)) document.getElementById('target' + beginOrEnd + hrefId).style.opacity = 1;
        if (document.getElementById('moveBegin' + hrefId)) document.getElementById('moveBegin' + hrefId).style.opacity = 1;
        if (document.getElementById('moveEnd' + hrefId)) document.getElementById('moveEnd' + hrefId).style.opacity = 1;
    }

    isMoveSentenceUsedAlready = (elementId) => {
        //Check both the editDetail records for this person as well as the current sentenceMove record
        const {personId, editDetails} = this.props;
        const {moveSentence} = this.state;
        //It's okay to use the same sentence in the first steps where the moved sentence range is chosen since a second click on the starting sentence means that there is just the one sentence that needs to move.
        if (moveSentence.stepCount >= 3 && (moveSentence.hrefId === elementId || moveSentence.moveArrayHrefId.indexOf(elementId) > -1)) return true;
        let isATarget = editDetails && editDetails.length > 0 && editDetails.filter(m => m.personId === personId && m.editTypeName === 'sentenceMove' && m.hrefId === elementId)[0];
        if (isATarget && isATarget.length > 0) return true;
        let isInMoveArray = editDetails && editDetails.length > 0 && editDetails.filter(m => m.personId === personId && m.editTypeName === 'sentenceMove' && m.moveArrayHrefId.indexOf(elementId) > -1)[0];
        if (isInMoveArray && isInMoveArray.length > 0) return true;
        return false;
    }

    textNewLastStep = (position, evt) => {
        const {setEditDetail, isAuthor, personId, workId, workSummary, leftSidePanelOpen, toggleLeftSidePanelOpen} = this.props;
        const {newText} = this.state;
        evt && evt.stopPropagation();
        evt && evt.preventDefault();
        if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
        if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));

        if (isAuthor) {
            //the author should not have access to this edit type since she can type freely in the editor anyway.
        } else {
            setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, this.standardHrefId(newText.hrefId), '', false, 'textNew', position);
            !leftSidePanelOpen && toggleLeftSidePanelOpen();
        }
        this.setState({newText: {hrefId: '', position: ''}, showInstructions: false}); //start over since this one is sent in.
        if (newText.hrefId && document.getElementById(newText.hrefId)) {
            let skipScrollTo = true;
            this.handleSentenceChosen(newText.hrefId, skipScrollTo);
        }
    }

    breakNewLastStep = (position, evt) => {
        const {updateAuthorWorkspace, setEditDetail, isAuthor, personId, workId, workSummary, editorColors} = this.props;
        const {newBreak} = this.state;
        evt && evt.stopPropagation();
        evt && evt.preventDefault();
        if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
        if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));
        this.handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode

        //If the icon already exists, then just let this go without doing anything else.
        if (document.getElementById('breakNew' + position + newBreak.hrefId)) {
            this.setState({newBreak: {hrefId: '', position: ''}, showInstructions: false}); //start over since this one is sent in.
            return;
        }
        if (isAuthor) {
            let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html");
            htmlDoc = serviceEditReview.breakNewAuthorWorkspace(htmlDoc, this.writerHrefId(newBreak.hrefId), position, editorColors)
            document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML;
            this.highlightSentence(this.writerHrefId(newBreak.hrefId), '', true); //Blank out the highlight. //true is for writerSide hrefId type.
            updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
        } else {
            setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, this.standardHrefId(newBreak.hrefId), '', false, 'breakNew', position);
        }
        this.setState({newBreak: {hrefId: '', position: ''}, showInstructions: false}); //start over since this one is sent in.
        if (newBreak.hrefId && document.getElementById(newBreak.hrefId)) {
            let skipScrollTo = true;
            this.handleSentenceChosen(newBreak.hrefId, skipScrollTo);
        }
    }

    breakDeleteLastStep = (position, evt) => {
        const {updateAuthorWorkspace, setEditDetail, personId, workId, workSummary, isAuthor, editorColors} = this.props;
        const {deleteBreak} = this.state;
        evt && evt.stopPropagation();
        evt && evt.preventDefault();
        if (isAuthor) {
            let htmlDoc = new DOMParser().parseFromString(document.getElementById('editorDiv').innerHTML, "text/html");
            htmlDoc = serviceEditReview.breakDeleteAuthorWorkspace(htmlDoc, this.writerHrefId(deleteBreak.hrefId), position, editorColors)
            document.getElementById('editorDiv').innerHTML = htmlDoc.body.innerHTML;
            this.highlightSentence(this.writerHrefId(deleteBreak.hrefId), '', true); //Blank out the highlight. //'' is color, true is writerSide
            updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
        } else {
            setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, this.standardHrefId(deleteBreak.hrefId), '', false, 'breakDelete', position);
        }

        this.setState({deleteBreak: {hrefId: '', position: ''}, showInstructions: false}); //start over since this one is sent in.
        if (deleteBreak.hrefId && document.getElementById(this.writerHrefId(deleteBreak.hrefId))) {
            let skipScrollTo = true;
            this.handleSentenceChosen(this.writerHrefId(deleteBreak.hrefId), skipScrollTo);
        }
        this.handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode
    }

    imageNewLastStep = (position) => {
        const {setEditDetail, isAuthor, personId, workId, workSummary} = this.props;
        const {newImage} = this.state;

        if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
        if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));

        if (isAuthor) {
            this.highlightSentence(newImage.hrefId, '', true); //Blank out the highlight. //true is writerSide hrefId type
        } else {
            setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, newImage.hrefId, '', false, 'imageNew', position);
        }
        if (newImage.hrefId && document.getElementById(newImage.hrefId)) {
            this.handleSentenceChosen(newImage.hrefId);
            this.handleImageUploadOpen();
        }
        this.setState({newImage: {...newImage, position}, showInstructions: false});
    }

    textNewClick = (e) => {
        const {newText, currentHrefId, isEditor} = this.state;
        //if (this.props.leftSidePanelOpen) return;  //Help to do ... put this back.

        if (this.checkEventForValidHrefId(e, 'targetBegin')) {
            this.textNewLastStep('Begin');
            return;
        } else if (this.checkEventForValidHrefId(e, 'targetEnd')) {
            this.textNewLastStep('End')
            return;
        }

        e && e.stopPropagation();
        e && e.preventDefault();
        this.revertEditBackgroundColorByPendingOrNot(currentHrefId);

        //This is arranged so that if this is a valid HrefId and not a target and if the hrefId for this New Break was already entered but now the hrefId is different,
        //  Then we will let a new sentence be chosen over and over until the user decides to choose a target.
        let element = this.checkEventForValidHrefId(e);
        if (!element) return;

        if (element && element.id && element.nodeName === "SPAN") {
            let skipScrollTo = true;
            //Delete any targets that might be out there in case the user chose a different sentence after all.
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));

            this.handleSentenceChosen(element.id, skipScrollTo);
            if (!newText.hrefId || newText.hrefId !== element.id) {
                isEditor && this.highlightSentence(element.id, colorCurrentFocus, true); //true is writerSide hrefid type. ~^

                //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                //The target needs an onclick event in order to receive the action and set position.
                let originalNode = document.getElementById(element.id);
                if (!document.getElementById('textNewBegin' + element.id)) {
                    let targetBegin = document.createRange().createContextualFragment(this.createTarget('Begin'));
                    targetBegin.onclick = () => this.textNewLastStep('Begin');
                    originalNode.parentNode.insertBefore(targetBegin.childNodes[0], originalNode);
                }
                if (!document.getElementById('textNewEnd' + element.id)) {
                    let targetEnd = document.createRange().createContextualFragment(this.createTarget('End'));
                    targetEnd.onclick = () => this.textNewLastStep('End');
                    let nextSibling = originalNode.nextSibling;
                    if (nextSibling) {
                        originalNode.parentNode.insertBefore(targetEnd.childNodes[0], nextSibling);
                    } else {
                        originalNode.parentNode.appendChild(targetEnd.childNodes[0]);
                    }
                }
                this.setState({ newBreak: { hrefId: element.id }, showInstructions: true});
            }
        }
    }

    breakNewClick = (e) => {
        const {newBreak, currentHrefId} = this.state;
        //if (this.props.leftSidePanelOpen) return;  //Help to do ... put this back.

        if (this.checkEventForValidHrefId(e, 'targetBegin')) {
            this.breakNewLastStep('Begin');
            return;
        } else if (this.checkEventForValidHrefId(e, 'targetEnd')) {
            this.breakNewLastStep('End')
            return;
        }

        e && e.stopPropagation();
        e && e.preventDefault();
        this.revertEditBackgroundColorByPendingOrNot(currentHrefId);

        //This is arranged so that if this is a valid HrefId and not a target and if the hrefId for this New Break was already entered but now the hrefId is different,
        //  Then we will let a new sentence be chosen over and over until the user decides to choose a target.
        let element = this.checkEventForValidHrefId(e);
        if (!element) return;

        if (element && element.id && element.nodeName === "SPAN") {
            let skipScrollTo = true;
            //Delete any targets that might be out there in case the user chose a different sentence after all.
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));

            this.handleSentenceChosen(element.id, skipScrollTo);
            if (!newBreak.hrefId || newBreak.hrefId !== element.id) {
                this.highlightSentence(element.id, colorCurrentFocus, true); //true is writerSide hrefid type. ~^

                //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                //The target needs an onclick event in order to receive the action and set position.
                let originalNode = document.getElementById(element.id);
                if (!document.getElementById('breakNewBegin' + element.id)) {
                    let targetBegin = document.createRange().createContextualFragment(this.createTarget('Begin'));
                    targetBegin.onclick = () => this.breakNewLastStep('Begin');
                    originalNode.parentNode.insertBefore(targetBegin.childNodes[0], originalNode);
                }
                if (!document.getElementById('breakNewEnd' + element.id)) {
                    let targetEnd = document.createRange().createContextualFragment(this.createTarget('End'));
                    targetEnd.onclick = () => this.breakNewLastStep('End');
                    let nextSibling = originalNode.nextSibling;
                    if (nextSibling) {
                        originalNode.parentNode.insertBefore(targetEnd.childNodes[0], nextSibling);
                    } else {
                        originalNode.parentNode.appendChild(targetEnd.childNodes[0]);
                    }
                }
                this.setState({ newBreak: { hrefId: element.id }, showInstructions: true});
            }
        }
    }

    breakDeleteClick = (e) => {
        const {currentHrefId} = this.state;
        e && e.preventDefault();
        e && e.stopPropagation();
        //if (this.props.leftSidePanelOpen) return; //Help to do ... put this back.
        //The first two conditions here are necessary since the click event is not getting changed.  We are already changing the click with addEventListener so often
        //  that we don't want to complicate matters, so we will just detect the last step of choosing the target and take it from there with a return, which I know is a bit ugly.
        let element;
        if (this.checkEventForValidHrefId(e, 'targetBegin')) {
            this.breakDeleteLastStep('Begin');
            return;
        } else if (this.checkEventForValidHrefId(e, 'targetEnd')) {
            this.breakDeleteLastStep('End')
            return;
        } else {
            element = this.checkEventForValidHrefId(e);
            if (!element) return;
        }
        //Take highlight off of the current sentence if it is the highlight color.
        if (document.getElementById(currentHrefId) && document.getElementById(currentHrefId).style.background === colorCurrentFocus) {
            this.revertEditBackgroundColorByPendingOrNot(currentHrefId);
        }

        if (element && element.id && element.nodeName === "SPAN") {
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));
            let skipScrollTo = true;
            this.handleSentenceChosen(element.id, skipScrollTo);
            //Help to do:  We really should be highlighting the entire paragraph and have the targets on the extremes.
            this.highlightSentence(element.id, colorCurrentFocus, true); //true is LeftSide
            let originalNode = document.getElementById(element.id);
            let spans = originalNode.parentNode.childNodes;
            let firstChild;
            for(let i = 0; i < spans.length; i++) {
                if (!firstChild && spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                    firstChild = spans[i]
                    break;
                }
            }
            let lastChild;  //Going backwards from the end to the beginning in order to find the first span that has an hrefId.
            spans = originalNode.parentNode.childNodes
            for(let i = spans.length; i >= 0 ; i--) {
                if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                    lastChild = spans[i];
                    break;
                }
            }
            //Begin target
            if (!document.getElementById('breakDeleteBegin' + element.id)) {
                let targetBegin = document.createRange().createContextualFragment(this.createTarget('Begin'));
                targetBegin.onclick = () => this.breakDeleteLastStep('Begin');
                firstChild.parentNode.insertBefore(targetBegin.firstElementChild, firstChild); //.childNodes[0]
            }
            //End target
            if (!document.getElementById('breakDeleteEnd' + element.id)) {
                let targetEnd = document.createRange().createContextualFragment(this.createTarget('End'));
                targetEnd.onclick =  () => this.breakDeleteLastStep('End');
                let nextSibling = lastChild.nextSibling;
                if (nextSibling) {
                    originalNode.parentNode.insertBefore(targetEnd.firstElementChild, nextSibling); //.childNodes[0]
                } else {
                    originalNode.parentNode.appendChild(targetEnd.firstElementChild); //.childNodes[0]
                }
            }
            this.setState({ deleteBreak: { hrefId: element.id }, showInstructions: true});
        }
    }

    sentenceMoveLastStep = (position, event) => {
        const {updateAuthorWorkspace, setEditDetail, isAuthor, personId, workId, workSummary} = this.props;
        const {moveSentence} = this.state;
        event.stopPropagation();
        event.preventDefault();
        document.getElementById(moveSentence.hrefId).style.backgroundColor = ''; //Clear the highlight of the target sentence.
        document.getElementById(moveSentence.hrefId).style.color = 'black'; //Clear the highlight of the target sentence.
        for(let i = 0; i < moveSentence.moveArrayHrefId.length; i++) {
            document.getElementById(moveSentence.moveArrayHrefId[i]).style.backgroundColor = '';
            document.getElementById(moveSentence.moveArrayHrefId[i]).style.color = 'black';
        }
        if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
        if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));

        if (isAuthor) {
            let htmlBody = document.getElementById('editorDiv').innerHTML;
            htmlBody = serviceEditReview.sentenceMoveAuthorWorkspace(htmlBody, {...moveSentence, position} );
            document.getElementById('editorDiv').innerHTML = htmlBody;
            updateAuthorWorkspace(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, document.getElementById('editorDiv').innerHTML);
        } else {
            setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, moveSentence.hrefId, '', false, 'sentenceMove', position, moveSentence.moveArrayHrefId);
        }
        let skipScrollTo = true;
        this.handleSentenceChosen(moveSentence.hrefId, skipScrollTo);
        this.setState({moveSentence: {hrefId: '', moveArrayHrefId: '', position: '', stepCount: 0}, showInstructions: false}); //start over since this one is sent in.
        this.handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode
    }

    sentenceMoveClick = (e) => {
        const {moveSentence} = this.state;
        e && e.stopPropagation();
        e && e.preventDefault();
        let element;

        if (this.checkEventForValidHrefId(e, 'targetBegin')) {
            this.sentenceMoveLastStep('Begin', e);
            return;
        } else if (this.checkEventForValidHrefId(e, 'targetEnd')) {
            this.sentenceMoveLastStep('End', e);
            return;
        } else {
            element = this.checkEventForValidHrefId(e);
            if (!element) return;
            //Just in case this is a second or third click for a target sentence, revert the previously currentHrefId and delete the target icons.
            //let skipScrollTo = true;
            //this.handleSentenceChosen(element.id, skipScrollTo);
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));
        }

        if (element && element.id && element.nodeName === "SPAN") {
            //First check to see if this sentence is involved in in a moved sentence edit by this same user.
            if (this.isMoveSentenceUsedAlready(element.id)) {
                this.handleMovedSentenceErrorOpen()
                return;
            }

            if (!moveSentence.stepCount || moveSentence.stepCount <= 1) {
                //if (currentHrefId !== element.id)
                this.handleSentenceChosen(element.id, true); //this.revertEditBackgroundColorByPendingOrNot(currentHrefId);
                let moveArrayHrefId = [element.id]
                this.highlightSentence(element.id, colorMoveSentence, true); //true is writerSide hrefId type
                this.setState({ moveSentence: { ...moveSentence, moveArrayHrefId, stepCount: 2 }, showInstructions: true});
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
                let moveArrayHrefId = '';
                let beginHrefId = '';
                let endHrefId = '';

                if (element.id === moveSentence.moveArrayHrefId[0]) {
                    moveArrayHrefId = [element.id]
                    this.setState({ moveSentence: { ...moveSentence, moveArrayHrefId, stepCount: 3 }});
                } else {
                    let html = document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML;
                    moveArrayHrefId = moveSentence.moveArrayHrefId;
                    beginHrefId = moveSentence.moveArrayHrefId[0];
                    endHrefId = element.id;
                    let beginIndex = html.indexOf(moveSentence.moveArrayHrefId[0]);
                    let endIndex = html.indexOf(element.id);
                    if (beginIndex > endIndex) {
                        moveArrayHrefId = [element.id];
                        beginHrefId = element.id;
                        endHrefId = moveSentence.moveArrayHrefId[0]
                        this.highlightSentence(beginHrefId, colorMoveSentence, true); //true is writerSide hrefId type
                    }
                    let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN');
                    let foundBegin = false;

                    for(let i = 0; i < spans.length; i++) {
                        if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') > -1) {
                            if (foundBegin) {
                                moveArrayHrefId.push(spans[i].id);
                                this.highlightSentence(spans[i].id, colorMoveSentence, true); //true is writerSide hrefId type
                                if (spans[i].id === endHrefId) {
                                    break;
                                }
                            }
                            if (!foundBegin && spans[i].id === beginHrefId) {
                                foundBegin = true;
                            }
                        }
                    }
                    this.setState({ moveSentence: { ...moveSentence, moveArrayHrefId, stepCount: 3 }});
                }
            } else { //if (moveSentence.stepCount === 3) {
                //Help to do:  Don't let the user choose a sentence that is in one of the chosen sentences to be moved.
                this.setState({ moveSentence: { moveArrayHrefId: moveSentence.moveArrayHrefId, hrefId: element.id, stepCount: 4 }});
                this.highlightSentence(moveSentence.hrefId, '', true); //true is writerSide hrefId type
                this.highlightSentence(element.id, colorCurrentFocus, true); //true is writerSide hrefId type

                //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                //The target needs an onclick event in order to receive the action and set position.
                let frag = document.createRange().createContextualFragment(this.createTarget('Begin'));
                let frag2 = document.createRange().createContextualFragment(this.createTarget('End'));
                let originalNode = document.getElementById(element.id);
                let beforeNode = originalNode.parentNode.insertBefore(frag.childNodes[0], originalNode);
                if (beforeNode) beforeNode.onclick = (event) => this.sentenceMoveLastStep('Begin', event);
                let nextSibling = originalNode.nextSibling;
                let afterNode;
                if (nextSibling) {
                    afterNode = originalNode.parentNode.insertBefore(frag2.childNodes[0], nextSibling);
                } else {
                    afterNode = originalNode.parentNode.appendChild(frag2.childNodes[0]);
                }
                if (afterNode) afterNode.onclick = (event) => this.sentenceMoveLastStep('End', event);
            }
        }
    }

    sentenceClick = (e, elementIncoming=null) => {
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
                editDetails, isEditor} = this.props;
        let {searchChoice, saveSelection, restoreSelection, currentHrefId, currentSentence} = this.state;
        e && e.stopPropagation();
        e && e.preventDefault();
        //this.hideContextEditReviewMenu();

        let element = e && e.target;
        if (!element) {
            element = elementIncoming;
        }
        //Don't propagate this action if the left side panel is open.
        //if (this.props.leftSidePanelOpen) return;
        let editorSentence = "";
        element = this.checkEventForValidHrefId(e, '', element); //If e is null, then we will fall back on element.

        if (!element || !element.id || element.id.indexOf("~") !== 0 || element.nodeName !== 'SPAN') {
            this.revertEditBackgroundColorByPendingOrNot(this.standardHrefId(currentHrefId));
            return;
        }

        //If we are in the draftComparison, don't let the editor do anything to a draftComparison
        let thisUserDraft = draftComparison && draftComparison[editReview.editorTabChosen].isCurrent;
        let canBeChanged = !isDraftView || (isDraftView && draftComparison && tabsData && !thisUserDraft) ? true : false;
        let isNewChange = false;

        //It is necessary to reach back and get the editor's potentially changed sentence by the hrefId (this is the left-side version ~^)
        if (document.getElementById(currentHrefId)) {
           editorSentence = document.getElementById(currentHrefId).innerHTML;

           if ((!draftComparison || (draftComparison && draftComparison[editReview.editorTabChosen].isCurrent))
                    && currentSentence !== editorSentence && canBeChanged && editorSentence.indexOf("<svg id='erased") === -1) {
               setEditDetail(personId, workId, workSummary.chapterId_current, workSummary.languageId_current, this.standardHrefId(currentHrefId), editorSentence, false, 'edit'); //The author has freestyle editing which saves editDetails but then saves chapterText directly, but don't run a function that will recall the redux store
               isNewChange = true;
           }
       }

       let isEditText = element && element.id && editDetails && editDetails.length> 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === this.standardHrefId(element.id))[0];

       if (isNewChange) {
          this.highlightSentence(this.standardHrefId(currentHrefId), colorEditPending);
       } else if (document.getElementById(this.standardHrefId(currentHrefId))) {
           this.revertEditBackgroundColorByPendingOrNot(this.standardHrefId(currentHrefId));
       }
       if (element && element.id && element.id.indexOf("~") === 0 && element.nodeName === 'SPAN') {
           this.highlightSentence(this.standardHrefId(element.id));
           isEditor && this.highlightSentence(element.id, colorCurrentFocus, true); //true is left side
       }

            //0 index is the first character so that we are only picking up sentence hrefIds and not the icon ids which start with something like targetBegin or breakNewEnd, for example.
       if (element && element.id && currentHrefId !== element.id && element.id.indexOf("~") === 0 && element.nodeName === 'SPAN') {
            savedCursorPosition = saveSelection(document.getElementById('editorDiv'), element.id);
            this.handleEditChosen(element.id);
            setSentenceChosen(element.id);
            if (document.getElementById(this.standardHrefId(currentHrefId)))
                this.revertEditBackgroundColorByPendingOrNot(this.standardHrefId(currentHrefId));

            this.setState({
                currentHrefId: this.writerHrefId(element.id),  //this is a global variable.  This should be the left-side hrefId type:  ~^
                currentSentence: document.getElementById(this.writerHrefId(element.id)) ? document.getElementById(this.writerHrefId(element.id)).innerHTML : ''
            });

            setVisitedHrefId(workId, this.standardHrefId(element.id), element.innerHTML); //The author has freestyle editing which saves editDetails but then saves chapterText directly, but don't run a fucntion that will recall the redux store
            if (isTranslation) {
                let sendText = element.innerText;
                //If there is any HTML within the innerText at all, it needs to be contained in a valid HTML tag, such as a <span>
                sendText = sendText.indexOf(">") > -1 ? "<span>" + sendText + "</span>" : sendText;
                getTranslation(personId, workId, workSummary.languageId_current, this.standardHrefId(element.id), workSummary.chapterId_current, sendText);
            }
            //The difference between the author and the editor is that the author should be able to edit freely. Except translation mode should not allow editing either.
            //   The only way for the editor to modify sentences is to click on a sentence and use the single editor control in the left pane.
            //Don't open up the left side pane if the bookmarkTools or SearchTools are open.
            //And keep this outside of the condition statement above.  We want this to toggle open if the user clicks on the same sentence that they returned to after opening the left pane initially.
       }
       let openLeftSide = true;
       if (searchChoice === "BookmarkTool" || searchChoice === "SearchTextTool") {
           openLeftSide = false;
       } else if (!(isAuthor && !!isEditText) && !isEditor) {
           openLeftSide = false;
       } else if (editReview && editReview.modeChosen !== 'edit') {
           openLeftSide = false;
       }
       if (openLeftSide && !leftSidePanelOpen) toggleLeftSidePanelOpen();
       restoreSelection(document.getElementById('editorDiv'), savedCursorPosition);
    }

    imageNewClick = (e) => {
        const {newImage, currentHrefId} = this.state;
        //if (this.props.leftSidePanelOpen) return;  //Help to do ... put this back.

        //If the current user is not on their own tab, they cannot create a moveSentence edit.
        e && e.stopPropagation();
        e && e.preventDefault();
        //This is necessary here since the click event is not getting changed.  We are already changing the click with addEventListener so often
        //  that we don't want to complicate matters, so we will just detect the last step of choosing the target and take it from there with a return, which I know is a bit ugly.
        if (this.checkEventForValidHrefId(e, 'targetBegin')) {
            this.imageNewLastStep('Begin');
            return;
        } else if (this.checkEventForValidHrefId(e, 'targetEnd')) {
            this.imageNewLastStep('End')
            return;
        }

        //Take highlight off of the current sentence if it is the highlight color.
        this.revertEditBackgroundColorByPendingOrNot(currentHrefId);

        //This is arranged so that if this is a valid HrefId and not a target and if the hrefId for this New Image was already entered but now the hrefId is different,
        //  Then we will let a new sentence be chosen over and over until the user decides to choose a target.
        let element = this.checkEventForValidHrefId(e);
        if (!element) return;

        if (element && element.id && element.nodeName === "SPAN") {
            let skipScrollTo = true;
            //Delete any targets that might be out there in case the user chose a different sentence after all.
            if (document.getElementById('targetBegin')) document.getElementById('targetBegin').parentNode.removeChild(document.getElementById('targetBegin'));
            if (document.getElementById('targetEnd')) document.getElementById('targetEnd').parentNode.removeChild(document.getElementById('targetEnd'));

            this.handleSentenceChosen(element.id, skipScrollTo);
            if (!newImage.hrefId || newImage.hrefId !== element.id) {
                this.highlightSentence(element.id, colorCurrentFocus, true); //true is left-side hrefId type.
                this.setState({ newImage: { hrefId: element.id }, showInstructions: true});

                //Place the target icon before and after this sentence as a new sibling (although later it will be outside of the parent of this span)
                //The target needs an onclick event in order to receive the action and set position.
                let frag = document.createRange().createContextualFragment(this.createTarget('Begin'));
                let frag2 = document.createRange().createContextualFragment(this.createTarget('End'));
                let originalNode = document.getElementById(element.id);
                originalNode.parentNode.insertBefore(frag.childNodes[0], originalNode);
                let nextSibling = originalNode.nextSibling;
                if (nextSibling) {
                    originalNode.parentNode.insertBefore(frag2.childNodes[0], nextSibling);
                } else {
                    originalNode.parentNode.appendChild(frag2.childNodes[0]);
                }

                if (document.getElementById('targetBegin')) document.getElementById('targetBegin').onclick = () => this.imageNewLastStep('Begin');
                if (document.getElementById('targetEnd')) document.getElementById('targetEnd').onclick = () => this.imageNewLastStep('End');

            }
        }
    }

    setDraftTabText = (tabDraftComparisonId) => {
        //This is only an option for the author
        const {draftComparison, editDetails, authorPersonId} = this.props;
        const {localChapterText} = this.state;
        document.getElementById('editorDiv').contentEditable = false;
        if (draftComparison[tabDraftComparisonId].isCurrent) {
            document.getElementById('editorDiv').style.backgroundColor = "";
            document.getElementById('editorDiv').style.color = "black";
            document.getElementById('editorDiv').innerHTML = localChapterText;
        } else {
            document.getElementById('editorDiv').style.backgroundColor = colorFullVersionView;
            document.getElementById('editorDiv').innerHTML = draftComparison[tabDraftComparisonId].chapterText;
        }
        editDetails && editDetails.length > 0 && editDetails.forEach(m => {
            if (document.getElementById(m.hrefId)) {
                if (m.pendingFlag) {
                    this.highlightSentence(m.hrefId, colorEditPending);
                } else if (document.getElementById(m.hrefId).style.backgroundColor !== colorEditPending
                            && document.getElementById(m.hrefId).style.backgroundColor !== colorEditPending_RGB) {
                    this.highlightSentence(m.hrefId, colorEditHistory);
                }
                if (draftComparison[tabDraftComparisonId].isCurrent && m.personId === authorPersonId && !m.isComment) {
                    document.getElementById(m.hrefId).innerHTML = m.editText;
                }
            }
        });
        this.setScrollByHrefId(this.state.currentHrefId);
    }

    setScrollByHrefId = (scrollToHrefId) => {
        if (document.getElementById(scrollToHrefId)) {
            this.editorDivScrollTo(document.getElementById(scrollToHrefId));
        }
    }

    handleEditorTabChosen = (newTab_personId) => {
        this.props.setEditorTabChosen(newTab_personId);
    }

    handleDraftTabs = (draftComparisonId) => {
        const {setDraftTabSelected} = this.props;
        setDraftTabSelected(draftComparisonId);
        this.setDraftTabText(draftComparisonId);
    }

    submitSearchText = (value) => {
        this.setState({ searchText: value})
        let arrFound = this.searchForMatchingText(value);
        this.jumpToSearch('FIRST', arrFound);
    }

    setBookmark = (evt) => {
        let {setVisitedHrefId, workId, bookmarks} = this.props;
        let newPointer = 0;
        let chosenHrefId = evt.target.value;

        for(let i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i] === evt.target.value) {
                newPointer = i;
            }
        }

        this.setState({
            bookmarkChosen: evt.target.value,
            pointerBookmark: newPointer,
        });

        let elementFound = document.getElementById(chosenHrefId);
        if (elementFound) {
            this.handleSentenceChosen(elementFound.id);
            setVisitedHrefId(workId, evt.target.value, elementFound.innerHTML);
        }
    }

    searchForMatchingText = (textToSearch) => {
        //Notice that we are sending in the textToSearch value rather than depending on the state.
        //The state seems to be behind one character consistently.  So, send in the whole text.
        //The state will still be used to keep the value in the inputText control.
        //1. Take the searchText
        //2. Search through the editorDiv for matches
        //3. Keep track of the hrefId-s where the matches are found and place those hrefIds into an array
        let spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN');
        let arrayFound = [];
        if (textToSearch) {
            for(let i = 0; i < spans.length; i++) {
                if (spans && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0  //Notice that 0 is the first character so that we are looking for valid hrefIds.
                        && document.getElementById(spans[i].id).innerHTML !== ""
                        && document.getElementById(spans[i].id).innerHTML !== "<br>"
                        && document.getElementById(spans[i].id).innerText.toLowerCase().indexOf(textToSearch.toLowerCase()) > -1) {
                    arrayFound = arrayFound ? arrayFound.concat(spans[i].id) : [spans[i].id];
                }
            }
        }
        this.setState({ arraySearchTextFound: arrayFound});
        return arrayFound;
    }

    jumpToSearch = (jumpTo, arrayFound) => {
        //1. Take the current pointer value and set it according to the jumpTo value
        //2. If the value in the array doesn't exist but the array is greater than 0, then give the limitation of the last or first
        let {setVisitedHrefId, workId} = this.props;
        const {pointerSearchText, arraySearchTextFound} = this.state
        this.revertEditBackgroundColorByPendingOrNot(this.state.currentHrefId);

        arrayFound = arrayFound ? arrayFound : arraySearchTextFound;
        let nextPointer = pointerSearchText;
        if (jumpTo === "FIRST") {
            nextPointer = 0;
            nextPointer = nextPointer < 0 ? 0 : nextPointer;
        } else if (jumpTo === "PREV") {
            nextPointer -= 1;
            nextPointer = nextPointer < 0 ? 0 : nextPointer;
        } else if (jumpTo === "NEXT") {
            nextPointer += 1;
            nextPointer = nextPointer > arrayFound.length-1 ? arrayFound.length-1 : nextPointer;
        } else if (jumpTo === "LAST") {
            nextPointer = arrayFound.length-1; //Because the array is zero based and so should be pointer be zero based.
        }
        this.setState({pointerSearchText: nextPointer});

        let elementFound = document.getElementById(arrayFound[nextPointer]);
        if (elementFound) {
            this.setIconChosen(arrayFound[nextPointer]);
            this.handleSentenceChosen(arrayFound[nextPointer]);
            setVisitedHrefId(workId, arrayFound[nextPointer], elementFound.innerHTML);
        }
    }

    jumpToBookmark = (jumpTo, arrayFound) => {
        //1. Take the current pointer value and set it according to the jumpTo value
        //2. If the value in the array doesn't exist but the array is greater than 0, then give the limitation of the last or first
        let {setVisitedHrefId, workId, bookmarks} = this.props;
        const {pointerBookmark, bookmarkChosen} = this.state
        this.revertEditBackgroundColorByPendingOrNot(this.state.currentHrefId);

        //If the list is empty and this is the first time that this is chosen, then set the nextPointer to 0 when clicking Next or Prev.
        //And set the chosenBookmark so that the list reflects the name of which bookmark the user is on.
        arrayFound = arrayFound ? arrayFound : bookmarks;
        let nextPointer = pointerBookmark;
        if (jumpTo === "FIRST") {
            nextPointer = 0;
            nextPointer = nextPointer < 0 ? 0 : nextPointer;
        } else if (jumpTo === "PREV") {
            nextPointer = !bookmarkChosen ? 0 : nextPointer - 1;
            nextPointer = nextPointer < 0 ? 0 : nextPointer;
        } else if (jumpTo === "NEXT") {
            nextPointer = !bookmarkChosen ? 0 : nextPointer + 1;
            nextPointer = nextPointer > arrayFound.length-1 ? arrayFound.length-1 : nextPointer;
        } else if (jumpTo === "LAST") {
            nextPointer = arrayFound.length-1; //Because the array is zero based and so should be pointer be zero based.
        }
        this.setState({
            pointerBookmark: nextPointer,
            bookmarkChosen: arrayFound[nextPointer],
        });

        let elementFound = document.getElementById(arrayFound[nextPointer]);
        if (elementFound) {
            this.handleSentenceChosen(arrayFound[nextPointer]);
            setVisitedHrefId(workId, arrayFound[nextPointer], elementFound.innerHTML);
        }
    }

    setEditModeDropDownList = (editDetailId) => {
        let {editDetails} = this.props;
        let edit = editDetails && editDetails.length> 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0];
        let editDetailId_chosen = "";
        if (edit.editTypeName === "edit") {
            editDetailId_chosen = edit.hrefId;
        } else if (edit.editTypeName === 'breakNew') {
            editDetailId_chosen = 'breakNew' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'breakDelete') {
            editDetailId_chosen =  'breakDelete' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'imageNew') {
            editDetailId_chosen =  'imageNew' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'sentenceMove') {
            editDetailId_chosen =  'target' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'textNew') {
            editDetailId_chosen =  'textNew' + edit.position + '^^!' + edit.editDetailId;
        }
        this.setState({ editDetailId_chosen });
    }


    setEditOptionTools = (newChoice) => {
        const {searchChoice} = this.state;
        //If a second click is made on search or bookmark, then have it make the tool disappear.
        if (newChoice === 'returnSearchText' || (newChoice === 'SearchTextTool' && searchChoice === 'SearchTextTool')) {
            this.searchTextDiv.className = styles.hidden;
            this.setState({searchChoice: ''}); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
        } else if (newChoice === 'returnBookmark' || (newChoice === 'BookmarkTool' && searchChoice === 'BookmarkTool')) {
            this.bookmarkDiv.className = styles.hidden;
            this.setState({searchChoice: ''}); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
        } else if (newChoice === 'SearchTextTool') {
            this.bookmarkDiv.className = styles.hidden;
            this.searchTextDiv.className = styles.visible;
            this.setState({searchChoice: 'SearchTextTool'}); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
        } else if (newChoice === 'BookmarkTool') {
            this.searchTextDiv.className = styles.hidden;
            this.bookmarkDiv.className = styles.visible;
            this.setState({searchChoice: 'BookmarkTool'}); //We need this so we can avoid opening the left pane on translate when bookmark or search tools are open.
        }
    }

    handleSaveNewBookmark = (newBookmarkName) => {
        const {personId, workSummary, saveNewBookmark, editReview} = this.props;
        saveNewBookmark(personId, workSummary.chapterId_current, workSummary.languageId_current, editReview.sentenceChosen, newBookmarkName);
    }

    handleDeleteBookmark = () => {
        const {personId, workSummary, deleteBookmark} = this.props;
        const {bookmarkChosen} = this.state;
        deleteBookmark(personId, workSummary.chapterId_current, workSummary.languageId_current, bookmarkChosen); //bookmarkChosen is the hrefId
        this.setState({isShowingDeleteModal: false, bookmarkChosen: ''});
    }

    handleMissingBookmarkClose = () => this.setState({isShowingMissingBookmarkModal: false})
    handleDeleteClose = () => this.setState({isShowingDeleteModal: false})
    handleDeleteOpen = () => {
        const {bookmarkChosen} = this.state;
        if (!bookmarkChosen || bookmarkChosen === "- -") {
            this.setState({isShowingMissingBookmarkModal: true})
            return;
        }
        this.setState({isShowingDeleteModal: true})
    }
    handleMovedSentenceErrorOpen = () => {
        this.setState({isShowingMovedSentenceError: true});
        this.deleteEditStepRecords(); //Reset all of the records if the editMode changes.
    }
    handleMovedSentenceErrorClose = () => this.setState({isShowingMovedSentenceError: false})
    handleCutPasteMessageOpen = () => this.setState({isShowingCutPasteMessage: true})
    handleCutPasteMessageClose = () => this.setState({isShowingCutPasteMessage: false})
    handleLoadingModalOpen = () => this.setState({isShowingLoadingModal: true})
    handleLoadingModalClose = () => this.setState({isShowingLoadingModal: false})
    handleUpdateContentModalOpen = () => this.setState({isShowingUpdateContentModal: true})
    handleUpdateContentModalClose = () => this.setState({isShowingUpdateContentModal: false})
    handleEndOfDocumentOpen = () => this.setState({isShowingEndOfDocument: true})
    handleEndOfDocumentClose = () => this.setState({isShowingEndOfDocument: false})
    handleImageUploadOpen = () => this.setState({isShowingImageUpload: true})
    handleImageUploadClose = () => {
        const {newImage} = this.state;
        this.highlightSentence(newImage.hrefId, '', true); //true is writerSide hrefId type.
        this.handleEditModeChosen('edit'); //Return the edit mode back to the edit-text mode
				this.setState({isShowingImageUpload: false });
    }

		handlePenspringHomeworkOpen = () => this.setState({isShowingPenspringHomework: true})
    handlePenspringHomeworkClose = () => this.setState({isShowingPenspringHomework: false})
		handlePenspringHomework = () => {
				const {personId, workSummary, setPenspringHomeworkSubmitted} = this.props;
				setPenspringHomeworkSubmitted(personId, workSummary.workId);
				this.saveByButtonPress();
				this.handlePenspringHomeworkClose();
				this.setState({ localHomeworkSubmitDate: new Date() });
		}

		handlePenspringDistributeOpen = () => this.setState({isShowingPenspringDistribute: true})
    handlePenspringDistributeClose = () => this.setState({isShowingPenspringDistribute: false})
		handlePenspringDistribute = () => {
				const {personId, workSummary, setPenspringDistributeSubmitted} = this.props;
				setPenspringDistributeSubmitted(personId, workSummary.workId);
				this.handlePenspringDistributeClose();
				this.setState({ localDistributeSubmitDate: new Date() });
		}

    handleSubmitImageAndWait = () => {
        const {newImage} = this.state;
        this.handleImageUploadClose();
        this.handleImageEntryProgressOpen();
        this.setState({
            pendingNewImage: 'imageNew' + newImage.position + newImage.hrefId, //The component Did Update function is looking for this match in the authorWorkspace.
            isShowingImageUpload: false,
            newImage: {hrefId: '', position: ''},
            showInstructions: false,
            timerId_imageEntry: setInterval(() => this.handleImageReceive(), 3000)
        }); //pendingNewImage is what allows the authorWorkspace to load again with the new image this time (in Component Did Update)
    }

    handleImageReceive = () => {
      const {getAuthorWorkspace, personId, workId, workSummary} = this.props;
      const {pendingNewImage} = this.state;
      if (document.getElementById(pendingNewImage)) {
          clearInterval(this.state.timerId_imageEntry);
          this.handleImageEntryProgressClose();
          this.setState({ pendingNewImage: '' });
      } else {
          getAuthorWorkspace(personId, workId, workSummary.chapterId_current);
      }
    }

    setSpansEvent = (userAction, doFunction, whichSide='both') => { //both, leftSide, editViewSide
        let searchPrefix = whichSide === 'writerSide'
            ? '[id^="~^"]'
            : whichSide === 'editViewSide'
                ? '[id^="~!"]'
                : '[id^="~!"], [id^="~^"]'; //both sides.

        let spans = document.querySelectorAll(searchPrefix);
        for(let i = 0; i < spans.length; i++) {
            if (spans && spans[i]) {
                if (userAction === "click") {
                    spans[i].onclick = doFunction;
                } else if (userAction === "contextmenu") {
                    spans[i].onkeyup = doFunction;
                } else if (userAction === "keyup") {
                    spans[i].onkeyup = doFunction;
                } else if (userAction === "keydown") {
                    spans[i].onkeydown = doFunction;
                } else if (userAction === "blur") {
                    spans[i].onblur = doFunction;
                } else if (userAction === "mouseup") {
                    spans[i].onmouseup = doFunction;
                } else if (userAction === "beforepaste") {
                    spans[i].onbeforepaste = doFunction;
                } else if (userAction === "beforecopy") {
                    spans[i].onbeforecopy = doFunction;
                } else if (userAction === "beforecut") {
                    spans[i].onbeforecut = doFunction;
                } else if (userAction === "paste") {
                    spans[i].onpaste = doFunction;
                } else if (userAction === "copy") {
                    spans[i].oncopy = doFunction;
                } else if (userAction === "cut") {
                    spans[i].oncut = doFunction;
                }
            }
        }
    }

    //Place this function last so that all other functions would be defined above.
    setSentenceClickFunction = (modeChosen, force=false) => {
        if (!modeChosen || modeChosen === 'edit') {
            this.setSpansEvent('click', this.sentenceClick, 'writerSide');
            this.setSpansEvent('click', this.sentenceClick, 'editViewSide');
            this.setSpansEvent('mouseup', this.handleTextSelectionChange);
            this.setSpansEvent('keyup', this.checkForKeypress, 'writerSide');
            //this.setSpansEvent('keydown', this.checkForEnterKeypress, 'writerSide');
        } else {
            this.setSpansEvent('blur', () => {});
            this.setSpansEvent('mouseup', () => {});
            // this.setSpansEvent('keyup', () => {});
            // this.setSpansEvent('keydown', () => {});
            if (modeChosen === 'textNew') {
                this.setSpansEvent('click', this.textNewClick, 'writerSide');
            } else if (modeChosen === 'breakNew') {
                    this.setSpansEvent('click', this.breakNewClick, 'writerSide');
            } else if (modeChosen === 'breakDelete') {
                this.setSpansEvent('click', this.breakDeleteClick, 'writerSide');
            } else if (modeChosen === 'sentenceMove') {
                this.setSpansEvent('click', this.sentenceMoveClick, 'writerSide');
            } else if (modeChosen === 'imageNew') {
                this.setSpansEvent('click', this.imageNewClick, 'writerSide');
            }
        }
    }

    handlePointerMove = (moveDirection, idName, modeListOptions)  => {
        const {setSentenceChosen, editDetails} = this.props;
        const {currentHrefId} = this.state;
        let movePointer = document.getElementById(idName).selectedIndex;
        if (moveDirection === "NEXT") {
            movePointer++;
            if (movePointer >= modeListOptions.length) {
                movePointer = Number(modeListOptions.length) - Number(1);
            }
        } else if (moveDirection === "PREV") {
            movePointer--;
        }
        //Now that the movePointer has served as the index pointer, it is possible that it will show the last edit being past the count by 1.
        if (movePointer > modeListOptions.length) {
            movePointer = modeListOptions.length;
        } else if (movePointer < 1) {
            movePointer = 1; //0 is the label header which will not have a valid editDetailId.
        }
        this.highlightSentence(this.writerHrefId(currentHrefId), 'white'); //This is the right-side.
        this.revertEditBackgroundColorByPendingOrNot(currentHrefId); //This is the left-side which automatically converts to the hrefd to standard ~!.

        let edit = editDetails && editDetails.length> 0 && editDetails.filter(m => m.editDetailId === modeListOptions[movePointer].editDetailId)[0];
        let editElementId = "";
        let newCurrentHrefId = "";
        let newCurrentSentence = "";
        if (edit.editTypeName === "edit") {
            editElementId = edit.hrefId;
            newCurrentHrefId = edit.hrefId;
            newCurrentSentence = document.getElementById(this.writerHrefId(edit.hrefId)).innerHTML;
            setSentenceChosen(modeListOptions[movePointer].hrefId);
        } else if (edit.editTypeName === 'breakNew') {
            editElementId = 'breakNew' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'breakDelete') {
            editElementId = 'breakDelete' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'imageNew') {
            editElementId = 'imageNew' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'sentenceMove') {
            editElementId = 'target' + edit.position + '^^!' + edit.editDetailId;
        } else if (edit.editTypeName === 'textNew') {
            editElementId = 'textNew' + edit.position + '^^!' + edit.editDetailId;
        }
        this.setState({ currentHrefId: newCurrentHrefId, currentSentence: newCurrentSentence });
        this.handleEditChosen(editElementId);
        this.editorDivScrollTo(document.getElementById(this.standardHrefId(edit.hrefId)));
    }

    handleEditOwner = () => {
        const {editDetails} = this.props;
        const {currentHrefId} = this.state;
        let editText = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === currentHrefId)[0];

        let editDetailId = currentHrefId && currentHrefId.indexOf('^^!') > -1
            ? currentHrefId.substring(currentHrefId.indexOf('^^!')+3)
            : '';

        let edit = editDetailId
            ? editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
            : editText;

        this.props.setEditorTabChosen(edit.personId);
    }

    handleEditChosen = (elementId) => {
        const {setEditChosen, setSentenceChosen} = this.props;
        const {currentHrefId} = this.state;
        currentHrefId && this.revertEditBackgroundColorByPendingOrNot(currentHrefId);

        if (currentHrefId && (currentHrefId.indexOf('target') > -1 || currentHrefId.indexOf('move') > -1)) {
            let suffix = currentHrefId && currentHrefId.substring(currentHrefId.indexOf('^^!'));
            this.highlightSentence('targetBegin' + suffix, '');
            this.highlightSentence('targetEnd' + suffix, '');
            this.highlightSentence('moveBegin' + suffix, '');
            this.highlightSentence('moveEnd' + suffix, '');
        }

        if (elementId && (elementId.indexOf('target') > -1 || elementId.indexOf('move') > -1)) {
            let suffix = elementId && elementId.substring(elementId.indexOf('^^!'));
            this.highlightSentence('targetBegin' + suffix, colorCurrentFocus);
            this.highlightSentence('targetEnd' + suffix, colorCurrentFocus);
            this.highlightSentence('moveBegin' + suffix, colorCurrentFocus);
            this.highlightSentence('moveEnd' + suffix, colorCurrentFocus);
        } else {
            this.highlightSentence(elementId, colorCurrentFocus);
        }
        let currentSentence = document.getElementById(elementId) ? document.getElementById(elementId).innerHTML : '';
        this.setState({ currentHrefId: elementId, currentSentence });
        setEditChosen(elementId);
        setSentenceChosen(elementId);
    }

		handleHideEditorsVersions = () => this.setState({ hideEditorsVersions: !this.state.hideEditorsVersions})

		onChangeLanguage = (event) => {
				const {setWorkCurrentSelected, personId, workSummary} = this.props;
				setWorkCurrentSelected(personId, workSummary.workId, workSummary.chapterId_current, Number(event.target.value), "STAY");
		}

    render() {
        const {tabsData, workSummary, personId, authorPersonId, updatePersonConfig, personConfig, editDetails, leftSidePanelOpen,
                workId, toggleLeftSidePanelOpen, bookmarkOptions, bookmarks, isDraftView, toggleDraftView, modeCounts,
                isTranslation, getTranslation,  translatedSentence, textProcessingProgress, editListOptions, editorColors,
                deleteWork, deleteChapter, setWorkCurrentSelected, chapterTabText, isAuthor, editReview={}, authorWorkspace,
								toggleShowEditorTabDiff, editorFirstName} = this.props;
        const {currentHrefId, currentSentence, searchText, pointerSearchText, arraySearchTextFound, pointerBookmark, bookmarkChosen,
                isShowingDeleteModal, isShowingMissingBookmarkModal, sidePanel_open, sidePanel_docked, isShowingProgress, isShowingProgress_imageEntry,
                newBreak, deleteBreak, moveSentence, showInstructions, isShowingMovedSentenceError, localHomeworkSubmitDate, localDistributeSubmitDate,
                isShowingCutPasteMessage, fetchingRecord, isShowingUpdateContentModal, isShowingEndOfDocument, newImage,
                isShowingImageUpload, saveWorkSpaceTime, hideEditorsVersions, isShowingPenspringHomework, isShowingPenspringDistribute} = this.state;

        let editDetailsByHrefId = editDetails && editDetails.length > 0 && editDetails.filter(m => m.hrefId === this.standardHrefId(editReview.sentenceChosen) && m.editTypeName === 'edit');
        let tabsFunction = isDraftView ? this.handleDraftTabs : this.handleEditorTabChosen;  //eslint-disable-line
        let tabNav = isDraftView ? toggleDraftView : () => {};
        let navText = isDraftView && `Close Drafts`;
				let toolScreenWidth = (tabsData && tabsData.tabs && tabsData.tabs.length > 1) ? 900 + (tabsData.tabs.length * 50) : 900;
				toolScreenWidth += leftSidePanelOpen ? 250 : 0;

        let languageOptions = workSummary.languageOptions;
        if (languageOptions && languageOptions.length > 0) languageOptions = doSort(languageOptions, { sortField: 'label', isAsc: true, isNumber: false });

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
                            hrefId={this.standardHrefId(currentHrefId)}
                            chapterId={workSummary && workSummary.chapterId_current}
                            saveEdit={this.saveEditOrComment(currentHrefId)(currentSentence)}
                            saveEditVote={this.handleEditVote}
                            deleteEditOrComment={this.handleDeleteEditDetail}
                            editReview={editReview}
                            restoreEditOrComment={this.restoreEditOrComment}
                            toggleLeftSidePanelOpen={toggleLeftSidePanelOpen}
                            setSentenceChosen={this.handleSentenceChosen}
                            originalSentence={editReview && editReview.originalSentenceText}
                            setTabSelected={this.handleEditorTabChosen}
                            setNextHrefId={this.setNextHrefId}
                            updatePersonConfig={updatePersonConfig}
                            personConfig={personConfig}
                            editorColors={editorColors}
														workSummary={workSummary}
                            saveEditOrComment={this.saveEditOrComment(currentHrefId)(currentSentence)} />
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
    																						<div onClick={this.handleHideEditorsVersions} className={styles.linkHide}>
    																								(hide)
    																						</div>
    		                                        {editListOptions &&
    		                                            <EditListNavigator idName={'editList'} editDetailId_chosen={currentHrefId} editListOptions={editListOptions}
    		                                                handlePointerMove={this.handlePointerMove} setEditChosen={this.handleEditChosen}/>
    		                                        }
    		                                    </div>
    																				<MediaQuery maxWidth={toolScreenWidth}>
    																						{(matches) => {
    																								if (matches) {
    																										return (
    																											<div className={styles.row}>
    																													<TextEditorTools className={styles.textEditorTools} editReview={editReview} editMode={editReview.modeChosen}
    																																 personId={personId} authorPersonId={workSummary.authorPersonId} editChosen={currentHrefId}
    																																 deleteEditDetail={this.handleDeleteEditDetail} setEditReviewVote={this.handleEditVote} workSummary={workSummary}
    																																 workId={workId} setAcceptedEdit={this.handleAcceptEditDetail} editDetails={editDetails}
    																																 standardHrefId={this.standardHrefId} handleEditOwner={this.handleEditOwner}
    																																 toggleShowEditorTabDiff={toggleShowEditorTabDiff}/>
    																													<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.linkShow, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/></a>} content={() => this.componentRef}/>
    																											</div>
    																										)
    																							} else {
    																									return (
    																											<div></div>
    																									);
    																							}
    																						}}
    																				</MediaQuery>
    																				{!hideEditorsVersions &&
    				                                    <div className={classes(styles.tabPage, styles.row)}>
    				                                        <TabPage tabsData={tabsData} onClick={this.handleEditorTabChosen} navClose={tabNav} navText={navText}
    				                                            showZeroCount={true} showListAfterQuantity={5}/>
    																								<MediaQuery minWidth={toolScreenWidth}>
    																	                  {(matches) => {
    																		                    if (matches) {
    																			                      return (
    																															<div className={styles.row}>
    																																	<TextEditorTools className={styles.textEditorTools} editReview={editReview} editMode={editReview.modeChosen}
    													                                               personId={personId} authorPersonId={workSummary.authorPersonId} editChosen={currentHrefId}
    													                                               deleteEditDetail={this.handleDeleteEditDetail} setEditReviewVote={this.handleEditVote} workSummary={workSummary}
    													                                               workId={workId} setAcceptedEdit={this.handleAcceptEditDetail} editDetails={editDetails}
    													                                               standardHrefId={this.standardHrefId} handleEditOwner={this.handleEditOwner}
    																																				 toggleShowEditorTabDiff={toggleShowEditorTabDiff}/>
    																																	<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.linkShow, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/></a>} content={() => this.componentRef}/>
    																															</div>
    																														)
    																											} else {
    																		                      return (
    																		                        	<div></div>
    																		                      );
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
																										ref={el => (this.componentRef = el)}
				                                            dangerouslySetInnerHTML={{__html: chapterTabText}} />
				                                    </div>
																						<div id={`contextEditReview`} style={{display: 'none'}}>
						                                    <ContextEditReview editDetails={editDetails} isAuthor={personId === workSummary.authorPersonId}
						                                        editReview={editReview} personId={personId} editChosen={currentHrefId} deleteEditDetail={this.handleDeleteEditDetail}
						                                        setEditReviewVote={this.handleEditVote} workSummary={workSummary} workId={workId}
						                                        setAcceptedEdit={this.handleAcceptEditDetail} standardHrefId={this.standardHrefId}
						                                        hideContextEditReviewMenu={this.hideContextEditReviewMenu}/>
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
    																						cancelRecord={() => this.setAddInstructions(false)} />
    																		</div>
    																}
    																{!showInstructions &&
    		                                <div className={classes(styles.toolSection, (hideEditorsVersions ? styles.rowWrap : styles.rowNowrap))}>
    																				<div className={styles.row}>
    																						{hideEditorsVersions &&
    																								<div className={styles.editorPosition}>
    																										<div className={styles.labelSmall}>Editors</div>
    																										<div onClick={this.handleHideEditorsVersions} className={classes(styles.linkShow, styles.row)}>
    																												show
    																												<div className={styles.count}>{(tabsData && tabsData.tabs && String(Number(tabsData.tabs.length)-Number(1))) || 0}</div>
    																										</div>
    																								</div>
    																						}
    				                                    <EditTools modeCounts={modeCounts}
    				                                        setEditOptionTools={this.setEditOptionTools} editorTabChosen={editReview.editorTabChosen}
    				                                        setEditMode={this.handleEditModeChosen} editReview={editReview} currentSentence={currentSentence}
    				                                        personId={personId} authorPersonId={authorPersonId} workSummary={workSummary} deleteWork={deleteWork}
    				                                        deleteChapter={deleteChapter} setWorkCurrentSelected={setWorkCurrentSelected} setAddInstructions={this.setAddInstructions}
    				                                        sentenceChosen={currentHrefId} counts={editReview.editCounts}
    				                                        saveEditOrComment={this.saveEditOrComment(currentHrefId || currentHrefId)(currentSentence)}
    				                                        showInstructions={showInstructions} handleShowInstructions={this.handleShowInstructions}
    				                                        deleteEditDetail={this.handleDeleteEditDetail} toggleLeftSidePanelOpen={toggleLeftSidePanelOpen}
    				                                        workId={workId} chapterId={workSummary.chapterId_current} languageId={workSummary.languageId_current}
    																								toggleShowEditorTabDiff={toggleShowEditorTabDiff}/>
    																				</div>
    																				{isAuthor && personConfig.authorWorkspaceOn &&
    																						//This was used when we had the "commit changes" button which we will probably use again for a feature called personConfig.authorWorkspaceOn
    																						<div>
    																								<Button label={<L p={p} t={`Commit changes`}/>} onClick={this.handleAuthorProcessText} addClassName={styles.commitButton}/>
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
    																										onChange={this.onChangeLanguage}/>
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
    																										icon={'checkmark0'} onClick={this.handlePenspringHomeworkOpen}/>
    																						}
    																						{workSummary.isHomework && (workSummary.isHomeworkSubmitted || localHomeworkSubmitDate) &&
    																								<TextDisplay label={<L p={p} t={`Homework submitted`}/>} text={<DateMoment date={workSummary.homeworkSubmittedDate || localHomeworkSubmitDate}
    																										format={'D MMM  h:mm a'} minusHours={0}/>} nowrap={true}/>
    				                                    }

    																						{workSummary.isDistributableAssignment && !workSummary.publishedDate && !localDistributeSubmitDate &&
    																								<ButtonWithIcon label={<div className={styles.lineHeight}><L p={p} t={`Publish`}/><br/><div className={styles.smallText}><L p={p} t={`Assignment`}/></div></div>}
    																										icon={'earth'} onClick={this.handlePenspringDistributeOpen}/>
    																						}
    																						{workSummary.isDistributableAssignment && (workSummary.publishedDate || localDistributeSubmitDate) &&
    																								<TextDisplay label={<L p={p} t={`Published assignment`}/>}text={<DateMoment date={workSummary.publishedDate || localDistributeSubmitDate}
    																										format={'D MMM  h:mm a'} minusHours={6}/>} nowrap={true}/>
    				                                    }

    																						{isAuthor &&
                                                    <div className={styles.raiseUp}>
															                          <ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'floppy_disk0'} onClick={this.saveByButtonPress}/>
                                                    </div>
    																						}
    																				</div>
                                        }
                                        {!showInstructions &&
                                            <div>
                                                <div className={styles.secondRow}>
                                                    <div ref={ref => {this.searchTextDiv = ref}} className={styles.hidden}>
                                                        <SearchTextTool
                                                            pointer={arraySearchTextFound && arraySearchTextFound.length > 0 ? pointerSearchText + 1 : 0}
                                                            totalCount={arraySearchTextFound && arraySearchTextFound.length > 0 && arraySearchTextFound.length}
                                                            jumpToSearch={this.jumpToSearch} searchText={searchText} submitSearchText={this.submitSearchText}
                                                            setEditOptionTools={() => this.setEditOptionTools('returnSearchText')}/>
                                                    </div>
                                                </div>
                                                <div ref={ref => {this.bookmarkDiv = ref}} className={styles.hidden}>
                                                    <BookmarkTool
                                                        pointer={bookmarks && bookmarks.length > 0 ? pointerBookmark + 1 : 0}
                                                        totalCount={bookmarks && bookmarks.length > 0 && bookmarks.length}
                                                        jumpToBookmark={this.jumpToBookmark} bookmarkChosen={bookmarkChosen} bookmarkOptions={bookmarkOptions}
                                                        setBookmark={this.setBookmark} saveNewBookmark={this.handleSaveNewBookmark}
                                                        deleteBookmark={this.handleDeleteOpen} originalSentence={currentSentence}
                                                        setEditOptionTools={() => this.setEditOptionTools('returnBookmark')}
                                                        handleRemoveEvent={this.handleRemoveEvent} handleAddEvent={this.handleAddEvent}/>
                                                </div>
                                            </div>
                                        }
                                        {isShowingDeleteModal &&
                                          <MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Delete this Bookmark?`}/>}
                                             explain={<L p={p} t={`Are you sure you want to delete this bookmark?`}/>} isConfirmType={true}
                                             onClick={this.handleDeleteBookmark} />
                                        }
                                        {isShowingMissingBookmarkModal &&
                                          <MessageModal handleClose={this.handleMissingBookmarkClose} heading={<L p={p} t={`A Bookmark is not Chosen?`}/>}
                                             explainJSX={<L p={p} t={`Please choose a bookmark before attempting to delete a bookmark?`}/>} isConfirmType={false}
                                             onClick={this.handleMissingBookmarkClose} />
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
		                <ProgressModal handleClose={this.handleProgressClose} heading={<L p={p} t={`Text Processing Progress`}/>}
		                    progress={textProcessingProgress}/>
		            }
		            {isShowingProgress_imageEntry &&
		                <ProgressModal handleClose={this.handleProgressClose} heading={<L p={p} t={`Please wait for the new image to load`}/>}/>
		            }
		            {isShowingMovedSentenceError &&
		                <MessageModal handleClose={this.handleMovedSentenceErrorClose} heading={<L p={p} t={`Move Sentence Error`}/>}
		                   explainJSX={<L p={p} t={`It is not allowed to choose a sentence that is already involved in a move.`}/>} isConfirmType={false}
		                   onClick={this.handleMovedSentenceErrorClose} />
		            }
		            {isShowingCutPasteMessage &&
		                <MessageModal handleClose={this.handleCutPasteMessageClose} heading={<L p={p} t={`Cut or Paste Error`}/>}
		                   explainJSX={<L p={p} t={`You are not allowed to cut and paste on this page.  In order to move text, choose the Move mode and see the instructions.`}/>} isConfirmType={false}
		                   onClick={this.handleCutPasteMessageClose} />
		            }
		            {isShowingEndOfDocument &&
		                <MessageModal handleClose={this.handleEndOfDocumentClose} heading={<L p={p} t={`End of Document`}/>}
		                   explainJSX={<L p={p} t={`You have reached the end of the document.`}/>} isConfirmType={false}
		                   onClick={this.handleEndOfDocumentClose} />
		            }
								{isShowingPenspringHomework &&
		                <MessageModal handleClose={this.handlePenspringHomeworkClose} heading={<L p={p} t={`Submit this homework?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to submit this homework?  The teacher will be able to see your penspring file with your assignment in eCademy app.`}/>} isConfirmType={true}
		                   onClick={this.handlePenspringHomework} />
		            }
								{isShowingPenspringDistribute &&
		                <MessageModal handleClose={this.handlePenspringDistributeOpen} heading={`Distribute this homework?`}
		                   explainJSX={<L p={p} t={`Are you sure you want to distribute this homework?  The assignment will be copied to each student as if they were the oroginal authors.  You will become an editor to each assignment.  You will be able to see the penspring file in the eCademyApp gradebook when the student completes and submits their work.`}/>}
											 isConfirmType={true} onClick={this.handlePenspringDistribute} />
		            }
		            {isShowingUpdateContentModal &&
		                <LoadingModal handleClose={this.handleUpdateContentModalClose} loadingText={<L p={p} t={`Reprocessing`}/>} isLoading={fetchingRecord && !fetchingRecord.updateChapterText} />
		            }
		            {isShowingImageUpload &&
		                <ImageUploadFileModal handleClose={this.handleImageUploadClose} sectionName={workSummary && workSummary.chapterName_current}
		                    sentenceText={currentSentence} position={newImage.position} workId={workSummary && workSummary.workId} hrefId={currentHrefId}
		                    chapterId={workSummary && workSummary.chapterId_current} languageId={workSummary && workSummary.languageId_current}
		                    handleGetEditDetails={this.handleGetEditDetails} personId={personId} authorPersonId={workSummary && workSummary.authorPersonId}
		                    handleSubmitImageAndWait={this.handleSubmitImageAndWait}/>
		            }
		        </div>
		    )
		}
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
