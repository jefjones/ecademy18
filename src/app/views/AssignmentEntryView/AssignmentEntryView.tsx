import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AssignmentEntryView.css'
const p = 'AssignmentEntryView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import TextDisplay from '../../components/TextDisplay'
import RadioGroup from '../../components/RadioGroup'
import Checkbox from '../../components/Checkbox'
import InputText from '../../components/InputText'
import DateTimePicker from '../../components/DateTimePicker'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Required from '../../components/Required'
import MultiSelect from '../../components/MultiSelect'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import InputDataList from '../../components/InputDataList'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function AssignmentEntryView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal_removeFile, setIsShowingModal_removeFile] = useState(false)
  const [isShowingModal_removeWebsite, setIsShowingModal_removeWebsite] = useState(false)
  const [isShowingModal_numberOnly, setIsShowingModal_numberOnly] = useState(false)
  const [isShowingModal_noStudents, setIsShowingModal_noStudents] = useState(false)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [contentType, setContentType] = useState('')
  const [assignment, setAssignment] = useState({
              assignmentId: '',
              sequence: props.insertSequence,
              courseEntryId: '',
              title: '',
              subtitle: '',
              contentTypeId: '',
							intervalId: '',
              instructions: '',
							totalPoints: 0,
							extraCredit: 0,
              mustComplete: true,
              gradable: true,
							dueDate: '',
							gradingTypes: [],
							studentsAssigned: ''
          })
  const [assignmentId, setAssignmentId] = useState('')
  const [sequence, setSequence] = useState(props.insertSequence)
  const [courseEntryId, setCourseEntryId] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [contentTypeId, setContentTypeId] = useState('')
  const [intervalId, setIntervalId] = useState('')
  const [instructions, setInstructions] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [extraCredit, setExtraCredit] = useState(0)
  const [mustComplete, setMustComplete] = useState(true)
  const [gradable, setGradable] = useState(true)
  const [dueDate, setDueDate] = useState('')
  const [gradingTypes, setGradingTypes] = useState([])
  const [studentsAssigned, setStudentsAssigned] = useState('')
  const [errorTitle, setErrorTitle] = useState('')
  const [errorContentType, setErrorContentType] = useState('')
  const [errorInstruction, setErrorInstruction] = useState('')
  const [errorTotalPoints, setErrorTotalPoints] = useState('')
  const [errorCoursesSpecific, setErrorCoursesSpecific] = useState('')
  const [selectedStandards, setSelectedStandards] = useState(assignment.standards)
  const [isInit, setIsInit] = useState(true)
  const [coursesSpecific, setCoursesSpecific] = useState(coursesRelated && coursesRelated.length > 0 && coursesRelated.map(m => m.courseScheduledId))
  const [p, setP] = useState(undefined)
  const [errorStandardsRating, setErrorStandardsRating] = useState("You must choose at least one standard")
  const [errorDiscussion, setErrorDiscussion] = useState(<L p={p} t={`For Discussion type, At least one post or one comment is required.`}/>)
  const [openFileAttach, setOpenFileAttach] = useState(!this.state.openFileAttach)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')

  useEffect(() => {
    return () => {
      
      			setAssignment({}); setIsInit(false)
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			if (!isInit && assignment && assignment.assignmentId) {
    					if (assignment.standards && assignment.standards.length > 0) {
    							assignment.standardIds = assignment.standards.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], [])
    					}
    					setAssignment(assignment); setSelectedStandards(assignment.standards); setIsInit(true)
    			}
      
  }, [])

  const {coursesRelated, sequences, className, contentTypes, course={}, courseTypes, intervals, personConfig, insertSequence, students=[], standards=[],
  							studentCourseAssigns, benchmarkTests=[]} = props
  
  			let interval = intervals && intervals.length > 0 && intervals.filter(m => m.id === personConfig.intervalId)[0]
  			let intervalName = interval && interval.label ? interval.label : ''
  			let studentsLocal = []
        studentCourseAssigns && studentCourseAssigns.length > 0 && students && students.length > 0 && students.forEach(m => {
  					coursesSpecific && coursesSpecific.length > 0 && coursesSpecific.forEach(courseScheduledId => {
                studentCourseAssigns.forEach(s => {
                    if (s.id === m.id) {
                        let alreadyExists = false
                        studentsLocal && studentsLocal.length > 0 && studentsLocal.forEach(d => { if (d.id === s.id) alreadyExists = true; })
                        if (!alreadyExists) studentsLocal = studentsLocal && studentsLocal.length > 0 ? studentsLocal.concat(m) : [m]
                    }
                })
  					})
  			})
  
  			let setAllStudents = []
  			if (!(assignment && assignment.assignmentId)) {
  					setAllStudents = students && students.length > 0
  							&& students.reduce((acc, m) => {
  									if (acc.indexOf(m.id) === -1) {
  											acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id]
  									}
  									return acc
  							}, [])
  
  					assignment.studentsAssigned = setAllStudents
  			}
  
  const isNumbersOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(e.target.value)) {
      setAssignment({ ...assignment, [e.target.name]: e.target.value })
    } else {
      setIsShowingModal_numberOnly(true)
    }
  }

        return (
            <div className={classes(styles.container, className)}>
  							<div className={globalStyles.pageTitle}>
  									{assignment.assignmentId ? <L p={p} t={`Update Assignment`}/> : <L p={p} t={`Add Assignment`}/>}
  							</div>
                <div className={styles.moreTop}>
                    <TextDisplay label={`Course`} text={course && course.courseName} />
  									<TextDisplay label={<L p={p} t={`Interval`}/>} text={intervalName} />
                </div>
                <InputText
                    id={`title`}
                    name={`title`}
                    size={"medium-long"}
                    label={<L p={p} t={`Title`}/>}
                    //autoFocus={!props.assignment || !props.assignment.title}
                    value={assignment.title || ''}
                    onChange={changeAssignment}
  									required={true}
  									whenFilled={assignment.title}
                    error={errorTitle} />
  
  							{!assignment.assignmentId &&
  									<div>
  			                <SelectSingleDropDown
  			                    id={`contentTypeId`}
  			                    label={<L p={p} t={`Content type`}/>}
  			                    value={assignment.contentTypeId}
  			                    options={contentTypes}
  			                    className={styles.moreBottomMargin}
  			                    height={`medium`}
  													noBlank={false}
  			                    onChange={changeAssignment}
  													required={true}
  													whenFilled={assignment.contentTypeId}
  			                    error={errorContentType}/>
  									</div>
  							}
  							{(contentTypeCode === "ASSESSMENT" || contentTypeCode === "QUIZ" || contentTypeCode === "MIDTERM" || contentTypeCode === "FINAL" || assignment.contentTypeCode === "EXAM") &&
                    <div className={globalStyles.instructionsBigger}>
  											<L p={p} t={`After submitting this record, the assessment activity will have a link for you to follow to create the assessment.`}/>
  									</div>
                }
  							{assignment.assignmentId &&
  									<div className={styles.textDisplay}>
  											<TextDisplay label={<L p={p} t={`Content type`}/>} text={assignment.contentTypeName} className={styles.textDisplay} labelClass={styles.labelDisplay}/>
  											<div className={styles.labelNotice}><L p={p} t={`Cannot update content type when updating an assignment.`}/></div>
  									</div>
  							}
  							<hr/>
  							{assignment.contentTypeCode !== 'BENCHMARK' &&
  									<div>
  											<div className={styles.row}>
  													<span className={styles.headLabel}><L p={p} t={`Total points possible`}/></span>
  													<Required setIf={true} setWhen={assignment.totalPoints} className={styles.smallRequired}/>
  											</div>
  											<div className={styles.rowPoints}>
  													<div className={styles.plusExtraCredit}><L p={p} t={`Points:`}/></div>
  													<input
  															onChange={isNumbersOnly}
  															type={`text`}
  															id={`totalPoints`}
  															name={`totalPoints`}
  															value={assignment.totalPoints || ''}
  															className={styles.input_superShort}
  															maxLength={5}/>
  													 <div className={styles.plusExtraCredit}><L p={p} t={`+ extra credit:`}/></div>
  													 <div>
  															 <input
  						 											onChange={isNumbersOnly}
  						 											type={`text`}
  						 											id={`extraCredit`}
  						 											name={`extraCredit`}
  						 											value={assignment.extraCredit || ''}
  						 											className={styles.input_superShort}
  						 											maxLength={5}/>
  													 </div>
  													 <div className={styles.plusExtraCredit}>=</div>
  													 <div className={styles.totalPoints}>{getTotalPoints()}</div>
  											 </div>
  											 {errorTotalPoints && <div className={styles.error}>{errorTotalPoints}</div>}
  											 <hr/>
  									</div>
  							}
                {contentTypeCode === "DIRECTINSTRUCTION" &&
  	                <div className={styles.labelNotice}><L p={p} t={`The learner will be expected to be involved in direct instruction from a facilitator, which the facilitator can mark off in the grading section.`}/></div>
                }
                {contentTypeCode === "JOURNAL" &&
                    <div className={styles.labelNotice}><L p={p} t={`The learner will be presented with a link that takes them to their journal to make an entry that will be associated with this activity.`}/></div>
                }
                {contentTypeCode === "DISCUSSION" &&
                    <div>
                        <div className={styles.labelNotice}><L p={p} t={`Determine the minimum number of posts and comments that the student must enter. If the student only partially completes the requirements, the percent of the score will be calculated.`}/></div>
                        <InputText
                            id={`discussionMinPost`}
                            name={`discussionMinPost`}
                            size={"short"}
                            label={<L p={p} t={`Posts (minimum)`}/>}
                            value={assignment.discussionMinPost || ''}
                            onChange={changeAssignment}
  													error={errorDiscussion}/>
                        <InputText
                            id={`discussionWordCount`}
                            name={`discussionWordCount`}
                            size={"short"}
                            label={<L p={p} t={`Word count entry (minimum)`}/>}
                            value={assignment.discussionWordCount || ''}
                            onChange={changeAssignment}/>
                        <InputText
                            id={`discussionMinComment`}
                            name={`discussionMinComment`}
                            size={"short"}
                            label={<L p={p} t={`Comments to others' posts (minimum)`}/>}
                            value={assignment.discussionMinComment || ''}
                            onChange={changeAssignment}
  													error={errorDiscussion}/>
                    </div>
                }
  							{(contentTypeCode === "ASSESSMENT" || contentTypeCode === "QUIZ" || contentTypeCode === "MIDTERM" || contentTypeCode === "FINAL" || assignment.contentTypeCode === "EXAM")
                        && course.gradingType === 'STANDARDSRATING' &&
  									<div className={globalStyles.instructionsBigger}>
  											<L p={p} t={`If you do not intend to add assessment questions to this assignment, then choosing at least one standard is necessary for the standards based grading result.`}/>
  									</div>
  							}
  							{course.gradingType === 'STANDARDSRATING' && assignment.contentTypeCode !== 'BENCHMARK' &&
  									<div className={styles.listPosition}>
  											<InputDataList
  													label={<L p={p} t={`Standards`}/>}
  													name={'standardIds'}
  													options={standards || [{id: '', value: ''}]}
  													value={selectedStandards}
  													multiple={true}
  													height={`medium`}
  													className={styles.moreTop}
  													onChange={chooseStandards}
  													required={course.gradingType === 'STANDARDSRATING' && assignment.contentTypeCode !== "ASSESSMENT"
  																	&& assignment.contentTypeCode !== "QUIZ" && assignment.contentTypeCode !== "MIDTERM"
  																	&& assignment.contentTypeCode !== "FINAL" && assignment.contentTypeCode !== "EXAM"}
  													whenFilled={selectedStandards}
  													error={errorStandardsRating}/>
  		              </div>
  							}
  							{assignment.contentTypeCode === 'BENCHMARK' &&
  									<div>
  											<SelectSingleDropDown
  													id={'benchmarkTestId'}
  													label={<L p={p} t={`BenchmarkTest`}/>}
  													value={assignment.benchmarkTestId || (insertSequence)}
  													options={benchmarkTests}
  													className={styles.dropdown}
  													required={true}
  													whenFilled={assignment.benchmarkTestId}
  													onChange={changeAssignment}/>
  									</div>
  							}
  							<div className={styles.row}>
                    <span className={classes(styles.label, styles.moreTop)}>{assignment.contentTypeCode === "DISCUSSION" ? <L p={p} t={`Discussion entry`}/> : <L p={p} t={`Instructions`}/>}</span><br/>
  									{/*<div> <Required setIf={true} setWhen={assignment.instructions} className={styles.smallRequired}/> </div>*/}
  							</div>
                <textarea rows={5} cols={45}
                        id={`instructions`}
                        name={`instructions`}
                        value={assignment.instructions || ''}
  											onChange={changeAssignment}
                        className={styles.commentTextarea}>
                </textarea><br/>
                <span className={styles.error}>{errorInstruction}</span>
  							<DateTimePicker label={<L p={p} t={`Due date (optional)`}/>} id={`dueDate`} className={styles.moreTop}
  									value={assignment.dueDate && assignment.dueDate.indexOf('T') > -1 ? assignment.dueDate.substring(0, assignment.dueDate.indexOf('T')) : assignment.dueDate}
  									onChange={(event) => changeDueDate('dueDate', event)}/>
  							<div>
  									<SelectSingleDropDown
  											id={'sequence'}
  											label={<L p={p} t={`Sequence in order`}/>}
  											value={assignment.sequence || (insertSequence)}
  											noBlank={true}
  											options={sequences}
  											className={styles.dropdown}
  											onChange={changeAssignment}/>
  							</div>
  							<hr />
  							<div className={styles.gradedByBackground}>
  								 <span className={styles.sectionLabel}><L p={p} t={`Graded by:`}/></span><br/>
  								 {courseTypes && courseTypes.length > 0 && courseTypes.map((m, i) => {
  									 	let gradingType = assignment.gradingTypes && assignment.gradingTypes.length > 0 && assignment.gradingTypes.filter(g => g.courseTypeId === m.id)[0]
  										gradingType = gradingType && gradingType.gradingType ? gradingType.gradingType : m.defaultGradingType
  								 		return (
  											 	<div key={i} className={classes(styles.lineSpace, styles.row)}>
  														<div className={styles.labelCourseType}>{m.label}</div>
  														<RadioGroup
  							                  name={m.id}
  							                  data={[{ label: <L p={p} t={`Teacher`}/>, id: "TEACHER" }, { label: <L p={p} t={`Student`}/>, id: "STUDENT" }, ]}
  							                  horizontal={true}
  							                  className={styles.radio}
  							                  initialValue={gradingType || 'TEACHER'}
  							                  onClick={(value) => handleGradingType(value, m.id)}/>
  												</div>
  										)}
  								 )}
  							</div>
  							<div className={styles.includeCourseBackground}>
  									{coursesRelated && coursesRelated.length > 0 &&
  											<div>
  													<div className={styles.sectionLabel}><L p={p} t={`Classes included`}/></div>
  															{coursesRelated.map((m, i) =>
  																	 <Checkbox
  																	 		 key={i}
  																			 id={m.courseScheduledId}
  											                 label={m.label}
  											                 position={'before'}
  											                 checked={coursesSpecific && coursesSpecific.indexOf(m.courseScheduledId) > -1}
  											                 onClick={() => handleCoursesSpecific(m.courseScheduledId)}
  											                 labelClass={styles.labelCheckbox}
  											                 checkboxClass={styles.checkbox}/>
  															)}
  											</div>
  									}
  									<span className={styles.error}>{errorCoursesSpecific}</span>
  							</div>
  							<div className={styles.studentsBackground}>
  								 <span className={classes(styles.sectionLabel, styles.moreTop, styles.blue)}><L p={p} t={`Students included:`}/></span><br/>
  								 <div className={styles.multiSelect}>
  										 <MultiSelect
  												 name={'studentAssignmentAssign'}
  												 options={studentsLocal || []}
  												 onSelectedChanged={handleStudentAssign}
  												 valueRenderer={studentAssignRenderer}
  												 getJustCollapsed={() => {}}
  												 selected={assignment.studentsAssigned || []}/>
  								 </div>
  							</div>
  							<hr />
  							<div className={styles.row}>
  									<a onClick={toggleFileAttach} className={classes(styles.fileAttach, styles.row)}>
  											<Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
  											<span className={styles.labelUpload}><L p={p} t={`Upload a file?`}/></span>
  									</a>
  									<a onClick={toggleFileAttach} className={classes(styles.fileAttach, styles.row)}>
  											<Icon pathName={'link2'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
  											<span className={styles.labelUpload}><L p={p} t={`Add a website link?`}/></span>
  									</a>
  							</div>
  							{(openFileAttach) &&
  									<div className={styles.explanation}>
  											<L p={p} t={`After you submit this record, you will be returned to the list of assignments.  There are icons on the left in order to upload one or more files or to enter one or more links per assignment.`}/>
  									</div>
  							}
  							{assignment.assignmentFileUploads && assignment.assignmentFileUploads.length > 0 &&
  									<div>
  											<hr />
  											<div className={styles.label}>File attachments</div>
  											{assignment.assignmentFileUploads.map((f, i) =>
  													<div key={i} className={classes(styles.linkSpace, styles.row)}>
  															<a key={i} href={f.url} target={'_blank'} className={styles.link}>{f.name}</a>
  															<a onClick={() => handleRemoveFileOpen(f.assignmentFileId, 'DELETEFILE')} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
  													</div>
  											)}
  									</div>
  							}
  							{assignment.websiteLinks && assignment.websiteLinks.length > 0 &&
  									<div>
  											<hr />
  											<div className={styles.label}><L p={p} t={`Website links`}/></div>
  											{assignment.websiteLinks.map((w, i) =>
  													<div key={i} className={classes(styles.linkSpace, styles.row)}>
  															<a key={i} href={w.websiteLink.indexOf('http') === -1 ? 'http://' + w.websiteLink : w.websiteLink} target={'_blank'} className={styles.link}>{w.title ? w.title : w.websiteLink}</a>
  															<a onClick={() => handleRemoveWebsiteOpen(w.assignmentWebsiteLinkId)} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
  													</div>
  											)}
  									</div>
  							}
  							<hr />
                <div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                    <a className={styles.cancelLink} onClick={sendBack}><L p={p} t={`Close`}/></a>
  									{assignment.assignmentId &&
  											<ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={handleDeleteOpen} changeRed={true}/>
  									}
  									<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'}
  											onClick={!assignment.studentsAssigned || assignment.studentsAssigned.length === 0
  																	? handleNoStudentsOpen
  																	: processForm}/>
                </div>
  							<OneFJefFooter />
  							{isShowingModal_noStudents &&
  	                <MessageModal handleClose={handleNoStudentsClose} heading={<L p={p} t={`No students chosen`}/>}
  	                   explainJSX={<L p={p} t={`There are not any students chosen for this assignment. Do you want to continue anyway?`}/>} isConfirmType={true}
  	                   onClick={handleNoStudents} />
  	            }
  							{isShowingModal_delete &&
  	                <MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this assignment?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to remove this assignment? Access to any homeowrk and grades turned in for this homework will be lost.`}/>} isConfirmType={true}
  	                   onClick={handleDelete} />
  	            }
  							{isShowingModal_removeFile &&
  	                <MessageModal handleClose={handleRemoveFileClose} heading={<L p={p} t={`Remove this file attachment?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this file attachment?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveFile} />
  	            }
  							{isShowingModal_removeWebsite &&
  	                <MessageModal handleClose={handleRemoveWebsiteClose} heading={<L p={p} t={`Remove this website link?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this website link?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveWebsite} />
  	            }
  							{isShowingModal_numberOnly &&
  		                <MessageModal handleClose={handleNumberOnlyClose} heading={<L p={p} t={`Numbers Only`}/>}
  		                   explainJSX={<L p={p} t={`Please enter numbers only.`}/>} onClick={handleNumberOnlyClose} />
  		          }
  							{isShowingModal_missingInfo &&
  									<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  										 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  							}
            </div>
        )
}
export default AssignmentEntryView
