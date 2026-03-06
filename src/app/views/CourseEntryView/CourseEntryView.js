import React, {Component} from 'react';
import styles from './CourseEntryView.css';
const p = 'CourseEntryView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import { browserHistory, Link } from 'react-router';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import RadioGroup from '../../components/RadioGroup';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import InputDataList from '../../components/InputDataList';
import InputTextArea from '../../components/InputTextArea';
import Checkbox from '../../components/Checkbox';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import {guidEmpty} from '../../utils/guidValidate.js';
import classes from 'classnames';

class CourseEntryView extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isRecordComplete: false,
        errorCourseName: '',
        errorLearningPathway: '',
        errorLearnerOutcomes: '',
        errorLearningFocusArea: '',
        errorFacilitator: '',
        errorLocation: '',
        errorSchedule: '',
				errorCredits: '',
        selectedLearnerOutcomeTargets: [],
        course: {
            courseName: '',
            learningPathwayId: '',
            learnerOutcomesList: [],
            learningFocusAreaId: '',
        },
      }
    }

    componentDidMount() {
      if (!!this.props.courseEntry) {
          this.setState({ course: this.props.courseEntry });
      }
			//document.getElementById('courseName').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    }

    componentDidUpdate(prevProps) {
      const {resolveFetchingRecordCourses, fetchingRecord, courseEntry, thisCoursePrerequisites} = this.props;
      const {isInit, localCoursePrerequisites} = this.state;
      if ((prevProps.courseEntry !== courseEntry) || (fetchingRecord && fetchingRecord.courses === "ready")) {
          //Make sure that the course.code is not an object but just a string.
          if (typeof courseEntry.code !== 'string') courseEntry.code = '';

          this.setState({ course: courseEntry });
          resolveFetchingRecordCourses();
      }
      if (!isInit && localCoursePrerequisites !== thisCoursePrerequisites) {
          this.setState({ isInit: true, localCoursePrerequisites: thisCoursePrerequisites });
      }
    }

    changeCourse = (event) => {
        const field = event.target.name;
        const course = Object.assign({}, this.state.course);
        course[field] = event.target.value;
        this.setState({ course });
    }

    toggleCheckbox = () => {
        const course = Object.assign({}, this.state.course);
        course.isInactive = !course.isInactive;
        this.setState({ course });
    }

		isDuplicateName = (courseName, code) => {
				const {courses, courseEntry} = this.props;
				if (!courseEntry || courseEntry.length === 0) return false;
				let duplicateName = courses && courses.length > 0 && courses.filter(m => m.courseName === courseName && m.code === code && m.courseEntryId !== courseEntry.courseEntryId)[0];
				return duplicateName && duplicateName.courseName ? true : false;
		}

    processForm = () => { //, event
      const {addOrUpdateCourse, personId, getCoursePrerequisites} = this.props;
      const {localCoursePrerequisites} = this.state;
      let course = Object.assign({}, this.state.course);
      let missingInfoMessage = [];
      if (typeof course.code !== 'string') course.code = '';

      if (!course.courseName) {
          this.setState({errorCourseName: <L p={p} t={`Course name is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Course name`}/></div>
      }
      if (!course.learningPathwayId) {
          this.setState({errorLearningPathway: <L p={p} t={`Please choose discipline (subject)`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Discipline (subject)`}/></div>
      }
			// if (!course.credits) {
      //     hasError = true;
      //     this.setState({errorCredits: "Please enter a credit amount for this course" });
      // }

			if (course.gradingType === 'STANDARDSRATING' && (!course.standardsRatingTableId || course.standardsRatingTableId === guidEmpty)) {
					this.setState({errorStandardsRating: <L p={p} t={`Standards rating scale is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Standards rating scale is required`}/></div>
			}

			if (!course.fromGradeLevelId) {
	        this.setState({errorFromGradeLevelId: <L p={p} t={`Required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From grade level`}/></div>
	    }

			if (!course.toGradeLevelId) {
	        this.setState({errorToGradeLevelId: <L p={p} t={`Required`}/>});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To grade level`}/></div>
	    }

      if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
          // if (this.isDuplicateName(course.courseName, course.code)) {
          //     send an alert to the user ... just an alert that comes up as info and it doesn't stop them.
          // }
          //We need to interpret the id/label value pair to the courseEntryIdand courseName in order to send it to the server for saving.
          //First list, if any
          let prerequisitesReceive = {};
          if (localCoursePrerequisites) {
              prerequisitesReceive.firstList = localCoursePrerequisites.firstList && localCoursePrerequisites.firstList.length > 0 && localCoursePrerequisites.firstList.reduce((acc, m) => {
                  let option = {
                    courseEntryId: m.id,
                    courseName: m.label,
                  }
                  return acc && acc.length > 0 ? acc.concat(option) : [option];
              }, []);

              //Second list, if any
              prerequisitesReceive.secondList = localCoursePrerequisites.secondList && localCoursePrerequisites.secondList.length > 0 && localCoursePrerequisites.secondList.reduce((acc, m) => {
                  let option = {
                    courseEntryId: m.id,
                    courseName: m.label,
                  }
                  return acc && acc.length > 0 ? acc.concat(option) : [option];
              }, []);

              //Third list, if any
              prerequisitesReceive.thirdList = localCoursePrerequisites.thirdList && localCoursePrerequisites.thirdList.length > 0 && localCoursePrerequisites.thirdList.reduce((acc, m) => {
                  let option = {
                    courseEntryId: m.id,
                    courseName: m.label,
                  }
                  return acc && acc.length > 0 ? acc.concat(option) : [option];
              }, []);

              if (!prerequisitesReceive.firstList) prerequisitesReceive.firstList = [];
              if (!prerequisitesReceive.secondList) prerequisitesReceive.secondList = [];
              if (!prerequisitesReceive.thirdList) prerequisitesReceive.thirdList = [];
          }

          delete course.codeDisplay;
          delete course.icons;
          delete course.name;
          delete course.content;
          delete course.creditsDisplay;
          delete course.contentArea;
          delete course.gradeLevels;
          delete course.classRank;
          delete course.content;
          delete course.contentArea;
          delete course.courseForLunch;
          delete course.creditsDisplay;
          delete course.gpa;
          delete course.gradeReport;
          delete course.honorRoll;
          delete course.stateId;
          delete course.stateReports;
          course.prerequisitesReceive = prerequisitesReceive;
          addOrUpdateCourse(personId, course, () => getCoursePrerequisites(personId));
          browserHistory.push(`/baseCourses`)
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
      }
    }

    handleSelectedLearnerOutcomeTargets = (selectedLearnerOutcomeTargets) => {
        this.setState({selectedLearnerOutcomeTargets});
    }

    handleSelectedLearnerOutcomes = (selectedLearnerOutcomes) => {
        let course = this.state.course;
        course.learnerOutcomesList = selectedLearnerOutcomes;
        this.setState({ course });
    }

    learnerOutcomesValueRenderer = (selected, options) => {
        return <L p={p} t={`Learner Outcomes:  ${selected.length} of ${options.length}`}/>;
    }

    learnerOutcomeTargetsValueRenderer = (selected, options) => {
        return <L p={p} t={`Grade Targets (FILTER for learner outcomes):  ${selected.length} of ${options.length}`}/>;
    }

		handleRadioChoice = (field, value) => {
				const {standardsRatingTables} = this.props;
				let course = Object.assign({}, this.state.course);
				course[field] = value;
				if (field === 'gradingType' && value === 'STANDARDSRATING' && standardsRatingTables && standardsRatingTables.length === 1) {
						course['gradingType'] = 'STANDARDSRATING';
						course['standardsRatingTableId'] = standardsRatingTables[0].standardsRatingTableId;
				}
				this.setState({ course });
		}

		handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

		handleStandardsRatingChoice = (standardsRatingTableId) => {
				let course = Object.assign({}, this.state.course);
				course['standardsRatingTableId'] = standardsRatingTableId;
				this.setState({ course });
		}

    changePrerequisiteFirst = (values) =>  this.setState({ localCoursePrerequisites: {...this.state.localCoursePrerequisites, firstList: values } });
    changePrerequisiteSecond = (values) =>  this.setState({ localCoursePrerequisites: {...this.state.localCoursePrerequisites, secondList: values } });
    changePrerequisiteThird = (values) =>  this.setState({ localCoursePrerequisites: {...this.state.localCoursePrerequisites, thirdList: values } });

    render() {
      const {personId, myFrequentPlaces, setMyFrequentPlace, learningPathways, companyConfig={}, gradeLevels, standardsRatingTables, courses=[]} = this.props;
      const {course={}, errorCourseName, errorLearningPathway, messageInfoIncomplete, errorCredits, errorFromGradeLevelId, errorToGradeLevelId,
              isShowingModal_missingInfo, localCoursePrerequisites } = this.state;

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                  <L p={p} t={`Course Entry`}/>
                </div>
								<div className={classes(globalStyles.instructionsBigger, styles.maxWidth)}><L p={p} t={`A base course is intended to be used so that it can be scheduled multiple times.  The course content is created for a base course so that it does not have to be entered repetitively.  If the course content is going to vary, create another base course. A duplicate can be made from a base course with content and then the content can be modified.`}/></div>
                <div className={styles.formLeft}>
                    <InputText
                        id={`courseName`}
                        name={`courseName`}
                        size={"long"}
                        label={<L p={p} t={`Course name`}/>}
                        value={course.courseName || ''}
                        onChange={this.changeCourse}
												required={true}
												whenFilled={course.courseName}
                        error={errorCourseName} />
                    <SelectSingleDropDown
                        id={`learningPathwayId`}
                        name={`learningPathway`}
                        label={<L p={p} t={`Discipline (subject)`}/>}
                        value={course.learningPathwayId || ''}
                        options={learningPathways}
                        className={styles.moreBottomMargin}
                        height={`medium`}
                        onChange={this.changeCourse}
												required={true}
												whenFilled={course.learningPathwayId}
                        error={errorLearningPathway} />
                    <InputTextArea
                        label={<L p={p} t={`Description`}/>}
                        name={'description'}
                        value={course.description || ''}
                        autoComplete={'dontdoit'}
                        onChange={this.changeCourse}/>
										<InputText
                        id={`credits`}
                        name={`credits`}
                        size={'short'}
                        align={'right'}
												numberOnly={true}
                        label={<L p={p} t={`Credits (optional)`}/>}
                        value={course.credits || ''}
                        onChange={this.changeCourse}
                        error={errorCredits} />
										<InputText
                        id={`code`}
                        name={`code`}
                        size={"short"}
                        label={<L p={p} t={`Code (optional)`}/>}
                        value={typeof course.code !== 'string' ? '' : course.code}
                        onChange={this.changeCourse}
												maxLength={25}/>
										<hr/>
										<div className={classes(styles.moreLeft, styles.headLabel)}><L p={p} t={`Grade level range:`}/></div>
										<div className={classes(styles.moreLeft, styles.row)}>
												<div>
														<SelectSingleDropDown
																id={'fromGradeLevelId'}
																label={<L p={p} t={`From`}/>}
																value={course.fromGradeLevelId || ''}
																onChange={this.changeCourse}
																options={gradeLevels}
																height={'medium'}
																required={true}
																whenFilled={course.fromGradeLevelId}
																error={errorFromGradeLevelId}/>
												</div>
												<div>
														<SelectSingleDropDown
																id={'toGradeLevelId'}
																label={<L p={p} t={`To`}/>}
																value={course.toGradeLevelId || ''}
																onChange={this.changeCourse}
																options={gradeLevels}
																height={'medium'}
																required={true}
																whenFilled={course.toGradeLevelId}
																error={errorToGradeLevelId}/>
												</div>
										</div>
										<hr/>
										<RadioGroup
												data={[
														{id: 'TRADITIONAL', label: <L p={p} t={`Traditional`}/>},
														{id: 'STANDARDSRATING', label: <L p={p} t={`Standards-based`}/>},
														{id: 'PASSFAIL', label: <L p={p} t={`Pass / Fail`}/>}]}
												label={<L p={p} t={`Grading Type`}/>}
												name={`gradingType`}
												horizontal={true}
												className={styles.radio}
												labelClass={styles.radioLabels}
												radioClass={styles.radioClass}
												initialValue={course.gradingType || companyConfig.gradingType || 'TRADITIONAL'}
												onClick={(value) => this.handleRadioChoice('gradingType', value)}/>

										{course.gradingType === 'STANDARDSRATING' &&
												<div className={styles.moreLeft}>
														<div className={styles.muchLeft}>
																<RadioGroup
																		label={<L p={p} t={`Standards based rating scales`}/>}
																		data={standardsRatingTables || []}
																		name={`standardsRatingTables`}
																		horizontal={false}
																		className={styles.radio}
																		initialValue={course.standardsRatingTableId || ''}
																		onClick={this.handleStandardsRatingChoice}/>
														</div>
                            {(!standardsRatingTables || standardsRatingTables.length ===0) &&
                                <div className={classes(styles.moreLeft, globalStyles.errorText)}>
                                    <L p={p} t={`There are not any standards-based rating scales to choose from.  Please see your administrator.`}/>
                                </div>
                            }
												</div>
										}
										<hr/>
                    <div className={styles.prereqSection}>
                        <div className={styles.headLabel}><L p={p} t={`Prerequisites (optional)`}/></div>
                        <div className={styles.moreBottomMargin}>
        										<InputDataList
        												label={<L p={p} t={`Students must take one of these classes`}/>}
        												name={'firstList'}
        												options={courses}
                                listAbove={true}
        												value={(localCoursePrerequisites && localCoursePrerequisites.firstList) || []}
        												height={`medium`}
        												maxwidth={`mediumshort`}
        												multiple={true}
        												onChange={this.changePrerequisiteFirst}/>
                        </div>
                        <div className={styles.moreBottomMargin}>
        										<InputDataList
        												label={<L p={p} t={`AND students must take one of these classes`}/>}
        												name={'secondList'}
        												options={courses}
                                listAbove={true}
        												value={(localCoursePrerequisites && localCoursePrerequisites.secondList) || []}
        												height={`medium`}
        												maxwidth={`mediumshort`}
        												multiple={true}
        												onChange={this.changePrerequisiteSecond}/>
                        </div>
                        <div className={styles.moreBottomMargin}>
        										<InputDataList
        												label={<L p={p} t={`AND students must take one of these classes`}/>}
        												name={'thirdList'}
        												options={courses}
                                listAbove={true}
        												value={(localCoursePrerequisites && localCoursePrerequisites.thirddList) || []}
        												height={`medium`}
        												maxwidth={`mediumshort`}
        												multiple={true}
        												onChange={this.changePrerequisiteThird}/>
                        </div>
                    </div>

										{/*companyConfig.urlcode !== 'Liahona' &&
												<div>
														<InputText
																size={"short"}
																id={"stateCourseId"}
																name={"stateCourseId"}
																label={"State course id"}
																value={course.stateCourseId || ''}
																inputClassName={styles.moreBottomMargin}
																onChange={this.changeCourse}/>

														<RadioGroup
																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
																label={'GPA'}
																name={`excludeFromGPA`}
																horizontal={true}
																className={styles.radio}
																labelClass={styles.radioLabels}
																radioClass={styles.radioClass}
																initialValue={course.excludeFromGPA || false}
																onClick={(value) => this.handleRadioChoice('excludeFromGPA', value)}/>
														<RadioGroup
																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
																label={'Class Rank'}
																name={`excludeFromClassRank`}
																horizontal={true}
																className={styles.radio}
																labelClass={styles.radioLabels}
																radioClass={styles.radioClass}
																initialValue={course.excludeFromClassRank || false}
																onClick={(value) => this.handleRadioChoice('excludeFromClassRank', value)}/>
														<RadioGroup
																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
																label={'Honor Roll'}
																name={`excludeFromHonorRoll`}
																horizontal={true}
																className={styles.radio}
																labelClass={styles.radioLabels}
																radioClass={styles.radioClass}
																initialValue={course.excludeFromHonorRoll || false}
																onClick={(value) => this.handleRadioChoice('excludeFromHonorRoll', value)}/>
														<RadioGroup
																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
																label={'Use the Course for Lunch'}
																name={`useTheCourseForLunch`}
																horizontal={true}
																className={styles.radio}
																labelClass={styles.radioLabels}
																radioClass={styles.radioClass}
																initialValue={course.useTheCourseForLunch || false}
																onClick={(value) => this.handleRadioChoice('useTheCourseForLunch', value)}/>
														<RadioGroup
																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
																label={'Grade Report'}
																name={`excludeOnGradeReport`}
																horizontal={true}
																className={styles.radio}
																labelClass={styles.radioLabels}
																radioClass={styles.radioClass}
																initialValue={course.excludeOnGradeReport || false}
																onClick={(value) => this.handleRadioChoice('excludeOnGradeReport', value)}/>
														<RadioGroup
																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
																label={'State Reports'}
																name={`excludeFromStateReports`}
																horizontal={true}
																className={styles.radio}
																labelClass={styles.radioLabels}
																radioClass={styles.radioClass}
																initialValue={course.excludeFromStateReports || false}
																onClick={(value) => this.handleRadioChoice('excludeFromStateReports', value)}/>
												</div>
										*/}
                    <hr/>
                    <Checkbox
                        id={'isInactive'}
                        label={<L p={p} t={`Do not display this course to others (admin only)`}/>}
                        checked={course.isInactive || false}
                        onClick={this.toggleCheckbox}/>

		                <div className={classes(styles.row, styles.centerRowRight)}>
												<Link className={styles.cancelLink} to={'/baseCourses'}>Close</Link>
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}
														disabled={!(course.courseName && course.courseName.length > 3 && course.learningPathwayId && course.learningPathwayId !== "0")}/>
		                </div>
								</div>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Entry`}/>} path={'courseEntry'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
        </div>
    )};
}

export default CourseEntryView;
