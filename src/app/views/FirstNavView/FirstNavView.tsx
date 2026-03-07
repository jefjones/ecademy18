import { useEffect, useState } from 'react'
const p = 'FirstNavView'
import L from '../../components/PageLanguage'
import MediaQuery from 'react-responsive'
import penspringLogo from '../../assets/penspring_large.png'
import AlertSound from '../../assets/alert_science_fiction.mp3'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import * as styles from './FirstNavView.css'
import { Link, useNavigate } from 'react-router-dom'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import ScheduleModal from '../../components/ScheduleModal'
import CalendarEventModal from '../../components/CalendarEventModal'
import MessageModal from '../../components/MessageModal'
import Icon from '../../components/Icon'
import Button from '../../components/Button'
import RegistrationNav from '../../views/RegistrationNavView'
import TextDisplay from '../../components/TextDisplay'
import StudentListTable from '../../components/StudentListTable'
import CourseListTable from '../../components/CourseListTable'
import CourseRecommendation from '../../components/CourseRecommendation'
import DateMoment from '../../components/DateMoment'
import ManheimStudentSchedule from '../../components/ManheimStudentSchedule'
import OpenRegistrationsList from '../../components/OpenRegistrationsList'
import VolunteerHoursPending from '../../components/VolunteerHoursPending'
import StudentListOnly from '../../components/StudentListOnly'
import InputDataList from '../../components/InputDataList'
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal'
import AdminResponsePendings from '../../components/AdminResponsePendings'
import StudentChoiceMenu from '../../components/StudentChoiceMenu'
import ExcelStudents from '../../components/ExcelStudents'
import WorkSummary from '../../components/WorkSummary'
import GroupSummary from '../../components/GroupSummary'
import InvitesPending from '../../components/InvitesPending'
import classes from 'classnames'
import OneFJefFooter from '../../components/OneFJefFooter'
import { withAlert } from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'
import {formatNumber} from '../../utils/numberFormat'


