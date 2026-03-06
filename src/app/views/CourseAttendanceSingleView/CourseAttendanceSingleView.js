import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './CourseAttendanceSingleView.css';
const p = 'CourseAttendanceSingleView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import DateTimePicker from '../../components/DateTimePicker';
import Checkbox from '../../components/Checkbox';
import MultiSelect from '../../components/MultiSelect';
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import InputDataList from '../../components/InputDataList';
import {formatYYYY_MM_DD} from '../../utils/dateFormatYYYY_MM_DD.js';
import classes from 'classnames';
import TimeDisplay from '../../components/TimeDisplay';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import moment from 'moment';
import {guidEmpty} from '../../utils/guidValidate.js';
/*
  The data on this page will go back to the server if the student changes,
     but if the date range, attendance types or course lists changes, it depends on the attendanceRoll already received from the server
     and resets the attendanceLocal state and will not recall from the webApi.
*/

class CourseAttendanceSingleView extends Component {
  constructor(props) {
    super(props);

    const {attendanceSingle} = props;

    let dayFrom = '';
    let dayTo = '';
    attendanceSingle && attendanceSingle.length > 0 && attendanceSingle.forEach(m => {
        if (!dayFrom || dayFrom >= formatYYYY_MM_DD(m.day)) dayFrom = formatYYYY_MM_DD(m.day);
        if (!dayTo || dayTo <= formatYYYY_MM_DD(m.day)) dayTo = formatYYYY_MM_DD(m.day);
    })

		let today = formatYYYY_MM_DD(new Date());

    this.state = {
			hasSetToday: false,
      attendanceLocal: props.attendanceSingle,
      dayFrom: dayFrom === '1-01-01' || !dayFrom ? today : dayFrom,
      dayTo: dayTo === '1-01-01' || !dayTo ? today : dayFrom,
      selectedCourses: [],
      errorDueDateFrom: '',
      errorDueDateTo: '',
      tardy: false,
      absent: false,
      excusedAbsence: false,
      leftEarly: false
    }
  }

	componentDidMount() {
			this.initDates();
	}

	componentDidUpdate() {
			const {attendanceSingle, studentPersonId, students} = this.props;
			const {isInit, isInitStudent} = this.state;
			if (!isInit && attendanceSingle && attendanceSingle.length > 0) {
					let uniqueCourseScheduledIds = [...new Set(attendanceSingle.map(m => m.courseScheduledId))];
					let uniqueCourses = attendanceSingle && attendanceSingle.length > 0 && attendanceSingle.reduce((acc, m) => {
							if (uniqueCourseScheduledIds.indexOf(m.courseScheduledId) > -1) {
									let option = { value: m.courseScheduledId, id: m.courseScheduledId, label: m.courseName };
									acc = acc && acc.length > 0 ? acc.concat(option) : [option];
							}
							return acc;
					}, [])
					this.setState({ isInit: true, uniqueCourses, selectedCourses: uniqueCourseScheduledIds });
			}
			if (!isInitStudent && !(this.state.studentPersonId && this.state.studentPersonId !== guidEmpty && this.state.studentPersonId != 0) //eslint-disable-line
							&& studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
					let student = students.filter(m => m.id === studentPersonId)[0]
					this.setState({ isInitStudent: true, student, studentPersonId });
			}
	}

	componentWillUnmount() {
			this.props.clearCourseAttendanceSingle();
	}


  saveAttendance = (attendanceType, studentPersonId, courseScheduledId, day, isDelete) => {
      //Do not get the attendance record back after clicking. It refreshes the entire page.  Just change the local version after sending it off.
      const {personId, setCourseAttendance, getCourseAttendanceSingle} = this.props;
			const {dayFrom, dayTo} = this.state;
      setCourseAttendance(personId, attendanceType, studentPersonId, courseScheduledId, day, isDelete, null, () => getCourseAttendanceSingle(personId, studentPersonId, dayFrom, dayTo));
  }

	changeStudent = (student) => {
			const {getCourseAttendanceSingle, personId, setStudentChosenSession} = this.props;
      let {dayFrom, dayTo} = this.state;
	  	let today = moment();
			dayFrom = dayFrom === '1-01-01' ? today : moment(dayFrom).format('YYYY-MM-DD');
			dayTo = dayTo === '1-01-01' ? today : moment(dayTo).format('YYYY-MM-DD');
      getCourseAttendanceSingle(personId, student.id, dayFrom, dayTo)
			browserHistory.push(`/courseAttendanceSingle/${student.id}`)
			this.setState({ dayFrom, dayTo });
			setStudentChosenSession(student.id);
	}

