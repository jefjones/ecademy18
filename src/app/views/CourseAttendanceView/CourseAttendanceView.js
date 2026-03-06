import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './CourseAttendanceView.css';
const p = 'CourseAttendanceView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Checkbox from '../../components/Checkbox';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import MessageModal from '../../components/MessageModal';
import moment from 'moment';

export default class CourseAttendanceView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_noDate: false,
					isShowingModal_setAllPresent: false,
	    }
  }

	componentWillUnmount() {
			this.props.clearAttendanceDates();
	}

	componentDidUpdate() {
			const {courseDay} = this.props;
			const {isInit} = this.state;
			if (!isInit && courseDay) {
					this.setState({ courseDay, isInit: true });
			}
	}

	handleCourseAttendance = (type, studentPersonId, currentSetting) => {
			const {personId, setCourseAttendance, courseScheduledId} = this.props;
      const {studentList} = this.state;
			let courseDay =this.state.courseDay;
      courseDay = courseDay ? courseDay : this.props.courseDay;
			courseDay = moment(courseDay).format('YYYY-MM-DD');
			if (!courseDay || courseDay === 'Invalid date') {
					this.handleDateMissingOpen();
			} else {
					setCourseAttendance(personId, type, studentPersonId, courseScheduledId, courseDay, currentSetting, studentList)
			}
	}

	handleDateMissingOpen = () => this.setState({ isShowingModal_noDate: true })
	handleDateMissingClose = () => this.setState({ isShowingModal_noDate: false })

  handleDateChange = (event) => {
	    const {getSingleCourseAttendance, personId, courseScheduledId} = this.props;
			const {studentList} = this.state;
	    this.setState({ courseDay: event.target.value, attendance: []}); //Give it one value so that it will blank out the list.
			getSingleCourseAttendance(personId, courseScheduledId, event.target.value, studentList)
  }

	recallPage = (event) => {
			const {personId, getSingleCourseAttendance, courseAttendanceDatesInit, getStudentCoursesAssigns, courseScheduledId} = this.props;
			const {studentList, courseDay} = this.state;
			browserHistory.push('/courseAttendance/' + event.target.value)
			getSingleCourseAttendance(personId, event.target.value, courseDay, studentList);
			courseAttendanceDatesInit(personId, event.target.value);
      getStudentCoursesAssigns(personId, courseScheduledId);
	}

	handleUpdateInterval = (event) => {
			const {personId, updatePersonConfig, courseAttendanceDatesSetBlank, courseScheduledId} = this.props;
			updatePersonConfig(personId, 'IntervalId', event.target.value);
			browserHistory.push(`/courseAttendance/${courseScheduledId}`);
			courseAttendanceDatesSetBlank();
	}

	handleUpdateSchoolYear = ({target}) => {
			const {personId, updatePersonConfig, getCoursesScheduled, courseAttendanceDatesSetBlank, getStudents, courseScheduledId} = this.props;
			updatePersonConfig(personId, 'SchoolYearId', target.value, () => { getCoursesScheduled(personId, true); getStudents(personId); });
			browserHistory.push(`/courseAttendance/${courseScheduledId}`);
			courseAttendanceDatesSetBlank();
	}

	handleSetAllPresentOpen = () => this.setState({ isShowingModal_setAllPresent: true })
	handleSetAllPresentClose = () => this.setState({ isShowingModal_setAllPresent: false })
	handleSetAllPresent = () => {
			const {setAllPresentAttendance, personId, students, courseScheduledId} = this.props;
      const {courseDay} = this.state;
			this.handleSetAllPresentClose();
			let studentList = students && students.length > 0 && students.reduce((acc, m) => acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
			setAllPresentAttendance(personId, courseScheduledId, courseDay, studentList);
	}

	handleDocumentOpen = (fileUpload) => this.setState({ isShowingModal_document: true, fileUpload })
	handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {} })

	handleInstructionsOpen = (note) => this.setState({isShowingModal_instructions: true, note })
	handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, note: '' })

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, students, courseDates, coursesScheduled, attendance, courseScheduledId, intervals,
						personConfig, companyConfig={}, schoolYears, fetchingRecord, accessRoles} = this.props;
    const {isShowingModal_noDate, isShowingModal_setAllPresent, isShowingModal_document, isShowingModal_instructions, note,
			 			fileUpload, courseDay} = this.state;
    let localStudents = students;

		let headings = [
				{label: <L p={p} t={`Present`}/>, tightText: true},
				{label: <L p={p} t={`Tardy`}/>, tightText: true},
				{label: <L p={p} t={`Absent`}/>, tightText: true},
				{label: <L p={p} t={`Excused`}/>, tightText: true},
				{label: <L p={p} t={`Left Early`}/>, tightText: true},
				{label: <L p={p} t={`Student`}/>, tightText: true}
		];

		let data = [];

		if (localStudents && localStudents.length > 0) {
				data = localStudents.map(m => {
						let isPresent = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isPresent) acc = true; return acc}, false);
						let isTardy = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isTardy) acc = true; return acc}, false);
						let isAbsent = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isAbsent) acc = true; return acc}, false);
						let isExcusedAbsence = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isExcusedAbsence) acc = true; return acc}, false);
						let isLeftEarly = attendance && attendance.length > 0 && attendance.reduce((acc, t) => { if (t.personId === m.id && t.isLeftEarly) acc = true; return acc}, false);
						let excusedAbsence = {};
						if (isExcusedAbsence) {
								excusedAbsence = attendance && attendance.length > 0 && attendance.filter(t => t.personId === m.id && t.isExcusedAbsence)[0];
						}

						return ([
								{value: <Checkbox onClick={() => this.handleCourseAttendance('PRESENT', m.id, isPresent)} checked={isPresent}/>},
								{value: <Checkbox onClick={() => this.handleCourseAttendance('TARDY', m.id, isTardy)} checked={isTardy}/>},
								{value: <Checkbox onClick={() => this.handleCourseAttendance('ABSENT', m.id, isAbsent)} checked={isAbsent}/>},
								{value: <div className={styles.row}>
														<Checkbox onClick={() => this.handleCourseAttendance('EXCUSEDABSENCE', m.id, isExcusedAbsence)} checked={isExcusedAbsence}/>
														{excusedAbsence && excusedAbsence.fileUploads && excusedAbsence.fileUploads.length > 0 && excusedAbsence.fileUploads.map((f, i) =>
																<a key={i} onClick={() => this.handleDocumentOpen(f)}>
																		<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
																</a>)
														}
														{excusedAbsence && excusedAbsence.note &&
																<div onClick={() => this.handleInstructionsOpen(excusedAbsence.note)}>
																		<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
																</div>
														}
												 </div>
								},
								{value: <Checkbox onClick={() => this.handleCourseAttendance('LEFTEARLY', m.id, isLeftEarly)} checked={isLeftEarly}/>},
								{value: <div className={styles.row}>
														<Link to={'/courseAttendanceSingle/' + m.id} data-rh={`See the student's overall attendance`}>
																<Icon pathName={'calendar_31'} premium={true} className={styles.icon}/>
														</Link>
														<Link to={'/studentProfile/' + m.id} className={styles.link} data-rh={`See the student's profile`}>
																{m.firstName + ' ' + m.lastName}
														</Link>
												 </div>},
						])
				});
				let firstRow = [
						{value: <div className={styles.smallWidth}>
												<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={courseDay ? this.handleSetAllPresentOpen : this.handleDateMissingOpen} addClassName={styles.smallButton}/>
										</div>,
						 reactHint: 'Set all present?',
						},
				];
				data.unshift(firstRow);
		}

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Attendance`}/>
            </div>
						<div>
								<SelectSingleDropDown
										id={`schoolYearId`}
										label={<L p={p} t={`School year`}/>}
										value={personConfig.schoolYearId || companyConfig.schoolYearId}
										options={schoolYears}
										height={`medium`}
										onChange={this.handleUpdateSchoolYear}/>
						</div>
						<div>
								<SelectSingleDropDown
										id={`intervalId`}
										label={<L p={p} t={`Interval`}/>}
										value={personConfig.intervalId || companyConfig.intervalId}
										options={intervals}
										noBlank={true}
										height={`medium`}
										onChange={this.handleUpdateInterval}/>
						</div>
						<div>
								<SelectSingleDropDown
										id={`courseScheduledId`}
										name={`courseScheduledId`}
										label={<L p={p} t={`Course`}/>}
										value={courseScheduledId}
										options={coursesScheduled}
										className={styles.listManage}
										height={`medium`}
										onChange={this.recallPage} />
						</div>
						<div className={styles.row}>
                <Loading isLoading={courseScheduledId && !(courseDates && courseDates.length > 0)} loadingText={'Loading dates'} className={styles.moreTop}/>
		            {courseDates && courseDates.length > 0 &&
										<div>
				                <SelectSingleDropDown
				                    id={'courseDates'}
				                    value={courseDay}
				                    label={<L p={p} t={`Day`}/>}
				                    options={courseDates}
				                    height={`medium`}
				                    className={styles.singleDropDown}
				                    onChange={this.handleDateChange}/>
				            </div>
								}
						</div>
            <hr />
						<div className={globalStyles.instructionsBigger}><L p={p} t={`Attendance is saved every time you select a checkbox.`}/></div>
						<hr />
						{courseScheduledId &&
                <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
						        isFetchingRecord={fetchingRecord.courseAttendance}/>
            }
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Attendance`}/>} path={'courseAttendance'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal_noDate &&
                <MessageModal handleClose={this.handleDateMissingOpen} heading={<L p={p} t={`No Date Chosen`}/>}
                   explainJSX={<L p={p} t={`Please choose a date before making an attendance entry.`}/>}
                   onClick={this.handleDateMissingClose} />
            }
						{isShowingModal_setAllPresent &&
                <MessageModal handleClose={this.handleSetAllPresentOpen} heading={<L p={p} t={`Set All Present?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to set all present?  Of course, you can change settings individual for any students who are absent or tardy.`}/>} isConfirmType={true}
                   onClick={this.handleSetAllPresent} />
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
