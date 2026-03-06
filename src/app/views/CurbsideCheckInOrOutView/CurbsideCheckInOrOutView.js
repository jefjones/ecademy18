import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import InputFile from '../../components/InputFile';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './CurbsideCheckInOrOutView.css';
import AlertSound from '../../assets/alert_science_fiction.mp3';
import CheckboxGroup from '../../components/CheckboxGroup';
import RadioGroup from '../../components/RadioGroup';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import InputTextArea from '../../components/InputTextArea';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import TextDisplay from '../../components/TextDisplay';
import Loading from '../../components/Loading';
import DateMoment from '../../components/DateMoment';
import ImageViewerModal from '../../components/ImageViewerModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';
import {guidEmpty} from '../../utils/guidValidate.js';

//1. The parent/guardian enters a check-in or a check-out entry from the curbside. (CurbsideCheckInOrOutView)
//		a. The add function gets back ONLY this written record with the Id so that the get call will look for that one only for the parent/guardian.
//	  b. The timer has this Id in order to look for it specifically (it does come back in a list so we just need to pick off the first one - but there is only one)
//2. The entry is received by the office (CurbsideAdminCheckInOrOutView).
//		  a. The admin can confirm that they see the student enter or they can mark that they did not ever see the student enter.
//3. The parent receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

