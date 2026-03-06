import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import styles from './CourseAssignByAdminAddView.css';
const p = 'CourseAssignByAdminAddView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import Loading from '../../components/Loading';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import Checkbox from '../../components/Checkbox';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import RadioGroup from '../../components/RadioGroup';
import EditTable from '../../components/EditTable';
import Paper from '@material-ui/core/Paper';
import TableVirtualFast from '../../components/TableVirtualFast';
import classes from 'classnames';
import {doSort} from '../../utils/sort.js';
import {withAlert} from 'react-alert';
import {guidEmpty} from '../../utils/guidValidate.js';

class CourseAssignByAdminAddView extends Component {

    constructor(props) {
      super(props);

      this.state = {
	        isShowingModal_remove: false,
					isShowingModal_description: false,
					partialNameText: '',
					learningPathwayId: '',
					departmentId: '',
					sortByHeadings: {
							sortField: '',
							isAsc: '',
							isNumber: ''
					},
					courseName: '',
					description: '',
					localCourseAssign: [],
					requiredOrSuggested: '',
      }
    }

		setNameFilter = (partialNameText) => {
				this.clearFilters();
				this.setState({ partialNameText })
		}

		changeItem = ({target}) => {
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
		}

		handleDescriptionOpen = (courseName, description) => this.setState({isShowingModal_description: true, courseName, description })
    handleDescriptionClose = () => this.setState({isShowingModal_description: false })

		clearFilters = () => {
				this.setState({
						partialNameText: '',
						departmentId: '',
						learningPathwayId: '',
				});
		}

		isSelectedCourse = (courseEntryId) => {
				const {localCourseAssign} = this.state;
				let hasSelected = false;
				localCourseAssign && localCourseAssign.length > 0 && localCourseAssign.forEach(m => {
						if (m.courseEntryId === courseEntryId) hasSelected = true;
				});
				return hasSelected;
		}

		toggleCourse = (courseEntryId, course) => {
				const {localCourseAssign} = this.state;

				let courseAssignByAdmin = localCourseAssign && localCourseAssign.length > 0 && localCourseAssign.filter(m => m.courseEntryId === courseEntryId)[0];

				if (courseAssignByAdmin && courseAssignByAdmin.courseEntryId) {
						this.setState({ localCourseAssign: localCourseAssign.filter(m => m.courseEntryId !== courseEntryId) });
				} else {
						let assign = {
								courseEntryId,
								externalId: course.externalId,
								courseName: course.courseName,
								credits: course.credits,
						}
						this.setState({ localCourseAssign: localCourseAssign && localCourseAssign.length > 0 ? localCourseAssign.concat(assign) : [assign] });
				}
		}

		setContentAreaFilter = (learningPathwayId) => {
				let newState = Object.assign({}, this.state);
				newState.learningPathwayId = learningPathwayId;
				this.setState(newState);
		}

		handleRemoveOpen = (id) => this.setState({ isShowingModal_remove: true, id });
		handleRemoveClose = () => this.setState({ isShowingModal_remove: false, id: '' });
		handleRemove = () => {
				const {personId, removeStudentBaseCourseRequest} = this.props;
				const {id} = this.state;
				removeStudentBaseCourseRequest(personId, id);
				this.handleRemoveClose();
		}

