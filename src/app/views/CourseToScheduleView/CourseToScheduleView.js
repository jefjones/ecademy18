import React, {Component} from 'react';
import styles from './CourseToScheduleView.css';
const p = 'CourseToScheduleView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import { browserHistory } from 'react-router';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Checkbox from '../../components/Checkbox';
import RadioGroup from '../../components/RadioGroup';
import GradingRatingLegend from '../../components/GradingRatingLegend';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import DateTimePicker from '../../components/DateTimePicker';
import InputDataList from '../../components/InputDataList';
import ScheduleCourseDayTime from '../../components/ScheduleCourseDayTime';
import TextDisplay from '../../components/TextDisplay';
import CheckboxGroup from '../../components/CheckboxGroup';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';
import {guidEmpty} from '../../utils/guidValidate.js';
import {wait} from '../../utils/wait.js';

class CourseToScheduleView extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isRecordComplete: false,
				showMoreInfo: false,
      }
    }

		componentDidUpdate() {
				const {course} = this.props;
        const {isInit} = this.state;
        if (!isInit && course && course.courseName) {
            this.setState({ isInit: true, course})
        }
		}

		updateBaseCourse = (event) => {
				const {baseCourses} = this.props;
        let course = Object.assign({}, this.state.course);
				let courseEntry = baseCourses && baseCourses.length > 0 && baseCourses.filter(m => m.courseEntryId === event.target.value)[0];
				if (courseEntry && courseEntry.courseName) {
						course.courseEntryId = courseEntry.courseEntryId;
						course.courseName = courseEntry.courseName;
						course.courseTypeId = courseEntry.courseTypeId;
						course.courseTypeName = courseEntry.courseTypeName;
						course.learningPathwayId = courseEntry.learningPathwayId;
						course.learningPathwayName = courseEntry.learningPathwayName;
            this.setState({ course });
				}
		}

    changeCourse = (event) => {
        let course = Object.assign({}, this.state.course);
	      const field = event.target.name;
				if (field === 'intervalId') {
						this.getDefaultFromToDate('from');
						this.getDefaultFromToDate('to');
				}
        course[field] = event.target.value;
        this.setState({ course })
    }

    processForm = (stayOrFinish) => { //, event
        const {course={}} = this.state;
  			let instructions = [];
        let errors = {};

        if (!course.courseTypeId) {
            errors.courseType = <L p={p} t={`Course type required`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Course type required`}/></div>
        }

  			if (!course.schoolYearId) {
            errors.schoolYear = <L p={p} t={`A school year is required`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A school year is required`}/></div>
        }

  			if (!(course.intervals && course.intervals.length > 0)) {
            errors.intervals = <L p={p} t={`At least one interval is required`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one interval is required`}/></div>
        } else if (!this.hasConsecutiveIntervals()) {
  					errors.intervals = <L p={p} t={`The chosen intervals must be consecutive`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The chosen intervals must be consecutive`}/></div>
  			}

  			if (!(course.teachers && course.teachers.length > 0)) {
            errors.facilitator = <L p={p} t={`A teacher is required`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A teacher is required`}/></div>
        }

  			if (course.gradingType === 'STANDARDSRATING' && (!course.standardsRatingTableId || course.standardsRatingTableId === guidEmpty)) {
  					errors.standardsRating = <L p={p} t={`Standards rating scale is required`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Standards rating scale is required`}/></div>
  			}

  			if (!course.gradeScaleTableId || course.gradeScaleTableId === guidEmpty) {
            errors.gradingScale = <L p={p} t={`Grading scale is required`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Grading scale is required`}/></div>
        }

        if (this.isDateYearInvalid(course.fromDate)) {
  					errors.fromDate = <L p={p} t={`'From date' year is not valid`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`'From date' year is not valid`}/></div>
  			}

        if (this.isDateYearInvalid(course.toDate)) {
  					errors.fromDate = <L p={p} t={`'To date' year is not valid`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`'To date' year is not valid`}/></div>
        }

  			// if (!course.maxSeats) {
        //     hasError = true;
        //     this.setState({maxSeats: <L p={p} t={`Number of seats vacant is required`}/>});
  			// 		instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`>`}/></div>
        // }

        // if (!course.location && !course.offCampus && !course.online) {
        //     hasError = true;
        //     errors.location = <L p={p} t={`A location is required`}/>
  			// 		instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A location is required`}/></div>
        // }

  			//If daysScheduled is not complete, then give an error
  			//let hasDayScheduled = true;
  			if (!(course.daysScheduled && course.daysScheduled.length > 0)) {
  					errors.days = <L p={p} t={`At least one day is required`}/>
  					instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one day is required`}/></div>
  			// } else {
  			// 		course.daysScheduled.forEach(m => {
  			// 				if (!m.startTime) hasDayScheduled = false;
  			// 		})
  			}

  			// if (!hasDayScheduled) {
  			// 		errors.days = <L p={p} t={`The days scheduled requires a start time`}/>
  			// 		instructions[instructions.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The days scheduled requires a start time`}/></div>
  			// }

        if (!(course.fromDate) || !(course.toDate)) {
            this.handleMissingDateWarningOpen();
        } else if (instructions && instructions.length > 0) {
            this.setState({ errors });
  					this.handleInstructionsOpen(instructions);
  			} else {
            this.saveEntry();
  			}
    }

    saveEntry = () => {
        const {addOrUpdateCourseToSchedule, personId, params, intervals} = this.props;
        const {course} = this.state;

        if (course.intervals && course.intervals.length > 0 && typeof course.intervals[0] === 'string' && intervals && intervals.length > 0) {
            course.intervals = course.intervals.reduce((acc, id) => {
                let option = intervals.filter(d => d.intervalId === id)[0];
                if (option && option.intervalId) {
                    acc = acc && acc.length > 0 ? acc.concat(option) : [option];
                }
                return acc;
            }, []);
        }
        if (course.daysScheduled && course.daysScheduled.length > 0) {
            course.classPeriodId = course.daysScheduled[0].classPeriodId;
            course.startTime = course.daysScheduled[0].startTime;
        }

        addOrUpdateCourseToSchedule(personId, course);
        this.resetEntry();
        this.props.alert.info(<div className={styles.alertText}><L p={p} t={`This record has been saved.`}/></div>)
        if (params && params.newOrEdit === 'edit' && params.id)
            browserHistory.push(`/scheduledCourses/${params && params.id}`);
        else
            browserHistory.push(`/scheduledCourses`);
    }

    resetEntry = () => {
        this.setState({
            errorCourseName: '',
            errorLearningPathway: '',
            errorFacilitator: '',
            errorLocation: '',
            errorSchedule: '',
            course: {},
        });
    }

		isDateYearInvalid = (date) => {
				var isInvalid = false;
				if (date && date.length >= 4) {
						let year = Number(date.substring(0,4));
						if (year < 2012 || year > 2030) isInvalid = true;
				}

				return isInvalid;
		}

    handleCampusLocation = (value) => {
        let course = Object.assign({}, this.state.course);
        if (value === 'onCampus') {
            course['onCampus'] = true;
            course['offCampus'] = false;
        } else {
            course['onCampus'] = false;
            course['offCampus'] = true;
        }
        this.setState({ course })
    }

		handleRadioChoice = (field, value) => {
				const {standardsRatingTables} = this.props;
        let course = Object.assign({}, this.state.course);
        course[field] = value;
				if (field === 'gradingType' && value === 'STANDARDSRATING' && standardsRatingTables && standardsRatingTables.length === 1)
            course['standardsRatingTableId'] = standardsRatingTables[0].standardsRatingTableId;

        this.setState({ course })
		}

		handleInstructionsOpen = (instructions) => this.setState({isShowingModal_instructions: true, instructions })
		handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, instructions: '' })

    handleMissingDateWarningOpen = () => this.setState({isShowingModal_dateWarning: true })
		handleMissingDateWarningClose = () => this.setState({isShowingModal_dateWarning: false })
    handleMissingDateWarningSubmit = () => {
        this.handleMissingDateWarningClose();
        wait(1000);
        this.saveEntry();
    }

		setDaySchedule = (daysScheduled) => {
        let course = Object.assign({}, this.state.course);
        course['daysScheduled'] = daysScheduled;
        this.setState({ course })
    }

    toggleMoreInfo = () => this.setState({ showMoreInfo: !this.state.showMoreInfo });

		sendBack = () => {
				const {params} = this.props;
				if (params && params.newOrEdit === 'edit' && params.id)
						browserHistory.push(`/scheduledCourses/${params && params.id}`);
				else
						browserHistory.push(`/scheduledCourses`);
		}

    changeTeacher = (teachers) => {
        let course = Object.assign({}, this.state.course);
        course['teachers'] = teachers;
        this.setState({ course })
    }

		changeClassPeriodsMultiple = (selectedClassPeriodsMultiple) => {
        let course = Object.assign({}, this.state.course);
        course['selectedClassPeriodsMultiple'] = selectedClassPeriodsMultiple;
        this.setState({ course })
    }

		getDefaultFromToDate = (fromOrTo) => {
				const {intervals, schoolYears} = this.props;
        let course = Object.assign({}, this.state.course);
				//1. When the interval and schoolYear are chosen, then this date can be built
				//2. If the interval month is greater than or equal to 8, then take the first year of the schoolYear
				//	   otherwise, take the second year of the schoolYear
				if (course && course.intervalId && course.schoolYearId) {
						let interval = intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === course.intervalId)[0];
						let schoolYear = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === course.schoolYearId)[0];
						if (interval && interval.fromDay && schoolYear && schoolYear.label) {
								let day = fromOrTo === 'from' ? interval.fromDay : interval.toDay;
								let month = fromOrTo === 'from' ? interval.fromMonth : interval.toMonth;
								month = String(Number(month) + Number(1));
								let year = month >= 7 ? schoolYear.label.substring(0,4) : schoolYear.label.substring(5);
								month = month >= 10 ? month : '0' + month;
								day = day >= 10 ? day : '0' + day;
								let result = year + '-' + month + '-' + day;
                course[fromOrTo === 'from' ? 'fromDate' : 'toDate'] = result;
                this.setState({ course })
						}
				}
		}

		handleGradeScaleListOpen = (gradeScaleTableId, event) => {
				const {gradeScales} = this.props;
				event.stopPropagation();
				event.preventDefault();
				let gradeScale = gradeScales && gradeScales.length > 0 && gradeScales.filter(m => m.gradeScaleTableId === gradeScaleTableId);
				let gradeScaleName = gradeScale && gradeScale.length > 0 && gradeScale[0].gradeScaleName;
				let gradeScaleList = `<table><tr><td><L p={p} t={'Letter'}/></td><td><L p={p} t={'High value'}/></td><td><L p={p} t={'Low value'}/></td><td><L p={p} t={'GPA value'}/></td></tr>`;
				gradeScale && gradeScale.length > 0 && gradeScale.forEach(m => {
						gradeScaleList += `<tr><td>${m.letter}</td><td>${m.highValue}</td><td>${m.lowValue}</td><td>${m.scale40Value}</td></tr>`
				});
				gradeScaleList += '</table>';
				this.setState({isShowingModal_showList: true, gradeScaleTableId, gradeScaleList, gradeScaleName })
		}
	  handleGradeScaleListClose = () => this.setState({isShowingModal_showList: false, gradeScaleList: '', gradeScaleName: '' })

		toggleCheckbox = (field) => {
        let course = Object.assign({}, this.state.course);
        course[field] = !course[field];
        this.setState({ course })
		}

    setDate = (field, value) => {
        let course = Object.assign({}, this.state.course);
        course[field] = value;
        this.setState({ course })
    }

		changeIntervals = (intervalChoices) => {
				const {intervals, schoolYears} = this.props;
        let course = Object.assign({}, this.state.course);

				//Set the fromDate and toDate by the interval
				//0. Set the years according to the schoolYear
				//1. Get the from Date from the first interval.
				//2. Get the to date from the last interval.
				let fromDate = '';
				let toDate = '';
				if (course.schoolYearId && course.schoolYearId !== guidEmpty && intervalChoices && intervalChoices.length > 0) {
						let schoolYear = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === course.schoolYearId)[0];
						if (schoolYear && schoolYear.id) {
								intervals && intervals.length > 0 && intervals.forEach(m => {
										if (!fromDate && intervalChoices.indexOf(m.intervalId) > -1) {
												fromDate = (m.fromMonth >= 7 ? schoolYear.yearInt-1*1 : schoolYear.yearInt) + '-' + this.twoDigit(m.fromMonth) + '-' + this.twoDigit(m.fromDay);
										}
										if (intervalChoices.indexOf(m.intervalId) > -1) {
												toDate = (m.toMonth < 7 ? schoolYear.yearInt : schoolYear.yearInt-1*1) + '-' + this.twoDigit(m.toMonth) + '-' + this.twoDigit(m.toDay);
										}
								})
                course['fromDate'] = fromDate && fromDate.indexOf('null') === -1 ? fromDate : '';
                course['toDate'] = toDate && toDate.indexOf('null') === -1 ? toDate : '';
						}
				}
				//Convert array of intervalIds to an array of interval objects with intervalId for the database structure.
				intervalChoices = intervalChoices && intervalChoices.length > 0 && intervalChoices.reduce((acc, m) => {
            if (typeof m === 'string') {
                acc = acc && acc.length > 0 ? acc.concat(m) : [m];
            } else if (m && m.intervalId) {
                acc = acc && acc.length > 0 ? acc.concat(m.intervalId) : [m.intervalId];
            }
						return acc;
				},[]);

        course['intervals'] = intervalChoices;
        this.setState({ course })
		}

		twoDigit = (number) => {
				if (number < 10) return '0' + number;
				return number;
		}

		hasConsecutiveIntervals = () => {
        const {intervals} = this.props;
        const {course} = this.state;
				//1. Loop through the intervals
				//2. If the first chosen interval has already been found and the selectedLoopIndex is not greater than the count,
				//		 if this intervalId does not match the next selected intervalId
				//				set isConsecutive to false
				//		 increment the selectedLoopIndex by one
				//   else, When the first chosen interval is found,
				//		 set foundFirst to true.
				//	   set selectedLoopIndex to the index
				let loopCount = 1;
        let selectedIntervals = course.intervals;
				if (selectedIntervals.length === 1) return true;
				let foundFirst = false;
				let selectedLoopIndex = null;
				let isConsecutive = true;
				for(let index = 0; index <= intervals.length; index++) {
						if (foundFirst && loopCount < selectedIntervals.length) {
								if (intervals[index].id !== selectedIntervals[selectedLoopIndex+1*1]) isConsecutive = false;
								selectedLoopIndex++;
								loopCount++;
						} else if (!foundFirst) {
								if (selectedIntervals.indexOf(intervals[index].id) > -1) {
										foundFirst = true;
										selectedLoopIndex = index;
								}
						}
				}
				return isConsecutive;
		}

		render() {
      const {durationOptions, facilitators, campusLocationOptions, companyConfig={}, classPeriods, intervals, standardsRatings,
							baseCourses, courseTypes, schoolYears} = this.props;
      const {course={}, errors={}, isShowingModal_dateWarning, isShowingModal_deleteDate, isShowingModal_instructions, instructions, showMoreInfo,
              isShowingModal_showList, gradeScaleList, gradeScaleName} = this.state;

			let gradeScaleTables = this.props.gradeScaleTables && this.props.gradeScaleTables.length > 0 && this.props.gradeScaleTables.map(m => {
          m.id = m.gradeScaleTableId;
          m.label = <div className={styles.row}>{m.gradeScaleName}<div onClick={(event) => this.handleGradeScaleListOpen(m.gradeScaleTableId, event)} className={classes(globalStyles.link, styles.viewList)}>{'view list'}</div></div>;
          return m;
			});

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                  {`Course Section Entry`}
                </div>
                {!course.courseScheduledId &&
    								<div>
    										<SelectSingleDropDown
    												id={`courseEntryId`}
    												name={`courseEntryId`}
    												label={`Base Courses`}
    												value={course.courseEntryId || ''}
    												options={baseCourses}
    												className={styles.moreBottomMargin}
    												height={`medium`}
    												onChange={this.updateBaseCourse}/>
    								</div>
                }
                <div className={styles.formLft}>
										<TextDisplay label={<L p={p} t={`Course name`}/>} text={course.courseName || '  - -'} className={styles.noLeft}/>
                    <TextDisplay label={<L p={p} t={`Subject/Discipline`}/>} text={course.learningPathwayName || '  - -'} className={styles.noLeft}/>
										<TextDisplay label={<L p={p} t={`Description`}/>} text={course.description || '  - -'} className={styles.noLeft}/>
										{false && <TextDisplay label={<L p={p} t={`Sub discipline (optional)`}/>} text={course.learningFocusAreaName || '  - -'} className={styles.noLeft}/>}
                    <TextDisplay label={`Grading type`} text={
                        course.gradingType === 'STANDARDSRATING'
                            ? 'Standards-based'
                            : course.gradingType === 'PASSFAIL'
                                ? 'Pass/Fail'
                                : 'Traditional'} className={styles.noLeft}
                    />
                    {course.gradingType === 'STANDARDSRATING' &&
                        <TextDisplay label={`Grading type`} className={styles.noLeft}
                            text={<GradingRatingLegend standardsRatings={standardsRatings} gradingType={'STANDARDSRATING'} standardsRatingTableId={course.standardsRatingTableId}/>} />
                    }
										<SelectSingleDropDown
                        id={`courseTypeId`}
                        name={`courseType`}
                        label={<L p={p} t={`Course Type`}/>}
                        value={course.courseTypeId || ''}
                        options={courseTypes}
                        className={styles.moreBottomMargin}
                        height={`medium`}
                        onChange={this.changeCourse}
                        onEnterKey={this.handleEnterKey}
												required={true}
												whenFilled={course.courseTypeId}
                        error={errors.courseType} />
										<hr />
										<SelectSingleDropDown
                        id={`schoolYearId`}
                        label={<L p={p} t={`School Year`}/>}
                        value={course.schoolYearId || ''}
                        options={schoolYears || []}
                        height={`medium`}
                        onChange={this.changeCourse}
												className={styles.moreBottomMargin}
												required={true}
												whenFilled={course.schoolYearId}
                        error={errors.schoolYear} />
										<CheckboxGroup
												name={'intervalId'}
												label={<L p={p} t={`Interval duration`}/>}
												options={intervals}
												horizontal={false}
												className={styles.labelTypes}
												labelClass={styles.labelTypes}
												onSelectedChanged={this.changeIntervals}
												selected={course.intervals || []}
												required={true}
												whenFilled={course.intervals && course.intervals.length > 0}
												error={errors.interval}/>
										<hr />
                    <div className={styles.moreBottomMargin}>
    										<InputDataList
    												label={<L p={p} t={`Teacher`}/>}
    												name={'teachers'}
    												options={facilitators}
                            listAbove={true}
    												value={course.teachers}
    												height={`medium`}
    												maxwidth={`mediumshort`}
    												multiple={true}
    												className={styles.teacherList}
    												required={true}
    												whenFilled={course.teachers && course.teachers.length > 0}
    												onChange={this.changeTeacher}
    												error={errors.facilitator}/>
                    </div>
                    <hr/>
										<RadioGroup
												data={gradeScaleTables || []}
												label={<L p={p} t={`Grading scale`}/>}
												name={'gradeScaleTableId'}
												horizontal={true}
												className={styles.radio}
												labelClass={styles.radioLabels}
												radioClass={styles.radioClass}
												initialValue={course.gradeScaleTableId || ''}
												onClick={(value) => this.handleRadioChoice('gradeScaleTableId', value)}
												error={errors.gradingScale}/>
										<hr />
										{companyConfig.urlcode === 'Liahona' &&
												<div>
														{showMoreInfo
																? <div onClick={this.toggleMoreInfo} className={styles.row}><div className={styles.moreInfo}>Less info...</div><Icon pathName={'caret_2'} premium={true} className={styles.flipped}/></div>
																: <div onClick={this.toggleMoreInfo} className={styles.row}><div className={styles.moreInfo}>More info...</div><Icon pathName={'caret_2'} premium={true} className={styles.notFlipped}/></div>
														}
												</div>
										}
										{(showMoreInfo || companyConfig.urlcode !== 'Liahona') &&
												<div>
														<InputText
				                        size={"short"}
				                        id={"code"}
				                        name={"code"}
				                        label={<L p={p} t={`Course code (optional)`}/>}
				                        value={typeof course.code === 'string' ? course.code : ''}
				                        onChange={this.changeCourse}/>
														<InputText
				                        size={"short"}
				                        id={"section"}
				                        name={"section"}
				                        label={<L p={p} t={`Section (optional)`}/>}
				                        value={course.section || ''}
				                        onChange={this.changeCourse}/>
														<InputText
				                        size={"super-short"}
				                        id={"maxSeats"}
				                        name={"maxSeats"}
																numberOnly={true}
				                        label={<L p={p} t={`Number of seats available`}/>}
				                        value={course.maxSeats || ''}
				                        onChange={this.changeCourse}/>
														<hr />

				                    {companyConfig.urlcode !== 'Liahona' && <div className={styles.subHeader}><L p={p} t={`Location`}/></div>}
														{companyConfig.urlcode !== 'Liahona' &&
																<div>
																		<RadioGroup
								                        data={campusLocationOptions || []}
								                        name={`campusLocation`}
								                        horizontal={true}
								                        className={styles.radio}
								                        labelClass={styles.radioLabels}
								                        radioClass={styles.radioClass}
								                        initialValue={course.onCampus ? 'onCampus' : course.offCampus ? 'offCampus' : 'onCampus'}
								                        onClick={this.handleCampusLocation}/>

								                    <Checkbox
								                        id={`online`}
								                        label={<L p={p} t={`Online`}/>}
								                        checked={course.online || ''}
								                        onClick={(event) => this.toggleCheckbox('online', event)}
								                        labelClass={styles.labelCheckbox}
								                        className={styles.checkbox} />
								                    <Checkbox
								                        id={`selfPaced`}
								                        label={<L p={p} t={`Self-paced`}/>}
								                        checked={course.selfPaced || ''}
								                        onClick={(event) => this.toggleCheckbox('selfPaced', event)}
								                        labelClass={styles.labelCheckbox}
								                        className={styles.checkbox} />
																</div>
														}
				                    <InputText
				                        size={"medium"}
				                        id={"location"}
				                        name={"location"}
				                        label={<L p={p} t={`Location description (optional)`}/>}
				                        value={course.location || ''}
				                        onChange={this.changeCourse}
				                        error={errors.location}/>
												</div>
										}
                    <hr />
                    <span className={styles.error}>{errors.schedule}</span>
                    <div className={styles.classification}>SCHEDULE</div>
										<div className={styles.headerLabel}>
												<L p={p} t={`Attendance date range`}/>
										</div>
										<div className={styles.row}>
                        <div className={styles.dateColumn}>
                            <DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} required={true} whenFilled={course.fromDate}
																value={course.fromDate ? course.fromDate === '1900-01-01' ? '' : course.fromDate : ''}
                                maxDate={course.toDate ? course.toDate : ''}
                                onChange={(event) => this.setDate(`fromDate`, event.target.value)}
																error={errors.fromDate}/>
                            <span className={styles.error}>{errors.fromDate}</span>
                        </div>
                        <div className={styles.dateColumn}>
                            <DateTimePicker id={`toDate`}  label={<L p={p} t={`To date`}/>} required={true} whenFilled={course.toDate}
																value={course.toDate ? course.toDate === '1900-01-01' ? '' : course.toDate : ''}
                                minDate={course.fromDate ? course.fromDate : ''}
                                onChange={(event) => this.setDate(`toDate`, event.target.value)}
																error={errors.toDate}/>
                            <span className={styles.error}>{errors.toDate}</span>
                        </div>
                    </div>
										<hr />
										<div className={styles.headerLabel}>
												<L p={p} t={`Days and class period`}/>
										</div>
										<div className={styles.moreLeft}>
												<ScheduleCourseDayTime companyConfig={companyConfig} daysScheduled={course.daysScheduled}
														setDaySchedule={this.setDaySchedule} classPeriods={classPeriods} durationOptions={durationOptions}/>
										</div>
                </div>
                <hr/>
                {course.courseEntryIsInactive &&
                    <div className={classes(styles.moreLeft, styles.label)}><L p={p} t={`This course is marked as inactive on the base course level`}/></div>
                }
                <Checkbox
                    id={'isInactive'}
                    label={<L p={p} t={`Do not display this scheduled course to others (admin only)`}/>}
                    checked={course.isInactive || false}
                    onClick={(event) => this.toggleCheckbox('isInactive', event)} />

                <div className={styles.rowRight}>
										<div className={classes(globalStyles.link, styles.moreTop)} onClick={this.sendBack}>Cancel</div>
										<div>
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("FINISH", event)}/>
										</div>
                </div>
            </div>
            <OneFJefFooter />
            {isShowingModal_deleteDate &&
                <MessageModal handleClose={this.handleDeleteDateClose} heading={<L p={p} t={`Remove this specific date?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this specific date?`}/>} isConfirmType={true}
                   onClick={this.handleDeleteDate} />
            }
						{isShowingModal_instructions &&
								<MessageModal handleClose={this.handleInstructionsClose} heading={<L p={p} t={`Check your entry for missing information`}/>}
									 explainJSX={instructions} onClick={this.handleInstructionsClose} />
						}
            {isShowingModal_dateWarning &&
								<MessageModal handleClose={this.handleMissingDateWarningClose} heading={<L p={p} t={`From Date or To Date Missing`}/>} isConfirmType={true}
									 explainJSX={<L p={p} t={`The From Date and the To Date are necessary for attendance date ranges.  Are you sure you want to submit this new course section without a date range?`}/>}
                   onClick={this.handleMissingDateWarningSubmit} />
						}
						{isShowingModal_showList &&
                <MessageModal handleClose={this.handleGradeScaleListClose} heading={<div className={styles.boldText}>{gradeScaleName}</div>}
                   explain={gradeScaleList} onClick={this.handleGradeScaleListClose} />
            }
        </div>
    )};
}

