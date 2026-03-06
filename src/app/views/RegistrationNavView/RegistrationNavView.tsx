import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './RegistrationNavView.css'
const p = 'RegistrationNavView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { Link } from 'react-router-dom'
import MessageModal from '../../components/MessageModal'
import TextDisplay from '../../components/TextDisplay'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import DateMoment from '../../components/DateMoment'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import Loading from '../../components/Loading'
import RadioGroup from '../../components/RadioGroup'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import Required from '../../components/Required'

function RegistrationNavView(props) {
  const [slotInfo, setSlotInfo] = useState({})
  const [chosenEvent, setChosenEvent] = useState({})
  const [isShowingModal_nav, setIsShowingModal_nav] = useState(false)
  const [isShowingModal_removeLearner, setIsShowingModal_removeLearner] = useState(false)
  const [isShowingModal_removeContact, setIsShowingModal_removeContact] = useState(false)
  const [isShowingModal_removeStudent, setIsShowingModal_removeStudent] = useState(false)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [isInit, setIsInit] = useState(undefined)
  const [removeContactPersonId, setRemoveContactPersonId] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [sendToPage, setSendToPage] = useState(undefined)
  const [missingInfo_PersonId, setMissingInfo_PersonId] = useState(undefined)
  const [isShowingModal_finalizeInvalid, setIsShowingModal_finalizeInvalid] = useState(undefined)
  const [finalizeInvalidMessage, setFinalizeInvalidMessage] = useState(undefined)
  const [isShowingModal_incompleteStudent, setIsShowingModal_incompleteStudent] = useState(undefined)
  const [finalizeClicked, setFinalizeClicked] = useState(undefined)
  const [previousStudent_personId, setPreviousStudent_personId] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            const {registration} = props
            
    
            if (!isInit && registration && registration.students && registration.students.length > 0) {
                let hasOneAcademyStudent = false
                registration.students.forEach(s => {
                    if (s.academyOrDistanceEd === 'Academy') hasOneAcademyStudent = true
                })
                setIsInit(true); setHasOneAcademyStudent(hasOneAcademyStudent)
            }
        
  }, [])

  const sendToLearnerUpdate = () => {
    
            
            studentPersonId && navigate('/learnerAdd/' + studentPersonId)
        
  }

  const changeChoice = (event) => {
    
    	      const field = event.target.name
    	      const newState = Object.assign({}, state)
    	      newState[field] = event.target.value
    	      setState(newState)
    	      if (field === 'assessmentId') sendToAssessmentQuestions(event.target.value)
        
  }

  const handleEnterKey = (event) => {
    return event.key === "Enter" && changeChoice(event)
  }

  const handleRemoveLearnerClose = () => {
    return setIsShowingModal_removeLearner(false)
    

  }
  const handleRemoveLearnerOpen = () => {
    return setIsShowingModal_removeLearner(true)
    

  }
  const handleRemoveContactClose = () => {
    return setIsShowingModal_removeContact(false)

  }
  const handleRemoveContactOpen = (removeContactPersonId, removePersonType) => {
    return setIsShowingModal_removeContact(true); setRemoveContactPersonId(removeContactPersonId); setRemovePersonType(removePersonType)

  }
  const handleRemoveContact = () => {
    
    				const {personId, removeGuardianContact, schoolYearId} = props
    				
            removeGuardianContact(personId, removeContactPersonId, removePersonType, schoolYearId)
            handleRemoveContactClose()
        
  }

  const handleRemoveStudentOpen = (studentPersonId) => {
    return setIsShowingModal_removeStudent(true); setStudentPersonId(studentPersonId)

  }
  const handleRemoveStudentClose = () => {
    return setIsShowingModal_removeStudent(false)

  }
  const handleRemoveStudent = () => {
    
    				const {personId, removeRegStudent, schoolYearId} = props
    				
            removeRegStudent(personId, studentPersonId, schoolYearId)
            handleRemoveStudentClose()
        
  }

  const handleRelation = (guardianPersonId, studentPersonId, event) => {
    
    				const {addOrUpdateRelation, personId, schoolYearId, registration} = props
    				addOrUpdateRelation(personId, guardianPersonId, studentPersonId, event.target.value, schoolYearId)
    				//Now update any other relations with student entries which don't have the relation set for this guardian yet.
    				//1. Loop through the registration.Students
    				//		i. If the relation for this guardian does not exist, then add it (to match what was chosen for the current student).
    				registration.students && registration.students.length > 0 && registration.students.filter(m => m.personData.personId !== studentPersonId).forEach(s => {
    						let guardianRelation = s.relations && s.relations.length > 0 && s.relations.filter(r => r.guardianPersonId === s.personData.personId)[0]
    						if (!(guardianRelation && guardianRelation.guardianPersonId)) {
    								addOrUpdateRelation(personId, guardianPersonId, s.personData.personId, event.target.value, schoolYearId)
    						}
    				})
    		
  }

  const handleCustody = (guardianPersonId, studentPersonId, event) => {
    
    				const {addOrUpdateCustody, personId, schoolYearId, registration} = props
    				addOrUpdateCustody(personId, guardianPersonId, studentPersonId, event.target.value, schoolYearId)
    				//Now update any other relations with student entries which don't have the relation set for this guardian yet.
    				//1. Loop through the registration.Students
    				//		i. If the relation for this guardian does not exist, then add it (to match what was chosen for the current student).
    				registration.students && registration.students.length > 0 && registration.students.filter(m => m.personData.personId !== studentPersonId).forEach(s => {
    						let guardianRelation = s.custody && s.custody.length > 0 && s.custody.filter(r => r.guardianPersonId === s.personData.personId)[0]
    						if (!(guardianRelation && guardianRelation.guardianPersonId)) {
    								addOrUpdateCustody(personId, guardianPersonId, s.personData.personId, event.target.value, schoolYearId)
    						}
    				})
    		
  }

  const isNotComplete = (recordType, person) => {
    
    				const {registration, companyConfig} = props
    
    				const missingInfoMessage = []
    				if (recordType === 'GUARDIAN') {
    						let hasEmptyRelationTo = false
    						let hasEmptyCustodyOf = false
    						registration.students && registration.students.length > 0 && registration.students.forEach(s => {
    								let guardianRelation = s.relations && s.relations.length > 0 && s.relations.filter(r => r.guardianPersonId === person.personId)[0]
    								let relationTypeId = guardianRelation && guardianRelation.relationTypeId
    								let guardianCustody = s.custody && s.custody.length > 0 && s.custody.filter(r => r.guardianPersonId === person.personId)[0]
    								let registrationCustodyId = guardianCustody && guardianCustody.registrationCustodyId
    								if (!relationTypeId) hasEmptyRelationTo = true
    								if (!registrationCustodyId) hasEmptyCustodyOf = true
    						})
                let guardianContacts = registration && registration.guardianContacts; //eslint-disable-line
    
    						if (!person.fname) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
    						if (!person.lname) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Last name`}/></div>
    						if (!person.phone) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Phone`}/></div>
    						if (!person.genderId) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Gender`}/></div>
    						//if (!person.maritalStatusId) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Marital status`}/></div>
    						if (!person.username) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username`}/></div>
    						if (!person.address1) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Address`}/></div>
    						if (!person.city) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`City`}/></div>
    						if (!person.postalCode) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Postal code`}/></div>
    						if (hasEmptyRelationTo) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Relation to student`}/></div>
                if (hasEmptyCustodyOf) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Custody of student`}/></div>
                //if (!guardianContacts.disclaimerSignature) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Disclaimer signature`}/></div>
    						//if (guardianContacts.isSchoolEmployee && !guardianContacts.schoolEmployeeName) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`School employee name`}/></div>
    
    				} else if (recordType === 'EMERGENCY') {
    						let hasEmptyRelationTo = false
    						registration.students && registration.students.length > 0 && registration.students.forEach(s => {
    								let guardianRelation = s.relations && s.relations.length > 0 && s.relations.filter(r => r.guardianPersonId === person.personId)[0]
    								let relationTypeId = guardianRelation && guardianRelation.relationTypeId
    								if (!relationTypeId) hasEmptyRelationTo = true
    						})
    
    						if (!person.fname) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
    						if (!person.lname) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Last name`}/></div>
    						if (!person.genderId) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Gender`}/></div>
    						if (!person.phone) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Phone`}/></div>
    						if (hasEmptyRelationTo) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Relation to student`}/></div>
    
    				} else if (recordType === 'STUDENT') {
    						if (!person.personData.fname) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
    						if (!person.personData.lname ) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Last name`}/></div>
    						if (!person.personData.address1 ) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Address`}/></div>
    						if (!person.personData.city ) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`City`}/></div>
    						if (!person.personData.postalCode ) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Postal code`}/></div>
    						if (!person.personData.genderId) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Gender`}/></div>
    
    						if (!person.accreditation.academyOrDistanceEd ) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Academy or distance ed student`}/></div>
    						if (!person.accreditation.gradeLevelId) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Grade level`}/></div>
    						if (companyConfig.urlcode === 'Liahona' && person.accreditation.academyOrDistanceEd === 'DE' && (!person.accreditation.selectedCourses || person.accreditation.selectedCourses.length === 0))
    								missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`DE classes have not been chosen`}/></div>
                // if (!(person.accreditation.attendedPreviously === true || person.accreditation.attendedPreviously === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Attended previously`}/></div>
                // if (!(person.accreditation.appliedPreviously === true || person.accreditation.appliedPreviously === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Applied previously`}/></div>
                // if (person.accreditation.gradeLevelId === 'ca493ac6-46ab-468c-83b4-8f796b76325c' && !person.accreditation.kindergartenFullTimeOrPartTime)
                //     missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Kindergarten: Half-time or Part-time?`}/></div>
                // //if (!person.accreditation.siblingsToAttend) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`How many siblings also applying?'  This is set to zero to start with, which is a valid answer`}/></div>
                // if (!(person.accreditation.currentSiblingAttends === true || person.accreditation.currentSiblingAttends === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Current sibling attending?`}/></div>
    
    						if (!(person.background.bothParentsLiving === true || person.background.bothParentsLiving === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Both parents living`}/></div>
    
    					 	if (person.accreditation.academyOrDistanceEd === 'ACADEMY') {
    
    								if (!(person.medical.noInsurance === true || person.medical.noInsurance === false))  missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Has insurance`}/></div>
    								if (person.medical.noInsurance === false) {
    										if (!person.medical.insuranceCompany) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Insurance company name`}/></div>
    										if (!person.medical.insuranceGroupNumber) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Insurance company group number`}/></div>
    										if (!person.medical.insuranceClientNumber) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Insurance company client number`}/></div>
    								}
    								if (!(person.medical.learningDisability === true || person.medical.learningDisability === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Learning disability`}/></div>
    								if (!(person.medical.obtainEmergencyCare === true || !person.medical.obtainEmergencyCare === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Obtain emergency care`}/></div>
    								if (!(person.medical.prescriptionMedication === true || person.medical.prescriptionMedication	=== false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Prescription medication`}/></div>
    								if (!(person.medical.seizureMentalEmotional === true || person.medical.seizureMentalEmotional === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Seizure mental emotional`}/></div>
    								if (!person.medical.vaccinationBringToOffice && !person.medical.vaccinationFileUpload && !person.medical.vaccinationMailToOffice) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Vaccination form`}/></div>
    								if (person.medical.vaccinationFileUpload && person.medical.vaccinationFileUpload !== 'false'
    										&& !(person.vaccinationFiles && person.vaccinationFiles.length > 0)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Vaccination file upload`}/></div>
    								if (!person.medical.dentistName) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Dentist name`}/></div>
    								if (!person.medical.dentistPhone) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Dentist phone number`}/></div>
    								if (!person.medical.physicianName) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Physician name`}/></div>
    								if (!person.medical.physicianPhone) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Physician phone number`}/></div>
    
    								if (!(person.background.criminalRecord === true || person.background.criminalRecord === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Criminal record`}/></div>
    								if (!(person.background.everExpelled === true || person.background.everExpelled === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Has the student ever been expelled`}/></div>
    								if (!person.background.primaryLanguageId) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary language`}/></div>
    								if (!(person.background.supervisedCourt === true || person.background.supervisedCourt === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Supervised court`}/></div>
                    if (!(person.background.treatmentCenter === true || person.background.treatmentCenter === false)) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Treatment center`}/></div>
    								//if (!person.background.raceId && person.background.raceId !== guidEmpty) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Race`}/></div>
    						}
    				}
            if (missingInfoMessage && missingInfoMessage.length > 0) {
                missingInfoMessage.unshift(<L p={p} t={`The fields that are missing information:`}/>)
            }
    				return missingInfoMessage && missingInfoMessage.length > 0 ? missingInfoMessage : ''
    		
  }

  const handleMissingInfoOpen = (recordType, person, textMessage, sendToPage) => {
    return setSendToPage(sendToPage); setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(textMessage ? textMessage : isNotComplete(recordType, person))

  }
  const handleMissingInfoClose = () => {
    
            setIsShowingModal_missingInfo(false); setMissingInfo_PersonId('')
            navigate(sendToPage)
        
  }

  const handleFinalizeInvalidOpen = (finalizeInvalidMessage) => {
    return setIsShowingModal_finalizeInvalid(true); setFinalizeInvalidMessage(finalizeInvalidMessage)
    
    

  }
  const handleFinalizeInvalidClose = () => {
    return setIsShowingModal_finalizeInvalid(false); setFinalizeInvalidMessage('')
    
    

  }
  const handleFinalizeIncompleteStudentOpen = (finalizeInvalidMessage) => {
    return setIsShowingModal_incompleteStudent(true); setFinalizeInvalidMessage(finalizeInvalidMessage)
    

  }
  const handleFinalizeIncompleteStudentClose = () => {
    return setIsShowingModal_incompleteStudent(false); setFinalizeInvalidMessage('')
    

  }
  const validateForm = () => {
    
    				const {personId, registration, schoolYearId, companyConfig, finalizeNonLiahonaRegistration} = props
    				//1. Validate the form and stop the user from going to billing until the required fields are complete.
    				//		a. Except for any additional students.  Don't stop the user from going on to complete the registration if they have a student in limbo
    				//		    just as long as they have at least one student who is validated that can be registered.
    				//2. Send to the Billing Preferences page.
    				//		a. The billing success will set the FinalizedDate.
    				let allIsValid = true
    				let hasOneStudentComplete = false
    				let hasIncompleteStudent = false
    				let message = []
    
    				if (registration && registration.guardianContacts && registration.guardianContacts.primaryGuardians
    							&& registration.guardianContacts.primaryGuardians.length > 0) {
    						registration.guardianContacts.primaryGuardians.forEach(m => {
    								if (isNotComplete('GUARDIAN', m) && !registration.finalizedDate) {
    										allIsValid = false
    										message[message.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian`}/></div>
    								}
    						})
    				} else {
    						message[message.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian`}/></div>
    				}
    				if (registration && registration.guardianContacts && registration.guardianContacts.emergencyContacts && registration && registration.guardianContacts && registration.guardianContacts.emergencyContacts.length > 0) {
    						registration.guardianContacts.emergencyContacts.forEach(m => {
    								if (isNotComplete('EMERGENCY', m) && !registration.finalizedDate)  {
    										allIsValid = false
    										message[message.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Emergency contact`}/></div>
    								}
    						})
    				} else {
    						message[message.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Emergency contact`}/></div>
    				}
    
    				if (registration && registration.students && registration.students.length > 0) {
    						registration.students.forEach(m => {
    								if (isNotComplete('STUDENT', m) && !registration.finalizedDate) {
    										if (!hasIncompleteStudent) message[message.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Student`}/></div>
    										hasIncompleteStudent = true
    								} else {
    										hasOneStudentComplete = true
    								}
    						})
    				} else {
    						message[message.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Student`}/></div>
    				}
    
    				if (allIsValid && hasOneStudentComplete) {
    						if (hasIncompleteStudent && !registration.finalizedDate) {
    								handleFinalizeIncompleteStudentOpen()
    						} else if (companyConfig.urlcode.indexOf('Liahona') > -1){
    								navigate('/regBillingPreference/' + schoolYearId)
    						} else {
    								finalizeNonLiahonaRegistration(personId)
    								props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your registration has been sent to the administrator.`}/></div>)
                    setFinalizeClicked(true)
    						}
    				} else {
                message && message.unshift(<L p={p} t={`The following records are not complete:`}/>)
    						handleFinalizeInvalidOpen(message)
    				}
    				//setRegistrationFinalizedDate(personId, registration.registrationPersonId, schoolYearId);
    				//
    		
  }

  const handlePreviousStudent = (studentPersonId) => {
    
    				const {addPreviousStudentThisYear, personId, schoolYearId} = props
    				setPreviousStudent_personId(studentPersonId)
    				addPreviousStudentThisYear(personId, studentPersonId, schoolYearId)
    		
  }

  const sendToRegStudent = (studentPersonId) => {
    
    				const {schoolYearId} = props
    				navigate(`/regStudent/${studentPersonId}/schoolYear/${schoolYearId}`)
    		
  }

  const setBillingAmount = () => {
    
            //1. Only do this for DE IF all students are DE.
            //2. Get the billingFreqeuncy (yearly or monthly)
            //3. If Yearly, multiply by 9 (because it's DE)
    				const {registration} = props
    
            //1. Only do this for DE IF all students are DE.
            let isDEonly = true
            registration && registration.students && registration.students.length > 0 && registration.students.forEach(m => {
                if (!(m.accreditation && m.accreditation.academyOrDistanceEd === 'DE')) isDEonly = false
            })
            if (isDEonly) {
                //2. Get the billingFreqeuncy (yearly or monthly)
                //3. If Yearly, multiply by 9 (because it's DE)
        				let monthlyAmount = 0
        				registration && registration.students && registration.students.length > 0 && registration.students.forEach(m => {
        						let eachClassAmount = m.accreditation && m.accreditation.accredited ? 75 : 55
        						monthlyAmount += m.accreditation && m.accreditation.selectedCourses && m.accreditation.selectedCourses.length > 0
        						 		? eachClassAmount * m.accreditation.selectedCourses.length
        						 		: 0
        				})
                return registration && registration.billing && registration.billing.billingFrequency && registration.billing.billingFrequency === 'Yearly'
                    ? (monthlyAmount * 9)
                    : monthlyAmount
            }
    		
  }

  const handleRadioGroup = (hasOneAcademyStudent) => {
    return setHasOneAcademyStudent(hasOneAcademyStudent)
    

  const {personId, removeLearner, companyConfig={}, relationTypes, registrationCustodies, schoolYearId, schoolYears, showSteps, personConfig} = props
  				 let {registration={}} = props
           
  
           let stepCount = 1
  
  				 if (registration && !registration.guardianContacts) {
  					 	registration = {
  								...registration,
  								guardianContacts: {
  										hasPrimaryGuardian: false,
  										primaryGuardians: [],
  										hasSecondaryGuardian: false,
  										secondaryGuardians: [],
  										hasEmergencyContact: false,
  										emergencyContacts: [],
  								}
   					  }
  				 }
  				 let relationTypes_female = []
  				 let relationTypes_male = []
  
  				 if (relationTypes && relationTypes.length > 0) {
  					 	relationTypes_female = relationTypes.filter(m => m.isFemale)
  					 	relationTypes_male = relationTypes.filter(m => m.isMale)
  				 }
  
  				 let totalFees = registration.students && registration.students.length > 0 && registration.students.reduce((acc, m) =>
  							acc += m.accreditation.academyOrDistanceEd === 'ACADEMY' ? 100.00 : 50.00
  					, 0)
  
  					let schoolYear = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === schoolYearId)[0]
  					if (schoolYear && schoolYear.id) schoolYear = schoolYear.label
  
           return (
              <div className={styles.container}>
  								{showSteps &&
  										<div>
  												<div className={globalStyles.pageTitle}>
  						                <L p={p} t={`Registration for ${personConfig.schoolYearRange || ''}`}/>
  						            </div>
  												<div className={classes(styles.littleLeft, globalStyles.instructionsBigger)}>
  														<L p={p} t={`To view missing information, you can click on the bigger, red triangles, if any. The smaller, red triangles indicate a record that needs to be started.`}/>
  												</div>
  										</div>
  								}
  								<ul className={styles.unorderedList}>
  									<li>
  											<Loading isLoading={!registration || !registration.guardianContacts || !registration.guardianContacts.primaryGuardians || registration.guardianContacts.primaryGuardians.length === 0} />
  											<Link to={`/regInstructions`} className={classes(styles.row, styles.link, styles.menuItem)}>
  													<Icon pathName={'document0'} premium={true} className={styles.icon}/>
  													<L p={p} t={`Registration Instructions`}/>
  											</Link>
  											<Link to={`/tutorialVideos/Registration by primary guardian`} className={classes(styles.row, styles.link, styles.menuItem)}>
  													<Icon pathName={'presentation'} premium={true} className={styles.icon}/>
  													<L p={p} t={`Tutorial video`}/>
  											</Link>
  									</li>
  									<li>
  											{registration && registration.finalizedDate &&
  													<TextDisplay label={<L p={p} t={`Finalized Registration`}/>} text={<DateMoment date={registration.finalizedDate} format={'D MMM YYYY h:mm a'} minusHours={6}/>} />
  											}
  									</li>
  									<li>
  											{showSteps && companyConfig.urlcode === 'Liahona' &&
  													<div className={styles.row}>
  															<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  															<div className={styles.stepCount}>{stepCount++}</div>
  													</div>
  											}
                        {companyConfig.urlcode === 'Liahona' &&
                            <div className={classes(styles.moreTop, styles.moreLeft, styles.moreBottom)}>
      													<RadioGroup
      															data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
      															name={`hasOneAcademyStudent`}
      															label={<L p={p} t={`Do you have at least one student who will attend the school in person?`}/>}
      															horizontal={true}
      															className={styles.radio}
      															initialValue={hasOneAcademyStudent || false}
      															onClick={handleRadioGroup}/>
      											</div>
                        }
                        {showSteps &&
  													<div className={styles.row}>
  															<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  															<div className={styles.stepCount}>{stepCount++}</div>
  													</div>
  											}
  											<div className={styles.classification}><L p={p} t={`Guardians`}/></div>
  											<div className={styles.row}>
  													{(!registration || !registration.guardianContacts || !registration.guardianContacts.primaryGuardians || registration.guardianContacts.primaryGuardians.length === 0) &&
  															<Link to={`/regGuardianContact/0/PRIMARYGUARDIAN/${schoolYearId}`} className={classes(styles.row, styles.link)}>
  																	<Icon pathName={'plus'} className={styles.iconRight} fillColor={'green'}/>
  																	<L p={p} t={`Add Primary Guardian`}/>
  															</Link>
  													}
  													{registration && registration.guardianContacts && registration.guardianContacts.primaryGuardians && registration.guardianContacts.primaryGuardians.length > 0 &&
  															<div className={styles.link}><L p={p} t={`Primary Guardian`}/></div>
  													}
  													{(!registration || !registration.guardianContacts || !registration.guardianContacts.primaryGuardians || registration.guardianContacts.primaryGuardians.length === 0) &&
  															<div onClick={() => handleMissingInfoOpen('GUARDIAN', null, <L p={p} t={`Please enter a primary guardian`}/>, `/regGuardianContact/0/PRIMARYGUARDIAN/${schoolYearId}`)}>
  																	<Icon pathName={registration.guardianContacts.hasPrimaryGuardian ? 'checkmark' : 'warning'}
  																			fillColor={registration.guardianContacts.hasPrimaryGuardian ? 'green' : 'red'} className={styles.iconWarning}/>
  															</div>
  													}
  											</div>
  											{registration && registration.guardianContacts && registration.guardianContacts.primaryGuardians && registration.guardianContacts.primaryGuardians.map((m, i) =>
  													<div key={i}>
  															<div className={classes(styles.row, styles.moreLeft)}>
  																	<Link to={`/regGuardianContact/${m.personId}/PRIMARYGUARDIAN/${schoolYearId}`}>
  																			<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  																	</Link>
  																	{/*<a onClick={() => handleRemoveContactOpen(m.personId, 'PRIMARYGUARDIAN')}>
  																			<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  																	</a>*/}
  																	<div className={styles.row}>
  																			<Link to={`/regGuardianContact/${m.personId}/PRIMARYGUARDIAN/${schoolYearId}`} className={styles.link}>
  																					<div className={classes(styles.moreTop, styles.label)}>{m.fname + ' ' + m.lname}</div>
  																			</Link>
  																			<div onClick={!isNotComplete('GUARDIAN', m) ? () => {} : () => handleMissingInfoOpen('GUARDIAN', m, null, `/regGuardianContact/${m.personId}/PRIMARYGUARDIAN/${schoolYearId}`)} className={styles.pointer}>
  																					<Icon pathName={!isNotComplete('GUARDIAN', m) ? 'checkmark' : 'warning'} fillColor={!isNotComplete('GUARDIAN', m) ? 'green' : 'red'} className={styles.mediumRequired}/>
  																			</div>
  																	</div>
  															</div>
  															{registration.students && registration.students.length > 0 && registration.students.map((s, index) => {
  																	let guardianRelation = s.relations && s.relations.length > 0 && s.relations.filter(r => r.guardianPersonId === m.personId)[0]
  																	let relationTypeId = guardianRelation && guardianRelation.relationTypeId
  																	let guardianCustody = s.custody && s.custody.length > 0 && s.custody.filter(r => r.guardianPersonId === m.personId)[0]
  																	let registrationCustodyId = guardianCustody && guardianCustody.registrationCustodyId
  
  																	return (
  																			<div className={classes(styles.row, styles.aLotLeft)} key={index}>
  																					<div>
  																							<SelectSingleDropDown
  																									id={m.personId + s.personData.personId + 'Relation'}
  																									label={<L p={p} t={`Relation to ${s.personData.fname}`}/>}
  																									value={relationTypeId || ''}
  																									options={m.genderId === 1 ? relationTypes_female : m.genderId === 2 ? relationTypes_male : relationTypes}
  																									height={`medium`}
  																									required={true}
  																									whenFilled={relationTypeId}
  																									onChange={(event) => handleRelation(m.personId, s.personData.personId, event)}
  																									onEnterKey={handleEnterKey} />
  																					</div>
  																					<div>
  																							<SelectSingleDropDown
  																									id={m.personId + s.personData.personId + 'Custody'}
  																									label={<L p={p} t={`Custody of ${s.personData.fname}`}/>}
  																									value={registrationCustodyId || ''}
  																									options={registrationCustodies}
  																									height={`medium`}
  																									required={true}
  																									whenFilled={registrationCustodyId}
  																									onChange={(event) => handleCustody(m.personId, s.personData.personId, event)}
  																									onEnterKey={handleEnterKey} />
  																					</div>
  																			</div>
  																	)
  															})}
  													</div>
  											)}
  									</li>
  									<li>
  											<div>
  													<Link to={`/regGuardianContact/0/SECONDARYGUARDIAN/${schoolYearId}`} className={classes(styles.row, styles.link)}>
  															<Icon pathName={'plus'} className={styles.iconRight} fillColor={'green'}/>
  															<L p={p} t={`Add Secondary Guardian (optional)`}/>
  													</Link>
  											</div>
  											{registration.guardianContacts.secondaryGuardians.map((m, i) =>
  													<div key={i}>
  															<div className={classes(styles.row, styles.moreLeft)}>
  																	<Link to={`/regGuardianContact/${m.personId}/SECONDARYGUARDIAN/${schoolYearId}`}>
  																			<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  																	</Link>
  																	<a onClick={() => handleRemoveContactOpen(m.personId, 'SECONDARYGUARDIAN')}>
  																			<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  																	</a>
  																	<div className={styles.row}>
  																			<Link to={`/regGuardianContact/${m.personId}/SECONDARYGUARDIAN/${schoolYearId}`} className={styles.link}>
  																					<div className={classes(styles.moreTop, styles.label)}>{m.fname + ' ' + m.lname}</div>
  																			</Link>
  																			<div onClick={!isNotComplete('GUARDIAN', m) ? () => {} : () => handleMissingInfoOpen('GUARDIAN', m, null, `/regGuardianContact/${m.personId}/SECONDARYGUARDIAN/${schoolYearId}`)} className={styles.pointer}>
  																					<Icon pathName={!isNotComplete('GUARDIAN', m) ? 'checkmark' : ''} fillColor={!isNotComplete('GUARDIAN', m) ? 'green' : ''} className={styles.mediumRequired}/>
  																			</div>
  																	</div>
  															</div>
  															{registration.students && registration.students.length > 0 && registration.students.map((s, index) => {
  																	let guardianRelation = s.relations && s.relations.length > 0 && s.relations.filter(r => r.guardianPersonId === m.personId)[0]
  																	let relationTypeId = guardianRelation && guardianRelation.relationTypeId
  																	let guardianCustody = s.custody && s.custody.length > 0 && s.custody.filter(r => r.guardianPersonId === m.personId)[0]
  																	let registrationCustodyId = guardianCustody && guardianCustody.registrationCustodyId
  
  																	return (
  																			<div className={classes(styles.row, styles.aLotLeft)} key={index}>
  																					<div>
  																							<SelectSingleDropDown
  																									id={m.personId + s.personData.personId}
  																									label={<L p={p} t={`Relation to ${s.personData.fname}`}/>}
  																									value={relationTypeId || ''}
  																									options={m.genderId === 1 ? relationTypes_female : m.genderId === 2 ? relationTypes_male : relationTypes}
  																									height={`medium`}
  																									required={true}
  																									whenFilled={relationTypeId}
  																									onChange={(event) => handleRelation(m.personId, s.personData.personId, event)}
  																									onEnterKey={handleEnterKey} />
  																					</div>
  																					<div>
  																							<SelectSingleDropDown
  																									id={m.personId + s.personData.personId + 'Custody'}
  																									label={<L p={p} t={`Custody of ${s.personData.fname}`}/>}
  																									value={registrationCustodyId || ''}
  																									options={registrationCustodies}
  																									height={`medium`}
  																									required={true}
  																									whenFilled={registrationCustodyId}
  																									onChange={(event) => handleCustody(m.personId, s.personData.personId, event)}
  																									onEnterKey={handleEnterKey} />
  																					</div>
  																			</div>
  																	)
  															})}
  													</div>
  											)}
  									</li>
                    {true && //hasOneAcademyStudent &&
      									<li>
      											{showSteps &&
      													<div className={styles.row}>
      															<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
      															<div className={styles.stepCount}>{stepCount++}</div>
      													</div>
      											}
      											<div className={styles.classification}><L p={p} t={`Emergency Contact`}/></div>
      											<div className={styles.row}>
      													<Link to={`/regGuardianContact/0/EMERGENCYCONTACT/${schoolYearId}`} className={classes(styles.row, styles.link)}>
      															<Icon pathName={'plus'} className={styles.iconRight} fillColor={'green'}/>
      															<L p={p} t={`Add Emergency Contact`}/>
      													</Link>
                                  <Required setIf={true} className={classes(styles.smallRequired, styles.requiredSize)}
                                    setWhen={registration.guardianContacts.hasEmergencyContact}
                                    hideWhenFilled={true}/>
      											</div>
      											{registration.guardianContacts.emergencyContacts.map((m, i) =>
      													<div key={i} >
      															<div className={classes(styles.row, styles.moreLeft)}>
      																	<Link to={`/regGuardianContact/${m.personId}/EMERGENCYCONTACT/${schoolYearId}`}>
      																			<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
      																	</Link>
      																	<a onClick={() => handleRemoveContactOpen(m.personId, 'EMERGENCYCONTACT')}>
      																			<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
      																	</a>
      																	<div className={styles.row}>
      																			<Link to={`/regGuardianContact/${m.personId}/EMERGENCYCONTACT/${schoolYearId}`} className={styles.link}>
      																					<div className={classes(styles.moreTop, styles.label)}>{m.fname + ' ' + m.lname}</div>
      																			</Link>
      																			<div onClick={!isNotComplete('GUARDIAN', m) ? () => {} : () => handleMissingInfoOpen('EMERGENCY', m, null, `/regGuardianContact/${m.personId}/EMERGENCYCONTACT/${schoolYearId}`)} className={styles.pointer}>
      																					<Icon pathName={!isNotComplete('EMERGENCY', m) ? 'checkmark' : 'warning'} fillColor={!isNotComplete('EMERGENCY', m) ? 'green' : 'red'} className={styles.mediumRequired}/>
      																			</div>
      																	</div>
      															</div>
      															{registration.students && registration.students.length > 0 && registration.students.map((s, index) => {
      																	let guardianRelation = s.relations && s.relations.length > 0 && s.relations.filter(r => r.guardianPersonId === m.personId)[0]
      																	let relationTypeId = guardianRelation && guardianRelation.relationTypeId
  
      																	return (
      																			<div className={classes(styles.row, styles.aLotLeft)} key={index}>
      																					<div>
      																							<SelectSingleDropDown
      																									id={m.personId + s.personData.personId}
      																									label={<L p={p} t={`Relation to ${s.personData.fname}`}/>}
      																									value={relationTypeId || ''}
      																									options={m.genderId === 1 ? relationTypes_female : m.genderId === 2 ? relationTypes_male : relationTypes}
      																									height={`medium`}
      																									required={true}
      																									whenFilled={relationTypeId}
      																									onChange={(event) => handleRelation(m.personId, s.personData.personId, event)}
      																									onEnterKey={handleEnterKey} />
      																					</div>
      																			</div>
      																	)
      															})}
      													</div>
      											)}
      									</li>
                    }
  									<li>
  											{showSteps &&
  													<div className={styles.row}>
  															<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  															<div className={styles.stepCount}>{stepCount++}</div>
  													</div>
  											}
  											<div className={styles.classification}>Students</div>
  											{schoolYear && <div className={classes(styles.text, styles.moreLeft)}><L p={p} t={`For registration year: ${schoolYear}`}/></div>}
  											{registration && registration.previousStudents && registration.previousStudents.length > 0 && personConfig.schoolYearId === '60418981-dd92-462b-a791-c8d21c0f810e' &&
  													<div className={styles.moreLeft}>
  															<div className={classes(styles.strong, styles.text)}>Your previous students</div>
  															{registration && registration.previousStudents && registration.previousStudents.length > 0 && registration.previousStudents.map((m, i) =>
  																	<div className={styles.row} key={i}>
  																			<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`add to 2021`}/>} onClick={() => handlePreviousStudent(m.id)}/>
  																			<div className={classes(styles.strong, styles.text, styles.positionText)}>{m.label}</div>
  																	</div>
  															)}
  													</div>
  											}
  											<div className={classes(styles.muchMoreTop, styles.row)}>
  													<div onClick={() => navigate(`/regStudent/0/schoolYear/${schoolYearId}`)} className={classes(styles.row, styles.link)}>
  															<Icon pathName={'plus'} className={styles.iconRight} fillColor={'green'}/>
  															<L p={p} t={`Add new student`}/>
  													</div>
                            <Required setIf={true} className={classes(styles.smallRequired, styles.requiredSize)}
                              setWhen={registration.students && registration.students.length > 0}
                              hideWhenFilled={true}/>
  											</div>
  											{registration.students && registration.students.length > 0 && registration.students.map((m, i) =>
  													<div key={i} className={classes(styles.row, styles.moreLeft)}>
  															<Link to={`/regStudent/${m.personData.personId}/schoolYear/${schoolYearId}`}>
  																	<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  															</Link>
  															<a onClick={() => handleRemoveStudentOpen(m.personData.personId)}>
  																	<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  															</a>
  															<div className={styles.row}>
  																	<a onClick={() => sendToRegStudent(m.personData.personId)} className={styles.link}>
  																			<div className={classes(styles.moreTop, styles.label)}>{m.personData.fname + ' ' + m.personData.lname}</div>
  																	</a>
  																	{(m.accreditation && m.accreditation.regApprovedOrDenied) || (registration && registration.finalizedDate)
  																			? <div className={m.accreditation.regApprovedOrDenied === 'Approved' ? styles.approved : styles.denied}>
  																						{m.accreditation.regApprovedOrDenied || <L p={p} t={`Pending review`}/>}
  																				</div>
  																			: <div onClick={!isNotComplete('STUDENT', m) ? () => {} : () => handleMissingInfoOpen('STUDENT', m, null, `/regStudent/${studentPersonId}/schoolYear/${schoolYearId}`)} className={styles.pointer}>
  																						<Icon pathName={!isNotComplete('STUDENT', m) ? 'checkmark' : 'warning'}
  																								fillColor={!isNotComplete('STUDENT', m) ? 'green' : 'red'} className={styles.mediumRequired}/>
  																				</div>
  																	}
  															</div>
  													</div>
  											)}
  									</li>
  									<li><hr/></li>
  									{companyConfig.urlcode !== 'Liahona' &&
  											<li>
  													<div className={styles.row}>
  															<ButtonWithIcon icon={'checkmark_circle'} label={'Finalize'} onClick={finalizeClicked ? () => {} : validateForm} disabled={finalizeClicked}/>
  															<TextDisplay label={<L p={p} t={`Last Finalize Date`}/>}
  																	text={registration.finalizedDate
  																					? <DateMoment date={registration.finalizedDate} hideIfEmpty={true} minusHours={6}/>
  																					: <div className={styles.notSubmitted}><L p={p} t={`Not yet submitted`}/></div>
  																			 } className={styles.lotTop}/>
  													</div>
  											</li>
  									}
  									{companyConfig.urlcode === 'Liahona' &&
  											<li>
  													{showSteps &&
  															<div className={styles.row}>
  																	<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  																	<div className={styles.stepCount}>{stepCount++}</div>
  															</div>
  													}
  													<div className={styles.classification}>Billing Details</div>
  													<div className={classes(styles.row, styles.muchMoreTop)}>
  															<div onClick={validateForm} className={classes(styles.row, styles.link)}>
  																	<Icon pathName={'plus'} className={styles.iconRight} fillColor={'green'}/>
  																	<L p={p} t={`Enter Billing Information`}/>
  															</div>
                                <Required setIf={true} className={classes(styles.smallRequired, styles.requiredSize)}
                                  setWhen={registration && registration.billing && registration.billing.billingFrequency}
                                  hideWhenFilled={true}/>
  													</div>
  													{registration.students && registration.students.length > 0 &&
  															<div>
  																	<div className={styles.text}>
  																			<L p={p} t={`Registration fees:`}/>
  																	</div>
  																	<table className={styles.moreLeft}>
  																			<tbody>
  																					{registration.students.map((m, i) =>
  																							<tr key={i}>
  																									<td className={styles.text}>{m.personData.fname}</td>
  																									<td className={styles.text}>{m.accreditation.academyOrDistanceEd === 'ACADEMY' ? '$100.00' : '$50.00'}</td>
  																							</tr>
  																					)}
  																					<tr><td>&nbsp;</td></tr>
  																					<tr><td className={styles.text}><L p={p} t={`Total Fees:`}/></td><td className={styles.text}>${totalFees.toFixed(2)}</td></tr>
  																					<tr><td className={styles.redText} colSpan={4}><L p={p} t={`Plus 3% charge for payments by credit card`}/></td></tr>
  																					<tr><td className={styles.redText} colSpan={4}>&nbsp;</td></tr>
  																					{setBillingAmount()
  																							? <tr><td className={classes(styles.strong, styles.text)} colSpan={4}>{registration.billingFrequency} <L p={p} t={`Tuition: `}/>{setBillingAmount() + totalFees}</td></tr>
  																							: ''
  																					}
  																			</tbody>
  
  																	</table>
  															</div>
  													}
  											</li>
  									}
  									<li><hr/></li>
  									<li>
  											{companyConfig.companyDocuments && companyConfig.companyDocuments.length > 0 && companyConfig.companyDocuments.map((f, i) => (
  													<div key={i} className={styles.row}>
  															<div className={styles.linkDisplay}>
  																	<a href={f.websiteLink ? f.websiteLink.indexOf('http') === -1 ? 'http://' + f.websiteLink : f.websiteLink : f.fileUrl}
  																			className={classes(globalStyles.link, styles.moreSpace)} target="_blank">
  																			{f.title}
  																	</a>
  															</div>
  													</div>
  											))}
  									</li>
  							</ul>
                {isShowingModal_removeLearner &&
                    <MessageModal handleClose={handleRemoveLearnerClose} heading={<L p={p} t={`Remove this Students?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to remove this student?`}/>} isConfirmType={true}
                       onClick={() => {removeLearner(personId, studentPersonId); handleRemoveLearnerClose();}} />
                }
  							{isShowingModal_removeContact &&
  	                <MessageModal handleClose={handleRemoveContactClose} heading={removePersonType === 'EMERGENCYCONTACT' ? <L p={p} t={`Remove this emergency contact?`}/> : <L p={p} t={`Remove this guardian?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to remove this record?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveContact} />
  	            }
  							{isShowingModal_removeStudent &&
  	                <MessageModal handleClose={handleRemoveStudentClose} heading={<L p={p} t={`Remove this student?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to remove this student from the registration application?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveStudent} />
  	            }
  
  							{isShowingModal_missingInfo &&
  	                <MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  	                   explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  	            }
  							{isShowingModal_incompleteStudent &&
  	                <MessageModal handleClose={handleFinalizeIncompleteStudentClose} heading={<L p={p} t={`Incomplete Student`}/>}
  	                   explainJSX={<L p={p} t={`There is at least one student that has not been filled in completely.  If you want to submit the applications for the student(s) which are complete, please either complete the incomplete student(s) or delete them for now.  You can return later to add additional students.`}/>}
  										 onClick={handleFinalizeIncompleteStudentClose} />
  	            }
  							{isShowingModal_finalizeInvalid  &&
  	                <MessageModal handleClose={handleFinalizeInvalidClose} heading={<L p={p} t={`Registration Not Complete`}/>}
  	                   explainJSX={finalizeInvalidMessage} onClick={handleFinalizeInvalidClose} />
  	            }
            </div>
          )
}

export default withAlert(RegistrationNavView)
