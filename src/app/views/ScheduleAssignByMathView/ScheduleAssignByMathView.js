import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './ScheduleAssignByMathView.css';
const p = 'ScheduleAssignByMathView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import Checkbox from '../../components/Checkbox';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {doSort} from '../../utils/sort.js';

export default class ScheduleAssignByMathView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      scheduleAssignByMathId: '0',
      scheduleAssignByMathCourseAssignId: '',
		  selectedCourses: this.props.scheduleAssignByMathList,
			errorMathName: ''
    }
  }

	componentDidUpdate(prevProps) {
			if (prevProps.scheduleAssignByMathList !== this.props.scheduleAssignByMathList && this.state.selectedCourses !== this.props.scheduleAssignByMathList) {
					this.setState({ selectedCourses: this.props.scheduleAssignByMathList });
			}
	}

	isChosen = (courseScheduledId) => {
			const {selectedCourses} = this.state;
			return selectedCourses && selectedCourses.length > 0 && selectedCourses.indexOf(courseScheduledId) > -1 ? true : false;
	}

	toggleChoice = (courseScheduledId) => {
			let selectedCourses = [...this.state.selectedCourses];
			if (selectedCourses && selectedCourses.length > 0 && selectedCourses.indexOf(courseScheduledId) > -1) {
					selectedCourses.splice(selectedCourses.indexOf(courseScheduledId), 1);
			} else {
					selectedCourses = selectedCourses ? selectedCourses.concat(courseScheduledId) : [courseScheduledId];
			}

			this.setState({ selectedCourses })
	}

  processForm = (stayOrFinish) => {
      const {setScheduleAssignByMath, personId} = this.props;
      const {scheduleAssignByMathId, selectedCourses} = this.state;
      let hasError = false;

      if (!Number(scheduleAssignByMathId)) {
          hasError = true;
          this.setState({errorMathName: 'Please choose a math name' });
      }

      if (!hasError) {
          setScheduleAssignByMath(personId, selectedCourses, scheduleAssignByMathId);
          this.setState({ scheduleAssignByMathId: '', selectedCourses: [] });

					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/firstNav`)
		      }
      }
  }

  handleRemoveItemOpen = (courseScheduledId) => this.setState({isShowingModal_remove: true, courseScheduledId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {courseScheduledId} = this.state;
			let selectedCourses = [...this.state.selectedCourses];
			selectedCourses.splice(selectedCourses.indexOf(courseScheduledId), 1);
			this.setState({ selectedCourses });
      this.handleRemoveItemClose();
  }

  recallSchedule = (event) => {
	    const {getScheduleAssignByMath, personId} = this.props;
	    this.setState({scheduleAssignByMathId: event.target.value})
			if (event.target.value > 0) getScheduleAssignByMath(personId, event.target.value);
  }

	handleUpdateInterval = (event) => {
			const {personId, updatePersonConfig, getScheduleAssignByMath, getScheduleMathNames, getCoursesScheduled} = this.props;
			updatePersonConfig(personId, 'IntervalId', event.target.value,
					() => {
							getScheduleAssignByMath(personId, 0);
							getScheduleMathNames(personId);
							getCoursesScheduled(personId);
					}
			);
			this.setState({ scheduleAssignByMathId: '' });
			browserHistory.push('/scheduleAssignByMath');
	}

  render() {
    const {mathNames, scheduledCourses, personConfig, companyConfig, intervals, fetchingRecord} = this.props;
    const {isShowingModal_remove, scheduleAssignByMathId, errorMathName, selectedCourses} = this.state;

		//Scheduled headings and Data
		let scheduledHeadings = [{},
				{label: 'Name', tightText:true},
				{label: 'Type', tightText:true},
				{label: 'Interval', tightText:true},
				{label: 'Class period', tightText:true},
				{label: 'Teacher', tightText:true},
				{label: 'Location', tightText:true},
				{label: 'Campus', tightText:true},
				{label: 'Online', tightText:true},
				{label: 'Self-paced', tightText:true},
				{label: 'Weekdays', tightText:true},
				{label: 'Start time', tightText:true},
				{label: 'Duration', tightText:true},
				{label: 'Date range', tightText:true},
				{label: 'Specific dates', tightText:true},
		];

		let scheduledData = scheduledCourses && scheduledCourses.length > 0
				? scheduledCourses.map(m => {
							return [
									{ value: <Checkbox id={m.studentPersonId} checked={this.isChosen(m.courseScheduledId)} onClick={() => this.toggleChoice(m.courseScheduledId)}/>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.courseName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.courseTypeName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.intervalName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.classPeriodName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.facilitatorName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.location}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.onCampusName ? m.onCampusName : m.offCampusName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.onlineName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.selfPacedName}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.weekdaysText}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.startTimeText}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.durationText}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.dateRangeText}</a>},
									{ id: m.personId, value: <a className={styles.link} onClick={() => this.toggleChoice(m.courseScheduledId)}>{m.specificTextList}</a>},
							]})
				: [[{},{value: <span className={styles.noRecords}>{'no scheduled courses found'}</span>, colSpan: true}]];

		//Chosen courses headings and data
    let headings = [{},
				{label: 'Name', tightText:true},
				{label: 'Type', tightText:true},
				{label: 'Interval', tightText:true},
				{label: 'Class period', tightText:true},
				{label: 'Teacher', tightText:true},
				{label: 'Location', tightText:true},
				{label: 'Campus', tightText:true},
				{label: 'Online', tightText:true},
				{label: 'Self-paced', tightText:true},
				{label: 'Weekdays', tightText:true},
				{label: 'Start time', tightText:true},
				{label: 'Duration', tightText:true},
				{label: 'Date range', tightText:true},
				{label: 'Specific dates', tightText:true},
		];

    let data = [];

		let orderedCourses = Object.assign([], this.props.scheduledCourses);
		orderedCourses = doSort(orderedCourses, {isAsc: true, sortField: 'classPeriodName', isNumber: false});

		orderedCourses && orderedCourses.length > 0 && orderedCourses.forEach(m => {
			if (selectedCourses.indexOf(m.courseScheduledId) > -1) {
					data.push([
							{ value: <a onClick={() => this.handleRemoveItemOpen(m.courseScheduledId)} className={styles.remove}>remove</a>},
							{ value: m.courseName},
							{ value: m.courseTypeName},
							{ value: m.intervalName},
							{ value: m.classPeriodName},
							{ value: m.facilitatorName},
							{ value: m.location},
							{ value: m.onCampusName ? m.onCampusName : m.offCampusName},
							{ value: m.onlineName},
							{ value: m.selfPacedName},
							{ value: m.weekdaysText},
							{ value: m.startTimeText},
							{ value: m.durationText},
							{ value: m.dateRangeText},
							{ value: m.specificTextList},
					]);
			 }
	  });

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {'Schedule Assigned by Math'}
            </div>
						<div>
								<SelectSingleDropDown
										id={`intervalId`}
										label={`Semester`}
										value={personConfig.intervalId || companyConfig.intervalId}
										options={intervals}
										noBlank={true}
										height={`medium`}
										onChange={this.handleUpdateInterval}/>
						</div>
            <div>
                <SelectSingleDropDown
                    id={'mathName'}
                    value={scheduleAssignByMathId}
                    label={`Math Name Schedule`}
                    options={mathNames}
                    height={`medium`}
                    className={styles.singleDropDown}
                    onChange={this.recallSchedule}
										error={errorMathName}/>
            </div>
            <hr />
						<EditTable className={styles.lessBottom} labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}
								firstColumnClass={styles.firstColumnClass} isFetchingRecord={fetchingRecord.scheduleAssignByMath}/>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
								<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
						<hr />
						<EditTable labelClass={classes(styles.tableLabelClass, styles.moreBottomMargin)} headings={scheduledHeadings} data={scheduledData} noCount={true}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this scheduled period?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this scheduled period? (You will still need to click on the Submit button on the page itself in order to finalize the change to the list.)`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
      </div>
    );
  }
}
