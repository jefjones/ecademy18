import React, {Component} from 'react';
import {browserHistory} from 'react-router';
const p = 'StudentScheduleView';
import L from '../../components/PageLanguage';
import styles from './StudentChoiceMenu.css';
import {guidEmpty} from '../../utils/guidValidate.js';
import classes from 'classnames';
import Icon from '../Icon';
import { withAlert } from 'react-alert';

class StudentChoiceMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

		sendToStudentSchedule = (studentPersonId) => {
				const {getStudentSchedule, personId, schoolYearId} = this.props;
				browserHistory.push('/studentSchedule/' + studentPersonId);
				getStudentSchedule(personId, studentPersonId, schoolYearId);
		}

    sendToComposeMessage = (studentPersonId) => {
				const {students} = this.props;
        var student = students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0];
        if (student && student.firstName) {
			      browserHistory.push(`/announcementEdit/new/EMPTY/${studentPersonId}/${student.firstName}/${student.lastName}`);
        }
		}

		singleAddToClipboard = (studentPersonId) => {
				const {addUserPersonClipboard, personId, companyConfig} = this.props;
				//this.props.alert.info(<div className={styles.alertText}>{`The student clipboard had 1 record added.`}</div>)
				addUserPersonClipboard(personId, {
						companyId: companyConfig.companyId,
						userPersonId: personId,
						personList: [studentPersonId],
						personType: 'STUDENT'
				});
		}

		singleRemoveFromClipboard = (studentPersonId) => {
				const {removeStudentUserPersonClipboard, personId} = this.props;
				//this.props.alert.info(<div className={styles.alertText}>{`The student clipboard had 1 record added.`}</div>)
				removeStudentUserPersonClipboard(personId, studentPersonId, 'STUDENT')
		}

		missingChoice = () => {
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Please choose a student`}/></div>)
		}

    render() {
        const {className="", personId, studentPersonId, studentType, personConfig, userPersonClipboard, companyConfig, excludeClipboard,
                noBackground, getRegistrationByStudent} = this.props;
				let hasChosen = !studentPersonId || studentPersonId === guidEmpty ? false : true;

        return (
            <div className={classes(styles.container, className, (noBackground ? '' : styles.background))}>
								{!excludeClipboard && ((!userPersonClipboard || !userPersonClipboard.personList || !userPersonClipboard.personList.length
												|| (userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0 && userPersonClipboard.personList.indexOf(studentPersonId) === -1)))

										? <a onClick={!hasChosen ? this.missingChoice : () => this.singleAddToClipboard(studentPersonId)} data-rh={'Add student to clipboard'}>
													<Icon pathName={'clipboard_text'} superscript={'plus'} supFillColor={'#0b7508'} premium={true}
															superScriptClass={classes(styles.plusPosition, (!hasChosen ? styles.opacityLow : ''))}
															className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
											</a>

										: !excludeClipboard
												? <a onClick={!hasChosen ? this.missingChoice : () => this.singleRemoveFromClipboard(studentPersonId)} data-rh={'Remove student from clipboard'}>
															<Icon pathName={'clipboard_text'} superscript={'cross'} supFillColor={'#ff0000'} premium={true}
																	superScriptClass={classes(styles.plusPosition, (!hasChosen ? styles.opacityLow : ''))}
																	className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
													</a>
												: ''
								}
								{userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0 && userPersonClipboard.personList.indexOf(studentPersonId) > -1 &&
										<div className={styles.missingIcon}></div>
								}
								<a onClick={!hasChosen ? this.missingChoice : () => this.sendToComposeMessage(studentPersonId)} data-rh={'Send a message to this student'}>
										<Icon pathName={'comment_text'} premium={true} className={classes(styles.imageLessLeft, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasChosen ? this.missingChoice : () => this.sendToStudentSchedule(studentPersonId)} data-rh={`Student's schedule`}>
										<Icon pathName={'clock3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
								</a>
                <a onClick={!hasChosen ? this.missingChoice : () => { getRegistrationByStudent(personId, studentPersonId, companyConfig.schoolYearId); browserHistory.push('/studentProfile/' + studentPersonId + `/` + personConfig.schoolYearId) }} data-rh={`Student's profile`}>
										<Icon pathName={'info'} className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
								</a>
								{studentType === 'ACADEMY' &&
										<a onClick={!hasChosen ? this.missingChoice : () => browserHistory.push('/courseAttendanceSingle/' + studentPersonId)} data-rh={'Attendance'}>
												<Icon pathName={'calendar_check'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
										</a>
								}
            </div>
        )
    }
};

export default withAlert(StudentChoiceMenu);
