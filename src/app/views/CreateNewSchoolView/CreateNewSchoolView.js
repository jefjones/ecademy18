import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './CreateNewSchoolView.css';
const p = 'CreateNewSchoolView';
import L from '../../components/PageLanguage';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Checkbox from '../../components/Checkbox';
import RadioGroup from '../../components/RadioGroup';
import Loading from '../../components/Loading';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import OneFJefFooter from '../../components/OneFJefFooter';
//import Recaptcha from 'react-recaptcha';

class CreateNewSchoolView extends Component {
    constructor(props) {
        super(props);

        this.state = {
						isSubmitted: false,
            isUserComplete: false,
            errors: {},
            isShowingFailedLogin: false,
            isShowingMatchingRecord: false,
            user: {
                isNewAccount: true,
                orgName: '',
                firstName: '',
                lastName: '',
                username: '',
                clave: '',
                usernameConfirm: '',
                claveConfirm: '',
                recaptchaResponse: '',
								demoDetails: true,
								gradingType: 'TRADITIONAL',
                intervalType: 'SEMESTERS'
            },

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
						document.getElementById("username").value = localStorage.getItem("loginUsername") || '';
						document.getElementById("clave").value = '';
            //document.getElementById("username").focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
        }
				let username = localStorage.getItem("loginUsername");
				if (username) this.setState({ user: {...this.state.user, username } })
    }

