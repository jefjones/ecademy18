import React, {Component} from 'react';
import styles from './ChapterSplitterView.css';
const p = 'ChapterSplitterView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import SplitterOptionsBar from '../../components/SplitterOptionsBar';
import SearchTextTool from '../../components/SearchTextTool';
import SplitterPanelDockable from '../../components/SplitterPanelDockable';
import TextareaModal from '../../components/TextareaModal';
import {doSort} from '../../utils/sort.js';
import classes from 'classnames';

var colorHasNewSection = "#e6f4ff";
var colorCurrentFocus = "yellow";

export default class ChapterSplitterView extends Component {
    //If this is a new document, then include the Save button for the author, but if the author leaves the page with or without
    //  saving, then save the chapterText and process it for hrefId-s anyway.
    constructor(props) {
        super(props);

        this.state = {
            newSections: [],
            currentHrefId: '',
            currentSentence: '',
            prevHrefId: '',
            isShowingModal: false,
            sequenceOptions: [],
            sidePanel_open: this.props.mediaQuery === 'large' || this.props.leftSidePanelOpen,
            sidePanel_docked: this.props.mediaQuery === 'large',
            errors: {},
            stopKeypress: false,
            pointerSearchText: 0,
            searchText: '',
            arraySearchTextFound: [],
            isShowingDeleteModal: false,
            isShowingMissingBookmarkModal: false,
            pointer: 0,
            totalCount: 0,
        };

        this.checkMediaQuerySize = this.checkMediaQuerySize.bind(this);
        this.sentenceClick = this.sentenceClick.bind(this);
        this.openLeftSidePanel = this.openLeftSidePanel.bind(this);
        this.jumpToEdit = this.jumpToEdit.bind(this);
        this.setScrollByHrefId = this.setScrollByHrefId.bind(this);
        this.searchForMatchingText = this.searchForMatchingText.bind(this);
        this.jumpToSearch = this.jumpToSearch.bind(this);
        this.setJumpCounts = this.setJumpCounts.bind(this);

        this.handleNewSectionClose = this.handleNewSectionClose.bind(this);
        this.handleNewSectionOpen = this.handleNewSectionOpen.bind(this);
        this.handleNewSectionSave = this.handleNewSectionSave.bind(this);
        this.handleNewSectionDelete = this.handleNewSectionDelete.bind(this);
        this.handleNewSectionDeleteByName = this.handleNewSectionDeleteByName.bind(this);
        this.submitSearchText = this.submitSearchText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //document.getElementById("editorDiv").focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        this.editorDiv.addEventListener('click', this.sentenceClick);
        window.scrollTo(0, 1);
    }

    componentDidUpdate() {
        this.checkMediaQuerySize();
    }

    checkMediaQuerySize() {
        // if (this.props.mediaQuery === 'large' && !this.state.sidePanel_docked) {
        //     this.props.toggleLeftSidePanelOpen();
        //     this.setState({sidePanel_docked: true, sidePanel_open: true});
        // } else if (this.props.mediaQuery === 'small' && this.state.sidePanel_docked && !this.props.leftSidePanelOpen) {
        //     this.props.toggleLeftSidePanelOpen();
        //     this.setState({sidePanel_docked: false, sidePanel_open: false});
        // }
    }

    handleSubmit() {
        const {splitChapter, personId, workId, chapterId, toggleLeftSidePanelOpen} = this.props;
        let newSections = this.state.newSections;
        newSections = newSections && newSections.length > 0 && newSections.map(m => {delete m.locationIndex; return m});
        toggleLeftSidePanelOpen();
        splitChapter(personId, workId, chapterId, newSections);
    }

    setJumpCounts(direction, newSectionsParam, currentHrefIdParam) {
        let {currentHrefId, newSections} = this.state;
        //1. find the position of the currentHrefId,
        //2. move the position up or down depending on the direction (PREV or NEXT)
        newSections = newSectionsParam ? newSectionsParam : (newSections ? newSections : []);
        currentHrefId = currentHrefIdParam ? currentHrefIdParam : (currentHrefId ? currentHrefId : '');
        let position = 0;
        let totalCount = (newSections && newSections.length > 0 && newSections.length) || 0;
        for(var i = 0; i < totalCount; i++) {
            if (newSections[i].hrefId === currentHrefId) {
                position = i + 1;
            }
        }
        //It is possible that this function is called without a direction.  So don't move it; just find where it is currently.
        position = !direction ? position : (direction === 'PREV' ? position-- : position++);
        position = position < 0 ? 0 : (position > totalCount ? totalCount : position);
        this.setState({
            pointer: position,
            totalCount,
        })
    }

