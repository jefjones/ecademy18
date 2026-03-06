import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import styles from './DoctorInviteLoginView.css';
const p = 'DoctorInviteLoginView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Checkbox from '../../components/Checkbox';
import Loading from '../../components/Loading';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import OneFJefFooter from '../../components/OneFJefFooter';
import {emailValidate} from '../../utils/emailValidate.js';
import {formatPhoneNumber} from '../../utils/numberFormat.js';
//import Recaptcha from 'react-recaptcha';

class DoctorInviteLoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
						showNewRegLogin: false,
            isOfficeComplete: false,
            errors: {},
            isShowingFailedLogin: false,
            isShowingMatchingRecord: false,
            office: {
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
            },
        };
    }

    verifyCallback = (event) => {
        this.setState({ office: {...this.state.office, recaptchaResponse: event}});
    }

    componentDidUpdate() {
        const {isShowingFailedLogin, isShowingMatchingRecord} = this.state;
        const {loginData} = this.props;

        if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData.error) {
            if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                this.handleMatchingRecordOpen();
            } else {
                this.handleFailedLoginOpen();
            }
        }
    }

    changeOffice = ({target}) => {
				let office = Object.assign({}, this.state.office);
				let field = target.name;
				office[field] = target.value;
				if (field === 'officename') office[field] = office[field].replace(' ', '');
				this.setState({ office, errors: {...this.state.errors, username: '' } });
        this.showLoginButton();
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm();
    }

    handleUsernameCheck = () => {
        const {personId} = this.props;
        const {office} = this.state;
        let errors = {};
        let isVerify = false;
        let usernameExists = true;
        let hasError = false;

        if (!office.username) {
            hasError = true;
            errors.username = <L p={p} t={`The username is required`}/>;
        }

        if (!hasError) {
            axios.get(`${apiHost}ebi/username/verify/${personId}/${office.username}`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            }})
            .catch(function (error) {
              //Show error here.
            })
            .then(response => {

                if (response.data === 'FOUND') {
                    errors.username = <L p={p} t={`Username already exists`}/>;
                    usernameExists = true;
                } else {
                    errors.username = '';
                    usernameExists = false;
                }
                isVerify = true;
                this.setState({errors, isVerify, usernameExists});

            })
        }
        this.setState({errors});
    }

    showLoginButton = () => {
        const {office} = this.state;
        if ((this.state.office.isNewAccount && office.username && !this.state.usernameExists && office.firstName && office.emailAddress && office.emailAddressConfirm && emailValidate(office.emailAddress) && office.clave && office.claveConfirm)
        			|| (!this.state.office.isNewAccount && office.emailAddress && emailValidate(office.emailAddress) && office.clave)) {
            this.setState({isOfficeComplete: true});
        } else {
            this.setState({isOfficeComplete: false});
        }
    }

		toggleNewAccount = () => {
				this.setState({ office: {...this.state.office, isNewAccount: !this.state.office.isnewAccount} })
		}

    registerNewAccount = () => {
        let office = Object.assign({}, this.state.office);
        office.isNewAccount = true;
        this.setState({office});
        this.showLoginButton();
    }

    loginControls = () => {
        let office = this.state.office;
        office.isNewAccount = false;
        this.setState({office});
        this.showLoginButton();
    }

    processForm = (event) => {
        const {loginDoctorOffice, doctorNoteInviteId, companyConfig} = this.props;
        const {office, usernameExists} = this.state;
        event && event.preventDefault();
        let errors = {};
				let missingInfoMessage = [];

        if (office.isNewAccount && !office.firstName) {
            errors.firstName = <L p={p} t={`Doctor office name required`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
        }

        if (office.isNewAccount && !office.username) {
            errors.username = <L p={p} t={`Username required`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username`}/></div>
        }

        if (usernameExists) {
            errors.username = <L p={p} t={`Username already exists`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username already exists`}/></div>
        }

        if (!office.emailAddress) {
            errors.emailAddress = <L p={p} t={`Please enter the office email address`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address`}/></div>
        } else if (!emailValidate(office.emailAddress)) {
            errors.emailAddress = <L p={p} t={`Email address appears to be invalid`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address appears to be invalid`}/></div>
        }

        if (!office.clave) {
            errors.clave = <L p={p} t={`Please enter a password.`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password`}/></div>
				} else if (office.clave.length < 6) {
            errors.clave = <L p={p} t={`Password must be at least 6 characters long.`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password must be at least 6 characters long`}/></div>
        } else if (office.clave !== office.claveConfirm) {
            errors.clave = <L p={p} t={`The password and confirmation do not match`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The password and confirmation do not match`}/></div>
        }

				if (!office.address1 && !office.address2) {
	          errors.address1 = <L p={p} t={`Please enter a street address`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Street address`}/></div>
	      }
				if (!office.city) {
	          errors.city = <L p={p} t={`Please enter a city`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`City`}/></div>
	      }
				if (!office.usstateId) {
	          errors.usstateId = <L p={p} t={`Please enter a state or province`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`State or province`}/></div>
	      }
				if (!office.postalCode) {
	          errors.postalCode = <L p={p} t={`Please enter a postal code`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Postal code`}/></div>
	      }

        // if (office.isNewAccount && !office.recaptchaResponse) {
        //     errors.recaptcha = <L p={p} t={`Please verify that you are not a robot`}/>;
        //     hasError = true;
        // }
        this.setState({errors});

        if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
						office.companyId = companyConfig.companyId;
            loginDoctorOffice(office, doctorNoteInviteId);
            this.setState({isSubmitted: true});
				} else {
						this.handleMissingInfoOpen(missingInfoMessage);
        }

    }

		handleFailedLoginOpen = () => this.setState({isShowingFailedLogin: true})
    handleFailedLoginClose = () => {
        this.setState({isShowingFailedLogin: false})
        this.props.logout(); //This is used to clear the error
    }

    handleMatchingRecordOpen = () => this.setState({isShowingMatchingRecord: true})
		handleMatchingRecordClose = (event) => {
        this.setState({isShowingMatchingRecord: false})
        browserHistory.push('/login');
				event.preventDefault();
				event.stopPropagation();
    }

		setShowNewRegLogin = () => this.setState({ showNewRegLogin: true })

		handleMissingInfoOpen = (missingInfoMessage) => this.setState({isShowingModal_missingInfo: true, missingInfoMessage })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, missingInfoMessage: ''})

		toggleCheckbox = (field) => {
        let office = Object.assign({}, this.state.office);
				office[field] = !office[field];
        this.setState({ office });
    }

		handleFormatPhone = () => {
				let office = Object.assign({}, this.state.office);
				this.setState({ office });
				if (office.phone && ('' + office.phone).replace(/\D/g, '').length !== 10) {
						this.setState({errorPhone: <L p={p} t={`The phone number entered is not 10 digits`}/> });
				} else if (formatPhoneNumber(office.phone)) {
						office.phone = formatPhoneNumber(office.phone);
						this.setState({ errors: {...this.state.errors, phone: ''}, office });
				}
		}

    render() {
        const {loginData, companyConfig={}, usStates} = this.props;
        const {office, errors, isShowingFailedLogin, isShowingMatchingRecord, showNewRegLogin, usernameExists, isVerify, isSubmitted,
								isShowingModal_missingInfo, missingInfoMessage} = this.state;
				let companyName = companyConfig && companyConfig.name && companyConfig.name !== 'undefined' ? companyConfig.name : '';

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
												<button className={styles.button} onClick={() => browserHistory.push(`/login`)}>
														<L p={p} t={`Returning`}/>
												</button>
												<br/>
												<br/>
												<div className={globalStyles.instructionsBiggest}>
														<L p={p} t={`If you are new to eCademy.app,`}/><br/>
														<L p={p} t={`let's create a new account:`}/>
												</div>
												<button className={styles.button} onClick={this.setShowNewRegLogin}><L p={p} t={`New Account`}/></button>
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
																						<div onClick={this.toggleNewAccount} className={styles.signUp}>
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
    						                            onChange={this.changeOffice}
    						                            //onEnterKey={this.handleUsernameCheck} don't do this since you can't get rid of spaces and check on keypress at the same time.
    						                            label={<L p={p} t={`Username`}/>}
    						                            error={errors.username}
                                            onBlur={this.handleUsernameCheck} />

                                        <div onClick={this.handleUsernameCheck} className={classes(globalStyles.link, styles.row, styles.muchTop)} tabIndex={-1}>
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
						                                onChange={this.changeOffice}
						                                onEnterKey={this.handleEnterKey}
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
										                        onChange={this.changeOffice}
																						onBlur={this.handleFormatPhone}
																						error={errors.phone}/>
																				<div className={styles.phoneText}>
																						<Checkbox
												                        id={'bestContactPhoneText'}
												                        label={<L p={p} t={`Phone can receive texts`}/>}
												                        checked={office.bestContactPhoneText || ''}
												                        onClick={() => this.toggleCheckbox('bestContactPhoneText')}
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
						                        onChange={this.changeOffice}
						                        onEnterKey={this.handleEnterKey}
						                        error={errors.emailAddress} />
						                </div>
						                {office.isNewAccount &&
						                    <div>
						                        <InputText
						                            size={"medium-long"}
						                            name={"emailAddressConfirm"}
						                            value={office.emailAddressConfirm}
						                            onChange={this.changeOffice}
						                            onEnterKey={this.handleEnterKey}
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
						                        onChange={this.changeOffice}
						                        onEnterKey={this.handleEnterKey}
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
						                            onChange={this.changeOffice}
						                            onEnterKey={this.handleEnterKey}
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
								                        onChange={this.changeOffice}
								                        onEnterKey={this.handleEnterKey}
																				required={true}
																				whenFilled={office.address1}
								                        error={errors.address1} />
																		<InputText
								                        id={`city`}
								                        name={`city`}
								                        size={"medium"}
								                        label={<L p={p} t={`City`}/>}
								                        value={office.city || ''}
								                        onChange={this.changeOffice}
								                        onEnterKey={this.handleEnterKey}
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
								                        onChange={this.changeOffice}
								                        onEnterKey={this.handleEnterKey}
																				error={errors.usstateId}/>
																		<InputText
								                        id={`postalCode`}
								                        name={`postalCode`}
								                        size={"medium"}
								                        label={<L p={p} t={`Postal code`}/>}
								                        value={office.postalCode || ''}
								                        onChange={this.changeOffice}
								                        onEnterKey={this.handleEnterKey}
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
						                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={this.verifyCallback}/>
						                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
						                    </div>
						                    */
						                }
												</form>
				                <div>
												{isSubmitted
														? <Loading isLoading={true} loadingText={<L p={p} t={`Loading`}/>} />
														: <button type="submit" className={styles.loginButton}
					                            onClick={this.processForm} ref={(ref) => (this.loginButton = ref)}>
					                        {office.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Login`}/>}
					                    </button>
												}
				                </div>
				                <Link to={`/forgotPassword/salta`} className={styles.forgotPassword}><L p={p} t={`Forgot your password?`}/></Link>
										</div>
								}
                <OneFJefFooter />
                {isShowingFailedLogin &&
                  <MessageModal handleClose={this.handleFailedLoginClose} heading={<L p={p} t={`Login`}/>}
                     explainJSX={<L p={p} t={`Your username or password does not match our records.  Please check your entry and try again or create a new account.`}/>}
                     onClick={this.handleFailedLoginClose} />
                }
                {isShowingMatchingRecord &&
                  <MessageModal handleClose={this.handleMatchingRecordClose} heading={<L p={p} t={`Login`}/>}
                     explainJSX={<L p={p} t={`A new account has been requested but there is a matching email address in our records.  You will be routed to the login page.  If you have forgotten your password, please choose 'Forgot your password?' option to reset your password.`}/>}
                     onClick={this.handleMatchingRecordClose} />
                }
								{isShowingModal_missingInfo &&
										<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
											 explainJSX={missingInfoMessage} onClick={this.handleMissingInfoClose} />
								}
            </div>
        );
    }
}

export default DoctorInviteLoginView;


//, (isOfficeComplete ? styles.opacityFull : styles.opacityLow)

				                // <ButtonWithIcon label={'New to Liahona'} icon={'checkmark_circle'} onClick={this.setShowNewRegLogin} />
												// <ButtonWithIcon label={'Returning'} onClick={() => browserHistory.push(`/login`)} icon={'undo2'} />
