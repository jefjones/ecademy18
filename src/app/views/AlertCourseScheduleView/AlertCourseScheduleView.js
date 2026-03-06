import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './AlertCourseScheduleView.css';
import globalStyles from '../../utils/globalStyles.css';
import TextDisplay from '../../components/TextDisplay';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Checkbox from '../../components/Checkbox';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
const p = 'AlertCourseScheduleView';
import L from '../../components/PageLanguage';

export default class AlertCourseScheduleView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					seats: '',
					alert: {
							courseScheduledId: props.param && props.param.courseScheduledId,
							alertTypeCode: 'NEWSECTION',
					}
	    }
  }

	componentDidUpdate() {
			const {alert, alerts} = this.props;
			const {isInit} = this.state;
			if (!isInit && alerts && alerts.length > 0 && alert && alert.alertWhenId) {
					this.setState({ isInit: true, alert });
			}
	}

  changeSeats = (event) => {
	    const field = event.target.name;
	    let newState = Object.assign({}, this.state);
	    newState[field] = event.target.value;
	    this.setState(newState);
  }

	sendSeatAlert = (event) => {
			const {addOrUpdateAlert, removeAlert, personId, alerts, course} = this.props;
			let alert = alerts && alerts.length > -1 && alerts.filter(m => m.alertTypeCode === 'SEATTHRESHOLD' && m.courseScheduledId === course.courseScheduledId)[0];
			!event.target.value
			 		? removeAlert(personId, alert.alertWhenId)
					: addOrUpdateAlert(personId, {
							alertWhenId: alert && alert.alertWhenId,
							alertTypeCode: 'SEATTHRESHOLD',
							personId,
							courseScheduledId: course.courseScheduledId,
							seatThreshold: event.target.value });
	}

	sendNewSectionAlert = (event) => {
			//This is a simple toggle on and off.
			const {addOrUpdateAlert, removeAlert, personId, alerts, course} = this.props;
			let alert = alerts && alerts.length > -1 && alerts.filter(m => m.alertTypeCode === 'NEWSECTION' && m.courseScheduledId === course.courseScheduledId)[0];
			alert && alert.courseEntryId
			 		? removeAlert(personId, alert.alertWhenId)
					: addOrUpdateAlert(personId, {
							alertWhenId: alert && alert.alertWhenId,
							alertTypeCode: 'NEWSECTION',
							personId,
							courseScheduledId: course.courseScheduledId,
							courseEntryId: course.courseEntryId,
							seatThreshold: event.target.value });
	}

	changeItem = ({target}) => {
			let newState = Object.assign({}, this.state);
			let field = target.name;
			newState.alert[field] = target.value;
			this.setState(newState);
	}

	processForm = (stayOrFinish) => {
      const {addOrUpdateAlert, personId, doNotAddCourse, courseScheduledId} = this.props;
      const {alert} = this.state;
      let hasError = false;
			let missingInfoMessage = [];

			if (!alert.ifOpenSeat && !alert.firstPrefClassPeriodId && !alert.secondPrefClassPeriodId) {
					hasError = true;
					if (doNotAddCourse) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If open seat`}/></div>
					} else {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If open seat or a preferred class period`}/></div>
					}
			} else if (doNotAddCourse) {
		      if (!alert.firstPrefClassPeriodId) {
		          hasError = true;
		          this.setState({ errorFirstPref: <L p={p} t={`A first preference is required`}/> });
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First preference`}/></div>
		      }
					if (!alert.secondPrefClassPeriodId) {
		          hasError = true;
		          this.setState({ errorSecondPref: <L p={p} t={`A second preference is required`}/> });
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Second preference`}/></div>
					}
      }

      if (!hasError) {
					alert.courseScheduledId = courseScheduledId;
					alert.alertTypeCode = 'NEWSECTION';
					alert.personId = personId;
          addOrUpdateAlert(personId, alert);
					this.setState({ personId, alert: {} });
					browserHistory.push(`/studentCourseAssign/${alert.courseScheduledId}`);
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
      }
  }

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	toggleIfOpenSeat = () => {
			let newState = Object.assign({}, this.state);
			newState.alert.ifOpenSeat = !newState.alert.ifOpenSeat;
			this.setState(newState);
	}

	handleRemoveAlertOpen = () => this.setState({ isShowingModal_removeAlert: true })
	handleRemoveAlertClose = () => this.setState({ isShowingModal_removeAlert: false })
	handleRemoveAlert = () => {
			const {personId, removeAlert} = this.props;
			const {alert} = this.state;
			removeAlert(personId, alert.alertWhenId, alert.courseScheduledId);
			this.handleRemoveAlertClose();
			browserHistory.push(`/studentCourseAssign/${alert.courseScheduledId}`)
	}

  render() {
  	const {course={studentList: []}, classPeriods, companyConfig, doNotAddCourse} = this.props;
		const {alert={}, messageInfoIncomplete, isShowingModal_missingInfo, isShowingModal_removeAlert} = this.state;

		// let seatThreshold = '';
		// let hasNewSectionAlert = false;
		// alerts && alerts.length > 0 && alerts.forEach(m => {
		// 		if (m.alertTypeCode === 'SEATTHRESHOLD' && m.courseScheduledId === course.courseScheduledId) seatThreshold = m.seatThreshold;
		// 		if (m.alertTypeCode === 'NEWSECTION' && m.courseEntryId === course.courseEntryId) hasNewSectionAlert = true;
		// })

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Course Alerts`}/>
            </div>
						<TextDisplay label={<L p={p} t={`Course`}/>} text={course.courseName} className={styles.textDisplay} />
						<TextDisplay label={<L p={p} t={`Open seats`}/>} text={course.maxSeats} className={styles.textDisplay} />
						<TextDisplay label={<L p={p} t={`Seats used`}/>} text={course.studentList && course.studentList.length} className={styles.textDisplay} />
						<TextDisplay label={companyConfig.urlcode === 'Manheim' ? 'Marking period' : <L p={p} t={`Interval`}/>} text={course.intervalName} className={styles.textDisplay} />
						<hr />
						<div className={styles.subDiv}>
								{/*<div className={classes(styles.label, styles.row, styles.moreSpace)}>
				            <div className={styles.topPosition}>
				                <SelectSingleDropDown
				                    id={'seatThreshold'}
														label={'Seats taken'}
				                    value={seatThreshold}
				                    options={seats}
				                    height={`short`}
				                    className={styles.singleDropDown}
				                    onChange={this.sendSeatAlert}/>
				            </div>
										{`Alert me when the seats taken reach this number:`}
								</div>*/}
								<div className={classes(globalStyles.instructionsBigger, styles.widthInstructions)}>
										<L p={p} t={`By wait-listing a course, you are expressing an interest in taking a course that is currently full.`}/>
										<L p={p} t={`The administration will evaluate the high school schedule based on staffing and students' requests.`}/>
										<L p={p} t={`Please note by marking a course on the wait-list does not establish an expectation that a new course section will be added. Should a new course section be created, students will be notified via email.`}/>
								</div>
								<div>
										<div className={classes(globalStyles.classification, styles.space)}>Alert me if a seat opens up</div>
										<div className={classes(styles.moreTop, styles.muchBottom)}>
												<Checkbox
														id={'ifOpenSeat'}
														name={'ifOpenSeat'}
														label={<L p={p} t={`Please notify me of an open seat for this section`}/>}
														labelClass={styles.checkboxLabel}
														checked={alert.ifOpenSeat || false}
														onClick={this.toggleIfOpenSeat}
														className={styles.button}/>
										</div>
								</div>
								<div>
										{doNotAddCourse && <div className={classes(styles.headerLabel, styles.space)}><L p={p} t={`This course is not eligible to create a new course`}/></div>}
										<div className={classes(globalStyles.classification, styles.space, (doNotAddCourse ? styles.lowOpacity : ''))}><L p={p} t={`Request a new section`}/></div>
										<div className={classes(styles.moreTop, (doNotAddCourse ? styles.lowOpacity : ''))}>
												<SelectSingleDropDown
														id={`firstPrefClassPeriodId`}
														label={<L p={p} t={`Your first preference: Block`}/>}
														value={alert.firstPrefClassPeriodId || ''}
														options={classPeriods}
														height={`medium`}
														disabled={doNotAddCourse}
														onChange={this.changeItem}/>
										</div>
										<div className={classes(styles.moreTop, (doNotAddCourse ? styles.lowOpacity : ''))}>
												<SelectSingleDropDown
														id={`secondPrefClassPeriodId`}
														label={<L p={p} t={`Your second preference: Block`}/>}
														value={alert.secondPrefClassPeriodId || ''}
														options={classPeriods}
														height={`medium`}
														disabled={doNotAddCourse}
														onChange={this.changeItem}/>
										</div>
								</div>
						</div>
						<div className={classes(styles.fromLeft, styles.row)}>
								<a className={styles.cancelLink} onClick={() => browserHistory.goBack()}><L p={p} t={`Close`}/></a>
								{alert.alertWhenId && <ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={this.handleRemoveAlertOpen} changeRed={true}/>}
                <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
            <OneFJefFooter />
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
						{isShowingModal_removeAlert &&
                <MessageModal handleClose={this.handleRemoveAlertClose} heading={<L p={p} t={`Remove this alert?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this alert?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveAlert} />
            }
      </div>
    );
  }
}