    jumpToEdit = (strNextOrPrev) => {
        //Find which node you are on now.
        //Loop through all of the span tags and look at those which have an Id like "~!"
        //  Look specifically for the next one that has a background color assigned to it.
        var spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN');
        var reachedCurrentHrefId = false;
        var currentHrefId = this.state.prevHrefId;
        var indexCount = strNextOrPrev === "NEXT" ? 0 : spans.length;
        function indexCheck(indexValue) {
            return  strNextOrPrev === "NEXT" ? indexValue < spans.length : indexValue > 0;
        }
        // function indexIncrement(indexValue) {
        //     return  strNextOrPrev === "NEXT" ? indexValue++ : indexValue--;
        // }

        for(indexCount; indexCheck(indexCount); strNextOrPrev === "NEXT" ? indexCount++ : indexCount--) {
            if (spans[indexCount] && String(spans[indexCount].id).indexOf('~!') > -1
                    && (!currentHrefId || reachedCurrentHrefId || (currentHrefId === spans[indexCount].id))) {

                reachedCurrentHrefId = true;
                if (currentHrefId === spans[indexCount].id) continue; //Go one more to get past this one before looking for the next in the code below.

                if (spans[indexCount].style.backgroundColor) {
                    //document.getElementById(spans[indexCount].id).focus();
                    if (document.getElementById(currentHrefId)) document.getElementById(currentHrefId).style.backgroundColor = colorHasNewSection;   //Set the previous one back to its edit background color instead of yellow highlighted
                    document.getElementById(spans[indexCount].id).style.backgroundColor = colorCurrentFocus;
                    var toHrefId = document.getElementById(spans[indexCount].id);
                    var topPos = toHrefId.offsetTop;
                    topPos -= 70;
                    topPos = topPos < 0 ? 0 : topPos;
                    document.getElementById('editorDiv').scrollTop = topPos;
                    currentHrefId = spans[indexCount].id;
                    break;
                }
            }
        }
        this.setState({
            prevHrefId: currentHrefId,
            currentHrefId,
        });
        this.setJumpCounts(null, null, currentHrefId);
    }

    openLeftSidePanel = (e) => {
        e.preventDefault();
        let {toggleLeftSidePanelOpen} = this.props;
        let {prevHrefId} = this.state;
        if (!prevHrefId) return;
        let element = e.target;
        var count = 0
        while (element && String(element.id).indexOf("~!") === -1 && count < 10) {
            element = element.parentNode;
            count++;
        }
        toggleLeftSidePanelOpen();
        if (document.getElementById(prevHrefId)) {
            document.getElementById(prevHrefId).style.backgroundColor = colorCurrentFocus;
        }
    }

    sentenceClick = (e) => {
        //On click of a sentence
        //1. Get the currentHrefId
        //2. Get the text of the current HrefId
        //3. If the prevHrefId exists, then color code it if it has a current newSection record.  Otherwise it will go back to white background.
        //4. Set the prevHrefId to the currentHrefId
        //5. Open the TextAreaModal with the existing new section name or the current sentence
        //6. Put a yellow highlight on the selected sentence throughout the process until Me clicks off to another sentence.
        let {prevHrefId, newSections} = this.state;
        let element = e.target;
        let count = 0;

        //Don't propagate this action if the left side panel is open.
        if (this.props.leftSidePanelOpen) return;

        while (element && String(element.id).indexOf("~!") === -1 && count < 10) {
            element = element.parentNode;
            count++;
        }

        if (element && element.id && element.nodeName === 'SPAN') {
            //3. If the prevHrefId exists, then color code it if it has a current newSection record.  Otherwise it will go back to white background.
            if (document.getElementById(prevHrefId) && prevHrefId !== element.id) {
                let hasNewSection = false;
                for(var i = 0; i < newSections.length; i++) {
                    if (newSections[i].hrefId === prevHrefId) {
                        hasNewSection = true;
                    }
                }
                document.getElementById(prevHrefId).style.backgroundColor = hasNewSection ? colorHasNewSection : "";
            }

            //1. Get the currentHrefId
            //2. Get the text of the current HrefId (currentSentence)
            //4. Set the prevHrefId to the currentHrefId
            //6. Put a yellow highlight on the selected sentence throughout the process until Me clicks off to another sentence.
            let cleanSentence = document.getElementById(element.id).innerHTML;
            var regex = "/<(.|\n)*?>/";
            cleanSentence.replace(regex, "")
                .replace(/<br>/g, "")
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim();
            cleanSentence = cleanSentence.replace(/&nbsp;/g, " ");

            this.setState({
                currentHrefId: element.id,
                prevHrefId: element.id,
                currentSentence: cleanSentence,
            });
            document.getElementById(element.id).style.backgroundColor = colorCurrentFocus;
            //5. Open the TextAreaModal with the existing new section name or the current sentence
            this.handleNewSectionOpen();
        }
        this.setJumpCounts(null, null, element.id);
    }

