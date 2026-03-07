import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import * as styles from './ProfileResetPasswordView.css'
import InputText from '../../components/InputText'
import TextDisplay from '../../components/TextDisplay'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function ProfileResetPasswordView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errors, setErrors] = useState({})
  const [user, setUser] = useState({
            })
  const [isInit, setIsInit] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(true)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {loginData} = props
            
            if (!isInit && loginData && loginData.username) {
    			      setUser(loginData); setIsInit(true)
            }
    		
  }, [])

  const {loginData} = props
          
          return (
              <section className={styles.container}>
  								<form>
  										<a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
  												<img src={eCademy} alt={`eCademyApp`} />
  		                </a>
  										<br/>
  										<br/>
  										<br/>
  										<div className={classes(globalStyles.pageTitle, styles.width)}>
  					              <L p={p} t={`Reset Password`}/>
  					          </div>
  										<TextDisplay label={'Username'} text={loginData && loginData.username} />
  										<div>
  		                    <InputText
  														label={<L p={p} t={`Old Password`}/>}
  		                        isPasswordType={true}
  		                        size={"medium-long"}
  		                        value={user.oldClave || ''}
  		                        id={"oldClave"}
  		                        name={"oldClave"}
  		                        onChange={changeUser}
  		                        onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={user.oldClave}
  		                        error={errors.oldClave} />
  		                </div>
                      <hr/>
  		                <div>
  		                    <InputText
  														label={<L p={p} t={`New Password`}/>}
  		                        isPasswordType={true}
  		                        size={"medium-long"}
  		                        value={user.newClave || ''}
  		                        id={"newClave"}
  		                        name={"newClave"}
  		                        onChange={changeUser}
  		                        onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={user.newClave}
  		                        error={errors.newClave} />
  		                </div>
  		                <div>
  		                    <InputText
  														label={<L p={p} t={`New Password confirm`}/>}
  		                        isPasswordType={true}
  		                        size={"medium-long"}
  		                        value={user.claveConfirm || ''}
  		                        name={"claveConfirm"}
  		                        onChange={changeUser}
  		                        onEnterKey={handleEnterKey}
  														required={true}
  														whenFilled={user.claveConfirm}
  		                        error={errors.claveConfirm} />
  		                </div>
  		                <div>
  												<ButtonWithIcon label={user.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  		                </div>
  		                <hr />
  								</form>
                  <OneFJefFooter />
              </section>
          )
}

export default withAlert(ProfileResetPasswordView)
