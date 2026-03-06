import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import styles from './ScheduledCoursesView.css';
const p = 'ScheduledCoursesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import BaseCourseMenu from '../../components/BaseCourseMenu';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import StudentListModal from '../../components/StudentListModal';
import Icon from '../../components/Icon';
import DateMoment from '../../components/DateMoment';
import InputText from '../../components/InputText';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {doSort} from '../../utils/sort.js';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';

class ScheduledCoursesView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					isScheduledCourseContextOpen: false,
	        isShowingModal_remove: false,
					isShowingModal_message: false,
					isShowingModal_students: false,
					outcomeList: [],
					actionType: '',
					intervalId: props.personConfig.intervalId, // || props.companyConfig.intervalId,
					courseEntryId: '',
					courseTypeId: '',
					classPeriodId: '',
					facilitatorPersonId: '',
					sortByHeadings: {
							sortField: '',
							isAsc: '',
							isNumber: ''
					},

      }
    }

		componentDidMount() {
				document.body.addEventListener('keyup', this.checkEscapeKey);
				this.setPersonConfig();
		}

		componentDidUpdate() {
				const {courseEntryId, courseScheduledId, personConfig} = this.props;
				if (!this.state.isInit && courseEntryId && courseScheduledId && personConfig && personConfig.personId) {
						this.setState({
                isInit: true,
                courseEntryId,
                courseScheduledId,
                partialNameText: personConfig.choices['CoursePartialNameText'],
                intervalId: personConfig.choices['CourseIntervalId'],
                courseTypeId: personConfig.choices['CourseCourseTypeId'],
                classPeriodId: personConfig.choices['CourseClassPeriodId'],
                facilitatorPersonId: personConfig.choices['CourseFacilitatorPersonId'],
                learningPathwayId: personConfig.choices['CourseLearningPathwayId'],
            });
				}
		}

		componentWillUnMount() {
				document.body.removeEventListener('keyup');
		}

    handleResetFilter = () => {
        const {setPersonConfigChoice, personId} = this.props;
        setPersonConfigChoice(personId, 'CourseIntervalId', '');
        setPersonConfigChoice(personId, 'CoursePartialNameText', '');
        setPersonConfigChoice(personId, 'CourseCourseTypeId', '');
        setPersonConfigChoice(personId, 'CourseClassPeriodId', '');
        setPersonConfigChoice(personId, 'CourseFacilitatorPersonId', '');
        setPersonConfigChoice(personId, 'CourseLearningPathwayId', '');
    }

		handleResetClipboard = (event, sendTo='') => {
				const {resetCourseClipboard, personId} = this.props;
				resetCourseClipboard(personId, this.setCourseClipboard(), sendTo);
				if (sendTo) {
						sendTo.indexOf('/') > -1 ?  browserHistory.push(sendTo) : browserHistory.push('/' + sendTo);
				}
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The course clipboard was reset.`}/></div>)
		}

		setCourseClipboard = () => {
				const {personId, companyConfig} = this.props;
				return {
						companyId: companyConfig.companyId,
						userPersonId: personId,
						courseList: [],
						personType: 'STUDENT',
				};
		}

		setPersonConfig = () => {
				const {personConfig, accessRoles, updatePersonConfig, personId} = this.props;
				let courseSearch_facilitatorPersonId = personConfig.courseSearch_facilitatorPersonId;
				if (accessRoles.facilitator && !accessRoles.admin
								&& (!personConfig.courseSearch_facilitatorPersonId || personConfig.courseSearch_facilitatorPersonId === guidEmpty)) {
						updatePersonConfig(personId, "CourseSearch_facilitatorPersonId", personId);
						courseSearch_facilitatorPersonId = personId;
				}
				this.setState({
						facilitatorPersonId: courseSearch_facilitatorPersonId,
						classPeriodId: personConfig.courseSearch_classPeriodId,
						courseTypeId:  personConfig.courseSearch_courseTypeId,
				})
		}

		resort = (field) => {
				let sortByHeadings = this.state.sortByHeadings;
				sortByHeadings.isAsc = sortByHeadings.sortField === field ? !sortByHeadings.isAsc : 'desc';
				sortByHeadings.isNumber = field === 'classPeriodId' ? true : false;
				sortByHeadings.sortField = field;
				this.setState({ sortByHeadings })
		}

		changeItem = ({target}) => {
				const {updatePersonConfig, personId} = this.props;
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
				if (field === 'facilitatorPersonId' || field === 'classPeriodId' || field === 'courseTypeId')
						updatePersonConfig(personId, 'CourseSearch_' + target.name, target.value);
				if (field === 'intervalId')
						updatePersonConfig(personId, 'IntervalId', event.target.value);
		}

		handleStudentListOpen = (course) => {
        const {getStudentListByCourse, personId} = this.props;
        this.setState({isShowingModal_students: true, course })
        getStudentListByCourse(personId, course.courseScheduledId);
    }

    handleStudentListClose = () => {
        this.setState({isShowingModal_students: false })
        this.props.clearStudentListByCourse();
    }

		setIcons = (course) => {
				const {personId, accessRoles, courseClipboard} = this.props;
				let hasAccess = false;
				course && course.teachers && course.teachers.length > 0 && course.teachers.forEach(t => {
						if (t.id === personId) hasAccess = true;
				});

				return accessRoles.facilitator && hasAccess
								? <div className={styles.row}>
											<a onClick={() => browserHistory.push('/assignmentList/' + course.courseEntryId)}>
													<Icon pathName={`list3`} premium={true} className={styles.icon}/>
											</a>
											<a onClick={() => browserHistory.push('/courseWeightedScore/' + course.courseEntryId)}>
													<Icon pathName={`scale`} premium={true} className={classes(styles.moreLeft, styles.icon)}/>
											</a>
											<a onClick={() => browserHistory.push('/discussionClass/' + course.courseEntryId)}>
													<Icon pathName={`chat_bubbles`} premium={true} className={classes(styles.moreLeft, styles.icon)}/>
											</a>
									</div>
								: courseClipboard && courseClipboard.courseList && courseClipboard.courseList.length > 0 && courseClipboard.courseList.indexOf(course.id) > -1
										? <a onClick={() => this.handleRemoveSingleCourseClipboard(course.id)} data-rh={'Remove course from clipboard'}>
													<Icon pathName={'clipboard_text'} superscript={'cross'} supFillColor={'#7e1212'} premium={true}
															superScriptClass={styles.plusPosition} className={styles.image}/>
											</a>
										: '';
		}

		handleSingleAddToClipboard = (courseScheduledId) => {
				const {addCourseClipboard, personId, companyConfig} = this.props;
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The course clipboard had 1 record added.`}/></div>)
				addCourseClipboard(personId, {
						companyId: companyConfig.companyId,
						userPersonId: personId,
						courseList: [courseScheduledId],
						courseListType: 'courseScheduled'
				});
		}

		handleUpdateSchoolYear = ({target}) => {
				const {personId, updatePersonConfig, getCoursesScheduled, } = this.props;
				this.setState({ courseScheduledschoolYearId: target.value });
				updatePersonConfig(personId, 'SchoolYearId', target.value, () => getCoursesScheduled(personId, true));
		}

		chooseRecord = (course) => this.setState({ courseScheduledId: course.courseScheduledId, courseEntryId: course.courseEntryId });

		handleRemoveSingleCourseClipboard = (chosenCourseId) => {
				const {singleRemoveCourseClipboard, personId} = this.props;
				singleRemoveCourseClipboard(personId, chosenCourseId, "courseScheduled");
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The course clipboard had 1 record removed.`}/></div>)
		}

    changeSearch = ({target}) => {
        let newState = Object.assign({}, this.state);
        newState[target.name] = target.value;
        this.setState(newState);
    }

    render() {
      const {personId, removeCourseToSchedule, companyConfig={}, courseTypes, classPeriods, facilitators, courseClipboard, personConfig={choices:[]},
							intervals, accessRoles, schoolYears, learningPathways, myFrequentPlaces, setMyFrequentPlace, scheduledCourses, students,
							fetchingRecord, setPersonConfigChoice, studentListByCourse, seatsStatistics } = this.props;
      const {isShowingModal_remove, isShowingModal_students, courseEntryId, courseName, courseScheduledId, course, sortByHeadings,
              schoolYearId, partialNameText, intervalId, courseTypeId, classPeriodId, facilitatorPersonId, learningPathwayId} = this.state;

			let localScheduledCourses = scheduledCourses;
			if (localScheduledCourses && localScheduledCourses.length > 0 ) {
					if (partialNameText) {
							let cutBackTextFilter = partialNameText.toLowerCase();
							//cutBackTextFilter = cutBackTextFilter && cutBackTextFilter.length > 15 ? cutBackTextFilter.substring(0,15) : cutBackTextFilter;
							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1));
					}
					if (intervalId && intervalId != 0) { //eslint-disable-line
							localScheduledCourses = localScheduledCourses.reduce((acc, m) => {
									let hasInterval = m.intervals.filter(f => f.intervalId === intervalId)[0];
									if (hasInterval && hasInterval.intervalId) {
											acc = acc && acc.length > 0 ? acc.concat(m) : [m];
									}
									return acc;
								},
							[]);
					}
					if (courseTypeId && courseTypeId != 0) { //eslint-disable-line
							localScheduledCourses = localScheduledCourses.filter(m => m.courseTypeId === courseTypeId);
					}
					if (classPeriodId && classPeriodId != 0) { //eslint-disable-line
							localScheduledCourses = localScheduledCourses.filter(m => m.classPeriodId === classPeriodId);
					}
					if (facilitatorPersonId && facilitatorPersonId !== guidEmpty && facilitatorPersonId != 0) { //eslint-disable-line
							localScheduledCourses = localScheduledCourses.filter(m => {
									let found = false;
									m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
											if (t.id === facilitatorPersonId) found = true;
									});
									return found;
							});
					}
					if (learningPathwayId && learningPathwayId !== guidEmpty && learningPathwayId != 0) { //eslint-disable-line
							localScheduledCourses = localScheduledCourses.filter(m => m.learningPathwayId === learningPathwayId);
					}

					if (sortByHeadings && sortByHeadings.sortField) {
							localScheduledCourses = doSort(localScheduledCourses, sortByHeadings);
					}
			}

			let scheduledHeadings = [{},
					{label: <L p={p} t={`Name`}/>, tightText:true, clickFunction: () => this.resort('courseName')},
			];

			if (companyConfig.urlcode === 'Liahona') {
					scheduledHeadings.push({label: <L p={p} t={`Type`}/>, tightText:true, clickFunction: () => this.resort('courseTypeName')});
			}
			if (companyConfig.urlcode === 'Manheim') {
					scheduledHeadings.push({label: <L p={p} t={`Code`}/>, tightText:true, clickFunction: () => this.resort('Code')});
			}
			if (companyConfig.urlcode === 'Manheim') {
					scheduledHeadings.push({label: <L p={p} t={`Section`}/>, tightText:true, clickFunction: () => this.resort('section')});
			}
			scheduledHeadings = scheduledHeadings.concat([
					{label: <L p={p} t={`Seats used`}/>, tightText:true},
					{label: <L p={p} t={`Open seats`}/>, tightText:true, clickFunction: () => this.resort('maxSeats')},
					{label: companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Block`}/>: <L p={p} t={`Period`}/>, tightText:true, clickFunction: () => this.resort('classPeriodName')},
					{label: <L p={p} t={`Start time`}/>, tightText:true, clickFunction: () => this.resort('startTime')},
					{label: <L p={p} t={`Teacher`}/>, tightText:true},
					{label: <L p={p} t={`Location`}/>, tightText:true, clickFunction: () => this.resort('location')},
			]);
			if (companyConfig.urlcode !== 'Liahona') {
					scheduledHeadings.push({label: <L p={p} t={`Online`}/>, tightText:true, clickFunction: () => this.resort('onlineName')});
			}
			scheduledHeadings = scheduledHeadings.concat([
					{label: <L p={p} t={`Interval`}/>, tightText:true, clickFunction: () => this.resort('intervalName')},
					{label: <L p={p} t={`Weekdays`}/>, tightText:true, clickFunction: () => this.resort('weekdaysText')},
					{label: <L p={p} t={`Duration`}/>, tightText:true, clickFunction: () => this.resort('duration')},
					{label: <L p={p} t={`From`}/>, tightText:true, clickFunction: () => this.resort('fromDate')},
					{label: <L p={p} t={`To`}/>, tightText:true, clickFunction: () => this.resort('toDate')},
			]);

			// if (companyConfig.urlcode !== 'Liahona') {
			// 		scheduledHeadings = scheduledHeadings.concat([
			// 				{label: <L p={p} t={`Administrative where taught`}/>, tightText: true},
			// 				{label: <L p={p} t={`School where taught`}/>, tightText: true},
			// 				{label: <L p={p} t={`GPA`}/>, tightText: true},
			// 				{label: <L p={p} t={`ClassRank`}/>, tightText: true},
			// 				{label: <L p={p} t={`HonorRoll`}/>, tightText: true},
			// 				{label: <L p={p} t={`Use course for lunch`}/>, tightText: true},
			// 				{label: <L p={p} t={`Grade report`}/>, tightText: true},
			// 				{label: <L p={p} t={`State reports`}/>, tightText: true},
			// 				{label: <L p={p} t={`Granting credit college`}/>, tightText: true},
			// 				{label: <L p={p} t={`Where taught campus`}/>, tightText: true},
			// 				{label: <L p={p} t={`Instructional setting`}/>, tightText: true},
			// 		]);
			// }

			let scheduledData = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.map(m => {
          let seats = seatsStatistics && seatsStatistics.length > 0 && seatsStatistics.filter(s => s.courseScheduledId === m.id)[0]

          let comma = '';
          let intervalCodes = m.intervals && m.intervals.length > 0 && m.intervals.reduce((acc, i) => {
              acc += comma + i.code;
              comma = ', ';
              return acc;
          }, '')

					let row = [
								{value: this.setIcons(m), cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.courseName,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					];
					if (companyConfig.urlcode === 'Liahona') {
							row.push({ value: m.courseTypeName,
								clickFunction: () => this.chooseRecord(m),
                notShowLink: true,
							  cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''});
					}
					if (companyConfig.urlcode === 'Manheim') {
							row.push({ value: m.code,
								clickFunction: () => this.chooseRecord(m),
                notShowLink: true,
								cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''});
					}
					if (companyConfig.urlcode === 'Manheim') {
							row.push({ value: m.section,
								clickFunction: () => this.chooseRecord(m),
                notShowLink: true,
								cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''});
					}
					row = row.concat([
                { value: <a onClick={!(seats && seats.seatsTaken > 0) ? () => {} : () => this.handleStudentListOpen(m)} className={styles.link}>{(seats && seats.seatsTaken > 0) ? seats.seatsTaken : ''}</a>,
										clickFunction: () => this.chooseRecord(m),
										cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.maxSeats,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.classPeriodsMultiple && m.classPeriodsMultiple.length > 0 ? m.classPeriodsMultiple.join(',') : m.classPeriodName,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.startTime ? <DateMoment date={m.startTime} timeOnly={true}/> : '',
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.teachers && m.teachers.length > 0 && m.teachers.reduce((acc, t) => acc += acc ? ', ' + t.label : t.label, ''),
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.location,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					]);
					if (companyConfig.urlcode !== 'Liahona') {
							row.push({ value: m.onlineName,
								clickFunction: () => this.chooseRecord(m),
                notShowLink: true,
								cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''});
					}
					row = row.concat([
								{ value: intervalCodes,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.weekdaysText,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: m.duration && m.duration + ' min',
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: <DateMoment date={m.fromDate} format={'D MMM'}/>,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
								{ value: <DateMoment date={m.toDate} format={'D MMM'}/>,
									clickFunction: () => this.chooseRecord(m),
                  notShowLink: true,
									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					]);

					// if (companyConfig.urlcode !== 'Liahona') {
					// 		row = row.concat([
					// 				{ value: m.administrativeWhereTaught,
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.schoolWhereTaught,
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.excludeFromGPA ? 'Exclude' : 'Include',
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.excludeFromClassRank ? 'Exclude' : 'Include',
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.excludeFromHonorRoll ? 'Exclude' : 'Include',
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.useTheCourseForLunch ? 'Exclude' : 'Include',
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.excludeOnGradeReport ? 'Exclude' : 'Include',
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.excludeFromStateReports ? 'Exclude' : 'Include',
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.grantingCreditCollegeId,
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.whereTaughtCampus,
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 				{ value: m.instructionalSetting,
					// 					clickFunction: () => this.chooseRecord(m),
					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
					// 		]);
					//}
					return row;
			})

      return (
        <div className={styles.container} id={'topContainer'}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
                  	<L p={p} t={`Course Sections`}/>
                </div>
								<div className={classes(styles.muchLeft, styles.rowWrap)}>
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
														value={intervalId || ''}
														options={intervals}
														height={`medium`}
                            onChange={this.changeSearch}
														onBlur={() => setPersonConfigChoice(personId, 'CourseIntervalId', event.target.value)}/>
										</div>
										<InputText
												id={"partialNameText"}
												name={"partialNameText"}
												size={"medium"}
												label={<L p={p} t={`Name search`}/>}
                        value={partialNameText || ''}
                        onChange={this.changeSearch}
												onBlur={() => setPersonConfigChoice(personId, 'CoursePartialNameText', event.target.value)}/>
										{companyConfig.urlcode !== 'Manheim' &&
												<div>
														<SelectSingleDropDown
																id={`courseTypeId`}
																label={<L p={p} t={`Course Type`}/>}
																options={courseTypes}
																height={`medium`}
                                value={courseTypeId || ''}
                                onChange={this.changeSearch}
        												onBlur={() => setPersonConfigChoice(personId, 'CourseCourseTypeId', event.target.value)}/>
												</div>
										}
										<div>
												<SelectSingleDropDown
														id={`classPeriodId`}
														label={companyConfig.urlcode === 'Manheim' ? 'Block' : <L p={p} t={`Class Period`}/>}
														options={classPeriods}
														height={`medium`}
                            value={classPeriodId || ''}
                            onChange={this.changeSearch}
                            onBlur={() => setPersonConfigChoice(personId, 'CourseClassPeriodId', event.target.value)}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={`facilitatorPersonId`}
														label={<L p={p} t={`Teachers`}/>}
														options={facilitators || []}
														height={`medium`}
                            value={facilitatorPersonId || ''}
                            onChange={this.changeSearch}
                            onBlur={() => setPersonConfigChoice(personId, 'CourseFacilitatorPersonId', event.target.value)}/>
										</div>
										<div className={styles.moreBottomMargin}>
												<SelectSingleDropDown
														id={`learningPathwayId`}
														name={`learningPathwayId`}
														label={companyConfig.urlcode === 'Manheim' ? `Content Area` : <L p={p} t={`Subject/Discipline`}/>}
														options={learningPathways || []}
														height={`medium`}
                            value={learningPathwayId || ''}
                            onChange={this.changeSearch}
                            onBlur={() => setPersonConfigChoice(personId, 'CourseLearningPathwayId', event.target.value)}/>
										</div>
								</div>
								<div className={classes(styles.row, styles.moreLeft, styles.littleTop)}>
										<div className={styles.filterLabel}>{`Count: ${scheduledData.length > 0 && !!scheduledData[0][0].value ? scheduledData.length : 0}`}</div>
                    <a onClick={this.handleResetFilter} className={classes(styles.row, styles.link, styles.muchLeft)}>
												<Icon pathName={'flashlight'} premium={true} className={styles.iconSmall}/>
												<L p={p} t={`Clear search`}/>
										</a>
										<a onClick={this.handleResetClipboard} className={classes(styles.row, styles.link, styles.muchLeft)}>
												<Icon pathName={'sync'} premium={true} className={styles.iconSmall}/>
												<L p={p} t={`Clear clipboard`}/>
												<div className={styles.count}>{(courseClipboard && courseClipboard.courseList && courseClipboard.courseList.length) || 0}</div>
										</a>
										{accessRoles.admin &&
												<Link to={'/learnerCourseAssign'} className={classes(styles.row, styles.link, styles.muchLeft)}>
														<Icon pathName={'clock3'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuper} superScriptClass={styles.superScript}/><L p={p} t={`Go to Course Assign`}/>
												</Link>
										}
                    {/*accessRoles.admin &&  //I think that this would be confusing here since the user could be thinking that they need to create a new base course when it might already exist.
												<a onClick={() => browserHistory.push('/courseEntry')} className={classes(styles.row, styles.addNew, styles.moreTop)}>
						                <Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
						                {'Create a new course'}
						            </a>
										*/}
								</div>
								<div className={styles.widthStop}>
										{localScheduledCourses && localScheduledCourses.length > 0 && accessRoles.admin &&
												<BaseCourseMenu personId={personId} removeRecord={removeCourseToSchedule} courseName={courseName} actionType={"SCHEDULEDCOURSE"}
														hideContextCourseActionMenu={this.hideContextCourseActionMenu} courseDuplicate={this.handleDuplicateCourse}
														id={courseScheduledId} courseEntryId={courseEntryId} courseScheduledId={courseScheduledId} hideMenu={this.hideContextScheduledCourseMenu}
														scheduledCourses={localScheduledCourses} isAdmin={accessRoles.admin}
														addToClipboard={this.handleSingleAddToClipboard} courseClipboard={courseClipboard}
														singleRemoveCourseClipboard={this.handleRemoveSingleCourseClipboard} companyConfig={companyConfig}/>
										}
										<div className={styles.instructions}>
												<L p={p} t={`If you don't see a course listed below that you are expecting, it could be on a different semester.  Change the semester choice above.`}/>
										</div>
										<div className={styles.scrollable}>
												<EditTable labelClass={classes(styles.tableLabelClass, styles.moreBottomMargin)} headings={scheduledHeadings} data={scheduledData}
														noCount={true} isFetchingRecord={fetchingRecord.scheduledCourses}/>
										</div>
								</div>
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Scheduled Courses (sections)`}/>} path={'scheduledCourses'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
        		<OneFJefFooter />
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this course from the schedule?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this course from the schedule?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_students &&
								<StudentListModal handleClose={this.handleStudentListClose} course={course} students={students} studentList={studentListByCourse}
										courseScheduledId={courseScheduledId}/>
						}
        </div>
    )};
}

export default withAlert(ScheduledCoursesView);
