import React, {Component} from 'react';  //PropTypes
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import globalStyles from '../../utils/globalStyles.css';
import styles from './CarpoolAcceptRequestDirectModal.css';
import CheckboxGroup from '../CheckboxGroup';
import WeekdayDisplay from '../WeekdayDisplay';
import TimeDisplay from '../TimeDisplay';
import DateMoment from '../DateMoment';
import FlexColumn from '../FlexColumn';
import ButtonWithIcon from '../ButtonWithIcon';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class CarpoolAcceptRequestDirectModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
						seatsAvailable: '',
						seatsNeeded: '',
						errorSeats: '',
        }
    }

    handleChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
				let field = event.target.name;
				let newState = Object.assign({}, this.state);
				newState[field] = event.target.value
        this.setState(newState);
    }

		processForm = (stayOrFinish) => {
	      const {carpoolRequestDirect, acceptDirectRequest, personId, handleClose} = this.props;
				//const {seatsAvailable, seatsNeeded} = this.state;
	      //let hasError = false;

				// if (!seatsNeeded && !seatsAvailable) {
	      //     hasError = true;
	      //     this.setState({errorSeats: "Enter seats needed or seats available" });
	      // }
	      //if (!hasError) {
	          acceptDirectRequest(personId, carpoolRequestDirect.carpoolRequestDirectId);
						handleClose();
	      //}
	  }

		handleCarpoolChoice = (inviteCarpoolId) => {
				this.setState({ inviteCarpoolId });
		}

		handleDaysICanDrive = (event, driveDay, carpoolTimeId) => {
				const {personId, toggleCarpoolRequestDirectCanDoDay} = this.props;
				toggleCarpoolRequestDirectCanDoDay(personId, carpoolTimeId, driveDay);
		}

    render() {
        const {handleClose, carpoolRequestDirect, daysOfWeekAll} = this.props;

				let dataPickUp = []
				carpoolRequestDirect && carpoolRequestDirect.carpoolTimes && carpoolRequestDirect.carpoolTimes.length > 0
								&& carpoolRequestDirect.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').forEach((m, i) => {

						let daysOfWeekOptions = [];
						daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(d => {
								if (m.daysOfWeek.indexOf(d.id) > -1)
										daysOfWeekOptions = daysOfWeekOptions && daysOfWeekOptions.length > 0 ? daysOfWeekOptions.concat(d) : [d];
						})

						dataPickUp.push([
								{value: <TimeDisplay time={m.time}/>, boldText: true},
								{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
								{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
								{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
								{value: <div className={classes(globalStyles.multiSelect, styles.moreTop)}>
														<CheckboxGroup
																name={'daysICanDrive'}
																options={daysOfWeekOptions || []}
																horizontal={true}
																onSelectedChanged={this.handleDaysICanDrive}
																label={<L p={p} t={`Days I can drive (generally)`}/>}
																labelClass={styles.text}
																selected={m.daysICanDrive}/>
												</div>
								},
						]);
				});

        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.dialogHeader}>{<L p={p} t={`Carpool Request Response`}/>}</div>
												{/*<div>
														<InputText
																id={'seatsAvailable'}
																name={'seatsAvailable'}
																value={seatsAvailable || ''}
																label={`Seats vacant in my car`}
																size={"super-short"}
																numberOnly={true}
																onChange={this.handleChange}
																error={errorSeats}/>
						            </div>
												<div>
														<InputText
																id={'seatsNeeded'}
																name={'seatsNeeded'}
																value={seatsNeeded && seatsNeeded !== 0 ? seatsNeeded : ''}
																label={`Number of seats I need for my students when others drive.`}
																size={"super-short"}
																numberOnly={true}
																onChange={this.handleChange}/>
						            </div>*/}
												<div>
														<div className={styles.dropOffBackground}>
																{carpoolRequestDirect && carpoolRequestDirect.carpoolTimes && carpoolRequestDirect.carpoolTimes.length > 0
																				&& carpoolRequestDirect.carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff').map((m, i) => {

																		let daysOfWeekOptions = [];
																		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(d => {
																				if (m.daysOfWeek.indexOf(d.id) > -1)
																						daysOfWeekOptions = daysOfWeekOptions && daysOfWeekOptions.length > 0 ? daysOfWeekOptions.concat(d) : [d];
																		})

																		return (
																				<div key={i}>
																						<FlexColumn heading={<L p={p} t={`Drop-off`}/>} data={<TimeDisplay time={m.time}/>} />
																						<FlexColumn heading={<L p={p} t={`From date`}/>} data={<DateMoment date={m.fromDate} includeTime={false}/>} />
																						<FlexColumn heading={<L p={p} t={`To date`}/>} data={<DateMoment date={m.toDate} includeTime={false}/>} />
																						<FlexColumn heading={<L p={p} t={`Days`}/>} data={<WeekdayDisplay days={m.daysOfWeek}/>} />
																						<FlexColumn heading={<L p={p} t={`Days I can drive (generally)`}/>}
																								data={<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
																													<CheckboxGroup
																															name={'daysICanDrive'}
																															options={daysOfWeekOptions || []}
																															horizontal={true}
																															recordTypeId={m.carpoolTimeId}
																															onSelectedChanged={this.handleDaysICanDrive}
																															label={''}
																															labelClass={styles.text}
																															selected={m.daysICanDrive}/>
																											</div>
																						} />
																				</div>
																		)
																	})
																}
														</div>
														<div className={styles.pickUpBackground}>
																{carpoolRequestDirect && carpoolRequestDirect.carpoolTimes && carpoolRequestDirect.carpoolTimes.length > 0
																				&& carpoolRequestDirect.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').map((m, i) => {

																		let daysOfWeekOptions = [];
																		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(d => {
																				if (m.daysOfWeek.indexOf(d.id) > -1)
																						daysOfWeekOptions = daysOfWeekOptions && daysOfWeekOptions.length > 0 ? daysOfWeekOptions.concat(d) : [d];
																		})

																		return (
																				<div key={i}>
																						<FlexColumn heading={<L p={p} t={`Pick-up`}/>} data={<TimeDisplay time={m.time}/>} />
																						<FlexColumn heading={<L p={p} t={`From date`}/>} data={<DateMoment date={m.fromDate} includeTime={false}/>} />
																						<FlexColumn heading={<L p={p} t={`To date`}/>} data={<DateMoment date={m.toDate} includeTime={false}/>} />
																						<FlexColumn heading={<L p={p} t={`Days`}/>} data={<WeekdayDisplay days={m.daysOfWeek}/>} />
																						<FlexColumn heading={<L p={p} t={`Days I can drive (generally)`}/>}
																								data={<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
																													<CheckboxGroup
																															name={'daysICanDrive'}
																															options={daysOfWeekOptions || []}
																															horizontal={true}
																															recordTypeId={m.carpoolTimeId}
																															onSelectedChanged={this.handleDaysICanDrive}
																															label={''}
																															labelClass={styles.text}
																															selected={m.daysICanDrive}/>
																											</div>
																						} />
																				</div>
																		)
																	})
																}
														</div>
												</div>
												{/*<div className={styles.label}>{`Comment (optional)`}</div>
												<textarea rows={5} cols={35} value={comment} onChange={this.handleChange} id={'comment'} name={'comment'}
                            className={styles.commentBox}/>*/}
                        <div className={styles.dialogButtons}>
                            <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
