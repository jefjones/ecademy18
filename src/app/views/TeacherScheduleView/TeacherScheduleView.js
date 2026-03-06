import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './TeacherScheduleView.css';
const p = 'TeacherScheduleView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import classes from 'classnames';
import ReactToPrint from "react-to-print";
import MyFrequentPlaces from '../../components/MyFrequentPlaces';

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

class TeacherScheduleView extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
						intervalId: props.personConfig.intervalId || props.companyConfig.intervalId,
	      }
    }

		componentDidUpdate(prevProps) {
				if (this.props.facilitatorPersonId && (this.state.facilitatorPersonId !== this.props.facilitatorPersonId)){
						this.setState({ facilitatorPersonId: this.props.facilitatorPersonId });
				}
		}

		changeTeacher = (event) => {
				const {getTeacherSchedule, personId, schoolYearId} = this.props;
				browserHistory.push('/teacherSchedule/' + event.target.value);
				if (event.target.value !== "0") getTeacherSchedule(personId, event.target.value, schoolYearId);
		}

		changeItem = ({target}) => {
				const {personId, updatePersonConfig, getTeacherSchedule} = this.props;
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
				updatePersonConfig(personId, 'IntervalId', event.target.value,
						() => {
								getTeacherSchedule(personId, newState.facilitatorPersonId);
						}
				);
		}

		handleUpdateSchoolYear = ({target}) => {
				const {personId, updatePersonConfig, getTeacherSchedule} = this.props;
				const {facilitatorPersonId} = this.state;
				this.setState({ courseScheduledschoolYearId: target.value });
				if (!isNaN(target.value)) updatePersonConfig(personId, 'SchoolYearId', target.value, () => getTeacherSchedule(personId, facilitatorPersonId, target.value));
		}

    render() {
      const {personId, myFrequentPlaces, setMyFrequentPlace, facilitators, fetchingRecord, intervals, companyConfig, personConfig, schoolYears, calendarEvents} = this.props;
			let {teacherSchedule} = this.props;
      const {facilitatorPersonId, intervalId, schoolYearId} = this.state;

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
										<L p={p} t={`Teacher's Schedule`}/>
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
												<SelectSingleDropDown
														id={`facilitatorPersonId`}
														label={<L p={p} t={`Teachers`}/>}
														value={facilitatorPersonId}
														options={facilitators}
														className={styles.moreBottomMargin}
														height={`medium`}
														onChange={this.changeTeacher}/>
										</div>
										<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => this.componentRef}/>
								</div>
								<hr/>
								<Loading loadingText={`Loading`} isLoading={!facilitatorPersonId && fetchingRecord && fetchingRecord.teacherSchedule} />
								<div ref={el => (this.componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
										<div className={styles.header}>
												<L p={p} t={`Teacher Schedule`}/>
										</div>
										{teacherSchedule && teacherSchedule.firstName &&
												<div className={classes(styles.row, styles.header, styles.center, styles.bold)}>
														{teacherSchedule.firstName + ' ' + (teacherSchedule.lastName || '')}
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
			 										 onSelectSlot={slotInfo => this.sendToPersonalEventAdd(slotInfo)} />
										</div>
								</div>
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Teacher Schedule`}/>} path={'teacherSchedule'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
        </div>
    )};
}

export default TeacherScheduleView;
