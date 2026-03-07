import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const p = 'LearnerAddView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './LearnerAddView.css'
import classes from 'classnames'
import InputText from '../../components/InputText'
import TabPage from '../../components/TabPage'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import Required from '../../components/Required'
import DateTimePicker from '../../components/DateTimePicker'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import { withAlert } from 'react-alert'

function LearnerAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [studentPersonId, setStudentPersonId] = useState('')
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [isBulkEntered, setIsBulkEntered] = useState(false)
  const [errorEmailAddress, setErrorEmailAddress] = useState('')
  const [errorBirthDate, setErrorBirthDate] = useState('')
  const [errorExternalId, setErrorExternalId] = useState('')
  const [errorFirstName, setErrorFirstName] = useState('')
  const [errorEmailAddressParent1, setErrorEmailAddressParent1] = useState('')
  const [errorFirstNameParent1, setErrorFirstNameParent1] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [learners, setLearners] = useState([])
  const [duplicateEntries, setDuplicateEntries] = useState([])
  const [isShowingNoBulkEntryMessage, setIsShowingNoBulkEntryMessage] = useState(false)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
				gradeLevelCode: '',
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
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gradeLevelCode, setGradeLevelCode] = useState('')
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
  const [bulk, setBulk] = useState({
          delimiter: 'comma',
          firstField: 'firstName',
          secondField: 'lastName',
          thirdField: 'emailAddress',
          fourthField: 'birthDate',
          fifthField: 'gradeLevelCode',
          sixthField: 'firstNameParent1',
          seventhField: 'lastNameParent1',
          eighthField: 'emailAddressParent1',
          ninthField: 'phoneParent1',
          tenthField: '',
          memberData: '', //This should always be text for the textarea.  Never an array of objects.
      })
  const [delimiter, setDelimiter] = useState('comma')
  const [firstField, setFirstField] = useState('firstName')
  const [secondField, setSecondField] = useState('lastName')
  const [thirdField, setThirdField] = useState('emailAddress')
  const [fourthField, setFourthField] = useState('birthDate')
  const [fifthField, setFifthField] = useState('gradeLevelCode')
  const [sixthField, setSixthField] = useState('firstNameParent1')
  const [seventhField, setSeventhField] = useState('lastNameParent1')
  const [eighthField, setEighthField] = useState('emailAddressParent1')
  const [ninthField, setNinthField] = useState('phoneParent1')
  const [tenthField, setTenthField] = useState('')
  const [memberData, setMemberData] = useState('')
  const [contactMatches, setContactMatches] = useState([])
  const [localTabsData, setLocalTabsData] = useState(undefined)
  const [chosenTab, setChosenTab] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [errorBirthDateerrorGradeLevel, setErrorBirthDateerrorGradeLevel] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)

  useEffect(() => {
    
          setLocalTabsData(props.tabsData); setStudentPersonId(props.studentPersonId)
          if (props.student) setUser(props.student)
      
  }, [])

  const returnToBulkEntry = () => {
    
          setIsBulkEntered(false)
      
  }

  const getColumnData = (field, m, index, col) => {
    
    			const {gradeLevels} = props
          if (field && !!col[index]) {
              if (field === 'firstName') {
                  m.firstName = col[index].trim()
              } else if (field === 'lastName') {
                  m.lastName = col[index].trim()
              } else if (field === 'fullNameLastFirst') {
                  if (col[index].indexOf(",") > -1) {
                      let name = col[index].trim().split(",")
                      m.lastName = name[0].trim()
                      m.firstName = name[1].trim()
                  } else {
                      m.lastName = col[index].substring(col[index].indexOf(" "))
                      m.firstName = col[index].substring(col[index].lastIndexOf(" "))
                  }
              } else if (field === 'fullNameFirstFirst') {
                  let name = col[index].trim().split(" ")
                  m.firstName = name[0].trim()
                  m.lastName = name[name.length-1].trim()
              } else if (field === 'externalId') {
                  m.externalId = col[index].trim()
    					} else if (field === 'gradeLevelCode' && col[index] && col[index].length > 0) {
    							let gradeLevelId = 0
    							if (!!col[index]) {
    									const test = col[index].match(/\d+/g)
    									if (test && test.length > 0) {
    											let arrGradeLevelCode = col[index].match(/\d+/g).map(Number);  //This is intended to cut out the 'th' such as 7th or other variations.
    											let gradeLevelCode = String(arrGradeLevelCode[0])
    											if (col[index] === 'K') gradeLevelCode = 'K'
    											gradeLevels && gradeLevels.length > 0 && gradeLevels.forEach(g => {
    													if (g.label === String(gradeLevelCode)) { //eslint-disable-line
    															gradeLevelId = g.id
    													}
    											})
    									}
    							}
    							m.gradeLevelId = gradeLevelId
    							m.gradeLevelCode = gradeLevelId > 0 ? col[index] : 'Unknown'
              } else if (field === 'birthDate') {
                  m.birthDate = col[index].trim().replace(/'/g, "").replace(/"/g, "");
              } else if (field === 'emailAddress') {
                  m.emailAddress = col[index].trim()
              } else if (field === 'phone') {
                  m.phone = col[index].trim()
              } else if (field === 'firstNameParent1') {
                  m.firstNameParent1 = col[index].trim()
              } else if (field === 'lastNameParent1') {
                  m.lastNameParent1 = col[index].trim()
              } else if (field === 'fullNameLastFirstParent1') {
                  if (col[index].indexOf(",") > -1) {
                      let name = col[index].trim().split(",")
                      m.lastNameParent1 = name[0].trim()
                      m.firstNameParent1 = name[1].trim()
                  } else {
                      m.lastNameParent1 = col[index].substring(col[index].indexOf(" "))
                      m.firstNameParent1 = col[index].substring(col[index].lastIndexOf(" "))
                  }
              } else if (field === 'fullNameFirstFirstParent1') {
                  let name = col[index].trim().split(" ")
                  m.firstNameParent1 = name[0].trim()
                  m.lastNameParent1 = name[name.length-1].trim()
              } else if (field === 'emailAddressParent1') {
                  m.emailAddressParent1 = col[index].trim()
    					} else if (field === 'phoneParent1') {
                  m.phoneParent1 = col[index].trim()
              } else if (field === 'firstNameParent2') {
                  m.firstNameParent2 = col[index].trim()
              } else if (field === 'lastNameParent2') {
                  m.lastNameParent2 = col[index].trim()
              } else if (field === 'fullNameLastFirstParent2') {
                  if (col[index].indexOf(",") > -1) {
                      let name = col[index].trim().split(",")
                      m.lastNameParent2 = name[0].trim()
                      m.firstNameParent2 = name[1].trim()
                  } else {
                      m.lastNameParent2 = col[index].substring(col[index].indexOf(" "))
                      m.firstNameParent2 = col[index].substring(col[index].lastIndexOf(" "))
                  }
              } else if (field === 'fullNameFirstFirstParent2') {
                  let name = col[index].trim().split(" ")
                  m.firstNameParent2 = name[0].trim()
                  m.lastNameParent2 = name[name.length-1].trim()
              } else if (field === 'emailAddressParent2') {
                  m.emailAddressParent2 = col[index].trim()
    					} else if (field === 'phoneParent2') {
                  m.phoneParent2 = col[index].trim()
              }
          }
          return m
      
  }

  const goToBulkVerification = () => {
    
          let {bulk} = state
          let newLearners = []
          let lines = bulk && !!bulk.memberData && bulk.memberData.trim().split('\n')
          let splitCharacter = bulk.delimiter === "comma" ? ',' : bulk.delimiter === "semicolon" ? ";" : bulk.delimiter === "hyphen" ? '-' : bulk.delimiter === "tab" ? '\t' : ','
    
          if (!lines) {
              handleNoBulkEntryMessageOpen()
              return
          }
    
          lines.forEach(line => {
              let checkBlank = line.replace(/<[^>]*>/g, ' ')
                  .replace(/\s{2,}/g, ' ')
                  .replace(/&nbsp;/g, ' ')
                  .trim()
    
              if (!!checkBlank) {
                  let col = line.trim().split(splitCharacter)
                  let m = {}
                  let index = 0
                  m = getColumnData(bulk.firstField, m, index++, col)
                  m = getColumnData(bulk.secondField, m, index++, col)
                  m = getColumnData(bulk.thirdField, m, index++, col)
                  m = getColumnData(bulk.fourthField, m, index++, col)
                  m = getColumnData(bulk.fifthField, m, index++, col)
                  m = getColumnData(bulk.sixthField, m, index++, col)
                  m = getColumnData(bulk.seventhField, m, index++, col)
                  m = getColumnData(bulk.eighthField, m, index++, col)
                  m = getColumnData(bulk.ninthField, m, index++, col)
                  m = getColumnData(bulk.tenthField, m, index++, col)
                  newLearners = newLearners ? newLearners.concat(m) : [m]
              }
          })
    
          newLearners = stripOutDuplicates(newLearners)
          newLearners = newLearners.reduce((acc, m) => {
              if(!!m.firstName || !!m.lastName || !!m.emailAddress || !!m.phone || !!m.birthDate) {
                  acc = acc ? acc.concat(m) : [m]
              }
              return acc
            }, [])
          setIsBulkEntered(true); setLearners(newLearners)
      
  }

  const stripOutDuplicates = (newLearners) => {
    
          const {existingLearners, editorInvitePending} = props
          let duplicateEntries = []
          let minusMembers = Object.assign([], newLearners)
    
          newLearners && newLearners.length && newLearners.forEach((m, index) => {
              !!editorInvitePending && editorInvitePending.forEach(p => {
                  if ((m.firstName === p.firstName && m.lastName === p.lastName)
    											|| m.username === p.username
                          || m.emailAddress === p.emailAddress
                          || m.birthDate === p.birthDate
                          || m.phone === p.phone) {
                      duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m]
                      delete minusMembers[index]
                   }
                })
                existingLearners && existingLearners.length > 0 && existingLearners.forEach(p => {
                    if ((m.firstName === p.firstName && m.lastName === p.lastName)
    														|| m.username === p.username
                                || m.lastName === p.lastName
                                || m.emailAddress === p.emailAddress
                                || m.birthDate === p.birthDate
                                || m.phone === p.phone) {
                        duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m]
                        delete minusMembers[index]
                    }
                })
          })
    
          setDuplicateEntries(duplicateEntries)
          return minusMembers
      
  }

  const handleFormChange = (chosenTab) => {
    
          setLocalTabsData({ ...localTabsData, chosenTab })
      
  }

  const handleBulkEntry = (event) => {
    
          setBulk({ ...bulk, memberData: event.target.value})
      
  }

  const handleMessageChange = (event) => {
    
          setInviteMessage(event.target.value)
      
  }

  const findContactMatches = (emailAddress, phone) => {
    
          const {contacts} = props
          if ((emailAddress && emailAddress.length > 4) || (phone && phone.length > 4)) {
              setContactMatches(contacts && contacts.length > 0 && contacts.filter(m => (m.emailAddress && m.emailAddress.indexOf(emailAddress) > -1) || (m.phone && m.phone.indexOf(phone) > -1)))
          }
      
  }

  const changeUser = (event) => {
    
        const field = event.target.name
        let user = user
        user[field] = event.target.value
        field === "firstName" && setErrorFirstName('')
        (field === "emailAddress" || field === "phone") && setErrorEmailAddress('')
        field === "emailAddress" && findContactMatches(event.target.value, '')
        field === "phone" && findContactMatches('', event.target.value)
        if (field === "emailAddress") user[field] = user[field].replace(/ /g, "")
    
        setUser(user)
        showNextButton()
      
  }

  const changeBulk = ({target}) => {
    
        setBulk({...bulk, [target.name]: target.value})
      
  }

  const handleEnterKey = (event) => {
    
          event.key === "Enter" && processForm("STAY")
      
  }

  const showNextButton = () => {
    
        
        if (user.firstName && ((user.emailAddress && validateEmail(user.emailAddress)) || (user.phone && user.phone.length > 8))) {
            setIsUserComplete(true)
        } else {
            setIsUserComplete(false)
        }
      
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

  const processBulk = () => {
    
          const {addLearner, personId} = props
          
          addLearner(personId, learners)
          navigate(`/firstNav`)
      
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
            setErrorFirstName("The first name is required")
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
        }
    
        if (!user.emailAddress && !user.phone) {
            hasError = true
            setErrorEmailAddress("An email address or cell phone for text messages is required")
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address or cell phone`}/></div>
        // } else if (user.emailAddress && !validateEmail(user.emailAddress)) {
        //     hasError = true;
        //     setErrorEmailAddress("The phone number should be ten digits long");
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Ten digit phone number`}/></div>
        }
        // if (!user.externalId) {
        //     hasError = true;
        //     setHasError = true;
        if (!user.birthDate) {
            hasError = true
            setErrorBirthDate("The birth date is required")
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Birth date`}/></div>
        }
        if (!user.gradeLevel) {
            hasError = true
            setErrorGradeLevel("The grade level is required")
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Grade level`}/></div>
        }
    
        if (!user.firstNameParent1) {
            hasError = true
            setErrorFirstNameParent1("Primary guardian's first name required")
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's first name`}/></div>
        }
        if (!user.emailAddressParent1) {
            hasError = true
            setErrorEmailAddressParent1("Primary guardian's email address required")
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's email address`}/></div>
    		} else if (user.emailAddressParent1 && !validateEmail(user.emailAddressParent1)) {
            hasError = true
            setErrorEmailAddressParent1("Email address appears to be invalid.")
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's email address invalid`}/></div>
        }
        if (!hasError) {
            studentPersonId ? updateLearner(personId, user) : addLearner(personId, [user])
            setUser({
                    firstName: '',
                    lastName: '',
                    birthDate: '',
    								externalId: '',
                    gradeLevelCode: '',
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
            if (stayOrFinish === "FINISH") {
                navigate(`/firstNav`)
            }
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`The new student and guardian(s) have been entered.`}/></div>)
    		} else {
    				handleMissingInfoOpen(missingInfoMessage)
        }
      
  }

  const handleNoBulkEntryMessageOpen = () => {
    setIsShowingNoBulkEntryMessage(true)
  }

  const handleNoBulkEntryMessageClose = () => {
    setIsShowingNoBulkEntryMessage(false)
  }

  const handleBirthDate = (event) => {
    let newUser = {...user}
    newUser.birthDate = event.target.value
    setUser(newUser)
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
    setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
  }

  const handleMissingInfoClose = () => {
    setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
  }

  const {bulkDelimiterOptions, fieldOptions, gradeLevels, loginData} = props
      
  
      return (
          <section className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  Add Student
              </div>
              <hr />
              {!studentPersonId && <TabPage tabsData={localTabsData} onClick={handleFormChange} />}
              {localTabsData && localTabsData.chosenTab === 'FieldEntry' &&
                  <div>
                      <div className={styles.formLeft}>
                          <InputText
                              size={"medium"}
                              name={"firstName"}
                              label={"First name"}
                              value={user.firstName || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
  														required={true}
  														whenFilled={user.firstName}
                              error={errorFirstName} />
                          <InputText
                              size={"medium"}
                              name={"lastName"}
                              label={"Last name"}
                              value={user.lastName || ''}
                              onEnterKey={handleEnterKey}
                              onChange={changeUser}/>
                          <div className={styles.columnAndText}>
  														<div className={styles.row}>
  		                            <span className={styles.text}>Birth date:</span>
  																<Required setIf={true} setWhen={user.birthDate}/>
  														</div>
                              <DateTimePicker name={`birthDate`} value={user.birthDate || ''} onChange={handleBirthDate}/>
                              <span className={styles.error}>{errorBirthDate}</span>
                          </div>
  												<div>
  														<SelectSingleDropDown
  																id={`gradeLevelCode`}
  																name={`gradeLevelCode`}
  																label={'Grade level'}
  																value={user.gradeLevelCode || ''}
  																options={gradeLevels}
  																height={`medium`}
  																onChange={changeUser}
  																onEnterKey={handleEnterKey}
  																required={true}
  																whenFilled={user.gradeLevelCode}
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
                          <hr />
  												<div className={styles.grayBack}>
  														<div className={classes(styles.subheader, styles.row)}>
  																Email address and/or cell number for text messages
  																<Required setIf={true} className={styles.required}
  																		setWhen={(user.phone && validatePhone(user.phone)) ||  (user.emailAddress && validateEmail(user.emailAddress))}/>
  														</div>
  		                        <InputText
  		                            size={"medium-long"}
  		                            name={"emailAddress"}
  		                            label={"Email address"}
  		                            value={user.emailAddress || ''}
  		                            onChange={changeUser}
  		                            onEnterKey={handleEnterKey}
  		                            error={errorEmailAddress} />
  		                        <InputText
  		                            size={"medium-short"}
  		                            name={"phone"}
  		                            label={"Text message phone number (optional)"}
  		                            value={user.phone || ''}
  		                            onChange={changeUser}
  		                            onEnterKey={handleEnterKey}
  		                            instructions={``} />
  												</div>
  												<InputText
                              size={"medium"}
                              name={"externalId"}
                              label={"Student id (optional - for other school systems)"}
                              value={user.externalId || ''}
                              onEnterKey={handleEnterKey}
                              onChange={changeUser}
                              error={errorExternalId}/>
                          {/*<SelectSingleDropDown
                              id={`mentorPersonId`}
                              label={`Learning coach`}
                              value={user.mentorPersonId || ''}
                              options={mentors}
                              height={`medium`}
                              onChange={changeUser} />*/}
                          <hr />
                          <span className={styles.subHeader}>Guardian (primary)</span>
                          <InputText
                              size={"medium"}
                              name={"firstNameParent1"}
                              label={"First name"}
                              value={user.firstNameParent1 || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
  														required={true}
  														whenFilled={user.firstNameParent1}
                              error={errorFirstNameParent1} />
                          <InputText
                              size={"medium"}
                              name={"lastNameParent1"}
                              label={"Last name"}
                              value={user.lastNameParent1 || ''}
                              onEnterKey={handleEnterKey}
                              onChange={changeUser}/>
                          <InputText
                              size={"medium-long"}
                              name={"emailAddressParent1"}
                              label={"Email address"}
                              value={user.emailAddressParent1 || ''}
                              onChange={changeUser}
  														required={true}
  														whenFilled={user.emailAddressParent1}
                              onEnterKey={handleEnterKey}
                              error={errorEmailAddressParent1} />
                          <InputText
                              size={"medium-short"}
                              name={"phoneParent1"}
                              label={"Text message phone number (optional)"}
                              value={user.phoneParent1 || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              instructions={``} />
                          <hr />
                          <span className={styles.subHeader}>Guardian (secondary - optional)</span>
                          <InputText
                              size={"medium"}
                              name={"firstNameParent2"}
                              label={"First name"}
                              value={user.firstNameParent2 || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              error={errorFirstName} />
                          <InputText
                              size={"medium"}
                              name={"lastNameParent2"}
                              label={"Last name"}
                              value={user.lastNameParent2 || ''}
                              onEnterKey={handleEnterKey}
                              onChange={changeUser}/>
                          <InputText
                              size={"medium-long"}
                              name={"emailAddressParent2"}
                              label={"Email address"}
                              value={user.emailAddressParent2 || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              error={errorEmailAddress} />
                          <InputText
                              size={"medium-short"}
                              name={"phoneParent2"}
                              label={"Text message phone number (optional)"}
                              value={user.phoneParent2 || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              instructions={``} />
                          <hr />
                      </div>
                      <span className={styles.label}>{`Add a message (optional)`}</span><br/>
                      <textarea rows={5} cols={42} value={inviteMessage} onChange={(event) => handleMessageChange(event)}
                          className={styles.messageBox}></textarea>
                      <div className={classes(styles.rowRight)}>
  												<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
  												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)} disabled={!isUserComplete}/>
                      </div>
                  </div>
              }
              {localTabsData && localTabsData.chosenTab === 'BulkPaste' &&
                  <div className={styles.formLeft}>
                      <div className={classes(styles.rowRight)}>
                          <button className={classes(styles.button, (isBulkEntered ? styles.opacityFull : styles.opacityLow))} onClick={returnToBulkEntry}>
                              {`<- Prev`}
                          </button>
  												<ButtonWithIcon label={isBulkEntered ? `Finish` : `Next ->`} icon={'checkmark_circle'} onClick={isBulkEntered ? processBulk : goToBulkVerification} disabled={!bulk.memberData || !bulk.memberData.length}/>
                      </div>
  										<div className={styles.instructions}>
  												You can paste in a list of students which could be separated by commas or by tabs, for example. The list of lists below are for you to choose what order your data is in.  The lists are set with a default.  If it is easier for you to adjust your data to be in the order given below, then that could be an easy option for you as well.  However, if you would prefer that we help you directly, please call us at (801) 318-7907 and we will be glad to get your students entered for you.
  										</div>
                      {!isBulkEntered &&
                          <div>
                              <SelectSingleDropDown
                                  id={`delimiter`}
                                  label={`How are the fields separated?`}
                                  value={bulk.delimiter}
                                  options={bulkDelimiterOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`firstField`}
                                  label={`First field`}
                                  value={bulk.firstField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`secondField`}
                                  label={`Second field`}
                                  value={bulk.secondField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`thirdField`}
                                  label={`Third field`}
                                  value={bulk.thirdField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`fourthField`}
                                  label={`Fourth field`}
                                  value={bulk.fourthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`fifthField`}
                                  label={`Fifth field`}
                                  value={bulk.fifthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`sixthField`}
                                  label={`Sixth field`}
                                  value={bulk.sixthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`seventhField`}
                                  label={`Seventh field`}
                                  value={bulk.seventhField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`eighthField`}
                                  label={`Eighth field`}
                                  value={bulk.eighthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`ninthField`}
                                  label={`Ninth field`}
                                  value={bulk.ninthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`tenthField`}
                                  label={`Tenth field`}
                                  value={bulk.tenthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <div className={styles.labelBulk}>{`Paste in data in bulk (one record per line)`}</div>
                              <textarea rows={25} cols={100} value={bulk.memberData} onChange={(event) => handleBulkEntry(event)}
                                  className={styles.bulkBox}></textarea>
                          </div>
                      }
                      {isBulkEntered &&
                          <div>
                              {duplicateEntries &&
                                  <div className={styles.column}>
                                      <div className={styles.warningText}>{`You have ${duplicateEntries.length} duplicate entries`}</div>
                                      {!duplicateEntries.length ? '' :
                                          <table className={styles.tableStyle}>
                                              <thead>
                                                  <tr>
                                                      <td className={styles.hdr}>First</td>
                                                      <td className={styles.hdr}>Last</td>
  																										<td className={styles.hdr}>Grade level</td>
                                                      <td className={styles.hdr}>Student id</td>
                                                      <td className={styles.hdr}>Email address</td>
                                                      <td className={styles.hdr}>Phone</td>
                                                      <td className={styles.hdr} nowrap={'nowrap'}>Birth date</td>
                                                      <td className={styles.hdr} colSpan={2}>Primary guardian</td>
  																										<td className={styles.hdr}>Email address</td>
                                                      <td className={styles.hdr}>Phone</td>
                                                      <td className={styles.hdr} colSpan={2}>Secondary guardian</td>
                                                      <td className={styles.hdr}>Email address</td>
  																										<td className={styles.hdr}>Phone</td>
                                                 </tr>
                                              </thead>
                                              <tbody>
                                              {duplicateEntries && duplicateEntries.length > 0 && duplicateEntries.map((m, i) =>
                                                  <tr key={i}>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.firstName}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.lastName}</span>
                                                      </td>
  																										<td>
                                                          <span className={styles.txtRed}>{m.gradeLevelCode}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.externalId}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.emailAddress}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.phone}</span>
                                                      </td>
                                                      <td>
                                                          <span className={classes(styles.noWrap, styles.txtRed)}>{m.birthDate}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.firstNameParent1}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.lastNameParent1}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.emailAddressParent1}</span>
                                                      </td>
  																										<td>
                                                          <span className={styles.txtRed}>{m.phoneParent1}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.firstNameParent2}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.lastNameParent2}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.emailAddressParent2}</span>
                                                      </td>
  																										<td>
                                                          <span className={styles.txtRed}>{m.phoneParent2}</span>
                                                      </td>
                                                  </tr>
                                              )}
                                              </tbody>
                                          </table>
                                      }
                                  </div>
                              }
                              <div className={styles.headerText}>{`${learners.length} records will be added`}</div>
                              <table className={styles.tableStyle}>
                                  <thead>
                                      <tr>
                                          <td className={styles.hdr}>First</td>
                                          <td className={styles.hdr}>Last</td>
  																				<td className={styles.hdr}>Grade level</td>
                                          <td className={styles.hdr}>Student id</td>
                                          <td className={styles.hdr}>Email address</td>
                                          <td className={styles.hdr}>Phone</td>
                                          <td className={styles.hdr} nowrap={'nowrap'}>Birth date</td>
                                          <td className={styles.hdr} colSpan={2}>Primary guardian</td>
                                          <td className={styles.hdr}>Email address</td>
  																				<td className={styles.hdr}>Phone</td>
                                          <td className={styles.hdr} colSpan={2}>Secondary guardian</td>
                                          <td className={styles.hdr}>Email address</td>
  																				<td className={styles.hdr}>Phone</td>
                                      </tr>
                                  </thead>
                                  <tbody>
                                  {learners && learners.length > 0 && learners.map((m, i) =>
                                      <tr key={i}>
                                          <td>
                                              <span className={styles.txt}>{m.firstName}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.lastName}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.gradeLevelCode}</span>
                                          </td>
  																				<td>
                                              <span className={styles.txt}>{m.externalId}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.emailAddress}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.phone}</span>
                                          </td>
                                          <td>
                                              <span className={classes(styles.noWrap, styles.txtRed)}>{m.birthDate}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.firstNameParent1}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.lastNameParent1}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.emailAddressParent1}</span>
                                          </td>
  																				<td>
                                              <span className={styles.txt}>{m.phoneParent1}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.firstNameParent2}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.lastNameParent2}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.emailAddressParent2}</span>
                                          </td>
  																				<td>
                                              <span className={styles.txt}>{m.phoneParent2}</span>
                                          </td>
                                      </tr>
                                  )}
                                  </tbody>
                              </table>
                          </div>
                      }
                  </div>
              }
              {/*contactMatches && contactMatches.length > 0 &&
                  <div>
                      <span className={styles.matches}>Found existing contacts: {contactMatches.length}</span><br/>
                      <Accordion allowMultiple={true}>
                          {contactMatches.map( (contactSummary, i) => {
                              return (
                                  <AccordionItem contactSummary={contactSummary} expanded={false} key={i} className={styles.accordionTitle} onTitleClick={() => {}}
                                      showAssignWorkToEditor={false} onContactClick={setContactCurrentSelected} personId={personId}>
                                  <ContactSummary key={i*100} summary={contactSummary} className={styles.contactSummary} showAccessIcon={true}
                                      userPersonId={contactSummary.personId} noShowTitle={true}/>
                                  </AccordionItem>
                              )
                          })}
                      </Accordion>
                  </div>
              */}
              <OneFJefFooter />
              {isShowingNoBulkEntryMessage &&
                  <MessageModal handleClose={handleNoBulkEntryMessageClose} heading={<L p={p} t={`No entries found`}/>}
                     explainJSX={<L p={p} t={`It doesn't appear that there are any records entered in the bulk entry box below.`}/>} isConfirmType={false}
                     onClick={handleNoBulkEntryMessageClose} />
              }
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={`Missing information`}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
          </section>
      )
}

export default withAlert(LearnerAddView)
