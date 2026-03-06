import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './CalendarAndEventsView.css';
const p = 'CalendarAndEventsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import ScheduleModal from '../../components/ScheduleModal';
import Checkbox from '../../components/Checkbox';
import InputDataList from '../../components/InputDataList';
import MultiSelect from '../../components/MultiSelect';
import CalendarEventModal from '../../components/CalendarEventModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import { withAlert } from 'react-alert';
import classes from 'classnames';

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

class CalendarAndEventsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
           slotInfo: {},
           isShowingModal_nav: false,
           isShowingModal_event: false,
					 calendarDateRange: {fromDate: moment(), toDate: moment()}
        }
    }

    handleScheduleClose = () => this.setState({isShowingModal_nav: false})
    handleScheduleOpen = (slotInfo) => this.setState({isShowingModal_nav: true, slotInfo})

    handleEventOpen = (event) => this.setState({isShowingModal_event: true, chosenEvent: event})
		handleEventClose = () => this.setState({isShowingModal_event: false})

    changeViewRange = (viewRange) => {
        const {personId, getCalendarEvents} = this.props; //, setCalendarViewRange
				let calendarDateRange = {}
				if (viewRange && viewRange.end) {
						calendarDateRange = { fromDate: viewRange.start, toDate: viewRange.end };
				} else {
						calendarDateRange = { fromDate: viewRange[0], toDate: viewRange[viewRange.length-1] };
				}
				getCalendarEvents(personId, calendarDateRange);
				//This call causes the browser to freeze ... probably due to the local redux update when the timer is going off every 10 seconds.
				//setCalendarViewRange(viewRange.length === 1 ? 'day' : viewRange.length === 5 ? 'work_week' : viewRange.length === 7 ? 'week' : 'month');
				this.setState({ calendarDateRange });
    }

		sendToPersonalEventAdd = (slotInfo) => {
				const {calendarDateRange} = this.state;
				browserHistory.push(`/calendarEventAdd/${slotInfo.start}/${moment(calendarDateRange.fromDate).format('YYYY-MM-DD')}/${moment(calendarDateRange.toDate).format('YYYY-MM-DD')}`)
		}


		dataListChange = (field, values) => {
				const {personId, setPersonConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				let result = values && values.length > 0 && values.reduce((acc, m) => {
						if (m.id) acc = acc += (acc && acc.length > 0 ? ',' : '') + m.id;
						return acc;
				}, "");
				setPersonConfigCalendar(personId, field, result, () => getCalendarEvents(personId, calendarDateRange));
		}

		toggleCheckbox = (field, event) => {
				const {personId, setPersonConfigCalendar, personConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				setPersonConfigCalendar(personId, field, !personConfigCalendar[field] ? "true" : "false", () => getCalendarEvents(personId, calendarDateRange))
		}

		removeTeacher = (id) => {
				const {personId, setPersonConfigCalendar, personConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				let teacherIdList = Object.assign([], personConfigCalendar.teacherIdList);
				if (teacherIdList && teacherIdList.length > 0) {
						let result = teacherIdList.reduce((acc, m) => {
								if (id !== m.id) {
										acc = acc += (acc && acc.length > 0 ? ',' : '') + m.id;
								}
								return acc;
						}, "");
						setPersonConfigCalendar(personId, 'teacherIdList', result, () => getCalendarEvents(personId, calendarDateRange));
				}
		}

		removeStudent = (incomingId) => {
				const {personId, setPersonConfigCalendar, personConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				let studentIdList = Object.assign([], personConfigCalendar.studentIdList);
				if (studentIdList && studentIdList.length > 0) {
						let result = studentIdList.reduce((acc, id) => {
								if (incomingId !== id) {
										acc = acc += (acc && acc.length > 0 ? ',' : '') + id;
								}
								return acc;
						}, "");
						setPersonConfigCalendar(personId, 'studentIdList', result, () => getCalendarEvents(personId, calendarDateRange));
				}
		}

		removeHomeworkClass = (id) => {
				const {personId, setPersonConfigCalendar, personConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				let homeworkClassIdList = Object.assign([], personConfigCalendar.homeworkClassIdList);
				if (homeworkClassIdList && homeworkClassIdList.length > 0) {
						let result = homeworkClassIdList.reduce((acc, m) => {
								if (id !== m.id) {
										acc = acc += (acc && acc.length > 0 ? ',' : '') + m.id;
								}
								return acc;
						}, "");
						setPersonConfigCalendar(personId, 'homeworkClassIdList', result, () => getCalendarEvents(personId, calendarDateRange));
				}
		}

		handleSelectedMyTeachers = (teacherIdList) => {
				const {personId, setPersonConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				setPersonConfigCalendar(personId, 'teacherIdList', teacherIdList && teacherIdList.join(','), () => getCalendarEvents(personId, calendarDateRange));
	  }

		handleSelectedMyClasses = (classIdList) => {
				const {personId, setPersonConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				setPersonConfigCalendar(personId, 'classIdList', classIdList && classIdList.join(','), () => getCalendarEvents(personId, calendarDateRange));
	  }

		handleSelectedMyStudents = (studentIdList) => {
				const {personId, setPersonConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				setPersonConfigCalendar(personId, 'studentIdList', studentIdList && studentIdList.join(','), () => getCalendarEvents(personId, calendarDateRange));
	  }

		handleSelectedMyHomework = (homeworkClassIdList) => {
				const {personId, setPersonConfigCalendar, getCalendarEvents} = this.props;
				const {calendarDateRange} = this.state;
				setPersonConfigCalendar(personId, 'homeworkClassIdList', homeworkClassIdList && homeworkClassIdList.join(','), () => getCalendarEvents(personId, calendarDateRange));
	  }

		myTeachersValueRenderer = (selected, options) => {
				return <div className={styles.row}><div className={selected.length > 0 ? styles.chosen : ''}><L p={p} t={`Teachers`}/></div><div>{`:  ${selected.length} of ${options.length}`}</div></div>;
	  }

		myClassesValueRenderer = (selected, options) => {
	      return <div className={styles.row}><div className={selected.length > 0 ? styles.chosen : ''}><L p={p} t={`Classes`}/></div><div>{`:  ${selected.length} of ${options.length}`}</div></div>;
	  }

		myStudentsValueRenderer = (selected, options) => {
	      return <div className={styles.row}><div className={selected.length > 0 ? styles.chosen : ''}><L p={p} t={`Students`}/></div><div>{`:  ${selected.length} of ${options.length}`}</div></div>;
	  }

		myHomeworkValueRenderer = (selected, options) => {
				return <div className={styles.row}><div className={selected.length > 0 ? styles.chosen : ''}><L p={p} t={`Homework Due`}/></div><div>{`:  ${selected.length} of ${options.length}`}</div></div>;
	  }

    render() {
         const {personId, myFrequentPlaces, setMyFrequentPlace, companyConfig={}, removeCalendarEvent, calendarEvents, accessRoles, coursesScheduled,
				 					personConfigCalendar={}, facilitators=[], students=[], courses=[], myClasses, myStudentsClasses} = this.props;
         const {isShowingModal_nav, isShowingModal_event, slotInfo, chosenEvent, calendarDateRange} = this.state;

				 var minTime = new Date();
				 minTime.setHours(7);
				 minTime.setMinutes(0);
				 var maxTime = new Date();
				 maxTime.setHours(19);
				 maxTime.setMinutes(0);

         let studentIdList = personConfigCalendar.studentIdList && personConfigCalendar.studentIdList && students && students.length > 0
            && personConfigCalendar.studentIdList.reduce((acc, id) => {
               let student = students.filter(s => s.id === id)[0]
               if (student && student.id) {
                  let option =  {id: student.id, label: student.firstName + ' ' + student.lastName};
                  acc = acc && acc.length > 0 ? acc.concat(option) : [option];
               }
               return acc;
            },[]);

         let homeworkIdList = accessRoles.learner ? myClasses : accessRoles.observer ? myStudentsClasses : courses;

         return (
            <div className={styles.container}>
								<div className={globalStyles.pageTitle}>
										Calendar and Events
								</div>
                {/*<video id={"vid1"} className={"azuremediaplayer amp-default-skin"} autoplay={'autoplay'} controls={'controls'} width={"640"} height={"400"} poster={"poster.jpg"} data-setup={{"nativeControlsForTouch": false}}>
                    <source src={"http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest"} type={"application/vnd.ms-sstr+xml"} />
                    <p className={"amp-no-js"}>
                        {`To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video`}
                    </p>
                </video>*/}
								<div className={styles.rowWrap}>
										<Checkbox
												id={'personal'}
												name={'personal'}
												label={<L p={p} t={`Personal`}/>}
												labelClass={classes(styles.checkboxLabel, personConfigCalendar.personal ? styles.chosen : '')}
												checked={personConfigCalendar.personal || false}
												onClick={(event) => this.toggleCheckbox('personal', event)}
												className={styles.calendarCheckbox}/>
										<Checkbox
												id={'school'}
												name={'school'}
												label={<L p={p} t={`School`}/>}
												labelClass={classes(styles.checkboxLabel, personConfigCalendar.school ? styles.chosen : '')}
												checked={personConfigCalendar.school || false}
												onClick={(event) => this.toggleCheckbox('school', event)}
												className={styles.calendarCheckbox}/>

										{(accessRoles.admin || accessRoles.facilitator) &&
												<div className={styles.moreLeft}>
														<InputDataList
																label={
																		<div className={styles.row}>
																				<div>Teacher</div>
																				<div className={styles.countRow}>
																						{(personConfigCalendar.teacherIdList && personConfigCalendar.teacherIdList.length) || '0'}
																						<div className={styles.countText}>of</div>
																						{facilitators.length}
																				</div>
																		</div>
																}
																name={'teacherIdList'}
																options={facilitators}
																value={personConfigCalendar.teacherIdList || []}
																multiple={true}
																height={`small`}
																className={styles.moreSpace}
																labelClass={classes(styles.checkboxLabel, personConfigCalendar.teacherIdList ? styles.chosen : '')}
																onChange={(values) => this.dataListChange('teacherIdList', values)}
																removeFunction={this.removeTeacher}/>
												</div>
										}
										{(accessRoles.learner || accessRoles.observer) &&
												<div className={styles.multiSelect}>
														<MultiSelect
																name={'teacherIdList'}
																options={facilitators || []}
																onSelectedChanged={this.handleSelectedMyTeachers}
																valueRenderer={this.myTeachersValueRenderer}
																getJustCollapsed={() => {}}
																selected={personConfigCalendar.teacherIdList && personConfigCalendar.teacherIdList.length > 0
																		? personConfigCalendar.teacherIdList.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], [])
																		: []}/>
												</div>
										}
										{(accessRoles.admin || accessRoles.facilitator) &&
												<div className={styles.moreLeft}>
														<InputDataList
																label={
																		<div className={styles.row}>
																				<div>Student</div>
																				<div className={styles.countRow}>
																						{(personConfigCalendar.studentIdList && personConfigCalendar.studentIdList.length) || '0'}
																						<div className={styles.countText}>of</div>
																						{students.length}
																				</div>
																		</div>
																}
																name={'studentIdList'}
																options={students}
																value={studentIdList || []}
																multiple={true}
																height={`small`}
																className={styles.moreSpace}
																labelClass={classes(styles.checkboxLabel, personConfigCalendar.studentIdList ? styles.chosen : '')}
																onChange={(values) => this.dataListChange('studentIdList', values)}
																removeFunction={this.removeStudent}/>
												</div>
										}
										{accessRoles.observer &&
												<div className={styles.multiSelect}>
														<MultiSelect
																name={'studentIdList'}
																options={students || []}
																onSelectedChanged={this.handleSelectedMyStudents}
																valueRenderer={this.myStudentsValueRenderer}
																getJustCollapsed={() => {}}
																selected={personConfigCalendar.studentIdList && personConfigCalendar.studentIdList.length > 0
																		? personConfigCalendar.studentIdList.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], [])
																		: []}/>
												</div>
										}
										{accessRoles.learner && myClasses && myClasses.length > 0 &&
												<div className={styles.multiSelect}>
														<MultiSelect
																name={'classIdList'}
																options={myClasses || []}
																onSelectedChanged={this.handleSelectedMyClasses}
																valueRenderer={this.myClassesValueRenderer}
																getJustCollapsed={() => {}}
																selected={personConfigCalendar.classIdList && personConfigCalendar.classIdList.length > 0
																		? personConfigCalendar.classIdList.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], [])
																		: []}/>
												</div>
										}
										{(accessRoles.admin || accessRoles.facilitator) &&
												<div className={classes(styles.moreLeft, styles.moreBottom)}>
														<InputDataList
																label={
																		<div className={styles.row}>
																				<div>Homework Due</div>
																				<div className={styles.countRow}>
																						{(personConfigCalendar.homeworkClassIdList && personConfigCalendar.homeworkClassIdList.length) || '0'}
																						<div className={styles.countText}>of</div>
																						{courses.length}
																				</div>
																		</div>
																}
																name={'homeworkClassIdList'}
																options={accessRoles.observer ? myStudentsClasses : courses}
																value={personConfigCalendar.homeworkClassIdList || []}
																multiple={true}
																height={`small`}
																className={styles.moreSpace}
																labelClass={classes(styles.checkboxLabel, personConfigCalendar.homeworkClassIdList ? styles.chosen : '')}
																onChange={(values) => this.dataListChange('homeworkClassIdList', values)}
																removeFunction={this.removeHomeworkClass}/>
												</div>
										}
										{(accessRoles.learner || accessRoles.observer) && homeworkIdList && homeworkIdList.length > 0 &&
												<div className={styles.multiSelectLonger}>
														<MultiSelect
																name={'homeworkClassIdList'}
																options={(accessRoles.learner ? myClasses : accessRoles.observer ? myStudentsClasses : courses) || []}
																onSelectedChanged={this.handleSelectedMyHomework}
																valueRenderer={this.myHomeworkValueRenderer}
																getJustCollapsed={() => {}}
																selected={personConfigCalendar.homeworkClassIdList && personConfigCalendar.homeworkClassIdList.length > 0
																		? personConfigCalendar.homeworkClassIdList.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], [])
																		: []}/>
												</div>
										}
								</div>
								<div className={styles.calendarHeight}>
								<Calendar
										 localizer={localizer}
										 events={calendarEvents}
										 views={allViews}
										 showMultiDayTimes
										 selectable
										 defaultView={'day'}
										 //defaultView={personConfigCalendar && personConfigCalendar.viewRange ? allViews[personConfigCalendar.viewRange] : allViews['day'] }
										 min={minTime}
										 max={maxTime}
										 step={30}
										 eventPropGetter={
											 (event, start, end, isSelected) => {
	                          let personal = {
	                            backgroundColor: '#59eb4a',
	                            borderRadius: "3px",
	                            borderColor: '#add8e6 #add8e6',
															borderWidth: '3px',
	                            fontSize:'10px',
	                            color:'white',
	                          };
														let school = {
	                            backgroundColor: '#4ac8eb',
	                            borderRadius: "3px",
	                            borderColor: '#add8e6 #add8e6',
															borderWidth: '3px',
	                            fontSize:'10px',
	                            color:'white',
	                          };
														let teacher = {
	                            backgroundColor: '#c44aeb',
	                            borderRadius: "3px",
	                            borderColor: '#add8e6 #add8e6',
															borderWidth: '3px',
	                            fontSize:'10px',
	                            color:'white',
	                          };
														let student = {
	                            backgroundColor: '#eb8f4a',
	                            borderRadius: "3px",
	                            borderColor: '#add8e6 #add8e6',
															borderWidth: '3px',
	                            fontSize:'10px',
	                            color:'white',
	                          };
														let course = {
	                            backgroundColor: '#4a7aeb',
	                            borderRadius: "3px",
	                            borderColor: '#add8e6 #add8e6',
															borderWidth: '3px',
	                            fontSize:'10px',
	                            color:'white',
	                          };
														let homework = {
	                            backgroundColor: '#e1eb4a',
	                            borderRadius: "3px",
	                            borderColor: '#add8e6 #add8e6',
															borderWidth: '3px',
	                            fontSize:'10px',
	                            color:'black',
	                          };
	                          return {
															start: '',
															end: '',
	                            className: "mine",
	                            style: event.calendarEventType === 'personal'
																	? personal
																	: event.calendarEventType === 'school'
																			? school
																			: event.calendarEventType === 'teacher'
																					? teacher
																					: event.calendarEventType === 'student'
																							? student
																							: event.calendarEventType === 'homework'
																							 		? homework
																									: course,
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
								<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Calendar And Events`}/>} path={'calendarAndEvents'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
								{isShowingModal_nav &&
								    <ScheduleModal onClick={this.handleScheduleClose} heading={``} explain={``} slotInfo={slotInfo} events={calendarEvents}
								        removeCalendarEvent={removeCalendarEvent} personId={personId} calendarDateRange={calendarDateRange} companyConfig={companyConfig}
												accessRoles={accessRoles}/>
								}
								{isShowingModal_event &&
								    <CalendarEventModal onClick={this.handleEventClose} heading={``} explain={``} chosenEvent={chosenEvent} events={calendarEvents}
								        removeCalendarEvent={removeCalendarEvent} personId={personId} calendarDateRange={calendarDateRange} accessRoles={accessRoles}
												coursesScheduled={coursesScheduled}/>
								}
            </div>
        )
    };
}

export default withAlert(CalendarAndEventsView);