function FirstNavView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [expanded, setExpanded] = useState('')
  const [hasChangedExpanded, setHasChangedExpanded] = useState(false)
  const [valueMessageTab, setValueMessageTab] = useState(0)
  const [slotInfo, setSlotInfo] = useState({})
  const [chosenEvent, setChosenEvent] = useState({})
  const [isShowingModal_nav, setIsShowingModal_nav] = useState(false)
  const [isShowingModal_event, setIsShowingModal_event] = useState(false)
  const [isShowingModal_removeLearner, setIsShowingModal_removeLearner] = useState(false)
  const [isShowingModal_removeMentor, setIsShowingModal_removeMentor] = useState(false)
  const [isShowingModal_removeCourse, setIsShowingModal_removeCourse] = useState(false)
  const [isShowingModal_removeAssessment, setIsShowingModal_removeAssessment] = useState(false)
  const [isShowingModal_removeRecommendations, setIsShowingModal_removeRecommendations] = useState(false)
  const [isShowingModal_expiredRecommendations, setIsShowingModal_expiredRecommendations] = useState(false)
  const [courseEntryId, setCourseEntryId] = useState('')
  const [courseScheduledId_attendance, setCourseScheduledId_attendance] = useState('')
  const [courseEntryId_assignedToMe, setCourseEntryId_assignedToMe] = useState('')
  const [assessmentId, setAssessmentId] = useState('')
  const [studentPersonId, setStudentPersonId] = useState('')
  const [facilitatorPersonId, setFacilitatorPersonId] = useState('')
  const [impersonatePersonId, setImpersonatePersonId] = useState('')
  const [impersonatePersonId_guardian, setImpersonatePersonId_guardian] = useState('')
  const [mentorPersonId, setMentorPersonId] = useState('')
  const [calendarTargetDate, setCalendarTargetDate] = useState(new Date())
  const [calendarViewRange, setCalendarViewRange] = useState('day')
  const [typeAnnouncementList, setTypeAnnouncementList] = useState('recipient')
  const [announcementList, setAnnouncementList] = useState([])
  const [chosenTab, setChosenTab] = useState('inbox')
  const [messageSearch, setMessageSearch] = useState('')
  const [sentToLogin, setSentToLogin] = useState(false)
  const [studentSchedule_personId, setStudentSchedule_personId] = useState('')
  const [schoolYearId, setSchoolYearId] = useState(props.schoolYearId)
  const [timerId, setTimerId] = useState(undefined)
  const [countsTimerId, setCountsTimerId] = useState(undefined)
  const [hasSetPanel, setHasSetPanel] = useState(undefined)
  const [selectedStudent, setSelectedStudent] = useState(undefined)
  const [adminResponseTimerId, setAdminResponseTimerId] = useState(undefined)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(undefined)
  const [showModal_registrationMessage, setShowModal_registrationMessage] = useState(undefined)
  const [isShowingModal_document, setIsShowingModal_document] = useState(undefined)
  const [pickupLaneFileUpload, setPickupLaneFileUpload] = useState(undefined)

  useEffect(() => {
    
    				const {personId, getRegistrationPending, getCountsMainMenu, companyConfig, personConfig={}} = props
    				if (companyConfig.urlcode === 'Liahona') setTimerId(setInterval(() => getRegistrationPending(personId), 60000))
    				if (companyConfig.urlcode !== 'Manheim') setCountsTimerId(setInterval(() => getCountsMainMenu(personId), 20000)); setPersonId(personId)
    				if (personConfig.firstNavPanelOpen) handleExpansionChange(personConfig.firstNavPanelOpen)(null, true)
        
    return () => {
      
      				if (props.companyConfig.urlcode === 'Liahona') clearInterval(timerId)
      				clearInterval(countsTimerId)
              clearInterval(adminResponseTimerId)
          
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {accessRoles, fetchingRecord, resolveFetchingRecordAnnouncements, announcementsSentBy, announcementsDeleted, announcementsRecipient,
    								getAdminResponsePendings, personId, personConfig={}, students, companyConfig={}, studentPersonId} = props
    				
    
    				if (!hasSetPanel && personConfig.firstNavPanelOpen) {
    						handleExpansionChange(personConfig.firstNavPanelOpen)(null, true)
    						setHasSetPanel(true)
    				}
    
    				if ((!studentPersonId || studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
    						let selectedStudent = students.filter(m => m.id === studentPersonId)[0]
    						setSelectedStudent(selectedStudent); setStudentPersonId(studentPersonId)
    				}
    
    				if (fetchingRecord.announcementsRecipient === 'ready' && announcementList !== announcementsRecipient) {
    						setAnnouncementList(announcementsRecipient)
    						resolveFetchingRecordAnnouncements()
    				}
    				if (fetchingRecord.announcementsSentBy === 'ready' && announcementList !== announcementsSentBy) {
    						setAnnouncementList(announcementsSentBy)
    						resolveFetchingRecordAnnouncements()
    				}
    				if (fetchingRecord.announcementsDeleted === 'ready' && announcementList !== announcementsDeleted) {
    						setAnnouncementList(announcementsDeleted)
    						resolveFetchingRecordAnnouncements()
    				}
    				if (accessRoles && accessRoles.learner && expanded !== 'panel1' && !hasChangedExpanded)
    						setExpanded('panel1')
    
    				if (prevProps.counts.curbsideCheckInOrOuts < props.counts.curbsideCheckInOrOuts || (prevProps.counts && props.counts && prevProps.counts.curbsideCheckInOrOuts < props.counts.curbsideCheckInOrOuts))
    						makeSound()
    
    				if (prevProps.counts.volunteerCheckInOrOuts < props.counts.volunteerCheckInOrOuts || (prevProps.counts && props.counts && prevProps.counts.volunteerCheckInOrOuts < props.counts.volunteerCheckInOrOuts))
    						makeSound()
    
    				if (prevProps.counts.safetyAlerts < props.counts.safetyAlerts || (prevProps.counts && props.counts && prevProps.counts.safetyAlerts < props.counts.safetyAlerts))
    						makeSound()
    
    				if (accessRoles.admin && !adminResponseTimerId && companyConfig.urlcode !== 'Manheim')
                setAdminResponseTimerId(setInterval(() => getAdminResponsePendings(personId), 10000)); setPersonId(personId)
    		
  }, [])

  const handleTabMessageChange = (event, valueMessageTab) => {
    
        		setValueMessageTab(valueMessageTab)
      	
  }

  const sendToMentorUpdate = () => {
    
            
            mentorPersonId && navigate('/userAdd/mentor/' + mentorPersonId)
        
  }

  const changeImpersonateUser = (field, value) => {
    
    				const {login, personId} = props
    				clearInterval(timerId)
    				clearInterval(countsTimerId)
    				clearInterval(adminResponseTimerId)
    				if (value?.[0]?.id) {
    						login({username: value[0].id, clave: '*&^', salta: personId }, '', 'salta')
    						handleExpansionChange('panel20')(null, false)
    				}
    		
  }

  const changeChoice = (event) => {
    
    				const {setStudentChosenSession} = props
    	      const field = event.target.name
    	      let newState = Object.assign({}, state)
    	      newState[field] = event.target.value
    	      setState(newState)
    	      if (field === 'assessmentId') sendToAssessmentQuestions(event.target.value)
    				if (field === 'facilitatorPersonId') navigate('/userAdd/facilitator/' + event.target.value)
    				if (field === 'studentSchedule_personId') setStudentChosenSession(event.target.value)
        
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && changeChoice(event)
        
  }

  const sendToAssessmentQuestions = (assessmentIdParam) => {
    
            let assessmentId = assessmentIdParam ? assessmentIdParam : assessmentId
            assessmentId && navigate('/assessmentQuestions/' + assessmentId)
        
  }

  const handleScheduleClose = () => {
    return setIsShowingModal_nav(false)
  }

  const handleScheduleOpen = (slotInfo) => {
    return setIsShowingModal_nav(true); setSlotInfo(slotInfo)
  }

  const handleEventClose = () => {
    return setIsShowingModal_event(false)
  }

  const handleEventOpen = (event) => {
    return setIsShowingModal_event(true); setChosenEvent(event)
  }

  const handleRemoveLearnerClose = () => {
    return setIsShowingModal_removeLearner(false)
  }

  const handleRemoveLearnerOpen = () => {
    return setIsShowingModal_removeLearner(true)
  }

  const handleRemoveMentorClose = () => {
    return setIsShowingModal_removeMentor(false)
  }

  const handleRemoveMentorOpen = () => {
    return setIsShowingModal_removeMentor(true)
  }

  const handleRemoveCourseClose = () => {
    return setIsShowingModal_removeCourse(false)
  }

  const handleRemoveCourseOpen = () => {
    return setIsShowingModal_removeCourse(true)
  }

  const handleRemoveAssessmentClose = () => {
    return setIsShowingModal_removeAssessment(false)
  }

  const handleRemoveAssessmentOpen = () => {
    return setIsShowingModal_removeAssessment(true)
  }

  const handleAllRemoveRecommendationOpen = () => {
    return setIsShowingModal_removeRecommendations(true)
  }

  const handleAllRemoveRecommendationClose = () => {
    return setIsShowingModal_removeRecommendations(false)
  }

  const handleAllRemoveRecommendation = () => {
    
    				const {removeAllMyCourseRecommendations, personId} = props
    				removeAllMyCourseRecommendations(personId)
    				handleAllRemoveRecommendationClose()
    		
  }

  const handleExpiredRecommendCourseOpen = () => {
    return setIsShowingModal_expiredRecommendations(true)
  }

  const handleExpiredRecommendCourseClose = () => {
    return setIsShowingModal_expiredRecommendations(false)
  }

  const setChosenClipboardOption = (chosenClipboardOption) => {
    
    				setChosenClipboardOption(chosenClipboardOption)
    		
  }

  const handleRemoveSingleStudentClipboard = (studentPersonId) => {
    
    				const {removeStudentUserPersonClipboard, personId} = props
    				removeStudentUserPersonClipboard(personId, studentPersonId, 'STUDENT')
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`The student clipboard had 1 record removed.`}/></div>)
    		
  }

  const handleRemoveSingleCourseClipboard = (chosenCourseId) => {
    
    				const {singleRemoveCourseClipboard, personId, courseClipboard} = props
    				singleRemoveCourseClipboard(personId, chosenCourseId, courseClipboard && courseClipboard.courseListType)
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`The course clipboard had 1 record removed.`}/></div>)
    		
  }

  const handleUpdateInterval = (event) => {
    
    				const {personId, updatePersonConfig, getStudentSchedule, getCoursesScheduled, getCoursesBase, personConfig} = props
    				//
    				updatePersonConfig(personId, 'IntervalId', event.target.value,
    						() => {
    								getStudentSchedule(personId, personId, personConfig.schoolYearId)
    								getCoursesScheduled(personId)
    								getCoursesBase(personId)
    		  			}
    				)
    				navigate('/firstNav')
    		
  }

  const changeMessageSearch = ({target}) => {
    
    	      let messageSearch = state.essageSearch
    				messageSearch = target.value.toLowerCase()
    	      setMessageSearch(messageSearch)
    	  
  }

  const sendToLogin = (isParent=false, isOwner=false, isTeacher=false, isDoctor=false) => {
    
    				const {login, personId} = props
    				
    				//localStorage.setItem("authToken", {exp: '' });
    				//localStorage.setItem("person", "");
    				setSentToLogin(true)
    				clearInterval(timerId)
    				clearInterval(countsTimerId)
    				let sendToPersonId = isOwner
    						? impersonatePersonId_owner
    						: isParent
    								? impersonatePersonId_guardian
    								: isTeacher
    										? impersonatePersonId_teacher
    										: isDoctor
    												? impersonatePersonId_doctor
    												: impersonatePerson && impersonatePerson.id
    
    				sendToPersonId && login({username: sendToPersonId, clave: '*&^', salta: personId }, '', 'salta')
    				handleExpansionChange('panel20')(null, false)
    		
  }

  const sendToScheduleFinalized = () => {
    
    				const {personId, getStudentSchedule} = props
    				
    				navigate('/studentScheduleFinalize/' + studentSchedule_personId)
    				//Call getStudentSchedule here because the student schedule finalize page would have to watch the change, but this is a good launch point to get the next student's schedule
    				getStudentSchedule(personId, studentSchedule_personId, 10)
    		
  }

  const handleUpdateSchoolYear = ({target}) => {
    
    				const {personId, updatePersonConfig, getStudents, getGuardians, getStudentSchedule, getRegistration, initNextYearRegistration} = props
    				setCourseScheduledschoolYearId(target.value)
    				updatePersonConfig(personId, 'SchoolYearId', target.value, () => {
                getGuardians(personId)
                getStudents(personId)
                getStudentSchedule(personId, personId, target.value)
                getRegistration(personId, personId, target.value)
                initNextYearRegistration(personId)
                navigate(`/firstNav`)
            })
    		
  }

  const setNextYearRegistration = () => {
    
    				const {personId, updatePersonConfig, getStudents, getGuardians, getStudentSchedule, getRegistration} = props
    				setCourseScheduledschoolYearId('60418981-dd92-462b-a791-c8d21c0f810e')
    				updatePersonConfig(personId, 'SchoolYearId', '60418981-dd92-462b-a791-c8d21c0f810e', () => {
                getGuardians(personId)
                getStudents(personId)
                getStudentSchedule(personId, personId, '60418981-dd92-462b-a791-c8d21c0f810e')
                getRegistration(personId, personId, '60418981-dd92-462b-a791-c8d21c0f810e')
            })
            handleRegistrationMessageOpen()
    		
  }

  const handleRegistrationMessageOpen = () => {
    return setShowModal_registrationMessage(true)
    

  }
  const handleRegistrationMessageClose = () => {
    return setShowModal_registrationMessage(false)
    

  }
  const makeSound = () => {
    
    				const audio = new Audio(AlertSound)
    				audio.play()
    		
  }

  const sendToManageAssignment = () => {
    
    				const {assignmentsInit, personId} = props
    				
    				if (courseEntryId_assignment) {
    						assignmentsInit(personId, courseEntryId_assignment)
    						navigate(`/assignmentList/${courseEntryId_assignment}`)
    				}
    		
  }

  const handleSelectedStudent = (selectedStudent) => {
    
            setSelectedStudent(selectedStudent)
            props.setStudentChosenSession(selectedStudent.id)
        
  }

  const handlePickupLaneImageOpen = (pickupLaneFileUpload) => {
    return setIsShowingModal_document(true); setPickupLaneFileUpload(pickupLaneFileUpload)
    
  }

  const handlePickupLaneImageClose = () => {
    return setIsShowingModal_document(false); setPickupLaneFileUpload({})
    
  }

  const togglePickupLaneShow = () => {
    return props.togglePickupLaneShow(props.personId)
  }

  const togglePickupLaneParked = () => {
    return props.togglePickupParkedShow(props.personId)
  }

  const resetCache = () => {}

  const {me, personId, firstName, counts={}, removeCalendarEvent, students, facilitators, mentors, removeLearner, studentChosenSession,
  				 				removeMentor, removeCourse, accessRoles={}, calendarEvents, removeAssessment, gradeLevels, registration, initRegistration,
  								updateRegStudent, removeGuardianContact, updateBillingPreference, updatePayment, relationTypes, addOrUpdateRelation,
  								removeRegStudent, fetchingRecord, studentSchedule, setStudentsSelected, addOrUpdateCustody, belowMinimalCountNewSchool,
  								registrationCustodies, studentAssignmentsInit, removeOpenRegistration, openRegistrations, userPersonClipboard, doctors,
  								removeAllUserPersonClipboard, resetUserPersonClipboard, removeStudentCourseAssign, courseClipboard, companyConfig={},
  								removeAllCourseClipboard, courseEntries, scheduledCourses, removeCourseRecommendation, courseRecommendations, intervals,
  								personConfig={}, setRegistrationFinalizedDate, openRegistration, guardians, duenos, getRegistration,
  								addPreviousStudentThisYear, schoolYears, getCountsMainMenu, volunteerEvents, removeVolunteerHours, getVolunteerEvents,
  								adminResponsePendings, confirmSafetyAlert, confirmCheckInOrOut, confirmVolunteerHour, getStudentSchedule, getAbsenceUnexcused,
  								finalizeNonLiahonaRegistration, getRegistrationByStudent, isFetchingRecord, setStudentCourseAssignNameSearch,
                  pickupLane={}, setStudentChosenSession, getTheStudent,
                  workSummary, groupSummary, deleteWork, deleteChapter, updatePersonConfig, setWorkCurrentSelected, setGroupCurrentSelected,
                  deleteGroup, groupSummaries, editorInvitePending, deleteInvite, acceptInvite, resendInvite } = props
  
           let isNewRegistrationFamily = !accessRoles.hasEnrolledStudent && accessRoles.observer
  
  				 let features = props.companyConfig && props.companyConfig.features
  				 			? props.companyConfig.features
  							: {}
  
           if (!features) features = {}
  
            //registrationPersonId,
  
  				let clipboardStudents = (userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0 && students && students.length > 0
  						&& students.filter(m => userPersonClipboard.personList.indexOf(m.personId) > -1)) || []
  				let clipboardCourses = []
  				if (courseClipboard && courseClipboard.courseList && courseClipboard.courseList.length > 0) {
  						if ((courseClipboard && (courseClipboard.courseListType === 'CourseEntry' || features.graduationRequirements)) && courseEntries && courseEntries.length > 0) {
  								clipboardCourses = courseEntries.filter(m => courseClipboard.courseList.indexOf(m.courseEntryId) > -1) || []
  						} else if (scheduledCourses && scheduledCourses.length > 0){
  								clipboardCourses = scheduledCourses.filter(m => courseClipboard.courseList.indexOf(m.courseScheduledId) > -1) || []
  						}
  				}
  
  				let student = selectedStudent && selectedStudent.id && students && students.length > 0 && students.filter(m => m.personId === selectedStudent.id)[0]
  				let localRegistration = JSON.parse(localStorage.getItem("registration"))
  				let primaryGuardians = guardians && guardians.length > 0 && guardians.filter(m => m.personType === 'PRIMARYGUARDIAN')
  
          return (
              <div className={styles.container}>
                    <div className={classes(styles.mainTitle, styles.moreBottomLittle)}>
                        {firstName ? <span>{`${firstName.trim()}, `}<L p={p} t={`where do you want to go?`}/></span> : <L p={p} t={`Where do you want to go?`}/>}
                    </div>
  									{features.registration && !accessRoles.hasEnrolledStudent && !(localRegistration && localRegistration.finalizedDate) && accessRoles.observer && //!regStorage.finalizedDate &&
  											<div className={styles.moreLeft}>
  													<RegistrationNav personId={personId} firstName={firstName} registration={registration} accessRoles={accessRoles}
  															companyConfig={companyConfig} initRegistration={initRegistration} updateRegStudent={updateRegStudent}
  															removeGuardianContact={removeGuardianContact} updateBillingPreference={updateBillingPreference}
  															updatePayment={updatePayment} relationTypes={relationTypes} addOrUpdateRelation={addOrUpdateRelation}
  															removeRegStudent={removeRegStudent} registrationCustodies={registrationCustodies}
  															addOrUpdateCustody={addOrUpdateCustody} setRegistrationFinalizedDate={setRegistrationFinalizedDate}
  															getRegistration={getRegistration} addPreviousStudentThisYear={addPreviousStudentThisYear} personConfig={personConfig}
  															schoolYearId={schoolYearId} schoolYears={schoolYears} showSteps={true} finalizeNonLiahonaRegistration={finalizeNonLiahonaRegistration}/>
  											</div>
  									}
  									{/*!(!registration.finalizedDate && features.registration && accessRoles.observer) && !accessRoles.doctor &&*/}
  									{((!accessRoles.observer && !accessRoles.doctor) || (accessRoles.hasEnrolledStudent && accessRoles.observer)) &&
  										<div>
  											{students && students.length > 0 && students.length < 8 && accessRoles.observer &&
  													<div className={(styles.moreTop, styles.moreLeft)}>
  															<StudentListOnly students={students} gradeLevels={gradeLevels} getStudentSchedule={props.getStudentSchedule} personId={personId}
  																	getTheStudent={getTheStudent} setStudentChosenSession={setStudentChosenSession}/>
  													</div>
  											}
  											{companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
  													<div className={styles.row}>
  															<div className={styles.muchMoreLeft}>
  																	<SelectSingleDropDown
  																			id={`schoolYearId`}
  																			label={<L p={p} t={`School year`}/>}
  																			value={personConfig.schoolYearId || ''}
  																			options={schoolYears}
  																			height={`medium`}
  																			onChange={handleUpdateSchoolYear}/>
  															</div>
  															{!accessRoles.doctor &&
  																	<div className={classes(styles.muchMoreLeft, styles.someBottomMargin)}>
  																			<SelectSingleDropDown
  																					id={`intervalId`}
  																					name={`intervalId`}
  																					label={<L p={p} t={`Semester`}/>}
  																					value={personConfig.intervalId || companyConfig.intervalId || ''}
  																					options={[{id: '4DF5AAC4-E02D-4C4E-BC55-06E259F87488', label: 'Fall Semester'}, {id: '01306640-D945-483B-801C-81B27A4DEF12', label: 'Spring Semester'}]}
  																					noBlank={true}
  																					height={`medium`}
  																					onChange={handleUpdateInterval}/>
  																	</div>
  															}
  													</div>
  											}
                        {/*<div onClick={setNextYearRegistration} className={classes(styles.linkBig, styles.linkAlone)}>Start registration 2020-Ffooter</div>*/}
                        {false && companyConfig.urlcode === 'Liahona' && accessRoles.observer &&
                            <div className={classes(styles.linkBig, styles.linkAlone)}>Registration coming soon for 2020-2021</div>
                        }
  											{false && belowMinimalCountNewSchool && accessRoles.admin && companyConfig.urlcode !== 'Manheim' &&
  													<div className={styles.checkListLeft}>
  															<Link to={'/newSchoolCheckList'} className={classes(styles.link, styles.linkAlone, styles.row)}>
  																	<Icon pathName={'clipboard_check'} className={styles.iconHigher} premium={true}/>
  																	<span className={styles.menuHeaderGreen}><L p={p} t={`New School Check List`}/></span>
  															</Link>
  													</div>
  											}
  											{(features.curbsideCheckInOut || features.volunteerHours || features.sendStudentToOffice || features.safetyAlert)
  														 && companyConfig.urlcode !== 'Manheim' && accessRoles.admin &&
  													<Accordion expanded={expanded === 'panel21'} onChange={handleExpansionChange('panel21')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'antennae'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Admin Response Pending`}/></span>
  																			<span className={styles.countHeader}>{adminResponsePendings && adminResponsePendings.length}</span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<AdminResponsePendings adminResponsePendings={adminResponsePendings} confirmSafetyAlert={confirmSafetyAlert}
  																			confirmCheckInOrOut={confirmCheckInOrOut} confirmVolunteerHour={confirmVolunteerHour}/>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.attendance && (accessRoles.admin || accessRoles.facilitator) && companyConfig.urlcode !== 'Manheim' &&
  													<Accordion expanded={expanded === 'panel4b'} onChange={handleExpansionChange('panel4b')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'calendar_check'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Attendance`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			{accessRoles.admin &&
  																					<Link to={`/courseAttendanceAdmin`} className={styles.menuItem}><L p={p} t={`Attendance (admin)`}/></Link>
  																			}
  																			<Link to={`/courseAttendance`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Attendance`}/></Link>
  																			<Link to={`/courseAttendanceSingle/0`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Student Multiple Days and Classes`}/></Link>
  																			<Link to={`/attendanceReport/0/0`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Student Attendance Report`}/></Link>
  																			{accessRoles.admin && companyConfig && companyConfig.urlcode && companyConfig.urlcode.length > 0 && companyConfig.urlcode.indexOf('Maeser') > -1 &&
  																					<Link to={`/attendanceSchool`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Attendance School`}/></Link>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.behaviorIncidents && (accessRoles.admin || accessRoles.facilitator) &&
  													<Accordion expanded={expanded === 'panel24'} onChange={handleExpansionChange('panel24')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'surveillance'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Behavior Incidents`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<Link to={`/behaviorIncidentList`} className={styles.menuItem}><L p={p} t={`List`}/></Link>
                                        <Link to={`/behaviorIncidentAdd`} className={styles.menuItem}><L p={p} t={`Add new`}/></Link>
  																			<Link to={`/behaviorIncidentReport`} className={styles.menuItem}><L p={p} t={`Report`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.absenceExcused && (accessRoles.admin || accessRoles.observer || accessRoles.learner) &&
  													<Accordion expanded={expanded === 'panel28'} onChange={handleExpansionChange('panel28')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'calendar_cross'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Absences (Unexcused)`}/></span>
  																			{!accessRoles.admin && <span className={styles.countHeader}>{counts.absenceUnexcused}</span>}
  																			{accessRoles.admin &&
  																					<div className={classes(styles.row, styles.countHeader)}>
  																							<div data-rh={'Unexcused absences'}>{counts.absenceUnexcused || '0'}</div>
  																							<div className={styles.littleSpace}>/</div>
  																							<div data-rh={'Excused absence requests pending approval'}>{counts.excusedAbsenceRequests || '0'}</div>
  																							<div className={styles.littleSpace}>/</div>
  																							<div data-rh={`Doctor note invites pending`}>{counts.doctorNoteInvitesPending || '0'}</div>
  																					</div>
  																			}
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			{(accessRoles.admin || accessRoles.observer || accessRoles.learner) &&
  																					<div onClick={() => {navigate(`/absenceUnexcused`); getAbsenceUnexcused(personId);}} className={styles.row}>
  																							<span className={styles.menuItem}>{accessRoles.admin ? <L p={p} t={`Excuse an absence`}/> : <L p={p} t={`Request to excuse an absence`}/>}</span>
  																							<div className={styles.countSubmenu}>
  																									{counts.absenceUnexcused || '0'}
  																							</div>
  																					</div>
  																			}
  																			{accessRoles.admin &&
  																					<div onClick={() => {navigate(`/absenceUnexcused/pendingApproval`); getAbsenceUnexcused(personId, 'pendingApproval');}} className={styles.row}>
  																							<span className={styles.menuItem}><L p={p} t={`Excused absences pending approval`}/></span>
  																							<div className={styles.countSubmenu}>
  																									{counts.excusedAbsenceRequests || '0'}
  																							</div>
  																					</div>
  																			}
  																			{accessRoles.admin && <hr/>}
  																			{accessRoles.admin &&
  																					<Link to={`/doctorNoteInvite`} className={styles.menuItem}>
  																							<L p={p} t={`Request a doctor's note`}/>
  																					</Link>
  																			}
  																			{accessRoles.admin &&  //doctor notes are applied to excused absence records and mixed in with the parent's excused absences.
  																					<div onClick={() => navigate(`/doctorNoteInviteList`)} className={styles.row}>
  																							<span className={styles.menuItem}><L p={p} t={`Doctor note invites pending`}/></span>
  																							<div className={styles.countSubmenu}>
  																									{counts.doctorNoteInvitesPending || '0'}
  																							</div>
  																					</div>
  																			}
  																			{accessRoles.admin &&
  																					<Link to={`/doctorNotes`} className={styles.menuItem}>
  																							<L p={p} t={`Doctors' notes`}/>
  																					</Link>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.billing  && !accessRoles.facilitator &&
  													<Accordion expanded={expanded === 'panel25'} onChange={handleExpansionChange('panel25')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'dollars'} className={styles.iconHigher} premium={true}/>
  																			<div className={classes(styles.row, styles.menuHeader)}>
  																					<L p={p} t={`Billing and Credits`}/>
  																					{counts.personalBillingBalance
  																							? <div className={styles.balanceDue}><L p={p} t={`Balance due`}/>{`: $${formatNumber(counts.personalBillingBalance, true, false, 2)}`}</div>
  																							: ''
  																					}
  																			</div>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<Link to={`/financeAccountList`} className={styles.menuItem}><L p={p} t={`Account Summaries`}/></Link>
  																			<hr/>
                                        <Link to={`/financeBillingList`} className={styles.menuItem}><L p={p} t={`Billing History`}/></Link>
  																			{accessRoles.admin &&
  																					<Link to={`/financeBillingAdd`} className={styles.menuItem}><L p={p} t={`Add New Billing`}/></Link>
  																			}
  																			<hr/>
  																			<Link to={`/financeCreditList`} className={styles.menuItem}><L p={p} t={`Credits History`}/></Link>
  																			{accessRoles.admin &&
  																					<Link to={`/financeCreditAdd`} className={styles.menuItem}><L p={p} t={`Add New Credit`}/></Link>
  																			}
  																			<hr/>
  																			<Link to={`/financeLunchList`} className={styles.menuItem}><L p={p} t={`Lunch History`}/></Link>
  																			{accessRoles.admin &&
  																					<Link to={`/financeBillingAdd/lunch/addLunchBilling`} className={styles.menuItem}><L p={p} t={`Add New Lunch Billing`}/></Link>
  																			}
  																			<Link to={`/financePaymentAdd/lunch/addNewLunchPayment`} className={styles.menuItem}><L p={p} t={`Add New Lunch Credit`}/></Link>
  																			<hr/>
  																			<Link to={`/financePaymentList`} className={styles.menuItem}><L p={p} t={`Payment History`}/></Link>
  																			<Link to={`/financePaymentReceipt`} className={styles.menuItem}><L p={p} t={`Payment History`}/></Link>
  																			<Link to={`/financePaymentAdd`} className={styles.menuItem}><L p={p} t={`Add New Payment`}/></Link>
  																			<hr/>
  																			<Link to={`/financeRefundList`} className={styles.menuItem}><L p={p} t={`Refund History`}/></Link>
  																			{accessRoles.admin &&
  																					<Link to={`/financeRefundAdd`} className={styles.menuItem}><L p={p} t={`Add New Refund`}/></Link>
  																			}
  																			<hr/>
  																			<Link to={`/financeTransferList`} className={styles.menuItem}><L p={p} t={`Transfer History`}/></Link>
  																			<Link to={`/financeTransferAdd`} className={styles.menuItem}><L p={p} t={`Add New Transfer`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.calendarAndEvents && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
  													<div className={styles.linkAlone}>
  															<Link to={'/calendarAndEvents'} className={classes(styles.link, styles.row, styles.moreTop)}>
  																	<Icon pathName={'calendar_31'} className={styles.iconHigher} premium={true}/>
  																	<span className={styles.menuHeader}><L p={p} t={`Calendar and Events`}/></span>
  															</Link>
  													</div>
  											}
                        {features.calendarAndEvents && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
  													<hr/>
  											}
  											{features.carpool && (accessRoles.observer || accessRoles.admin) && !isNewRegistrationFamily &&
  													<div className={classes(styles.row, styles.linkAlone)}>
  															<Link to={'/carpool'} className={classes(styles.link, styles.row)}>
  																	<Icon pathName={'car'} premium={true} className={classes(styles.iconHigher, styles.iconLift)}/>
  																	<span className={styles.menuHeader}><L p={p} t={`Carpool`}/></span>
  																	<span className={styles.countHeader}>{counts.carpools}</span>
  															</Link>
  															{/*<Link to={`/tutorialVideo/Carpool Open Request`} data-rh={'Tutorial video for carpool open request'}>
  																	<Icon pathName={'film_run'} className={styles.iconTutorial} premium={true}/>
  															</Link>*/}
  													</div>
  											}
  											{features.courses && !(accessRoles.observer && !accessRoles.hasEnrolledStudent) && !(companyConfig.urlcode === 'Manheim' && accessRoles.facilitator)
  																	&& (accessRoles.admin || accessRoles.counselor || (companyConfig.urlcode !== 'Manheim' && accessRoles.learner)) &&
  											        <Accordion expanded={expanded === 'panel1'} onChange={handleExpansionChange('panel1')}>
  												          <AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  													            <div className={styles.row}>
  																					<Icon pathName={'presentation'} className={styles.iconHigher} premium={true}/>
  																					<span className={styles.menuHeader}>{accessRoles.admin || accessRoles.facilitator ? <L p={p} t={`Courses and Sections`}/> : <L p={p} t={`Courses`}/>}</span>
  																			</div>
  												          </AccordionSummary>
  												          <AccordionDetails>
  																			<div>
  																					{accessRoles.learner &&
  																							<div className={styles.raiseUpward}>
  																									{companyConfig.preliminaryClassChoice && openRegistration && openRegistration.isOpen &&
  																											<Link to={`/studentBaseCourseRequest/${personId}`} className={classes(styles.lessLeft, styles.menuItem, styles.link)}>
  																													<L p={p} t={`Choose Classes`}/>
  																											</Link>
  																									}
  																									{(!studentSchedule || studentSchedule.length === 0) && fetchingRecord && !fetchingRecord.studentSchedule &&
  																											<div className={styles.noRecord}><L p={p} t={`No courses assigned ... yet.`}/></div>
  																									}
  																									{studentSchedule && studentSchedule.length > 0 && studentSchedule.map((m, i) =>
  																											<TextDisplay key={i} label={<div className={styles.row}>{m.classPeriodName ? `Period ${m.classPeriodName} - ` : ''}<DateMoment date={m.startTime} timeOnly={true} className={styles.bitSpace} labelClass={styles.label}/>{m.teachers.reduce((acc, m) => acc ? acc += ', ' + m.label : m.label, '')}</div>}
  																													text={<div className={styles.row}>
  																																		<a onClick={() => {navigate('/studentAssignments/' + m.courseScheduledId); studentAssignmentsInit(personId, personId, m.courseScheduledId)}} className={classes(styles.row, styles.link)}>
  																																				{m.courseName}&nbsp;&nbsp;&nbsp;&nbsp;{m.overallGrade && m.courseName !== 'Seminary' ? m.overallGrade : ''}
  																																		</a>
  																																</div>} />
  																											)
  																									}
  																					</div>
  																	}
  															</div>
  															<div>
  																	{accessRoles.admin &&
  																			<Link to={`/baseCourses`} className={styles.menuItem}><L p={p} t={`Courses`}/></Link>
  																	}
  																	{(accessRoles.admin || accessRoles.facilitator || accessRoles.counselor) &&
  																			<div>
  																					<Link to={`/scheduledCourses`} className={styles.menuItem}>{`Sections`}</Link>
  																					<div className={classes(styles.row, styles.moreLeft)}>
  																							<div className={styles.someBottomMargin}>
  																									<SelectSingleDropDown
  																											id={`courseEntryId_assignment`}
  																											name={`courseEntryId_assignment`}
  																											label={<L p={p} t={`Manage Assignments`}/>}
  																											value={courseEntryId_assignment || ''}
  																											options={courseEntries}
  																											height={`medium`}
  																											maxwidth={`mediumshort`}
  																											onChange={changeChoice}/>
  																							</div>
  																							<div className={styles.lowHeight}>
  																									<Button label={'Go >'} onClick={sendToManageAssignment}/>
  																							</div>
  																					</div>
  																			</div>
  																	}
  									            </div>
  								          </AccordionDetails>
  											</Accordion>
  											}
  											{features.courses && accessRoles.facilitator &&
  													<div className={styles.linkAlone}>
  															<Link to={`/scheduledCourses`} className={classes(styles.link, styles.row)}>
  																	<Icon pathName={'presentation'} className={styles.iconHigher} premium={true}/>
  																	<span className={styles.menuHeader}><L p={p} t={`Courses`}/></span>
  																	<div className={styles.countHeader}>{counts.learningOpportunities}</div>
  															</Link>
  													</div>
  											}
                        {features.carpool && accessRoles.observer && !isNewRegistrationFamily &&
  													<hr/>
  											}
  											{features.curbsideCheckInOut && (accessRoles.admin || accessRoles.observer) && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
  													<div className={styles.linkAloneForCurbside}>
  															<Link to={accessRoles.admin ? '/curbsideAdmin' : '/curbside'} className={classes(styles.link, styles.row)}>
  																	<Icon pathName={'taxi'} className={styles.iconHigher} premium={true}/>
  																	<span className={styles.menuHeader}><L p={p} t={`Curbside Check-in or Check-out`}/></span>
  																	<span className={styles.countHeader}>{counts.curbsideCheckInOrOuts}</span>
  															</Link>
  													</div>
  											}
                        {(features.curbsideCheckInOut) && (accessRoles.admin || accessRoles.observer) && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
                            <hr/>
                        }
                        {features.penspring && accessRoles.admin &&
                            <Accordion expanded={expanded === 'panel30'} onChange={handleExpansionChange('panel30')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
                                    <div className={styles.row}>
                                        <Icon pathName={'pencil0'} className={styles.iconPencil} premium={true}/>
                                        <span className={styles.menuHeader}><L p={p} t={`Essays, Papers, and Editing`}/></span>
                                        <img src={penspringLogo} alt={`penspring`} style={{ marginLeft: '11px', height: '18px' }} />
                                    </div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
                                        {workSummary &&
                                            <div className={styles.current}>
                                                <WorkSummary summary={workSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={true} hideCaret={true}
                                                    setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter} indexName={`MainMenuPenspring`}
                                                    updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                                            </div>
                                        }
                                        {workSummary &&
                                            <hr />
                                        }
                                        {groupSummary &&
                                            <div className={styles.current}>
                                                <GroupSummary summary={groupSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={true} hideCaret={true}
                                                    setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup} isMainMenuPenspring={true}
                                                    updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                                            </div>
                                        }
                                        {groupSummary && <hr />}
                                        <Link to={`/myWorks`} className={styles.menuItem}><L p={p} t={`My documents`}/></Link>
                                        <Link to={`/myContacts`} className={styles.menuItem}><L p={p} t={`My contacts`}/></Link>
                												{groupSummaries && groupSummaries.length > 0  &&
                                            <Link to={`/myGroupsReport`} className={styles.menuItem}><L p={p} t={`My groups`}/></Link>
                												}
                												{workSummary && personId === workSummary.authorPersonId && <li><hr /></li>}
                												{workSummary && personId === workSummary.authorPersonId &&
                                            <Link to={`/workSettings`} className={styles.menuItem}><L p={p} t={`This document's settings`}/></Link>
                												}
                												<hr />
                                        <Link to={`/workAddNew`} className={styles.menuItem}><L p={p} t={`Add new document`}/></Link>
                                        <Link to={`/editorInviteNameEmail`} className={styles.menuItem}><L p={p} t={`Invite new editor`}/></Link>
                                        {editorInvitePending && editorInvitePending.length > 0 &&
                                            <InvitesPending invites={editorInvitePending} personId={personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                                                resendInvite={resendInvite} expanded={true}/>
                                        }
                                        <Link to={`/groupTypeChoice`} className={styles.menuItem}><L p={p} t={`Create new editor group`}/></Link>
                                        <hr />
                                        <Link to={`/report/e/edit`} className={styles.menuItem}><L p={p} t={`Editor reports`}/></Link>
                                        <hr />
                                        <Link to={`/openCommunity`} className={styles.menuItem}><L p={p} t={`Open community`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
                        }
  											{features.finance && (accessRoles.admin || accessRoles.facilitator) &&
  													<Accordion expanded={expanded === 'panel27'} onChange={handleExpansionChange('panel27')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'medal_empty'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Finance`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<div className={styles.displayOnly}>{`Teacher's Supply Balance: $${counts.teacherSupplyBalance || 0}`}</div>
  																			<div onClick={() => navigate(`/reimbursementRequestAdd`)} className={styles.menuItem}>
  																					<L p={p} t={`Reimbursement Request`}/>
  																			</div>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
  											{false && //features.galleryPhotos && (accessRoles.admin || accessRoles.facilitator) &&
  													<Accordion expanded={expanded === 'panel31'} onChange={handleExpansionChange('panel31')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'camera2'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Gallery Photos`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<Link to={`/galleryEntry`} className={styles.menuItem}>{`Add new photo`}</Link>
  																			<Link to={`/galleryList`} className={styles.menuItem}><L p={p} t={`Photo list`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
                        {false && //features.galleryPhotos && !accessRoles.admin && !accessRoles.facilitator &&
                            <div>
                                <div className={styles.linkAloneForCurbside}>
                                    <Link to={`/galleryList`} className={classes(styles.link, styles.row)}>
                                        <Icon pathName={'photo'} className={styles.iconHigher} premium={true}/>
                                        <span className={styles.menuHeader}><L p={p} t={`Gallery Photos`}/></span>
                                    </Link>
                                </div>
                                <hr />
                            </div>
                        }
                        {features.gradebook && (accessRoles.admin || accessRoles.facilitator) && companyConfig.urlcode !== 'Manheim' &&
  													<Accordion expanded={expanded === 'panel3'} onChange={handleExpansionChange('panel3')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'medal_empty'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Gradebook`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<Link to={`/gradebookEntry`} className={styles.menuItem}>{companyConfig.isMcl ? `Class` : `Class`}</Link>
  																			{/*<Link to={`/gradebookSummary`} className={styles.menuItem}><L p={p} t={`Assignment Type Summary`}/></Link>*/}
  																			<Link to={`/studentSchedule/0`} className={styles.menuItem}><L p={p} t={`Student`}/></Link>
  																			<Link to={`/gradeReport/0`} className={styles.menuItem}><L p={p} t={`Student Grade Report`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
  											{accessRoles.admin &&
  													<Accordion expanded={expanded === 'panel20'} onChange={handleExpansionChange('panel20')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'user_check'} className={styles.iconHigher} premium={false}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Impersonate Users`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<div className={styles.selectPosition}>
  																					<SelectSingleDropDown
  																							id={`schoolYearId`}
  																							label={<L p={p} t={`School year`}/>}
  																							value={personConfig.schoolYearId || companyConfig.schoolYearId || ''}
  																							options={schoolYears}
  																							height={`medium`}
  																							onChange={handleUpdateSchoolYear}/>
  																			</div>
  																			<div>
  																					<InputDataList
  																							label={<L p={p} t={`Student`}/>}
  																							name={'impersonatePersonId'}
  																							options={students}
  																							value={impersonatePerson}
  																							height={`medium`}
  																							maxwidth={`mediumshort`}
  																							multiple={true}
  																							className={classes(styles.someBottomMargin, styles.listManage)}
  																							onChange={(value) => changeImpersonateUser('impersonatePerson', value)}
  																							onEnterKey={handleEnterKey}/>
  																			</div>
  																			<div>
  																					<InputDataList
  																							label={<L p={p} t={`Parent/guardian`}/>}
  																							name={'impersonatePersonId_guardian'}
  																							options={primaryGuardians}
  																							value={impersonatePersonId_guardian}
  																							height={`medium`}
  																							maxwidth={`mediumshort`}
  																							multiple={true}
  																							className={classes(styles.someBottomMargin, styles.listManage)}
  																							onChange={(value) => changeImpersonateUser('impersonatePersonId_guardian', value)}
  																							onEnterKey={handleEnterKey}/>
  																			</div>
  																			<div>
  																					<InputDataList
  																							label={<L p={p} t={`Teacher`}/>}
  																							name={'impersonatePersonId_teacher'}
  																							options={facilitators}
  																							value={impersonatePersonId_teacher}
  																							height={`medium`}
  																							maxwidth={`mediumshort`}
  																							multiple={true}
  																							className={classes(styles.someBottomMargin, styles.listManage)}
  																							onChange={(value) => changeImpersonateUser('impersonatePersonId_teacher', value)}
  																							onEnterKey={handleEnterKey}/>
  																			</div>
  																			{me.username === 'jef' &&
  																					<div>
  																							<InputDataList
  																									label={<L p={p} t={`Doctors`}/>}
  																									name={'impersonatePersonId_doctor'}
  																									options={doctors}
  																									value={impersonatePersonId_doctor}
  																									height={`medium`}
  																									maxwidth={`mediumshort`}
  																									multiple={true}
  																									className={classes(styles.someBottomMargin, styles.listManage)}
  																									onChange={(value) => changeImpersonateUser('impersonatePersonId_doctor', value)}
  																									onEnterKey={handleEnterKey}/>
  
  																					</div>
  																			}
  																			{me.username === 'jef' &&
  																					<div>
  																							<InputDataList
  																									label={`Dueños`}
  																									name={'impersonatePersonId_owner'}
  																									options={duenos}
  																									value={impersonatePersonId_owner}
  																									height={`medium`}
  																									maxwidth={`mediumshort`}
  																									multiple={true}
  																									className={classes(styles.someBottomMargin, styles.listManage)}
  																									onChange={(value) => changeImpersonateUser('impersonatePersonId_owner', value)}
  																									onEnterKey={handleEnterKey}/>
  
  																					</div>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.lockers && accessRoles.admin &&
  													<Accordion expanded={expanded === 'panel23'} onChange={handleExpansionChange('panel23')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'unlocked0'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Lockers`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<Link to={`/lockerAssignments`} className={styles.menuItem}><L p={p} t={`Locker Assignments`}/></Link>
  																			<Link to={`/assignLocker`} className={styles.menuItem}><L p={p} t={`Add Locker Assignment`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.lunchMenu && companyConfig.urlcode !== 'Manheim' &&
  													<Accordion expanded={expanded === 'panel19'} onChange={handleExpansionChange('panel19')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'hamburger'} premium={true} className={styles.iconHigher}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Lunch Menu`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			{accessRoles.admin &&
  																					<div>
  																							<Link to={`/lunchMenuOptionSetup`} className={styles.menuItem}>
  																									<L p={p} t={`Lunch Menu Option Setup`}/>
  																							</Link>
  																							<Link to={`/lunchMenuMonth`} className={styles.menuItem}>
  																									<L p={p} t={`Lunch Menu Month`}/>
  																							</Link>
  																					</div>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
                        {accessRoles.observer && accessRoles.hasEnrolledStudent && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
                            <div>
      													<div className={styles.linkAloneForCurbside}>
      															<Link to={`/gradeReport/0`} className={classes(styles.link, styles.row)}>
      																	<Icon pathName={'list3'} className={styles.iconHigher} premium={true}/>
      																	<span className={styles.menuHeader}><L p={p} t={`Grade Report`}/></span>
      															</Link>
      													</div>
                                <hr />
                            </div>
  											}
  											{features.messagesAndReminders && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
  													<div className={styles.linkAlone}>
  															<Link to={'/messagesAndReminders'} className={classes(styles.link, styles.row)}>
  																	<Icon pathName={'speaker_loud'} className={styles.iconHigher} premium={true}/>
  																	<span className={styles.menuHeader}><L p={p} t={`Messages and Reminders`}/></span>
  																	<span className={styles.countHeader}>{counts.messagesInbox}</span>
  															</Link>
  													</div>
  											}
                        {features.pickupLane &&
  													<Accordion expanded={expanded === 'panel29'} onChange={handleExpansionChange('panel29')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'car_parked'} premium={true} className={styles.iconHigher}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Pick-up Lane (GPS Location)`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
                                        {(accessRoles.observer || accessRoles.driver) &&
                                            <div>
                                                {pickupLane.myPosition && <div className={styles.boldText}><L p={p} t={`Pick-up Lane (GPS Location)`}/>{`: ${pickupLane.myPosition}`}</div>}
                                                {pickupLane.notes && pickupLane.notes.length > 0 && pickupLane.notes.map((m,i) =>
                                                    <div key={i}>
                                                        <TextDisplay label={<div className={classes(styles.text, styles.row)}>{m.entryPersonName} <DateMoment date={m.entryDate} minusHours={6}/></div>}
                                                            text={m.note}/>
                                                    </div>
                                                )}
                                                {pickupLane.notes && pickupLane.notes.length > 0 && <hr/>}
                                                <div onClick={togglePickupLaneShow} className={styles.menuItem}>
                                                    <L p={p} t={`Show my pick-up lane location`}/>
                                                </div>
                                                <div onClick={togglePickupLaneParked} className={styles.menuItem}>
                                                    <L p={p} t={`Declare out-of-line position`}/>
                                                </div>
                                                <hr/>
                                                <Link to={`/pickupLaneAddDriver`} className={styles.menuItem}>
  																									<L p={p} t={`Add approved driver`}/>
  																							</Link>
                                                <div onClick={() => handlePickupLaneImageOpen(pickupLane.pickupLaneLocationFileUpload)} className={styles.menuItem}>
                                                    <L p={p} t={`Where is the pick-up lane and it's positions?`}/>
                                                </div>
                                            </div>
                                        }
  																			{accessRoles.admin &&
  																					<div>
  																							<Link to={`/pickupLaneAdmin`} className={styles.menuItem}>
  																									<L p={p} t={`See current pick-up lane vehicles`}/>
  																							</Link>
  																							<Link to={`/pickupParkedAdmin`} className={styles.menuItem}>
  																									<L p={p} t={`See declared pick-ups out-of-line`}/>
  																							</Link>
  																					</div>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
  											{features.registration && (accessRoles.admin || (((accessRoles.observer) // && (!registration || !registration.finalizedDate) inside the observer parenthesis
  												 		|| (features.selfServiceStudentSignup && openRegistration && openRegistration.isOpen && (accessRoles.learner || accessRoles.observer))) && !isNewRegistrationFamily)) &&
  
  													<Accordion expanded={expanded === 'panel9'} onChange={handleExpansionChange('panel9')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'clipboard_check'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Registration for `}/>{` ${personConfig.schoolYearRange || ''}`}</span>
  																			<span className={styles.countHeader}> {accessRoles.admin && counts.registrationPending}</span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			{features.selfServiceStudentSignup && openRegistration && openRegistration.isOpen && (accessRoles.learner || accessRoles.observer) &&
  																					<div className={styles.row}>
  																							<Icon pathName={'clock3'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuper} superScriptClass={styles.superScript}/>
  																							<Link to={`/studentBaseCourseRequest/${studentChosenSession || personId}`} className={classes(styles.lessLeft, styles.menuItem, styles.link)}><L p={p} t={`Choose Classes`}/></Link>
  																					</div>
  																			}
  																			{accessRoles.admin &&
  																					<Link to={`/registrationPending`} className={classes(styles.row, styles.menuItem)}>
  																							<L p={p} t={`Registration Pending`}/>
  																							<span className={styles.countHeader}>{counts.registrationPending === 0 ? 0 : (counts.registrationPending || '')}</span>
  																					</Link>
  																			}
  																			{features.courseAssignByAdmin && accessRoles.admin && <hr/>}
  																			{features.courseAssignByAdmin && accessRoles.admin &&
  																					<div>
  																							<div className={styles.menuItem} onClick={() => navigate('/courseAssignByAdminAdd')}>
  																									<L p={p} t={`Assign Courses by Admin`}/>
  																							</div>
  																							<div className={classes(styles.row)} onClick={() => navigate('/courseAssignByAdminList')}>
  																									<div className={styles.menuItem}><L p={p} t={`Courses Assigned by Admin List`}/></div>
  																							</div>
  																					</div>
  																			}
  																			{features.courseAssignByAdmin && accessRoles.admin && <hr/>}
  																			{features.distributeCourseRequests && accessRoles.admin &&
  																					<div className={styles.menuItem} onClick={() => navigate('/distributedCourses')}>
  																							<L p={p} t={`Distribute Course Requests`}/>
  																					</div>
  																			}
  																			{accessRoles.hasEnrolledStudent &&
  																					<div>
                                                {/*<div>
                                                    <hr/>
                                                    <div className={styles.columnFlex}>
                                                        <Link to={`/lunchReducedInstructions`} className={styles.menuItem}>
                                                            <L p={p} t={`Reduced Lunch Application Instructions`}/>
                                                        </Link>
                                                        <Link to={`/lunchReducedApply`} className={styles.menuItem}>
                                                            {counts.lunchReducedApply > 0 ? <L p={p} t={`Review your current reduce lunch application`}/> : <L p={p} t={`Apply for Reduced Lunch`}/>}
                                                        </Link>
                                                    </div>
                                                </div>*/}
  																							{/*<div>
  																									<SelectSingleDropDown
  																											id={`schoolYearId`}
  																											name={`schoolYearId`}
  																											label={<L p={p} t={`School year`}/>}
  																											noBlank={true}
  																											value={schoolYearId || (registration && registration.accreditation && registration.accreditation.schoolYearId) ||  9}
  																											options={[{id: '', label: '- -'}, {id: 9, label: '2018-2019'}, {id: 10, label: '2019-2020'}]}
  																											className={styles.moreBottomMargin}
  																											height={`medium`}
  																											onChange={changeRegYear}
  																											onEnterKey={handleEnterKey}/>
  																							</div>*/}
  																							<RegistrationNav personId={personId} firstName={firstName} registration={registration} accessRoles={accessRoles}
  																									companyConfig={companyConfig} initRegistration={initRegistration} updateRegStudent={updateRegStudent}
  																									removeGuardianContact={removeGuardianContact} updateBillingPreference={updateBillingPreference}
  																									updatePayment={updatePayment} relationTypes={relationTypes} addOrUpdateRelation={addOrUpdateRelation}
  																									removeRegStudent={removeRegStudent} registrationCustodies={registrationCustodies} personConfig={personConfig}
  																									addOrUpdateCustody={addOrUpdateCustody} setRegistrationFinalizedDate={setRegistrationFinalizedDate}
  																									getRegistration={getRegistration} addPreviousStudentThisYear={addPreviousStudentThisYear}
  																									schoolYearId={schoolYearId} schoolYears={schoolYears} showSteps={true} finalizeNonLiahonaRegistration={finalizeNonLiahonaRegistration}/>
  
  																					</div>
  																			}
  																			{features.selfServiceStudentSignup && features.graduationRequirements && (accessRoles.admin || accessRoles.counselor) &&
  																					<div>
  													                    <hr/>
  																							<div className={styles.columnFlex}>
  																									{accessRoles.admin &&
  																											<Link to={`/openRegistration`} className={styles.menuItem}>
  																													<L p={p} t={`Create new open registration`}/>
  																											</Link>
  																									}
  																									<div className={styles.scrollable}>
  																											<OpenRegistrationsList openRegistrations={openRegistrations} removeOpenRegistration={removeOpenRegistration} accessRoles={accessRoles}
  																													personId={personId} companyConfig={companyConfig} resetUserPersonClipboard={resetUserPersonClipboard}
  																													isFetchingRecord={fetchingRecord.openRegistrations}/>
  																									</div>
  																							</div>
  																					</div>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  											{features.safetyAlert && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
  													<Accordion expanded={expanded === 'panel17'} onChange={handleExpansionChange('panel17')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'antennae'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Safety Alert`}/></span>
  																			<span className={styles.countHeader}>{counts.safetyAlerts}</span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<Link to={`/safetyAlertAdd`} className={styles.menuItem}><L p={p} t={`Add Safety Alert`}/></Link>
  																			{accessRoles.admin &&
  																					<Link to={accessRoles.admin ? `/safetyAdminAlerts` : `/safetyAlerts`} className={classes(styles.row, styles.menuItem)}>
  																							<L p={p} t={`Safety Alerts`}/>
  																							<span className={styles.countHeader}>{counts.safetyAlerts === 0 ? 0 : (counts.safetyAlerts || '')}</span>
  																					</Link>
  																			}
  																			<Link to={`/buildingAndFieldFrequentMine`} className={styles.menuItem}><L p={p} t={`My Common, Fast-Pick Locations`}/></Link>
  																			{accessRoles.admin &&
  																					<Link to={`/buildingAndFieldSettings`} className={styles.menuItem}><L p={p} t={`Building and Field Settings`}/></Link>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
                        {accessRoles.observer && accessRoles.hasEnrolledStudent && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
                            <div>
      													<div className={styles.linkAloneForCurbside}>
      															<Link to={`/studentSchedule/${studentPersonId}`} className={classes(styles.link, styles.row)}>
      																	<Icon pathName={'clock3'} className={styles.iconHigher} premium={true}/>
      																	<span className={styles.menuHeader}><L p={p} t={`Student Schedule`}/></span>
      															</Link>
      													</div>
                                <hr />
                            </div>
  											}
  											{(accessRoles.admin || accessRoles.facilitator) && companyConfig.urlcode !== 'Manheim' &&
  													<Accordion expanded={expanded === 'panel4'} onChange={handleExpansionChange('panel4')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'users2'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Students`}/></span>
  																			<span className={styles.countHeader}>{counts.learners}</span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<div className={classes(styles.moreLeft, styles.row)}>
  																					<div className={styles.listPosition}>
  																							<InputDataList
  																									label={<L p={p} t={`Student`}/>}
  																									name={'students'}
  																									options={students}
  																									value={selectedStudent}
  																									multiple={false}
  																									height={`medium`}
  																									className={styles.moreSpace}
  																									onChange={handleSelectedStudent}/>
  																					</div>
  																					<div className={styles.marginLeft}>
  																							<StudentChoiceMenu personId={personId} isAdmin={accessRoles.admin} studentType={student && student.studentType}
  																									personConfig={personConfig} studentPersonId={selectedStudent && selectedStudent.id} companyConfig={companyConfig}
  																									getStudentSchedule={getStudentSchedule} excludeClipboard={true} noBackground={true} students={students}
  																									getRegistrationByStudent={getRegistrationByStudent}/>
  																					</div>
  																			</div>
  																			<Link to={`/learnerSearch`} className={classes(styles.row, styles.menuItem)}>
  																					<L p={p} t={`Search for Students (advanced)`}/>
  																					<span className={styles.countHeader}>{counts.learners}</span>
  																			</Link>
  																			<Link to={`/studentScheduleWeek`} className={classes(styles.row, styles.menuItem)}>
  																					<L p={p} t={`Student Schedule (week view)`}/>
  																			</Link>
  																			{companyConfig.isMcl && accessRoles.mentor &&
  																					<Link to={`/mentorSummaryEdit`} className={styles.menuItem}><L p={p} t={`Enter Mentor Comments`}/></Link>
  																			}
  																			{accessRoles.facilitator &&
  																					<Link to={`/studentAssignmentAssign/0/0`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Assignments Assigned to Students`}/></Link>
  																			}
  				                              {accessRoles.admin &&
  				                                	<Link to={`/studentAddOptions`} className={styles.menuItem}><L p={p} t={`Add Student`}/></Link>
  																			}
  																			{accessRoles.admin && <Link to={`/learnerCourseAssign`} className={styles.menuItem}><L p={p} t={`Assign Courses to Students`}/></Link>}
  				                              {companyConfig.IsMcl && accessRoles.admin &&
  				                                  <Link to={`/mentorsNotAssigned`} className={styles.menuItem}><L p={p} t={`Students Not Assigned a Learning Coach`}/></Link>
  				                              }
  																			{accessRoles.admin &&
  																					<ExcelStudents report={students}/>
  																			}
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  											}
  		                  {features.teachers && accessRoles.admin &&
  												<Accordion expanded={expanded === 'panel5'} onChange={handleExpansionChange('panel5')}>
  														<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																<div className={styles.row}>
  																		<Icon pathName={'lamp_shade'} className={styles.iconHigher} premium={true}/>
  																		<span className={styles.menuHeader}><L p={p} t={`Teachers`}/></span>
  																		<span className={styles.countHeader}>{counts.facilitators}</span>
  																</div>
  														</AccordionSummary>
  														<AccordionDetails>
  																<div>
  																		<Link to={`/userAdd/facilitator`} className={styles.menuItem}><L p={p} t={`Add Teacher`}/></Link>
  		                                <div className={styles.someBottomMargin}>
  		                                    <SelectSingleDropDown
  		                                        id={`facilitatorPersonId`}
  		                                        name={`facilitatorPersonId`}
  		                                        label={<L p={p} t={`Teachers`}/>}
  		                                        value={facilitatorPersonId || ''}
  		                                        options={facilitators}
  		                                        className={styles.listManage}
  		                                        height={`medium`}
  		                                        onChange={changeChoice}
  		                                        onEnterKey={handleEnterKey}/>
  		                                </div>
  																		{companyConfig.urlcode !== 'Manheim' &&
  																				<Link to={`/teacherSchedule/${personId}`} className={styles.menuItem}><L p={p} t={`Teacher's Schedule`}/></Link>
  																		}
  			                              {companyConfig.IsMcl &&
  			                                  <Link to={`/facilitatorMentorSet`} className={styles.menuItem}>{<L p={p} t={`Set Teacher as Learning Coach`}/>}</Link>
  			                              }
  																</div>
  														</AccordionDetails>
  												</Accordion>
  		                  }
  											{features.benchmarkTests && (accessRoles.admin || accessRoles.facilitator) &&
  												<Accordion expanded={expanded === 'panel22'} onChange={handleExpansionChange('panel22')}>
  														<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																<div className={styles.row}>
  																		<Icon pathName={'graph_report'} className={styles.iconHigher} premium={true}/>
  																		<span className={styles.menuHeader}><L p={p} t={`Testing (Benchmark)`}/></span>
  																</div>
  														</AccordionSummary>
  														<AccordionDetails>
  																<div>
  																		<Link to={`/benchmarkTestList`} className={styles.menuItem}><L p={p} t={`Benchmark Tests`}/></Link>
  																		<Link to={`/benchmarkTestClassComparison`} className={styles.menuItem}><L p={p} t={`Class Comparison`}/></Link>
  																		<Link to={`/benchmarkTestStudentComparison`} className={styles.menuItem}><L p={p} t={`Student Comparison`}/></Link>
  																		{/*<Link to={`/testScoreAdd`} className={styles.menuItem}><L p={p} t={`Add test score`}/></Link>
  																		<Link to={`/testGainsReport`} className={styles.menuItem}><L p={p} t={`Gains report`}/></Link>
  	                                  <Link to={`/testCorrelationReport`} className={styles.menuItem}><L p={p} t={`Attendance correlation report`}/></Link>
  																		<hr/>
  																		{accessRoles.admin &&
  																				<div>
  																						<Link to={`/testComponentAssign`} className={classes(styles.row, styles.menuItem)}>
  																								<L p={p} t={`Assign components to tests  (admin)`}/>
  																						</Link>
  																						<Link to={`/testSettings`} className={classes(styles.row, styles.menuItem)}>
  																								<L p={p} t={`Test list  (admin)`}/>
  																						</Link>
  																						<Link to={`/testComponentSettings`} className={classes(styles.row, styles.menuItem)}>
  																								<L p={p} t={`Component list (admin)`}/>
  																						</Link>
  																				</div>
  																		}*/}
  																</div>
  														</AccordionDetails>
  												</Accordion>
  		                  }
  											{features.transcripts && accessRoles.admin &&
  													<Accordion expanded={expanded === 'panel26'} onChange={handleExpansionChange('panel26')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'shield_check'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Transcripts`}/></span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  		                                  <Link to={`/transcripts`} className={styles.menuItem}><L p={p} t={`Student's Transcripts`}/></Link>
  																			<Link to={`/transcriptAdd`} className={styles.menuItem}><L p={p} t={`Add external transcript`}/></Link>
  																			<Link to={`/transcriptTestAdd`} className={styles.menuItem}><L p={p} t={`Add test and scores`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
  		                  {false && companyConfig.isMcl && accessRoles.admin &&
  													<Accordion expanded={expanded === 'panel6'} onChange={handleExpansionChange('panel6')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'group_work'} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Learning Coaches`}/></span>
  																			<span className={styles.countHeader}>{counts.mentors}</span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<Link to={`/userAdd/mentor`} className={styles.menuItem}><L p={p} t={`Add Learning Coach`}/></Link>
  		                                  <div className={styles.row}>
  		                                      <div>
  		                                          <SelectSingleDropDown
  		                                              id={`mentorPersonId`}
  		                                              name={`mentorPersonId`}
  		                                              label={<L p={p} t={`Update Learning Coach`}/>}
  		                                              value={mentorPersonId || ''}
  		                                              options={mentors}
  		                                              className={styles.listManage}
  		                                              height={`medium`}
  		                                              onChange={changeChoice}
  		                                              onEnterKey={handleEnterKey}/>
  		                                      </div>
  		                                      <a onClick={mentorPersonId ? sendToMentorUpdate : () => {}} className={classes(styles.menuItem, styles.listButton, styles.noWrap)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>
  		                                      <a onClick={mentorPersonId ? handleRemoveMentorOpen : () => {}} className={classes(styles.menuItem, styles.listButton, styles.noWrap)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>
  		                                  </div>
  		                                  <Link to={`/mentorsNotAssigned`} className={styles.menuItem}><L p={p} t={`Students Not Assigned a Learning Coach`}/></Link>
  		                                  <Link to={`/mentorsReassign`} className={styles.menuItem}>{<L p={p} t={`Reassign Learning Coaches to Students`}/>}</Link>
  		                                  <Link to={`/facilitatorMentorSet`} className={styles.menuItem}>{companyConfig.isMcl ? `Set Teacher as Learning Coach` : `Set Teacher as Learning Coach`}</Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
  											{/*accessRoles.observer && companyConfig.urlcode !== 'Manheim' &&
  													<Accordion expanded={expanded === 'panel16'} onChange={handleExpansionChange('panel16')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'share'} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Parent/Teacher Schedule`}/></span>
  																			<span className={styles.countHeader}> {counts.parentTeacherSchedule}</span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  															</AccordionDetails>
  													</Accordion>
  											*/}
  											{companyConfig.urlcode === 'Manheim' && features.graduationRequirements && (accessRoles.admin || accessRoles.counselor) &&
  												<Accordion expanded={expanded === 'panel10'} onChange={handleExpansionChange('panel10')}>
  														<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																<div className={styles.row}>
  																		<Icon pathName={'register'} premium={true} className={styles.iconHigher}/>
  																		<span className={styles.menuHeader}><L p={p} t={`Open Registrations`}/></span>
  																		<span className={styles.countHeader}>{counts.openRegistrations}</span>
  																</div>
  														</AccordionSummary>
  														<AccordionDetails>
  																<div className={styles.columnFlex}>
  																		{accessRoles.admin &&
  																				<Link to={`/openRegistration`} className={styles.menuItem}>
  																						<L p={p} t={`Create new open registration`}/>
  																				</Link>
  																		}
  																		<br />
  																		<div className={styles.scrollable}>
  																				<OpenRegistrationsList openRegistrations={openRegistrations} removeOpenRegistration={removeOpenRegistration} accessRoles={accessRoles}
  																						personId={personId} companyConfig={companyConfig} resetUserPersonClipboard={resetUserPersonClipboard}
  																						isFetchingRecord={fetchingRecord.openRegistrations}/>
  																		</div>
  																</div>
  														</AccordionDetails>
  												</Accordion>
  		                  }
  											{false && companyConfig.urlcode === 'Manheim' && (accessRoles.admin || accessRoles.counselor) &&
  												<Accordion expanded={expanded === 'panel11'} onChange={handleExpansionChange('panel11')} className={styles.bgcolor}>
  														<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																<div className={styles.row}>
  																		<Icon pathName={'clipboard_text'} premium={true}/>
  																		<span className={styles.menuHeader}><L p={p} t={`Clipboard - Students`}/></span>
  																		<span className={styles.countHeader}>{counts.clipboardStudents}</span>
  																</div>
  														</AccordionSummary>
  														<AccordionDetails>
  																<div className={styles.columnFlex}>
  																		<div className={classes(styles.row, styles.littleLeft, styles.littleTop)}>
  																				<div className={styles.countText}>{`Count: ${clipboardStudents.length}`}</div>
  																				<a onClick={() => removeAllUserPersonClipboard(personId, 'STUDENT', getCountsMainMenu(personId))} className={classes(styles.row, styles.link)}>
  																						<Icon pathName={'cross_circle'} premium={true} className={styles.iconSmall}/>Clear clipboard
  																				</a>
  																				<a onClick={() => navigate('/learnerSearch')} className={classes(styles.row, styles.link, styles.muchLeft)}>
  																						<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
  																						{clipboardStudents && clipboardStudents.length > 0 ? <L p={p} t={`Choose more students`}/> : <L p={p} t={`Choose students`}/>}
  																				</a>
  																		</div>
  																		<div className={styles.scrollable}>
  																				<hr className={styles.gray}/>
  																				<StudentListTable students={clipboardStudents} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
  																						setStudentsSelected={setStudentsSelected} getStudentSchedule={props.getStudentSchedule}
  																						personId={personId} studentAssignmentsInit={studentAssignmentsInit} studentSchedule={studentSchedule}
  																						emptyMessage={'No students chosen'} includeRemoveClipboardIcon={true}
  																						singleRemoveFromClipboard={handleRemoveSingleStudentClipboard}
  																						resetUserPersonClipboard={resetUserPersonClipboard}/>
  																		</div>
  																		<div className={classes(styles.row, styles.moreLeft)}>
  																				{features.graduationRequirements &&
  																						<div onClick={() => { navigate('/openRegistration'); setChosenClipboardOption('openRegistration');}}
  																										className={classes(styles.tabs, (chosenClipboardOption === 'openRegistration' && styles.tabChoice))}>
  																								<Icon pathName={'sent'} premium={true} />
  																								<div><L p={p} t={`Add open registration`}/></div>
  																						</div>
  																				}
  																				<div onClick={() => {navigate('/learnerCourseAssign'); setChosenClipboardOption('assignCourses');}}
  																								className={classes(styles.tabs, (chosenClipboardOption === 'assignCourses' && styles.tabChoice))}>
  																						<Icon pathName={'presentation'} premium={true} />
  																						{features.graduationRequirements
  																								? <div><L p={p} t={`Go to Recommend Courses`}/></div>
  																								: <div><L p={p} t={`Go to Assign Courses`}/></div>
  																						}
  																				</div>
  															      </div>
  																</div>
  														</AccordionDetails>
  												</Accordion>
  		                  }
  											{false && companyConfig.urlcode === 'Manheim' && (accessRoles.admin || accessRoles.counselor) &&
  												<Accordion expanded={expanded === 'panel12'} onChange={handleExpansionChange('panel12')} className={styles.bgcolor}>
  														<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																<div className={styles.row}>
  																		<Icon pathName={'clipboard_text'} premium={true}/>
  																		<span className={styles.menuHeader}><L p={p} t={`Clipboard - Courses`}/></span>
  																		<span className={styles.countHeader}>{counts.clipboardCourses}</span>
  																</div>
  														</AccordionSummary>
  														<AccordionDetails>
  																<div className={styles.columnFlex}>
  																		<div className={classes(styles.row, styles.littleLeft, styles.littleTop)}>
  																				<div className={styles.countText}>{`Count: ${clipboardCourses.length}`}</div>
  																				<a onClick={() => removeAllCourseClipboard(personId, courseClipboard && courseClipboard.courseListType)} className={classes(styles.row, styles.link)}>
  																						<Icon pathName={'cross_circle'} premium={true} className={styles.iconSmall}/><L p={p} t={`Clear clipboard`}/>
  																				</a>
  																				<a onClick={() => navigate((courseClipboard && (courseClipboard.courseListType === 'CourseEntry' || features.graduationRequirements))
  																								? '/baseCourses'
  																								: 'scheduledCourses')} className={classes(styles.row, styles.link, styles.muchLeft)}>
  																						<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
  																						{clipboardCourses && clipboardCourses.length > 0 ? <L p={p} t={`Choose more courses`}/> : <L p={p} t={`Choose courses`}/>}
  																				</a>
  																		</div>
  																		<div className={styles.scrollable}>
  																				<hr className={styles.gray}/>
  																				<CourseListTable courses={clipboardCourses} companyConfig={companyConfig} shortVersion={true}
  																						courseListType={courseClipboard && courseClipboard.courseListType} personId={personId} emptyMessage={<L p={p} t={`No courses chosen`}/>}
  																						includeRemoveClipboardIcon={true} singleRemoveFromClipboard={handleRemoveSingleCourseClipboard}
  																						resetUserPersonClipboard={resetUserPersonClipboard} isFetchingRecord={isFetchingRecord}/>
  																		</div>
  																		<div className={classes(styles.row, styles.moreLeft)}>
  																				<div onClick={() => {navigate('/learnerCourseAssign'); setChosenClipboardOption('assignCourses');}}
  																								className={classes(styles.tabs, (chosenClipboardOption === 'assignCourses' && styles.tabChoice))}>
  																						<Icon pathName={'presentation'} premium={true} />
  																						{features.graduationRequirements
  																								? <div><L p={p} t={`Go to Recommend Courses`}/></div>
  																								: <div><L p={p} t={`Go to Assign Courses`}/></div>
  																						}
  																				</div>
  																				<div onClick={() => {navigate('/announcementEdit'); setChosenClipboardOption('sendMessage');}}
  																								className={classes(styles.tabs, (chosenClipboardOption === 'sendMessage' && styles.tabChoice))}>
  																						<Icon pathName={'speaker_loud'} premium={true} />
  																						<div><L p={p} t={`Go to Compose Message`}/></div>
  																				</div>
  															      </div>
  																</div>
  														</AccordionDetails>
  												</Accordion>
  		                  }
  											{features.teachers && accessRoles.facilitator && companyConfig.urlcode !== 'Manheim' &&
  													<div className={styles.linkAlone}>
  															<Link to={`/teacherSchedule/${personId}`} className={classes(styles.link, styles.row)}>
  																	<Icon pathName={'clock3'} premium={true} className={styles.iconHigher}/>
  																	<span className={styles.menuHeader}>Teaching Schedule</span>
  															</Link>
  													</div>
  											}
  											{features.volunteerHours && companyConfig.urlcode !== 'Manheim' && !isNewRegistrationFamily &&
  													<Accordion expanded={expanded === 'panel18'} onChange={handleExpansionChange('panel18')}>
  															<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																	<div className={styles.row}>
  																			<Icon pathName={'thumbs_up0'} className={styles.iconHigher} premium={true}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Volunteer Hours`}/></span>
  																			<span className={styles.countHeader}>{counts.volunteerCheckInOrOuts}</span>
  																	</div>
  															</AccordionSummary>
  															<AccordionDetails>
  																	<div>
  																			<VolunteerHoursPending volunteerEvents={volunteerEvents} personId={personId} removeVolunteerHours={removeVolunteerHours}
  																					getVolunteerEvents={getVolunteerEvents} isFetchingRecord={fetchingRecord.volunteerEvents}/>
  																			<Link to={accessRoles.admin ? `/volunteerHours` : `/volunteerCheckInOut`} className={classes(styles.row, styles.menuItem)}>
  																					{accessRoles.admin && <L p={p} t={`Confirm `}/>} <L p={p} t={`Check-in or Check-out`}/>
  																			</Link>
  																			<Link to={`/volunteerOpportunities`} className={classes(styles.row, styles.menuItem)}>
  																					<L p={p} t={`Opportunities`}/>
  																					<span className={styles.countHeader}>{counts.volunteerOpportunities}</span>
  																			</Link>
  																			{accessRoles.admin &&
  																					<Link to={`/volunteerOpportunityAdd`} className={styles.menuItem}><L p={p} t={`Add Another Opportunity`}/></Link>
  																			}
  																			<Link to={`/volunteerHours`} className={styles.menuItem}><L p={p} t={`Volunteer Hours`}/></Link>
  																	</div>
  															</AccordionDetails>
  													</Accordion>
  		                  }
  											{features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor) &&
  												<Accordion expanded={expanded === 'panel13'} onChange={handleExpansionChange('panel13')} className={styles.bgcolor}>
  														<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  																<div className={styles.row}>
  																		<Icon pathName={'pushpin'} premium={true} className={styles.iconHigher}/>
  																		<span className={styles.menuHeader}><L p={p} t={`Courses Recommended to Students`}/></span>
  																		<span className={styles.countHeader}>{counts.courseRecommendations}</span>
  																</div>
  														</AccordionSummary>
  														<AccordionDetails>
  																<div className={styles.columnFlex}>
  																		{features.turnOnCourseRecommendation &&
                                          <a onClick={() => navigate('/learnerCourseAssign')} className={classes(styles.row, styles.link, styles.moreLeft)}>
  																						<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
  																						<L p={p} t={`Add new recommended course to student`}/>
  																				</a>
  																		}
  																		{!features.turnOnCourseRecommendation &&
  																				<div>
  																						<div className={styles.expired}><L p={p} t={`The time to recommend courses to students has expired`}/></div>
  																				</div>
  																		}
  																		<div className={classes(styles.scrollable, styles.moreTop)}>
  																				<CourseRecommendation personId={personId} recommendations={courseRecommendations} emptyMessage={<L p={p} t={`No recommendations found`}/>}
  																						removeCourseRecommendation={removeCourseRecommendation} baseCourses={courseEntries} showStudentName={true}
  																						students={students} byType={accessRoles.facilitator ? 'Teacher' : 'Student'} isFetchingRecord={fetchingRecord.courseRecommendations}/>
  																		</div>
  																		{courseRecommendations && courseRecommendations.filter(m => m.responseType !== 'Removed').length > 0 &&
  																				<div className={styles.topSpace}>
  																						<a onClick={handleAllRemoveRecommendationOpen} className={classes(styles.row, styles.link, styles.red)}>
  																								<Icon pathName={'cross_circle'} premium={true} className={styles.iconSmall}/><L p={p} t={`Remove all recommendations`}/>
  																						</a>
  																				</div>
  																		}
  																</div>
  														</AccordionDetails>
  												</Accordion>
  		                  }
  											{features.selfServiceStudentSignup && features.graduationRequirements && (accessRoles.admin || accessRoles.counselor) &&
  									        <Accordion expanded={expanded === 'panel1b'} onChange={handleExpansionChange('panel1b')}>
  										          <AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  											            <div className={styles.row}>
  																			<Icon pathName={'clipboard_check'} premium={true} className={styles.iconHigher}/>
  																			<span className={styles.menuHeader}><L p={p} t={`Reports`}/></span>
  																	</div>
  										          </AccordionSummary>
  										          <AccordionDetails>
  																	<div>
                                        <Link to={`/regSelfServiceCourseCount`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Student Course Signup Count`}/></Link>
  																			<Link to={`/reportRecommendCourse`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Course Recommendation`}/></Link>
  																			<Link to={`/reportWaitList`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Course Wait List`}/></Link>
  																			<Link to={`/learnerSearch`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Student Last Login`}/></Link>
  																			<Link to={`/reportStudentRegistration`} className={classes(styles.row, styles.menuItem)}>{`Student Registration in Progress`}</Link>
  																			{/*<Link to={`/courseNewRequested`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Students Requesting New Section`}/></Link>*/}
  																			<div className={styles.row}>
  																					<div>
  																							<SelectSingleDropDown
  																									id={`studentSchedule_personId`}
  																									name={`studentSchedule_personId`}
  																									label={<div className={styles.row}><L p={p} t={`Student schedule`}/> {personConfig.schoolYearRange}</div>}
  																									value={studentSchedule_personId || studentChosenSession || ''}
  																									options={students}
  																									className={styles.listManage}
  																									height={`medium`}
  																									onChange={changeChoice}
  																									onEnterKey={handleEnterKey}/>
  																					</div>
  																					<div className={styles.lowHeight}>
  																							<Button label={'Go >'} onClick={sendToScheduleFinalized}/>
  																					</div>
  																			</div>
  																			<Link to={`/studentScheduleFinalize`} className={classes(styles.row, styles.menuItem)}><L p={p} t={`Multiple students' schedules`}/> {personConfig.schoolYearRange || ''}</Link>
  											            </div>
  										          </AccordionDetails>
  													</Accordion>
  											}
                        {companyConfig.urlcode === 'Manheim' && accessRoles.admin &&
                            <div className={styles.linkAlone}>
                                <Link to={'/studentAddManual'} className={classes(styles.link, styles.row, styles.moreTop)}>
                                    <Icon pathName={'user_plus0'} className={styles.iconHigher} premium={true}/>
                                    <span className={styles.menuHeader}><L p={p} t={`Add a New Student`}/></span>
                                </Link>
                            </div>
                        }
  											{companyConfig.urlcode === 'Manheim' && features.selfServiceStudentSignup && accessRoles.learner &&
  													<div>
  															<div className={classes(styles.row, styles.moreLeft)}>
  																	<Icon pathName={'clock3'} premium={true} className={styles.iconCourse}/>
  																	<Link to={`/studentCourseAssign`} className={classes(styles.lessLeft, styles.menuItem, styles.link)}><L p={p} t={`Choose Classes`}/></Link>
  															</div>
  															<div className={styles.moreTop}>
  																	<ManheimStudentSchedule studentSchedule={studentSchedule} removeStudentCourseAssign={removeStudentCourseAssign}
  																			personId={personId} schoolYearId={schoolYearId || 10} openRegistration={openRegistration} me={me}
  																			fetchingRecord={fetchingRecord} />
  																	{courseRecommendations && courseRecommendations.length > 0 &&
  																			<div className={classes(styles.backgroundRecommend, styles.moreTop)}>
  																					<div className={styles.header}><L p={p} t={`Course Recommendations`}/></div>
  																					<CourseRecommendation personId={personId} recommendations={courseRecommendations} emptyMessage={<L p={p} t={`No recommendations found`}/>}
  																							removeCourseRecommendation={removeCourseRecommendation} baseCourses={courseEntries} isFetchingRecord={fetchingRecord.courseRecommendations}
  																							byType={accessRoles.facilitator ? 'Teacher' : 'Student'} setNameFilter={setNameFilter}
  																							setStudentCourseAssignNameSearch={setStudentCourseAssignNameSearch} />
  																			</div>
  																	}
  															</div>
  													</div>
  											}
  											{features.registration && accessRoles.observer && !accessRoles.hasEnrolledStudent &&
  													<RegistrationNav personId={personId} firstName={firstName} registration={registration} accessRoles={accessRoles} showSteps={true}
  															companyConfig={companyConfig} initRegistration={initRegistration} updateRegStudent={updateRegStudent} schoolYearId={personConfig.schoolYearId}
  															removeGuardianContact={removeGuardianContact} updateBillingPreference={updateBillingPreference} schoolYears={schoolYears}
  															updatePayment={updatePayment} relationTypes={relationTypes} addOrUpdateRelation={addOrUpdateRelation}
  															removeRegStudent={removeRegStudent} registrationCustodies={registrationCustodies} personConfig={personConfig}
  															addOrUpdateCustody={addOrUpdateCustody} addPreviousStudentThisYear={addPreviousStudentThisYear}/>
  											}
  											{features.teachers && features.courses && ((!accessRoles.admin && (accessRoles.facilitator || (accessRoles.observer && students && students.length > 0))) || ((accessRoles.admin || accessRoles.counselor) && features.graduationRequirements)) &&
  													<div>
  															{accessRoles.facilitator && companyConfig.urlcode !== 'Manheim' &&
  																	<div className={styles.linkAlone}>
  																			<Link to={`/assignmentsPendingReview`} className={classes(styles.row, styles.link)}>
  																					<Icon pathName={'inbox0'} premium={true} className={styles.iconHigher}/>
  																					<span className={styles.menuHeader}><L p={p} t={`Assignments Waiting for Review`}/></span>
  																					<div className={styles.countHeader}>{counts.teacherAssignmentsPendingReview}</div>
  																			</Link>
  																	</div>
  															}
  															{/*accessRoles.facilitator && companyConfig.urlcode !== 'Manheim' &&
  																	<div className={styles.linkAlone}>
  																			<Link to={`/assessmentPendingEssay`} className={classes(styles.row, styles.link)}>
  																					<Icon pathName={'pencil0'} premium={true} className={styles.iconHigher}/>
  																					<span className={styles.menuHeader}><L p={p} t={`Tests Waiting for Essay Response`}/></span>
  																					<div className={styles.countHeader}>{counts.teacherAssessmentPendingEssays}</div>
  																			</Link>
  																	</div>
  															*/}
  													</div>
  											}
  											<hr/>
  										</div>
  										//End of if this is a new registration - show nothing but the RegistrationNav
  									}
  									{accessRoles.doctor &&
  											<div>
  													<hr/>
  													<div className={styles.linkAlone}>
  															<Link to={`/doctorNoteAdd`} className={classes(styles.row, styles.link)}>
  																	<Icon pathName={'pencil0'} premium={true} className={styles.iconDoctor}/>
  																	<span className={classes(styles.menuHeader, styles.bold)}><L p={p} t={`Add a doctor's note`}/></span>
  															</Link>
  													</div>
  													<div className={styles.linkAlone}>
  															<Link to={`/doctorNotes`} className={classes(styles.row, styles.link)}>
  																	<Icon pathName={'list3'} premium={true} className={styles.iconDoctor}/>
  																	<span className={classes(styles.menuHeader, styles.bold)}><L p={p} t={`Doctors' notes`}/></span>
  															</Link>
  													</div>
  													<div className={styles.linkAlone}>
  															<Link to={`/doctorNoteInviteList`} className={classes(styles.row, styles.link)}>
  																	<Icon pathName={'inbox0'} premium={true} className={styles.iconDoctor}/>
  																	<span className={classes(styles.menuHeader, styles.bold)}><L p={p} t={`Doctor note invites pending`}/></span>
  																	<div className={classes(styles.countSubmenu, styles.littleHigher)}>
  																			{counts.doctorNoteInvitesPending || '0'}
  																	</div>
  															</Link>
  													</div>
  													<hr/>
  											</div>
  									}
  									{accessRoles.admin && companyConfig.urlcode !== 'Manheim' &&
  											<div className={styles.linkAlone}>
  													<Link to={`/schoolSettings`} className={classes(styles.row, styles.link)}>
  															<Icon pathName={'cog'} premium={true} className={styles.iconHigher}/>
  															<div className={styles.menuHeader}><L p={p} t={`School Settings`}/></div>
  													</Link>
  											</div>
  									}
  									{accessRoles.admin && <hr />}
                    <div className={styles.linkAlone}>
                        <a onClick={resetCache} className={classes(styles.row, styles.link)}>
                            <Icon pathName={'database'} premium={true} className={styles.iconHigher}/>
                            <div className={styles.menuHeader}><L p={p} t={`Reset Cache`}/></div>
                        </a>
                    </div>
  									{companyConfig.urlcode !== 'Manheim' &&
  											<div className={styles.linkAlone}>
  													<Link to={`/myProfile`} className={classes(styles.row, styles.link)}>
  															<Icon pathName={'portrait'} premium={true} className={styles.iconHigher}/>
  															<div className={styles.menuHeader}><L p={p} t={`My Profile`}/></div>
  													</Link>
  											</div>
  									}
  									<div className={styles.linkAlone}>
  											<Link to={`/logout`} className={classes(styles.row, styles.link)}>
  													<Icon pathName={'stop_circle'} premium={true} className={styles.iconHigher}/>
  													<div className={styles.menuHeader}><L p={p} t={`Logout`}/></div>
  											</Link>
  									</div>
  									{false && !accessRoles.doctor && <hr/>}
  									{false && !accessRoles.doctor && companyConfig.urlcode !== 'Manheim' &&
  											<Link to={`/tutorialVideos`} className={styles.link}>
  													<div className={styles.menuHeader}><L p={p} t={`See tutorial videos`}/></div>
  											</Link>
  									}
  									<hr/>
                    {me.username === 'jef' &&
  											<div>
  													<Link to={`/carContactManager`} className={styles.menuItem}>{`Car Contact Manager`}</Link>
  											</div>
  									}
  									{me.username === 'jef' &&
  											<div>
  													<Link to={`/schoolContactManager`} className={styles.menuItem}>{`School Contact Manager`}</Link>
  											</div>
  									}
  									{me.username === 'jef' &&
  											<Link to={'/createNewSchool'} className={styles.menuItem}>
  													Create New School
  											</Link>
  									}
  									{me.username === 'jef' &&
  											<Link to={'/geolocation'} className={styles.menuItem}>
  													Geo Location
  											</Link>
  									}
  									<MediaQuery maxWidth={700}>
  		                  {(matches) => {
  			                    return matches ? <OneFJefFooter/> : null
  											}}
                  	</MediaQuery>
  									<br/>
  									<br/>
                  {isShowingModal_nav &&
                      <ScheduleModal onClick={handleScheduleClose} heading={``} explain={``} slotInfo={slotInfo} events={calendarEvents}
                          removeCalendarEvent={removeCalendarEvent} personId={personId} calendarViewRange={calendarViewRange}
                          calendarTargetDate={calendarTargetDate} companyConfig={companyConfig} />
                  }
                  {isShowingModal_event &&
                      <CalendarEventModal onClick={handleEventClose} heading={``} explain={``} chosenEvent={chosenEvent} events={calendarEvents}
                          removeCalendarEvent={removeCalendarEvent} personId={personId} calendarViewRange={calendarViewRange}
                          calendarTargetDate={calendarTargetDate} />
                  }
                  {isShowingModal_removeLearner &&
                      <MessageModal handleClose={handleRemoveLearnerClose} heading={<L p={p} t={`Remove this Student?`}/>}
                         explainJSX={<L p={p} t={`Are you sure you want to remove this student?`}/>} isConfirmType={true}
                         onClick={() => {removeLearner(personId, studentPersonId); handleRemoveLearnerClose();}} />
                  }
                  {isShowingModal_removeMentor &&
                       <MessageModal handleClose={handleRemoveMentorClose} heading={<L p={p} t={`Remove this Learning Coach?`}/>}
                          explainJSX={<L p={p} t={`Are you sure you want to remove this Learning Coach?`}/>} isConfirmType={true}
                          onClick={() => {removeMentor(personId, mentorPersonId); handleRemoveMentorClose();}} />
                  }
                  {isShowingModal_removeCourse &&
                       <MessageModal handleClose={handleRemoveCourseClose} heading={<L p={p} t={`Remove this Course?`}/>}
                          explainJSX={<L p={p} t={`Are you sure you want to remove this course?`}/>} isConfirmType={true}
                          onClick={() => {removeCourse(personId, courseEntryId); handleRemoveCourseClose();}} />
                  }
                  {isShowingModal_removeAssessment &&
                       <MessageModal handleClose={handleRemoveAssessmentClose} heading={<L p={p} t={`Remove this Assessment?`}/>}
                          explainJSX={<L p={p} t={`Are you sure you want to remove this assessment?`}/>} isConfirmType={true}
                          onClick={() => {removeAssessment(personId, assessmentId); handleRemoveAssessmentClose();}} />
                  }
  								{isShowingModal_removeRecommendations &&
  		                <MessageModal handleClose={handleAllRemoveRecommendationClose} heading={<L p={p} t={`Remove all your Recommendations?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to remove all of your recommendation?`}/>}  isConfirmType={true}
  											 onClick={handleAllRemoveRecommendation} />
  		            }
  								{isShowingModal_expiredRecommendations &&
  		                <MessageModal handleClose={handleExpiredRecommendCourseClose} heading={<L p={p} t={`Expired:  Add new Recommendations`}/>}
  		                   explainJSX={<L p={p} t={`The open time to add new recommendations has expired.`}/>}
  											 onClick={handleExpiredRecommendCourseClose} />
  		            }
                  {isShowingModal_document &&
      								<div className={styles.fullWidth}>
      										{<DocumentViewOnlyModal handleClose={handlePickupLaneImageClose} showTitle={true}
      												companyConfig={companyConfig} accessRoles={accessRoles} fileUpload={pickupLaneFileUpload} isSubmitType={false} />}
      								</div>
      						}
                  {showModal_registrationMessage &&
  		                <MessageModal handleClose={handleRegistrationMessageClose} heading={<L p={p} t={`Registration 2021-2022`}/>}
  		                   explainJSX={<L p={p} t={`The school year for your session has been changed to 2020-2021.  Please scroll down on the main menu where you will find the registration section.`}/>}
  											 onClick={handleRegistrationMessageClose} />
  		            }
              </div>
          )
}

export default withAlert(FirstNavView)

//<a onClick={() => jefSendEmails(personId)}>[]</a>
