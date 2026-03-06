import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './VolunteerHoursView.css'
import AlertSound from '../../assets/alert_science_fiction.mp3'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateMoment from '../../components/DateMoment'
import ConfirmDateAndNote from '../../components/ConfirmDateAndNote'
import MessageModal from '../../components/MessageModal'
import Button from '../../components/Button'
import DateTimePicker from '../../components/DateTimePicker'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import moment from 'moment'

let recordCount = 0

//1. The parent/guardian enters a check-in or a check-out entry from the curbside. (CurbsideCheckInOrOutView)
//2. The entry is received by the office (VolunteerHoursView).
//		  a. The admin can confirm that they see the student enter or they can mark that they did not ever see the student enter.
//3. The parent receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

function VolunteerHoursView(props) {
  const [showSearchControls, setShowSearchControls] = useState(true)
  const [isShowingModal_note, setIsShowingModal_note] = useState(false)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [checkInOrOut, setCheckInOrOut] = useState('all')
  const [volunteerPersonId, setVolunteerPersonId] = useState('')
  const [studentPersonId, setStudentPersonId] = useState('')
  const [timerId, setTimerId] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isShowingModal_picture, setIsShowingModal_picture] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_confirm, setIsShowingModal_confirm] = useState(undefined)
  const [volunteerEventId, setVolunteerEventId] = useState(undefined)
  const [checkInOrOutDate, setCheckInOrOutDate] = useState(undefined)
  const [noteType, setNoteType] = useState(undefined)
  const [note, setNote] = useState(undefined)

  useEffect(() => {
    return () => {
      
      			if (timerId) {
      					clearInterval(timerId)
      					setTimerId('')
      			}
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {personId, getVolunteerEvents, volunteerEvents, accessRoles} = props
    			
    			let pendingVolunteers = volunteerEvents && volunteerEvents.length > 0 && volunteerEvents.filter(m => (m.checkIn && !m.confirmCheckIn) || (m.checkOut && !m.confirmCheckOut))
    			if (!timerId) setTimerId(setInterval(() => getVolunteerEvents(personId), 10000))
    			if (accessRoles.admin && recordCount < pendingVolunteers.length) {
    					recordCount = pendingVolunteers.length
    					makeSound()
    			}
    	
  }, [])

  const makeSound = () => {
    
    			const audio = new Audio(AlertSound)
    			audio.play()
    	
  }

  const handleChange = ({target}) => {
    
    			let newState = Object.assign({}, state)
    			newState[target.name] = target.value
    			setState(newState)
    	
  }

  const toggleSearch = () => {
    
    			if (showSearchControls) clearFilters()
    			setShowSearchControls(!showSearchControls)
    	
  }

  const clearFilters = () => {
    
    			setVolunteerPersonId(''); setCheckInOrOut('all'); setFromDate(''); setToDate('')
    	
  }

  const handleConfirmOpen = (checkInOrOut, volunteerEventId, checkInOrOutDate) => {
    return setIsShowingModal_confirm(true); setCheckInOrOut(checkInOrOut); setVolunteerEventId(volunteerEventId); setCheckInOrOutDate(checkInOrOutDate)
  }

  const handleConfirmClose = (checkInOrOut, volunteerEventId, checkInOrOutDate) => {
    return setIsShowingModal_confirm(false); setCheckInOrOut(''); setVolunteerEventId(''); setCheckInOrOutDate('')
  }

  const handleConfirm = (checkInOrOutDate, adminNote) => {
    
    			const {personId, confirmVolunteerHour} = props
    			
    			confirmVolunteerHour(personId, {personId, checkInOrOut, checkInOrOutDate, adminNote, volunteerEventId})
    			handleConfirmClose()
    	
  }

  const handleDeleteOpen = (volunteerEventId) => {
    return setIsShowingModal_delete(true); setVolunteerEventId(volunteerEventId)
  }

  const handleDeleteClose = () => {
    return setIsShowingModal_delete(false); setVolunteerEventId('')
  }

  const handleDelete = () => {
    
    			const {personId, getVolunteerEvents, removeVolunteerHours} = props
    			
    			removeVolunteerHours(personId, volunteerEventId)
    			handleDeleteClose()
    			getVolunteerEvents(personId)
    	
  }

  const handleNoteOpen = (noteType, note) => {
    return setIsShowingModal_note(true); setNoteType(noteType); setNote(note)
    	handleNoteClose = () => setIsShowingModal_note(false); setNoteType(''); setNote('')
    
    	changeDate = (field, event) => {
    			const newState = Object.assign({}, state)
  }

  const handleNoteClose = () => {
    return setIsShowingModal_note(false); setNoteType(''); setNote('')
    
    	changeDate = (field, event) => {
    			const newState = Object.assign({}, state)
  }

  const changeDate = (field, event) => {
    
    			const newState = Object.assign({}, state)
    			newState[field] = event.target.value
    			setState(newState)
    	
  }

  const handleImageViewerOpen = (fileUrl) => {
    return setIsShowingModal_picture(true); setFileUrl(fileUrl)
  }

  const handleImageViewerClose = () => {
    return setIsShowingModal_picture(false); setFileUrl('')
    
      render() {
        const {personId, myFrequentPlaces, setMyFrequentPlace, volunteerEvents, volunteerList, volunteerTypes, accessRoles, fetchingRecord} = props
  }

  const {personId, myFrequentPlaces, setMyFrequentPlace, volunteerEvents, volunteerList, volunteerTypes, accessRoles, fetchingRecord} = props
  		
  		let localVolunteerEvents = volunteerEvents
  		let totalMinutes = 0
  
  		let headings = [{},
  				{label: <L p={p} t={`Volunteer`}/>, tightText: true},
  				{label: <L p={p} t={`Event type`}/>, tightText: true},
  				{label: <div><L p={p} t={`Subtotal`}/><br/><L p={p} t={`minutes`}/></div>, tightText: true},
  				{label: <L p={p} t={`Check-In `}/>, tightText: true},
  				{label: <L p={p} t={`Picture`}/>, tightText: true},
  				{label: <L p={p} t={`Volunteer note`}/>, tightText: true},
  				{label: <L p={p} t={`Confirm check-in`}/>, tightText: true},
  				{label: <L p={p} t={`Admin check-in`}/>, tightText: true},
  				{label: <L p={p} t={`Admin check-in note`}/>, tightText: true},
  				{label: <L p={p} t={`Check-out`}/>, tightText: true},
  				{label: <L p={p} t={`Confirm check-out`}/>, tightText: true},
  				{label: <L p={p} t={`Admin check-out`}/>, tightText: true},
  				{label: <L p={p} t={`Admin check-out note`}/>, tightText: true},
  		]
      let data = []
  
      if (localVolunteerEvents && localVolunteerEvents.length > 0) {
  				if (volunteerPersonId || volunteerTypeId || fromDate || toDate) {
  						if (volunteerPersonId && volunteerPersonId != 0) localVolunteerEvents = localVolunteerEvents.filter(m => m.volunteerPersonId === volunteerPersonId); //eslint-disable-line
  						if (volunteerTypeId && volunteerTypeId != 0) localVolunteerEvents = localVolunteerEvents.filter(m => m.volunteerTypeId === volunteerTypeId); //eslint-disable-line
  						if (fromDate && Number(fromDate.replace(/-/g,'')) > 20160101) {
  								localVolunteerEvents = localVolunteerEvents.filter(m => {
  										let checkIn = m.checkIn
  												? m.checkIn.indexOf('T')
  														? m.checkIn.substring(0,m.checkIn.indexOf('T'))
  														: m.checkIn
  												: ''
  										return checkIn >= fromDate
   								})
  						}
  						if (toDate && Number(toDate.replace(/-/g,'')) > 20160101) {
  								localVolunteerEvents = localVolunteerEvents.filter(m => {
  										let checkOut = m.checkOut
  												? m.checkOut.indexOf('T')
  														? m.checkOut.substring(0,m.checkOut.indexOf('T'))
  														: m.checkOut
  												: ''
  										return checkOut <= toDate
   								})
  						}
  				}
  				//If the checkOut is filled in but the confirmCheckOut is not, then this is to confirm the check out.
  				// (the checkIn is filled in which should be the case since the record wouldn't exist without a checkIn)
  				//else if the confirmCheckIn is not filled in,
  				//		then this is to confirm the check in.
  				//		else there is nothing to confirm since the volunteer has not yet requested to check out
          data = localVolunteerEvents.map(m => {
  						let date1 = moment(m.checkIn)
  						let date2 = moment(m.checkOut)
  						let subTotalMinutes = date2 ? date2.diff(date1, 'minutes') : ''
  						subTotalMinutes = isNaN(subTotalMinutes) ? '' : subTotalMinutes
  						totalMinutes += subTotalMinutes
  
  						return [
  							{value: <a onClick={() => handleDeleteOpen(m.volunteerEventId)}><Icon pathName={'trash2'} premium={true}/></a>},
  							{value: m.studentIds && m.studentIds.length > 0
  												? <Link to={`/studentProfile/${m.studentIds[0]}`} className={globalStyles.link}>{m.volunteerPersonName}</Link>
  												: m.volunteerPersonName},
  							{value: m.volunteerTypeName},
  							{value: subTotalMinutes},
  							{value: <DateMoment date={m.checkIn} includeTime={true} minusHours={6}/>},
  							{value: <a onClick={() => handleImageViewerOpen(m.fileUrl)} className={globalStyles.link}>{m.fileUrl ? 'picture' : ''}</a>},
  							{value: <a onClick={() => handleNoteOpen(m.volunteerPersonName + ` - Volunteer's Note`, m.volunteerNote)} className={globalStyles.link}>
  													{m.volunteerNote && m.volunteerNote.length > 30 ? m.volunteerNote.substring(0.30) + '...' : m.volunteerNote}
  											</a>
  							},
  							{value: accessRoles.admin
  											? m.confirmCheckIn
  													? <DateMoment date={m.confirmCheckIn} includeTime={true} minusHours={6}/>
  													: <Button label={'Confirm...'} onClick={() => handleConfirmOpen('in', m.volunteerEventId, m.checkIn)} addClassName={styles.notSoHigh}/>
  											: m.confirmCheckIn
  							},
  							{value: m.checkInAdminName},
  							{value: <a onClick={() => handleNoteOpen(m.volunteerPersonName + ` - Check-in Admin's Note`, m.checkInAdminNote)} className={globalStyles.link}>
  													{m.checkInAdminNote && m.checkInAdminNote.length > 30 ? m.checkInAdminNote.substring(0.30) + '...' : m.checkInAdminNote}
  											</a>
  							},
  							{value: <DateMoment date={m.checkOut} includeTime={true} minusHours={6}/>},
  							{value: accessRoles.admin
  											? m.checkOut
  													? m.confirmCheckOut
  															? <DateMoment date={m.confirmCheckIn} includeTime={true} minusHours={6}/>
  															: <Button label={'Confirm...'} onClick={() => handleConfirmOpen('out', m.volunteerEventId, m.checkOut)} addClassName={styles.notSoHigh}/>
  													: ''
  											: m.confirmCheckOut
  							},
  							{value: m.checkOutAdminName},
  							{value: <a onClick={() => handleNoteOpen(m.volunteerPersonName + ` - Check-out Admin's Note`, m.checkOutAdminNote)} className={globalStyles.link}>
  													{m.checkOutAdminNote && m.checkOutAdminNote.length > 30 ? m.checkOutAdminNote.substring(0.30) + '...' : m.checkOutAdminNote}
  											</a>
  							},
            ]
          })
      }
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								<L p={p} t={`Volunteer Hours`}/>
  						</div>
  						<div className={styles.row}>
  								<a onClick={toggleSearch} className={classes(styles.row, globalStyles.link)}>
  										<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  										{showSearchControls ? <L p={p} t={`Hide search controls`}/> : <L p={p} t={`Show search controls`}/>}
  								</a>
  								{showSearchControls && <a onClick={clearFilters} className={classes(styles.muchRight, globalStyles.link)}><L p={p} t={`Clear filters`}/></a>}
  						</div>
  						{showSearchControls &&
  								<div>
  										<div>
  												<SelectSingleDropDown
  														id={`volunteerPersonId`}
  														name={`volunteerPersonId`}
  														label={<L p={p} t={`Volunteer`}/>}
  														value={volunteerPersonId || ''}
  														options={volunteerList}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={`volunteerTypeId`}
  														name={`volunteerTypeId`}
  														label={<L p={p} t={`Event type`}/>}
  														value={volunteerTypeId || ''}
  														options={volunteerTypes}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}/>
  										</div>
  										<div>
  												<div className={classes(styles.littleLeft, styles.moreTop, styles.row)}>
  														<div className={styles.dateRow}>
  																<span className={styles.headerLabel}><L p={p} t={`Date range - From`}/></span>
  																<DateTimePicker id={`fromDate`} value={fromDate} maxDate={toDate} onChange={(event) => changeDate('fromDate', event)}/>
  														</div>
  														<div className={styles.dateRow}>
  																<span className={styles.headerLabel}><L p={p} t={`To`}/></span>
  																<DateTimePicker id={`toDate`} value={toDate} minDate={fromDate ? fromDate : ''} onChange={(event) => changeDate('toDate', event)}/>
  														</div>
  												</div>
  										</div>
  										<hr/>
  								</div>
  						}
  						{!accessRoles.admin &&
  								<div className={styles.row}>
  										<div className={classes(styles.headerLabel, styles.row)}><L p={p} t={`Total minutes: `}/>{totalMinutes}</div>
  										<div className={classes(styles.moreLeft, styles.headerLabel, styles.row)}><L p={p} t={`Total hours: `}/>{Math.floor(totalMinutes / 60)}:{totalMinutes % 60 < 10 ? '0' + String(totalMinutes % 60) : totalMinutes % 60}</div>
  								</div>
  						}
  						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.volunteerEvents}/>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Volunteer Hours`}/>} path={'volunteerHours'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						<OneFJefFooter />
  						{isShowingModal_confirm &&
  								<ConfirmDateAndNote handleClose={handleConfirmClose} heading={checkInOrOut === 'in' ? <L p={p} t={`Confirm Volunteer Check-in`}/> : <L p={p} t={`Confirm Volunteer Check-out`}/>}
  										onClick={handleConfirm} date={checkInOrOutDate}/>
  						}
  						{isShowingModal_delete &&
  								<MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this volunteer record?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this volunteer record?`}/>} isConfirmType={true}
  									 onClick={handleDelete} />
  						}
  						{isShowingModal_note &&
                  <MessageModal handleClose={handleNoteClose} heading={noteType} explain={note} onClick={handleNoteClose} />
              }
  						{isShowingModal_picture &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
        	</div>
      )
}

export default withAlert(VolunteerHoursView)
