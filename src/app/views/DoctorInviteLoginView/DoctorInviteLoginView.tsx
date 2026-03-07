import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './DoctorInviteLoginView.css'
const p = 'DoctorInviteLoginView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Checkbox from '../../components/Checkbox'
import Loading from '../../components/Loading'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import {apiHost} from '../../api_host'
import axios from 'axios'
import OneFJefFooter from '../../components/OneFJefFooter'
import {emailValidate} from '../../utils/emailValidate'
import {formatPhoneNumber} from '../../utils/numberFormat'
//import Recaptcha from 'react-recaptcha';

function DoctorInviteLoginView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [showNewRegLogin, setShowNewRegLogin] = useState(false)
  const [isOfficeComplete, setIsOfficeComplete] = useState(false)
  const [errors, setErrors] = useState({})
  const [isShowingFailedLogin, setIsShowingFailedLogin] = useState(false)
  const [isShowingMatchingRecord, setIsShowingMatchingRecord] = useState(false)
  const [office, setOffice] = useState({
								isNewAccount: props.params.doctorNoteInviteId ? true : false,
                doctorNoteInviteId: props.params && props.params.doctorNoteInviteId,
                orgName: '',
                username: '',
                firstName: '',
                //lastName: '',  This is going to be set to 'Doctor'
                emailAddress: '',
                clave: '',
								claveConfirm: '',
								emailAddressConfirm: '',
                recaptchaResponse: '',
            })
  const [isNewAccount, setIsNewAccount] = useState(props.params.doctorNoteInviteId ? true : false)
  const [doctorNoteInviteId, setDoctorNoteInviteId] = useState(props.params && props.params.doctorNoteInviteId)
  const [orgName, setOrgName] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [clave, setClave] = useState('')
  const [claveConfirm, setClaveConfirm] = useState('')
  const [emailAddressConfirm, setEmailAddressConfirm] = useState('')
  const [recaptchaResponse, setRecaptchaResponse] = useState('')
  const [isVerify, setIsVerify] = useState(undefined)
  const [isSubmitted, setIsSubmitted] = useState(true)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [missingInfoMessage, setMissingInfoMessage] = useState('')
  const [errorPhone, setErrorPhone] = useState(<L p={p} t={`The phone number entered is not 10 digits`}/>)
  const [p, setP] = useState(undefined)
  const [phone, setPhone] = useState('')

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

  const {loginData, companyConfig={}, usStates} = props
          
  				let companyName = companyConfig && companyConfig.name && companyConfig.name !== 'undefined' ? companyConfig.name : ''
  
          return (
              <div className={styles.container}>
  								<div className={styles.schoolName}><L p={p} t={`Request for Doctor's note for`}/></div>
  								<div className={styles.schoolName}>{companyName}</div>
  								<a className={styles.topLogo} href={'https://www.eCademy.app'}>
  										{companyConfig.logoFileUrl
  												? <img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
  												: <img src={eCademy} alt={`eCademyApp`} />
  										}
                  </a>
  								{false &&
  										<div className={classes(styles.safariMessage)}>
  												<L p={p} t={`Safari error:  There is a known but intermittent problem with the Safari browser.  If the button below does not work, please use another browser, such as Chrome.`}/>
  										</div>
  								}
  								{!showNewRegLogin &&
  										<div className={styles.center}>
  												<div className={globalStyles.instructionsBiggest}>
  														<L p={p} t={`If your doctor's office already has an account for this school or another school,`}/><br/>
  														<L p={p} t={`let's go to your existing account:`}/>
  												</div>
  												<button className={styles.button} onClick={() => navigate(`/login`)}>
  														<L p={p} t={`Returning`}/>
  												</button>
  												<br/>
  												<br/>
  												<div className={globalStyles.instructionsBiggest}>
  														<L p={p} t={`If you are new to eCademy.app,`}/><br/>
  														<L p={p} t={`let's create a new account:`}/>
  												</div>
  												<button className={styles.button} onClick={setShowNewRegLogin}><L p={p} t={`New Account`}/></button>
  												<br/>
  												<br/>
  										</div>
  								}
  								{showNewRegLogin &&
  										<div className={styles.center}>
  												<form>
  						                <div className={styles.textLogo}>
  						                    <span className={styles.textBeforeLogo}>
  						                        {office.isNewAccount &&
  																				<div>
  																						<div className={styles.chosen}><L p={p} t={`Create a New Account`}/></div>
  																						<div className={classes(styles.row, styles.instructions)}>
  																								<L p={p} t={`Do you have an existing account?`}/>
  																								<Link to={'/login'} className={styles.signUp}>
  										                            		<L p={p} t={`Sign in`}/>
  										                            </Link>
  																						</div>
  																				</div>
  						                        }
  						                        {!office.isNewAccount &&
  																				<div className={classes(styles.row, styles.instructions)}>
  																						<div className={styles.chosen}><L p={p} t={`Sign in`}/></div>
  																						<L p={p} t={`or create a`}/>
  																						<div onClick={toggleNewAccount} className={styles.signUp}>
  								                            		<L p={p} t={`new account`}/>
  								                            </div>
  																				</div>
  																		}
  						                    </span>
  						                </div>
  						                {office.isNewAccount &&
  						                    <div>
                                      <div className={styles.row}>
      						                        <InputText
      						                            size={"medium"}
      						                            name={"username"}
      						                            value={office.username}
      						                            onChange={changeOffice}
      						                            //onEnterKey={handleUsernameCheck} don't do this since you can't get rid of spaces and check on keypress at the same time.
      						                            label={<L p={p} t={`Username`}/>}
      						                            error={errors.username}
                                              onBlur={handleUsernameCheck} />
  
                                          <div onClick={handleUsernameCheck} className={classes(globalStyles.link, styles.row, styles.muchTop)} tabIndex={-1}>
                                              <Icon pathName={isVerify ? usernameExists ? 'cross_circle' : 'checkmark0' : 'question_circle'}  tabIndex={-1}
                                                  className={styles.icon} premium={true} fillColor={isVerify ? usernameExists ? 'red' : 'green' : ''}/>
                                              <div className={classes(globalStyles.link, styles.moreTop, styles.moreLeft)}><L p={p} t={`Verify`}/></div>
                                          </div>
                                      </div>
  
  						                        <div className={styles.nameFull}>
  						                            <InputText
  						                                size={"long"}
  						                                name={"firstName"}
  						                                label={<L p={p} t={`Doctor office name`}/>}
  						                                value={office.firstName}
  						                                onChange={changeOffice}
  						                                onEnterKey={handleEnterKey}
  						                                error={errors.firstName} />
  						                        </div>
  																		<div className={styles.row}>
  																				<InputText
  										                        id={`phone`}
  										                        name={`phone`}
  										                        size={"medium"}
  										                        label={<L p={p} t={`Phone`}/>}
  																						autoComplete={'dontdoit'}
  										                        value={office.phone || ''}
  										                        onChange={changeOffice}
  																						onBlur={handleFormatPhone}
  																						error={errors.phone}/>
  																				<div className={styles.phoneText}>
  																						<Checkbox
  												                        id={'bestContactPhoneText'}
  												                        label={<L p={p} t={`Phone can receive texts`}/>}
  												                        checked={office.bestContactPhoneText || ''}
  												                        onClick={() => toggleCheckbox('bestContactPhoneText')}
  												                        labelClass={styles.label}/>
  																				</div>
  																		</div>
  						                    </div>
  						                }
  						                <div>
  						                    <InputText
  						                        size={"medium-long"}
  						                        name={"emailAddress"}
  						                        label={<L p={p} t={`Email address`}/>}
  						                        value={office.emailAddress}
  						                        onChange={changeOffice}
  						                        onEnterKey={handleEnterKey}
  						                        error={errors.emailAddress} />
  						                </div>
  						                {office.isNewAccount &&
  						                    <div>
  						                        <InputText
  						                            size={"medium-long"}
  						                            name={"emailAddressConfirm"}
  						                            value={office.emailAddressConfirm}
  						                            onChange={changeOffice}
  						                            onEnterKey={handleEnterKey}
  						                            label={<L p={p} t={`Confirm email address`}/>}
  						                            error={errors.emailAddressConfirm} />
  						                        </div>
  						                }
  						                <div>
  						                    <InputText
  						                        isPasswordType={true}
  						                        size={"medium-long"}
  						                        value={office.clave}
  						                        name={"clave"}
  						                        onChange={changeOffice}
  						                        onEnterKey={handleEnterKey}
  						                        label={<L p={p} t={`Password`}/>}
  						                        error={errors.clave} />
  						                </div>
  						                {office.isNewAccount &&
  						                    <div>
  						                        <InputText
  						                            isPasswordType={true}
  						                            size={"medium-long"}
  						                            value={office.claveConfirm}
  						                            name={"claveConfirm"}
  						                            onChange={changeOffice}
  						                            onEnterKey={handleEnterKey}
  						                            label={<L p={p} t={`Confirm password`}/>}
  						                            error={errors.claveConfirm} />
  						                    </div>
  						                }
  														{office.isNewAccount &&
  																<div>
  																		<InputText
  								                        id={`address1`}
  								                        name={`address1`}
  								                        size={"medium"}
  								                        label={<L p={p} t={`Address (line 1)`}/>}
  								                        value={office.address1 || ''}
  								                        onChange={changeOffice}
  								                        onEnterKey={handleEnterKey}
  																				required={true}
  																				whenFilled={office.address1}
  								                        error={errors.address1} />
  																		<InputText
  								                        id={`city`}
  								                        name={`city`}
  								                        size={"medium"}
  								                        label={<L p={p} t={`City`}/>}
  								                        value={office.city || ''}
  								                        onChange={changeOffice}
  								                        onEnterKey={handleEnterKey}
  																				required={true}
  																				whenFilled={office.city}
  								                        error={errors.city} />
  																		<SelectSingleDropDown
  								                        id={`usstateId`}
  								                        name={`usstateId`}
  								                        label={<L p={p} t={`US State`}/>}
  								                        value={office.usstateId}
  								                        options={usStates}
  								                        className={styles.moreBottomMargin}
  								                        height={`medium`}
  								                        onChange={changeOffice}
  								                        onEnterKey={handleEnterKey}
  																				error={errors.usstateId}/>
  																		<InputText
  								                        id={`postalCode`}
  								                        name={`postalCode`}
  								                        size={"medium"}
  								                        label={<L p={p} t={`Postal code`}/>}
  								                        value={office.postalCode || ''}
  								                        onChange={changeOffice}
  								                        onEnterKey={handleEnterKey}
  																				required={true}
  																				whenFilled={office.postalCode}
  								                        error={errors.postalCode} />
  																</div>
  														}
  						                {loginData && loginData.error === "Invalid Login" &&
  						                    <div className={styles.errorMessage}>{loginData.error}</div>
  						                }
  						                {/*office.isNewAccount &&
  						                    <div className={styles.recaptcha}>
  						                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={verifyCallback}/>
  						                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
  						                    </div>
  						                    */
  						                }
  												</form>
  				                <div>
  												{isSubmitted
  														? <Loading isLoading={true} loadingText={<L p={p} t={`Loading`}/>} />
  														: <button type="submit" className={styles.loginButton}
  					                            onClick={processForm} ref={(ref) => (loginButton = ref)}>
  					                        {office.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Login`}/>}
  					                    </button>
  												}
  				                </div>
  				                <Link to={`/forgotPassword/salta`} className={styles.forgotPassword}><L p={p} t={`Forgot your password?`}/></Link>
  										</div>
  								}
                  <OneFJefFooter />
                  {isShowingFailedLogin &&
                    <MessageModal handleClose={handleFailedLoginClose} heading={<L p={p} t={`Login`}/>}
                       explainJSX={<L p={p} t={`Your username or password does not match our records.  Please check your entry and try again or create a new account.`}/>}
                       onClick={handleFailedLoginClose} />
                  }
                  {isShowingMatchingRecord &&
                    <MessageModal handleClose={handleMatchingRecordClose} heading={<L p={p} t={`Login`}/>}
                       explainJSX={<L p={p} t={`A new account has been requested but there is a matching email address in our records.  You will be routed to the login page.  If you have forgotten your password, please choose 'Forgot your password?' option to reset your password.`}/>}
                       onClick={handleMatchingRecordClose} />
                  }
  								{isShowingModal_missingInfo &&
  										<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  											 explainJSX={missingInfoMessage} onClick={handleMissingInfoClose} />
  								}
              </div>
          )
}

export default DoctorInviteLoginView


//, (isOfficeComplete ? styles.opacityFull : styles.opacityLow)

				                // <ButtonWithIcon label={'New to Liahona'} icon={'checkmark_circle'} onClick={this.setShowNewRegLogin} />
												// <ButtonWithIcon label={'Returning'} onClick={() => navigate(`/login`)} icon={'undo2'} />
