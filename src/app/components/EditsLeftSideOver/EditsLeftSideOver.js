import React,{Component} from 'react'
import styles from './EditsLeftSideOver.css';
import classes from 'classnames';
import ReactTooltip from 'react-tooltip'
import ConfigModal from '../../components/ConfigModal';
import MessageModal from '../../components/MessageModal';
import DateMoment from '../../components/DateMoment';
import Icon from '../../components/Icon';
const p = 'component';
import L from '../../components/PageLanguage';
//import Diff from 'react-stylable-diff';

export default class EditsLeftSideOver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newEditText: '',
            acceptedEditDetailId: 0, //  This works for the editor as well as the author so that only his last accepted/voted-up edit will apply.
            isAuthorAcceptedEdit: false,
            isShowingModal_single: false,
            isShowingModal_all: false,
            isShowingModal_config: false,
            deleteIndex: 0
        }

        this.handleDisplay = this.handleDisplay.bind(this);
        this.handleClosed = this.handleClosed.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSingleDelete = this.handleSingleDelete.bind(this);
        this.handleAllDeletes = this.handleAllDeletes.bind(this);
        this.handleSingleDeleteClose = this.handleSingleDeleteClose.bind(this);
        this.handleSingleDeleteOpen = this.handleSingleDeleteOpen.bind(this);
        this.handleAllDeleteClose = this.handleAllDeleteClose.bind(this);
        this.handleAllDeleteOpen = this.handleAllDeleteOpen.bind(this);
        this.handleConfigClose = this.handleConfigClose.bind(this);
        this.handleConfigOpen = this.handleConfigOpen.bind(this);
    }

    componentDidMount() {
        const {editDetailsByHrefId, personId, originalSentence, personConfig} = this.props;
        //document.body.addEventListener("click", this.handleClosed);
        //We are taking away the button reaction since we needed the real estate at the bottom of the screen and above the tool bar.  Double clicking on a sentence will open up the left pane.
        //this.button.addEventListener("click", this.handleDisplay);  //We don't want to have a click here since it is so close to the options buttons below it.
        this.cancelButton.addEventListener("click", this.handleClosed);
        this.closeButton.addEventListener("click", this.handleClosed);
        this.resetButton.addEventListener("click", this.handleResetToOriginal);

        let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
        let thisUserText = hasUserEdit ? hasUserEdit.editText : originalSentence;
        this.setState({ newEditText: thisUserText})
        this.setState({ keepHistoryOn: personConfig.historySentenceView})
        this.setState({ keepAutoNextOn: personConfig.nextSentenceAuto})
        this.setState({ keepEditDifferenceOn: personConfig.editDifferenceView})

        if (personConfig.historySentenceView) {
            this.setState({ keepHistoryOn: true});
        }
        if (personConfig.nextSentenceAuto) {
            this.setState({ keepAutoNextOn: true});
        }
        if (personConfig.editDifferenceView) {
            this.setState({ keepEditDifferenceOn: true});
        }
    }

    componentWillUnmount() {
        const {editDetailsByHrefId, personId, originalSentence} = this.props;
        //document.body.removeEventListener("click", this.handleClosed);
        let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
        let thisUserText = hasUserEdit ? hasUserEdit.editText : originalSentence;
        this.setState({ newEditText: thisUserText})
    }

    handleDisplay(ev) {
        let {toggleLeftSidePanelOpen, getOriginalSentence, personId, chapterId, hrefId} = this.props;
        getOriginalSentence(personId, chapterId, hrefId);
        ev.stopPropagation();
        toggleLeftSidePanelOpen();
    }

    handleClosed() {
        let {toggleLeftSidePanelOpen, personConfig} = this.props;
        toggleLeftSidePanelOpen();
        personConfig && !personConfig.historySentenceView && this.setState({ keepHistoryOn: false});
        personConfig && !personConfig.nextSentenceAuto && this.setState({ keepAutoNextOn: false})
        personConfig && !personConfig.editDifferenceView && this.setState({ keepEditDifferenceOn: false})
    }

    handleResetToOriginal() {
        document.getElementById('singleEditor').innerHTML = document.getElementById('authorSentence').innerHTML;
    }

    handleAcceptEdit(editDetailId) {
        //The accepting of an edit will commit Me to taking that editText into the editor window.  They can still make an edit to the edit.
        //But overall this implies that they consider the edit a favorable option so that they will be scored well for it.
        //When the author accepts it, it is higher than if it is just another editor.  So ... only one acceptedEditDetailId per sentence for this page.
        const {editDetailsByHrefId, personId, authorPersonId} = this.props;
        let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
        if (editDetail) {
            if (editDetail.editText === "[<i>erased</i>]") {
                document.getElementById('singleEditor').innerHTML = "";
            } else {
                document.getElementById('singleEditor').innerHTML = editDetail.editText;
            }
            personId === authorPersonId && this.setState({ isAuthorAcceptedEdit: true });
            this.setState({ acceptedEditDetailId: editDetail.editDetailId });
        }
    }

    handleSave() {
        const {saveEdit, acceptedEditDetailId, isAuthorAcceptedEdit, toggleLeftSidePanelOpen, personConfig, setNextHrefId} = this.props;
        //I was having trouble getting the newEditText to have any data in it, so I went right to the source and pulled it from the ContentEditable editorDiv
        saveEdit(false)(document.getElementById(`singleEditor`).innerHTML)(acceptedEditDetailId, isAuthorAcceptedEdit);
        personConfig.nextSentenceAuto ? setNextHrefId() : toggleLeftSidePanelOpen();
    }

    handleVote(editDetailId, voteType) {
        const {editDetailsByHrefId, saveEditVote} = this.props;
        let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
        if (voteType === "AGREE") {
            document.getElementById('singleEditor').innerHTML = editDetail.editText;
        }
        if (editDetail) {
            //We are going to have to handle the Paragraph details, too.  For now we will just consider the editDetailId
            //The paragraph has two different IDs:  one for existing and one for new.  Maybe they can be combined.
            //ToDo: Maybe (most likely?) implement a voter comment about their choice for troll or disagree.  See VoteComment in position 4
            //isParagraph is the last position (set as false by default for now.)
            saveEditVote(editDetail.editDetailId, voteType, editDetail.personId, editDetail.editText, "", editDetail.isComment, false);
        }
    }

    handleSingleDelete(editDetailId, voteType) {
        const {deleteEditOrComment, editDetailsByHrefId} = this.props;
        this.setState({isShowingModal_single: false});
        let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
        if (editDetail) {
            //We are going to have to handle the Paragraph details, too.  For now we will just consider the editDetailId
            //The paragraph has two different IDs:  one for existing and one for new.  Maybe they can be combined.
            //ToDo: Maybe (most likely?) implement a voter comment about their choice for troll or disagree.  See VoteComment in position 4
            //isParagraph is the last position (set as false by default for now.)
            deleteEditOrComment(editDetail.editDetailId);
        }
    }

    handleRestore(editDetailId, voteType) {
        const {restoreEditOrComment, editDetailsByHrefId} = this.props;
        let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
        if (editDetail) {
            restoreEditOrComment(editDetail.editDetailId);
        }
    }

    handleAllDeletes() {
        const {deleteEditOrComment, editDetailsByHrefId} = this.props;
        this.setState({ isShowingModal_all: false })
        editDetailsByHrefId.forEach(m => {
            deleteEditOrComment(m.editDetailId);
        });
    }

    handleTextChange(e) {
        this.setState({ newEditText: e.target.value});
    }

    handleFullVersionView(tabPersonId) {
        this.props.setTabSelected(tabPersonId);
        this.props.toggleLeftSidePanelOpen();
    }

    handleSingleDeleteClose = () => this.setState({isShowingModal_single: false})
    handleSingleDeleteOpen = (deleteIndex) => this.setState({isShowingModal_single: true, deleteIndex,})
    handleAllDeleteClose = () => this.setState({isShowingModal_all: false})
    handleAllDeleteOpen = () => this.setState({isShowingModal_all: true})
    handleConfigClose = () => this.setState({isShowingModal_config: false})
    handleConfigOpen = () => this.setState({isShowingModal_config: true})

    render() {
        const {labelClass, editDetailsByHrefId, personId, authorPersonId, leftSidePanelOpen, originalSentence, personConfig,
                    updatePersonConfig, setNextHrefId} = this.props;
        const {isShowingModal_single, isShowingModal_all, isShowingModal_config, deleteIndex} = this.state;

        let editPendingCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => m.pendingFlag).length : 0;
        let editHistoryCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => !m.pendingFlag).length : 0;
        let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
        let thisUserText = hasUserEdit ? hasUserEdit.editText : originalSentence;

        let originalSentenceText = originalSentence;
        originalSentenceText = originalSentenceText && originalSentenceText
            .replace(/<[^>]*>/g, ' ')
           .replace(/\s{2,}/g, ' ')
           .trim();
        return (
            <div className={styles.container}>
                <div className={classes(labelClass, styles.editCount)} ref={(ref) => (this.button = ref)}>
                    <div className={styles.row}><L p={p} t={`edits:`}/><div>{editPendingCount}</div></div>
                    <div className={styles.row}><L p={p} t={`history:`}/><div>{editHistoryCount}</div></div>
                </div>
                <div className={classes(styles.children, (leftSidePanelOpen && styles.opened))}>
                    <a className={styles.closeButton} ref={(ref) => (this.closeButton = ref)}>X</a>
                    <span className={styles.authorDateLine}><L p={p} t={`Original Text`}/></span>
                    <span className={styles.authorSentence} ref={(ref) => (this.authorSentence = ref)}
                        id="authorSentence">{originalSentenceText}</span>
                    <div className={styles.resetDiv}>
                        <a className={styles.resetButton} ref={(ref) => (this.resetButton = ref)}>Reset</a>
                    </div>
                    <div className={styles.outerBorder}>
                        <span className={styles.myEdit}><L p={p} t={`my edit:`}/></span>
                        <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: thisUserText}}
                            id="singleEditor" ref={ref => {this.singleEditor = ref}} onChange={this.handleTextChange}/>
                    </div>
                    <div className={styles.buttonRow}>
                        {personId === authorPersonId && editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                            <a className={styles.deleteAllButton} onClick={this.handleAllDeleteOpen}><L p={p} t={`Delete All`}/></a>
                        }
                        {isShowingModal_all &&
                          <MessageModal key={'all'} handleClose={this.handleAllDeleteClose} heading={<L p={p} t={`Delete All Edits and Comments?`}/>}
                             explainJSX={<L p={p} t={`Are you sure you want to delete all of the edits and comments for this sentence?`}/>} isConfirmType={true}
                             onClick={this.handleAllDeletes} />
                        }
                        <a className={styles.cancelButton} ref={(ref) => (this.cancelButton = ref)}>Cancel</a>
                        <button className={styles.saveButton} onClick={this.handleSave}><L p={p} t={`Save`}/></button>
                        {personConfig.nextSentenceAuto && <a className={styles.prevButton} onClick={() => setNextHrefId('PREV')}><L p={p} t={`Prev`}/></a>}
                        {personConfig.nextSentenceAuto && <a className={styles.nextButton} onClick={setNextHrefId}><L p={p} t={`Next`}/></a>}

                        <a onClick={this.handleConfigOpen}>
                            <Icon pathName={`gearSettings`} className={styles.launchButton}/>
                        </a>

                        {isShowingModal_config &&
                            <ConfigModal personId={personId} personConfig={personConfig} updatePersonConfig={updatePersonConfig}
                                handleClose={this.handleConfigClose} heading={``} explain={``}/>}
                    </div>

                    <div className={styles.editDetails}>
                        {editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                            editDetailsByHrefId.map((m, i) => {
                                let tooltipText = "";
                                if (m.pendingFlag) {
                                    tooltipText += !m.isComment && m.personId !== personId ? <div><strong><L p={p} t={`Accept and choose this edit.`}/></strong>  <L p={p} t={`You can edit it further.  This will score this edit favorably.`}/></div> : "";
                                    tooltipText += personId === authorPersonId ? <L p={p} t={`All other edits which haven't been deleted (rejected) will be scored minimally for effort.`}/> : "";
                                    tooltipText += m.personId !== personId  ? <div><strong><L p={p} t={`Disagree with this edit.`}/></strong> <L p={p} t={`But use this sparingly since this decreases the user's score.  Please, be courteous.`}/></div> : "";
                                    tooltipText += m.personId !== personId ? <div><strong><L p={p} t={`Troll!`}/></strong><L p={p} t={`Use this tool to mark the entry as obnoxious or destructive.  The author ought to take away access for this editor.`}/></div> : "";
                                    tooltipText += (m.personId === personId || personId === authorPersonId) ? <div><strong><L p={p} t={`Delete.`}/></strong>  <L p={p} t={`You can delete your own edits or, if you are the author, you can delete others' edits.`}/></div> : "";
                                    tooltipText += m.personId !== personId ? <div><strong><L p={p} t={`See this editor's full version.`}/></strong> <L p={p} t={`This will return you to the main screen and automatically choose the tab where you can read their full version with their edits marked.`}/></div> : "";
                                } else {
                                    tooltipText += <div><strong><L p={p} t={`Restore`}/></strong>  <L p={p} t={`This is a processed edit.  It is showing up because your settings indicate that you want to view this sentence's history.  You can click on 'restore' in order to have a chance to accept it or edit it further.`}/></div>;
                                }

                                let differenceOriginalSentence = originalSentence  //eslint-disable-line
                                let differenceEditText = m.editText;  //eslint-disable-line
                                if (personConfig.editDifferenceView) {
                                    differenceOriginalSentence = differenceOriginalSentence && differenceOriginalSentence
                                        .replace(/<[^>]*>/g, ' ')
                                       .replace(/\s{2,}/g, ' ')
                                       .trim();
                                    differenceEditText = differenceEditText && differenceEditText
                                        .replace(/<[^>]*>/g, ' ')
                                       .replace(/\s{2,}/g, ' ')
                                       .trim();
                                }

                                let acceptFunction = personId === authorPersonId
                                        ? () => this.handleAcceptEdit(m.editDetailId)
                                        : () => this.handleVote(m.editDetailId, 'AGREE');

                            return (
                                <div className={styles.editDisplay} key={i}>
                                    <span className={styles.authorDateLine}>
                                        {m.personName + ` - `}
                                        <DateMoment date={m.entryDate} className={styles.authorDateLine}/>
                                        {m.isComment && <span className={styles.isComment}> Comment </span>}
                                        {!m.pendingFlag && m.authorAccepted && <span className={styles.isAccepted}> Accepted </span>}
                                        {!m.pendingFlag && !m.authorAccepted && <span className={styles.isProcessed}> Processed </span>}
                                    </span>
                                        <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                            id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
                                    {m.pendingFlag &&
                                        <div className={styles.toolOptions}>
                                            {!m.isComment && m.personId !== personId &&
                                                <span>
                                                    <a onClick={acceptFunction}>
                                                        <Icon pathName={`checkmark`} className={styles.choiceIcons}/>
                                                    </a>
                                                    <span className={styles.voteCount}>{m.agreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span>
                                                    <a onClick={() => this.handleVote(m.editDetailId, 'DISAGREE')}>
                                                        <Icon pathName={`cross`} className={styles.choiceIcons}/>
                                                    </a>
                                                    <span className={styles.voteCount}>{m.disagreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span>
                                                    <a onClick={() => this.handleVote(m.editDetailId, 'TROLL')}>
                                                        <Icon pathName={`blocked`} className={styles.choiceIcons}/>
                                                    </a>
                                                    <span className={styles.voteCount}>{m.trollCount}</span>
                                                </span>
                                            }
                                            {(m.personId === personId || personId === authorPersonId) &&
                                                <a onClick={() => this.handleSingleDeleteOpen(i)}>
                                                    <Icon pathName={`garbage_bin`} className={styles.choiceIcons}/>
                                                </a>
                                            }
                                            {isShowingModal_single && deleteIndex === i &&
                                              <MessageModal key={i} handleClose={this.handleSingleDeleteClose} heading={`Delete this Edit?`}
                                                 explain={`Are you sure you want to delete this edit?`} isConfirmType={true}
                                                 onClick={() => this.handleSingleDelete(m.editDetailId)} />
                                            }

                                            {m.personId !== personId &&
                                                <a onClick={() => this.handleFullVersionView(m.personId)}>
                                                    <Icon pathName={`docs_compare`} className={styles.choiceIcons}/>
                                                </a>
                                            }
                                            <span data-html={true} data-tip={tooltipText}>
                                                <Icon pathName={`info`} className={styles.choiceIcons}/>
                                                <ReactTooltip place="left" type="light" effect="solid" className={styles.tooltip} event={`click`}/>
                                            </span>
                                        </div>
                                    }
                                    {!m.pendingFlag &&
                                        <div className={styles.toolOptions}>
                                            <a className={styles.restoreButton} onClick={() => this.handleRestore(m.editDetailId)}>Restore</a>
                                            {!m.isComment && m.personId !== personId &&
                                                <span>
                                                    <Icon pathName={`checkmark`} className={styles.historyChoiceIcons}/>
                                                    <span className={styles.voteCount}>{m.agreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span>
                                                    <Icon pathName={`cross`} className={styles.historyChoiceIcons}/>
                                                    <span className={styles.voteCount}>{m.disagreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span>
                                                    <Icon pathName={`blocked`} className={styles.historyChoiceIcons}/>
                                                    <span className={styles.voteCount}>{m.trollCount}</span>
                                                </span>
                                            }
                                            <span data-html={true} data-tip={tooltipText}>
                                                <Icon pathName={`info`} className={styles.choiceIcons}/>
                                                <ReactTooltip place="left" type="light" effect="solid" className={styles.tooltip} event={`click`}/>
                                            </span>
                                        </div>
                                    }
                                </div>
                                )}
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}


// {personConfig.editDifferenceView && !m.isComment
//     ? <Diff inputA={differenceOriginalSentence} 
//         inputB={differenceEditText}
//         className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
//         type="words" />
//     : <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
//         id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
// }
