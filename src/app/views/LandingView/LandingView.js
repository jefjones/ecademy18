import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './LandingView.css';
const p = 'LandingView';
import L from '../../components/PageLanguage';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
import {guidEmpty} from '../../utils/guidValidate';
import MessageModal from '../../components/MessageModal';
import InputText from '../../components/InputText';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Loading from '../../components/Loading';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import LaptopPhone from '../../assets/marketing/JefLaptopPhoneLanding.png';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
//import Recaptcha from 'react-recaptcha';

class LandingView extends Component {
    constructor(props) {
        super(props);

        this.state = {
						selectedFeatures: [],
						isSubmitted: false,
            isUserComplete: false,
            errors: {},
            isShowingFailedLogin: false,
            isShowingMatchingRecord: false,
            user: {
                isNewAccount: false,
                orgName: '',
                firstName: '',
                lastName: '',
                username: '',
                clave: '',
                usernameConfirm: '',
                claveConfirm: '',
                recaptchaResponse: '',
            }
        };
    }

    verifyCallback = (event) => {
        this.setState({ user: {...this.state.user, recaptchaResponse: event}});
    }

    componentDidMount() {
        const {inviteResponse, params} = this.props;
        if (params && params.createNew === "createNew") {
            this.setState({ user : { ...this.state.user, isNewAccount: true }});
        }
        if (inviteResponse) {
            this.setState({
                user: {
                    isNewAccount: inviteResponse.createNew === "createNew" ? true : false,
                    firstName: inviteResponse.firstName,
                    lastName: inviteResponse.lastName,
                    username: this.validateEmail(inviteResponse.emailAddress) ? inviteResponse.emailAddress : '',
                    usernameConfirm: this.validateEmail(inviteResponse.emailAddress) ? inviteResponse.emailAddress : '',
                    clave: '',
                    claveConfirm: '',
                }
            })
						//Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
            //this.validateEmail(inviteResponse.emailAddress) ? document.getElementById("clave").focus() : document.getElementById("username").focus();
        } else {
						//Don't do this since it may be the culprit of a false login when the browser is putting in the credentials that the user saved
						//The user clicks and although the saved credentials should work, there is an error about a bad username and password.  But a second click works.
						//It's just that the user is thrown with that error and may not continue.
						// document.getElementById("username").value = window.localStorage.getItem("loginUsername") || '';
						// document.getElementById("clave").value = '';
            //document.getElementById("username").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
        }
				let username = window.localStorage.getItem("loginUsername");
				if (username) this.setState({ user: {...this.state.user, username } })
    }

