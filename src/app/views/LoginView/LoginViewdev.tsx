import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './LoginView.css'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
//import Recaptcha from 'react-recaptcha';

function LoginView(props) {
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errors, setErrors] = useState({})
  const [isShowingFailedLogin, setIsShowingFailedLogin] = useState(false)
  const [isShowingMatchingRecord, setIsShowingMatchingRecord] = useState(false)
  const [user, setUser] = useState({
                isNewAccount: false,
                orgName: '',
                firstName: '',
                lastName: '',
                username: 'jef', //'abbylyn', //'22AdairH60', //20AbrahamsonK98 //'Benson7DDA', //'20JonesN46', //'rochellerudd@liahonaed.com',
              	clave: 'j', //'ZSazss',
                //Confirm: '',
                claveConfirm: '',
                recaptchaResponse: '',
            })
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('jef')
  const [clave, setClave] = useState('j')
  const [claveConfirm, setClaveConfirm] = useState('')
  const [recaptchaResponse, setRecaptchaResponse] = useState('')
  const [usernameConfirm, setUsernameConfirm] = useState(undefined)
  const [isSubmitted, setIsSubmitted] = useState(undefined)
  const [setResponse, setSetResponse] = useState(undefined)

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
            } else {
                document.getElementById("username").value = 'jef'; //'abbylyn'; //'22AdairH60'; //'Benson7DDA'; //'20JonesN46'; //'rochellerudd@liahonaed.com';
                document.getElementById("clave").value = 'j'; //'ZSazss';
                //processForm();
            }
    				document.getElementById('username').value = localStorage.getItem("login")
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {loginData} = props
    				
    
            if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData.error && !setResponse) {
                if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                    setErrors({username: 'This email address (username) is already taken'}); setIsSubmitted(false); setSetResponse(true)
                } else {
    								setErrors({username: 'The username or password is not found'}); setIsSubmitted(false); setSetResponse(true)
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
                errors.orgName = "Organization name required"
                hasError = true
            }
    
            if (user.isNewAccount && !user.firstName) {
                errors.firstName = "First name required"
                hasError = true
            }
    
            if (!user.username) {
                errors.username = "Please enter your username"
                hasError = true
            // } else if (!validateEmail(user.username)) {
            //     errors.username = "Email address appears to be invalid";
            //     hasError = true;
            }
    
            if (!user.clave) {
                errors.clave = "Please enter a password."
                hasError = true
            } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
                errors.clave = "The password and confirmation do not match"
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
    						setIsSubmitted(true); setSetResponse(false)
    						localStorage.setItem("login", user.username)
            }
        
  }

  const handleFailedLoginOpen = () => {
    return setIsShowingFailedLogin(true)

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
    

  const {loginData} = props
          
  
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
  		                            	Sign in
  		                            </span>
  		                        }
  		                        {!user.isNewAccount && <span className={styles.chosen}> Sign in </span>}
  		                    </span>
  		                </div>
  		                {user.isNewAccount &&
  		                    <div>
  		                        <InputText
  		                            size={"medium-long"}
  		                            name={"orgName"}
  		                            label={`Organization name`}
  		                            value={user.orgName}
  		                            onChange={changeUser}
  		                            onEnterKey={handleEnterKey}
  		                            error={errors.orgName} />
  
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
  		                        name={"username"}
  		                        label={`Username`}
  		                        value={user.username}
  		                        onChange={changeUser}
  		                        onEnterKey={handleEnterKey}
  		                        error={loginData.isDuplicateUsername && user.isNewAccount
  																? <div className={styles.error}>Duplicate username!</div>
  																: errors.username
  														} />
  		                </div>
  		                {user.isNewAccount &&
  		                    <div>
  		                        <InputText
  		                            size={"medium-long"}
  		                            name={"usernameConfirm"}
  		                            value={user.usernameConfirm}
  		                            onChange={changeUser}
  		                            onEnterKey={handleEnterKey}
  		                            label={"Confirm email address"}
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
  		                            label={"Password confirm"}
  		                            error={errors.claveConfirm} />
  		                    </div>
  		                }
  		                {loginData && loginData.error === "Invalid Login" &&
  		                    <div className={styles.errorMessage}>
  
  		                    </div>
  		                }
  		                {/*user.isNewAccount &&
  		                    <div className={styles.recaptcha}>
  		                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={verifyCallback}/>
  		                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
  		                    </div>
  		                    */
  		                }
  		                <div>
  		                    <button type="submit" className={styles.loginButton} onClick={processForm} ref={(ref) => (loginButton = ref)}>
  		                        {user.isNewAccount ? 'Create' : 'Login'}
  		                    </button>
  		                </div>
  		                <Link to={`/forgotPassword`} className={styles.forgotPassword}>Forgot your password?</Link>
  										<br/>
  										<br/>
  		                <Link to={`/privacy-policy`} className={styles.forgotPassword}>Privacy Policy</Link>
  										<br/>
  										<br/>
  		                <Link to={`/createNewSchool`} className={classes(styles.bold, styles.forgotPassword)}>Create your own eCademyApp School</Link>
  								</form>
                  <OneFJefFooter />
                  {isShowingFailedLogin &&
                    <MessageModal handleClose={handleFailedLoginClose} heading={`Login`}
                       explain={`Your username or password does not match our records.  Please check your entry and try again.`}
                       onClick={handleFailedLoginClose} />
                  }
                  {isShowingMatchingRecord &&
                    <MessageModal handleClose={handleMatchingRecordClose} heading={`Login`}
                       explain={`A new account has been requested but there is a matching email address in our records.  Please choose 'Forgot your password?' option to reset your password and to get access to the existing account.`}
                       onClick={handleMatchingRecordClose} />
                  }
              </section>
          )
}

export default LoginView
