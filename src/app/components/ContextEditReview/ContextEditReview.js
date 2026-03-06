import React, {Component} from 'react';
import styles from './ContextEditReview.css';
import MessageModal from '../MessageModal';
import classes from 'classnames';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class ContextEditReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal_deleteEdit: false
        };
    }

    componentDidMount() {
        document.body.addEventListener('click', this.props.hideContextEditReviewMenu);
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

    handleDeleteEditClose = () =>  this.setState({isShowingModal_deleteEdit: false})
    handleDeleteEditOpen = () =>  this.setState({isShowingModal_deleteEdit: true})

    render() {
        const {className="", editDetails, isAuthor, setAcceptedEdit, personId, workId, workSummary, editReview, editChosen, standardHrefId } = this.props;
        const {isShowingModal_deleteEdit} = this.state;

        let acceptFunction = isAuthor
            ? () => setAcceptedEdit(personId, workId, workSummary, editReview.editCounts.editDetailId, isAuthor)
            : () => this.handleVote('AGREE');

        let deleteOrVoteFunction = isAuthor
            ? () => this.handleDeleteEdit()
            : () => this.handleVote('DISAGREE');

        let editText_editDetail = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === standardHrefId(editChosen))[0];

        let editDetailId = editChosen && editChosen.indexOf('^^!') > -1
            ? editChosen.substring(editChosen.indexOf('^^!') + 3)
            : '';

        let edit = editDetailId
            ? editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
            : editText_editDetail;

        //editOrCommentText - this can be the actual edit text, the comment text, or the type of edit that it is.

        return (
            <div className={classes(styles.container, styles.row, className)}>
                {edit && edit.personId !== personId &&
                    <div className={styles.multipleContainer}>
                        <div className={styles.row} data-rh={isAuthor ? <L p={p} t={`Accept this and delete the others`}/> : <L p={p} t={`Agree and use this edit`}/>}>
                            <a onClick={acceptFunction}>
                                <Icon pathName={`thumbs_up0`} premium={true} className={classes(styles.image)}/>
                            </a>
                            <div className={styles.checkmarkCount}>{edit && edit.agreeCount ? edit.agreeCount : 0}</div>
                        </div>
                        <div className={classes(styles.row, styles.middleIcon)} data-rh={isAuthor ? <L p={p} t={`Decline this edit`}/> : <L p={p} t={`Disagree with this edit`}/>}>
                            <a onClick={deleteOrVoteFunction}>
                                <Icon pathName={`thumbs_down0`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                            </a>
                            <div className={styles.crossCount}>{edit && edit.disagreeCount ? edit.disagreeCount : 0}</div>
                        </div>
                        <div className={classes(styles.row, styles.moreRight)} data-rh={`Mark this as an obnoxious entry`}>
                            <a onClick={() => this.handleVote('TROLL')}  className={classes(styles.row, styles.moreLeft)}>
                                <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                                <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                            </a>
                            <div className={styles.blockCount}>{edit && edit.trollCount ? edit.trollCount : 0}</div>
                        </div>
                    </div>
                }
                {edit && edit.personId === personId &&
                    <a onClick={this.handleDeleteEditOpen} className={styles.undo}>
                        <Icon pathName={`undo2`} premium={true} className={styles.lessLeft}/>
                    </a>
                }
                {isShowingModal_deleteEdit &&
                    <MessageModal handleClose={this.handleDeleteEditClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                       onClick={this.handleDeleteEdit} />
                }
            </div>
        )
    }
};
