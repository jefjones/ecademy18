import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
import styles from './AdminResponsePendings.css';
import TextDisplay from '../TextDisplay';
import TextareaModal from '../TextareaModal';
import ButtonWithIcon from '../ButtonWithIcon';
import ConfirmDateAndNote from '../ConfirmDateAndNote';
import classes from 'classnames';
import { withAlert } from 'react-alert';
const p = 'component';
import L from '../../components/PageLanguage';

class AdminResponsePendings extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_safety: false,
					isShowingModal_curbside: false,
			}
	}

	handleConfirmSafetyOpen = (alertReviewType, safetyAlertId) =>
			this.setState({ isShowingModal_safety: true, alertReviewType, safetyAlertId});
	handleConfirmSafetyClose = () =>  this.setState({ isShowingModal_safety: false, alertReviewType: '', safetyAlertId: ''});
	handleConfirmSafety = (adminComment) => {
			const {personId, confirmSafetyAlert} = this.props;
			const {alertReviewType, safetyAlertId} = this.state;
			confirmSafetyAlert(personId, {safetyAlertId, acknowledgedType: alertReviewType, note: adminComment});
			this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The alert was approved`}/></div>);
			this.handleConfirmSafetyClose();
	}

	handleConfirmCurbsideOpen = (acknowledgedType, curbsideCheckInOrOutId, checkInOrOut) =>
			this.setState({ isShowingModal_curbside: true, acknowledgedType, curbsideCheckInOrOutId, checkInOrOut});
	handleConfirmCurbsideClose = () =>  this.setState({ isShowingModal_curbside: false, acknowledgedType: '', curbsideCheckInOrOutId: '', checkInOrOut: ''});
	handleConfirmCurbside = (adminComment) => {
			const {personId, confirmCheckInOrOut} = this.props;
			const {acknowledgedType, curbsideCheckInOrOutId, checkInOrOut} = this.state;
			confirmCheckInOrOut(personId, {curbsideCheckInOrOutId, acknowledgedType, adminComment});
			this.props.alert.info(<div className={globalStyles.alertText}>{checkInOrOut === 'checkin' ? <L p={p} t={`Confirmed: Check In`}/> : <L p={p} t={`Confirmed: Check Out`}/>}</div>)
			this.handleConfirmCurbsideClose();
	}

	handleConfirmVolunteerOpen = (checkInOrOut, volunteerEventId, checkInOrOutDate) => this.setState({ isShowingModal_confirm: true, checkInOrOut, volunteerEventId, checkInOrOutDate});
	handleConfirmVolunteerClose = (checkInOrOut, volunteerEventId, checkInOrOutDate) => this.setState({ isShowingModal_confirm: false, checkInOrOut: '', volunteerEventId: '', checkInOrOutDate: ''});
	handleConfirmVolunteer = (checkInOrOutDate, adminNote) => {
			const {personId, confirmVolunteerHour} = this.props;
			const {volunteerEventId, checkInOrOut} = this.state;
			confirmVolunteerHour(personId, {personId, checkInOrOut, checkInOrOutDate, adminNote, volunteerEventId});
			this.handleConfirmVolunteerClose();
	}

	render() {
    const {adminResponsePendings} = this.props;
		const {isShowingModal_safety, isShowingModal_curbside, checkInOrOut, isShowingModal_confirm, checkInOrOutDate} = this.state;

    return (
				<div className={styles.container}>
				{adminResponsePendings && adminResponsePendings.length > 0 && adminResponsePendings.map((m, i) => {
						return (
								<div key={i} className={classes(styles.border,
												(m.requestType === 'SafetyAlert'
														? styles.borderSafety
														: m.requestType === 'CurbsideCheckInOrOut'
																? styles.borderCurbside
																: styles.borderVolunteer))}>
										<div className={m.requestType==='SafetyAlert' ? styles.redBold : styles.bold}>
												{m.requestTypeName}
										</div>
										<TextDisplay label={<L p={p} t={`Person`}/>} text={m.requesterName}/>
										<TextDisplay label={<L p={p} t={`Students`}/>} text={m.studentNames && m.studentNames.join(", ")} hideIfEmpty={true} />
										<TextDisplay label={<L p={p} t={`Note`}/>} text={m.description} hideIfEmpty={true} />
										{m.fileUrl && <img src={m.fileUrl} alt={'snapshot'} className={styles.image}/>}
										<div className={styles.row}>
												<a className={styles.seeMorelink} onClick={
														m.requestType === 'SafetyAlert'
																? () => browserHistory.push('/safetyAdminAlerts')
																: m.requestType === 'CurbsideCheckInOrOut'
																		? () => browserHistory.push('/curbsideAdmin')
																		: m.requestType === 'VolunteerCheckInOrOut'
																				? () => browserHistory.push('/volunteerHours')
																				: () => {}}
												><L p={p} t={`See more...`}/></a>
												<ButtonWithIcon label={<L p={p} t={`Approve`}/>} onClick={
														m.requestType === 'SafetyAlert'
																? () => this.handleConfirmSafetyOpen('approved', m.requestId)
																: m.requestType === 'CurbsideCheckInOrOut'
																		? () => this.handleConfirmCurbsideOpen('confirmed', m.requestId, m.checkInOrOut)
																		: m.requestType === 'VolunteerCheckInOrOut'
																				? () => this.handleConfirmVolunteerOpen(m.checkInOrOut === 'Check in' ? 'in' : 'out', m.requestId, m.entryDate)
																				: () => {}
														} icon={'checkmark_circle'} />
										</div>
								</div>
						)})}

						{isShowingModal_safety &&
							<TextareaModal handleClose={this.handleConfirmSafetyClose} heading={<L p={p} t={`Confirm Alert`}/>}
									explain={<div>
															<div className={classes(styles.bold, styles.green)}><L p={p} t={`Approving this alert`}/></div>
															<div><L p={p} t={`Add a note (optional)`}/></div>
														</div>
									}  onClick={this.handleConfirmSafety} />
						}
						{isShowingModal_curbside &&
							<TextareaModal handleClose={this.handleConfirmCurbsideClose} heading={checkInOrOut === 'checkin' ? <L p={p} t={`Curbside Check-In Comment`}/> : <L p={p} t={`Curbside Check-Out Comment`}/>}
									explain={<div>
															<div className={classes(styles.bold, styles.green)}><L p={p} t={`Student arrival is confirmed`}/></div>
															<div><L p={p} t={`Add a comment that the parent will see (optional)`}/></div>
														</div>
									}  onClick={this.handleConfirmCurbside} />
						}
						{isShowingModal_confirm &&
								<ConfirmDateAndNote handleClose={this.handleConfirmVolunteerClose} heading={checkInOrOut === 'in' ? <L p={p} t={`Confirm Volunteer Check-in`}/> : <L p={p} t={`Confirm Volunteer Check-out`}/>}
										onClick={this.handleConfirmVolunteer} date={checkInOrOutDate}/>
						}
				</div>
    )}
};

export default withAlert(AdminResponsePendings);
