import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './StudentScheduleWeekView.css';
const p = 'StudentScheduleWeekView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import InputDataList from '../../components/InputDataList';
import classes from 'classnames';
import ReactToPrint from "react-to-print";
import CalendarEventModal from '../../components/CalendarEventModal';
import MessageModal from '../../components/MessageModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import {guidEmpty} from '../../utils/guidValidate.js';

import {Calendar, Views, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
const localizer = momentLocalizer(moment)
let allViews = Object.keys(Views).map(k => Views[k])

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
})

class StudentScheduleWeekView extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
						isShowingModal_event: false,
						isShowingModal_cannotAdd: false,
						intervalId: props.personConfig.intervalId || props.companyConfig.intervalId,
	      }
    }

		componentDidUpdate(prevProps) {
				const {studentPersonId, students} = this.props;
				if ((!this.state.studentPersonId || this.state.studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
						let student = students.filter(m => m.id === studentPersonId)[0]
						this.setState({ student, studentPersonId });
				} else if (this.props.studentPersonId && (this.state.studentPersonId !== this.props.studentPersonId || prevProps.studentsSimple !== this.props.studentsSimple)){
						this.setState({ studentPersonId: this.props.studentPersonId });
				}
		}

		changeStudent = (student) => {
				const {getStudentScheduleWeek, personId, schoolYearId, setStudentChosenSession} = this.props;
				browserHistory.push('/studentScheduleWeek/' + student.id);
				if (student.id) getStudentScheduleWeek(personId, student.id, schoolYearId);
				setStudentChosenSession(student.id);
		}

		changeItem = ({target}) => {
				const {getStudentScheduleWeek, personId, updatePersonConfig} = this.props;
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
				updatePersonConfig(personId, 'IntervalId', event.target.value, () => getStudentScheduleWeek(personId, target.value, newState.schoolYearId))

		}

		handleUpdateSchoolYear = ({target}) => {
				const {personId, updatePersonConfig, getStudentScheduleWeek} = this.props;
				const {student} = this.state;
				this.setState({ courseScheduledschoolYearId: target.value });
				if (!isNaN(target.value)) updatePersonConfig(personId, 'SchoolYearId', target.value, () => getStudentScheduleWeek(personId, student.id, target.value));
		}

		changeViewRange = (viewRange) => {
        const {getCalendarEvents} = this.props; //, setCalendarViewRange
				const {student} = this.state;
				let calendarDateRange = {}
				if (viewRange && viewRange.end) {
						calendarDateRange = { fromDate: viewRange.start, toDate: viewRange.end };
				} else {
						calendarDateRange = { fromDate: viewRange[0], toDate: viewRange[viewRange.length-1] };
				}
				student && student.id && getCalendarEvents(student.id, calendarDateRange);
				//This call causes the browser to freeze ... probably due to the local redux update when the timer is going off every 10 seconds.
				//setCalendarViewRange(viewRange.length === 1 ? 'day' : viewRange.length === 5 ? 'work_week' : viewRange.length === 7 ? 'week' : 'month');
				this.setState({ calendarDateRange });
    }

		handleEventOpen = (event) => this.setState({isShowingModal_event: true, chosenEvent: event})
		handleEventClose = () => this.setState({isShowingModal_event: false})

		handleConfirmAlertOpen = (alertReviewType, safetyAlertId) =>
				this.setState({ isShowingModal_comment: true, alertReviewType, safetyAlertId});
		handleConfirmAlertClose = () =>  this.setState({ isShowingModal_comment: false, alertReviewType: '', safetyAlertId: ''});

		handleNoAddEventOpen = () => this.setState({ isShowingModal_cannotAdd: true});
		handleNoAddEventClose = () => this.setState({ isShowingModal_cannotAdd: false});

    render() {
      const {personId, students, fetchingRecord, companyConfig={}, personConfig={}, schoolYears, intervals, studentPersonId, calendarEvents, studentName,
							myFrequentPlaces, setMyFrequentPlace } = this.props;
      const {schoolYearId, intervalId, student, isShowingModal_event, chosenEvent, isShowingModal_cannotAdd} = this.state;

			var minTime = new Date();
			minTime.setHours(7);
			minTime.setMinutes(0);
			var maxTime = new Date();
			maxTime.setHours(19);
			maxTime.setMinutes(0);

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
										<L p={p} t={`Student's Schedule`}/>
								</div>
								<div className={styles.rowWrap}>
										<div>
												<SelectSingleDropDown
														id={`schoolYearId`}
														label={<L p={p} t={`School year`}/>}
														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
														options={schoolYears}
														height={`medium`}
														onChange={this.handleUpdateSchoolYear}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={`intervalId`}
														label={<L p={p} t={`Interval`}/>}
														value={intervalId || personConfig.intervalId || companyConfig.intervalId}
														options={intervals}
														height={`medium`}
														onChange={this.changeItem}/>
										</div>
										<div>
												<InputDataList
														label={<L p={p} t={`Student`}/>}
														name={'student'}
														options={students}
														value={student}
														height={`medium`}
														maxwidth={`mediumshort`}
														multiple={false}
														className={styles.littleTop}
														onChange={this.changeStudent}/>
										</div>
										<div className={styles.inputPosition}>
												<Link to={`/studentSchedule/${studentPersonId}`} className={classes(globalStyles.link, styles.row)}>
														<Icon pathName={'clock3'} premium={true} className={styles.iconInline}/>
														<L p={p} t={`Go to schedule with grade summary`}/>
												</Link>
										</div>
										<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => this.componentRef}/>
								</div>
								<hr/>
								<Loading loadingText={`Loading`} isLoading={!studentPersonId && fetchingRecord && fetchingRecord.studentScheduleWeek} />
								<div ref={el => (this.componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
										<div className={styles.header}>
												<L p={p} t={`Student Schedule`}/>
										</div>
										{studentName &&
												<div className={classes(styles.row, styles.header, styles.center, styles.bold)}>
														{studentName}
												</div>
										}
										<div className={styles.calendarHeight}>
											 <Calendar
			 										 localizer={localizer}
			 										 events={calendarEvents}
			 										 views={allViews}
			 										 showMultiDayTimes
			 										 selectable
			 										 defaultView={'work_week'}
			 										 //defaultView={personConfigCalendar && personConfigCalendar.viewRange ? allViews[personConfigCalendar.viewRange] : allViews['day'] }
			 										 min={minTime}
			 										 max={maxTime}
			 										 step={30}
			 										 eventPropGetter={
			 											 (event, start, end, isSelected) => {
			 														let course = {
			 	                            backgroundColor: '#4a7aeb',
			 	                            borderRadius: "3px",
			 	                            borderColor: '#add8e6 #add8e6',
			 															borderWidth: '3px',
			 	                            fontSize:'10px',
			 	                            color:'white',
			 	                          };
			 	                          return {
			 															start: '',
			 															end: '',
			 	                            className: "mine",
			 	                            style: course,
			 	                          };
			 	                       }
			                      }
			 										 components={{ timeSlotWrapper: ColoredDateCellWrapper,}}
			 										 startAccessor="start"
			 										 endAccessor="end"
			 										 onRangeChange={event => this.changeViewRange(event)}
			 										 onSelectEvent={event => this.handleEventOpen(event)}
			 										 onSelectSlot={this.handleNoAddEventOpen} />
										</div>
								</div>
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Student Schedule Week`}/>} path={'studentScheduleWeek'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
						{isShowingModal_event &&
								<CalendarEventModal onClick={this.handleEventClose} heading={``} explain={``} chosenEvent={chosenEvent} events={calendarEvents}
										doNotAddNew={true} doNotRemove={true} handleClose={this.handleEventClose}/>
						}
						{isShowingModal_cannotAdd &&
								<MessageModal handleClose={this.sendToPersonalEventAddClose} heading={<L p={p} t={`Cannot Add to Calendar`}/>}
									 explainJSX={<L p={p} t={`This is a student schedule view only.  In order to add to your calendar, go to Calendar and Events from your main menu.`}/>}
									 onClick={this.sendToPersonalEventAddClose} />
						}
        </div>
    )};
}

export default StudentScheduleWeekView;
