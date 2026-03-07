import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {penspringHost} from '../../penspring_host'
import * as styles from './AssignmentsPendingReviewView.css'
const p = 'AssignmentsPendingReviewView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import penspringSmall from '../../assets/Penspring_favicon.png'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import InputText from '../../components/InputText'
import DateTimePicker from '../../components/DateTimePicker'
import Checkbox from '../../components/Checkbox'
import RadioGroup from '../../components/RadioGroup'
import MessageModal from '../../components/MessageModal'
import DocumentResponseModal from '../../components/DocumentResponseModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {doSort} from '../../utils/sort'
import {wait} from '../../utils/wait'
import { withAlert } from 'react-alert'

function AssignmentsPendingReviewView(props) {
  const [scores, setScores] = useState([])
  const [isShowingModal_document, setIsShowingModal_document] = useState(false)
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(false)
  const [hideSearch, setHideSearch] = useState(false)
  const [sortByHeadings, setSortByHeadings] = useState({
								sortField: '',
								isAsc: '',
								isNumber: ''
						})
  const [sortField, setSortField] = useState('')
  const [isAsc, setIsAsc] = useState('')
  const [isNumber, setIsNumber] = useState('')
  const [filters, setFilters] = useState({
								partialNameText: '',
								dueDateFrom: '',
								dueDateTo: '',
								contentTypes: [],
								showSet: 'all',
								gradingType: 'TEACHER'
						})
  const [partialNameText, setPartialNameText] = useState('')
  const [dueDateFrom, setDueDateFrom] = useState('')
  const [dueDateTo, setDueDateTo] = useState('')
  const [showSet, setShowSet] = useState('all')
  const [gradingType, setGradingType] = useState('TEACHER')
  const [hasUpdatedScores, setHasUpdatedScores] = useState(undefined)
  const [doNotRefresh, setDoNotRefresh] = useState(undefined)
  const [sendToHiddenPenspringLink, setSendToHiddenPenspringLink] = useState(undefined)
  const [instructions, setInstructions] = useState(undefined)
  const [assignmentName, setAssignmentName] = useState(undefined)
  const [assignmentId, setAssignmentId] = useState(undefined)
  const [clickedUrl, setClickedUrl] = useState(undefined)
  const [clickedOnResponse, setClickedOnResponse] = useState(undefined)
  const [penspringWorkId, setPenspringWorkId] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {assignments} = props
    				
    
    				if (!doNotRefresh && !hasUpdatedScores && assignments && assignments.length > 0) {
    						let scores = [...scores]
    						assignments && assignments.length > 0 && assignments.forEach(m => scores[m.assignmentId + m.personId] = m.score)
    						setScores(scores); setHasUpdatedScores(true); setDoNotRefresh(true)
    				}
    				if (sendToHiddenPenspringLink) {
    						setSendToHiddenPenspringLink(false)
    						document.getElementById('hiddenPenspringLink').click()
    				}
    		
  }, [])

  const onBlurScore = (courseScheduledId, assignmentId, studentPersonId, event) => {
    
    				const {setGradebookScore, personId } = props
    				//If the score coming in is blank, then don't even bother sending it.  Besides, it will mark this particular pending record so that it doesn't show up since it will create a studentAssignmentScore record although the score is blank.
    				if (event.target.value) setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value)
    		
  }

  const resort = (field) => {
    
  }

  const handleScore = (assignmentId, studentPersonId, event) => {
    
    				const {getAssignmentsPendingReview, personId} = props
    				if (event.target.value) getAssignmentsPendingReview(personId)
    		
  }

  const showStudentResponse = (comments) => {
    
    				alert(comments)
    		
  }

  const changeFilter = (event, filterName) => {
    
    				let field = filterName ? filterName : event.target.name
    				filters[field] = event.target.value
    				setFilters(filters)
    		
  }

  const toggleCheckbox = (id) => {
    
    				if (filters.contentTypes && filters.contentTypes.length > 0) {
    						if (filters.contentTypes.indexOf(id) > -1) {
    								filters.contentTypes.splice(filters.contentTypes.indexOf(id), 1)
    						} else {
    								filters.contentTypes.push(id)
    						}
    				} else {
    						filters.contentTypes = [id]
    				}
    				setFilters(filters)
    		
  }

  const handleShowSet = (value) => {
    
  }

  const toggleHideSearch = () => {
    
    				setHideSearch(!hideSearch)
    		
  }

  const handleInstructionsOpen = (assignmentName, instructions) => {
    return setIsShowingModal_instructions(true); setInstructions(instructions); setAssignmentName(assignmentName)
    

  }
  const handleInstructionsClose = () => {
    return setIsShowingModal_instructions(false); setInstructions(''); setAssignmentName('')
    

  }
  const setClickedId = (clickedId) => {
    
    				setClickedId(clickedId)
    		
  }

  const handleDocumentOpen = (assignmentId, clickedUrl, student, clickedOnResponse) => {
    
    				setIsShowingModal_document(true); setAssignmentId(assignmentId); setClickedUrl(clickedUrl); setClickedOnResponse(clickedOnResponse); setStudent(student)
    		
  }

  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setAssignmentId(''); setClickedUrl({})

  }
  const handleDocumentSave = (studentResponse, assignmentId) => {
    
    				const {addOrUpdateStudentResponse, personId} = props
    				
    				studentResponse.personId = student.personId
    				studentResponse.isTeacherResponse = true
    				addOrUpdateStudentResponse(personId, student.courseEntryId, student.courseScheduledId, studentResponse, assignmentId)
    				wait(2000)
    				recallInitRecords()
    		
  }

  const recallInitRecords = () => {
    
    				const {personId, getAssignmentsPendingReview} = props
    				getAssignmentsPendingReview(personId)
    				handleDocumentClose()
    		
  }

  const handleRadioChoice = (field, value) => {
    
  }

  const handleEnterKey = (event) => {
    
    				event.key === "Enter" && moveToNextScoreDown(event)
    		
  }

  const moveToNextScoreDown = ({target}) => {
    
    				const assignments = filterAssignments()
    				//Get the current id which will be the student and the assignment Ids.  Get the next student and use the current AssignmentId in order to move the focus down to the next one.
    				let studentPersonId = target.name.substring(0, target.name.indexOf('#$'))
    				let nextRecord = ''
    				let foundCurrent = false
    				assignments && assignments.length > 0 && assignments.forEach(m => {
    						if (!foundCurrent && m.personId === studentPersonId && m.assignmentId === assignmentId) {
    								foundCurrent = true
    						} else if (foundCurrent && !nextRecord) {
    								nextRecord = m.personId + '#$' + m.assignmentId
    								foundCurrent = false; //So it won't keep replacing our newly found nextStudentpersonId;
    						}
    				})
    				document.getElementById(nextRecord) && document.getElementById(nextRecord).focus()
    		
  }

  const filterAssignments = () => {
    
    				let assignments = [...props.assignments]
    				if (filters.partialNameText) assignments = assignments
    						.filter(m => m.title.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1
    										|| m.firstName.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1
    										|| m.lastName.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1
    										|| m.instructions.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1)
    
    				if (filters.dueDateFrom || filters.dueDateTo) {
    						if (filters.dueDateFrom && filters.dueDateTo) {
    								assignments = assignments.filter(m => m.dueDate >= filters.dueDateFrom && m.dueDate <= filters.dueDateTo)
    						} else if (filters.dueDateFrom) {
    								assignments = assignments.filter(m => m.dueDate >= filters.dueDateFrom)
    						} else if (filters.dueDateTo) {
    								assignments = assignments.filter(m => m.dueDate <= filters.dueDateTo)
    						}
    				}
    				if (filters.contentTypes && filters.contentTypes.length > 0) assignments = assignments.filter(m => filters.contentTypes.indexOf(m.contentTypeId) > -1)
    				if (filters.gradingType && filters.gradingType !== 'ALL') assignments = assignments.filter(m => m.gradingType === filters.gradingType)
    
    				if (sortByHeadings && sortByHeadings.sortField) {
    						assignments = doSort(assignments, sortByHeadings)
    				}
    				return assignments
    		
  }

  const refreshPage = () => {
    
    				const {personId, getAssignmentsPendingReview, getCountsMainMenu } = props
    				getAssignmentsPendingReview(personId)
    				getCountsMainMenu(personId)
    				setDoNotRefresh(false); setHasUpdatedScores(false)
    		
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

  const {personId, fetchingRecord, contentTypes, accessRoles, companyConfig, setResponseVisitedType, removeStudentResponse,
  			 				visitedColor, myFrequentPlaces, setMyFrequentPlace} = props
  			let assignmentsFiltered = filterAssignments()
  
  	    let headings = [
  					{label: <L p={p} t={`Responses`}/>, tightText: true},
  					{label: <L p={p} t={`Score`}/>, tightText: true},
  					{label: <L p={p} t={`Possible score`}/>, tightText: true, clickFunction: () => resort('totalPoints')},
  					{label: <L p={p} t={`Assignment`}/>, tightText: true, clickFunction: () => resort('title')},
  					{label: <L p={p} t={`Student`}/>, tightText: true, clickFunction: () => resort('label')},
  					{label: <L p={p} t={`Response`}/>, tightText: true, clickFunction: () => resort('responseEntryDate')},
  					{label: <L p={p} t={`Due date`}/>, tightText: true, clickFunction: () => resort('dueDate')},
  					{label: <L p={p} t={`Course`}/>, tightText: true, clickFunction: () => resort('courseName')},
  					{label: <L p={p} t={`Period`}/>, tightText: true, clickFunction: () => resort('classPeriodName')},
  					{label: <L p={p} t={`Type`}/>, tightText: true, clickFunction: () => resort('contentTypeName')},
  					{label: <L p={p} t={`Instructions`}/>, tightText: true, clickFunction: () => resort('instructions')},
  					{label: <L p={p} t={`File attachment`}/>, tightText: true},
  					{label: <L p={p} t={`Website link`}/>, tightText: true},
  			]
  
  	    let data = assignmentsFiltered && assignmentsFiltered.length > 0 && assignmentsFiltered.map((m, i) =>
  	         [
  						 	{value: <div className={styles.row}>
  													<a onClick={() => handleDocumentOpen(m.assignmentId, '', m)}>
  															<Icon id={'contentAdd'} pathName={'plus'} premium={false} className={styles.icon} fillColor={'green'}/>
  													</a>
  													{m.fileUploadUrls && m.fileUploadUrls.length > 0 && m.fileUploadUrls.map((f, i) =>
  															<a key={i} href={f.label} target={'_blank'} onClick={() => setClickedId(f.id)} className={f.isTeacherResponse ? styles.teacherResponse : ''}>
  																	<Icon pathName={'document0'} premium={true} className={f.isTeacherResponse ? styles.iconTeacherFile : styles.iconCell}
  																			fillColor={clickedId === f.id
  																				? '#e8772e'
  																				: f.isTeacherResponse
  																						? '#8c1d12'
  																						: (accessRoles.admin || accessRoles.facilitator) && f.responseVisitedTypeCode
  																								? visitedColor[f.responseVisitedTypeCode]
  																								: ''} />
  															</a>
  													 )}
  													{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  															<a key={i} href={w.label.indexOf('http') === -1 ? 'http://' + w.label : w.label} target={'_blank'} onClick={() => setClickedId(w.id)} className={w.isTeacherResponse ? styles.teacherResponse : ''}>
  																	<Icon pathName={'link2'} premium={true} className={w.isTeacherResponse ? styles.iconTeacher : styles.iconCell}
  																			fillColor={clickedId === w.id
  																				? '#e8772e'
  																				: w.isTeacherResponse
  																						? '#8c1d12'
  																						: (accessRoles.admin || accessRoles.facilitator) && w.responseVisitedTypeCode
  																								? visitedColor[w.responseVisitedTypeCode]
  																								: ''} />
  															</a>
  													 )}
  													{m.textResponses && m.textResponses.length > 0 && m.textResponses.map((t, i) =>
  															<div key={i} onClick={() => {handleInstructionsOpen(m.title, t.label); setClickedId(t.id)}} className={t.isTeacherResponse ? styles.teacherResponse : ''}>
  																	<Icon pathName={'comment_edit'} premium={true} className={t.isTeacherResponse ? styles.iconTeacher : styles.iconCell}
  																			fillColor={clickedId === t.id
  																										? '#e8772e'
  																										: t.isTeacherResponse
  																												? '#8c1d12'
  																												: (accessRoles.admin || accessRoles.facilitator) && t.responseVisitedTypeCode
  																														? visitedColor[t.responseVisitedTypeCode]
  																														: ''} />
  															</div>
  													)}
  													{m.penspringWorks && m.penspringWorks.length > 0 && m.penspringWorks.map((p, i) =>
  														<a key={i} onClick={() => handlePenspringView(p.id, m)} className={p.isTeacherResponse ? styles.teacherResponse : ''} data-rh={p.label}>
  																<img src={penspringSmall} alt="PS"
  																		className={classes(styles.penspringIcon, (p.isTeacherResponse
  																				? styles.iconTeacherFile
  																				: clickedId === p.id
  																						? styles.visited
  																						: p.isTeacherResponse
  																								? styles.teacherResponse
  																								: ''))}
  																 />
  														</a>
  													)}
  													<a id={'hiddenPenspringLink'} href={`${penspringHost}/lms/${personId}/${penspringWorkId}`} target={`_${penspringWorkId}`}> </a>
  											 </div>
  							},
  							{value: m.canEditScore ? <InputText
  																					name={m.personId + '#$' + m.assignmentId}
  																					size={"super-short"}
  																					value={scores[m.assignmentId + m.personId] || ''}
  																					numberOnly={true}
  																					maxLength={6}
  																					onChange={(event) => handleScore(m.assignmentId, m.personId, event)}
  																					onBlur={(event) => onBlurScore(m.courseScheduledId, m.assignmentId, m.personId, event)}
  																					inputClassName={m.gradingType === 'STUDENT' ? styles.highlight : ''}
  																					onEnterKey={handleEnterKey}/>
  																		 : <div className={styles.score}>{scores[m.assignmentId + m.personId]}</div>},
  							{value: m.totalPoints},
  							{value: m.contentTypeCode === 'DISCUSSION'
  									? <Link to={'/discussionClass/' + m.courseEntryId + '/' + m.discussionEntryId} className={classes(styles.link, styles.row)}><Icon pathName={'chat_bubbles'} premium={true} className={styles.iconCell}/>{m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title}</Link>
  									: m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title},
  							{value: <Link to={`/studentProfile/${m.personId}`} className={styles.link}>{m.firstName + ' ' + m.lastName}</Link>},
  							{value: <DateMoment date={m.responseEntryDate} format={'D MMM'}/>},
  							{value: <DateMoment date={m.dueDate} format={'D MMM'}/>},
  							{value: m.courseName.length > 25 ? m.courseName.substring(0,25) + '...' : m.courseName},
  							{value: m.classPeriodName},
  							{value: m.contentTypeCode === 'QUIZ'
  									? <Link to={'/assessmentQuestions/' + m.assessmentId} className={classes(styles.link, styles.row)}><Icon pathName={'clipboard_check'} premium={true} className={styles.iconCell}/>{m.contentTypeName}</Link>
  									: m.contentTypeCode === 'DISCUSSION'
  											? <Link to={'/discussionClass/' + m.courseEntryId + '/' + m.discussionEntryId} className={classes(styles.link, styles.row)}><Icon pathName={'chat_bubbles'} premium={true} className={styles.iconCell}/>{m.contentTypeName}</Link>
  											: m.contentTypeName},
  							{value: <a onClick={() => handleInstructionsOpen(m.title, m.instructions)} className={styles.link}>{m.instructions.length > 35 ? m.instructions.substring(0,35) + '...' : m.instructions}</a>},
  							{value: <div className={styles.row}>{m.assignmentFileUploadUrls && m.assignmentFileUploadUrls.length > 0 && m.assignmentFileUploadUrls.map((f, i) => <a key={i} href={f} target={'_blank'}><Icon pathName={'document0'} premium={true} className={styles.icon}/></a>)}</div>},
  							{value: <div className={styles.row}>{m.assignmentWebsiteLinks && m.assignmentWebsiteLinks.length > 0 && m.assignmentWebsiteLinks.map((w, i) => <a key={i} href={w.indexOf('http') === -1 ? 'http://' + w : w} target={'_blank'}><Icon pathName={'link2'} premium={true} className={styles.icon}/></a>)}</div>},
  	        ]
  			)
  
  	    return (
  	        <div className={styles.container}>
  							<div className={globalStyles.pageTitle}>
  									{`Assignments Pending Review`}
  							</div>
  							<div className={styles.rowWrap}>
  									<div className={classes(styles.row, styles.moreTop, styles.moreLeft)}>
  											<a onClick={toggleHideSearch} className={classes(styles.row, styles.link, styles.moreLeft)}>
  													<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  													{hideSearch ? <L p={p} t={`Show search controls`}/> : <L p={p} t={`Hide search controls`}/>}
  											</a>
  											<a onClick={refreshPage} className={classes(styles.row, styles.link, styles.moreLeft)}>
  													<Icon pathName={'sync'} premium={true} className={styles.icon}/>
  													<L p={p} t={`Refresh assignment list`}/>
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
  															label={<L p={p} t={`Text search`}/>}
  															value={filters.partialNameText || ''}
  															onChange={changeFilter}
  															inputClassName={styles.partialText}
  															onEnterKey={handlePartialNameEnterKey}/>
  													<a onClick={handlePartialNameTextSubmit} className={styles.nameLinkStyle}>
  															<Icon pathName={`plus`} className={styles.image}/>
  													</a>
  											</div>
  											<div className={styles.moreTop}>
  													<div className={styles.row}>
  															<div>
  																	<span className={styles.label}><L p={p} t={`Due Date From:`}/></span>
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
  			                            checked={filters && filters.contentTypes && filters.contentTypes.indexOf(m.id) > -1}
  																	labelClass={styles.checkboxText}
  																	checkboxClass={styles.marginBottom}
  			                            onClick={() => toggleCheckbox(m.id)}/>
  													)}
  											</div>
  											<div className={classes(styles.moreTop)}>
  													<RadioGroup
  															data={[{ id: "ALL", label: <L p={p} t={`All`}/> }, { id: "STUDENT", label: <L p={p} t={`Student`}/> }, { id: "TEACHER", label: <L p={p} t={`Teacher`}/> }]}
  															title={<L p={p} t={`Graded By`}/>}
  															id={'gradingType'}
  															name={'gradingType'}
  															horizontal={true}
  															className={styles.radio}
  															labelClass={styles.radioLabel}
  															initialValue={filters.gradingType}
  															onClick={(value) => handleRadioChoice('gradingType', value)}/>
  											</div>
  									</div>
  							}
  							<hr />
  							<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  									isFetchingRecord={fetchingRecord.assignmentsPendingReview}/>
  							<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Assignments Pending Review`}/>} path={'assignmentsPendingReview'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  							<OneFJefFooter />
  							{isShowingModal_instructions &&
  									<MessageModal handleClose={handleInstructionsClose} heading={assignmentName}
  										 explain={instructions} onClick={handleInstructionsClose} />
  							}
  							{isShowingModal_document &&
  									<div className={styles.fullWidth}>
  											{<DocumentResponseModal handleClose={handleDocumentClose} showTitle={true} handleSubmit={handleDocumentSave}
  													responseData={student} assignmentId={student.assignmentId} personId={personId} companyConfig={companyConfig}
  													course={student} recallInitRecords={recallInitRecords} accessRoles={accessRoles} courseScheduledId={student.courseScheduledId}
  													handleRemove={removeStudentResponse} clickedUrl={clickedUrl} student={student}
  													setResponseVisitedType={setResponseVisitedType} fileUploads={student.fileUploads} websiteLinks={student.websiteLinks}
  													textResponses={student.textResponses} />}
  									</div>
  							}
  	      	</div>
  	    )
}

export default withAlert(AssignmentsPendingReviewView)


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


//See line 182:  maxNumber={Number(m.totalPoints) + Number(m.extraCredit)}