export default withAlert(CourseToScheduleView);

//toggleDataClearinghouseInfo = () => this.setState({ showDataClearinghouseInfo: !this.state.showDataClearinghouseInfo });

// {showDataClearinghouseInfo
//     ? <div onClick={this.toggleDataClearinghouseInfo} className={styles.row}><div className={styles.moreInfo}>Less info...</div><Icon pathName={'caret_2'} premium={true} className={styles.flipped}/></div>
//     : <div onClick={this.toggleDataClearinghouseInfo} className={styles.row}><div className={styles.moreInfo}>More info...</div><Icon pathName={'caret_2'} premium={true} className={styles.notFlipped}/></div>
// }
// <hr />
// {showDataClearinghouseInfo &&
//     <div>
// 				<div className={styles.classification}>Data Clearinghouse Course Master Record</div>
// 				<InputText
// 						size={"short"}
// 						id={"administrativeWhereTaught"}
// 						name={"administrativeWhereTaught"}
// 						label={"Administrative Where Taught"}
// 						value={course.administrativeWhereTaught || ''}
// 						instructions={'Enter the state Id for the district'}
// 						onChange={this.changeCourse}/>
// 				<InputText
//             size={"short"}
// 						id={"schoolWhereTaught"}
// 						name={"schoolWhereTaught"}
// 						label={"School Where Taught"}
// 						value={course.schoolWhereTaught || ''}
// 						inputClassName={styles.moreBottomMargin}
// 						instructions={'Enter the state Id for the district'}
// 						onChange={this.changeCourse}/>
//
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'GPA'}
// 						name={`excludeFromGPA`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromGPA || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromGPA', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Class Rank'}
// 						name={`excludeFromClassRank`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromClassRank || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromClassRank', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Honor Roll'}
// 						name={`excludeFromHonorRoll`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromHonorRoll || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromHonorRoll', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Use the Course for Lunch'}
// 						name={`useTheCourseForLunch`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.useTheCourseForLunch || false}
// 						onClick={(value) => this.handleRadioChoice('useTheCourseForLunch', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Grade Report'}
// 						name={`excludeOnGradeReport`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeOnGradeReport || false}
// 						onClick={(value) => this.handleRadioChoice('excludeOnGradeReport', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'State Reports'}
// 						name={`excludeFromStateReports`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromStateReports || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromStateReports', value)}/>
//
// 				<div>
// 						<SelectSingleDropDown
// 								id={`grantingCreditCollegeId`}
// 								name={`grantingCreditCollegeId`}
// 								label={`College Granting Credit`}
// 								value={course.grantingCreditCollegeId || ''}
// 								options={colleges}
// 								className={styles.moreBottomMargin}
// 								height={`medium`}
// 								onChange={this.changeCourse}/>
// 				</div>
// 				<div>
// 						<SelectSingleDropDown
// 								id={`whereTaughtCampus`}
// 								name={`whereTaughtCampus`}
// 								label={`Where Taught Campus`}
// 								value={course.whereTaughtCampus || ''}
// 								options={whereTaughtCampus}
// 								className={styles.moreBottomMargin}
// 								height={`medium`}
// 								onChange={this.changeCourse}/>
// 				</div>
// 				<div>
// 						<SelectSingleDropDown
// 								id={`instructionalSetting`}
// 								name={`instructionalSetting`}
// 								label={`Instructional Setting`}
// 								value={course.instructionalSetting || ''}
// 								options={instructionalSettings}
// 								className={styles.moreBottomMargin}
// 								height={`medium`}
// 								onChange={this.changeCourse}/>
// 				</div>
//   </div>
// }
