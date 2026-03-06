import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './LandingView.css'
const p = 'LandingView'
import L from '../../components/PageLanguage'
import {apiHost} from '../../api_host'
import axios from 'axios'
import globalStyles from '../../utils/globalStyles.css'
import {guidEmpty} from '../../utils/guidValidate'
import MessageModal from '../../components/MessageModal'
import InputText from '../../components/InputText'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Loading from '../../components/Loading'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import LaptopPhone from '../../assets/marketing/JefLaptopPhoneLanding.png'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
//import Recaptcha from 'react-recaptcha';

function LandingView(props) {
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errors, setErrors] = useState({})
  const [isShowingFailedLogin, setIsShowingFailedLogin] = useState(false)
  const [isShowingMatchingRecord, setIsShowingMatchingRecord] = useState(false)
  const [user, setUser] = useState({
                isNewAccount: false,
                orgName: '',
                firstName: '',
                lastName: '',
                username: '',
                clave: '',
                usernameConfirm: '',
                claveConfirm: '',
                recaptchaResponse: '',
            })
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [clave, setClave] = useState('')
  const [usernameConfirm, setUsernameConfirm] = useState('')
  const [claveConfirm, setClaveConfirm] = useState('')
  const [recaptchaResponse, setRecaptchaResponse] = useState('')
  const [setResponse, setSetResponse] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [isShowingSystemUpdateMessage, setIsShowingSystemUpdateMessage] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)

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
    						//Don't do this since it may be the culprit of a false login when the browser is putting in the credentials that the user saved
    						//The user clicks and although the saved credentials should work, there is an error about a bad username and password.  But a second click works.
    						//It's just that the user is thrown with that error and may not continue.
    						// document.getElementById("username").value = window.localStorage.getItem("loginUsername") || '';
    						// document.getElementById("clave").value = '';
                //document.getElementById("username").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
            }
    				let username = window.localStorage.getItem("loginUsername")
    				if (username) setUser({...user, username })
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {loginData} = props
            
    
            if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData.error && !setResponse) {
                if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                    setErrors({username: <L p={p} t={`Username already exists`}/>}); setIsSubmitted(false); setSetResponse(true)
                } else {
    								setErrors({username: <L p={p} t={`Username or password not found`}/>}); setIsSubmitted(false); setSetResponse(true)
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
    
    				event.key === "Enter" && processForm('LOGIN')
            //event.key === "Enter" && handleSystemUpdateMessageOpen();
        
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

  const processForm = (sendToLogin="") => {
    
            // prevent default action. in this case, action is the form submission event
            
            //event && event.preventDefault();
            let errors = {}
    				let missingInfoMessage = []
    
            // if (user.isNewAccount && !user.orgName) {
            //     errors.orgName = "Organization name required";
            //     hasError = true;
            // }
    
            if (user.isNewAccount && !user.firstName) {
                errors.firstName = <L p={p} t={`First name required`}/>
    						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
            }
    
            if (!user.username) {
                errors.username = <L p={p} t={`Please enter your username`}/>
    						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username`}/></div>
            }
            if (!user.clave) {
                errors.clave = <L p={p} t={`Please enter a password.`}/>
    						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password`}/></div>
            } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
                errors.clave = <L p={p} t={`The password and confirmation do not match`}/>
    						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password and confirmation do not match`}/></div>
            }
    
            setErrors(errors)
            if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
                handleManheimGradeCheck(sendToLogin)
                //loginButton.style.display = 'none';  This was used for creating a new account so that a second click wouldn't create a second company and all of the fill-in records.
                setIsSubmitted(true); setSetResponse(false)
    						window.localStorage.setItem("loginUsername", user.username)
    						//window.localStorage.setItem("clave", user.clave);
    				} else {
    						handleMissingInfoOpen(missingInfoMessage)
            }
        
  }

  const handleFailedLoginOpen = () => {
    return setIsShowingFailedLogin(true); setIsSubmitted(false)
        handleFailedLoginClose = () => {
            setIsShowingFailedLogin(false)
            props.logout()
  }

  const handleFailedLoginClose = () => {
    
            setIsShowingFailedLogin(false)
            props.logout(); //This is used to clear the error
        
  }

  const handleSystemUpdateMessageOpen = () => {
    return setIsShowingSystemUpdateMessage(true)
        handleSystemUpdateMessageClose = () => {
            setIsShowingSystemUpdateMessage(false)
            processForm('LOGIN')
  }

  const handleSystemUpdateMessageClose = () => {
    
            setIsShowingSystemUpdateMessage(false)
            processForm('LOGIN')
        
  }

  const handleMatchingRecordClose = () => {
    
            setIsShowingMatchingRecord(false)
            props.logout(); //This is used to clear the error
        
  }

  const handleMatchingRecordOpen = () => {
    return setIsShowingMatchingRecord(true)
    
    		handleSelectedFeature = (jefFeatureId) => {
    				//If the feature is selected, remove it. Otherwise, add it.
    				let selectedFeatures = Object.assign([], selectedFeatures)
  }

  const handleSelectedFeature = (jefFeatureId) => {
    
    				//If the feature is selected, remove it. Otherwise, add it.
    				let selectedFeatures = Object.assign([], selectedFeatures)
    				if (selectedFeatures && selectedFeatures.length > 0 && selectedFeatures.indexOf('jefFeatureId') > -1) {
    						selectedFeatures = selectedFeatures.filter(id => id !== jefFeatureId)
    				} else {
    						selectedFeatures = selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures.concat(jefFeatureId) : [jefFeatureId]
    				}
    				setSelectedFeatures(selectedFeatures)
    		
  }

  const hasSelected = (jefFeatureId) => {
    
    				
    				return selectedFeatures && selectedFeatures.length > 0 && selectedFeatures.indexOf(jefFeatureId) > -1
    		
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    		handleMissingInfoClose = () => setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
        handleManheimGradeCheck = (sendToLogin="") => {
            const {login, inviteResponse} = props
  }

  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
        handleManheimGradeCheck = (sendToLogin="") => {
            const {login, inviteResponse} = props
  }

  const handleManheimGradeCheck = (sendToLogin="") => {
    
            const {login, inviteResponse} = props
            let personId = props.personId
            const user = Object.assign({}, user)
            let errors = {}
            let usernameNotGradeLevelManheim = true
            let hasError = false
    
            if (!user.username) {
                hasError = true
                errors.username = "The username is required"
            }
    
            if (!hasError) {
                if (!personId) personId = guidEmpty
                axios.get(`${apiHost}ebi/username/gradeLevelManheim/${personId}/${encodeURIComponent(user.username)}`,
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
                    if (response && response.data === 'NotGradeLevelManheim') {
                        errors.username = 'You are not in open registration. Only the grades that have an open registration can access the system currently.'
                        usernameNotGradeLevelManheim = true
                    } else {
                        errors.username = ''
                        usernameNotGradeLevelManheim = false
                        if (sendToLogin === "LOGIN") login(user, inviteResponse)
                    }
                    setErrors(errors); setUsernameNotGradeLevelManheim(usernameNotGradeLevelManheim)
                })
            }
            setUser(user); setErrors(errors)
        
  }

  // let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
  				// 							 navigator.userAgent &&
  				// 							 navigator.userAgent.indexOf('CriOS') === -1 &&
  				// 							 navigator.userAgent.indexOf('FxiOS') === -1;
  
          return (
              <div className={styles.container}>
  								<div>
  										<div className={styles.centered}>
  												<div className={styles.topLogo}>
  														<img src={eCademy} alt={`eCADEMY.app`} />
  												</div>
  										</div>
  										{false &&
  											<div className={classes(styles.safariMessage)}>
  														<L p={p} t={`Safari error:  There is a known but intermittent problem with the Safari browser.  If the button below does not work, please use another browser, such as Chrome.`}/>
  												</div>
  										}
  										<div className={styles.loginNarrow}>
  												<InputText
  														size={"medium"}
  														name={"username"}
  														label={<L p={p} t={`Username`}/>}
  														value={user.username}
  														onChange={changeUser}
                              onBlur={handleManheimGradeCheck}
  														error={errors.username} />
  												{!usernameNotGradeLevelManheim &&
                              <InputText
      		                        isPasswordType={true}
      		                        size={"medium"}
      		                        value={user.clave}
      		                        name={"clave"}
      		                        onChange={changeUser}
      		                        onEnterKey={handleEnterKey}
      		                        label={<L p={p} t={`Password`}/>}
      														autoComplete={'dontdoit'}
      		                        error={errors.clave} />
                          }
  												{!isSubmitted && !usernameNotGradeLevelManheim &&
  														<div>
  																<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Login`}/>} onClick={() => processForm('LOGIN')} />
  														</div>
  												}
  												{isSubmitted &&
  														<div className={styles.loading}>
  																<Loading isLoading={isSubmitted} />
  														</div>
  												}
  												<br/>
                          {!usernameNotGradeLevelManheim &&
      												<div>
      														<Link to={`/forgotPassword`} className={styles.forgotPassword}><L p={p} t={`Forgot your password?`}/></Link>
      												</div>
                          }
  												<br/>
  												<div>
  				                		<Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
  												</div>
  										</div>
  										<hr/>
  										<div className={classes(styles.contactPosition, styles.centerNarrow)}>
  												<div className={styles.contact}><L p={p} t={`CONTACT`}/></div>
  												<div className={classes(styles.contactInfo, styles.row)}>
  														<a href={'mailto: support@ecademy.app'} className={classes(globalStyles.link, styles.contactEmail)}>{`support@ecademy.app`}</a>
  												</div>
  										</div>
  										<hr/>
  								</div>
  								<div className={styles.laptopPhone}>
  										<img src={LaptopPhone} alt={`eCADEMY.app`} />
  								</div>
  								<div className={styles.textLanding}><L p={p} t={`The same progressive-web-app across all devices`}/></div>
  								<br/>
                  <OneFJefFooter />
  								{isShowingFailedLogin &&
                    <MessageModal handleClose={handleFailedLoginClose} heading={<L p={p} t={`Login`}/>}
                       explainJSX={<L p={p} t={`Your username or password does not match our records.  Please check your entry and try again.`}/>}
                       onClick={handleFailedLoginClose} />
                  }
  								{isShowingSystemUpdateMessage &&
                    <MessageModal handleClose={handleSystemUpdateMessageClose} heading={<L p={p} t={`New System Update`}/>}
                       explainJSX={<L p={p} t={`The system has had a significant update.  If you discover or suspect any function that is not working or any data that is missing, please notify us directly:  support@eCademy.app.`}/>}
                       onClick={handleSystemUpdateMessageClose} />
                  }
  								{isShowingModal_missingInfo &&
  										<MessageModal handleClose={handleMissingInfoClose} heading={`Missing information`}
  											 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  								}
              </div>
          )
}

export default LandingView
