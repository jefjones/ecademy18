import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './CourseAttendanceSingleView.css'
const p = 'CourseAttendanceSingleView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import DateTimePicker from '../../components/DateTimePicker'
import Checkbox from '../../components/Checkbox'
import MultiSelect from '../../components/MultiSelect'
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import InputDataList from '../../components/InputDataList'
import {formatYYYY_MM_DD} from '../../utils/dateFormatYYYY_MM_DD'
import classes from 'classnames'
import TimeDisplay from '../../components/TimeDisplay'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import moment from 'moment'
import {guidEmpty} from '../../utils/guidValidate'
/*
  The data on this page will go back to the server if the student changes,
     but if the date range, attendance types or course lists changes, it depends on the attendanceRoll already received from the server
     and resets the attendanceLocal state and will not recall from the webApi.
*/

function CourseAttendanceSingleView(props) {
  const [hasSetToday, setHasSetToday] = useState(false)
  const [attendanceLocal, setAttendanceLocal] = useState(props.attendanceSingle)
  const [dayFrom, setDayFrom] = useState(dayFrom === '1-01-01' || !dayFrom ? today : dayFrom)
  const [dayTo, setDayTo] = useState(dayTo === '1-01-01' || !dayTo ? today : dayFrom)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [errorDueDateFrom, setErrorDueDateFrom] = useState('')
  const [errorDueDateTo, setErrorDueDateTo] = useState('')
  const [tardy, setTardy] = useState(false)
  const [absent, setAbsent] = useState(false)
  const [excusedAbsence, setExcusedAbsence] = useState(false)
  const [leftEarly, setLeftEarly] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const [uniqueCourses, setUniqueCourses] = useState(undefined)
  const [isInitStudent, setIsInitStudent] = useState(true)
  const [student, setStudent] = useState(undefined)
  const [isShowingModal_document, setIsShowingModal_document] = useState(true)
  const [fileUpload, setFileUpload] = useState({})
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(true)
  const [note, setNote] = useState('')

  useEffect(() => {
    
    			initDates()
    	
    return () => {
      
      			props.clearCourseAttendanceSingle()
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {attendanceSingle, studentPersonId, students} = props
    			
    			if (!isInit && attendanceSingle && attendanceSingle.length > 0) {
    					let uniqueCourseScheduledIds = [...new Set(attendanceSingle.map(m => m.courseScheduledId))]
    					let uniqueCourses = attendanceSingle && attendanceSingle.length > 0 && attendanceSingle.reduce((acc, m) => {
    							if (uniqueCourseScheduledIds.indexOf(m.courseScheduledId) > -1) {
    									let option = { value: m.courseScheduledId, id: m.courseScheduledId, label: m.courseName }
    									acc = acc && acc.length > 0 ? acc.concat(option) : [option]
    							}
    							return acc
    					}, [])
    					setIsInit(true); setUniqueCourses(uniqueCourses); setSelectedCourses(uniqueCourseScheduledIds)
    			}
    			if (!isInitStudent && !(state.studentPersonId && state.studentPersonId !== guidEmpty && state.studentPersonId != 0) //eslint-disable-line
    							&& studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
    					let student = students.filter(m => m.id === studentPersonId)[0]
    					setIsInitStudent(true); setStudent(student); setStudentPersonId(studentPersonId)
    			}
    	
  }, [])

  const {personId, myFrequentPlaces, setMyFrequentPlace, students, accessRoles, companyConfig={}, studentName, fetchingRecord} = props
      
  
  		let attendanceLocal = resetAttendance()
  
      let headings = [
  				{label: <L p={p} t={`Present`}/>, tightText: true},
          {label: <L p={p} t={`Tardy`}/>, tightText: true},
          {label: <L p={p} t={`Absent`}/>, tightText: true},
          {label: <L p={p} t={`Excused`}/>, tightText: true},
          {label: <L p={p} t={`Left Early`}/>, tightText: true},
          {label: <L p={p} t={`Course`}/>, tightText: true},
          {label: <L p={p} t={`Day`}/>, tightText: true}
      ]
      let data = []
  		let prevDate = ''
  
  		if (attendanceLocal && attendanceLocal.length === 1 && !attendanceLocal[0].courseName) {
  			data = [[{value: ''}, {value: <i>No attendance records found.</i>, colSpan: true }]]
  		} else if (attendanceLocal && attendanceLocal.length > 0) {
  				let loop = 0
          attendanceLocal.forEach(m => {
  						if (loop > 0 && prevDate !== m.day) {
  								data.push([{value: <hr/>, colSpan: 10}])
  						}
  						data.push([
  							{id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isPresent} onClick={() => saveAttendance('PRESENT', m.studentPersonId, m.courseScheduledId, m.day, m.isPresent)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
                {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isTardy} onClick={() => saveAttendance('TARDY', m.studentPersonId, m.courseScheduledId, m.day, m.isTardy)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
                {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isAbsent} onClick={() => saveAttendance('ABSENT', m.studentPersonId, m.courseScheduledId, m.day, m.isAbsent)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
  							{value: <div className={styles.row}>
  													<Checkbox id={m.studentPersonId} checked={m.isExcusedAbsence} onClick={() => saveAttendance('EXCUSEDABSENCE', m.studentPersonId, m.courseScheduledId, m.day, m.isExcusedAbsence)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />
  													{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  															<a key={i} onClick={() => handleDocumentOpen(f)}>
  																	<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
  															</a>)
  													}
  													{m && m.note &&
  															<div onClick={() => handleInstructionsOpen(m.note)}>
  																	<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
  															</div>
  													}
  											 </div>
  							},
                {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isExcusedAbsence} onClick={() => saveAttendance('EXCUSEDABSENCE', m.studentPersonId, m.courseScheduledId, m.day, m.isExcusedAbsence)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
                {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isLeftEarly} onClick={() => saveAttendance('LEFTEARLY', m.studentPersonId, m.courseScheduledId, m.day, m.isLeftEarly)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
                {id: m.classPeriodId, value: <div className={styles.row}><div className={styles.moreRight}>{m.courseName}</div>(<TimeDisplay time={m.startTime} />)</div> },
                {id: m.classPeriodId, value: moment(m.day).format('D MMM YYYY - dddd')},
              ])
  						prevDate = m.day
  						loop++
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  Student Attendance
              </div>
  						<div className={classes(globalStyles.subHeader, styles.bold)}>
                  {studentName}
              </div>
              <div className={styles.listPosition}>
  								<InputDataList
  										label={studentName ? <L p={p} t={`Choose another student`}/> : <L p={p} t={`Choose a student`}/>}
  										name={'student'}
  										options={students || [{id: '', value: ''}]}
  										value={student}
  										height={`medium`}
  										className={styles.moreTop}
  										onChange={changeStudent}/>
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
              <span className={classes(styles.label, styles.littleLeft)}><L p={p} t={`Attendance Type Search`}/></span>
              <div className={classes(styles.row, styles.checkboxRow)}>
  								<Checkbox
  										id={`present`}
  										label={<L p={p} t={`Present`}/>}
  										checked={present}
  										onClick={() => toggleCheckbox('present')}
  										labelClass={styles.labelCheckbox}
  										className={styles.checkbox} />
                  <Checkbox
                      id={`tardy`}
                      label={<L p={p} t={`Tardy`}/>}
                      checked={tardy}
                      onClick={() => toggleCheckbox('tardy')}
                      labelClass={styles.labelCheckbox}
                      className={styles.checkbox} />
                  <Checkbox
                      id={`absent`}
                      label={<L p={p} t={`Absent`}/>}
                      checked={absent}
                      onClick={(event) => toggleCheckbox('absent')}
                      labelClass={styles.labelCheckbox}
                      className={styles.checkbox} />
                  <Checkbox
                      id={`excusedAbsence`}
                      label={<L p={p} t={`Excused`}/>}
                      checked={excusedAbsence}
                      onClick={(event) => toggleCheckbox('excusedAbsence')}
                      labelClass={styles.labelCheckbox}
                      className={styles.checkbox} />
                  <Checkbox
                      id={`leftEarly`}
                      label={<L p={p} t={`Left Early`}/>}
                      checked={leftEarly}
                      onClick={(event) => toggleCheckbox('leftEarly')}
                      labelClass={styles.labelCheckbox}
                      className={styles.checkbox} />
              </div>
              {accessRoles.admin &&
  								<div className={styles.multiSelect}>
  		                <MultiSelect
  		                    name={<L p={p} t={`Courses`}/>}
  		                    options={uniqueCourses || []}
  		                    onSelectedChanged={handleSelectedCourses}
  		                    valueRenderer={coursesValueRenderer}
  		                    getJustCollapsed={() => {}}
  		                    selected={selectedCourses}/>
  		            </div>
  						}
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  								isFetchingRecord={fetchingRecord.courseAttendanceSingle}/>
              <hr />
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Attendance Single`}/>} path={'courseAttendanceSingle'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
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

export default CourseAttendanceSingleView
