import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {penspringHost} from '../../penspring_host'
import {apiHost} from '../../api_host'
import * as styles from './StudentAssignmentsView.css'
const p = 'StudentAssignmentsView'
import L from '../../components/PageLanguage'
import psCheckmark from '../../assets/ps_checkmark.png'
import psOverdue from '../../assets/ps_overdue.png'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import InputText from '../../components/InputText'
import TextDisplay from '../../components/TextDisplay'
import GradingRatingEntry from '../../components/GradingRatingEntry'
import GradingRatingLegend from '../../components/GradingRatingLegend'
import AssignmentResponseModal from '../../components/AssignmentResponseModal'
import LinkDisplay from '../../components/LinkDisplay'
import DateTimePicker from '../../components/DateTimePicker'
import InputDataList from '../../components/InputDataList'
import Checkbox from '../../components/Checkbox'
import MessageModal from '../../components/MessageModal'
import ContextKnowledgeRating from '../../components/ContextKnowledgeRating'
import DocumentResponseModal from '../../components/DocumentResponseModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {doSort} from '../../utils/sort'
import { withAlert } from 'react-alert'
import ReactToPrint from "react-to-print"

function StudentAssignmentsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [scores, setScores] = useState([])
  const [chosenAssignmentId, setChosenAssignmentId] = useState(props.params && props.params.chosenAssignmentId)
  const [isShowingModal_response, setIsShowingModal_response] = useState(false)
  const [isShowingModal_document, setIsShowingModal_document] = useState(false)
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(false)
  const [isShowingNotYetSubmitted, setIsShowingNotYetSubmitted] = useState(false)
  const [hideSearch, setHideSearch] = useState(true)
  const [filters, setFilters] = useState({
							partialNameText: '',
							dueDateFrom: '',
							dueDateTo: '',
							contentTypes: [],
							showSet: 'all',
							pastDue: '',
							completed: '',
							incomplete: '',
							pendingScore: ''
					})
  const [partialNameText, setPartialNameText] = useState('')
  const [dueDateFrom, setDueDateFrom] = useState('')
  const [dueDateTo, setDueDateTo] = useState('')
  const [contentTypes, setContentTypes] = useState([])
  const [showSet, setShowSet] = useState('all')
  const [pastDue, setPastDue] = useState('')
  const [completed, setCompleted] = useState('')
  const [incomplete, setIncomplete] = useState('')
  const [pendingScore, setPendingScore] = useState('')
  const [isInit, setIsInit] = useState(undefined)
  const [localGradeOverwrite, setLocalGradeOverwrite] = useState(undefined)
  const [sendToHiddenPenspringLink, setSendToHiddenPenspringLink] = useState(undefined)
  const [isShowingFileUpload_course, setIsShowingFileUpload_course] = useState(undefined)
  const [isShowingModal_removeCourseDoc, setIsShowingModal_removeCourseDoc] = useState(undefined)
  const [instructions, setInstructions] = useState(undefined)
  const [assignmentName, setAssignmentName] = useState(undefined)
  const [isShowingFileUpload_assignment, setIsShowingFileUpload_assignment] = useState(undefined)
  const [isShowingModal_websiteLink, setIsShowingModal_websiteLink] = useState(undefined)
  const [overallGrade, setOverallGrade] = useState(undefined)
  const [assignmentId, setAssignmentId] = useState(undefined)
  const [clickedUrl, setClickedUrl] = useState(undefined)
  const [isShowingModal_fileNotSaved, setIsShowingModal_fileNotSaved] = useState(undefined)
  const [penspringWorkId, setPenspringWorkId] = useState(undefined)
  const [studentPersonId, setStudentPersonId] = useState(undefined)
  const [origGradebook, setOrigGradebook] = useState(undefined)
  const [set_studentPersonId, setSet_studentPersonId] = useState(undefined)
  const [set_assignmentId, setSet_assignmentId] = useState(undefined)

  useEffect(() => {
    
    			document.addEventListener('click', hideContextKnowledgeRatingMenu)
    	
    return () => {
      
      			document.removeEventListener('click', hideContextKnowledgeRatingMenu)
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {standardsRatings, assignmentsInfo} = props
    			
    			let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly
    			if (!isInit && assignmentsInfo && assignmentsInfo.gradeOverwrite) {
    					setIsInit(true); setLocalGradeOverwrite(assignmentsInfo.gradeOverwrite)
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

  const onBlurScore = (assignmentId, notUsed, event) => {
     //The studentPersonId is here just to be consistent with the onBlurScore for the gradingRatingEntry component which is alos used in the gradebookEntry page.
    			const {setGradebookScore, personId, getAssignmentsPendingReview, courseScheduledId, studentPersonId, getStudentSchedule, studentAssignmentsInit} = props
    			setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value, () => {
    					getAssignmentsPendingReview(personId)
    					getStudentSchedule(personId, studentPersonId)
    					studentAssignmentsInit(personId, studentPersonId, courseScheduledId, false)
    			})
    	
  }

  const handleScore = (assignmentId, notUsed, event) => {
      //The studentPersonId isneeded here so that the GradingTypeEntry is consistent with the Gradebook
    			// let scores = scores;
    			// scores[assignmentId] = event.target.value;
    			// setScores(scores);
    			const {setGradebookScorePreBlur, personId, courseScheduledId, studentPersonId } = props
    			setGradebookScorePreBlur(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value)
    			//props.setLocalGradebookScore(studentPersonId, assignmentId, event.target.value);
    			//resetStudentOverallGrade(scores);
    	
  }

  const showStudentResponse = (comments) => {
    
    			alert(comments)
    	
  }

  const reorderSequence = (assignmentId, event) => {
    
    	    const {reorderAssignments, personId} = props
    	    reorderAssignments(personId, assignmentId, event.target.value)
      
  }

  const changeFilter = (event, filterName) => {
    
    			let field = filterName ? filterName : event.target.name
    			filters[field] = event.target.value
    			setFilters(filters)
    	
  }

  const toggleCheckbox = (id) => {
    
  }

  const handleContentType = (id) => {
    
    			let filterContentTypes = filters && filters.contentTypes
    			if (filterContentTypes && filterContentTypes.length > 0 && filterContentTypes.indexOf(id) > -1) {
    					filterContentTypes = filterContentTypes.filter(m => m !== id)
    			} else {
    					filterContentTypes = filterContentTypes ? filterContentTypes.concat(id) : [id]
    			}
    			filters.contentTypes = filterContentTypes
    			setFilters(filters)
    	
  }

  const handleShowSet = (value) => {
    
  }

  const toggleHideSearch = () => {
    
    			setHideSearch(!hideSearch)
    	
  }

  const handleFileUploadOpen = () => {
    return setIsShowingFileUpload_course(true)
    
    

  }
  const handleFileUploadClose = () => {
    return setIsShowingFileUpload_course(false)
    
    

  }
  const handleSubmitFile = () => {
    return handleFileUploadClose()
    
    

  }
  const handleNotYetSubmittedOpen = () => {
    return setIsShowingNotYetSubmitted(true)
    

  }
  const handleNotYetSubmittedClose = () => {
    return setIsShowingNotYetSubmitted(false)
    

  }
  const handleRemoveCourseDocOpen = (courseDocumentId) => {
    return setIsShowingModal_removeCourseDoc(true); setCourseDocumentId(courseDocumentId)

  }
  const handleRemoveCourseDocClose = () => {
    return setIsShowingModal_removeCourseDoc(false)

  }
  const handleRemoveCourseDoc = () => {
    
    			const {removeCourseDocumentFile, personId} = props
    			
    			removeCourseDocumentFile(personId, courseDocumentId)
    			handleRemoveCourseDocClose()
    	
  }

  const fileUploadBuildUrl_assignment = () => {
    
    			const {personId} = props
          
          return `${apiHost}ebi/assignments/fileUpload/` + personId + `/` + assignmentId
      
  }

  const recallAfterFileUpload_assignment = () => {
    
        	const {assignmentsInit, personId, courseEntryId} = props
        	assignmentsInit(personId, courseEntryId)
      
  }

  const recallInitRecords = () => {
    
    			const {studentAssignmentsInit, personId, studentPersonId, courseScheduledId} = props
    			studentAssignmentsInit(personId, studentPersonId, courseScheduledId, false)
    			handleAddOrUpdateClose(); //Close both dialogs since this is called by either one and we don't know which one.
    			handleDocumentClose()
    	
  }

  const handleInstructionsOpen = (assignmentName, instructions) => {
    return setIsShowingModal_instructions(true); setInstructions(instructions); setAssignmentName(assignmentName)
    

  }
  const handleInstructionsClose = () => {
    return setIsShowingModal_instructions(false); setInstructions(''); setAssignmentName('')
    

  }
  const handleFileUploadOpen_assignment = (assignmentId) => {
    return setIsShowingFileUpload_assignment(true); setAssignmentId(assignmentId)

  }
  const handleFileUploadClose_assignment = () => {
    return setIsShowingFileUpload_assignment(false)

  }
  const handleSubmitFile_assignment = () => {
    
          const {assignmentsInit, personId, courseEntryId} = props
          assignmentsInit(personId, courseEntryId)
    			handleFileUploadClose_assignment()
      
  }

  const handleWebsiteLinkOpen = (assignmentId) => {
    return setIsShowingModal_websiteLink(true); setAssignmentId(assignmentId)

  }
  const handleWebsiteLinkClose = () => {
    return setIsShowingModal_websiteLink(false)

  }
  const handleWebsiteLinkSave = (websiteLink) => {
    
    			const {saveAssignmentWebsiteLink, personId} = props
    			
    			saveAssignmentWebsiteLink(personId, assignmentId, websiteLink)
    			handleWebsiteLinkClose()
    	
  }

  const setCompletion = (m) => {
    
    			
    		  let studentResponse = (m.fileUploadUrls && m.fileUploadUrls.length > 0) || (m.websiteLinks && m.websiteLinks.length > 0) || (m.textResponses && m.textResponses.length > 0)
    			let now = new Date()
    			let dueDate = !m.dueDate ? new Date() : new Date(m.dueDate)
    			let iconName = ''
    			let fillColor = ''
    			let statusName = ''
    
    			if (m.score === '0' || m.score === 0 || m.score > 0) {
    					iconName = 'checkmark0'
    					fillColor = 'green'
    					statusName = 'COMPLETE'
    			} else {
    					if (studentResponse) {
    							iconName = 'mailbox_pending'
    							fillColor = '#cc6600'
    							statusName = 'PENDINGSCORE'
    					} else if (now > dueDate) {
    							iconName = 'timer_crossed'
    							fillColor = 'red'
    							statusName = 'PASTDUE'
    					}
    			}
    			return {
    					statusName,
    					cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
    					clickFunction: () => chooseRecord(m.assignmentId),
    					value: <Icon pathName={iconName} premium={true} className={styles.iconStatus} fillColor={fillColor}/>}
    	
  }

  const resetStudentOverallGrade = (incomingScores) => {
    
    			const {assignmentsInfo, gradeScale, weightedScores} = props
    			if (!scores || scores.length === 0) return
    			let totalPossible = 0
    			let studentTotal = 0
    			let weightedCalc = weightedScores && weightedScores.length > 0 && weightedScores.map(m => ({
    					contentTypeId: m.contentTypeId,
    					scorePercent: m.scorePercent,
    					totalPossible: 0,
    					accumulatedScore: 0
    			}))
    
    			scores.length > 0 && scores.forEach(m => {
    					if (m.score >= 0 && m.score !== 'x' && !m.scoreNotIncluded && m.score !== '' && m.score !== null) {
    							//studentTotal = parseFloat(studentTotal, 10) + parseFloat(m.score, 10);
    							assignmentsInfo && assignmentsInfo.assignments && assignmentsInfo.assignments.filter(f => f.assignmentId === m.assignmentId).forEach(a => {
    									if (a.assignmentId === m.assignmentId) {
    											if (weightedCalc && weightedCalc.length > 0) {
    													weightedCalc = weightedCalc.map(c => {
    															if (m.contentTypeId === c.contentTypeId) {
    																	c.totalPossible = isNaN(m.score) || !m.score ? c.totalPossible : Number(c.totalPossible) + Number(a.totalPoints)
    																	c.accumulatedScore = isNaN(m.score) || !m.score ? c.accumulatedScore : Number(c.accumulatedScore) + Number(m.score)
    																	c.hasContentType = true; //This is for the calculation of the final score to include this scorePercent or not.
    															}
    															return c
    													})
    											} else {
    													totalPossible = isNaN(m.score) || !m.score ? totalPossible : parseFloat(totalPossible, 10) + parseFloat(a.totalPoints, 10)
    													studentTotal = isNaN(m.score) || !m.score ? studentTotal : parseFloat(studentTotal) + parseFloat(m.score)
    											}
    									}
    							})
    					}
    			})
    			let percentGrade = 0
    			let letterGrade = ''
    			let contentTypePercentUsed = 0
    
    			//Only use the weightedCalc records according to the contentType of the assignments present for this user.
    			if (assignmentsInfo && assignmentsInfo.gradeOverwrite) {
    					percentGrade = assignmentsInfo.gradeOverwrite
    			} else if (weightedCalc && weightedCalc.length > 0) {
    					weightedCalc.forEach(m => {
    							if (m.totalPossible) {
    									percentGrade = Number(percentGrade) + Number((m.accumulatedScore / m.totalPossible) * (m.scorePercent / 100))
    							}
    							if (m.hasContentType) contentTypePercentUsed += m.scorePercent; //This is for the calculation of the final score to include this scorePercent or not.
    					})
    					percentGrade /= contentTypePercentUsed;  //some content types may not be used yet so the grade would be thrown off until there is an assignment to be used for that part of the weighted calculation.
    					percentGrade = Math.round(percentGrade * 100)
    			} else {
    					percentGrade = totalPossible > 0 ? Math.round(studentTotal / totalPossible * 100) : 0
    			}
    			letterGrade = gradeScale && gradeScale.length > 0 && gradeScale.filter(m => m.lowValue <= percentGrade && m.highValue >= percentGrade)[0]
    			letterGrade = letterGrade && letterGrade.letter ? letterGrade.letter : ''
    			if (percentGrade >= 100) {
    					letterGrade = "A"
    			}
    			setOverallGrade(percentGrade + '%  ' + letterGrade)
    	
  }

  const setClickedId = (clickedId) => {
    return setClickedId(clickedId)
  }

  const handleAddOrUpdateOpen = (assignmentId, clickedUrl, student) => {
    return setIsShowingModal_response(true); setAssignmentId(assignmentId); setClickedUrl(clickedUrl)
    			if (isFileChosen) {
    					handleFileNotSavedOpen()
  }

  const handleAddOrUpdateClose = (isFileChosen) => {
    
    			if (isFileChosen) {
    					handleFileNotSavedOpen()
    			} else {
    					setIsShowingModal_response(false); setAssignmentId(''); setClickedUrl({})
    			}
    	
  }

  const handleAddOrUpdateSave = (studentResponse, assignmentId) => {
    
    			const {addOrUpdateStudentResponse, course, studentPersonId, personId} = props
    			studentResponse.personId = studentPersonId
    			addOrUpdateStudentResponse(personId, course.courseEntryId, course.courseScheduledId, studentResponse, assignmentId, null, studentPersonId); //() => studentAssignmentsInit(studentPersonId, studentPersonId, courseScheduledId, false));
    			handleAddOrUpdateClose()
    	
  }

  const handleFileNotSavedOpen = () => {
    return setIsShowingModal_fileNotSaved(true)

  }
  }
  const handleFileNotSavedClose = () => {
    
    			setIsShowingModal_fileNotSaved(false)
    	
  }

  const handleFileNotSavedCancel = () => {
    
    			handleAddOrUpdateClose()
    			handleFileNotSavedClose()
    	
  }

  const handleDocumentOpen = (assignmentId, clickedUrl, student, clickedOnResponse) => {
    return setIsShowingModal_document(true); setAssignmentId(assignmentId); setClickedUrl(clickedUrl); setClickedOnResponse(clickedOnResponse)

  }
  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setAssignmentId(''); setClickedUrl({})

  }
  const handleDocumentSave = (studentResponse, assignmentId) => {
    
    			const {addOrUpdateStudentResponse, course, personId, studentPersonId} = props
    			studentResponse.personId = studentPersonId
    			studentResponse.isTeacherResponse = true
    			addOrUpdateStudentResponse(personId, course.courseEntryId, course.courseScheduledId, studentResponse, assignmentId, null, studentPersonId); //, () => studentAssignmentsInit(personId, studentPersonId, courseScheduledId, false));
    			handleDocumentClose()
    	
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

  const onPassFailIncrement = (notUsed, assignmentId, passFailSequence=0) => {
    
    			//If knowledgeRatingSequence is blank then it is as good as "Not started" which is 0.
    			//If the nextSequence is greater than the available STANDARDSRATINGs, the sequence wraps around to 0 again to start which might be the user's intention to reset it..
    			const {personId, studentPersonId, passFailRatings, setPassFailSequence, courseScheduledId, studentAssignmentsInit} = props
    			let nextSequence = passFailSequence ? ++passFailSequence : 1
    			nextSequence = nextSequence > passFailRatings.length-1 ? 0 : nextSequence
    			setPassFailSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId, () => studentAssignmentsInit(personId, studentPersonId, courseScheduledId, false))
    	
  }

  const changeStudent = (student) => {
    
    			const {personId, courseEntryId, courseScheduledId, studentAssignmentsInit, courseDocumentsInit} = props
    			setStudentPersonId(student && student.id ? student.id : ''); setStudent(student)
    			studentAssignmentsInit(personId, student && student.id, courseScheduledId)
    			courseDocumentsInit(personId, courseEntryId)
    			navigate(`/studentAssignments/${courseScheduledId}/${student.id}`)
    	
  }

  const handleGradeOverwrite = (studentPersonId, event) => {
    
    			setLocalGradeOverwrite(event.target.value)
    	
  }

  const getLetterGrade = (gradePercent) => {
    
    			const {gradeScale} = props
    			let letterGrade = gradePercent > 0 && gradeScale && gradeScale.length > 0 && gradeScale.filter(o => o.lowValue <= gradePercent && o.highValue >= gradePercent)[0]
    			return gradePercent > 100 ? 'A' : letterGrade ? letterGrade.letter : ''
    	
  }

  const chooseRecord = (chosenAssignmentId) => {
    return setChosenAssignmentId(chosenAssignmentId)
  }

}

export default withAlert(StudentAssignmentsView)

// <div className={styles.moreTop}>
// 		<div className={styles.headLabel}>Show assignments</div>
// 		<RadioGroup
// 				data={[{ label: "All", id: "all" }, { label: "From previous 5 of due date", id: "prev5" } ]}
// 				name={`showSet`}
// 				horizontal={true}
// 				className={styles.radio}
// 				initialValue={filters.showSet}
// 				onClick={this.handleShowSet}/>
// </div>


//See Line 372: maxNumber={Number(m.totalPoints || 0) + Number(m.extraCredit || 0)}


//line 513:  theScore={scores[m.assignmentId] === 0 ? 0 : scores[m.assignmentId] ? scores[m.assignmentId] : ''}
