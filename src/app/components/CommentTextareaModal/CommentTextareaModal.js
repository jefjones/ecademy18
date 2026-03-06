import React, {Component} from 'react';  //PropTypes
import styles from './CommentTextareaModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import ButtonWithIcon from '../ButtonWithIcon';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class CommentTextareaModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: '',
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const {personId, authorComment, editorComments} = this.props;

        let commentText = "";
        authorComment && personId === authorComment.personId
            ? commentText = authorComment.comment
            : editorComments && editorComments.length > 0 &&
                editorComments.forEach(m => {
                    if (m.personId === personId) {
                        commentText = m.comment;
                    }
                });

        this.setState({comment: commentText})
    }

    handleChange(event) {
        this.setState({comment: event.target.value});
    }

    render() {
        const {onClick, onDelete, handleClose, className, headerClass, heading, placeholder, editorComments,
                authorComment, personId} = this.props;

        let commentText = "";
        authorComment && personId === authorComment.personId
            ? commentText = authorComment.comment
            : editorComments && editorComments.length > 0 &&
                editorComments.forEach(m => {
                    if (m.personId === personId) {
                        commentText = m.comment;
                    }
                });

        let {comment} = this.props;
        //
        // var regex = "/<(.|\n)*?>/";
        // originalText = originalText &&
        //     originalText.replace(regex, "")
        //         .replace(/<br>/g, "")
        //         .replace(/<[^>]*>/g, ' ')
        //         .replace(/\s{2,}/g, ' ')
        //         .trim();


        return (
            <div className={classes(styles.className, className)}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.columns}>
                            <div className={classes(styles.dialogHeader, headerClass)}>{heading}</div>
                            <span className={styles.personAndDate}>
                                {authorComment && authorComment.fullName && authorComment.fullName + ` - ` + authorComment.entryDate}
                            </span>
                            <span className={styles.originalText}>{authorComment && authorComment.comment}</span>
                            <textarea rows={5} cols={40} value={comment} defaultValue={commentText} onChange={(event) => this.handleChange(event)}
                                placeholder={placeholder} className={styles.commentBox}></textarea>
                        </div>
                        <div className={styles.dialogButtons}>
                            {onDelete && <a className={styles.noButton} onClick={onDelete}>Delete</a>}
                            <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick(this.state.comment)}/>
                        </div>
                        {editorComments && editorComments.length > 0 &&
                            editorComments.map((m, i) =>
                            <div key={i} className={styles.columns}>
                                <span className={styles.personAndDate}>{m.fullName + ` - ` + m.entryDate}</span>
                                <span className={styles.originalText}>{m.comment}</span>
                            </div>
                        )}
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
