import React, {Component} from 'react';
import styles from './CalendarEventAddView.css';
const p = 'CalendarEventAddView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import { browserHistory, Link } from 'react-router';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Checkbox from '../../components/Checkbox';
import InputText from '../../components/InputText';
import DateTimePicker from '../../components/DateTimePicker';
import TimePicker from '../../components/TimePicker';
import RadioGroup from '../../components/RadioGroup';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

class CalendarEventAddView extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isShowingModal_deleteDate: false,
        errorEventName: '',
        errorSchedule: '',
        errorToDate: '',
        errorFromDate: '',
        errorStartTime: '',
        errorDuration: '',
        schedule: {
            personId: props.personId,
						calendarEventType: 'personal',
						relatedToCourses: [],
            eventName: '',
            note: '',
            weekdays: {
							sunday: false,
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
							saturday: false,
            },
						allDay: '',
            fromDate: '',
            toDate: '',
            startTime: '',
            duration: '',
        },
      }
    }

    componentDidMount() {
        const {dateMoment} = this.props;
				let schedule = this.state.schedule
				schedule.weekdays = schedule.weekdays ? schedule.weekdays : {};
        if (dateMoment) {
						schedule.fromDate = dateMoment.format('YYYY-MM-DD');
            schedule.toDate = dateMoment.format('YYYY-MM-DD');
            schedule.startTime = dateMoment.format('HH:mm');
            schedule.duration = 30;
						schedule.weekdays = { ...schedule.weekdays, [dateMoment.format('dddd').toLowerCase()]:  true };
            this.setState({ schedule });
        }
    }

    changeCalendarEvent = ({target}) => {
      this.setState({ schedule: {...this.state.schedule, [target.name]: target.value} });
    }

    changeSchedule = (field, event) => {
      let schedule = this.state.schedule;
      schedule[field] = event.target.value;
      this.setState({ schedule });
    }

    handleStartTime = (event) => {
      let schedule = this.state.schedule;
      schedule.startTime = event.target.value;
      this.setState({ schedule });
    }

    handleWeekdayPicker = (weekday, event) => {
      let schedule = this.state.schedule;
      schedule.weekdays[weekday] = !schedule.weekdays[weekday];
      this.setState({ schedule });
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm();
    }

    processForm = () => {
        const {addCalendarEvent, personId, calendarDateRange} = this.props;
        const {schedule} = this.state;

        let hasError = false;
        if (!schedule.eventName) {
            hasError = true;
            this.setState({errorEventName: <L p={p} t={`Event name is required`}/> });
        }
        if (!schedule.fromDate) {
            hasError = true;
            this.setState({errorFromDate: <L p={p} t={`A From Date is required`}/> });
        }
				if (!schedule.startTime) {
            hasError = true;
            this.setState({errorStartTime: <L p={p} t={`A Start Time is required`}/> });
        }
				if (!schedule.allDay && !schedule.duration) {
            hasError = true;
            this.setState({errorDuration: <L p={p} t={`A Duration is required (all day or duration)`}/> });
        }

        if (!hasError) {
            addCalendarEvent(personId, schedule, calendarDateRange);
            browserHistory.push(`/calendarAndEvents`)
        }
    }

		toggleCheckbox = () => {
				let schedule = this.state.schedule;
				schedule.allDay = !this.state.schedule.allDay;
				schedule.duration = schedule.allDay ? '' : 30;
				this.setState({ schedule });
		}

		coursesValueRenderer = (selected, options) => {
				return <div className={styles.bold}>{`Courses:  ${selected.length} of ${options.length}`}</div>;
		}

		handleSelectedCourses = (selectedCourses) => {
				this.setState({ schedule: {...this.state.schedule, selectedCourses } });
    }

		handleRadioGroup = (value) => {
				this.setState({ schedule: {...this.state.schedule, calendarEventType: value } });
	  }

    render() {
      const {durationOptions, accessRoles} = this.props;
      const {schedule, errorEventName, errorSchedule, errorToDate, errorFromDate, errorStartTime, errorDuration, isShowingModal_deleteDate } = this.state;

			let calendarEventTypes = accessRoles.admin
					? [{label: "Personal event",id: "personal"},{label: <L p={p} t={`School event (admin only)`}/>, id: "school"}]
					: accessRoles.facilitator
							? [{label: "Personal event",id: "personal"},{label: <L p={p} t={`Related to course(s)`}/>, id: "course"}]
							: [];

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    <L p={p} t={`Schedule an Event`}/>
                </div>
								{accessRoles.admin &&
										<RadioGroup
												data={calendarEventTypes}
												id={`calendarEventType`}
												name={`calendarEventType`}
												horizontal={false}
												className={styles.radio}
												initialValue={schedule.calendarEventType || ''}
												onClick={this.handleRadioGroup}/>
								}
                <div className={styles.formLeft}>
                    <InputText
                        id={`eventName`}
                        name={`eventName`}
                        size={"medium"}
                        label={<L p={p} t={`Event`}/>}
												value={schedule.eventName}
                        required={true}
												whenFilled={schedule.eventName}
                        onChange={this.changeCalendarEvent}
                        onEnterKey={this.handleEnterKey}
                        error={errorEventName} />

                    {/*<div className={styles.column}>
                        <span className={styles.label}>{'Event note (optional)'}</span>
                        <textarea rows={5} cols={35} name={'note'} value={schedule.note} onChange={this.changeCalendarEvent} className={styles.commentBox}></textarea>
                    </div>*/}
                    {/*<hr />*/}
										<div className={styles.error}>{errorSchedule}</div>
                    <div className={styles.error}>{errorFromDate}</div>
                    {/*<div className={styles.classification}>One-time or Repeating Events</div>
                    <WeekdayPicker picker={schedule.weekdays} onClick={this.handleWeekdayPicker}/>
										<div className={styles.duration}>
											<SelectSingleDropDown
													id={`repeatForWeeks`}
													name={`repeatForWeeks`}
													label={`Repeat for weeks`}
													value={schedule.repeatForWeeks}
													options={repeatForWeeksOptions}
													height={`medium`}
													onChange={(event) => this.changeSchedule('repeatForWeeks', event)} />
										</div>*/}
                    <div className={styles.dateRow}>
                        <div className={styles.dateColumn}>
														<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={schedule.fromDate} maxDate={schedule.toDate ? schedule.toDate : ''}
																onChange={(event) => this.changeSchedule('fromDate', event)} error={errorFromDate}
																required={true} whenFilled={schedule.fromDate}/>
                        </div>
                        <div className={classes(styles.dateColumn, styles.moreLeft)}>
                            <DateTimePicker id={`toDate`} label={<L p={p} t={`To date`}/>} value={schedule.toDate} minDate={schedule.fromDate ? schedule.fromDate : ''}
                                onChange={(event) => this.changeSchedule('toDate', event)} error={errorToDate}
																required={true} whenFilled={schedule.toDate}/>
                        </div>
                    </div>
										<div className={styles.error}>{errorDuration}</div>
                    <div className={styles.row}>
                        <div className={styles.dateColumn}>
														<TimePicker id={`startTime`} label={<L p={p} t={`Start time`}/>} value={schedule.startTime || ''} onChange={this.handleStartTime} className={styles.dateTime}
																error={errorStartTime} required={true} whenFilled={schedule.startTime} boldText={true}/>
                        </div>
                        <div className={styles.duration}>
                          <SelectSingleDropDown
                              id={`duration`}
                              name={`duration`}
                              label={<L p={p} t={`Duration`}/>}
                              value={schedule.duration}
                              options={durationOptions}
                              height={`medium`}
                              onChange={(event) => this.changeSchedule('duration', event)}
															required={true}
															whenFilled={schedule.duration}
                              error={errorDuration} />
                        </div>
												<div className={styles.checkboxPosition}>
														<Checkbox
																id={`allDay`}
																label={<L p={p} t={`All day`}/>}
																checked={schedule.allDay}
																onClick={this.toggleCheckbox}
																labelClass={styles.checkboxLabel}
																className={styles.checkbox} />
												</div>
                    </div>
                </div>
								<div className={styles.classification}>Reminder (optional)</div>
								{/*<div className={styles.duration}>
									<SelectSingleDropDown
											id={`reminderFrequencyId`}
											name={`reminderFrequencyId`}
											label={`Duration`}
											value={schedule.reminderFrequencyId}
											options={reminderFrequencyOptions}
											height={`medium`}<L p={p} t={`onChange={(event) => this.changeFrequency(`}/>reminderFrequencyId', event)}
											error={errorDuration} />
								</div>*/}
                <hr />
                <div className={classes(styles.rowRight)}>
										<Link className={styles.cancelLink} to={'/calendarAndEvents'}>Close</Link>
										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
                </div>
            </div>
            <OneFJefFooter />
            {isShowingModal_deleteDate &&
                <MessageModal handleClose={this.handleDeleteDateClose} heading={<L p={p} t={`Remove this specific date?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this specific date?`}/>} isConfirmType={true}
                   onClick={this.handleDeleteDate} />
            }
        </div>
    )};
}

export default CalendarEventAddView;
