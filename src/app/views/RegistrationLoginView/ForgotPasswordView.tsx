import { useEffect, useState } from 'react'
import styles from './LoginView.css'
const p = 'LoginView'
import L from '../../components/PageLanguage'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import OneFJefFooter from '../../components/OneFJefFooter'

function ForgotPasswordView(props) {
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [resetError, setResetError] = useState(false)
  const [errors, setErrors] = useState({})
  const [user, setUser] = useState({
                emailAddress: '',
            })
  const [emailAddress, setEmailAddress] = useState('')
  const [errorEmailAddress, setErrorEmailAddress] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            
            const {loginData} = props
    
            if (!isShowingModal && !resetError && loginData.passwordResetRequest) {
                handleMessageOpen()
            }
        
  }, [])

  const handleMessageClose = () => {
    
            setIsShowingModal(false); setResetError(true)
        
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
                      <L p={p} t={`Request to Reset Password`}/>
                  </div>
                  <div>
                      <InputText
                          size={"medium-long"}
                          name={"emailAddress"}
                          value={user.emailAddress}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
                          placeholder={<L p={p} t={`email address`}/>}
                          error={errors.emailAddress} />
                  </div>
                  <div>
  										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                  </div>
                  {isShowingModal && loginData.passwordResetRequest &&
                    <MessageModal handleClose={handleMessageClose} heading={<L p={p} t={`Password Reset`}/>}
                       explain={loginData.passwordResetRequest}
                       onClick={handleMessageClose} />
                  }
                  <OneFJefFooter />
              </section>
          )
}

export default ForgotPasswordView
