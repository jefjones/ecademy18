import { useState } from 'react';  //PropTypes
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import globalStyles from '../../utils/globalStyles.css'
import styles from './CarpoolAcceptRequestDirectModal.css'
import CheckboxGroup from '../CheckboxGroup'
import WeekdayDisplay from '../WeekdayDisplay'
import TimeDisplay from '../TimeDisplay'
import DateMoment from '../DateMoment'
import FlexColumn from '../FlexColumn'
import ButtonWithIcon from '../ButtonWithIcon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolAcceptRequestDirectModal(props) {
  const [seatsAvailable, setSeatsAvailable] = useState('')
  const [seatsNeeded, setSeatsNeeded] = useState('')
  const [errorSeats, setErrorSeats] = useState('')

  const {handleClose, carpoolRequestDirect, daysOfWeekAll} = props
  
  				let dataPickUp = []
  				carpoolRequestDirect && carpoolRequestDirect.carpoolTimes && carpoolRequestDirect.carpoolTimes.length > 0
  								&& carpoolRequestDirect.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').forEach((m, i) => {
  
  						let daysOfWeekOptions = []
  						daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(d => {
  								if (m.daysOfWeek.indexOf(d.id) > -1)
  										daysOfWeekOptions = daysOfWeekOptions && daysOfWeekOptions.length > 0 ? daysOfWeekOptions.concat(d) : [d]
  						})
  
  						dataPickUp.push([
  								{value: <TimeDisplay time={m.time}/>, boldText: true},
  								{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
  								{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
  								{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
  								{value: <div className={classes(globalStyles.multiSelect, styles.moreTop)}>
  														<CheckboxGroup
  																name={'daysICanDrive'}
  																options={daysOfWeekOptions || []}
  																horizontal={true}
  																onSelectedChanged={handleDaysICanDrive}
  																label={<L p={p} t={`Days I can drive (generally)`}/>}
  																labelClass={styles.text}
  																selected={m.daysICanDrive}/>
  												</div>
  								},
  						])
  				})
  
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.dialogHeader}>{<L p={p} t={`Carpool Request Response`}/>}</div>
  												{/*<div>
  														<InputText
  																id={'seatsAvailable'}
  																name={'seatsAvailable'}
  																value={seatsAvailable || ''}
  																label={`Seats vacant in my car`}
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
  																label={`Number of seats I need for my students when others drive.`}
  																size={"super-short"}
  																numberOnly={true}
  																onChange={handleChange}/>
  						            </div>*/}
  												<div>
  														<div className={styles.dropOffBackground}>
  																{carpoolRequestDirect && carpoolRequestDirect.carpoolTimes && carpoolRequestDirect.carpoolTimes.length > 0
  																				&& carpoolRequestDirect.carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff').map((m, i) => {
  
  																		let daysOfWeekOptions = []
  																		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(d => {
  																				if (m.daysOfWeek.indexOf(d.id) > -1)
  																						daysOfWeekOptions = daysOfWeekOptions && daysOfWeekOptions.length > 0 ? daysOfWeekOptions.concat(d) : [d]
  																		})
  
  																		return (
  																				<div key={i}>
  																						<FlexColumn heading={<L p={p} t={`Drop-off`}/>} data={<TimeDisplay time={m.time}/>} />
  																						<FlexColumn heading={<L p={p} t={`From date`}/>} data={<DateMoment date={m.fromDate} includeTime={false}/>} />
  																						<FlexColumn heading={<L p={p} t={`To date`}/>} data={<DateMoment date={m.toDate} includeTime={false}/>} />
  																						<FlexColumn heading={<L p={p} t={`Days`}/>} data={<WeekdayDisplay days={m.daysOfWeek}/>} />
  																						<FlexColumn heading={<L p={p} t={`Days I can drive (generally)`}/>}
  																								data={<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
  																													<CheckboxGroup
  																															name={'daysICanDrive'}
  																															options={daysOfWeekOptions || []}
  																															horizontal={true}
  																															recordTypeId={m.carpoolTimeId}
  																															onSelectedChanged={handleDaysICanDrive}
  																															label={''}
  																															labelClass={styles.text}
  																															selected={m.daysICanDrive}/>
  																											</div>
  																						} />
  																				</div>
  																		)
  																	})
  																}
  														</div>
  														<div className={styles.pickUpBackground}>
  																{carpoolRequestDirect && carpoolRequestDirect.carpoolTimes && carpoolRequestDirect.carpoolTimes.length > 0
  																				&& carpoolRequestDirect.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').map((m, i) => {
  
  																		let daysOfWeekOptions = []
  																		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(d => {
  																				if (m.daysOfWeek.indexOf(d.id) > -1)
  																						daysOfWeekOptions = daysOfWeekOptions && daysOfWeekOptions.length > 0 ? daysOfWeekOptions.concat(d) : [d]
  																		})
  
  																		return (
  																				<div key={i}>
  																						<FlexColumn heading={<L p={p} t={`Pick-up`}/>} data={<TimeDisplay time={m.time}/>} />
  																						<FlexColumn heading={<L p={p} t={`From date`}/>} data={<DateMoment date={m.fromDate} includeTime={false}/>} />
  																						<FlexColumn heading={<L p={p} t={`To date`}/>} data={<DateMoment date={m.toDate} includeTime={false}/>} />
  																						<FlexColumn heading={<L p={p} t={`Days`}/>} data={<WeekdayDisplay days={m.daysOfWeek}/>} />
  																						<FlexColumn heading={<L p={p} t={`Days I can drive (generally)`}/>}
  																								data={<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
  																													<CheckboxGroup
  																															name={'daysICanDrive'}
  																															options={daysOfWeekOptions || []}
  																															horizontal={true}
  																															recordTypeId={m.carpoolTimeId}
  																															onSelectedChanged={handleDaysICanDrive}
  																															label={''}
  																															labelClass={styles.text}
  																															selected={m.daysICanDrive}/>
  																											</div>
  																						} />
  																				</div>
  																		)
  																	})
  																}
  														</div>
  												</div>
  												{/*<div className={styles.label}>{`Comment (optional)`}</div>
  												<textarea rows={5} cols={35} value={comment} onChange={handleChange} id={'comment'} name={'comment'}
                              className={styles.commentBox}/>*/}
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
  														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default CarpoolAcceptRequestDirectModal
