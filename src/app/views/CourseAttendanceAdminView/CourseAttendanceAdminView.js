import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './CourseAttendanceAdminView.css';
const p = 'CourseAttendanceAdminView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import {formatDayShortMonthYear} from '../../utils/Dateformat.js';
import EditTable from '../../components/EditTable';
import DateTimePicker from '../../components/DateTimePicker';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import InputDataList from '../../components/InputDataList';
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal';
import {formatYYYY_MM_DD} from '../../utils/dateFormatYYYY_MM_DD.js';
import classes from 'classnames';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import debounce from 'lodash/debounce';
import {guidEmpty} from '../../utils/guidValidate.js';

export default class CourseAttendanceAdminView extends Component {
  constructor(props) {
    super(props);

		let today = formatYYYY_MM_DD(new Date());

    this.state = {
			isShowingModal: false,
			isShowingModal_setColumn: false,
      dayFrom: today,
      dayTo: today,
      selectedCourses: [],
			studentPersonId: props.studentChosenSession || '',
			includeSiblings: false,
    }
  }

	componentDidUpdate() {
			const {studentPersonId, students} = this.props;
			if ((!this.state.studentPersonId || this.state.studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
					let student = students.filter(m => m.id === studentPersonId)[0]
					this.setState({ student, studentPersonId });
			}
	}

	componentWillUnmount() {
			this.props.clearCourseAttendanceAdmin();
	}

  saveAttendance = (attendanceType, studentPersonId, courseScheduledId, day, isDelete) => {
      const {personId, setCourseAttendance} = this.props;
      setCourseAttendance(personId, attendanceType, studentPersonId, courseScheduledId, day, isDelete, null)
  }

  changeDate = (field, event) => {
      let newState = Object.assign({}, this.state);
      newState[field] = event.target.value;
      this.setState(newState);
			this.getAttendance(newState);
  }

  initDates = () => {
	    const {attendanceAdmin} = this.props;
	    let dayFrom = '';
	    let dayTo = '';
	    attendanceAdmin && attendanceAdmin.length > 0 && attendanceAdmin.forEach(m => {
	        if (!dayFrom || dayFrom > m.day) dayFrom = m.day;
	        if (!dayTo || dayTo < m.day) dayTo = m.day;
	    })
	    this.setState({ dayFrom: formatYYYY_MM_DD(dayFrom), dayTo: formatYYYY_MM_DD(dayTo) });
  }

  componentDidMount() {
			//document.getElementById('studentPersonId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
  }

  handleSelectedCourses = (selectedCourses) => {
      this.setState({ selectedCourses });
  }

  toggleCheckbox = (field) => {
	    let newState = Object.assign({}, this.state);
	    newState[field] = !newState[field];
	    if (newState.attendanceTypes && newState.attendanceTypes.indexOf(field) > -1) {
	        newState.attendanceTypes.splice(newState.attendanceTypes.indexOf(field), 1);
	    } else {
	        newState.attendanceTypes = newState.attendanceTypes ? newState.attendanceTypes.concat(field) : [field];
	    }
	    this.setState(newState);
  }

  coursesValueRenderer = (selected, options) => {
      return <L p={p} t={`Courses:  ${selected.length} of ${options.length}`}/>;
  }

	handleMissingDataOpen = (message) => this.setState({isShowingModal: true, message })
	handleMissingDataClose = () => this.setState({isShowingModal: false, message: '' })
	handleSetColumnOpen = () => this.setState({isShowingModal_setColumn: true })
	handleSetColumnClose = () => this.setState({isShowingModal_setColumn: false })

	processForm = () => {
			const {dayFrom, dayTo} = this.state;
			let hasError = false;

			if (!dayFrom && !dayTo) {
					hasError = true;
					this.handleMissingDataOpen(<L p={p} t={`The date 'from' and/or 'to' is required.`}/>);
			}

			if (!hasError) {
				  this.getAttendance();
			}
	}

	getAttendance = debounce((newState) => {
			const {getCourseAttendanceAdmin, personId} = this.props;
			const {dayFrom, dayTo, selectedCourses, studentPersonId, includeSiblings} = newState ? newState : this.state;
			getCourseAttendanceAdmin(personId, {dayFrom, dayTo, selectedCourses, studentPersonId, includeSiblings});
	}, 1000);

	changeStudent = (student) => {
			const {setStudentChosenSession} = this.props;
			let newState = Object.assign({}, this.state);
			newState.studentPersonId = student.id;
			newState.student = student;
			this.setState(newState);
			this.getAttendance(newState)
			setStudentChosenSession(student.id);
	}

	toggleIncludeSiblings = () => {
			let newState = Object.assign({}, this.state);
			newState.includeSiblings = !this.state.includeSiblings;
			this.setState(newState);
			this.getAttendance(newState)
	}

	toggleAllSet = (attendanceType, event) => {
			const {personId, setMassCourseAttendanceAdmin, attendanceAdmin} = this.props;
			let newState = Object.assign({}, this.state);
			newState[attendanceType] = true;
			if (attendanceType !== 'setAllPresent') newState['setAllPresent'] = false;
			if (attendanceType !== 'setAllTardy') newState['setAllTardy'] = false;
			if (attendanceType !== 'setAllAbsent') newState['setAllAbsent'] = false;
			if (attendanceType !== 'setAllExcusedAbsence') newState['setAllExcusedAbsence'] = false;
			if (attendanceType !== 'setAllLeftEarly') newState['setAllLeftEarly'] = false;
			this.setState(newState)
			this.handleSetColumnOpen();
			//1. Take off the checkbox for all other attendanceType-s
			//2. Set the checkbox according to the chosen checkbox setting.

			for(let i = 0; i < attendanceAdmin.length; i++) {
					document.getElementById('PRESENT' + i).checked = false;
					document.getElementById('TARDY' + i).checked = false;
					document.getElementById('ABSENT' + i).checked = false;
					document.getElementById('EXCUSEDABSENCE' + i).checked = false;
					document.getElementById('LEFTEARLY' + i).checked = false;
			}
			let attendanceTypeCode = attendanceType.substring(6).toUpperCase(); //setAll is 6 characters long.
			setMassCourseAttendanceAdmin(personId, attendanceTypeCode, false, attendanceAdmin, () => this.getAttendance(newState));
	}

	handleUpdateInterval = (event) => {
			const {personId, updatePersonConfig} = this.props;
			updatePersonConfig(personId, 'IntervalId', event.target.value, () => this.getAttendance());
	}

	setColumnCheckbox = (attendanceType) => {
			const {attendanceAdmin} = this.props;
			let isSet = true;
			attendanceAdmin && attendanceAdmin.length > 0 && attendanceAdmin.forEach(m => {
					if ((attendanceType === 'PRESENT' && !m.isPresent)
							|| (attendanceType === 'TARDY' && !m.isTardy)
							|| (attendanceType === 'ABSENT' && !m.isAbsent)
							|| (attendanceType === 'EXCUSED' && !m.isExcusedAbsence)
							|| (attendanceType === 'LEFTEARLY' && !m.isLeftEarly)
				) isSet = false;
			});
			return isSet
	}

	handleUpdateSchoolYear = ({target}) => {
			const {personId, updatePersonConfig, getCoursesScheduled, getStudents} = this.props;
			this.setState({ courseScheduledschoolYearId: target.value });
			updatePersonConfig(personId, 'SchoolYearId', target.value, () => { getCoursesScheduled(personId, true); getStudents(personId); });
	}

	handleDocumentOpen = (fileUpload) => this.setState({ isShowingModal_document: true, fileUpload })
	handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {} })

	handleInstructionsOpen = (note) => this.setState({isShowingModal_instructions: true, note })
	handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, note: '' })

  render() {
    const {personId, attendanceAdmin, students, fetchingRecord, companyConfig={}, personConfig, schoolYears, myFrequentPlaces, setMyFrequentPlace,
						accessRoles} = this.props;
    const {dayFrom, dayTo, errorDueDateFrom, errorDueDateTo, isShowingModal, message, student, includeSiblings, isShowingModal_document,
						 isShowingModal_setColumn, schoolYearId, fileUpload, isShowingModal_instructions, note} = this.state;

    let headings = [
				{label: <L p={p} t={`Present`}/>, tightText: true},
        {label: <L p={p} t={`Tardy`}/>, tightText: true},
        {label: <L p={p} t={`Absent`}/>, tightText: true},
        {label: <L p={p} t={`Excused`}/>, tightText: true},
        {label: <L p={p} t={`Left Early`}/>, tightText: true},
        {label: <L p={p} t={`Student`}/>, tightText: true},
        {label: <L p={p} t={`Course`}/>, tightText: true},
        {label: <L p={p} t={`Day`}/>, tightText: true}
    ];
    let data = [];
		let prevDate = '';

    if (attendanceAdmin && attendanceAdmin.length > 0) {
				let loop = 0;
        attendanceAdmin.forEach((m, i) => {
						if (loop > 0 && prevDate !== m.day) {
								data.push([{value: <hr/>, colSpan: 10}])
						}
            data.push([
								{value: <Checkbox id={'PRESENT' + i} checked={m.isPresent} onClick={() => this.saveAttendance('PRESENT', m.studentPersonId, m.courseScheduledId, m.day, m.isPresent)}/>},
	              {value: <Checkbox id={'TARDY' + i} checked={m.isTardy} onClick={() => this.saveAttendance('TARDY', m.studentPersonId, m.courseScheduledId, m.day, m.isTardy)}/>},
	              {value: <Checkbox id={'ABSENT' + i} checked={m.isAbsent} onClick={() => this.saveAttendance('ABSENT', m.studentPersonId, m.courseScheduledId, m.day, m.isAbsent)}/>},
	              {value: <div className={styles.row}>
														<Checkbox id={'EXCUSEDABSENCE' + i} checked={m.isExcusedAbsence} onClick={() => this.saveAttendance('EXCUSEDABSENCE', m.studentPersonId, m.courseScheduledId, m.day, m.isExcusedAbsence)}/>
														{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
																<a key={i} onClick={() => this.handleDocumentOpen(f)}>
																		<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
																</a>)
														}
														{m.note &&
																<div onClick={() => this.handleInstructionsOpen(m.note)}>
																		<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
																</div>
														}
												 </div>
								},
	              {value: <Checkbox id={'LEFTEARLY' + i} checked={m.isLeftEarly} onClick={() => this.saveAttendance('LEFTEARLY', m.studentPersonId, m.courseScheduledId, m.day, m.isLeftEarly)}/>},
	              {value: <Link to={'/courseAttendanceSingle/' + m.studentPersonId} className={styles.link}>{m.learnerName}</Link>},
	              {value: m.courseName},
	              {value: formatDayShortMonthYear(m.day, true)},
            ])
						prevDate = m.day;
						loop++;
        });
				let firstRow = [
						{id: 'PRESENT', value: <ButtonWithIcon label={''} icon={'checkmark_circle'} replaceClassName={styles.smallButton} onClick={() => this.toggleAllSet('setAllPresent')} dataRh={'Set all present'}/>},
						{id: 'TARDY', value: ''},
            {id: 'ABSENT', value: <ButtonWithIcon label={''} icon={'checkmark_circle'} replaceClassName={styles.smallButton} onClick={() => this.toggleAllSet('setAllAbsent')} data-rh={'Set all absent'}/>},
            {id: 'EXCUSED', value: <ButtonWithIcon label={''} icon={'checkmark_circle'} replaceClassName={styles.smallButton} onClick={() => this.toggleAllSet('setAllExcusedAbsence')} data-rh={'Set all excused absence'}/>},
            {id: 'LEFTEARLY', value: ''},
				];

				data && data.unshift(firstRow);

    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Attendance (Admin)`}/>
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
						<div className={styles.row}>
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
										<InputDataList
												label={<L p={p} t={`Student`}/>}
												name={'student'}
												options={students || [{id: '', value: ''}]}
												value={student}
												height={`medium`}
												className={styles.moreTop}
												onChange={this.changeStudent}/>
								</div>
						</div>
						<div className={styles.moreTop}>
								<Checkbox
										id={`includeSiblings`}
										label={<L p={p} t={`Include siblings`}/>}
										position={'after'}
										checked={includeSiblings || ''}
										onClick={this.toggleIncludeSiblings}
										labelClass={styles.labelClass}
										checkboxClass={styles.checkboxClass}/>
						</div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
								isFetchingRecord={fetchingRecord.courseAttendanceAdmin}/>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Attendance (Admin)`}/>} path={'courseAttendanceAdmin'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal &&
								<MessageModal handleClose={this.handleMissingDataClose} heading={<L p={p} t={`Missing Information`}/>}
									 explainJSX={message}
									 onClick={this.handleMissingDataClose} />
						}
						{isShowingModal_setColumn &&
								<MessageModal handleClose={this.handleSetColumnClose} heading={<L p={p} t={`Setting the Entire Column`}/>}
									 explainJSX={<L p={p} t={`The entire column is being set according to your selection.`}/>}
									 onClick={this.handleSetColumnClose} />
						}
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
