import { cloneElement, Children, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './TeacherScheduleView.css'
const p = 'TeacherScheduleView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import Loading from '../../components/Loading'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import classes from 'classnames'
import ReactToPrint from "react-to-print"
import MyFrequentPlaces from '../../components/MyFrequentPlaces'

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

function TeacherScheduleView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [intervalId, setIntervalId] = useState(props.personConfig.intervalId || props.companyConfig.intervalId)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(target.value)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				if (props.facilitatorPersonId && (facilitatorPersonId !== props.facilitatorPersonId)){
    						setFacilitatorPersonId(props.facilitatorPersonId)
    				}
    		
  }, [])

  const {personId, myFrequentPlaces, setMyFrequentPlace, facilitators, fetchingRecord, intervals, companyConfig, personConfig, schoolYears, calendarEvents} = props
  			let {teacherSchedule} = props
        
  
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
  										<L p={p} t={`Teacher's Schedule`}/>
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
  												<SelectSingleDropDown
  														id={`facilitatorPersonId`}
  														label={<L p={p} t={`Teachers`}/>}
  														value={facilitatorPersonId}
  														options={facilitators}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={changeTeacher}/>
  										</div>
  										<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => componentRef}/>
  								</div>
  								<hr/>
  								<Loading loadingText={`Loading`} isLoading={!facilitatorPersonId && fetchingRecord && fetchingRecord.teacherSchedule} />
  								<div ref={el => (componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
  										<div className={styles.header}>
  												<L p={p} t={`Teacher Schedule`}/>
  										</div>
  										{teacherSchedule && teacherSchedule.firstName &&
  												<div className={classes(styles.row, styles.header, styles.center, styles.bold)}>
  														{teacherSchedule.firstName + ' ' + (teacherSchedule.lastName || '')}
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
  			 										 onSelectSlot={slotInfo => sendToPersonalEventAdd(slotInfo)} />
  										</div>
  								</div>
  						</div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Teacher Schedule`}/>} path={'teacherSchedule'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
          </div>
      )
}

export default TeacherScheduleView
