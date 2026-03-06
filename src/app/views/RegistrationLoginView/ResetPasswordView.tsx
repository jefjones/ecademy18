import { useEffect, useState } from 'react'
import styles from './LoginView.css'
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

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            
            const {loginData} = props
    
            if (!isShowingModal && !resetMessage && loginData && loginData.passwordResetComplete) {
                handleMessageOpen()
            }
        
  }, [])

  const handleMessageClose = () => {
    
            setIsShowingModal(false); setResetMessage(true); setRequestSent(false)
        
  }

  const handleMessageOpen = () => {
    return setIsShowingModal(true)
    

  const {loginData} = props
          
  
          return (
              <section className={styles.container}>
                  <div>
  										<a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
  												<img src={eCademy} alt={`eCademyApp`} />
  		                </a>
                  </div>
                  <div className={styles.login}>
                      Reset Password
                  </div>
                  <div>
                      <InputText
                          isPasswordType={true}
                          size={"medium-long"}
                          value={user.clave}
                          name={"clave"}
                          label={``}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
                          placeholder={"password"}
                          error={errors.clave} />
                  </div>
                  <div>
                      <InputText
                          isPasswordType={true}
                          size={"medium-long"}
                          value={user.claveConfirm}
                          name={"claveConfirm"}
                          label={``}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
                          placeholder={"password confirm"}
                          error={errors.claveConfirm} />
                  </div>
                  {loginData && loginData.passwordResetComplete &&
                      <div className={styles.passwordResetRequest}>
                          <Link className={styles.resetButton} to={`/login`}>
                              Login
                          </Link>
                      </div>
                  }
                  {(!loginData || (loginData && !loginData.passwordResetComplete)) && !requestSent &&
                      <div>
  												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={processForm}/>
                      </div>
                  }
                  {isShowingModal && loginData && loginData && loginData.passwordResetComplete &&
                    <MessageModal handleClose={handleMessageClose} heading={`Password Reset`}
                       explain={loginData.passwordResetComplete}
                       onClick={handleMessageClose} />
                  }
                  <OneFJefFooter />
              </section>
          )
}

export default ResetPasswordView
