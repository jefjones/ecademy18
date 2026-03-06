import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './StudentBaseCourseRequestView.css';
const p = 'StudentBaseCourseRequestView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import StudentListModal from '../../components/StudentListModal';
import DateMoment from '../../components/DateMoment';
import TextDisplay from '../../components/TextDisplay';
import Loading from '../../components/Loading';
import Icon from '../../components/Icon';
import Checkbox from '../../components/Checkbox';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import EditTable from '../../components/EditTable';
import GradRequirementAccordion from '../../components/GradRequirementAccordion';
import Paper from '@material-ui/core/Paper';
import TableVirtualFast from '../../components/TableVirtualFast';
import classes from 'classnames';
import {doSort} from '../../utils/sort.js';
import {withAlert} from 'react-alert';
import {guidEmpty} from '../../utils/guidValidate.js';

class StudentBaseCourseRequestView extends Component {

    constructor(props) {
      super(props);

      this.state = {
	        isShowingModal_remove: false,
					isShowingModal_students: false,
					isShowingModal_notOpen: false,
					isShowingModal_finalize: false,
					isShowingModal_description: false,
					isShowingModal_prerequisite: false,
					baseCreditCount: 0,
					actionType: '',
					partialNameText: '',
					learningPathwayId: '',
					//departmentId: '',
					sortByHeadings: {
							sortField: '',
							isAsc: '',
							isNumber: ''
					},
					studentPersonId: props.accessRoles.learner ? props.personId : props.params && props.params.studentPersonId ? props.params.studentPersonId : '',
					courseName: '',
					description: '',
      }
    }

		componentDidUpdate() {
				let allCreditCount = this.baseCreditCount() + this.extraCreditCount();
				if (this.state.allCreditCount !== allCreditCount) {
						this.setState({ allCreditCount });
				}
				if (this.props.partialNameText) {
						//Take the partialNameText from the courseRecommendation which is on a different page.  Clear out all other filters.
						this.setState({
								partialNameText: this.props.partialNameText,
								//departmentId: '',
								learningPathwayId: '',
						});
						this.props.clearStudentCourseAssignNameSearch();
				}
		}

		componentWillUnMount() {
				clearInterval(this.state.timerId);
		}

		setNameFilter = (partialNameText) => {
				this.clearFilters();
				this.setState({ partialNameText })
		}

		finalizeRegistration = () => {
				if (this.hasCompleteCredits()) {
						this.handleFinalizeSubmit();
				} else if (!this.hasCompleteCredits()) {
						this.handleLackingCreditsOpen();
				}
		}

		baseCreditCount = () => {
				const {studentBaseCourseRequests} = this.props;
				let totalCredits = 0;

				studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests.forEach(m => {
						if (m.periodNumber !== "5") {
								totalCredits += m.intervals && m.intervals.length > 0 && m.intervals[0].intervalId === '64DE48C1-BDC8-422B-875B-FCA6F3504B11' ? 2 : m.credits ? m.credits : 0;
						}
				});
				return totalCredits ? totalCredits : 0;
		}

		extraCreditCount = () => {
				const {studentBaseCourseRequests} = this.props;
				let totalCredits = 0;

				studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests.forEach(m => {
						if (m.classPeriodName === '5') {
							   totalCredits += m.intervals && m.intervals.length > 0 && m.intervals[0].intervalId === '64DE48C1-BDC8-422B-875B-FCA6F3504B11' ? m.credits / 2 : m.credits;
						}
				});
				return totalCredits ? totalCredits : 0;
		}

		hasCompleteCredits = () => {
				const {companyConfig} = this.props;
				return Number(this.baseCreditCount()) >= Number(companyConfig.annualCreditsRequired);
		}

		changeItem = ({target}) => {
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
		}

		handleNotAvailableOpen = () => this.setState({isShowingModal_notOpen: true })
    handleNotAvailableClose = () => this.setState({isShowingModal_notOpen: false })

