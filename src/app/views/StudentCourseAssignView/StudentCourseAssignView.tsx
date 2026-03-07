import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './StudentCourseAssignView.css'
const p = 'StudentCourseAssignView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import StudentListModal from '../../components/StudentListModal'
import DateMoment from '../../components/DateMoment'
import TextDisplay from '../../components/TextDisplay'
import Loading from '../../components/Loading'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import ManheimStudentSchedule from '../../components/ManheimStudentSchedule'
import CourseAssignFilter from '../../components/CourseAssignFilter'
import GradRequirementAccordion from '../../components/GradRequirementAccordion'
import Paper from '@mui/material/Paper'
import TableVirtualFast from '../../components/TableVirtualFast'
import classes from 'classnames'
import {doSort} from '../../utils/sort'
import {withAlert} from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'

function StudentCourseAssignView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isScheduledCourseContextOpen, setIsScheduledCourseContextOpen] = useState(false)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_message, setIsShowingModal_message] = useState(false)
  const [isShowingModal_students, setIsShowingModal_students] = useState(false)
  const [isShowingModal_notOpen, setIsShowingModal_notOpen] = useState(false)
  const [isShowingModal_doubledUp, setIsShowingModal_doubledUp] = useState(false)
  const [isShowingModal_finalize, setIsShowingModal_finalize] = useState(false)
  const [isShowingModal_lackingCredits, setIsShowingModal_lackingCredits] = useState(false)
  const [isShowingModal_description, setIsShowingModal_description] = useState(false)
  const [isShowingModal_prerequisite, setIsShowingModal_prerequisite] = useState(false)
  const [isShowingModal_tooManyCredits, setIsShowingModal_tooManyCredits] = useState(false)
  const [isShowingModal_sameMPAndBlock, setIsShowingModal_sameMPAndBlock] = useState(false)
  const [outcomeList, setOutcomeList] = useState([])
  const [actionType, setActionType] = useState('')
  const [partialNameText, setPartialNameText] = useState('')
  const [filterIntervalId, setFilterIntervalId] = useState('')
  const [learningPathwayId, setLearningPathwayId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [classPeriodId, setClassPeriodId] = useState('')
  const [facilitatorName, setFacilitatorName] = useState('')
  const [showAlertsOnly, setShowAlertsOnly] = useState(false)
  const [showOpenCoursesOnly, setShowOpenCoursesOnly] = useState(false)
  const [onlineOrTraditionalOnly, setOnlineOrTraditionalOnly] = useState('all')
  const [sortByHeadings, setSortByHeadings] = useState({
							sortField: '',
							isAsc: '',
							isNumber: ''
					})
  const [sortField, setSortField] = useState('')
  const [isAsc, setIsAsc] = useState('')
  const [isNumber, setIsNumber] = useState('')
  const [studentPersonId, setStudentPersonId] = useState(props.accessRoles.learner ? props.personId : props.params && props.params.studentPersonId ? props.params.studentPersonId : '')
  const [courseName, setCourseName] = useState('')
  const [description, setDescription] = useState('')
  const [timerId, setTimerId] = useState(undefined)
  const [scrollTop, setScrollTop] = useState(undefined)
  const [courseEntryId, setCourseEntryId] = useState(undefined)
  const [course, setCourse] = useState(undefined)
  const [isShowingModal_hasError, setIsShowingModal_hasError] = useState(undefined)
  const [prerequisiteMessage, setPrerequisiteMessage] = useState(undefined)
  const [isShowingModal_alertLimit, setIsShowingModal_alertLimit] = useState(undefined)
  const [isShowingModal_alertBelowCredit, setIsShowingModal_alertBelowCredit] = useState(undefined)
  const [isShowingModal_onlineClass, setIsShowingModal_onlineClass] = useState(undefined)

  useEffect(() => {
    
    				const {personId, getCoursesSeatsStatistics} = props
    				//document.body.addEventListener('keyup', checkEscapeKey);
    				setPersonConfig()
    				//window.addEventListener('scroll', scrollData, false);
    				setTimerId(setInterval(() => getCoursesSeatsStatistics(personId), 10000))
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				if (props.partialNameText) {
    						//Take the partialNameText from the courseRecommendation which is on a different page.  Clear out all other filters.
    						setPartialNameText(props.partialNameText); setFilterIntervalId(''); setDepartmentId(''); setLearningPathwayId(''); setClassPeriodId(''); setFacilitatorName(''); setShowAlertsOnly(false); setShowOpenCoursesOnly(false); setOnlineOrTraditionalOnly('all')
    						props.clearStudentCourseAssignNameSearch()
    				}
    		
  }, [])

  const setNameFilter = (partialNameText) => {
    
    				clearFilters()
    				setPartialNameText(partialNameText)
    		
  }

  const finalizeRegistration = () => {
    
            if (hasErrors()) {
                handleHasErrorOpen(hasErrors())
            } else if (hasCompleteCredits() && !hasErrors()) { //!hasDoubledUpChoices() &&
    						handleFinalizeOpen()
    				} else if (!hasCompleteCredits()) {
    						handleLackingCreditsOpen()
    				} else if (hasDoubledUpChoices()) {
    						handleDoubledUpChoicesOpen()
    				}
    		
  }

  const baseCreditCount = () => {
    
    				const {studentSchedule} = props
    				// let currIntervalId = 0;
    				// let currClassPeriodName = 0;
    				//let accumCredits = 0;
    				let totalCredits = 0
    
    				studentSchedule && studentSchedule.length > 0 && studentSchedule.forEach(m => {
    						if (m.classPeriodName !== "5") {
    								totalCredits += m.credits || 0
    						}
    				})
    				return totalCredits ? totalCredits : 0
    		
  }

  const extraCreditCount = () => {
    
    				const {studentSchedule} = props
    				let totalCredits = 0
    
    				studentSchedule && studentSchedule.length > 0 && studentSchedule.forEach(m => {
    						if (m.classPeriodName === '5') {
    							   totalCredits += m.intervals && m.intervals.length > 0 && m.intervals[0].intervalId === '64de48c1-bdc8-422b-875b-fca6f3504b11' ? m.credits / 2 : m.credits
    						}
    				})
    				return totalCredits ? totalCredits : 0
    		
  }

  const hasCompleteCredits = () => {
    
    				return baseCreditCount() === 8 && extraCreditCount() <= 2
    		
  }

  const hasDoubledUpChoices = () => {
    
    				const {studentSchedule} = props
    				let currIntervalId = 0
    				let currClassPeriodName = 0
    				let accumCredits = 0
    				let doubledUpCredits = false
    
    				studentSchedule && studentSchedule.length > 0 && studentSchedule.forEach(m => {
    						if (currIntervalId !== (m.intervals && m.intervals.length > 0 && m.intervals[0].intervalId) || currClassPeriodName !== m.classPeriodName)
    						{
    						   if (accumCredits > 1) doubledUpCredits = true
    						   accumCredits = 0
    						}
    						accumCredits += m.intervals && m.intervals.length > 0 && m.intervals[0].intervalId === '64de48c1-bdc8-422b-875b-fca6f3504b11' ? m.credits / 2 : m.credits
    						currIntervalId = m.intervals && m.intervals.length > 0 && m.intervals[0].intervalId
    						currClassPeriodName = m.classPeriodName
    				})
    				return doubledUpCredits
    		
  }

  const toggleShowOpenCoursesOnly = () => {
    
    				setShowOpenCoursesOnly(!showOpenCoursesOnly)
    		
  }

  const handleRadio = (field, value) => {
    
    				let newState = Object.assign({}, state)
    				newState[field] = value
    				setState(newState)
    		
  }

  const toggleShowAlertsOnly = () => {
    
    				setShowAlertsOnly(!showAlertsOnly)
    		
  }

  const setPersonConfig = () => {
    
    				// const {personConfig} = props;
    				// setState({
    				// 		partialNameText: personConfig.courseSearch_partialNameText,
    				// 		facilitatorName: personConfig.courseSearch_facilitatorName,
    				// 		classPeriodId: personConfig.courseSearch_classPeriodId,
    				// 		learningPathwayId: personConfig.courseSearch_learningPathwayId,
    				// 		intervalId: personConfig.courseSearch_intervalId,
    				// })
    		
  }

  const resort = (field) => {
    
  }

  const changeItem = ({target}) => {
    
    				//const {updatePersonConfig, personId} = props;
    				let newState = Object.assign({}, state)
    				let field = target.name
    				newState[field] = target.value === "0" ? "" : target.value
    				setState(newState)
    		
  }

  const showContextScheduledCourseMenu = (event, actionType, courseScheduledId) => {
    
    				event.stopPropagation()
    				event.preventDefault()
    				const {scheduledCourses} = props
            document.getElementById('contextScheduledCourse').style.top = event.clientY + 5
    				setActionType(actionType); setCourseEntryId(courseEntryId); setCourseScheduledId(courseScheduledId)
        
  }

  const handleStudentListOpen = (course, studentList) => {
    return setIsShowingModal_students(true); setCourse(course); setStudentList(studentList)
    
    
    

  }
  const handleStudentListClose = () => {
    return setIsShowingModal_students(false)
    
    
    

  }
  const handleHasErrorOpen = (errorMessage) => {
    return setIsShowingModal_hasError(true); setErrorMessage(errorMessage)
    
    

  }
  const handleHasErrorClose = () => {
    return setIsShowingModal_hasError(false)
    
    

  }
  const handleNotAvailableOpen = () => {
    return setIsShowingModal_notOpen(true)
    

  }
  const handleNotAvailableClose = () => {
    return setIsShowingModal_notOpen(false)
    

  }
  const handleFinalizeOpen = () => {
    return setIsShowingModal_finalize(true)

  }
  const handleFinalizeClose = () => {
    return setIsShowingModal_finalize(false)

  }
  const handleFinalizeSubmit = () => {
    
    				const {setFinalized, studentPersonId} = props
    				setFinalized(studentPersonId)
    				handleFinalizeClose()
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`Your schedule has been marked as 'Finalized' but you can still make updates and finalize again, as needed.`}/></div>)
    				navigate('/studentScheduleFinalize/:studentPersonId')
    		
  }

  const handleLackingCreditsOpen = () => {
    return setIsShowingModal_lackingCredits(true)
    

  }
  const handleLackingCreditsClose = () => {
    return setIsShowingModal_lackingCredits(false)
    

  }
  const handleDescriptionOpen = (courseEntryId, courseName) => {
    
            const {getCourseDescription, personId} = props
            setIsShowingModal_description(true); setCourseName(courseName)
            getCourseDescription(personId, courseEntryId)
        
  }

  const handleDescriptionClose = () => {
    
            const {clearCourseDescription} = props
            setIsShowingModal_description(false)
            clearCourseDescription()
        
  }

  const handleDoubledUpChoicesOpen = () => {
    return setIsShowingModal_doubledUp(true)
    

  }
  const handleDoubledUpChoicesClose = () => {
    return setIsShowingModal_doubledUp(false)
    

  }
  const toggleClassPeriods = (classPeriodId) => {
    
    				let selectedClassPeriods = [...state.selectedClassPeriods]
    				selectedClassPeriods = selectedClassPeriods && selectedClassPeriods.length > 0 && selectedClassPeriods.indexOf(classPeriodId) > -1
    						? selectedClassPeriods.filter(id => id !== classPeriodId)
    						: selectedClassPeriods && selectedClassPeriods.length > 0
    								? selectedClassPeriods.concat(classPeriodId)
    								: [classPeriodId]
    				setSelectedClassPeriods(selectedClassPeriods)
    				filterLearners(selectedClassPeriods)
    		
  }

  const clearFilters = () => {
    
    				setPartialNameText(''); setFilterIntervalId(''); setDepartmentId(''); setLearningPathwayId(''); setClassPeriodId(''); setFacilitatorName(''); setShowAlertsOnly(false); setShowOpenCoursesOnly(false); setOnlineOrTraditionalOnly('all')
    		
  }

  const isSelectedCourse = (courseScheduledId) => {
    
    				const {studentSchedule} = props
    				let hasSelected = false
    				studentSchedule && studentSchedule.length > 0 && studentSchedule.forEach(m => {
    						if (m.courseScheduledId === courseScheduledId) hasSelected = true
    				})
    				return hasSelected
    		
  }

  const toggleCourse = (courseScheduledId, course) => {
    
    				const {openRegistration, courseRecommendations, coursePrerequisites, studentPersonId, studentSchedule, addLearnerCourseAssign,
    								personId, removeStudentCourseAssign, addStudentSchedule, getGradRequirements, getCoursePrerequisites, me,
                    getCourseRecommendations} = props
    
    				if (!me.salta && (!openRegistration || !openRegistration.isOpen)) {
    						handleNotAvailableOpen()
    						return
    				}
    
    				//If there is not a recommendation and this course has a prerequisite, then show the dialog box for the required classes.
    				let courseRecommendation = courseRecommendations && courseRecommendations.length > 0 && courseRecommendations
    						.filter(m => (m.externalId && m.externalId.indexOf(course.courseId) > -1) || (course.courseId && course.courseId.indexOf(m.externalId) > -1))[0]
    
    				let prerequisite = (coursePrerequisites && coursePrerequisites.length > 0 && coursePrerequisites.filter(pr => pr.courseEntryId === course.courseEntryId)[0]) || {}
    				if (course.courseId === '1010T' || course.courseId === '1010' || course.courseId === '1018T' || course.courseId === '1018' || course.courseId === '1026' || course.courseId === '1010V' || course.courseId === '1018V' || course.courseId === '1026V') {
    						//If the user has taken ELA 1 or Honors ELA, then reutrn null for no Pre-Req icon.
    						let isEnrolledELA = studentSchedule && studentSchedule.length > 0 && studentSchedule.filter(m => m.courseId === '0206' || m.courseId === '206' || m.courseId === '0205' || m.courseId === '205')[0]
    						if (isEnrolledELA && isEnrolledELA.courseId) prerequisite = null
    				}
    
    				if (!me.salta && !(courseRecommendation && courseRecommendation.courseEntryId) && prerequisite && prerequisite.courseEntryId && !prerequisite.hasFulfilled) {
    						handlePrerequisiteOpen(getPrerequisiteMessageWithTitle(prerequisite))
    						return
    				}
    
    				//Do not allow the same sementerInvervalCode type class to exist in the same block, which covers the MP1 double-up problem when it is expecting MP2.
    				//So the reason we need to catch that here is because the total credits won't be added up properly for classes that are both M1's of block 1, for example.
    				let hasSameMPAndBlock = false
    				studentSchedule && studentSchedule.length > 0 && studentSchedule.forEach(m => {
    						let hasIntervalCode = false
    						let intervalCodeIsIn = false
    						let isM3 = false
    						let isM4 = false
    
    						m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
    								if (t.code.indexOf(course.intervals && course.intervals.length > 0 && course.intervals[0].code) > -1) hasIntervalCode = true
    								if (course.intervals && course.intervals.length > 0) {
    										course.intervals.forEach(c => { if(c.code === t.code) intervalCodeIsIn = true; })
    								}
    								if (t.code.indexOf('M3') > -1) isM3 = true
    								if (t.code.indexOf('M4') > -1) isM4 = true
    						})
    
    						if (m.courseEntryId !== course.courseEntryId && m.classPeriodName === course.classPeriodName && m.classPeriodName
    										&& (hasIntervalCode
    												|| intervalCodeIsIn
    												|| course.isCombinedMusic || m.isCombinedMusic)
    										&& !((isM3 || isM4) && (m.classPeriodName === '1' || m.classPeriodName === '1A' || m.classPeriodName === '1B'))) { // && m.courseName.indexOf('Open S2') > -1
    
    								handleSameMPAndBlockOpen()
    								hasSameMPAndBlock = true
    								return
    						}
    				})
    				if (hasSameMPAndBlock) return
    
    				//Do not allow a student to schedule more than one credit per block. (The indexOf is needed for block 1 which could have 1A and 1B as well.)
    				//Also, if this is a combined music class with the text "Open S2", don't show it in Spring Semester (which is actually a display thing for ManheimStudentSchedule component)
    				//	And don't allow that combined music class to double up on any block 1 of either semester (Look for the combined or IsCombined flag in the record.)
    				//  And make sure that other non-combined courses for MP1 or MP2 are not added to block 1.
    				let currentBlockCredits = studentSchedule && studentSchedule.length > 0
    						&& studentSchedule.filter(m => {
    										//Not including the current course (because that is going to be added to the credits down below)
    										//And not including combined course with "Open S2" that is for SpringSemester
    										let hasIntervalCode = false
    										let intervalCodeIsIn = false
    										let isM3 = false
    										let isM4 = false
    										m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
    												if (t.code.indexOf(course.intervals && course.intervals.length > 0 && course.intervals[0].code) > -1) hasIntervalCode = true
    												if (course.intervals && course.intervals.length > 0) {
    														course.intervals.forEach(c => { if(c.code === t.code) intervalCodeIsIn = true; })
    												}
    												if (t.code.indexOf('M3') > -1) isM3 = true
    												if (t.code.indexOf('M4') > -1) isM4 = true
    										})
    										if (m.id !== course.courseScheduledId && m.courseName && m.classPeriodName
    													 && !((isM3 || isM4) && (m.classPeriodName === '1' || m.classPeriodName === '1A' || m.classPeriodName === '1B') && m.courseName.indexOf('Open S2') > -1)
    													 && (hasIntervalCode || intervalCodeIsIn)) {
    												if (course.classPeriodName === '1' || course.classPeriodName === '1A' || course.classPeriodName === '1B') {
    														if (m.classPeriodName === '1' || m.classPeriodName === '1A' || m.classPeriodName === '1B') {
    																return m
    														}
    												} else if (course.classPeriodName === m.classPeriodName) {
    														return m
    												}
    										}
    										return false
    								})
    								.reduce((acc, m) => acc += m.credits >= 1 ? 1 : m.credits, 0)
    
    				if (Number(currentBlockCredits) + Number(course.credits >= 1 ? 1 : course.credits) > 1) {
    						handleTooManyBlockCreditsOpen()
    						removeStudentCourseAssign(personId, personId, courseScheduledId, () => {getGradRequirements(studentPersonId); getCoursePrerequisites(personId); getCourseRecommendations(personId, 'STUDENT')})
    						return
    				}
    
    				if (!course.onlineName && !course.online) props.alert.info(<div className={styles.alertText}><L p={p} t={`Please wait while your class request is recorded.`}/></div>)
    
    				//Get the unique courseScheduledId-s from studentSchedule structure in order to add to or delete this selected courseScheduledId to be toggled
    				let uniqueScheduledIds = []
    				if (studentSchedule && studentSchedule.length > 0)
    						uniqueScheduledIds = [...new Set(studentSchedule.map(m => m.courseScheduledId))]
    
    				if (uniqueScheduledIds && uniqueScheduledIds.length > 0 && uniqueScheduledIds.indexOf(courseScheduledId) > -1) {
    						uniqueScheduledIds = uniqueScheduledIds.filter(m => m !== courseScheduledId)
    						removeStudentCourseAssign(personId, personId, courseScheduledId, () => {getGradRequirements(studentPersonId); getCoursePrerequisites(personId); getCourseRecommendations(personId, 'STUDENT')})
    				} else {
    						uniqueScheduledIds = uniqueScheduledIds && uniqueScheduledIds.length > 0
    								? uniqueScheduledIds.concat(courseScheduledId)
    								: [courseScheduledId]
    
    						if (course.code !== 'Combined' || (course.code === 'Combined' && course.hasFallSemester)) {
    								addStudentSchedule(course, studentPersonId)
    								addLearnerCourseAssign(personId, [studentPersonId], uniqueScheduledIds, () => {getGradRequirements(studentPersonId); getCoursePrerequisites(personId); getCourseRecommendations(personId, 'STUDENT')})
                    if (course.onlineName || course.online) handleOnlineClassAlertOpen()
    						}
    						if (course.code !== 'Combined' || (course.code === 'Combined' && course.hasSpringSemester)) {
    								const {scheduledCourses} = props
    								const springCourse = scheduledCourses.filter(m => m.id === course.id && (m.intervals && m.intervals.length > 0 && m.intervals[0].intervalId) !== (course.intervals && course.intervals.length > 0 && course.intervals[0].intervalId))[0]
    								if (springCourse && springCourse.courseScheduledId) {
    										addStudentSchedule(springCourse, studentPersonId)
    								}
    						}
    				}
    		
  }

  const setAlertIcon = (course) => {
    
    				const {alerts} = props
    				
    
    				let alert = alerts && alerts.length > 0 && alerts.filter(m => m.courseScheduledId === course.courseScheduledId)[0]
    				let hasAlert = alert && alert.alertWhenId
    				//let hasDoNotAddCourse = doNotAddCourses && doNotAddCourses.length > 0 && doNotAddCourses.filter(m => m.courseScheduledId === course.courseScheduledId)[0];
    				//No longer do we cut out the doNotAddCourse here because the student can now wait for the current class and not just consider a new course.  On the alert course page, the new section will be blocked out.
    				return ((course && course.maxSeats && course.seatsTaken && course.maxSeats - course.seatsTaken.length) > 0)
    						? null
    						: <div onClick={hasAlert
    															? () => navigate(`/alertCourseSchedule/${course.courseScheduledId}/${alert.alertWhenId}`)
    															: allCreditCount < 8
    																	? handleAlertBelowCreditOpen
    																	: alerts.length >= 2
    																			? handleAlertLimitOpen
    																			: alert && alert.alertWhenId
    																					? () => navigate(`/alertCourseSchedule/${course.courseScheduledId}/${alert.alertWhenId}`)
    																					: () => navigate(`/alertCourseSchedule/${course.courseScheduledId}`)
    											}
    											data-rh={hasAlert ? 'You have an existing alert.  Click here to turn it off.' : 'Get a notification when another section opens up for this class'}
    											className={!allCreditCount || allCreditCount.length < 8 ? styles.lowOpacity: ''}>
    									<Icon pathName={'antennae'} premium={true} superscript={hasAlert ? 'cross_circle' : 'plus'}
    											supFillColor={hasAlert ? 'maroon' : 'green'} className={styles.icon} supPremium={hasAlert}/>
    							</div>
    		
  }

  const getPrerequisiteMessageWithTitle = (prerequisite) => {
    
    				prerequisite.firstList && prerequisite.firstList.length > 0 && prerequisite.firstList.forEach(m => {
    						prerequisiteMessage += `<br/>${m.courseName} (${m.externalId}) Credits: ${m.credits}`
    						prerequisiteMessage += m.hasCredit ? `&#10004;` : ``
    				})
    
    				if (prerequisite.secondList && prerequisite.secondList.length > 0) {
    						prerequisiteMessage += prerequisite.secondList && prerequisite.secondList.length === 1
    								? '<br/><br/><u>AND this class is required:</u>'
    								: '<br/><br/><u>AND one of these classes is required:</u>'
    
    						prerequisite.secondList && prerequisite.secondList.length > 0 && prerequisite.secondList.forEach(m => {
    								prerequisiteMessage += `<br/>${m.courseName} (${m.externalId}) Credits: ${m.credits}`
    								prerequisiteMessage += m.hasCredit ? `&#10004;` : ``
    						})
    				}
    
    				if (prerequisite.thirdList && prerequisite.thirdList.length > 0) {
    						prerequisiteMessage += prerequisite.thirdList && prerequisite.thirdList.length === 1
    								? '<br/><br/><u>AND this class is required:</u>'
    								: '<br/><br/><u>AND one of these classes is required:</u>'
    
    						prerequisite.thirdList && prerequisite.thirdList.length > 0 && prerequisite.thirdList.forEach(m => {
    								prerequisiteMessage += `<br/>${m.courseName} (${m.externalId}) Credits: ${m.credits}`
    								prerequisiteMessage += !!m.hasCredit ? `&#10004;` : ``
    						})
    				}
    				return { courseName, prerequisiteMessage }
    		
  }

  const setPrerequisiteIcon = (course) => {
     //courseId is the courseEntry.externalId
    				const {coursePrerequisites, courseRecommendations, studentSchedule} = props
    				let prerequisite = coursePrerequisites && coursePrerequisites.length > 0 && coursePrerequisites.filter(pr => pr.externalId === course.courseId)[0]
    				//We use "courseId.indexOf(cr.externalId)" because if there is a course recommendation it needs to cover the online version or traditional version
    				let courseRecommendation = (courseRecommendations && courseRecommendations.length > 0 && courseRecommendations
    						.filter(cr => (course && course.courseId && course.courseId.indexOf(cr.externalId) > -1) || (cr.externalId && cr.externalId.indexOf(course.courseId) > -1)))[0] || {}
    				//There is a special case where a student can take Spanish I, French I, or German I if the student is currently enrolled in ELA 1 or Honors ELA for ANY part of 2019-2020
    				//		allow them to take the language classes.  That even means if they are signed up for ELA in Spring and want to take the World language in Fall BEFORE they take ELA, that's okay.
    				if (course.courseId === '1010T' || course.courseId === '1010' || course.courseId === '1018T' || course.courseId === '1018' || course.courseId === '1026' || course.courseId === '1010V' || course.courseId === '1018V' || course.courseId === '1026V') {
    						//If the user has taken ELA 1 or Honors ELA, then return null for no Pre-Req icon.
    						let isEnrolledELA = studentSchedule && studentSchedule.length > 0 && studentSchedule.filter(m => m.courseId === '0206' || m.courseId === '206' || m.courseId === '0205' || m.courseId === '205')[0]
    						if (isEnrolledELA && isEnrolledELA.courseId) return null
    				}
    				return prerequisite && prerequisite.courseEntryId && !((courseRecommendation && courseRecommendation.courseEntryId) || (prerequisite && prerequisite.hasFulfilled))
    				 		? <div onClick={() => handlePrerequisiteOpen(getPrerequisiteMessageWithTitle(prerequisite))} data-rh={'Click to see prerequisites'}>
    									<Icon pathName={'warning'} fillColor={'red'} className={styles.icon}/>
    							</div>
    						: setAlertIcon(course)
    		
  }

  const handlePrerequisiteOpen = (prerequisite) => {
    return setIsShowingModal_prerequisite(true); setCourseName(prerequisite.courseName); setPrerequisiteMessage(prerequisite.prerequisiteMessage)
  }

  const handlePrerequisiteClose = () => {
    return setIsShowingModal_prerequisite(false); setCourseName(''); setPrerequisiteMessage('')
  }

  const handleTooManyBlockCreditsOpen = () => {
    return setIsShowingModal_tooManyCredits(true)
  }

  const handleTooManyBlockCreditsClose = () => {
    return setIsShowingModal_tooManyCredits(false)
  }

  const handleSameMPAndBlockOpen = () => {
    return setIsShowingModal_sameMPAndBlock(true)
  }

  const handleSameMPAndBlockClose = () => {
    return setIsShowingModal_sameMPAndBlock(false)
  }

  const setContentAreaFilter = (learningPathwayId) => {
    
    				let newState = Object.assign({}, state)
    				newState.learningPathwayId = learningPathwayId
    				setState(newState)
    		
  }

  const handleRefreshOpenRegistrations = () => {
    
    				const {getOpenRegistrations, personId} = props
    				getOpenRegistrations(personId)
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`The open registration search has been refreshed.`}/></div>)
    		
  }

  const handleAlertLimitOpen = () => {
    return setIsShowingModal_alertLimit(true)
    
    
    
    

  }
  const handleAlertLimitClose = () => {
    return setIsShowingModal_alertLimit(false)
    
    
    
    

  }
  const handleAlertBelowCreditOpen = () => {
    return setIsShowingModal_alertBelowCredit(true)
    
    
    

  }
  const handleAlertBelowCreditClose = () => {
    return setIsShowingModal_alertBelowCredit(false)
    
    
    

  }
  const handleOnlineClassAlertOpen = () => {
    return setIsShowingModal_onlineClass(true)
    

  }
  const handleOnlineClassAlertClose = () => {
    return setIsShowingModal_onlineClass(false)
    

  }
  const hasErrors = () => {
    
            let hasTooManyCredits = false
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('1', 'M1', 'M2')
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('2', 'M1', 'M2')
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('3', 'M1', 'M2')
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('4', 'M1', 'M2')
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('1', 'M3', 'M4')
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('2', 'M3', 'M4')
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('3', 'M3', 'M4')
            hasTooManyCredits = hasTooManyCredits ? hasTooManyCredits : hasTooManyCredits('4', 'M3', 'M4')
    
            let hasMissingMarkingPeriod = false
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('1', 'M1', 'M2')
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('2', 'M1', 'M2')
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('3', 'M1', 'M2')
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('4', 'M1', 'M2')
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('1', 'M3', 'M4')
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('2', 'M3', 'M4')
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('3', 'M3', 'M4')
            hasMissingMarkingPeriod = hasMissingMarkingPeriod ? hasMissingMarkingPeriod : hasMissingMarkingPeriod('4', 'M3', 'M4')
    
            let message = []
            if (hasTooManyCredits) message[message.length] = <L p={p} t={`Has too many credits`}/>
            if (hasMissingMarkingPeriod) message[message.length] = message && message.length > 0
                ? <L p={p} t={` and has a missing marking period`}/>
                : <L p={p} t={`Has a missing marking period`}/>
            return message && message.length > 0
        
  }

  const hasTooManyCredits = (block, firstMP, secondMP) => {
    
          	let localSchedule = Object.assign([], props.studentSchedule)
            let count = 0
            localSchedule = localSchedule && localSchedule.length > 0 && localSchedule.filter(m => {
                let isFound = false
                m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
                    if (m.classPeriodName === block && t.code && (t.code.indexOf(firstMP) > -1 || t.code.indexOf(secondMP) > -1)) {
                        isFound = true
                        count++
                    }
                })
                return isFound
            })
            let credits = localSchedule && localSchedule.length > 0 && localSchedule.reduce((acc, m) => acc = acc += m.credits, 0)
    				return count === 1 ? false : credits > 1;  //If this is a semester class with 2 credits, then the 1 credits applies to this single semester.
    		
  }

  const hasMissingMarkingPeriod = (block, firstMP, secondMP) => {
    
    				const {studentSchedule} = props
    				let firstMPCredits = 0
    				let secondMPCredits = 0
    				if (studentSchedule && studentSchedule.length > 0) {
    						studentSchedule.forEach(m => {
    								if (m.classPeriodName && m.classPeriodName.indexOf(block) > -1) {
    										m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
    												if (t.code && t.code.indexOf(firstMP) > -1)
    														firstMPCredits += m.credits
    												if (t.code && t.code.indexOf(secondMP) > -1)
    														secondMPCredits += m.credits
    										})
    								}
    						})
    				}
    				if (!firstMPCredits && !secondMPCredits) return ''
    				if (!firstMPCredits) return `Missing Marking Period: ` + firstMP
    				if (!secondMPCredits) return `Missing Marking Period: ` + secondMP
    				return ''
    		
  }

  const {me, scheduledCourses, personId, myProfile, alerts, students, viewStudent, removeStudentAssign, learningPathways, teachers, openRegistration,
  							intervals, companyConfig={}, classPeriods, departments, seatsStatistics, gradRequirements, fetchingRecord, courseDescription, accessRoles,
                toggleBypassGradeRestriction} = props
  
        
  
  			//let isFinalized = studentSchedule && studentSchedule.length > 0 && studentSchedule[0].isFinalized;
  			let localScheduledCourses = scheduledCourses
  			if (localScheduledCourses && localScheduledCourses.length > 0 ) {
  					if (partialNameText) {
  							let cutBackTextFilter = partialNameText.toLowerCase()
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1))
  					}
  					if (filterIntervalId && filterIntervalId !== guidEmpty) {
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => m.intervalId === filterIntervalId)
  					}
  					if (!!departmentId) {
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => m.departmentId === Number(departmentId))
  					}
  					if (learningPathwayId && learningPathwayId !== guidEmpty) {
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => m.learningPathwayId === learningPathwayId)
  					}
  					let block1 = classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodName === "1")[0]
  					block1 = block1 && block1.classPeriodId
  					let block1A = classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodName === "1A")[0]
  					block1A = block1A && block1A.classPeriodId
  					let block1B = classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodName === "1B")[0]
  					block1B = block1B && block1B.classPeriodId
  					if (classPeriodId && classPeriodId !== guidEmpty) {
  							if (classPeriodId === block1) {  //If this is Manheim's 1st block, then look for 1, 1A and 1B. (12, 17, 18 classperiodId-s)
  									localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => m.classPeriodId === block1 || m.classPeriodId === block1A || m.classPeriodId === block1B)
  							} else {
  									localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => m.classPeriodId === classPeriodId)
  							}
  					}
  					if (!!facilitatorName && facilitatorName !== "0") {
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => m.facilitatorName === facilitatorName)
  					}
  					if (!!showAlertsOnly) {
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => {
  									let hasAlert = false
  									alerts && alerts.length > 0 && alerts.forEach(a => {
  											if (a.courseScheduledId === m.courseScheduledId) hasAlert = true
  									})
  									return hasAlert
  							})
  					}
  					if (!!showOpenCoursesOnly) {
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => m.seatsTaken && m.seatsTaken.length < m.maxSeats)
  					}
  					if (!!onlineOrTraditionalOnly && onlineOrTraditionalOnly !== 'all' && localScheduledCourses && localScheduledCourses.length > 0) {
  							localScheduledCourses = onlineOrTraditionalOnly === 'online'
  									? localScheduledCourses.filter(m => m.onlineName === 'Online' || m.online)
  									: localScheduledCourses.filter(m => !m.onlineName && !m.online)
  					}
  			}
  			if (sortByHeadings && sortByHeadings.sortField) {
  					localScheduledCourses = doSort(localScheduledCourses, sortByHeadings)
  			}
  
  			localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.map(m => {
            let seats = seatsStatistics && seatsStatistics.length > 0 && seatsStatistics.filter(s => s.courseScheduledId === m.id)[0]
            let seatsRemaining = 0
            if (seats && seats.courseScheduledId) {
                seatsRemaining = m.maxSeats - seats.seatsTaken
            } else {
                seatsRemaining = m.maxSeats - m.seatsTaken
            }
            if (seatsRemaining <= 0) seatsRemaining = 'FULL'
  
            //if (m.courseScheduledId === '414bcc0a-6cb0-437a-8bd5-7d9acb41402b') debugger;
            let interval = intervals && intervals.length > 0 && intervals.filter(i => i.intervalId === m.intervalId)[0]
  
  					m.onlineOrTraditional = <div className={styles.cellText}>{m.online ? 'Online' : 'Traditional'}</div>
  					m.alertOrPrerequisite = <div className={styles.iconPosition}>{setPrerequisiteIcon(m)}</div>
  					m.choose = <div className={classes(styles.cellText, (m.intervals && m.intervals.length > 0 && (m.intervals[0].name.indexOf("MP1") > -1 || m.intervals[0].name.indexOf("MP2") > -1) ? styles.backMaroon : styles.backGray))}>
  													{(seatsRemaining <= 0 || seatsRemaining === 'FULL') && !me.salta
  															? <div className={classes(styles.cellText, styles.white)}>Full</div>
  															: <div onClick={() => toggleCourse(m.courseScheduledId, m)} className={classes(styles.cellText, (m.seatsTaken && m.seatsTaken.length >= m.maxSeats ? styles.backRed : ''))}>
  																		<Icon pathName={isSelectedCourse(m.courseScheduledId) ? 'checkmark' : 'square_empty'} premium={!isSelectedCourse(m.courseScheduledId)}
  																				className={classes(styles.iconSquare, styles.backWhite)} fillColor={isSelectedCourse(m.courseScheduledId) ? 'green' : 'black'}/>
  																</div>
  													}
  											</div>
  					m.blockOrPeriod = <div className={styles.cellText}>{m.classPeriodsMultiple && m.classPeriodsMultiple.length > 0 ? m.classPeriodsMultiple.join(',') : m.classPeriodName}</div>
  					m.course = <div onClick={() => handleDescriptionOpen(m.courseEntryId, m.courseName)} className={classes(styles.wrap, styles.cellText, (globalStyles.link))}>
  														{m.courseName}
  												 </div>
  
  					if (seats && seats.courseScheduledId) {
  							m.seatsTotal = <div className={styles.cellText}>{seats.maxSeats}</div>
  							m.seatsTaken = <div className={styles.cellText}>
  																	{/* This list that pops up is not being accurate since, I believe, that the list only shows the student list from the student's perpsective despite a superuser impersonation
  																		<a onClick={() => handleStudentListOpen(m, m.seatsTaken)} className={styles.link}>*/}
                                        //{seats.studentList}
  																			{seats.seatsTaken}
  																	{/*</a>*/}
  															</div>
  					}
  					m.seatsRemaining = <div className={styles.cellText}>
  																{seatsRemaining}
  														 </div>
  
  					m.intervalName = <div className={styles.cellText}>{interval && interval.name}</div>
  					m.creditCount = <div className={styles.cellText}>{m.credits}</div>
  					return m
  			})
  
  			let columns = [
  				{
  					width: 85,
  					label: <div className={globalStyles.cellText}><L p={p} t={`Format`}/></div>,
  					dataKey: 'onlineOrTraditional',
  				},
  				{
  					width: 30,
  					label: '',
  					dataKey: 'alertOrPrerequisite',
  				},
  				{
  					width: 50,
  					label: '',
  					dataKey: 'choose',
  				},
  				{
  					width: 360,
  					label: <div className={globalStyles.cellText}><L p={p} t={`Course`}/></div>,
  					dataKey: 'course',
  				},
  				{
  					width: 50,
  					label: companyConfig.urlcode === 'Manheim'
                      ? <div className={globalStyles.cellText}>Block</div>
                      : <div className={globalStyles.cellText}><L p={p} t={`Period`}/></div>,
  					dataKey: 'blockOrPeriod',
  				}
  		]
  
  		if (localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses[0].salta) {
  				columns = columns.concat([
  						{
  							width: 60,
  							label: <div className={globalStyles.cellText}><L p={p} t={`Max seats`}/></div>,
  							dataKey: 'seatsTotal',
  							numeric: true,
  						},
  						{
  							width: 70,
  							label: <div className={globalStyles.cellText}><L p={p} t={`Seats taken`}/></div>,
  							dataKey: 'seatsTaken',
  							numeric: true,
  						},
  					])
  			}
  
  			columns = columns.concat([
  					{
  						width: 50,
  						label: <div className={globalStyles.cellText}><L p={p} t={`Open`}/></div>,
  						dataKey: 'seatsRemaining',
              numeric: true,
  					},
  					{
  						width: 50,
  						label: <div className={globalStyles.cellText}><L p={p} t={`Credits`}/></div>,
  						dataKey: 'creditCount',
  						numeric: true,
  					},
  					{
  						width: 160,
  						label: <div className={globalStyles.cellText}><L p={p} t={`Interval`}/></div>,
  						dataKey: 'intervalName',
  					},
  			])
  
        return (
          <div className={styles.container} id={'topContainer'}>
  						<div>
  		            <div className={styles.marginLeft}>
  		                <div className={globalStyles.pageTitle}>
  		                  	<L p={p} t={`Choose Classes`}/>
  		                </div>
  										<div className={styles.row}>
  												<div>
  														<div className={classes(styles.mediumLeft, styles.subHeading)}><L p={p} t={`Open registration`}/></div>
  														{(!openRegistration || !openRegistration.openDateTo) &&
  																<div className={classes(styles.doubleLeft, styles.noRecords)}>
  																		<div><L p={p} t={`No open registration found for this student`}/></div>
  																		<a onClick={handleRefreshOpenRegistrations} className={styles.link}><L p={p} t={`refresh`}/></a>
  																</div>
  														}
  														<div className={classes(styles.doubleLeft, styles.row)}>
  																{openRegistration && openRegistration.openDateFrom && <TextDisplay label={<L p={p} t={`From`}/>} text={<DateMoment date={openRegistration.openDateFrom} format={'D MMM YYYY'}/>}/>}
  																{openRegistration && openRegistration.openDateTo && <TextDisplay label={<L p={p} t={`To`}/>} text={<DateMoment date={openRegistration.openDateTo} format={'D MMM YYYY'}/>}/>}
  														</div>
  												</div>
  												<div className={styles.buttonDiv}>
  														<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Finalize`}/>} onClick={finalizeRegistration}/>
  														{/*isFinalized && <div className={styles.finalized}><L p={p} t={`Finalized`}/></div>*/}
  														<div className={styles.count}><L p={p} t={`${allCreditCount} of 8 credits`}/></div>
  												</div>
  												<div className={styles.moreTop}>
  														<TextDisplay label={<L p={p} t={`Grade level`}/>} text={myProfile.gradeLevel}/>
  												</div>
  										</div>
  										<CourseAssignFilter changeItem={changeItem} companyConfig={companyConfig} departments={departments} intervals={intervals}
  												classPeriods={classPeriods} learningPathways={learningPathways} alerts={alerts} teachers={teachers} partialNameText={partialNameText}
  												filterIntervalId={filterIntervalId} learningPathwayId={learningPathwayId} departmentId={departmentId} classPeriodId={classPeriodId}
  												facilitatorName={facilitatorName} showAlertsOnly={showAlertsOnly} showOpenCoursesOnly={showOpenCoursesOnly} accessRoles={accessRoles}
  												onlineOrTraditionalOnly={onlineOrTraditionalOnly} toggleShowAlertsOnly={toggleShowAlertsOnly} clearFilters={clearFilters}
  												toggleShowOpenCoursesOnly={toggleShowOpenCoursesOnly} handleRadio={handleRadio} bypassGradeRestriction={me.bypassGradeRestriction}
                          toggleBypassGradeRestriction={toggleBypassGradeRestriction} me={me}/>
  										<GradRequirementAccordion gradRequirements={gradRequirements} personId={personId} companyConfig={companyConfig} />
  								</div>
  								<Loading isLoading={fetchingRecord.scheduledCourses && !(localScheduledCourses && localScheduledCourses.length)} />
  								<Paper style={{ height: 400, width: '100%', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(localScheduledCourses && localScheduledCourses.length) || 0}
  												rowGetter={({ index }) => (localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses[index]) || ''}
  												columns={columns} />
  								</Paper>
  								{!fetchingRecord.scheduledCourses && !(localScheduledCourses && localScheduledCourses.length > 0) &&
  										<span className={styles.noRecords}><L p={p} t={`no scheduled courses found`}/></span>
  								}
  						</div>
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this course?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this course?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_notOpen &&
                  <MessageModal handleClose={handleNotAvailableClose} heading={<L p={p} t={`No Open Registration`}/>}
                     explainJSX={<L p={p} t={`You are not currently in an open registration.`}/>}  onClick={handleNotAvailableClose} />
              }
  						{isShowingModal_students &&
  								<StudentListModal handleClose={handleStudentListClose} course={course} courseScheduledId={courseScheduledId}
  										students={students} studentList={studentList} viewStudent={viewStudent} removeStudentAssign={removeStudentAssign} />
  						}
  						{isShowingModal_finalize &&
                  <MessageModal handleClose={handleFinalizeClose} heading={<L p={p} t={`Finalize Registration`}/>}
                     children={<ManheimStudentSchedule studentSchedule={props.studentSchedule} personId={personId} isFinalizeConfirm={true} openRegistration={openRegistration} me={me}/>}
  									 onClick={handleFinalizeSubmit} isConfirmType={true} isFinalize={true} noText={<L p={p} t={`Close`}/>} yesText={<L p={p} t={`Submit`}/>}/>
              }
  						{isShowingModal_lackingCredits &&
                  <MessageModal handleClose={handleLackingCreditsClose} heading={<L p={p} t={`Credit Count Is Not Complete`}/>}
                     explainJSX={<L p={p} t={`The number of credits is not complete. You have ${allCreditCount} of 8 credits.  Please be sure you have 8 credits for blocks 1 through 4 and no more than 1 credit of extra credit (5th block) for each semester.`}/>}
  									 onClick={handleLackingCreditsClose} />
              }
  						{isShowingModal_doubledUp &&
                  <MessageModal handleClose={handleDoubledUpChoicesClose} heading={<L p={p} t={`Too Many Choices`}/>}
                     explainJSX={<L p={p} t={`You have too many choices for at least one block.  Please check your entry and make a final choice before finalizing.`}/>}  onClick={handleDoubledUpChoicesClose} />
              }
  						{isShowingModal_description &&
                  <MessageModal handleClose={handleDescriptionClose} heading={courseName}
                     explainJSX={<div className={styles.label}>
                                    {!fetchingRecord.courseDescription && !courseDescription ? <L p={p} t={`No description found`}/> : courseDescription}
                                    <Loading isLoading={fetchingRecord.courseDescription}/>
                                 </div>}  onClick={handleDescriptionClose} />
              }
  						{isShowingModal_prerequisite &&
                  <MessageModal handleClose={handlePrerequisiteClose} heading={courseName}
                    explain={'You have not yet fulfilled this prerequisite.<br/></br>' + prerequisiteMessage}  onClick={handlePrerequisiteClose} />
              }
  						{isShowingModal_tooManyCredits &&
                  <MessageModal handleClose={handleTooManyBlockCreditsClose} heading={<L p={p} t={<L p={p} t={`Too Many Credits For This Block`}/>}/>}
                     explainJSX={<L p={p} t={`Add this course would exceed the one credit limit per block.`}/>}  onClick={handleTooManyBlockCreditsClose} />
              }
  						{isShowingModal_alertLimit &&
                  <MessageModal handleClose={handleAlertLimitClose} heading={<L p={p} t={`Wait-List Alert Limit`}/>}
                     explainJSX={<L p={p} t={`You already have two wait-list alerts.  You are limited to a maximum of two classes on your wait-list.`}/>}  onClick={handleAlertLimitClose} />
              }
  						{isShowingModal_alertBelowCredit &&
                  <MessageModal handleClose={handleAlertBelowCreditClose} heading={<L p={p} t={`Wait List Instructions`}/>}
                     explainJSX={<L p={p} t={`You can add a wait list alert after you have chosen 8 credits.  (Your wait list will be limited to two courses.)`}/>}  onClick={handleAlertBelowCreditClose} />
              }
              {isShowingModal_hasError &&
                  <MessageModal handleClose={handleHasErrorClose} heading={<L p={p} t={`There are Errors`}/>}
                     explainJSX={errorMessage}  onClick={handleHasErrorClose} />
              }
              {isShowingModal_onlineClass &&
                  <MessageModal handleClose={handleOnlineClassAlertClose} heading={<L p={p} t={`Online Class`}/>}
                     explainJSX={<L p={p} t={`You have chosen an online class.  If you did not mean to add this online class, you can delete it from your schedule.`}/>}
                     onClick={handleOnlineClassAlertClose} />
              }
  						{isShowingModal_sameMPAndBlock &&
                  <MessageModal handleClose={handleSameMPAndBlockClose} heading={companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Same Marking Period and Block`}/> : <L p={p} t={`Same Semester and Class Period`}/>}
                     explainJSX={companyConfig.urlcode === 'Manheim'
  									 		? <L p={p} t={`The course that you chose has the same marking period and block as a course already scheduled.`}/>
  											: <L p={p} t={`The course that you chose has the same semester and class period as a course already scheduled.`}/>
  										}  onClick={handleSameMPAndBlockClose} />
              }
  
          </div>
      )
}

export default withAlert(StudentCourseAssignView)
