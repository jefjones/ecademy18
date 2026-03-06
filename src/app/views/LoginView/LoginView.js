import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './LoginView.css';
const p = 'LoginView';
import L from '../../components/PageLanguage';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import Loading from '../../components/Loading';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
//import Recaptcha from 'react-recaptcha';

class LoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
						// document.getElementById("username").value = localStorage.getItem("loginUsername") || '';
						// document.getElementById("clave").value = '';
            //document.getElementById("username").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
        }
				let username = localStorage.getItem("loginUsername");
				if (username) this.setState({ user: {...this.state.user, username } })
    }

    componentDidUpdate() {
				const {loginData} = this.props;
        const {isShowingFailedLogin, isShowingMatchingRecord, setResponse} = this.state;

        if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData.error && !setResponse) {
            if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                this.setState({ errors: {username: <L p={p} t={`This email address (username) is already taken`}/>}, isSubmitted: false, setResponse: true });
            } else {
								this.setState({ errors: {username: <L p={p} t={`The username or password is not found`}/>}, isSubmitted: false, setResponse: true });
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
        event.key === "Enter" && this.processForm();
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

    processForm = (event) => {
        // prevent default action. in this case, action is the form submission event
        const {login, inviteResponse} = this.props;
        const {user} = this.state;
        event && event.preventDefault();
        let errors = {};
        let hasError = false;

        if (user.isNewAccount && !user.orgName) {
            errors.orgName = <L p={p} t={`Organization name required`}/>;
            hasError = true;
        }

        if (user.isNewAccount && !user.firstName) {
            errors.firstName = <L p={p} t={`First name required`}/>;
            hasError = true;
        }

        if (!user.username) {
            errors.username = <L p={p} t={`Please enter your username`}/>;
            hasError = true;
        // } else if (!this.validateEmail(user.username)) {
        //     errors.username = <L p={p} t={`Email address appears to be invalid`}/>;
        //     hasError = true;
        }
        if (!user.clave) {
            errors.clave = <L p={p} t={`Please enter a password.`}/>;
            hasError = true;
        } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
            errors.clave = <L p={p} t={`The password and confirmation do not match`}/>;
            hasError = true;
        }

        // if (user.isNewAccount && !user.recaptchaResponse) {
        //     errors.recaptcha = <L p={p} t={`Please verify that you are not a robot`}/>;
        //     hasError = true;
        // }
        this.setState({errors});
        //Help ToDo - put the secure password length and details in.
        if (!hasError) {
            login(user, inviteResponse);
            //this.loginButton.style.display = 'none';  This was used for creating a new account so that a second click wouldn't create a second company and all of the fill-in records.
            this.setState({isSubmitted: true, setResponse: false});
						localStorage.setItem("loginUsername", user.username);
						localStorage.setItem("clave", user.clave);
        }
    }

		handleFailedLoginOpen = () => this.setState({isShowingFailedLogin: true, isSubmitted: false})
    handleFailedLoginClose = () => {
        this.setState({isShowingFailedLogin: false})
        this.props.logout(); //This is used to clear the error
    }

    handleMatchingRecordClose = () => {
        this.setState({isShowingMatchingRecord: false})
        this.props.logout(); //This is used to clear the error
    }
    handleMatchingRecordOpen = () => this.setState({isShowingMatchingRecord: true})

    render() {
        const {user, errors, isShowingFailedLogin, isShowingMatchingRecord, isSubmitted} = this.state;

        return (
            <section className={styles.container}>
                <a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
										<img src={eCademy} alt={`eCademyApp`} />
                </a>
								<form>
		                <div className={styles.textLogo}>
		                    <span className={styles.textBeforeLogo}>
		                        {user.isNewAccount &&
		                            <span onClick={this.loginControls} className={styles.signUp}>
		                            	<L p={p} t={`Sign in`}/>
		                            </span>
		                        }
		                        {!user.isNewAccount && <span className={styles.chosen}> <L p={p} t={`Sign in`}/> </span>}
		                    </span>
		                </div>
										{/*<div className={styles.newsUpdate}>
												March 21, Thursday:  The messaging pages have been reworked to function better and to display messages with full threads.
										</div>*/}
		                {user.isNewAccount &&
		                    <div>
		                        <InputText
		                            size={"medium-long"}
		                            name={"orgName"}
		                            label={<L p={p} t={`Organization name`}/>}
		                            value={user.orgName}
		                            onChange={this.changeUser}
		                            onEnterKey={this.handleEnterKey}
		                            error={errors.orgName} />

		                        <div className={styles.nameFull}>
		                            <InputText
		                                size={"medium-left"}
		                                name={"firstName"}
		                                label={<L p={p} t={`First name`}/>}
		                                value={user.firstName}
		                                onChange={this.changeUser}
		                                onEnterKey={this.handleEnterKey}
		                                error={errors.firstName} />

		                            <InputText
		                                size={"medium-right"}
		                                name={"lastName"}
		                                label={<L p={p} t={`Last name`}/>}
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
		                        name={"username"}
		                        label={<L p={p} t={`Username`}/>}
		                        value={user.username}
		                        onChange={this.changeUser}
		                        onEnterKey={this.handleEnterKey}
		                        error={errors.username} />
		                </div>
		                {user.isNewAccount &&
		                    <div>
		                        <InputText
		                            size={"medium-long"}
		                            name={"usernameConfirm"}
		                            value={user.usernameConfirm}
		                            onChange={this.changeUser}
		                            onEnterKey={this.handleEnterKey}
		                            label={<L p={p} t={`Confirm email address`}/>}
		                            error={errors.usernameConfirm} />
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
		                        label={<L p={p} t={`Password`}/>}
														autoComplete={'dontdoit'}
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
		                            label={<L p={p} t={`Password confirm`}/>}
																autoComplete={'dontdoit'}
		                            error={errors.claveConfirm} />
		                    </div>
		                }
		                {/*user.isNewAccount &&
		                    <div className={styles.recaptcha}>
		                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={this.verifyCallback}/>
		                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
		                    </div>
		                    */
		                }
		                <div className={styles.row}>
		                    {!isSubmitted &&
														<ButtonWithIcon label={user.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Login`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
												}
												{isSubmitted &&
														<div className={styles.loading}>
																<Loading isLoading={isSubmitted} />
														</div>
												}
		                </div>
										<Link to={`/forgotPassword`} className={styles.forgotPassword}><L p={p} t={`Forgot your password?`}/></Link>
										<br/>
										<br/>
		                <Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
										<br/>
								</form>
                <OneFJefFooter />
                {isShowingFailedLogin &&
                  <MessageModal handleClose={this.handleFailedLoginClose} heading={<L p={p} t={`Login`}/>}
                     explainJSX={<L p={p} t={`Your username or password does not match our records.  Please check your entry and try again.`}/>}
                     onClick={this.handleFailedLoginClose} />
                }
                {isShowingMatchingRecord &&
                  <MessageModal handleClose={this.handleMatchingRecordClose} heading={<L p={p} t={`Login`}/>}
                     explainJSX={<L p={p} t={`A new account has been requested but there is a matching email address in our records.  Please choose 'Forgot your password?' option to reset your password and to get access to the existing account.`}/>}
                     onClick={this.handleMatchingRecordClose} />
                }
            </section>
        );
    }
}

export default LoginView;


// <br/>
// <Link to={`/createNewSchool`} className={classes(styles.bold, styles.forgotPassword)}>Create your own eCademyApp School</Link>