    componentDidUpdate() {
				const {loginData} = this.props;
        const {isShowingFailedLogin, isShowingMatchingRecord, setResponse} = this.state;

        if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData.error && !setResponse) {
            if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                this.setState({ errors: {username: <L p={p} t={`Username already exists`}/>}, isSubmitted: false, setResponse: true });
            } else {
								this.setState({ errors: {username: <L p={p} t={`Username or password not found`}/>}, isSubmitted: false, setResponse: true });
            }
        }
    }

    changeUser = (event) => {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
				if (field.indexOf('username') > -1 || field.indexOf('password') > -1) user[field] = user[field].replace(/ /g, '');
        this.setState({ user });
        this.showLoginButton();
    }

    handleEnterKey = (event) => {
				event.key === "Enter" && this.processForm('LOGIN');
        //event.key === "Enter" && this.handleSystemUpdateMessageOpen();
    }

    showLoginButton = () => {
        const {user} = this.state;
        if ((this.state.user.isNewAccount && user.firstName && user.username && user.usernameConfirm && this.validateEmail(user.username) && user.clave && user.claveConfirm)
        || (!this.state.user.isNewAccount && user.username && this.validateEmail(user.username) && user.clave)) {
            this.setState({isUserComplete: true});
        } else {
            this.setState({isUserComplete: false});
        }
    }

    registerNewAccount = () => {
        let user = Object.assign({}, this.state.user);
        user.isNewAccount = true;
        this.setState({user});
        this.showLoginButton();
        //document.getElementById("firstName").focus();
    }

    loginControls = () => {
        let user = Object.assign({}, this.state.user);
        user.isNewAccount = false;
        this.setState({user});
        this.showLoginButton();
        //document.getElementById("username").focus();
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
        return re.test(email.toLowerCase());
    }

    processForm = (sendToLogin="") => {
        // prevent default action. in this case, action is the form submission event
        const {user} = this.state;
        //event && event.preventDefault();
        let errors = {};
				let missingInfoMessage = [];

        // if (user.isNewAccount && !user.orgName) {
        //     errors.orgName = "Organization name required";
        //     hasError = true;
        // }

        if (user.isNewAccount && !user.firstName) {
            errors.firstName = <L p={p} t={`First name required`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
        }

        if (!user.username) {
            errors.username = <L p={p} t={`Please enter your username`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username`}/></div>
        }
        if (!user.clave) {
            errors.clave = <L p={p} t={`Please enter a password.`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password`}/></div>
        } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
            errors.clave = <L p={p} t={`The password and confirmation do not match`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password and confirmation do not match`}/></div>
        }

        this.setState({errors});
        if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
            this.handleManheimGradeCheck(sendToLogin);
            //this.loginButton.style.display = 'none';  This was used for creating a new account so that a second click wouldn't create a second company and all of the fill-in records.
            this.setState({isSubmitted: true, setResponse: false});
						window.localStorage.setItem("loginUsername", user.username);
						//window.localStorage.setItem("clave", user.clave);
				} else {
						this.handleMissingInfoOpen(missingInfoMessage);
        }
    }

		handleFailedLoginOpen = () => this.setState({isShowingFailedLogin: true, isSubmitted: false})
    handleFailedLoginClose = () => {
        this.setState({isShowingFailedLogin: false})
        this.props.logout(); //This is used to clear the error
    }

		handleSystemUpdateMessageOpen = () => this.setState({isShowingSystemUpdateMessage: true})
    handleSystemUpdateMessageClose = () => {
        this.setState({isShowingSystemUpdateMessage: false})
        this.processForm('LOGIN');
    }

    handleMatchingRecordClose = () => {
        this.setState({isShowingMatchingRecord: false})
        this.props.logout(); //This is used to clear the error
    }
    handleMatchingRecordOpen = () => this.setState({isShowingMatchingRecord: true})

		handleSelectedFeature = (jefFeatureId) => {
				//If the feature is selected, remove it. Otherwise, add it.
				let selectedFeatures = Object.assign([], this.state.selectedFeatures);
				if (selectedFeatures && selectedFeatures.length > 0 && selectedFeatures.indexOf('jefFeatureId') > -1) {
						selectedFeatures = selectedFeatures.filter(id => id !== jefFeatureId);
				} else {
						selectedFeatures = selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures.concat(jefFeatureId) : [jefFeatureId];
				}
				this.setState({ selectedFeatures });
		}

		hasSelected = (jefFeatureId) => {
				const {selectedFeatures} = this.state;
				return selectedFeatures && selectedFeatures.length > 0 && selectedFeatures.indexOf(jefFeatureId) > -1;
		}

		handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

    handleManheimGradeCheck = (sendToLogin="") => {
        const {login, inviteResponse} = this.props;
        let personId = this.props.personId;
        const user = Object.assign({}, this.state.user);
        let errors = {};
        let usernameNotGradeLevelManheim = true;
        let hasError = false;

        if (!user.username) {
            hasError = true;
            errors.username = "The username is required";
        }

        if (!hasError) {
            if (!personId) personId = guidEmpty;
            axios.get(`${apiHost}ebi/username/gradeLevelManheim/${personId}/${encodeURIComponent(user.username)}`,
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
                if (response && response.data === 'NotGradeLevelManheim') {
                    errors.username = 'You are not in open registration. Only the grades that have an open registration can access the system currently.';
                    usernameNotGradeLevelManheim = true;
                } else {
                    errors.username = '';
                    usernameNotGradeLevelManheim = false;
                    if (sendToLogin === "LOGIN") login(user, inviteResponse);
                }
                this.setState({errors, usernameNotGradeLevelManheim});
            })
        }
        this.setState({user, errors});
    }
    render() {
				const {user, errors, isShowingFailedLogin, isSubmitted, isShowingSystemUpdateMessage, messageInfoIncomplete,
								isShowingModal_missingInfo, usernameNotGradeLevelManheim} = this.state;

				// let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
				// 							 navigator.userAgent &&
				// 							 navigator.userAgent.indexOf('CriOS') === -1 &&
				// 							 navigator.userAgent.indexOf('FxiOS') === -1;

        return (
            <div className={styles.container}>
								<div>
										<div className={styles.centered}>
												<div className={styles.topLogo}>
														<img src={eCademy} alt={`eCADEMY.app`} />
												</div>
										</div>
										{false &&
											<div className={classes(styles.safariMessage)}>
														<L p={p} t={`Safari error:  There is a known but intermittent problem with the Safari browser.  If the button below does not work, please use another browser, such as Chrome.`}/>
												</div>
										}
										<div className={styles.loginNarrow}>
												<InputText
														size={"medium"}
														name={"username"}
														label={<L p={p} t={`Username`}/>}
														value={user.username}
														onChange={this.changeUser}
                            onBlur={this.handleManheimGradeCheck}
														error={errors.username} />
												{!usernameNotGradeLevelManheim &&
                            <InputText
    		                        isPasswordType={true}
    		                        size={"medium"}
    		                        value={user.clave}
    		                        name={"clave"}
    		                        onChange={this.changeUser}
    		                        onEnterKey={this.handleEnterKey}
    		                        label={<L p={p} t={`Password`}/>}
    														autoComplete={'dontdoit'}
    		                        error={errors.clave} />
                        }
												{!isSubmitted && !usernameNotGradeLevelManheim &&
														<div>
																<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Login`}/>} onClick={() => this.processForm('LOGIN')} />
														</div>
												}
												{isSubmitted &&
														<div className={styles.loading}>
																<Loading isLoading={isSubmitted} />
														</div>
												}
												<br/>
                        {!usernameNotGradeLevelManheim &&
    												<div>
    														<Link to={`/forgotPassword`} className={styles.forgotPassword}><L p={p} t={`Forgot your password?`}/></Link>
    												</div>
                        }
												<br/>
												<div>
				                		<Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
												</div>
										</div>
										<hr/>
										<div className={classes(styles.contactPosition, styles.centerNarrow)}>
												<div className={styles.contact}><L p={p} t={`CONTACT`}/></div>
												<div className={classes(styles.contactInfo, styles.row)}>
														<a href={'mailto: support@ecademy.app'} className={classes(globalStyles.link, styles.contactEmail)}>{`support@ecademy.app`}</a>
												</div>
										</div>
										<hr/>
								</div>
								<div className={styles.laptopPhone}>
										<img src={LaptopPhone} alt={`eCADEMY.app`} />
								</div>
								<div className={styles.textLanding}><L p={p} t={`The same progressive-web-app across all devices`}/></div>
								<br/>
                <OneFJefFooter />
								{isShowingFailedLogin &&
                  <MessageModal handleClose={this.handleFailedLoginClose} heading={<L p={p} t={`Login`}/>}
                     explainJSX={<L p={p} t={`Your username or password does not match our records.  Please check your entry and try again.`}/>}
                     onClick={this.handleFailedLoginClose} />
                }
								{isShowingSystemUpdateMessage &&
                  <MessageModal handleClose={this.handleSystemUpdateMessageClose} heading={<L p={p} t={`New System Update`}/>}
                     explainJSX={<L p={p} t={`The system has had a significant update.  If you discover or suspect any function that is not working or any data that is missing, please notify us directly:  support@eCademy.app.`}/>}
                     onClick={this.handleSystemUpdateMessageClose} />
                }
								{isShowingModal_missingInfo &&
										<MessageModal handleClose={this.handleMissingInfoClose} heading={`Missing information`}
											 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
								}
            </div>
        );
    }
}

export default LandingView;
