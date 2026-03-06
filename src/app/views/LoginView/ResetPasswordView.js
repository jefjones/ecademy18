import React, {Component} from 'react';
import styles from './LoginView.css';
const p = 'LoginView';
import L from '../../components/PageLanguage';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import {Link} from 'react-router';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import OneFJefFooter from '../../components/OneFJefFooter';

class ResetPasswordView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserComplete: false,
            isShowingModal: false,
            resetMessage: false,
            requestSent: false,
            errors: {},
            user: {
                clave: '',
                claveConfirm: '',
            }
        };
    }

		componentDidMount() {
				//document.getElementById('clave').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
		}

    componentDidUpdate() {
        const {isShowingModal, resetMessage} = this.state;
        const {loginData} = this.props;

        if (!isShowingModal && !resetMessage && loginData && loginData.passwordResetComplete) {
            this.handleMessageOpen();
        }
    }

    changeUser = ({target}) => {
        this.setState({ user: {...this.state.user, [target.name]: target.value} });
        this.showLoginButton();
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm();
    }

    showLoginButton = () => {
        const {user} = this.state;
        if ((user.emailAddress && user.emailAddressConfirm && this.validateEmail(user.emailAddress)) // && user.clave && user.claveConfirm
        || (!this.state.user.isNewAccount && user.emailAddress && this.validateEmail(user.emailAddress))) { // && user.clave
            this.setState({isUserComplete: true});
        } else {
            this.setState({isUserComplete: false});
        }
    }

    processForm = (event) => {
        // prevent default action. in this case, action is the form submission event
        const {setResetPasswordResponse, params} = this.props;
        const {user} = this.state;

        event && event.preventDefault();
        let errors = {};
        let hasError = false;

        if (!user.clave) {
            errors.clave = <L p={p} t={`Please enter a password.`}/>;
            hasError = true;
				} else if (user.clave.length < 6) {
            errors.clave = <L p={p} t={`The password must be at least 6 characters long`}/>;
            hasError = true;
        } else if (user.clave !== user.claveConfirm) {
            errors.clave = <L p={p} t={`The password and confirmation do not match.`}/>;
            hasError = true;
        }

        this.setState({errors, requestSent: true});
        if (!hasError && params && params.resetCode) {
            setResetPasswordResponse(params.resetCode, params.emailAddress, user.clave)
						this.handleMessageOpen();
        }
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
        return re.test(email.toLowerCase());
    }

		handleMessageOpen = () => this.setState({isShowingModal: true})
    handleMessageClose = () => {
        this.setState({isShowingModal: false, resetMessage: true, requestSent: false})
    }

    render() {
        const {loginData} = this.props;
        const {user, errors, isShowingModal, requestSent} = this.state;

        return (
            <section className={styles.container}>
                <div>
										<a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
												<img src={eCademy} alt={`eCademyApp`} />
		                </a>
                </div>
								<br/>
                <div className={styles.login}>
                    <L p={p} t={`Reset Password`}/>
                </div>
                <div>
                    <InputText
                        isPasswordType={true}
                        size={"medium-long"}
                        value={user.clave}
												id={"clave"}
                        name={"clave"}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        label={<L p={p} t={`New password`}/>}
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
                        label={<L p={p} t={`Confirm new password`}/>}
                        error={errors.claveConfirm} />
                </div>
                {loginData && loginData.passwordResetComplete &&
                    <div className={styles.passwordResetRequest}>
                        <Link className={styles.resetButton} to={`/login`}>
                            <L p={p} t={`Login`}/>
                        </Link>
                    </div>
                }
                {(!loginData || (loginData && !loginData.passwordResetComplete)) && !requestSent &&
                    <div>
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
                    </div>
                }
                {isShowingModal && loginData && loginData && loginData.passwordResetComplete &&
	                  <MessageModal handleClose={this.handleMessageClose} heading={<L p={p} t={`Password Reset`}/>}
	                     explain={loginData.passwordResetComplete}
	                     onClick={this.handleMessageClose} />
                }
                <OneFJefFooter />
            </section>
        );
    }
}

export default ResetPasswordView;