    componentDidUpdate() {
				const {loginData} = this.props;
        const {isShowingFailedLogin, isShowingMatchingRecord} = this.state;

        if (!isShowingFailedLogin && !isShowingMatchingRecord && loginData && loginData.error) {
            if (loginData.error === "MATCHING EMAIL ADDRESS FOUND") {
                this.handleMatchingRecordOpen();
            } else {
                this.handleFailedLoginOpen();
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
        const {login, inviteResponse, organizationNames} = this.props;
        const {user} = this.state;
        event && event.preventDefault();
        let errors = {};
        let hasError = false;

        if (user.isNewAccount) {
						let isDuplicate = organizationNames && organizationNames.length > 0 && organizationNames.filter(m => m.label.replace(' ', '').toLowerCase() === user.orgName.replace(' ', '').toLowerCase())[0];
						if (!user.orgName) {
		            errors.orgName = <L p={p} t={`Organization name required`}/>;
		            hasError = true;
						} else if (isDuplicate && isDuplicate.label) {
								errors.orgName = <L p={p} t={`Organization name already exists`}/>;
		            hasError = true;
						}
        }

        if (user.isNewAccount && !user.firstName) {
            errors.firstName = <L p={p} t={`First name required`}/>;
            hasError = true;
        }

        if (!user.username) {
            errors.username = <L p={p} t={`Please enter your username`}/>;
            hasError = true;
        } else if (!this.validateEmail(user.username)) {
            errors.username = <L p={p} t={`Email address appears to be invalid`}/>;
            hasError = true;
        }

				// if (loginData.isDuplicateUsername) {
				// 		hasError = true;
				// }

        if (!user.clave) {
            errors.clave = <L p={p} t={`Please enter a password`}/>;
            hasError = true;
				} else if (user.clave.length < 6) {
            errors.clave = <L p={p} t={`The password must be at least 6 characters long`}/>;
            hasError = true;
        } else if (user.isNewAccount && user.clave !== user.claveConfirm) {
            errors.clave = <L p={p} t={`The password and confirmation do not match`}/>;
            hasError = true;
        }

        // if (user.isNewAccount && !user.recaptchaResponse) {
        //     errors.recaptcha = "Please verify that you are not a robot";
        //     hasError = true;
        // }
        this.setState({errors});
        //Help ToDo - put the secure password length and details in.
        if (!hasError) {
            login(user, inviteResponse);
            //this.loginButton.style.display = 'none';  This was used for creating a new account so that a second click wouldn't create a second company and all of the fill-in records.
            this.setState({isSubmitted: true});
						localStorage.setItem("loginUsername", user.username);
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

		isDuplicateOrgName = (event) => {
				const {organizationNames} = this.props;
				const {user} = this.state;
				let errors = {};
				let isDuplicate = organizationNames && organizationNames.length > 0 && organizationNames.filter(m => m.label.replace(' ', '').toLowerCase() === user.orgName.replace(' ', '').toLowerCase())[0];

				if (isDuplicate && isDuplicate.label) {
						errors.orgName = <L p={p} t={`Organization name already exists`}/>;
				}
				this.setState({errors});
		}

		checkDuplicateUsername = (event) => {
				this.props.isDuplicateUsername(event.target.value);
		}

		toggleDemoDetails = () => {
				let user = this.state.user;
				user['demoDetails'] = !user['demoDetails'];
				this.setState({ user });
		}

		handleRadioChoice = (field, value) => {
				let user = this.state.user;
				user[field] = value;
				this.setState({ user });
		}

    render() {
        const {loginData} = this.props;
        const {user, errors, isShowingFailedLogin, isShowingMatchingRecord, isSubmitted} = this.state;

        return (
            <div className={styles.container}>
                <a className={styles.topLogo} href={'https://www.penspring.com'} target={'_penspring'}>
										<img src={eCademy} alt={`eCademyApp`} />
                </a>
								<form>
		                <div className={styles.textLogo}>
                    		<L p={p} t={`Create New School`}/>
		                </div>
										{/*<div className={styles.newsUpdate}>
												March 21, Thursday:  The messaging pages have been reworked to function better and to display messages with full threads.
										</div>*/}
                    <div>
                        <InputText
                            size={"medium-long"}
                            name={"orgName"}
                            label={<L p={p} t={`Organization name`}/>}
                            value={user.orgName}
                            onChange={this.changeUser}
                            onEnterKey={this.handleEnterKey}
														onBlur={this.isDuplicateOrgName}
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
		                <div>
		                    <InputText
		                        size={"medium-long"}
		                        name={"username"}
		                        label={<L p={p} t={`Email address`}/>} // (which will be your Username)
		                        value={user.username}
		                        onChange={this.changeUser}
														onBlur={this.checkDuplicateUsername}
		                        onEnterKey={this.handleEnterKey}
		                        // error={loginData.isDuplicateUsername
														// 		? <div className={styles.error}>Duplicate username!</div>
														// 		: errors.username
														// }
														/>
		                </div>
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
		                <div>
		                    <InputText
		                        isPasswordType={true}
		                        size={"medium-long"}
		                        value={user.clave}
		                        name={"clave"}
		                        onChange={this.changeUser}
		                        onEnterKey={this.handleEnterKey}
		                        label={<L p={p} t={`Password`}/>}
		                        error={errors.clave} />
		                </div>
                    <div>
                        <InputText
                            isPasswordType={true}
                            size={"medium-long"}
                            value={user.claveConfirm}
                            name={"claveConfirm"}
                            onChange={this.changeUser}
                            onEnterKey={this.handleEnterKey}
                            label={<L p={p} t={`Password confirm`}/>}
                            error={errors.claveConfirm} />
                    </div>
		                {loginData && loginData.error === "Invalid Login" &&
		                    <div className={styles.errorMessage}>

		                    </div>
		                }
                    {/*<div className={styles.recaptcha}>
                        <Recaptcha sitekey="6Lev004UAAAAACHNRa7RYoK3fA3Hev47keT18S0V" render="explicit" verifyCallback={this.verifyCallback}/>
                        {errors.recaptcha && <div className={styles.alertMessage}>{errors.recaptcha}</div>}
                    </div>*/}
										<div className={styles.moreTop}>
												<RadioGroup
														data={[{id: 'TRADITIONAL', label: <L p={p} t={`Traditional`}/>}, {id: 'STANDARDSRATING', label: <L p={p} t={`Standards-based`}/>}]}
														label={<L p={p} t={`Grading Type`}/>}
														name={`gradingType`}
														horizontal={true}
														className={styles.radio}
														labelClass={styles.radioLabels}
														radioClass={styles.radioClass}
														initialValue={user.gradingType}
														onClick={(value) => this.handleRadioChoice('gradingType', value)}/>
                        <RadioGroup
														data={[{id: 'QUARTERS', label: <L p={p} t={`Quarters`}/>}, {id: 'SEMESTERS', label: <L p={p} t={`Semesters`}/>}, {id: 'TRIMESTERS', label: <L p={p} t={`Trimesters`}/>}]}
														label={<L p={p} t={`Interval type`}/>}
														name={`intervalType`}
														horizontal={true}
														className={styles.radio}
														labelClass={styles.radioLabels}
														radioClass={styles.radioClass}
														initialValue={user.intervalType}
														onClick={(value) => this.handleRadioChoice('intervalType', value)}/>
												<Checkbox
														id={`demoDetails`}
														label={<L p={p} t={`Include demo records:  25 students, 2 teachers and 2 courses with assignments`}/>}
														checked={user.demoDetails}
														onClick={this.toggleDemoDetails}
														labelClass={styles.demoDetails}
														className={styles.checkbox}/>
										</div>
		                <div className={styles.row}>
		                    {!isSubmitted &&
														<div className={styles.createButton}>
																<ButtonWithIcon label={<L p={p} t={`Create`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
														</div>
												}
												{isSubmitted &&
														<div className={styles.loading}>
																<Loading loadingText={<L p={p} t={`Creating your school app`}/>} isLoading={isSubmitted} refreshTo={`/`}/>
														</div>
												}
		                </div>
		                <Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
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
            </div>
        );
    }
}

export default CreateNewSchoolView;
