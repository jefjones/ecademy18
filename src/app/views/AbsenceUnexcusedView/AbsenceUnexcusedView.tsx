import { useState } from 'react'
import { Link } from 'react-router-dom'
import {apiHost} from '../../api_host'
import axios from 'axios'
import styles from './AbsenceUnexcusedView.css'
import globalStyles from '../../utils/globalStyles.css'
import Paper from '@mui/material/Paper'
import TableVirtualFast from '../../components/TableVirtualFast'
import Loading from '../../components/Loading'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Checkbox from '../../components/Checkbox'
import Icon  from '../../components/Icon'
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop'
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal'
import DateMoment from '../../components/DateMoment'
import DateTimePicker from '../../components/DateTimePicker'
import InputTextArea from '../../components/InputTextArea'
import MessageModal from '../../components/MessageModal'
import ImageDisplay from '../../components/ImageDisplay'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
const p = 'AbsenceUnexcusedView'
import L from '../../components/PageLanguage'

//If the parameter 'pendingApproval' is sent in, then this is the administrator approved a parent- or student-submitted excused absence.
//Otherwise the admin or the parent or the student can use this page to excuse an absence.  If it is the admin who is using the page, then
//  the absence will be excused automaticalled.  Otherwise, the excusedAbsence record is marked as UserSubmitted = true.
//The administrator can enter a note as well as one or more files.

