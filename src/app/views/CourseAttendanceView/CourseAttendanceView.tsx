import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CourseAttendanceView.css'
const p = 'CourseAttendanceView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Checkbox from '../../components/Checkbox'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal'
import Icon from '../../components/Icon'
import Loading from '../../components/Loading'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import MessageModal from '../../components/MessageModal'
import moment from 'moment'

function CourseAttendanceView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_noDate, setIsShowingModal_noDate] = useState(false)
  const [isShowingModal_setAllPresent, setIsShowingModal_setAllPresent] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const [attendance, setAttendance] = useState([])
  const [isShowingModal_document, setIsShowingModal_document] = useState(true)
  const [fileUpload, setFileUpload] = useState({})
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(true)
  const [note, setNote] = useState('')

  useEffect(() => {
    return () => {
      
      			props.clearAttendanceDates()
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {courseDay} = props
    			
    			if (!isInit && courseDay) {
    					setCourseDay(courseDay); setIsInit(true)
    			}
    	
  }, [])

  const {personId, myFrequentPlaces, setMyFrequentPlace, students, courseDates, coursesScheduled, courseScheduledId, intervals,
  						personConfig, companyConfig={}, schoolYears, fetchingRecord, accessRoles} = props
      
      let localStudents = students
  
  		let headings = [
  				{label: <L p={p} t={`Present`}/>, tightText: true},
  				{label: <L p={p} t={`Tardy`}/>, tightText: true},
  				{label: <L p={p} t={`Absent`}/>, tightText: true},
  				{label: <L p={p} t={`Excused`}/>, tightText: true},
  				{label: <L p={p} t={`Left Early`}/>, tightText: true},
  				{label: <L p={p} t={`Student`}/>, tightText: true}
  		]
  
  		let data = []
  
  		if (localStudents && localStudents.length > 0) {
  				data = localStudents.map(m => {
  						let isPresent = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isPresent) acc = true; return acc}, false)
  						let isTardy = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isTardy) acc = true; return acc}, false)
  						let isAbsent = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isAbsent) acc = true; return acc}, false)
  						let isExcusedAbsence = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isExcusedAbsence) acc = true; return acc}, false)
  						let isLeftEarly = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isLeftEarly) acc = true; return acc}, false)
  						let excusedAbsence = {}
  						if (isExcusedAbsence) {
  								excusedAbsence = attendance && attendance.length > 0 && attendance.filter(t => t.personId === m.id && t.isExcusedAbsence)[0]
  						}
  
  						return ([
  								{value: <Checkbox onClick={() => handleCourseAttendance('PRESENT', m.id, isPresent)} checked={isPresent}/>},
  								{value: <Checkbox onClick={() => handleCourseAttendance('TARDY', m.id, isTardy)} checked={isTardy}/>},
  								{value: <Checkbox onClick={() => handleCourseAttendance('ABSENT', m.id, isAbsent)} checked={isAbsent}/>},
  								{value: <div className={styles.row}>
  														<Checkbox onClick={() => handleCourseAttendance('EXCUSEDABSENCE', m.id, isExcusedAbsence)} checked={isExcusedAbsence}/>
  														{excusedAbsence && excusedAbsence.fileUploads && excusedAbsence.fileUploads.length > 0 && excusedAbsence.fileUploads.map((f, i) =>
  																<a key={i} onClick={() => handleDocumentOpen(f)}>
  																		<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
  																</a>)
  														}
  														{excusedAbsence && excusedAbsence.note &&
  																<div onClick={() => handleInstructionsOpen(excusedAbsence.note)}>
  																		<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
  																</div>
  														}
  												 </div>
  								},
  								{value: <Checkbox onClick={() => handleCourseAttendance('LEFTEARLY', m.id, isLeftEarly)} checked={isLeftEarly}/>},
  								{value: <div className={styles.row}>
  														<Link to={'/courseAttendanceSingle/' + m.id} data-rh={`See the student's overall attendance`}>
  																<Icon pathName={'calendar_31'} premium={true} className={styles.icon}/>
  														</Link>
  														<Link to={'/studentProfile/' + m.id} className={styles.link} data-rh={`See the student's profile`}>
  																{m.firstName + ' ' + m.lastName}
  														</Link>
  												 </div>},
  						])
  				})
  				let firstRow = [
  						{value: <div className={styles.smallWidth}>
  												<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={courseDay ? handleSetAllPresentOpen : handleDateMissingOpen} addClassName={styles.smallButton}/>
  										</div>,
  						 reactHint: 'Set all present?',
  						},
  				]
  				data.unshift(firstRow)
  		}
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Attendance`}/>
              </div>
  						<div>
  								<SelectSingleDropDown
  										id={`schoolYearId`}
  										label={<L p={p} t={`School year`}/>}
  										value={personConfig.schoolYearId || companyConfig.schoolYearId}
  										options={schoolYears}
  										height={`medium`}
  										onChange={handleUpdateSchoolYear}/>
  						</div>
  						<div>
  								<SelectSingleDropDown
  										id={`intervalId`}
  										label={<L p={p} t={`Interval`}/>}
  										value={personConfig.intervalId || companyConfig.intervalId}
  										options={intervals}
  										noBlank={true}
  										height={`medium`}
  										onChange={handleUpdateInterval}/>
  						</div>
  						<div>
  								<SelectSingleDropDown
  										id={`courseScheduledId`}
  										name={`courseScheduledId`}
  										label={<L p={p} t={`Course`}/>}
  										value={courseScheduledId}
  										options={coursesScheduled}
  										className={styles.listManage}
  										height={`medium`}
  										onChange={recallPage} />
  						</div>
  						<div className={styles.row}>
                  <Loading isLoading={courseScheduledId && !(courseDates && courseDates.length > 0)} loadingText={'Loading dates'} className={styles.moreTop}/>
  		            {courseDates && courseDates.length > 0 &&
  										<div>
  				                <SelectSingleDropDown
  				                    id={'courseDates'}
  				                    value={courseDay}
  				                    label={<L p={p} t={`Day`}/>}
  				                    options={courseDates}
  				                    height={`medium`}
  				                    className={styles.singleDropDown}
  				                    onChange={handleDateChange}/>
  				            </div>
  								}
  						</div>
              <hr />
  						<div className={globalStyles.instructionsBigger}><L p={p} t={`Attendance is saved every time you select a checkbox.`}/></div>
  						<hr />
  						{courseScheduledId &&
                  <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  						        isFetchingRecord={fetchingRecord.courseAttendance}/>
              }
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Attendance`}/>} path={'courseAttendance'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal_noDate &&
                  <MessageModal handleClose={handleDateMissingOpen} heading={<L p={p} t={`No Date Chosen`}/>}
                     explainJSX={<L p={p} t={`Please choose a date before making an attendance entry.`}/>}
                     onClick={handleDateMissingClose} />
              }
  						{isShowingModal_setAllPresent &&
                  <MessageModal handleClose={handleSetAllPresentOpen} heading={<L p={p} t={`Set All Present?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to set all present?  Of course, you can change settings individual for any students who are absent or tardy.`}/>} isConfirmType={true}
                     onClick={handleSetAllPresent} />
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
export default CourseAttendanceView
