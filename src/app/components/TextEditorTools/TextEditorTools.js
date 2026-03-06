import React, {Component} from 'react';
import styles from './TextEditorTools.css';
import MessageModal from '../MessageModal';
import Checkbox from '../Checkbox';
import classes from 'classnames';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class TextEditorTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal_sentence: false,
            isShowingModal_active: false,
            isShowingModal_deleteEdit: false,
            isShowingLegend: false,
        };
    }

    handleDeleteEdit = () => {
        const {deleteEditDetail, editChosen, editDetails} = this.props;
        this.setState({isShowingModal_deleteEdit: false});

        let editText = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === editChosen)[0];

        let theIcon_editDetailId = editChosen && editChosen.indexOf('^^!') > -1
            ? editChosen.substring(editChosen.indexOf('^^!')+3)
            : '';

        let editDetailId = theIcon_editDetailId ? theIcon_editDetailId : editText.editDetailId;
        deleteEditDetail(editDetailId);
    }

    handleVote = (voteType) => {
        const {setEditReviewVote, editDetails, editReview, editChosen, personId} = this.props;
        let editText = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === editChosen)[0];

        let theIcon_editDetailId = editChosen && editChosen.indexOf('^^!') > -1
            ? editChosen.substring(editChosen.indexOf('^^!')+3)
            : '';

        let editDetailId = theIcon_editDetailId ? theIcon_editDetailId : editText.editDetailId;
        setEditReviewVote(editDetailId, voteType, personId, editReview.editCounts.sentenceText, "", false, false);
    }

    handleActiveClose = () =>  this.setState({isShowingModal_active: false})
    handleActiveOpen = () =>  this.setState({isShowingModal_active: true})
    handleSentenceClose = () =>  this.setState({isShowingModal_sentence: false})
    handleSentenceOpen = () =>  this.setState({isShowingModal_sentence: true})
    handleDeleteEditClose = () =>  this.setState({isShowingModal_deleteEdit: false})
    handleDeleteEditOpen = () =>  this.setState({isShowingModal_deleteEdit: true})
    handleToolLegendClose = () =>  this.setState({isShowingLegend: false})
    handleToolLegendOpen = () =>  this.setState({isShowingLegend: true})

    render() {
        const {isDraftView, tabsData, draftComparison, editorTabChosen,personId, setAcceptedEdit, workId, editReview, authorPersonId, editChosen,
                editDetails, workSummary, className, handleEditOwner, standardHrefId, toggleShowEditorTabDiff} = this.props;
        const {isShowingModal_sentence, isShowingModal_active, isShowingModal_deleteEdit, isShowingLegend} = this.state;

        // let isSentenceEditable = false;
        // if (sentenceChosen) {
        //     if (isDraftView) {
        //         isSentenceEditable = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false;
        //     } else {
        //         isSentenceEditable = true;
        //     }
        // }
        let isDraftCurrentTab = true;
        if (isDraftView) {
            isDraftCurrentTab = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false;
        }

        let acceptFunction = authorPersonId === personId
            ? () => setAcceptedEdit(personId, workId, workSummary, editReview.editCounts.editDetailId, authorPersonId === personId)
            : () => this.handleVote('AGREE');

        let deleteOrVoteFunction = authorPersonId === personId
            ? () => this.handleDeleteEdit()
            : () => this.handleVote('DISAGREE');

        let editText_editDetail = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === standardHrefId(editChosen))[0];

        let editDetailId = editChosen && editChosen.indexOf('^^!') > -1
            ? editChosen.substring(editChosen.indexOf('^^!')+3)
            : '';

        let edit = editDetailId
            ? editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
            : editText_editDetail;

        let hasEditDetailMine = edit && edit.personId === personId;
        let hasEditDetailOthers = edit && edit.personId !== personId;
        let hasEditDetailOtherTab = edit && edit.personId !== editReview.editorTabChosen;
        return (
            <div className={classes(styles.container, className)}>
                <div className={classes(styles.row, styles.iconSpaceLeft)} data-rh={authorPersonId === personId ? 'Accept this and delete the others' : 'Agree and use this edit'}>
                    <a onClick={hasEditDetailOthers ? acceptFunction : this.handleActiveOpen}>
                        <Icon pathName={`thumbs_up0`} premium={true} className={classes(styles.image, styles.moreLeft, hasEditDetailOthers ? '' : styles.disabled)}/>
                    </a>
                    <div className={styles.checkmarkCount}>{edit && edit.agreeCount ? edit.agreeCount : 0}</div>
                </div>
                <div className={styles.row} data-rh={authorPersonId === personId ? 'Decline this edit' : 'Disagree with this edit'}>
                    <a onClick={hasEditDetailOthers || authorPersonId === personId ? deleteOrVoteFunction : this.handleActiveOpen}>
                        <Icon pathName={`thumbs_down0`} premium={true} className={classes(styles.image, styles.moreTopMargin, hasEditDetailOthers ? '' : styles.disabled)}/>
                    </a>
                    <div className={styles.crossCount}>{edit && edit.disagreeCount ? edit.disagreeCount : 0}</div>
                </div>
                <div className={styles.row} data-rh={`Mark this as an obnoxious entry`}>
                    <a onClick={hasEditDetailOthers ? () => this.handleVote('TROLL') : this.handleActiveOpen}  className={classes(styles.row, styles.moreLeft)}>
                        <Icon pathName={`blocked`} fillColor={'red'} className={classes(styles.imageBlocked, hasEditDetailOthers ? '' : styles.disabled)}/>
                        <Icon pathName={`user_minus0`} premium={true} className={classes(styles.imageOverlay, hasEditDetailOthers ? '' : styles.disabled)}/>
                    </a>
                    <div className={styles.blockCount}>{edit && edit.trollCount ? edit.trollCount : 0}</div>
                </div>
                <div data-rh={`View the editor's full version`}>
                    <a onClick={hasEditDetailOtherTab ? () => handleEditOwner() : () => {}} className={classes(styles.row, hasEditDetailOtherTab ? '' : styles.disabled)}>
                        <Icon pathName={`document0`} premium={true} className={styles.imageDocument}/>
                        <Icon pathName={`magnifier`} premium={true} className={styles.imageMagnifier}/>
                    </a>
                </div>
                <a onClick={hasEditDetailMine ? this.handleDeleteEditOpen : this.handleActiveOpen} data-rh={`Undo your edit`}>
                    <Icon pathName={`undo2`} premium={true} className={classes(styles.lessLeft, hasEditDetailMine ? '' : styles.disabled)}/>
                </a>
								<div>
										<div onClick={() => toggleShowEditorTabDiff()} className={styles.upperLabel}><L p={p} t={`Show changes`}/></div>
										<Checkbox
												id={`editDifferenceView`}
												label={``}
												checked={editReview.showEditorTabDiff}
												checkboxClass={styles.checkbox}
												onClick={() => toggleShowEditorTabDiff()}/>
								</div>
                {isShowingModal_sentence &&
                   <MessageModal handleClose={this.handleSentenceClose} heading={<L p={p} t={`Choose a sentence`}/>}
                       explainJSX={<L p={p} t={`You must first choose a sentence before choosing this option.`}/>}
                       onClick={this.handleSentenceClose}/>
                 }
                 {isShowingModal_deleteEdit &&
                    <MessageModal handleClose={this.handleDeleteEditClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                       onClick={this.handleDeleteEdit} />
                 }
                 {isShowingModal_active &&
                    <MessageModal handleClose={this.handleActiveClose} heading={<L p={p} t={`This Feature is not Active`}/>}
                       explainJSX={<L p={p} t={`This option is not active.  If you are reacting to a moved sentence, you must be on the editor's tab who made the suggestion.  Or if you are on your own edit, you cannot accept or vote on your own edits.  But you can delete it.`}/>}
                       isConfirmType={false} onClick={this.handleActiveClose} />
                 }
                 {isShowingLegend &&
                     <MessageModal handleClose={this.handleToolLegendClose} heading={<L p={p} t={`Tool Options`}/>} showToolLegend={true}
                         onClick={this.handleToolLegendClose}/>
                 }
            </div>
        )
    }
};


// <div className={styles.row}>
//     <a onClick={this.handleToolLegendOpen}>
//         <Icon pathName={`info`} className={classes(styles.image, styles.moreLeft)}/>
//     </a>
// </div>
