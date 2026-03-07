import 'react';  //PropTypes
import * as styles from './CommentListModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import DateMoment from '../DateMoment'
import ButtonWithIcon from '../ButtonWithIcon'
import TextDisplay from '../TextDisplay'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

const CommentListModal = props => {
    const {handleClose, comments} = props

    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
              <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
                <div className={classes(styles.dialogHeader, styles.row)}>{<L p={p} t={`Gallery Photo Comments`}/>}</div>
                {comments && comments.length > 0 && comments.map((m, i) =>
                    <div>
                        <div className={styles.rowWrap}>
                            <TextDisplay label={<L p={p} t={`Entered by`}/>} text={m.entryPersonFirstName + ' ' + m.entryPersonLastName} textClassName={styles.lighter}/>
                            <TextDisplay label={<L p={p} t={`Entered on`}/>} text={<div className={styles.row}><DateMoment date={m.entryDate} format={'D MMM  h:mm a'} minusHours={6}/></div>}  textClassName={styles.lighter}/>
                        </div>
                        <div className={styles.comment}>{m.comment}</div>
                    </div>
                )}
                <div className={styles.dialogButtons}>
                                            <ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={handleClose}/>
                </div>
              </ModalDialog>
            </ModalContainer>
        </div>
    )
}

export default CommentListModal