  changeDate = (field, event) => {
      const {attendanceSingle, getCourseAttendanceSingle, personId, studentPersonId} = this.props;
      const {selectedCourses} = this.state;
      let newState = Object.assign({}, this.state);
		  let origDayTo = newState.dayTo;
		  let origDayFrom = newState.dayFrom;
      newState[field] = event.target.value;
      let dayTo = field === 'dayTo' ? newState[field] : newState.dayTo;
      let dayFrom = field === 'dayFrom' ? newState[field] : newState.dayFrom;
      newState.attendanceLocal = attendanceSingle && attendanceSingle.length > 0 && attendanceSingle.filter(m => {
          if (selectedCourses && selectedCourses.length > 0) {
              return selectedCourses.indexOf(m.courseScheduledId) > -1 && formatYYYY_MM_DD(m.day) >= dayFrom && formatYYYY_MM_DD(m.day) <= dayTo;
          } else {
              return formatYYYY_MM_DD(m.day) >= dayFrom && formatYYYY_MM_DD(m.day) <= dayTo;
          }
      })
		  newState.dayTo = newState.dayTo === '1-01-01' ? newState.dayFrom : newState.dayTo;
		  newState.dayFrom = newState.dayFrom === '1-01-01' ? newState.dayTo : newState.dayFrom;
      this.setState(newState);
      if (origDayTo === '1-01-01' || origDayFrom === '1-01-01' || (field === 'dayTo' && dayTo > origDayTo) || (field === 'dayFrom' && dayFrom < origDayFrom)) {
          getCourseAttendanceSingle(personId, studentPersonId, newState.dayFrom, newState.dayTo);
      }
  }

  initDates = () => {
	    const {attendanceSingle} = this.props;
			let today = moment().format('YYYY-MM-DD');
	    let dayFrom = '';
	    let dayTo = '';
	    attendanceSingle && attendanceSingle.length > 0 && attendanceSingle.forEach(m => {
	        if (!dayFrom || moment(dayFrom).isAfter(m.day)) dayFrom = formatYYYY_MM_DD(m.day);
	        if (!dayTo || moment(dayTo).isBefore(m.day)) dayTo = formatYYYY_MM_DD(m.day);
	    })
			dayFrom = dayFrom === '1-01-01' || !dayFrom ? today : dayFrom;
			dayTo = dayTo === '1-01-01' || !dayTo ? today : dayTo;

	    this.setState({ dayFrom, dayTo });
  }

  resetAttendance = () => {
      const {attendanceSingle} = this.props;
			const {selectedCourses, attendanceTypes} = this.state;
      let attendanceLocal = attendanceSingle;

      if (attendanceSingle && attendanceSingle.length > 0) {
          if (selectedCourses && selectedCourses.length > 0) {
              attendanceLocal = attendanceLocal.filter(m => selectedCourses.indexOf(m.courseScheduledId) > -1);
          }
          if (attendanceTypes && attendanceTypes.length > 0) {
              attendanceLocal = attendanceLocal.filter(m => {
                  if ((m.isTardy && attendanceTypes.indexOf('tardy') > -1)
													|| (m.isPresent && attendanceTypes.indexOf('present') > -1)
                          || (m.isAbsent && attendanceTypes.indexOf('absent') > -1)
                          || (m.isExcusedAbsence && attendanceTypes.indexOf('excusedAbsence') > -1)
                          || (m.isLeftEarly && attendanceTypes.indexOf('leftEarly') > -1)) {

                      return true;
                  } else {
                      return false;
                  }
              });
          }
      }
			return attendanceLocal
  }

  handleSelectedCourses = (selectedCourses) => {
      const {attendanceSingle} = this.props;
      let newState = Object.assign({}, this.state);
      newState.selectedCourses = selectedCourses;
      newState.attendanceLocal = attendanceSingle && attendanceSingle.length > 0 && attendanceSingle.filter(m => {
          if (selectedCourses && selectedCourses.length > 0) {
              return selectedCourses.indexOf(m.courseScheduledId) > -1 && formatYYYY_MM_DD(m.day) >= newState.dayFrom && formatYYYY_MM_DD(m.day) <= newState.dayTo;
          } else {
              return formatYYYY_MM_DD(m.day) >= newState.dayFrom && formatYYYY_MM_DD(m.day) <= newState.dayTo;
          }
      })
      this.setState(newState);
  }

