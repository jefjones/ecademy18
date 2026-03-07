import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './CourseAttendanceAdminView.css'
const p = 'CourseAttendanceAdminView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import {formatDayShortMonthYear} from '../../utils/dateFormat'
import EditTable from '../../components/EditTable'
import DateTimePicker from '../../components/DateTimePicker'
import Checkbox from '../../components/Checkbox'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import InputDataList from '../../components/InputDataList'
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal'
import {formatYYYY_MM_DD} from '../../utils/dateFormatYYYY_MM_DD'
import classes from 'classnames'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import debounce from 'lodash/debounce'
import {guidEmpty} from '../../utils/guidValidate'

function CourseAttendanceAdminView(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [isShowingModal_setColumn, setIsShowingModal_setColumn] = useState(false)
  const [dayFrom, setDayFrom] = useState(today)
  const [dayTo, setDayTo] = useState(today)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [studentPersonId, setStudentPersonId] = useState(props.studentChosenSession || '')
  const [includeSiblings, setIncludeSiblings] = useState(false)
  const [student, setStudent] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(undefined)
  const [isShowingModal_document, setIsShowingModal_document] = useState(undefined)
  const [fileUpload, setFileUpload] = useState(undefined)
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(undefined)
  const [note, setNote] = useState(undefined)

  useEffect(() => {
    
    			//document.getElementById('studentPersonId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
      
    return () => {
      
      			props.clearCourseAttendanceAdmin()
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {studentPersonId, students} = props
    			if ((!studentPersonId || studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
    					let student = students.filter(m => m.id === studentPersonId)[0]
    					setStudent(student); setStudentPersonId(studentPersonId)
    			}
    	
  }, [])

  const saveAttendance = (attendanceType, studentPersonId, courseScheduledId, day, isDelete) => {
    
          const {personId, setCourseAttendance} = props
          setCourseAttendance(personId, attendanceType, studentPersonId, courseScheduledId, day, isDelete, null)
      
  }

  const changeDate = (field, event) => {
    
          let newState = Object.assign({}, state)
          newState[field] = event.target.value
          setState(newState)
    			getAttendance(newState)
      
  }

  const initDates = () => {
    
    	    const {attendanceAdmin} = props
    	    let dayFrom = ''
    	    let dayTo = ''
    	    attendanceAdmin && attendanceAdmin.length > 0 && attendanceAdmin.forEach(m => {
    	        if (!dayFrom || dayFrom > m.day) dayFrom = m.day
    	        if (!dayTo || dayTo < m.day) dayTo = m.day
    	    })
    	    setDayFrom(formatYYYY_MM_DD(dayFrom)); setDayTo(formatYYYY_MM_DD(dayTo))
      
  }

  const handleSelectedCourses = (selectedCourses) => {
    
          setSelectedCourses(selectedCourses)
      
  }

  const toggleCheckbox = (field) => {
    
    	    let newState = Object.assign({}, state)
    	    newState[field] = !newState[field]
    	    if (newState.attendanceTypes && newState.attendanceTypes.indexOf(field) > -1) {
    	        newState.attendanceTypes.splice(newState.attendanceTypes.indexOf(field), 1)
    	    } else {
    	        newState.attendanceTypes = newState.attendanceTypes ? newState.attendanceTypes.concat(field) : [field]
    	    }
    	    setState(newState)
      
  }

  const coursesValueRenderer = (selected, options) => {
    
          return <L p={p} t={`Courses:  ${selected.length} of ${options.length}`}/>
      
  }

  const handleMissingDataOpen = (message) => {
    return setIsShowingModal(true); setMessage(message)
    

  }
  const handleMissingDataClose = () => {
    return setIsShowingModal(false); setMessage('')
    

  }
  const handleSetColumnOpen = () => {
    return setIsShowingModal_setColumn(true)
    

  }
  const handleSetColumnClose = () => {
    return setIsShowingModal_setColumn(false)
    

  }
  const processForm = () => {
    
    			
    			let hasError = false
    
    			if (!dayFrom && !dayTo) {
    					hasError = true
    					handleMissingDataOpen(<L p={p} t={`The date 'from' and/or 'to' is required.`}/>)
    			}
    
    			if (!hasError) {
    				  getAttendance()
    			}
    	
  }

  const changeStudent = (student) => {
    
    			const {setStudentChosenSession} = props
    			let newState = Object.assign({}, state)
    			newState.studentPersonId = student.id
    			newState.student = student
    			setState(newState)
    			getAttendance(newState)
    			setStudentChosenSession(student.id)
    	
  }

  const toggleIncludeSiblings = () => {
    
    			let newState = Object.assign({}, state)
    			newState.includeSiblings = !includeSiblings
    			setState(newState)
    			getAttendance(newState)
    	
  }

  const toggleAllSet = (attendanceType, event) => {
    
    			const {personId, setMassCourseAttendanceAdmin, attendanceAdmin} = props
    			let newState = Object.assign({}, state)
    			newState[attendanceType] = true
    			if (attendanceType !== 'setAllPresent') newState['setAllPresent'] = false
    			if (attendanceType !== 'setAllTardy') newState['setAllTardy'] = false
    			if (attendanceType !== 'setAllAbsent') newState['setAllAbsent'] = false
    			if (attendanceType !== 'setAllExcusedAbsence') newState['setAllExcusedAbsence'] = false
    			if (attendanceType !== 'setAllLeftEarly') newState['setAllLeftEarly'] = false
    			setState(newState)
    			handleSetColumnOpen()
    			//1. Take off the checkbox for all other attendanceType-s
    			//2. Set the checkbox according to the chosen checkbox setting.
    
    			for(let i = 0; i < attendanceAdmin.length; i++) {
    					document.getElementById('PRESENT' + i).checked = false
    					document.getElementById('TARDY' + i).checked = false
    					document.getElementById('ABSENT' + i).checked = false
    					document.getElementById('EXCUSEDABSENCE' + i).checked = false
    					document.getElementById('LEFTEARLY' + i).checked = false
    			}
    			let attendanceTypeCode = attendanceType.substring(6).toUpperCase(); //setAll is 6 characters long.
    			setMassCourseAttendanceAdmin(personId, attendanceTypeCode, false, attendanceAdmin, () => getAttendance(newState))
    	
  }

  const handleUpdateInterval = (event) => {
    
    			const {personId, updatePersonConfig} = props
    			updatePersonConfig(personId, 'IntervalId', event.target.value, () => getAttendance())
    	
  }

  const setColumnCheckbox = (attendanceType) => {
    
    			const {attendanceAdmin} = props
    			let isSet = true
    			attendanceAdmin && attendanceAdmin.length > 0 && attendanceAdmin.forEach(m => {
    					if ((attendanceType === 'PRESENT' && !m.isPresent)
    							|| (attendanceType === 'TARDY' && !m.isTardy)
    							|| (attendanceType === 'ABSENT' && !m.isAbsent)
    							|| (attendanceType === 'EXCUSED' && !m.isExcusedAbsence)
    							|| (attendanceType === 'LEFTEARLY' && !m.isLeftEarly)
    				) isSet = false
    			})
    			return isSet
    	
  }

  const handleUpdateSchoolYear = ({target}) => {
    
    			const {personId, updatePersonConfig, getCoursesScheduled, getStudents} = props
    			setCourseScheduledschoolYearId(target.value)
    			updatePersonConfig(personId, 'SchoolYearId', target.value, () => { getCoursesScheduled(personId, true); getStudents(personId); })
    	
  }

  const handleDocumentOpen = (fileUpload) => {
    return setIsShowingModal_document(true); setFileUpload(fileUpload)
    
    

  }
  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setFileUpload({})
    
    

  }
  const handleInstructionsOpen = (note) => {
    return setIsShowingModal_instructions(true); setNote(note)
    

  }
  const handleInstructionsClose = () => {
    return setIsShowingModal_instructions(false); setNote('')
    

  const {personId, attendanceAdmin, students, fetchingRecord, companyConfig={}, personConfig, schoolYears, myFrequentPlaces, setMyFrequentPlace,
  						accessRoles} = props
      
  
      let headings = [
  				{label: <L p={p} t={`Present`}/>, tightText: true},
          {label: <L p={p} t={`Tardy`}/>, tightText: true},
          {label: <L p={p} t={`Absent`}/>, tightText: true},
          {label: <L p={p} t={`Excused`}/>, tightText: true},
          {label: <L p={p} t={`Left Early`}/>, tightText: true},
          {label: <L p={p} t={`Student`}/>, tightText: true},
          {label: <L p={p} t={`Course`}/>, tightText: true},
          {label: <L p={p} t={`Day`}/>, tightText: true}
      ]
      let data = []
  		let prevDate = ''
  
      if (attendanceAdmin && attendanceAdmin.length > 0) {
  				let loop = 0
          attendanceAdmin.forEach((m, i) => {
  						if (loop > 0 && prevDate !== m.day) {
  								data.push([{value: <hr/>, colSpan: 10}])
  						}
              data.push([
  								{value: <Checkbox id={'PRESENT' + i} checked={m.isPresent} onClick={() => saveAttendance('PRESENT', m.studentPersonId, m.courseScheduledId, m.day, m.isPresent)}/>},
  	              {value: <Checkbox id={'TARDY' + i} checked={m.isTardy} onClick={() => saveAttendance('TARDY', m.studentPersonId, m.courseScheduledId, m.day, m.isTardy)}/>},
  	              {value: <Checkbox id={'ABSENT' + i} checked={m.isAbsent} onClick={() => saveAttendance('ABSENT', m.studentPersonId, m.courseScheduledId, m.day, m.isAbsent)}/>},
  	              {value: <div className={styles.row}>
  														<Checkbox id={'EXCUSEDABSENCE' + i} checked={m.isExcusedAbsence} onClick={() => saveAttendance('EXCUSEDABSENCE', m.studentPersonId, m.courseScheduledId, m.day, m.isExcusedAbsence)}/>
  														{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  																<a key={i} onClick={() => handleDocumentOpen(f)}>
  																		<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
  																</a>)
  														}
  														{m.note &&
  																<div onClick={() => handleInstructionsOpen(m.note)}>
  																		<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
  																</div>
  														}
  												 </div>
  								},
  	              {value: <Checkbox id={'LEFTEARLY' + i} checked={m.isLeftEarly} onClick={() => saveAttendance('LEFTEARLY', m.studentPersonId, m.courseScheduledId, m.day, m.isLeftEarly)}/>},
  	              {value: <Link to={'/courseAttendanceSingle/' + m.studentPersonId} className={styles.link}>{m.learnerName}</Link>},
  	              {value: m.courseName},
  	              {value: formatDayShortMonthYear(m.day, true)},
              ])
  						prevDate = m.day
  						loop++
          })
  				let firstRow = [
  						{id: 'PRESENT', value: <ButtonWithIcon label={''} icon={'checkmark_circle'} replaceClassName={styles.smallButton} onClick={() => toggleAllSet('setAllPresent')} dataRh={'Set all present'}/>},
  						{id: 'TARDY', value: ''},
              {id: 'ABSENT', value: <ButtonWithIcon label={''} icon={'checkmark_circle'} replaceClassName={styles.smallButton} onClick={() => toggleAllSet('setAllAbsent')} data-rh={'Set all absent'}/>},
              {id: 'EXCUSED', value: <ButtonWithIcon label={''} icon={'checkmark_circle'} replaceClassName={styles.smallButton} onClick={() => toggleAllSet('setAllExcusedAbsence')} data-rh={'Set all excused absence'}/>},
              {id: 'LEFTEARLY', value: ''},
  				]
  
  				data && data.unshift(firstRow)
  
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Attendance (Admin)`}/>
              </div>
              <div className={styles.dateRow}>
                  <div className={styles.dateColumn}>
                      <span className={styles.label}><L p={p} t={`From date`}/></span>
                      <DateTimePicker id={`dayFrom`} value={dayFrom}
                          maxDate={dayTo ? dayTo : ''}
                          onChange={(event) => changeDate('dayFrom', event)}/>
                      <span className={styles.error}>{errorDueDateFrom}</span>
                  </div>
                  <div className={classes(styles.dateColumn, styles.moreLeft)}>
                      <span className={styles.label}><L p={p} t={`To date`}/></span>
                      <DateTimePicker id={`dayTo`} value={dayTo}
                          minDate={dayFrom ? dayFrom : ''}
                          onChange={(event) => changeDate('dayTo', event)}/>
                      <span className={styles.error}>{errorDueDateTo}</span>
                  </div>
              </div>
  						<div className={styles.row}>
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
  										<InputDataList
  												label={<L p={p} t={`Student`}/>}
  												name={'student'}
  												options={students || [{id: '', value: ''}]}
  												value={student}
  												height={`medium`}
  												className={styles.moreTop}
  												onChange={changeStudent}/>
  								</div>
  						</div>
  						<div className={styles.moreTop}>
  								<Checkbox
  										id={`includeSiblings`}
  										label={<L p={p} t={`Include siblings`}/>}
  										position={'after'}
  										checked={includeSiblings || ''}
  										onClick={toggleIncludeSiblings}
  										labelClass={styles.labelClass}
  										checkboxClass={styles.checkboxClass}/>
  						</div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  								isFetchingRecord={fetchingRecord.courseAttendanceAdmin}/>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Attendance (Admin)`}/>} path={'courseAttendanceAdmin'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal &&
  								<MessageModal handleClose={handleMissingDataClose} heading={<L p={p} t={`Missing Information`}/>}
  									 explainJSX={message}
  									 onClick={handleMissingDataClose} />
  						}
  						{isShowingModal_setColumn &&
  								<MessageModal handleClose={handleSetColumnClose} heading={<L p={p} t={`Setting the Entire Column`}/>}
  									 explainJSX={<L p={p} t={`The entire column is being set according to your selection.`}/>}
  									 onClick={handleSetColumnClose} />
  						}
  						{isShowingModal_document &&
  								<div className={styles.fullWidth}>
  										{<DocumentViewOnlyModal handleClose={handleDocumentClose} showTitle={true} handleSubmit={handleDocumentClose}
  												companyConfig={companyConfig} accessRoles={accessRoles} fileUpload={fileUpload}  />}
  								</div>
  						}
  						{isShowingModal_instructions &&
  								<MessageModal handleClose={handleInstructionsClose} heading={<L p={p} t={`Excused Absence Note`}/>}
  									 explain={note} onClick={handleInstructionsClose} />
  						}
        </div>
      )
}
}
export default CourseAttendanceAdminView
