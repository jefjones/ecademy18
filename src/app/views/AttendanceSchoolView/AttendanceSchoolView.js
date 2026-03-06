import React, {Component} from 'react';
import {Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './AttendanceSchoolView.css';
import EditTable from '../../components/EditTable';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateTimePicker from '../../components/DateTimePicker';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class AttendanceSchoolView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					showSearchControls: true,
					studentPersonId: '',
					fromDate: '',
					toDate: '',
	    }
  }

	handleChange = ({target}) => {
			let newState = Object.assign({}, this.state);
			newState[target.name] = target.value;
			this.setState(newState);
	}

	toggleSearch = () => {
			if (this.state.showSearchControls) this.clearFilters();
			this.setState({ showSearchControls: !this.state.showSearchControls })
	}

	clearFilters = () => {
			this.setState({ studentPersonId: '', fromDate: '', toDate: ''})
	}

	changeDate = (field, event) => {
			const newState = Object.assign({}, this.state);
			newState[field] = event.target.value;
			this.setState(newState);
	}

  render() {
	    const {attendanceSchool, studentList, companyConfig, fetchingRecord} = this.props;
			const {studentPersonId, fromDate, toDate, showSearchControls} = this.state;
			let localAttendance = attendanceSchool;

			let headings = [{},
					{label: <L p={p} t={`Student`}/>, tightText: true},
					{label: <L p={p} t={`Interval`}/>, tightText: true},
					{label: <div><L p={p} t={`Absence`}/><br/><L p={p} t={`Unexcused`}/></div>, tightText: true},
					{label: <div><L p={p} t={`Absence`}/><br/><L p={p} t={`Excused`}/></div>, tightText: true},
					{label: <div><L p={p} t={`Tardy`}/><br/><L p={p} t={`Unexcused`}/></div>, tightText: true},
					{label: <div><L p={p} t={`Tardy`}/><br/><L p={p} t={`Excused`}/></div>, tightText: true},
					{label: <L p={p} t={`Hours`}/>, tightText: true},
					{label: <L p={p} t={`Or Cost`}/>, tightText: true},
			];
	    let data = [];

	    if (localAttendance && localAttendance.length > 0) {
					if (studentPersonId || fromDate || toDate) {
							if (studentPersonId && studentPersonId != 0) localAttendance = localAttendance.filter(m => m.studentPersonId === studentPersonId); //eslint-disable-line
							if (fromDate && Number(fromDate.replace(/-/g,'')) > 20160101) {
									localAttendance = localAttendance.filter(m => {
											let checkIn = m.checkIn
													? m.checkIn.indexOf('T')
															? m.checkIn.substring(0,m.checkIn.indexOf('T'))
															: m.checkIn
													: '';
											return checkIn >= fromDate;
	 								});
							}
							if (toDate && Number(toDate.replace(/-/g,'')) > 20160101) {
									localAttendance = localAttendance.filter(m => {
											let checkOut = m.checkOut
													? m.checkOut.indexOf('T')
															? m.checkOut.substring(0,m.checkOut.indexOf('T'))
															: m.checkOut
													: '';
											return checkOut <= toDate;
	 								});
							}
					}
	        data = localAttendance.map(m => {
							return [
								{value:
										<div className={styles.row}>
												<Link to={'/announcementEdit'}>
														<Icon pathName={'comment_text'} premium={true} className={styles.icon}/>
												</Link>
												<Link to={'studentSchedule/' + studentPersonId} data-rh={`Student's schedule`}>
														<Icon pathName={'clock3'} premium={true} className={styles.icon}/>
												</Link>
												<Link to={'/studentProfile/' + m.personId} data-rh={'Student profile & parent info'}>
														<Icon pathName={'info'} className={styles.icon}/>
												</Link>
										</div>
								},
								{value: companyConfig.studentNameFirst === 'FIRSTNAME' ? m.studentFirstName + ' ' + m.studentLastName : m.studentLastName + ', ' + m.studentFirstName},
								{value: m.intervalName},
								{value: m.absentUnexcused},
								{value: m.absentExcused},
								{value: m.tardyUnexcused},
								{value: m.tardyExcused},
								{value: m.hours},
								{value: m.cost},
	          ]
	        });
	    }

	    return (
	        <div className={styles.container}>
							<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
									<L p={p} t={`Attendance School`}/>
							</div>
							<div className={styles.row}>
									<a onClick={this.toggleSearch} className={classes(styles.row, globalStyles.link)}>
											<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
											{showSearchControls ? <L p={p} t={`Hide search controls`}/> : <L p={p} t={`Show search controls`}/>}
									</a>
									{showSearchControls && <a onClick={this.clearFilters} className={classes(styles.muchRight, globalStyles.link)}><L p={p} t={`Clear filters`}/></a>}
							</div>
							{showSearchControls &&
									<div>
											<div>
													<SelectSingleDropDown
															id={`studentPersonId`}
															name={`studentPersonId`}
															label={<L p={p} t={`Student`}/>}
															value={studentPersonId || ''}
															options={studentList}
															className={styles.moreBottomMargin}
															height={`medium`}
															onChange={this.handleChange}/>
											</div>
											<div>
													<div className={classes(styles.littleLeft, styles.moreTop, styles.row)}>
															<div className={styles.dateRow}>
																	<span className={styles.headerLabel}><L p={p} t={`Date range - From`}/></span>
																	<DateTimePicker id={`fromDate`} value={fromDate} maxDate={toDate} onChange={(event) => this.changeDate('fromDate', event)}/>
															</div>
															<div className={styles.dateRow}>
																	<span className={styles.headerLabel}><L p={p} t={`To`}/></span>
																	<DateTimePicker id={`toDate`} value={toDate} minDate={fromDate ? fromDate : ''} onChange={(event) => this.changeDate('toDate', event)}/>
															</div>
													</div>
											</div>
											<hr/>
									</div>
							}
							<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.attendanceSchool}/>
							<OneFJefFooter />
	      	</div>
    	);
  }
}

export default withAlert(AttendanceSchoolView);
