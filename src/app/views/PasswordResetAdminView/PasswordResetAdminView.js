import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './PasswordResetAdminView.css';
import InputText from '../../components/InputText';
import InputDataList from '../../components/InputDataList';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class PasswordResetAdminView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            userPersonId: ''
        };
    }

    changePerson = (chosenPerson) => this.setState({ userPersonId: chosenPerson && chosenPerson.id, chosenPerson });
    changePassword = ({target}) => this.setState({ clave: target.value });

    processForm = (event) => {
        const {personId, resetPasswordByAdmin} = this.props;
        const {userPersonId, clave} = this.state;
        event && event.preventDefault();
        let errors = {};
				let hasErrors = false;

        if (!userPersonId) {
						hasErrors = true;
            errors.userPersonId = <L p={p} t={`Please choose a user`}/>;
        }

        if (!clave) {
						hasErrors = true;
            errors.clave = <L p={p} t={`Please enter a new password.`}/>;
        } else if (clave.length < 6) {
						hasErrors = true;
            errors.clave = <L p={p} t={`Password must be at least 6 characters long.`}/>;
        }

        if (!hasErrors) {
						this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The password has been reset.`}/></div>);
            resetPasswordByAdmin(personId, userPersonId, clave);
						browserHistory.push('/firstNav');
        } else {
						this.setState({ errors });
				}
    }

    render() {
        const {personId, users, myFrequentPlaces, setMyFrequentPlace} = this.props;
        const {chosenPerson, clave, errors} = this.state;

        return (
            <section className={styles.container}>
								<form>
										<div className={classes(globalStyles.pageTitle, styles.width)}>
					              <L p={p} t={`Reset Password (Admin)`}/>
					          </div>
                    <div className={classes(globalStyles.instructionsBigger, styles.maxwidth)}>
                        <L p={p} t={`The admin can set the password for students, parent/guardians, and teachers.`}/>
                    </div>
                    <div className={classes(globalStyles.instructionsBigger, styles.maxwidth)}>
                        <L p={p} t={`If the user has had trouble requesting to reset their password but they are not receiving email notifications, you can communicate their new password to them.`}/>
                    </div>
                    <div className={classes(globalStyles.instructionsBigger, styles.maxwidth)}>
                        <L p={p} t={`When the user logs in for the first time with this new password, they will be redirected to set a personal, private password for themselves.`}/>
                    </div>
                    <div className={styles.moreTop}>
                        <InputDataList
                            id={`userPersonId`}
                            label={<L p={p} t={`User`}/>}
                            value={chosenPerson || {}}
                            options={users}
                            className={styles.moreBottomMargin}
                            height={`medium`}
                            onChange={this.changePerson}
                            required={true}
                            whenFilled={chosenPerson}
                            error={errors.userPersonId}/>
                    </div>
										<div>
		                    <InputText
														label={<L p={p} t={`New Password`}/>}
		                        size={"medium-long"}
		                        value={clave || ''}
		                        id={"clave"}
		                        name={"clave"}
		                        onChange={this.changePassword}
		                        onEnterKey={this.handleEnterKey}
														autoComplete={'dontdoit'}
														required={true}
														whenFilled={clave}
		                        error={errors.clave} />
		                </div>
		                <div className={styles.moreTop}>
												<ButtonWithIcon label={<L p={p} t={`Reset Password`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
		                </div>
								</form>
                  <MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Password Reset (Admin)`}/>} path={'passwordResetAdmin'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
                <OneFJefFooter />
            </section>
        );
    }
}

export default withAlert(PasswordResetAdminView);
