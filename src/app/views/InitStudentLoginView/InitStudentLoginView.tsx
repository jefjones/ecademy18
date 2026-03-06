import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './InitStudentLoginView.css'
import InputText from '../../components/InputText'
import TextDisplay from '../../components/TextDisplay'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function InitStudentLoginView(props) {
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errors, setErrors] = useState({})
  const [user, setUser] = useState({
                username: '', //'addisyn@penspring.com', // '', //
                clave: '', //'j',
                claveConfirm: '',
            })
  const [username, setUsername] = useState('')
  const [clave, setClave] = useState('')
  const [claveConfirm, setClaveConfirm] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(true)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')

  const {username} = props
          
  
          return (
              <section className={styles.container}>
  								<form>
  										<div className={styles.topLogo}>
  												<a href={'https://www.eCademy.app'} target={'_eCademyApp'}>
  														<img src={eCademy} alt={`eCademyApp`} />
  				                </a>
  										</div>
  										<div className={classes(globalStyles.pageTitle, styles.width, styles.moreTop)}>
  					              Reset Password
  					          </div>
  										<TextDisplay label={<L p={p} t={`Username`}/>} text={username} />
  		                <div>
  		                    <InputText
  														label={<L p={p} t={`New Password`}/>}
  		                        isPasswordType={true}
  		                        size={"medium-long"}
  		                        value={user.clave || ''}
  		                        id={"clave"}
  		                        name={"clave"}
  		                        onChange={changeUser}
  		                        onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={user.clave}
  		                        error={errors.clave} />
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
  												<ButtonWithIcon label={user.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Login`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  		                </div>
  		                <hr />
  								</form>
                  <OneFJefFooter />
  								{isShowingModal_missingInfo &&
  										<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  											 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  								}
              </section>
          )
}

export default InitStudentLoginView
