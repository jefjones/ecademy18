import React, {Component} from 'react';
import styles from './LoginView.css';
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

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.showLoginButton = this.showLoginButton.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
        this.handleMessageOpen = this.handleMessageOpen.bind(this);
    }

    componentDidUpdate() {
        const {isShowingModal, resetMessage} = this.state;
        const {loginData} = this.props;

        if (!isShowingModal && !resetMessage && loginData && loginData.passwordResetComplete) {
            this.handleMessageOpen();
        }
    }

    changeUser({target}) {
        this.setState({ user: {...this.state.user, [target.name]: target.value} });
        this.showLoginButton();
    }

    handleEnterKey(event) {
        event.key === "Enter" && this.processForm();
    }

    showLoginButton() {
        const {user} = this.state;
        if ((user.emailAddress && user.emailAddressConfirm && this.validateEmail(user.emailAddress)) // && user.clave && user.claveConfirm
        || (!this.state.user.isNewAccount && user.emailAddress && this.validateEmail(user.emailAddress))) { // && user.clave
            this.setState({isUserComplete: true});
        } else {
            this.setState({isUserComplete: false});
        }
    }

    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        const {setResetPasswordResponse, params} = this.props;
        const {user} = this.state;

        event && event.preventDefault();
        let errors = {};
        let hasError = false;

        if (!user.clave) {
            errors.clave = "Please enter a password.";
            hasError = true;
        } else if (user.clave !== user.claveConfirm) {
            errors.clave = "The password and confirmation do not match.";
            hasError = true;
        }

        this.setState({errors, requestSent: true});
        if (!hasError && params && params.resetCode) {
            setResetPasswordResponse(params.resetCode, params.emailAddress, user.clave)
        }
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
        return re.test(email.toLowerCase());
    }

    handleMessageClose = () => {
        this.setState({isShowingModal: false, resetMessage: true, requestSent: false})
    }
    handleMessageOpen = () => this.setState({isShowingModal: true})

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
                <div className={styles.login}>
                    Reset Password
                </div>
                <div>
                    <InputText
                        isPasswordType={true}
                        size={"medium-long"}
                        value={user.clave}
                        name={"clave"}
                        label={``}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        placeholder={"password"}
                        error={errors.clave} />
                </div>
                <div>
                    <InputText
                        isPasswordType={true}
                        size={"medium-long"}
                        value={user.claveConfirm}
                        name={"claveConfirm"}
                        label={``}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        placeholder={"password confirm"}
                        error={errors.claveConfirm} />
                </div>
                {loginData && loginData.passwordResetComplete &&
                    <div className={styles.passwordResetRequest}>
                        <Link className={styles.resetButton} to={`/login`}>
                            Login
                        </Link>
                    </div>
                }
                {(!loginData || (loginData && !loginData.passwordResetComplete)) && !requestSent &&
                    <div>
												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={this.processForm}/>
                    </div>
                }
                {isShowingModal && loginData && loginData && loginData.passwordResetComplete &&
                  <MessageModal handleClose={this.handleMessageClose} heading={`Password Reset`}
                     explain={loginData.passwordResetComplete}
                     onClick={this.handleMessageClose} />
                }
                <OneFJefFooter />
            </section>
        );
    }
}

export default ResetPasswordView;