class CurbsideCheckInOrOutView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					checkInOrOut: '',
		      reasonOther: '',
					reasonChoice: '',
					selectedStudents: [],
					parentComment: '',
					isPendingConfirmation: false,
					isShowingModal: false,
					fileUrl: '',
	    }
  }

	componentDidUpdate() {
			const {personId, checkInOrOuts, getCheckInOrOuts} = this.props;
			const {timerId} = this.state;
			if (!timerId && checkInOrOuts && checkInOrOuts.length > 0 && !checkInOrOuts[0].acknowledgedType) {
					this.setState({ timerId: setInterval(() => getCheckInOrOuts(personId, checkInOrOuts[0].curbsideCheckInOrOutId), 3000) });
			} else if (timerId && checkInOrOuts && checkInOrOuts.length > 0 && checkInOrOuts[0].acknowledgedType) {
					clearInterval(this.state.timerId);
					this.setState({ timerId: '' });
					this.makeSound();
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
      const {personId} = this.props;
      const {reasonChoice, reasonOther, checkInOrOut, selectedStudents, parentComment} = this.state;
			let data = new FormData();
			data.append('file', this.state.selectedFile)
      let hasError = false;

			if (!checkInOrOut) {
				hasError = true;
				this.setState({ errorCheckInOrOut: <L p={p} t={`Please choose Check-in or Check-out`}/> });
			}
			if (!reasonChoice && !reasonOther) {
				hasError = true;
				this.setState({ errorReason: <L p={p} t={`Please choose or enter a reason`}/> });
			}
			if (!selectedStudents || selectedStudents.length === 0) {
				hasError = true;
				this.setState({ errorStudent: <L p={p} t={`Please choose at least one student`}/> });
			}

      if (!hasError) {
					// let reasonChoiceText = reasons && reasons.length > 0 && reasons.filter(m => m.id === reasonChoice)[0];
					// reasonChoiceText = reasonChoiceText && reasonChoiceText.label;
					// let reason = reasonChoiceText ? reasonChoiceText : reasonOther;
					let studentList = selectedStudents.join(",");
					axios.post(`${apiHost}ebi/checkInOrOut/add/${personId}/${checkInOrOut}/${reasonChoice || guidEmpty}/${encodeURIComponent(reasonOther || 'EMPTY')}/${studentList || 'EMPTY'}/${encodeURIComponent(parentComment || 'EMPTY')}`, data,
							{
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Access-Control-Allow-Credentials' : 'true',
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
									"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
									"Authorization": "Bearer " + localStorage.getItem("authToken"),
							}});
          //addCheckInOrOut(personId, {personId, checkInOrOut, reasonOther, reasonChoice, selectedStudents, parentComment });
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The record has been sent to the office.`}/></div>)
					this.setState({ isPendingConfirmation: true })
      }
  }

	handleRadioGroup = (checkInOrOut) => {
			this.setState({ checkInOrOut });
	}

	handleChange = ({target}) => {
			let newState = Object.assign({}, this.state);
			newState[target.name] = target.value;
			this.setState(newState);
	}

	handleSelectedGroup = (selectedStudents) => {
			this.setState({ selectedStudents });
	}

	handleInputFile = (file) => this.setState({ selectedFile: file });

	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})

  render() {
    const {personId, reasons, students, checkInOrOuts, myFrequentPlaces, setMyFrequentPlace} = this.props;
    const {checkInOrOut, reasonChoice, reasonOther, selectedStudents, parentComment, errorReason, errorCheckInOrOut, errorStudent,
							isPendingConfirmation, isShowingModal, fileUrl} = this.state;

		let checkInOrOutPending = checkInOrOuts && checkInOrOuts.length > 0 && checkInOrOuts[0];

    return (
        <div className={styles.container}>
						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
								{`Curbside Check-In or Check-Out`}
						</div>
						{isPendingConfirmation && checkInOrOutPending && checkInOrOutPending.curbsideCheckInOrOutId &&
								<div>
										<TextDisplay label={<L p={p} t={`Type`}/>} text={checkInOrOutPending.checkInOrOut === 'checkin' ? <L p={p} t={`Check In`}/> : <L p={p} t={`Check Out`}/>} hideIfEmpty={true}/>
										<TextDisplay label={<L p={p} t={`Entry date`}/>} text={<DateMoment date={checkInOrOutPending.entryDate} minusHours={6}/>} hideIfEmpty={true}/>
										<TextDisplay label={<L p={p} t={`Reason`}/>} text={checkInOrOutPending.reasonTypeName} hideIfEmpty={true}/>
										<TextDisplay label={<L p={p} t={`Reason`}/>} text={checkInOrOutPending.reasonOther} hideIfEmpty={true}/>
										<TextDisplay label={<L p={p} t={`Student`}/>} text={checkInOrOutPending.studentNames.join(', ')} hideIfEmpty={true}/>
										<TextDisplay label={<L p={p} t={`Picture`}/>} text={<a onClick={() => this.handleImageViewerOpen(checkInOrOutPending.fileUrl)} className={globalStyles.link}>{checkInOrOutPending.fileUrl ? 'View picture' : ''}</a>} hideIfEmpty={true}/>
										<TextDisplay label={<L p={p} t={`Parent/guardian comment`}/>} text={checkInOrOutPending.parentComment} hideIfEmpty={true}/>
										<div className={styles.row}>
												<div className={styles.pendingLabelSmaller}>Confirmation:</div>
												<Loading loadingText={'Waiting for office response'} isLoading={!checkInOrOutPending.acknowledgedType} />
												{checkInOrOutPending.acknowledgedType &&
														<div className={classes(styles.pendingLabel, (checkInOrOutPending.acknowledgedType === 'confirmed' ? styles.blue : styles.maroon))}>
																{checkInOrOutPending.acknowledgedType === 'confirmed'
																		? checkInOrOutPending.checkInOrOut === 'checkin'
																				? <L p={p} t={`Arrival is Confirmed`}/>
																				: <L p={p} t={`Student(s) sent out`}/>
																		: checkInOrOutPending.checkInOrOut === 'checkin'
																				? <L p={p} t={`Arrival is NOT confirmed`}/>
																				: <L p={p} t={`Student is NOT present to send out`}/>
																}
														</div>
												}
										</div>
										<TextDisplay label={<L p={p} t={`Entry date`}/>} text={checkInOrOutPending.acknowledgedDate ? <DateMoment date={checkInOrOutPending.acknowledgedDate} minusHours={6}/> : '- -'}/>
										<TextDisplay label={<L p={p} t={`Administrator`}/>} text={checkInOrOutPending.adminName || '- -'}/>
										<TextDisplay label={<L p={p} t={`Comment`}/>} text={checkInOrOutPending.adminComment || '- -'}/>
								</div>
						}
						{!isPendingConfirmation &&
								<div>
										<RadioGroup
												data={[{id: 'checkin', label: <L p={p} t={`Check In`}/>}, {id: 'checkout', label: <L p={p} t={`Check Out`}/>}]}
												id={`checkInOrOut`}
												name={`checkInOrOut`}
												horizontal={true}
												className={styles.radio}
												initialValue={checkInOrOut}
												onClick={this.handleRadioGroup}
												error={errorCheckInOrOut}/>
										<div>
												<SelectSingleDropDown
														id={`reasonChoice`}
														name={`reasonChoice`}
														label={<L p={p} t={`Reason`}/>}
														value={reasonChoice || ''}
														options={reasons}
														className={styles.moreBottomMargin}
														height={`medium`}
														onChange={this.handleChange}
														error={errorReason}/>
										</div>
										<InputText
												id={`reasonOther`}
												name={`reasonOther`}
												size={"medium-long"}
												label={<L p={p} t={`Or other reason`}/>}
												value={reasonOther || ''}
												onChange={this.handleChange}/>
										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
										<div className={styles.groupPosition}>
												<CheckboxGroup
														name={'selectedStudents'}
														options={students || []}
														horizontal={true}
														onSelectedChanged={this.handleSelectedGroup}
														label={students && students.length > 1 ? <L p={p} t={`Student`}/> : <L p={p} t={`Students`}/>}
														labelClass={styles.label}
														selected={selectedStudents}
														error={errorStudent}/>
										</div>
										<InputTextArea
												label={<L p={p} t={`Comment (optional)`}/>}
												name={'parentComment'}
												value={parentComment}
												onChange={this.handleChange} />
										<div className={classes(styles.muchLeft, styles.row)}>
												<a className={styles.cancelLink} onClick={() => browserHistory.push('/firstNav')}>Close</a>
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
										</div>
								</div>
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Curbside Check-in or Check-out`}/>} path={'curbside'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
				{isShowingModal &&
						<div className={globalStyles.fullWidth}>
								<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
						</div>
				}
      </div>
    );
  }
}

export default withAlert(CurbsideCheckInOrOutView);
