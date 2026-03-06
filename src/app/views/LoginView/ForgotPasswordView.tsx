import { useEffect, useState } from 'react'
import styles from './LoginView.css'
const p = 'LoginView'
import L from '../../components/PageLanguage'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import OneFJefFooter from '../../components/OneFJefFooter'
import ButtonWithIcon from '../../components/ButtonWithIcon'

function ForgotPasswordView(props) {
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [resetError, setResetError] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [user, setUser] = useState({
                username: '',
            })
  const [username, setUsername] = useState('')
  const [errorUsername, setErrorUsername] = useState(undefined)

  useEffect(() => {
    
    				//document.getElementById('username').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            
            const {loginData} = props
    
            if (!isShowingModal && !resetError && loginData.passwordResetRequest) {
                //handleMessageOpen();
            }
        
  }, [])

  const changeUser = (event) => {
    
            const field = event.target.name
            let user = user
            user[field] = event.target.value
            field === "username" && setErrorUsername('')
            if (field === "username") user[field] = user[field].replace(/ /g, "")
            setUser(user)
        
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && processForm()
        
  }

  const processForm = (event) => {
    
            // prevent default action. in this case, action is the form submission event
            const {forgotPassword} = props
            
            event && event.preventDefault()
            let errors = {}
            let hasError = false
    
            if (!user.username) {
                errors.username = <L p={p} t={`Please enter your username.`}/>
                hasError = true
            }
    
            setErrors(errors)
            if (!hasError) {
                forgotPassword(user.username, user.phone, props.salta)
    						setIsSubmitted(true)
            }
        
  }

  const validateEmail = (email) => {
    
            const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
            return re.test(email.toLowerCase())
        
  }

  const handleMessageClose = () => {
    
            setIsShowingModal(false); setResetError(true)
        
  }

  const handleMessageOpen = () => {
    return setIsShowingModal(true)
    
        render() {
            
  }

  return (
            <section className={styles.container}>
                <div className={styles.logoPosition}>
										<a href={'https://www.eCademy.app'} target={'_eCademyApp'}>
												<img src={eCademy} alt={`eCademyApp`} />
		                </a>
                </div>
                <div className={styles.login}>
                    <L p={p} t={`Request to Reset Password`}/>
                </div>
                <div>
                    <InputText
                        size={"medium-long"}
                        name={"username"}
												label={<L p={p} t={`Please enter your username`}/>}
                        value={user.username}
                        onChange={changeUser}
                        onEnterKey={handleEnterKey}
                        error={errors.username} />
                </div>
                <div className={styles.centered}>
										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
										{isSubmitted &&
                        <div>
    												<div className={styles.forgotPassword}>
    														<L p={p} t={`A link has been sent to your email and/or by text message to reset your password.`}/>
    												</div>
                            <div className={styles.forgotPassword}>
    														<L p={p} t={`If you do not receive an email or text notification, please contact your school's eCademy administrator who can reset your password.`}/>
    												</div>
                        </div>
										}
                </div>
                {isShowingModal && //loginData.passwordResetRequest &&
                  <MessageModal handleClose={handleMessageClose} heading={<L p={p} t={`Password Reset`}/>}
                     explainJSX={<L p={p} t={`An email has been sent to the email address that has been entered`}/>}
                     onClick={handleMessageClose} />
                }
                <OneFJefFooter />
            </section>
        )
}

export default ForgotPasswordView

//explain={loginData.passwordResetRequest
