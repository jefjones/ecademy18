import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './InitStudentLoginView.css';
import InputText from '../../components/InputText';
import TextDisplay from '../../components/TextDisplay';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import eCademy from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

class InitStudentLoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserComplete: false,
            errors: {},
            user: {
                username: '', //'addisyn@penspring.com', // '', //
                clave: '', //'j',
                claveConfirm: '',
            }
        };
    }

    changeUser = ({target}) => {
        this.setState({ user: {...this.state.user, [target.name]: target.value} });
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm();
    }


    processForm = (event) => {
        const {setPassword, newLoginPersonId, username} = this.props;
        const {user} = this.state;
        //event && event.preventDefault();
        let errors = {};
				let missingInfoMessage = [];

        if (!user.clave) {
            errors.clave = <L p={p} t={`Please enter a password.`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password`}/></div>
        } else if (user.clave.length < 6) {
            errors.clave = <L p={p} t={`Password must be at least 6 characters long.`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password must be at least 6 characters`}/></div>
				} else if (user.clave !== user.claveConfirm) {
            errors.clave = <L p={p} t={`The password and confirmation do not match`}/>;
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Password and confirmation do not match`}/></div>
        }

        if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
						user.username = username;
						user.personId = newLoginPersonId;
            setPassword(newLoginPersonId, user);
            this.setState({isSubmitted: true, errors: {} });
						browserHistory.push('/firstNav');
        } else {
						this.handleMissingInfoOpen(missingInfoMessage);
						this.setState({ errors });
				}

    }

		handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

    render() {
				const {username} = this.props;
        const {user, errors, isShowingModal_missingInfo, messageInfoIncomplete} = this.state;

        return (
            <section className={styles.container}>
								<form>
										<div className={styles.topLogo}>
												<a href={'https://www.eCademy.app'} target={'_eCademyApp'}>
														<img src={eCademy} alt={`eCademyApp`} />
				                </a>
										</div>
										<div className={classes(globalStyles.pageTitle, styles.width, styles.moreTop)}>
					              Reset Password
					          </div>
										<TextDisplay label={<L p={p} t={`Username`}/>} text={username} />
		                <div>
		                    <InputText
														label={<L p={p} t={`New Password`}/>}
		                        isPasswordType={true}
		                        size={"medium-long"}
		                        value={user.clave || ''}
		                        id={"clave"}
		                        name={"clave"}
		                        onChange={this.changeUser}
		                        onEnterKey={this.handleEnterKey}
														autoComplete={'dontdoit'}
														required={true}
														whenFilled={user.clave}
		                        error={errors.clave} />
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
												<ButtonWithIcon label={user.isNewAccount ? <L p={p} t={`Create`}/> : <L p={p} t={`Login`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
		                </div>
		                <hr />
								</form>
                <OneFJefFooter />
								{isShowingModal_missingInfo &&
										<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
											 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
								}
            </section>
        );
    }
}

export default InitStudentLoginView;
