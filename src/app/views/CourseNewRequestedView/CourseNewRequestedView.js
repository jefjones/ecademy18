import React, {Component} from 'react';
import styles from './CourseNewRequestedView.css';
const p = 'CourseNewRequestedView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import StudentListModal from '../../components/StudentListModal';
import DateMoment from '../../components/DateMoment';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {doSort} from '../../utils/sort.js';

class CourseNewRequestedView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					isShowingModal_students: false,
					baseCreditCount: 0,
					outcomeList: [],
					actionType: '',
					courseEntryId: '',
					partialNameText: '',
					intervalId: '',
					learningPathwayId: '',
					classPeriodId: '',
					sortByHeadings: {
							sortField: '',
							isAsc: '',
							isNumber: ''
					},
      }
    }

		componentDidMount() {
				document.body.addEventListener('keyup', this.checkEscapeKey);
				//this.setPersonConfig(); //Let's not save the personconfig or even use previous settings on this page since it will throw off the other search page.
				window.addEventListener('scroll', this.scrollData, false);
		}

		componentWillUnMount() {
				document.body.removeEventListener('keyup');
				window.removeEventListener('scroll', () => {}, false);
		}

		scrollData = () => {
				if (document.getElementById('scrollable').scrollTop !== this.state.scrollTop)
						this.setState({ scrollTop: document.getElementById('scrollable').scrollTop });
		}

		//Let's not save the personconfig or even use previous settings on this page since it will throw off the other search page.
		// setPersonConfig = () => {
		// 		const {personConfig} = this.props;
		// 		this.setState({
		// 				partialNameText: personConfig.courseSearch_partialNameText,
		// 				facilitatorName: personConfig.courseSearch_facilitatorName,
		// 				classPeriodId: personConfig.courseSearch_classPeriodId,
		// 				learningPathwayId: personConfig.courseSearch_learningPathwayId,
		// 				intervalId: personConfig.courseSearch_intervalId,
		// 		})
		// }

		resort = (field) => {
				let sortByHeadings = this.state.sortByHeadings;
				sortByHeadings.isAsc = sortByHeadings.sortField === field ? !sortByHeadings.isAsc : 'desc';
				sortByHeadings.isNumber = field === 'classPeriodId' ? true : false;
				sortByHeadings.sortField = field;
				this.setState({ sortByHeadings })
		}

		changeItem = ({target}) => {
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
				//updatePersonConfig(personId, 'CourseSearch_' + target.name, target.value); //Let's not save the personconfig or even use previous settings on this page since it will throw off the other search page.
		}

		handleStudentListOpen = (course, studentList) => this.setState({isShowingModal_students: true, course, studentList })
    handleStudentListClose = () => this.setState({isShowingModal_students: false })

		toggleClassPeriods = (classPeriodId) => {
				let selectedClassPeriods = [...this.state.selectedClassPeriods];
				selectedClassPeriods = selectedClassPeriods && selectedClassPeriods.length > 0 && selectedClassPeriods.indexOf(classPeriodId) > -1
						? selectedClassPeriods.filter(id => id !== classPeriodId)
						: selectedClassPeriods && selectedClassPeriods.length > 0
								? selectedClassPeriods.concat(classPeriodId)
								: [classPeriodId];
				this.setState({ selectedClassPeriods });
				this.filterLearners(selectedClassPeriods);
		}

		clearFilters = () => {
				//const {updatePersonConfig, personId} = this.props; //Let's not save the personconfig or even use previous settings on this page since it will throw off the other search page.
				this.setState({
						partialNameText: '',
						intervalId: '',
						learningPathwayId: '',
						classPeriodId: '',
						facilitatorName: '',
				});
				// updatePersonConfig(personId, 'CourseSearch_partialNameText', 'EMPTY');
				// updatePersonConfig(personId, 'CourseSearch_intervalId', 0);
				// updatePersonConfig(personId, 'CourseSearch_learningPathwayId', 0);
				// updatePersonConfig(personId, 'CourseSearch_classPeriodId', 0);
		}

    render() {
      const {students, viewStudent, learningPathways, classPeriods, intervals, companyConfig={}, accessRoles, fetchingRecord } = this.props;
      const {isShowingModal_students, courseScheduledId, course, studentList, classPeriodId, learningPathwayId, sortByHeadings,
							partialNameText, intervalId, scrollTop,  } = this.state;

			let localScheduledCourses = this.props.courseNewRequested;
			if (localScheduledCourses && localScheduledCourses.length > 0 ) {
					if (partialNameText && partialNameText.length > 0) {
							localScheduledCourses = localScheduledCourses.filter(w => w.courseName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1 || w.code.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1);
					}
					if (intervalId) {
							localScheduledCourses = localScheduledCourses.reduce((acc, m) => {
									let hasInterval = m.intervals.filter(f => f.intervalId === intervalId)[0];
									if (hasInterval && hasInterval.intervalId) {
											acc = acc && acc.length > 0 ? acc.concat(m) : [m];
									}
									return acc;
								},
							[]);
					}
					if (learningPathwayId) {
							localScheduledCourses = localScheduledCourses.filter(m => m.learningPathwayId === learningPathwayId);
					}
					if (classPeriodId) {
							localScheduledCourses = localScheduledCourses.filter(m => m.classPeriodId === classPeriodId);
					}
					if (sortByHeadings && sortByHeadings.sortField) {
							localScheduledCourses = doSort(localScheduledCourses, sortByHeadings);
					}
			}

			let scheduledHeadings = [{label: <L p={p} t={`Course name`}/>, tightText:true, clickFunction: () => this.resort('courseName')}];
			scheduledHeadings = scheduledHeadings.concat([
					{label: <L p={p} t={`Seats used`}/>, tightText:true},
					{label: <L p={p} t={`Open seats`}/>, tightText:true},
					{label: companyConfig.urlcode === 'Manheim' ? 'Block' : <L p={p} t={`Period`}/>, tightText:true, clickFunction: () => this.resort('classPeriodName')},
					{label: <L p={p} t={`Start time`}/>, tightText:true, clickFunction: () => this.resort('startTime')},
					//{label: companyConfig.isMcl ? 'Facilitator' : <L p={p} t={`Teacher`}/>, tightText:true, clickFunction: () => this.resort('facilitatorName')},
					{label: <L p={p} t={`Location`}/>, tightText:true, clickFunction: () => this.resort('location')},
			]);
			if (companyConfig.urlcode !== 'Liahona') {
					scheduledHeadings.push({label: <L p={p} t={`Online`}/>, tightText:true, clickFunction: () => this.resort('onlineName')});
			}
			if (companyConfig.urlcode === 'Manheim' && (accessRoles.admin || accessRoles.counselor)) {
					scheduledHeadings.push({label: <L p={p} t={`Course`}/>, tightText:true, clickFunction: () => this.resort('code')});
					scheduledHeadings.push({label: <L p={p} t={`Section`}/>, tightText:true, clickFunction: () => this.resort('section')});
			}
			scheduledHeadings = scheduledHeadings.concat([
					{label: <L p={p} t={`Interval`}/>, tightText:true, clickFunction: () => this.resort('intervalName')},
					{label: <L p={p} t={`Weekdays`}/>, tightText:true, clickFunction: () => this.resort('weekdaysText')},
					{label: <L p={p} t={`Duration`}/>, tightText:true, clickFunction: () => this.resort('duration')},
					{label: <L p={p} t={`From`}/>, tightText:true, clickFunction: () => this.resort('fromDate')},
					{label: <L p={p} t={`To`}/>, tightText:true, clickFunction: () => this.resort('toDate')},
			]);

			let startRecord = scrollTop / 30;
			startRecord = startRecord - 40 < 0 ? 0 : startRecord - 40;
			let maxRecords = 50;
			let recordsWritten = 0;
			let scheduledData = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.map((m, i) => {
					if (i <= startRecord) {
							return [{value: <div className={styles.rowHeight}>&nbsp;</div>}];
					} else {
							if (recordsWritten < maxRecords) {
									let row = [{ id: m.personId, value: m.courseName}];
									row = row.concat([{ value: <a onClick={(accessRoles.admin || accessRoles.counselor) ? () => this.handleStudentListOpen(m, m.studentList) : () => {}} className={styles.link}>{m.studentList.length !== 0 && m.studentList.length}</a>},
												{ value: m.maxSeats},
												{ value: m.classPeriodName},
												{ value: <DateMoment date={m.startTime} timeOnly={true}/>},
												{ value: m.location},
									]);
									if (companyConfig.urlcode !== 'Liahona') {
											row.push({ value: m.onlineName});
									}
									if (companyConfig.urlcode === 'Manheim' && (accessRoles.admin || accessRoles.counselor)) {
											row.push({ value: m.code});
											row.push({ value: m.section});
									}
									row = row.concat([
												{ value: m.intervalName},
												{ value: m.weekdaysText},
												{ value: m.duration && m.duration + ' min'},
												{ value: <DateMoment date={m.fromDate} format={'D MMM'}/>},
												{ value: <DateMoment date={m.toDate} format={'D MMM'}/>},
									]);
									recordsWritten++;
									return row;
							}
							return [{value: <div className={styles.rowHeight}>&nbsp;</div>}];
					}
			})

      return (
        <div className={styles.container} id={'topContainer'}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
                  	{`New Courses Requested`}
                </div>
								<div className={classes(styles.grayBack, styles.moreBottom)}>
										<div className={styles.row}>
												<div className={styles.filterLabel}>Filters:</div>
												<a onClick={this.clearFilters} className={classes(styles.moreLeft, styles.linkStyle)}>
														Clear filters
												</a>
										</div>
										<InputText
												id={"partialNameText"}
												name={"partialNameText"}
												size={"medium"}
												label={<L p={p} t={`Name search`}/>}
												value={partialNameText || ''}
												onChange={this.changeItem}/>
										<div>
												<SelectSingleDropDown
														id={`intervalId`}
														label={<L p={p} t={`Marking Periods`}/>}
														value={intervalId || ''}
														options={intervals}
														height={`medium`}
														onChange={this.changeItem}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={`learningPathwayId`}
														label={companyConfig.urlcode === `Manheim` ? `Department` : <L p={p} t={`Subject/Discipline`}/>}
														value={learningPathwayId || ''}
														options={learningPathways}
														height={`medium`}
														onChange={this.changeItem}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={`classPeriodId`}
														label={companyConfig.urlcode === `Manheim` ? `Block` : <L p={p} t={`Period`}/>}
														value={classPeriodId || ''}
														options={classPeriods}
														height={`medium`}
														onChange={this.changeItem}/>
										</div>
								</div>
								<div className={styles.text}>{`count: ${scheduledData.length === 1 && scheduledData[0][0].id === 'EMPTY' ? 0 : scheduledData.length}`}</div>
								<div className={styles.scrollable} id={'scrollable'} onScroll={this.scrollData}>
										<EditTable labelClass={classes(styles.tableLabelClass, styles.moreBottomMargin)} headings={scheduledHeadings} data={scheduledData}
												noCount={true} isFetchingRecord={fetchingRecord.courseNewRequest}/>
								</div>
						</div>
        		<OneFJefFooter />
						{isShowingModal_students &&
								<StudentListModal handleClose={this.handleStudentListClose} course={course} courseScheduledId={courseScheduledId}
										students={students} studentList={studentList} viewStudent={viewStudent}  />
						}
        </div>
    )};
}

export default CourseNewRequestedView;
