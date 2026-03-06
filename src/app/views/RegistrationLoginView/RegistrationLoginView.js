import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
const p = 'RegistrationLoginView';
import L from '../../components/PageLanguage';
import styles from './RegistrationLoginView.css';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import OneFJefFooter from '../../components/OneFJefFooter';
import {guidEmpty} from '../../utils/guidValidate.js';
//import Recaptcha from 'react-recaptcha';

class RegistrationLoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
						showNewRegLogin: false,
            isUserComplete: false,
            errors: {},
            isShowingFailedLogin: false,
            isShowingMatchingRecord: false,
            user: {
                isNewAccount: (props.params.schoolCode || props.params.schoolRegistrationCode) ? true : false,
                orgName: '',
                username: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                clave: '',
                claveConfirm: '',
                emailAddressConfirm: '',
                recaptchaResponse: '',
                schoolYearId: '6B64B061-8E35-403F-A16E-B4A7F1318439',
            },
        };
    }

    verifyCallback = (event) => {
        this.setState({ user: {...this.state.user, recaptchaResponse: event}});
    }

	componentDidMount() {
        const {setRegistrationSchoolCode, params, registrationLogin, accessRoles} = this.props;
				const {showNewRegLogin} = this.state;
        if (params && params.schoolCode) {
            setRegistrationSchoolCode(params.schoolCode)
        }
				if (showNewRegLogin) {
						document.getElementById("emailAddress").value = '';
						document.getElementById("clave").value = '';
						if (document.getElementById("claveConfirm")) document.getElementById("claveConfirm").value = '';
						//document.getElementById("firstName") && document.getElementById("firstName").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
				}

				//If this is the admin who is signed in with a registrationPersonId, we will send the user directly to the registrationLogin
				if (accessRoles.admin && params && params.adminPersonId && params.registrationPersonId) {
						registrationLogin({}, params.schoolCode, params.adminPersonId, params.registrationPersonId);
				}
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

    changeUser = ({target}) => {
				let user = Object.assign({}, this.state.user);
				let field = target.name;
				user[field] = target.value;
				if (field === 'username') user[field] = user[field].replace(' ', '');
        this.setState({ user, errors: {...this.state.errors, username: '' } });
        this.showLoginButton();
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm();
    }

    handleUsernameCheck = () => {
        const {personId} = this.props;
        const user = Object.assign({}, this.state.user);
        let errors = {};
        let isVerify = false;
        let usernameExists = true;
        let hasError = false;

        if (!user.username) {
            hasError = true;
            errors.username = "The username is required";
        }

        if (!hasError) {
            axios.get(`${apiHost}ebi/username/verify/${personId}/${encodeURIComponent(user.username)}`,
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
                    errors.username = 'Username already exists';
                    usernameExists = true;
                } else {
                    errors.username = '';
                    usernameExists = false;
                }
                isVerify = true;
                this.setState({user, errors, isVerify, usernameExists});
            })
        }
        this.setState({user, errors});
    }

    showLoginButton = () => {
        const {user} = this.state;
        if ((this.state.user.isNewAccount && user.username && !this.state.usernameExists && user.firstName && user.emailAddress && user.emailAddressConfirm && this.validateEmail(user.emailAddress) && user.clave && user.claveConfirm)
        			|| (!this.state.user.isNewAccount && user.emailAddress && this.validateEmail(user.emailAddress) && user.clave)) {
            this.setState({isUserComplete: true});
        } else {
            this.setState({isUserComplete: false});
        }
    }

		toggleNewAccount = () => {
				this.setState({ user: {...this.state.user, isNewAccount: !this.state.user.isnewAccount} })
		}

    registerNewAccount = () => {
        let user = Object.assign({}, this.state.user);
        user.isNewAccount = true;
        this.setState({user});
        this.showLoginButton();
        //document.getElementById("firstName").focus();
    }

    loginControls = () => {
        let user = this.state.user;
        user.isNewAccount = false;
        this.setState({user});
        this.showLoginButton();
        //document.getElementById("emailAddress").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
        return re.test(email.toLowerCase());
    }

    processForm = (event) => {
        const {registrationLogin, registrationSchoolCode, companyConfig} = this.props;
        const {user, usernameExists} = this.state;
        event && event.preventDefault();
        let errors = {};
        let hasError = false;
        let missingInfoMessage = [];
        this.setState({ ...user, schoolYearId: '6B64B061-8E35-403F-A16E-B4A7F1318439' })

        if (!user.schoolYearId || user.schoolYearId === "0" || user.schoolYearId === guidEmpty) {
            errors.schoolYear = "School year is required";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`School year is required`}/></div>
            hasError = true;
        }

        if (user.isNewAccount && !user.firstName) {
            errors.firstName = "First name required";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
            hasError = true;
        }

        if (user.isNewAccount && !user.username) {
            errors.username = "Username required";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username`}/></div>
            hasError = true;
        }

        if (usernameExists) {
            errors.username = "Username already exists";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username already exists`}/></div>
            hasError = true;
        }

        if (!user.emailAddress) {
            errors.emailAddress = "Please enter your email address";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address`}/></div>
            hasError = true;
        } else if (!this.validateEmail(user.emailAddress)) {
            errors.emailAddress = "Email address appears to be invalid";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address appears to be invalid`}/></div>
            hasError = true;
        }

        if (!user.clave) {
            errors.clave = "Please enter a password.";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password.`}/></div>
            hasError = true;
				} else if (user.clave.length < 6) {
            errors.clave = "Password must be at least 6 characters long.";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password must be at least 6 characters long.`}/></div>
            hasError = true;
        } else if (user.clave !== user.claveConfirm) {
            errors.clave = "The password and confirmation do not match";
            missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The password and confirmation do not match`}/></div>
            hasError = true;
        }

        // if (user.isNewAccount && !user.recaptchaResponse) {
        //     errors.recaptcha = "Please verify that you are not a robot";
        //     hasError = true;
        // }
        this.setState({errors});

        if (!hasError) {
						user.companyId = companyConfig.companyId;
            registrationLogin(user, registrationSchoolCode);
            //this.loginButton.style.display = 'none';
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

    render() {
        const {loginData, schoolYears, companyConfig={}} = this.props;
        const {user, errors, isShowingFailedLogin, isShowingMatchingRecord, showNewRegLogin, usernameExists, isVerify, isSubmitted,
								isShowingModal_missingInfo, missingInfoMessage} = this.state;
				let companyName = companyConfig && companyConfig.name && companyConfig.name !== 'undefined' ? companyConfig.name : '';

				// let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
				//                navigator.userAgent &&
				//                navigator.userAgent.indexOf('CriOS') === -1 &&
				//                navigator.userAgent.indexOf('FxiOS') === -1;

        return (
            <div className={styles.container}>
                <Link className={styles.topLogo} to={'/'}>
										<div className={styles.schoolName}>{companyName + ' Registration'}</div>
                </Link>
								<a className={styles.topLogo} href={'https://www.eCademy.app'}>
										{companyConfig.logoFileUrl
												? <img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
												: <img src={eCademy} alt={`eCademyApp`} />
										}
                </a>
								{false &&
										<div className={classes(styles.safariMessage)}>
												Safari error:  There is a known but intermittent problem with the Safari browser.  If the button below does not work, please use another browser, such as Chrome.
										</div>
								}
                {companyConfig.urlcode === 'Liahona' &&
                    <div className={styles.center}>
                        <div className={globalStyles.instructionsBiggest}>
                            2019-2020 Registration:  Click on the link below according to the type of student:  Distance Learning or Academy (attending in person).
                        </div>
                        <br/>
												<br/>
                        <div className={styles.row}>
                            <div className={classes(styles.boldText, styles.moreRight)}>Distance learning registration:</div>
                            <a href={`https://form.jotform.com/200843541704146`} className={styles.boldText}>https://form.jotform.com/200843541704146</a>
                        </div>
                        <br/>
												<br/>
                        <div className={styles.row}>
                            <div className={classes(styles.boldText, styles.moreRight)}>Academy (attending in person):</div>
                            <a href={`https://form.jotform.com/200843541704146`}  className={styles.boldText}>https://form.jotform.com/200854262339152</a>
                        </div>
												<br/>
												<br/>
										</div>
                }
								{!showNewRegLogin &&
										<div className={styles.center}>
                        {/* companyConfig.urlcode !== 'Liahona' &&
                            <div>
        												<div className={globalStyles.instructionsBiggest}>
        														If your student was attending this school last year,<br/>
        														let's go to your existing account:
        												</div>
        												<button className={styles.button} onClick={() => browserHistory.push(`/login`)}>
        														{'Returning'}
        												</button>
        												<br/>
                            </div>
                        */}
												<br/>
												<div className={globalStyles.instructionsBiggest}>
														Current school year (2019-2020):  If you are new to this school, let's create a new account:
												</div>
												<button className={styles.button} onClick={this.setShowNewRegLogin}>{'New Account'}</button>
												<br/>
												<br/>
										</div>
								}
								{showNewRegLogin &&
										<div className={styles.center}>
												<form>
						                <div className={styles.textLogo}>
						                    <span className={styles.textBeforeLogo}>
						                        {user.isNewAccount &&
																				<div>
																						<div className={styles.chosen}>Create a New Account</div>
																						<div className={classes(styles.row, styles.instructions)}>
																								Do you have an existing account?
																								<Link to={'/login'} className={styles.signUp}>
										                            		Sign in
										                            </Link>
																						</div>
																				</div>
						                        }
						                        {!user.isNewAccount &&
																				<div className={classes(styles.row, styles.instructions)}>
																						<div className={styles.chosen}>Sign in</div>
																						or create a
																						<div onClick={this.toggleNewAccount} className={styles.signUp}>
								                            		new account
								                            </div>
																				</div>
																		}
						                    </span>
						                </div>
						                {user.isNewAccount &&
						                    <div>
																		<div className={classes(styles.instructions, styles.red, styles.width)}>
																				{`Create an account as the primary guardian`}
																		</div>
																		<div className={styles.muchMoreLeft}>
																				<SelectSingleDropDown
																						id={`schoolYearId`}
																						label={`School year`}
																						value={user.schoolYearId || ''}
																						options={schoolYears}
																						height={`medium`}
                                            noBlank={true}
																						onChange={this.changeUser}
																						error={errors.schoolYear}/>
																		</div>
                                    <div className={styles.row}>
    						                        <InputText
    						                            size={"medium"}
    						                            name={"username"}
    						                            value={user.username}
    						                            onChange={this.changeUser}
    						                            label={'Username'}
    						                            error={errors.username}
                                            onBlur={this.handleUsernameCheck} />

                                        <div onClick={this.handleUsernameCheck} className={classes(globalStyles.link, styles.row, styles.muchTop)} tabIndex={-1}>
                                            <Icon pathName={isVerify ? usernameExists ? 'cross_circle' : 'checkmark0' : 'question_circle'}  tabIndex={-1}
                                                className={styles.icon} premium={true} fillColor={isVerify ? usernameExists ? 'red' : 'green' : ''}/>
                                            <div className={classes(globalStyles.link, styles.moreTop, styles.moreLeft)}>Verify</div>
                                        </div>
                                    </div>

						                        <div className={styles.nameFull}>
						                            <InputText
						                                size={"medium-left"}
						                                name={"firstName"}
						                                label={`First name`}
						                                value={user.firstName}
						                                onChange={this.changeUser}
						                                onEnterKey={this.handleEnterKey}
						                                error={errors.firstName} />

						                            <InputText
						                                size={"medium-right"}
						                                name={"lastName"}
						                                label={`Last name`}
						                                value={user.lastName}
						                                onEnterKey={this.handleEnterKey}
						                                onChange={this.changeUser}
						                                error={errors.lastName} />
						                        </div>
						                    </div>
						                }
						                <div>
						                    <InputText
						                        size={"medium-long"}
						                        name={"emailAddress"}
						                        label={`Email address`}
						                        value={user.emailAddress}
						                        onChange={this.changeUser}
						                        onEnterKey={this.handleEnterKey}
						                        error={errors.emailAddress} />
						                </div>
						                {user.isNewAccount &&
						                    <div>
						                        <InputText
						                            size={"medium-long"}
						                            name={"emailAddressConfirm"}
						                            value={user.emailAddressConfirm}
						                            onChange={this.changeUser}
						                            onEnterKey={this.handleEnterKey}
						                            label={"Confirm email address"}
						                            error={errors.emailAddressConfirm} />
						                        </div>
						                }
						                <div>
						                    <InputText
						                        isPasswordType={true}
						                        size={"medium-long"}
						                        value={user.clave}
						                        name={"clave"}
						                        onChange={this.changeUser}
						                        onEnterKey={this.handleEnterKey}
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
						                            onChange={this.changeUser}
						                            onEnterKey={this.handleEnterKey}
						                            label={"Confirm password"}
						                            error={errors.claveConfirm} />
						                    </div>
						                }
						                {loginData && loginData.error === "Invalid Login" &&
						                    <div className={styles.errorMessage}>{loginData.error}</div>
						                }
						                {/*user.isNewAccount &&
						                    <div className={styles.recaptcha}>
						                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={this.verifyCallback}/>
						                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
						                    </div>
						                    */
						                }
												</form>
				                <div>
												{isSubmitted
														? <Loading isLoading={true} loadingText={'Loading'} />
														: <button type="submit" className={styles.loginButton}
					                            onClick={this.processForm} ref={(ref) => (this.loginButton = ref)}>
					                        {user.isNewAccount ? 'Create' : 'Login'}
					                    </button>
												}
				                </div>
				                <Link to={`/forgotPassword/salta`} className={styles.forgotPassword}>Forgot your password?</Link>
										</div>
								}
                <OneFJefFooter />
                {isShowingFailedLogin &&
                  <MessageModal handleClose={this.handleFailedLoginClose} heading={`Login`}
                     explainJSX={user.isNewAccount
                        ? <L p={0} t={`There was a problem.  Please check your entry and try again or contact the front desk.`}/>
                        : <L p={0} t={`Your username or password does not match our records.  Please check your entry and try again or create a new account.`}/>
                     }
                     onClick={this.handleFailedLoginClose} />
                }
                {isShowingMatchingRecord &&
                  <MessageModal handleClose={this.handleMatchingRecordClose} heading={`Login`}
                     explainJSX={<L p={0} t={`A new account has been requested but there is a matching email address in our records.  You will be routed to the login page.  If you have forgotten your password, please choose 'Forgot your password?' option to reset your password.`}/>}
                     onClick={this.handleMatchingRecordClose} />
                }
								{isShowingModal_missingInfo &&
										<MessageModal handleClose={this.handleMissingInfoClose} heading={`Missing information`}
											 explainJSX={missingInfoMessage} onClick={this.handleMissingInfoClose} />
								}
            </div>
        );
    }
}

export default RegistrationLoginView;


//, (isUserComplete ? styles.opacityFull : styles.opacityLow)

				                // <ButtonWithIcon label={'New to Liahona'} icon={'checkmark_circle'} onClick={this.setShowNewRegLogin} />
												// <ButtonWithIcon label={'Returning'} onClick={() => browserHistory.push(`/login`)} icon={'undo2'} />
