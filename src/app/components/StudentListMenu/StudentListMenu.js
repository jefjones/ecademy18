import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './StudentListMenu.css';
import {guidEmpty} from '../../utils/guidValidate.js';
import DateMoment from '../DateMoment';
import EditTable from '../EditTable';
import SelectSingleDropDown from '../SelectSingleDropDown';
import classes from 'classnames';
import Icon from '../Icon';
import { withAlert } from 'react-alert';
const p = 'component';
import L from '../../components/PageLanguage';

class StudentListMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
						isShowingModal_duplicate: false,
						isShowingModal_hasSchedule: false,
        };
    }

		componentDidUpdate() {
				const {students} = this.props;
				const {studentPersonId, isInit} = this.state;
				if (!isInit && (!studentPersonId || studentPersonId === guidEmpty) && students && students.length > 0)  {
						this.setState({
                isInit: true,
                studentPersonId: students[0].personId,
                studentFirstName: students[0].firstName,
                studentLastName: students[0].lastName
            })
				}
		}

		chooseStudent = () => {
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Choose a student from the list. Then, choose an action.`}/></div>)
		}

		sendToStudentSchedule = (studentPersonId) => {
				const {getStudentSchedule, personId, schoolYearId, setStudentChosenSession, getTheStudent} = this.props;
				browserHistory.push('/studentSchedule/' + studentPersonId);
				getStudentSchedule(personId, studentPersonId, schoolYearId);
        setStudentChosenSession(studentPersonId);
        getTheStudent(personId, studentPersonId);
		}

		sendToGradeReport = (studentPersonId) => {
				const {personId, schoolYearId, setStudentChosenSession, getGradeReport} = this.props;
				browserHistory.push('/gradeReport/' + studentPersonId);
				getGradeReport(personId, studentPersonId, schoolYearId);
				setStudentChosenSession(studentPersonId);
		}

		chooseRecord = (studentPersonId, studentType) => this.setState({ studentPersonId, studentType })

		handleGoToStudentOption = ({target}) => {
				const {studentPersonId, studentFirstName, studentLastName} = this.state;
				if (target && target.value) {
						this.setState({ studentGoTo: target.value });
						if (target.value === 'message') {
								browserHistory.push(`/announcementEdit/new/EMPTY/${studentPersonId}/${studentFirstName}/${studentLastName}`);
						} else if (target.value === 'schedule') {
								this.sendToStudentSchedule(studentPersonId);
						} else if (target.value === 'gradeReport') {
								this.sendToGradeReport(studentPersonId);
						}
				}
		}

    render() {
        const {className="", students, gradeLevels, personConfig, schoolYears, handleUpdateSchoolYear, excludeSchoolYearList} = this.props;
				const {studentPersonId, studentType, studentFirstName, studentLastName, studentGoTo} = this.state;
				let hasRecordChosen = !studentPersonId || studentPersonId === guidEmpty ? false : true;

				var headings = [
						{label: <L p={p} t={`Student`}/>, tightText: true, clickFunction: () => this.resort('label')},
						{label: <L p={p} t={`Grade`}/>, tightText: true, clickFunction: () => this.resort('gradeLevelId')},
						{label: <L p={p} t={`Last Login`}/>, tightText: true, clickFunction: () => this.resort('lastLoginDate')},
				];

				let data = students && students.length > 0 && students.map((m, i) => {
						return [
								{ value: m.label,
										clickFunction: () => this.chooseRecord(m.personId, m.studentType),
										cellColor: m.personId === studentPersonId ? 'highlight' : ''
								},
								{ value: gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(g => g.id === m.gradeLevelId)[0] && gradeLevels.filter(g => g.id === m.gradeLevelId)[0].label,
										clickFunction: () => this.chooseRecord(m.personId, m.studentType),
										cellColor: m.personId === studentPersonId ? 'highlight' : ''
								},
								{ value: m.lastLoginDate > '2010-01-01'
										 		? <DateMoment date={m.lastLoginDate}  format={'D MMM YYYY  h:mm a'} minusHours={6} className={styles.entryDate}/>
												: '',
										clickFunction: () => this.chooseRecord(m.personId, m.studentType),
										cellColor: m.personId === studentPersonId ? 'highlight' : ''
								}
						];
				})

        return (
						<div>
		            <div className={classes(styles.container, className)}>
										<a onClick={!hasRecordChosen ? this.chooseStudent : () => browserHistory.push(`/announcementEdit/new/EMPTY/${studentPersonId}/${studentFirstName}/${studentLastName}`)} data-rh={'Send a message'}>
												<Icon pathName={'comment_text'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
										</a>
										<a onClick={!hasRecordChosen ? this.chooseStudent : () => this.sendToStudentSchedule(studentPersonId)} data-rh={`Student's schedule`}>
												<Icon pathName={'clock3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
										</a>
										<a onClick={!hasRecordChosen ? this.chooseStudent : () => this.sendToGradeReport(studentPersonId)} data-rh={`Student's grade report`}>
												<Icon pathName={'list3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
										</a>
                    {/*
                      Don't do this because it changes the registration object and then the parent loses the main menu because the overall registration object has the finalizedDate in it to trigger the menu views.
    										<a onClick={!hasRecordChosen ? this.chooseStudent : () => { getRegistrationByStudent(personId, studentPersonId, companyConfig.schoolYearId); browserHistory.push('/studentProfile/' + studentPersonId); }} data-rh={'Student profile and parent info'}>
    												<Icon pathName={'info'} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
    										</a>
                    */}
										{studentType !== 'DE' &&
												<a onClick={!hasRecordChosen ? this.chooseStudent : () => browserHistory.push('/courseAttendanceSingle/' + studentPersonId)} data-rh={'Attendance'}>
														<Icon pathName={'calendar_31'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
												</a>
										}
										{hasRecordChosen &&
												<div className={styles.listPosition}>
														<SelectSingleDropDown
																id={`studentGoTo`}
																label={``}
																value={studentGoTo || ''}
																zeroethLabel={'go to ...'}
																options={[
																		{ id: 'message', label: `Send a message`},
																		{ id: 'schedule', label: `Student's schedule`},
																		{ id: 'gradeReport', label: `Student's grade report`},
																]}
																height={`medium`}
																onChange={this.handleGoToStudentOption}/>
												</div>
										}
										{!excludeSchoolYearList &&
												<div className={styles.listPosition}>
														<SelectSingleDropDown
																id={`schoolYearId`}
																label={``}
																value={personConfig.schoolYearId || ''}
																options={schoolYears}
																height={`medium`}
																onChange={handleUpdateSchoolYear}/>
												</div>
										}
		            </div>
								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data}/>
						</div>
        )
    }
};

export default withAlert(StudentListMenu);
