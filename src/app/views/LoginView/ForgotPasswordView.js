import React, {Component} from 'react';
import styles from './LoginView.css';
const p = 'LoginView';
import L from '../../components/PageLanguage';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import OneFJefFooter from '../../components/OneFJefFooter';
import ButtonWithIcon from '../../components/ButtonWithIcon';

class ForgotPasswordView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserComplete: false,
            isShowingModal: false,
            resetError: false,
						isSubmitted: false,
            errors: {},
            user: {
                username: '',
            }
        };

    }

		componentDidMount() {
				//document.getElementById('username').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
		}

    componentDidUpdate() {
        const {isShowingModal, resetError} = this.state;
        const {loginData} = this.props;

        if (!isShowingModal && !resetError && loginData.passwordResetRequest) {
            //this.handleMessageOpen();
        }
    }

    changeUser = (event) => {
        const field = event.target.name;
        let user = this.state.user;
        user[field] = event.target.value;
        field === "username" && this.setState({errorUsername: ''});
        if (field === "username") user[field] = user[field].replace(/ /g, "");
        this.setState({ user });
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm();
    }

    processForm = (event) => {
        // prevent default action. in this case, action is the form submission event
        const {forgotPassword} = this.props;
        const {user} = this.state;
        event && event.preventDefault();
        let errors = {};
        let hasError = false;

        if (!user.username) {
            errors.username = <L p={p} t={`Please enter your username.`}/>;
            hasError = true;
        }

        this.setState({errors});
        if (!hasError) {
            forgotPassword(user.username, user.phone, this.props.salta);
						this.setState({ isSubmitted: true });
        }
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
        return re.test(email.toLowerCase());
    }

    handleMessageClose = () => {
        this.setState({isShowingModal: false, resetError: true})
    }
    handleMessageOpen = () => this.setState({isShowingModal: true})

    render() {
        const {user, errors, isShowingModal, isSubmitted} = this.state;

        return (
            <section className={styles.container}>
                <div className={styles.logoPosition}>
										<a href={'https://www.eCademy.app'} target={'_eCademyApp'}>
												<img src={eCademy} alt={`eCademyApp`} />
		                </a>
                </div>
                <div className={styles.login}>
                    <L p={p} t={`Request to Reset Password`}/>
                </div>
                <div>
                    <InputText
                        size={"medium-long"}
                        name={"username"}
												label={<L p={p} t={`Please enter your username`}/>}
                        value={user.username}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        error={errors.username} />
                </div>
                <div className={styles.centered}>
										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
										{isSubmitted &&
                        <div>
    												<div className={styles.forgotPassword}>
    														<L p={p} t={`A link has been sent to your email and/or by text message to reset your password.`}/>
    												</div>
                            <div className={styles.forgotPassword}>
    														<L p={p} t={`If you do not receive an email or text notification, please contact your school's eCademy administrator who can reset your password.`}/>
    												</div>
                        </div>
										}
                </div>
                {isShowingModal && //loginData.passwordResetRequest &&
                  <MessageModal handleClose={this.handleMessageClose} heading={<L p={p} t={`Password Reset`}/>}
                     explainJSX={<L p={p} t={`An email has been sent to the email address that has been entered`}/>}
                     onClick={this.handleMessageClose} />
                }
                <OneFJefFooter />
            </section>
        );
    }
}

export default ForgotPasswordView;

//explain={loginData.passwordResetRequest
