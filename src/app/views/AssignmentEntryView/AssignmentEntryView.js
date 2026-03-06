import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './AssignmentEntryView.css';
const p = 'AssignmentEntryView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import TextDisplay from '../../components/TextDisplay';
import RadioGroup from '../../components/RadioGroup';
import Checkbox from '../../components/Checkbox';
import InputText from '../../components/InputText';
import DateTimePicker from '../../components/DateTimePicker';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Required from '../../components/Required';
import MultiSelect from '../../components/MultiSelect';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import InputDataList from '../../components/InputDataList';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class AssignmentEntryView extends Component {
  constructor(props) {
	    super(props);

			const {assignment, coursesRelated} = props;

			let coursesSpecific = assignment && assignment.coursesSpecific && assignment.coursesSpecific.length > 0
					? assignment.coursesSpecific
					: coursesRelated && coursesRelated.length > 0 && coursesRelated.map(m => m.courseScheduledId)

			this.state = {
					isShowingModal_delete: false,
					isShowingModal_removeFile: false,
					isShowingModal_removeWebsite: false,
					isShowingModal_numberOnly: false,
					isShowingModal_noStudents: false,
					isShowingModal_missingInfo: false,
          contentType: '',
					coursesSpecific,
          assignment: {
              assignmentId: '',
              sequence: props.insertSequence,
              courseEntryId: '',
              title: '',
              subtitle: '',
              contentTypeId: '',
							intervalId: '',
              instructions: '',
							totalPoints: 0,
							extraCredit: 0,
              mustComplete: true,
              gradable: true,
							dueDate: '',
							gradingTypes: [],
							studentsAssigned: ''
          },
          errorTitle: '',
          errorContentType: '',
					//errorInterval: '',
          errorInstruction: '',
					errorTotalPoints: '',
					errorCoursesSpecific: '',
      }
  }

	// componentDidMount() {
	// 		let assignment = Object.assign({}, this.props.assignment);
	// 		if (assignment.standards && assignment.standards.length > 0) {
	// 				assignment['standardIds'] = assignment.standards.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);
	// 		}
	// 		this.setState({ assignment, selectedStandards: assignment.standards });
	// }

	componentDidUpdate() {
			let assignment = Object.assign({}, this.props.assignment);

			if (!this.state.isInit && assignment && assignment.assignmentId) {
					if (assignment.standards && assignment.standards.length > 0) {
							assignment.standardIds = assignment.standards.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);
					}
					this.setState({ assignment, selectedStandards: assignment.standards, isInit: true });
			}
  }

	componentWillUnmount() {
			this.setState({ assignment: {}, isInit: false });
	}

	getTotalPoints = () => {
			const {assignment} = this.state;
			return (Number(assignment.totalPoints || 0)) + (Number(assignment.extraCredit || 0))
	}

	handleCoursesSpecific = (courseScheduledId) => {
			const {students, studentCourseAssigns} = this.props;
			let coursesSpecific = this.state.coursesSpecific;
			let assignment = this.state.assignment;
			coursesSpecific = coursesSpecific && coursesSpecific.length > 0
					? coursesSpecific.indexOf(courseScheduledId) > -1
							? coursesSpecific.filter(id => id !== courseScheduledId)
							: coursesSpecific.concat(courseScheduledId)
					: [courseScheduledId];

			let studentsAssigned = [];
			students && students.length > 0 && students.forEach(m => {
					coursesSpecific && coursesSpecific.length > 0 && coursesSpecific.forEach(courseScheduledId => {
              let found = false;
              studentCourseAssigns.forEach(s => { if (s.id === courseScheduledId) found = true; });
              if (found) {
									studentsAssigned = studentsAssigned ? studentsAssigned.concat(m.personId) : [m.personId];
							}
					})
			})
			assignment.studentsAssigned = studentsAssigned;

			this.setState({ coursesSpecific, assignment });
	}

	changeAssignment = (event) => {
			const {contentTypes} = this.props;
      const field = event.target.name;
      const assignment = Object.assign({}, this.state.assignment);
      assignment[field] = event.target.value;
			let contentTypeCode = Object.assign({}, this.state.contentTypeCode);
			if (field === 'contentTypeId') {
					this.setDefaultGradingType();
					let contentType = contentTypes && contentTypes.length > 0 && contentTypes.filter(m => m.id === event.target.value)[0];
					if (contentType && contentType.code) {
							contentTypeCode = contentType.code;
							assignment.contentTypeCode = contentType.code;
					}
			}
      this.setState({ assignment, contentTypeCode });
  }

	processForm = () => {
      const {addOrUpdateAssignment, personId, course, courseTypes, assignmentId, courseEntryId}  = this.props;
      const {assignment, coursesSpecific, selectedStandards} = this.state;
			let missingInfoMessage = [];

      if (!assignment.title) {
          this.setState({errorTitle: <L p={p} t={`Title is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Title`}/></div>
      }

      if (!assignment.contentTypeId) {
	        this.setState({errorContentType: <L p={p} t={`Content type is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Content type`}/></div>
      }

			if (assignment.contentTypeCode !== 'BENCHMARK' && !assignment.totalPoints && !assignment.extraCredit) {
	        this.setState({errorTotalPoints: <L p={p} t={`Total points and/or extra credit are required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Total points and/or extra credit`}/></div>
      }

			if (course.gradingType === 'STANDARDSRATING' && assignment.contentTypeCode !== 'BENCHMARK' && assignment.contentTypeCode !== "ASSESSMENT"
							&& assignment.contentTypeCode !== "QUIZ" && assignment.contentTypeCode !== "MIDTERM" && assignment.contentTypeCode !== "FINAL"
							 && assignment.contentTypeCode !== "EXAM" && (!selectedStandards || selectedStandards.length === 0)) {
	        this.setState({errorStandardsRating: "You must choose at least one standard" });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one standard`}/></div>
      }

			if (assignment.contentTypeCode === 'BENCHMARK' && !assignment.benchmarkTestId) {
	        this.setState({errorTotalPoints: <L p={p} t={`A benchmark test is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Benchmark test`}/></div>
      }

		// Removed because of the workflow that allows you to continue without any students selected, and this stops it. Allowing assignments to be created prematurely without students.
      // if (!coursesSpecific || coursesSpecific.length === 0) {
			// 		hasError = true;
			// 		this.setState({errorCoursesSpecific: <L p={p} t={`At least one scheduled course must be included.`}/> });
			// }

			if (assignment.contentTypeCode === 'DISCUSSION') {
					if (assignment.discussionMinPost && assignment.discussionMinComment) {
							this.setState({errorDiscussion: <L p={p} t={`For Discussion type, At least one post or one comment is required.`}/> });
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Discussion type setting`}/></div>
					}
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
					if (!assignment.gradingTypes || assignment.gradingTypes.length === 0) {
							let gradingTypes = courseTypes && Object.keys(courseTypes).length > 0 && courseTypes.map(m => ({
									courseTypeId: m.id,
									gradingType: m.defaultGradingType,
							}));
							assignment.gradingTypes = gradingTypes;
					}
					assignment.courseEntryId = courseEntryId;
					assignment.coursesSpecific = coursesSpecific;
					if (selectedStandards && selectedStandards.length > 0)
							assignment.standardIds = selectedStandards.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);

					console.log('assignment',assignment)
          addOrUpdateAssignment(personId, assignment);

					if (assignmentId)
							browserHistory.push(`/assignmentList/${course && course.courseEntryId}/assignmentId/${assignmentId}`);
					else
          		browserHistory.push(`/assignmentList/${course && course.courseEntryId}`);
      }
  }

	sendBack = () => {
			const {course, assignmentId} = this.props;
			if (assignmentId)
					browserHistory.push(`/assignmentList/${course && course.courseEntryId}/assignmentId/${assignmentId}`);
			else
					browserHistory.push(`/assignmentList/${course && course.courseEntryId}`);
	}

	toggleCheckbox = (field) => {
    const assignment = this.state.assignment;
    assignment[field] = !assignment[field];
    this.setState({ assignment });
  }

	changeDueDate = (field, event) => {
		const assignment = this.state.assignment;
    assignment[field] = event.target.value;
    this.setState({ assignment });
  }

	handleGradingType = (value, courseTypeId) => {
			const {courseTypes} = this.props;
			let assignment = this.state.assignment;
			let gradingTypes = [];
			if (!assignment.gradingTypes || assignment.gradingTypes.length === 0) {
					gradingTypes = courseTypes && Object.keys(courseTypes).length > 0 && courseTypes.map(m => ({
							courseTypeId: m.id,
							gradingType: m.defaultGradingType,
					}));
					assignment.gradingTypes = gradingTypes;
			}
			gradingTypes = assignment.gradingTypes.filter(m => m.courseTypeId !== courseTypeId);
			let option = { courseTypeId: courseTypeId, gradingType: value };
			assignment.gradingTypes = gradingTypes && gradingTypes.length > 0
					? gradingTypes.concat(option)
					: [option]
			this.setState({ assignment });
	}

	setDefaultGradingType = () => {
			const {courseTypes} = this.props;  //Please notice the difference between coursetypes and courseContentTypes.
			let assignment = this.state.assignment;
			let gradingTypes = courseTypes && Object.keys(courseTypes).length > 0 && courseTypes.map(m => ({
					courseTypeId: m.id,
					gradingType: m.defaultGradingType,
			}));
			assignment.gradingTypes = gradingTypes;
			this.setState({ assignment });
	}

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeAssignment, personId, assignmentsInit} = this.props;
			const {assignment} = this.state;
			removeAssignment(personId, assignment.assignmentId, () => assignmentsInit(personId, assignment.courseEntryId));
			this.handleDeleteClose();
			browserHistory.push('/assignmentList/' + assignment.courseEntryId);
	}

	toggleFileAttach = () => this.setState({ openFileAttach: !this.state.openFileAttach });

	handleRemoveFileOpen = (assignmentFileId) => this.setState({isShowingModal_removeFile: true, assignmentFileId })
  handleRemoveFileClose = () => this.setState({isShowingModal_removeFile: false })
  handleRemoveFile = () => {
      const {removeAssignmentFile, personId} = this.props;
      const {assignmentFileId, assignment} = this.state;
      removeAssignmentFile(personId, assignment.assignmentId, assignmentFileId)
      this.handleRemoveFileClose();
			assignment.assignmentFileUploads = assignment.assignmentFileUploads.length > 0 && assignment.assignmentFileUploads.filter(m => m.assignmentFileId !== assignmentFileId);
			this.setState({ assignment });
  }

	handleRemoveWebsiteOpen = (assignmentWebsiteLinkId) => this.setState({isShowingModal_removeWebsite: true, assignmentWebsiteLinkId })
  handleRemoveWebsiteClose = () => this.setState({isShowingModal_removeWebsite: false })
  handleRemoveWebsite = () => {
      const {removeAssignmentWebsiteLink, personId} = this.props;
      const {assignmentWebsiteLinkId, assignment} = this.state;
      removeAssignmentWebsiteLink(personId, assignment.assignmentId, assignmentWebsiteLinkId)
      this.handleRemoveWebsiteClose();
			assignment.websiteLinks = assignment.websiteLinks.length > 0 && assignment.websiteLinks.filter(m => m.assignmentWebsiteLinkId !== assignmentWebsiteLinkId);
			this.setState({ assignment });
  }

	isNumbersOnly = (event) => {
		  if (isNaN(event.target.value)) {
			  	this.handleMessageOpen();
		  } else {
			  	this.changeAssignment(event);
		  }
  }

	handleNumberOnlyOpen = () => this.setState({isShowingModal_numberOnly: true })
  handleNumberOnlyClose = () => this.setState({isShowingModal_numberOnly: false })

	handleNoStudentsOpen = () => this.setState({isShowingModal_noStudents: true })
	handleNoStudentsClose = () => this.setState({isShowingModal_noStudents: false })
	handleNoStudents = () => {
			this.processForm();
			this.handleNoStudentsClose();
	}

	handleStudentAssign = (studentsAssigned) => {
			const assignment = this.state.assignment;
			assignment.studentsAssigned = studentsAssigned;
			this.setState({ assignment });
	}

	studentAssignRenderer = (selected, options) => {
      return <L p={p} t={`Students Assigned`}/>;
  }

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	chooseStandards = (selectedStandards) => {
			let assignment = Object.assign({}, this.state.assignment);
			assignment['standardIds'] = selectedStandards && selectedStandards.length > 0 && selectedStandards.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);
			this.setState({ assignment, selectedStandards })
	}

	render() {
      const {coursesRelated, sequences, className, contentTypes, course={}, courseTypes, intervals, personConfig, insertSequence, students=[], standards=[],
							studentCourseAssigns, benchmarkTests=[]} = this.props;
      const {assignment={}, contentTypeCode, errorTitle, errorContentType, errorInstruction, errorTotalPoints, isShowingModal_delete, errorStandardsRating,
							coursesSpecific, openFileAttach, isShowingModal_removeFile, isShowingModal_removeWebsite, errorCoursesSpecific, messageInfoIncomplete,
							isShowingModal_numberOnly, errorDiscussion, isShowingModal_noStudents, isShowingModal_missingInfo, selectedStandards } = this.state;

			let interval = intervals && intervals.length > 0 && intervals.filter(m => m.id === personConfig.intervalId)[0];
			let intervalName = interval && interval.label ? interval.label : '';
			let studentsLocal = [];
      studentCourseAssigns && studentCourseAssigns.length > 0 && students && students.length > 0 && students.forEach(m => {
					coursesSpecific && coursesSpecific.length > 0 && coursesSpecific.forEach(courseScheduledId => {
              studentCourseAssigns.forEach(s => {
                  if (s.id === m.id) {
                      let alreadyExists = false;
                      studentsLocal && studentsLocal.length > 0 && studentsLocal.forEach(d => { if (d.id === s.id) alreadyExists = true; });
                      if (!alreadyExists) studentsLocal = studentsLocal && studentsLocal.length > 0 ? studentsLocal.concat(m) : [m];
                  }
              });
					})
			})

			let setAllStudents = [];
			if (!(assignment && assignment.assignmentId)) {
					setAllStudents = students && students.length > 0
							&& students.reduce((acc, m) => {
									if (acc.indexOf(m.id) === -1) {
											acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id]
									}
									return acc;
							}, []);

					assignment.studentsAssigned = setAllStudents;
			}

      return (
          <div className={classes(styles.container, className)}>
							<div className={globalStyles.pageTitle}>
									{assignment.assignmentId ? <L p={p} t={`Update Assignment`}/> : <L p={p} t={`Add Assignment`}/>}
							</div>
              <div className={styles.moreTop}>
                  <TextDisplay label={`Course`} text={course && course.courseName} />
									<TextDisplay label={<L p={p} t={`Interval`}/>} text={intervalName} />
              </div>
              <InputText
                  id={`title`}
                  name={`title`}
                  size={"medium-long"}
                  label={<L p={p} t={`Title`}/>}
                  //autoFocus={!this.props.assignment || !this.props.assignment.title}
                  value={assignment.title || ''}
                  onChange={this.changeAssignment}
									required={true}
									whenFilled={assignment.title}
                  error={errorTitle} />

							{!assignment.assignmentId &&
									<div>
			                <SelectSingleDropDown
			                    id={`contentTypeId`}
			                    label={<L p={p} t={`Content type`}/>}
			                    value={assignment.contentTypeId}
			                    options={contentTypes}
			                    className={styles.moreBottomMargin}
			                    height={`medium`}
													noBlank={false}
			                    onChange={this.changeAssignment}
													required={true}
													whenFilled={assignment.contentTypeId}
			                    error={errorContentType}/>
									</div>
							}
							{(contentTypeCode === "ASSESSMENT" || contentTypeCode === "QUIZ" || contentTypeCode === "MIDTERM" || contentTypeCode === "FINAL" || assignment.contentTypeCode === "EXAM") &&
                  <div className={globalStyles.instructionsBigger}>
											<L p={p} t={`After submitting this record, the assessment activity will have a link for you to follow to create the assessment.`}/>
									</div>
              }
							{assignment.assignmentId &&
									<div className={styles.textDisplay}>
											<TextDisplay label={<L p={p} t={`Content type`}/>} text={assignment.contentTypeName} className={styles.textDisplay} labelClass={styles.labelDisplay}/>
											<div className={styles.labelNotice}><L p={p} t={`Cannot update content type when updating an assignment.`}/></div>
									</div>
							}
							<hr/>
							{assignment.contentTypeCode !== 'BENCHMARK' &&
									<div>
											<div className={styles.row}>
													<span className={styles.headLabel}><L p={p} t={`Total points possible`}/></span>
													<Required setIf={true} setWhen={assignment.totalPoints} className={styles.smallRequired}/>
											</div>
											<div className={styles.rowPoints}>
													<div className={styles.plusExtraCredit}><L p={p} t={`Points:`}/></div>
													<input
															onChange={this.isNumbersOnly}
															type={`text`}
															id={`totalPoints`}
															name={`totalPoints`}
															value={assignment.totalPoints || ''}
															className={styles.input_superShort}
															maxLength={5}/>
													 <div className={styles.plusExtraCredit}><L p={p} t={`+ extra credit:`}/></div>
													 <div>
															 <input
						 											onChange={this.isNumbersOnly}
						 											type={`text`}
						 											id={`extraCredit`}
						 											name={`extraCredit`}
						 											value={assignment.extraCredit || ''}
						 											className={styles.input_superShort}
						 											maxLength={5}/>
													 </div>
													 <div className={styles.plusExtraCredit}>=</div>
													 <div className={styles.totalPoints}>{this.getTotalPoints()}</div>
											 </div>
											 {errorTotalPoints && <div className={styles.error}>{errorTotalPoints}</div>}
											 <hr/>
									</div>
							}
              {contentTypeCode === "DIRECTINSTRUCTION" &&
	                <div className={styles.labelNotice}><L p={p} t={`The learner will be expected to be involved in direct instruction from a facilitator, which the facilitator can mark off in the grading section.`}/></div>
              }
              {contentTypeCode === "JOURNAL" &&
                  <div className={styles.labelNotice}><L p={p} t={`The learner will be presented with a link that takes them to their journal to make an entry that will be associated with this activity.`}/></div>
              }
              {contentTypeCode === "DISCUSSION" &&
                  <div>
                      <div className={styles.labelNotice}><L p={p} t={`Determine the minimum number of posts and comments that the student must enter. If the student only partially completes the requirements, the percent of the score will be calculated.`}/></div>
                      <InputText
                          id={`discussionMinPost`}
                          name={`discussionMinPost`}
                          size={"short"}
                          label={<L p={p} t={`Posts (minimum)`}/>}
                          value={assignment.discussionMinPost || ''}
                          onChange={this.changeAssignment}
													error={errorDiscussion}/>
                      <InputText
                          id={`discussionWordCount`}
                          name={`discussionWordCount`}
                          size={"short"}
                          label={<L p={p} t={`Word count entry (minimum)`}/>}
                          value={assignment.discussionWordCount || ''}
                          onChange={this.changeAssignment}/>
                      <InputText
                          id={`discussionMinComment`}
                          name={`discussionMinComment`}
                          size={"short"}
                          label={<L p={p} t={`Comments to others' posts (minimum)`}/>}
                          value={assignment.discussionMinComment || ''}
                          onChange={this.changeAssignment}
													error={errorDiscussion}/>
                  </div>
              }
							{(contentTypeCode === "ASSESSMENT" || contentTypeCode === "QUIZ" || contentTypeCode === "MIDTERM" || contentTypeCode === "FINAL" || assignment.contentTypeCode === "EXAM")
                      && course.gradingType === 'STANDARDSRATING' &&
									<div className={globalStyles.instructionsBigger}>
											<L p={p} t={`If you do not intend to add assessment questions to this assignment, then choosing at least one standard is necessary for the standards based grading result.`}/>
									</div>
							}
							{course.gradingType === 'STANDARDSRATING' && assignment.contentTypeCode !== 'BENCHMARK' &&
									<div className={styles.listPosition}>
											<InputDataList
													label={<L p={p} t={`Standards`}/>}
													name={'standardIds'}
													options={standards || [{id: '', value: ''}]}
													value={selectedStandards}
													multiple={true}
													height={`medium`}
													className={styles.moreTop}
													onChange={this.chooseStandards}
													required={course.gradingType === 'STANDARDSRATING' && assignment.contentTypeCode !== "ASSESSMENT"
																	&& assignment.contentTypeCode !== "QUIZ" && assignment.contentTypeCode !== "MIDTERM"
																	&& assignment.contentTypeCode !== "FINAL" && assignment.contentTypeCode !== "EXAM"}
													whenFilled={selectedStandards}
													error={errorStandardsRating}/>
		              </div>
							}
							{assignment.contentTypeCode === 'BENCHMARK' &&
									<div>
											<SelectSingleDropDown
													id={'benchmarkTestId'}
													label={<L p={p} t={`BenchmarkTest`}/>}
													value={assignment.benchmarkTestId || (insertSequence)}
													options={benchmarkTests}
													className={styles.dropdown}
													required={true}
													whenFilled={assignment.benchmarkTestId}
													onChange={this.changeAssignment}/>
									</div>
							}
							<div className={styles.row}>
                  <span className={classes(styles.label, styles.moreTop)}>{assignment.contentTypeCode === "DISCUSSION" ? <L p={p} t={`Discussion entry`}/> : <L p={p} t={`Instructions`}/>}</span><br/>
									{/*<div> <Required setIf={true} setWhen={assignment.instructions} className={styles.smallRequired}/> </div>*/}
							</div>
              <textarea rows={5} cols={45}
                      id={`instructions`}
                      name={`instructions`}
                      value={assignment.instructions || ''}
											onChange={this.changeAssignment}
                      className={styles.commentTextarea}>
              </textarea><br/>
              <span className={styles.error}>{errorInstruction}</span>
							<DateTimePicker label={<L p={p} t={`Due date (optional)`}/>} id={`dueDate`} className={styles.moreTop}
									value={assignment.dueDate && assignment.dueDate.indexOf('T') > -1 ? assignment.dueDate.substring(0, assignment.dueDate.indexOf('T')) : assignment.dueDate}
									onChange={(event) => this.changeDueDate('dueDate', event)}/>
							<div>
									<SelectSingleDropDown
											id={'sequence'}
											label={<L p={p} t={`Sequence in order`}/>}
											value={assignment.sequence || (insertSequence)}
											noBlank={true}
											options={sequences}
											className={styles.dropdown}
											onChange={this.changeAssignment}/>
							</div>
							<hr />
							<div className={styles.gradedByBackground}>
								 <span className={styles.sectionLabel}><L p={p} t={`Graded by:`}/></span><br/>
								 {courseTypes && courseTypes.length > 0 && courseTypes.map((m, i) => {
									 	let gradingType = assignment.gradingTypes && assignment.gradingTypes.length > 0 && assignment.gradingTypes.filter(g => g.courseTypeId === m.id)[0];
										gradingType = gradingType && gradingType.gradingType ? gradingType.gradingType : m.defaultGradingType;
								 		return (
											 	<div key={i} className={classes(styles.lineSpace, styles.row)}>
														<div className={styles.labelCourseType}>{m.label}</div>
														<RadioGroup
							                  name={m.id}
							                  data={[{ label: <L p={p} t={`Teacher`}/>, id: "TEACHER" }, { label: <L p={p} t={`Student`}/>, id: "STUDENT" }, ]}
							                  horizontal={true}
							                  className={styles.radio}
							                  initialValue={gradingType || 'TEACHER'}
							                  onClick={(value) => this.handleGradingType(value, m.id)}/>
												</div>
										)}
								 )}
							</div>
							<div className={styles.includeCourseBackground}>
									{coursesRelated && coursesRelated.length > 0 &&
											<div>
													<div className={styles.sectionLabel}><L p={p} t={`Classes included`}/></div>
															{coursesRelated.map((m, i) =>
																	 <Checkbox
																	 		 key={i}
																			 id={m.courseScheduledId}
											                 label={m.label}
											                 position={'before'}
											                 checked={coursesSpecific && coursesSpecific.indexOf(m.courseScheduledId) > -1}
											                 onClick={() => this.handleCoursesSpecific(m.courseScheduledId)}
											                 labelClass={styles.labelCheckbox}
											                 checkboxClass={styles.checkbox}/>
															)}
											</div>
									}
									<span className={styles.error}>{errorCoursesSpecific}</span>
							</div>
							<div className={styles.studentsBackground}>
								 <span className={classes(styles.sectionLabel, styles.moreTop, styles.blue)}><L p={p} t={`Students included:`}/></span><br/>
								 <div className={styles.multiSelect}>
										 <MultiSelect
												 name={'studentAssignmentAssign'}
												 options={studentsLocal || []}
												 onSelectedChanged={this.handleStudentAssign}
												 valueRenderer={this.studentAssignRenderer}
												 getJustCollapsed={() => {}}
												 selected={assignment.studentsAssigned || []}/>
								 </div>
							</div>
							<hr />
							<div className={styles.row}>
									<a onClick={this.toggleFileAttach} className={classes(styles.fileAttach, styles.row)}>
											<Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
											<span className={styles.labelUpload}><L p={p} t={`Upload a file?`}/></span>
									</a>
									<a onClick={this.toggleFileAttach} className={classes(styles.fileAttach, styles.row)}>
											<Icon pathName={'link2'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
											<span className={styles.labelUpload}><L p={p} t={`Add a website link?`}/></span>
									</a>
							</div>
							{(openFileAttach) &&
									<div className={styles.explanation}>
											<L p={p} t={`After you submit this record, you will be returned to the list of assignments.  There are icons on the left in order to upload one or more files or to enter one or more links per assignment.`}/>
									</div>
							}
							{assignment.assignmentFileUploads && assignment.assignmentFileUploads.length > 0 &&
									<div>
											<hr />
											<div className={styles.label}>File attachments</div>
											{assignment.assignmentFileUploads.map((f, i) =>
													<div key={i} className={classes(styles.linkSpace, styles.row)}>
															<a key={i} href={f.url} target={'_blank'} className={styles.link}>{f.name}</a>
															<a onClick={() => this.handleRemoveFileOpen(f.assignmentFileId, 'DELETEFILE')} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
													</div>
											)}
									</div>
							}
							{assignment.websiteLinks && assignment.websiteLinks.length > 0 &&
									<div>
											<hr />
											<div className={styles.label}><L p={p} t={`Website links`}/></div>
											{assignment.websiteLinks.map((w, i) =>
													<div key={i} className={classes(styles.linkSpace, styles.row)}>
															<a key={i} href={w.websiteLink.indexOf('http') === -1 ? 'http://' + w.websiteLink : w.websiteLink} target={'_blank'} className={styles.link}>{w.title ? w.title : w.websiteLink}</a>
															<a onClick={() => this.handleRemoveWebsiteOpen(w.assignmentWebsiteLinkId)} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
													</div>
											)}
									</div>
							}
							<hr />
              <div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                  <a className={styles.cancelLink} onClick={this.sendBack}><L p={p} t={`Close`}/></a>
									{assignment.assignmentId &&
											<ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={this.handleDeleteOpen} changeRed={true}/>
									}
									<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'}
											onClick={!assignment.studentsAssigned || assignment.studentsAssigned.length === 0
																	? this.handleNoStudentsOpen
																	: this.processForm}/>
              </div>
							<OneFJefFooter />
							{isShowingModal_noStudents &&
	                <MessageModal handleClose={this.handleNoStudentsClose} heading={<L p={p} t={`No students chosen`}/>}
	                   explainJSX={<L p={p} t={`There are not any students chosen for this assignment. Do you want to continue anyway?`}/>} isConfirmType={true}
	                   onClick={this.handleNoStudents} />
	            }
							{isShowingModal_delete &&
	                <MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this assignment?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to remove this assignment? Access to any homeowrk and grades turned in for this homework will be lost.`}/>} isConfirmType={true}
	                   onClick={this.handleDelete} />
	            }
							{isShowingModal_removeFile &&
	                <MessageModal handleClose={this.handleRemoveFileClose} heading={<L p={p} t={`Remove this file attachment?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this file attachment?`}/>} isConfirmType={true}
	                   onClick={this.handleRemoveFile} />
	            }
							{isShowingModal_removeWebsite &&
	                <MessageModal handleClose={this.handleRemoveWebsiteClose} heading={<L p={p} t={`Remove this website link?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this website link?`}/>} isConfirmType={true}
	                   onClick={this.handleRemoveWebsite} />
	            }
							{isShowingModal_numberOnly &&
		                <MessageModal handleClose={this.handleNumberOnlyClose} heading={<L p={p} t={`Numbers Only`}/>}
		                   explainJSX={<L p={p} t={`Please enter numbers only.`}/>} onClick={this.handleNumberOnlyClose} />
		          }
							{isShowingModal_missingInfo &&
									<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
										 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
							}
          </div>
      )
    }
}
