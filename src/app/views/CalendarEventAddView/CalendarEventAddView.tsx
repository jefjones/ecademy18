import { useEffect, useState } from 'react'
import styles from './CalendarEventAddView.css'
const p = 'CalendarEventAddView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Checkbox from '../../components/Checkbox'
import InputText from '../../components/InputText'
import DateTimePicker from '../../components/DateTimePicker'
import TimePicker from '../../components/TimePicker'
import RadioGroup from '../../components/RadioGroup'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function CalendarEventAddView(props) {
  const [isShowingModal_deleteDate, setIsShowingModal_deleteDate] = useState(false)
  const [errorEventName, setErrorEventName] = useState('')
  const [errorSchedule, setErrorSchedule] = useState('')
  const [errorToDate, setErrorToDate] = useState('')
  const [errorFromDate, setErrorFromDate] = useState('')
  const [errorStartTime, setErrorStartTime] = useState('')
  const [errorDuration, setErrorDuration] = useState('')
  const [schedule, setSchedule] = useState({
            personId: props.personId,
						calendarEventType: 'personal',
						relatedToCourses: [],
            eventName: '',
            note: '',
            weekdays: {
							sunday: false,
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
							saturday: false,
            },
						allDay: '',
            fromDate: '',
            toDate: '',
            startTime: '',
            duration: '',
        })
  const [personId, setPersonId] = useState(props.personId)
  const [calendarEventType, setCalendarEventType] = useState('personal')
  const [relatedToCourses, setRelatedToCourses] = useState([])
  const [eventName, setEventName] = useState('')
  const [note, setNote] = useState('')
  const [weekdays, setWeekdays] = useState({
							sunday: false,
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
							saturday: false,
            })
  const [sunday, setSunday] = useState(false)
  const [monday, setMonday] = useState(false)
  const [tuesday, setTuesday] = useState(false)
  const [wednesday, setWednesday] = useState(false)
  const [thursday, setThursday] = useState(false)
  const [friday, setFriday] = useState(false)
  const [saturday, setSaturday] = useState(false)
  const [allDay, setAllDay] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState('')
  const [p, setP] = useState(undefined)
  const [selectedCourses, setSelectedCourses] = useState(undefined)

  useEffect(() => {
    
            const {dateMoment} = props
            if (dateMoment) {
    						schedule.fromDate = dateMoment.format('YYYY-MM-DD')
                schedule.toDate = dateMoment.format('YYYY-MM-DD')
                schedule.startTime = dateMoment.format('HH:mm')
                schedule.duration = 30
    						schedule.weekdays = { ...schedule.weekdays, [dateMoment.format('dddd').toLowerCase()]:  true }
                setSchedule(schedule)
            }
        
  }, [])

  const changeCalendarEvent = ({target}) => {
    
          setSchedule({...schedule, [target.name]: target.value})
        
  }

  const changeSchedule = (field, event) => {
    
          let schedule = schedule
          schedule[field] = event.target.value
          setSchedule(schedule)
        
  }

  const handleStartTime = (event) => {
    
          let schedule = schedule
          schedule.startTime = event.target.value
          setSchedule(schedule)
        
  }

  const handleWeekdayPicker = (weekday, event) => {
    
          let schedule = schedule
          schedule.weekdays[weekday] = !schedule.weekdays[weekday]
          setSchedule(schedule)
        
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && processForm()
        
  }

  const processForm = () => {
    
            const {addCalendarEvent, personId, calendarDateRange} = props
            
    
            let hasError = false
            if (!schedule.eventName) {
                hasError = true
                setErrorEventName(<L p={p} t={`Event name is required`}/>)
            }
            if (!schedule.fromDate) {
                hasError = true
                setErrorFromDate(<L p={p} t={`A From Date is required`}/>)
            }
    				if (!schedule.startTime) {
                hasError = true
                setErrorStartTime(<L p={p} t={`A Start Time is required`}/>)
            }
    				if (!schedule.allDay && !schedule.duration) {
                hasError = true
                setErrorDuration(<L p={p} t={`A Duration is required (all day or duration)`}/>)
            }
    
            if (!hasError) {
                addCalendarEvent(personId, schedule, calendarDateRange)
                navigate(`/calendarAndEvents`)
            }
        
  }

  const toggleCheckbox = () => {
    
  }

  const coursesValueRenderer = (selected, options) => {
    
    				return <div className={styles.bold}>{`Courses:  ${selected.length} of ${options.length}`}</div>
    		
  }

  const handleSelectedCourses = (selectedCourses) => {
    
    				setSchedule({...schedule, selectedCourses })
        
  }

  const handleRadioGroup = (value) => {
    
    				setSchedule({...schedule, calendarEventType: value })
    	  
  }

  const {durationOptions, accessRoles} = props
        
  
  			let calendarEventTypes = accessRoles.admin
  					? [{label: "Personal event",id: "personal"},{label: <L p={p} t={`School event (admin only)`}/>, id: "school"}]
  					: accessRoles.facilitator
  							? [{label: "Personal event",id: "personal"},{label: <L p={p} t={`Related to course(s)`}/>, id: "course"}]
  							: []
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                      <L p={p} t={`Schedule an Event`}/>
                  </div>
  								{accessRoles.admin &&
  										<RadioGroup
  												data={calendarEventTypes}
  												id={`calendarEventType`}
  												name={`calendarEventType`}
  												horizontal={false}
  												className={styles.radio}
  												initialValue={schedule.calendarEventType || ''}
  												onClick={handleRadioGroup}/>
  								}
                  <div className={styles.formLeft}>
                      <InputText
                          id={`eventName`}
                          name={`eventName`}
                          size={"medium"}
                          label={<L p={p} t={`Event`}/>}
  												value={schedule.eventName}
                          required={true}
  												whenFilled={schedule.eventName}
                          onChange={changeCalendarEvent}
                          onEnterKey={handleEnterKey}
                          error={errorEventName} />
  
                      {/*<div className={styles.column}>
                          <span className={styles.label}>{'Event note (optional)'}</span>
                          <textarea rows={5} cols={35} name={'note'} value={schedule.note} onChange={changeCalendarEvent} className={styles.commentBox}></textarea>
                      </div>*/}
                      {/*<hr />*/}
  										<div className={styles.error}>{errorSchedule}</div>
                      <div className={styles.error}>{errorFromDate}</div>
                      {/*<div className={styles.classification}>One-time or Repeating Events</div>
                      <WeekdayPicker picker={schedule.weekdays} onClick={handleWeekdayPicker}/>
  										<div className={styles.duration}>
  											<SelectSingleDropDown
  													id={`repeatForWeeks`}
  													name={`repeatForWeeks`}
  													label={`Repeat for weeks`}
  													value={schedule.repeatForWeeks}
  													options={repeatForWeeksOptions}
  													height={`medium`}
  													onChange={(event) => changeSchedule('repeatForWeeks', event)} />
  										</div>*/}
                      <div className={styles.dateRow}>
                          <div className={styles.dateColumn}>
  														<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={schedule.fromDate} maxDate={schedule.toDate ? schedule.toDate : ''}
  																onChange={(event) => changeSchedule('fromDate', event)} error={errorFromDate}
  																required={true} whenFilled={schedule.fromDate}/>
                          </div>
                          <div className={classes(styles.dateColumn, styles.moreLeft)}>
                              <DateTimePicker id={`toDate`} label={<L p={p} t={`To date`}/>} value={schedule.toDate} minDate={schedule.fromDate ? schedule.fromDate : ''}
                                  onChange={(event) => changeSchedule('toDate', event)} error={errorToDate}
  																required={true} whenFilled={schedule.toDate}/>
                          </div>
                      </div>
  										<div className={styles.error}>{errorDuration}</div>
                      <div className={styles.row}>
                          <div className={styles.dateColumn}>
  														<TimePicker id={`startTime`} label={<L p={p} t={`Start time`}/>} value={schedule.startTime || ''} onChange={handleStartTime} className={styles.dateTime}
  																error={errorStartTime} required={true} whenFilled={schedule.startTime} boldText={true}/>
                          </div>
                          <div className={styles.duration}>
                            <SelectSingleDropDown
                                id={`duration`}
                                name={`duration`}
                                label={<L p={p} t={`Duration`}/>}
                                value={schedule.duration}
                                options={durationOptions}
                                height={`medium`}
                                onChange={(event) => changeSchedule('duration', event)}
  															required={true}
  															whenFilled={schedule.duration}
                                error={errorDuration} />
                          </div>
  												<div className={styles.checkboxPosition}>
  														<Checkbox
  																id={`allDay`}
  																label={<L p={p} t={`All day`}/>}
  																checked={schedule.allDay}
  																onClick={toggleCheckbox}
  																labelClass={styles.checkboxLabel}
  																className={styles.checkbox} />
  												</div>
                      </div>
                  </div>
  								<div className={styles.classification}>Reminder (optional)</div>
  								{/*<div className={styles.duration}>
  									<SelectSingleDropDown
  											id={`reminderFrequencyId`}
  											name={`reminderFrequencyId`}
  											label={`Duration`}
  											value={schedule.reminderFrequencyId}
  											options={reminderFrequencyOptions}
  											height={`medium`}<L p={p} t={`onChange={(event) => changeFrequency(`}/>reminderFrequencyId', event)}
  											error={errorDuration} />
  								</div>*/}
                  <hr />
                  <div className={classes(styles.rowRight)}>
  										<Link className={styles.cancelLink} to={'/calendarAndEvents'}>Close</Link>
  										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
                  </div>
              </div>
              <OneFJefFooter />
              {isShowingModal_deleteDate &&
                  <MessageModal handleClose={handleDeleteDateClose} heading={<L p={p} t={`Remove this specific date?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this specific date?`}/>} isConfirmType={true}
                     onClick={handleDeleteDate} />
              }
          </div>
      )
}

export default CalendarEventAddView
