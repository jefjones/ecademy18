import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import InputFile from '../../components/InputFile';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './VolunteerCheckInOutView.css';
import AlertSound from '../../assets/alert_science_fiction.mp3';
import DateTimePicker from '../../components/DateTimePicker';
import TimePicker from '../../components/TimePicker';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputTextArea from '../../components/InputTextArea';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import TextDisplay from '../../components/TextDisplay';
import Loading from '../../components/Loading';
import DateMoment from '../../components/DateMoment';
import MessageModal from '../../components/MessageModal';
import ImageViewerModal from '../../components/ImageViewerModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

//1. The parent enters a volunteer check-in or a check-out entry
//		a. The add function gets back ONLY this written record with the Id so that the get call will look for that one only for the parent/guardian.
//	  b. The timer has this Id in order to look for it specifically (it does come back in a list so we just need to pick off the first one - but there is only one)
//2. The entry is received by the office to confirm
//		  a. The admin can confirm that they acknowledged the volunteer presence of the parent.
//3. The parent receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

class VolunteerCheckInOutView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
					checkInDate: '',
		      reasonOther: '',
					reasonChoice: '',
					selectedStudents: [],
					parentComment: '',
					isPendingConfirmation: false,
					isShowingModal: false,
					fileUrl: '',
	    }
  }

	componentDidMount() {
			var d = new Date(),
	         month = '' + (d.getMonth() + 1),
	         day = '' + d.getDate(),
	         year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
			let datetext = d.toTimeString();

		this.setState({
				checkInDate: [year, month, day].join('-'),
				checkInTime: datetext.split(' ')[0]
		})
	}

	componentDidUpdate() {
			const {personId, volunteerEvents, getVolunteerEvents} = this.props;
			const {timerId} = this.state;
			if (!timerId && volunteerEvents && volunteerEvents.length > 0
							&& ((volunteerEvents[0].checkIn && !volunteerEvents[0].confirmCheckIn)
									|| (volunteerEvents[0].checkOut && !volunteerEvents[0].confirmCheckOut))) {
					this.setState({ timerId: setInterval(() => getVolunteerEvents(personId, volunteerEvents[0].volunteerEventId), 3000) });
			} else if (timerId && volunteerEvents && volunteerEvents.length > 0
							&& volunteerEvents[0].confirmCheckIn && !(volunteerEvents[0].checkOut && !volunteerEvents[0].confirmCheckOut)) {
					clearInterval(this.state.timerId);
					this.setState({ timerId: '' });
					this.makeSound();
			}

			if (!this.state.checkOutDate && volunteerEvents && volunteerEvents.length > 0 && volunteerEvents[0].checkIn && !volunteerEvents[0].checkOut) {
					let checkOutDate =  volunteerEvents[0].checkIn && volunteerEvents[0].checkIn.indexOf('T') > -1
									? volunteerEvents[0].checkIn.substring(0, volunteerEvents[0].checkIn.indexOf('T'))
									: volunteerEvents[0].checkIn;

					var d = new Date();
					let datetext = d.toTimeString();

					this.setState({ checkOutDate, checkOutTime: datetext.split(' ')[0] });
			}
	}

	componentWillUnmount() {
			if (this.state.timerId) {
					clearInterval(this.state.timerId);
					this.setState({ timerId: '' });
			}
	}

	makeSound = () => {
			var audio = new Audio(AlertSound);
			audio.play();
	}

	handleCheckInOrOut = (checkInOrOut) => {
      this.setState({ checkInOrOut });
  }

  processForm = () => {
      const {personId, getVolunteerEvents} = this.props;
      const {volunteerTypeId, checkInDate, checkInTime, volunteerNote} = this.state;
			let data = new FormData();
			data.append('file', this.state.selectedFile)
      let hasError = false;

			if (!volunteerTypeId) {
				hasError = true;
				this.setState({ errorVolunteerTypeId: <L p={p} t={`Please choose an event type`}/> });
			}
			if (!checkInDate) {
				hasError = true;
				this.setState({ errorCheckInDate: <L p={p} t={`Please enter a date`}/> });
			}
			if (!checkInTime) {
				hasError = true;
				this.setState({ errorCheckInTime: <L p={p} t={`Please enter a time`}/> });
			}

      if (!hasError) {
					axios.post(`${apiHost}ebi/volunteerEvent/add/${personId}/${volunteerTypeId}/${checkInDate + ' ' + checkInTime}/${!!volunteerNote ? encodeURIComponent(volunteerNote) : ''}`, data,
							{
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Access-Control-Allow-Credentials' : 'true',
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
									"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
									"Authorization": "Bearer " + localStorage.getItem("authToken"),
							}})
							.then(response => {
				          if (response.status >= 200 && response.status < 300) {
				              return response.json();
				          } else {
				              const error = new Error(response.statusText);
				              error.response = response;
				              throw error;
				          }
				      })
							.then(response => getVolunteerEvents(personId, response.volunteerEventId));
          //addVolunteerEvent(personId, {volunteerTypeId, checkIn: checkInDate + ' ' + checkInTime, volunteerNote});
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your Check-In entry has been sent to the office.`}/></div>)
					this.setState({ isPendingConfirmation: true });
      }
  }

	processCheckOut = () => {
      const {personId, setVolunteerCheckOut, volunteerEventId} = this.props;
      const {checkOutDate, checkOutTime} = this.state;
      let hasError = false;

			if (!checkOutDate) {
				hasError = true;
				this.setState({ errorCheckOutDate: <L p={p} t={`Please enter a date`}/> });
			}
			if (!checkOutTime) {
				hasError = true;
				this.setState({ errorCheckOutTime: <L p={p} t={`Please enter a time`}/> });
			}

      if (!hasError) {
          setVolunteerCheckOut(personId, {volunteerEventId, checkInOrOut: 'out', checkInOrOutDate: checkOutDate + ' ' + checkOutTime});
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your Check-Out entry has been sent to the office.`}/></div>)
      }
  }

	handleChange = ({target}) => {
			let newState = Object.assign({}, this.state);
			newState[target.name] = target.value;
			this.setState(newState);
	}

	changeDate = (field, event) => {
			const newState = Object.assign({}, this.state);
			newState[field] = event.target.value;
			this.setState(newState);
	}

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeVolunteerHours, personId, volunteerEventId} = this.props;
			removeVolunteerHours(personId, volunteerEventId);
			this.handleDeleteClose();
			browserHistory.push('/firstNav');
	}

	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})

	handleInputFile = (file) => this.setState({ selectedFile: file });

  render() {
    const {personId, volunteerTypes, volunteerEvents, volunteerEventId, myFrequentPlaces, setMyFrequentPlace} = this.props;
    const {volunteerTypeId, checkInDate, checkInTime, checkOutDate, checkOutTime, errorCheckInTime, volunteerNote, errorVolunteerTypeId, errorCheckInDate,
						errorCheckOutDate, errorCheckOutTime, isPendingConfirmation, isShowingModal_delete, isShowingModal, fileUrl} = this.state;

		let volunteerEvent = volunteerEvents && volunteerEvents.length > 0 && volunteerEvents[0];

    return (
        <div className={styles.container}>
						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
								{`Volunteer Check-In or Check-Out`}
						</div>
						{(isPendingConfirmation || volunteerEventId) &&
								<div>
										<TextDisplay label={<L p={p} t={`Event type`}/>} text={volunteerEvent.volunteerTypeName} minusHours={6}/>
										<TextDisplay label={<L p={p} t={`Check In`}/>} text={volunteerEvent.checkIn ? <DateMoment date={volunteerEvent.checkIn} minusHours={6}/> : '- -'} />
										<TextDisplay label={<L p={p} t={`Picture`}/>} text={<a onClick={() => this.handleImageViewerOpen(volunteerEvent.fileUrl)} className={globalStyles.link}>{volunteerEvent.fileUrl ? <L p={p} t={`View picture`}/> : ''}</a>} hideIfEmpty={true}/>
										<Loading loadingText={<L p={p} t={`Waiting for office response`}/>} isLoading={!volunteerEvent.confirmCheckIn && !volunteerEvent.checkOut} />
										<TextDisplay label={<L p={p} t={`Confirm Check In`}/>} text={volunteerEvent.confirmCheckIn ? <DateMoment date={volunteerEvent.confirmCheckIn} minusHours={6}/> : '- -'} />
										{volunteerEvent.checkIn && !volunteerEvent.checkOut
												? <div className={styles.checkOutPosition}>
															<DateTimePicker id={`checkOutDate`} label={<L p={p} t={`Check-out date`}/>} value={checkOutDate || ''} onChange={(event) => this.changeDate('checkOutDate', event)}
																className={classes(styles.dateTimePosition, styles.notBold)} error={errorCheckOutDate}/>
															<TimePicker id={`checkOutTime`} label={<L p={p} t={`Check-out time`}/>} value={checkOutTime || ''} onChange={this.handleChange} className={styles.notBold}
																	error={errorCheckOutTime}/>
															<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Check-out`}/>} onClick={this.processCheckOut} />
													</div>

												: <TextDisplay label={<L p={p} t={`Check Out`}/>} text={volunteerEvent.checkOut ? <DateMoment date={volunteerEvent.checkOut} minusHours={6}/> : '- -'} />
										}
										<Loading loadingText={<L p={p} t={`Waiting for office response`}/>} isLoading={volunteerEvent.checkOut && !volunteerEvent.confirmCheckOut} />
										<TextDisplay label={<L p={p} t={`Confirm Check Out`}/>} text={volunteerEvent.confirmCheckOut ? <DateMoment date={volunteerEvent.confirmCheckOut} minusHours={6}/> : '- -'} />
										<TextDisplay label={<L p={p} t={`Volunteer note`}/>} text={volunteerEvent.volunteerNote || '- -'} />
										<TextDisplay label={<L p={p} t={`Admin note`}/>} text={volunteerEvent.adminNote || '- -'} />
										<div className={classes(styles.muchLeft, styles.row)}>
												<a className={styles.cancelLink} onClick={() => browserHistory.push('/firstNav')}><L p={p} t={`Close`}/></a>
												<ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={this.handleDeleteOpen} changeRed={true}/>
										</div>
								</div>
						}
						{!isPendingConfirmation && !volunteerEventId &&
								<div>
										<div className={styles.moreBottom}>
												<SelectSingleDropDown
														id={`volunteerTypeId`}
														name={`volunteerTypeId`}
														label={<L p={p} t={`Event type`}/>}
														value={volunteerTypeId || ''}
														options={volunteerTypes}
														className={styles.notBold}
														height={`medium`}
														onChange={this.handleChange}
														error={errorVolunteerTypeId}/>
										</div>
										<DateTimePicker id={`checkInDate`} label={<L p={p} t={`Date`}/>} value={checkInDate || ''} onChange={(event) => this.changeDate('checkInDate', event)}
											className={styles.dateTime} error={errorCheckInDate}/>
										<TimePicker id={`checkInTime`} label={<L p={p} t={`Time`}/>} value={checkInTime || ''} onChange={this.handleChange} className={styles.dateTime}
												error={errorCheckInTime}/>
										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
										<InputTextArea label={<L p={p} t={`Note (optional)`}/>} name={'volunteerNote'} value={volunteerNote} onChange={this.handleChange} />
										<div className={classes(styles.muchLeft, styles.row)}>
												<a className={styles.cancelLink} onClick={() => browserHistory.push('/firstNav')}><L p={p} t={`Close`}/></a>
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
										</div>
								</div>
						}
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this volunteer record?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this volunteer record?`}/>} isConfirmType={true}
									 onClick={this.handleDelete} />
						}
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Volunteer Check-in or Check-out`}/>} path={'volunteerCheckInOut'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(VolunteerCheckInOutView);
