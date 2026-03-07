import { useState } from 'react';  //PropTypes
import * as styles from './CarpoolRequestResponseModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import InputText from '../InputText'
import TextDisplay from '../TextDisplay'
import RadioGroup from '../RadioGroup'
import ButtonWithIcon from '../ButtonWithIcon'
import {guidEmpty} from '../../utils/guidValidate'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolRequestResponseModal(props) {
  const [seatsAvailable, setSeatsAvailable] = useState('')
  const [seatsNeeded, setSeatsNeeded] = useState('')
  const [canDropOffDays, setCanDropOffDays] = useState('')
  const [canPickUpDays, setCanPickUpDays] = useState('')
  const [inviteCarpoolId, setInviteCarpoolId] = useState('')
  const [comment, setComment] = useState('')
  const [errorSeats, setErrorSeats] = useState('')
  const [errorDropOffOrPickUp, setErrorDropOffOrPickUp] = useState('')
  const [errorCarpoolId, setErrorCarpoolId] = useState("Please choose which carpool you would like to invite this member to.")

  const {handleClose, daysOfWeek, carpoolRequest, carpools} = props
          
  
  				let carpoolOptions = []
  				carpools && carpools.length > 0 && carpools.forEach(m => {
  						carpoolOptions.push({
  								id: m.carpoolId,
  								label: m.name
  						})
  				})
  
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.dialogHeader}>{<L p={p} t={`Carpool Request Response`}/>}</div>
  												<div className={styles.rowWrap}>
  														<TextDisplay label={<L p={p} t={`Area name`}/>} text={carpoolRequest.areaName}/>
  														<TextDisplay label={<L p={p} t={`Requester name`}/>} text={carpoolRequest.personName}/>
  														<TextDisplay label={<L p={p} t={`Seats vacant`}/>} text={carpoolRequest.seatsAvailable ? carpoolRequest.seatsAvailable : ''}/>
  														<TextDisplay label={<L p={p} t={`Seats needed`}/>} text={carpoolRequest.seatsNeeded ? carpoolRequest.seatsNeeded : ''}/>
  												</div>
  												<div>
  														<InputText
  																id={'seatsAvailable'}
  																name={'seatsAvailable'}
  																value={seatsAvailable || ''}
  																label={<L p={p} t={`Seats vacant in my car`}/>}
  																size={"super-short"}
  																numberOnly={true}
  																onChange={handleChange}
  																error={errorSeats}/>
  						            </div>
  												<div>
  														<InputText
  																id={'seatsNeeded'}
  																name={'seatsNeeded'}
  																value={seatsNeeded && seatsNeeded !== 0 ? seatsNeeded : ''}
  																label={<L p={p} t={`Number of seats I need for my students when others drive`}/>}
  																size={"super-short"}
  																numberOnly={true}
  																onChange={handleChange}/>
  						            </div>
  												{/*<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
  														<CheckboxGroup
  																name={'canDropOffDays'}
  																options={daysOfWeek || []}
  																horizontal={true}
  																onSelectedChanged={handleSelectedCanDropOffDays}
  																label={'I can drop-off on days:'}
  																selected={canDropOffDays}
  																labelClass={styles.checkboxLabel}
  																error={errorDropOffOrPickUp}/>
  												</div>
  												<div className={globalStyles.multiSelect}>
  														<CheckboxGroup
  																name={'canPickUpDays'}
  																options={daysOfWeek || []}
  																horizontal={true}
  																onSelectedChanged={handleSelectedCanPickUpDays}
  																label={'I can pick-up on days:'}
  																labelClass={styles.checkboxLabel}
  																selected={canPickUpDays}/>
  												</div>*/}
  												<div className={styles.label}>{`Comment (optional)`}</div>
  												<textarea rows={5} cols={35} value={comment} onChange={handleChange} id={'comment'} name={'comment'}
                              className={styles.commentBox}/>
  												{carpools && carpools.length > 1 &&
  														<div className={styles.moreTop}>
  																<RadioGroup
  																		data={carpoolOptions}
  																		name={`carpoolId`}
  																		label={<L p={p} t={`To which carpool do you want to invite this member?`}/>}
  																		horizontal={false}
  																		className={styles.radio}
  																		initialValue={inviteCarpoolId || ''}
  																		onClick={handleCarpoolChoice}
  																		error={errorCarpoolId}/>
  														</div>
  												}
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
  														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default CarpoolRequestResponseModal
