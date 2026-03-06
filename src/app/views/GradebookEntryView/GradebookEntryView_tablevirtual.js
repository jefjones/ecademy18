import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {penspringHost} from '../../penspring_host.js';
const p = 'StudentScheduleView';
import L from '../../components/PageLanguage';
import styles from './GradebookEntryView.css';
import globalStyles from '../../utils/globalStyles.css';
import penspringSmall from '../../assets/Penspring_favicon.png';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import DateMoment from '../../components/DateMoment';
import MessageModal from '../../components/MessageModal';
import InputGradebookMultipleEntry from '../../components/InputGradebookMultipleEntry';
import Checkbox from '../../components/Checkbox';
import GradingRatingEntry from '../../components/GradingRatingEntry';
import GradingRatingLegend from '../../components/GradingRatingLegend';
import DocumentResponseModal from '../../components/DocumentResponseModal';
import ExcelGradebookEntry from '../../components/ExcelGradebookEntry';
import InputText from '../../components/InputText';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import TextDisplay from '../../components/TextDisplay';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import debounce from 'lodash/debounce';
import {doSort} from '../../utils/sort.js';
import { withAlert } from 'react-alert';
import ReactToPrint from "react-to-print";
import ContextKnowledgeRating from '../../components/ContextKnowledgeRating';
import TableVirtualFast from '../../components/TableVirtualFast';
import Paper from '@material-ui/core/Paper';
import Loading from '../../components/Loading';

class GradebookEntryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
						// origGradebook: {},
            // gradebook: {},
						showSearchControls: false,
            courseScheduledId: '',
						contentTypeId: '',
						singleAssignmentId: '',
						studentPersonId: '',
            showPercentScoreBoth: 'score',
            contentTypeCode: '',
						isShowingModal: false,
						isShowingModal_instructions: false,
						isShowingModal_response: false,
						isShowingModal_numberTooLarge: false,
						isShowingModal_finalizeGrade: false,
						showHideResponseTypes: false,
        }
    }

		componentDidMount() {
				document.addEventListener('scroll', this.handleScroll);
        document.addEventListener('keyup', this.checkEscapeKey);
        document.addEventListener('click', this.hideContextKnowledgeRatingMenu);
		}

		componentWillUnmount() {
				this.props.clearGradebook();
				document.removeEventListener('scroll', this.handleScroll);
				document.removeEventListener('keyup', this.checkEscapeKey);
        document.removeEventListener('click', this.hideContextKnowledgeRatingMenu);
		}

    componentDidUpdate(prevProps) {
				const {standardsRatings, courseScheduledId, personConfig} = this.props;
				const {sendToHiddenPenspringLink} = this.state;
        let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly;

				if ((!this.state.isInit && courseScheduledId && personConfig && personConfig.courseConfig[courseScheduledId])
								|| courseScheduledId !== prevProps.courseScheduledId) {
						this.setState({ isInit: true, jumpToAssignmentId: personConfig.courseConfig[courseScheduledId] });
				}
				if (sendToHiddenPenspringLink) {
						this.setState({sendToHiddenPenspringLink: false })
						document.getElementById('hiddenPenspringLink').click();
				}

				//The STANDARDSRATING buttons are wrapped with spans.  This should be the only span components on the page.
				if (isLevelOnly) {
						let spans = document.getElementsByTagName('span');
						for(let i = 0; i < spans.length; i++) {
								if (spans && spans[i] && spans[i].id) {
										let studentPersonId = spans[i].id.substring(0, spans[i].id.indexOf('^'))
										let assignmentId = spans[i].id.substring(spans[i].id.indexOf('^')+1)
										spans[i].onclick = () => {
												this.showContextKnowledgeRating(event, studentPersonId, assignmentId);
										}
										spans[i].oncontextmenu = (event) => {
												event.stopPropagation();
												event.preventDefault();
												this.showContextKnowledgeRating(event, studentPersonId, assignmentId);
										}
								}
						}
				}
    }

		sendToStudentSchedule = (studentPersonId) => {
				const {getStudentAssignments, personId, courseEntryId} = this.props;
				getStudentAssignments(personId, studentPersonId, courseEntryId);
				browserHistory.push('/studentSchedule/' + studentPersonId);
		}

		sendToStudentAssignmentView = (studentPersonId) => {
				const {studentAssignmentsInit, personId, courseScheduledId} = this.props;
				studentAssignmentsInit(personId, personId, courseScheduledId);
				browserHistory.push(`/studentAssignments/${courseScheduledId}/${studentPersonId}`);
		}

		handleEnterKey = (assignmentId, studentPersonId, event) => {
				if(event.key === "Enter") {
            this.moveToNextScoreDown(event);
            const {setGradebookScore, personId, courseScheduledId, getAssignmentsPendingReview} = this.props;
            setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value, () => getAssignmentsPendingReview(personId));  //Don't call getGradebook here.  We are going to change grades through a reducer and then call to get the updated overall grade from the serverside so there is just one side that makes thoat calculation.
        }
    }

		moveToNextScoreDown = ({target}) => {
				const {gradebook} = this.props;
				//const {origGradebook} = this.state;
				//Get the current id which will be the student and the assignment Ids.  Get the next student and use the current AssignmentId in order to move the focus down to the next one.
				let studentPersonId = target.name.substring(0, target.name.indexOf('#$'));
				let assignmentId = target.name.substring(target.name.indexOf('#$') + 2);
				let nextStudentPersonId = '';
				let foundCurrent = false;
				gradebook && gradebook.students && gradebook.students.length > 0 && gradebook.students.forEach(m => {
						if (!foundCurrent && m.id === studentPersonId) {
								foundCurrent = true;
						} else if (foundCurrent && !nextStudentPersonId) {
								nextStudentPersonId = m.id;
								foundCurrent = false; //So it won't keep replacing our newly found nextStudentpersonId;
						}
				})
				let nextScoreControlDown = nextStudentPersonId + '#$' + assignmentId;
				document.getElementById(nextScoreControlDown) && document.getElementById(nextScoreControlDown).focus();
		}

    recallPage = (event, singleAssignmentId='') => {
				//const {gradebookInit, personId} = this.props;
				const {courseScheduledId, getCourseWeightedScore, courses, clearGradebook} = this.props;
				clearGradebook();
				let id = event && event.target && event.target.value ? event.target.value : courseScheduledId;
				this.sendDebounce(id, singleAssignmentId); //There is something going on with the event that gets overridden that we have to put off the debounce call until we get the event data.
        this.setState({ courseScheduledId: id });
				let course = courses && courses.length > 0 && courses.filter(m => m.id === id)[0]
				course && course.courseEntryId && getCourseWeightedScore(course.courseEntryId)
    }

		sendDebounce = debounce((id, singleAssignmentId) => {
				const {gradebookInit, personId} = this.props;
				const {jumpToAssignmentId} = this.props;
				browserHistory.push('/gradebookEntry/' + id);
				gradebookInit(personId, id, jumpToAssignmentId, singleAssignmentId);
		}, 1000);

		recallPageWithJump = (event) => {
				const {personId, gradebookInit, updatePersonConfigCourse, courseScheduledId} = this.props;
        //const {courseScheduledId} = this.state;
				updatePersonConfigCourse(personId, courseScheduledId, event.target.value === '0' ? '' : event.target.value)
        gradebookInit(personId, courseScheduledId, event.target.value); //All assignments are already in our record from the database.
        this.setState({ jumpToAssignmentId: event.target.value });
    }

		onPassFailIncrement = (studentPersonId, assignmentId, passFailSequence=0) => {
				//If passFailSequence is blank then it is as good as "Not started" which is 0.
				//If the nextSequence is greater than the available passFails, the sequence wraps around to 0 again to start which might be the user's intention to reset it.
				const {passFailRatings, setPassFailSequence, courseScheduledId, personId} = this.props;
				let nextSequence = passFailSequence ? ++passFailSequence : 1;
				nextSequence = nextSequence > passFailRatings.length-1 ? 0 : nextSequence;
				setPassFailSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId)
		}

		handleScore = (assignmentId, studentPersonId, event) => {
				this.props.setLocalGradebookScore(studentPersonId, assignmentId, event.target.value);
		}

		onBlurScore = (assignmentId, studentPersonId, event) => {
				const {setGradebookScore, personId, courseScheduledId, getAssignmentsPendingReview} = this.props;
				//const {jumpToAssignmentId, singleAssignmentId} = this.state;
				//setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value, () => gradebookInit(personId, courseScheduledId, jumpToAssignmentId, singleAssignmentId, false));
				setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, event.target.value, () => getAssignmentsPendingReview(personId));  //Don't call getGradebook here.  We are going to change grades through a reducer and then call to get the updated overall grade from the serverside so there is just one side that makes thoat calculation.
				//this.resetStudentOverallGrade(studentPersonId);
		}

		getGradebook = () => {
				const {gradebookInit, personId, courseScheduledId, jumpToAssignmentId} = this.props;
				gradebookInit(personId, courseScheduledId, jumpToAssignmentId, null, false); //false = don't clear redux locally.
		}

		changeFilters = (event) => {
				let newState = Object.assign({}, this.state);
				let field = event.target.name;
				newState[field] = event.target.value;
				this.setState(newState);
		}

		setVisitedResponse = (studentAssignmentResponseId) => {
				let gradebook = this.props.gradebook;
				gradebook.studentResponses = gradebook.studentResponses.map(m => {
						if (m.studentAssignmentResponseId === studentAssignmentResponseId) m.responseVisitedTypeCode = 'VISITED';
						return m;
				});
				this.setState({ origGradebook: gradebook })
		}

		handleAddOrUpdateOpen = (assignment, clickedUrl, student, clickedOnResponse) => {
				this.setState({ isShowingModal_response: true, assignment, clickedUrl, student, clickedOnResponse });
				this.setVisitedResponse(clickedUrl.studentAssignmentResponseId);
		}
	  handleAddOrUpdateClose = () => this.setState({isShowingModal_response: false, assignmentId: '', student: {} })
	  handleAddOrUpdateSave = (studentResponse, assignmentId) => {
				const {addOrUpdateStudentResponse, courseEntryId, courseScheduledId, personId, gradebookInit} = this.props;
				const {jumpToAssignmentId, singleAssignmentId} = this.state;
	      addOrUpdateStudentResponse(personId, courseEntryId, courseScheduledId, studentResponse, assignmentId, () => gradebookInit(personId, courseScheduledId, jumpToAssignmentId, singleAssignmentId, false));
	  }

		handleNumberTooLargeOpen = () => this.setState({ isShowingModal_numberTooLarge: true });
		handleNumberTooLargeClose = () => this.setState({ isShowingModal_numberTooLarge: false });

		recallInitRecords = () => {
				const {gradebookInit, personId, courseScheduledId} = this.props;
				const {jumpToAssignmentId, singleAssignmentId} = this.state;
				gradebookInit(personId, courseScheduledId, jumpToAssignmentId, singleAssignmentId);
				this.handleAddOrUpdateClose();
		}

		toggleCheckbox = (name) => {
				let newState = Object.assign({}, this.state);
				newState[name] = !newState[name];
				this.setState(newState);
		}

		handleUpdateInterval = (event) => {
				const {personId, updatePersonConfig, getCoursesScheduled, gradebookInit} = this.props;
				this.setState({ courseScheduledorigGradebook: {}, gradebook: {}, jumpToAssignmentId: null, forceUpdate: true });
				updatePersonConfig(personId, 'IntervalId', event.target.value, () => { getCoursesScheduled(personId, true); gradebookInit(personId, 0, 0, 0); })
				browserHistory.push('/gradebookEntry');
		}

		handlePenspringView = (penspringWorkId, assignment) => {
				const {setPenspringTransfer, personId, accessRoles, studentPersonId} = this.props;
				let transfer = {
						assignmentId: assignment.assignmentId,
						transferCode: 'STARTWRITING',
						workId: penspringWorkId,
						ownerPersonId: accessRoles.facilitator ? studentPersonId : personId,
						editorPersonId: accessRoles.facilitator ? personId : assignment.facilitatorPersonId,
						isTeacher: accessRoles.facilitator,
						//courseEntryId: course && course.courseEntryId,
				}
				this.setState({ penspringWorkId, sendToHiddenPenspringLink: true });
				setPenspringTransfer(personId, transfer);
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Check the brower's tab for the penspring file if it doesn't open up automatically.`}/></div>)
		}

		handleUpdateSchoolYear = ({target}) => {
				const {personId, updatePersonConfig, getCoursesScheduled, gradebookInit} = this.props;
				this.setState({ courseScheduledId: 0 });
				updatePersonConfig(personId, 'SchoolYearId', target.value, () => { getCoursesScheduled(personId, true); gradebookInit(personId, 0, 0, 0); });
				browserHistory.push('/gradebookEntry');
		}

		handleSelectedLearningPathway = ({target}) => {
				this.setState({ learningPathwayId: target.value });
		}

		hasGradeOverwrite = (field, studentPersonId) => {
        const {personConfig, gradebook} = this.props;
        //let localGradebook = Object.assign({}, this.props.gradebook);
				let gradeOverwrites = gradebook && gradebook.gradeOverwrites ? gradebook.gradeOverwrites : [];
				let gradeOverwrite = gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => m.studentPersonId === studentPersonId && m.intervalId === personConfig.intervalId)[0]
				return gradeOverwrite && gradeOverwrite[field] ? gradeOverwrite[field] : '';
		}

    toggleCheckboxOverwrite = (field, studentPersonId) => {
        const {personId, setGradeOverwrite, course, personConfig} = this.props;
        let localGradebook = this.props.gradebook;
        let gradeOverwrites = localGradebook.gradeOverwrites ? localGradebook.gradeOverwrites : [];
        let gradeOverwrite = gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => m.studentPersonId === studentPersonId && m.intervalId === personConfig.intervalId)[0];
        gradeOverwrites = (gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => m.studentPersonId !== studentPersonId)) || [];
        let option = gradeOverwrite ? gradeOverwrite : {studentPersonId, [field]: true };
        if (field.toLowerCase() === 'incomplete') {
            option.passed = false;
            setGradeOverwrite(personId, course.courseScheduledId, studentPersonId, personConfig.intervalId, 'incomplete', !this.hasGradeOverwrite('incomplete', studentPersonId));
        } else if (field.toLowerCase() === 'passed') {
            option.incomplete = false;
            setGradeOverwrite(personId, course.courseScheduledId, studentPersonId, personConfig.intervalId, 'passed', !this.hasGradeOverwrite('passed', studentPersonId));
        }
        gradeOverwrites = gradeOverwrites ? gradeOverwrites.concat(option) : [option];
        localGradebook.gradeOverwrites = gradeOverwrites;
        this.setState({ origGradebook: localGradebook });
    }

		// handleGradeOverwrite  = (studentPersonId, event) => {
    //     const {personConfig} = this.props;
		// 		let localGradebook = Object.assign({}, this.props.gradebook);
		// 		let gradeOverwrites = localGradebook.gradeOverwrites ? localGradebook.gradeOverwrites : [];
		// 		gradeOverwrites = (gradeOverwrites && gradeOverwrites.length > 0 && gradeOverwrites.filter(m => m.studentPersonId !== studentPersonId && m.intervalId !== personConfig.intervalId)) || [];
		// 		let option = {studentPersonId, gradePercent: Number(event.target.value) };
		// 		gradeOverwrites = gradeOverwrites ? gradeOverwrites.concat(option) : [option];
		// 		localGradebook.gradeOverwrites = gradeOverwrites;
		// 		this.setState({ origGradebook: localGradebook });
		// }

		getLetterGrade = (gradePercent) => {
				const {gradeScales} = this.props;
				let gradeScale = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => o.lowValue <= gradePercent && o.highValue >= gradePercent)[0];
				let highestGrade = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => Number(o.highValue) === 100)[0];
				highestGrade = highestGrade && highestGrade.letter;
				return gradePercent > 100
						? highestGrade
								? highestGrade
								: 'A'
						: gradeScale
								? gradeScale.letter
								: '';
		}

		handleSetMultScoreColumnOpen = (assignmentId) => this.setState({ isShowingModal_columnMultScore: true, assignmentId })
		handleSetMultScoreColumnClose = () => this.setState({ isShowingModal_columnMultScore: false, assignmentId: '' })
		handleSetMultScoreColumn = (multScore) => {
				const {personId, setGradebookScoreColumnZero, courseScheduledId} = this.props;
				const {assignmentId} = this.state;
				this.handleSetMultScoreColumnClose();
				setGradebookScoreColumnZero(personId, courseScheduledId, assignmentId, multScore, this.getGradebook);
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Please wait a moment for the scores to fill in.`}/></div>)
		}

		handleHover = (hoverAssignmentId) => this.setState({ hoverAssignmentId });

		handleFinalizeGradeOpen = () => this.setState({ isShowingModal_finalizeGrade: true })
		handleFinalizeGradeClose = () => this.setState({ isShowingModal_finalizeGrade: false })
		handleFinalizeGrade = () => {
				const {personId, finalizeGradebookGrades, courseScheduledId, personConfig} = this.props;
				this.handleFinalizeGradeClose();
				finalizeGradebookGrades(personId, courseScheduledId, personConfig.intervalId);
		}

		handleScroll = () => {
		    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
				if (scrollTop !== !this.state.scrollTop) this.setState({ scrollTop });
	  }

		hideContextKnowledgeRatingMenu = () => {
				if(document.getElementById('contextKnowledgeRating')) document.getElementById('contextKnowledgeRating').style.display = 'none';
		}

		showContextKnowledgeRating = (event, studentPersonId, assignmentId) => {
        event.stopPropagation();
        event.preventDefault();
        document.getElementById('contextKnowledgeRating').style.display = 'inline';
        document.getElementById('contextKnowledgeRating').style.position = 'fixed';
        document.getElementById('contextKnowledgeRating').style.left = event.clientX - 10;
				document.getElementById('contextKnowledgeRating').style.top = event.clientY + 5;
        document.getElementById('contextKnowledgeRating').style.zIndex = '999';
				this.setState({ set_studentPersonId: studentPersonId, set_assignmentId: assignmentId });
    }

		checkEscapeKey = (evt) => {
        if (evt.key === 'Escape') {
            this.hideContextKnowledgeRatingMenu();
        }
    }

    chooseRecord = (chosenStudentRow) => this.setState({ chosenStudentRow })

		handleSetMultNextSequence = (standardLevelSequence) => {
				const {personId, courseScheduledId, gradebookInit, setStandardLevelSequenceMultiple, jumpToAssignmentId} = this.props;
				const {assignmentId} = this.state;
				this.handleSetMultScoreColumnClose();
				setStandardLevelSequenceMultiple(assignmentId, standardLevelSequence, courseScheduledId, personId, () => gradebookInit(personId, courseScheduledId, jumpToAssignmentId, null, false));
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Please wait a moment for the scores to fill in.`}/></div>)
		}

		onStandardLevelSet = (studentPersonId, assignmentId, standardLevelSequence) => {
				const {setStandardLevelSequence, courseScheduledId, personId} = this.props;
				this.hideContextKnowledgeRatingMenu()
				setStandardLevelSequence(studentPersonId, assignmentId, standardLevelSequence, courseScheduledId, personId);
		}

    // onStandardLevelIncrement = (studentPersonId, assignmentId, standardLevelSequence=1) => { //This defaul was changed from 0 to 1.  I hope it still works that way now that the sequences have been increased by one to 1-n insetad of 0-n
		// 		//If standardLevelSequence is blank then it is as good as "Not started" which is 0 (actually that has been changed to 1 - ).
		// 		//If the nextSequence is greater than the available stadnardRatings, the sequence wraps around to 0 again to start which might be the user's intention to reset it..
		// 		const {stadnardRatings, setStandardLevelSequence, courseScheduledId, personId} = this.props;
		// 		let gradebook = this.state.origGradebook;
		// 		let studentScores = gradebook.studentScores || [];
		// 		let nextSequence = standardLevelSequence ? ++standardLevelSequence : 2;
		// 		nextSequence = nextSequence > stadnardRatings.length-1 ? 1 : nextSequence;
		// 		setStandardLevelSequence(studentPersonId, assignmentId, nextSequence, courseScheduledId, personId)
		// 		let foundRecord = false;
		// 		if (studentScores && studentScores.length > 0) {
		// 				studentScores = studentScores.map(m => {
		// 						if (m.studentPersonId === studentPersonId && m.assignmentId === assignmentId) {
		// 								m.standardLevelSequence = nextSequence;
		// 								foundRecord = true;
		// 						}
		// 						return m;
		// 				})
		// 		}
		// 		if (!foundRecord) {
		// 				let option = {contentTypeId: '', studentPersonId, assignmentId, standardLevelSequence: nextSequence };
		// 				studentScores = studentScores ? studentScores.concat(option) : [option];
		// 		}
		// 		gradebook.studentScores = studentScores;
		// 		this.setState({ origGradebook: gradebook });
		// }

		render() {
      const {personId, companyConfig={}, courses, fetchingRecord, accessRoles={}, courseEntryId, contentTypes, removeStudentResponse, schoolYears,
							visitedColor, setResponseVisitedType, hiddenResponseCount, gradebook, intervals, personConfig, gradeScales, myFrequentPlaces,
              setLocalGradebookOverwritePercent, setMyFrequentPlace, standardsRatings, passFailRatings, learningPathways, setGradeOverwrite,
              courseScheduledId, setEditMode} = this.props;
      const {isShowingModal, instructions, assignmentName, studentPersonId, isShowingModal_instructions, penspringWorkId, isShowingModal_response,
							clickedUrl, contentTypeId, assignmentId, student, showHideResponseTypes, clickedOnResponse, assignment, isShowingModal_numberTooLarge,
							learningPathwayId, showWithdrawnStudents, isShowingModal_columnMultScore, hoverAssignmentId, isShowingModal_finalizeGrade,
							set_studentPersonId, set_assignmentId, chosenStudentRow} = this.state;

      let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly;
			let course = (courseScheduledId && courses && courses.length > 0 && courses.filter(m => m.courseScheduledId === courseScheduledId)[0]) || {};
			let coursesLocal = !!learningPathwayId && learningPathwayId !== '0'
					? courses && courses.length > 0 && courses.filter(m => m.learningPathwayId === learningPathwayId)
					: courses;

			let {jumpToAssignmentId} = this.state;
			const fullAssignmentList = gradebook && gradebook.assignments;
			let gradebookLocal = Object.assign({}, gradebook);
			if (gradebookLocal && gradebookLocal.studentScores && gradebookLocal.studentScores.length > 0 && studentPersonId) {
					gradebookLocal.studentScores = gradebookLocal.studentScores.filter(m => m.studentPersonId === studentPersonId);
			}

			let foundJumpTo = !jumpToAssignmentId || jumpToAssignmentId === guidEmpty || jumpToAssignmentId === "0" ? true : false;
			let matchesFilter = false;
			let isValidJump = gradebookLocal && gradebookLocal.assignments && gradebookLocal.assignments.length > 0 && gradebookLocal.assignments.filter(j => j.assignmentId === jumpToAssignmentId)[0];
			if (!isValidJump) { jumpToAssignmentId = null; foundJumpTo = true; }

      let tableWidth = 320;
      let headings = [
          {
            width: 320,
            label: '',
            dataKey: 'student',
          },
      ];

      gradebookLocal && gradebookLocal.assignments && gradebookLocal.assignments.length > 0 && gradebookLocal.assignments.forEach((m, i) => {
          if (!foundJumpTo && m.assignmentId === jumpToAssignmentId) foundJumpTo = true;
          matchesFilter = !contentTypeId || contentTypeId === "0"
              ? true
              : m.contentTypeId === contentTypeId
                  ? true
                  : false;

          if (foundJumpTo && matchesFilter) {
              tableWidth += 90;
              headings.push({
                  width: 90,
                  dataKey: m.assignmentId,
                  label: <div className={classes(styles.narrowLine, styles.row, styles.verticalText)}>
                            {m.contentTypeCode !== 'BENCHMARK' &&
                                <div data-rh={'Set blank scores (excludes self-paced)'} onClick={() => this.handleSetMultScoreColumnOpen(m.assignmentId)}
                                        onMouseEnter={() => this.handleHover(m.assignmentId)} onMouseLeave={this.handleHover} className={styles.moreBottomMargin}>
                                    <Icon pathName={'box_down_arrow'} premium={true} className={styles.iconHeading} fillColor={hoverAssignmentId === m.assignmentId ? 'blue' : ''}/>
                                </div>
                            }
                            <div>
                                <div className={classes(styles.row, styles.labelHead, (m.contentTypeName === 'Exam' ? styles.testColor : ''))}>
                                    {m.hasAssessmentQuestions &&
                                        <div onClick={() => browserHistory.push(`/assessmentCorrectSameAll/${m.assignmentId}/${m.assessmentId}`)}>
                                            <Icon pathName={'list3'} className={styles.iconInline} fillColor={'blue'}/>
                                        </div>
                                    }
                                    <div className={m.hasAssessmentQuestions ? globalStyles.link : ''}
                                            onClick={m.hasAssessmentQuestions
                                                        ? () => browserHistory.push(`/assessmentCorrectSameAll/${m.assignmentId}/${m.assessmentId}`)
                                                        : () => {}
                                            }>
                                        {m.title && m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title}
                                    </div>
                                </div>
                                <div className={classes(styles.row, styles.labelSubhead)}>
                                    points:<div className={styles.lineSub}>{m.totalPoints}</div>
                                    {m.dueDate && <div className={classes(styles.labelSubhead, styles.moreLeft)}>{`due:`}</div>}
                                    {m.dueDate && <div className={styles.lineSub}><DateMoment date={m.dueDate} format={'D MMM'}/></div>}
                                </div>
                            </div>
                        </div>
                  })
    					}
    			});

          let assignmentContentTypes = gradebookLocal && gradebookLocal.contentTypes;

          if (!isLevelOnly) {
        			if (assignmentContentTypes && assignmentContentTypes.length > 0) {
                  tableWidth += 120;
        					assignmentContentTypes = doSort(assignmentContentTypes, { sortField: 'sequence', isAsc: true, isNumber: true });
        					assignmentContentTypes.forEach(c => {
        							headings.push({
                          width: 120,
                          dataKey: c.contentTypeId,
                          verticalText: true,
        									label: <div className={styles.narrowLine}>
        														<div className={styles.labelHead}>{c.contentTypeName}</div>
        												</div>,
        							})
        					})
        			}
              tableWidth += 120;
        			headings.push({
                  width: 120,
                  dataKey: 'grade',
                  verticalText: true,
                  label: <div className={styles.narrowLine}>
        										<div className={styles.labelHead}>{'Overall Grade'}</div>
        							 	 </div>,
        			})
              tableWidth += 300;
        			headings.push({
                  width: 200,
                  dataKey: 'overwrite',
                  verticalText: true,
                  label: <div className={styles.narrowLine}>
        										<div className={styles.labelHead}>{'Grade Overwrite'}</div>
        								 </div>,
        			})
          }
      let data = [];
			let students = [];
			if (gradebookLocal && gradebookLocal.students && gradebookLocal.students.length > 0)
					students = gradebookLocal.students;
					if (gradebookLocal.studentNameOrder === 'FIRSTNAME')
							students = doSort(gradebookLocal.students, { sortField: 'firstName', isAsc: true, isNumber: false });

			if (!showWithdrawnStudents) students = students && students.length > 0 && students.filter(m => !m.withdrawnDate);

			students && students.length > 0 && students.forEach((m, i) => {
          let row = {};
					// let overallGrade = '';  //This was changed!  We get the overall grade from the data directly in the student record now and not a general overall grade collection, studentOverallGrades.
					// let percentGrade = gradebookLocal.studentOverallGrades && gradebookLocal.studentOverallGrades.length > 0
					// 		&& gradebookLocal.studentOverallGrades.filter(g => g.personId === m.id).reduce((acc, {percentGrade}) => acc + percentGrade, 0);
					// let totalContentTypePercent = gradebookLocal.studentOverallGrades && gradebookLocal.studentOverallGrades.length > 0
					// 		&& gradebookLocal.studentOverallGrades.filter(g => g.personId === m.id).reduce((acc, {scorePercent}) => acc + scorePercent, 0);
          //
					// if (percentGrade > 0) {
					// 		percentGrade *= 100;
					// 		if (totalContentTypePercent < 100 && totalContentTypePercent > 0) {
					// 				percentGrade /= totalContentTypePercent;
					// 		}
					// 		percentGrade = Math.round(percentGrade);
					// 		let gradeScale = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => o.lowValue <= percentGrade && o.highValue >= percentGrade)[0];
					// 		overallGrade = gradeScale ? percentGrade + '% ' + gradeScale.letter : percentGrade + '%';
					// 		if (percentGrade > 100) {
					// 				let highestGrade = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => Number(o.highValue) === 100)[0];
					// 				highestGrade = highestGrade && highestGrade.letter;
					// 				overallGrade += highestGrade ? ' ' + highestGrade : ' A';
					// 		}
					// }
          row.student = <div className={classes(globalStyles.cellText, styles.row, (m.withdrawnDate ? styles.tanBack : m.selfPaced ? styles.responseBack : m.id === chosenStudentRow ? styles.highlightBack : i === 0 ? styles.whiteBack : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}
                              data-rh={m.withdrawnDate ? `Withdrawn date: ${m.withdrawnDate.substring(0, m.withdrawnDate.indexOf('T'))}` : m.selfPaced ? 'Self-paced' : null}>
    											 <div className={styles.row}>
    													 <Link to={`/studentProfile/${m.personId}`}><Icon pathName={'info'} className={styles.icon}/></Link>
    													 <Link to={`/studentSchedule/${m.personId}`}><Icon pathName={'clock3'} premium={true} className={styles.icon}/></Link>
    													 <div onClick={() => this.sendToStudentAssignmentView(m.personId)} className={classes(styles.link, styles.row)}>
    													 		{gradebookLocal.studentNameOrder === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName}
    															{m.accredited && <Icon pathName={'shield_check'} premium={true} className={styles.iconSmall} dataRh={'This student is accredited'}/>}
    													</div>
    											 </div>
    											 <div className={styles.text}>{m.overallGrade}</div>
    									 </div>

          if (isValidJump) foundJumpTo = false;

          gradebookLocal && gradebookLocal.assignments && gradebookLocal.assignments.length > 0 && gradebookLocal.assignments.forEach((s, i) => {
              if (!foundJumpTo && s.assignmentId === jumpToAssignmentId) foundJumpTo = true;
              matchesFilter = !contentTypeId || contentTypeId === "0"
                  ? true
                  : s.contentTypeId === contentTypeId
                      ? true
                      : false;

              if (foundJumpTo && matchesFilter) {
                  let studentScore = gradebookLocal.studentScores && gradebookLocal.studentScores.length > 0 && gradebookLocal.studentScores.filter(t => t.studentPersonId === m.personId && t.assignmentId === s.assignmentId)[0];
                  let fileUploadUrls  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.fileUploadUrl);
                  let websiteLinks  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.websiteLink);
                  let textResponses  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.instructions);
                  let penspringWorks  = gradebookLocal.studentResponses && gradebookLocal.studentResponses.length > 0 && gradebookLocal.studentResponses.filter(t => t.personId === m.personId && t.assignmentId === s.assignmentId && t.penspringWorkId && t.penspringWorkId !== guidEmpty); // && t.isPenspringSubmitted
                  let hasStudentAssignmentAssign = gradebookLocal.studentAssign && gradebookLocal.studentAssign.length > 0 && gradebookLocal.studentAssign.filter(t => t.studentPersonId === m.personId && t.assignmentId === s.assignmentId)[0];
                  hasStudentAssignmentAssign = hasStudentAssignmentAssign && hasStudentAssignmentAssign.studentPersonId ? true : false;

                  row[s.assignmentId] = <div key={i} className={classes(styles.row, (hasStudentAssignmentAssign ? '' : styles.noAssignBackground), (m.withdrawnDate ? styles.tanBack : m.selfPaced ? styles.responseBack : m.id === chosenStudentRow ? styles.highlightBack : ''))}
                                              data-rh={hasStudentAssignmentAssign ? null : 'Not assigned to this assignment'} tabIndex={-1}  onClick={() => this.chooseRecord(m.courseEntryId)}>
                                          {!hasStudentAssignmentAssign ? <span className={styles.blankSpace} tabIndex={-1}>_</span> : ''}
                                          {!hasStudentAssignmentAssign
                                              ? ''
                                              : !(accessRoles.learner || accessRoles.observer) || ((accessRoles.learner || accessRoles.observer) && s.gradingType === 'STUDENT')
                                                    ? <GradingRatingEntry key={i} gradingType={course.gradingType} studentScore={studentScore} studentPersonId={m.personId} assignmentId={s.assignmentId}
                                                          standardsRatings={standardsRatings} handleEnterKey={this.handleEnterKey} handleScore={this.handleScore} onBlurScore={this.onBlurScore}
                                                          scoredAnswers={studentScore && studentScore.scoredAnswers} onEnterKey={this.onEnterKey} isEditMode={studentScore && studentScore.editMode}
                                                          onPassFailIncrement={this.onPassFailIncrement} contentTypeCode={s.contentTypeCode} courseScheduledId={courseScheduledId} assessmentId={m.assessmentId}
                                                          useType={'GRADEBOOK'} setEditMode={setEditMode} canEditScore={accessRoles.admin || accessRoles.facilitator} //onSTANDARDSRATINGIncrement={this.onSTANDARDSRATINGIncrement}
                                                          hasAssessmentQuestions={s.hasAssessmentQuestions} forceInputBox={(gradebookLocal && gradebookLocal.assignments.length > 0) && (i > gradebookLocal.assignments.length-4*1)}
                                                          standards={s.standards} chooseRecord={this.chooseRecord}/>

                                                    : <div className={styles.score}>
                                                          {(s.contentTypeCode === 'QUIZ' || s.contentTypeCode === 'BENCHMARK') && s.isPublished && m.hasAssessmentQuestions
                                                              ? (studentScore && studentScore.hasPendingEssayReview > 0) || !studentScore || (!studentScore.score && studentScore.score !== 0)
                                                                  ? 'pending'
                                                                  : studentScore.score
                                                              : studentScore
                                                                  ? studentScore.scoreNotIncluded
                                                                      ? '-'
                                                                      : studentScore.score === 0
                                                                          ? 0
                                                                          : studentScore.score
                                                                  : ''}
                                                      </div>
                                          }
                                          <div className={styles.row}>
                                              {fileUploadUrls && fileUploadUrls.length > 0 && fileUploadUrls.map((f, i) => {
                                                  if ((f.responseVisitedTypeCode !== 'DELETED' && f.responseVisitedTypeCode !== 'HIDE')
                                                          || (f.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || f.isTeacherResponse) {
                                                      return (
                                                          <a key={i} onClick={() => this.handleAddOrUpdateOpen(s, {...f, label: f.fileUploadUrl}, m, f.fileUploadUrl)} className={f.isTeacherResponse ? styles.teacherResponse : ''}>
                                                              <Icon pathName={'document0'} premium={true} className={f.isTeacherResponse ? styles.iconTeacherFile : styles.iconCell}
                                                                  fillColor={clickedOnResponse === f.fileUploadUrl
                                                                    ? '#e8772e'
                                                                    : f.isTeacherResponse
                                                                        ? '#8c1d12'
                                                                        : (accessRoles.admin || accessRoles.facilitator) && f.responseVisitedTypeCode
                                                                            ? visitedColor[f.responseVisitedTypeCode]
                                                                            : ''} />
                                                          </a>
                                                      )
                                                  }
                                                  return null;
                                               })}
                                          </div>
                                          <div className={styles.row}>
                                              {websiteLinks && websiteLinks.length > 0 && websiteLinks.map((w, i) => {
                                                  if ((w.responseVisitedTypeCode !== 'DELETED' && w.responseVisitedTypeCode !== 'HIDE')
                                                          || (w.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || w.isTeacherResponse) {
                                                      return (
                                                          <a key={i} href={w.websiteLink.indexOf('docs.google') > -1 ? null : w.websiteLink.indexOf('http') === -1 ? 'http://' + w.websiteLink : w.websiteLink}
                                                                  onClick={() => this.handleAddOrUpdateOpen(s, {label: w.websiteLink, text: w.websiteLink.indexOf('http') === -1 ? 'http://' + w.websiteLink : w.websiteLink, flag: w.isTeacherResponse}, m, w.websiteLink)}
                                                                  className={w.isTeacherResponse ? styles.teacherResponse : ''} target={'_link'}>
                                                              <Icon pathName={'link2'} premium={true} className={w.isTeacherResponse ? styles.iconTeacher : styles.iconCell}
                                                                  fillColor={clickedOnResponse === w.websiteLink
                                                                    ? '#e8772e'
                                                                    : w.isTeacherResponse
                                                                        ? '#8c1d12'
                                                                        : (accessRoles.admin || accessRoles.facilitator) && w.responseVisitedTypeCode
                                                                            ? visitedColor[w.responseVisitedTypeCode]
                                                                            : ''} />
                                                          </a>
                                                      )
                                                  }
                                                  return null;
                                               })}
                                          </div>
                                          {textResponses && textResponses.length > 0 && textResponses.map((t, i) => {
                                              if ((t.responseVisitedTypeCode !== 'DELETED' && t.responseVisitedTypeCode !== 'HIDE')
                                                      || (t.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || t.isTeacherResponse) {

                                                  return (
                                                      <a key={i} onClick={() => this.handleAddOrUpdateOpen(s, {...t, isTextResponse: true}, m, t.studentAssignmentResponseId)} className={t.isTeacherResponse ? styles.teacherResponse : ''}
                                                              data-rh={t.instructions.length > 15 ? t.instructions.substring(0, 15) + '...' : t.instructions} tabIndex={-1}>
                                                          <Icon pathName={'comment_edit'} premium={true} className={t.isTeacherResponse ? styles.iconTeacher : styles.iconCell} tabIndex={-1}
                                                              fillColor={clickedOnResponse === t.studentAssignmentResponseId
                                                                            ? '#e8772e'
                                                                            : t.isTeacherResponse
                                                                                ? '#8c1d12'
                                                                                : (accessRoles.admin || accessRoles.facilitator) && t.responseVisitedTypeCode
                                                                                    ? visitedColor[t.responseVisitedTypeCode]
                                                                                    : ''} />
                                                      </a>
                                                  )
                                              }
                                              return null;
                                           })}
                                           {penspringWorks && penspringWorks.length > 0 && penspringWorks.map((p, i) => {
                                              if (p.penspringSubmittedDate && ((p.responseVisitedTypeCode !== 'DELETED' && p.responseVisitedTypeCode !== 'HIDE')
                                                      || (p.responseVisitedTypeCode === 'HIDE' && showHideResponseTypes) || p.isTeacherResponse)) {

                                                  return (
                                                      <a key={i} onClick={() => this.handlePenspringView(p.penspringWorkId, p)} className={p.isTeacherResponse ? styles.teacherResponse : ''} data-rh={p.workName}>
                                                          <img src={penspringSmall} alt="PS"
                                                              className={classes(styles.penspringIcon, (p.isTeacherResponse
                                                                  ? styles.iconTeacherFile
                                                                  : clickedOnResponse === p.penspringWorkId
                                                                      ? styles.visited
                                                                      : p.isTeacherResponse
                                                                          ? styles.teacherResponse
                                                                          : ''))}
                                                           />

                                                      </a>
                                                  )
                                              }
                                              return null;
                                           })}
                                           <a id={'hiddenPenspringLink'} href={`${penspringHost}/lms/${personId}/${penspringWorkId}`} target={`_${penspringWorkId}`} tabIndex={-1}> </a>
                                       </div>
              }
          });

          //content type categories followed by the overallgrade.
          !isLevelOnly && assignmentContentTypes && assignmentContentTypes.length > 0 && assignmentContentTypes.forEach(c => {
              let contentScore = gradebookLocal.studentContentScores && gradebookLocal.studentContentScores.length > 0 &&
                  gradebookLocal.studentContentScores.filter(sc => sc.contentTypeId === c.contentTypeId && sc.studentPersonId === m.personId)[0]

              if (contentScore && contentScore.totalPoints) {
                  let percent = contentScore.totalPoints ? Math.round(contentScore.totalScores / contentScore.totalPoints * 100) : 0;
                  row.contentType = <div className={classes(globalStyles.cellText, styles.smaller, styles.row, (m.withdrawnDate ? styles.tanBack : m.selfPaced ? styles.responseBack : m.id === chosenStudentRow ? styles.highlightBack : ''))}
                                          onClick={() => this.chooseRecord(m.id)}>
                                      {`${contentScore.totalScores}/${contentScore.totalPoints}`}
                                      <div className={styles.bolded}>
                                          {`${percent}%`}
                                      </div>
                                  </div>
              } else {
                  row.contentType = ''
              }
          });

          if (!isLevelOnly) m.grade = <div className={styles.text}>{m.overallGrade}</div>;

          if (!isLevelOnly && (course.gradingType === 'TRADITIONAL' || course.gradingType === 'STANDARDSRATING')) {
              row.overwrite = <div className={classes(globalStyles.cellText, styles.row, (m.withdrawnDate ? 'tan' : m.selfPaced ? 'response' : m.id === chosenStudentRow ? 'highlight' : ''))} onClick={() => this.chooseRecord(m.id)}>
                                {this.hasGradeOverwrite('incomplete', m.personId)
                                    ? <div className={styles.boldText}>I</div>
                                    : this.hasGradeOverwrite('passed', m.personId)
                                        ? <div className={styles.boldText}>P</div>
                                        : <div className={classes(styles.row, styles.littleRight)} data-rh={'Overwrite grade'}>
                                              <InputText size={"super-short"}
                                                  name={m.personId}
                                                  value={this.hasGradeOverwrite('gradePercent', m.personId)}
                                                  numberOnly={true}
                                                  maxLength={3}
                                                  onChange={(event) => setLocalGradebookOverwritePercent(m.personId, personConfig.intervalId, event.target.value)}
                                                  onBlur={() => setGradeOverwrite(personId, course.courseScheduledId, m.personId, personConfig.intervalId, 'gradePercent', event.target.value)}/>
                                              {this.hasGradeOverwrite(m.personId) &&
                                                  <div className={styles.letterGrade}>{this.getLetterGrade(this.hasGradeOverwrite(m.personId))}</div>
                                              }
                                          </div>
                                }
                                <div className={styles.checkboxPosition}>
                                    <Checkbox
                                        id={`incomplete`}
                                        label={`Incomplete`}
                                        checked={this.hasGradeOverwrite('incomplete', m.personId)}
                                        onClick={() => this.toggleCheckboxOverwrite('incomplete', m.personId)}
                                        checkboxClass={styles.checkboxItself} />
                                </div>
                                <div className={styles.checkboxPosition}>
                                    <Checkbox
                                        id={`passed`}
                                        label={`Passed`}
                                        checked={this.hasGradeOverwrite('passed', m.personId)}
                                        onClick={() => this.toggleCheckboxOverwrite('passed', m.personId)}
                                        checkboxClass={styles.checkboxItself} />
                                </div>
                            </div>
            }
            data.push(row);
      })

			let responseData = (student && gradebook && gradebook.studentScores && gradebook.studentScores.length > 0 && gradebook.studentScores.filter(m => m.studentPersonId === student.studentPersonId)[0]) || {};
			responseData = (responseData && responseData.scoreResponses && responseData.scoreResponses.length > 0 && responseData.scoreResponses.filter(m => m.assignmentId === assignmentId)[0]) || {};

      return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
              	{`Gradebook ${course.gradingType === 'STANDARDSRATING' ? '(Standards-based)' : course.gradingType === 'PASSFAIL' ? '(Pass / Fail)' : ''}`}
            </div>
						<div className={styles.row}>
								<Icon pathName={'printer'} premium={true} className={classes(styles.moreLeft, styles.iconLessRight, styles.printerUp)}/>
								<ReactToPrint trigger={() => <a href="#" className={classes(styles.moreRight, styles.link)}>Print</a>} content={() => this.componentRef}/>
								<Link to={'/assignmentList/' + courseEntryId} className={classes(styles.row, styles.link, styles.moreRight)}>
										<Icon pathName={'plus'} className={classes(styles.iconSmaller, styles.littleTop)} fillColor={'green'}/>
										{'Create or modify assignments'}
								</Link>
								<Link to={'/studentAssignmentAssign/' + courseScheduledId} className={classes(styles.row, styles.link, styles.moreRight)}>
										<Icon pathName={'pencil0'} premium={true} className={classes(styles.iconSmaller, styles.littleTop)}/>
										{'Manage assignments assigned to students'}
								</Link>
						</div>
            <div className={classes(styles.formLeft, styles.rowWrap)}>
								<div>
										<SelectSingleDropDown
												id={`schoolYearId`}
												label={`School year`}
												value={personConfig.schoolYearId || companyConfig.schoolYearId}
												options={schoolYears}
												height={`medium`}
												onChange={this.handleUpdateSchoolYear}/>
								</div>
								<div>
										<SelectSingleDropDown
												id={`intervalId`}
												label={`Semester`}
												value={personConfig.intervalId}
												options={intervals}
												noBlank={true}
												height={`medium`}
												onChange={this.handleUpdateInterval}/>
								</div>
								{accessRoles.admin &&
										<div className={styles.moreBottomMargin}>
												<SelectSingleDropDown
														id={`learningPathwayId`}
														name={`learningPathwayId`}
														label={companyConfig.urlcode === 'Manheim' ? `Content Area` : `Discipline`}
														value={learningPathwayId}
														options={learningPathways || []}
														height={`medium`}
														onChange={this.handleSelectedLearningPathway}/>
										</div>
								}
						</div>
						<div className={styles.formLeft}>
                <SelectSingleDropDown
                    id={`courseScheduledId`}
                    name={`courseScheduledId`}
                    label={`Course`}
                    value={courseScheduledId || ''}
                    options={coursesLocal}
                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
                    height={`medium`}
                    noBlank={false}
                    onChange={this.recallPage} />
						</div>
						{fullAssignmentList && fullAssignmentList.length > 0 &&
								<div className={classes(styles.formLeft, styles.rowWrap)}>
										<div>
												<SelectSingleDropDown
				                    id={`jumpToAssignmentId`}
				                    label={`Jump to:`}
				                    value={jumpToAssignmentId || ''}
				                    options={gradebookLocal && gradebookLocal.assignments}
				                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
				                    height={`medium`}
				                    onChange={this.recallPageWithJump} />
										</div>
										<div>
												<SelectSingleDropDown
														id={`contentTypeId`}
														name={`contentTypeId`}
														label={`Assignment types`}
														value={contentTypeId || ''}
														options={contentTypes}
														className={classes(styles.singleDropDown, styles.moreBottomMargin)}
														height={`medium`}
														onChange={this.changeFilters} />
										</div>
										{(accessRoles.admin || accessRoles.facilitator) && hiddenResponseCount > 0 &&
												<div>
														<Checkbox
																id={`showHideResponseTypes`}
																label={`Show hidden responses visited (${hiddenResponseCount})`}
																checked={showHideResponseTypes}
																onClick={() => this.toggleCheckbox('showHideResponseTypes')}
																labelClass={styles.labelCheckbox}
																className={styles.checkbox} />
												</div>
										}
										{(accessRoles.admin || accessRoles.facilitator) &&
												<div className={styles.moreTop}>
														<Checkbox
																id={`showWithdrawnStudents`}
																label={`Show withdrawn students`}
																checked={showWithdrawnStudents}
																onClick={() => this.toggleCheckbox('showWithdrawnStudents')}
																labelClass={styles.labelCheckbox}
																className={styles.checkbox} />
												</div>
										}
								</div>
						}
						{(course.gradingType === 'STANDARDSRATING' || course.gradingType === 'PASSFAIL') &&
								<GradingRatingLegend standardsRatings={standardsRatings} passFailRatings={passFailRatings} gradingType={course.gradingType}
										standardsRatingTableId={course.standardsRatingTableId}/>
						}
            <div className={classes(styles.formLeft, styles.topMargin)} ref={el => (this.componentRef = el)}>
								<Loading isLoading={fetchingRecord && fetchingRecord.gradebookEntry} />
                {fullAssignmentList && fullAssignmentList.length > 0 && courseScheduledId !== "0" &&
                    <div>
                        <Loading isLoading={fetchingRecord.baseCourses} />
    										<Paper style={{ height: 400, width: tableWidth, marginTop: '8px' }}>
    												<TableVirtualFast rowCount={(data && data && data.length) || 0}
    														rowGetter={({ index }) => (data && data && data.length > 0 && data[index]) || ''}
    														columns={headings} />
    										</Paper>
                    </div>
								}
								{gradebook && gradebook.assignments && gradebook.assignments.length > 0 && courseScheduledId && !(fetchingRecord && fetchingRecord.gradebook) &&
										<div className={styles.row}>
												<div className={styles.moreRight}>
														<ExcelGradebookEntry gradebook={gradebook} gradeScales={gradeScales}/>
												</div>
												<ButtonWithIcon icon={'checkmark_circle'} label={'Finalize'} onClick={this.handleFinalizeGradeOpen}/>
												<TextDisplay label={<L p={p} t={`Last Grade Finalize Date`}/>}
														text={gradebook.studentGradeFinalDate
																		? <DateMoment date={gradebook.studentGradeFinalDate} hideIfEmpty={true} minusHours={6}/>
																		: <div className={styles.notSubmitted}>Not yet submitted</div>
																 } className={styles.lotTop}/>
										</div>
								}
            </div>
						<MyFrequentPlaces personId={personId} pageName={'Gradebook'} path={'gradebookEntry'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal &&
								<div></div>
            }
						{isShowingModal_instructions &&
								<MessageModal handleClose={this.handleInstructionsClose} heading={assignmentName}
									 explain={instructions} onClick={this.handleInstructionsClose} />
						}
						{isShowingModal_numberTooLarge &&
								<MessageModal handleClose={this.handleNumberTooLargeClose} heading={<L p={p} t={`Number Greater than 999`}/>}
									 explainJSX={<L p={p} t={`The score entered is greater than 999.  Please enter a number less than 999.`}/>}  onClick={this.handleNumberTooLargeClose} />
						}
						{isShowingModal_response &&
								<div className={styles.fullWidth}>
										<DocumentResponseModal handleClose={this.handleAddOrUpdateClose} showTitle={true} handleSubmit={this.handleAddOrUpdateSave}
												responseData={responseData} assignmentId={assignment.assignmentId} personId={personId} companyConfig={companyConfig}
												course={course} recallInitRecords={this.recallInitRecords} accessRoles={accessRoles} courseScheduledId={courseScheduledId}
												handleRemove={removeStudentResponse} clickedUrl={clickedUrl} student={student} setResponseVisitedType={setResponseVisitedType}
												studentAssignmentsInit={() => {}} assignment={assignment}/>
								</div>
						}
						{isShowingModal_columnMultScore &&
								<InputGradebookMultipleEntry handleClose={this.handleSetMultScoreColumnClose} heading={<L p={p} t={`Set empty scores?`}/>} isLevelOnly={isLevelOnly}
									 onClick={isLevelOnly ? this.handleSetMultNextSequence : this.handleSetMultScoreColumn} standardsRatings={standardsRatings} />
						}
						{isShowingModal_finalizeGrade &&
								<MessageModal handleClose={this.handleFinalizeGradeClose} heading={<L p={p} t={`Finalize Grades?`}/>} isConfirmType={true}
									 explainJSX={<L p={p} t={`Are you sure you want to finalize grades?  The students' transcripts will be updated.`}/>}
									 onClick={this.handleFinalizeGrade} />
						}
						<div id={`contextKnowledgeRating`} style={{display: 'none'}}>
								<ContextKnowledgeRating personId={personId} studentPersonId={set_studentPersonId} assignmentId={set_assignmentId} standardsRatings={standardsRatings}
										onClick={this.onStandardLevelSet} />
						</div>
        </div>
    )};
}

export default withAlert(GradebookEntryView);


//See line 315: maxNumber={Number(s.totalPoints || 0) + Number(s.extraCredit || 0)}

//See <input where I took this out.  I can't remember what it was used for, but it is causing an error. Oh, it was for the teacher to make a response to homework when there is not a homework response to start with from the student.
//onDoubleClick={(accessRoles.admin || accessRoles.facilitator) ? () => this.handleAddOrUpdateOpen(s.assignmentId, null, m) : () => {}}
