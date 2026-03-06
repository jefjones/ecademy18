import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './AttendanceReportView.css';
const p = 'AttendanceReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateMoment from '../../components/DateMoment';
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal';
import MessageModal from '../../components/MessageModal';
import EditTable from '../../components/EditTable';
import Icon from '../../components/Icon';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import InputDataList from '../../components/InputDataList';
import classes from 'classnames';
import ReactToPrint from "react-to-print";
import {guidEmpty} from '../../utils/guidValidate.js';

class AttendanceReportView extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
	      }
    }

		componentDidMount() {
				//document.getElementById('studentPersonId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
		}

		componentDidUpdate(prevProps) {
				const {personConfig, companyConfig, students, studentPersonId} = this.props;
				const {intervalId} = this.state;
				if (intervalId !== (personConfig.intervalId || companyConfig.intervalId)) {
						this.setState({ intervalId: personConfig.intervalId || companyConfig.intervalId })
				}
				if ((!this.state.studentPersonId || this.state.studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
						let student = students.filter(m => m.id === studentPersonId)[0]
						this.setState({ student, studentPersonId });
				}
		}

		handleUpdateInterval = (event) => {
				const {personId, updatePersonConfig, getAttendanceReport} = this.props;
				const {student} = this.state;
				updatePersonConfig(personId, 'IntervalId', event.target.value);
				getAttendanceReport(personId, student.id, event.target.value);
		}

		changeStudent = (student) => {
				const {getAttendanceReport, personId, personConfig, setStudentChosenSession} = this.props;
				this.setState({ studentPersonId: student && student.id ? student.id : '', student: student && student.id ? student : {} });
				getAttendanceReport(personId, student.id, personConfig.intervalId);
				browserHistory.push('/attendanceReport/' + student.id + '/' + personConfig.intervalId);
				setStudentChosenSession(student.id);
		}

		handleChange = (courseScheduledId, attendanceDate, AttendanceTypeCode) => {
				const {personId, setCourseAttendance} = this.props;
				const {studentPersonId} = this.state;
				setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, attendanceDate, !AttendanceTypeCode);
		}

		handlePrintOpen = () => this.setState({ printOpen: true });
		handlePrintClose = () => this.setState({ printOpen: false });

		handleDocumentOpen = (fileUpload) => this.setState({ isShowingModal_document: true, fileUpload })
		handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {} })

		handleInstructionsOpen = (note) => this.setState({isShowingModal_instructions: true, note })
		handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, note: '' })

    render() {
      const {personId, myFrequentPlaces, setMyFrequentPlace, attendanceReport, students, fetchingRecord, intervals, companyConfig={}, setEditMode,
							accessRoles} = this.props;
      const {intervalId, student, studentPersonId, printOpen, isShowingModal_document, isShowingModal_instructions, note, fileUpload} = this.state;

			let headings = [{label: <L p={p} t={`Date`}/>, tightText: true}];

			let localAttendance = attendanceReport || {};
			localAttendance.studentSchedule = (localAttendance.studentSchedule && localAttendance.studentSchedule.length > 0
					&& localAttendance.studentSchedule.filter(m => m.intervalId === intervalId)) || [];

			localAttendance.studentSchedule && localAttendance.studentSchedule.length > 0 && localAttendance.studentSchedule.map(m =>
					headings.push({id: m.id, label: m.label && m.label.length > 20 ? m.label.substring(0,20) + '...' : m.label, tightText: true})
			);

			let data = [];
			let row = [];

			localAttendance.attendanceDates && localAttendance.attendanceDates.length > 0 && localAttendance.attendanceDates.forEach(d => {
					row = [{value: <DateMoment date={d} format={'ddd - D MMM'}/>}];

					localAttendance.studentSchedule && localAttendance.studentSchedule.length > 0 && localAttendance.studentSchedule.forEach(s => {
							let foundAttendance = false;
							localAttendance.courseAttendance && localAttendance.courseAttendance.length > 0 && localAttendance.courseAttendance.forEach(a => {
									if (a.attendanceDate === d && a.courseScheduledId === s.id) {
											foundAttendance = true;
											row.push({value: <div className={styles.row}>
																			{a.isPresent
																					? a.isEditMode && !printOpen
																							? <button type={'button'} className={classes(styles.button, styles.buttonPresent)} onClick={() => this.handleChange(a.courseScheduledId, a.attendanceDate, "TARDY")}>P</button>
																							: <div className={styles.present} onDoubleClick={() => setEditMode(studentPersonId, a.courseScheduledId, a.attendanceDate)}>P</div>
																					: ''}
																			{a.isTardy
																					? a.isEditMode && !printOpen
																							? <button type={'button'} className={classes(styles.button, styles.buttonTardyOrLeftEarly)} onClick={() => this.handleChange(a.courseScheduledId, a.attendanceDate, "ABSENT")}>T</button>
																							: <div className={styles.tardy} onDoubleClick={() => setEditMode(studentPersonId, a.courseScheduledId, a.attendanceDate)}>T</div>
																					: ''}
																			{a.isAbsent
																					? a.isEditMode && !printOpen
																							? <button type={'button'} className={classes(styles.button, styles.buttonAbsent)} onClick={() => this.handleChange(a.courseScheduledId, a.attendanceDate, "EXCUSEDABSENCE")}>A</button>
																							: <div className={styles.absent} onDoubleClick={() => setEditMode(studentPersonId, a.courseScheduledId, a.attendanceDate)}>Ab</div>
																					:''}
																			{a.isExcusedAbsence
																					? <div className={styles.row}>
																								{a.isEditMode && !printOpen
																										? <button type={'button'} className={classes(styles.button, styles.buttonExcusedAbsence)} onClick={() => this.handleChange(a.courseScheduledId, a.attendanceDate, "LEFTEARLY")}>E</button>
																										: <div className={styles.excusedAbsence} onDoubleClick={() => setEditMode(studentPersonId, a.courseScheduledId, a.attendanceDate)}>ExAb</div>
																								}
																								{a.fileUploads && a.fileUploads.length > 0 && a.fileUploads.map((f, i) =>
																										<a key={i} onClick={() => this.handleDocumentOpen(f)}>
																												<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
																										</a>)
																								}
																								{a && a.note &&
																										<div onClick={() => this.handleInstructionsOpen(a.note)}>
																												<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
																										</div>
																								}
																						 </div>
																					: ''}
																			{a.isLeftEarly
																					? a.isEditMode && !printOpen
																							? <button type={'button'} className={classes(styles.button, styles.buttonTardyOrLeftEarly)} onClick={() => this.handleChange(a.courseScheduledId, a.attendanceDate, "")}>L</button>
																							: <div className={styles.leftEarly} onDoubleClick={() => setEditMode(studentPersonId, a.courseScheduledId, a.attendanceDate)}>L</div>
																					: ''}
																	 </div>,
																 clickFunction: !a.isPresent && !a.isTardy && !a.isAbsent && !a.isExcusedAbsence && !a.isLeftEarly
																 			? () => {
																					 	setEditMode(studentPersonId, a.courseScheduledId, a.attendanceDate);
																						this.handleChange(a.courseScheduledId, a.attendanceDate, "PRESENT");
																				}
																			: () => {}
																})
									}
							});
							if (!foundAttendance) row.push({value: <div>&nbsp;</div>});
					});
					data.push(row);
			});

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
										<L p={p} t={`Student Attendance Report`}/>
								</div>
								<div className={styles.row}>
										<div>
												<SelectSingleDropDown
														id={`intervalId`}
														label={<L p={p} t={`Interval`}/>}
														value={intervalId}
														options={intervals}
														noBlank={true}
														height={`medium`}
														onChange={this.handleUpdateInterval}/>
										</div>
										<div className={styles.topPosition}>
												<InputDataList
														name={`studentPersonId`}
														label={<L p={p} t={`Student`}/>}
														value={student}
														options={students}
														height={`medium`}
														className={styles.moreBottomMargin}
														onChange={this.changeStudent}/>
										</div>
										<div onMouseOver={this.handlePrintOpen} onMouseOut={this.handlePrintClose} className={styles.moveUpLittle}>
												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => this.componentRef}/>
										</div>
								</div>
								<hr/>
								{localAttendance && localAttendance.studentPersonId &&
										<div ref={el => (this.componentRef = el)} className={classes(styles.centered, styles.componentPrint, styles.maxWidth)}>
												{companyConfig.logoFileUrl &&
														<img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
												}
				                <div className={styles.header}>
				                  	{`Student Attendance Report ${localAttendance && localAttendance.schoolYearName ? localAttendance.schoolYearName : ''}`}
				                </div>
												<div className={classes(styles.row, styles.header, styles.center)}>
				                  	<div>Name: <strong>{localAttendance.studentFullName}</strong>  <div className={styles.moreLeft}>Grade Level: <strong>{localAttendance.gradeLevelName}</strong></div></div>
				                </div>
												{!printOpen &&
														<div className={globalStyles.instructions}>
																<L p={p} t={`Double click any cell in order to change the attendance setting.  A blank cell will change to 'Present'`}/>
														</div>
												}
												<div className={classes(styles.centered)}>
														<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} isFetchingRecord={fetchingRecord.attendanceReport}/>
												</div>
										</div>
								}
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Attendance Report`}/>} path={'attendanceReport/0/0'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
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
    )};
}

export default AttendanceReportView;
