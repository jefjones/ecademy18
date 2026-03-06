import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import {penspringHost} from '../../penspring_host'
import {apiHost} from '../../api_host'
import styles from './AssignmentListView.css'
const p = 'AssignmentListView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import psPlus from '../../assets/ps_plus.png'
import psDistributePending from '../../assets/ps_distribute_pending.png'
import psDistributed from '../../assets/ps_distributed.png'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import InputText from '../../components/InputText'
import TextDisplay from '../../components/TextDisplay'
import RadioGroup from '../../components/RadioGroup'
import DateTimePicker from '../../components/DateTimePicker'
import Checkbox from '../../components/Checkbox'
import FileUploadModal from '../../components/FileUploadModal'
import MessageModal from '../../components/MessageModal'
import TextareaModal from '../../components/TextareaModal'
import AssignmentListMenu from '../../components/AssignmentListMenu'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {wait} from '../../utils/wait'
import { withAlert } from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'

function AssignmentListView(props) {
  const [scores, setScores] = useState([])
  const [isShowingFileUpload_course, setIsShowingFileUpload_course] = useState(false)
  const [isShowingWebsiteLink_course, setIsShowingWebsiteLink_course] = useState(false)
  const [isShowingFileUpload_assignment, setIsShowingFileUpload_assignment] = useState(false)
  const [isShowingWebsiteLink_assignment, setIsShowingWebsiteLink_assignment] = useState(false)
  const [isShowingModal_removeCourseDoc, setIsShowingModal_removeCourseDoc] = useState(false)
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(false)
  const [hideSearch, setHideSearch] = useState(true)
  const [filters, setFilters] = useState({
							partialNameText: '',
							dueDateFrom: '',
							dueDateTo: '',
							contentTypes: [],
							showSet: 'all'
					})
  const [partialNameText, setPartialNameText] = useState('')
  const [dueDateFrom, setDueDateFrom] = useState('')
  const [dueDateTo, setDueDateTo] = useState('')
  const [showSet, setShowSet] = useState('all')
  const [sendToHiddenPenspringLink, setSendToHiddenPenspringLink] = useState(undefined)
  const [isParamAssignment, setIsParamAssignment] = useState(undefined)
  const [assignmentId, setAssignmentId] = useState(undefined)
  const [instructions, setInstructions] = useState(undefined)
  const [assignmentName, setAssignmentName] = useState(undefined)
  const [penspringWorkId, setPenspringWorkId] = useState(undefined)
  const [isShowingPenspringFile_assignment, setIsShowingPenspringFile_assignment] = useState(undefined)
  const [sendAssignment, setSendAssignment] = useState(undefined)
  const [assignment, setAssignment] = useState(undefined)
  const [isShowingModal_display, setIsShowingModal_display] = useState(undefined)
  const [modalDisplay, setModalDisplay] = useState(undefined)
  const [modalTitle, setModalTitle] = useState(undefined)
  const [p, setP] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {assignmentId, assignment} = props
    			
    
    			if (sendToHiddenPenspringLink) {
    					setSendToHiddenPenspringLink(false)
    					document.getElementById('hiddenPenspringLink').click()
    			}
    			if (!isParamAssignment && assignment && assignment.assignmentId) {
    					setIsParamAssignment(true); setAssignmentId(assignmentId); setAssignment(assignment)
    			}
    	
  }, [])

  const setIcons = (assignment, clickedId) => {
    
    			const {accessRoles} = props
    			if (accessRoles.admin || accessRoles.facilitator) {
    					//pencil - edit
    					//plus - add another assignment
    
    					return (
    							<div className={styles.row}>
    									<div className={styles.row}>
    											<div className={styles.row}>
    													{assignment.assignmentFileUploads && assignment.assignmentFileUploads.length > 0 && assignment.assignmentFileUploads.map((f, i) =>
    															<a key={i} href={f.url} target={'_blank'} onClick={() => setClickedId(f.assignmentFileId)} data-rh={f.name}>
    																	<Icon pathName={'document0'} premium={true} className={styles.iconIntable} fillColor={clickedId === f.assignmentFileId ? '#e8772e' : ''}/>
    															</a>)
    													 }
    											 </div>
    											 <div className={styles.row}>
    													{assignment.websiteLinks && assignment.websiteLinks.length > 0 && assignment.websiteLinks.map((w, i) =>
    															<a key={i} href={w.websiteLink.indexOf('http') === -1 ? 'http://' + w.websiteLink : w.websiteLink} target={'_blank'} onClick={() => setClickedId(w.assignmentWebsiteLinkId)} data-rh={w.websiteLink}>
    																	<Icon pathName={'link2'} premium={true} className={styles.iconIntable} fillColor={clickedId === w.assignmentWebsiteLinkId ? '#e8772e' : ''}/>
    															</a>)
    													 }
    											 </div>
    					 					 	 <div className={styles.row}>
    	 												{assignment.penspringFiles && assignment.penspringFiles.length > 0 && assignment.penspringFiles.map((p, i) =>
    															<a key={i} onClick={() => handlePenspringView(p.penspringWorkId, assignment)} className={styles.psImage} data-rh={p.publishedDate ? 'Assignment is published' : 'Assignment is not published yet'}>
    																	<img src={p.publishedDate ? psDistributed : psDistributePending} alt="PS" className={styles.penspringIcon}/>
    															</a>
    	 												 )}
    	 										 </div>
    									</div>
    							</div>
    					)
    			} else if (accessRoles.learner) {
    					//individual Message
    					//class discussionClass
    					//upload file
    					//add website link
    					return (
    							<div className={styles.row}>
    							</div>
    					)
    			}
    	
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

  const fileUploadBuildUrl = (title) => {
    
          const {personId, courseEntryId} = props
          return `${apiHost}ebi/courseDocuments/fileUpload/` + personId + `/` + courseEntryId + `/` + encodeURIComponent(title)
      
  }

  const recallAfterFileUpload = () => {
    
        	const {courseDocumentsInit, assignmentsInit, personId, courseEntryId} = props
        	courseDocumentsInit(personId, courseEntryId)
    			assignmentsInit(personId, courseEntryId)
      
  }

  const fileUploadBuildUrl_assignment = (title) => {
    
    			const {personId} = props
          
          return `${apiHost}ebi/assignments/fileUpload/` + personId + `/` + assignmentId + `/` + encodeURIComponent(title)
      
  }

  const recallAfterFileUpload_assignment = () => {
    
        	const {assignmentsInit, personId, courseEntryId} = props
        	assignmentsInit(personId, courseEntryId)
      
  }

  const handleInstructionsOpen = (assignmentName, instructions) => {
    return setIsShowingModal_instructions(true); setInstructions(instructions); setAssignmentName(assignmentName)
    

  }
  const handleInstructionsClose = () => {
    return setIsShowingModal_instructions(false); setInstructions(''); setAssignmentName('')
    

  }
  const handleFileUploadOpen = () => {
    return setIsShowingFileUpload_course(true)

  }
  const handleFileUploadClose = () => {
    return setIsShowingFileUpload_course(false)

  }
  const handleSubmitFile = () => {
    
          const {courseDocumentsInit, personId, courseEntryId} = props
          courseDocumentsInit(personId, courseEntryId)
    			handleFileUploadClose()
      
  }

  const handleWebsiteLinkOpen = () => {
    return setIsShowingWebsiteLink_course(true)

  }
  const handleWebsiteLinkClose = () => {
    return setIsShowingWebsiteLink_course(false)

  }
  const handleWebsiteLinkSave = (websiteLink, websiteTitle) => {
    
    			const {saveCourseWebsiteLink, courseEntryId, personId} = props
    			saveCourseWebsiteLink(personId, courseEntryId, websiteLink, websiteTitle)
    			handleWebsiteLinkClose()
    	
  }

  const setClickedId = (clickedId) => {
    
    			setClickedId(clickedId)
    	
  }

  const handleUpdateInterval = (value) => {
    
    			const {personId, updatePersonConfig, assignmentsInit, courseEntryId} = props
    			updatePersonConfig(personId, 'IntervalId', value)
    			wait(1000)
    			navigate('/assignmentList/' + courseEntryId)
    			assignmentsInit(personId, courseEntryId)
    	
  }

  const handlePenspringView = (penspringWorkId, assignment) => {
    
    			const {setPenspringTransfer, personId} = props
    			let transfer = {
    					assignmentId: assignment.assignmentId,
    					transferCode: 'STARTWRITING',
    					workId: penspringWorkId,
    					ownerPersonId: personId,
    					editorPersonId: '', //This doesn't get distributed until the teacher is done with creating the file and distributes it from the Penspring side.
    					isTeacher: true,
    					//courseEntryId: course && course.courseEntryId,
    			}
    			setPenspringWorkId(penspringWorkId); setSendToHiddenPenspringLink(true)
    			setPenspringTransfer(personId, transfer)
    			props.alert.info(<div className={styles.alertText}><L p={p} t={`Check the brower's tab for the penspring file if it doesn't open up automatically.`}/></div>)
    	
  }

  const chooseRecord = (assignment) => {
    return setAssignmentId(assignment.assignmentId); setAssignment(assignment)
  }

  const handlePenspringFileOpen_assignment = (assignment) => {
    return setIsShowingPenspringFile_assignment(true); setSendAssignment(assignment)

  }
  const handlePenspringFileClose_assignment = () => {
    return setIsShowingPenspringFile_assignment(false); setAssignment({})

  }
  const handleSubmitFile_assignment = () => {
    
    			const {assignmentsInit, personId, assignment} = props
    			assignmentsInit(personId, assignment.courseEntryId)
    			handlePenspringFileClose_assignment()
    	
  }

  const handleFileUploadOpen_assignment = (assignmentId) => {
    return setIsShowingFileUpload_assignment(true); setAssignmentId(assignmentId)

  }
  const handleFileUploadClose_assignment = () => {
    return setIsShowingFileUpload_assignment(false)

  }
  const handleWebsiteLinkOpen_assignment = (assignmentId) => {
    return setIsShowingWebsiteLink_assignment(true); setAssignmentId(assignmentId)

  }
  const handleWebsiteLinkClose_assignment = () => {
    return setIsShowingWebsiteLink_assignment(false)

  }
  const handleWebsiteLinkSave_assignment = (websiteLink) => {
    
    			const {saveAssignmentWebsiteLink, personId} = props
    			
    			saveAssignmentWebsiteLink(personId, assignmentId, websiteLink)
    			handleWebsiteLinkClose_assignment()
    	
  }

  const handleDisplayClose = () => {
    return setIsShowingModal_display(false); setModalDisplay('')

  }
  const handleDescriptionOpen = (modalDisplay) => {
    return setIsShowingModal_display(true); setModalTitle(<L p={p} t={`Description`}/>); setModalDisplay(modalDisplay)

  }
  const handleShowListOpen = (modalTitle, list) => {
    
    	
  }

  const {fetchingRecord, personId, courseEntryId, courseDocuments, course={}, assignments, contentTypes, accessRoles={}, intervals, personConfig,
  						companyConfig, languageList, createWorkAndPenspringTransfer, assignmentsInit, sequences, saveAssignmentWebsiteLink, removeAssignment} = props
  		let assignmentsFiltered = assignments
  
  		if (filters.partialNameText) assignmentsFiltered = assignmentsFiltered.filter(m => m.title.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1)
  		if (filters.dueDateFrom || filters.dueDateTo) {
  				if (filters.dueDateFrom && filters.dueDateTo) {
  						assignmentsFiltered = assignmentsFiltered.filter(m => m.dueDate >= filters.dueDateFrom && m.dueDate <= filters.dueDateTo)
  				} else if (filters.dueDateFrom) {
  						assignmentsFiltered = assignmentsFiltered.filter(m => m.dueDate >= filters.dueDateFrom)
  				} else if (filters.dueDateTo) {
  						assignmentsFiltered = assignmentsFiltered.filter(m => m.dueDate <= filters.dueDateTo)
  				}
  		}
  		if (filters.contentTypes && filters.contentTypes.length > 0) assignmentsFiltered = assignmentsFiltered.filter(m => filters.contentTypes.indexOf(m.contentTypeId) > -1)
  
      let headings = [
  				{label: <L p={p} t={`Teacher attachments`}/>, tightText: true},
  				{label: <L p={p} t={`Sort order`}/>, tightText: true},
  				{label: <L p={p} t={`Type`}/>, tightText: true},
  				{label: <L p={p} t={`Due date`}/>, tightText: true},
  				{label: <L p={p} t={`Possible score`}/>, tightText: true},
  				{label: <L p={p} t={`Name`}/>, tightText: true},
  				{label: <L p={p} t={`Instructions`}/>, tightText: true},
  		]
  
  		if (course.gradingType === 'STANDARDSRATING') headings = headings.concat([{label: <L p={p} t={`Standards`}/>, tightText: true},])
  		headings = headings.concat([
  				{label: <L p={p} t={`Courses`}/>, tightText: true},
  				{label: <L p={p} t={`Students`}/>, tightText: true},
  		])
  
      let data = assignmentsFiltered && assignmentsFiltered.length > 0 && assignmentsFiltered.map((m, i) => {
  				let row = [
  					 	{value: setIcons(m, clickedId),
  								clickFunction: () => chooseRecord(m),
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
  						{value: <div className={styles.lessTop}>
  												<SelectSingleDropDown
  														id={m.assignmentId}
  														label={``}
  														value={m.sequence}
  														noBlank={true}
  														options={sequences}
  														onChange={(event) => reorderSequence(m.assignmentId, event)}/>
  										</div>,
  								clickFunction: () => chooseRecord(m),
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
  						{value: m.assessmentId && m.assessmentId !== guidEmpty //contentTypeCode === 'QUIZ'
  								? <Link to={'/assessmentQuestions/' + m.assessmentId} className={classes(styles.link, styles.row)}  data-rh={!m.hasAssessmentQuestions ? 'This is not an automated quiz until questions are entered. Click on the Quiz link to add questions, if necessary.' : m.isPublished ? 'This quiz is published' : 'This quiz is not published'}>
  											<Icon pathName={'clipboard_check'} premium={true} className={styles.iconCell}/>
  											{m.contentTypeName}
  											{m.hasAssessmentQuestions
  													? <Icon pathName={'earth'} premium={true} className={styles.iconQuiz} fillColor={m.isPublished ? 'green' : 'red'} />
  													: <div className={styles.row}><div className={styles.questionMark}>?</div><Icon pathName={'prohibited'} fillColor={'red'} premium={true} className={styles.iconOverlap}/></div>}
  									</Link>
  								: m.contentTypeCode === 'DISCUSSION'
  										? <Link to={'/discussionClass/' + m.courseEntryId + '/' + m.discussionEntryId} className={classes(styles.link, styles.row)}><Icon pathName={'chat_bubbles'} premium={true} className={styles.iconCell}/>{m.contentTypeName}</Link>
  										: m.contentTypeName,
  
  								clickFunction: () => chooseRecord(m),
  								notShowLink: (!m.assessmentId || m.assessmentId === guidEmpty) && m.contentTypeCode !== 'DISCUSSION', //m.contentTypeCode !== 'QUIZ'
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
  						{value: <DateMoment date={m.dueDate} format={'D MMM'}/>,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
  						{value: m.totalPoints,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
  						{value: m.assessmentId && m.assessmentId !== guidEmpty //m.contentTypeCode === 'QUIZ'
  												? <Link to={'/assessmentQuestions/' + m.assessmentId} className={classes(styles.link, styles.row)}>
  															<Icon pathName={'clipboard_check'} premium={true} className={styles.iconCell}/>
  															{m.title}
  													</Link>
  												: m.title,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: !m.assessmentId || m.assessmentId === guidEmpty, //m.contentTypeCode !== 'QUIZ',
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
  						{value: m.contentTypeCode === 'DISCUSSION'
  								? (m.discussionMinPost && (m.discussionMinPost === 1 ? <L p={p} t={`${m.discussionMinPost} direct post; `}/> : <L p={p} t={`${m.discussionMinPost} direct posts; `}/>))
  										+ (m.discussionMinComment && (m.discussionMinComment === 1 ? <L p={p} t={`${m.discussionMinComment} comment; `}/> : <L p={p} t={`${m.discussionMinComment} comments; `}/>))
  										+ (m.discussionWordCount && (m.discussionWordCount === 1 ? <L p={p} t={`${m.discussionWordCount} minimum word; `}/> : <L p={p} t={`${m.discussionWordCount} minimum words. `}/>))
  								: <a onClick={() => handleInstructionsOpen(m.title, m.instructions)} className={styles.link}>{m.instructions && m.instructions.length > 35 ? m.instructions.substring(0,35) + '...' : m.instructions}</a>,
  								clickFunction: () => chooseRecord(m),
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						}
  				]
  
  				if (course.gradingType === 'STANDARDSRATING') row = row.concat([{value: m.standards && m.standards.length,
  						clickFunction: () => {chooseRecord(m); handleShowListOpen(<L p={p} t={`This Assignment's Standard(s)`}/>, m.standards)},
  						cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  				}])
  
  				row = row.concat([
  						{value: m.coursesSpecific && m.coursesSpecific.length,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
  						{value: m.studentsAssigned && m.studentsAssigned.length,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.assignmentId === assignmentId ? 'highlight' : ''
  						},
          ])
  				return row
  		})
  
      if ((!data || data.length === 0) && fetchingRecord && !fetchingRecord.assignments) {
          data = [[{value: ''},
  				{value: <div className={styles.noRecords}><L p={p} t={`No assignments found`}/></div>, colSpan: true }]]
      }
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								{'Course Assignments'}
  						</div>
  						<div className={styles.rowWrap}>
  								<div>
  										<TextDisplay text={course.courseName} className={styles.moreTop} />
  										<div className={styles.moreLeft}>
  												<a onClick={toggleHideSearch} className={classes(styles.row, styles.link, styles.moreLeft)}>
  														<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  														{hideSearch ? <L p={p} t={`Show search controls`}/> : <L p={p} t={`Hide search controls`}/>}
  												</a>
  										</div>
  								</div>
  								<div className={styles.alotLeft}>
  										<div className={styles.row}>
  												<div className={classes(styles.moreTop, styles.label)}><L p={p} t={`Course Documents`}/></div>
  												<div className={styles.moveTop}>
  														<a onClick={handleFileUploadOpen} className={classes(styles.muchLeft, globalStyles.link)}><L p={p} t={`Add file`}/></a> |
  														<a onClick={handleWebsiteLinkOpen} className={classes(styles.moreLeft, globalStyles.link)}><L p={p} t={`Add link`}/></a>
  												</div>
  										</div>
  										{courseDocuments && courseDocuments.length > 0 && courseDocuments.map((f, i) => (
  												<div key={i} className={styles.row}>
  														<div className={styles.linkDisplay}>
  																{(accessRoles.admin || accessRoles.facilitator) &&
  																		<a onClick={() => handleRemoveCourseDocOpen(f.courseDocumentId)} className={styles.remove}>
  																				<L p={p} t={`remove`}/>
  																		</a>
  																}
  																<a href={f.websiteLink ? f.websiteLink.indexOf('http') === -1 ? 'http://' + f.websiteLink : f.websiteLink : f.urlTemp}
  																		className={classes(globalStyles.link, styles.moreSpace)} target="_blank">
  																		{f.title}
  																</a>
  														</div>
  												</div>
  										))}
  										{(!courseDocuments || courseDocuments.length === 0) &&
  												<div className={styles.noDocs}><L p={p} t={`No documents found`}/></div>
  										}
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
  														<Icon pathName={`plus`} fillColor={'green'} className={styles.image}/>
  												</a>
  										</div>
  										<div className={styles.moreTop}>
  												<div className={styles.headLabel}><L p={p} t={`Due date range`}/></div>
  												<div className={styles.row}>
  														<div>
  																<span className={styles.label}><L p={p} t={`From:`}/></span>
  																<DateTimePicker id={`dueDateFrom`} value={filters.dueDateFrom} onChange={(event) => changeFilter(event, 'dueDateFrom')}/>
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
  								</div>
  						}
  						<hr />
  						<div>
  								<RadioGroup
  										data={intervals}
  										name={`Semester`}
  										horizontal={false}
  										className={styles.radio}
  										initialValue={personConfig.intervalId || companyConfig.intervalId}
  										personId={personId}
  										noBlank={true}
  										onClick={handleUpdateInterval}/>
  						</div>
  						<AssignmentListMenu personId={personId} languageList={languageList} createWorkAndPenspringTransfer={createWorkAndPenspringTransfer}
  								assignmentsInit={assignmentsInit} saveAssignmentWebsiteLink={saveAssignmentWebsiteLink} assignment={assignment}
  								sendInBuildUrl={fileUploadBuildUrl_assignment} handleRecordRecall={recallAfterFileUpload_assignment}
  								companyConfig={companyConfig} accessRoles={accessRoles} course={course} removeAssignment={removeAssignment}/>
  						<Link to={`/assignmentEntry/${courseEntryId}`} className={classes(styles.row, styles.link, styles.moreLeft, styles.moreTop)}>
  								<Icon pathName={'plus'} fillColor={'green'} className={styles.iconSmaller}/>
  								<L p={p} t={`Add an assignment`}/>
  						</Link>
  						<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  								isFetchingRecord={fetchingRecord.assignments}/>
  						{assignmentsFiltered && assignmentsFiltered.length > 9 && !(fetchingRecord && fetchingRecord.assignments) &&
  								<Link to={`/assignmentEntry/${courseEntryId}`} className={classes(styles.row, styles.link, styles.moreLeft)}>
  										<Icon pathName={'plus'} fillColor={'green'} className={styles.iconSmaller}/>
  										<L p={p} t={`Add an assignment`}/>
  								</Link>
  						}
  						<OneFJefFooter />
  						{(isShowingFileUpload_course || isShowingFileUpload_assignment) &&
                  <FileUploadModal handleClose={isShowingFileUpload_course ? handleFileUploadClose : handleFileUploadClose_assignment}
  										title={isShowingFileUpload_course ? <L p={p} t={`Course Document`}/> : <L p={p} t={`Assigment Attachment`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={true}
                      personId={personId} submitFileUpload={isShowingFileUpload_course ? handleSubmitFile : handleSubmitFile_assignment}
  										sendInBuildUrl={isShowingFileUpload_course ? fileUploadBuildUrl : fileUploadBuildUrl_assignment}
                      handleRecordRecall={isShowingFileUpload_course ? recallAfterFileUpload : recallAfterFileUpload_assignment}
                      acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .mp4, .mov, .m4a"}
                      iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.mp4', '.mov', 'm4a']}/>
              }
  						{(isShowingWebsiteLink_assignment || isShowingWebsiteLink_course) &&
                  <TextareaModal key={'all'} handleClose={isShowingWebsiteLink_course ? handleWebsiteLinkClose : handleWebsiteLinkClose_assignment}
  										heading={<L p={p} t={`Website Link`}/>} explain={isShowingWebsiteLink_course ? <L p={p} t={`Choose a website link for this course.`}/> : <L p={p} t={`Choose a website link for an assessment question.`}/>}
                     onClick={isShowingWebsiteLink_course ? handleWebsiteLinkSave : handleWebsiteLinkSave_assignment} placeholder={<L p={p} t={`Website URL?`}/>}
  									 showTitle={true}/>
              }
  						{isShowingModal_removeCourseDoc &&
                  <MessageModal handleClose={handleRemoveCourseDoc} heading={<L p={p} t={`Remove this course document?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this course document?`}/>} isConfirmType={true}
                     onClick={handleRemoveCourseDoc} />
              }
  						{isShowingModal_instructions &&
  								<MessageModal handleClose={handleInstructionsClose} heading={assignmentName}
  									 explain={instructions} onClick={handleInstructionsClose} />
  						}
  						{isShowingModal_display &&
  								<MessageModal handleClose={handleDisplayClose} heading={modalTitle} explainJSX={modalDisplay} onClick={handleDisplayClose} />
  						}
  						<a id={'hiddenPenspringLink'} href={`${penspringHost}/lms/${personId}/${penspringWorkId}`} target={`_${penspringWorkId}`}> </a>
        	</div>
      )
}
export default withAlert(AssignmentListView)


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