function AbsenceUnexcusedView(props) {
  const [note, setNote] = useState('')
  const [selectedAbsences, setSelectedAbsences] = useState([])
  const [formData, setFormData] = useState(undefined)
  const [selectedStudents, setSelectedStudents] = useState(undefined)
  const [selectedCourses, setSelectedCourses] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [chosen_courseAttendanceId, setChosen_courseAttendanceId] = useState(undefined)
  const [studentPersonId, setStudentPersonId] = useState(undefined)
  const [courseScheduledId, setCourseScheduledId] = useState(undefined)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(undefined)
  const [loadingFiles, setLoadingFiles] = useState(undefined)
  const [handleFileUploadOpen, setHandleFileUploadOpen] = useState(undefined)
  const [isShowingModal_chooseAbsence, setIsShowingModal_chooseAbsence] = useState(undefined)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(undefined)
  const [fileUpload, setFileUpload] = useState(undefined)
  const [includeSiblings, setIncludeSiblings] = useState(undefined)
  const [isShowingModal_document, setIsShowingModal_document] = useState(undefined)
  const [excusedAbsenceId, setExcusedAbsenceId] = useState(undefined)
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(undefined)
  const [isShowingModal_doctor, setIsShowingModal_doctor] = useState(undefined)
  const [displayDoctor, setDisplayDoctor] = useState(undefined)
  const [searchDate, setSearchDate] = useState(undefined)

  const changeAbsence = (event) => {
    
    	    const field = event.target.name
    	    let newState = Object.assign({}, state)
    	    newState[field] = event.target.value
    	    setState(newState)
      
  }

  const processForm = () => {
    
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
          const {setAbsenceExcused, personId, absenceUnexcused} = props
          
    			let missingInfoMessage = []
    
          if (!selectedAbsences || selectedAbsences.length === 0) {
              missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Please choose at least one absence to excuse`}/></div>
          }
    			if (!note && absenceUnexcused.fileUploads.length === 0) {
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A note or a file upload is required`}/></div>
    			}
    
          if (missingInfoMessage && missingInfoMessage.length > 0) {
    					handleMissingInfoOpen(missingInfoMessage)
    			} else {
    					let absenceExcused = {
    							courseAttendanceIds: selectedAbsences,
    							note,
    							fileUploads: absenceUnexcused.fileUploads || [],
    					}
              setAbsenceExcused(personId, absenceExcused)
              setNote(''); setSelectedAbsences([]); setFormData(null); setSelectedStudents([]); setSelectedCourses([])
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The absence record has been updated`}/></div>)
          }
      
  }

  const approveForm = (declineOrApprove) => {
    
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
          const {approveAbsenceExcused, personId} = props
          
    			let missingInfoMessage = ``
    
          if (!selectedAbsences || selectedAbsences.length === 0) {
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Please choose at least one excused absence to approve`}/></div>
          }
    
    			if (declineOrApprove === 'decline' && !selectedAbsences.note) {
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A note is required when choosing 'Declined'.`}/></div>
    			}
    
          if (missingInfoMessage && missingInfoMessage.length > 0) {
    					handleMissingInfoOpen(missingInfoMessage)
    			} else {
    					approveAbsenceExcused(personId, selectedAbsences, declineOrApprove)
              setNote(''); setSelectedAbsences([])
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your '${declineOrApprove}' entry has been recorded`}/></div>)
          }
      
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    	handleMissingInfoClose = () => setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    	toggleCheckbox = (event, id) => {
    			//The id can be a courseAttendanceId (not pendingApproval) or excusedAbsenceId (pendingApproval)
    			let selectedAbsences = Object.assign([], selectedAbsences)
  }

  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    	toggleCheckbox = (event, id) => {
    			//The id can be a courseAttendanceId (not pendingApproval) or excusedAbsenceId (pendingApproval)
    			let selectedAbsences = Object.assign([], selectedAbsences)
  }

  const toggleCheckbox = (event, id) => {
    
    			//The id can be a courseAttendanceId (not pendingApproval) or excusedAbsenceId (pendingApproval)
    			let selectedAbsences = Object.assign([], selectedAbsences)
    			if (selectedAbsences && selectedAbsences.length > 0 && selectedAbsences.indexOf(id) > -1) {
    					selectedAbsences = selectedAbsences.filter(m => m !== id)
    			} else {
    					selectedAbsences = selectedAbsences && selectedAbsences.length > 0 ? selectedAbsences.concat(id) : [id]
    			}
    			setSelectedAbsences(selectedAbsences); setChosen_courseAttendanceId(id)
    	
  }

  const handleSelectedStudents = ({target}) => {
    return setStudentPersonId(target.value); setSelectedAbsences([])
    	handleSelectedCourses = ({target}) => setCourseScheduledId(target.value); setSelectedAbsences([])
    
    	handleSetAll = (selectedAbsences) => setSelectedAbsences(selectedAbsences)
    
    	handleFileUploadOpen = () => setIsShowingFileUpload(true); setLoadingFiles(true)
    	handleFileUploadClose = () => setIsShowingFileUpload(false); setHandleFileUploadOpen(false)
    	handleFileUploadSubmit = () => {
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
    			const {personId, reduxAbsenceExcusedFiles} = props
  }

  const handleSelectedCourses = ({target}) => {
    return setCourseScheduledId(target.value); setSelectedAbsences([])
    
    	handleSetAll = (selectedAbsences) => setSelectedAbsences(selectedAbsences)
    
    	handleFileUploadOpen = () => setIsShowingFileUpload(true); setLoadingFiles(true)
    	handleFileUploadClose = () => setIsShowingFileUpload(false); setHandleFileUploadOpen(false)
    	handleFileUploadSubmit = () => {
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
    			const {personId, reduxAbsenceExcusedFiles} = props
  }

  const handleSetAll = (selectedAbsences) => {
    return setSelectedAbsences(selectedAbsences)
    
    	handleFileUploadOpen = () => setIsShowingFileUpload(true); setLoadingFiles(true)
    	handleFileUploadClose = () => setIsShowingFileUpload(false); setHandleFileUploadOpen(false)
    	handleFileUploadSubmit = () => {
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
    			const {personId, reduxAbsenceExcusedFiles} = props
  }

  const handleFileUploadOpen = () => {
    return setIsShowingFileUpload(true); setLoadingFiles(true)
    	handleFileUploadClose = () => setIsShowingFileUpload(false); setHandleFileUploadOpen(false)
    	handleFileUploadSubmit = () => {
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
    			const {personId, reduxAbsenceExcusedFiles} = props
  }

  const handleFileUploadClose = () => {
    return setIsShowingFileUpload(false); setHandleFileUploadOpen(false)
    	handleFileUploadSubmit = () => {
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
    			const {personId, reduxAbsenceExcusedFiles} = props
  }

  const handleFileUploadSubmit = () => {
    
    			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
    			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
    			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
    			const {personId, reduxAbsenceExcusedFiles} = props
    			
    			let data = new FormData()
    			data.append('file', selectedFile)
    			let url = `${apiHost}ebi/absenceUnexcused/fileUpload/${personId}/${selectedAbsences.join('^')}/${encodeURIComponent(note)}`
    
    			axios.post(url, data,
    					{
    						headers: {
    							'Accept': 'application/json',
    							'Content-Type': 'application/json',
    							'Access-Control-Allow-Credentials' : 'true',
    							"Access-Control-Allow-Origin": "*",
    							"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
    							"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
    							"Authorization": "Bearer " + localStorage.getItem("authToken"),
    					}})
    					.then(response => {
    							reduxAbsenceExcusedFiles(response.data)
    							setLoadingFiles(false)
    							// !!!Return the state here to update with the fileUpload records
    							// And show the multiple files down below.
    					})
    					.catch(error => setLoadingFiles(false))
    
    			handleFileUploadClose()
    	
  }

  const handleInputFile = (selectedFile) => {
    return setSelectedFile(selectedFile)
    
    	handleChooseAnAbsenceOpen = () => setIsShowingModal_chooseAbsence(true)
    	handleChooseAnAbsenceClose = () => setIsShowingModal_chooseAbsence(false)
    
    	handleRemoveFileUploadOpen = (fileUpload) => setIsShowingModal_removeFileUpload(true); setFileUpload(fileUpload)
    	handleRemoveFileUploadClose = () => setIsShowingModal_removeFileUpload(false); setFileUpload([])
    	handleRemoveFileUpload = () => {
    			const {removeAbsenceExcusedFileUpload, personId} = props
  }

  const handleChooseAnAbsenceOpen = () => {
    return setIsShowingModal_chooseAbsence(true)
    	handleChooseAnAbsenceClose = () => setIsShowingModal_chooseAbsence(false)
    
    	handleRemoveFileUploadOpen = (fileUpload) => setIsShowingModal_removeFileUpload(true); setFileUpload(fileUpload)
    	handleRemoveFileUploadClose = () => setIsShowingModal_removeFileUpload(false); setFileUpload([])
    	handleRemoveFileUpload = () => {
    			const {removeAbsenceExcusedFileUpload, personId} = props
  }

  const handleChooseAnAbsenceClose = () => {
    return setIsShowingModal_chooseAbsence(false)
    
    	handleRemoveFileUploadOpen = (fileUpload) => setIsShowingModal_removeFileUpload(true); setFileUpload(fileUpload)
    	handleRemoveFileUploadClose = () => setIsShowingModal_removeFileUpload(false); setFileUpload([])
    	handleRemoveFileUpload = () => {
    			const {removeAbsenceExcusedFileUpload, personId} = props
  }

  const handleRemoveFileUploadOpen = (fileUpload) => {
    return setIsShowingModal_removeFileUpload(true); setFileUpload(fileUpload)
    	handleRemoveFileUploadClose = () => setIsShowingModal_removeFileUpload(false); setFileUpload([])
    	handleRemoveFileUpload = () => {
    			const {removeAbsenceExcusedFileUpload, personId} = props
  }

  const handleRemoveFileUploadClose = () => {
    return setIsShowingModal_removeFileUpload(false); setFileUpload([])
    	handleRemoveFileUpload = () => {
    			const {removeAbsenceExcusedFileUpload, personId} = props
  }

  const handleRemoveFileUpload = () => {
    
    			const {removeAbsenceExcusedFileUpload, personId} = props
    			
    			handleRemoveFileUploadClose()
    			removeAbsenceExcusedFileUpload(personId, fileUpload.fileUploadId)
    	
  }

  const toggleSiblings = () => {
    return setIncludeSiblings(!includeSiblings)
  }

  const handleDocumentOpen = (excusedAbsenceId, fileUpload) => {
    return setIsShowingModal_document(true); setExcusedAbsenceId(excusedAbsenceId); setFileUpload(fileUpload)
    	handleDocumentClose = () => setIsShowingModal_document(false); setFileUpload({}); setExcusedAbsenceId('')
    	handleAbsenceApproval = (declineOrApprove) => {
    			const {personId, approveAbsenceExcused} = props
  }

  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setFileUpload({}); setExcusedAbsenceId('')
    	handleAbsenceApproval = (declineOrApprove) => {
    			const {personId, approveAbsenceExcused} = props
  }

  const handleAbsenceApproval = (declineOrApprove) => {
    
    			const {personId, approveAbsenceExcused} = props
    			
    			handleDocumentClose()
    			approveAbsenceExcused(personId, excusedAbsenceId, declineOrApprove)
    	
  }

  const handleInstructionsOpen = (excusedAbsenceId, note) => {
    return setIsShowingModal_instructions(true); setExcusedAbsenceId(excusedAbsenceId); setNote(note)
    	handleInstructionsClose = () => setIsShowingModal_instructions(false); setNote(''); setExcusedAbsenceId('')
    	handleApprovalSubmit = (declineOrApprove) => {
    			const {personId, approveAbsenceExcused} = props
  }

  const handleInstructionsClose = () => {
    return setIsShowingModal_instructions(false); setNote(''); setExcusedAbsenceId('')
    	handleApprovalSubmit = (declineOrApprove) => {
    			const {personId, approveAbsenceExcused} = props
  }

  const handleApprovalSubmit = (declineOrApprove) => {
    
    			const {personId, approveAbsenceExcused} = props
    			
    			handleInstructionsClose()
    			approveAbsenceExcused(personId, excusedAbsenceId, declineOrApprove)
    	
  }

  const handleEnteredByOpen = (displayDoctor) => {
    return setIsShowingModal_doctor(true); setDisplayDoctor(displayDoctor)
    	handleEnteredByClose = () => setIsShowingModal_doctor(false); setDisplayDoctor('')
    
    	chooseRecord = chosen_courseAttendanceId => setChosen_courseAttendanceId(chosen_courseAttendanceId)
  }

  const handleEnteredByClose = () => {
    return setIsShowingModal_doctor(false); setDisplayDoctor('')
    
    	chooseRecord = chosen_courseAttendanceId => setChosen_courseAttendanceId(chosen_courseAttendanceId)
  }

  const clearFilters = () => {
    
    			setStudentPersonId(''); setIncludeSiblings(''); setCourseScheduledId(''); setSearchDate('')
    	
  }

  const changeDate = (field, event) => {
    
    			let newState = Object.assign({}, state)
    			newState[field] = event.target.value
    			setState(newState)
    	
  }

  const {personId, absenceUnexcused={}, fetchingRecord, companyConfig, accessRoles, pendingApproval} = props
      const {isShowingModal_missingInfo, selectedAbsences=[], note, studentPersonId, courseScheduledId, messageInfoIncomplete, isShowingModal_removeFileUpload,
  						isShowingFileUpload, selectedFile, isShowingModal_chooseAbsence, loadingFiles, includeSiblings, fileUpload, isShowingModal_instructions,
  						isShowingModal_document, isShowingModal_doctor, displayDoctor={}, chosen_courseAttendanceId, searchDate} = state
  
  		let localAbsence = (absenceUnexcused && absenceUnexcused.absenceDateLines) || []
  
  		localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.map(m => { m.isChosenRecord = m.courseAttendanceId === chosen_courseAttendanceId ? true : false; return m })
  
  		if (studentPersonId && studentPersonId !== '0') {
  				if (includeSiblings) {
  						let studentParent = absenceUnexcused.students && absenceUnexcused.students.length > 0 && absenceUnexcused.students.filter(m => m.id === studentPersonId)[0]
  						let parentPersonId = studentParent && studentParent.masterWorkId
  						let studentSiblings = absenceUnexcused.students && absenceUnexcused.students.length > 0 && absenceUnexcused.students.filter(m => m.masterWorkId === parentPersonId)
  						if (parentPersonId) {
  								localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.filter(m => {
  										let isSiblings = false
  										studentSiblings.forEach(s => {
  												if (s.id === m.studentPersonId) isSiblings = true
  										})
  										return isSiblings
  								})
  						}
  				} else {
  						localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.filter(m => m.studentPersonId === studentPersonId)
  				}
  		}
  		if (courseScheduledId && courseScheduledId !== '0') {
  				localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.filter(m => m.courseScheduledId === courseScheduledId)
  		}
  		if (searchDate) {
  				localAbsence = localAbsence.filter(m => m.attendanceDate.substring(0,10) === searchDate)
  		}
  
  		let uniqueCourseAttendanceIds = localAbsence && localAbsence.length > 0 ? [...new Set(localAbsence.map(m => pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId))] : []
  
  
  		localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.map((m, i) => {
  				m.checkbox = <div className={classes(styles.row, m.isChosenRecord ? styles.highlight : '')} onClick={() => chooseRecord(m.courseAttendanceId)}>
  												<div className={styles.checkbox}>
  												 		<Checkbox id={pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId} key={i} label={''}
  																checked={selectedAbsences.indexOf(pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId) > -1}
  																onClick={(event) => toggleCheckbox(event, pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId)}/>
  												</div>
  												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  														<a key={i} onClick={() => handleDocumentOpen(m.excusedAbsenceId, f)}>
  																<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
  														</a>)
  												}
  												{m.note &&
  														<div onClick={() => handleInstructionsOpen(m.excusedAbsenceId, m.note)}>
  																<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
  														</div>
  												}
  										 </div>
  				m.date = <div onClick={(event) => toggleCheckbox(event, m.courseAttendanceId)} className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')}>
  										<DateMoment date={m.attendanceDate} includeTime={false}/>
  								</div>
  				m.student = <div onClick={(event) => toggleCheckbox(event, m.courseAttendanceId)} className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')}>{m.studentName}</div>
  				m.course = <div onClick={(event) => toggleCheckbox(event, m.courseAttendanceId)} className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')}>{m.courseName}</div>
  				m.enteredBy = <div onClick={m.entryPersonRole === 'Doctor' ? () => handleEnteredByOpen(m) : () => chooseRecord(m.courseAttendanceId)}
  															className={classes((m.entryPersonRole === 'Doctor' ? globalStyles.link : styles.cellText), (m.isChosenRecord ? styles.highlight : ''))}>
  													{`${m.entryPersonName} (${m.entryPersonRole})`}
  											</div>
  				return m
      })
  
  		let columns = [
  			{
  				width: pendingApproval ? 150 : 50,
  				label: <div className={styles.smallWidth}>
  									<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={() => handleSetAll(uniqueCourseAttendanceIds)} addClassName={styles.smallButton}/>
  							 </div>,
  				dataKey: 'checkbox',
  			},
  			{
  				width: 90,
  				label: <L p={p} t={`Date`}/>,
  				dataKey: 'date',
  			},
  			{
  				width: 160,
  				label: <L p={p} t={`Student`}/>,
  				dataKey: 'student',
  			},
  			{
  				width: 200,
  				label: <L p={p} t={`Course`}/>,
  				dataKey: 'course',
  			},
  		]
  
      if (pendingApproval) columns.push({ width: 200, label: 'Entered by', dataKey: 'enteredBy'})
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {pendingApproval ? `Excused Absences Pending Approval` : `Unexcused Absences`}
              </div>
  						<div className={styles.rowWrap}>
  								<div className={styles.subHeader}>Search:</div>
  		            <div className={classes(styles.littleLeft)}>
  										<SelectSingleDropDown
  												label={<L p={p} t={`Student(s)`}/>}
  												id={'students'}
                          name={'students'}
                          options={absenceUnexcused.students || []}
                          value={studentPersonId}
                          height={`medium`}
  												className={styles.moreSpace}
  												onChange={handleSelectedStudents}/>
  		            </div>
  								<div className={styles.checkboxSiblings}>
  										<Checkbox
  												id={'includeSiblings'}
  												label={<L p={p} t={`Include siblings`}/>}
  												labelClass={styles.checkboxLabel}
  												checked={includeSiblings || false}
  												onClick={toggleSiblings}
  												className={styles.button}/>
  								</div>
  								<div className={classes(styles.littleLeft)}>
  										<SelectSingleDropDown
  												label={<L p={p} t={`Course(s)`}/>}
  												id={'courses'}
  												name={'courses'}
  												options={absenceUnexcused.courses || []}
  												value={courseScheduledId}
  												multiple={true}
  												height={`medium`}
  												className={styles.moreSpace}
  												onChange={handleSelectedCourses}/>
  									</div>
  									<div className={classes(styles.littleTop, styles.moreRight, styles.row)}>
  											<div className={classes(styles.dateRow, styles.moreRight)}>
  													<DateTimePicker id={`searchDate`} label={<L p={p} t={`Date`}/>} value={searchDate} onChange={(event) => changeDate('searchDate', event)}/>
  											</div>
  									</div>
  									<a onClick={clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
  											Clear filters
  									</a>
  						</div>
  						<hr/>
  						<Loading isLoading={fetchingRecord.baseCourses} />
  						<Paper style={{ height: 250, width: '700px', marginTop: '8px' }}>
  								<TableVirtualFast rowCount={(localAbsence && localAbsence.length) || 0}
  										rowGetter={({ index }) => (localAbsence && localAbsence.length > 0 && localAbsence[index]) || ''}
  										columns={columns} />
  						</Paper>
  						<div className={styles.rowWrap}>
  								<div className={styles.moreRight}>
  										<div className={styles.subHeader}>File upload (doctor's notes)</div>
  										<div className={classes(styles.moreLeft, styles.row)}
  														onClick={selectedAbsences && selectedAbsences.length > 0
  																? handleFileUploadOpen
  																: handleChooseAnAbsenceOpen
  														}>
  												<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
  												<div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload file or picture`}/></div>
  										</div>
  										<br/>
  										<Loading isLoading={loadingFiles} />
  										{absenceUnexcused.fileUploads && absenceUnexcused.fileUploads.length > 0 && absenceUnexcused.fileUploads.map((f, i) =>
  												<ImageDisplay  keyIndex={i} linkText={''} url={f.url} isOwner={true} fileUploadId={f.fileUploadId}
  														deleteFunction={() => handleRemoveFileUploadOpen(f)} deleteId={personId}/>
  										)}
  								</div>
  								<div>
  										<InputTextArea
  												label={pendingApproval ? <L p={p} t={`Note (required for decline)`}/>: <L p={p} t={`Note`}/>}
  												name={'note'}
  												value={note || ''}
  												autoComplete={'dontdoit'}
  												onChange={changeAbsence}/>
  										<div className={styles.rowRight}>
  												<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
  												{!pendingApproval && <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>}
  												{pendingApproval && <ButtonWithIcon label={<L p={p} t={`Decline`}/>} icon={'cross_circle'} onClick={() => approveForm('decline')} changeRed={true}/>}
  												{pendingApproval && <ButtonWithIcon label={<L p={p} t={`Approve`}/>} icon={'checkmark_circle'} onClick={() => approveForm('approve')}/>}
  				            </div>
  								</div>
  						</div>
              <OneFJefFooter />
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
  						{isShowingFileUpload &&
  								<FileUploadModalWithCrop handleClose={handleFileUploadClose} title={<L p={p} t={`Choose File or Image`}/>}
  										personId={personId} submitFileUpload={handleFileUploadSubmit}
  										file={selectedFile} handleInputFile={handleInputFile}
  										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf, .dat, .txt, .ppt, .wpd, .odt, .rtf, .m4a"}
  										handleCancelFile={()=>{}}/>
              }
  						{isShowingModal_chooseAbsence &&
                  <MessageModal handleClose={handleChooseAnAbsenceClose} heading={<L p={p} t={`Choose an absence`}/>}
                     explainJSX={<L p={p} t={`Please choose at least one absence before uploading a file.`}/>}
                     onClick={handleChooseAnAbsenceClose} />
              }
  						{isShowingModal_removeFileUpload &&
                  <MessageModal handleClose={handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file or image?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this file or image?`}/>} isConfirmType={true}
                     onClick={handleRemoveFileUpload} />
              }
  						{isShowingModal_document &&
  								<div className={styles.fullWidth}>
  										{<DocumentViewOnlyModal handleClose={handleDocumentClose} showTitle={true} handleSubmit={handleDocumentClose}
  												companyConfig={companyConfig} accessRoles={accessRoles} fileUpload={fileUpload} isSubmitType={!!pendingApproval}
  												onSubmit={handleAbsenceApproval} />}
  								</div>
  						}
  						{isShowingModal_instructions &&
  								<MessageModal handleClose={handleInstructionsClose} heading={<L p={p} t={`Excused Absence Note`}/>}
  									 onClick={pendingApproval ? handleApprovalSubmit : handleInstructionsClose} isConfirmType={pendingApproval}
  									 explain={note}  />
  						}
  						{isShowingModal_doctor &&
  								<MessageModal handleClose={handleEnteredByClose} heading={<L p={p} t={`Doctor's Office`}/>} onClick={handleEnteredByClose}
  										explainJSX={<div>
  																<div className={styles.text}>{displayDoctor.doctorOfficeName}</div>
  																<div className={styles.text}>{displayDoctor.doctorPersonnel}</div>
  																<div className={styles.text}>{displayDoctor.EntryPersonName}</div>
  																<div className={styles.text}>{displayDoctor.doctorAddress}</div>
  																<div className={styles.text}>{displayDoctor.doctorCity}</div>
  																<div className={styles.text}>{displayDoctor.doctorState}</div>
  																<div className={styles.text}>{displayDoctor.doctorPhone}</div>
  																<div className={styles.text}>{displayDoctor.doctorEmailAddress}</div>
  														</div>
  										} />
  						}
        </div>
      )
}

export default withAlert(AbsenceUnexcusedView)
