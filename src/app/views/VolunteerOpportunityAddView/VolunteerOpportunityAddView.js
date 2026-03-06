import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './VolunteerOpportunityAddView.css';
import DateTimePicker from '../../components/DateTimePicker';
import TimePicker from '../../components/TimePicker';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputTextArea from '../../components/InputTextArea';
import InputText from '../../components/InputText';
import Required from '../../components/Required';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Icon from '../../components/Icon';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class VolunteerOpportunityAddView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
	    }
  }

	componentDidUpdate() {
			const {volunteerOpportunity} = this.props;
			const {localOpportunity} = this.state;
			if (volunteerOpportunity && volunteerOpportunity.name && volunteerOpportunity !== localOpportunity) {
					this.setState({ localOpportunity: volunteerOpportunity })
			} else if (!localOpportunity || !localOpportunity.startEndTimes || localOpportunity.startEndTimes.length === 0) {
					let localOpportunity = {
							name: '',
							volunteerTypeId: '',
							note: '',
							volunteersNeeded: '',
							startEndTimes: [{
									date: '',
									startTime: '',
									endTime: ''
							}]
					}
					this.setState({ localOpportunity });
			}
	}

  processForm = () => {
      const {addOrUpdateVolunteerOpportunity, personId} = this.props;
      const {localOpportunity} = this.state;
      let hasError = false;

			if (!localOpportunity.name) {
				hasError = true;
				this.setState({ errorName: <L p={p} t={`Please enter a name`}/> });
			}

			if (!localOpportunity.volunteerTypeId) {
				hasError = true;
				this.setState({ errorVolunteerTypeId: <L p={p} t={`Please choose an event type`}/> });
			}

			if (!localOpportunity.volunteersNeeded) {
				hasError = true;
				this.setState({ errorVolunteersNeeded: <L p={p} t={`Please enter the volunteers needed`}/> });
			}

			if (!localOpportunity.startEndTimes || localOpportunity.startEndTimes.length === 0
						|| (!localOpportunity.startEndTimes[0].date || !localOpportunity.startEndTimes[0].startTime || !localOpportunity.startEndTimes[0].endTime)) {
				hasError = true;
				this.setState({ errorDateTime: <L p={p} t={`Please enter at least one date and time`}/> });
			}

      if (!hasError) {
          addOrUpdateVolunteerOpportunity(personId, localOpportunity);
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your Volunteer Opportunity has been saved.`}/></div>)
					browserHistory.push(`/volunteerOpportunities`);
      }
  }

	handleChange = ({target}) => {
			let localOpportunity = this.state.localOpportunity;
			localOpportunity[target.name] = target.value;
			this.setState({ localOpportunity });
	}

	changeDate = (field, event) => {
			const newState = Object.assign({}, this.state);
			newState[field] = event.target.value;
			this.setState(newState);
	}

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeVolunteerHours, personId, volunteerOpportunityId} = this.props;
			removeVolunteerHours(personId, volunteerOpportunityId);
			this.handleDeleteClose();
			browserHistory.push('/firstNav');
	}

	addAnotherDate = () => {
			let localOpportunity = this.state.localOpportunity;
			let startEndTimes = localOpportunity.startEndTimes || [];
			localOpportunity.startEndTimes = startEndTimes.concat({startTime: '', endTime: ''});
			this.setState({ localOpportunity });
	}

	handleTime = (timeType, index, event) => {
			let localOpportunity = this.state.localOpportunity;
			let startEndTimes = localOpportunity.startEndTimes || [];
			timeType === 'startTime'
					? startEndTimes[index].startTime = event.target.value
					: startEndTimes[index].endTime = event.target.value;
			localOpportunity.startEndTimes = startEndTimes;
			this.setState({ localOpportunity, errorDateTime: '' });
	}

	handleDate = (index, event) => {
			let localOpportunity = this.state.localOpportunity;
			let startEndTimes = localOpportunity.startEndTimes || [];
			startEndTimes[index].date = event.target.value;
			localOpportunity.startEndTimes = startEndTimes;
			this.setState({ localOpportunity });
	}

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, volunteerTypes} = this.props;
    const {localOpportunity={}, errorCheckInTime, errorName, errorVolunteersNeeded, errorVolunteerTypeId, errorDateTime} = this.state;

    return (
        <div className={styles.container}>
						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
								<L p={p} t={`Volunteer Opportunity`}/>
						</div>
						<div>
								<InputText
										id={`name`}
										name={`name`}
										size={"medium"}
										label={<L p={p} t={`Name`}/>}
										value={localOpportunity.name || ''}
										required={true}
										whenFilled={localOpportunity.name}
										onChange={this.handleChange}
										error={errorName}/>
								<div className={styles.moreBottom}>
										<SelectSingleDropDown
												id={`volunteerTypeId`}
												name={`volunteerTypeId`}
												label={<L p={p} t={`Event type`}/>}
												value={localOpportunity.volunteerTypeId || ''}
												options={volunteerTypes}
												className={styles.notBold}
												height={`medium`}
												required={true}
												whenFilled={localOpportunity.volunteerTypeId}
												onChange={this.handleChange}
												error={errorVolunteerTypeId}/>
								</div>
								<InputText
										id={`volunteersNeeded`}
										name={`volunteersNeeded`}
										size={"super-short"}
										onEnterKey={this.handleEnterKey}
										numberOnly={true}
										label={<L p={p} t={`Volunteers needed`}/>}
										value={localOpportunity.volunteersNeeded || ''}
										required={true}
										whenFilled={localOpportunity.volunteersNeeded}
										onChange={this.handleChange}
										error={errorVolunteersNeeded}/>

								<InputTextArea label={<L p={p} t={`Note (optional)`}/>} name={'note'} value={localOpportunity.note} onChange={this.handleChange} />

								<div className={classes(styles.littleBottom, globalStyles.classification)}>
										<L p={p} t={`Date(s)`}/>
								</div>

								{localOpportunity.startEndTimes && localOpportunity.startEndTimes.length > 0 && localOpportunity.startEndTimes.map((m, i) => {
										//let date = m.startTime ? m.startTime.indexOf('T') > -1 ? m.startTime.substring(m.startTime.indexOf('T')) : m.startTime : '';
										return (
												<div key={i} className={styles.rowWrap}>
														<DateTimePicker label={<L p={p} t={`Date`}/>} value={m.date || ''} onChange={(event) => this.handleDate(i, event)}
															className={styles.dateTime}/>
														<TimePicker label={<L p={p} t={`Start time`}/>} value={m.startTime || ''} onChange={(event) => this.handleTime('startTime', i, event)} className={styles.dateTime}
																error={errorCheckInTime}/>
														<TimePicker label={<L p={p} t={`End time`}/>} value={m.endTime || ''} onChange={(event) => this.handleTime('endTime', i, event)} className={styles.dateTime}
																error={errorCheckInTime}/>
                            <Required setIf={true} setWhen={localOpportunity && localOpportunity.startEndTimes && localOpportunity.startEndTimes.length > 0
                                && localOpportunity.startEndTimes[0].date && localOpportunity.startEndTimes[0].startTime && localOpportunity.startEndTimes[0].endTime}
                                className={styles.requiredPosition}/>
												</div>
										)
								})}
								<div className={globalStyles.errorText}>{errorDateTime}</div>
								<div className={classes(styles.headerLabel,styles.row)}>
										<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
										<a onClick={this.addAnotherDate} className={globalStyles.link}><L p={p} t={`Add another date and time`}/></a>
								</div>
								<div className={classes(styles.muchLeft, styles.row)}>
										<a className={styles.cancelLink} onClick={() => browserHistory.push('/firstNav')}>Close</a>
										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
								</div>
						</div>
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Volunteer Opportunity Add`}/>} path={'volunteerOpportunityAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(VolunteerOpportunityAddView);
