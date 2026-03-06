import { useEffect, useState } from 'react'
import globalStyles from '../../utils/globalStyles.css'
import styles from './CarpoolsMine.css'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import InputText from '../InputText'
import DateTimePicker from '../DateTimePicker'
import CheckboxGroup from '../CheckboxGroup'
import DateMoment from '../DateMoment'
import WeekdayDisplay from '../WeekdayDisplay'
import EditTable from '../EditTable'
import ButtonWithIcon from '../ButtonWithIcon'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import Checkbox from '../Checkbox'
import TimePicker from '../TimePicker'
import TimeDisplay from '../TimeDisplay'
import FlexColumn from '../FlexColumn'
import TextDisplay from '../TextDisplay'
import CarpoolMemberStudentsModal from '../CarpoolMemberStudentsModal'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolsMine(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_myStudents, setIsShowingModal_myStudents] = useState(false)
  const [isShowingModal_removePickUpTime, setIsShowingModal_removePickUpTime] = useState(false)
  const [isShowingModal_removeDropOffTime, setIsShowingModal_removeDropOffTime] = useState(false)
  const [newPickUp, setNewPickUp] = useState({})
  const [newDropOff, setNewDropOff] = useState({})
  const [myCarpool, setMyCarpool] = useState({
				carpoolId: '',
				name: '',
				destination: props.companyConfig.name,
        comment: '',
				pickUpTimes: [],
				dropOffTimes: [],
      })
  const [carpoolId, setCarpoolId] = useState('')
  const [name, setName] = useState('')
  const [destination, setDestination] = useState(props.companyConfig.name)
  const [comment, setComment] = useState('')
  const [pickUpTimes, setPickUpTimes] = useState([])
  const [dropOffTimes, setDropOffTimes] = useState([])
  const [errorCarpoolName, setErrorCarpoolName] = useState('')
  const [errorDestination, setErrorDestination] = useState('')
  const [myStudentsAll, setMyStudentsAll] = useState(carpool.myCarpools[0].myStudentsAll)
  const [isInit, setIsInit] = useState(true)
  const [studentsIncluded, setStudentsIncluded] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [errorCarpoolTime, setErrorCarpoolTime] = useState(<L p={p} t={`At least one carpool time is required`}/>)
  const [errorAllowAddress, setErrorAllowAddress] = useState(<L p={p} t={`A carpool member needs to consider your location in order to make a decision to carpool with you.`}/>)
  const [isShowingModal_requests, setIsShowingModal_requests] = useState(true)
  const [listUsedIn, setListUsedIn] = useState([])
  const [carpool, setCarpool] = useState({})
  const [allowAddress, setAllowAddress] = useState(true)
  const [expandedStudentIncluded, setExpandedStudentIncluded] = useState(!this.state.expandedStudentIncluded)
  const [checkedSendEmail, setCheckedSendEmail] = useState(!checkedSendEmail)
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [carpoolName, setCarpoolName] = useState('')
  const [carpoolComment, setCarpoolComment] = useState('')
  const [pickUpTime, setPickUpTime] = useState('')
  const [pickUpTimeIndex, setPickUpTimeIndex] = useState('')
  const [v, setV] = useState('')
  const [dropOffTime, setDropOffTime] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {carpool} = props
    			if (!isInit && carpool && carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0].myStudentsAll && carpool.myCarpools[0].myStudentsAll.length > 0) {
    					let studentsIncluded = carpool.myCarpools[0].myStudentsAll.filter(m => m.isIncluded).reduce((acc, m) => acc = acc && acc.length ? acc.concat(m.id) : [m.id], [])
    					setStudentsIncluded(studentsIncluded); setMyStudentsAll(carpool.myCarpools[0].myStudentsAll); setIsInit(true)
    			}
    	
  }, [])

  //Notice that this Accordion is different since it gets its expanded state from the parent page, CarpoolView, so that
  		//	other tab links or actions can open up the new carpool remotely.
      const {personId, carpool={}, daysOfWeekAll, expanded, setMemberStudentsInCarpool} = props
      const {myCarpool, thisStudentCarpool, isShowingModal_remove, isShowingModal_requests, errorCarpoolName, errorDestination, isShowingModal_description,
  						carpoolName, carpoolComment, isShowingModal_myStudents, errorAllowAddress, allowAddress, isShowingModal_removePickUpTime, errorCarpoolTime,
  						isShowingModal_removeDropOffTime, newDropOff={}, newPickUp={}, isShowingModal_missingInfo, messageInfoIncomplete, studentsIncluded,
  						myStudentsAll, expandedStudentIncluded} = state
  
  		//Notice that this Accordion is different since it gets its expanded state from the parent page, CarpoolView, so that
  		//	other tab links or actions can open up the new carpool remotely.
  		let headingsCarpoolTimesDropOff = [
  				{label: '', tightText: true},
  				{label: '', tightText: true},
  				{label: <L p={p} t={`Time`}/>, tightText: true},
  				{label: <L p={p} t={`From date`}/>, tightText: true},
  				{label: <L p={p} t={`To date`}/>, tightText: true},
  				{label: <L p={p} t={`Carpool days`}/>, tightText: true},
  				{label: <L p={p} t={`Days I can drive (generally)`}/>, tightText: true}
  		]
  
  		let dataCarpoolTimesDropOff = []
  		myCarpool && myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0 && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff').forEach((m, i) => {
  				dataCarpoolTimesDropOff.push([
  						{value: <a onClick={() => handleEditDropOff(m)}>
  												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  										</a>
  						},
  						{value: <a onClick={() => handleRemoveDropOffTimeOpen(m.carpoolTimeId)}>
  												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  										</a>
  						},
  						{value: <TimeDisplay time={m.time}/>, boldText: true},
  						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
  						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
  						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
  						{value: <WeekdayDisplay days={m.daysICanDrive}/>, boldText: true},
  				])
  		})
  		if (!(dataCarpoolTimesDropOff && dataCarpoolTimesDropOff.length > 0))  dataCarpoolTimesDropOff = [[{},{},{value: <i><L p={p} t={`No drop off times entered`}/></i>, colSpan: 5}]]
  
  		let headingsDropOff = [
  				{label: <L p={p} t={`Drop-off`}/>, tightText: true},
  				{label: <L p={p} t={`From date`}/>, tightText: true},
  				{label: <L p={p} t={`To date`}/>, tightText: true},
  				{label: <L p={p} t={`Days`}/>, tightText: true},
  		]
  
  		let dataDropOff = []
  		carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0].carpoolTimes && carpool.myCarpools[0].carpoolTimes.length > 0
  						&& carpool.myCarpools[0].carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff').forEach((m, i) => {
  				dataDropOff.push([
  						{value: <TimeDisplay time={m.time}/>, boldText: true},
  						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
  						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
  						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
  				])
  		})
  
  		//Pick up
  		let headingsCarpoolTimesPickUp = [
  				{label: '', tightText: true},
  				{label: '', tightText: true},
  				{label: <L p={p} t={`Time`}/>, tightText: true},
  				{label: <L p={p} t={`From date`}/>, tightText: true},
  				{label: <L p={p} t={`To date`}/>, tightText: true},
  				{label: <L p={p} t={`Carpool days`}/>, tightText: true},
  				{label: <L p={p} t={`Days I can drive (generally)`}/>, tightText: true}
  		]
  
  		let dataCarpoolTimesPickUp = []
  		myCarpool && myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0 && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').forEach((m, i) => {
  				dataCarpoolTimesPickUp.push([
  						{value: <a onClick={() => handleEditPickUp(m)}>
  												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  										</a>
  						},
  						{value: <a onClick={() => handleRemovePickUpTimeOpen(i)}>
  												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  										</a>
  						},
  						{value: <TimeDisplay time={m.time}/>, boldText: true},
  						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
  						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
  						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
  						{value: <WeekdayDisplay days={m.daysICanDrive}/>, boldText: true},
  				])
  		})
  		if (!(dataCarpoolTimesPickUp && dataCarpoolTimesPickUp.length > 0))  dataCarpoolTimesPickUp = [[{},{},{value: <i><L p={p} t={`No pick up times entered`}/></i>, colSpan: 5}]]
  
  		let headingsPickUp = [
  				{label: <L p={p} t={`Pick-up`}/>, tightText: true},
  				{label: <L p={p} t={`From date`}/>, tightText: true},
  				{label: <L p={p} t={`To date`}/>, tightText: true},
  				{label: <L p={p} t={`Days`}/>, tightText: true},
  		]
  
  		let dataPickUp = []
  		carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0].carpoolTimes && carpool.myCarpools[0].carpoolTimes.length > 0
  						&& carpool.myCarpools[0].carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').forEach((m, i) => {
  				dataPickUp.push([
  						{value: <TimeDisplay time={m.time}/>, boldText: true},
  						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
  						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
  						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
  				])
  		})
  
  		let carpoolDaysOfWeekDropOff = []
  		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(m => {
  				if (newDropOff && newDropOff.daysOfWeek && newDropOff.daysOfWeek.length > 0 && newDropOff.daysOfWeek.indexOf(m.id) > -1) carpoolDaysOfWeekDropOff.push(m)
  		})
  
  		let carpoolDaysOfWeekPickUp = []
  		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(m => {
  				if (newPickUp && newPickUp.daysOfWeek && newPickUp.daysOfWeek.length > 0 && newPickUp.daysOfWeek.indexOf(m.id) > -1) carpoolDaysOfWeekPickUp.push(m)
  		})
  
  		//**************************************************
  		// Student to carpool daily assignment
  		// 1. If there are carpoolTimes, loop through daysOfWeekAll
  		// 2. Get the dropOff times separately.
  		// 3. Get the pickUp times separately.
  		// 4. If there are dropOffs or pickUps for the current dayOfWeek, show the day of the week.
  		// 5. If there are drop offs for the current dayOfWeek
  		// 		a. Loop through the students who are included by the carpool member (owner)
  		// 		b. Place the student in the column of unassigned or the carpool time assigned.
  		// 		c. Provide the student names with the left and right arrows to move between columns
  		// 6. Do the same for pickUps as #5 above.
  		let theCarpool = carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0] && carpool.myCarpools[0]
  
      return (
          <div className={styles.container}>
  						{(myCarpool.carpoolId || !(theCarpool && theCarpool.carpoolId)) &&
  								<Accordion expanded={!!expanded} onChange={handleExpansionChange(true)}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
  												<div className={styles.row}>
  														<Icon pathName={'plus'} premium={false} className={styles.icon} fillColor={'green'}/>
  														<span className={globalStyles.link}><L p={p} t={`Add a new carpool?`}/></span>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div>
  								            <div>
  																<InputText
  																		id={`name`}
  																		name={`name`}
  																		label={<L p={p} t={`Carpool name`}/>}
  																		value={myCarpool.name || ''}
  																		size={"medium"}
  																		onChange={handleCarpool}
  																		error={errorCarpoolName}
  																		required={true}
  																		whenFilled={myCarpool.name}/>
  								            </div>
  														<div>
  																<InputText
  																		id={`destination`}
  																		name={`destination`}
  																		label={<L p={p} t={`Destination`}/>}
  																		value={myCarpool.destination || ''}
  																		size={`medium`}
  																		onChange={handleCarpool}
  																		required={true}
  																		whenFilled={myCarpool.destination}
  																		error={errorDestination}/>
  								            </div>
  														<div className={styles.littleTop}>
  																<InputText
  																		id={'comment'}
  																		name={'comment'}
  																		value={myCarpool.comment}
  																		label={<L p={p} t={`Comment (optional)`}/>}
  																		size={"long"}
  																		onChange={handleCarpool}/>
  								            </div>
  														<div className={classes(globalStyles.alertText, styles.moreTop)}>{errorCarpoolTime}</div>
  														<div className={classes(styles.classification, styles.classificationDropOff)}><L p={p} t={`Drop-Off`}/></div>
  														<div className={styles.rowWrap}>
  																<TimePicker id={`time`} label={'Drop-off time'} value={newDropOff.time || ''} onChange={handleDropOffChange} className={styles.dateTime}
  																		required={true} whenFilled={newDropOff.time} boldText={true}/>
  																<div className={styles.dateRow}>
  						                        <div className={classes(styles.dateColumn, styles.moreLeft)}>
  						                            <DateTimePicker id={`fromDate`} value={newDropOff.fromDate} label={'From date'} required={true} whenFilled={newDropOff.fromDate}
  						                                maxDate={newDropOff.toDate ? newDropOff.toDate : ''} onChange={handleDropOffChange}/>
  						                        </div>
  						                        <div className={styles.dateColumn}>
  						                            <DateTimePicker id={`toDate`} value={newDropOff.toDate}  label={'To date'} required={true} whenFilled={newDropOff.toDate}
  						                                minDate={newDropOff.fromDate ? newDropOff.fromDate : ''} onChange={handleDropOffChange}/>
  						                        </div>
  						                    </div>
  																<div className={classes(globalStyles.multiSelect)}>
  																		<CheckboxGroup
  																				name={'daysOfWeek'}
  																				options={daysOfWeekAll || []}
  																				horizontal={true}
  		 																		onSelectedChanged={handleDaysOfWeekDropOff}
  																				label={<L p={p} t={`Carpool days of the week`}/>}
  																				labelClass={styles.text}
  																				selected={newDropOff.daysOfWeek}
  																				required={true}
  																				whenFilled={newDropOff.daysOfWeek}/>
  																</div>
  																<div className={classes(globalStyles.multiSelect, styles.lower)}>
  																		<CheckboxGroup
  																				name={'daysICanDrive'}
  																				options={carpoolDaysOfWeekDropOff || []}
  																				horizontal={true}
  		 																		onSelectedChanged={handleDaysICanDriveDropOff}
  																				label={<L p={p} t={`Days I can drive (generally)`}/>}
  																				labelClass={styles.text}
  																				selected={newDropOff.daysICanDrive}/>
  																</div>
  																<div className={styles.row}>
  																		<ButtonWithIcon label={newDropOff.isEdit ? <L p={p} t={`Update Drop-off`}/> : <L p={p} t={`Save Drop-off`}/>} icon={'plus_circle'} onClick={addDropOffTime}/>
  																		{newDropOff.isEdit &&
  																				<div className={classes(globalStyles.link, styles.resetPosition)} onClick={handleResetDropOffEdit}>Reset</div>
  																		}
  																</div>
  														</div>
  														<EditTable headings={headingsCarpoolTimesDropOff} data={dataCarpoolTimesDropOff} />
  														<div className={styles.classification}><L p={p} t={`Pick-up`}/></div>
  														<div className={styles.rowWrap}>
  																<TimePicker id={`time`} label={<L p={p} t={`Pick-up time`}/>} value={newPickUp.time || ''} onChange={handlePickUpChange} className={styles.dateTime}
  																		required={true} whenFilled={newPickUp.time} boldText={true}/>
  																<div className={styles.dateRow}>
  																		<div className={classes(styles.dateColumn, styles.moreLeft)}>
  																				<DateTimePicker id={`fromDate`} value={newPickUp.fromDate} label={<L p={p} t={`From date`}/>} required={true} whenFilled={newPickUp.fromDate}
  																						maxDate={newPickUp.toDate ? newPickUp.toDate : ''} onChange={handlePickUpChange}/>
  																		</div>
  																		<div className={styles.dateColumn}>
  																				<DateTimePicker id={`toDate`} value={newPickUp.toDate}  label={<L p={p} t={`To date`}/>} required={true} whenFilled={newPickUp.toDate}
  																						minDate={newPickUp.fromDate ? newPickUp.fromDate : ''} onChange={handlePickUpChange}/>
  																		</div>
  																</div>
  																<div className={classes(globalStyles.multiSelect, styles.littleTop)}>
  																		<CheckboxGroup
  																				name={'daysOfWeek'}
  																				options={daysOfWeekAll || []}
  																				horizontal={true}
  																				onSelectedChanged={handleDaysOfWeekPickUp}
  																				label={<L p={p} t={`Days I can drive (generally)`}/>}
  																				labelClass={styles.text}
  																				selected={newPickUp.daysOfWeek}/>
  																</div>
  																<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
  																		<CheckboxGroup
  																				name={'daysICanDrive'}
  																				options={carpoolDaysOfWeekPickUp || []}
  																				horizontal={true}
  		 																		onSelectedChanged={handleDaysICanDrivePickUp}
  																				label={<L p={p} t={`Days I can drive (generally)`}/>}
  																				labelClass={styles.text}
  																				selected={newPickUp.daysICanDrive}/>
  																</div>
  																<div className={styles.row}>
  																		<ButtonWithIcon label={newPickUp.isEdit ? <L p={p} t={`Update Pick-up`}/> : <L p={p} t={`Save Pick-up`}/>} icon={'plus_circle'} onClick={addPickUpTime}/>
  																		{newPickUp.isEdit &&
  																				<div className={classes(globalStyles.link, styles.resetPosition)} onClick={handleResetPickUpEdit}><L p={p} t={`Reset`}/></div>
  																		}
  																</div>
  														</div>
  														<EditTable headings={headingsCarpoolTimesPickUp} data={dataCarpoolTimesPickUp} />
  														<hr/>
  														<div className={styles.checkboxPosition}>
  																<Checkbox
  																		id={`allowAddress`}
  																		label={<L p={p} t={`Allow my address to be shown in a Google Maps link`}/>}
  																		checked={allowAddress}
  																		onClick={toggleAllowAddress}
  																		labelClass={styles.filterList}
  																		className={styles.checkbox}
  																		required={true}
  																		whenFilled={allowAddress}
  																		error={errorAllowAddress} />
  														</div>
  								            <div className={styles.rowRight}>
  																	<div className={classes(globalStyles.link, styles.closePosition)} onClick={() => {handleExpansionChange(false); clearMyCarpool();}}><L p={p} t={`Close`}/></div>
  									                <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  									            </div>
  													</div>
  											</AccordionDetails>
  									</Accordion>
  							}
  							{carpool && carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools.map((m,i) => {
  									return (
  											<div key={i}>
  													<div className={classes(styles.moreTop, styles.rowWrap)}>
  															<FlexColumn heading={``} data={m.entryPersonId === personId && <div onClick={() => handleEdit(m)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></div>}/>
  															<FlexColumn heading={``}
  																data={m.entryPersonId === personId && //m.carpoolMembers && m.carpoolMembers.length <= 2 &&
  																				<div onClick={() => handleRemoveItemOpen(m.carpoolId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></div>
  																		 }/>
  															<FlexColumn heading={<L p={p} t={`Carpool name`}/>} data={m.name} />
  															<FlexColumn heading={<L p={p} t={`Name`}/>} data={m.personName} />
  															<FlexColumn heading={<L p={p} t={`Destination`}/>} data={m.destination} />
  															<FlexColumn heading={<L p={p} t={`Members`}/>}
  																	data={m.carpoolMembers && m.carpoolMembers.length > 0 && m.carpoolMembers.map((b, i) =>
  																				<a key={i} href={`http://maps.google.com/?q=${b.streetAddress}, ${b.city}, ${b.usStateName}`} className={globalStyles.link} target={'_blank'}>
  																						{i > 0 ? ', ' : ''}{b.firstName + ' ' + b.lastName}
  																				</a>
  																		)} />
  															<FlexColumn heading={`Comment`}
  																	data={m.comment && m.comment.length > 50
  																						? <div onClick={() => handleDescriptionOpen(m.name, m.comment)} className={globalStyles.link}>{m.comment.substring(0,50) + '...'}</div>
  																						: m.comment
  																								? m.comment
  																								: '- -'
  																				} />
  												</div>
  												{!expanded &&
  														<div>
  																<div className={styles.dropOffBackground}>
  																		<EditTable headings={headingsDropOff} data={dataDropOff} />
  																</div>
  																<div className={styles.pickUpBackground}>
  																		<EditTable headings={headingsPickUp} data={dataPickUp} />
  																</div>
  														</div>
  												}
  												<Accordion expanded={!!expandedStudentIncluded} onChange={handleExpansionChangeStudentIncluded(true)}>
  														<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
  																<div className={styles.row}>
  																		<span className={globalStyles.link}>{<L p={p} t={`Students Included  (${studentsIncluded && studentsIncluded.length} out of ${myStudentsAll && myStudentsAll.length})`}/>}</span>
  																</div>
  														</AccordionSummary>
  														<AccordionDetails>
  																<div className={classes(globalStyles.multiSelect)}>
  																		<CheckboxGroup
  																				name={'studentsIncluded'}
  																				options={myStudentsAll || []}
  																				horizontal={true}
  		 																		onSelectedChanged={handleStudentsSelected}
  																				label={<L p={p} t={`Students included in this carpool`}/>}
  																				labelClass={styles.text}
  																				selected={studentsIncluded}
  																				required={true}
  																				whenFilled={studentsIncluded}/>
  																</div>
  														</AccordionDetails>
  												</Accordion>
  												<div>
  														<div className={classes(globalStyles.headerLabel, styles.moreTop)}><L p={p} t={`Assign students to carpool (generally)`}/></div>
  														<div className={globalStyles.instructionsBigger}><L p={p} t={`In the daily schedule, you can move your student(s) due to changes in your schedule.`}/></div>
  														<div className={styles.moreLeft}>
  																{theCarpool && theCarpool.carpoolTimes && theCarpool.carpoolTimes.length > 0 && daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.map((day, index) => {
  																		let dropOffs = theCarpool.carpoolTimes.filter(f => f.dropOffOrPickUp === 'dropoff' && f.daysOfWeek.indexOf(day.id) > -1)
  																		let pickUps = theCarpool.carpoolTimes.filter(f => f.dropOffOrPickUp === 'pickup' && f.daysOfWeek.indexOf(day.id) > -1)
  																		return (
  																				<div key={index}>
  																						{((dropOffs && dropOffs.length > 0) || (pickUps && pickUps.length > 0)) &&
  																								<div className={styles.classification}>{day.id.charAt(0).toUpperCase() + day.id.slice(1)}</div>
  																						}
  																						{!(dropOffs && dropOffs.length > 0) ? '' :
  																								<div>
  																										<div>{day.dayOfWeek && day.dayOfWeek.length > 0 && (day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1))}</div>
  																												{dropOffs && dropOffs.length > 0 &&
  																														<div className={classes(styles.dropOffBackground, styles.moreBottom)}>
  																																<div className={globalStyles.headerLabel}><L p={p} t={`Drop-off`}/></div>
  																																<div className={styles.row}>
  																																		<div>
  																																				<div className={classes(styles.sectionLabel, styles.moreBottom)}><L p={p} t={`Unassigned`}/></div>
  																																				{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
  																																						let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
  																																								.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.dayOfWeek === day.id)[0]
  
  																																						return studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty
  																																							 ? null
  																																							 : <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																																											<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																													{s.firstName}
  																																											</div>
  																																											<div onClick={() => timeAssign(m.carpoolId, s.studentPersonId, '', 'right', -1, day.id, 'dropoff', dropOffs)}>
  																																													<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
  																																											</div>
  																																									</div>
  																																				})}
  																																		</div>
  																																		{dropOffs.map((c, timeIndex) => {
  																																				return (
  																																						<div key={timeIndex}>
  																																								<TextDisplay label={''} text={<TimeDisplay time={c.time || ''}/>} className={styles.sectionLabel}/>
  																																								{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
  																																										let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
  																																												.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.carpoolTimeId === c.carpoolTimeId && a.dayOfWeek === day.id)[0]
  
  																																										return !(studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty)
  																																												? null
  																																												: <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																																															{timeIndex >= 0 &&
  																																																	<div onClick={() => timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'left', timeIndex, day.id, 'dropoff', dropOffs)}>
  																																																			<Icon pathName={'arrow_left0'} premium={true} fillColor={'blue'} className={styles.arrowLeft}/>
  																																																	</div>
  																																															}
  																																															<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																																	{s.firstName}
  																																															</div>
  																																															{timeIndex < parseInt(dropOffs.length)-parseInt(1) &&  //eslint-disable-line
  																																																	<div onClick={() => timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'right', timeIndex, day.id, 'dropoff', dropOffs)}>
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
  																												}
  																										</div>
  																								}
  																								{!(pickUps && pickUps.length > 0) ? '' :
  																										<div key={index+100}>
  																												<div>{day.dayOfWeek && day.dayOfWeek.length > 0 && (day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1))}</div>
  																														{pickUps && pickUps.length > 0 &&
  																																<div className={classes(styles.pickUpBackground, styles.moreBottom)}>
  																																		<div className={globalStyles.headerLabel}><L p={p} t={`Pick-up`}/></div>
  																																		<div className={styles.row}>
  																																				<div>
  																																						<div className={classes(styles.sectionLabel, styles.moreBottom)}><L p={p} t={`Unassigned`}/></div>
  																																						{theCarpool.myStudentsAll && m.myStudentsAll.length > 0 && m.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
  																																								let studentTimeAssign = m.timeStudentAssigns && m.timeStudentAssigns.length > 0 && m.timeStudentAssigns
  																																										.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.dayOfWeek === day.id)[0]
  
  																																								return studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty
  																																									 ? null
  																																									 : <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																																													<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																															{s.firstName}
  																																													</div>
  																																													<div onClick={() => timeAssign(m.carpoolId, s.studentPersonId, '', 'right', -1, day.id, 'pickup', pickUps)}>
  																																															<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
  																																													</div>
  																																											</div>
  																																						})}
  																																				</div>
  																																				{pickUps.map((c, timeIndex) => {
  																																						return (
  																																								<div key={timeIndex+100}>
  																																										<TextDisplay label={''} text={<TimeDisplay time={c.time || ''}/>} className={styles.sectionLabel}/>
  																																										{theCarpool.myStudentsAll && m.myStudentsAll.length > 0 && m.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
  																																												let studentTimeAssign = m.timeStudentAssigns && m.timeStudentAssigns.length > 0 && m.timeStudentAssigns
  																																														.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.carpoolTimeId === c.carpoolTimeId && a.dayOfWeek === day.id)[0]
  
  																																												return !(studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty)
  																																														? null
  																																														: <div key={studentIndex+200} className={classes(styles.text, styles.moreBottom, styles.row)}>
  																																																	{timeIndex >= 0 &&
  																																																			<div onClick={() => timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'left', timeIndex, day.id, 'pickup', pickUps)}>
  																																																					<Icon pathName={'arrow_left0'} premium={true} fillColor={'blue'} className={styles.arrowLeft}/>
  																																																			</div>
  																																																	}
  																																																	<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
  																																																			{s.firstName}
  																																																	</div>
  																																																	{timeIndex < parseInt(pickUps.length)-parseInt(1) &&  //eslint-disable-line
  																																																			<div onClick={() => timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'right', timeIndex, day.id, 'pickup', pickUps)}>
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
  																														}
  																												</div>
  																										}
  																								</div>
  																			)
  																})}
  														</div>
  												</div>
  										<hr />
  										</div>
  								)}
  							)}
  	            {isShowingModal_remove &&
  	                <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this carpool?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this carpool?  You will lose any setup you have entered such as carpool members, assigned drivers, and past history, if any.`}/>} isConfirmType={true}
  	                   onClick={handleRemoveItem} />
  	            }
  							{isShowingModal_requests &&
  	                <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This Carpool Area has Requests`}/>}
  											explainJSX={<L p={p} t={`This carpool area has requests pending from other drivers.  This carpool area cannot be deleted until the requests have been deleted or answered.`}/>}
  											onClick={handleShowUsedInClose}/>
  	            }
  							{isShowingModal_description &&
  	                <MessageModal handleClose={handleDescriptionClose} heading={carpoolName}
  	                   explain={carpoolComment} onClick={handleDescriptionClose} />
  	            }
  							{isShowingModal_myStudents &&
  									<CarpoolMemberStudentsModal handleClose={handleMyStudentsChangeClose} personId={personId} carpool={thisStudentCarpool}
  											setMemberStudentsInCarpool={setMemberStudentsInCarpool} isShowing={isShowingModal_myStudents}/>
  							}
  							{isShowingModal_removePickUpTime &&
  	                <MessageModal handleClose={handleRemovePickUpTimeClose} heading={<L p={p} t={`Remove Pick-up Time?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to remove this pick-up time?`}/>} isConfirmType={true}
  	                   onClick={handleRemovePickUpTime} />
  	            }
  							{isShowingModal_removeDropOffTime &&
  	                <MessageModal handleClose={handleRemoveDropOffTimeClose} heading={<L p={p} t={`Remove Drop-off Time?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to remove this drop-off time?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveDropOffTime} />
  	            }
  							{isShowingModal_missingInfo &&
  									<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  										 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  							}
  	      </div>
      )
}

export default withAlert(CarpoolsMine)


// <FlexColumn heading={`My students`}
// 		data={<div onClick={() => this.handleMyStudentsChangeOpen(m)}>
// 							{m.myStudentsInCarpool && m.myStudentsInCarpool.length > 0 && m.myStudentsInCarpool.reduce((acc, s) => acc && acc.length >= 1 ? acc.concat(`, ${s.firstName}`) : [s.firstName], [])}
// 					</div>} />
