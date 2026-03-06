import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './LearnerCourseAssignView.css';
const p = 'LearnerCourseAssignView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import { Link } from 'react-router';
import StudentClipboard from '../../components/StudentClipboard';
import CourseClipboard from '../../components/CourseClipboard';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import moment from 'moment';
import { withAlert } from 'react-alert';

class LearnerCourseAssignView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRecordComplete: false,
            errorCourse: '',
            errorLearner: '',
            conflicts: '',
						studentPersonId: '', //Ths is used to pick up the props.params.studentPersonId when it comes in through componentDidUpdate
            selectedCourses: [], //Same as selectedLearners note above.
            assign: {
                learners: props.personal ? [[{id: props.personId}]] : props.params && props.params.studentPersonId ? [[{id: props.params.studentPersonId}]] : [],
                courses: [],
            },
            calendarConflicts: [],
						filters: {
								birthDateFrom: '',
								birthDateTo: '',
								courseScheduledId: '',
								learningPathwayId: '',
								selectedLearnerOutcomeTargets: '',
								loProficient: '',
								loInProgress: '',
								loNotStarted: '',
								learningFocusAreaId: '',
								facilitatorPersonId: '',
								mentorPersonId: '',
								selectedGradeLevels: [],
						}
        }
    }

    removeCourse = (id) => {
        let assign = this.state.assign;
        let selectedCourses = [...this.state.selectedCourses];
        assign.courses = assign.courses.filter(row => row[0].id !== id);
        selectedCourses = selectedCourses.filter(m => m !== id);
        this.setState({ selectedCourses, assign });
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The course clipboard had 1 record removed.`}/></div>)
    }

    showSchedule = (schedule={}) => {
      //1. If there is a reoccuring schedule:
      //    a. Show M-T-W, etc.
      //    b. Provide the Date, start time and duration.
      //2. Else If there is a specific date
      //    a. Show the first date, start time, and duration.
      let result = [];
      let weekdayDivider = <span></span>;
      if (!!schedule && schedule.reoccurring && schedule.reoccurring.fromDate) {
	        if (schedule.reoccurring.weekdays.monday) {
	          result[result.length] = <L p={p} t={`M`}/>;
	          weekdayDivider = <span>-</span>;
	        }
	        if (schedule.reoccurring.weekdays.tuesday) {
	          result[result.length] = weekdayDivider
             result[result.length] = <L p={p} t={`T`}/>
	          weekdayDivider = <span>-</span>;
	        }
	        if (schedule.reoccurring.weekdays.wednesday) {
	          result[result.length] = weekdayDivider
             result[result.length] = <L p={p} t={`W`}/>
	          weekdayDivider = <span>-</span>;
	        }
	        if (schedule.reoccurring.weekdays.thursday) {
	          result[result.length] = weekdayDivider
             result[result.length] = <L p={p} t={`Th`}/>
	          weekdayDivider = <span>-</span>;
	        }
	        if (schedule.reoccurring.weekdays.friday) {
	          result[result.length] = weekdayDivider
             result[result.length] = <L p={p} t={`F`}/>
	        }

	        if (result) result[result.length] = <span> </span>;

	        result[result.length] = moment(schedule.reoccurring.fromDate).format("D MMM YYYY");
	        result[result.length] = <span> </span>
          result[result.length] = moment(schedule.reoccurring.startTime).format("h:mm a");
	        result[result.length] = <span> </span>
          result[result.length] = schedule.reoccurring.duration + ' min';

      } else if (!!schedule && schedule.specificDates) {
          let indexNext = 0;
          let now = new Date();
          schedule.specificDates && schedule.specificDates.length > 0 && schedule.specificDates.forEach((m, i) => {
              let compareDate = new Date(m.specificDate);
              if (!indexNext && compareDate > now) {
                  indexNext = i;
              }
          })
          result[result.length] = moment(schedule.specificDates[indexNext].specificDate).format("D MMM YYYY");
          result[result.length] = <span> </span>
          result[result.length] = moment(schedule.specificDates[indexNext].startTime).format("h:mm a");
          result[result.length] = <span> </span>
          result[result.length] = schedule.specificDates[indexNext].duration + ' min';
      }
      return result;
    }

    showNextButton = () => {
      const {course} = this.state;
      if (course.courseName && course.emailAddress) {
          this.setState({isRecordComplete: true});
      } else {
          this.setState({isRecordComplete: false});
      }
    }

    processForm = (event) => {
	      const {personId, addLearnerCourseAssign, addLearnerCourseRecommended, companyConfig, clipboardStudents, clipboardCourses,
								 courseListType, removeAllCourseClipboard, accessRoles} = this.props;
	      // prevent default action. in this case, action is the form submission event
	      event && event.preventDefault();
	      let hasError = false;

	      if (!clipboardStudents || clipboardStudents.length === 0) {
	          hasError = true;
	          this.setState({errorLearners: <L p={p} t={`At least one student is required`}/> });
	      }
	      if (!clipboardCourses || clipboardCourses.length === 0) {
	          hasError = true;
	          this.setState({errorCourses: <L p={p} t={`At least one course is required`}/> });
	      }
	      if (!hasError) {
						let studentIds = clipboardStudents.map(m => m.id);
						let courseIds = clipboardCourses.map(m => courseListType === 'courseEntry' || (companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor))
								? m.courseEntryId
								: m.courseScheduledId);
						companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor)
	          		? addLearnerCourseRecommended(personId, studentIds, courseIds)
								: addLearnerCourseAssign(personId, studentIds, courseIds)

	          this.setState({
		            isRecordComplete: false,
		            errorCourse: '',
		            errorLearner: '',
		            assign: {
		            },
	          });
						removeAllCourseClipboard(personId, courseListType);
						this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The course has been assigned.  The courses will be deleted from the clipboard.`}/></div>)
	      }
    }

		handleRemoveSingleStudentClipboard = (studentPersonId) => {
				const {removeStudentUserPersonClipboard, personId} = this.props;
				let announcement = this.state.announcement;
				if (announcement) announcement.recipients = announcement.recipients.filter(r => r.personId !== studentPersonId);
				this.setState({ announcement });
				removeStudentUserPersonClipboard(personId, studentPersonId, 'STUDENT')
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The student clipboard had 1 record removed.`}/></div>)
		}

		handleRemoveSingleCourseClipboard = (chosenCourseId) => {
				const {singleRemoveCourseClipboard, personId, courseListType} = this.props;
				singleRemoveCourseClipboard(personId, chosenCourseId, courseListType);
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The course clipboard had 1 record removed.`}/></div>)
		}

		handleRemoveAllStudents = () => {
				const {personId, removeAllUserPersonClipboard, clipboardStudents} = this.props;
				let announcement = this.state.announcement;
				announcement && clipboardStudents && clipboardStudents.length > 0 && clipboardStudents.forEach(m => {
						announcement.recipients = announcement.recipients.filter(r => r.personId !== m.personId);
				});
				this.setState({ announcement });
				removeAllUserPersonClipboard(personId, 'STUDENT');
		}

		render() {
      const {personId, timeTarget, personal, studentPersonId, companyConfig={}, accessRoles, gradeLevels, clipboardStudents, clipboardCourses,
							courseListType, setStudentsSelected, removeAllCourseClipboard, myFrequentPlaces, setMyFrequentPlace, fetchingRecord,
							getStudentSchedule } = this.props;
      const {errorCourses, errorLearners} = this.state;

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom, styles.row)}>
                    {companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor)
												? <L p={p} t={`Recommend Courses to Students`}/>
												: <L p={p} t={`Assign Courses to Students`}/>
										}
										<Link to={`/studentSchedule/0`} className={classes(styles.row, styles.text, styles.moreLeft, styles.white)}>
												<Icon pathName={'clock3'} premium={true} className={styles.icon} fillColor={'white'}/>
												<L p={p} t={`See a student's schedule`}/>
										</Link>
                </div>
								<div className={classes(globalStyles.instructionsBigger, styles.instructionWidth)}>
										<L p={p} t={`Instructions: This page contains two separate clipboards.`}/>&nbsp;
										<L p={p} t={`One for students and one for courses.`}/>&nbsp;
										<L p={p} t={`Click on 'Choose students' to go to the student list to select one or more students.`}/>&nbsp;
										<L p={p} t={`Then go to the course list page to select courses.`}/>&nbsp;
										<L p={p} t={`Those two selections are gathered on this page to allow you to assign many students to many courses at one time.`}/>&nbsp;
								</div>
                {((!timeTarget && !personal && !studentPersonId) || accessRoles.admin) &&
                  <div>
                    <div className={styles.classification}>{`Students`}</div>
                    <span className={styles.error}>{errorLearners}</span>
										<StudentClipboard students={clipboardStudents} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
												setStudentsSelected={setStudentsSelected} hideIcons={true} personId={personId} emptyMessage={<L p={p} t={`No students chosen`}/>}
												includeRemoveClipboardIcon={false} singleRemoveFromClipboard={this.handleRemoveSingleStudentClipboard}
												removeAllUserPersonClipboard={this.handleRemoveAllStudents} isFetchingRecord={fetchingRecord.studentClipboard}
												getStudentSchedule={getStudentSchedule}/>
                    <hr />
                  </div>
                }
                <div className={styles.classification}>{'Courses'}</div>
                <span className={styles.error}>{errorCourses}</span>
								<CourseClipboard courses={clipboardCourses} companyConfig={companyConfig} courseListType={courseListType}
										hideIcons={true} personId={personId} emptyMessage={<L p={p} t={`No courses chosen`}/>} accessRoles={accessRoles}
										includeRemoveClipboardIcon={false} singleRemove={this.handleRemoveSingleCourseClipboard}
										removeAllCourseClipboard={removeAllCourseClipboard} isFetchingRecord={fetchingRecord.courseClipboard}/>
                <hr />
                <div className={classes(styles.rowRight)}>
										<div className={styles.cancelLink} onClick={() => browserHistory.push('/firstNav')}>
												<L p={p} t={`Close`}/>
										</div>
										<div>
                    		<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} disabled={!(clipboardStudents && clipboardStudents.length > 0 && clipboardCourses && clipboardCourses.length > 0)} onClick={this.processForm}/>
										</div>
                </div>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Assign Courses to Students`}/>} path={'learnerCourseAssign'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
        </div>
    )};
}

export default withAlert(LearnerCourseAssignView);