		processForm = () => {
				const {personId, addCourseAssignByAdmin} = this.props;
				const {studentIdList, selectedGradeLevels, localCourseAssign, requiredOrSuggested} = this.state;
				let missingInfoMessage = [];

				if (!(localCourseAssign && localCourseAssign.length > 0)) {
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one course`}/></div>
				}
				if (!(studentIdList && studentIdList.length > 0) && !(selectedGradeLevels && selectedGradeLevels.length > 0)) {
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one student or grade level`}/></div>
				}
				if (!requiredOrSuggested) {
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Required or suggested`}/></div>
				}

				if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
						let courseAssign = {
							courseEntryIds: localCourseAssign.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.courseEntryId) : [m.courseEntryId], []),
							gradeLevelIds: selectedGradeLevels,
							studentPersonIds: studentIdList.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []),
							suggestionOnly: requiredOrSuggested === 'suggested' ? true : false,
						}
						addCourseAssignByAdmin(personId, courseAssign);
						this.setState({
								localCourseAssign: [],
								studentIdList: [],
								selectedGradeLevels: [],
								requiredOrSuggested: '',
						})
						this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Your entry has been saved.  You can enter another course assignment.`}/></div>)
				} else {
						this.handleMissingInfoOpen(missingInfoMessage);
				}
		}

		dataListChange = (field, studentIdList) => {
				// let studentIdList = Object.assign([], this.state.studentIdList);
				// studentIdList = values && values.length > 0 && values.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
				const {selectedGradeLevels} = this.state;
				if (selectedGradeLevels && selectedGradeLevels.length > 0) {
						this.handleStudentOrGradeLevelOpen('student');
				}
				this.setState({ studentIdList, selectedGradeLevels: [] })
		}

		removeStudent = (id) => {
				let studentIdList = Object.assign([], this.state.studentIdList);
				studentIdList = studentIdList.filter(m => m.id !== id);
				this.setState({ studentIdList })
		}

		toggleGradeLevel = (gradeLevelId) => {
				let selectedGradeLevels = Object.assign([], this.state.selectedGradeLevels);
				const {studentIdList} = this.state;
				if (studentIdList && studentIdList.length > 0) {
						this.handleStudentOrGradeLevelOpen('grade level');
				}

				selectedGradeLevels = selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.indexOf(gradeLevelId) > -1
						? selectedGradeLevels.filter(id => id !== gradeLevelId)
						: selectedGradeLevels && selectedGradeLevels.length > 0
								? selectedGradeLevels.concat(gradeLevelId)
								: [gradeLevelId];
				this.setState({ selectedGradeLevels, studentIdList: [] });
		}

		clearFilters = () => {
				this.setState({
						studentIdList: [],
						selectedGradeLevels: [],
						localCourseAssign: [],
						requiredOrSuggested: '',
				});
		}

		handleStudentOrGradeLevelOpen = (chosenType) => this.setState({ isShowingModal_assignOne: true, chosenType })
		handleStudentOrGradeLevelClose = () => this.setState({ isShowingModal_assignOne: false, chosenType: '' })

		handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

		changeRequiredOrSuggested  = (requiredOrSuggested) => {
				this.setState({ requiredOrSuggested });
		}

    render() {
      const {me, baseCourses, learningPathways, companyConfig={}, fetchingRecord, students, coursesScheduled, personConfig={} } = this.props; //departments,
      const {localCourseAssign, isShowingModal_remove, learningPathwayId, sortByHeadings, partialNameText, onlineOrTraditionalOnly,
							isShowingModal_description, courseName, description, studentIdList, selectedGradeLevels, requiredOrSuggested, //departmentId,
							isShowingModal_assignOne, chosenType, isShowingModal_missingInfo, messageInfoIncomplete, courseScheduledId} = this.state;

			let localBaseCourses = baseCourses;
			if (localBaseCourses && localBaseCourses.length > 0 ) {
					if (partialNameText) {
							let cutBackTextFilter = partialNameText.toLowerCase();
							//cutBackTextFilter = cutBackTextFilter && cutBackTextFilter.length > 15 ? cutBackTextFilter.substring(0,15) : cutBackTextFilter;
							localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1));
					}
					// if (departmentId && departmentId !== '0' && departmentId !== guidEmpty) {
					// 		localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(m => m.departmentId === Number(departmentId));
					// }
					if (learningPathwayId && learningPathwayId !== '0' && learningPathwayId !== guidEmpty) {
							localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(m => m.learningPathwayId === learningPathwayId);
					}
					if (!!onlineOrTraditionalOnly && onlineOrTraditionalOnly !== 'all' && localBaseCourses && localBaseCourses.length > 0) {
							localBaseCourses = onlineOrTraditionalOnly === 'online'
									? localBaseCourses.filter(m => m.onlineName === 'Online' || m.online)
									: localBaseCourses.filter(m => !m.onlineName && !m.online);
					}
					if (courseScheduledId && courseScheduledId !== '0') {

					}
			}
			if (sortByHeadings && sortByHeadings.sortField) {
					localBaseCourses = doSort(localBaseCourses, sortByHeadings);
			}

			localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.map(m => {
					m.courseId = m.externalId;
					m.choose = <div className={classes(styles.cellText, styles.backGray)}>
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
					numeric: true,
				},
			];

			let headings = [{},
					{label: <L p={p} t={`Id`}/>, tightText: true},
					{label: <L p={p} t={`Course`}/>, tightText: true},
					{label: <L p={p} t={`Credits`}/>, tightText: true}];

			let data =[]
			let totalCredits = 0;

			localCourseAssign && localCourseAssign.length > 0 && localCourseAssign.forEach(m => {
					data.push([
							{value: <div className={globalStyles.remove} onClick={() => this.handleRemoveOpen(m.id)}><L p={p} t={`remove`}/></div>},
							{value: m.externalId},
							{value: m.courseName},
							{value: m.credits},
					]);
					totalCredits += m.credits;
			});
			localCourseAssign && localCourseAssign.length > 0 && data.push([{}, {}, {value: <div className={styles.textRight}><L p={p} t={`Total`}/></div>}, {value: totalCredits}]);

      return (
        <div className={styles.container} id={'topContainer'}>
						<div>
		            <div className={styles.marginLeft}>
		                <div className={globalStyles.pageTitle}>
		                  	<L p={p} t={`Assign Courses by Admin (Required or Suggested)`}/>
		                </div>
										<div className={styles.rowWrap}>
												<div>
														<div className={classes(styles.subHeading, styles.littleLeft)}><L p={p} t={`New Required or Suggested Courses`}/></div>
														<EditTable headings={headings} data={data} emptyMessage={'No courses chosen yet'} />
														<hr/>
												</div>
												<div className={classes(styles.row, styles.moreLeft)} onClick={() => browserHistory.push(`/courseAssignByAdminList`)}>
														<Icon pathName={'list3'} className={styles.icon} premium={true}/>
														<Link to={`/courseAssignByAdminList`} className={styles.menuItem}><L p={p} t={`Go to course assignment list`}/></Link>
												</div>
										</div>
										<div className={classes(globalStyles.instructionsBigger, styles.moreBottom)}>
												<L p={p} t={`Student or Grade Level`}/>
										</div>
										<div className={styles.rowWrap}>
												<div className={styles.inputPosition}>
														<InputDataList
																label={<L p={p} t={`Choose one or more students`}/>}
																name={'studentIdList'}
																options={students}
																value={studentIdList || []}
																multiple={true}
																height={`medium`}
																onChange={(values) => this.dataListChange('studentIdList', values)}
																removeFunction={this.removeStudent}/>
												</div>
												<div>
														<SelectSingleDropDown
																id={`courseScheduledId`}
																name={`courseScheduledId`}
																label={<L p={p} t={`Students by course`}/>}
																value={courseScheduledId}
																options={coursesScheduled}
																className={styles.moreBottomMargin}
																maxwidth={`medium`}
																height={`medium`}
																onChange={this.changeFilters}
																onEnterKey={this.handleEnterKey}/>
												</div>
												<div className={styles.moreLeft}>
														<span className={styles.textRating}><L p={p} t={`Or choose by one or more grade levels`}/></span>
														<div className={styles.rowWrap}>
																{personConfig.gradeLevels && personConfig.gradeLevels.length > 0 && personConfig.gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
																		<Checkbox
																				key={i}
																				id={m.gradeLevelId}
																				label={m.name}
																				checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && (selectedGradeLevels.indexOf(m.gradeLevelId) > -1 || selectedGradeLevels.indexOf(String(m.gradeLevelId)) > -1)) || ''}
																				onClick={() => this.toggleGradeLevel(m.gradeLevelId)}
																				labelClass={styles.labelCheckbox}
																				checkboxClass={styles.checkbox} />
																)}
														</div>
												</div>
												<div className={classes(styles.moreTop, styles.row)}>
														<div>
																<div className={classes(globalStyles.instructionsBigger, styles.instructionsWidth)}>
																		<L p={p} t={`You can choose a course to be required and another course as suggested, but save them as two separately submitted records.`}/>
																</div>
																<RadioGroup
																		title={<L p={p} t={`Required or suggested`}/>}
																		data={[{ id: 'required', label: <L p={p} t={`Required`}/>}, { id: 'suggested', label: <L p={p} t={`Suggested`}/>}]}
																		horizontal={true}
																		className={styles.radio}
																		initialValue={requiredOrSuggested}
																		required={true}
																		whenFilled={requiredOrSuggested}
																		labelClass={styles.radioLabel}
																		onClick={this.changeRequiredOrSuggested}/>
														</div>
														<div className={styles.muchMoreTop}>
																<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Submit`}/>} onClick={this.processForm}/>
														</div>
												</div>
										</div>
										<hr/>
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
																label={companyConfig.urlcode === `Manheim` ? <L p={p} t={`Content Area`}/> : <L p={p} t={`Discipline`}/>}
																value={learningPathwayId || ''}
																options={learningPathways}
																height={`medium`}
																onChange={this.changeItem}/>
												</div>
												{/*<div>
														<SelectSingleDropDown
																id={`departmentId`}
																label={<L p={p} t={`Department`}/>}
																value={Number(departmentId) || ''}
																options={departments}
																height={`medium`}
																onChange={this.changeItem}/>
												</div>*/}
												<a onClick={this.clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
														<L p={p} t={`Clear filters`}/>
												</a>
										</div>
								</div>
								<Loading isLoading={fetchingRecord.baseCourses} />
								<Paper style={{ height: 400, width: '90vw', marginTop: '8px' }}>
										<TableVirtualFast rowCount={(localBaseCourses && localBaseCourses.length) || 0}
												rowGetter={({ index }) => (localBaseCourses && localBaseCourses.length > 0 && localBaseCourses[index]) || ''}
												columns={columns} />
								</Paper>
								{!fetchingRecord.baseCourses && !(localBaseCourses && localBaseCourses.length > 0) &&
										<span className={styles.noRecords}><L p={p} t={`no courses found`}/></span>
								}
						</div>
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this course?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this course?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_description &&
                <MessageModal handleClose={this.handleDescriptionClose} heading={courseName}
                   explain={description}  onClick={this.handleDescriptionClose} />
            }
						{isShowingModal_assignOne &&
                <MessageModal handleClose={this.handleStudentOrGradeLevelClose} heading={<L p={p} t={`Choose either Students or Grade Levels`}/>}
                   explainJSX={<L p={p} t={`You have chosen a ${chosenType}. You can choose either one or more students or one or more grade levels. Your previous ${chosenType} choice will be deleted.`}/>}
									 onClick={this.handleStudentOrGradeLevelClose} />
            }
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
        </div>
    )};
}

export default withAlert(CourseAssignByAdminAddView);
