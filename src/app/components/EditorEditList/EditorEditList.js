import React,{Component} from 'react'
import {browserHistory} from 'react-router';
import styles from './EditorEditList.css';
import classes from 'classnames';
import EditFilterModal from '../../components/EditFilterModal';
import TextareaModal from '../TextareaModal';
import MessageModal from '../../components/MessageModal';
import EditModal from '../EditModal';
import DateMoment from '../../components/DateMoment';
//import Diff from 'react-stylable-diff';
import Icon from '../../components/Icon';
const p = 'component';
import L from '../../components/PageLanguage';

/*
    ToDo:
    1. getOriginalSentence(personId, chapterId, hrefId);
        It's very possible that the originalText in the EditDetail record will not be accurate.  There is the UpdatedAuthorText which
            should be found in the EditDetail record, however.
    2. We will need to get the EditDetail record, too.
*/

export default class EditorEditList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            acceptedEditDetailId: 0, //  This works for the editor as well as the author so that only his last accepted/voted-up edit will apply.
            isAuthorAcceptedEdit: false,
            editDifferenceView: false,
            isShowingModal_single: false,
            isShowingModal_acceptAll: false,
            isShowingModal_deleteAll: false,
            isShowingModal_filter: false,
            isShowingModal_info: false,
            infoIndex: 0,
            isShowingModal_comment: false,
            commentIndex: 0,
            isShowingModal_edit: false,
            editIndex: 0,
            currentHrefId: 0,
            currentAuthorSentence: '',
        }

        this.handleSave = this.handleSave.bind(this);
        this.getMeHrefText = this.getMeHrefText.bind(this);
        this.getMeHrefComment = this.getMeHrefComment.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.handleSingleDelete = this.handleSingleDelete.bind(this);
        this.handleAllDeletes = this.handleAllDeletes.bind(this);
        this.handleAllAccepts = this.handleAllAccepts.bind(this);
        this.handleSingleDeleteClose = this.handleSingleDeleteClose.bind(this);
        this.handleSingleDeleteOpen = this.handleSingleDeleteOpen.bind(this);
        this.handleAllDeleteClose = this.handleAllDeleteClose.bind(this);
        this.handleAllDeleteOpen = this.handleAllDeleteOpen.bind(this);
        this.handleAllAcceptClose = this.handleAllAcceptClose.bind(this);
        this.handleAllAcceptOpen = this.handleAllAcceptOpen.bind(this);
        this.handleFilterClose = this.handleFilterClose.bind(this);
        this.handleFilterOpen = this.handleFilterOpen.bind(this);
        this.handleInfoClose = this.handleInfoClose.bind(this);
        this.handleInfoOpen = this.handleInfoOpen.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.handleEditOpen = this.handleEditOpen.bind(this);
        this.handleCommentClose = this.handleCommentClose.bind(this);
        this.handleCommentOpen = this.handleCommentOpen.bind(this);
        this.handleCommentSave = this.handleCommentSave.bind(this);
        this.handleSetAllFilter = this.handleSetAllFilter.bind(this);
    }

    handleAcceptEdit(editDetailId) {
        //The accepting of an edit will commit Me to taking that editText into the editor window.  They can still make an edit to the edit.
        //But overall this implies that they consider the edit a favorable option so that they will be scored well for it.
        //When the author accepts it, it is higher than if it is just another editor.
        //HOWEVER, it is the main editor screen and the left side-over panel which delays the actual approval until the author saves the edit
        //   that they just accepted (in case they want to make a slight change before committing).  But this page doesn't have that flow.  This
        //   is somewhat of a blind acceptance.  But our rule, so far, has been to preserve the edits for that same sentence until the author
        //   more directly dismisses all of them by either deleting them one-by-one or clicking on the "delete all button" in the left side-over panel.
        //   And be awre that the "delete all" here applies to all edits for all sentences that are listed -- and not the delete all version of a single
        //   sentence from the left side-over panel.  here, they are distinct sentences since an editor can only provide one edit and one comment personId
        //   sentence.
        const {editDetailsPerson, setAcceptedEdit, personId, setEditDetail, workId, chapterId, languageId, } = this.props;
        let editDetail = editDetailsPerson.filter(m => m.editDetailId === editDetailId)[0] || [];
        if (editDetail) {
            //Help todo:  TEst the updated setAcceptedEdit parameters, workid, chapterid, languageId, to make sure they are coming through.
            setAcceptedEdit(personId, editDetail.workId, editDetail.chapterId, editDetail.languageId, editDetailId, true);
            setEditDetail(personId, workId, chapterId, languageId, editDetail.hrefId, editDetail.editText, false, 'edit', '', [], true); //includeHistory = true
            //this.handleVote(editDetailId, "AGREE");  //This should already happen on the server side when the accepted edit is recorded
        }
    }

    handleSave = (hrefId) => (isComment) => (editText) => {
        const {personId, workId, chapterId, languageId, setEditDetail, editDetailsPerson} = this.props;
        let edit = editDetailsPerson && editDetailsPerson.length > 0 && editDetailsPerson.filter(m => m.hrefId === hrefId)[0];
        setEditDetail(personId, workId, chapterId, languageId, hrefId, editText, isComment);
        this.handleEditClose();
        this.handleCommentClose();
    }

    handleVote(editDetailId, voteType) {
        const {editDetailsPerson, setEditVoteBack} = this.props;
        let editDetail = editDetailsPerson.filter(m => m.editDetailId === editDetailId)[0] || [];
        if (editDetail) {
            setEditVoteBack(editDetail.editDetailId, voteType, editDetail.personId, editDetail.editText, editDetail.isComment);
        }
    }

    handleSingleDelete(editDetailId) {
        const {editDetailsPerson, deleteEditDetail, personId} = this.props;  //editDetailsPerson
        this.setState({isShowingModal_single: false});
        let editDetail = editDetailsPerson.filter(m => m.editDetailId === editDetailId)[0] || [];
        if (editDetail) {
            let thisEdit = editDetailsPerson && editDetailsPerson.length > 0 && editDetailsPerson.filter(m => m.editDetailId === editDetailId)[0];
            if (thisEdit) {
                deleteEditDetail(personId, editDetailId, true); //includeHistory = true
            }
        }
    }

    handleAllDeletes() {
        const {editDetailsPerson, deleteEditDetail, personId} = this.props;  //editDetailsPerson
        this.setState({isShowingModal_deleteAll: false});
        editDetailsPerson && editDetailsPerson.length > 0 &&
            editDetailsPerson.filter(m => m.personId !== personId && m.pendingFlag).forEach(m => {
                deleteEditDetail(personId, m.editDetailId, true); //includeHistory = true
            });
    }

    handleAllAccepts() {
        const {editDetailsPerson, personId} = this.props;  //editDetailsPerson
        this.setState({isShowingModal_acceptAll: false});
        editDetailsPerson && editDetailsPerson.length > 0 &&
            editDetailsPerson.filter(m => m.personId !== personId && m.pendingFlag).forEach(m => {
                this.handleAcceptEdit(m.editDetailId);
            });
    }

    handleRestore(editDetailId, voteType) {
        const {restoreEditDetail, personId, editDetailsPerson} = this.props;
        let thisEdit = editDetailsPerson && editDetailsPerson.length > 0 && editDetailsPerson.filter(m => m.editDetailId === editDetailId)[0];
        if (thisEdit) {
            restoreEditDetail(personId, editDetailId, true); //includeHistory = true
        }
    }

    handleTextChange(e) {
        this.setState({ newEditText: e.target.value});
    }

    handleFullVersionView(chosenTabPersonId, hrefId) {
        const {workId,  setVisitedHrefId, editDetails} = this.props;
        let href = editDetails && editDetails.length > 0 && editDetails.filter(m => m.hrefId === hrefId)[0];
        let hrefSentence = "";
        if (href) {
            hrefSentence = href.updatedAuthorText ? href.updatedAuthorText : href.authorText;
        }
        Promise.all([setVisitedHrefId(workId, hrefId, hrefSentence)])
            .then(browserHistory.push(`/editReview/` + chosenTabPersonId + `/` + hrefId));
    }

    getMeHrefText(hrefId, editorText) {
        const {personId, editDetails} = this.props;
        let myEdit = editDetails && editDetails.length > 0 && editDetails.filter(m => m.hrefId === hrefId && m.personId === personId);
        return myEdit.editText ? myEdit.editText : editorText;
    }

    getMeHrefComment(hrefId) {
        const {personId, editDetails} = this.props;
        let myComment = editDetails && editDetails.length > 0 && editDetails.filter(m => m.hrefId === hrefId && m.personId === personId && m.isComment === true)[0];
        return myComment ? myComment.editText : '';
    }

    handleCommentClose = () => this.setState({isShowingModal_comment: false})
    handleCommentOpen = (commentIndex) => this.setState({isShowingModal_comment: true, commentIndex,})
    handleCommentSave = (commentText) => {
        this.props.saveEditOrComment(true)(commentText)(null, false);
        this.setState({isShowingModal_comment: false})
    }
    handleSingleDeleteClose = () => this.setState({isShowingModal_single: false})
    handleSingleDeleteOpen = () => this.setState({isShowingModal_single: true})
    handleAllDeleteClose = () => this.setState({isShowingModal_deleteAll: false})
    handleAllDeleteOpen = () => this.setState({isShowingModal_deleteAll: true})
    handleAllAcceptClose = () => this.setState({isShowingModal_acceptAll: false})
    handleAllAcceptOpen = () => this.setState({isShowingModal_acceptAll: true})
    handleFilterClose = () => this.setState({isShowingModal_filter: false})
    handleFilterOpen = () => this.setState({isShowingModal_filter: true})
    handleInfoClose = () => this.setState({isShowingModal_info: false})
    handleInfoOpen = (infoIndex) => this.setState({isShowingModal_info: true, infoIndex })
    handleEditClose = () => this.setState({isShowingModal_edit: false})
    handleEditOpen = (editIndex, hrefId, hrefSentence) => this.setState(
        {
            isShowingModal_edit: true,
            editIndex,
            currentHrefId: hrefId,
            currentAuthorSentence: hrefSentence
        });

    handleSetAllFilter(isChecked) {
        const {updateFilter} = this.props;
        updateFilter(`pending`, isChecked)
        updateFilter(`accepted`, isChecked)
        updateFilter(`notAccepted`, isChecked)
        updateFilter(`upVote`, isChecked)
        updateFilter(`downVote`, isChecked)
        updateFilter(`trollVote`, isChecked)
        updateFilter(`edits`, isChecked)
        updateFilter(`comments`, isChecked)
        updateFilter(`searchText`, "")
    }

    render() {
        const {editDetailsPerson, personId, authorPersonId, originalSentence, returnToSummary, updateFilter, localFilter} = this.props;
        const {editDifferenceView, isShowingModal_single, isShowingModal_deleteAll, isShowingModal_acceptAll, isShowingModal_filter, isShowingModal_edit, editIndex,
                isShowingModal_info, infoIndex, isShowingModal_comment, commentIndex} = this.state;

        let editPendingCount = editDetailsPerson && editDetailsPerson.length > 0 ? editDetailsPerson.filter(m => m.pendingFlag).length : 0;
        let editHistoryCount = editDetailsPerson && editDetailsPerson.length > 0 ? editDetailsPerson.filter(m => !m.pendingFlag).length : 0;
        let editorFullName = editDetailsPerson && editDetailsPerson.length > 0 && editDetailsPerson[0].personName;
        let isCommentSave = true;

        return (
            <div className={styles.container}>
                <div className={styles.topInfo}>
                    <a className={styles.returnText} onClick={returnToSummary}>
                        <Icon pathName={`left_arrow`}/>
                        <span className={styles.backToSummary}><L p={p} t={`back to summary`}/></span>
                    </a>
                    <div className={styles.editCount}>
                        <div className={styles.row}><L p={p} t={`edits:`}/><div>{editPendingCount}</div></div>
                        <div className={classes(styles.row, styles.editsHistory)}><L p={p} t={`history:`}/><div>{editHistoryCount}</div></div>
                    </div>
                    <a className={styles.filterLink} onClick={this.handleFilterOpen}>{`filter`}</a>
                    <b className={styles.caret}/>
                </div>
                <span className={styles.editorName}>{editorFullName}</span>
                <div className={styles.buttonRow}>
                    {personId === authorPersonId && editDetailsPerson && editDetailsPerson.length > 0 &&
                        <a className={styles.acceptAllButton} onClick={this.handleAllAcceptOpen}><L p={p} t={`Accept All`}/></a>
                    }
                    {personId === authorPersonId && editDetailsPerson && editDetailsPerson.length > 0 &&
                        <a className={styles.deleteAllButton} onClick={this.handleAllDeleteOpen}><L p={p} t={`Delete All`}/></a>
                    }
                </div>
                <div className={styles.editDetails}>
                    {editDetailsPerson && editDetailsPerson.length > 0 &&
                        editDetailsPerson.filter(m => m.personId === localFilter.personId).map((m, i) => {
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

                            let differenceOriginalSentence = originalSentence;  //eslint-disable-line
                            let differenceEditText = m.editText;    //eslint-disable-line
                            if (editDifferenceView) {
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
                                <div className={styles.toolOptions}>
                                    {!m.pendingFlag &&
                                        <a className={styles.restoreButton} onClick={() => this.handleRestore(m.editDetailId)}>Restore</a>
                                    }
                                    {m.pendingFlag &&
                                        <a onClick={() => this.handleEditOpen(i, m.hrefId, m.updatedAuthorText ? m.updatedAuthorText : m.authorText)}>
                                            <Icon pathName={`pencil`} className={styles.choiceIcons_less}/>
                                        </a>
                                    }
                                    {isShowingModal_edit && editIndex === i &&
                                        <EditModal key={i} handleClose={() => this.handleEditClose(editIndex)}
                                            originalText={m.updatedAuthorText ? m.updatedAuthorText : m.authorText} saveEdit={this.handleSave(!isCommentSave)}
                                            editText={this.getMeHrefText(m.hrefId, m.editText ? m.editText : m.updatedAuthorText ? m.updatedAuthorText : m.authorText)} />
                                    }
                                    {m.pendingFlag && (m.personId !== personId || !m.isComment) &&
                                        <a onClick={() => this.handleCommentOpen(i)}>
                                            <Icon pathName={`comment_text`} premium={true} className={styles.choiceIcons_less}/>
                                        </a>
                                    }
                                    {isShowingModal_comment && commentIndex === i &&
                                        <TextareaModal key={i} handleClose={this.handleCommentClose} heading={``} explain={``}
                                            onClick={this.handleSave(m.hrefId)(isCommentSave)} placeholder={`Comment?`}
                                            currentSentenceText={m.updatedAuthorText ? m.updatedAuthorText : m.authorText} commentText={this.getMeHrefComment(m.hrefId)}/>
                                    }
                                    {m.pendingFlag && m.personId !== personId &&
                                        <span>
                                            <a onClick={acceptFunction}>
                                                <Icon pathName={`checkmark`} className={styles.choiceIcons_less}/>
                                            </a>
                                            <span className={styles.voteCount}>{m.agreeCount}</span>
                                        </span>
                                    }
                                    {m.pendingFlag && m.personId !== personId &&
                                        <span>
                                            <a onClick={() => this.handleVote(m.editDetailId, 'DISAGREE')}>
                                                <Icon pathName={`cross`} className={styles.choiceIcons}/>
                                            </a>
                                            <span className={styles.voteCount}>{m.disagreeCount}</span>
                                        </span>
                                    }
                                    {m.pendingFlag && m.personId !== personId &&
                                        <span>
                                            <a onClick={() => this.handleVote(m.editDetailId, 'TROLL')}>
                                                <Icon pathName={`blocked`} className={styles.choiceIcons}/>
                                            </a>
                                            <span className={styles.voteCount}>{m.trollCount}</span>
                                        </span>
                                    }
                                    {!m.pendingFlag &&
                                        <span>
                                            <Icon pathName={`checkmark`} className={styles.historyChoiceIcons}/>
                                            <span className={styles.voteCount}>{m.agreeCount}</span>
                                        </span>
                                    }
                                    {!m.pendingFlag &&
                                        <span>
                                            <Icon pathName={`cross`} className={styles.historyChoiceIcons}/>
                                            <span className={styles.voteCount}>{m.disagreeCount}</span>
                                        </span>
                                    }
                                    {!m.pendingFlag &&
                                        <span>
                                            <Icon pathName={`blocked`} className={styles.historyChoiceIcons}/>
                                            <span className={styles.voteCount}>{m.trollCount}</span>
                                        </span>
                                    }
                                    {m.pendingFlag && (m.personId === personId || personId === authorPersonId) &&
                                        <a onClick={this.handleSingleDeleteOpen}>
                                            <Icon pathName={`garbage_bin`} className={styles.choiceIcons}/>
                                        </a>
                                    }
                                    {isShowingModal_single &&
                                      <MessageModal key={i} handleClose={this.handleSingleDeleteClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                                         explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                                         onClick={() => this.handleSingleDelete(m.editDetailId)} />
                                    }
                                    {m.personId !== personId &&
                                        <a onClick={() => this.handleFullVersionView(m.personId, m.hrefId)}>
                                            <Icon pathName={`docs_compare`} className={styles.choiceIcons_less}/>
                                        </a>
                                    }
                                    <a onClick={() => this.handleInfoOpen(i)}>
                                        <Icon pathName={`info`} className={styles.choiceIcons}/>
                                    </a>
                                    {isShowingModal_info && infoIndex === i &&
                                      <MessageModal key={i} handleClose={this.handleInfoClose} heading={``} explainJSX={tooltipText} onClick={this.handleInfoClose} />
                                    }
                                </div>
                            </div>
                            )}
                        )
                    }
                </div>
                {isShowingModal_filter &&
                    <EditFilterModal handleClose={this.handleFilterClose} editFilter={localFilter} updateFilter={updateFilter} setFilters={this.handleSetAllFilter}/>
                }
                {isShowingModal_deleteAll &&
                  <MessageModal key={'delelteAll'} handleClose={this.handleAllDeleteClose} heading={<L p={p} t={`Delete All Edits and Comments?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete all of the edits and comments for this sentence?`}/>} isConfirmType={true}
                     onClick={this.handleAllDeletes} />
                }
                {isShowingModal_acceptAll &&
                  <MessageModal key={'acceptAll'} handleClose={this.handleAllAcceptClose} heading={<L p={p} t={`Accept All Edits and Comments?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to accept all of the edits and comments for this editor?`}/>} isConfirmType={true}
                     onClick={this.handleAllAccepts} />
                }
            </div>
        )
    }
}


//                                {editDifferenceView && !m.isComment
                                //     ? <Diff inputA={differenceOriginalSentence} 
                                //         inputB={differenceEditText}
                                //         className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                //         type="words" />
                                //     : <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                //         id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
                                // }