    setScrollByHrefId(scrollToHrefId) {
        if (document.getElementById(scrollToHrefId)) {
            var hrefId = document.getElementById(scrollToHrefId);
            var topPos = hrefId.offsetTop;
            topPos -= 70;
            topPos = topPos < 0 ? 0 : topPos;
            document.getElementById('editorDiv').scrollTop = topPos;
        }
    }

    submitSearchText = (value) => {
        this.setState({ searchText: value})
        let arrFound = this.searchForMatchingText(value);
        this.jumpToSearch('FIRST', arrFound);
    }

    searchForMatchingText(textToSearch) {
        //Notice that we are sending in the textToSearch value rather than depending on the state.
        //The state seems to be behind one character consistently.  So, send in the whole text.
        //The state will still be used to keep the value in the inputText control.
        //1. Take the searchText
        //2. Search through the editorDiv for matches
        //3. Keep track of the hrefId-s where the matches are found and place those hrefIds into an array
        var spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN');
        var arrayFound = [];
        if (textToSearch) {
            for(var i = 0; i < spans.length; i++) {
                if (spans[i] && String(spans[i].id).indexOf('~!') > -1
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

    jumpToSearch(jumpTo, arrayFound) {
        //1. Take the current pointer value and set it according to the jumpTo value
        //2. If the value in the array doesn't exist but the array is greater than 0, then give the limitation of the last or first
        let {editDetails} = this.props;
        const {pointerSearchText, arraySearchTextFound, prevHrefId} = this.state

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

        //3. Get the original sentence
        //4. Set the highlight on the sentence.
        if (prevHrefId) {
            if (document.getElementById(prevHrefId) && editDetails && editDetails.length > 0
                    && editDetails.filter(m => m.hrefId === prevHrefId)) {
                document.getElementById(prevHrefId).style.backgroundColor = colorHasNewSection;
            } else if (document.getElementById(prevHrefId)){
                document.getElementById(prevHrefId).style.backgroundColor = "";
            }
        }
        //These arrayFound[nextPointer]-s have the ~! in the hrefId.  The bookmark version doesn't in this similar code.
        let elementFound = document.getElementById(arrayFound[nextPointer]);
        if (elementFound) {
            elementFound.style.backgroundColor = colorCurrentFocus;
            var topPos = elementFound.offsetTop;
            topPos -= 90;
            topPos = topPos < 0 ? 0 : topPos;
            document.getElementById('editorDiv').scrollTop = topPos;
            this.setState({
                prevHrefId: arrayFound[nextPointer],
                currentHrefId: arrayFound[nextPointer],
                prevSentence: elementFound.innerHTML
            });
            this.setJumpCounts(null, null, arrayFound[nextPointer]);
        }
    }

    handleNewSectionClose = () => this.setState({isShowingModal: false})
    handleNewSectionOpen = () => this.setState({isShowingModal: true})
    handleNewSectionSave = (newSectionName) => {
        //1. Update the section if it already exists in newSections.  Otherwise save it new.
        //2. Check the order by considering the index location of the hrefId so that the sections are in strict order.
        //      If not, saving and splitting text of more than one section that is out of order would have ovelapping and duplicate text.
        let newSections = this.state.newSections;
        let exists = false;
        for(var i = 0; i < newSections.length; i++) {
            if (newSections[i].hrefId === this.state.currentHrefId) {
                newSections[i].sectionName = newSectionName
                exists = true;
            }
        }
        let chapterText = document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML;
        newSections = !exists
            ? newSections.concat({
                    name: newSectionName,
                    hrefId: this.state.currentHrefId,
                    sequence: newSections.length + 1,
                    locationIndex: chapterText.indexOf(this.state.currentHrefId),
                })
            : newSections;

        newSections = doSort(newSections, {sortField: 'locationIndex', isAsc: true, isNumber: true});
        //Cut out the extra locationIndex so that it isn't sent to the webAPI (which is essential in this case since a flat array is sent due to object model problems on the back end)
        //  By the way, you can't depend on the hrefId-s being in consecutive order due to editing that can create new sentence HefId-s at any time.
        //newSections = newSections.map(m => {delete m.locationIndex; return m});
        //But we are going to have to wait until we are about to send off to the webAPI before we do that.  We need the locationIndex preserved while we keep saving new sections.
        this.setState({newSections})
        this.handleNewSectionClose();
        this.setJumpCounts(null, newSections);

    }

    handleNewSectionDelete = () => {
        let newSections = this.state.newSections;
        for(var i = 0; i < newSections.length; i++) {
            if (newSections[i].hrefId === this.state.currentHrefId) {
                newSections.splice(i);
            }
        }
        this.setState({newSections})
        this.handleNewSectionClose();
        this.setJumpCounts(null, newSections);
    }

    handleNewSectionDeleteByName = (sectionName) => {
        let newSections = [];
        for(var i = 0; i < this.state.newSections.length; i++) {
            if (this.state.newSections[i].name !== sectionName) {
                newSections = newSections ? newSections.concat(this.state.newSections[i]) : [this.state.newSections[i]];
            }
        }
        this.setState({newSections})
        this.handleNewSectionClose();
        this.setJumpCounts(null, newSections);
    }

    render() {
        const {chapterText, workSummary, personId, leftSidePanelOpen, toggleLeftSidePanelOpen, setJumpCounts} = this.props;
        const {isShowingModal, currentHrefId, currentSentence, newSections, searchText, pointerSearchText,
                arraySearchTextFound, sidePanel_open, sidePanel_docked, pointer, totalCount} = this.state;

        return (
            <div>
                <SplitterPanelDockable
                        open={sidePanel_open || leftSidePanelOpen}
                        docked={sidePanel_docked}
                        mediaQuery={this.props.mediaQuery}
                        onSetOpen={toggleLeftSidePanelOpen}
                        defaultSidebarWidth={360}
                        personId={personId}
                        leftSidePanelOpen={leftSidePanelOpen}
                        currentHrefId={currentHrefId}
                        newSections={newSections}
                        splitChapter={this.handleSubmit}
                        deleteSectionByName={this.handleNewSectionDeleteByName}
                        workSummary={workSummary}
                        toggleLeftSidePanelOpen={toggleLeftSidePanelOpen}>

                    <div className={styles.container}>
                        <div className={classes(globalStyles.pageTitle, styles.pageTitle)}>
                            <L p={p} t={`Split Section into Two or More`}/>
                        </div>
                        <div className={styles.toolSection}>
                            <SplitterOptionsBar className={leftSidePanelOpen ? styles.hidden : ''}
                                toggleLeftSidePanelOpen={toggleLeftSidePanelOpen} jumpToEdit={this.jumpToEdit}
                                setJumpCounts={setJumpCounts} pointer={pointer} totalCount={totalCount}
                                handleAuthorProcessText={this.handleAuthorProcessText}/>
                            <SearchTextTool hideLeftArrow={true} className={styles.marginLeft}
                                pointer={arraySearchTextFound && arraySearchTextFound.length > 0 ? pointerSearchText + 1 : 0}
                                totalCount={arraySearchTextFound && arraySearchTextFound.length > 0 && arraySearchTextFound.length}
                                jumpToSearch={this.jumpToSearch} searchText={searchText} submitSearchText={this.submitSearchText}/>
                        </div>
                        <div className={styles.editorDiv} contentEditable={false} dangerouslySetInnerHTML={{__html: chapterText}}
                            id="editorDiv" ref={ref => {this.editorDiv = ref}}/>
                    </div>
                    {isShowingModal &&
                        <TextareaModal key={'all'} handleClose={this.handleNewSectionClose} heading={<L p={p} t={`New Section Name`}/>}
                            explain={<L p={p} t={`The section name is initially set as the text you clicked on.  You can change the name here, as needed.`}/>}
                            placeholder={<L p={p} t={`Section name?`}/>} onClick={this.handleNewSectionSave}
                            onDelete={this.handleNewSectionDelete}
                            commentText={newSections.filter(m=>m.hrefId===currentHrefId)[0]
                                ? newSections.filter(m=>m.hrefId===currentHrefId)[0].name
                                : currentSentence}/>
                    }
                </SplitterPanelDockable>
            </div>
        );
    }
}
