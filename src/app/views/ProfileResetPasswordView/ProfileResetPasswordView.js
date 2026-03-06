import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './ProfileResetPasswordView.css';
import InputText from '../../components/InputText';
import TextDisplay from '../../components/TextDisplay';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class ProfileResetPasswordView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserComplete: false,
            errors: {},
            user: {
            }
        };
    }

		componentDidUpdate() {
				const {loginData} = this.props;
        const {isInit} = this.state;
        if (!isInit && loginData && loginData.username) {
			      this.setState({ user: loginData, isInit: true });
        }
		}

    changeUser = ({target}) => {
        this.setState({ user: {...this.state.user, [target.name]: target.value} });
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm();
    }


    processForm = (event) => {
        const {resetMyProfilePassword, personId} = this.props;
        const {user} = this.state;
        event && event.preventDefault();
        let errors = {};
				let hasErrors = false;

				if (!user.oldClave) {
						hasErrors = true;
            errors.oldClave = <L p={p} t={`Please enter the old password.`}/>;
				}

        if (!user.newClave) {
						hasErrors = true;
            errors.newClave = <L p={p} t={`Please enter a new password.`}/>;
        } else if (user.newClave.length < 6) {
						hasErrors = true;
            errors.newClave = <L p={p} t={`Password must be at least 6 characters long.`}/>;
				} else if (user.newClave !== user.claveConfirm) {
						hasErrors = true;
            errors.newClave = <L p={p} t={`The password and confirmation do not match`}/>;
        }

        if (!hasErrors) {
						this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`If the old password was accurate, then your profile has been updated with the new password.`}/></div>);
            resetMyProfilePassword(personId, user.newClave);
            this.setState({isSubmitted: true, errors: {} });
						browserHistory.push('/firstNav');
        } else {
						this.setState({ errors });
				}

    }

    render() {
				const {loginData} = this.props;
        const {user, errors} = this.state;
        return (
            <section className={styles.container}>
								<form>
										<a className={styles.topLogo} href={'https://www.eCademy.app'} target={'_eCademyApp'}>
												<img src={eCademy} alt={`eCademyApp`} />
		                </a>
										<br/>
										<br/>
										<br/>
										<div className={classes(globalStyles.pageTitle, styles.width)}>
					              <L p={p} t={`Reset Password`}/>
					          </div>
										<TextDisplay label={'Username'} text={loginData && loginData.username} />
										<div>
		                    <InputText
														label={<L p={p} t={`Old Password`}/>}
		                        isPasswordType={true}
		                        size={"medium-long"}
		                        value={user.oldClave || ''}
		                        id={"oldClave"}
		                        name={"oldClave"}
		                        onChange={this.changeUser}
		                        onEnterKey={this.handleEnterKey}
														autoComplete={'dontdoit'}
														required={true}
														whenFilled={user.oldClave}
		                        error={errors.oldClave} />
		                </div>
                    <hr/>
		                <div>
		                    <InputText
														label={<L p={p} t={`New Password`}/>}
		                        isPasswordType={true}
		                        size={"medium-long"}
		                        value={user.newClave || ''}
		                        id={"newClave"}
		                        name={"newClave"}
		                        onChange={this.changeUser}
		                        onEnterKey={this.handleEnterKey}
														autoComplete={'dontdoit'}
														required={true}
														whenFilled={user.newClave}
		                        error={errors.newClave} />
		                </div>
		                <div>
		                    <InputText
														label={<L p={p} t={`New Password confirm`}/>}
		                        isPasswordType={true}
		                        size={"medium-long"}
		                        value={user.claveConfirm || ''}
		                        name={"claveConfirm"}
		                        onChange={this.changeUser}
		                        onEnterKey={this.handleEnterKey}
														required={true}
														whenFilled={user.claveConfirm}
		                        error={errors.claveConfirm} />
		                </div>
		                <div>
												<ButtonWithIcon label={user.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
		                </div>
		                <hr />
								</form>
                <OneFJefFooter />
            </section>
        );
    }
}

export default withAlert(ProfileResetPasswordView);
