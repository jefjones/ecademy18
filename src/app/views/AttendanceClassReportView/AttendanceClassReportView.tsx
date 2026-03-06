import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './AttendanceClassReportView.css'
const p = 'AttendanceClassReportView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'

function AttendanceClassReportView(props) {
  const [origAttendance, setOrigAttendance] = useState({})
  const [attendance, setAttendance] = useState({})
  const [showSearchControls, setShowSearchControls] = useState(false)
  const [courseScheduledId, setCourseScheduledId] = useState('')
  const [studentPersonId, setStudentPersonId] = useState(props.studentChosenSession || '')
  const [student, setStudent] = useState(undefined)
  const [jumpToDay, setJumpToDay] = useState(undefined)

  useEffect(() => {
    
    				const {attendance, courseScheduledId} = props
    				setAttendance(attendance); setCourseScheduledId(courseScheduledId)
    				//document.getElementById('courseScheduledId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {students, studentPersonId} = props
    				if ((!studentPersonId || studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
    						let student = students.filter(m => m.id === studentPersonId)[0]
    						setStudent(student); setStudentPersonId(studentPersonId)
    				}
    		
  }, [])

  const recallPage = (event, singleAssignmentId='') => {
    
    				const {getAttendanceClassReport, personId} = props
            const {courseScheduledId, jumpToDay} = props
    				let id = event && event.target && event.target.value ? event.target.value : courseScheduledId
    				navigate('/attendanceClassReport/' + id)
            getAttendanceClassReport(personId, id, jumpToDay)
            setCourseScheduledId(id)
        
  }

  const recallPageWithJump = (event) => {
    
    				const {personId, updatePersonConfigAttendance} = props
            
    				updatePersonConfigAttendance(personId, courseScheduledId, event.target.value === '0' ? '' : event.target.value)
            setJumpToDay(event.target.value)
        
  }

  const toggleSearch = () => {
    
    				setShowSearchControls(!showSearchControls)
    		
  }

  const changeFilters = ({target}) => {
    
    				let newState = Object.assign({}, state)
    				let field = target.name
    				newState[field] = target.value
    				setState(newState)
    		
  }

  const getTotal = (attendanceType, studentAttendance) => {
    
    				let total = 0
    				studentAttendance && studentAttendance.length > 0 && studentAttendance.forEach(m => {
    						if (attendanceType === 'TARDY' && m.isTardy) total++
    						if (attendanceType === 'ABSENT' && m.isAbsent) total++
    						if (attendanceType === 'EXCUSEDABSENCE' && m.isExcusedAbsence) total++
    						if (attendanceType === 'LEFTEARLY' && m.isLeftEarly) total++
    				})
    				return total
    		
  }

  const {courses, fetchingRecord} = props
  			const fullDayList = props.attendance && props.attendance.fullDayList
        
  			let attendanceLocal = [...origAttendance]
  
  			if (attendanceLocal && attendanceLocal.studentScores && attendanceLocal.studentScores.length > 0 && studentPersonId) {
  					attendanceLocal.studentScores = attendanceLocal.studentScores.filter(m => m.studentPersonId === studentPersonId)
  			}
  
  	 		let headings = [{label: ''}]
  			let data = []
  			let foundJumpTo = !jumpToDay || jumpToDay === guidEmpty || jumpToDay === "0" ? true : false
  			let matchesFilter = false
  
  			attendanceLocal && attendanceLocal.studentAttendance && attendanceLocal.studentAttendance.length > 0 && attendanceLocal.studentAttendance.forEach(m => {
  					if (!foundJumpTo && m.assignmentId === jumpToDay) foundJumpTo = true
  
  					if (foundJumpTo && matchesFilter) {
  							headings.push({
  									verticalText: true,
  									label: <div className={styles.narrowLine}>
  														<div className={styles.labelHead}>{m.title && m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title}</div>
  														<div className={classes(styles.row, styles.labelSubhead)}>
  																points:<div className={styles.lineSub}>{m.totalPoints}</div>
  																{m.dueDate && <div className={classes(styles.labelSubhead, styles.moreLeft)}><L p={p} t={`due:`}/></div>}
  																{m.dueDate && <div className={styles.lineSub}><DateMoment date={m.dueDate} format={'D MMM'}/></div>}
  														</div>
  												</div>,
  							})
  					}
  			})
  
  			attendanceLocal && attendanceLocal.studentScores && attendanceLocal.studentScores.length > 0 && attendanceLocal.studentScores.forEach(m => {
  					let row = [{
  						value: <div className={styles.rowSpace}>
  											 <div className={styles.row}>
  													 <Link to={'/studentProfile/' + m.studentPersonId}><Icon pathName={'info'} className={styles.icon}/></Link>
  													 <Link to={'/studentSchedule/' + m.studentPersonId}><Icon pathName={'clock3'} premium={true} className={styles.icon}/></Link>
  													 <Link to={'/studentSchedule/' + m.studentPersonId} className={styles.link}>{m.studentFirstName + ' ' + m.studentLastName}</Link>
  											 </div>
  									 </div>
  					},
  					{
  							value: getTotal('TARDY', m)
  					},
  					{
  							value: getTotal('ABSENT', m)
  					},
  					{
  							value: getTotal('EXCUSEDABSENCE', m)
  					},
  					{
  							value: getTotal('LEFTEARLY', m)
  					}]
  
  					foundJumpTo = !jumpToDay || jumpToDay === guidEmpty || jumpToDay === "0" ? true : false
  					m.scoreResponses && m.scoreResponses.length > 0 && m.scoreResponses.forEach(s => {
  							if (!foundJumpTo && s.assignmentId === jumpToDay) foundJumpTo = true
  
  							if (foundJumpTo) {
  									row.push({
  											value: <div className={styles.row}>
  														 </div>
  									})
  							}
  					})
  					data.push(row)
  			})
  
        return (
          <div className={styles.container}>
              <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                	<L p={p} t={`Attendance Report`}/>
              </div>
              <div className={styles.formLeft}>
  								<div>
  		                <SelectSingleDropDown
  		                    id={`courseScheduledId`}
  		                    name={`courseScheduledId`}
  		                    label={<L p={p} t={`Course`}/>}
  		                    value={courseScheduledId || ''}
  		                    options={courses}
  		                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  		                    height={`medium`}
  		                    noBlank={false}
  		                    onChange={recallPage} />
  								</div>
  								{fullDayList && fullDayList.length > 0 &&
  										<div>
  												<SelectSingleDropDown
  				                    id={`jumpToDay`}
  				                    label={<L p={p} t={`Jump to:`}/>}
  				                    value={jumpToDay || ''}
  				                    options={attendanceLocal && attendanceLocal.fullDayList}
  				                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  				                    height={`medium`}
  				                    onChange={recallPageWithJump} />
  										</div>
  								}
                  <div className={styles.topMargin}>
  										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}
  												firstColumnClass={styles.firstColumnClass} isFetchingRecord={fetchingRecord.attendanceClassReport}/>
                      {fetchingRecord && !fetchingRecord.gradebook && (!data || data.length === 0)
  												&& <div className={styles.noRecord}><L p={p} t={`No attendance records found for this course`}/></div>
  										}
                  </div>
              </div>
              <OneFJefFooter />
          </div>
      )
}

export default AttendanceClassReportView
