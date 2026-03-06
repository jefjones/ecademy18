import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import {apiHost} from '../../api_host'
import InputFile from '../../components/InputFile'
import axios from 'axios'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './VolunteerCheckInOutView.css'
import AlertSound from '../../assets/alert_science_fiction.mp3'
import DateTimePicker from '../../components/DateTimePicker'
import TimePicker from '../../components/TimePicker'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputTextArea from '../../components/InputTextArea'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import Loading from '../../components/Loading'
import DateMoment from '../../components/DateMoment'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

//1. The parent enters a volunteer check-in or a check-out entry
//		a. The add function gets back ONLY this written record with the Id so that the get call will look for that one only for the parent/guardian.
//	  b. The timer has this Id in order to look for it specifically (it does come back in a list so we just need to pick off the first one - but there is only one)
//2. The entry is received by the office to confirm
//		  a. The admin can confirm that they acknowledged the volunteer presence of the parent.
//3. The parent receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

function VolunteerCheckInOutView(props) {
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [checkInDate, setCheckInDate] = useState('')
  const [reasonOther, setReasonOther] = useState('')
  const [reasonChoice, setReasonChoice] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [parentComment, setParentComment] = useState('')
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [checkInTime, setCheckInTime] = useState(datetext.split(' ')[0])
  const [month, setMonth] = useState(undefined)
  const [timerId, setTimerId] = useState(setInterval(() => getVolunteerEvents(personId, volunteerEvents[0].volunteerEventId), 3000))
  const [checkOutTime, setCheckOutTime] = useState(datetext.split(' ')[0])
  const [checkOutDate, setCheckOutDate] = useState(undefined)
  const [errorVolunteerTypeId, setErrorVolunteerTypeId] = useState(<L p={p} t={`Please choose an event type`}/>)
  const [p, setP] = useState(undefined)
  const [errorCheckInDate, setErrorCheckInDate] = useState(<L p={p} t={`Please enter a date`}/>)
  const [errorCheckInTime, setErrorCheckInTime] = useState(<L p={p} t={`Please enter a time`}/>)
  const [errorCheckOutDate, setErrorCheckOutDate] = useState(<L p={p} t={`Please enter a date`}/>)
  const [errorCheckOutTime, setErrorCheckOutTime] = useState(<L p={p} t={`Please enter a time`}/>)
  const [selectedFile, setSelectedFile] = useState(file)

  useEffect(() => {
    
    			let d = new Date(),
    	         month = '' + (d.getMonth() + 1),
    	         day = '' + d.getDate(),
    	         year = d.getFullYear()
    
    	    if (month.length < 2) month = '0' + month
    	    if (day.length < 2) day = '0' + day
    			let datetext = d.toTimeString()
    
    		setCheckInDate([year, month, day].join('-')); setCheckInTime(datetext.split(' ')[0])
    	
    return () => {
      
      			if (timerId) {
      					clearInterval(timerId)
      					setTimerId('')
      			}
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {personId, volunteerEvents, getVolunteerEvents} = props
    			
    			if (!timerId && volunteerEvents && volunteerEvents.length > 0
    							&& ((volunteerEvents[0].checkIn && !volunteerEvents[0].confirmCheckIn)
    									|| (volunteerEvents[0].checkOut && !volunteerEvents[0].confirmCheckOut))) {
    					setTimerId(setInterval(() => getVolunteerEvents(personId, volunteerEvents[0].volunteerEventId), 3000))
    			} else if (timerId && volunteerEvents && volunteerEvents.length > 0
    							&& volunteerEvents[0].confirmCheckIn && !(volunteerEvents[0].checkOut && !volunteerEvents[0].confirmCheckOut)) {
    					clearInterval(timerId)
    					setTimerId('')
    					makeSound()
    			}
    
    			if (!checkOutDate && volunteerEvents && volunteerEvents.length > 0 && volunteerEvents[0].checkIn && !volunteerEvents[0].checkOut) {
    					let checkOutDate =  volunteerEvents[0].checkIn && volunteerEvents[0].checkIn.indexOf('T') > -1
    									? volunteerEvents[0].checkIn.substring(0, volunteerEvents[0].checkIn.indexOf('T'))
    									: volunteerEvents[0].checkIn
    
    					const d = new Date()
    					let datetext = d.toTimeString()
    
    					setCheckOutDate(checkOutDate); setCheckOutTime(datetext.split(' ')[0])
    			}
    	
  }, [])

  const {personId, volunteerTypes, volunteerEvents, volunteerEventId, myFrequentPlaces, setMyFrequentPlace} = props
      
  
  		let volunteerEvent = volunteerEvents && volunteerEvents.length > 0 && volunteerEvents[0]
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								{`Volunteer Check-In or Check-Out`}
  						</div>
  						{(isPendingConfirmation || volunteerEventId) &&
  								<div>
  										<TextDisplay label={<L p={p} t={`Event type`}/>} text={volunteerEvent.volunteerTypeName} minusHours={6}/>
  										<TextDisplay label={<L p={p} t={`Check In`}/>} text={volunteerEvent.checkIn ? <DateMoment date={volunteerEvent.checkIn} minusHours={6}/> : '- -'} />
  										<TextDisplay label={<L p={p} t={`Picture`}/>} text={<a onClick={() => handleImageViewerOpen(volunteerEvent.fileUrl)} className={globalStyles.link}>{volunteerEvent.fileUrl ? <L p={p} t={`View picture`}/> : ''}</a>} hideIfEmpty={true}/>
  										<Loading loadingText={<L p={p} t={`Waiting for office response`}/>} isLoading={!volunteerEvent.confirmCheckIn && !volunteerEvent.checkOut} />
  										<TextDisplay label={<L p={p} t={`Confirm Check In`}/>} text={volunteerEvent.confirmCheckIn ? <DateMoment date={volunteerEvent.confirmCheckIn} minusHours={6}/> : '- -'} />
  										{volunteerEvent.checkIn && !volunteerEvent.checkOut
  												? <div className={styles.checkOutPosition}>
  															<DateTimePicker id={`checkOutDate`} label={<L p={p} t={`Check-out date`}/>} value={checkOutDate || ''} onChange={(event) => changeDate('checkOutDate', event)}
  																className={classes(styles.dateTimePosition, styles.notBold)} error={errorCheckOutDate}/>
  															<TimePicker id={`checkOutTime`} label={<L p={p} t={`Check-out time`}/>} value={checkOutTime || ''} onChange={handleChange} className={styles.notBold}
  																	error={errorCheckOutTime}/>
  															<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Check-out`}/>} onClick={processCheckOut} />
  													</div>
  
  												: <TextDisplay label={<L p={p} t={`Check Out`}/>} text={volunteerEvent.checkOut ? <DateMoment date={volunteerEvent.checkOut} minusHours={6}/> : '- -'} />
  										}
  										<Loading loadingText={<L p={p} t={`Waiting for office response`}/>} isLoading={volunteerEvent.checkOut && !volunteerEvent.confirmCheckOut} />
  										<TextDisplay label={<L p={p} t={`Confirm Check Out`}/>} text={volunteerEvent.confirmCheckOut ? <DateMoment date={volunteerEvent.confirmCheckOut} minusHours={6}/> : '- -'} />
  										<TextDisplay label={<L p={p} t={`Volunteer note`}/>} text={volunteerEvent.volunteerNote || '- -'} />
  										<TextDisplay label={<L p={p} t={`Admin note`}/>} text={volunteerEvent.adminNote || '- -'} />
  										<div className={classes(styles.muchLeft, styles.row)}>
  												<a className={styles.cancelLink} onClick={() => navigate('/firstNav')}><L p={p} t={`Close`}/></a>
  												<ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={handleDeleteOpen} changeRed={true}/>
  										</div>
  								</div>
  						}
  						{!isPendingConfirmation && !volunteerEventId &&
  								<div>
  										<div className={styles.moreBottom}>
  												<SelectSingleDropDown
  														id={`volunteerTypeId`}
  														name={`volunteerTypeId`}
  														label={<L p={p} t={`Event type`}/>}
  														value={volunteerTypeId || ''}
  														options={volunteerTypes}
  														className={styles.notBold}
  														height={`medium`}
  														onChange={handleChange}
  														error={errorVolunteerTypeId}/>
  										</div>
  										<DateTimePicker id={`checkInDate`} label={<L p={p} t={`Date`}/>} value={checkInDate || ''} onChange={(event) => changeDate('checkInDate', event)}
  											className={styles.dateTime} error={errorCheckInDate}/>
  										<TimePicker id={`checkInTime`} label={<L p={p} t={`Time`}/>} value={checkInTime || ''} onChange={handleChange} className={styles.dateTime}
  												error={errorCheckInTime}/>
  										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={handleInputFile} isResize={true}/>
  										<InputTextArea label={<L p={p} t={`Note (optional)`}/>} name={'volunteerNote'} value={volunteerNote} onChange={handleChange} />
  										<div className={classes(styles.muchLeft, styles.row)}>
  												<a className={styles.cancelLink} onClick={() => navigate('/firstNav')}><L p={p} t={`Close`}/></a>
  												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  										</div>
  								</div>
  						}
  						{isShowingModal_delete &&
  								<MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this volunteer record?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this volunteer record?`}/>} isConfirmType={true}
  									 onClick={handleDelete} />
  						}
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Volunteer Check-in or Check-out`}/>} path={'volunteerCheckInOut'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(VolunteerCheckInOutView)
