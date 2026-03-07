import { useEffect, useState } from 'react'
import * as styles from './CarpoolDailySchedule.css'
import * as globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../SelectSingleDropDown'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import CarpoolRepeatDriver from '../CarpoolRepeatDriver'
import TimeDisplay from '../TimeDisplay'
import TextDisplay from '../TextDisplay'
import classes from 'classnames'
import moment from 'moment'
import {guidEmpty} from '../../utils/guidValidate'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolDailySchedule(props) {
  const [isShowingModal_description, setIsShowingModal_description] = useState(false)
  const [repeatWeeks, setRepeatWeeks] = useState('')
  const [frequency, setFrequency] = useState('one')
  const [carpoolId, setCarpoolId] = useState('')
  const [errorFrequency, setErrorFrequency] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [isShowingModal_confirmMessage, setIsShowingModal_confirmMessage] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [driverPersonId, setDriverPersonId] = useState(undefined)
  const [isShowingModal_repeatDriver, setIsShowingModal_repeatDriver] = useState(undefined)
  const [repeatCarpoolTimeId, setRepeatCarpoolTimeId] = useState(undefined)
  const [repeatDate, setRepeatDate] = useState(undefined)
  const [repeatCarpool, setRepeatCarpool] = useState(undefined)

  useEffect(() => {
    return () => {
      
      			setCarpoolId('')
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const{carpool} = props
    			
    			if (carpool && carpool.myCarpools && carpool.myCarpools.length > 0  && !carpoolId) {
    					setCarpoolId(carpool.myCarpools[0].carpoolId)
    					setWeeks(carpool.myCarpools[0].carpoolId)
    			}
    	
  }, [])

  const handleRadioFrequency = (frequency) => {
    
          setFrequency(frequency)
      
  }

  const handleRepeatWeeks = (event) => {
    
    	    let repeatWeeks = repeatWeeks
    	    repeatWeeks = event.target.value
    	    setRepeatWeeks(repeatWeeks); setFrequency('repeat')
      
  }

  const processForm = (event, dropOffOrPickUp, driverDate, time) => {
    
          const {updateCarpoolDate, personId} = props
          
          let hasError = false
    
    			if (frequency === 'repeat' && !repeatWeeks) {
    				hasError = true
    				setErrorFrequency(<L p={p} t={`How many weeks do you want this assignment to repeat?`}/>)
    			}
    
          if (!hasError) {
              updateCarpoolDate(personId, {carpoolId, dropOffOrPickUp, driverDate, time, frequency, repeatWeeks, driverPersonId: event.target.value })
          }
      
  }

  const setWeeks = (carpoolId) => {
    
    			const {carpool} = props
    			let weekOptions = []
    			if (carpool && carpool.myCarpools && carpool.myCarpools.length > 0 && carpoolId) {
    					let theCarpool = carpool.myCarpools.filter(m => m.carpoolId === carpoolId)[0]
    					if (theCarpool && theCarpool.carpoolDates && theCarpool.carpoolDates.length > 0) {
    							let beginDate = moment(theCarpool.carpoolDates[0].driverDate)
    							let endDate = moment(theCarpool.carpoolDates[theCarpool.carpoolDates.length-1].driverDate)
    							let days = endDate.diff(beginDate, 'days')
    							let weeks = Math.floor(days / 7)
    							for(let i = 1; i <= weeks; i++) {
    									let option = {id: i, label: i === 1 ? `${i} week` : `${i} weeks`}
    									weekOptions = weekOptions ? weekOptions.concat(option) : [option]
    							}
    					}
    			}
    			setWeekOptions(weekOptions)
    	
  }

  const handleConfirmEmailOpen = (driverPersonId, message) => {
    return setIsShowingModal_confirmMessage(true); setMessage(message); setDriverPersonId(driverPersonId)
  }

  const handleConfirmEmailClose = (message) => {
    return setIsShowingModal_confirmMessage(false); setMessage(''); setDriverPersonId('')
  }

  const handleConfirmEmail = () => {
    
    			const {personId, sendMessage} = props
    			
    			sendMessage(personId, driverPersonId, 'Carpool message', message)
    			handleConfirmEmailClose()
    	
  }

  const handleRepeatAssignmentOpen = (repeatCarpoolTimeId, repeatDate, repeatCarpool) => {
    return setIsShowingModal_repeatDriver(true); setRepeatCarpoolTimeId(repeatCarpoolTimeId); setRepeatDate(repeatDate); setRepeatCarpool(repeatCarpool)
  }

  const handleRepeatAssignmentClose = () => {
    return setIsShowingModal_repeatDriver(false); setRepeatCarpoolTimeId(''); setRepeatDate(''); setRepeatCarpool({})
  }

  const handleRepeatAssignment = (repeatWeeks) => {
    
    			const {personId, setDriverTimeDate} = props
    			
    			setDriverTimeDate(personId, document.getElementById(`driver${repeatCarpoolTimeId}`).value, repeatCarpoolTimeId, repeatDate, repeatWeeks)
    			handleRepeatAssignmentClose()
    	
  }

  const timeAssignChange = (dateChange, studentPersonId, carpoolId, carpoolTimeId, rightOrLeft, currentIndex, dayOfWeek, dropOffOrPickUp, carpoolTimes) => {
    
    			const {personId, setCarpoolTimeStudentAssignDayChange} = props
    			//Determine the time slot that this user should be sent to - including "notassigned"
    			carpoolTimeId = rightOrLeft === 'left'
    					? currentIndex === 0
    							? '' //unassigned
    							: carpoolTimes[--currentIndex].carpoolTimeId
    					: !carpoolTimeId
    							? carpoolTimes && carpoolTimes.length > 0 && carpoolTimes[0].carpoolTimeId
    							: carpoolTimes[++currentIndex].carpoolTimeId
    
    			setCarpoolTimeStudentAssignDayChange(personId, carpoolId, carpoolTimeId, dropOffOrPickUp, studentPersonId, dayOfWeek, dateChange)
    	
  }

  const {personId, carpool={}, setDriverTimeDate} = props
      
  
  		let myCarpools = carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools.filter(m => m.entryPersonId === personId)
  		if (myCarpools && myCarpools.length > 0) {
  				myCarpools = myCarpools.reduce((acc, m) => {
  						let option = {id: m.carpoolId, label: m.name}
  						return acc ? acc.concat(option) : [option]
  				}, [])
  		}
  
  		//**************************************************
  		// Student to carpool daily assignment
  		// 0. Get the list of drivers
  		// 1. Start with today's date
  		// 2. If there are carpoolTimes with date ranges that cover today, loop through daysOfWeekAll
  		// 3. Get the dropOff times separately.
  		// 4. Get the pickUp times separately.
  		// 5. If there are dropOffs or pickUps for the current dayOfWeek, show the day of the week.
  		// 6. Take the current datePointer and loop through for 60 days.
  		// 			i. If there are drop offs for the current dayOfWeek
  		// 					a. Find the drivers who can drive for the day and place them in the "Can drive" optionGroup of the list
  		// 							then take the leftovers and place them in the 'Cannot drive today" optionGroup of the list.
  		// 					b. Loop through the students who are included by the carpool members
  		// 					c. Place the student in the column of unassigned or the carpool time assigned.
  		// 					d. If the current user is the parent, provide the student names with the left and right arrows to move between columns
  		// 			ii. Do the same for pickUps as 6.i above.
  		let days = [<L p={p} t={`sunday`}/>, <L p={p} t={`monday`}/>, <L p={p} t={`tuesday`}/>, <L p={p} t={`wednesday`}/>, <L p={p} t={`thursday`}/>, <L p={p} t={`friday`}/>, <L p={p} t={`saturday`}/>]
  		let datePointer = moment()
  		let sixtyDays = []
  		for(let i = 0; i < 100; i++) {
  				sixtyDays = sixtyDays.concat({
  						date: moment(datePointer).format("YYYY-MM-DD"),
  						id: days[datePointer.weekday()],
  						dayOfWeek: days[datePointer.weekday()],
  						display: moment(datePointer).format("D MMM YYYY"),
  				})
  				datePointer = moment(datePointer).add(1, 'days')
  		}
  		let theCarpool = carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0] && carpool.myCarpools[0]
  
      return (
          <div className={styles.container}>
              {myCarpools && myCarpools.length > 1 &&
  								<div>
  										<SelectSingleDropDown
  												id={`carpoolId`}
  												name={`carpoolId`}
  												label={<L p={p} t={`Carpool`}/>}
  												value={driverAssign.carpoolAreaId || ''}
  												options={carpool.myCarpools || []}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleDriverAssign}
  												error={errorCarpoolAreaId}/>
  		            </div>
  						}
  						{/*<div className={styles.row}>
  								<RadioGroup
  										data={[{label: "One day assignment only",id: "one"},{label: 'Repeat this assignment', id: "repeat"}]}
  										id={`frequency`}
  										name={`frequency`}
  										horizontal={false}
  										className={styles.radio}
  										initialValue={frequency || ''}
  										onClick={handleRadioFrequency}/>
  								<div className={styles.selectPosition}>
  										<SelectSingleDropDown
  												id={`repeatWeeks`}
  												name={`repeatWeeks`}
  												label={``}
  												value={repeatWeeks || ''}
  												options={weekOptions || []}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleRepeatWeeks}/>
  								</div>
  						</div>*/}
  						<div className={styles.moreLeft}>
  								{sixtyDays.map((day, index) => {
  										let dropOffs = theCarpool && theCarpool.carpoolTimes && theCarpool.carpoolTimes.length > 0 && theCarpool.carpoolTimes
  																			.filter(f => f.dropOffOrPickUp === 'dropoff' && f.daysOfWeek.indexOf(day.id) > -1)
  										let pickUps = theCarpool && theCarpool.carpoolTimes && theCarpool.carpoolTimes.length > 0 && theCarpool.carpoolTimes
  																			.filter(f => f.dropOffOrPickUp === 'pickup' && f.daysOfWeek.indexOf(day.id) > -1)
  										return (
  												<div key={index}>
  														{((dropOffs && dropOffs.length > 0) || (pickUps && pickUps.length > 0)) &&
  																<div className={styles.classification}>{day.id.charAt(0).toUpperCase() + day.id.slice(1)} - {day.display}</div>
  														}
  														{!(dropOffs && dropOffs.length > 0) ? '' :
  																<div>
  																		<div className={classes(styles.dropOffBackground, styles.moreBottom)}>
  																				<div className={globalStyles.headerLabel}><L p={p} t={`Drop-off`}/></div>
  																				<div className={styles.row}>
  																						<div>
  																								<div className={classes(styles.sectionLabel, styles.muchTop, styles.moreBottom)}><L p={p} t={`Unassigned`}/></div>
  																								{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded).map((s, studentIndex) => {
  																										let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
  																												.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.dayOfWeek === day.id)[0]
  																										let studentTimeAssignDayChange = theCarpool.timeStudentAssignDayChanges && theCarpool.timeStudentAssignDayChanges.length > 0 && theCarpool.timeStudentAssignDayChanges
  																												.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.dateChange.substring(0,10) === day.date)[0]
  																										let isUnassigned = studentTimeAssignDayChange && studentTimeAssignDayChange.carpoolTimeId && studentTimeAssignDayChange.carpoolTimeId === guidEmpty
  																												? true
  																												: studentTimeAssignDayChange && studentTimeAssignDayChange.carpoolTimeId && studentTimeAssignDayChange.carpoolTimeId !== guidEmpty
  																														? false
  																														: !(studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty)
  																																? true
  																																: false
  
  																										return !(isUnassigned)
  																												? null
  																											  : <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																															<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																	{s.firstName}
  																															</div>
  																															{(s.memberPersonId === personId || theCarpool.entryPersonId === personId) &&
  																																	<div onClick={() => timeAssignChange(day.date, s.studentPersonId, theCarpool.carpoolId, '', 'right', -1, day.id, 'dropoff', dropOffs)}>
  																																			<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
  																																	</div>
  																															}
  																													</div>
  																								})}
  																						</div>
  																						{dropOffs.map((c, timeIndex) => {
  																								let driverPerson = theCarpool.assignDrivers.filter(d => d.driverDate.substring(0,10) === day.date && d.carpoolTimeId === c.carpoolTimeId)[0]
  																								let driverPersonId = ''
  																								if (driverPerson && driverPerson.driverPersonId) driverPersonId = driverPerson.driverPersonId
  																								let drivers = theCarpool && theCarpool.carpoolMembers && theCarpool.carpoolMembers.length > 0 && theCarpool.carpoolMembers
  																								//Loop through the drivers to place them in the driver list under "Can drive" or "Not available" according to the time and day.
  																								let optgroups = [{
  																											label: <L p={p} t={`Can drive`}/>,
  																											options: []
  																										},
  																										{
  																											label: <L p={p} t={`Not available`}/>,
  																											options: []
  																										}
  																								]
  																								drivers && drivers.length > 0 && drivers.forEach(driver => {
  																										let optIndex = 0
  																										let canDrive = driver.carpoolTimeCanDrive && driver.carpoolTimeCanDrive.length > 0 && driver.carpoolTimeCanDrive
  																												.filter(can => can.carpoolTimeId === c.carpoolTimeId && can.dayOfWeek === day.dayOfWeek)[0]
  																										if (!(canDrive && canDrive.carpoolTimeId)) optIndex = 1
  																										let alreadyExists = false; //optgroups[optIndex] && optgroups[optIndex].options && optgroups[optIndex].options.length > 0 && optgroups[optIndex].options.filter(opt => opt.id === driver.personId)[0];
  																										if (!(alreadyExists && alreadyExists.id)) {
  																												let option = {
  																														id: driver.personId,
  																														label: driver.firstName + ' ' + driver.lastName,
  																												}
  																												optgroups[optIndex].options = optgroups[optIndex] && optgroups[optIndex].options && optgroups[optIndex].options.length > 0
  																														? optgroups[optIndex].options.concat(option)
  																														: [option]
  																										}
  																								})
  
  																								return (
  																										<div key={timeIndex}>
  																												<TextDisplay label={''} text={<TimeDisplay time={c.time || ''}/>} className={styles.sectionLabel}/>
  																												<div className={styles.row}>
  																														<div>
  																																<SelectSingleDropDown
  																																		id={`driver${c.carpoolTimeId}`}
  																																		name={`driver${c.carpoolTimeId}`}
  																																		label={<L p={p} t={`Driver`}/>}
  																																		value={driverPersonId || ''}
  																																		optgroups={optgroups || []}
  																																		className={styles.moreBottomMargin}
  																																		height={`medium`}
  																																		onChange={(event) => setDriverTimeDate(personId, event.target.value, c.carpoolTimeId, day.date)}/>
  																								            </div>
  																														<div onClick={() => handleRepeatAssignmentOpen(c.carpoolTimeId, day.date, theCarpool)} className={styles.iconPosition} data-rh={'Repeat this assignment'}>
  																																<Icon pathName={'sync'} premium={true} className={styles.icon} />
  																														</div>
  																												</div>
  																												{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded).map((s, studentIndex) => {
  																														let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
  																																.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.carpoolTimeId === c.carpoolTimeId && a.dayOfWeek === day.id)[0]
  																														let studentTimeAssignDayChange = theCarpool.timeStudentAssignDayChanges && theCarpool.timeStudentAssignDayChanges.length > 0 && theCarpool.timeStudentAssignDayChanges
  																																.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.dateChange.substring(0,10) === day.date)[0]
  																														let isAssigned = studentTimeAssignDayChange && studentTimeAssignDayChange.carpoolTimeId
  																														 		? studentTimeAssignDayChange.carpoolTimeId === c.carpoolTimeId
  																																: studentTimeAssign && studentTimeAssign.carpoolTimeId
  
  																														return !isAssigned
  																																? null
  																																: <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																																			{timeIndex >= 0 && (s.memberPersonId === personId || theCarpool.entryPersonId === personId) &&
  																																					<div onClick={() => timeAssignChange(day.date, s.studentPersonId, theCarpool.carpoolId, c.carpoolTimeId, 'left', timeIndex, day.id, 'dropoff', dropOffs)}>
  																																							<Icon pathName={'arrow_left0'} premium={true} fillColor={'blue'} className={styles.arrowLeft}/>
  																																					</div>
  																																			}
  																																			<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																					{s.firstName}
  																																			</div>
  																																			{timeIndex < parseInt(dropOffs.length)-parseInt(1) && (s.memberPersonId === personId || theCarpool.entryPersonId === personId) && //eslint-disable-line
  																																					<div onClick={() => timeAssignChange(day.date, s.studentPersonId, theCarpool.carpoolId, c.carpoolTimeId, 'right', timeIndex, day.id, 'dropoff', dropOffs)}>
  																																							<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
  																																					</div>
  																																			}
  																																	</div>
  																														})}
  																												</div>
  																										)
  																								})}
  																						</div>
  																				</div>
  																		</div>
  																}
  																{!(pickUps && pickUps.length > 0) ? '' :
  																		<div key={index+100}>
  																		<div className={classes(styles.pickUpBackground, styles.moreBottom)}>
  																				<div className={globalStyles.headerLabel}><L p={p} t={`Pick-up`}/></div>
  																				<div className={styles.row}>
  																						<div>
  																								<div className={classes(styles.sectionLabel, styles.muchTop, styles.moreBottom)}><L p={p} t={`Unassigned`}/></div>
  																								{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded).map((s, studentIndex) => {
  																										let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
  																												.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.dayOfWeek === day.id)[0]
  																										let studentTimeAssignDayChange = theCarpool.timeStudentAssignDayChanges && theCarpool.timeStudentAssignDayChanges.length > 0 && theCarpool.timeStudentAssignDayChanges
  																												.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.dateChange.substring(0,10) === day.date)[0]
  																										let isUnassigned = studentTimeAssignDayChange && studentTimeAssignDayChange.carpoolTimeId && studentTimeAssignDayChange.carpoolTimeId === guidEmpty
  																												? true
  																												: studentTimeAssignDayChange && studentTimeAssignDayChange.carpoolTimeId && studentTimeAssignDayChange.carpoolTimeId !== guidEmpty
  																														? false
  																														: !(studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty)
  																																? true
  																																: false
  
  																										return !(isUnassigned)
  																											 ? null
  																											 : <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																															<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																	{s.firstName}
  																															</div>
  																															{(s.memberPersonId === personId || theCarpool.entryPersonId === personId) &&
  																																	<div onClick={() => timeAssignChange(day.date, s.studentPersonId, theCarpool.carpoolId, '', 'right', -1, day.id, 'pickup', pickUps)}>
  																																			<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
  																																	</div>
  																															}
  																													</div>
  																								})}
  																						</div>
  																						{pickUps.map((c, timeIndex) => {
  																								let driverPerson = theCarpool.assignDrivers.filter(d => d.driverDate.substring(0,10) === day.date && d.carpoolTimeId === c.carpoolTimeId)[0]
  																								let driverPersonId = ''
  																								if (driverPerson && driverPerson.driverPersonId) driverPersonId = driverPerson.driverPersonId
  																								let drivers = theCarpool && theCarpool.carpoolMembers && theCarpool.carpoolMembers.length > 0 && theCarpool.carpoolMembers
  																								//Loop through the drivers to place them in the driver list under "Can drive" or "Not available" according to the time and day.
  																								let optgroups = [{
  																											label: <L p={p} t={`Can drive`}/>,
  																											options: []
  																										},
  																										{
  																											label: <L p={p} t={`Not available`}/>,
  																											options: []
  																										}
  																								]
  																								drivers && drivers.length > 0 && drivers.forEach(driver => {
  																										let optIndex = 0
  																										let canDrive = driver.carpoolTimeCanDrive && driver.carpoolTimeCanDrive.length > 0 && driver.carpoolTimeCanDrive
  																												.filter(can => can.carpoolTimeId === c.carpoolTimeId && can.dayOfWeek === day.dayOfWeek)[0]
  																										if (!(canDrive && canDrive.carpoolTimeId)) optIndex = 1
  																										let alreadyExists = optgroups[optIndex] && optgroups[optIndex].options && optgroups[optIndex].options.length > 0 && optgroups[optIndex].options.filter(opt => opt.id === driver.personId)[0]
  																										if (!(alreadyExists && alreadyExists.id)) {
  																												let option = {
  																														id: driver.personId,
  																														label: driver.firstName + ' ' + driver.lastName,
  																												}
  																												optgroups[optIndex].options = optgroups[optIndex] && optgroups[optIndex].options && optgroups[optIndex].options.length > 0
  																														? optgroups[optIndex].options.concat(option)
  																														: [option]
  																										}
  																								})
  
  																								return (
  																										<div key={timeIndex+100}>
  																												<TextDisplay label={''} text={<TimeDisplay time={c.time || ''}/>} className={styles.sectionLabel}/>
  																												<div className={styles.row}>
  																														<div>
  																																<SelectSingleDropDown
  																																		id={`driver${c.carpoolTimeId}`}
  																																		name={`driver${c.carpoolTimeId}`}
  																																		label={<L p={p} t={`Driver`}/>}
  																																		value={driverPersonId || ''}
  																																		optgroups={optgroups || []}
  																																		className={styles.moreBottomMargin}
  																																		height={`medium`}
  																																		onChange={(event) => setDriverTimeDate(personId, event.target.value, c.carpoolTimeId, day.date)}/>
  																								            </div>
  																														<div onClick={() => handleRepeatAssignmentOpen(c.carpoolTimeId, day.date, theCarpool)} className={styles.iconPosition} data-rh={'Repeat this assignment'}>
  																																<Icon pathName={'sync'} premium={true} className={styles.icon} />
  																														</div>
  																												</div>
  																												{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded).map((s, studentIndex) => {
  																														let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
  																																.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.carpoolTimeId === c.carpoolTimeId && a.dayOfWeek === day.id)[0]
  																														let studentTimeAssignDayChange = theCarpool.timeStudentAssignDayChanges && theCarpool.timeStudentAssignDayChanges.length > 0 && theCarpool.timeStudentAssignDayChanges
  																																.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.dateChange.substring(0,10) === day.date)[0]
  																														let isAssigned = studentTimeAssignDayChange && studentTimeAssignDayChange.carpoolTimeId
  																														 		? studentTimeAssignDayChange.carpoolTimeId === c.carpoolTimeId
  																																: studentTimeAssign && studentTimeAssign.carpoolTimeId
  
  																														return !(isAssigned)
  																																? null
  																																: <div key={studentIndex+200} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																																			{timeIndex >= 0 && (s.memberPersonId === personId || theCarpool.entryPersonId === personId) &&
  																																					<div onClick={() => timeAssignChange(day.date, s.studentPersonId, theCarpool.carpoolId, c.carpoolTimeId, 'left', timeIndex, day.id, 'pickup', pickUps)}>
  																																							<Icon pathName={'arrow_left0'} premium={true} fillColor={'blue'} className={styles.arrowLeft}/>
  																																					</div>
  																																			}
  																																			<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																					{s.firstName}
  																																			</div>
  																																			{timeIndex < parseInt(pickUps.length)-parseInt(1) && (s.memberPersonId === personId || theCarpool.entryPersonId === personId) && //eslint-disable-line
  																																					<div onClick={() => timeAssignChange(day.date, s.studentPersonId, theCarpool.carpoolId, c.carpoolTimeId, 'right', timeIndex, day.id, 'pickup', pickUps)}>
  																																							<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
  																																					</div>
  																																			}
  																																	</div>
  																												})}
  																										</div>
  																								)
  																						})}
  																				</div>
  																		</div>
  																</div>
  														}
  												</div>
  										)
  								})}
  						</div>
              <hr />
  						{isShowingModal_confirmMessage &&
  								<MessageModal handleClose={handleConfirmEmailClose} heading={<L p={p} t={`Do you want to send this message?`}/>}
  									 explain={message} isConfirmType={true}  onClick={handleConfirmEmail} />
  						}
  						{isShowingModal_repeatDriver &&
  								<CarpoolRepeatDriver handleClose={handleRepeatAssignmentClose} carpool={repeatCarpool} repeatDate={repeatDate}
  										repeatCarpoolTimeId={repeatCarpoolTimeId} onClick={handleRepeatAssignment} repeatCarpool={repeatCarpool}/>
  						}
        </div>
      )
}
export default CarpoolDailySchedule
