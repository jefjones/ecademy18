import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
const p = 'RegistrationLoginView'
import L from '../../components/PageLanguage'
import styles from './RegistrationLoginView.css'
import globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import Loading from '../../components/Loading'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import {apiHost} from '../../api_host'
import axios from 'axios'
import OneFJefFooter from '../../components/OneFJefFooter'
import {guidEmpty} from '../../utils/guidValidate'
//import Recaptcha from 'react-recaptcha';

function RegistrationLoginView(props) {
  const [showNewRegLogin, setShowNewRegLogin] = useState(false)
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errors, setErrors] = useState({})
  const [isShowingFailedLogin, setIsShowingFailedLogin] = useState(false)
  const [isShowingMatchingRecord, setIsShowingMatchingRecord] = useState(false)
  const [user, setUser] = useState({
                isNewAccount: (props.params.schoolCode || props.params.schoolRegistrationCode) ? true : false,
                orgName: '',
                username: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                clave: '',
                claveConfirm: '',
                emailAddressConfirm: '',
                recaptchaResponse: '',
                schoolYearId: '6B64B061-8E35-403F-A16E-B4A7F1318439',
            })
  const [isNewAccount, setIsNewAccount] = useState((props.params.schoolCode || props.params.schoolRegistrationCode) ? true : false)
  const [orgName, setOrgName] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [clave, setClave] = useState('')
  const [claveConfirm, setClaveConfirm] = useState('')
  const [emailAddressConfirm, setEmailAddressConfirm] = useState('')
  const [recaptchaResponse, setRecaptchaResponse] = useState('')
  const [schoolYearId, setSchoolYearId] = useState('6B64B061-8E35-403F-A16E-B4A7F1318439')
  const [isVerify, setIsVerify] = useState(undefined)
  const [isSubmitted, setIsSubmitted] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [missingInfoMessage, setMissingInfoMessage] = useState(undefined)

  useEffect(() => {
    
            const {setRegistrationSchoolCode, params, registrationLogin, accessRoles} = props
    				
            if (params && params.schoolCode) {
                setRegistrationSchoolCode(params.schoolCode)
            }
    				if (showNewRegLogin) {
    						document.getElementById("emailAddress").value = ''
    						document.getElementById("clave").value = ''
    						if (document.getElementById("claveConfirm")) document.getElementById("claveConfirm").value = ''
    						//document.getElementById("firstName") && document.getElementById("firstName").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    				}
    
    				//If this is the admin who is signed in with a registrationPersonId, we will send the user directly to the registrationLogin
    				if (accessRoles.admin && params && params.adminPersonId && params.registrationPersonId) {
    						registrationLogin({}, params.schoolCode, params.adminPersonId, params.registrationPersonId)
    				}
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            
            const {loginData} = props
    
            if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData.error) {
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

  const changeUser = ({target}) => {
    
    				let user = Object.assign({}, user)
    				let field = target.name
    				user[field] = target.value
    				if (field === 'username') user[field] = user[field].replace(' ', '')
            setUser(user); setErrors({...errors, username: '' })
            showLoginButton()
        
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && processForm()
        
  }

  const handleUsernameCheck = () => {
    
            const {personId} = props
            const user = Object.assign({}, user)
            let errors = {}
            let isVerify = false
            let usernameExists = true
            let hasError = false
    
            if (!user.username) {
                hasError = true
                errors.username = "The username is required"
            }
    
            if (!hasError) {
                axios.get(`${apiHost}ebi/username/verify/${personId}/${encodeURIComponent(user.username)}`,
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
    
                    if (response.data === 'FOUND') {
                        errors.username = 'Username already exists'
                        usernameExists = true
                    } else {
                        errors.username = ''
                        usernameExists = false
                    }
                    isVerify = true
                    setUser(user); setErrors(errors); setIsVerify(isVerify); setUsernameExists(usernameExists)
                })
            }
            setUser(user); setErrors(errors)
        
  }

  const showLoginButton = () => {
    
            
            if ((user.isNewAccount && user.username && !state.usernameExists && user.firstName && user.emailAddress && user.emailAddressConfirm && validateEmail(user.emailAddress) && user.clave && user.claveConfirm)
            			|| (!user.isNewAccount && user.emailAddress && validateEmail(user.emailAddress) && user.clave)) {
                setIsUserComplete(true)
            } else {
                setIsUserComplete(false)
            }
        
  }

  const toggleNewAccount = () => {
    
    				setUser({...user, isNewAccount: !user.isnewAccount})
    		
  }

  const registerNewAccount = () => {
    
            let user = Object.assign({}, user)
            user.isNewAccount = true
            setUser(user)
            showLoginButton()
            //document.getElementById("firstName").focus();
        
  }

  const loginControls = () => {
    
            let user = user
            user.isNewAccount = false
            setUser(user)
            showLoginButton()
            //document.getElementById("emailAddress").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
        
  }

  const validateEmail = (email) => {
    
            const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
            return re.test(email.toLowerCase())
        
  }

  const processForm = (event) => {
    
            const {registrationLogin, registrationSchoolCode, companyConfig} = props
            
            event && event.preventDefault()
            let errors = {}
            let hasError = false
            let missingInfoMessage = []
            setUser({...user}); setSchoolYearId('6B64B061-8E35-403F-A16E-B4A7F1318439')
    
            if (!user.schoolYearId || user.schoolYearId === "0" || user.schoolYearId === guidEmpty) {
                errors.schoolYear = "School year is required"
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`School year is required`}/></div>
                hasError = true
            }
    
            if (user.isNewAccount && !user.firstName) {
                errors.firstName = "First name required"
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
                hasError = true
            }
    
            if (user.isNewAccount && !user.username) {
                errors.username = "Username required"
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username`}/></div>
                hasError = true
            }
    
            if (usernameExists) {
                errors.username = "Username already exists"
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username already exists`}/></div>
                hasError = true
            }
    
            if (!user.emailAddress) {
                errors.emailAddress = "Please enter your email address"
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address`}/></div>
                hasError = true
            } else if (!validateEmail(user.emailAddress)) {
                errors.emailAddress = "Email address appears to be invalid"
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address appears to be invalid`}/></div>
                hasError = true
            }
    
            if (!user.clave) {
                errors.clave = "Please enter a password."
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password.`}/></div>
                hasError = true
    				} else if (user.clave.length < 6) {
                errors.clave = "Password must be at least 6 characters long."
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password must be at least 6 characters long.`}/></div>
                hasError = true
            } else if (user.clave !== user.claveConfirm) {
                errors.clave = "The password and confirmation do not match"
                missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The password and confirmation do not match`}/></div>
                hasError = true
            }
    
            // if (user.isNewAccount && !user.recaptchaResponse) {
            //     errors.recaptcha = "Please verify that you are not a robot";
            //     hasError = true;
            // }
            setErrors(errors)
    
            if (!hasError) {
    						user.companyId = companyConfig.companyId
                registrationLogin(user, registrationSchoolCode)
                //loginButton.style.display = 'none';
                setIsSubmitted(true)
    				} else {
    						handleMissingInfoOpen(missingInfoMessage)
            }
    
        
  }

  const handleFailedLoginOpen = () => {
    setIsShowingFailedLogin(true)
  }

  const handleFailedLoginClose = () => {
    
            setIsShowingFailedLogin(false)
            props.logout(); //This is used to clear the error
        
  }

  const handleMatchingRecordOpen = () => {
    setIsShowingMatchingRecord(true)
  }

  const handleMatchingRecordClose = (event) => {
    
            setIsShowingMatchingRecord(false)
            navigate('/login')
    				event.preventDefault()
    				event.stopPropagation()
        
  }

  const handleMissingInfoOpen = (missingInfoMessage) => {
    setIsShowingModal_missingInfo(true); setMissingInfoMessage(missingInfoMessage)
  }

  const handleMissingInfoClose = () => {
    setIsShowingModal_missingInfo(false); setMissingInfoMessage('')
  }

  const {loginData, schoolYears, companyConfig={}} = props
          
  				let companyName = companyConfig && companyConfig.name && companyConfig.name !== 'undefined' ? companyConfig.name : ''
  
  				// let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
  				//                navigator.userAgent &&
  				//                navigator.userAgent.indexOf('CriOS') === -1 &&
  				//                navigator.userAgent.indexOf('FxiOS') === -1;
  
          return (
              <div className={styles.container}>
                  <Link className={styles.topLogo} to={'/'}>
  										<div className={styles.schoolName}>{companyName + ' Registration'}</div>
                  </Link>
  								<a className={styles.topLogo} href={'https://www.eCademy.app'}>
  										{companyConfig.logoFileUrl
  												? <img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
  												: <img src={eCademy} alt={`eCademyApp`} />
  										}
                  </a>
  								{false &&
  										<div className={classes(styles.safariMessage)}>
  												Safari error:  There is a known but intermittent problem with the Safari browser.  If the button below does not work, please use another browser, such as Chrome.
  										</div>
  								}
                  {companyConfig.urlcode === 'Liahona' &&
                      <div className={styles.center}>
                          <div className={globalStyles.instructionsBiggest}>
                              2019-2020 Registration:  Click on the link below according to the type of student:  Distance Learning or Academy (attending in person).
                          </div>
                          <br/>
  												<br/>
                          <div className={styles.row}>
                              <div className={classes(styles.boldText, styles.moreRight)}>Distance learning registration:</div>
                              <a href={`https://form.jotform.com/200843541704146`} className={styles.boldText}>https://form.jotform.com/200843541704146</a>
                          </div>
                          <br/>
  												<br/>
                          <div className={styles.row}>
                              <div className={classes(styles.boldText, styles.moreRight)}>Academy (attending in person):</div>
                              <a href={`https://form.jotform.com/200843541704146`}  className={styles.boldText}>https://form.jotform.com/200854262339152</a>
                          </div>
  												<br/>
  												<br/>
  										</div>
                  }
  								{!showNewRegLogin &&
  										<div className={styles.center}>
                          {/* companyConfig.urlcode !== 'Liahona' &&
                              <div>
          												<div className={globalStyles.instructionsBiggest}>
          														If your student was attending this school last year,<br/>
          														let's go to your existing account:
          												</div>
          												<button className={styles.button} onClick={() => navigate(`/login`)}>
          														{'Returning'}
          												</button>
          												<br/>
                              </div>
                          */}
  												<br/>
  												<div className={globalStyles.instructionsBiggest}>
  														Current school year (2019-2020):  If you are new to this school, let's create a new account:
  												</div>
  												<button className={styles.button} onClick={() => setShowNewRegLogin(true)}>{'New Account'}</button>
  												<br/>
  												<br/>
  										</div>
  								}
  								{showNewRegLogin &&
  										<div className={styles.center}>
  												<form>
  						                <div className={styles.textLogo}>
  						                    <span className={styles.textBeforeLogo}>
  						                        {user.isNewAccount &&
  																				<div>
  																						<div className={styles.chosen}>Create a New Account</div>
  																						<div className={classes(styles.row, styles.instructions)}>
  																								Do you have an existing account?
  																								<Link to={'/login'} className={styles.signUp}>
  										                            		Sign in
  										                            </Link>
  																						</div>
  																				</div>
  						                        }
  						                        {!user.isNewAccount &&
  																				<div className={classes(styles.row, styles.instructions)}>
  																						<div className={styles.chosen}>Sign in</div>
  																						or create a
  																						<div onClick={toggleNewAccount} className={styles.signUp}>
  								                            		new account
  								                            </div>
  																				</div>
  																		}
  						                    </span>
  						                </div>
  						                {user.isNewAccount &&
  						                    <div>
  																		<div className={classes(styles.instructions, styles.red, styles.width)}>
  																				{`Create an account as the primary guardian`}
  																		</div>
  																		<div className={styles.muchMoreLeft}>
  																				<SelectSingleDropDown
  																						id={`schoolYearId`}
  																						label={`School year`}
  																						value={user.schoolYearId || ''}
  																						options={schoolYears}
  																						height={`medium`}
                                              noBlank={true}
  																						onChange={changeUser}
  																						error={errors.schoolYear}/>
  																		</div>
                                      <div className={styles.row}>
      						                        <InputText
      						                            size={"medium"}
      						                            name={"username"}
      						                            value={user.username}
      						                            onChange={changeUser}
      						                            label={'Username'}
      						                            error={errors.username}
                                              onBlur={handleUsernameCheck} />
  
                                          <div onClick={handleUsernameCheck} className={classes(globalStyles.link, styles.row, styles.muchTop)} tabIndex={-1}>
                                              <Icon pathName={isVerify ? usernameExists ? 'cross_circle' : 'checkmark0' : 'question_circle'}  tabIndex={-1}
                                                  className={styles.icon} premium={true} fillColor={isVerify ? usernameExists ? 'red' : 'green' : ''}/>
                                              <div className={classes(globalStyles.link, styles.moreTop, styles.moreLeft)}>Verify</div>
                                          </div>
                                      </div>
  
  						                        <div className={styles.nameFull}>
  						                            <InputText
  						                                size={"medium-left"}
  						                                name={"firstName"}
  						                                label={`First name`}
  						                                value={user.firstName}
  						                                onChange={changeUser}
  						                                onEnterKey={handleEnterKey}
  						                                error={errors.firstName} />
  
  						                            <InputText
  						                                size={"medium-right"}
  						                                name={"lastName"}
  						                                label={`Last name`}
  						                                value={user.lastName}
  						                                onEnterKey={handleEnterKey}
  						                                onChange={changeUser}
  						                                error={errors.lastName} />
  						                        </div>
  						                    </div>
  						                }
  						                <div>
  						                    <InputText
  						                        size={"medium-long"}
  						                        name={"emailAddress"}
  						                        label={`Email address`}
  						                        value={user.emailAddress}
  						                        onChange={changeUser}
  						                        onEnterKey={handleEnterKey}
  						                        error={errors.emailAddress} />
  						                </div>
  						                {user.isNewAccount &&
  						                    <div>
  						                        <InputText
  						                            size={"medium-long"}
  						                            name={"emailAddressConfirm"}
  						                            value={user.emailAddressConfirm}
  						                            onChange={changeUser}
  						                            onEnterKey={handleEnterKey}
  						                            label={"Confirm email address"}
  						                            error={errors.emailAddressConfirm} />
  						                        </div>
  						                }
  						                <div>
  						                    <InputText
  						                        isPasswordType={true}
  						                        size={"medium-long"}
  						                        value={user.clave}
  						                        name={"clave"}
  						                        onChange={changeUser}
  						                        onEnterKey={handleEnterKey}
  						                        label={"Password"}
  						                        error={errors.clave} />
  						                </div>
  						                {user.isNewAccount &&
  						                    <div>
  						                        <InputText
  						                            isPasswordType={true}
  						                            size={"medium-long"}
  						                            value={user.claveConfirm}
  						                            name={"claveConfirm"}
  						                            onChange={changeUser}
  						                            onEnterKey={handleEnterKey}
  						                            label={"Confirm password"}
  						                            error={errors.claveConfirm} />
  						                    </div>
  						                }
  						                {loginData && loginData.error === "Invalid Login" &&
  						                    <div className={styles.errorMessage}>{loginData.error}</div>
  						                }
  						                {/*user.isNewAccount &&
  						                    <div className={styles.recaptcha}>
  						                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={verifyCallback}/>
  						                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
  						                    </div>
  						                    */
  						                }
  												</form>
  				                <div>
  												{isSubmitted
  														? <Loading isLoading={true} loadingText={'Loading'} />
  														: <button type="submit" className={styles.loginButton}
  					                            onClick={processForm} ref={(ref) => (loginButton = ref)}>
  					                        {user.isNewAccount ? 'Create' : 'Login'}
  					                    </button>
  												}
  				                </div>
  				                <Link to={`/forgotPassword/salta`} className={styles.forgotPassword}>Forgot your password?</Link>
  										</div>
  								}
                  <OneFJefFooter />
                  {isShowingFailedLogin &&
                    <MessageModal handleClose={handleFailedLoginClose} heading={`Login`}
                       explainJSX={user.isNewAccount
                          ? <L p={0} t={`There was a problem.  Please check your entry and try again or contact the front desk.`}/>
                          : <L p={0} t={`Your username or password does not match our records.  Please check your entry and try again or create a new account.`}/>
                       }
                       onClick={handleFailedLoginClose} />
                  }
                  {isShowingMatchingRecord &&
                    <MessageModal handleClose={handleMatchingRecordClose} heading={`Login`}
                       explainJSX={<L p={0} t={`A new account has been requested but there is a matching email address in our records.  You will be routed to the login page.  If you have forgotten your password, please choose 'Forgot your password?' option to reset your password.`}/>}
                       onClick={handleMatchingRecordClose} />
                  }
  								{isShowingModal_missingInfo &&
  										<MessageModal handleClose={handleMissingInfoClose} heading={`Missing information`}
  											 explainJSX={missingInfoMessage} onClick={handleMissingInfoClose} />
  								}
              </div>
          )
}

export default RegistrationLoginView


//, (isUserComplete ? styles.opacityFull : styles.opacityLow)

				                // <ButtonWithIcon label={'New to Liahona'} icon={'checkmark_circle'} onClick={this.setShowNewRegLogin} />
												// <ButtonWithIcon label={'Returning'} onClick={() => navigate(`/login`)} icon={'undo2'} />