  toggleCheckbox = (field) => {
	    let newState = Object.assign({}, this.state);
	    newState[field] = !newState[field];
	    if (newState.attendanceTypes && newState.attendanceTypes.indexOf(field) > -1) {
	        newState.attendanceTypes = newState.attendanceTypes.filter(m => m !== field);
	    } else {
	        newState.attendanceTypes = newState.attendanceTypes ? newState.attendanceTypes.concat(field) : [field];
	    }
	    this.setState(newState);
  }

  coursesValueRenderer = (selected, options) => {
      return <L p={p} t={`Courses:  ${selected.length} of ${options.length}`}/>;
  }

	handleDocumentOpen = (fileUpload) => this.setState({ isShowingModal_document: true, fileUpload })
	handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {} })

	handleInstructionsOpen = (note) => this.setState({isShowingModal_instructions: true, note })
	handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, note: '' })

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, students, accessRoles, companyConfig={}, studentName, fetchingRecord} = this.props;
    const {dayFrom, dayTo, errorDueDateFrom, errorDueDateTo, selectedCourses, present, tardy, absent, excusedAbsence,
            leftEarly, student, uniqueCourses, isShowingModal_document, isShowingModal_instructions, note, fileUpload} = this.state;

		let attendanceLocal = this.resetAttendance()

    let headings = [
				{label: <L p={p} t={`Present`}/>, tightText: true},
        {label: <L p={p} t={`Tardy`}/>, tightText: true},
        {label: <L p={p} t={`Absent`}/>, tightText: true},
        {label: <L p={p} t={`Excused`}/>, tightText: true},
        {label: <L p={p} t={`Left Early`}/>, tightText: true},
        {label: <L p={p} t={`Course`}/>, tightText: true},
        {label: <L p={p} t={`Day`}/>, tightText: true}
    ];
    let data = [];
		let prevDate = '';

		if (attendanceLocal && attendanceLocal.length === 1 && !attendanceLocal[0].courseName) {
			data = [[{value: ''}, {value: <i>No attendance records found.</i>, colSpan: true }]]
		} else if (attendanceLocal && attendanceLocal.length > 0) {
				let loop = 0;
        attendanceLocal.forEach(m => {
						if (loop > 0 && prevDate !== m.day) {
								data.push([{value: <hr/>, colSpan: 10}])
						}
						data.push([
							{id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isPresent} onClick={() => this.saveAttendance('PRESENT', m.studentPersonId, m.courseScheduledId, m.day, m.isPresent)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
              {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isTardy} onClick={() => this.saveAttendance('TARDY', m.studentPersonId, m.courseScheduledId, m.day, m.isTardy)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
              {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isAbsent} onClick={() => this.saveAttendance('ABSENT', m.studentPersonId, m.courseScheduledId, m.day, m.isAbsent)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
							{value: <div className={styles.row}>
													<Checkbox id={m.studentPersonId} checked={m.isExcusedAbsence} onClick={() => this.saveAttendance('EXCUSEDABSENCE', m.studentPersonId, m.courseScheduledId, m.day, m.isExcusedAbsence)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />
													{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
															<a key={i} onClick={() => this.handleDocumentOpen(f)}>
																	<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
															</a>)
													}
													{m && m.note &&
															<div onClick={() => this.handleInstructionsOpen(m.note)}>
																	<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
															</div>
													}
											 </div>
							},
              {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isExcusedAbsence} onClick={() => this.saveAttendance('EXCUSEDABSENCE', m.studentPersonId, m.courseScheduledId, m.day, m.isExcusedAbsence)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
              {id: m.classPeriodId, value: <Checkbox id={m.studentPersonId} checked={m.isLeftEarly} onClick={() => this.saveAttendance('LEFTEARLY', m.studentPersonId, m.courseScheduledId, m.day, m.isLeftEarly)} readOnly={!(accessRoles.admin || (accessRoles.facilitator && m.facilitatorPersonIds && m.facilitatorPersonIds.length > 0 && m.facilitatorPersonIds.indexOf(personId) > -1))} />},
              {id: m.classPeriodId, value: <div className={styles.row}><div className={styles.moreRight}>{m.courseName}</div>(<TimeDisplay time={m.startTime} />)</div> },
              {id: m.classPeriodId, value: moment(m.day).format('D MMM YYYY - dddd')},
            ]);
						prevDate = m.day;
						loop++;
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                Student Attendance
            </div>
						<div className={classes(globalStyles.subHeader, styles.bold)}>
                {studentName}
            </div>
            <div className={styles.listPosition}>
								<InputDataList
										label={studentName ? <L p={p} t={`Choose another student`}/> : <L p={p} t={`Choose a student`}/>}
										name={'student'}
										options={students || [{id: '', value: ''}]}
										value={student}
										height={`medium`}
										className={styles.moreTop}
										onChange={this.changeStudent}/>
            </div>
            <div className={styles.dateRow}>
                <div className={styles.dateColumn}>
                    <span className={styles.label}><L p={p} t={`From date`}/></span>
                    <DateTimePicker id={`dayFrom`} value={dayFrom}
                        maxDate={dayTo ? dayTo : ''}
                        onChange={(event) => this.changeDate('dayFrom', event)}/>
                    <span className={styles.error}>{errorDueDateFrom}</span>
                </div>
                <div className={classes(styles.dateColumn, styles.moreLeft)}>
                    <span className={styles.label}><L p={p} t={`To date`}/></span>
                    <DateTimePicker id={`dayTo`} value={dayTo}
                        minDate={dayFrom ? dayFrom : ''}
                        onChange={(event) => this.changeDate('dayTo', event)}/>
                    <span className={styles.error}>{errorDueDateTo}</span>
                </div>
            </div>
            <span className={classes(styles.label, styles.littleLeft)}><L p={p} t={`Attendance Type Search`}/></span>
            <div className={classes(styles.row, styles.checkboxRow)}>
								<Checkbox
										id={`present`}
										label={<L p={p} t={`Present`}/>}
										checked={present}
										onClick={() => this.toggleCheckbox('present')}
										labelClass={styles.labelCheckbox}
										className={styles.checkbox} />
                <Checkbox
                    id={`tardy`}
                    label={<L p={p} t={`Tardy`}/>}
                    checked={tardy}
                    onClick={() => this.toggleCheckbox('tardy')}
                    labelClass={styles.labelCheckbox}
                    className={styles.checkbox} />
                <Checkbox
                    id={`absent`}
                    label={<L p={p} t={`Absent`}/>}
                    checked={absent}
                    onClick={(event) => this.toggleCheckbox('absent')}
                    labelClass={styles.labelCheckbox}
                    className={styles.checkbox} />
                <Checkbox
                    id={`excusedAbsence`}
                    label={<L p={p} t={`Excused`}/>}
                    checked={excusedAbsence}
                    onClick={(event) => this.toggleCheckbox('excusedAbsence')}
                    labelClass={styles.labelCheckbox}
                    className={styles.checkbox} />
                <Checkbox
                    id={`leftEarly`}
                    label={<L p={p} t={`Left Early`}/>}
                    checked={leftEarly}
                    onClick={(event) => this.toggleCheckbox('leftEarly')}
                    labelClass={styles.labelCheckbox}
                    className={styles.checkbox} />
            </div>
            {accessRoles.admin &&
								<div className={styles.multiSelect}>
		                <MultiSelect
		                    name={<L p={p} t={`Courses`}/>}
		                    options={uniqueCourses || []}
		                    onSelectedChanged={this.handleSelectedCourses}
		                    valueRenderer={this.coursesValueRenderer}
		                    getJustCollapsed={() => {}}
		                    selected={selectedCourses}/>
		            </div>
						}
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
								isFetchingRecord={fetchingRecord.courseAttendanceSingle}/>
            <hr />
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Attendance Single`}/>} path={'courseAttendanceSingle'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal_document &&
								<div className={styles.fullWidth}>
										{<DocumentViewOnlyModal handleClose={this.handleDocumentClose} showTitle={true} handleSubmit={this.handleDocumentClose}
												companyConfig={companyConfig} accessRoles={accessRoles} fileUpload={fileUpload}  />}
								</div>
						}
						{isShowingModal_instructions &&
								<MessageModal handleClose={this.handleInstructionsClose} heading={<L p={p} t={`Excused Absence Note`}/>}
									 explain={note} onClick={this.handleInstructionsClose} />
						}
      </div>
    );
  }
}

export default CourseAttendanceSingleView;
