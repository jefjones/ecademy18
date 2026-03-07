import { useState } from 'react';  //PropTypes
import * as styles from './CarpoolRepeatDriver.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import SelectSingleDropDown from '../SelectSingleDropDown'
import ButtonWithIcon from '../ButtonWithIcon'
import moment from 'moment'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolRepeatDriver(props) {
  const [repeatWeeks, setRepeatWeeks] = useState(0)

  const {onClick, handleClose, repeatCarpoolTimeId, repeatCarpool} = props
          
  
  				let carpoolTime = repeatCarpool && repeatCarpool.carpoolTimes && repeatCarpool.carpoolTimes.length > 0 && repeatCarpool.carpoolTimes.filter(m => m.carpoolTimeId === repeatCarpoolTimeId)[0]
  				let toDate = ''
  				if (carpoolTime && carpoolTime.carpoolTimeId) {
  						toDate = carpoolTime.toDate
  				}
  				let today = moment()
  				let days = moment(toDate).diff(today, 'days')
  
  				let weeks = []
  				for(let i = 0; i <= days/7; i++) {
  					let option = { id: i, label: i }
  					weeks = weeks && weeks.length > 0 ? weeks.concat(option) : [option]
  				}
  
  
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.dialogHeader}>{<L p={p} t={`Repeat Driver Assignment`}/>}</div>
  												<div className={styles.dialogExplain}>{<L p={p} t={`How many weeks do you want to repeat this driver for the chosen day of the week?`}/>}</div>
  												<div className={styles.centered}>
  														<div>
  																<SelectSingleDropDown
  																		label={<L p={p} t={`Repeat weeks`}/>}
  																		value={repeatWeeks || ''}
  																		options={weeks || []}
  																		className={styles.moreBottomMargin}
  																		height={`short`}
  																		noBlank={true}
  																		onChange={handleChange}/>
  														</div>
  						            </div>
  												<br/>
  												<br/>
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}>Close</a>
  														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick(repeatWeeks)}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default CarpoolRepeatDriver
