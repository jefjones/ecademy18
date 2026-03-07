import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {penspringHost} from '../../penspring_host'
import * as styles from './GradebookEntryView.css'
const p = 'GradebookEntryView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import penspringSmall from '../../assets/Penspring_favicon.png'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import EditTableFreezeLeft from '../../components/EditTableFreezeLeft'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import Loading from '../../components/Loading'
import MessageModal from '../../components/MessageModal'
import InputGradebookMultipleEntry from '../../components/InputGradebookMultipleEntry'
import Checkbox from '../../components/Checkbox'
import GradingRatingEntry from '../../components/GradingRatingEntry'
import GradingRatingLegend from '../../components/GradingRatingLegend'
import DocumentResponseModal from '../../components/DocumentResponseModal'
import ExcelGradebookEntry from '../../components/ExcelGradebookEntry'
import InputText from '../../components/InputText'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import debounce from 'lodash/debounce'
import {doSort} from '../../utils/sort'
import { withAlert } from 'react-alert'
import ReactToPrint from "react-to-print"
import ContextKnowledgeRating from '../../components/ContextKnowledgeRating'

function GradebookEntryView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [showSearchControls, setShowSearchControls] = useState(false)
  const [courseScheduledId, setCourseScheduledId] = useState('')
  const [contentTypeId, setContentTypeId] = useState('')
  const [singleAssignmentId, setSingleAssignmentId] = useState('')
  const [showPercentScoreBoth, setShowPercentScoreBoth] = useState('score')
  const [contentTypeCode, setContentTypeCode] = useState('')
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(false)
  const [isShowingModal_response, setIsShowingModal_response] = useState(false)
  const [isShowingModal_numberTooLarge, setIsShowingModal_numberTooLarge] = useState(false)
  const [isShowingModal_finalizeGrade, setIsShowingModal_finalizeGrade] = useState(false)
  const [showHideResponseTypes, setShowHideResponseTypes] = useState(false)
  const [isInit, setIsInit] = useState(undefined)
  const [jumpToAssignmentId, setJumpToAssignmentId] = useState(undefined)
  const [sendToHiddenPenspringLink, setSendToHiddenPenspringLink] = useState(undefined)
  const [origGradebook, setOrigGradebook] = useState(undefined)
  const [assignment, setAssignment] = useState(undefined)
  const [clickedUrl, setClickedUrl] = useState(undefined)
  const [student, setStudent] = useState(undefined)
  const [assignmentId, setAssignmentId] = useState(undefined)
  const [courseScheduledorigGradebook, setCourseScheduledorigGradebook] = useState(undefined)
  const [gradebook, setGradebook] = useState(undefined)
  const [forceUpdate, setForceUpdate] = useState(undefined)
  const [penspringWorkId, setPenspringWorkId] = useState(undefined)
  const [learningPathwayId, setLearningPathwayId] = useState(undefined)
  const [isShowingModal_columnMultScore, setIsShowingModal_columnMultScore] = useState(undefined)
  const [set_studentPersonId, setSet_studentPersonId] = useState(undefined)
  const [set_assignmentId, setSet_assignmentId] = useState(undefined)

  useEffect(() => {
    
    				document.addEventListener('scroll', handleScroll)
            document.addEventListener('keyup', checkEscapeKey)
            document.addEventListener('click', hideContextKnowledgeRatingMenu)
    		
    return () => {
      
      				props.clearGradebook()
      				document.removeEventListener('scroll', handleScroll)
      				document.removeEventListener('keyup', checkEscapeKey)
              document.removeEventListener('click', hideContextKnowledgeRatingMenu)
      		
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {standardsRatings, courseScheduledId, personConfig} = props
    				
            let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly
    
    				if ((!isInit && courseScheduledId && personConfig && personConfig.courseConfig[courseScheduledId])
    								|| courseScheduledId !== prevProps.courseScheduledId) {
    						setIsInit(true); setJumpToAssignmentId(personConfig.courseConfig[courseScheduledId])
    				}
    				if (sendToHiddenPenspringLink) {
    						setSendToHiddenPenspringLink(false)
    						document.getElementById('hiddenPenspringLink').click()
    				}
    
    				//The STANDARDSRATING buttons are wrapped with spans.  This should be the only span components on the page.
    				if (isLevelOnly) {
    						let spans = document.getElementsByTagName('span')
    						for(let i = 0; i < spans.length; i++) {
    								if (spans && spans[i] && spans[i].id) {
    										let studentPersonId = spans[i].id.substring(0, spans[i].id.indexOf('^'))
    										let assignmentId = spans[i].id.substring(spans[i].id.indexOf('^')+1)
    										spans[i].onclick = () => {
    												showContextKnowledgeRating(event, studentPersonId, assignmentId)
    										}
    										spans[i].oncontextmenu = (event) => {
    												event.stopPropagation()
    												event.preventDefault()
    												showContextKnowledgeRating(event, studentPersonId, assignmentId)
    										}
    								}
    						}
    				}
        
  }, [])

  const sendToStudentSchedule = (studentPersonId) => {
    
    				const {getStudentAssignments, personId, courseEntryId} = props
    				getStudentAssignments(personId, studentPersonId, courseEntryId)
    				navigate('/studentSchedule/' + studentPersonId)
    		
  }

  const sendToStudentAssignmentView = (studentPersonId) => {
    
    				const {studentAssignmentsInit, personId, courseScheduledId} = props
    				studentAssignmentsInit(personId, personId, courseScheduledId)
    				navigate(`/studentAssignments/${courseScheduledId}/${studentPersonId}`)
    		
  }

  const handleEnterKey = (assignmentId, studentPersonId, event) => {
    
    				if(event.key === "Enter") {
                moveToNextScoreDown(event)
                const {setGradebookScore, personId, courseScheduledId, getAssignmentsPendingReview} = props
                setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value, () => getAssignmentsPendingReview(personId));  //Don't call getGradebook here.  We are going to change grades through a reducer and then call to get the updated overall grade from the serverside so there is just one side that makes thoat calculation.
            }
        
  }

  const moveToNextScoreDown = ({target}) => {
    
    				const {gradebook} = props
    				//
    				//Get the current id which will be the student and the assignment Ids.  Get the next student and use the current AssignmentId in order to move the focus down to the next one.
    				let studentPersonId = target.name.substring(0, target.name.indexOf('#$'))
    				let nextStudentPersonId = ''
    				let foundCurrent = false
    				gradebook && gradebook.students && gradebook.students.length > 0 && gradebook.students.forEach(m => {
    						if (!foundCurrent && m.id === studentPersonId) {
    								foundCurrent = true
    						} else if (foundCurrent && !nextStudentPersonId) {
    								nextStudentPersonId = m.id
    								foundCurrent = false; //So it won't keep replacing our newly found nextStudentpersonId;
    						}
    				})
    				let nextScoreControlDown = nextStudentPersonId + '#$' + assignmentId
    				document.getElementById(nextScoreControlDown) && document.getElementById(nextScoreControlDown).focus()
    		
  }

  const recallPage = (event, singleAssignmentId='') => {
    
    				//const {gradebookInit, personId} = props;
    				const {courseScheduledId, getCourseWeightedScore, courses, clearGradebook} = props
    				clearGradebook()
    				let id = event && event.target && event.target.value ? event.target.value : courseScheduledId
    				sendDebounce(id, singleAssignmentId); //There is something going on with the event that gets overridden that we have to put off the debounce call until we get the event data.
            setCourseScheduledId(id)
    				let course = courses && courses.length > 0 && courses.filter(m => m.id === id)[0]
    				course && course.courseEntryId && getCourseWeightedScore(course.courseEntryId)
        
  }

  const recallPageWithJump = (event) => {
    
    				const {personId, gradebookInit, updatePersonConfigCourse, courseScheduledId} = props
            //
    				updatePersonConfigCourse(personId, courseScheduledId, event.target.value === '0' ? '' : event.target.value)
            gradebookInit(personId, courseScheduledId, event.target.value); //All assignments are already in our record from the database.
            setJumpToAssignmentId(event.target.value)
        
  }

  const onPassFailIncrement = (studentPersonId, assignmentId, passFailSequence=0) => {
    
    				//If passFailSequence is blank then it is as good as "Not started" which is 0.
    				//If the nextSequence is greater than the available passFails, the sequence wraps around to 0 again to start which might be the user's intention to reset it.
    				const {passFailRatings, setPassFailSequence, courseScheduledId, personId} = props
    				let nextSequence = passFailSequence ? ++passFailSequence : 1
    				nextSequence = nextSequence > passFailRatings.length-1 ? 0 : nextSequence
    				setPassFailSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId)
    		
  }

  const handleScore = (assignmentId, studentPersonId, event) => {
    
    				props.setLocalGradebookScore(studentPersonId, assignmentId, event.target.value)
    		
  }

  const onBlurScore = (assignmentId, studentPersonId, event) => {
    
    				const {setGradebookScore, personId, courseScheduledId, getAssignmentsPendingReview} = props
    				//
    				//setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value, () => gradebookInit(personId, courseScheduledId, jumpToAssignmentId, singleAssignmentId, false));
    				setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value, () => getAssignmentsPendingReview(personId));  //Don't call getGradebook here.  We are going to change grades through a reducer and then call to get the updated overall grade from the serverside so there is just one side that makes thoat calculation.
    				//resetStudentOverallGrade(studentPersonId);
    		
  }

  const getGradebook = () => {
    
    				const {gradebookInit, personId, courseScheduledId, jumpToAssignmentId} = props
    				gradebookInit(personId, courseScheduledId, jumpToAssignmentId, null, false); //false = don't clear redux locally.
    		
  }

  const changeFilters = (event) => {
    
    				let newState = Object.assign({}, state)
    				let field = event.target.name
    				newState[field] = event.target.value
    				setState(newState)
    		
  }

  const setVisitedResponse = (studentAssignmentResponseId) => {
    setOrigGradebook(gradebook.map(m => {
    						if (m.studentAssignmentResponseId === studentAssignmentResponseId) m.responseVisitedTypeCode = 'VISITED'
    						return m
    				}))
  }

  const handleAddOrUpdateOpen = (assignment, clickedUrl, student, clickedOnResponse) => {
    
    				setIsShowingModal_response(true); setAssignment(assignment); setClickedUrl(clickedUrl); setStudent(student); setClickedOnResponse(clickedOnResponse)
    				setVisitedResponse(clickedUrl.studentAssignmentResponseId)
    		
  }

  const handleAddOrUpdateClose = () => {
    setIsShowingModal_response(false); setAssignmentId(''); setStudent({})

  }
  const handleAddOrUpdateSave = (studentResponse, assignmentId) => {
    
    				const {addOrUpdateStudentResponse, courseEntryId, courseScheduledId, personId, gradebookInit} = props
    				
    	      addOrUpdateStudentResponse(personId, courseEntryId, courseScheduledId, studentResponse, assignmentId, () => gradebookInit(personId, courseScheduledId, jumpToAssignmentId, singleAssignmentId, false))
    	  
  }

  const handleNumberTooLargeOpen = () => {
    return setIsShowingModal_numberTooLarge(true)
  }

  const handleNumberTooLargeClose = () => {
    return setIsShowingModal_numberTooLarge(false)
  }

  const recallInitRecords = () => {
    
    				const {gradebookInit, personId, courseScheduledId} = props
    				
    				gradebookInit(personId, courseScheduledId, jumpToAssignmentId, singleAssignmentId)
    				handleAddOrUpdateClose()
    		
  }

  const toggleCheckbox = (name) => {
    
    				let newState = Object.assign({}, state)
    				newState[name] = !newState[name]
    				setState(newState)
    		
  }

  const handleUpdateInterval = (event) => {
    
    				const {personId, updatePersonConfig, getCoursesScheduled, gradebookInit} = props
    				setCourseScheduledorigGradebook({}); setGradebook({}); setJumpToAssignmentId(null); setForceUpdate(true)
    				updatePersonConfig(personId, 'IntervalId', event.target.value, () => { getCoursesScheduled(personId, true); gradebookInit(personId, 0, 0, 0); })
    				navigate('/gradebookEntry')
    		
  }

  const handlePenspringView = (penspringWorkId, assignment) => {
    
    				const {setPenspringTransfer, personId, accessRoles, studentPersonId} = props
    				let transfer = {
    						assignmentId: assignment.assignmentId,
    						transferCode: 'STARTWRITING',
    						workId: penspringWorkId,
    						ownerPersonId: accessRoles.facilitator ? studentPersonId : personId,
    						editorPersonId: accessRoles.facilitator ? personId : assignment.facilitatorPersonId,
    						isTeacher: accessRoles.facilitator,
    						//courseEntryId: course && course.courseEntryId,
    				}
    				setPenspringWorkId(penspringWorkId); setSendToHiddenPenspringLink(true)
    				setPenspringTransfer(personId, transfer)
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`Check the brower's tab for the penspring file if it doesn't open up automatically.`}/></div>)
    		
  }

  const handleUpdateSchoolYear = ({target}) => {
    
    				const {personId, updatePersonConfig, getCoursesScheduled, gradebookInit} = props
    				setCourseScheduledId(0)
    				updatePersonConfig(personId, 'SchoolYearId', target.value, () => { getCoursesScheduled(personId, true); gradebookInit(personId, 0, 0, 0); })
    				navigate('/gradebookEntry')
    		
  }

  const handleSelectedLearningPathway = ({target}) => {
    
    				setLearningPathwayId(target.value)
    		
  }

  const hasGradeOverwrite = (field, studentPersonId) => {
    
            const {personConfig, gradebook} = props
            //let localGradebook = Object.assign({}, props.gradebook);
    				let gradeOverwrites = gradebook && gradebook.gradeOverwrites ? gradebook.gradeOverwrites : []
    				let gradeOverwrite = gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => m.studentPersonId === studentPersonId && m.intervalId === personConfig.intervalId)[0]
    				return gradeOverwrite && gradeOverwrite[field] ? gradeOverwrite[field] : ''
    		
  }

  const toggleCheckboxOverwrite = (field, studentPersonId) => {
    
            const {personId, setGradeOverwrite, course, personConfig} = props
            let localGradebook = props.gradebook
            let gradeOverwrites = localGradebook.gradeOverwrites ? localGradebook.gradeOverwrites : []
            let gradeOverwrite = gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => m.studentPersonId === studentPersonId && m.intervalId === personConfig.intervalId)[0]
            gradeOverwrites = (gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => m.studentPersonId !== studentPersonId)) || []
            let option = gradeOverwrite ? gradeOverwrite : {studentPersonId, [field]: true }
            if (field.toLowerCase() === 'incomplete') {
                option.passed = false
                option.withdrawn = false
                setGradeOverwrite(personId, course.courseScheduledId, studentPersonId, personConfig.intervalId, 'incomplete', !hasGradeOverwrite('incomplete', studentPersonId))
            } else if (field.toLowerCase() === 'passed') {
                option.incomplete = false
                option.withdrawn = false
                setGradeOverwrite(personId, course.courseScheduledId, studentPersonId, personConfig.intervalId, 'passed', !hasGradeOverwrite('passed', studentPersonId))
            } else if (field.toLowerCase() === 'withdrawn') {
                option.incomplete = false
                option.passed = false
                setGradeOverwrite(personId, course.courseScheduledId, studentPersonId, personConfig.intervalId, 'withdrawn', !hasGradeOverwrite('withdrawn', studentPersonId))
            }
            gradeOverwrites = gradeOverwrites ? gradeOverwrites.concat(option) : [option]
            localGradebook.gradeOverwrites = gradeOverwrites
            setOrigGradebook(localGradebook)
        
  }

  const getLetterGrade = (gradePercent) => {
    
    				const {gradeScales} = props
    				let gradeScale = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => o.lowValue <= gradePercent && o.highValue >= gradePercent)[0]
    				let highestGrade = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => Number(o.highValue) === 100)[0]
    				highestGrade = highestGrade && highestGrade.letter
    				return gradePercent > 100
    						? highestGrade
    								? highestGrade
    								: 'A'
    						: gradeScale
    								? gradeScale.letter
    								: ''
    		
  }

  const handleSetMultScoreColumnOpen = (assignmentId) => {
    return setIsShowingModal_columnMultScore(true); setAssignmentId(assignmentId)

  }
  const handleSetMultScoreColumnClose = () => {
    return setIsShowingModal_columnMultScore(false); setAssignmentId('')

  }
  const handleSetMultScoreColumn = (multScore) => {
    
    				const {personId, setGradebookScoreColumnZero, courseScheduledId} = props
    				
    				handleSetMultScoreColumnClose()
    				setGradebookScoreColumnZero(personId, courseScheduledId, assignmentId, multScore, getGradebook)
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`Please wait a moment for the scores to fill in.`}/></div>)
    		
  }

  const handleHover = (hoverAssignmentId) => {
    return setHoverAssignmentId(hoverAssignmentId)
  }

  const handleFinalizeGradeOpen = () => {
    return setIsShowingModal_finalizeGrade(true)

  }
  const handleFinalizeGradeClose = () => {
    return setIsShowingModal_finalizeGrade(false)

  }
  const handleFinalizeGrade = () => {
    
    				const {personId, finalizeGradebookGrades, courseScheduledId, personConfig} = props
    				handleFinalizeGradeClose()
    				finalizeGradebookGrades(personId, courseScheduledId, personConfig.intervalId)
    		
  }

  const handleScroll = () => {
    
    		    const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    				if (scrollTop !== !state.scrollTop) setScrollTop(scrollTop)
    	  
  }

  const hideContextKnowledgeRatingMenu = () => {
    
    				if(document.getElementById('contextKnowledgeRating')) document.getElementById('contextKnowledgeRating').style.display = 'none'
    		
  }

  const showContextKnowledgeRating = (event, studentPersonId, assignmentId) => {
    
            event.stopPropagation()
            event.preventDefault()
            document.getElementById('contextKnowledgeRating').style.display = 'inline'
            document.getElementById('contextKnowledgeRating').style.position = 'fixed'
            document.getElementById('contextKnowledgeRating').style.left = event.clientX - 10
    				document.getElementById('contextKnowledgeRating').style.top = event.clientY + 5
            document.getElementById('contextKnowledgeRating').style.zIndex = '999'
    				setSet_studentPersonId(studentPersonId); setSet_assignmentId(assignmentId)
        
  }

  const checkEscapeKey = (evt) => {
    
            if (evt.key === 'Escape') {
                hideContextKnowledgeRatingMenu()
            }
        
  }

  const chooseRecord = (chosenStudentRow) => {
    return setChosenStudentRow(chosenStudentRow)
    

  }
  const handleSetMultNextSequence = (standardLevelSequence) => {
    
    				const {personId, courseScheduledId, gradebookInit, setStandardLevelSequenceMultiple, jumpToAssignmentId} = props
    				
    				handleSetMultScoreColumnClose()
    				setStandardLevelSequenceMultiple(assignmentId, standardLevelSequence, courseScheduledId, personId, () => gradebookInit(personId, courseScheduledId, jumpToAssignmentId, null, false))
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`Please wait a moment for the scores to fill in.`}/></div>)
    		
  }

  const onStandardLevelSet = (studentPersonId, assignmentId, standardLevelSequence) => {
    
    				const {setStandardLevelSequence, courseScheduledId, personId} = props
    				hideContextKnowledgeRatingMenu()
    				setStandardLevelSequence(studentPersonId, assignmentId, standardLevelSequence, courseScheduledId, personId)
    		
  }

  const {personId, companyConfig={}, courses, fetchingRecord, accessRoles={}, courseEntryId, contentTypes, removeStudentResponse, schoolYears,
  							visitedColor, setResponseVisitedType, hiddenResponseCount, intervals, personConfig, gradeScales, myFrequentPlaces,
                setLocalGradebookOverwritePercent, setMyFrequentPlace, standardsRatings, passFailRatings, learningPathways, setGradeOverwrite,
                setEditMode} = props
        
  
        let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly
  			let course = (courseScheduledId && courses && courses.length > 0 && courses.filter(m => m.courseScheduledId === courseScheduledId)[0]) || {}
  			let coursesLocal = !!learningPathwayId && learningPathwayId !== '0'
  					? courses && courses.length > 0 && courses.filter(m => m.learningPathwayId === learningPathwayId)
  					: courses
  
        const fullAssignmentList = gradebook && gradebook.assignments
  			let localAssignments = gradebook && gradebook.assignments
        if (courseScheduledId && (!localAssignments || localAssignments.length === 0) && !(fetchingRecord && fetchingRecord.gradebookEntry))
            localAssignments = [{ id: 'EMPTY', title: 'No assignments entered yet'}]
  
  			let gradebookLocal = Object.assign({}, gradebook)
  			if (gradebookLocal && gradebookLocal.studentScores && gradebookLocal.studentScores.length > 0 && studentPersonId) {
  					gradebookLocal.studentScores = gradebookLocal.studentScores.filter(m => m.studentPersonId === studentPersonId)
  			}
  
  	 		let headings = [{label: '', cellColor: 'white'}]
  			let data = []
  			let foundJumpTo = !jumpToAssignmentId || jumpToAssignmentId === guidEmpty || jumpToAssignmentId === "0" ? true : false
  			let matchesFilter = false
  			let isValidJump = gradebookLocal && gradebookLocal.assignments && gradebookLocal.assignments.length > 0 && gradebookLocal.assignments.filter(j => j.assignmentId === jumpToAssignmentId)[0]
  			if (!isValidJump) { jumpToAssignmentId = null; foundJumpTo = true; }
  
  			gradebookLocal && localAssignments && localAssignments.length > 0 && localAssignments.forEach((m, i) => {
  					if (!foundJumpTo && m.assignmentId === jumpToAssignmentId) foundJumpTo = true
  					matchesFilter = !contentTypeId || contentTypeId === "0"
  					 		? true
  							: m.contentTypeId === contentTypeId
  									? true
  									: false
  
  					if (foundJumpTo && matchesFilter) {
  							headings.push({
  									verticalText: true,
  									label: <div className={classes(styles.narrowLine, styles.row)}>
  														{m.contentTypeCode !== 'BENCHMARK' && m.id !== 'EMPTY' &&
  																<div data-rh={'Set blank scores (excludes self-paced)'} onClick={() => handleSetMultScoreColumnOpen(m.assignmentId)}
  																				onMouseEnter={() => handleHover(m.assignmentId)} onMouseLeave={handleHover} className={styles.moreBottomMargin}>
  																		<Icon pathName={'box_down_arrow'} premium={true} className={styles.iconHeading} fillColor={hoverAssignmentId === m.assignmentId ? 'blue' : ''}/>
  																</div>
  														}
  														<div>
  																<div className={classes(styles.row, styles.labelHead, (m.contentTypeName === 'Exam' ? styles.testColor : ''))}>
  																		{m.hasAssessmentQuestions &&
  																				<div onClick={() => navigate(`/assessmentCorrectSameAll/${m.assignmentId}/${m.assessmentId}`)}>
  																						<Icon pathName={'list3'} className={styles.iconInline} fillColor={'blue'}/>
  																				</div>
  																		}
  																		<div className={m.hasAssessmentQuestions ? globalStyles.link : ''}
  																						onClick={m.hasAssessmentQuestions
  																												? () => navigate(`/assessmentCorrectSameAll/${m.assignmentId}/${m.assessmentId}`)
  																												: () => {}
  																						}>
  																				{m.title && m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title}
  																		</div>
  																</div>
                                  {m.id !== 'EMPTY' &&
      																<div className={classes(styles.row, styles.labelSubhead)}>
      																		points:<div className={styles.lineSub}>{m.totalPoints}</div>
      																		{m.dueDate && <div className={classes(styles.labelSubhead, styles.moreLeft)}>{`due:`}</div>}
      																		{m.dueDate && <div className={styles.lineSub}><DateMoment date={m.dueDate} format={'D MMM'}/></div>}
      																</div>
                                  }
  														</div>
  												</div>,
  									//reactHint:  m.title + '  (points: ' + m.totalPoints + ')  ' + (m.dueDate ? '[due: ' + moment(m.dueDate).format('D MMM') + ']' : '')
  							})
  					}
  			})
  
  			let assignmentContentTypes = gradebookLocal && gradebookLocal.contentTypes
  
        if (!isLevelOnly) {
      			if (assignmentContentTypes && assignmentContentTypes.length > 0) {
      					assignmentContentTypes = doSort(assignmentContentTypes, { sortField: 'sequence', isAsc: true, isNumber: true })
      					assignmentContentTypes.forEach(c => {
      							headings.push({
      									verticalText: true,
      									label: <div className={styles.narrowLine}>
      														<div className={styles.labelHead}>{c.contentTypeName}</div>
      												</div>,
      							})
      					})
      			}
            if (courseScheduledId && (!localAssignments || localAssignments.length === 0) && !(fetchingRecord && fetchingRecord.gradebookEntry)) {
          			headings.push({
          					verticalText: true,
          					label: <div className={styles.narrowLine}>
          										<div className={styles.labelHead}><L p={p} t={`Overall Grade`}/></div>
          								</div>,
          			})
          			headings.push({
          					verticalText: true,
          					label: <div className={styles.narrowLine}>
          										<div className={styles.labelHead}><L p={p} t={`Grade Overwrite`}/></div>
          								</div>,
          			})
            }
        }
  
  			let students = []
  			if (gradebookLocal && gradebookLocal.students && gradebookLocal.students.length > 0)
  					students = gradebookLocal.students
  					if (gradebookLocal.studentNameOrder === 'FIRSTNAME')
  							students = doSort(gradebookLocal.students, { sortField: 'firstName', isAsc: true, isNumber: false })
  
  			if (!showWithdrawnStudents) students = students && students.length > 0 && students.filter(m => !m.withdrawnDate)
  
  			students && students.length > 0 && students.forEach((m, i) => {
  					// let overallGrade = '';  //This was changed!  We get the overall grade from the data directly in the student record now and not a general overall grade collection, studentOverallGrades.
  					// let percentGrade = gradebookLocal.studentOverallGrades && gradebookLocal.studentOverallGrades.length > 0
  					// 		&& gradebookLocal.studentOverallGrades.filter(g => g.personId === m.id).reduce((acc, {percentGrade}) => acc + percentGrade, 0);
  					// let totalContentTypePercent = gradebookLocal.studentOverallGrades && gradebookLocal.studentOverallGrades.length > 0
  					// 		&& gradebookLocal.studentOverallGrades.filter(g => g.personId === m.id).reduce((acc, {scorePercent}) => acc + scorePercent, 0);
            //
  					// if (percentGrade > 0) {
  					// 		percentGrade *= 100;
  					// 		if (totalContentTypePercent < 100 && totalContentTypePercent > 0) {
  					// 				percentGrade /= totalContentTypePercent;
  					// 		}
  					// 		percentGrade = Math.round(percentGrade);
  					// 		let gradeScale = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => o.lowValue <= percentGrade && o.highValue >= percentGrade)[0];
  					// 		overallGrade = gradeScale ? percentGrade + '% ' + gradeScale.letter : percentGrade + '%';
  					// 		if (percentGrade > 100) {
  					// 				let highestGrade = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => Number(o.highValue) === 100)[0];
  					// 				highestGrade = highestGrade && highestGrade.letter;
  					// 				overallGrade += highestGrade ? ' ' + highestGrade : ' A';
  					// 		}
  					// }
  
  					let row = [{
  						cellColor: m.withdrawnDate ? 'tan' : m.selfPaced ? 'response' : m.id === chosenStudentRow ? 'highlight' : i === 0 ? 'white' : '',
  						reactHint: m.withdrawnDate ? `Withdrawn date: ${m.withdrawnDate.substring(0, m.withdrawnDate.indexOf('T'))}` : m.selfPaced ? 'Self-paced' : null,
              clickFunction: () => chooseRecord(m.id),
  						value: <div onClick={() => sendToStudentAssignmentView(m.personId)} className={classes(styles.link, styles.row, styles.lineheight)}>
  										 		{gradebookLocal.studentNameOrder === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName}
  												{m.accredited && <Icon pathName={'shield_check'} premium={true} className={styles.iconSmall} dataRh={'This student is accredited'}/>}
                          <div className={(styles.text, styles.moreLeft)}>{m.overallGrade}</div>
  									  </div>
  					}]
  
  					if (isValidJump) foundJumpTo = false
  
  					gradebookLocal && gradebookLocal.assignments && gradebookLocal.assignments.length > 0 && gradebookLocal.assignments.forEach((s, i) => {
  							if (!foundJumpTo && s.assignmentId === jumpToAssignmentId) foundJumpTo = true
  							matchesFilter = !contentTypeId || contentTypeId === "0"
  							 		? true
  									: s.contentTypeId === contentTypeId
  											? true
  											: false
  
  							if (foundJumpTo && matchesFilter) {
  									let studentScore = gradebookLocal.studentScores && gradebookLocal.studentScores.length > 0 && gradebookLocal.studentScores.filter(t => t.studentPersonId === m.personId && t.assignmentId === s.assignmentId)[0]
  									let fileUploadUrls  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.fileUploadUrl)
  									let websiteLinks  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.websiteLink)
  									let textResponses  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.instructions)
  									let penspringWorks  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.penspringWorkId && t.penspringWorkId !== guidEmpty); // && t.isPenspringSubmitted
  									let hasStudentAssignmentAssign = gradebookLocal.studentAssign && gradebookLocal.studentAssign.length > 0 && gradebookLocal.studentAssign.filter(t => t.studentPersonId === m.personId && t.assignmentId === s.assignmentId)[0]
  									hasStudentAssignmentAssign = hasStudentAssignmentAssign && hasStudentAssignmentAssign.studentPersonId ? true : false
  
  
  									row.push({
  											reactHint: !scrollTop || scrollTop < 250 ? null : s.title,
  											cellColor: m.withdrawnDate ? 'tan' : m.selfPaced ? 'response' : m.id === chosenStudentRow ? 'highlight' : '',
                        clickFunction: () => chooseRecord(m.id),
  											value: <div className={classes(styles.row, (hasStudentAssignmentAssign ? '' : styles.noAssignBackground))} data-rh={hasStudentAssignmentAssign ? null : 'Not assigned to this assignment'} tabIndex={-1}>
  											 					{!hasStudentAssignmentAssign ? <span className={styles.blankSpace} tabIndex={-1}>_</span> : ''}
  																{!hasStudentAssignmentAssign
  																		? ''
  																		: !(accessRoles.learner || accessRoles.observer) || ((accessRoles.learner || accessRoles.observer) && s.gradingType === 'STUDENT')
  																					? <GradingRatingEntry key={i} gradingType={course.gradingType} studentScore={studentScore} studentPersonId={m.personId} assignmentId={s.assignmentId}
  																								standardsRatings={standardsRatings} handleEnterKey={handleEnterKey} handleScore={handleScore} onBlurScore={onBlurScore}
  																								scoredAnswers={studentScore && studentScore.scoredAnswers} onEnterKey={onEnterKey} isEditMode={studentScore && studentScore.editMode}
  																								onPassFailIncrement={onPassFailIncrement} contentTypeCode={s.contentTypeCode} courseScheduledId={courseScheduledId} assessmentId={m.assessmentId}
  																								useType={'GRADEBOOK'} setEditMode={setEditMode} canEditScore={accessRoles.admin || accessRoles.facilitator} //onSTANDARDSRATINGIncrement={onSTANDARDSRATINGIncrement}
  																								hasAssessmentQuestions={s.hasAssessmentQuestions} forceInputBox={(gradebookLocal && gradebookLocal.assignments.length > 0) && (i > gradebookLocal.assignments.length-4*1)}
  																								standards={s.standards} chooseRecord={chooseRecord}/>
  
  																					: <div className={styles.score}>
  																								{(s.contentTypeCode === 'QUIZ' || s.contentTypeCode === 'BENCHMARK') && s.isPublished && m.hasAssessmentQuestions
  																										? (studentScore && studentScore.hasPendingEssayReview > 0) || !studentScore || (!studentScore.score && studentScore.score !== 0)
  																												? 'pending'
  																												: studentScore.score
  																										: studentScore
  																												? studentScore.scoreNotIncluded
  																														? '-'
  																														: studentScore.score === 0
  																																? 0
  																																: studentScore.score
  																												: ''}
  																						</div>
  																}
  																<div className={styles.row}>
  																		{fileUploadUrls && fileUploadUrls.length > 0 && fileUploadUrls.map((f, i) => {
  																				if ((f.responseVisitedTypeCode !== 'DELETED' && f.responseVisitedTypeCode !== 'HIDE')
  																								|| (f.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || f.isTeacherResponse) {
  																						return (
  																								<a key={i} onClick={() => handleAddOrUpdateOpen(s, {...f, label: f.fileUploadUrl}, m, f.fileUploadUrl)} className={f.isTeacherResponse ? styles.teacherResponse : ''}>
  																										<Icon pathName={'document0'} premium={true} className={f.isTeacherResponse ? styles.iconTeacherFile : styles.iconCell}
  																												fillColor={clickedOnResponse === f.fileUploadUrl
  																													? '#e8772e'
  																													: f.isTeacherResponse
  																															? '#8c1d12'
  																															: (accessRoles.admin || accessRoles.facilitator) && f.responseVisitedTypeCode
  																																	? visitedColor[f.responseVisitedTypeCode]
  																																	: ''} />
  																								</a>
  																						)
  																				}
  																				return null
  																		 })}
  																</div>
  																<div className={styles.row}>
  																		{websiteLinks && websiteLinks.length > 0 && websiteLinks.map((w, i) => {
  																				if ((w.responseVisitedTypeCode !== 'DELETED' && w.responseVisitedTypeCode !== 'HIDE')
  																								|| (w.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || w.isTeacherResponse) {
  																						return (
  																								<a key={i} href={w.websiteLink.indexOf('docs.google') > -1 ? null : w.websiteLink.indexOf('http') === -1 ? 'http://' + w.websiteLink : w.websiteLink}
  																												onClick={() => handleAddOrUpdateOpen(s, {label: w.websiteLink, text: w.websiteLink.indexOf('http') === -1 ? 'http://' + w.websiteLink : w.websiteLink, flag: w.isTeacherResponse}, m, w.websiteLink)}
  																												className={w.isTeacherResponse ? styles.teacherResponse : ''} target={'_link'}>
  																										<Icon pathName={'link2'} premium={true} className={w.isTeacherResponse ? styles.iconTeacher : styles.iconCell}
  																												fillColor={clickedOnResponse === w.websiteLink
  																													? '#e8772e'
  																													: w.isTeacherResponse
  																															? '#8c1d12'
  																															: (accessRoles.admin || accessRoles.facilitator) && w.responseVisitedTypeCode
  																																	? visitedColor[w.responseVisitedTypeCode]
  																																	: ''} />
  																								</a>
  																						)
  																				}
  																				return null
  																		 })}
  																</div>
  																{textResponses && textResponses.length > 0 && textResponses.map((t, i) => {
  																		if ((t.responseVisitedTypeCode !== 'DELETED' && t.responseVisitedTypeCode !== 'HIDE')
  																						|| (t.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || t.isTeacherResponse) {
  
  																				return (
  																						<a key={i} onClick={() => handleAddOrUpdateOpen(s, {...t, isTextResponse: true}, m, t.studentAssignmentResponseId)} className={t.isTeacherResponse ? styles.teacherResponse : ''}
  																										data-rh={t.instructions.length > 15 ? t.instructions.substring(0, 15) + '...' : t.instructions} tabIndex={-1}>
  																								<Icon pathName={'comment_edit'} premium={true} className={t.isTeacherResponse ? styles.iconTeacher : styles.iconCell} tabIndex={-1}
  																										fillColor={clickedOnResponse === t.studentAssignmentResponseId
  																																	? '#e8772e'
  																																	: t.isTeacherResponse
  																																			? '#8c1d12'
  																																			: (accessRoles.admin || accessRoles.facilitator) && t.responseVisitedTypeCode
  																																					? visitedColor[t.responseVisitedTypeCode]
  																																					: ''} />
  																						</a>
  																				)
  																		}
  																		return null
  																 })}
  																 {penspringWorks && penspringWorks.length > 0 && penspringWorks.map((p, i) => {
   																		if (p.penspringSubmittedDate && ((p.responseVisitedTypeCode !== 'DELETED' && p.responseVisitedTypeCode !== 'HIDE')
   																						|| (p.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || p.isTeacherResponse)) {
  
   																				return (
   																						<a key={i} onClick={() => handlePenspringView(p.penspringWorkId, p)} className={p.isTeacherResponse ? styles.teacherResponse : ''} data-rh={p.workName}>
  																								<img src={penspringSmall} alt="PS"
  																										className={classes(styles.penspringIcon, (p.isTeacherResponse
  																												? styles.iconTeacherFile
  																												: clickedOnResponse === p.penspringWorkId
  																														? styles.visited
  																														: p.isTeacherResponse
  																																? styles.teacherResponse
  																																: ''))}
  																								 />
  
   																						</a>
   																				)
   																		}
   																		return null
   																 })}
  																 <a id={'hiddenPenspringLink'} href={`${penspringHost}/lms/${personId}/${penspringWorkId}`} target={`_${penspringWorkId}`} tabIndex={-1}> </a>
  														 </div>
  									})
  							}
  					})
  
  					//content type categories followed by the overallgrade.
  					!isLevelOnly && assignmentContentTypes && assignmentContentTypes.length > 0 && assignmentContentTypes.forEach(c => {
  							let contentScore = gradebookLocal.studentContentScores && gradebookLocal.studentContentScores.length > 0 &&
  									gradebookLocal.studentContentScores.filter(sc => sc.contentTypeId === c.contentTypeId && sc.studentPersonId === m.personId)[0]
  
  							if (contentScore && contentScore.totalPoints) {
  									let percent = contentScore.totalPoints ? Math.round(contentScore.totalScores / contentScore.totalPoints * 100) : 0
  									row.push({
  											cellColor: m.withdrawnDate ? 'tan' : m.selfPaced ? 'response' : m.id === chosenStudentRow ? 'highlight' : '',
                        clickFunction: () => chooseRecord(m.id),
  											id: c.contentTypeId + '~' + m.personId,
  											value: <div className={classes(styles.boldText, styles.row)}>{`${contentScore.totalScores} / ${contentScore.totalPoints}`}<div className={styles.boldText}>{`${percent}%`}</div></div>
  									})
  							} else {
  									row.push({
  											cellColor: m.withdrawnDate ? 'tan' : m.selfPaced ? 'response' : m.id === chosenStudentRow ? 'highlight' : '',
                        clickFunction: () => chooseRecord(m.id),
  											id: c.contentTypeId + '~' + m.personId,
  											value: ''
  									})
  							}
  					})
  
  					!isLevelOnly && row.push({value: <div className={styles.text}>{m.overallGrade}</div>})
  
  					if (!isLevelOnly && (course.gradingType === 'TRADITIONAL' || course.gradingType === 'STANDARDSRATING')) {
  							row.push({
  								cellColor: m.withdrawnDate ? 'tan' : m.selfPaced ? 'response' : m.id === chosenStudentRow ? 'highlight' : '',
                  clickFunction: () => chooseRecord(m.id),
  								value: <div className={styles.row}>
                            {hasGradeOverwrite('incomplete', m.personId)
                                ? <div className={styles.boldText}>I</div>
                                : hasGradeOverwrite('passed', m.personId)
                                    ? <div className={styles.boldText}>P</div>
                                    : hasGradeOverwrite('withdrawn', m.personId)
                                        ? <div className={styles.boldText}>W</div>
                                        : showGradeOverwrite
                                            ? <div className={classes(styles.row, styles.littleRight)} data-rh={'Overwrite grade'}>
                        													<InputText size={"super-short"}
                        															name={m.personId}
                        															value={hasGradeOverwrite('gradePercent', m.personId)}
                        															numberOnly={true}
                        															maxLength={3}
                        															onChange={(event) => setLocalGradebookOverwritePercent(m.personId, personConfig.intervalId, event.target.value)}
                                                      onBlur={() => setGradeOverwrite(personId, course.courseScheduledId, m.personId, personConfig.intervalId, 'gradePercent', event.target.value)}/>
                        													{hasGradeOverwrite(m.personId) &&
                        															<div className={styles.letterGrade}>{getLetterGrade(hasGradeOverwrite(m.personId))}</div>
                        													}
                        											</div>
                                            : ''
                            }
                            {showIncompeteWithdrawnPassed &&
                                <div className={styles.row}>
                                    <div className={styles.checkboxPosition}>
            														<Checkbox
            																id={`incomplete`}
            																label={<L p={p} t={`Incomplete`}/>}
            																checked={hasGradeOverwrite('incomplete', m.personId)}
            																onClick={() => toggleCheckboxOverwrite('incomplete', m.personId)}
                                            checkboxClass={styles.checkboxItself} />
            												</div>
                                    <div className={styles.checkboxPosition}>
            														<Checkbox
            																id={`withdrawn`}
            																label={<L p={p} t={`Withdrawn`}/>}
            																checked={hasGradeOverwrite('withdrawn', m.personId)}
            																onClick={() => toggleCheckboxOverwrite('withdrawn', m.personId)}
                                            checkboxClass={styles.checkboxItself} />
            												</div>
                                    <div className={styles.checkboxPosition}>
            														<Checkbox
                                            id={`passed`}
                                            label={<L p={p} t={`Passed`}/>}
                                            checked={hasGradeOverwrite('passed', m.personId)}
                                            onClick={() => toggleCheckboxOverwrite('passed', m.personId)}
                                            checkboxClass={styles.checkboxItself} />
            												</div>
                                </div>
                            }
                            {courseScheduledId && !(localAssignments && localAssignments.length === 0) && !(fetchingRecord && fetchingRecord.gradebookEntry)
                                    && !showIncompeteWithdrawnPassed && !showGradeOverwrite &&
                                <Checkbox
                                    id={`placeHolder`}
                                    label={''}
                                    disabled={true}
                                    checked={false}
                                    onClick={() => {}}
                                    className={styles.placeHolder} />
                            }
                        </div>
  							})
  					}
  					data.push(row)
  			})
  
  			let responseData = (student && gradebook && gradebook.studentScores && gradebook.studentScores.length > 0 && gradebook.studentScores.filter(m => m.studentPersonId === student.studentPersonId)[0]) || {}
  			responseData = (responseData && responseData.scoreResponses && responseData.scoreResponses.length > 0 && responseData.scoreResponses.filter(m => m.assignmentId === assignmentId)[0]) || {}
  
        return (
          <div className={styles.container}>
              <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                	{`Gradebook ${course.gradingType === 'STANDARDSRATING' ? '(Standards-based)' : course.gradingType === 'PASSFAIL' ? '(Pass / Fail)' : ''}`}
              </div>
  						<div className={styles.row}>
  								<Icon pathName={'printer'} premium={true} className={classes(styles.moreLeft, styles.iconLessRight, styles.printerUp)}/>
  								<ReactToPrint trigger={() => <a href="#" className={classes(styles.moreRight, styles.link)}><L p={p} t={`Print`}/></a>} content={() => componentRef}/>
  								<Link to={'/assignmentList/' + courseEntryId} className={classes(styles.row, styles.link, styles.moreRight)}>
  										<Icon pathName={'plus'} className={classes(styles.iconSmaller, styles.littleTop)} fillColor={'green'}/>
  										<L p={p} t={`Create or modify assignments`}/>
  								</Link>
  								<Link to={'/studentAssignmentAssign/' + courseScheduledId} className={classes(styles.row, styles.link, styles.moreRight)}>
  										<Icon pathName={'pencil0'} premium={true} className={classes(styles.iconSmaller, styles.littleTop)}/>
  										<L p={p} t={`Manage assignments assigned to students`}/>
  								</Link>
  						</div>
              <div className={classes(styles.formLeft, styles.rowWrap)}>
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
  												value={personConfig.intervalId}
  												options={intervals}
  												noBlank={true}
  												height={`medium`}
  												onChange={handleUpdateInterval}/>
  								</div>
  								{accessRoles.admin &&
  										<div className={styles.moreBottomMargin}>
  												<SelectSingleDropDown
  														id={`learningPathwayId`}
  														name={`learningPathwayId`}
  														label={companyConfig.urlcode === 'Manheim' ? `Content Area` : <L p={p} t={`Subject/Discipline`}/>}
  														value={learningPathwayId}
  														options={learningPathways || []}
  														height={`medium`}
  														onChange={handleSelectedLearningPathway}/>
  										</div>
  								}
  						</div>
  						<div className={styles.formLeft}>
                  <SelectSingleDropDown
                      id={`courseScheduledId`}
                      name={`courseScheduledId`}
                      label={<L p={p} t={`Course`}/>}
                      value={courseScheduledId || ''}
                      options={coursesLocal}
                      className={classes(styles.singleDropDown, styles.moreBottomMargin)}
                      height={`medium`}
                      noBlank={false}
                      onChange={recallPage} />
  						</div>
  						{fullAssignmentList && fullAssignmentList.length > 0 &&
  								<div className={classes(styles.formLeft, styles.rowWrap)}>
  										<div>
  												<SelectSingleDropDown
  				                    id={`jumpToAssignmentId`}
  				                    label={<L p={p} t={`Jump to:`}/>}
  				                    value={jumpToAssignmentId || ''}
  				                    options={gradebookLocal && gradebookLocal.assignments}
  				                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  				                    height={`medium`}
  				                    onChange={recallPageWithJump} />
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={`contentTypeId`}
  														name={`contentTypeId`}
  														label={<L p={p} t={`Assignment types`}/>}
  														value={contentTypeId || ''}
  														options={contentTypes}
  														className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  														height={`medium`}
  														onChange={changeFilters} />
  										</div>
  										{(accessRoles.admin || accessRoles.facilitator) && hiddenResponseCount > 0 &&
  												<div>
  														<Checkbox
  																id={`showHideResponseTypes`}
  																label={<L p={p} t={`Show hidden responses visited (${hiddenResponseCount})`}/>}
  																checked={showHideResponseTypes}
  																onClick={() => toggleCheckbox('showHideResponseTypes')}
  																labelClass={styles.labelCheckbox}
  																className={styles.checkbox} />
  												</div>
  										}
  								</div>
  						}
              {(accessRoles.admin || accessRoles.facilitator) &&
                  <div className={classes(styles.moreTop, styles.row)}>
                      <Checkbox
                          id={`showWithdrawnStudents`}
                          label={<L p={p} t={`Show withdrawn students`}/>}
                          checked={showWithdrawnStudents}
                          onClick={() => toggleCheckbox('showWithdrawnStudents')}
                          labelClass={styles.labelCheckbox}
                          className={styles.checkbox} />
                      <Checkbox
                          id={`showIncompeteWithdrawnPassed`}
                          label={<L p={p} t={`Show controls to set Incomplete, Withdrawn, or Passed`}/>}
                          checked={showIncompeteWithdrawnPassed}
                          onClick={() => toggleCheckbox('showIncompeteWithdrawnPassed')}
                          labelClass={styles.labelCheckbox}
                          className={styles.checkbox} />
                      <Checkbox
                          id={`showGradeOverwrite`}
                          label={<L p={p} t={`Show controls to set Grade Overwrite`}/>}
                          checked={showGradeOverwrite}
                          onClick={() => toggleCheckbox('showGradeOverwrite')}
                          labelClass={styles.labelCheckbox}
                          className={styles.checkbox} />
                  </div>
              }
  						{(course.gradingType === 'STANDARDSRATING' || course.gradingType === 'PASSFAIL') &&
  								<GradingRatingLegend standardsRatings={standardsRatings} passFailRatings={passFailRatings} gradingType={course.gradingType}
  										standardsRatingTableId={course.standardsRatingTableId}/>
  						}
              <div className={classes(styles.formLeft, styles.topMargin)} ref={el => (componentRef = el)}>
  								<Loading isLoading={fetchingRecord && fetchingRecord.gradebookEntry} />
                  {courseScheduledId !== "0" &&
  										<EditTableFreezeLeft headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}/>
  								}
  								{gradebook && gradebook.assignments && gradebook.assignments.length > 0 && courseScheduledId && !(fetchingRecord && fetchingRecord.gradebook) &&
  										<div className={styles.row}>
  												<div className={styles.moreRight}>
  														<ExcelGradebookEntry gradebook={gradebook} gradeScales={gradeScales}/>
  												</div>
  												<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Finalize`}/>} onClick={handleFinalizeGradeOpen}/>
  												<TextDisplay label={'Last Grade Finalize Date'}
  														text={gradebook.studentGradeFinalDate
  																		? <DateMoment date={gradebook.studentGradeFinalDate} hideIfEmpty={true} minusHours={0}/>
  																		: <div className={styles.notSubmitted}><L p={p} t={`Not yet submitted`}/></div>
  																 } className={styles.lotTop}/>
  										</div>
  								}
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Gradebook`}/>} path={'gradebookEntry'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal &&
  								<div></div>
              }
  						{isShowingModal_instructions &&
  								<MessageModal handleClose={handleInstructionsClose} heading={assignmentName}
  									 explain={instructions} onClick={handleInstructionsClose} />
  						}
  						{isShowingModal_numberTooLarge &&
  								<MessageModal handleClose={handleNumberTooLargeClose} heading={<L p={p} t={`Number Greater than 999`}/>}
  									 explainJSX={<L p={p} t={`The score entered is greater than 999.  Please enter a number less than 999.`}/>}  onClick={handleNumberTooLargeClose} />
  						}
  						{isShowingModal_response &&
  								<div className={styles.fullWidth}>
  										<DocumentResponseModal handleClose={handleAddOrUpdateClose} showTitle={true} handleSubmit={handleAddOrUpdateSave}
  												responseData={responseData} assignmentId={assignment.assignmentId} personId={personId} companyConfig={companyConfig}
  												course={course} recallInitRecords={recallInitRecords} accessRoles={accessRoles} courseScheduledId={courseScheduledId}
  												handleRemove={removeStudentResponse} clickedUrl={clickedUrl} student={student} setResponseVisitedType={setResponseVisitedType}
  												studentAssignmentsInit={() => {}} assignment={assignment}/>
  								</div>
  						}
  						{isShowingModal_columnMultScore &&
  								<InputGradebookMultipleEntry handleClose={handleSetMultScoreColumnClose} heading={<L p={p} t={`Set empty scores?`}/>} isLevelOnly={isLevelOnly}
  									 onClick={isLevelOnly ? handleSetMultNextSequence : handleSetMultScoreColumn} standardsRatings={standardsRatings} />
  						}
  						{isShowingModal_finalizeGrade &&
  								<MessageModal handleClose={handleFinalizeGradeClose} heading={<L p={p} t={`Finalize Grades?`}/>} isConfirmType={true}
  									 explainJSX={<L p={p} t={`Are you sure you want to finalize grades?  The students' transcripts will be updated.`}/>}
  									 onClick={handleFinalizeGrade} />
  						}
  						<div id={`contextKnowledgeRating`} style={{display: 'none'}}>
  								<ContextKnowledgeRating personId={personId} studentPersonId={set_studentPersonId} assignmentId={set_assignmentId} standardsRatings={standardsRatings}
  										onClick={onStandardLevelSet} />
  						</div>
          </div>
      )
}

export default withAlert(GradebookEntryView)


//See line 315: maxNumber={Number(s.totalPoints || 0) + Number(s.extraCredit || 0)}

//See <input where I took this out.  I can't remember what it was used for, but it is causing an error. Oh, it was for the teacher to make a response to homework when there is not a homework response to start with from the student.
//onDoubleClick={(accessRoles.admin || accessRoles.facilitator) ? () => this.handleAddOrUpdateOpen(s.assignmentId, null, m) : () => {}}
