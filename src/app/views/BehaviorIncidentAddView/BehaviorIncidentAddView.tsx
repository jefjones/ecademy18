import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ImageDisplay from '../../components/ImageDisplay'
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop'
import axios from 'axios'
import * as globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import * as styles from './BehaviorIncidentAddView.css'
import DateTimePicker from '../../components/DateTimePicker'
import TimePicker from '../../components/TimePicker'
import CheckboxGroup from '../../components/CheckboxGroup'
import RadioGroup from '../../components/RadioGroup'
import InputTextArea from '../../components/InputTextArea'
import InputText from '../../components/InputText'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import Icon from '../../components/Icon'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'
import moment from 'moment'

function BehaviorIncidentAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [incidentDate, setIncidentDate] = useState(moment(nowDate).format("YYYY-MM-DD"))
  const [incidentTime, setIncidentTime] = useState(moment(nowDate).format("HH:mm"))
  const [isInit, setIsInit] = useState(undefined)
  const [teacherResponses, setTeacherResponses] = useState(undefined)
  const [adminResponses, setAdminResponses] = useState(undefined)
  const [note, setNote] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(undefined)
  const [accusedStudents, setAccusedStudents] = useState(undefined)
  const [otherStudents, setOtherStudents] = useState(undefined)
  const [staffInvolved, setStaffInvolved] = useState(undefined)
  const [otherTeacherResponse, setOtherTeacherResponse] = useState(undefined)
  const [otherAdminResponse, setOtherAdminResponse] = useState(undefined)
  const [shouldAdminFollowUpStudent, setShouldAdminFollowUpStudent] = useState(undefined)
  const [haveParentsBeenContacted, setHaveParentsBeenContacted] = useState(undefined)
  const [parentContactDate, setParentContactDate] = useState(undefined)
  const [parentContactTime, setParentContactTime] = useState(undefined)
  const [planToContactParents, setPlanToContactParents] = useState(undefined)
  const [behaviorIncidentTypeChoices, setBehaviorIncidentTypeChoices] = useState(undefined)
  const [behaviorIncidentTypeChoices1, setBehaviorIncidentTypeChoices1] = useState(undefined)
  const [behaviorIncidentTypeChoices2, setBehaviorIncidentTypeChoices2] = useState(undefined)
  const [behaviorIncidentTypeChoices3, setBehaviorIncidentTypeChoices3] = useState(undefined)
  const [behaviorIncidentId, setBehaviorIncidentId] = useState(undefined)
  const [errorBehaviorIncidentTypeChoices, setErrorBehaviorIncidentTypeChoices] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [errorAccusedStudents, setErrorAccusedStudents] = useState(undefined)
  const [errorAdminResponses, setErrorAdminResponses] = useState(undefined)
  const [errorIncidentDate, setErrorIncidentDate] = useState(undefined)
  const [errorIncidentTime, setErrorIncidentTime] = useState(undefined)
  const [errorNotes, setErrorNotes] = useState(undefined)
  const [errorTeacherResponses, setErrorTeacherResponses] = useState(undefined)
  const [errorHaveParentsBeenContacted, setErrorHaveParentsBeenContacted] = useState(undefined)
  const [errorParentContactDateTime, setErrorParentContactDateTime] = useState(undefined)
  const [errorShouldAdminFollowUpStudent, setErrorShouldAdminFollowUpStudent] = useState(undefined)
  const [errorPlanToContactParents, setErrorPlanToContactParents] = useState(undefined)
  const [behaviorIncident, setBehaviorIncident] = useState(undefined)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(undefined)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(undefined)
  const [loadingFiles, setLoadingFiles] = useState(undefined)
  const [isShowingModal, setIsShowingModal] = useState(undefined)
  const [studentPersonId, setStudentPersonId] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [expanded, setExpanded] = useState(undefined)
  const [hasChangedExpanded, setHasChangedExpanded] = useState(undefined)
  const [level, setLevel] = useState(undefined)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          const {behaviorIncident, behaviorIncidentId} = props
          
    
          if (!isInit && behaviorIncident && behaviorIncident.behaviorIncidentId && behaviorIncident.behaviorIncidentId !== guidEmpty) {
              // let choices = behaviorIncident.behaviorIncidentTypeChoices;
              // behaviorIncident.behaviorIncidentTypeChoices = choices && choices.length > 0 && choices.reduce((acc, m) => acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
    
              setIsInit(true); setBehaviorIncidentId(behaviorIncidentId); set//behaviorIncidentId(behaviorIncident.behaviorIncidentId); setTeacherResponses(behaviorIncident.teacherResponses); setAdminResponses(behaviorIncident.adminResponses); setIncidentDate(behaviorIncident.incidentDate); setIncidentTime(behaviorIncident.incidentTime); setNote(behaviorIncident.note); setFileUrl(behaviorIncident.fileUrl); setAccusedStudents(behaviorIncident.accusedStudents); setOtherStudents(behaviorIncident.otherStudents); setStaffInvolved(behaviorIncident.staffInvolved); setOtherTeacherResponse(behaviorIncident.otherTeacherResponse); setOtherAdminResponse(behaviorIncident.otherAdminResponse); setShouldAdminFollowUpStudent(behaviorIncident.shouldAdminFollowUpStudent); setHaveParentsBeenContacted(behaviorIncident.haveParentsBeenContacted); setParentContactDate(behaviorIncident.parentContactDateTime); setParentContactTime(behaviorIncident.parentContactTime); setPlanToContactParents(behaviorIncident.planToContactParents); setBehaviorIncidentTypeChoices(behaviorIncident.behaviorIncidentTypeChoices); setBehaviorIncidentTypeChoices1(behaviorIncident.behaviorIncidentTypeChoices1); setBehaviorIncidentTypeChoices2(behaviorIncident.behaviorIncidentTypeChoices2); setBehaviorIncidentTypeChoices3(behaviorIncident.behaviorIncidentTypeChoices3);
          }
      
  }, [])

  const processForm = () => {
    
          const {personId, addOrUpdateBehaviorIncident} = props
          
    
          let hasError = false
    			let missingInfoMessage = []
    
    			if (!(behaviorIncidentTypeChoices && behaviorIncidentTypeChoices.length > 0)) {
    				hasError = true
    				setErrorBehaviorIncidentTypeChoices(<L p={p} t={`Please choose at least one incident type`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one incident type`}/></div>
    			}
    
    			if (!(accusedStudents && accusedStudents.length > 0)) {
    				hasError = true
    				setErrorAccusedStudents(<L p={p} t={`Please choose at least one accused student`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one accused student`}/></div>
    			}
    
    			if (!(teacherResponses && teacherResponses.length > 0)) {
    				hasError = true
    				setErrorAdminResponses(<L p={p} t={`Please select whether administation follow up is required`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If administration follow-up is required`}/></div>
    			}
    
    			if (!incidentDate) {
    				hasError = true
    				setErrorIncidentDate(<L p={p} t={`Please enter a date`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Incident date`}/></div>
    			}
    
    			if (!incidentTime) {
    				hasError = true
    				setErrorIncidentTime(<L p={p} t={`Please enter a time`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Incident time`}/></div>
    			}
    
    			if (!note && note < 10) {
    				hasError = true
    				setErrorNotes(<L p={p} t={`Please enter a note that is more than a word or two.`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Notes`}/></div>
    			}
    
          if (!teacherResponses) {
            hasError = true
            setErrorTeacherResponses(<L p={p} t={`Please choose at least one teacher response`}/>)
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one teacher response`}/></div>
          }
    
          if (!haveParentsBeenContacted) {
            hasError = true
            setErrorHaveParentsBeenContacted(<L p={p} t={`Please select whether parents have been contacted`}/>)
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If parents have been contacted`}/></div>
          }
    
          if (haveParentsBeenContacted === "true" && (!parentContactDate || !parentContactTime)) {
            hasError = true
            setErrorParentContactDateTime(<L p={p} t={`Please select when the parents were contacted`}/>)
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`When parents were contacted`}/></div>
          }
    
          if (!shouldAdminFollowUpStudent) {
            hasError = true
            setErrorShouldAdminFollowUpStudent(<L p={p} t={`Please select whether an administator should follow up with the student(s)`}/>)
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If an administator should follow up`}/></div>
          }
    
          if (!planToContactParents && haveParentsBeenContacted === 'false') {
            hasError = true
            setErrorPlanToContactParents(<L p={p} t={`Please select if you plan to contact a parent`}/>)
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If you plan to contact a parent`}/></div>
          }
          if (!hasError) {
              let behaviorIncident = {
                  behaviorIncidentId,
                  incidentDate,
                  incidentTime,
                  note,
                  accusedStudents,
                  otherStudents,
                  staffInvolved,
                  otherTeacherResponse,
                  otherAdminResponse,
                  shouldAdminFollowUpStudent: shouldAdminFollowUpStudent === 'false' ? false : shouldAdminFollowUpStudent,
                  haveParentsBeenContacted: haveParentsBeenContacted === 'false' ? false : haveParentsBeenContacted,
                  parentContactDate,
                  parentContactTime,
                  planToContactParents: planToContactParents === 'false' ? false : planToContactParents,
                  behaviorIncidentTypeChoices,
                  teacherResponses,
                  adminResponses,
              }
              addOrUpdateBehaviorIncident(personId, behaviorIncident)
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The Behavior Incident has been saved.`}/></div>)
    					//Consider sending to the admin or the person list of those who should receive an incident report if this is not the final responsible person (principal)
    
    					setBehaviorIncident({})
    					navigate('/behaviorIncidentList')
    			} else {
    					handleMissingInfoOpen(missingInfoMessage)
          }
      
  }

  const handleChange = ({target}) => {
    
    			let newState = Object.assign({}, state)
    			newState[target.name] = target.value
    			setState(newState)
    	
  }

  const changeDate = (field, event) => {
    
    			const newState = Object.assign({}, state)
    			newState[field] = event.target.value
    			setState(newState)
    	
  }

  const handleDeleteOpen = () => {
    return setIsShowingModal_delete(true)
  }

  const handleDeleteClose = () => {
    return setIsShowingModal_delete(false)
  }

  const handleDelete = () => {
    
    			const {removeVolunteerHours, personId} = props
          
    			removeVolunteerHours(personId, behaviorIncidentId)
    			handleDeleteClose()
    			navigate('/firstNav')
    	
  }

  const handleFileUploadOpen = () => {
    return setIsShowingFileUpload(true); setLoadingFiles(true)

  }
  const handleFileUploadClose = () => {
    return setIsShowingFileUpload(false); setLoadingFiles(false)

  }
  const handleFileUploadSubmit = () => {
    
          //When the file upload is used, it will create the new DoctorNote record plus let the files be accrued if the user wants to enter
          //	more than one file.  But as soon as the page's submit button is used (processForm), then the user is submitting the entire record which may have a note.
          const {personId} = props
          
          let data = new FormData()
          data.append('file', selectedFile)
          axios.post(`${apiHost}ebi/behaviorIncident/addFile/${personId}/${(behaviorIncidentId && behaviorIncidentId !== '0') || guidEmpty}`, data,
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
                  setBehaviorIncidentId(response.data)
              })
              .catch(error => setLoadingFiles(false))
    
          handleFileUploadClose()
      
  }

  const handleInputFile = (selectedFile) => {
    
          setSelectedFile(selectedFile)
          let img = imageViewer
          const reader = new FileReader()
          reader.onloadend = function() {
              img.src = reader.result
          }
          reader.readAsDataURL(selectedFile)
          questionFile.after(img)
      
  }

  const handleImageViewerOpen = (fileUrl) => {
    return setIsShowingModal(true); setFileUrl(fileUrl)
  }

  const handleImageViewerClose = () => {
    return setIsShowingModal(false); setFileUrl('')
  }

  const handleStudentChange = ({target}) => {
    return setStudentPersonId(target.value)
  }

  const handleRemoveAccusedStudent = (id) => {
    return setAccusedStudents(accusedStudents.filter(m => m.id !== id))
    
    	handleAccusedStudents = accusedStudents => setAccusedStudents(accusedStudents)
  }

  const handleRemoveOtherStudent = (id) => {
    return setOtherStudents(otherStudents.filter(m => m.id !== id))
    
    	handleAccusedStudents = accusedStudents => setAccusedStudents(accusedStudents)
  }

  const handleRemoveStaff = (id) => {
    return setStaffInvolved(staffInvolved.filter(m => m.id !== id))
    
    	handleAccusedStudents = accusedStudents => setAccusedStudents(accusedStudents)
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    
    	handleExpansionChange = panel => (event, expanded) => setExpanded(expanded ? panel : false); setHasChangedExpanded(true)
    

  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    	handleExpansionChange = panel => (event, expanded) => setExpanded(expanded ? panel : false); setHasChangedExpanded(true)
    

  const handleSelectedTypes1 = (behaviorIncidentTypeChoices) => {
    
    			
    			((behaviorIncidentTypeChoices2 && behaviorIncidentTypeChoices2.length > 0) || (behaviorIncidentTypeChoices3 && behaviorIncidentTypeChoices3.length > 0)) &&
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The level changed. The incident type choices have been reset.`}/></div>)
    			setBehaviorIncidentTypeChoices(behaviorIncidentTypeChoices); setLevel(1); setBehaviorIncidentTypeChoices1(behaviorIncidentTypeChoices); setBehaviorIncidentTypeChoices2([]); setBehaviorIncidentTypeChoices3([])
    	
  }

  const handleSelectedTypes2 = (behaviorIncidentTypeChoices) => {
    
    			
    			((behaviorIncidentTypeChoices1 && behaviorIncidentTypeChoices1.length > 0) || (behaviorIncidentTypeChoices3 && behaviorIncidentTypeChoices3.length > 0)) &&
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The level changed. The incident type choices have been reset.`}/></div>)
    			setBehaviorIncidentTypeChoices(behaviorIncidentTypeChoices); setLevel(2); setBehaviorIncidentTypeChoices1([]); setBehaviorIncidentTypeChoices2(behaviorIncidentTypeChoices); setBehaviorIncidentTypeChoices3([])
    	
  }

  const handleSelectedTypes3 = (behaviorIncidentTypeChoices) => {
    
    			
    			((behaviorIncidentTypeChoices1 && behaviorIncidentTypeChoices1.length > 0) || (behaviorIncidentTypeChoices2 && behaviorIncidentTypeChoices2.length > 0)) &&
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The level changed. The incident type choices have been reset.`}/></div>)
    			setBehaviorIncidentTypeChoices(behaviorIncidentTypeChoices); setLevel(3); setBehaviorIncidentTypeChoices1([]); setBehaviorIncidentTypeChoices2([]); setBehaviorIncidentTypeChoices3(behaviorIncidentTypeChoices)
    	
  }

  const handleSelectedTeacherResponses = (teacherResponses) => {
    return setTeacherResponses(teacherResponses)
  }

  const handleSelectedAdminResponses = (adminResponses) => {
    return setAdminResponses(adminResponses)
  }

  const handleTrueFalse = (field, value) => {
    
          let newState = Object.assign({}, state)
          newState[field] = value
          setState(newState)
      
  }

  const showLevelChoices = (typeChoiceList) => {
    
          const {behaviorIncidentTypes} = props
          if (!(typeChoiceList && typeChoiceList.length > 0)) return
          return typeChoiceList.reduce((acc, choice) => {
              let type = behaviorIncidentTypes.filter(b => b.id === choice)[0]
              return type && type.label
                        ? acc
                            ? acc += ', ' + type.label
                            : type.label
                        : acc
          }, '')
      
  }

  const setIncidentTypeChoice = (behaviorIncidentTypeId) => {
    
          const {behaviorIncident} = props
          return behaviorIncident.behaviorIncidentTypeChoices && behaviorIncident.behaviorIncidentTypeChoices.length > 0 && behaviorIncident.behaviorIncidentTypeChoices.reduce((acc, m) => {
              if (behaviorIncidentTypeId === m.id) {
                  acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id]
              }
              return acc
          }, [])
      
  }

  const handleRemoveFileUploadOpen = () => {
    return setIsShowingModal_removeFileUpload(true)

  }
  }
  }
  const handleRemoveFileUploadClose = () => {
    return setIsShowingModal_removeFileUpload(false)

  }
  const handleRemoveFileUpload = () => {
    
    			const {removeBehaviorIncidentFile, personId} = props
    			
    			handleRemoveFileUploadClose()
    			removeBehaviorIncidentFile(personId, behaviorIncidentId)
          const img = imageViewer
    	    img.src = ''
    			questionFile.after(img)
    	
  }

  const {behaviorIncidentTypes=[], behaviorIncidentResponseTypes=[], students, facilitators, accessRoles, personId, myFrequentPlaces,
  						setMyFrequentPlace} = props
      
  
      // let behaviorIncidentTypeChoices = behaviorIncident.behaviorIncidentTypeChoices && behaviorIncident.behaviorIncidentTypeChoices.length > 0
      //     && behaviorIncident.behaviorIncidentTypeChoices.reduce((acc, m) =>
      //        acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
  
  		let hasOtherTeacherResponse = false
  		teacherResponses && teacherResponses.length > 0 && teacherResponses.forEach(teacherResponse => {
          let type = behaviorIncidentResponseTypes.filter(b => b.id === teacherResponse)[0]
  				if (type && type.label === 'Other') hasOtherTeacherResponse = true
  		})
  
      let hasOtherAdminResponse = false
  		adminResponses && adminResponses.length > 0 && adminResponses.forEach(adminResponse => {
          let type = behaviorIncidentResponseTypes.filter(b => b.id === adminResponse)[0]
  				if (type && type.label === 'Other') hasOtherAdminResponse = true
  		})
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								{behaviorIncidentId ? <L p={p} t={`Update Behavior Incident`}/> : <L p={p} t={`Add Behavior Incident`}/>}
  						</div>
  						<div>
  								<Accordion expanded={expanded === 'panel1'} onChange={handleExpansionChange('panel1')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
  												<div className={styles.rowWrap}>
                              <div className={styles.row}>
                              		<span className={classes(styles.noWrap, styles.menuHeader)}><L p={p} t={`Level 1`}/></span>
                                  <span className={classes(styles.levelDescription, styles.label)}><L p={p} t={`Level 1 infractions are minor acts of misconduct that interfere with orderly operation of the classroom and school.`}/></span>
                              </div>
                              <div className={classes(styles.moreLeft, styles.littleTop, styles.textBiggerBold)}>
                                  {showLevelChoices(behaviorIncidentTypeChoices1)}
                              </div>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={classes(styles.labelTypes, styles.moreBottom)}>
  														<CheckboxGroup
  																name={'behaviorIncidentTypeChoices1'}
  																options={behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 1)}
  																horizontal={true}
  																className={styles.labelTypes}
  																labelClass={styles.labelTypes}
  																onSelectedChanged={handleSelectedTypes1}
  																selected={behaviorIncidentTypeChoices1 || []}/>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<Accordion expanded={expanded === 'panel2'} onChange={handleExpansionChange('panel2')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
                          <div className={styles.rowWrap}>
                              <div className={styles.row}>
                                  <span className={classes(styles.noWrap, styles.menuHeader)}><L p={p} t={`Level 2`}/></span>
                                  <span className={classes(styles.levelDescription, styles.label)}><L p={p} t={`Level 2 infractions are more serious and disruptive than level 1. They are minor acts directed against others.`}/></span>
                              </div>
                              <div className={classes(styles.moreLeft, styles.text)}>
                              {showLevelChoices(behaviorIncidentTypeChoices2)}
                              </div>
                          </div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={classes(styles.labelTypes, styles.moreBottom)}>
  														<CheckboxGroup
  																name={'behaviorIncidentTypeChoices2'}
  																options={behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 2)}
  																horizontal={true}
  																className={styles.labelTypes}
  																labelClass={styles.labelTypes}
  																onSelectedChanged={handleSelectedTypes2}
  																selected={behaviorIncidentTypeChoices2 || []}/>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<Accordion expanded={expanded === 'panel3'} onChange={handleExpansionChange('panel3')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
                          <div className={styles.rowWrap}>
                              <div className={styles.row}>
      														<span className={classes(styles.noWrap, styles.menuHeader)}><L p={p} t={`Level 3`}/></span>
                                  <span className={classes(styles.levelDescription, styles.label)}><L p={p} t={`Level 3 incidents are for repeat offenders and major acts of misconduct, including threats to health, safety, and property.`}/></span>
      												</div>
                              <div className={classes(styles.moreLeft, styles.text)}>
                              {showLevelChoices(behaviorIncidentTypeChoices3)}
                              </div>
                          </div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={classes(styles.labelTypes, styles.moreBottom)}>
  														<CheckboxGroup
  																name={'behaviorIncidentTypeChoices3'}
  																options={behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 3)}
  																horizontal={true}
  																className={styles.labelTypes}
  																labelClass={styles.labelTypes}
  																onSelectedChanged={handleSelectedTypes3}
  																selected={behaviorIncidentTypeChoices3 || []}/>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<div className={classes(styles.moreTop, globalStyles.errorText)}>{errorBehaviorIncidentTypeChoices}</div>
  								<div className={styles.rowWrap}>
  										<div>
  												<InputDataList
  														label={<L p={p} t={`Student(s) accused`}/>}
  														name={'accusedStudents'}
  														options={students}
  														value={accusedStudents}
                              listAbove={true}
  														multiple={true}
  														height={`medium`}
  														className={styles.moreSpace}
  														onChange={handleAccusedStudents}
  														required={true}
  														whenFilled={accusedStudents && accusedStudents.length > 0}
  														error={errorAccusedStudents}/>
  										</div>
  										<div className={styles.dataTime}>
  												<DateTimePicker id={`incidentDate`} label={<L p={p} t={`Date`}/>} value={incidentDate || ''} onChange={(event) => changeDate('incidentDate', event)}
  													className={styles.dateTime} error={errorIncidentDate}
  													required={true} whenFilled={incidentDate}/>
  										</div>
  										<div className={styles.dataTime}>
  												<TimePicker id={`incidentTime`} label={<L p={p} t={`Time`}/>} value={incidentTime || ''} onChange={handleChange} className={styles.dateTime}
  														error={errorIncidentTime} required={true} whenFilled={incidentTime}/>
  										</div>
  										<div className={styles.moreTop}>
  												<InputDataList
  														label={<L p={p} t={`Other students (innocent)`}/>}
  														name={'otherStudents'}
  														options={students}
  														value={otherStudents}
                              listAbove={true}
  														multiple={true}
  														height={`medium`}
  														className={styles.moreSpace}
  														onChange={handleOtherStudents}/>
  										</div>
  										<div className={styles.moreTop}>
  												<InputDataList
  														label={<L p={p} t={`Staff involved`}/>}
  														name={'staffInvolved'}
  														options={facilitators}
  														value={staffInvolved}
                              listAbove={true}
  														multiple={true}
  														height={`medium`}
  														className={styles.moreSpace}
  														onChange={handleStaffInvolved}/>
  										</div>
  								</div>
                  <img src={''} alt={'New'} ref={(ref) => (imageViewer = ref)} />
                  <div className={styles.moreTop} ref={(ref) => (questionFile = ref)}>
                      <div className={classes(styles.moreLeft, styles.row)} onClick={handleFileUploadOpen}>
                          <Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
                          <div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload a file or picture`}/></div>
                      </div>
                      <div className={styles.minimalSize}>
                          <ImageDisplay linkText={''} url={fileUrl} isOwner={true} deleteFunction={() => handleRemoveFileUploadOpen(behaviorIncidentId)} deleteId={behaviorIncidentId}/>
                      </div>
                  </div>
  								<div className={styles.moreTopMargin}>
  										<InputTextArea label={<L p={p} t={`Notes`}/>}
                          name={'note'}
                          value={note}
                          onChange={handleChange}
                          required={true}
                          whenFilled={note && note.length > 9}
                          error={errorNotes}
                          instructions={<L p={p} t={`The note must be more than a word or two.`}/>}
                      />
  								</div>
  								<hr/>
  										<div className={styles.textBig}><L p={p} t={`Response and follow-up actions`}/></div>
  								<hr/>
  								<div className={classes(styles.labelTypes, styles.moreBottom, styles.teacherResponse)}>
  										<CheckboxGroup
  												name={'teacherResponses'}
  												label={<L p={p} t={`Teacher response`}/>}
  												options={behaviorIncidentResponseTypes && behaviorIncidentResponseTypes.length > 0 && behaviorIncidentResponseTypes.filter(m => m.adminOrTeacher === 'Teacher')}
  												horizontal={true}
  												className={styles.labelTypes}
  												labelClass={styles.labelTypes}
  												onSelectedChanged={handleSelectedTeacherResponses}
  												selected={teacherResponses || []}
                          required={true}
                          whenFilled={teacherResponses && teacherResponses.length > 0}
                          error={errorTeacherResponses}
                          />
  										{hasOtherTeacherResponse &&
  												<InputText
  														id={`otherTeacherResponse`}
  														name={`otherTeacherResponse`}
  														size={"medium"}
  														label={<L p={p} t={`Other teacher response`}/>}
  														value={otherTeacherResponse || ''}
  														onChange={handleChange}/>
  										}
                      </div>
                      <div className={classes(styles.labelTypes, styles.moreBottom)}>
      										<RadioGroup
      												label={<L p={p} t={`Do you want administration to follow up?`}/>}
      												name={`shouldAdminFollowUpStudent`}
      												data={[{ label: 'Yes', id: 'true' }, { label: 'No', id: 'false' }]}
      												horizontal={true}
      												className={styles.radio}
                              initialValue={shouldAdminFollowUpStudent || ''}
      												onClick={(value) => handleTrueFalse('shouldAdminFollowUpStudent', value)}
                              required={true}
                              whenFilled={shouldAdminFollowUpStudent}
                              error={errorShouldAdminFollowUpStudent}/>
      								</div>
  								{accessRoles.admin &&
  										<div className={classes(styles.labelTypes, styles.moreBottom, styles.adminResponse)}>
  												<CheckboxGroup
  														name={'adminResponses'}
  														label={<L p={p} t={`Admin response`}/>}
  														options={behaviorIncidentResponseTypes && behaviorIncidentResponseTypes.length > 0 && behaviorIncidentResponseTypes.filter(m => m.adminOrTeacher === 'Admin')}
  														horizontal={true}
  														className={styles.labelTypes}
  														labelClass={styles.labelTypes}
  														onSelectedChanged={handleSelectedAdminResponses}
  														selected={adminResponses || []}/>
  												{hasOtherAdminResponse &&
  														<InputText
  																id={`otherAdminResponse`}
  																name={`otherAdminResponse`}
  																size={"medium"}
  																label={<L p={p} t={`Other admin response`}/>}
  																value={otherAdminResponse || ''}
  																onChange={handleChange}/>
  												}
  										</div>
  								}
  								<hr/>
  								<div className={classes(styles.labelTypes, styles.moreBottom)}>
  										<RadioGroup
  												label={<L p={p} t={`Have parents been contacted?`}/>}
  												name={`haveParentsBeenContacted`}
  												data={[{ label: 'Yes', id: 'true' }, { label: 'No', id: 'false' }]}
  												horizontal={true}
  												className={styles.radio}
  												initialValue={haveParentsBeenContacted || ''}
  												onClick={(value) => handleTrueFalse('haveParentsBeenContacted', value)}
                          required={true}
                          whenFilled={haveParentsBeenContacted}
                          error={errorHaveParentsBeenContacted}/>
  								</div>
  								{haveParentsBeenContacted === 'true' &&
  										<div className={styles.row}>
  												<div className={styles.dataTime}>
  														<DateTimePicker id={`parentContactDate`}
                                  label={<L p={p} t={`Date`}/>}
                                  value={parentContactDate || ''}
                                  onChange={(event) => changeDate('parentContactDate', event)}
      														className={styles.dateTime}
                                  required={true}
                                  whenFilled={parentContactDate}
                                  error={errorParentContactDateTime}/>
  												</div>
  												<div className={styles.dataTime}>
  														<TimePicker id={`parentContactTime`}
                                  label={<L p={p} t={`Time`}/>}
                                  value={parentContactTime || ''}
                                  onChange={handleChange}
                                  className={styles.dateTime}
                                  required={true}
                                  whenFilled={parentContactTime}/>
  												</div>
  										</div>
  								}
  								<hr/>
                  {haveParentsBeenContacted === 'false' &&
      								<div className={classes(styles.labelTypes, styles.moreBottom)}>
      										<RadioGroup
      												label={<L p={p} t={`If you have not contacted a parent, do you plan to do so?`}/>}
      												name={`planToContactParents`}
      												data={[{ label: 'Yes', id: 'true' }, { label: 'No (not necessary)', id: 'false' }]}
      												horizontal={true}
      												className={styles.radio}
                              initialValue={planToContactParents || ''}
      												onClick={(value) => handleTrueFalse('planToContactParents', value)}
                              required={true}
                              whenFilled={planToContactParents}
                              error={errorPlanToContactParents}/>
      								</div>
                  }
  								<div className={classes(styles.muchLeft, styles.row)}>
  										<a className={styles.cancelLink} onClick={() => navigate('/behaviorIncidentList')}><L p={p} t={`Close`}/></a>
  										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  								</div>
  						</div>
  						{isShowingModal_delete &&
  								<MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this behavior incident record?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this behavior incident record?`}/>} isConfirmType={true}
  									 onClick={handleDelete} />
  						}
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
              {isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
              {isShowingModal_removeFile &&
  								<MessageModal handleClose={handleRemoveFileClose} heading={<L p={p} t={`Remove file?`}/>} isConfirmType={true}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this file?`}/>} onClick={handleRemoveFile} />
  						}
              {isShowingFileUpload &&
  								<FileUploadModalWithCrop handleClose={handleFileUploadClose} title={<L p={p} t={`Choose File or Image`}/>}
  										personId={personId} submitFileUpload={handleFileUploadSubmit}
  										file={selectedFile} handleInputFile={handleInputFile}
  										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf, .dat, .txt, .ppt, .wpd, .odt, .rtf, .wav, .mp4, .m4a"}
  										handleCancelFile={()=>{}}/>
              }
  						{isShowingModal_removeFileUpload &&
                  <MessageModal handleClose={handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file or image?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this file or image?`}/>} isConfirmType={true}
                     onClick={handleRemoveFileUpload} />
              }
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Behavior Incident Add`}/>} path={'behaviorIncidentAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(BehaviorIncidentAddView)
