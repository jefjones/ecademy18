import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './StudentAddManualView.css'
import classes from 'classnames'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import DateTimePicker from '../../components/DateTimePicker'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import { withAlert } from 'react-alert'

function StudentAddManualView(props) {
  const params = useParams()
  const [studentPersonId, setStudentPersonId] = useState('')
  const [errorEmailAddress, setErrorEmailAddress] = useState('')
  const [errorBirthDate, setErrorBirthDate] = useState('')
  const [errorExternalId, setErrorExternalId] = useState('')
  const [errorFirstName, setErrorFirstName] = useState('')
  const [errorEmailAddressParent1, setErrorEmailAddressParent1] = useState('')
  const [errorFirstNameParent1, setErrorFirstNameParent1] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [user, setUser] = useState({
				firstName: '',
        middleName: '',
        lastName: '',
				genderId: '',
        birthDate: '',
				gradeLevelId: '',
        externalId: '',
        emailAddress: '',
        phone: '',
        mentorPersonId: '',
        firstNameParent1: '',
        lastNameParent1: '',
        emailAddressParent1: '',
        phoneParent1: '',
        firstNameParent2: '',
        lastNameParent2: '',
        emailAddressParent2: '',
        phoneParent2: '',
      })
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [genderId, setGenderId] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gradeLevelId, setGradeLevelId] = useState('')
  const [externalId, setExternalId] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [mentorPersonId, setMentorPersonId] = useState('')
  const [firstNameParent1, setFirstNameParent1] = useState('')
  const [lastNameParent1, setLastNameParent1] = useState('')
  const [emailAddressParent1, setEmailAddressParent1] = useState('')
  const [phoneParent1, setPhoneParent1] = useState('')
  const [firstNameParent2, setFirstNameParent2] = useState('')
  const [lastNameParent2, setLastNameParent2] = useState('')
  const [emailAddressParent2, setEmailAddressParent2] = useState('')
  const [phoneParent2, setPhoneParent2] = useState('')
  const [localTabsData, setLocalTabsData] = useState(undefined)
  const [chosenTab, setChosenTab] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [errorGender, setErrorGender] = useState(undefined)
  const [errorBirthDateerrorGradeLevel, setErrorBirthDateerrorGradeLevel] = useState(undefined)
  const [errorEmailAddressParent2, setErrorEmailAddressParent2] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(undefined)

  useEffect(() => {
    
          setStudentPersonId(params && params.studentPersonId)
          if (props.student) setUser(props.student)
      
  }, [])

  const handleFormChange = (chosenTab) => {
    
          setLocalTabsData({ ...localTabsData, chosenTab })
      
  }

  const handleMessageChange = (event) => {
    
          setInviteMessage(event.target.value)
      
  }

  const changeUser = (event) => {
    
        const field = event.target.name
        let user = user
        user[field] = event.target.value
        field === "firstName" && setErrorFirstName('')
        (field === "emailAddress" || field === "phone") && setErrorEmailAddress('')
        // field === "emailAddress" && findContactMatches(event.target.value, '');
        // field === "phone" && findContactMatches('', event.target.value);
        if (field === "emailAddress") user[field] = user[field].replace(/ /g, "")
    
        setUser(user)
      
  }

  const handleEnterKey = (event) => {
    
          event.key === "Enter" && processForm("STAY")
      
  }

  const validateEmail = (email) => {
    
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
          return re.test(email)
      
  }

  const validatePhone = (phone) => {
    
          return stripPhoneFormatAndPrefix(phone).length === 10 ? true : false
      
  }

  const stripPhoneFormatAndPrefix = (phone) => {
    
          phone = phone && phone.replace(/\D+/g, "")
          if (phone && phone.indexOf('1') === 0) { //if 1 is in the first place, get rid of it.
              phone = phone.substring(1)
          }
          return phone
      
  }

  const processForm = (stayOrFinish, event) => {
    
        const {updateLearner, addLearner, personId} = props
        
        // prevent default action. in this case, action is the form submission event
        event && event.preventDefault()
        let hasError = false
    		let missingInfoMessage = []
    
        //It is possible that this is the "Finish" version of the processForm and the user might not be filled in.
        if (!user.firstName) {
            hasError = true
            setErrorFirstName(<L p={p} t={`The first name is required`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
        }
    
    		// if (!user.genderId) {
        //     hasError = true;
        //     setErrorGender(<L p={p} t={`The student gender is required`}/>);
    		// 		missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Gender`}/></div>
        // }
    
    		if (user.emailAddress && !validateEmail(user.emailAddress)) {
            hasError = true
            setErrorEmailAddress(<L p={p} t={`Email address appears to be invalid.`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Invalid email address`}/></div>
        } else if (user.phone && !validatePhone(user.phone)) {
            hasError = true
            setErrorEmailAddress(<L p={p} t={`The phone number should be ten digits long`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Ten digit phone number`}/></div>
        }
        // if (!user.externalId) {
        //     hasError = true;
        //     setErrorExternalId(<L p={p} t={`The Learner Id is required.`}/>);
        // }
        // if (!user.birthDate) {
        //     hasError = true;
        //     setErrorBirthDate(<L p={p} t={`The birth date is required`}/>);
    		// 		missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Birth date`}/></div>
        // }
    		if (!user.gradeLevelId) {
            hasError = true
            setErrorBirthDateerrorGradeLevel(<L p={p} t={`The grade level is required`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Grade level`}/></div>
        }
    
        if (!user.firstNameParent1) {
            hasError = true
            setErrorFirstNameParent1(<L p={p} t={`Primary guardian's first name required`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's first name`}/></div>
        }
        if (!user.emailAddressParent1) {
            hasError = true
            setErrorEmailAddressParent1(<L p={p} t={`Primary guardian's email address required`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's email address`}/></div>
    		} else if (user.emailAddressParent1 && !validateEmail(user.emailAddressParent1)) {
            hasError = true
            setErrorEmailAddressParent1(<L p={p} t={`Email address appears to be invalid.`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's email address invalid`}/></div>
        }
    
    		if (user.emailAddressParent2 && !validateEmail(user.emailAddressParent2)) {
    				hasError = true
    				setErrorEmailAddressParent2(<L p={p} t={`Email address appears to be invalid.`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Secondary guardian's email address invalid`}/></div>
    		}
    
        if (!hasError) {
            studentPersonId ? updateLearner(personId, user) : addLearner(personId, [user])
            setStudentPersonId(''); set//This is only used when modifying an existing record. but only one at a time and the bulk entry will be hidden.
    			      errorEmailAddress(''); setErrorBirthDate(''); setErrorExternalId(''); setErrorFirstName(''); setErrorGender(''); setErrorEmailAddressParent1(''); setErrorFirstNameParent1(''); setInviteMessage(''); setUser({
    								firstName: '',
                    middleName: '',
                    lastName: '',
    								genderId: '',
                    birthDate: '',
    								externalId: '',
                    gradeLevelId: '',
                    emailAddress: '',
                    phone: '',
                    mentorPersonId: '',
                    firstNameParent1: '',
                    lastNameParent1: '',
                    emailAddressParent1: '',
    								errorEmailAddressParent2: '',
                    phoneParent1: '',
                    firstNameParent2: '',
                    lastNameParent2: '',
                    emailAddressParent2: '',
                    phoneParent2: '',
                })
            if (stayOrFinish === "FINISH") {
                navigate(`/firstNav`)
            }
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`The new student and guardian(s) have been entered.`}/></div>)
        } else {
    				handleMissingInfoOpen(missingInfoMessage)
    		}
      
  }

  const handleBirthDate = (event) => {
    
        let user = user
        user.birthDate = event.target.value
        setUser(user)
      
  }

  const fillInEmailAddress = (event) => {
    
    			//if this is a valid email address and the emailAddress is empty, fill it in automatically with the user
    			
    			let username = event.target.value
    			if (validateEmail(username) && !user.emailAddress) user.emailAddress = username
    	
  }

  const checkDuplicateUsername = (event) => {
    
    			props.isDuplicateUsername(event.target.value)
    	
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    	handleMissingInfoClose = () => setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    	handleUpdateSchoolYear = ({target}) => {
    			const {personId, updatePersonConfig, getLearners} = props
  }

  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    	handleUpdateSchoolYear = ({target}) => {
    			const {personId, updatePersonConfig, getLearners} = props
  }

  const handleUpdateSchoolYear = ({target}) => {
    
    			const {personId, updatePersonConfig, getLearners} = props
    			setCourseScheduledschoolYearId(target.value)
    			updatePersonConfig(personId, 'SchoolYearId', target.value, () => getLearners(personId))
    	
  }

  const {personId, gradeLevels, loginData, schoolYears, genders, myFrequentPlaces, setMyFrequentPlace} = props
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <span className={globalStyles.pageTitle}><L p={p} t={`Add Student`}/></span>
              </div>
              <div className={styles.formLeft}>
                  <div>
                      <InputDataList
                          label={<L p={p} t={`School year(s)`}/>}
                          name={'selectedSchoolYears'}
                          options={schoolYears}
                          value={selectedSchoolYears}
                          multiple={true}
                          height={`medium`}
                          listAbove={true}
                          className={styles.moreSpace}
                          onChange={handleSelectedSchoolYears}
                          required={true}
                          whenFilled={selectedSchoolYears && selectedSchoolYears.length > 0}
                          error={errorSchoolYear}/>
                  </div>
                  <InputText
                      size={"medium"}
                      name={"firstName"}
                      label={<L p={p} t={`First name`}/>}
                      value={user.firstName || ''}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey}
  										required={true}
  										whenFilled={user.firstName}
                      error={errorFirstName} />
  								<InputText
                      size={"medium"}
                      name={"middleName"}
                      label={<L p={p} t={`Middle name`}/>}
                      value={user.middleName || ''}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey}
                      error={errorFirstName} />
                  <InputText
                      size={"medium"}
                      name={"lastName"}
                      label={<L p={p} t={`Last name`}/>}
                      value={user.lastName || ''}
                      onEnterKey={handleEnterKey}
                      onChange={changeUser}/>
  								<SelectSingleDropDown
                      id={`genderId`}
                      name={`genderId`}
                      label={<L p={p} t={`Gender`}/>}
                      value={user.genderId || ''}
  										height={`medium`}
                      options={genders}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey} />
                  <div className={styles.columnAndText}>
                      <span className={styles.text}><L p={p} t={`Birth date:`}/></span>
                      <DateTimePicker name={`birthDate`} value={user.birthDate || ''} onChange={handleBirthDate}/>
                      <span className={styles.error}>{errorBirthDate}</span>
                  </div>
  								<div>
  										<SelectSingleDropDown
  												id={`gradeLevelId`}
  												name={`gradeLevelId`}
  												label={<L p={p} t={`Grade level`}/>}
  												value={user.gradeLevelId || ''}
  												options={gradeLevels}
  												height={`medium`}
  												onChange={changeUser}
  												onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={user.gradeLevelId}
  												error={errorGradeLevel} />
  								</div>
  								<InputText
                      size={"medium"}
                      name={"username"}
                      label={"Username"}
                      value={user.username || ''}
                      onEnterKey={handleEnterKey}
  										onBlur={(event) => {fillInEmailAddress(event); checkDuplicateUsername(event)}}
                      onChange={changeUser}
  										required={true}
  										whenFilled={user.username && !loginData.isDuplicateUsername}
  										error={loginData.isDuplicateUsername
  												? <div className={styles.error}>Duplicate username!</div>
  												: errorExternalId
  										}/>
                  <InputText
                      size={"medium"}
                      name={"password"}
                      label={"Password (optional)"}
                      value={user.password || ''}
                      onChange={changeUser}
  										required={true}/>
                  <hr />
  								<div className={styles.grayBack}>
  										<div className={globalStyles.instructions}>
  												<L p={p} t={`Optional:  This is the student's email and cell number.`}/>
  												<L p={p} t={`You may enter the parent/guardians' contact information here, but you will also have the chance to enter the parent/guardians' information on their entry form.`}/>
  										</div>
  										<div className={classes(styles.subheader, styles.row)}>
  												<L p={p} t={`Email address and/or cell number for text messages`}/>
  										</div>
                      <InputText
                          size={"medium-long"}
                          name={"emailAddress"}
                          label={<L p={p} t={`Email address`}/>}
                          value={user.emailAddress || ''}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey} />
                      <InputText
                          size={"medium-short"}
                          name={"phone"}
                          label={<L p={p} t={`Text message phone number (optional)`}/>}
                          value={user.phone || ''}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey} />
  								</div>
  								<InputText
                      size={"short"}
                      name={"externalId"}
                      label={<L p={p} t={`Student id (optional - for other school systems)`}/>}
                      value={user.externalId || ''}
                      onEnterKey={handleEnterKey}
                      onChange={changeUser}
                      error={errorExternalId}/>
                  {/*<SelectSingleDropDown
                      id={`mentorPersonId`}
                      label={<L p={p} t={`Learning coach`}/>}
                      value={user.mentorPersonId || ''}
                      options={mentors}
                      height={`medium`}
                      onChange={changeUser} />*/}
                  <hr />
                  <span className={styles.subHeader}><L p={p} t={`Guardian (primary)`}/></span>
                  <InputText
                      size={"medium"}
                      name={"firstNameParent1"}
                      label={<L p={p} t={`First name`}/>}
                      value={user.firstNameParent1 || ''}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey}
  										required={true}
  										whenFilled={user.firstNameParent1}
                      error={errorFirstNameParent1} />
                  <InputText
                      size={"medium"}
                      name={"lastNameParent1"}
                      label={<L p={p} t={`Last name`}/>}
                      value={user.lastNameParent1 || ''}
                      onEnterKey={handleEnterKey}
                      onChange={changeUser}/>
                  <InputText
                      size={"medium-long"}
                      name={"emailAddressParent1"}
                      label={<L p={p} t={`Email address`}/>}
                      value={user.emailAddressParent1 || ''}
                      onChange={changeUser}
  										required={true}
  										whenFilled={user.emailAddressParent1}
                      onEnterKey={handleEnterKey}
                      error={errorEmailAddressParent1} />
                  <InputText
                      size={"medium-short"}
                      name={"phoneParent1"}
                      label={<L p={p} t={`Text message phone number (optional)`}/>}
                      value={user.phoneParent1 || ''}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey}
                      instructions={``} />
                  <hr />
                  <span className={styles.subHeader}><L p={p} t={`Guardian (secondary - optional)`}/></span>
                  <InputText
                      size={"medium"}
                      name={"firstNameParent2"}
                      label={<L p={p} t={`First name`}/>}
                      value={user.firstNameParent2 || ''}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey}
                      error={errorFirstName} />
                  <InputText
                      size={"medium"}
                      name={"lastNameParent2"}
                      label={<L p={p} t={`Last name`}/>}
                      value={user.lastNameParent2 || ''}
                      onEnterKey={handleEnterKey}
                      onChange={changeUser}/>
                  <InputText
                      size={"medium-long"}
                      name={"emailAddressParent2"}
                      label={<L p={p} t={`Email address`}/>}
                      value={user.emailAddressParent2 || ''}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey}
                      error={errorEmailAddressParent2}	 />
                  <InputText
                      size={"medium-short"}
                      name={"phoneParent2"}
                      label={<L p={p} t={`Text message phone number (optional)`}/>}
                      value={user.phoneParent2 || ''}
                      onChange={changeUser}
                      onEnterKey={handleEnterKey}
                      instructions={``} />
              </div>
              {/*<span className={styles.label}>{`Add a message (optional)`}</span><br/>
              <textarea rows={5} cols={42} value={inviteMessage} onChange={(event) => handleMessageChange(event)}
                  className={styles.messageBox}></textarea>*/}
              <div className={classes(styles.rowRight)}>
  								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Student Add (manual)`}/>} path={'studentAddManual'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
          </div>
      )
}

export default withAlert(StudentAddManualView)
