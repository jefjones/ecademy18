import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './LandingView.css'
const p = 'LandingView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
// import Icon from '../../components/Icon';
// import JefFeatureDisplay from '../../components/JefFeatureDisplay';
import InputText from '../../components/InputText'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Loading from '../../components/Loading'
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png'
import LaptopPhone from '../../assets/marketing/JefLaptopPhoneLanding.png'
import MediaQuery from 'react-responsive'
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
  const [clave, setClave] = useState('')
  const [usernameConfirm, setUsernameConfirm] = useState('')
  const [claveConfirm, setClaveConfirm] = useState('')
  const [recaptchaResponse, setRecaptchaResponse] = useState('')
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
                    setErrors({username: 'Username already exists'}); setIsSubmitted(false); setSetResponse(true)
                } else {
    								setErrors({username: 'Username or password not found'}); setIsSubmitted(false); setSetResponse(true)
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
            }
            if (!user.clave) {
                errors.clave = "Please enter a password."
                hasError = true
            } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
                errors.clave = "The password and confirmation do not match"
                hasError = true
            }
    
            setErrors(errors)
            //Help ToDo - put the secure password length and details in.
            if (!hasError) {
                login(user, inviteResponse)
                //loginButton.style.display = 'none';  This was used for creating a new account so that a second click wouldn't create a second company and all of the fill-in records.
                setIsSubmitted(true); setSetResponse(false)
    						window.localStorage.setItem("loginUsername", user.username)
    						//window.localStorage.setItem("clave", user.clave);
            }
        
  }

  const handleFailedLoginOpen = () => {
    return setIsShowingFailedLogin(true); setIsSubmitted(false)

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
    

  }
  const handleSelectedFeature = (jefFeatureId) => {
    
    				//If the feature is selected, remove it. Otherwise, add it.
    				if (selectedFeatures && selectedFeatures.length > 0 && selectedFeatures.indexOf('jefFeatureId') > -1) {
    						selectedFeatures = selectedFeatures.filter(id => id !== jefFeatureId)
    				} else {
    						selectedFeatures = selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures.concat(jefFeatureId) : [jefFeatureId]
    				}
    				setSelectedFeatures(selectedFeatures)
    				//window.localStorage.setItem("selectedFeatures", selectedFeatures.join(','));
    		
  }

  const hasSelected = (jefFeatureId) => {
    
    				
    				return selectedFeatures && selectedFeatures.length > 0 && selectedFeatures.indexOf(jefFeatureId) > -1
    		
  }

  //const {jefFeatures} = props;
  				
  
          return (
              <div className={styles.container}>
  								{/*<div className={styles.topSlogan}>
  										<img src={slogan} alt={`the app of all things school`} className={styles.sloganSize}/>
  								</div>*/}
  								<MediaQuery minWidth={696}>
  									{(matches) => {
  										if (matches) {
  												return (
  														<div className={classes(styles.topRow)}>
  																<div>
  																		<div className={styles.login}>
  																				<InputText
  																						size={"medium"}
  																						name={"username"}
  																						label={`Username`}
  																						value={user.username}
  																						onChange={changeUser}
  																						onEnterKey={handleEnterKey}
  																						error={errors.username} />
  																				<InputText
  										                        isPasswordType={true}
  										                        size={"medium"}
  										                        value={user.clave}
  										                        name={"clave"}
  										                        onChange={changeUser}
  										                        onEnterKey={handleEnterKey}
  										                        label={"Password"}
  																						autoComplete={'dontdoit'}
  										                        error={errors.clave} />
  
  																				{!isSubmitted &&
  																						<ButtonWithIcon icon={'checkmark_circle'} label={'Login'} onClick={processForm} />
  																				}
  																				{isSubmitted &&
  																						<div className={styles.loading}>
  																								<Loading loadingText={`Loading`} isLoading={isSubmitted} />
  																						</div>
  																				}
  																				<br/>
  																				<div>
  																						<Link to={`/forgotPassword`} className={styles.forgotPassword}>Forgot your password?</Link>
  																				</div>
  																				<br/>
  																				<div>
  												                		<Link to={`/privacy-policy`} className={styles.forgotPassword}>Privacy Policy</Link>
  																				</div>
  																		</div>
  																</div>
  																<div>
  																		<a className={styles.topLogo} href={'https://www.ecademy.app'} target={'_eCADEMY.app'}>
  																				<img src={eCademy} alt={`eCADEMY.app`} />
  										                </a>
  																</div>
  																<div className={styles.schoolList}>
  																		<div>Private Schools</div>
  																		<div>Public Schools</div>
  																		<div>Charter Schools</div>
  																		<div>Home Schools</div>
  																		<div>Online Schools</div>
  																</div>
  																{/*<div className={styles.freeTrial}>
  																		Free 30-day trial!
  																</div>
  																<div className={classes(styles.centered,styles.row)}>
  																		<div className={styles.row}>
  																				<div className={styles.priceText}>Not</div>
  																				<div className={classes(styles.priceText, styles.notPrice)}><strike>$11,000</strike></div>
  																		</div>
  																		<div className={styles.priceText}>All features without extra module charges</div>
  																		<div className={styles.row}><div className={classes(styles.priceText, styles.yesPrice)}>$200</div>/mo</div>
  																		<div className={styles.priceText}>
  																			 We are the underdog, inexpensive alternative
  																			 <br/> to PowerSchool&trade;, Infinite Campus&trade; or Skyward&trade
  																			 <br/>for class, students, assignments, admin, teachers and parent portal<br/> and additional features they don't have!
  																	 </div>
  																</div>*/}
  																<hr/>
  																{/*<div className={styles.boxRow}>
  																		<div className={styles.centerNarrow}>
  																				<div className={styles.testimonial}>TESTIMONIAL</div>
  																				<div className={styles.orangeBorder}>
  																						<div className={classes(styles.textLandingBig, styles.italic)}>{`Finally, the apps we need all in one place!`}</div>
  																						<div className={styles.textLandingQuote}>{`- Janielle, Franklin Discovery Academy`}</div>
  																				</div>
  																		</div>*/}
  																		<div className={classes(styles.contactPosition, styles.centerNarrow)}>
  																				<div className={styles.contact}>CONTACT</div>
  																				<div className={classes(styles.contactInfo, styles.row)}>
  																						<a href={'mailto: support@ecademy.app'} className={classes(globalStyles.link, styles.contactEmail)}>{`support@ecademy.app`}</a>
  																				</div>
  																		</div>
  																{/*</div>*/}
  																{/*<div className={styles.stepView}>
  																		<div className={styles.widthOneThird}>
  																				<div className={styles.steps}>
  																						<div className={styles.stepLabel}>Step</div>
  																						<div className={styles.stepCount}>1</div>
  																				</div>
  																				<div className={styles.stepBox}>
  																						<div className={styles.stepText}>{`See demo videos and screenshots`}</div>
  																						<div className={styles.textLandingQuote}>{`2 to 6 minute tutorials`}</div>
  																				</div>
  																		</div>
  																		<div className={styles.widthOneThird}>
  																				<div className={styles.steps}>
  																						<div className={styles.stepLabel}>Step</div>
  																						<div className={styles.stepCount}>2</div>
  																				</div>
  																				<div className={styles.stepBox}>
  																						<div className={styles.stepText}>{`Choose your features`}</div>
  																						<div className={styles.textLandingQuote}>{`click on the checkbox next to the feature`}</div>
  																				</div>
  																		</div>
  																		<div className={styles.widthOneThird}>
  																				<div className={styles.steps}>
  																						<div className={styles.stepLabel}>Step</div>
  																						<div className={styles.stepCount}>3</div>
  																				</div>
  																				<div className={classes(styles.stepBox, styles.row)}>
  																						<ButtonWithIcon icon={'checkmark_circle'} label={'Create'} onClick={() => navigate('/createNewSchool')}
  																								addClassName={styles.moveCreateButton}/>
  																						<div className={classes(styles.stepText, styles.stepPosition)}>{`your eCADEMY app`}</div>
  																				</div>
  																		</div>
  																</div>*/}
  														</div>
  													)
  												} else {
  														return (
  															<div>
  																	<div className={styles.centered}>
  																			<a className={styles.topLogo} href={'https://www.ecademy.app'} target={'_eCADEMY.app'}>
  																					<img src={eCademy} alt={`eCADEMY.app`} />
  																			</a>
  																	</div>
  																	<div className={styles.loginNarrow}>
  																			<InputText
  																					size={"medium"}
  																					name={"username"}
  																					label={`Username`}
  																					value={user.username}
  																					onChange={changeUser}
  																					onEnterKey={handleEnterKey}
  																					error={errors.username} />
  																			<InputText
  									                        isPasswordType={true}
  									                        size={"medium"}
  									                        value={user.clave}
  									                        name={"clave"}
  									                        onChange={changeUser}
  									                        onEnterKey={handleEnterKey}
  									                        label={"Password"}
  																					autoComplete={'dontdoit'}
  									                        error={errors.clave} />
  																			{!isSubmitted &&
  																					<ButtonWithIcon icon={'checkmark_circle'} label={'Login'} onClick={processForm} />
  																			}
  																			{isSubmitted &&
  																					<div className={styles.loading}>
  																							<Loading loadingText={`Loading`} isLoading={isSubmitted} />
  																					</div>
  																			}
  																			<br/>
  																			<div>
  																					<Link to={`/forgotPassword`} className={styles.forgotPassword}>Forgot your password?</Link>
  																			</div>
  																			<br/>
  																			<div>
  											                		<Link to={`/privacy-policy`} className={styles.forgotPassword}>Privacy Policy</Link>
  																			</div>
  																	</div>
  																	{/*<div className={styles.freeTrial}>
  																			Free 30-day trial!
  																	</div>
  																	<div className={classes(styles.centered,styles.row)}>
  																		 <div className={styles.row}>
  																				 <div className={styles.priceText}>Not</div>
  																				 <div className={classes(styles.priceText, styles.notPrice)}><strike>$11,000</strike></div>
  																		 </div>
  																		 <div className={styles.priceText}>All features without module charges</div>
  																		 <div className={styles.row}><div className={classes(styles.priceText, styles.yesPrice)}>$200</div>/mo</div>
  																		 <div className={styles.priceText}>
  																		 		We are the underdog, inexpensive alternative
  																				<br/> to PowerSchool&trade;, Infinite Campus&trade; or Skyward&trade
  																		 		<br/>for class, students, assignments, admin, teachers and parent portal<br/> and great features they don't have!
  																		</div>
  																	</div>*/}
  																	<hr/>
  																	{/*<div className={styles.centerNarrow}>
  																			<div className={styles.testimonial}>TESTIMONIAL</div>
  																			<div className={styles.orangeBorder}>
  																					<div className={classes(styles.textLandingBig, styles.italic)}>{`Finally, the apps we need all in one place!`}</div>
  																					<div className={styles.textLandingQuote}>{`- Janielle, Franklin Discovery Academy`}</div>
  																			</div>
  																	</div>*/}
  																	<div className={classes(styles.contactPosition, styles.centerNarrow)}>
  																			<div className={styles.contact}>CONTACT</div>
  																			<div className={classes(styles.contactInfo, styles.row)}>
  																					<a href={'mailto: support@ecademy.app'} className={classes(globalStyles.link, styles.contactEmail)}>{`support@ecademy.app`}</a>
  																			</div>
  																	</div>
  																	<hr/>
  																	{/*<div className={styles.muchTop}>
  																			<div className={styles.steps}>
  																					<div className={styles.stepLabel}>Step</div>
  																					<div className={styles.stepCount}>1</div>
  																			</div>
  																			<div className={styles.stepBox}>
  																					<div className={styles.stepText}>{`See demo videos and screenshots`}</div>
  																					<div className={styles.textLandingQuote}>{`2 to 6 minute tutorials`}</div>
  																			</div>
  																	</div>
  																	<div>
  																			<div className={styles.steps}>
  																					<div className={styles.stepLabel}>Step</div>
  																					<div className={styles.stepCount}>2</div>
  																			</div>
  																			<div className={styles.stepBox}>
  																					<div className={styles.stepText}>{`Choose your features`}</div>
  																					<div className={styles.textLandingQuote}>{`click on the checkbox next to the feature`}</div>
  																			</div>
  																	</div>
  																	<div>
  																			<div className={styles.steps}>
  																					<div className={styles.stepLabel}>Step</div>
  																					<div className={styles.stepCount}>3</div>
  																			</div>
  																			<div className={classes(styles.stepBox, styles.row)}>
  																					<ButtonWithIcon icon={'checkmark_circle'} label={'Create'} onClick={() => navigate('/createNewSchool')}
  																							addClassName={styles.moveCreateButton}/>
  																					<div className={classes(styles.stepText, styles.stepPosition)}>{`your eCADEMY app`}</div>
  																			</div>
  																	</div>*/}
  															</div>
  														)
  												}
  										}}
  								</MediaQuery>
  								<div className={styles.laptopPhone}>
  										<img src={LaptopPhone} alt={`eCADEMY.app`} />
  								</div>
  								<div className={styles.textLanding}>{`The same progressive-web-app across all devices`}</div>
  								<br/>
  								{/*<div>
  										<a href={'https://penspringblob.blob.core.windows.net/blob-container/Tutorial%20Videos/Introduction%20eCademy.mp4'} target={'_introduction'} className={classes(styles.row, styles.introduction)}>
  												<Icon pathName={'presentation'} premium={true} className={styles.bigIcon} />
  												Introduction Video
  										</a>
  								</div>
  								<br/>
  								{jefFeatures && jefFeatures.length > 0 && jefFeatures.map((m, i) =>
  										<JefFeatureDisplay key={i} keyIndex={i} feature={m} onSelect={() => handleSelectedFeature(m.jefFeatureId)}
  												checked={hasSelected(m.jefFeatureId)}/>
  								)}   */}
                  <OneFJefFooter />
  								{isShowingFailedLogin &&
                    <MessageModal handleClose={handleFailedLoginClose} heading={`Login`}
                       explainJSX={<L p={p} t={`Your username or password does not match our records.  Please check your entry and try again.`}/>}
                       onClick={handleFailedLoginClose} />
                  }
              </div>
          )
}

export default LandingView


// <br/>
// <Link to={`/createNewSchool`} className={classes(styles.bold, styles.forgotPassword)}>Create your own eCADEMY.app School</Link>
