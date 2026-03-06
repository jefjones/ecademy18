import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import axios from 'axios'
import { navigate, navigateReplace, goBack } from './'
import styles from './AnnouncementEditView.css'
const p = 'AnnouncementEditView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import MultiSelect from '../../components/MultiSelect'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import TextDisplay from '../../components/TextDisplay'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import RadioGroup from '../../components/RadioGroup'
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop'
import MessageModal from '../../components/MessageModal'
import InputDataList from '../../components/InputDataList'
import Icon from '../../components/Icon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import FilterGroupsSaved from '../../components/FilterGroupsSaved'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import moment from 'moment'
import { withAlert } from 'react-alert'
import {doSort} from '../../utils/sort'
import {guidEmpty} from '../../utils/guidValidate'
import debounce from 'lodash/debounce'
import {wait} from '../../utils/wait'

function AnnouncementEditView(props) {
  const [hideGroupChoices, setHideGroupChoices] = useState(true)
  const [isRecordComplete, setIsRecordComplete] = useState(false)
  const [processedIncomingRecipients, setProcessedIncomingRecipients] = useState(false)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(false)
  const [isShowingModal_removeFile, setIsShowingModal_removeFile] = useState(false)
  const [messageGroupName, setMessageGroupName] = useState('')
  const [messageGroupId, setMessageGroupId] = useState('')
  const [errorSubject, setErrorSubject] = useState('')
  const [errorStartDate, setErrorStartDate] = useState('')
  const [errorStartTime, setErrorStartTime] = useState('')
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([])
  const [studentType, setStudentType] = useState('ALL')
  const [accredited, setAccredited] = useState('ALL')
  const [includeGuardians, setIncludeGuardians] = useState(false)
  const [notIncludeStudentsOfGuardians, setNotIncludeStudentsOfGuardians] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedGuardians, setSelectedGuardians] = useState([])
  const [selectedFacilitators, setSelectedFacilitators] = useState([])
  const [selectedMentors, setSelectedMentors] = useState([])
  const [selectedCounselors, setSelectedCounselors] = useState([])
  const [selectedAdmins, setSelectedAdmins] = useState([])
  const [announcement, setAnnouncement] = useState({
						subject: props.subject || props.messageSave.subject || '',
            message: props.messageSave.message || '',
						startDate: '',
		        startTime: '',
						recipients: props.toPersonId
								? [{personId: props.toPersonId, firstName: props.toPersonName}]
								: [],
        })
  const [subject, setSubject] = useState(props.subject || props.messageSave.subject || '')
  const [message, setMessage] = useState(props.messageSave.message || '')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [recipients, setRecipients] = useState(props.toPersonId
								? [{personId: props.toPersonId, firstName: props.toPersonName}]
								: [])
  const [firstName, setFirstName] = useState(props.toPersonName)
  const [isInit, setIsInit] = useState(undefined)
  const [recipient_personId, setRecipient_personId] = useState(undefined)
  const [initialUpdate, setInitialUpdate] = useState(undefined)
  const [isUserChangedMessageGroupId, setIsUserChangedMessageGroupId] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [attachmentUrl, setAttachmentUrl] = useState(undefined)
  const [attachmentTitle, setAttachmentTitle] = useState(undefined)
  const [announcementAttachmentId, setAnnouncementAttachmentId] = useState(undefined)
  const [isShowingModal_resetGroup, setIsShowingModal_resetGroup] = useState(undefined)

  useEffect(() => {
    
    				let {announcementEdit, editType, fromPersonId, fromFirstName, fromLastName} = props
    	      if (!!announcementEdit) {
    						announcementEdit.subject = announcementEdit.subject ? announcementEdit.subject.indexOf('Reply:') !== 0 ? 'Reply: ' + announcementEdit.subject : announcementEdit.subject : ''
    						announcementEdit.message = ''
    						if ((editType === 'reply' || editType === 'new')
    								&& fromPersonId) announcementEdit.recipients = [getRecipient(fromPersonId, fromFirstName, fromLastName)]
    	        	setAnnouncement(announcementEdit)
    						setFromPersonId(fromPersonId)
    	      }
    				//Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    				// !announcementEdit || !announcementEdit.recipients || announcementEdit.recipients.length === 0
    				// 		? document.getElementById('recipient_personId').focus()
    				// 		: announcementEdit && announcementEdit.subject
    				// 				? document.getElementById('message').focus()
    				// 				: document.getElementById('subject').focus();
        
    return () => {
      
      				props.setStudentsSelected([], 'EMPTY'); //We want to clear the students selected after this message is sent.
      				props.removeAnnouncementAttachmentsUnused(props.personId)
      		
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    	      const {announcementEdit, editType, fromFirstName, fromLastName} = props
    				let {fromPersonId} = props
    	      if ((prevProps.announcementEdit !== announcementEdit && !!announcementEdit && editType === 'reply')
    							|| (editType === 'new' && fromPersonId && (!announcementEdit.recipients || announcementEdit.recipients.length === 0))) {
    						if (announcementEdit) {
    								announcementEdit.subject = announcementEdit && announcementEdit.subject
    										? announcementEdit.subject.indexOf('Reply:') !== 0
    												? 'Reply: ' + announcementEdit.subject
    												: announcementEdit.subject
    										: ''
    								announcementEdit.message = ''; //If this is a reply, don't automatically fill in the message body.
    						}
    						if (fromPersonId) announcementEdit.recipients = [getRecipient(fromPersonId, fromFirstName, fromLastName)]
    	          setAnnouncement(announcementEdit)
    						setFromPersonId(fromPersonId)
    	      }
    				if (props.chosenMessageGroupId !== messageGroupId && !isUserChangedMessageGroupId)
    						setMessageGroupId(props.chosenMessageGroupId)
    
    				if (!isInit && props.carpoolRequestId && props.toPersonId) {
    						setIsInit(true)
    						setFromPersonId(props.toPersonId, true)
    				}
        
  }, [])

  const getRecipient = (personId, firstName, lastName) => {
    
    				const {students, companyConfig} = props
    				let student = students && students.length > 0 && students.filter(s => s.id === personId)[0]
    				return student && student.firstName
    						? {
    								id: student.id,
    								label: companyConfig.studentNameFirst === 'FIRSTNAME' ? student.firstName + ' ' + student.lastName : student.lastName + ', ' + student.firstName,
    								personId: student.id,
    								firstName: student.firstName,
    								lastName: student.lastName,
    								role: 'Student',
    								fromFilter: 'Courses',
    								gradeLevelId: student.gradeLevelId,
    								studentType: student.studentType,
    								accredited: student.accredited,
    						}
    						: {
    								id: personId,
    								label: companyConfig.studentNameFirst === 'FIRSTNAME' ? firstName + ' ' + lastName : lastName + ', ' + firstName,
    								personId,
    								firstName,
    								lastName,
    						}
    		
  }

  const hasFilterChosen = () => {
    
    			
    
    				if (selectedCourses && selectedCourses.length > 0) return true
    				if (selectedGradeLevels && selectedGradeLevels.length > 0) return true
    				if (studentType !== 'ALL') return true
    				if (accredited !== 'ALL') return true
    				if (includeGuardians) return true
    				if (notIncludeStudentsOfGuardians) return true
    				if (selectedStudents && selectedStudents.length > 0) return true
    				if (selectedGuardians && selectedGuardians.length > 0) return true
    				if (selectedFacilitators && selectedFacilitators.length > 0) return true
    				if (selectedMentors && selectedMentors.length > 0) return true
    				if (selectedCounselors && selectedCounselors.length > 0) return true
    				if (selectedAdmins && selectedAdmins.length > 0) return true
    		
  }

  const resetFilters = (resetSingleRecipient=true) => {
    
    			setIsUserChangedMessageGroupId(true); setMessageGroupId(''); setSelectedCourses([]); setSelectedGradeLevels([]); setStudentType('ALL'); setAccredited('ALL'); setIncludeGuardians(false); setNotIncludeStudentsOfGuardians(false); setSelectedStudents([]); setSelectedGuardians([]); setSelectedFacilitators([]); setSelectedMentors([]); setSelectedCounselors([]); setSelectedAdmins([]); setAnnouncement({
    							...announcement,
    							recipients: [],
    					})
    			//if (resetSingleRecipient) setRecipient_personId('')
    			props.alert.info(<div className={styles.alertText}>All filters and recipient choices have been reset.</div>)
    		
  }

  const handleMessageSave = () => {
    
    				const {saveMessage} = props
    				
    				saveMessage(announcement.subject, announcement.message)
    		
  }

  const changeAnnouncement = ({target}) => {
    
    	      setAnnouncement({...announcement, [target.name]: target.value})
        
  }

  const setTimeNow = () => {
    
    				const todayNow = new Date()
    				announcement.startDate = moment(todayNow).format("YYYY-MM-DD")
    	      announcement.startTime = moment(todayNow).format("HH:mm")
    	      setAnnouncement(announcement)
    		
  }

  const changeStartDate = (field, event) => {
    
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && processForm("STAY")
        
  }

  const processForm = (stayOrFinish) => {
    
    	      const {addOrUpdateAnnouncement, personId, saveMessage, reply_announcementId} = props
    	      let  announcement = Object.assign({}, announcement)
    	      let hasError = false
    
    	      if (!announcement.subject) {
    	          hasError = true
    	          setErrorSubject(<L p={p} t={`A subject is required`}/>)
    	      }
          
    				if (!announcement.recipients || announcement.recipients.length === 0) {
    						if (props.editType === 'carpoolRequest') {
    								announcement.recipients = [{personId: props.toPersonId, firstName: props.toPersonName}]
    						} else {
    			          hasError = true
    								props.alert.info(<div className={styles.alertText}><L p={p} t={`At least one recipient is necessary before sending a message.`}/></div>)
    						}
    	      }
    				announcement.startDate = new Date()
    				// if (!announcement.startDate) {
    	      //     hasError = true;
    	      //     setErrorStartDate("A start date is required");
    	      // }
    				// if (!announcement.message) {
    	      //     hasError = true;
    	      //     setErrorSubject("Announcement message required");
    	      // }
    
    	      if (!hasError) {
    						if (props.carpoolRequestId) announcement.carpoolRequestId = props.carpoolRequestId
                announcement.reply_announcementId = reply_announcementId
    
    	          addOrUpdateAnnouncement(personId, announcement)
    
    	          setIsRecordComplete(false); setErrorSubject(''); setErrorStartDate(''); setErrorStartTime(''); setSelectedGuardians([]); setSelectedStudents([]); setSelectedCourses([]); setSelectedFacilitators([]); setSelectedAdmins([]); setSelectedMentors([]); setSelectedCounselors([]); setSelectedGradeLevels([]); setStudentType('ALL'); setAccredited('ALL'); setAnnouncement({
    									subject: '',
    			            message: '',
    									startDate: '',
    					        startTime: '',
    									recipients: [],
    							})
    						saveMessage('', ''); //Blank it out.
    	          if (stayOrFinish === "FINISH") {
    	              navigate(`/messagesAndReminders`)
    	          } else {
    								navigate(`/announcementEdit`)
    						}
    	          //document.getElementById('subject').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    	      }
        
  }

  const noDuplicate = (id, recipients) => {
    
    				let duplicate = recipients && recipients.length > 0 && recipients.filter(m => m.personId === id)[0]
    				return !(duplicate && duplicate.personId)
    		
  }

  const buildRecipients = (fromFilter, incomingValue, newState=null) => {
    
    				// 1.	Send in the changed filter values.
    				// 2.	Get the local state
    				// 3.	Update the local state with the parameter value
    				// 4.	Clear out the recipients
    				// 5.	Rebuild the recipients
    				// 	a.	Take the course students, if any.
    				// 	b.	If there is a restricter chosen (grade level, student type or accredited)
    				// 		i.	If no course is chosen, set all students as recipients - in preparation to restrict the recipient list by one or more restricters.
    				//					Otherwise, the selectedCourses above set the recipient list for us.
    				//    ii. Apply the filter to restrict the list according to the restricter(s) chosen
    				// 	c.	Add on individual students (inferring that the other students are set as recipients automatically by the filter choices of courses, grade level, student type and/or accredited).
    				// 	d.	If IncludeGuardians was chosen
    				// 		i.	Include the guardians
    				// 		ii.	If students are being cut out (NotIncludeStudentGuardians)
    				// 			1.	Cut out the students from the entire list.
    				// 	e.	Add on the individual guardians, if any (inferring that the other guardians are set as recipients automatically without updating the guardian list specifically).
    				// 	f.	Add on the teachers, if any.
    				// 	g.	Add on the counselors, if any.
    				// 	h.	Add on the mentors, if any.
    				// 	i.	Add on the admins, if any.
    
    				const {students, guardians, facilitators, mentors, counselors, admins} = props
    
    				// 2.	Get the local state
    				let state = newState ? newState : Object.assign({}, state)
    				// 3.	Update the local state with the parameter value
    				if (fromFilter) state[fromFilter] = incomingValue
    				// 4.	Clear out the recipients
    				// 5.	Rebuild the recipients
    				// 	a.	Take the course students, if any.
    				if (state.selectedCourses && state.selectedCourses.length > 0) {
                const {studentCourseAssigns} = props
    						state.selectedCourses.forEach(courseScheduledId => {
    								studentCourseAssigns && studentCourseAssigns.length > 0 && studentCourseAssigns.filter(m => m.courseScheduledId === courseScheduledId).forEach(m => {
    										let student = students && students.length > 0 && students.filter(s => s.id === m.studentPersonId)[0]
    										if (student && student.firstName && noDuplicate(student.id, recipients)) {
    												let newRecipient = {
    														personId: student.id,
    														firstName: student.firstName,
    														lastName: student.lastName,
    														role: 'Student',
                                sendToEmail: student.emailAddress && student.bestContactEmail,
                                sendToText: student.phone && student.bestContactPhoneText,
    														fromFilter: 'Courses',
    														gradeLevelId: student.gradeLevelId,
    														studentType: student.studentType,
    														accredited: student.accredited,
    												}
    												recipients = recipients && recipients.length > 0 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    				// 	b.	If there is a restricter chosen (grade level, student type or accredited)
    				if ((state.selectedGradeLevels && state.selectedGradeLevels.length > 0) || state.studentType !== 'ALL' || state.accredited !== 'ALL') {
    						// 		i.	If no course is chosen, set all students as recipients - in preparation to restrict the recipient list by one or more restricters.
    						//					Otherwise, the selectedCourses above set the recipient list for us.
    						if (!state.selectedCourses || state.selectedCourses.length === 0) {
    								students && students.length > 0 && students.forEach(m => {
    										if (noDuplicate(m.id, recipients)) {
    												let newRecipient = {
    														personId: m.id,
    														firstName: m.firstName,
    														lastName: m.lastName,
    														role: 'Student',
                                sendToEmail: m.emailAddress && m.bestContactEmail,
                                sendToText: m.phone && m.bestContactPhoneText,
    														fromFilter: 'Restricters',
    														gradeLevelId: m.gradeLevelId,
    														studentType: m.studentType,
    														accredited: m.accredited,
    												}
    												recipients = recipients && recipients.length > 0 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						}
    						//    ii. Apply the filter to restrict the list according to the restricter(s) chosen
    						if (state.selectedGradeLevels && state.selectedGradeLevels.length > 0)
    								recipients = recipients.filter(m => state.selectedGradeLevels.indexOf(m.gradeLevelId) > -1)
    
    						if (state.studentType !== 'ALL')
    								recipients = recipients.filter(m => m.studentType === state.studentType)
    
    						if (state.accredited !== 'ALL')
    								recipients = recipients.filter(m => m.accredited === state.accredited)
    				}
    				// 	c.	Add on individual students (inferring that the other students are set as recipients automatically by the filter choices of courses, grade level, student type and/or accredited).
    				if (state.selectedStudents && state.selectedStudents.length > 0) {
    						state.selectedStudents.forEach(id => {
    								students && students.length > 0 && students.filter(s => s.id === id).forEach(s => {
    										if (noDuplicate(s.id, recipients)) {
    												let newRecipient = {
    														personId: s.id,
    														firstName: s.firstName,
    														lastName: s.lastName,
    														role: 'Student',
                                  sendToEmail: s.emailAddress && s.bestContactEmail,
                                sendToText: s.phone && s.bestContactPhoneText,
    														fromFilter: 'Students',
    														gradeLevelId: s.gradeLevelId,
    														studentType: s.studentType,
    														accredited: s.accredited,
    												}
    												recipients = recipients && recipients.length > 0 && recipients.indexOf(s.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    				// 	d.	If IncludeGuardians was chosen
    				// 		i.	Include the guardians
    				if (state.includeGuardians) {
    						state.includeGuardians && recipients && recipients.length > 0 && recipients.forEach(m => {
    								students && students.length > 0 && students.filter(s => s.id === m.personId).forEach(s => {
    										let guardian = guardians && guardians.length > 0 && guardians.filter(g => g.id === s.primaryGuardianPersonId)[0]
    										if (guardian && guardian.firstName && noDuplicate(guardian.id, recipients)) {
    												let newRecipient = { personId: guardian.id, firstName: guardian.firstName, lastName: guardian.lastName, role: 'Guardian',
                            sendToEmail: guardian.emailAddress && guardian.bestContactEmail,
                            sendToText: guardian.phone && guardian.bestContactPhoneText,
                            fromFilter: 'IncludeGuardians' }
    												recipients = recipients && recipients.length > 0 && recipients.indexOf(guardian.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    				// 		ii.	If students are being cut out (NotIncludeStudentGuardians)
    				// 			1.	Cut out the students from the entire list.
    				if (state.notIncludeStudentsOfGuardians) {
    						//Notice that this filter is for "role" and not "fromFilter" like the others.
    						recipients = recipients && recipients.length > 0 && recipients.filter(m => m.role !== 'Student')
    				}
    				// 	e.	Add on the individual guardians, if any (inferring that the other guardians are set as recipients automatically without updating the guardian list specifically).
    				if (state.selectedGuardians && state.selectedGuardians.length > 0) {
    						state.selectedGuardians.forEach(id => {
    								guardians && guardians.length > 0 && guardians.filter(s => s.id === id).forEach(g => {
    										if (noDuplicate(g.id, recipients)) {
    												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Guardian',
                            sendToEmail: g.emailAddress && g.bestContactEmail,
                            sendToText: g.phone && g.bestContactPhoneText,
                            fromFilter: 'Guardians' }
    												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    				// 	f.	Add on the teachers, if any.
    				if (state.selectedFacilitators && state.selectedFacilitators.length > 0) {
    						state.selectedFacilitators.forEach(id => {
    								facilitators && facilitators.length > 0 && facilitators.filter(s => s.id === id).forEach(g => {
    										if (noDuplicate(g.id, recipients)) {
    												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Teacher',
                            sendToEmail: g.emailAddress && g.bestContactEmail,
                            sendToText: g.phone && g.bestContactPhoneText,
                            fromFilter: 'Facilitators' }
    												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    				// 	g.	Add on the counselors, if any.
    				if (state.selectedCounselors && state.selectedCounselors.length > 0) {
    						state.selectedCounselors.forEach(id => {
    								counselors && counselors.length > 0 && counselors.filter(s => s.id === id).forEach(g => {
    										if (noDuplicate(g.id, recipients)) {
    												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Counselor',
                            sendToEmail: g.emailAddress && g.bestContactEmail,
                            sendToText: g.phone && g.bestContactPhoneText,
                            fromFilter: 'Counselors' }
    												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    				// 	h.	Add on the mentors, if any.
    				if (state.selectedMentors && state.selectedMentors.length > 0) {
    						state.selectedMentors.forEach(id => {
    								mentors && mentors.length > 0 && mentors.filter(s => s.id === id).forEach(g => {
    										if (noDuplicate(g.id, recipients)) {
    												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Mentor',
                            sendToEmail: g.emailAddress && g.bestContactEmail,
                            sendToText: g.phone && g.bestContactPhoneText,
                            fromFilter: 'Mentors' }
    												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    				// 	i.	Add on the admins, if any.
    				if (state.selectedAdmins && state.selectedAdmins.length > 0) {
    						state.selectedAdmins.forEach(id => {
    								admins && admins.length > 0 && admins.filter(s => s.id === id).forEach(g => {
    										if (noDuplicate(g.id, recipients)) {
    												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Admin',
                            sendToEmail: g.emailAddress && g.bestContactEmail,
                            sendToText: g.phone && g.bestContactPhoneText,
                            fromFilter: 'Admins' }
    												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
    										}
    								})
    						})
    				}
    
    				setAnnouncement({...announcement, recipients })
    		
  }

  const handleSelectedGuardians = (selectedGuardians) => {
    
    				setSelectedGuardians(selectedGuardians)
    				buildRecipients('selectedGuardians', selectedGuardians)
        
  }

  const handleSelectedStudents = (selectedStudents) => {
    
    				setSelectedStudents(selectedStudents)
    				buildRecipients('selectedStudents', selectedStudents)
        
  }

  const handleSelectedCourses = (selectedCourses) => {
    
    				setSelectedCourses(selectedCourses)
    				buildRecipients('selectedCourses', selectedCourses)
        
  }

  const handleSelectedFacilitators = (selectedFacilitators) => {
    
    				setSelectedFacilitators(selectedFacilitators)
    				buildRecipients('selectedFacilitators', selectedFacilitators)
        
  }

  const handleSelectedAdmins = (selectedAdmins) => {
    
    				setSelectedAdmins(selectedAdmins)
    				buildRecipients('selectedAdmins', selectedAdmins)
        
  }

  const handleSelectedMentors = (selectedMentors) => {
    
    				setSelectedMentors(selectedMentors)
    				buildRecipients('selectedMentors', selectedMentors)
        
  }

  const handleSelectedCounselors = (selectedCounselors) => {
    
    				setSelectedCounselors(selectedCounselors)
    				buildRecipients('selectedCounselors', selectedCounselors)
        
  }

  const removeRecipient = (personId) => {
    
  }

  const guardiansValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Add Individual Guardians:  ${selected.length} of ${options.length}`}/>
        
  }

  const studentsValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Add Individual Students:  ${selected.length} of ${options.length}`}/>
        
  }

  const coursesValueRenderer = (selected, options) => {
    
            return <div className={styles.bold}><L p={p} t={`Courses (students assigned):  ${selected.length} of ${options.length}`}/></div>
        
  }

  const facilitatorsValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Teachers:  ${selected.length} of ${options.length}`}/>
        
  }

  const adminsValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Administrators:  ${selected.length} of ${options.length}`}/>
        
  }

  const mentorsValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Learning Coaches:  ${selected.length} of ${options.length}`}/>
        
  }

  const counselorsValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Counselors:  ${selected.length} of ${options.length}`}/>
        
  }

  const togglePrimaryGuardian = (event) => {
    
    				//When this is set to true, include all of the primary guardians of the chosen students.
    				//when it is false, unselect specifically the guardians that are chosen in the guardian list (since it is possible that one or more guardians are chosen which do not belong to chosen students)
    				//And remember that when a student is de-selected that the guardian is also de-selected IF this is checked.
    				//	And that deselection can happen in the table list below on a "remove" click.
    	      setIncludeGuardians(event.target.checked); setNotIncludeStudentsOfGuardians(event.target.checked ? notIncludeStudentsOfGuardians : false)
    				buildRecipients('includeGuardians', event.target.checked)
    		
  }

  const toggleNotStudentsOfGuardian = (event) => {
    
    	      setNotIncludeStudentsOfGuardians(event.target.checked)
    				buildRecipients('notIncludeStudentsOfGuardians', event.target.checked)
    		
  }

  const handleRemoveInputFile = () => {
    
      			setSelectedFile(null); setAttachmentUrl(''); setAttachmentTitle(''); setAnnouncementAttachmentId('')
      			let img = imageViewer
      	    img.src = ''
      			showFile.after(img)
      	
  }

  const handleInputFile = (selectedFile) => {
    
      			setSelectedFile(selectedFile)
      			const img = imageViewer
      			const reader = new FileReader()
      			reader.onloadend = function() {
      			    img.src = reader.result
      			}
      			reader.readAsDataURL(selectedFile)
      			showFile.after(img)
      	
  }

  const handleFileUploadOpen = () => {
    return setIsShowingFileUpload(true)

  }
  const handleFileUploadClose = () => {
    return setIsShowingFileUpload(false)

  }
  const handleFileUploadSubmit = () => {
    
      			let data = new FormData()
      			data.append('file', selectedFile)
      			let url = `${apiHost}ebi/announcementAttachments/fileUpload/${personId}/${announcement.announcementId || ''}`; // + `/` + encodeURIComponent(announcement.title);
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
      					.catch(function (error) {
      						//Show error here.
      				  })
      					.then(response => {
                    if (!announcement.assignmentId || announcement.assignmentId === guidEmpty) {
                        let announcement = Object.assign({}, announcement)
                        announcement.announcementId = response.data.announcementId
                        setAnnouncement(announcement); setAttachmentUrl(response.data.urlTemp); setAttachmentTitle(response.data.title); setAnnouncementAttachmentId(response.data.announcementAttachmentId)
      							}
      					})
      			handleFileUploadClose()
      	
  }

  const handleRemoveFileOpen = (announcementAttachmentId) => {
    return setIsShowingModal_removeFile(true); setAnnouncementAttachmentId(announcementAttachmentId)

  }
  const handleRemoveFileClose = () => {
    return setIsShowingModal_removeFile(false)

  }
  const handleRemoveFile = () => {
    
    				const {removeAnnouncementAttachmentFile, personId} = props
    				
    				removeAnnouncementAttachmentFile(personId, announcementAttachmentId)
    				handleRemoveFileClose()
            handleRemoveInputFile()
    		
  }

  const toggleGradeLevel = (gradeLevelId) => {
    
  }

  const handleStudentType = (value) => {
    
    				setStudentType(value)
    				buildRecipients('studentType', value)
    		
  }

  const handleAccredited = (value) => {
    
    				setAccredited(value)
    				buildRecipients('accredited', value)
    		
  }

  const changeNewSavedMessageGroupName = (event) => {
    
    				setMessageGroupName(event.target.value)
    		
  }

  const handleEnterKeySaveGroupName = (event) => {
    
    				if (event.key === 'Enter') {
    						saveOrUpdateMessageGroup(event, false)
    				}
    		
  }

  const saveOrUpdateMessageGroup = (event, isUpdate) => {
    
    				const {addOrUpdateMessageGroup, personId, messageGroups} = props
    				
    
    				let groupName = ''
    				if (isUpdate) {
    						let messageGroup  = messageGroups && messageGroups.length > 0 && messageGroups.filter(m => m.messageGroupId === messageGroupId)[0]
    						if (messageGroup && messageGroup.groupName) groupName = messageGroup.groupName
    						props.alert.info(<div className={styles.alertText}><L p={p} t={`Your message group was updated.`}/></div>)
    
    				} else {
    						groupName = messageGroupName
    						props.alert.info(<div className={styles.alertText}><L p={p} t={`Your message group was added.`}/></div>)
    				}
    
    				let messageGroup = {
    						messageGroupId: isUpdate ? messageGroupId : guidEmpty,
    						personId: personId,
    						groupName,
    						selectedCourses: selectedCourses.toString(),
    						selectedGradeLevels: selectedGradeLevels.toString(),
    						studentType: studentType,
    						accredited: accredited,
    						includeGuardians: !!includeGuardians,
    						notIncludeStudentsOfGuardians: !!notIncludeStudentsOfGuardians,
    						selectedStudents: selectedStudents.toString(),
    						selectedGuardians: selectedGuardians.toString(),
    						selectedFacilitators: selectedFacilitators.toString(),
    						selectedMentors: selectedMentors.toString(),
    						selectedCounselors: selectedCounselors.toString(),
    						selectedAdmins: selectedAdmins.toString(),
    				}
    				addOrUpdateMessageGroup(personId, messageGroup)
    				setMessageGroupName('')
    		
  }

  const setMessageGroup = (event) => {
    
    				const {messageGroups} = props
    				let newState = Object.assign({}, state)
    
    				if (!event.target.value || event.target.value === "0") {
    						newState.messageGroupId = event.target.value
    						newState.selectedCourses = []
    						newState.selectedGradeLevels = []
    						newState.studentType = 'ALL'
    						newState.accredited = 'ALL'
    						newState.includeGuardians = false
    						newState.notIncludeStudentsOfGuardians = false
    						newState.selectedStudents = []
    						newState.selectedGuardians = []
    						newState.selectedFacilitators = []
    						newState.selectedMentors = []
    						newState.selectedCounselors = []
    						newState.selectedAdmins = []
    				} else {
    						let messageGroup = messageGroups && messageGroups.length > 0 && messageGroups.filter(m => m.messageGroupId === event.target.value)[0]
    						if (messageGroup && messageGroup.messageGroupId) {
    								newState.messageGroupId = event.target.value
    								newState.selectedCourses = !messageGroup.selectedCourses ? [] : messageGroup.selectedCourses.split(',')
    								newState.selectedGradeLevels = !messageGroup.selectedGradeLevels ? [] : messageGroup.selectedGradeLevels.split(',')
    								newState.studentType = messageGroup.studentType
    								newState.accredited = messageGroup.accredited
    								newState.includeGuardians = messageGroup.includeGuardians
    								newState.notIncludeStudentsOfGuardians = messageGroup.notIncludeStudentsOfGuardians
    								newState.selectedStudents = !messageGroup.selectedStudents ? [] : messageGroup.selectedStudents.split(',')
    								newState.selectedGuardians = !messageGroup.selectedGuardians ? [] : messageGroup.selectedGuardians.split(',')
    								newState.selectedFacilitators = !messageGroup.selectedFacilitators ? [] : messageGroup.selectedFacilitators.split(',')
    								newState.selectedMentors = !messageGroup.selectedMentors ? [] : messageGroup.selectedMentors.split(',')
    								newState.selectedCounselors = !messageGroup.selectedCounselors ? [] : messageGroup.selectedCounselors.split(',')
    								newState.selectedAdmins = !messageGroup.selectedAdmins ? [] : messageGroup.selectedAdmins.split(',')
    						}
    				}
    				newState.isUserChangedMessageGroupId = true
    				setState(newState)
    				buildRecipients('', '', newState)
    		
  }

  const deleteSavedMessageGroup = () => {
    
    				const {removeMessageGroup, personId} = props
    				removeMessageGroup(personId, messageGroupId)
    				setMessageGroupId('')
    		
  }

  const toggleHideGroupChoices = () => {
    
    				setHideGroupChoices(!hideGroupChoices)
    		
  }

  const handleResetGroupOpen = (recipient_personId) => {
    return setIsShowingModal_resetGroup(true); setRecipient_personId(recipient_personId)

  }
  const handleResetGroupClose = (isClose, setRecipient) => {
    
    				if (isClose) setIsShowingModal_resetGroup(false)
    				if (setRecipient) setFromPersonId(recipient_personId, false); //false is NOT to reset the group choices.
    		
  }

  const handleResetGroup = () => {
    
    				handleResetGroupClose(true)
    				resetFilters(false); //Don't reset the single recipient.
    				setFromPersonId(recipient_personId, true); //True is to reset the group choices.
    		
  }

  const changeRecipient = (personChosen) => {
    
            if (personChosen && personChosen.id) setFromPersonId(personChosen.id, true)
            setPersonChosen(personChosen)
        
  }

  const {personId, facilitators, mentors, guardians, counselors, accessRoles={}, companyConfig={}, announcementAttachments,
  							gradeLevels, messageGroups, students, coursesScheduled, admins, singleSimpleList, myFrequentPlaces, setMyFrequentPlace} = props
  			if (announcement && announcement.recipients && announcement && announcement.recipients.length > 0) {
  					recipients = doSort(announcement.recipients, {sortField: companyConfig.studentNameFirst === 'FIRSTNAME' ? 'firstName' : 'lastName', isAsc: true, isNumber: false})
  			}
        let headings = [{},
        		{label: <L p={p} t={`Recipient`}/>},
        		{label: <L p={p} t={`Role`}/>},
        		{label: <L p={p} t={`Email`}/>},
        		{label: <L p={p} t={`Text`}/>}
  		]
        let data = recipients && recipients.length > 0
            ? recipients.map((m, i) => {
  								if (!m) return null
                  return [
                      { value: <a onClick={() => removeRecipient(m.personId)} className={styles.remove}><L p={p} t={`remove`}/></a>},
  										{ id: m.fromPersonId, value: m.firstName + ' ' + m.lastName},
                      { id: m.fromPersonId, value: m.role},
                      { id: m.fromPersonId, value: m.sendToEmail ? <L p={p} t={`Email`}/> : ''},
                      { id: m.fromPersonId, value: m.sendToText ? <L p={p} t={`Text`}/> : ''},
                  ]})
            : [[{},{value: <L p={p} t={`no recipients chosen`}/>}]]
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    	<L p={p} t={`Compose a message`}/>
                  </div>
  								<div className={styles.row}>
  										<div>
                          <InputDataList
                              name={`personChosen`}
                              label={<L p={p} t={`Single recipient`}/>}
                              value={personChosen}
                              options={singleSimpleList}
                              className={styles.moreBottomMargin}
                              height={`medium`}
                              multiple={false}
                              onChange={changeRecipient}/>
  										</div>
  										<div className={styles.groupPlacement}>
                          <div className={styles.plainText}><L p={p} t={`For multiple recipients`}/></div>
  												<TextDisplay text={<a className={styles.link} onClick={toggleHideGroupChoices}><L p={p} t={`Choose from groups`}/></a>} />
  										</div>
  								</div>
                  <div className={styles.formLeft}>
                      <InputText
                          id={`subject`}
                          name={`subject`}
                          size={"long"}
                          label={<L p={p} t={`Subject`}/>}
                          value={announcement.subject || props.subject || ''}
                          onChange={changeAnnouncement}
  												onBlur={handleMessageSave}
                          onEnterKey={handleEnterKey}
                          error={errorSubject} />
  								</div>
  								<div className={styles.textareaDiv}>
  	                  <span className={styles.inputText}><L p={p} t={`Message`}/></span><br/>
  	                  <textarea rows={5}
  	                          id={'message'}
  	                          name={'message'}
  														value={announcement.message}
  	                          onChange={changeAnnouncement}
  														onBlur={handleMessageSave}
  	                          className={styles.commentTextarea}>
  	                  </textarea>
  	              </div>
  								<div className={styles.marginLeft}>
                      <img src={''} alt={'New'} ref={(ref) => (imageViewer = ref)} />
                      <div className={classes(styles.row, styles.includePicture)} ref={(ref) => (showFile = ref)} onClick={handleFileUploadOpen}>
                          <Icon pathName={'camera2'} premium={true} className={styles.icon}/>
                          <div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Attach file or picture`}/></div>
                      </div>
                      <div className={styles.row}>
                          {attachmentTitle &&
                              <div className={styles.text}>
                                  {attachmentTitle}
                              </div>
                          }
                          {announcementAttachmentId &&
                              <a onClick={() => handleRemoveFileOpen(announcementAttachmentId)} className={styles.remove}>
                                  <L p={p} t={`remove`}/>
                              </a>
                          }
                      </div>
  										{announcementAttachments && announcementAttachments.length > 0 && announcementAttachments.map((f, i) => (
  												<div key={i} className={styles.row}>
  														<div className={styles.linkDisplay}>
  														</div>
  												</div>
  										))}
  										{!announcementAttachmentId &&
  												<div className={styles.noDocs}><L p={p} t={`No attachment found`}/></div>
  										}
  								</div>
  								<div className={classes(styles.rowRight)}>
                      <Button label={<L p={p} t={`Send`}/>} className={classes((isRecordComplete ? styles.opacityFull : styles.opacityLow))}
  												onClick={(event) => processForm("FINISH", event)}/>
                  </div>
  								<div className={classes(styles.classification, styles.row)}>
  										<div className={styles.lowerPosition}><L p={p} t={`Send to group:`}/></div>
  										<div className={classes(styles.biggerLeft, styles.lowerPosition)}>
  												<a onClick={toggleHideGroupChoices} className={classes(styles.row, styles.whiteLink, styles.moreLeft)}>
  														<Icon pathName={'magnifier'} premium={true} className={styles.icon} fillColor={'white'}/>
  														{hideGroupChoices ? <L p={p} t={`Show group choices`}/> : <L p={p} t={`Hide group choices`}/>}
  												</a>
  										</div>
  								</div>
  								{(accessRoles.admin || accessRoles.facilitator) && !hideGroupChoices &&
  										<div className={styles.grayBackground}>
                          <FilterGroupsSaved filterGroups={messageGroups} filterGroupSavedId={messageGroupId} filterGroupName={messageGroupName}
                              setFilterGroup={setMessageGroup} saveOrUpdateGroup={saveOrUpdateMessageGroup} hasFilterChosen={hasFilterChosen}
                              changeNewSavedGroupName={changeNewSavedMessageGroupName} deleteSavedGroup={deleteSavedMessageGroup} resetFilters={resetFilters}
                              handleEnterKeySaveGroupName={handleEnterKeySaveGroupName}/>
  										</div>
  								}
  								{(accessRoles.admin || accessRoles.facilitator) && !hideGroupChoices &&
  										<div className={styles.backgroundFilters}>
  												<hr/>
  												<div className={styles.multiSelect}>
  														<MultiSelect
  																name={'Courses'}
  																options={coursesScheduled || []}
  																onSelectedChanged={handleSelectedCourses}
  																valueRenderer={coursesValueRenderer}
  																getJustCollapsed={() => {}}
  																selected={selectedCourses || []}/>
  												</div>
  												<hr/>
  												<div className={classes(styles.moreLeft, styles.header)}><L p={p} t={`Students in grade level`}/></div>
  												<div className={classes(styles.doubleLeft, styles.moreBottomMargin, styles.rowWrap)}>
  														{gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.label.length <= 2).map((m, i) =>
  																<Checkbox
  																		key={i}
  																		id={m.id}
  																		label={m.label}
  																		checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.indexOf(m.id) > -1) || ''}
  																		onClick={() => toggleGradeLevel(m.id)}
  																		labelClass={styles.labelCheckbox}
  																		checkboxClass={styles.checkbox} />
  														)}
  												</div>
  												{companyConfig.urlcode === 'Liahona' &&
  														<RadioGroup
  																data={[{ id: "ALL", label: <L p={p} t={`All`}/> }, { id: "ACADEMY", label: <L p={p} t={`Academy`}/> }, { id: "DE", label: <L p={p} t={`Distance Education`}/> }]}
  																title={<L p={p} t={`Student Type`}/>}
  																id={'studentType'}
  																name={'studentType'}
  																horizontal={true}
  																className={styles.radio}
  																initialValue={studentType}
  																onClick={(value) => handleStudentType(value)}/>
  												}
  												{companyConfig.urlcode === 'Liahona' &&
  														<RadioGroup
  																data={[{ id: "ALL", label: <L p={p} t={`All`}/> }, { id: 'accredited', label: <L p={p} t={`Accredited`}/> }, { id: 'non-accredited', label: <L p={p} t={`Non-accredited`}/> }]}
  																title={<L p={p} t={`Accredited`}/>}
  																id={'accredited'}
  																name={'accredited'}
  																horizontal={true}
  																className={styles.radio}
  																initialValue={accredited}
  																onClick={(value) => handleAccredited(value)}/>
  												}
  										</div>
  								}
  								{!hideGroupChoices &&
  										<div className={styles.backgroundFilters}>
  												<hr/>
  												<div className={styles.multiSelect}>
  														<MultiSelect
  																name={'students'}
  																options={students || []}
  																onSelectedChanged={handleSelectedStudents}
  																valueRenderer={studentsValueRenderer}
  																getJustCollapsed={() => {}}
  																selected={selectedStudents || []}/>
  												</div>
  										</div>
  								}
  								{(accessRoles.admin || accessRoles.facilitator) && !hideGroupChoices &&
  										<div className={styles.backgroundFilters}>
  												<hr/>
  												<div className={styles.checkboxPosition}>
  														<div className={classes(styles.leftMove, styles.header)}><L p={p} t={`Guardians`}/></div>
  														<Checkbox
  								                id={`includeGuardians`}
  								                label={<L p={p} t={`With the chosen students, include their primary guardians?`}/>}
  								                position={'after'}
  								                checked={includeGuardians || ''}
  								                onClick={togglePrimaryGuardian}
  								                labelClass={styles.longLabel}
  								                checkboxClass={styles.checkbox} />
  														<Checkbox
  																id={`notIncludeStudentsOfGuardians`}
  								                label={<L p={p} t={`Do NOT include students in the recipient list?`}/>}
  								                position={'after'}
  								                checked={notIncludeStudentsOfGuardians || ''}
  								                onClick={toggleNotStudentsOfGuardian}
  								                labelClass={classes(styles.longLabel, (includeGuardians ? '' : styles.disabledText))}
  																disabled={!includeGuardians}
  								                checkboxClass={styles.checkbox} />
  												</div>
  												<div className={styles.multiSelect}>
  				                    <MultiSelect
  				                        name={'guardians'}
  				                        options={guardians || []}
  				                        onSelectedChanged={handleSelectedGuardians}
  				                        valueRenderer={guardiansValueRenderer}
  				                        getJustCollapsed={() => {}}
  				                        selected={selectedGuardians || []}/>
  												</div>
  		                </div>
  								}
  								{(companyConfig.urlcode !== 'Manheim' || (companyConfig.urlcode === 'Manheim' && (accessRoles.admin || accessRoles.counselor))) && !hideGroupChoices &&
  										<div className={classes(styles.backgroundFilters, styles.multiSelect, styles.biggerTop)}>
  												<hr/>
  		                    <MultiSelect
  		                        name={'facilitators'}
  		                        options={facilitators || []}
  		                        onSelectedChanged={handleSelectedFacilitators}
  		                        valueRenderer={facilitatorsValueRenderer}
  		                        getJustCollapsed={() => {}}
  		                        selected={selectedFacilitators || []}/>
  		                </div>
  								}
  								{companyConfig.isMcl && !hideGroupChoices &&
  										<div className={classes(styles.backgroundFilters, styles.multiSelect, styles.moreTop)}>
  												<hr/>
  		                    <MultiSelect
  		                        name={'mentors'}
  		                        options={mentors || []}
  		                        onSelectedChanged={handleSelectedMentors}
  		                        valueRenderer={mentorsValueRenderer}
  		                        getJustCollapsed={() => {}}
  		                        selected={selectedMentors || []}/>
  		                </div>
  								}
  								{counselors && companyConfig.urlcode === 'Manheim' && !hideGroupChoices &&
  										<div className={classes(styles.backgroundFilters, styles.multiSelect)}>
  												<hr/>
  		                    <MultiSelect
  		                        name={'counselors'}
  		                        options={counselors || []}
  		                        onSelectedChanged={handleSelectedCounselors}
  		                        valueRenderer={counselorsValueRenderer}
  		                        getJustCollapsed={() => {}}
  		                        selected={selectedCounselors || []}/>
  		                </div>
  								}
  								{(accessRoles.admin || accessRoles.facilitator || accessRoles.counselor) && !hideGroupChoices &&
  										<div className={classes(styles.backgroundFilters, styles.multiSelect)}>
  												<hr/>
  		                    <MultiSelect
  		                        name={'admins'}
  		                        options={admins || []}
  		                        onSelectedChanged={handleSelectedAdmins}
  		                        valueRenderer={adminsValueRenderer}
  		                        getJustCollapsed={() => {}}
  		                        selected={selectedAdmins || []}/>
  		                </div>
  								}
  								{!hideGroupChoices && <hr />}
  								{!hideGroupChoices &&
  		                <div className={classes(styles.rowRight)}>
  		                    <Button label={<L p={p} t={`Send`}/>} className={classes((isRecordComplete ? styles.opacityFull : styles.opacityLow))} onClick={(event) => processForm("FINISH", event)}/>
  		                </div>
  								}
  								<hr/>
  								<div className={styles.text}>{announcement && announcement.recipients
  									? <div className={styles.row}><L p={p} t={`Recipients: `}/>{announcement && announcement.recipients && announcement.recipients.length}</div>
  									: <div className={styles.row}><L p={p} t={`Recipients: `}/>0</div>}</div>
                  <div className={globalStyles.instructions}><L p={p} t={`Recipients without email or text messaging will still recieve messages in their eCademy inbox.`}/></div>
  								<div className={styles.scrollable}>
  										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data}/>
  								</div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Compose Message`}/>} path={'announcementEdit'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingFileUpload &&
                  <FileUploadModalWithCrop handleClose={handleFileUploadClose} title={<L p={p} t={`Message Attachment`}/>}
  										personId={personId} submitFileUpload={handleFileUploadSubmit}
  										file={selectedFile}
  										handleInputFile={handleInputFile}
  										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .mp3, .mp4, .m4a"}
  										handleCancelFile={handleRemoveInputFile}/>
              }
  						{isShowingModal_removeFile &&
                  <MessageModal handleClose={handleRemoveFileClose} heading={<L p={p} t={`Remove this file attachment?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this file attachment?`}/>} isConfirmType={true}
                     onClick={handleRemoveFile} />
              }
  						{isShowingModal_resetGroup &&
                  <MessageModal handleClose={() => handleResetGroupClose(true, true)} heading={<L p={p} t={`Reset the group choices?`}/>}
                     explainJSX={<L p={p} t={`By choosing this single recipient, do you want to reset the group choices you have made?`}/>} isConfirmType={true}
                     onClick={handleResetGroup} />
              }
          </div>
      )
}

export default withAlert(AnnouncementEditView)


// <FileUploadModal handleClose={this.handleFileUploadClose}
//     title={<L p={p} t={`Message Attachment`}/>} label={<L p={p} t={`File for`}/>} personId={personId} submitFileUpload={this.handleSubmitFile}
//     sendInBuildUrl={this.fileUploadBuildUrl} handleRecordRecall={this.recallAfterFileUpload} showTitleEntry={true}
//     acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .mp3, .mp4, .m4a"}
//     iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.mp3', '.mp4', '.m4a']}/>
