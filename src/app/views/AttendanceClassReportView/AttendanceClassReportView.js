import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './AttendanceClassReportView.css';
const p = 'AttendanceClassReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import EditTable from '../../components/EditTable';
import Icon from '../../components/Icon';
import DateMoment from '../../components/DateMoment';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';

class AttendanceClassReportView extends Component {
    constructor(props) {
        super(props);

        this.state = {
						origAttendance: {},
            attendance: {},
						showSearchControls: false,
            courseScheduledId: '',
						studentPersonId: props.studentChosenSession || '',
        }
    }

		componentDidMount() {
				const {attendance, courseScheduledId} = this.props;
				this.setState({ attendance, courseScheduledId });
				//document.getElementById('courseScheduledId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
		}

		componentDidUpdate() {
				const {students, studentPersonId} = this.props;
				if ((!this.state.studentPersonId || this.state.studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
						let student = students.filter(m => m.id === studentPersonId)[0]
						this.setState({ student, studentPersonId });
				}
		}

    recallPage = (event, singleAssignmentId='') => {
				const {getAttendanceClassReport, personId} = this.props;
        const {courseScheduledId, jumpToDay} = this.props;
				let id = event && event.target && event.target.value ? event.target.value : courseScheduledId;
				browserHistory.push('/attendanceClassReport/' + id);
        getAttendanceClassReport(personId, id, jumpToDay);
        this.setState({ courseScheduledId: id });
    }

		recallPageWithJump = (event) => {
				const {personId, updatePersonConfigAttendance} = this.props;
        const {courseScheduledId} = this.state;
				updatePersonConfigAttendance(personId, courseScheduledId, event.target.value === '0' ? '' : event.target.value)
        this.setState({ jumpToDay: event.target.value });
    }

		toggleSearch = () => {
				this.setState({ showSearchControls: !this.state.showSearchControls })
		}

		changeFilters = ({target}) => {
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value;
				this.setState(newState);
		}

		getTotal = (attendanceType, studentAttendance) => {
				let total = 0;
				studentAttendance && studentAttendance.length > 0 && studentAttendance.forEach(m => {
						if (attendanceType === 'TARDY' && m.isTardy) total++;
						if (attendanceType === 'ABSENT' && m.isAbsent) total++;
						if (attendanceType === 'EXCUSEDABSENCE' && m.isExcusedAbsence) total++;
						if (attendanceType === 'LEFTEARLY' && m.isLeftEarly) total++;
				})
				return total;
		}

    render() {
      const {courses, fetchingRecord} = this.props;
			const fullDayList = this.props.attendance && this.props.attendance.fullDayList;
      const {courseScheduledId, jumpToDay, studentPersonId} = this.state;
			let attendanceLocal = [...this.state.origAttendance];

			if (attendanceLocal && attendanceLocal.studentScores && attendanceLocal.studentScores.length > 0 && studentPersonId) {
					attendanceLocal.studentScores = attendanceLocal.studentScores.filter(m => m.studentPersonId === studentPersonId);
			}

	 		let headings = [{label: ''}];
			let data = [];
			let foundJumpTo = !jumpToDay || jumpToDay === guidEmpty || jumpToDay === "0" ? true : false;
			let matchesFilter = false;

			attendanceLocal && attendanceLocal.studentAttendance && attendanceLocal.studentAttendance.length > 0 && attendanceLocal.studentAttendance.forEach(m => {
					if (!foundJumpTo && m.assignmentId === jumpToDay) foundJumpTo = true;

					if (foundJumpTo && matchesFilter) {
							headings.push({
									verticalText: true,
									label: <div className={styles.narrowLine}>
														<div className={styles.labelHead}>{m.title && m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title}</div>
														<div className={classes(styles.row, styles.labelSubhead)}>
																points:<div className={styles.lineSub}>{m.totalPoints}</div>
																{m.dueDate && <div className={classes(styles.labelSubhead, styles.moreLeft)}><L p={p} t={`due:`}/></div>}
																{m.dueDate && <div className={styles.lineSub}><DateMoment date={m.dueDate} format={'D MMM'}/></div>}
														</div>
												</div>,
							})
					}
			});

			attendanceLocal && attendanceLocal.studentScores && attendanceLocal.studentScores.length > 0 && attendanceLocal.studentScores.forEach(m => {
					let row = [{
						value: <div className={styles.rowSpace}>
											 <div className={styles.row}>
													 <Link to={'/studentProfile/' + m.studentPersonId}><Icon pathName={'info'} className={styles.icon}/></Link>
													 <Link to={'/studentSchedule/' + m.studentPersonId}><Icon pathName={'clock3'} premium={true} className={styles.icon}/></Link>
													 <Link to={'/studentSchedule/' + m.studentPersonId} className={styles.link}>{m.studentFirstName + ' ' + m.studentLastName}</Link>
											 </div>
									 </div>
					},
					{
							value: this.getTotal('TARDY', m)
					},
					{
							value: this.getTotal('ABSENT', m)
					},
					{
							value: this.getTotal('EXCUSEDABSENCE', m)
					},
					{
							value: this.getTotal('LEFTEARLY', m)
					}];

					foundJumpTo = !jumpToDay || jumpToDay === guidEmpty || jumpToDay === "0" ? true : false;
					m.scoreResponses && m.scoreResponses.length > 0 && m.scoreResponses.forEach(s => {
							if (!foundJumpTo && s.assignmentId === jumpToDay) foundJumpTo = true;

							if (foundJumpTo) {
									row.push({
											value: <div className={styles.row}>
														 </div>
									})
							}
					});
					data.push(row);
			});

      return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
              	<L p={p} t={`Attendance Report`}/>
            </div>
            <div className={styles.formLeft}>
								<div>
		                <SelectSingleDropDown
		                    id={`courseScheduledId`}
		                    name={`courseScheduledId`}
		                    label={<L p={p} t={`Course`}/>}
		                    value={courseScheduledId || ''}
		                    options={courses}
		                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
		                    height={`medium`}
		                    noBlank={false}
		                    onChange={this.recallPage} />
								</div>
								{fullDayList && fullDayList.length > 0 &&
										<div>
												<SelectSingleDropDown
				                    id={`jumpToDay`}
				                    label={<L p={p} t={`Jump to:`}/>}
				                    value={jumpToDay || ''}
				                    options={attendanceLocal && attendanceLocal.fullDayList}
				                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
				                    height={`medium`}
				                    onChange={this.recallPageWithJump} />
										</div>
								}
                <div className={styles.topMargin}>
										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}
												firstColumnClass={styles.firstColumnClass} isFetchingRecord={fetchingRecord.attendanceClassReport}/>
                    {fetchingRecord && !fetchingRecord.gradebook && (!data || data.length === 0)
												&& <div className={styles.noRecord}><L p={p} t={`No attendance records found for this course`}/></div>
										}
                </div>
            </div>
            <OneFJefFooter />
        </div>
    )};
}

export default AttendanceClassReportView;
