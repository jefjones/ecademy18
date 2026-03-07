import { useEffect, useState } from 'react'
import * as styles from './LoginView.css'
const p = 'LoginView'
import L from '../../components/PageLanguage'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import { Link } from 'react-router-dom'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import OneFJefFooter from '../../components/OneFJefFooter'

function ResetPasswordView(props) {
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [resetMessage, setResetMessage] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [errors, setErrors] = useState({})
  const [user, setUser] = useState({
                clave: '',
                claveConfirm: '',
            })
  const [clave, setClave] = useState('')
  const [claveConfirm, setClaveConfirm] = useState('')

  useEffect(() => {
    
    				//document.getElementById('clave').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            
            const {loginData} = props
    
            if (!isShowingModal && !resetMessage && loginData && loginData.passwordResetComplete) {
                handleMessageOpen()
            }
        
  }, [])

  const changeUser = ({target}) => {
    
            setUser({...user, [target.name]: target.value})
            showLoginButton()
        
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && processForm()
        
  }

  const showLoginButton = () => {
    
            
            if ((user.emailAddress && user.emailAddressConfirm && validateEmail(user.emailAddress)) // && user.clave && user.claveConfirm
            || (!user.isNewAccount && user.emailAddress && validateEmail(user.emailAddress))) { // && user.clave
                setIsUserComplete(true)
            } else {
                setIsUserComplete(false)
            }
        
  }

  const processForm = (event) => {
    
            // prevent default action. in this case, action is the form submission event
            const {setResetPasswordResponse, params} = props
            
    
            event && event.preventDefault()
            let errors = {}
            let hasError = false
    
            if (!user.clave) {
                errors.clave = <L p={p} t={`Please enter a password.`}/>
                hasError = true
    				} else if (user.clave.length < 6) {
                errors.clave = <L p={p} t={`The password must be at least 6 characters long`}/>
                hasError = true
            } else if (user.clave !== user.claveConfirm) {
                errors.clave = <L p={p} t={`The password and confirmation do not match.`}/>
                hasError = true
            }
    
            setErrors(errors); setRequestSent(true)
            if (!hasError && params && params.resetCode) {
                setResetPasswordResponse(params.resetCode, params.emailAddress, user.clave)
    						handleMessageOpen()
            }
        
  }

  const validateEmail = (email) => {
    
            const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
            return re.test(email.toLowerCase())
        
  }

  const handleMessageOpen = () => {
    return setIsShowingModal(true)
    

  }
  const handleMessageClose = () => {
    
            setIsShowingModal(false); setResetMessage(true); setRequestSent(false)
        
  }

  const {loginData} = props
          
  
          return (
              <section className={styles.container}>
                  <div>
  										<a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
  												<img src={eCademy} alt={`eCademyApp`} />
  		                </a>
                  </div>
  								<br/>
                  <div className={styles.login}>
                      <L p={p} t={`Reset Password`}/>
                  </div>
                  <div>
                      <InputText
                          isPasswordType={true}
                          size={"medium-long"}
                          value={user.clave}
  												id={"clave"}
                          name={"clave"}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
                          label={<L p={p} t={`New password`}/>}
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
                          label={<L p={p} t={`Confirm new password`}/>}
                          error={errors.claveConfirm} />
                  </div>
                  {loginData && loginData.passwordResetComplete &&
                      <div className={styles.passwordResetRequest}>
                          <Link className={styles.resetButton} to={`/login`}>
                              <L p={p} t={`Login`}/>
                          </Link>
                      </div>
                  }
                  {(!loginData || (loginData && !loginData.passwordResetComplete)) && !requestSent &&
                      <div>
  												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                      </div>
                  }
                  {isShowingModal && loginData && loginData && loginData.passwordResetComplete &&
  	                  <MessageModal handleClose={handleMessageClose} heading={<L p={p} t={`Password Reset`}/>}
  	                     explain={loginData.passwordResetComplete}
  	                     onClick={handleMessageClose} />
                  }
                  <OneFJefFooter />
              </section>
          )
}

export default ResetPasswordView
