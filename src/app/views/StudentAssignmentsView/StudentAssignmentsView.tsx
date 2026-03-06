import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import {penspringHost} from '../../penspring_host'
import {apiHost} from '../../api_host'
import styles from './StudentAssignmentsView.css'
const p = 'StudentAssignmentsView'
import L from '../../components/PageLanguage'
import psCheckmark from '../../assets/ps_checkmark.png'
import psOverdue from '../../assets/ps_overdue.png'
import globalStyles from '../../utils/globalStyles.css'
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
    
    			let filters = filters
    			let field = filterName ? filterName : event.target.name
    			filters[field] = event.target.value
    			setFilters(filters)
    	
  }

  const toggleCheckbox = (id) => {
    
    			let filters = filters
    			filters[id] = !filters[id]
    			setFilters(filters)
    	
  }

  const handleContentType = (id) => {
    
    			let filters = filters
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
    
    			let filters = filters
    			filters.showSet = value
    			setFilters(filters)
    	
  }

  const toggleHideSearch = () => {
    
    			setHideSearch(!hideSearch)
    	
  }

  const handleFileUploadOpen = () => {
    return setIsShowingFileUpload_course(true)
      handleFileUploadClose = () => setIsShowingFileUpload_course(false)
      handleSubmitFile = () => handleFileUploadClose()
    
    	handleNotYetSubmittedOpen = () => setIsShowingNotYetSubmitted(true)
      handleNotYetSubmittedClose = () => setIsShowingNotYetSubmitted(false)
    
    	handleRemoveCourseDocOpen = (courseDocumentId) => setIsShowingModal_removeCourseDoc(true); setCourseDocumentId(courseDocumentId)
    	handleRemoveCourseDocClose = () => setIsShowingModal_removeCourseDoc(false)
    	handleRemoveCourseDoc = () => {
    			const {removeCourseDocumentFile, personId} = props
  }

  const handleFileUploadClose = () => {
    return setIsShowingFileUpload_course(false)
      handleSubmitFile = () => handleFileUploadClose()
    
    	handleNotYetSubmittedOpen = () => setIsShowingNotYetSubmitted(true)
      handleNotYetSubmittedClose = () => setIsShowingNotYetSubmitted(false)
    
    	handleRemoveCourseDocOpen = (courseDocumentId) => setIsShowingModal_removeCourseDoc(true); setCourseDocumentId(courseDocumentId)
    	handleRemoveCourseDocClose = () => setIsShowingModal_removeCourseDoc(false)
    	handleRemoveCourseDoc = () => {
    			const {removeCourseDocumentFile, personId} = props
  }

  const handleSubmitFile = () => {
    return handleFileUploadClose()
    
    	handleNotYetSubmittedOpen = () => setIsShowingNotYetSubmitted(true)
      handleNotYetSubmittedClose = () => setIsShowingNotYetSubmitted(false)
    
    	handleRemoveCourseDocOpen = (courseDocumentId) => setIsShowingModal_removeCourseDoc(true); setCourseDocumentId(courseDocumentId)
    	handleRemoveCourseDocClose = () => setIsShowingModal_removeCourseDoc(false)
    	handleRemoveCourseDoc = () => {
    			const {removeCourseDocumentFile, personId} = props
  }

  const handleNotYetSubmittedOpen = () => {
    return setIsShowingNotYetSubmitted(true)
      handleNotYetSubmittedClose = () => setIsShowingNotYetSubmitted(false)
    
    	handleRemoveCourseDocOpen = (courseDocumentId) => setIsShowingModal_removeCourseDoc(true); setCourseDocumentId(courseDocumentId)
    	handleRemoveCourseDocClose = () => setIsShowingModal_removeCourseDoc(false)
    	handleRemoveCourseDoc = () => {
    			const {removeCourseDocumentFile, personId} = props
  }

  const handleNotYetSubmittedClose = () => {
    return setIsShowingNotYetSubmitted(false)
    
    	handleRemoveCourseDocOpen = (courseDocumentId) => setIsShowingModal_removeCourseDoc(true); setCourseDocumentId(courseDocumentId)
    	handleRemoveCourseDocClose = () => setIsShowingModal_removeCourseDoc(false)
    	handleRemoveCourseDoc = () => {
    			const {removeCourseDocumentFile, personId} = props
  }

  const handleRemoveCourseDocOpen = (courseDocumentId) => {
    return setIsShowingModal_removeCourseDoc(true); setCourseDocumentId(courseDocumentId)
    	handleRemoveCourseDocClose = () => setIsShowingModal_removeCourseDoc(false)
    	handleRemoveCourseDoc = () => {
    			const {removeCourseDocumentFile, personId} = props
  }

  const handleRemoveCourseDocClose = () => {
    return setIsShowingModal_removeCourseDoc(false)
    	handleRemoveCourseDoc = () => {
    			const {removeCourseDocumentFile, personId} = props
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
    	handleInstructionsClose = () => setIsShowingModal_instructions(false); setInstructions(''); setAssignmentName('')
    
    	handleFileUploadOpen = () => setIsShowingFileUpload_course(true)
      handleFileUploadClose = () => setIsShowingFileUpload_course(false)
      handleSubmitFile = () => {
          const {courseDocumentsInit, personId, courseEntryId} = props
  }

  const handleInstructionsClose = () => {
    return setIsShowingModal_instructions(false); setInstructions(''); setAssignmentName('')
    
    	handleFileUploadOpen = () => setIsShowingFileUpload_course(true)
      handleFileUploadClose = () => setIsShowingFileUpload_course(false)
      handleSubmitFile = () => {
          const {courseDocumentsInit, personId, courseEntryId} = props
  }

  const handleFileUploadOpen_assignment = (assignmentId) => {
    return setIsShowingFileUpload_assignment(true); setAssignmentId(assignmentId)
      handleFileUploadClose_assignment = () => setIsShowingFileUpload_assignment(false)
      handleSubmitFile_assignment = () => {
          const {assignmentsInit, personId, courseEntryId} = props
  }

  const handleFileUploadClose_assignment = () => {
    return setIsShowingFileUpload_assignment(false)
      handleSubmitFile_assignment = () => {
          const {assignmentsInit, personId, courseEntryId} = props
  }

  const handleSubmitFile_assignment = () => {
    
          const {assignmentsInit, personId, courseEntryId} = props
          assignmentsInit(personId, courseEntryId)
    			handleFileUploadClose_assignment()
      
  }

  const handleWebsiteLinkOpen = (assignmentId) => {
    return setIsShowingModal_websiteLink(true); setAssignmentId(assignmentId)
    	handleWebsiteLinkClose = () => setIsShowingModal_websiteLink(false)
    	handleWebsiteLinkSave = (websiteLink) => {
    			const {saveAssignmentWebsiteLink, personId} = props
  }

  const handleWebsiteLinkClose = () => {
    return setIsShowingModal_websiteLink(false)
    	handleWebsiteLinkSave = (websiteLink) => {
    			const {saveAssignmentWebsiteLink, personId} = props
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
    			let scores = incomingScores ? incomingScores : scores
    			scores = scores && Object.keys(scores).map(key => ({assignmentId: key, score: scores[key]}))
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
    	handleAddOrUpdateClose = (isFileChosen) => {
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
    	handleFileNotSavedClose = () => {
    			setIsShowingModal_fileNotSaved(false)
    	}
    	handleFileNotSavedCancel = () => {
    			handleAddOrUpdateClose()
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
    	handleDocumentClose = () => setIsShowingModal_document(false); setAssignmentId(''); setClickedUrl({})
    	handleDocumentSave = (studentResponse, assignmentId) => {
    			const {addOrUpdateStudentResponse, course, personId, studentPersonId} = props
  }

  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setAssignmentId(''); setClickedUrl({})
    	handleDocumentSave = (studentResponse, assignmentId) => {
    			const {addOrUpdateStudentResponse, course, personId, studentPersonId} = props
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
    
    	handleEnterKey = (assignmentId, studentPersonId, event) => {
    			if(event.key === "Enter") {
    					moveToNextScoreDown(event)
  }

  const handleEnterKey = (assignmentId, studentPersonId, event) => {
    
    			if(event.key === "Enter") {
    					moveToNextScoreDown(event)
    					const {setGradebookScore, personId, courseScheduledId, accessRoles, getAssignmentsPendingReview} = props
    					setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value);  //Don't call getGradebook here.  We are going to change grades through a reducer and then call to get the updated overall grade from the serverside so there is just one side that makes thoat calculation.
    					if (accessRoles.facilitator) getAssignmentsPendingReview(personId)
    			}
    	
  }

  const moveToNextScoreDown = ({target}) => {
    
    			const {assignmentsInfo} = props
    			//Get the current id which will be the student and the assignment Ids.  Get the next student and use the current AssignmentId in order to move the focus down to the next one.
    			let assignmentId = target.name.substring(target.name.indexOf('#$') + 2)
    			let nextAssignmentId = ''
    			let foundCurrent = false
    			assignmentsInfo && assignmentsInfo.assignments.length > 0 && assignmentsInfo.assignments.forEach(m => {
    					if (!foundCurrent && m.assignmentId === assignmentId) {
    							foundCurrent = true
    					} else if (foundCurrent && !nextAssignmentId) {
    							nextAssignmentId = m.assignmentId
    							foundCurrent = false; //So it won't keep replacing our newly found nextStudentpersonId;
    					}
    			})
    			let nextScoreControlDown = 'undefined#$' + nextAssignmentId
    			document.getElementById(nextScoreControlDown) && document.getElementById(nextScoreControlDown).focus()
    	
  }

  const onStandardLevelSet = (studentPersonId, assignmentId, standardLevelSequence) => {
    
    			const {setStandardLevelSequence, courseScheduledId, personId} = props
    			hideContextKnowledgeRatingMenu()
    			setStandardLevelSequence(studentPersonId, assignmentId, standardLevelSequence, courseScheduledId, personId)
    	
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

  const {personId, fetchingRecord, courseScheduledId, studentPersonId, courseDocuments, course={}, assignmentsInfo, contentTypes, visitedColor,
  						languageList, setResponseVisitedType, studentFullName, studentFirstName, companyConfig, removeStudentResponse, accessRoles={},
  						clearPenspringTransfer, createWorkAndPenspringTransfer, penspringTransfer, studentAssignmentsInit, standardsRatings, passFailRatings,
  						students, setGradeOverwrite, setAssignmentEditMode, personConfig} = props
  		const {isShowingModal_response, assignmentId, hideSearch, filters={}, isShowingModal_instructions, assignmentName, instructions,
  	 					clickedId, clickedUrl, isShowingModal_document, clickedOnResponse, penspringWorkId, isShowingNotYetSubmitted,
  					 	student, localGradeOverwrite, chosenAssignmentId, set_assignmentId, isShowingModal_fileNotSaved} = state
  
  		let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly
  		let assignmentsFiltered = assignmentsInfo && assignmentsInfo.assignments
  		assignmentsFiltered = doSort(assignmentsFiltered, {sortField: 'sequence', isAsc: true, isNumber: true})
  
  		if (assignmentsFiltered && assignmentsFiltered.length > 0) {
  				if (filters.partialNameText) assignmentsFiltered = assignmentsFiltered.filter(m => m.title.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1)
  				if (assignmentsFiltered && assignmentsFiltered.length > 0 && (filters.dueDateFrom || filters.dueDateTo)) {
  						if (filters.dueDateFrom && filters.dueDateTo) {
  								assignmentsFiltered = assignmentsFiltered.filter(m => m.dueDate >= filters.dueDateFrom && m.dueDate <= filters.dueDateTo)
  						} else if (filters.dueDateFrom) {
  								assignmentsFiltered = assignmentsFiltered.filter(m => m.dueDate >= filters.dueDateFrom)
  						} else if (filters.dueDateTo) {
  								assignmentsFiltered = assignmentsFiltered.filter(m => m.dueDate <= filters.dueDateTo)
  						}
  				}
  				if (filters.contentTypes && filters.contentTypes.length > 0 && assignmentsFiltered && assignmentsFiltered.length > 0)
  						assignmentsFiltered = assignmentsFiltered.filter(m => filters.contentTypes.indexOf(m.contentTypeId) > -1)
  		}
  
      let headings = []
  		if (accessRoles.observer || accessRoles.learner) headings.push({label: <L p={p} t={`+Add response`}/>, tightText: true})
  		headings = headings.concat([
  				{label: <L p={p} t={`Student response`}/>, tightText: true},
  				{label: <L p={p} t={`Status`}/>, tightText: true},
  				{label: <L p={p} t={`Teacher's attachment`}/>, tightText: true},
  				{label: <L p={p} t={`Score`}/>, tightText: true},
  		])
  
  		if (!isLevelOnly) headings = headings.concat([{label: 'Possible score', tightText: true}])
  		headings = headings.concat([
  				{label: <L p={p} t={`Name`}/>, tightText: true},
  				{label: <L p={p} t={`Due date`}/>, tightText: true},
  				{label: <L p={p} t={`Type`}/>, tightText: true},
  				{label: <L p={p} t={`Instructions`}/>, tightText: true},
  		])
  
    	let data = assignmentsFiltered && assignmentsFiltered.length > 0 && assignmentsFiltered.map((m, i) => {
  				let row = []
  				if (accessRoles.observer || accessRoles.learner) {
  						row.push({cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							value:
  							 <div className={classes(styles.row, styles.lower)}
  							  		onClick={() => handleAddOrUpdateOpen(m.assignmentId, '', m)}>
  											 <Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
  							 </div>
  						})
  				}
  				row = row.concat([
  		 			 {cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  					   clickFunction: () => chooseRecord(m.assignmentId),
  	 					value:
  							<div className={styles.row}>
  									<div className={classes(styles.row, styles.pointerCursor)}>
  											{assignmentsInfo.fileUploadUrls && assignmentsInfo.fileUploadUrls.length > 0 && assignmentsInfo.fileUploadUrls.filter(f => f.assignmentId === m.assignmentId).map((f, i) =>
  													<a key={i} onClick={() => handleDocumentOpen(m.assignmentId, f, m, f.id)} className={f.isTeacherResponse ? styles.teacherResponse : ''}>
  															<Icon pathName={'document0'} premium={true} className={f.isTeacherResponse ? styles.iconTeacherFile : styles.iconCell}
  																	fillColor={clickedOnResponse === f.id
  																		? '#e8772e'
  																		: f.isTeacherResponse
  																				? '#8c1d12'
  																				: (accessRoles.admin || accessRoles.facilitator) && f.responseVisitedTypeCode
  																						? visitedColor[f.responseVisitedTypeCode]
  																						: ''} />
  													</a>)
  											}
  						 			 </div>
  									 <div className={classes(styles.row, styles.pointerCursor)}>
  											{assignmentsInfo.websiteLinks && assignmentsInfo.websiteLinks.length > 0 && assignmentsInfo.websiteLinks.filter(f => f.assignmentId === m.assignmentId).map((w, i) =>
  													<a key={i} onClick={() => handleDocumentOpen(m.assignmentId, {id: w.studentAssignmentResponseId, label: w.label.indexOf('http') === -1 ? 'http://' + w.label : w.label, isTeacherResponse: w.isTeacherResponse}, m, w.id)}
  																	className={w.isTeacherResponse ? styles.teacherResponse : ''}>
  															<Icon pathName={'link2'} premium={true} className={w.isTeacherResponse ? styles.iconTeacherFile : styles.iconCell}
  																	fillColor={clickedOnResponse === w.id
  																		? '#e8772e'
  																		: w.isTeacherResponse
  																				? '#8c1d12'
  																				: (accessRoles.admin || accessRoles.facilitator) && w.responseVisitedTypeCode
  																						? visitedColor[w.responseVisitedTypeCode]
  																						: ''} />
  													</a>)
  											}
  									 </div>
  				  			 	 <div className={classes(styles.row, styles.pointerCursor)}>
  											{assignmentsInfo.textResponses && assignmentsInfo.textResponses.length > 0 && assignmentsInfo.textResponses.filter(f => f.assignmentId === m.assignmentId).map((t, i) =>
  													<a key={i} onClick={() => handleDocumentOpen(m.assignmentId, {...t, isTextResponse: true}, m, t.id)} className={t.isTeacherResponse ? styles.teacherResponse : ''}
  																	 data-rh={t.label.length > 15 ? t.label.substring(0, 15) + '...' : t.label}>
  															<Icon pathName={'comment_edit'} premium={true} className={t.isTeacherResponse ? styles.iconTeacherText : styles.iconCell}
  																	fillColor={clickedOnResponse === t.id
  																		? '#e8772e'
  																		: t.isTeacherResponse
  																				? '#8c1d12'
  																				: (accessRoles.admin || accessRoles.facilitator) && t.responseVisitedTypeCode
  																						? visitedColor[t.responseVisitedTypeCode]
  																						: ''} />
  													</a>
  											)}
  									</div>
  									<div className={classes(styles.row, styles.pointerCursor)}>
  											{assignmentsInfo.penspringWorks && assignmentsInfo.penspringWorks.length > 0 && assignmentsInfo.penspringWorks.filter(f => f.assignmentId === m.assignmentId).map((p, i) =>
  													<div key={i} className={styles.row}>
  															<a onClick={p.submittedDate || accessRoles.learner
  																			? () => handlePenspringView(p.penspringWorkId, m)
  																		  : handleNotYetSubmittedOpen} className={classes(styles.row, styles.psImage, (p.isTeacherResponse ? styles.teacherResponse : ''))} data-rh={p.label}>
  																	<img src={!!p.submittedDate ? psCheckmark : psOverdue} alt="PS"
  																			className={classes(styles.penspringIcon, (p.isTeacherResponse
  																					? styles.iconTeacherFile
  																					: clickedId === p.id
  																							? styles.visited
  																							: p.isTeacherResponse
  																									? styles.teacherResponse
  																									: ''))}
  																	 />
  															</a>
  													</div>
  											)}
  									</div>
  									<a id={'hiddenPenspringLink'} href={`${penspringHost}/lms/${personId}/${penspringWorkId}`} target={`_${penspringWorkId}`}> </a>
  							</div>
  						},
  						setCompletion(m), //This returns the data object with statusName and value that is an Icon.
  						{cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							value: <div className={styles.row}>
  												<div className={styles.row}>
  														{assignmentsInfo.assignmentFileUploadUrls && assignmentsInfo.assignmentFileUploadUrls.length > 0 && assignmentsInfo.assignmentFileUploadUrls.filter(f => f.id === m.assignmentId).map((f, i) =>
  																<a key={i} href={f.label} target={'_blank'} onClick={() => setClickedId(f.label)}>
  																		<Icon pathName={'document0'} premium={true} className={styles.icon} fillColor={clickedId === f.label ? '#e8772e' : ''}/>
  																</a>)
  														 }
  												 </div>
  												 <div className={styles.row}>
  		 												{assignmentsInfo.assignmentWebsiteLinks && assignmentsInfo.assignmentWebsiteLinks.length > 0 && assignmentsInfo.assignmentWebsiteLinks.filter(f => f.id === m.assignmentId).map((w, i) =>
  		 														<a key={i} href={w.label.indexOf('http') === -1 ? 'http://' + w.label : w.label} target={'_blank'} onClick={() => setClickedId(w.label)}>
  		 																<Icon pathName={'link2'} premium={true} className={styles.icon} fillColor={clickedId === w.label ? '#e8772e' : ''}/>
  		 														</a>)
  		 												 }
  		 										 </div>
  										 </div>
  					  },
  						{cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  							notShowLink: !(m.canEditScore || accessRoles.admin || accessRoles.facilitator),
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							value: <div className={styles.row}>
  												{/*(m.canEditScore || accessRoles.admin || accessRoles.facilitator) &&
  														<div className={styles.row}>
  																	{(m.contentTypeCode === 'QUIZ' || m.contentTypeCode === 'BENCHMARK') && m.hasAssessmentQuestions &&
  																			<Link to={(m.contentTypeCode !== 'BENCHMARK' && (m.score || m.score === 0)) || (m.contentTypeCode === 'BENCHMARK' && m.scoredAnswers && m.scoredAnswers.length > 0 && m.scoredAnswers[0].isSubmitted)
  																					? `/assessmentCorrect/${m.assignmentId}/${m.assessmentId}/${studentPersonId}/${courseScheduledId}/${m.benchmarkTestId}`
  																					: `/assessmentLearner/${m.assignmentId}/${m.assessmentId}/${studentPersonId}/${courseScheduledId}/${m.benchmarkTestId}`}
  																							className={classes(styles.littleTop, styles.link)}>
  																					<Icon pathName={'clipboard_check'} premium={true} className={styles.iconTopSpace}/>
  																			</Link>
  
  																	}
  														</div>
  												*/}
  												<GradingRatingEntry key={i} gradingType={course.gradingType} studentScore={m} studentPersonId={m.personId} assignmentId={m.assignmentId}
  														standardsRatings={standardsRatings} handleEnterKey={handleEnterKey} handleScore={handleScore} onBlurScore={onBlurScore}
  														//onDoubleClick={(accessRoles.admin || accessRoles.facilitator) ? () => handleDocumentOpen(m.assignmentId, null, m) : () => {}}
  														scoredAnswers={m.scoredAnswers} theScore={m.score} isEditMode={m.editMode} setEditMode={setAssignmentEditMode} contentTypeCode={m.contentTypeCode}
  														onPassFailIncrement={onPassFailIncrement} hasAssessmentQuestions={m.hasAssessmentQuestions} useType={'STUDENTASSIGNMENT'}
  														canEditScore={m.canEditScore || accessRoles.admin || accessRoles.facilitator} chooseRecord={chooseRecord}/>
  										 </div>
  						}
  				])
  
  				if (!isLevelOnly) row = row.concat([
  						{cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							notShowLink: true,
  							value: <div className={styles.lowPosition}>{m.totalPoints}</div>}])
  
  				row = row.concat([
  						{cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  							notShowLink: !m.hasAssessmentQuestions && m.contentTypeCode !== 'DISCUSSION',
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							value:  m.hasAssessmentQuestions
  								? <div onClick={(m.contentTypeCode !== 'BENCHMARK' && (m.score || m.score === 0)) || (m.contentTypeCode === 'BENCHMARK' && m.scoredAnswers && m.scoredAnswers.length > 0 && m.scoredAnswers[0].isSubmitted)
  															? () => navigate(`/assessmentCorrect/${m.assignmentId}/${m.assessmentId}/${studentPersonId}/${courseScheduledId}/${m.benchmarkTestId}`)
  															: accessRoles.learner
  																	? () => navigate(`/assessmentLearner/${m.assignmentId}/${m.assessmentId}/notRetake/${courseScheduledId}/${m.benchmarkTestId}`)
  																	: () => {}}
  													className={classes(styles.link, styles.row)}>
  											{m.title}
  									</div>
  								: m.contentTypeCode === 'DISCUSSION'
  										? <Link to={'/discussionClass/' + m.courseEntryId + '/' + m.discussionEntryId} className={classes(styles.link, styles.row)}>{m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title}</Link>
  										: m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title
  						},
  						{cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  							notShowLink: true,
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							value: <DateMoment date={m.dueDate} format={'D MMM'}/>},
  						{cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  							notShowLink: !((m.contentTypeCode === 'QUIZ' || m.contentTypeCode === 'BENCHMARK') && m.hasAssessmentQuestions) && !m.contentTypeCode === 'DISCUSSION',
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							value: (m.contentTypeCode === 'QUIZ' || m.contentTypeCode === 'BENCHMARK') && m.hasAssessmentQuestions
  								? <div onClick={(m.contentTypeCode !== 'BENCHMARK' && (m.score || m.score === 0)) || (m.contentTypeCode === 'BENCHMARK' && m.scoredAnswers && m.scoredAnswers.length > 0 && m.scoredAnswers[0].isSubmitted)
  															? () => navigate(`/assessmentCorrect/${m.assignmentId}/${m.assessmentId}/${studentPersonId}/${courseScheduledId}/${m.benchmarkTestId}`)
  															: accessRoles.learner
  																	? () => navigate(`/assessmentLearner/${m.assignmentId}/${m.assessmentId}/notRetake/${courseScheduledId}/${m.benchmarkTestId}`)
  																	: () => {}} className={classes(styles.link, styles.row)}>
  											<Icon pathName={'clipboard_check'} premium={true} className={styles.iconCell}/>
  											{m.contentTypeName}
  									</div>
  								: m.contentTypeCode === 'DISCUSSION'
  										? <Link to={'/discussionClass/' + m.courseEntryId + '/' + m.discussionEntryId} className={classes(styles.link, styles.row)}>
  													<Icon pathName={'chat_bubbles'} premium={true} className={styles.iconCell}/>
  													{m.contentTypeName}
  											</Link>
  										: m.contentTypeName
  						},
  						{cellColor: m.assignmentId === chosenAssignmentId ? 'highlight' : '',
  						  clickFunction: () => chooseRecord(m.assignmentId),
  							value: m.contentTypeCode === 'DISCUSSION'
  								? (m.discussionMinPost && (m.discussionMinPost === 1 ? `${m.discussionMinPost} direct post; ` : `${m.discussionMinPost} direct posts; `))
  										+ (m.discussionMinComment && (m.discussionMinComment === 1 ? `${m.discussionMinComment} comment; ` : `${m.discussionMinComment} comments; `))
  										+ (m.discussionWordCount && (m.discussionWordCount === 1 ? `${m.discussionWordCount} minimum word; ` : `${m.discussionWordCount} minimum words. `))
  								: <a onClick={() => handleInstructionsOpen(m.title, m.instructions)} className={styles.link}>{m.instructions.length > 35 ? m.instructions.substring(0,35) + '...' : m.instructions}</a>
  						},
          ])
  				return row
  		})
  		if (filters && (filters.pastDue || filters.completed || filters.incomplete || filters.pendingScore))
  				data = data && data.length > 0 && data.filter(m =>
  						(filters.pastDue && m[2].statusName === 'PASTDUE')
  								|| (filters.incomplete && m[2].statusName !== 'COMPLETE' && m[2].statusName !== 'PASTDUE' && m[2].statusName !== 'PENDINGSCORE')
  						 		|| (filters.completed && m[2].statusName === 'COMPLETE')
  								|| (filters.pendingScore > -1 && m[2].statusName === 'PENDINGSCORE')
  				)
  
  		let responseData = assignmentsInfo && assignmentsInfo.assignments && assignmentsInfo.assignments.length > 0 && assignmentsInfo.assignments.filter(m => m.assignmentId === assignmentId)[0]
  		let fileUploads = assignmentsInfo && assignmentsInfo.fileUploadUrls && assignmentsInfo.fileUploadUrls.length > 0 && assignmentsInfo.fileUploadUrls.filter(m => m.assignmentId === assignmentId)
  		let websiteLinks = assignmentsInfo && assignmentsInfo.websiteLinks && assignmentsInfo.websiteLinks.length > 0 && assignmentsInfo.websiteLinks.filter(m => m.assignmentId === assignmentId)
  		let textResponses = assignmentsInfo && assignmentsInfo.textResponses && assignmentsInfo.textResponses.length > 0 && assignmentsInfo.textResponses.filter(m => m.assignmentId === assignmentId)
  
      return (
          <div className={styles.container}>
  						<div className={classes(styles.row, globalStyles.pageTitle)}>
  								{accessRoles.learner && studentFirstName ? <L p={p} t={`${studentFirstName}'s Assignments`}/> : <L p={p} t={`Student's Assignments`}/>}
  								<div className={classes(styles.row, styles.muchLeft)}>
  										<ReactToPrint trigger={() =>
  												<a href="#" className={classes(styles.link, styles.white, styles.row)}>
  														<Icon pathName={'printer'} premium={true} fillColor={'white'} className={classes(styles.moreLeft, styles.iconCell)}/>
  														<L p={p} t={`Print`}/>
  												</a>} content={() => componentRef}/>
  								</div>
  						</div>
  						<div ref={el => (componentRef = el)}>
  								<div className={styles.rowWrap}>
  										<div>
  												{!accessRoles.learner && studentFullName &&
  														<div className={styles.row}>
  																<div className={styles.studentPosition}>
  																		<TextDisplay label={<L p={p} t={`Student`}/>} text={
  																				<div className={styles.row}>
  																						<Link to={'/studentProfile/' + studentPersonId} className={classes(styles.link, styles.boldBigger)}>
  																								{studentFullName}
  																						</Link>
  																				</div>
  																		}/>
  																</div>
  																{(accessRoles.admin || accessRoles.facilitator) && !isLevelOnly && //isLevelOnly refers to standard based rating
  																		<div className={classes(styles.moreLeft, styles.someTop)}>
  																				<InputText size={"super-short"}
  																						label={<div className={styles.row}><L p={p} t={`Grade overwrite`}/><div className={styles.letterGrade}>{getLetterGrade(assignmentsInfo && assignmentsInfo.gradeOverwrite)}</div></div>}
  																						value={localGradeOverwrite || ''}
  																						numberOnly={true}
  																						maxLength={3}
  																						name={studentPersonId}
  																						onChange={(event) => handleGradeOverwrite(studentPersonId, event)}
  																						onBlur={(event) => setGradeOverwrite(personId, courseScheduledId, studentPersonId, personConfig.intervalId, 'GradePercent', event.target.value)}/>
  																		</div>
  																}
  														</div>
  												}
  												<TextDisplay label={<L p={p} t={`Course`}/>} text={<div className={styles.row}>{`${course.courseName}`}<div className={styles.overallGrade}>{assignmentsInfo.overallGrade}</div></div>} />
  												<TextDisplay label={<L p={p} t={`Teacher`}/>} text={course && course.teachers && course.teachers.length > 0 && course.teachers.reduce((acc, m) => acc ? acc += ', ' + m.label : m.label, '')} />
  												<div className={styles.row}>
  														<TextDisplay label={<L p={p} t={`Class period`}/>} text={course.classPeriodName} />
  														{(course.gradingType === 'STANDARDSRATING' || course.gradingType === 'PASSFAIL') &&
  																<div className={styles.muchLeft}>
  																		<GradingRatingLegend standardsRatings={standardsRatings} passFailRatings={passFailRatings} gradingType={course.gradingType}
  																				standardsRatingTableId={course.standardsRatingTableId} />
  																</div>
  														}
  												</div>
  										</div>
  										<div className={styles.alotLeft}>
  												<div className={classes(styles.moreTop, styles.label)}><L p={p} t={`Course Documents`}/></div>
  												{courseDocuments && courseDocuments.length > 0 && courseDocuments.map((f, i) => (
  														<LinkDisplay key={i} linkText={f.title} url={f.urlTemp} fileUploadId={f.fileUploadId} className={styles.linkDisplay}
  																deleteFunction={accessRoles.facilitator && handleRemoveFileUploadOpen} deleteId={f.courseDocumentId}/>
  												))}
  												{(!courseDocuments || courseDocuments.length === 0) &&
  														<div className={styles.noDocs}><L p={p} t={`No documents found`}/></div>
  												}
  										</div>
  								</div>
  								<div className={styles.row}>
  										{(accessRoles.admin || accessRoles.facilitator) &&
  												<div>
  														<InputDataList
  																name={`studentPersonId`}
  																label={<L p={p} t={`Student`}/>}
  																value={student}
  																options={students}
  																height={`medium`}
  																className={styles.inputPosition}
  																onChange={changeStudent}/>
  												</div>
  										}
  										<div className={classes(styles.moreLeft, styles.lotMoreTop)}>
  												<a onClick={toggleHideSearch} className={classes(styles.row, styles.link, styles.moreLeft)}>
  														<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  														{hideSearch ? <L p={p} t={`Show search controls`}/> : <L p={p} t={`Hide search controls`}/>}
  												</a>
  										</div>
  								</div>
  								{!hideSearch &&
  										<div className={styles.filters}>
  												<div className={styles.row}>
  														<InputText
  																id={"partialNameText"}
  																name={"partialNameText"}
  																size={"medium"}
  																label={<L p={p} t={`Name search`}/>}
  																value={filters.partialNameText || ''}
  																onChange={changeFilter}
  																inputClassName={styles.partialText}
  																onEnterKey={handlePartialNameEnterKey}/>
  														<a onClick={handlePartialNameTextSubmit} className={styles.nameLinkStyle}>
  																<Icon pathName={`plus`} className={styles.image}/>
  														</a>
  												</div>
  												<div className={styles.moreTop}>
  														<div className={styles.headLabel}><L p={p} t={`Due date range`}/></div>
  														<div className={styles.rowWrap}>
  																<div>
  																		<span className={styles.label}><L p={p} t={`From:`}/></span>
  																		<DateTimePicker id={`dueDateFrom`} value={filters.dueDateFrom}
  																				onChange={(event) => changeFilter(event, 'dueDateFrom')}/>
  																</div>
  																<div className={styles.leftSpace}>
  																		<span className={styles.label}><L p={p} t={`To:`}/></span>
  																		<DateTimePicker id={`dueDateTo`} value={filters.dueDateTo} minDate={filters.dueDateFrom ? filters.dueDateFrom : ''}
  																				onChange={(event) => changeFilter(event, 'dueDateTo')}/>
  																</div>
  														</div>
  												</div>
  												<div className={classes(styles.moreTop, styles.headLabel, styles.position)}><L p={p} t={`Assignment types`}/></div>
  												<div className={classes(styles.rowWrap, styles.moreTop, styles.moreLeft)}>
  														{contentTypes && contentTypes.length > 0 && contentTypes.map((m, i) =>
  																<Checkbox
  																		key={i}
  				                            id={m.id}
  				                            label={m.label}
  				                            checked={filters.contentTypes && filters.contentTypes.length > 0 && filters.contentTypes.indexOf(m.id) > -1}
  																		labelClass={styles.checkboxText}
  																		checkboxClass={styles.marginBottom}
  				                            onClick={() => handleContentType(m.id)}/>
  														)}
  												</div>
  										</div>
  								}
  								<div className={classes(styles.moreTop, styles.headLabel, styles.position)}>Status</div>
  								<div className={classes(styles.rowWrap, styles.moreTop, styles.moreLeft)}>
  										<Checkbox
  												id={'pastDue'}
  												label={<div className={styles.rowCheckbox}><Icon pathName={'timer_crossed'} premium={true} className={styles.icon} fillColor={'red'}/><L p={p} t={`Past due`}/></div>}
  												checked={filters.pastDue || false}
  												labelClass={styles.checkboxText}
  												checkboxClass={styles.marginBottom}
  												onClick={() => toggleCheckbox('pastDue')}/>
  										<Checkbox
  												id={'pendingScore'}
  												label={<div className={styles.rowCheckbox}><Icon pathName={'mailbox_pending'} premium={true} className={styles.icon} fillColor={'#cc6600'}/><L p={p} t={`Pending score`}/></div>}
  												checked={filters.pendingScore || false}
  												labelClass={styles.checkboxText}
  												checkboxClass={styles.marginBottom}
  												onClick={() => toggleCheckbox('pendingScore')}/>
  										<Checkbox
  												id={'completed'}
  												label={<div className={styles.rowCheckbox}><Icon pathName={'checkmark0'} premium={true} className={styles.icon} fillColor={'green'}/><L p={p} t={`Completed`}/></div>}
  												checked={filters.completed || false}
  												labelClass={styles.checkboxText}
  												checkboxClass={styles.marginBottom}
  												onClick={() => toggleCheckbox('completed')}/>
  										<Checkbox
  												id={'incomplete'}
  												label={<div className={styles.rowCheckbox}><L p={p} t={`Incomplete`}/></div>}
  												checked={filters.incomplete || false}
  												labelClass={styles.checkboxText}
  												checkboxClass={styles.marginBottom}
  												onClick={() => toggleCheckbox('incomplete')}/>
  								</div>
  								<hr />
  								<div className={styles.instructions}><L p={p} t={`To send in homework, click on the plus symbol to type your homework, to upload a file, or to include a Google Docs link.`}/></div>
  								<div className={styles.scrollable}>
  										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  												isFetchingRecord={fetchingRecord.studentAssignments} emptyMessage={<L p={p} t={`No assignments have been entered yet`}/>}/>
  								</div>
  								{/*<MyFrequentPlaces personId={personId} pageName={'Student Assignments'} path={'studentAssignments/0'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>*/}
  								<OneFJefFooter />
  						</div>
  						{isShowingModal_response &&
  								<AssignmentResponseModal handleClose={handleAddOrUpdateClose} showTitle={true} handleSubmit={handleAddOrUpdateSave}
  										assignmentsInfo={assignmentsInfo} assignmentId={assignmentId} personId={personId} companyConfig={companyConfig} course={course}
  										recallInitRecords={recallInitRecords} accessRoles={accessRoles} courseScheduledId={courseScheduledId}
  										handleRemove={removeStudentResponse} languageList={languageList} createWorkAndPenspringTransfer={createWorkAndPenspringTransfer}
  										penspringTransfer={penspringTransfer} clearPenspringTransfer={clearPenspringTransfer} studentPersonId={studentPersonId}/>
  						}
  						{isShowingModal_document &&
  								<div className={styles.fullWidth}>
  										{<DocumentResponseModal handleClose={handleDocumentClose} showTitle={true} handleSubmit={handleDocumentSave}
  												responseData={responseData} assignmentId={assignmentId} personId={personId} companyConfig={companyConfig}
  												course={course} recallInitRecords={recallInitRecords} accessRoles={accessRoles} courseScheduledId={courseScheduledId}
  												handleRemove={removeStudentResponse} clickedUrl={clickedUrl} student={{personId: studentPersonId, firstName: studentFullName}}
  												setResponseVisitedType={setResponseVisitedType} fileUploads={fileUploads} websiteLinks={websiteLinks}
  												textResponses={textResponses} studentAssignmentsInit={studentAssignmentsInit} />}
  								</div>
  						}
  						{isShowingModal_instructions &&
  								<MessageModal handleClose={handleInstructionsClose} heading={assignmentName} explain={instructions}
  										onClick={handleInstructionsClose} />
  						}
  						{isShowingNotYetSubmitted &&
                  <MessageModal handleClose={handleNotYetSubmittedClose} heading={<L p={p} t={`Homework not yet submitted`}/>}
                     explainJSX={<L p={p} t={`This student has not yet submtted this homework for your review.`}/>}
                     onClick={handleNotYetSubmittedClose} />
              }
  						{isShowingModal_fileNotSaved &&
  								<MessageModal handleClose={handleFileNotSavedCancel} heading={<L p={p} t={`Uploaded File Not Saved`}/>}
  									 explainJSX={<L p={p} t={`It appears that you have chosen a file but you haven't saved it to the record yet.  Do you want to return to the file upload form and save the file?`}/>}
  									 onClick={handleAddOrUpdateClose} isConfirmType={true} />
  						}
  						<div id={`contextKnowledgeRating`} style={{display: 'none'}}>
  								<ContextKnowledgeRating personId={personId} studentPersonId={studentPersonId} assignmentId={set_assignmentId} standardsRatings={standardsRatings}
  										onClick={onStandardLevelSet} />
  						</div>
        	</div>
      )
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
