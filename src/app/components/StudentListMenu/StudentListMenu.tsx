import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './StudentListMenu.css'
import {guidEmpty} from '../../utils/guidValidate'
import DateMoment from '../DateMoment'
import EditTable from '../EditTable'
import SelectSingleDropDown from '../SelectSingleDropDown'
import classes from 'classnames'
import Icon from '../Icon'
import { withAlert } from 'react-alert'
const p = 'component'
import L from '../../components/PageLanguage'

function StudentListMenu(props) {
  const [isShowingModal_duplicate, setIsShowingModal_duplicate] = useState(false)
  const [isShowingModal_hasSchedule, setIsShowingModal_hasSchedule] = useState(false)
  const [isInit, setIsInit] = useState(undefined)
  const [studentPersonId, setStudentPersonId] = useState(undefined)
  const [studentFirstName, setStudentFirstName] = useState(undefined)
  const [studentLastName, setStudentLastName] = useState(undefined)
  const [studentGoTo, setStudentGoTo] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {students} = props
    				
    				if (!isInit && (!studentPersonId || studentPersonId === guidEmpty) && students && students.length > 0)  {
    						setIsInit(true); setStudentPersonId(students[0].personId); setStudentFirstName(students[0].firstName); setStudentLastName(students[0].lastName)
    				}
    		
  }, [])

  const chooseStudent = () => {
    
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`Choose a student from the list. Then, choose an action.`}/></div>)
    		
  }

  const sendToStudentSchedule = (studentPersonId) => {
    
    				const {getStudentSchedule, personId, schoolYearId, setStudentChosenSession, getTheStudent} = props
    				navigate('/studentSchedule/' + studentPersonId)
    				getStudentSchedule(personId, studentPersonId, schoolYearId)
            setStudentChosenSession(studentPersonId)
            getTheStudent(personId, studentPersonId)
    		
  }

  const sendToGradeReport = (studentPersonId) => {
    
    				const {personId, schoolYearId, setStudentChosenSession, getGradeReport} = props
    				navigate('/gradeReport/' + studentPersonId)
    				getGradeReport(personId, studentPersonId, schoolYearId)
    				setStudentChosenSession(studentPersonId)
    		
  }

  const chooseRecord = (studentPersonId, studentType) => {
    return setStudentPersonId(studentPersonId); setStudentType(studentType)
    

  }
  const handleGoToStudentOption = ({target}) => {
    
    				
    				if (target && target.value) {
    						setStudentGoTo(target.value)
    						if (target.value === 'message') {
    								navigate(`/announcementEdit/new/EMPTY/${studentPersonId}/${studentFirstName}/${studentLastName}`)
    						} else if (target.value === 'schedule') {
    								sendToStudentSchedule(studentPersonId)
    						} else if (target.value === 'gradeReport') {
    								sendToGradeReport(studentPersonId)
    						}
    				}
    		
  }

  const {className="", students, gradeLevels, personConfig, schoolYears, handleUpdateSchoolYear, excludeSchoolYearList} = props
  				
  				let hasRecordChosen = !studentPersonId || studentPersonId === guidEmpty ? false : true
  
  				let headings = [
  						{label: <L p={p} t={`Student`}/>, tightText: true, clickFunction: () => resort('label')},
  						{label: <L p={p} t={`Grade`}/>, tightText: true, clickFunction: () => resort('gradeLevelId')},
  						{label: <L p={p} t={`Last Login`}/>, tightText: true, clickFunction: () => resort('lastLoginDate')},
  				]
  
  				let data = students && students.length > 0 && students.map((m, i) => {
  						return [
  								{ value: m.label,
  										clickFunction: () => chooseRecord(m.personId, m.studentType),
  										cellColor: m.personId === studentPersonId ? 'highlight' : ''
  								},
  								{ value: gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(g => g.id === m.gradeLevelId)[0] && gradeLevels.filter(g => g.id === m.gradeLevelId)[0].label,
  										clickFunction: () => chooseRecord(m.personId, m.studentType),
  										cellColor: m.personId === studentPersonId ? 'highlight' : ''
  								},
  								{ value: m.lastLoginDate > '2010-01-01'
  										 		? <DateMoment date={m.lastLoginDate}  format={'D MMM YYYY  h:mm a'} minusHours={6} className={styles.entryDate}/>
  												: '',
  										clickFunction: () => chooseRecord(m.personId, m.studentType),
  										cellColor: m.personId === studentPersonId ? 'highlight' : ''
  								}
  						]
  				})
  
          return (
  						<div>
  		            <div className={classes(styles.container, className)}>
  										<a onClick={!hasRecordChosen ? chooseStudent : () => navigate(`/announcementEdit/new/EMPTY/${studentPersonId}/${studentFirstName}/${studentLastName}`)} data-rh={'Send a message'}>
  												<Icon pathName={'comment_text'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  										</a>
  										<a onClick={!hasRecordChosen ? chooseStudent : () => sendToStudentSchedule(studentPersonId)} data-rh={`Student's schedule`}>
  												<Icon pathName={'clock3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  										</a>
  										<a onClick={!hasRecordChosen ? chooseStudent : () => sendToGradeReport(studentPersonId)} data-rh={`Student's grade report`}>
  												<Icon pathName={'list3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  										</a>
                      {/*
                        Don't do this because it changes the registration object and then the parent loses the main menu because the overall registration object has the finalizedDate in it to trigger the menu views.
      										<a onClick={!hasRecordChosen ? chooseStudent : () => { getRegistrationByStudent(personId, studentPersonId, companyConfig.schoolYearId); navigate('/studentProfile/' + studentPersonId); }} data-rh={'Student profile and parent info'}>
      												<Icon pathName={'info'} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
      										</a>
                      */}
  										{studentType !== 'DE' &&
  												<a onClick={!hasRecordChosen ? chooseStudent : () => navigate('/courseAttendanceSingle/' + studentPersonId)} data-rh={'Attendance'}>
  														<Icon pathName={'calendar_31'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  												</a>
  										}
  										{hasRecordChosen &&
  												<div className={styles.listPosition}>
  														<SelectSingleDropDown
  																id={`studentGoTo`}
  																label={``}
  																value={studentGoTo || ''}
  																zeroethLabel={'go to ...'}
  																options={[
  																		{ id: 'message', label: `Send a message`},
  																		{ id: 'schedule', label: `Student's schedule`},
  																		{ id: 'gradeReport', label: `Student's grade report`},
  																]}
  																height={`medium`}
  																onChange={handleGoToStudentOption}/>
  												</div>
  										}
  										{!excludeSchoolYearList &&
  												<div className={styles.listPosition}>
  														<SelectSingleDropDown
  																id={`schoolYearId`}
  																label={``}
  																value={personConfig.schoolYearId || ''}
  																options={schoolYears}
  																height={`medium`}
  																onChange={handleUpdateSchoolYear}/>
  												</div>
  										}
  		            </div>
  								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data}/>
  						</div>
          )
}

export default withAlert(StudentListMenu)
