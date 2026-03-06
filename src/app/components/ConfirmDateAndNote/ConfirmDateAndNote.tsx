import { useState } from 'react';  //PropTypes
import styles from './ConfirmDateAndNote.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import DateTimePicker from '../DateTimePicker'
import ButtonWithIcon from '../ButtonWithIcon'
import TimePicker from '../TimePicker'
import InputTextArea from '../InputTextArea'
const p = 'component'
import L from '../../components/PageLanguage'

function ConfirmDateAndNote(props) {
  const [confirmDate, setConfirmDate] = useState(props.date.indexOf('T') > -1 ? props.date.substring(0, props.date.indexOf('T')) : props.date)
  const [confirmTime, setConfirmTime] = useState(props.date.indexOf('T') > -1 ? props.date.substring(props.date.indexOf('T')+1,props.date.indexOf('T')+6) : props.time)
  const [comment, setComment] = useState('')
  const [errorConfirmDate, setErrorConfirmDate] = useState(<L p={p} t={`Please choose or enter a date`}/>)
  const [p, setP] = useState(undefined)
  const [errorConfirmTime, setErrorConfirmTime] = useState(<L p={p} t={`Please enter a time`}/>)

  const {onDelete, handleClose, className, headerClass, explainClass, heading, explain} = props
          
  
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={classes(styles.dialogHeader, headerClass)}>
                          	{!heading && <L p={p} t={`Confirm Date`}/>}
                          	{heading}
                          </div>
  												<div className={classes(styles.dialogExplain, explainClass)}>{explain || ''}</div>
  												<DateTimePicker id={`confirmDate`} value={confirmDate} label={<L p={p} t={`Confirm date`}/>} required={true} whenFilled={confirmDate}
  														onChange={(event) => changeDate('confirmDate', event)} error={errorConfirmDate}/>
  												<TimePicker id={`checkInTime`} label={<L p={p} t={`Start time`}/>} value={confirmTime || ''} onChange={handleChange} className={styles.notBold}
  														error={errorCheckInTime} boldText={true}/>
  												<InputTextArea label={<L p={p} t={`Note (optional)`}/>} rows={5} cols={45} value={comment} onChange={handleChange} id={'comment'} name={'comment'}
                              className={styles.commentBox}/>
                          <div className={styles.dialogButtons}>
                              {onDelete && <a className={styles.noButton} onClick={onDelete}><L p={p} t={`Delete`}/></a>}
                              <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
  														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default ConfirmDateAndNote
