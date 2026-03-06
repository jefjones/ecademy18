import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './ScheduleAssignByMathView.css'
const p = 'ScheduleAssignByMathView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import Checkbox from '../../components/Checkbox'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {doSort} from '../../utils/sort'

function ScheduleAssignByMathView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [scheduleAssignByMathId, setScheduleAssignByMathId] = useState('0')
  const [scheduleAssignByMathCourseAssignId, setScheduleAssignByMathCourseAssignId] = useState('')
  const [selectedCourses, setSelectedCourses] = useState(this.props.scheduleAssignByMathList)
  const [errorMathName, setErrorMathName] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			if (prevProps.scheduleAssignByMathList !== props.scheduleAssignByMathList && selectedCourses !== props.scheduleAssignByMathList) {
    					setSelectedCourses(props.scheduleAssignByMathList)
    			}
    	
  }, [])

  const {mathNames, scheduledCourses, personConfig, companyConfig, intervals, fetchingRecord} = props
      
  
  		//Scheduled headings and Data
  		let scheduledHeadings = [{},
  				{label: 'Name', tightText:true},
  				{label: 'Type', tightText:true},
  				{label: 'Interval', tightText:true},
  				{label: 'Class period', tightText:true},
  				{label: 'Teacher', tightText:true},
  				{label: 'Location', tightText:true},
  				{label: 'Campus', tightText:true},
  				{label: 'Online', tightText:true},
  				{label: 'Self-paced', tightText:true},
  				{label: 'Weekdays', tightText:true},
  				{label: 'Start time', tightText:true},
  				{label: 'Duration', tightText:true},
  				{label: 'Date range', tightText:true},
  				{label: 'Specific dates', tightText:true},
  		]
  
  		let scheduledData = scheduledCourses && scheduledCourses.length > 0
  				? scheduledCourses.map(m => {
  							return [
  									{ value: <Checkbox id={m.studentPersonId} checked={isChosen(m.courseScheduledId)} onClick={() => toggleChoice(m.courseScheduledId)}/>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.courseName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.courseTypeName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.intervalName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.classPeriodName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.facilitatorName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.location}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.onCampusName ? m.onCampusName : m.offCampusName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.onlineName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.selfPacedName}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.weekdaysText}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.startTimeText}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.durationText}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.dateRangeText}</a>},
  									{ id: m.personId, value: <a className={styles.link} onClick={() => toggleChoice(m.courseScheduledId)}>{m.specificTextList}</a>},
  							]})
  				: [[{},{value: <span className={styles.noRecords}>{'no scheduled courses found'}</span>, colSpan: true}]]
  
  		//Chosen courses headings and data
      let headings = [{},
  				{label: 'Name', tightText:true},
  				{label: 'Type', tightText:true},
  				{label: 'Interval', tightText:true},
  				{label: 'Class period', tightText:true},
  				{label: 'Teacher', tightText:true},
  				{label: 'Location', tightText:true},
  				{label: 'Campus', tightText:true},
  				{label: 'Online', tightText:true},
  				{label: 'Self-paced', tightText:true},
  				{label: 'Weekdays', tightText:true},
  				{label: 'Start time', tightText:true},
  				{label: 'Duration', tightText:true},
  				{label: 'Date range', tightText:true},
  				{label: 'Specific dates', tightText:true},
  		]
  
      let data = []
  
  		let orderedCourses = Object.assign([], props.scheduledCourses)
  		orderedCourses = doSort(orderedCourses, {isAsc: true, sortField: 'classPeriodName', isNumber: false})
  
  		orderedCourses && orderedCourses.length > 0 && orderedCourses.forEach(m => {
  			if (selectedCourses.indexOf(m.courseScheduledId) > -1) {
  					data.push([
  							{ value: <a onClick={() => handleRemoveItemOpen(m.courseScheduledId)} className={styles.remove}>remove</a>},
  							{ value: m.courseName},
  							{ value: m.courseTypeName},
  							{ value: m.intervalName},
  							{ value: m.classPeriodName},
  							{ value: m.facilitatorName},
  							{ value: m.location},
  							{ value: m.onCampusName ? m.onCampusName : m.offCampusName},
  							{ value: m.onlineName},
  							{ value: m.selfPacedName},
  							{ value: m.weekdaysText},
  							{ value: m.startTimeText},
  							{ value: m.durationText},
  							{ value: m.dateRangeText},
  							{ value: m.specificTextList},
  					])
  			 }
  	  })
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {'Schedule Assigned by Math'}
              </div>
  						<div>
  								<SelectSingleDropDown
  										id={`intervalId`}
  										label={`Semester`}
  										value={personConfig.intervalId || companyConfig.intervalId}
  										options={intervals}
  										noBlank={true}
  										height={`medium`}
  										onChange={handleUpdateInterval}/>
  						</div>
              <div>
                  <SelectSingleDropDown
                      id={'mathName'}
                      value={scheduleAssignByMathId}
                      label={`Math Name Schedule`}
                      options={mathNames}
                      height={`medium`}
                      className={styles.singleDropDown}
                      onChange={recallSchedule}
  										error={errorMathName}/>
              </div>
              <hr />
  						<EditTable className={styles.lessBottom} labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}
  								firstColumnClass={styles.firstColumnClass} isFetchingRecord={fetchingRecord.scheduleAssignByMath}/>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
  								<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
  						<hr />
  						<EditTable labelClass={classes(styles.tableLabelClass, styles.moreBottomMargin)} headings={scheduledHeadings} data={scheduledData} noCount={true}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this scheduled period?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this scheduled period? (You will still need to click on the Submit button on the page itself in order to finalize the change to the list.)`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
        </div>
      )
}
export default ScheduleAssignByMathView
