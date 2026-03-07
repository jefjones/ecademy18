import 'react';  //PropTypes
import * as styles from './AssessIncompleteModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
const p = 'component'
import L from '../../components/PageLanguage'

const AssessIncompleteModal = props => {
    const {onClick, handleClose, heading, notAnswered, forceAllAnswers} = props

    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
              <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
                <div className={styles.dialogHeader}>{heading}</div>
                <p className={styles.dialogExplain}>{<L p={p} t={`The following questions are not yet answered:`}/>}</p>
                                    {notAnswered && notAnswered.length > -1 && notAnswered.map((m, i) =>
                                            <div key={i} className={styles.text}>{m}</div>
                                    )}
                                    <p className={styles.dialogExplain}>{forceAllAnswers ? <L p={p} t={`You must answer all questions.`}/> : <L p={p} t={`Do you want to submit the incomplete answers anyway?`}/>}</p>
                <div className={styles.dialogButtons}>
                    <button className={forceAllAnswers ? styles.yesButton : styles.noButton} onClick={handleClose}>{forceAllAnswers ? <L p={p} t={`OK`}/> : <L p={p} t={`No`}/>}</button>
                    {!forceAllAnswers && <button className={styles.yesButton} onClick={onClick}>{<L p={p} t={`Yes`}/>}</button>}
                </div>
              </ModalDialog>
            </ModalContainer>
        </div>
    )
}

export default AssessIncompleteModal
