import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './CreateNewSchoolView.css'
const p = 'CreateNewSchoolView'
import L from '../../components/PageLanguage'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Checkbox from '../../components/Checkbox'
import RadioGroup from '../../components/RadioGroup'
import Loading from '../../components/Loading'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import OneFJefFooter from '../../components/OneFJefFooter'
//import Recaptcha from 'react-recaptcha';

function CreateNewSchoolView(props) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errors, setErrors] = useState({})
  const [isShowingFailedLogin, setIsShowingFailedLogin] = useState(false)
  const [isShowingMatchingRecord, setIsShowingMatchingRecord] = useState(false)
  const [user, setUser] = useState({
                isNewAccount: true,
                orgName: '',
                firstName: '',
                lastName: '',
                username: '',
                clave: '',
                usernameConfirm: '',
                claveConfirm: '',
                recaptchaResponse: '',
								demoDetails: true,
								gradingType: 'TRADITIONAL',
                intervalType: 'SEMESTERS'
            })
  const [isNewAccount, setIsNewAccount] = useState(true)
  const [orgName, setOrgName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [clave, setClave] = useState('')
  const [usernameConfirm, setUsernameConfirm] = useState('')
  const [claveConfirm, setClaveConfirm] = useState('')
  const [recaptchaResponse, setRecaptchaResponse] = useState('')
  const [demoDetails, setDemoDetails] = useState(true)
  const [gradingType, setGradingType] = useState('TRADITIONAL')
  const [intervalType, setIntervalType] = useState('SEMESTERS')

  useEffect(() => {
    
            const {inviteResponse, params} = props
            if (params && params.createNew === "createNew") {
                setUser({ ...user, isNewAccount: true })
            }
            if (inviteResponse) {
                setUser({
                        isNewAccount: inviteResponse.createNew === "createNew" ? true : false,
                        firstName: inviteResponse.firstName,
                        lastName: inviteResponse.lastName,
                        username: validateEmail(inviteResponse.emailAddress) ? inviteResponse.emailAddress : '',
                        usernameConfirm: validateEmail(inviteResponse.emailAddress) ? inviteResponse.emailAddress : '',
                        clave: '',
                        claveConfirm: '',
                    })
    						//Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
                //validateEmail(inviteResponse.emailAddress) ? document.getElementById("clave").focus() : document.getElementById("username").focus();
            } else {
    						document.getElementById("username").value = localStorage.getItem("loginUsername") || ''
    						document.getElementById("clave").value = ''
                //document.getElementById("username").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
            }
    				let username = localStorage.getItem("loginUsername")
    				if (username) setUser({...user, username })
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {loginData} = props
            
    
            if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData && loginData.error) {
                if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                    handleMatchingRecordOpen()
                } else {
                    handleFailedLoginOpen()
                }
            }
        
  }, [])

  const verifyCallback = (event) => {
    
            setUser({...user, recaptchaResponse: event})
        
  }

  const changeUser = (event) => {
    
            const field = event.target.name
            const user = user
            user[field] = event.target.value
    				if (field.indexOf('username') > -1 || field.indexOf('password') > -1) user[field] = user[field].replace(/ /g, '')
            setUser(user)
            showLoginButton()
        
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && processForm()
        
  }

  const showLoginButton = () => {
    
            
            if ((user.isNewAccount && user.firstName && user.username && user.usernameConfirm && validateEmail(user.username) && user.clave && user.claveConfirm)
            || (!user.isNewAccount && user.username && validateEmail(user.username) && user.clave)) {
                setIsUserComplete(true)
            } else {
                setIsUserComplete(false)
            }
        
  }

  const registerNewAccount = () => {
    
            let user = Object.assign({}, user)
            user.isNewAccount = true
            setUser(user)
            showLoginButton()
            //document.getElementById("firstName").focus();
        
  }

  const loginControls = () => {
    
            let user = Object.assign({}, user)
            user.isNewAccount = false
            setUser(user)
            showLoginButton()
            //document.getElementById("username").focus();
        
  }

  const validateEmail = (email) => {
    
            const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
            return re.test(email.toLowerCase())
        
  }

  const processForm = (event) => {
    
            // prevent default action. in this case, action is the form submission event
            const {login, inviteResponse, organizationNames} = props
            
            event && event.preventDefault()
            let errors = {}
            let hasError = false
    
            if (user.isNewAccount) {
    						let isDuplicate = organizationNames && organizationNames.length > 0 && organizationNames.filter(m => m.label.replace(' ', '').toLowerCase() === user.orgName.replace(' ', '').toLowerCase())[0]
    						if (!user.orgName) {
    		            errors.orgName = <L p={p} t={`Organization name required`}/>
    		            hasError = true
    						} else if (isDuplicate && isDuplicate.label) {
    								errors.orgName = <L p={p} t={`Organization name already exists`}/>
    		            hasError = true
    						}
            }
    
            if (user.isNewAccount && !user.firstName) {
                errors.firstName = <L p={p} t={`First name required`}/>
                hasError = true
            }
    
            if (!user.username) {
                errors.username = <L p={p} t={`Please enter your username`}/>
                hasError = true
            } else if (!validateEmail(user.username)) {
                errors.username = <L p={p} t={`Email address appears to be invalid`}/>
                hasError = true
            }
    
    				// if (loginData.isDuplicateUsername) {
    				// 		hasError = true;
    				// }
    
            if (!user.clave) {
                errors.clave = <L p={p} t={`Please enter a password`}/>
                hasError = true
    				} else if (user.clave.length < 6) {
                errors.clave = <L p={p} t={`The password must be at least 6 characters long`}/>
                hasError = true
            } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
                errors.clave = <L p={p} t={`The password and confirmation do not match`}/>
                hasError = true
            }
    
            // if (user.isNewAccount && !user.recaptchaResponse) {
            //     errors.recaptcha = "Please verify that you are not a robot";
            //     hasError = true;
            // }
            setErrors(errors)
            //Help ToDo - put the secure password length and details in.
            if (!hasError) {
                login(user, inviteResponse)
                //loginButton.style.display = 'none';  This was used for creating a new account so that a second click wouldn't create a second company and all of the fill-in records.
                setIsSubmitted(true)
    						localStorage.setItem("loginUsername", user.username)
            }
        
  }

  const handleFailedLoginOpen = () => {
    return setIsShowingFailedLogin(true); setIsSubmitted(false)

  }
  const handleFailedLoginClose = () => {
    
            setIsShowingFailedLogin(false)
            props.logout(); //This is used to clear the error
        
  }

  const handleMatchingRecordClose = () => {
    
            setIsShowingMatchingRecord(false)
            props.logout(); //This is used to clear the error
        
  }

  const handleMatchingRecordOpen = () => {
    return setIsShowingMatchingRecord(true)
    

  }
  const isDuplicateOrgName = (event) => {
    
    				const {organizationNames} = props
    				
    				let isDuplicate = organizationNames && organizationNames.length > 0 && organizationNames.filter(m => m.label.replace(' ', '').toLowerCase() === user.orgName.replace(' ', '').toLowerCase())[0]
    
    				if (isDuplicate && isDuplicate.label) {
    						errors.orgName = <L p={p} t={`Organization name already exists`}/>
    				}
    				setErrors(errors)
    		
  }

  const checkDuplicateUsername = (event) => {
    
    				props.isDuplicateUsername(event.target.value)
    		
  }

  const toggleDemoDetails = () => {
    
  }

  const handleRadioChoice = (field, value) => {
    
  }

  const {loginData} = props
          
  
          return (
              <div className={styles.container}>
                  <a className={styles.topLogo} href={'https://www.penspring.com'} target={'_penspring'}>
  										<img src={eCademy} alt={`eCademyApp`} />
                  </a>
  								<form>
  		                <div className={styles.textLogo}>
                      		<L p={p} t={`Create New School`}/>
  		                </div>
  										{/*<div className={styles.newsUpdate}>
  												March 21, Thursday:  The messaging pages have been reworked to function better and to display messages with full threads.
  										</div>*/}
                      <div>
                          <InputText
                              size={"medium-long"}
                              name={"orgName"}
                              label={<L p={p} t={`Organization name`}/>}
                              value={user.orgName}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
  														onBlur={isDuplicateOrgName}
                              error={errors.orgName} />
  
                          <div className={styles.nameFull}>
                              <InputText
                                  size={"medium-left"}
                                  name={"firstName"}
                                  label={<L p={p} t={`First name`}/>}
                                  value={user.firstName}
                                  onChange={changeUser}
                                  onEnterKey={handleEnterKey}
                                  error={errors.firstName} />
  
                              <InputText
                                  size={"medium-right"}
                                  name={"lastName"}
                                  label={<L p={p} t={`Last name`}/>}
                                  value={user.lastName}
                                  onEnterKey={handleEnterKey}
                                  onChange={changeUser}
                                  error={errors.lastName} />
                          </div>
                      </div>
  		                <div>
  		                    <InputText
  		                        size={"medium-long"}
  		                        name={"username"}
  		                        label={<L p={p} t={`Email address`}/>} // (which will be your Username)
  		                        value={user.username}
  		                        onChange={changeUser}
  														onBlur={checkDuplicateUsername}
  		                        onEnterKey={handleEnterKey}
  		                        // error={loginData.isDuplicateUsername
  														// 		? <div className={styles.error}>Duplicate username!</div>
  														// 		: errors.username
  														// }
  														/>
  		                </div>
                      <div>
                          <InputText
                              size={"medium-long"}
                              name={"usernameConfirm"}
                              value={user.usernameConfirm}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              label={<L p={p} t={`Confirm email address`}/>}
                              error={errors.usernameConfirm} />
                      </div>
  		                <div>
  		                    <InputText
  		                        isPasswordType={true}
  		                        size={"medium-long"}
  		                        value={user.clave}
  		                        name={"clave"}
  		                        onChange={changeUser}
  		                        onEnterKey={handleEnterKey}
  		                        label={<L p={p} t={`Password`}/>}
  		                        error={errors.clave} />
  		                </div>
                      <div>
                          <InputText
                              isPasswordType={true}
                              size={"medium-long"}
                              value={user.claveConfirm}
                              name={"claveConfirm"}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              label={<L p={p} t={`Password confirm`}/>}
                              error={errors.claveConfirm} />
                      </div>
  		                {loginData && loginData.error === "Invalid Login" &&
  		                    <div className={styles.errorMessage}>
  
  		                    </div>
  		                }
                      {/*<div className={styles.recaptcha}>
                          <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={verifyCallback}/>
                          {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
                      </div>*/}
  										<div className={styles.moreTop}>
  												<RadioGroup
  														data={[{id: 'TRADITIONAL', label: <L p={p} t={`Traditional`}/>}, {id: 'STANDARDSRATING', label: <L p={p} t={`Standards-based`}/>}]}
  														label={<L p={p} t={`Grading Type`}/>}
  														name={`gradingType`}
  														horizontal={true}
  														className={styles.radio}
  														labelClass={styles.radioLabels}
  														radioClass={styles.radioClass}
  														initialValue={user.gradingType}
  														onClick={(value) => handleRadioChoice('gradingType', value)}/>
                          <RadioGroup
  														data={[{id: 'QUARTERS', label: <L p={p} t={`Quarters`}/>}, {id: 'SEMESTERS', label: <L p={p} t={`Semesters`}/>}, {id: 'TRIMESTERS', label: <L p={p} t={`Trimesters`}/>}]}
  														label={<L p={p} t={`Interval type`}/>}
  														name={`intervalType`}
  														horizontal={true}
  														className={styles.radio}
  														labelClass={styles.radioLabels}
  														radioClass={styles.radioClass}
  														initialValue={user.intervalType}
  														onClick={(value) => handleRadioChoice('intervalType', value)}/>
  												<Checkbox
  														id={`demoDetails`}
  														label={<L p={p} t={`Include demo records:  25 students, 2 teachers and 2 courses with assignments`}/>}
  														checked={user.demoDetails}
  														onClick={toggleDemoDetails}
  														labelClass={styles.demoDetails}
  														className={styles.checkbox}/>
  										</div>
  		                <div className={styles.row}>
  		                    {!isSubmitted &&
  														<div className={styles.createButton}>
  																<ButtonWithIcon label={<L p={p} t={`Create`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  														</div>
  												}
  												{isSubmitted &&
  														<div className={styles.loading}>
  																<Loading loadingText={<L p={p} t={`Creating your school app`}/>} isLoading={isSubmitted} refreshTo={`/`}/>
  														</div>
  												}
  		                </div>
  		                <Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
  								</form>
                  <OneFJefFooter />
                  {isShowingFailedLogin &&
                    <MessageModal handleClose={handleFailedLoginClose} heading={<L p={p} t={`Login`}/>}
                       explainJSX={<L p={p} t={`Your username or password does not match our records.  Please check your entry and try again.`}/>}
                       onClick={handleFailedLoginClose} />
                  }
                  {isShowingMatchingRecord &&
                    <MessageModal handleClose={handleMatchingRecordClose} heading={<L p={p} t={`Login`}/>}
                       explainJSX={<L p={p} t={`A new account has been requested but there is a matching email address in our records.  Please choose 'Forgot your password?' option to reset your password and to get access to the existing account.`}/>}
                       onClick={handleMatchingRecordClose} />
                  }
              </div>
          )
}

export default CreateNewSchoolView
