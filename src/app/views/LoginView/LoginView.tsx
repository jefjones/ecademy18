import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './LoginView.css'
const p = 'LoginView'
import L from '../../components/PageLanguage'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import Loading from '../../components/Loading'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
//import Recaptcha from 'react-recaptcha';

function LoginView(props) {
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
    						// document.getElementById("username").value = localStorage.getItem("loginUsername") || '';
    						// document.getElementById("clave").value = '';
                //document.getElementById("username").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
            }
    				let username = localStorage.getItem("loginUsername")
    				if (username) setUser({...user, username })
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {loginData} = props
            
    
            if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData.error && !setResponse) {
                if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                    setErrors({username: <L p={p} t={`This email address (username) is already taken`}/>}); setIsSubmitted(false); setSetResponse(true)
                } else {
    								setErrors({username: <L p={p} t={`The username or password is not found`}/>}); setIsSubmitted(false); setSetResponse(true)
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
            const {login, inviteResponse} = props
            
            event && event.preventDefault()
            let errors = {}
            let hasError = false
    
            if (user.isNewAccount && !user.orgName) {
                errors.orgName = <L p={p} t={`Organization name required`}/>
                hasError = true
            }
    
            if (user.isNewAccount && !user.firstName) {
                errors.firstName = <L p={p} t={`First name required`}/>
                hasError = true
            }
    
            if (!user.username) {
                errors.username = <L p={p} t={`Please enter your username`}/>
                hasError = true
            // } else if (!validateEmail(user.username)) {
            //     errors.username = <L p={p} t={`Email address appears to be invalid`}/>;
            //     hasError = true;
            }
            if (!user.clave) {
                errors.clave = <L p={p} t={`Please enter a password.`}/>
                hasError = true
            } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
                errors.clave = <L p={p} t={`The password and confirmation do not match`}/>
                hasError = true
            }
    
            // if (user.isNewAccount && !user.recaptchaResponse) {
            //     errors.recaptcha = <L p={p} t={`Please verify that you are not a robot`}/>;
            //     hasError = true;
            // }
            setErrors(errors)
            //Help ToDo - put the secure password length and details in.
            if (!hasError) {
                login(user, inviteResponse)
                //loginButton.style.display = 'none';  This was used for creating a new account so that a second click wouldn't create a second company and all of the fill-in records.
                setIsSubmitted(true); setSetResponse(false)
    						localStorage.setItem("loginUsername", user.username)
    						localStorage.setItem("clave", user.clave)
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

  const handleMatchingRecordClose = () => {
    
            setIsShowingMatchingRecord(false)
            props.logout(); //This is used to clear the error
        
  }

  const handleMatchingRecordOpen = () => {
    return setIsShowingMatchingRecord(true)
    
        render() {
            
  }

  return (
            <section className={styles.container}>
                <a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
										<img src={eCademy} alt={`eCademyApp`} />
                </a>
								<form>
		                <div className={styles.textLogo}>
		                    <span className={styles.textBeforeLogo}>
		                        {user.isNewAccount &&
		                            <span onClick={loginControls} className={styles.signUp}>
		                            	<L p={p} t={`Sign in`}/>
		                            </span>
		                        }
		                        {!user.isNewAccount && <span className={styles.chosen}> <L p={p} t={`Sign in`}/> </span>}
		                    </span>
		                </div>
										{/*<div className={styles.newsUpdate}>
												March 21, Thursday:  The messaging pages have been reworked to function better and to display messages with full threads.
										</div>*/}
		                {user.isNewAccount &&
		                    <div>
		                        <InputText
		                            size={"medium-long"}
		                            name={"orgName"}
		                            label={<L p={p} t={`Organization name`}/>}
		                            value={user.orgName}
		                            onChange={changeUser}
		                            onEnterKey={handleEnterKey}
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
		                }
		                <div>
		                    <InputText
		                        size={"medium-long"}
		                        name={"username"}
		                        label={<L p={p} t={`Username`}/>}
		                        value={user.username}
		                        onChange={changeUser}
		                        onEnterKey={handleEnterKey}
		                        error={errors.username} />
		                </div>
		                {user.isNewAccount &&
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
		                }
		                <div>
		                    <InputText
		                        isPasswordType={true}
		                        size={"medium-long"}
		                        value={user.clave}
		                        name={"clave"}
		                        onChange={changeUser}
		                        onEnterKey={handleEnterKey}
		                        label={<L p={p} t={`Password`}/>}
														autoComplete={'dontdoit'}
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
		                            label={<L p={p} t={`Password confirm`}/>}
																autoComplete={'dontdoit'}
		                            error={errors.claveConfirm} />
		                    </div>
		                }
		                {/*user.isNewAccount &&
		                    <div className={styles.recaptcha}>
		                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={verifyCallback}/>
		                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
		                    </div>
		                    */
		                }
		                <div className={styles.row}>
		                    {!isSubmitted &&
														<ButtonWithIcon label={user.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Login`}/>} icon={'checkmark_circle'} onClick={processForm}/>
												}
												{isSubmitted &&
														<div className={styles.loading}>
																<Loading isLoading={isSubmitted} />
														</div>
												}
		                </div>
										<Link to={`/forgotPassword`} className={styles.forgotPassword}><L p={p} t={`Forgot your password?`}/></Link>
										<br/>
										<br/>
		                <Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
										<br/>
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
            </section>
        )
}

export default LoginView


// <br/>
// <Link to={`/createNewSchool`} className={classes(styles.bold, styles.forgotPassword)}>Create your own eCademyApp School</Link>
