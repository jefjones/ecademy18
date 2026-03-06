import { cloneElement, Children, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './StudentScheduleWeekView.css'
const p = 'StudentScheduleWeekView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import Loading from '../../components/Loading'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import InputDataList from '../../components/InputDataList'
import classes from 'classnames'
import ReactToPrint from "react-to-print"
import CalendarEventModal from '../../components/CalendarEventModal'
import MessageModal from '../../components/MessageModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import {guidEmpty} from '../../utils/guidValidate'

import {Calendar, Views, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
const localizer = momentLocalizer(moment)
let allViews = Object.keys(Views).map(k => Views[k])

const ColoredDateCellWrapper = ({ children }) =>
  cloneElement(Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
})

function StudentScheduleWeekView(props) {
  const [isShowingModal_event, setIsShowingModal_event] = useState(false)
  const [isShowingModal_cannotAdd, setIsShowingModal_cannotAdd] = useState(false)
  const [intervalId, setIntervalId] = useState(props.personConfig.intervalId || props.companyConfig.intervalId)
  const [student, setStudent] = useState(undefined)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(target.value)
  const [chosenEvent, setChosenEvent] = useState(event)
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(true)
  const [alertReviewType, setAlertReviewType] = useState('')
  const [safetyAlertId, setSafetyAlertId] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {studentPersonId, students} = props
    				if ((!studentPersonId || studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
    						let student = students.filter(m => m.id === studentPersonId)[0]
    						setStudent(student); setStudentPersonId(studentPersonId)
    				} else if (props.studentPersonId && (studentPersonId !== props.studentPersonId || prevProps.studentsSimple !== props.studentsSimple)){
    						setStudentPersonId(props.studentPersonId)
    				}
    		
  }, [])

  const {personId, students, fetchingRecord, companyConfig={}, personConfig={}, schoolYears, intervals, studentPersonId, calendarEvents, studentName,
  							myFrequentPlaces, setMyFrequentPlace } = props
        
  
  			const minTime = new Date()
  			minTime.setHours(7)
  			minTime.setMinutes(0)
  			const maxTime = new Date()
  			maxTime.setHours(19)
  			maxTime.setMinutes(0)
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
  								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
  										<L p={p} t={`Student's Schedule`}/>
  								</div>
  								<div className={styles.rowWrap}>
  										<div>
  												<SelectSingleDropDown
  														id={`schoolYearId`}
  														label={<L p={p} t={`School year`}/>}
  														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
  														options={schoolYears}
  														height={`medium`}
  														onChange={handleUpdateSchoolYear}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={`intervalId`}
  														label={<L p={p} t={`Interval`}/>}
  														value={intervalId || personConfig.intervalId || companyConfig.intervalId}
  														options={intervals}
  														height={`medium`}
  														onChange={changeItem}/>
  										</div>
  										<div>
  												<InputDataList
  														label={<L p={p} t={`Student`}/>}
  														name={'student'}
  														options={students}
  														value={student}
  														height={`medium`}
  														maxwidth={`mediumshort`}
  														multiple={false}
  														className={styles.littleTop}
  														onChange={changeStudent}/>
  										</div>
  										<div className={styles.inputPosition}>
  												<Link to={`/studentSchedule/${studentPersonId}`} className={classes(globalStyles.link, styles.row)}>
  														<Icon pathName={'clock3'} premium={true} className={styles.iconInline}/>
  														<L p={p} t={`Go to schedule with grade summary`}/>
  												</Link>
  										</div>
  										<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => componentRef}/>
  								</div>
  								<hr/>
  								<Loading loadingText={`Loading`} isLoading={!studentPersonId && fetchingRecord && fetchingRecord.studentScheduleWeek} />
  								<div ref={el => (componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
  										<div className={styles.header}>
  												<L p={p} t={`Student Schedule`}/>
  										</div>
  										{studentName &&
  												<div className={classes(styles.row, styles.header, styles.center, styles.bold)}>
  														{studentName}
  												</div>
  										}
  										<div className={styles.calendarHeight}>
  											 <Calendar
  			 										 localizer={localizer}
  			 										 events={calendarEvents}
  			 										 views={allViews}
  			 										 showMultiDayTimes
  			 										 selectable
  			 										 defaultView={'work_week'}
  			 										 //defaultView={personConfigCalendar && personConfigCalendar.viewRange ? allViews[personConfigCalendar.viewRange] : allViews['day'] }
  			 										 min={minTime}
  			 										 max={maxTime}
  			 										 step={30}
  			 										 eventPropGetter={
  			 											 (event, start, end, isSelected) => {
  			 														let course = {
  			 	                            backgroundColor: '#4a7aeb',
  			 	                            borderRadius: "3px",
  			 	                            borderColor: '#add8e6 #add8e6',
  			 															borderWidth: '3px',
  			 	                            fontSize:'10px',
  			 	                            color:'white',
  			 	                          }
  			 	                          return {
  			 															start: '',
  			 															end: '',
  			 	                            className: "mine",
  			 	                            style: course,
  			 	                          }
  			 	                       }
  			                      }
  			 										 components={{ timeSlotWrapper: ColoredDateCellWrapper,}}
  			 										 startAccessor="start"
  			 										 endAccessor="end"
  			 										 onRangeChange={event => changeViewRange(event)}
  			 										 onSelectEvent={event => handleEventOpen(event)}
  			 										 onSelectSlot={handleNoAddEventOpen} />
  										</div>
  								</div>
  						</div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Student Schedule Week`}/>} path={'studentScheduleWeek'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						{isShowingModal_event &&
  								<CalendarEventModal onClick={handleEventClose} heading={``} explain={``} chosenEvent={chosenEvent} events={calendarEvents}
  										doNotAddNew={true} doNotRemove={true} handleClose={handleEventClose}/>
  						}
  						{isShowingModal_cannotAdd &&
  								<MessageModal handleClose={sendToPersonalEventAddClose} heading={<L p={p} t={`Cannot Add to Calendar`}/>}
  									 explainJSX={<L p={p} t={`This is a student schedule view only.  In order to add to your calendar, go to Calendar and Events from your main menu.`}/>}
  									 onClick={sendToPersonalEventAddClose} />
  						}
          </div>
      )
}

export default StudentScheduleWeekView