		handleFinalizeSubmit = () => {
				const {personId, studentPersonId, setFinalizeStudentBaseCourseRequests} = this.props;
				setFinalizeStudentBaseCourseRequests(personId, studentPersonId);
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Your class request has been marked as 'Finalized'.`}/></div>)
				browserHistory.push('/firstNav')
		}

		handleLackingCreditsOpen = () => this.setState({isShowingModal_lackingCredits: true })
    handleLackingCreditsClose = () => this.setState({isShowingModal_lackingCredits: false })

		handleDescriptionOpen = (courseName, description) => this.setState({isShowingModal_description: true, courseName, description })
    handleDescriptionClose = () => this.setState({isShowingModal_description: false })

		clearFilters = () => {
				this.setState({
						partialNameText: '',
						//departmentId: '',
						learningPathwayId: '',
				});
		}

		isSelectedCourse = (courseEntryId) => {
				const {studentBaseCourseRequests} = this.props;
				let hasSelected = false;
				studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests.forEach(m => {
						if (m.courseEntryId === courseEntryId) hasSelected = true;
				});
				return hasSelected;
		}

		toggleCourse = (courseEntryId, course) => {
				const {openRegistration, courseRecommendations, coursePrerequisites, studentPersonId, studentBaseCourseRequests, addStudentBaseCourseRequest,
								personId, removeStudentBaseCourseRequest, getGradRequirements, getCoursePrerequisites, me} = this.props;

				if (!me.salta && (!openRegistration || !openRegistration.isOpen)) {
						this.handleNotAvailableOpen();
						return;
				}

				//If there is not a recommendation and this course has a prerequisite, then show the dialog box for the required classes.
				let courseRecommendation = courseRecommendations && courseRecommendations.length > 0 && courseRecommendations
						.filter(m => (m.externalId && m.externalId.indexOf(course.courseId) > -1) || (course.courseId && course.courseId.indexOf(m.externalId) > -1))[0];

				let prerequisite = (coursePrerequisites && coursePrerequisites.length > 0 && coursePrerequisites.filter(pr => pr.courseEntryId === course.courseEntryId)[0]) || {};
				if (course.courseId === '1010T' || course.courseId === '1010' || course.courseId === '1018T' || course.courseId === '1018' || course.courseId === '1026' || course.courseId === '1010V' || course.courseId === '1018V' || course.courseId === '1026V') {
						//If the user has taken ELA 1 or Honors ELA, then reutrn null for no Pre-Req icon.
						let isEnrolledELA = studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests.filter(m => m.courseId === '0206' || m.courseId === '206' || m.courseId === '0205' || m.courseId === '205')[0];
						if (isEnrolledELA && isEnrolledELA.courseId) prerequisite = null;
				}

				if (!me.salta && !(courseRecommendation && courseRecommendation.courseEntryId) && prerequisite && prerequisite.courseEntryId && !prerequisite.hasFulfilled) {
						this.handlePrerequisiteOpen(this.getPrerequisiteMessageWithTitle(prerequisite));
						return;
				}

				//this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Please wait while your class request is recorded.`}/></div>)

				let studentBaseCourseRequest = studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests.filter(m => m.courseEntryId === courseEntryId)[0];

				if (studentBaseCourseRequest && studentBaseCourseRequest.studentBaseCourseRequestId && studentBaseCourseRequest.studentBaseCourseRequestId !== guidEmpty) {
						removeStudentBaseCourseRequest(personId, studentBaseCourseRequest.studentBaseCourseRequestId, () => {getGradRequirements(studentPersonId); getCoursePrerequisites(personId)});
				} else {
						let request = {
								studentPersonId,
								courseEntryId,
								externalId: course.externalId,
								courseName: course.courseName,
								credits: course.credits,
						}
						addStudentBaseCourseRequest(personId, request, () => {getGradRequirements(studentPersonId); getCoursePrerequisites(personId)});
				}
		}

		getPrerequisiteMessageWithTitle = (prerequisite) => {
				let prerequisiteMessage = '';
				let courseName = <L p={p} t={`Course: ${prerequisite.courseName} (${prerequisite.externalId}) Credits: ${prerequisite.credits}`}/>;
				prerequisiteMessage += prerequisite.firstList && prerequisite.firstList.length === 1
						? '<u><L p={p} t={`This class is required:`}/></u>'
						: '<u><L p={p} t={`One of these classes is required:`}/></u>'

				prerequisite.firstList && prerequisite.firstList.length > 0 && prerequisite.firstList.forEach(m => {
						prerequisiteMessage += <div><br/><L p={p} t={`${m.courseName} (${m.externalId}) Credits: ${m.credits}`}/></div>;
						prerequisiteMessage += m.hasCredit ? `&#10004;` : ``
				})

				if (prerequisite.secondList && prerequisite.secondList.length > 0) {
						prerequisiteMessage += prerequisite.secondList && prerequisite.secondList.length === 1
								? '<br/><br/><u><L p={p} t={`AND this class is required:`}/></u>'
								: '<br/><br/><u><L p={p} t={`AND one of these classes is required:`}/></u>'

						prerequisite.secondList && prerequisite.secondList.length > 0 && prerequisite.secondList.forEach(m => {
								prerequisiteMessage += <div><br/><L p={p} t={`${m.courseName} (${m.externalId}) Credits: ${m.credits}`}/></div>;
								prerequisiteMessage += m.hasCredit ? `&#10004;` : ``
						})
				}

				if (prerequisite.thirdList && prerequisite.thirdList.length > 0) {
						prerequisiteMessage += prerequisite.thirdList && prerequisite.thirdList.length === 1
								? '<br/><br/><u>AND this class is required:</u>'
								: '<br/><br/><u>AND one of these classes is required:</u>'

						prerequisite.thirdList && prerequisite.thirdList.length > 0 && prerequisite.thirdList.forEach(m => {
								prerequisiteMessage += <div><br/><L p={p} t={`${m.courseName} (${m.externalId}) Credits: ${m.credits}`}/></div>;
								prerequisiteMessage += !!m.hasCredit ? `&#10004;` : ``
						})
				}
				return { courseName, prerequisiteMessage };
		}

		setPrerequisiteIcon = (course) => { //courseId is the courseEntry.externalId
				const {coursePrerequisites, courseRecommendations, studentBaseCourseRequests} = this.props;
				let prerequisite = coursePrerequisites && coursePrerequisites.length > 0 && coursePrerequisites.filter(pr => pr.externalId === course.courseId)[0];
				//We use "courseId.indexOf(cr.externalId)" because if there is a course recommendation it needs to cover the online version or traditional version
				let courseRecommendation = (courseRecommendations && courseRecommendations.length > 0 && courseRecommendations
						.filter(cr => (course && course.courseId && course.courseId.indexOf(cr.externalId) > -1) || (cr.externalId && cr.externalId.indexOf(course.courseId) > -1)))[0] || {};
				//There is a special case where a student can take Spanish I, French I, or German I if the student is currently enrolled in ELA 1 or Honors ELA for ANY part of 2019-2020
				//		allow them to take the language classes.  That even means if they are signed up for ELA in Spring and want to take the World language in Fall BEFORE they take ELA, that's okay.
				if (course.courseId === '1010T' || course.courseId === '1010' || course.courseId === '1018T' || course.courseId === '1018' || course.courseId === '1026' || course.courseId === '1010V' || course.courseId === '1018V' || course.courseId === '1026V') {
						//If the user has taken ELA 1 or Honors ELA, then return null for no Pre-Req icon.
						let isEnrolledELA = studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests.filter(m => m.courseId === '0206' || m.courseId === '206' || m.courseId === '0205' || m.courseId === '205')[0];
						if (isEnrolledELA && isEnrolledELA.courseId) return null;
				}
				return prerequisite && prerequisite.courseEntryId && !((courseRecommendation && courseRecommendation.courseEntryId) || (prerequisite && prerequisite.hasFulfilled)) &&
				 		<div onClick={() => this.handlePrerequisiteOpen(this.getPrerequisiteMessageWithTitle(prerequisite))} data-rh={'Click to see prerequisites'}>
								<Icon pathName={'warning'} fillColor={'red'} className={styles.icon}/>
						</div>
		}

		handlePrerequisiteOpen = (prerequisite) => this.setState({ isShowingModal_prerequisite: true, courseName: prerequisite.courseName, prerequisiteMessage: prerequisite.prerequisiteMessage });
		handlePrerequisiteClose = () => this.setState({ isShowingModal_prerequisite: false, courseName: '', prerequisiteMessage: '' });

		setContentAreaFilter = (learningPathwayId) => {
				let newState = Object.assign({}, this.state);
				newState.learningPathwayId = learningPathwayId;
				this.setState(newState);
		}

		handleRefreshOpenRegistrations = () => {
				const {getOpenRegistrations, personId} = this.props;
				getOpenRegistrations(personId);
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The open registration search has been refreshed.`}/></div>)
		}

		handleRemoveOpen = (request) => this.setState({ isShowingModal_remove: true, request });
		handleRemoveClose = () => this.setState({ isShowingModal_remove: false, request: {} });
		handleRemove = (incomingRequest) => {
				const {personId, removeStudentBaseCourseRequest, declineCourseAssignByAdmin, removeCourseRecommendation, studentPersonId} = this.props;
				let request = incomingRequest ? incomingRequest : Object.assign({}, this.state.request);
				if (request.courseAssignByAdminId && request.courseAssignByAdminId !== guidEmpty) {
						declineCourseAssignByAdmin(personId, request.courseAssignByAdminId, studentPersonId);
				} else if (request.learnerCourseRecommendedId && request.learnerCourseRecommendedId !== guidEmpty) {
						removeCourseRecommendation(personId, studentPersonId, request.courseEntryId, 'Removed');
				} else {
						removeStudentBaseCourseRequest(personId, request.id);
				}
				this.handleRemoveClose();
		}

		toggleNoConfirmDelete = () => this.setState({ noConfirmDelete: !this.state.noConfirmDelete });

    render() {
      const {me, studentBaseCourseRequests, baseCourses, personId, gradeLevelName, students, viewStudent, removeStudentAssign, learningPathways,
							openRegistration, companyConfig={}, gradRequirements, fetchingRecord, finalizedDate } = this.props; //departments,

      const {isShowingModal_remove, isShowingModal_students, courseEntryId, course, studentList, isShowingModal_notOpen, learningPathwayId,
							sortByHeadings, partialNameText, allCreditCount, isShowingModal_lackingCredits, onlineOrTraditionalOnly,
							isShowingModal_doubledUp, isShowingModal_description, courseName, description, isShowingModal_prerequisite, prerequisiteMessage,
							noConfirmDelete} = this.state; //departmentId

			let localBaseCourses = baseCourses;
			if (localBaseCourses && localBaseCourses.length > 0 ) {
					if (partialNameText) {
							let cutBackTextFilter = partialNameText.toLowerCase();
							localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1));
					}
					// if (!!departmentId) {
					// 		localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(m => m.departmentId === Number(departmentId));
					// }
					if (learningPathwayId && learningPathwayId !== guidEmpty) {
							localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(m => m.learningPathwayId === learningPathwayId);
					}
					if (!!onlineOrTraditionalOnly && onlineOrTraditionalOnly !== 'all' && localBaseCourses && localBaseCourses.length > 0) {
							localBaseCourses = onlineOrTraditionalOnly === 'online'
									? localBaseCourses.filter(m => m.onlineName === 'Online')
									: localBaseCourses.filter(m => !m.onlineName);
					}
			}
			if (sortByHeadings && sortByHeadings.sortField) {
					localBaseCourses = doSort(localBaseCourses, sortByHeadings);
			}

			localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.map(m => {
					m.courseId = m.externalId;
					m.alertOrPrerequisite = <div className={styles.iconPosition}>{this.setPrerequisiteIcon(m)}</div>;
					m.choose = <div className={classes(styles.cellText, (m.intervals && m.intervals.length > 0 && (m.intervals[0].name.indexOf("MP1") > -1 || m.intervals[0].name.indexOf("MP2") > -1) ? styles.backMaroon : styles.backGray))}>
													{m.studentList && m.studentList.length >= m.maxSeats && !me.salta
															? <div className={classes(styles.cellText, styles.white)}>FULL</div>
															: <div onClick={() => this.toggleCourse(m.courseEntryId, m)} className={classes(styles.cellText, (m.studentList && m.studentList.length >= m.maxSeats ? styles.backRed : ''))}>
																		<Icon pathName={this.isSelectedCourse(m.courseEntryId) ? 'checkmark' : 'square_empty'} premium={!this.isSelectedCourse(m.courseEntryId)}
																				className={classes(styles.iconSquare, styles.backWhite)} fillColor={this.isSelectedCourse(m.courseEntryId) ? 'green' : 'black'}/>
																</div>
													}
											</div>;
					m.course = <div onClick={!m.description ? () => {} : () => this.handleDescriptionOpen(m.courseName, m.description)} className={classes(styles.wrap, (m.description ? styles.link : ''))}>
														{m.courseName}
												 </div>;

					m.creditCount = <div className={styles.cellText}>{m.credits}</div>
					return m;
			});

			let columns = [
				{
					width: 70,
					label: <L p={p} t={`Course Id`}/>,
					dataKey: 'courseId',
				},
				{
					width: 30,
					label: '',
					dataKey: 'alertOrPrerequisite',
				},
				{
					width: 50,
					label: '',
					dataKey: 'choose',
				},
				{
					width: 220,
					label: <L p={p} t={`Course`}/>,
					dataKey: 'course',
				},
				{
					width: 40,
					label: <L p={p} t={`Credits`}/>,
					dataKey: 'creditCount',
				},
			];

			let headings = [{},
					{label: <L p={p} t={`Id`}/>, tightText: true},
					{label: <L p={p} t={`Course`}/>, tightText: true},
					{label: <L p={p} t={`Credits`}/>, tightText: true}];

			let data =[]
			let totalCredits = 0;

			studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && studentBaseCourseRequests.forEach(m => {
					data.push([
							{value: m.courseAssignByAdminId && m.courseAssignByAdminId !== guidEmpty
												? m.suggestionOnly
														? <div className={styles.text}>Suggested</div>
														: <div className={styles.required}>REQUIRED</div>
												: m.learnerCourseRecommendedId && m.learnerCourseRecommendedId !== guidEmpty
														? <div className={styles.text}>Recommended</div>
														: ''
							},
							{value: m.courseAssignByAdminId && m.courseAssignByAdminId !== guidEmpty && !m.suggestionOnly
												? ''
												: <div className={globalStyles.remove} onClick={noConfirmDelete ? () => this.handleRemove(m) : () => this.handleRemoveOpen(m)}>remove</div>
							},
							{value: m.externalId},
							{value: m.courseName},
							{value: m.credits},
					]);
					totalCredits += m.credits;
			});
			studentBaseCourseRequests && studentBaseCourseRequests.length > 0 && data.push([{}, {}, {}, {value: <div className={styles.textRight}>Total</div>}, {value: totalCredits}]);

      return (
        <div className={styles.container} id={'topContainer'}>
						<div className={styles.rowWrap}>
		            <div className={styles.marginLeft}>
		                <div className={globalStyles.pageTitle}>
		                  	{`Choose Courses`}
		                </div>
										<div className={styles.rowWrap}>
												<div>
														<div className={classes(styles.mediumLeft, styles.subHeading)}>Open registration</div>
														{(!openRegistration || !openRegistration.openDateTo) &&
																<div className={classes(styles.doubleLeft, styles.noRecords)}>
																		<div><L p={p} t={`No open registration found for this student`}/></div>
																		<a onClick={this.handleRefreshOpenRegistrations} className={styles.link}><L p={p} t={`refresh`}/></a>
																</div>
														}
														<div className={classes(styles.doubleLeft, styles.row)}>
																{openRegistration && openRegistration.openDateFrom && <TextDisplay label={<L p={p} t={`From`}/>} text={<DateMoment date={openRegistration.openDateFrom} format={'D MMM YYYY'}/>}/>}
																{openRegistration && openRegistration.openDateTo && <TextDisplay label={<L p={p} t={`To`}/>} text={<DateMoment date={openRegistration.openDateTo} format={'D MMM YYYY'}/>}/>}
														</div>
												</div>
												<div className={styles.buttonDiv}>
														<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Finalize`}/>} onClick={this.finalizeRegistration}/>
														<div className={styles.count}><L p={p} t={`${allCreditCount} of ${companyConfig.annualCreditsRequired} credits`}/></div>
														{finalizedDate && <DateMoment date={finalizedDate} />}
												</div>
												<div className={styles.moreTop}>
														<TextDisplay label={<L p={p} t={`Grade level`}/>} text={gradeLevelName}/>
												</div>
										</div>
										<EditTable headings={headings} data={data} emptyMessage={<L p={p} t={`No courses chosen yet`}/>} isFetchingRecord={fetchingRecord.studentBaseCourseRequests}/>
										<div className={classes(styles.moreLeft, styles.moreTop)}>
												<Checkbox
														id={'noConfirmDelete'}
														label={<L p={p} t={`Do not confirm on delete`}/>}
														checked={noConfirmDelete || false}
														onClick={this.toggleNoConfirmDelete}
														labelClass={styles.labelNoConfirm}
														checkboxClass={styles.checkbox} />
										</div>
								</div>
								<div className={classes(styles.muchTop, styles.moreLeft)}>
										<div className={classes(styles.grayBack, styles.moreBottom, styles.rowWrap)}>
												<InputText
														id={"partialNameText"}
														name={"partialNameText"}
														size={"medium"}
														label={<L p={p} t={`Name search`}/>}
														value={partialNameText || ''}
														onChange={this.changeItem}/>
												<div>
														<SelectSingleDropDown
																id={`learningPathwayId`}
																label={companyConfig.urlcode === `Manheim` ? `Content Area` : <L p={p} t={`Subject/Discipline`}/>}
																value={learningPathwayId || ''}
																options={learningPathways}
																height={`medium`}
																onChange={this.changeItem}/>
												</div>
												{/*<div>
														<SelectSingleDropDown
																id={`departmentId`}
																label={`Department`}
																value={Number(departmentId) || ''}
																options={departments}
																height={`medium`}
																onChange={this.changeItem}/>
												</div>*/}
										</div>
										<GradRequirementAccordion gradRequirements={gradRequirements} personId={personId} companyConfig={companyConfig} />
										<Loading isLoading={fetchingRecord.scheduledCourses} />
										<Paper style={{ height: 400, width: 600, marginTop: '8px' }}>
												<TableVirtualFast rowCount={(localBaseCourses && localBaseCourses.length) || 0}
														rowGetter={({ index }) => (localBaseCourses && localBaseCourses.length > 0 && localBaseCourses[index]) || ''}
														columns={columns} />
										</Paper>
										{!fetchingRecord.scheduledCourses && !(localBaseCourses && localBaseCourses.length > 0) &&
												<span className={styles.noRecords}><L p={p} t={`no courses found`}/></span>
										}
								</div>
						</div>
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this course?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this course?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_notOpen &&
                <MessageModal handleClose={this.handleNotAvailableClose} heading={<L p={p} t={`No Open Registration`}/>}
                   explainJSX={<L p={p} t={`You are not currently in an open registration.`}/>}  onClick={this.handleNotAvailableClose} />
            }
						{isShowingModal_students &&
								<StudentListModal handleClose={this.handleStudentListClose} course={course} courseEntryId={courseEntryId}
										students={students} studentList={studentList} viewStudent={viewStudent} removeStudentAssign={removeStudentAssign} />
						}
						{isShowingModal_lackingCredits &&
                <MessageModal handleClose={this.handleLackingCreditsClose} heading={<L p={p} t={`Credit Count Is Not Complete`}/>}
                   explainJSX={<L p={p} t={`The number of credits must be ${companyConfig.annualCreditsRequired}.  Your credit count is currently ${allCreditCount}.`}/>}
									 onClick={this.handleLackingCreditsClose} />
            }
						{isShowingModal_doubledUp &&
                <MessageModal handleClose={this.handleDoubledUpChoicesClose} heading={<L p={p} t={`Too Many Choices`}/>}
                   explainJSX={<L p={p} t={`You have too many choices for at least one block.  Please check your entry and make a final choice before finalizing.`}/>}  onClick={this.handleDoubledUpChoicesClose} />
            }
						{isShowingModal_description &&
                <MessageModal handleClose={this.handleDescriptionClose} heading={courseName}
                   explain={description}  onClick={this.handleDescriptionClose} />
            }
						{isShowingModal_prerequisite &&
                <MessageModal handleClose={this.handlePrerequisiteClose} heading={courseName}
                   explainJSX={<div><L p={p} t={`You have not yet fulfilled this prerequisite.`}/>{prerequisiteMessage}</div>}  onClick={this.handlePrerequisiteClose} />
            }
        </div>
    )};
}

export default withAlert(StudentBaseCourseRequestView);
