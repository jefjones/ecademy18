import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './SafetyAdminAlertView.css';
import EditTable from '../../components/EditTable';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import DateMoment from '../../components/DateMoment';
import TextareaModal from '../../components/TextareaModal';
import MessageModal from '../../components/MessageModal';
import ImageViewerModal from '../../components/ImageViewerModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

//1. The alert-person enters an alert
//2. The entry is received by the office (SafetyAdminAlertView).
//		  a. The admin can approve the alert.  The admin can can then choose to broadcast it to all users as well as to the police station.
//3. The aert-person receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

class SafetyAdminAlertView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					safetyAlert: 'all',
					timerId: '',
					isShowingModal: false,
					isShowingModal_dismiss: false,
	    }
  }

	componentDidUpdate() {
			const {personId, getSafetyAlerts} = this.props;
			const {timerId} = this.state;
			if (!timerId) this.setState({ timerId: setInterval(() => getSafetyAlerts(personId), 3000) });
	}

	componentWillUnmount() {
			if (this.state.timerId) {
					clearInterval(this.state.timerId);
					this.setState({ timerId: '' });
			}
	}

	handleSafetyAlert = (safetyAlert) => {
			this.setState({safetyAlert});
	}

	handleChange = ({target}) => {
			let newState = Object.assign({}, this.state);
			newState[target.name] = target.value;
			this.setState(newState);
	}

	handleConfirmAlertOpen = (alertReviewType, safetyAlertId) =>
			this.setState({ isShowingModal_comment: true, alertReviewType, safetyAlertId});
	handleConfirmAlertClose = () =>  this.setState({ isShowingModal_comment: false, alertReviewType: '', safetyAlertId: ''});
	handleConfirmAlert = (adminComment) => {
			const {personId, confirmSafetyAlert} = this.props;
			const {alertReviewType, safetyAlertId} = this.state;
			confirmSafetyAlert(personId, {safetyAlertId, acknowledgedType: alertReviewType, note: adminComment});
			alertReviewType === 'approved'
					? this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The alert was approved`}/></div>)
					: this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The alert is considered a false alarm`}/></div>)
			this.handleConfirmAlertClose();
	}

	handleDismissAlertOpen = (safetyAlertId) => this.setState({ isShowingModal_dismiss: true, safetyAlertId});
	handleDismissAlertClose = () =>  this.setState({ isShowingModal_dismiss: false, safetyAlertId: ''});
	handleDismissAlert = () => {
			const {personId, dismissSafetyAlert} = this.props;
			const {safetyAlertId} = this.state;
			dismissSafetyAlert(personId, safetyAlertId);
			this.handleDismissAlertClose();
	}

	toggleSearch = () => {
			if (this.state.showSearchControls) this.clearFilters();
			this.setState({ showSearchControls: !this.state.showSearchControls })
	}

	clearFilters = () => {
			this.setState({ personId: '', safetyAlert: 'all'})
	}

	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, safetyAlerts, accessRoles, fetchingRecord} = this.props;
		const {alertReviewType, isShowingModal_comment, isShowingModal, fileUrl, isShowingModal_dismiss} = this.state;
		let localSafetyAlerts = safetyAlerts;

		let headings = [{},{},
				{label: <L p={p} t={`Date/time`}/>, tightText: true},
				{label: <L p={p} t={`Alert type`}/>, tightText: true},
				{label: <L p={p} t={`Alert person`}/>, tightText: true},
				{label: <L p={p} t={`Picture`}/>, tightText: true},
				{label: <L p={p} t={`Student`}/>, tightText: true},
				{label: <L p={p} t={`Admin date/time`}/>, tightText: true},
				{label: <L p={p} t={`Admin name`}/>, tightText: true},
				{label: <L p={p} t={`Alert note`}/>, tightText: true},
				{label: <L p={p} t={`Admin note`}/>, tightText: true}
		];
    let data = [];

    if (localSafetyAlerts && localSafetyAlerts.length > 0) {
				// if (guardianPersonId || studentPersonId ||  safetyAlert !== 'all') {
				// 		if (guardianPersonId && guardianPersonId != 0) localSafetyAlerts = localSafetyAlerts.filter(m => m.parentPersonId === guardianPersonId); //eslint-disable-line
				// 		if (studentPersonId && studentPersonId != 0) localSafetyAlerts = localSafetyAlerts.filter(m => m.studentPersonIds.indexOf(studentPersonId) > -1); //eslint-disable-line
				// 		if (safetyAlert && safetyAlert !== 'all') localSafetyAlerts = localSafetyAlerts.filter(m => m.safetyAlert === safetyAlert);
				// }
        data = localSafetyAlerts.map(m => [
							{value: <div data-rh={'Dismiss this alert'} onClick={() => this.handleDismissAlertOpen(m.safetyAlertId)}>
													<Icon pathName={'folder_minus_inside'} premium={true} className={globalStyles.icon} />
											</div>
							},
              {value: m.alertReviewType
									? m.alertReviewType === 'approved'
											? <div data-rh={'Alert is approved'}>
														<Icon pathName={'clipboard_check'} premium={true} className={globalStyles.icon} />
												</div>
											: <div data-rh={'False alarm'}>
														<Icon pathName={'cross'} premium={false} fillColor={'maroon'} className={globalStyles.icon} />
												</div>
									: <div className={styles.row}>
												<div onClick={() => this.handleConfirmAlertOpen('falseAlarm', m.safetyAlertId)} data-rh={'Is this a false alarm?'} className={styles.row}>
														<Icon pathName={'user_minus0'} premium={true}  fillColor={'maroon'} className={globalStyles.iconMedium} />
														<div className={styles.iconRed}>?</div>
												</div>
										</div>
							},
							{value: <DateMoment date={m.entryDate} />},
							{value: m.safetyAlertTypeName},
							{value: m.alertPersonName},
							{value: <a onClick={() => this.handleImageViewerOpen(m.fileUrl)} className={globalStyles.link}>{m.fileUrl ? <L p={p} t={`picture`}/> : ''}</a>},
							{value: m.studentNames && m.studentNames.length > 0 && m.studentNames.join(', ')},
							{value: accessRoles.admin
											? m.approvedDate
													? <DateMoment date={m.approvedDate} includeTime={true} minusHours={6}/>
													: <Button label={<L p={p} t={`Confirm...`}/>} onClick={() => this.handleConfirmAlertOpen('approved', m.safetyAlertId, m.safetyAlert)} addClassName={styles.notSoHigh}/>
											: m.approvedDate
							},
							{value: m.adminName},
							{value: m.alertNote},
              {value: m.adminNote},
          ]
        );
    }

    return (
        <div className={styles.container}>
						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
								<L p={p} t={`Safety Alerts`}/>
						</div>
						{/*<div className={styles.row}>
								<a onClick={this.toggleSearch} className={classes(styles.row, globalStyles.link)}>
										<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
										{showSearchControls ? 'Hide search controls' : 'Show search controls'}
								</a>
								{showSearchControls && <a onClick={this.clearFilters} className={classes(styles.muchRight, globalStyles.link)}>Clear filters</a>}
						</div>
						{showSearchControls &&
								<div>
										<div>
												<SelectSingleDropDown
														id={`guardianPersonId`}
														name={`guardianPersonId`}
														label={`Parent/guardian`}
														value={guardianPersonId || ''}
														options={guardians}
														className={styles.moreBottomMargin}
														height={`medium`}
														onChange={this.handleChange}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={`studentPersonId`}
														name={`studentPersonId`}
														label={`Student`}
														value={studentPersonId || ''}
														options={students}
														className={styles.moreBottomMargin}
														height={`medium`}
														onChange={this.handleChange}/>
										</div>
										<div className={styles.groupPosition}>
												<RadioGroup
														title={'Check In or Out'}
														name={'safetyAlert'}
														data={[{id: 'all', label: 'All'}, {id: 'checkin', label: 'Check In'}, {id: 'checkout', label: 'Check Out'}]}
														horizontal={true}
														className={styles.moreTop}
														initialValue={safetyAlert}
														onClick={this.handleSafetyAlert}/>
										</div>
								</div>
						*/}
						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.safetyAdminAlert}/>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Safety Admin Alerts`}/>} path={'safetyAdminAlerts'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
						<OneFJefFooter />
						{isShowingModal_comment &&
							<TextareaModal handleClose={this.handleConfirmAlertClose} heading={`Confirm Alert`}
									explain={<div>
															<div className={classes(styles.bold, (alertReviewType === 'approved' ? styles.green : styles.red))}>{alertReviewType === 'approved'
																	? <L p={p} t={`Alert is approved`}/>
																	: <L p={p} t={`This alert is a false alarm`}/>}</div>
															<div><L p={p} t={`Add a note (optional)`}/></div>
														</div>
									}  onClick={this.handleConfirmAlert} />
						}
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
						{isShowingModal_dismiss &&
								<MessageModal handleClose={this.handleDismissAlertClose} heading={<L p={p} t={`Dismiss this safety alert?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to dismiss this safety alert?  It will be saved for future reference but hidden from your current view.`}/>}
									 isConfirmType={true} onClick={this.handleDismissAlert} />
					 	}
      	</div>
    );
  }
}

export default withAlert(SafetyAdminAlertView);
