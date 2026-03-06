import React, {Component} from 'react';  //PropTypes
import styles from './MessageModal.css';
import ButtonWithIcon from '../ButtonWithIcon';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
const p = 'component';
import L from '../../components/PageLanguage';

export default class TextareaModal extends Component {

		handleEnterKey = (event) => {
				event.key === "Enter" && this.props.onClick();
				event.preventDefault();
				event.stopPropagation();
		}

    render() {
        const {onClick, handleClose, heading, explain, explainJSX, isYesNoCancelType, yesText=<L p={p} t={`Yes`}/>, noText=<L p={p} t={`No`}/>, cancelText, handleNo,
								isConfirmType, children, isFinalize} = this.props;
        let {currentSentenceText} = this.props;

        var regex = "/<(.|\n)*?>/";
        currentSentenceText = currentSentenceText &&
            currentSentenceText.replace(regex, "")
                .replace(/<br>/g, "")
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim();

        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
                  <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
                    <div className={styles.dialogHeader}>{heading}</div>
                    <p className={styles.dialogExplain} dangerouslySetInnerHTML={{__html: explain}}/>
										{explainJSX ? explainJSX : ''}
										<div>{children}</div>
                    <div className={styles.currentSentence}>{currentSentenceText && currentSentenceText.replace(regex, "").substring(0,100) + `...`}</div>
										{isConfirmType === 'pendingApproval' &&
												<div className={styles.row}>
														<a className={styles.closeButton} onClick={handleClose}><L p={p} t={`Close`}/></a>
														<ButtonWithIcon label={<L p={p} t={`Decline`}/>} icon={'cross_circle'} onClick={() => onClick('decline')} changeRed={true}/>
														<ButtonWithIcon label={<L p={p} t={`Approve`}/>} icon={'checkmark_circle'} onClick={() => onClick('approve')}/>
												</div>
										}
										{isConfirmType !== 'pendingApproval' &&
												<div className={styles.centered}>
				                    <div className={styles.dialogButtons}>
				                        {!isConfirmType && !isYesNoCancelType && <ButtonWithIcon label={<L p={p} t={`OK`}/>} icon={'cross_circle'} onClick={onClick}/>}
				                        {isConfirmType && <a className={styles.noButton}  onClick={handleClose}>{noText}</a>}
				                        {isConfirmType && <ButtonWithIcon label={yesText} icon={'cross_circle'} onClick={onClick}/>}
																{isFinalize && <ButtonWithIcon label={<L p={p} t={`Revise`}/>} icon={'pencil0'} onClick={handleClose} changeRed={true}/>}
				                        {isYesNoCancelType && <a className={styles.noButton}  onClick={handleClose}>{cancelText}</a>}
				                        {isYesNoCancelType && <a className={styles.yesButton}  onClick={handleNo}>{noText}</a>}
				                        {isYesNoCancelType && <ButtonWithIcon label={yesText} icon={'cross_circle'} onClick={onClick}/>}
				                    </div>
												</div>
										}
                  </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
