import React, {Component} from 'react';
import styles from './LoginView.css';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import OneFJefFooter from '../../components/OneFJefFooter';

class ForgotPasswordView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserComplete: false,
            isShowingModal: false,
            resetError: false,
            errors: {},
            user: {
                emailAddress: '',
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
        this.handleMessageOpen = this.handleMessageOpen.bind(this);
    }

    componentDidUpdate() {
        const {isShowingModal, resetError} = this.state;
        const {loginData} = this.props;

        if (!isShowingModal && !resetError && loginData.passwordResetRequest) {
            this.handleMessageOpen();
        }
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        field === "emailAddress" && this.setState({errorEmailAddress: ''});
        if (field === "emailAddress") user[field] = user[field].replace(/ /g, "");
        this.setState({ user });
    }

    handleEnterKey(event) {
        event.key === "Enter" && this.processForm();
    }

    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        const {forgotPassword} = this.props;
        const {user} = this.state;
        event && event.preventDefault();
        let errors = {};
        let hasError = false;

        if (!user.emailAddress) {
            errors.emailAddress = "Please enter your email address.";
            hasError = true;
        } else if (!this.validateEmail(user.emailAddress)) {
            errors.emailAddress = "Email address appears to be invalid.";
            hasError = true;
        }

        this.setState({errors});
        //Help ToDo - put the error checking condition back in.
        if (!hasError) {
            forgotPassword(user.emailAddress, user.phone);
        }
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
        return re.test(email.toLowerCase());
    }

    handleMessageClose = () => {
        this.setState({isShowingModal: false, resetError: true})
    }
    handleMessageOpen = () => this.setState({isShowingModal: true})

    render() {
        const {user, errors, isShowingModal} = this.state;
        const {loginData} = this.props;

        return (
            <section className={styles.container}>
                <div>
										<a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
												<img src={eCademy} alt={`eCademyApp`} />
		                </a>
                </div>
                <div className={styles.login}>
                    Request to Reset Password
                </div>
                <div>
                    <InputText
                        size={"medium-long"}
                        name={"emailAddress"}
                        value={user.emailAddress}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        placeholder={"email address"}
                        error={errors.emailAddress} />
                </div>
                <div>
										<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={this.processForm}/>
                </div>
                {isShowingModal && loginData.passwordResetRequest &&
                  <MessageModal handleClose={this.handleMessageClose} heading={`Password Reset`}
                     explain={loginData.passwordResetRequest}
                     onClick={this.handleMessageClose} />
                }
                <OneFJefFooter />
            </section>
        );
    }
}

export default ForgotPasswordView;
