import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import axios from 'axios'
import styles from './RegStudentView.css'
const p = 'RegStudentView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { navigate, navigateReplace, goBack } from './'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import Checkbox from '../../components/Checkbox'
import RadioGroup from '../../components/RadioGroup'
import DateTimePicker from '../../components/DateTimePicker'
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop'
import Required from '../../components/Required'
import Loading from '../../components/Loading'
import ImageDisplay from '../../components/ImageDisplay'
import Icon from '../../components/Icon'
import RegistrationCourseRequest from '../../components/RegistrationCourseRequest'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import InputTextArea from '../../components/InputTextArea'
import OneFJefFooter from '../../components/OneFJefFooter'
import {guidEmpty} from '../../utils/guidValidate'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import {formatPhoneNumber} from '../../utils/numberFormat'

function RegStudentView(props) {
  const [isRecordComplete, setIsRecordComplete] = useState(undefined)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(undefined)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(undefined)
  const [errors, setErrors] = useState(undefined)
  const [person, setPerson] = useState(undefined)
  const [personId, setPersonId] = useState(undefined)
  const [personType, setPersonType] = useState(undefined)
  const [firstName, setFirstName] = useState(undefined)
  const [middleName, setMiddleName] = useState(undefined)
  const [lastName, setLastName] = useState(undefined)
  const [suffix, setSuffix] = useState(undefined)
  const [preferredName, setPreferredName] = useState(undefined)
  const [birthDate, setBirthDate] = useState(undefined)
  const [emailAddress, setEmailAddress] = useState(undefined)
  const [genderId, setGenderId] = useState(undefined)
  const [phone, setPhone] = useState(undefined)
  const [canPhoneReceiveTexts, setCanPhoneReceiveTexts] = useState(undefined)
  const [bestContactEmail, setBestContactEmail] = useState(undefined)
  const [bestContactPhoneCall, setBestContactPhoneCall] = useState(undefined)
  const [bestContactPhoneText, setBestContactPhoneText] = useState(undefined)
  const [address1, setAddress1] = useState(undefined)
  const [address2, setAddress2] = useState(undefined)
  const [city, setCity] = useState(undefined)
  const [uSStateId, setUSStateId] = useState(undefined)
  const [countryId, setCountryId] = useState(undefined)
  const [postalCode, setPostalCode] = useState(undefined)
  const [peopleApprovedToPickup, setPeopleApprovedToPickup] = useState(undefined)
  const [accreditation, setAccreditation] = useState(undefined)
  const [academyOrDistanceEd, setAcademyOrDistanceEd] = useState(undefined)
  const [accredited, setAccredited] = useState(undefined)
  const [gradeLevelId, setGradeLevelId] = useState(undefined)
  const [schoolYearId, setSchoolYearId] = useState(undefined)
  const [carsonSmith, setCarsonSmith] = useState(undefined)
  const [selectedCourses, setSelectedCourses] = useState(undefined)
  const [ell, setEll] = useState(undefined)
  const [speechTherapy, setSpeechTherapy] = useState(undefined)
  const [attendedPreviously, setAttendedPreviously] = useState(undefined)
  const [appliedPreviously, setAppliedPreviously] = useState(undefined)
  const [kindergartenFullTimeOrPartTime, setKindergartenFullTimeOrPartTime] = useState(undefined)
  const [siblingsToAttend, setSiblingsToAttend] = useState(undefined)
  const [currentSiblingAttends, setCurrentSiblingAttends] = useState(undefined)
  const [medical, setMedical] = useState(undefined)
  const [noInsurance, setNoInsurance] = useState(undefined)
  const [insuranceCompany, setInsuranceCompany] = useState(undefined)
  const [InsuranceGroupNumber, setInsuranceGroupNumber] = useState(undefined)
  const [InsuranceClientNumber, setInsuranceClientNumber] = useState(undefined)
  const [dentistName, setDentistName] = useState(undefined)
  const [dentistPhone, setDentistPhone] = useState(undefined)
  const [physicianName, setPhysicianName] = useState(undefined)
  const [physicianPhone, setPhysicianPhone] = useState(undefined)
  const [seizureMentalEmotional, setSeizureMentalEmotional] = useState(undefined)
  const [seizureMentalEmotionalNote, setSeizureMentalEmotionalNote] = useState(undefined)
  const [prescriptionMedication, setPrescriptionMedication] = useState(undefined)
  const [prescriptionMedicationNote, setPrescriptionMedicationNote] = useState(undefined)
  const [overTheCounterMeds, setOverTheCounterMeds] = useState(undefined)
  const [learningDisability, setLearningDisability] = useState(undefined)
  const [learningDisabilityNote, setLearningDisabilityNote] = useState(undefined)
  const [obtainEmergencyCare, setObtainEmergencyCare] = useState(undefined)
  const [fileSystemName, setFileSystemName] = useState(undefined)
  const [vaccinationFileUpload, setVaccinationFileUpload] = useState(undefined)
  const [vaccinationBringToOffice, setVaccinationBringToOffice] = useState(undefined)
  const [vaccinationMailToOffice, setVaccinationMailToOffice] = useState(undefined)
  const [background, setBackground] = useState(undefined)
  const [primaryLanguageId, setPrimaryLanguageId] = useState(undefined)
  const [bothParentsLiving, setBothParentsLiving] = useState(undefined)
  const [howLearnOfUsId, setHowLearnOfUsId] = useState(undefined)
  const [referredByWhom, setReferredByWhom] = useState(undefined)
  const [everExpelled, setEverExpelled] = useState(undefined)
  const [treatmentCenter, setTreatmentCenter] = useState(undefined)
  const [criminalRecord, setCriminalRecord] = useState(undefined)
  const [supervisedCourt, setSupervisedCourt] = useState(undefined)
  const [everExpelledNote, setEverExpelledNote] = useState(undefined)
  const [treatmentCenterNote, setTreatmentCenterNote] = useState(undefined)
  const [criminalRecordNote, setCriminalRecordNote] = useState(undefined)
  const [supervisedCourtNote, setSupervisedCourtNote] = useState(undefined)
  const [isInit, setIsInit] = useState(undefined)
  const [vaccinationFiles, setVaccinationFiles] = useState(undefined)
  const [birthCertificateFiles, setBirthCertificateFiles] = useState(undefined)
  const [transcriptFiles, setTranscriptFiles] = useState(undefined)
  const [courtFiles, setCourtFiles] = useState(undefined)
  const [SECONDARYGUARDIAN, setSECONDARYGUARDIAN] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [monthlyAmount, setMonthlyAmount] = useState(undefined)
  const [vaccinationForm, setVaccinationForm] = useState(undefined)
  const [errorPhone, setErrorPhone] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [loadingVaccinationFile, setLoadingVaccinationFile] = useState(undefined)
  const [loadingBirthCertificateFile, setLoadingBirthCertificateFile] = useState(undefined)
  const [loadingTranscriptFile, setLoadingTranscriptFile] = useState(undefined)
  const [loadingCourtFile, setLoadingCourtFile] = useState(undefined)
  const [regFileType, setRegFileType] = useState(undefined)
  const [selectedFile_vaccination, setSelectedFile_vaccination] = useState(undefined)
  const [selectedFile_birthCertificate, setSelectedFile_birthCertificate] = useState(undefined)
  const [selectedFile_transcript, setSelectedFile_transcript] = useState(undefined)
  const [selectedFile_court, setSelectedFile_court] = useState(undefined)

  useEffect(() => {
    
    				//document.getElementById('firstName').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    				clearState(props)
            if (!props.studentPersonId || props.studentPersonId === guidEmpty || props.studentPersonId !== '0') {
    			      setPersonIncoming()
            }
        
    return () => {
      
      				let newState = Object.assign({}, state)
      				newState = {}
      				setState(newState)
      		
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    	      if (props.studentPersonId && props.studentPersonId !== guidEmpty && props.studentPersonId !== '0'  //eslint-disable-line
    								&& !isInit && props.personEntry && props.personEntry.personId) { //person.personId !== props.studentPersonId) {
    						setPersonIncoming()
    						//document.getElementById('firstName').focus(); //Don't put the focus on controls since on mobile that will bring up the keyboard and cover most of the page immediately.
    	    	// } if (props.studentPersonId === '0' && person && person.personId !== '0' && person.personid !== guidEmpty) {
    				// 		clearState(props);
    				}
        
  }, [])

  const clearState = (props) => {
    
    				const {personConfig, registration} = props
            let primaryGuardian = registration.guardianContacts.primaryGuardians[0]
    
    				setIsRecordComplete(false); setIsShowingFileUpload(false); setIsShowingModal_removeFileUpload(false); setErrors({}); setPerson({
    								personId: props.params && props.studentPersonId,
    								personType: props.params && props.params.personType, //The options are PRIMARYGUARDIAN, SECONDARYGUARDIAN, EMERGENCYCONTACT
    								firstName: '',
    								middleName: '',
    								lastName: '',
    								suffix: '',
    								preferredName: '',
    								birthDate: '',
    								emailAddress: '',
    								genderId: '',
    								phone: '',
    								canPhoneReceiveTexts: '',
    								bestContactEmail: '',
    								bestContactPhoneCall: '',
    								bestContactPhoneText: '',
    								address1: primaryGuardian.address1,
    								address2: primaryGuardian.address2,
    								city: primaryGuardian.city,
    								uSStateId: primaryGuardian.uSStateId,
    								countryId: primaryGuardian.countryId,
    								postalCode: primaryGuardian.postalCode,
                    peopleApprovedToPickup: '',
    						}); setAccreditation({
    								academyOrDistanceEd: props.companyConfig.hasDistanceLearning ? '' : 'ACADEMY',
    								accredited: '',
    								gradeLevelId: '',
    								schoolYearId: personConfig.schoolYearId,
    								//iep: '',
    								carsonSmith: '',
    								selectedCourses: [],
                    ell: '',
                    //_504: '',
                    speechTherapy: '',
                    attendedPreviously: '',
                    appliedPreviously: '',
                    kindergartenFullTimeOrPartTime: '',
                    siblingsToAttend: 0,
                    currentSiblingAttends: '',
    						}); setMedical({
    								noInsurance: '',
    								insuranceCompany: '',
    								InsuranceGroupNumber: '',
    								InsuranceClientNumber: '',
    								dentistName: '',
    								dentistPhone: '',
    								physicianName: '',
    								physicianPhone: '',
    								seizureMentalEmotional: '',
    								seizureMentalEmotionalNote: '',
    								prescriptionMedication: '',
    								prescriptionMedicationNote: '',
    								overTheCounterMeds: '',
    								learningDisability: '',
    								learningDisabilityNote: '',
    								obtainEmergencyCare: '',
    								fileSystemName: '',
    								vaccinationFileUpload: '',
    								vaccinationBringToOffice: '',
    								vaccinationMailToOffice: '',
    						}); setBackground({
    								primaryLanguageId: 1,
    								bothParentsLiving: '',
    								howLearnOfUsId: '',
    								referredByWhom: '',
    								everExpelled: '',
    								treatmentCenter: '',
    								criminalRecord: '',
    								supervisedCourt: '',
    								everExpelledNote: '',
    								treatmentCenterNote: '',
    								criminalRecordNote: '',
    								supervisedCourtNote: '',
    
    						}); setIsInit(false); setVaccinationFiles([]); setBirthCertificateFiles([]); setTranscriptFiles([]); setCourtFiles([])
    		
  }

  const setPersonIncoming = () => {
    
    				const {companyConfig} = props
    				let person = Object.assign({}, person)
    				let personEntry = props.personEntry ? {...props.personEntry} : {}
    				let accreditation = props.accreditation ? {...props.accreditation} : {}
    				let medical = props.medical ? {...props.medical} : {}
    				let background = props.background ? {...props.background} : {}
    				let vaccinationFiles = props.vaccinationFiles ? [...props.vaccinationFiles] : []
    				let birthCertificateFiles = props.birthCertificateFiles ? [...props.birthCertificateFiles] : []
    				let transcriptFiles = props.transcriptFiles ? [...props.transcriptFiles] : []
    				let courtFiles = props.courtFiles ? [...props.courtFiles] : []
    				let registration = {...props.registration}
            let peopleApprovedToPickup = props.peopleApprovedToPickup
    
    
    				person.personId = props.studentPersonId || personEntry.studentPersonId
    				person.personType = props.personType; //The options are PRIMARYGUARDIAN, SECONDARYGUARDIAN, EMERGENCYCONTAC;
    				person.firstName = personEntry.fname
    				person.middleName = personEntry.mname
    				person.suffix = personEntry.suffix
    				person.preferredName = personEntry.preferredName
    				person.birthDate = personEntry.birthDate && personEntry.birthDate.indexOf('T') > -1 ? personEntry.birthDate.substring(0, personEntry.birthDate.indexOf('T')) : personEntry.birthDate
    				person.emailAddress = personEntry.emailAddress
    				person.username = personEntry.username
    				person.genderId = personEntry.genderId
    				person.phone = personEntry.phone
    				person.lastName = personEntry.lname
    				person.address1 = personEntry.address1
    				person.address2 = personEntry.address2
    				person.city = personEntry.city
    				person.uSStateId = personEntry.usstateId || 272
    				person.countryId = personEntry.countryId || 251
    				person.postalCode = personEntry.postalCode
    				background.primaryLanguageId = background.primaryLanguageId ? background.primaryLanguageId : 1
    				person.canPhoneReceiveTexts = personEntry.canPhoneReceiveTexts
    				person.bestContactEmail = personEntry.bestContactEmail
    				person.bestContactPhoneCall = personEntry.bestContactPhoneCall
    				person.bestContactPhoneText = personEntry.bestContactPhoneText
    
    				if (registration.students && registration.students.length > 0 && !person.firstName) {
    						let prevStudent = registration.students[0]
    						person.lastName = prevStudent.personData.lname
    						person.address1 = prevStudent.personData.address1
    						person.address2 = prevStudent.personData.address2
    						person.city = prevStudent.personData.city
    						person.uSStateId = prevStudent.personData.usstateId
    						person.countryId = prevStudent.personData.countryId
                person.postalCode = prevStudent.personData.postalCode
    						person.peopleApprovedToPickup = prevStudent.personData.peopleApprovedToPickup
    
    						medical.noInsurance = prevStudent.medical.noInsurance
    						medical.insuranceCompany = prevStudent.medical.insuranceCompany
    						medical.insuranceGroupNumber = prevStudent.medical.insuranceGroupNumber
    						medical.insuranceClientNumber = prevStudent.medical.insuranceClientNumber
    						medical.dentistName = prevStudent.medical.dentistName
    						medical.dentistPhone = prevStudent.medical.dentistPhone
    						medical.physicianName = prevStudent.medical.physicianName
    						medical.physicianPhone= prevStudent.medical.physicianPhone
    
    						accreditation.academyOrDistanceEd = !companyConfig.hasDistanceLearning ? 'ACADEMY' : prevStudent.accreditation.academyOrDistanceEd
                accreditation.siblingsToAttend = prevStudent.accreditation.siblingsToAttend || 0
                accreditation.currentSiblingAttends = prevStudent.accreditation.currentSiblingAttends
    
    						background.primaryLanguageId = prevStudent.background.primaryLanguageId
    						background.howLearnOfUsId = prevStudent.background.howLearnOfUsId
    						background.bothParentsLiving = prevStudent.background.bothParentsLiving
    						background.everExpelled = prevStudent.background.everExpelled
    						background.treatmentCenter = prevStudent.background.treatmentCenter
    						background.criminalRecord = prevStudent.background.criminalRecord
                background.supervisedCourt = prevStudent.background.supervisedCourt
                background.fosterChild = prevStudent.background.fosterChild
                background.homelessRunawayMigrant = prevStudent.background.homelessRunawayMigrant
                background.hispanicOrLatino = prevStudent.background.hispanicOrLatino
                background.raceId = prevStudent.background.raceId
    						background.races = prevStudent.background.races
    
    				} else if (registration.guardianContacts && registration.guardianContacts.primaryGuardians && registration.guardianContacts.primaryGuardians.length > 0
    								&& !person.address1) {
    						let primaryGuardian = registration.guardianContacts.primaryGuardians[0]
    						person.lastName = person.lastName ? person.lastName : primaryGuardian.lname
    						if (!person.address1) {
    								person.address1 = primaryGuardian.address1
    								person.address2 = primaryGuardian.address2
    								person.city = primaryGuardian.city
    								person.uSStateId = primaryGuardian.usstateId
    								person.countryId = primaryGuardian.countryId
    								person.postalCode = primaryGuardian.postalCode
    						}
    						background.primaryLanguageId = background.primaryLanguageId ? background.primaryLanguageId : 1
    				}
    				accreditation.academyOrDistanceEd = !companyConfig.hasDistanceLearning ? 'ACADEMY' : accreditation.academyOrDistanceEd
    				setPerson(person); setPeopleApprovedToPickup(peopleApprovedToPickup); setAccreditation(accreditation); setMedical(medical); setBackground(background); setVaccinationFiles(vaccinationFiles); setBirthCertificateFiles(birthCertificateFiles); setTranscriptFiles(transcriptFiles); setCourtFiles(courtFiles); setIsInit(true)
    		
  }

  const changePerson = ({target}) => {
    
    	      setPerson({...person, [target.name]: target.value})
        
  }

  const changePeopleApprovedToPickup = ({target}) => {
    
    	      setPeopleApprovedToPickup(target.value)
        
  }

  const handleMedicalChange = ({target}) => {
    
    	      setMedical({...medical, [target.name]: target.value})
        
  }

  const handleBackgroundChange = ({target}) => {
    
    	      setBackground({...background, [target.name]: target.value})
        
  }

  const changeBirthDate = (field, {target}) => {
    
    			setPerson({...person, [field]: target.value})
        
  }

  const changeAccreditation = ({target}) => {
    
    				if (target.name === 'gradeLevelId') clearSelectedCourses()
    				let monthlyAmount = target.name === 'gradeLevelId' ? 0 : monthlyAmount
    	      setAccreditation({...accreditation, [target.name]: target.value}); setMonthlyAmount(monthlyAmount)
        
  }

  const changeMedical = ({target}) => {
    
    				let field = target.name
    				let value = target.value
    				if ((field === 'dentistPhone' || field === 'physicianPhone') && formatPhoneNumber(value)) {
    					value = formatPhoneNumber(value)
    				}
    	      setMedical({...medical, [field]: value})
        
  }

  const changeBackground = ({target}) => {
    
    	      setBackground({...background, [target.name]: target.value})
        
  }

  const handleEnterKey = (event) => {
    
            //event.key === "Enter" && processForm("STAY", false);
        
  }

  const validateEmail = (email) => {
    
    		    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    		    return re.test(email)
    	  
  }

  const processForm = (stayOrFinish, showErrors=true) => {
     //, event
          const {addOrUpdateStudent, personId, companyConfig, schoolYearId } = props
          let  person = Object.assign({}, person)
    			let accreditation = Object.assign({}, accreditation)
    			let medical = Object.assign({}, medical)
    			let background = Object.assign({}, background)
          // prevent default action. in this case, action is the form submission event
          //event && event.preventDefault();
          let hasMinimalErrors = false
    			let isIncomplete = false
          let errors = {}
    
          if (!person.firstName) {
              hasMinimalErrors = true
    					isIncomplete = true
              errors.firstName = <L p={p} t={`First name is required`}/>
          }
    			if (!person.lastName) {
              hasMinimalErrors = true
    					isIncomplete = true
              errors.firstName = <L p={p} t={`Last name is required`}/>
          }
    
    			if (!validateEmail(person.emailAddress)) {
    	        errors.emailAddress = <L p={p} t={`Email address appears to be invalid.`}/>
    					isIncomplete = true
    	    }
    
    			if (!person.birthDate) {
              errors.birthDate = <L p={p} t={`Please enter a birth date`}/>
    					isIncomplete = true
          }
    			if (person.phone && ('' + person.phone).replace(/\D/g, '').length !== 10) {
    					errors.phone = <L p={p} t={`The phone number entered is not 10 digits`}/>
    					isIncomplete = true
    			}
    			if (!person.genderId) {
              errors.gender = <L p={p} t={`Please enter a gender`}/>
    					isIncomplete = true
          }
    
    			// if (!person.bestContactEmail && !person.bestContactPhoneCall && !person.bestContactPhoneText) {
          //     errors.bestContact = <L p={p} t={`Please choose a best way to contact this person`}/>;
    			// 		isIncomplete Please choose a best way to contact this person;
          // }
    			if (!person.countryId) {
              errors.country = <L p={p} t={`Please choose a country`}/>
    					isIncomplete = true
          }
    			if (!person.address1 && !person.address2) {
              errors.streetAddress = <L p={p} t={`Please enter a street address`}/>
    					isIncomplete = true
          }
    			if (!person.city) {
              errors.city = <L p={p} t={`Please enter a city`}/>
    					isIncomplete = true
          }
    			if (!person.postalCode) {
              errors.postalCode = <L p={p} t={`Please enter a postal code`}/>
    					isIncomplete = true
          }
    
    			//Accreditation ****************
    			if (!accreditation.academyOrDistanceEd && companyConfig.hasDistanceLearning) {
              errors.academyOrDistanceEd = <L p={p} t={`Please choose 'Academy' or 'Distance Education'`}/>
    					isIncomplete = true
          }
    			if (!accreditation.accredited && accreditation.accredited !== false && companyConfig.hasAccredited) {
              errors.accredited = <L p={p} t={`Please choose between accredited or not`}/>
    					isIncomplete = true
          }
    			if (!accreditation.gradeLevelId) {
              errors.gradeLevel = <L p={p} t={`Please choose a grade level`}/>
    					isIncomplete = true
          }
    			if (accreditation.academyOrDistanceEd === 'DE' && !(accreditation.selectedCourses && accreditation.selectedCourses.length === 0)) {
              errors.selectCourses = <L p={p} t={`Please choose one or more classes`}/>
    					isIncomplete = true
          }
          // if (!accreditation.attendedPreviously) {
          //     errors.attendedPreviously = <L p={p} t={`Answer is required`}/>;
    			// 		isIncomplete = true;
          // }
          // if (!accreditation.appliedPreviously) {
          //     errors.appliedPreviously = <L p={p} t={`Answer is required`}/>;
          //     isIncomplete = true;
          // }
          // if (accreditation.gradeLevelId === 'ca493ac6-46ab-468c-83b4-8f796b76325c' && !accreditation.kindergartenFullTimeOrPartTime) {
          //     errors.kindergartenFullTimeOrPartTime = <L p={p} t={`Answer is required`}/>;
          //     isIncomplete = true;
          // }
          // if (!accreditation.currentSiblingAttends) {
          //     errors.currentSiblingAttends = <L p={p} t={`Answer is required`}/>;
          //     isIncomplete = true;
          // }
    
    			//Medical *******************
    			if (medical.noInsurance !== false && medical.noInsurance !== true) {
    				errors.noInsurance = <L p={p} t={`Please indicate if you have insurance or not`}/>
    				isIncomplete = true
    			}
    			if (!medical.noInsurance && !medical.insuranceCarrier) {
    				errors.insuranceCarrier = <L p={p} t={`Please enter an insurance carrier`}/>
    				isIncomplete = true
    			}
    			if (!medical.noInsurance && !medical.insuranceGroupNumber) {
    				errors.insuranceGroupNumber = <L p={p} t={`Please enter insurance group number`}/>
    				isIncomplete = true
    			}
    			if (!medical.noInsurance && !medical.insuranceClientNumber) {
    				errors.insuranceClientNumber = <L p={p} t={`Please enter insurance client number`}/>
    				isIncomplete = true
    			}
    			if (!medical.dentistName) {
    				errors.dentistName = <L p={p} t={`Please enter dentist's name`}/>
    				isIncomplete = true
    			}
    			if (!medical.dentistPhone) {
    				errors.dentistPhone = <L p={p} t={`Please enter dentist's phone number`}/>
    				isIncomplete = true
    			}
    			if (!medical.physicianName) {
    				errors.physicianName = <L p={p} t={`Please enter physician's name`}/>
    				isIncomplete = true
    			}
    			if (!medical.physicianPhone) {
    				errors.physicianPhone = <L p={p} t={`Please enter physician's phone`}/>
    				isIncomplete = true
    			}
    			if (medical.seizureMentalEmotional !== false && medical.seizureMentalEmotional !== true) {
    				errors.seizureMentalEmotional = <L p={p} t={`Please answer the question above`}/>
    				isIncomplete = true
    			}
    			if (medical.seizureMentalEmotional && !medical.seizureMentalEmotionalNote) {
    				errors.seizureMentalEmotionalNote = <L p={p} t={`Please enter a note`}/>
    				isIncomplete = true
    			}
    			if (medical.prescriptionMedication !== false && medical.prescriptionMedication !== true) {
    				errors.prescriptionMedication = <L p={p} t={`Please answer the question above`}/>
    				isIncomplete = true
    			}
    			if (medical.overTheCounterMeds !== false && medical.overTheCounterMeds !== true) {
    				errors.overTheCounterMeds = <L p={p} t={`Please answer the question above`}/>
    				isIncomplete = true
    			}
    			if (medical.learningDisability !== false && medical.learningDisability !== true) {
    				errors.learningDisability = <L p={p} t={`Please ansewr the question above`}/>
    				isIncomplete = true
    			}
    			if (medical.learningDisability && !medical.learningDisabilityNote) {
    				errors.learningDisabilityNote = <L p={p} t={`Please enter a note`}/>
    				isIncomplete = true
    			}
    			if (medical.obtainEmergencyCare !== false && medical.obtainEmergencyCare !== true) {
    				errors.obtainEmergencyCare = <L p={p} t={`Allowing the school to obtain emergency care is required`}/>
    				isIncomplete = true
    			}
    			if (!background.primaryLanguageId) {
    				errors.primaryLanguageId = <L p={p} t={`Please choose the primary language`}/>
    				isIncomplete = true
    			}
    			if (!background.bothParentsLiving && background.bothParentsLiving !== false) {
    				errors.bothParentsLiving = <L p={p} t={`Answering this question is required`}/>
    				isIncomplete = true
    			}
    			if (!background.everExpelled && background.everExpelled !== false) {
    				errors.everExpelled = <L p={p} t={`Answering this question is required`}/>
    				isIncomplete = true
    			}
    			if (!background.treatmentCenter && background.treatmentCenter !== false) {
    				errors.treatmentCenter = <L p={p} t={`Answering this question is required`}/>
    				isIncomplete = true
    			}
    			if (!background.criminalRecord && background.criminalRecord !== false) {
    				errors.criminalRecord = <L p={p} t={`Answering this question is required`}/>
    				isIncomplete = true
    			}
    			if (!background.supervisedCourt && background.supervisedCourt !== false) {
    				errors.supervisedCourt = <L p={p} t={`Answering this question is required`}/>
    				isIncomplete = true
    			}
    
          if (!hasMinimalErrors) {
    					accreditation.isIncomplete = isIncomplete
              addOrUpdateStudent(personId, person, peopleApprovedToPickup, accreditation, medical, background, stayOrFinish, schoolYearId)
    					props.alert.info(<div className={styles.alertText}><L p={p} t={`The student record has been saved.`}/></div>)
              handleMissingInfoOpen(<L p={p} t={`You can save an unfinished record, but notice the missing information messages in red which will eventually need to be filled in.`}/>)
    					navigate(`/firstNav`)
          } else {
    					handleMissingInfoOpen(<L p={p} t={`You can save an unfinished record but you must at least enter the first and last name.  Also, notice the other missing information messages in red which will eventually need to be filled in.`}/>)
    			}
        
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    		handleMissingInfoClose = () => setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    		toggleCheckbox = (field) => {
            let person = Object.assign({}, person)
  }

  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    		toggleCheckbox = (field) => {
            let person = Object.assign({}, person)
  }

  const toggleCheckbox = (field) => {
    
            let person = Object.assign({}, person)
    				person[field] = !person[field]
            setPerson(person)
        
  }

  const toggleCheckboxBackGround = (field) => {
    
            let background = {...background}
            background[field] = !background[field]
            setBackground(background)
        
  }

  const handleAccreditedRadio = (field, accredited) => {
    
    				
    				let eachClassAmount = accredited ? 75 : 55
    				let monthlyAmount = accreditation.selectedCourses && accreditation.selectedCourses.length > 0
    						? eachClassAmount * accreditation.selectedCourses.length
    						: 0
    
    				setMonthlyAmount(monthlyAmount); setAccreditation({...accreditation, [field]: accredited})
    		
  }

  const handleMedicalRadio = (field, value) => {
    
    				setMedical({...medical, [field]: value})
    		
  }

  const handleBackgroundRadio = (field, value) => {
    
    				let background = {...background}
    				background[field] = value
    				setBackground(background)
    		
  }

  const handleVaccinationFormRadio = (field, value) => {
    
    				const medical = Object.assign({}, medical)
    				if (value === 'ATTACH') {
    						handleFileUploadOpen('Vaccination'); //If this is a new student, this personId will not exist yet.
    						medical.vaccinationFileUpload = true
    						medical.vaccinationBringToOffice = false
    						medical.vaccinationMailToOffice = false
    				} else if (value === 'BRINGTOOFFICE') {
    						medical.vaccinationFileUpload = false
    						medical.vaccinationBringToOffice = true
    						medical.vaccinationMailToOffice = false
    				} else if (value === 'MAILTOOFFICE') {
    						medical.vaccinationFileUpload = false
    						medical.vaccinationBringToOffice = false
    						medical.vaccinationMailToOffice = true
    				}
    				setMedical(medical); setVaccinationForm(value)
    		
  }

  const recallAfterFileUpload = () => {
    
    
    	  
  }

  const handleRemoveFileUploadOpen = (fileUpload) => {
    return setIsShowingModal_removeFileUpload(true); setFileUpload(fileUpload)
    		handleRemoveFileUploadClose = () => setIsShowingModal_removeFileUpload(false)
    		handleRemoveFileUpload = () => {
    				const {removeRegStudentFileUpload, personId} = props
  }

  const handleRemoveFileUploadClose = () => {
    return setIsShowingModal_removeFileUpload(false)
    		handleRemoveFileUpload = () => {
    				const {removeRegStudentFileUpload, personId} = props
  }

  const handleRemoveFileUpload = () => {
    
    				const {removeRegStudentFileUpload, personId} = props
    				
    				handleRemoveFileUploadClose()
    				removeRegStudentFileUpload(personId, fileUpload.fileRegistrationStudentId)
    				if (fileUpload.regFileType === 'Vaccination') {
    						let vaccinationFiles = Object.assign([], vaccinationFiles)
    						vaccinationFiles = vaccinationFiles.filter(m => m.fileRegistrationStudentId !== fileUpload.fileRegistrationStudentId)
    						setVaccinationFiles(vaccinationFiles)
    				} else if (fileUpload.regFileType === 'BirthCertificate') {
    						let birthCertificateFiles = Object.assign([], birthCertificateFiles)
    						birthCertificateFiles = birthCertificateFiles.filter(m => m.fileRegistrationStudentId !== fileUpload.fileRegistrationStudentId)
    						setBirthCertificateFiles(birthCertificateFiles)
    				} else if (fileUpload.regFileType === 'Transcript') {
    						let transcriptFiles = Object.assign([], transcriptFiles)
    						transcriptFiles = transcriptFiles.filter(m => m.fileRegistrationStudentId !== fileUpload.fileRegistrationStudentId)
    						setTranscriptFiles(transcriptFiles)
    				} else if (fileUpload.regFileType === 'Court') {
    						let courtFiles = Object.assign([], courtFiles)
    						courtFiles = courtFiles.filter(m => m.fileRegistrationStudentId !== fileUpload.fileRegistrationStudentId)
    						setCourtFiles(courtFiles)
    				}
    		
  }

  const handleSelectCourse = (learningPathwayName, registrationCourseId, isToggleDelete) => {
     //, accredited
    				let accreditation = Object.assign({}, accreditation)
    				let selectedCourses = accreditation.selectedCourses
    				if (isToggleDelete) {
    						selectedCourses = selectedCourses && selectedCourses.length > 0 && selectedCourses.filter(m => m.registrationCourseId !== registrationCourseId)
    				} else {
    						let newCourseRequest = [{
    								learningPathwayName,
    								registrationCourseId,
    								//accredited
    						}]
    						selectedCourses = selectedCourses && selectedCourses.length > 0 ? selectedCourses.concat(newCourseRequest) : newCourseRequest
    				}
    				accreditation.selectedCourses = selectedCourses
    				let eachClassAmount = accreditation.accredited ? 75 : 55
    				let monthlyAmount = accreditation.selectedCourses && accreditation.selectedCourses.length > 0
    						? eachClassAmount * accreditation.selectedCourses.length
    						: 0
    
    				setAccreditation(accreditation); setMonthlyAmount(monthlyAmount)
    		
  }

  const clearSelectedCourses = () => {
    
    				let accreditation = Object.assign({}, accreditation)
    				if (accreditation && accreditation.selectedCourses) accreditation.selectedCourses.length = 0
    				setAccreditation(accreditation); setMonthlyAmount(0)
    		
  }

  const handleFormatPhone = () => {
    
    				
    				if (person.phone && ('' + person.phone).replace(/\D/g, '').length !== 10) {
    						setErrorPhone(<L p={p} t={`The phone number entered is not 10 digits`}/>)
    				} else if (formatPhoneNumber(person.phone)) {
    						setErrorPhone(''); setPerson({...person, phone: formatPhoneNumber(person.phone)})
    				}
    		
  }

  const handleFileUploadOpen = (regFileType) => {
    
    				setIsShowingFileUpload(true); setRegFileType(regFileType); setLoadingVaccinationFile(regFileType === 'Vaccination'); setLoadingBirthCertificateFile(regFileType === 'BirthCertificate'); setLoadingTranscriptFile(regFileType === 'Transcript'); setLoadingCourtFile(regFileType === 'Court')
    		
  }

  const handleFileUploadClose = () => {
    return setIsShowingFileUpload(false); setRegFileType('')
    		handleFileUploadSubmit = () => {
    				const {personId} = props
  }

  const handleFileUploadSubmit = () => {
    
    				const {personId} = props
    				
    				let data = new FormData()
    				data.append('file', regFileType === 'Vaccination'
    						? selectedFile_vaccination
    						: regFileType === 'Transcript'
    								? selectedFile_transcript
    								: regFileType === 'BirthCertificate'
    										? selectedFile_birthCertificate
    										: regFileType === 'Court'
    												? selectedFile_court
    												: ''
    				)
    
    				let studentPersonId = person.personId && person.personId !== '0' ? person.personId : guidEmpty
    
    				let url = `${apiHost}ebi/regStudent/fileUpload/${personId}/${studentPersonId}/${regFileType}`
    
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
    								let newPerson = Object.assign({}, person)
    								if (!newPerson) newPerson = {}
    								if (!newPerson.personId || newPerson.personId === '0') {
    										newPerson.personId = response.data.studentPersonId
    								}
    								setPerson(newPerson); setVaccinationFiles(response.data.vaccinationFiles); setBirthCertificateFiles(response.data.birthCertificateFiles); setTranscriptFiles(response.data.transcriptFiles); setCourtFiles(response.data.Files); setLoadingVaccinationFile(false); setLoadingBirthCertificateFile(false); setLoadingTranscriptFile(false); setLoadingCourtFile(false)
    		        })
    						.catch(function (error) {
    							//Show error here.
    						})
    				handleFileUploadClose()
    		
  }

  const handleInputFile = (file) => {
    
    				
    				if (regFileType === "Vaccination") {
    						setSelectedFile_vaccination(file)
    				} else if (regFileType === "BirthCertificate") {
    						setSelectedFile_birthCertificate(file)
    				} else if (regFileType === "Transcript") {
    						setSelectedFile_transcript(file)
    				} else if (regFileType === "Court") {
    						setSelectedFile_court(file)
    				}
    		
  }

  const {personId, genders, schoolYearId, countries, usStates, gradeLevels, languages, howLearnOfUsList, registrationCourses, intervals, companyConfig={}} = props; //, races
        const {person={}, peopleApprovedToPickup, accreditation={}, medical={}, background={}, isShowingFileUpload, isShowingModal_removeFileUpload, monthlyAmount, isShowingModal_missingInfo,
                messageInfoIncomplete, selectedFile_vaccination, vaccinationFiles, birthCertificateFiles, transcriptFiles, courtFiles,  loadingVaccinationFile,
  							loadingTranscriptFile, regFileType, selectedFile_transcript, selectedFile_birthCertificate, selectedFile_court, loadingBirthCertificateFile,
  							loadingCourtFile, errors={}} = state
  
  			let regCourses = registrationCourses && registrationCourses.length > 0 && registrationCourses.filter(m => m.schoolYearId === schoolYearId)
  
  			let vaccinationForm = ''
  			if (medical.vaccinationFileUpload && medical.vaccinationFileUpload !== 'false') {
  					vaccinationForm = 'ATTACH'
  			} else if (medical.vaccinationBringToOffice && medical.vaccinationBringToOffice !== 'false') {
  					vaccinationForm = 'BRINGTOOFFICE'
  			} else if (medical.vaccinationMailToOffice && medical.vaccinationMailToOffice !== 'false') {
  					vaccinationForm = 'MAILTOOFFICE'
  			}
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    {'Student Entry'}
                  </div>
  								<div className={styles.buttonRow}>
  										<ButtonWithIcon label={'Save'} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  								</div>
                  {companyConfig.hasDistanceLearning &&
                      <RadioGroup
                          data={[{ label: <L p={p} t={`Distance Education`}/>, id: "DE" }, { label: <L p={p} t={`Academy`}/>, id: "ACADEMY" }, ]}
                          name={`academyOrDistanceEd`}
                          label={<L p={p} t={`Student Type`}/>}
                          horizontal={true}
                          className={styles.radio}
                          initialValue={accreditation.academyOrDistanceEd}
                          required={true}
                          whenFilled={accreditation.academyOrDistanceEd}
                          onClick={(value) => {handleAccreditedRadio('academyOrDistanceEd', value)}}
                          error={errors.academyOrDistanceEd}/>
                  }
                  <div className={styles.formLeft}>
                      <InputText
                          id={`firstName`}
                          name={`firstName`}
                          size={"medium"}
                          label={<L p={p} t={`First name`}/>}
                          value={person.firstName || ''}
  												autoComplete={'dontdoit'}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={person.firstName}
                          error={errors.firstName} />
  										<InputText
                          id={`middleName`}
                          name={`middleName`}
                          size={"medium"}
                          label={<L p={p} t={`Middle name`}/>}
  												autoComplete={'dontdoit'}
                          value={person.middleName || ''}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey} />
  										<InputText
                          id={`lastName`}
                          name={`lastName`}
                          size={"medium"}
                          label={<L p={p} t={`Last name`}/>}
                          value={person.lastName || ''}
                          onChange={changePerson}
  												autoComplete={'dontdoit'}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={person.lastName}
                          error={errors.lastName} />
  										<InputText
  												id={`suffix`}
  												name={`suffix`}
  												size={"medium"}
  												label={<L p={p} t={`Suffix`}/>}
  												autoComplete={'dontdoit'}
  												value={person.suffix || ''}
  												onChange={changePerson}
  												onEnterKey={handleEnterKey}/>
  
  										<div className={classes(styles.birthDate, styles.row)}>
                          <DateTimePicker id={`birthDate`} label={<L p={p} t={`Date of birth`}/>} value={person.birthDate}
  														onChange={(event) => changeBirthDate('birthDate', event)}
  														required={true} whenFilled={person.birthDate} error={errors.birthDate}/>
  												<div>
                              {accreditation.academyOrDistanceEd === 'ACADEMY' &&
      														<div className={classes(styles.row, styles.muchTop, styles.moreLeft)} onClick={() => handleFileUploadOpen('BirthCertificate')}>
      																<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
      																<div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload birth certificate (for Academy only)`}/></div>
      														</div>
                              }
  														<Loading isLoading={loadingBirthCertificateFile} />
  														{birthCertificateFiles && birthCertificateFiles.length > 0 && birthCertificateFiles.map((f, i) =>
  																<div key={i}>
  																		<ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId}
  																				deleteFunction={() => handleRemoveFileUploadOpen(f)} deleteId={person.personId}/>
  																</div>
  														)}
  												</div>
  
  										</div>
  										<InputText
  												id={`preferredName`}
  												name={`preferredName`}
  												size={"medium"}
  												label={<L p={p} t={`Preferred Name`}/>}
  												value={person.preferredName || ''}
  												autoComplete={'dontdoit'}
  												onChange={changePerson}
  												onEnterKey={handleEnterKey}/>
  										<InputText
                          id={`emailAddress`}
                          name={`emailAddress`}
                          size={"medium"}
                          label={<L p={p} t={`Email address`}/>}
  												autoComplete={'dontdoit'}
                          value={person.emailAddress || ''}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey}
                          error={errors.emailAddress} />
  										{person.username &&
  												<div className={styles.textDisplay}>
  														<TextDisplay label={'eCademyApp username'} text={person.username}/>
  												</div>
  										}
  										<SelectSingleDropDown
                          id={`genderId`}
                          name={`genderId`}
                          label={<L p={p} t={`Gender`}/>}
                          value={person.genderId || ''}
                          options={genders}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={person.genderId}
                          error={errors.gender} />
  										<div className={styles.row}>
  												<InputText
  		                        id={`phone`}
  		                        name={`phone`}
  		                        size={"medium"}
  		                        label={<L p={p} t={`Phone`}/>}
  														autoComplete={'dontdoit'}
  		                        value={person.phone || ''}
  		                        onChange={changePerson}
  														onBlur={handleFormatPhone}
  		                        onEnterKey={handleEnterKey}
  														error={errors.phone}/>
  												<div className={styles.phoneText}>
  														<Checkbox
  				                        id={'canPhoneReceiveTexts'}
  				                        label={<L p={p} t={`Phone can receive texts`}/>}
  				                        checked={person.canPhoneReceiveTexts || ''}
  				                        onClick={() => toggleCheckbox('canPhoneReceiveTexts')}
  				                        labelClass={styles.label}/>
  												</div>
  										</div>
  										<div className={styles.inputText}>Best way to contact</div>
  										<div className={styles.row}>
  												<Checkbox
  														id={'bestContactEmail'}
  														label={<L p={p} t={`Email`}/>}
  														checked={person.bestContactEmail || ''}
  														onClick={() => toggleCheckbox('bestContactEmail')}
  														labelClass={styles.labelCheckbox}/>
  												<Checkbox
  														id={'bestContactPhoneCall'}
  														label={<L p={p} t={`Phone call`}/>}
  														checked={person.bestContactPhoneCall || ''}
  														onClick={() => toggleCheckbox('bestContactPhoneCall')}
  														labelClass={styles.labelCheckbox}/>
  												<Checkbox
  														id={'bestContactPhoneText'}
  														label={<L p={p} t={`Text message`}/>}
  														checked={person.bestContactPhoneText || ''}
  														onClick={() => toggleCheckbox('bestContactPhoneText')}
  														labelClass={styles.labelCheckbox}/>
  										</div>
  										<span className={styles.error}>{errors.bestContact}</span>
  
  										<SelectSingleDropDown
                          id={`countryId`}
                          name={`countryId`}
                          label={<L p={p} t={`Country`}/>}
                          value={person.countryId || 251}
                          options={countries}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey}
                          error={errors.country} />
  										<InputText
                          id={`address1`}
                          name={`address1`}
                          size={"medium"}
                          label={<L p={p} t={`Address (line 1)`}/>}
                          value={person.address1 || ''}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={person.address1}
                          error={errors.streetAddress} />
  										<InputText
                          id={`address2`}
                          name={`address2`}
                          size={"medium"}
                          label={<L p={p} t={`Address (line 2)`}/>}
                          value={person.address2 || ''}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey} />
  										<InputText
                          id={`city`}
                          name={`city`}
                          size={"medium"}
                          label={<L p={p} t={`City`}/>}
                          value={person.city || ''}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={person.city}
                          error={errors.city} />
  										<SelectSingleDropDown
                          id={`uSStateId`}
                          name={`uSStateId`}
                          label={<L p={p} t={`US State`}/>}
                          value={person.uSStateId || 272}
                          options={usStates}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey} />
  										<InputText
                          id={`postalCode`}
                          name={`postalCode`}
                          size={"medium"}
                          label={<L p={p} t={`Postal code`}/>}
                          value={person.postalCode || ''}
                          onChange={changePerson}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={person.postalCode}
                          error={errors.postalCode} />
  									<hr />
  								</div>
  							<div className={styles.insideDrawer}>
  									{companyConfig.hasAccredited &&
  											<div className={styles.moreTop}>
  													<RadioGroup
  															data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  															name={`accredited`}
  															label={<L p={p} t={`Accreditation`}/>}
  															horizontal={true}
  															className={styles.radio}
  															initialValue={accreditation.accredited}
  															required={true}
  															whenFilled={accreditation.accredited === true || accreditation.accredited === false}
  															onClick={(value) => handleAccreditedRadio('accredited', value)}/>
  													<span className={styles.error}>{errors.accredited}</span>
  													<div className={classes(styles.label, styles.greenInstructions)}>{`Accreditation for the State of Utah only applies to 9th, 10th, 11th and 12th grades.  Please be aware that if you mark accredited, every class costs $20 more per month.`}</div>
  											</div>
  									}
  									{/*<div className={styles.moreTop}>
  											<SelectSingleDropDown
  	                        id={`schoolYearId`}
  	                        name={`schoolYearId`}
  	                        label={<L p={p} t={`School year`}/>}
  													noBlank={true}
  	                        value={accreditation.schoolYearId || 10}
  	                        options={[{id: 9, label: '2018-2019'}, {id: 10, label: '2019-2020'}]}
  	                        className={styles.moreBottomMargin}
  	                        height={`medium`}
  	                        onChange={changeAccreditation}
  	                        onEnterKey={handleEnterKey}/>
  									</div>*/}
  									<div>
  											<SelectSingleDropDown
  	                        id={`gradeLevelId`}
  	                        name={`gradeLevelId`}
  	                        label={<L p={p} t={`Grade level`}/>}
  	                        value={accreditation.gradeLevelId || ''}
  	                        options={gradeLevels}
  	                        className={styles.moreBottomMargin}
  	                        height={`medium`}
  	                        onChange={changeAccreditation}
  	                        onEnterKey={handleEnterKey}
  													required={true}
  													whenFilled={accreditation.gradeLevelId}
  													error={errors.gradeLevel} />
  									</div>
                    {accreditation.gradeLevelId && accreditation.gradeLevelId.length > 0 && accreditation.gradeLevelId.toUpperCase() === 'CA493AC6-46AB-468C-83B4-8F796B76325C' &&
                        <div className={styles.moreTop}>
      											<RadioGroup
                                label={<L p={p} t={`Is this student registering for full-time or half-time kindergarten?`}/>}
      													data={[{ label: <L p={p} t={`Full-time`}/>, id: 'FullTime' }, { label: <L p={p} t={`Part-time`}/>, id: 'PartTime' }, ]}
      													name={`kindergartenFullTimeOrPartTime`}
      													horizontal={true}
      													className={styles.radio}
      													initialValue={accreditation.kindergartenFullTimeOrPartTime}
                                required={true}
      													whenFilled={accreditation.kindergartenFullTimeOrPartTime}
      													onClick={(value) => handleAccreditedRadio('kindergartenFullTimeOrPartTime', value)}
      													error={errors.kindergartenFullTimeOrPartTime}/>
      									</div>
  									}
  									<div className={styles.instructions}>
  											{!person.academyOrDistanceEd
  														? ''
  														: person.academyOrDistanceEd === 'ACADEMY'
  																? `Registration fee of $100.`
  																: `Registration fee of $50.`
  											}
  											{person.academyOrDistanceEd && <L p={p} t={`Fees will be collected at the end of enrollment.`}/>}
  									</div>
  									<RegistrationCourseRequest data={regCourses} gradeLevelId={accreditation.gradeLevelId} selectedCourses={accreditation.selectedCourses}
  											courseTypeName={accreditation.academyOrDistanceEd} intervals={intervals} monthlyAmount={monthlyAmount}
  											selectCourse={handleSelectCourse} gradeLevels={gradeLevels} accreditation={accreditation}/>
  									<span className={styles.error}>{errors.selectCourses}</span>
  									<hr />
                    {accreditation.accredited &&
      									<div>
      											<div className={styles.row}>
      													<div className={styles.subHeader}>Transcripts</div>
      													<div className={styles.row} onClick={() => handleFileUploadOpen('Transcript')}>
      															<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
      															<div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload transcripts`}/></div>
      													</div>
      											</div>
      											<Loading isLoading={loadingTranscriptFile} />
      											{transcriptFiles && transcriptFiles.length > 0 && transcriptFiles.map((f, i) =>
      													<div key={i}>
      															{i === 0 && <span className={styles.label}>{<L p={p} t={`Transcript file(s)`}/>}</span>}
      															<ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId}
      																	deleteFunction={() => handleRemoveFileUploadOpen(f)} deleteId={person.personId}/>
      													</div>
      											)}
                            <hr />
      									</div>
                    }
                    <InputTextArea
                        label={<L p={p} t={`People approved to pick up this student`}/>}
                        name={'peopleApprovedToPickup'}
                        value={peopleApprovedToPickup || ''}
                        autoComplete={'dontdoit'}
                        onChange={changePeopleApprovedToPickup}
                        textareaClass={styles.commentTextarea} />
  
                    <hr />
  
  									{/*<div className={styles.subHeading}><L p={p} t={`Individual Education Plan Record (IEP)`}/></div>
  									<div className={classes(styles.label, styles.greenInstructions)}>
  											<L p={p} t={`A federal law called the Individuals with Disabilities Education Act (IDEA) requires that public schools create an IEP (Individual Education Plan) for every child receiving special education services.`}/>&nbsp
  											<L p={p} t={`The IEP is meant to address each child's unique learning issues and include specific educationalgoals.`}/>  &nbsp
  											<L p={p} t={`The IEP is a legally binding document.`}/>  &nbsp
  											<L p={p} t={`This school accepts students with an IEP and requires that a copy of a student's IEP be kept on file.`}/>&nbsp
  									</div>
  									<div className={styles.moreTop}>
  											<RadioGroup
                            label={<L p={p} t={`Individual Education Plan (IEP)`}/>}
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  													name={`iep`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={accreditation.iep}
  													onClick={(value) => handleAccreditedRadio('iep', value)}/>
  									</div>
  									<hr />
                    <div className={styles.subHeading}>
                        <L p={p} t={`Section 504 of the Rehabilitation Act of 1973`}/><br/>&nbsp;&nbsp;&nbsp;&nbsp
                          <L p={p} t={`and Americans with Disabilities Amendment Act of 2008`}/>
                    </div>
  									<div className={classes(styles.label, styles.greenInstructions)}>
  											<L p={p} t={`Section 504 is a federal law designed to protect the rights of individuals with disabilities in programs and activities that receive federal financial assistance from the U.S. Department of Education. Section 504 states:`}/>  &nbsp
  											<L p={p} t={`“No otherwise qualified individual with a disability in the United States . . . shall, solely by reason of her or his disability, be excluded from the participation in, be denied the benefits of, or be subjected to discrimination under any program or activity receiving Federal financial assistance.`}/>
  									</div>
  									<div className={styles.moreTop}>
  											<RadioGroup
                            label={`504`}
  													data={[{ label: "Yes", id: true }, { label: "No", id: false }, ]}
  													name={`_504`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={accreditation._504}
  													onClick={(value) => handleAccreditedRadio('_504', value)}/>
  									</div>
  									<hr />
                    <div className={styles.subHeading}><L p={p} t={`English Language Learner`}/></div>
  									<div className={classes(styles.label, styles.greenInstructions)}>
  											<L p={p} t={`Is your student learning English as a second language?`}/>
  									</div>
  									<div className={styles.moreTop}>
  											<RadioGroup
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  													name={`ell`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={accreditation.ell}
  													onClick={(value) => handleAccreditedRadio('ell', value)}/>
  									</div>
  									<hr />
                    <div className={styles.subHeading}><L p={p} t={`Speech Therapy`}/></div>
  									<div className={classes(styles.label, styles.greenInstructions)}>
  											<L p={p} t={`Does your student require attention with speech therapy?`}/>
  									</div>
  									<div className={styles.moreTop}>
  											<RadioGroup
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  													name={`speechTherapy`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={accreditation.speechTherapy}
  													onClick={(value) => handleAccreditedRadio('speechTherapy', value)}/>
  									</div>
  									<hr />*/}
  									{accreditation.academyOrDistanceEd === "ACADEMY" &&
  											<div>
  													<div className={styles.subHeading}>Carson Smith</div>
  													<div className={classes(styles.label, styles.greenInstructions)}>
  															<L p={p} t={`The Carson Smith Special Needs Scholarship is a state-funded program that provides private school scholarships to K-12 students with disabilities.`}/> &nbsp
  															<L p={p} t={`The Scholarship was signed into law on March 10, 2005 by Governor Jon Hunstman and is administered by the Utah State Office of Education.`}/>
  													</div>
  													<div className={styles.moreTop}>
  															<RadioGroup
                                    label={<L p={p} t={`My child has a Carson Smith Scholarship`}/>}
  																	data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  																	name={`carsonSmith`}
  																	horizontal={true}
  																	className={styles.radio}
  																	initialValue={accreditation.carsonSmith}
  																	onClick={(value) => handleAccreditedRadio('carsonSmith', value)}/>
  													</div>
  											</div>
  									}
  									<hr />
  							</div>
  							{accreditation.academyOrDistanceEd === "ACADEMY" &&
  							<div className={styles.insideDrawer}>
  									<div>
  											<div className={styles.row}>
  													<span className={classes(styles.label, styles.required)}><L p={p} t={`Medical Insurance`}/></span>
  													<Required setIf={true} setWhen={medical.noInsurance === true || medical.noInsurance === false}/>
  											</div>
  											<RadioGroup
  													data={[
  															{ label: <L p={p} t={`We do not have insurance and will be responsible for all health expenses`}/>, id: true },
  															{ label: <L p={p} t={`Add insurance carrier...`}/>, id: false },
  													]}
  													name={`noInsurance`}
  													horizontal={false}
  													className={styles.radio}
  													initialValue={medical.noInsurance}
  													onClick={(value) => handleMedicalRadio('noInsurance', value)}/>
  											<span className={styles.error}>{errors.noInsurance}</span>
  									</div>
  									{medical.noInsurance === false &&
  											<div>
  													<hr />
  													<InputText
  			                        id={`insuranceCompany`}
  			                        name={`insuranceCompany`}
  			                        size={"medium"}
  			                        label={<L p={p} t={`Insurance carrier`}/>}
  			                        value={medical.insuranceCompany || ''}
  			                        onChange={changeMedical}
  			                        onEnterKey={handleEnterKey}
  															required={true}
  															whenFilled={medical.insuranceCompany}
  			                        error={errors.insuranceCarrier} />
  													<InputText
  			                        id={`insuranceGroupNumber`}
  			                        name={`insuranceGroupNumber`}
  			                        size={"medium"}
  			                        label={<L p={p} t={`Group number`}/>}
  			                        value={medical.insuranceGroupNumber || ''}
  			                        onChange={changeMedical}
  			                        onEnterKey={handleEnterKey}
  															required={true}
  															whenFilled={medical.insuranceGroupNumber}
  			                        error={errors.insuranceGroupNumber} />
  													<InputText
  			                        id={`insuranceClientNumber`}
  			                        name={`insuranceClientNumber`}
  			                        size={"medium"}
  			                        label={<L p={p} t={`Client number`}/>}
  			                        value={medical.insuranceClientNumber || ''}
  			                        onChange={changeMedical}
  			                        onEnterKey={handleEnterKey}
  															required={true}
  															whenFilled={medical.insuranceClientNumber}
  			                        error={errors.insuranceClientNumber} />
  													<hr />
  											</div>
  									}
  									<div>
  											<InputText
  													id={`dentistName`}
  													name={`dentistName`}
  													size={"long"}
  													label={<L p={p} t={`Dentist name`}/>}
  													value={medical.dentistName || ''}
  													onChange={changeMedical}
  													onEnterKey={handleEnterKey}
  													required={true}
  													whenFilled={medical.dentistName}
  													error={errors.dentistName} />
  											<InputText
  													id={`dentistPhone`}
  													name={`dentistPhone`}
  													size={"medium"}
  													label={<L p={p} t={`Dentist phone`}/>}
  													value={medical.dentistPhone || ''}
  													onChange={changeMedical}
  													onEnterKey={handleEnterKey}
  													autoComplete={'dontdoit'}
  													required={true}
  													whenFilled={medical.dentistPhone}
  													error={errors.dentistPhone} />
  											<hr />
  									</div>
  									<div>
  											<InputText
  													id={`physicianName`}
  													name={`physicianName`}
  													size={"long"}
  													label={<L p={p} t={`Physician name`}/>}
  													value={medical.physicianName || ''}
  													onChange={changeMedical}
  													onEnterKey={handleEnterKey}
  													required={true}
  													whenFilled={medical.physicianName}
  													error={errors.physicianName} />
  											<InputText
  													id={`physicianPhone`}
  													name={`physicianPhone`}
  													size={"medium"}
  													label={<L p={p} t={`Physician phone`}/>}
  													value={medical.physicianPhone || ''}
  													onChange={changeMedical}
  													onEnterKey={handleEnterKey}
  													autoComplete={'dontdoit'}
  													required={true}
  													whenFilled={medical.physicianPhone}
  													error={errors.physicianPhone} />
  											<hr />
  									</div>
  									<div className={styles.question}>
  											<div className={styles.row}>
  													<span className={classes(styles.label, styles.required)}><L p={p} t={`Diabetes, seizures. allergies, mental or emotional disturbances, etc?`}/></span>
  													<Required setIf={true} setWhen={medical.seizureMentalEmotional === true || medical.seizureMentalEmotional === false}/>
  											</div>
  											<RadioGroup
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  													name={`seizureMentalEmotional`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={medical.seizureMentalEmotional}
  													onClick={(value) => handleMedicalRadio('seizureMentalEmotional', value)}/>
  											<span className={styles.error}>{errors.seizureMentalEmotional}</span>
  									</div>
  									{medical.seizureMentalEmotional &&
  											<InputTextArea
  													label={<L p={p} t={`Note`}/>}
  													name={'seizureMentalEmotionalNote'}
  													value={medical.seizureMentalEmotionalNote || ''}
  													autoComplete={'dontdoit'}
  													onChange={handleMedicalChange}
  													textareaClass={styles.commentTextarea}/>
  									}
  									<div className={styles.question}>
  											<RadioGroup
  													label={<L p={p} t={`Student is on prescription medication which needs to be administered at school?`}/>}
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  													name={`prescriptionMedication`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={medical.prescriptionMedication}
  													onClick={(value) => handleMedicalRadio('prescriptionMedication', value)}
  													required={true}
  													whenFilled={medical.prescriptionMedication === true || medical.prescriptionMedication === false}
  													error={errors.prescriptionMedication}/>
  											{medical.prescriptionMedication &&
  													<InputTextArea
  															label={<L p={p} t={`Note`}/>}
  															name={'prescriptionMedicationNote'}
  															value={medical.prescriptionMedicationNote || ''}
  															autoComplete={'dontdoit'}
  															onChange={handleMedicalChange}
  															textareaClass={styles.commentTextarea}/>
  											}
  									</div>
  									<div className={styles.question}>
  											<RadioGroup
  													label={<L p={p} t={`Student has permission to take over-the-counter medications? (Aspirin, Tylenol, Claritin, etc.)`}/>}
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  													name={`overTheCounterMeds`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={medical.overTheCounterMeds}
  													rquired={true}
  													whenFilled={medical.overTheCounterMeds === true || medical.overTheCounterMeds === false}
  													onClick={(value) => handleMedicalRadio('overTheCounterMeds', value)}
  													error={errors.overTheCounterMeds}/>
  									</div>
  									<div className={styles.question}>
  											<RadioGroup
  													label={<L p={p} t={`Are there any learning disabilities or special circumstances that might affect your student?`}/>}
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  													name={`learningDisability`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={medical.learningDisability}
  													required={true}
  													whenFilled={medical.learningDisability === true || medical.learningDisability === false}
  													onClick={(value) => handleMedicalRadio('learningDisability', value)}
  													error={errors.learningDisability}/>
  											{medical.learningDisability &&
  													<InputTextArea
  															label={<L p={p} t={`Note`}/>}
  															name={'learningDisabilityNote'}
  															value={medical.learningDisabilityNote || ''}
  															autoComplete={'dontdoit'}
  															onChange={handleMedicalChange}
  															textareaClass={styles.commentTextarea}/>
  											}
  									</div>
  									<div className={classes(styles.greenInstructions, styles.label)}>
  											<L p={p} t={`In case of serious emergency or illness when the parents or guardians cannot be reached immediately, I hereby authorize the school to obtain emergency medical care, such as physician, dentist, paramedic, or other authorized emergency agents, and hereby release the school from any resulting liability.`}/>
  									</div>
  									<div className={styles.question}>
                        {medical.obtainEmergencyCare === false &&
                            <div className={classes(styles.label, styles.greenInstructions)}><L p={p} t={`This school needs your approval in case of emergency.`}/></div>
                        }
  											<RadioGroup
  													label={<L p={p} t={`I agree to allow the school to obtain emergency care`}/>}
  													data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: "No", id: false }, ]}
  													name={`obtainEmergencyCare`}
  													horizontal={true}
  													className={styles.radio}
  													initialValue={medical.obtainEmergencyCare}
  													required={true}
  													whenFilled={medical.obtainEmergencyCare === true}
  													onClick={(value) => handleMedicalRadio('obtainEmergencyCare', value)}
  													error={errors.obtainEmergencyCare}/>
  									</div>
  									<hr />
  									<div className={styles.question}>
  											<div className={classes(styles.row, styles.subHeading)}>
  													<L p={p} t={`Vaccination Record`}/>
  													<div className={styles.positionRequired}>
  															<Required setIf={true} setWhen={vaccinationForm}/>
  													</div>
  											</div>
  											</div>
  											<div className={classes(styles.row, styles.moreBottomMargin)}>
  													<span className={classes(styles.label, styles.greenInstructions)}>
  															<L p={p} t={`For legal purposes, the school must have a copy of the student's official vaccination record or exemption form.`}/>
  													</span>
  											</div>
  											<RadioGroup
  													data={[
  														{ label: <L p={p} t={`Will bring in to the office`}/>, id: 'BRINGTOOFFICE' },
  														{ label: <L p={p} t={`Will mail to the office`}/>, id: 'MAILTOOFFICE' },
  														{ label: <div className={styles.row}>
  																					<div className={styles.text}><L p={p} t={`Upload document`}/></div>
  																					<div className={styles.row} >
  																							<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
  																							<div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Picture`}/></div>
  																					</div>
  																			</div>,
  															id: 'ATTACH' },
  													]}
  													name={`vaccinationForm`}
  													horizontal={false}
  													className={styles.radio}
  													initialValue={vaccinationForm}
  													onClick={(value) => handleVaccinationFormRadio('vaccinationForm', value)}
  													error={errors.vaccinationForm}/>
  											<Loading isLoading={loadingVaccinationFile} />
  
  											{vaccinationFiles && vaccinationFiles.length > 0 && vaccinationFiles.map((f, i) =>
  													<div key={i}>
  															{i === 0 && <span className={styles.label}>{<L p={p} t={`Vaccination file(s)`}/>}</span>}
  															<ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId}
  																	deleteFunction={() => handleRemoveFileUploadOpen(f)} deleteId={person.personId}/>
  													</div>
  											)}
  											<hr />
  									</div>
  								}
  								<div className={styles.insideDrawer}>
                      {/*<div className={styles.moreTop}>
                          <RadioGroup
                              label={<L p={p} t={`Has your student attended this school previously`}/>}
                              data={[{ label: "Yes", id: true }, { label: "No", id: false }, ]}
                              name={`attendedPreviously`}
                              horizontal={true}
                              className={styles.radio}
                              initialValue={accreditation.attendedPreviously}
                              onClick={(value) => handleAccreditedRadio('attendedPreviously', value)}
                              required={true}
                              whenFilled={accreditation.attendedPreviously === true || accreditation.attendedPreviously === false}
                              error={errors.attendedPreviously}/>
                      </div>
                      <div className={styles.moreTop}>
                          <RadioGroup
                              label={<L p={p} t={`Has your student applied to attend this school previously`}/>}
                              data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
                              name={`appliedPreviously`}
                              horizontal={true}
                              className={styles.radio}
                              initialValue={accreditation.appliedPreviously}
                              onClick={(value) => handleAccreditedRadio('appliedPreviously', value)}
                              required={true}
                              whenFilled={accreditation.appliedPreviously === true || accreditation.appliedPreviously === false}
                              error={errors.appliedPreviously}/>
                      </div>
                      <div className={styles.moreTop}>
                          <SelectSingleDropDown
  		                        id={`siblingsToAttend`}
  		                        name={`siblingsToAttend`}
  		                        label={<L p={p} t={`How many siblings are also pre-registering to this school?`}/>}
  		                        value={accreditation.siblingsToAttend === '0' || accreditation.siblingsToAttend === 0 ? 0 : accreditation.siblingsToAttend ? accreditation.siblingsToAttend : 0}
  		                        options={[{id:0,label:0},{id:1,label:1},{id:2,label:2},{id:3,label:3},{id:4,label:4},{id:5,label:5},{id:6,label:6},{id:7,label:7},{id:8,label:8},{id:9,label:9}]}
                              noBlank={true}
  		                        className={styles.moreBottomMargin}
  		                        height={`medium`}
  		                        onChange={changeAccreditation}/>
                      </div>
                      <div className={styles.moreTop}>
                          <RadioGroup
                              label={<L p={p} t={`Do you have a sibling who currently attends this school?`}/>}
                              data={[{ label: "Yes", id: true }, { label: "No", id: false }, ]}
                              name={`currentSiblingAttends`}
                              horizontal={true}
                              className={styles.radio}
                              initialValue={accreditation.currentSiblingAttends}
                              onClick={(value) => handleAccreditedRadio('currentSiblingAttends', value)}
                              required={true}
                              whenFilled={accreditation.currentSiblingAttends === true || accreditation.currentSiblingAttends === false}
  		                        error={errors.currentSiblingAttends} />
                      </div>*/}
                      <div>
      										<SelectSingleDropDown
      												id={`primaryLanguageId`}
      												name={`primaryLanguageId`}
      												label={<L p={p} t={`Primary language at home`}/>}
      												value={background.primaryLanguageId || 1}
      												options={languages}
      												className={styles.moreBottomMargin}
      												height={`medium`}
      												onChange={changeBackground}
      												onEnterKey={handleEnterKey}
      												required={true}
      												whenFilled={background.primaryLanguageId}
      												error={errors.primaryLanguageId} />
                      </div>
  										<div>
  												<RadioGroup
  														label={<L p={p} t={`Are both parents living?`}/>}
  														data={[{ label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  														name={`bothParentsLiving`}
  														horizontal={false}
  														className={styles.radio}
  														initialValue={background.bothParentsLiving}
  														required={true}
  														whenFilled={background.bothParentsLiving === true || background.bothParentsLiving === false}
  														onClick={(value) => handleBackgroundRadio('bothParentsLiving', value)}
  														error={errors.bothParentsLiving}/>
  										</div>
  										{companyConfig.urlcode === 'Liahona' &&
  												<div>
  														<SelectSingleDropDown
  																id={`howLearnOfUsId`}
  																name={`howLearnOfUsId`}
  																label={<L p={p} t={`How did you learn about us?`}/>}
  																value={background.howLearnOfUsId || ''}
  																options={howLearnOfUsList}
  																className={styles.moreBottomMargin}
  																height={`medium`}
  																onChange={changeBackground}
  																onEnterKey={handleEnterKey}/>
  												</div>
  										}
  										{background.howLearnOfUsId === 3 &&
  												<InputText
  		                        id={`referredByWhom`}
  		                        name={`referredByWhom`}
  		                        size={"medium"}
  		                        label={<L p={p} t={`Referring person's name`}/>}
  		                        value={background.referredByWhom || ''}
  		                        onChange={changeBackground}
  														required={true}
  														whenFilled={background.referredByWhom} />
  										}
  										{accreditation.academyOrDistanceEd === "ACADEMY" &&
  												<div>
  														<div>
                                  <RadioGroup
  																		label={<L p={p} t={`Has your student ever been expelled or suspended?`}/>}
  																		data={[ { label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  																		name={`everExpelled`}
  																		horizontal={false}
  																		className={styles.radio}
  																		initialValue={background.everExpelled}
  																		required={true}
  																		whenFilled={background.everExpelled === true || background.everExpelled === false}
  																		onClick={(value) => handleBackgroundRadio('everExpelled', value)}
  																		error={errors.everExpelled}/>
  																{background.everExpelled &&
  																		<InputTextArea
  																				label={<L p={p} t={`Note`}/>}
  																				name={'everExpelledNote'}
  																				value={background.everExpelledNote || ''}
  																				autoComplete={'dontdoit'}
  																				onChange={handleBackgroundChange}
  																				textareaClass={styles.commentTextarea}/>
  																}
  														</div>
  														<div>
  																<RadioGroup
  																		label={<L p={p} t={`Has your student ever been in a treatment center or rehabilitation program?`}/>}
  																		data={[ { label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  																		name={`treatmentCenter`}
  																		horizontal={false}
  																		className={styles.radio}
  																		initialValue={background.treatmentCenter}
  																		required={true}
  																		whenFilled={background.treatmentCenter === true || background.treatmentCenter === false}
  																		onClick={(value) => handleBackgroundRadio('treatmentCenter', value)}
  																		error={errors.treatmentCenter}/>
  																{background.treatmentCenter &&
  																		<InputTextArea
  																				label={<L p={p} t={`Note`}/>}
  																				name={'treatmentCenterNote'}
  																				value={background.treatmentCenterNote || ''}
  																				autoComplete={'dontdoit'}
  																				onChange={handleBackgroundChange}
  																				textareaClass={styles.commentTextarea}/>
  																}
  														</div>
  														<div>
  																<RadioGroup
  																		label={<L p={p} t={`Does your student have a criminal record?`}/>}
  																		data={[ { label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  																		name={`criminalRecord`}
  																		horizontal={false}
  																		className={styles.radio}
  																		initialValue={background.criminalRecord}
  																		required={true}
  																		whenFilled={background.criminalRecord === true || background.criminalRecord === false}
  																		onClick={(value) => handleBackgroundRadio('criminalRecord', value)}
  																		error={errors.criminalRecord}/>
  																{background.criminalRecord &&
  																		<InputTextArea
  																				label={<L p={p} t={`Note`}/>}
  																				name={'criminalRecordNote'}
  																				value={background.criminalRecordNote || ''}
  																				autoComplete={'dontdoit'}
  																				onChange={handleBackgroundChange}
  																				textareaClass={styles.commentTextarea}/>
  																}
  														</div>
  														<div>
  																<RadioGroup
  																		label={<L p={p} t={`Is your student currently supervised by a court or other governmental agency?`}/>}
  																		data={[ { label: <L p={p} t={`Yes`}/>, id: true }, { label: <L p={p} t={`No`}/>, id: false }, ]}
  																		name={`supervisedCourt`}
  																		horizontal={false}
  																		className={styles.radio}
  																		initialValue={background.supervisedCourt}
  																		required={true}
  																		whenFilled={background.supervisedCourt === true || background.supervisedCourt === false}
  																		onClick={(value) => handleBackgroundRadio('supervisedCourt', value)}
  																		error={errors.supervisedCourt}/>
  																{background.supervisedCourt &&
                                      <div>
                                          <div>
                                              <div className={styles.row}>
                                                  <div className={styles.label}><L p={p} t={`Court Documents`}/></div>
                                                  <div className={styles.row} onClick={() => handleFileUploadOpen('Court')}>
                                                      <Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
                                                      <div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload court files`}/></div>
                                                  </div>
                                              </div>
                                              <Loading isLoading={loadingCourtFile} />
                                              {courtFiles && courtFiles.length > 0 && courtFiles.map((f, i) =>
                                                  <div key={i}>
                                                      {i === 0 && <span className={styles.label}><L p={p} t={`Court file(s)`}/></span>}
                                                      <ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId}
                                                          deleteFunction={() => handleRemoveFileUploadOpen(f)} deleteId={person.personId}/>
                                                  </div>
                                              )}
                                          </div>
      																		<InputTextArea
      																				label={<L p={p} t={`Note`}/>}
      																				name={'supervisedCourtNote'}
      																				value={background.supervisedCourtNote || ''}
      																				autoComplete={'dontdoit'}
      																				onChange={handleBackgroundChange}
      																				textareaClass={styles.commentTextarea}/>
                                      </div>
  																}
  													</div>
  											</div>
  										}
  										<hr />
                      {/*<Checkbox
                          id={'fosterChild'}
                          name={'fosterChild'}
                          label={<L p={p} t={`Is foster child?`}/>}
                          checked={background.fosterChild || false}
                          className={styles.checkbox}
                          onClick={() => toggleCheckboxBackGround('fosterChild')}/>
                      <Checkbox
                          id={'homelessRunawayMigrant'}
                          name={'homelessRunawayMigrant'}
                          label={<L p={p} t={`Is homeless, runaway, or migrant?`}/>}
                          checked={background.homelessRunawayMigrant || false}
                          className={styles.checkbox}
                          onClick={() => toggleCheckboxBackGround('homelessRunawayMigrant')}/>
                      <Checkbox
                          id={'hispanicOrLatino'}
                          name={'hispanicOrLatino'}
                          label={<L p={p} t={`Is Hispanic or Latino?`}/>}
                          checked={background.hispanicOrLatino || false}
                          className={styles.checkbox}
                          onClick={() => toggleCheckboxBackGround('hispanicOrLatino')}/>
                      <div>
                          <SelectSingleDropDown
                              label={<L p={p} t={`Race`}/>}
                              id={'raceId'}
                              value={background.raceId}
                              options={races}
                              height={`medium`}
                              onChange={changeBackground}
                              required={true}
                              whenFilled={background.raceId}
                              error={errors.raceId}/>
                      </div>*/}
  
  								</div>
  								<div className={classes(styles.buttonRow, styles.moreTop)}>
  										<button className={styles.submitButton} onClick={(event) => processForm("STAY", event)}>
  												<L p={p} t={`Save`}/>
  										</button>
  								</div>
              </div>
  						<OneFJefFooter />
  						{isShowingFileUpload &&
  								<FileUploadModalWithCrop handleClose={handleFileUploadClose} title={<L p={p} t={`Choose File or Image`}/>}
  										personId={personId} submitFileUpload={handleFileUploadSubmit}
  										file={regFileType === 'Vaccination'
  												? selectedFile_vaccination
  												: regFileType === 'Transcript'
  														? selectedFile_transcript
  														: regFileType === 'BirthCertificate'
  																? selectedFile_birthCertificate
  																: regFileType === 'Court'
  																		? selectedFile_court
  																		: ''
  										}
  										handleInputFile={handleInputFile}
  										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf, .dat, .txt, .ppt, .wpd, .odt, .rtf, .m4a"}
  										handleCancelFile={()=>{}}/>
              }
  						{isShowingModal_removeFileUpload &&
                  <MessageModal handleClose={handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file or image?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this file or image?`}/>} isConfirmType={true}
                     onClick={handleRemoveFileUpload} />
              }
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
          </div>
      )
}

export default withAlert(RegStudentView)
