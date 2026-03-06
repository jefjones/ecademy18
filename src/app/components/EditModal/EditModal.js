import React, {Component} from 'react';  //PropTypes
import styles from './EditModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class EditModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: this.props.editText,
            originalText_noHTML: ''
        }

        this.handleResetToOriginal = this.handleResetToOriginal.bind(this);
    }

    componentDidMount() {
        const {originalText} = this.props;
        var regex = "/<(.|\n)*?>/";
        let cleanText = originalText;
        cleanText.replace(regex, "")
            .replace(/<br>/g, "")
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
        this.setState({ originalText_noHTML: cleanText });
    }

    handleResetToOriginal() {
        this.singleEditor.innerHTML = this.props.originalText;
    }

    render() {
        const {handleClose, editText, saveEdit} = this.props;
        const {originalText_noHTML} = this.state;
        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <p className={classes(styles.originalText)} dangerouslySetInnerHTML={{__html: originalText_noHTML}}/>
                        <div className={styles.resetDiv}>
                            <a className={styles.resetButton} onClick={this.handleResetToOriginal}><L p={p} t={`Reset`}/></a>
                        </div>
                        <div className={styles.editBox} contentEditable={true} dangerouslySetInnerHTML={{__html: editText}} ref={ref => {this.singleEditor = ref}} />
                        <div className={styles.dialogButtons}>
                            <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
                            <button className={styles.yesButton} onClick={() => saveEdit(this.singleEditor.innerHTML)}><L p={p} t={`Save`}/></button>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
