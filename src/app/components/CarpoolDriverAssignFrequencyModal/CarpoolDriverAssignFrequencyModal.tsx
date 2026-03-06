import { useState } from 'react';  //PropTypes
import styles from './CarpoolDriverAssignFrequencyModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import InputText from '../InputText'
import ButtonWithIcon from '../ButtonWithIcon'
import SelectSingleDropDown from '../SelectSingleDropDown'
import TextDisplay from '../TextDisplay'
import RadioGroup from '../RadioGroup'
import DateMoment from '../DateMoment'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolDriverAssignFrequencyModal(props) {
  const [frequency, setFrequency] = useState('')
  const [weekCount, setWeekCount] = useState('')
  const [comment, setComment] = useState('')
  const [errorFrequency, setErrorFrequency] = useState('')
  const [errorSeats, setErrorSeats] = useState(<L p={p} t={`A frequency choice is required`}/>)
  const [p, setP] = useState(undefined)

  const {handleClose, driverDate, dropOffOrPickUp, driverPersonId, carpool} = props
          
  
  				let driver = carpool && carpool.members && carpool.members.length > 0 && carpool.members.filter(m => m.personId === driverPersonId)[0]
  				let weeks = []
  				for(let i = 1; i < 25; i++) {
  						weeks.concat({ id: i, label: `${i} weeks` })
  				}
  
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.dialogHeader}>{<L p={p} t={`Carpool Driver Assignment Frequency`}/>}</div>
  												<div className={styles.rowWrap}>
  														<TextDisplay label={<L p={p} t={`Carpool name`}/>} text={carpool.areaName}/>
  														<TextDisplay label={<L p={p} t={`Driver name`}/>} text={driver.firstName + ' ' + driver.lastName}/>
  														<TextDisplay label={<L p={p} t={`Driver date`}/>} text={<DateMoment date={driverDate} format={'D MMM'}/>}/>
  														<TextDisplay label={<L p={p} t={`Drop off or Pickup`}/>} text={dropOffOrPickUp}/>
  												</div>
  												<div className={styles.moreTop}>
  														<RadioGroup
  																data={[
  																		{id: 'dayOnly', label: <L p={p} t={`One day at a time`}/>},
  																		{id: 'dayOnly',
  																			label: <div className={styles.row}>
  																								<L p={p} t={`Repeat the same day for`}/>
  																								<div>
  																										<SelectSingleDropDown
  																												id={`weekRepeat`}
  																												name={`weekRepeat`}
  																												label={``}
  																												value={weekRepeat || ''}
  																												options={weeks}
  																												className={styles.moreBottomMargin}
  																												height={`short`}
  																												onChange={handleWeekRepeatChange}/>
  																									</div>
  																							</div>
  																		}
  																]}
  																name={`repeatAssignment`}
  																label={<L p={p} t={`To which carpool do you want to invite this member?`}/>}
  																horizontal={false}
  																className={styles.radio}
  																initialValue={frequency || ''}
  																onClick={handleRepeatChoice}
  																error={errorFrequency}/>
  												</div>
  												<div>
  														<InputText
  																id={'comment'}
  																name={'comment'}
  																value={comment}
  																label={<L p={p} t={`Comment (optional)`}/>}
  																size={"long"}
  																onChang={handleChange}/>
  						            </div>
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
  														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default CarpoolDriverAssignFrequencyModal
