import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './BaseCoursesView.css';
const p = 'BaseCoursesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import TableVirtualFast from '../../components/TableVirtualFast';
import Paper from '@material-ui/core/Paper';
import Loading from '../../components/Loading';
import BaseCourseMenu from '../../components/BaseCourseMenu';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';
import {guidEmpty} from '../../utils/guidValidate.js';

class BaseCoursesView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					scrollTop: 0,
					isBaseCourseContextOpen: false,
					isBaseCourseSearch: false,
	        isShowingModal_remove: false,
					isShowingModal_message: false,
					isShowingModal_outcome: false,
					outcomeList: [],
					actionType: '',
					courseEntryId: '',
      }
    }

    componentDidUpdate() {
				const {personConfig} = this.props;
				if (!this.state.isInit && personConfig && personConfig.personId) {
						this.setState({
                isInit: true,
                partialNameText: personConfig.choices['CoursePartialNameText'],
                learningPathwayId: personConfig.choices['CourseLearningPathwayId'],
            });
				}
		}

		handleDuplicateCourse = (courseName) => {
				const {duplicateCourse, personId} = this.props;
				const {courseEntryId} = this.state;
				duplicateCourse(personId, courseEntryId, courseName);
		}

		handleSingleAddToClipboard = (courseEntryId) => {
				const {addCourseClipboard, personId, companyConfig} = this.props;
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The course clipboard had 1 record added.`}/></div>)
				addCourseClipboard(personId, {
						companyId: companyConfig.companyId,
						userPersonId: personId,
						courseList: [courseEntryId],
						courseListType: 'courseEntry'
				});
		}

		chooseRecord = (courseEntryId) => this.setState({ courseEntryId })

    handleResetFilter = () => {
        const {setPersonConfigChoice, personId} = this.props;
        setPersonConfigChoice(personId, 'CoursePartialNameText', '');
        setPersonConfigChoice(personId, 'CourseLearningPathwayId', '');
    }

    changeSearch = ({target}) => {
        let newState = Object.assign({}, this.state);
        newState[target.name] = target.value;
        this.setState(newState);
    }

    render() {
      const {personId, baseCourses, learningPathways, removeCourse, scheduledCourses, companyConfig={}, courseClipboard, accessRoles,
							myFrequentPlaces, setMyFrequentPlace, fetchingRecord, setPersonConfigChoice } = this.props;
      const {courseName, courseScheduledId, partialNameText, learningPathwayId} = this.state;

			let {courseEntryId} = this.state;
			if (!courseEntryId && baseCourses && baseCourses.length === 1) courseEntryId = baseCourses[0].courseEntryId;

			let filteredCourses = baseCourses;
			if (learningPathwayId && learningPathwayId !== guidEmpty && learningPathwayId != 0) { //eslint-disable-line
					filteredCourses = filteredCourses.filter(m => m.learningPathwayId === learningPathwayId);
			}
			if (partialNameText) {
					let cutBackTextFilter = partialNameText.toLowerCase();
					//cutBackTextFilter = cutBackTextFilter && cutBackTextFilter.length > 15 ? cutBackTextFilter.substring(0,15) : cutBackTextFilter;
					filteredCourses = filteredCourses && filteredCourses.length > 0 && filteredCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.length > 0 && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1));
			}

			// let startRecord = scrollTop / 30;
			// startRecord = startRecord - 40 < 0 ? 0 : startRecord - 40;
			// let maxRecords = 50;
			// let recordsWritten = 0;
			filteredCourses = filteredCourses && filteredCourses.length > 0 && filteredCourses.map((m, i) => {
					m.icons = <div className={classes(styles.cellText, styles.row, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
													{companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor) &&
															<a onClick={() => this.handleSingleAddToClipboard(m.courseEntryId)}>
																	{(!courseClipboard || !courseClipboard.courseList || !courseClipboard.courseList.length)
																			|| (courseClipboard && courseClipboard.courseList && courseClipboard.courseList.length > 0
																					&& courseClipboard.courseList.indexOf(m.courseEntryId) === -1)
																			? <Icon pathName={'clipboard_text'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuperAdd} superScriptClass={styles.superScriptAdd}/>
																			: <Icon pathName={'clipboard_text'} superscript={'cross'} supFillColor={'#750815'} premium={true} className={styles.iconSuperAdd} superScriptClass={styles.superScriptAdd}/>
																	}
															</a>
													}
											</div>;
					m.name = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
											{m.courseName}
									 </div>;
					m.codeDisplay = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
											{m.code}
									 </div>;
					m.content = <div onClick={() => { browserHistory.push('/assignmentList/' + m.courseEntryId); this.chooseRecord(m.courseEntryId)}}
														className={classes(styles.cellText, styles.link, (m.courseEntryId === courseEntryId ? styles.highlight : ''))}>
												{m.contentCount}
											</div>;
					m.creditsDisplay = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
															{m.credits}
														</div>;
					m.contentArea = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
														{m.learningPathwayName}
													</div>;

					if (companyConfig.urlcode !== 'Liahona' && companyConfig.urlcode !== 'Manheim') {
							m.stateId = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
														{m.stateCourseId}
													</div>;
							m.gpa = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
													{m.excludeFromGpa ? <L p={p} t={`Exclude`}/> : <L p={p} t={`Include`}/>}
											</div>;
							m.classRank = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
																{m.excludeFromClassRank ? <L p={p} t={`Exclude`}/> : <L p={p} t={`Include`}/>}
														</div>;
							m.honorRoll = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
																{m.excludeFromHonorRoll ? <L p={p} t={`Exclude`}/> : <L p={p} t={`Include`}/>}
														</div>;
							m.courseForLunch = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
																		{m.useTheCourseForLunch ? <L p={p} t={`Exclude`}/> : <L p={p} t={`Include`}/>}
																 </div>;
							m.gradeReport = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
																	{m.excludeOnGradeReport ? <L p={p} t={`Exclude`}/> : <L p={p} t={`Include`}/>}
															</div>;
							m.stateReports = <div className={classes(styles.cellText, (m.courseEntryId === courseEntryId ? styles.highlight : ''))} onClick={() => this.chooseRecord(m.courseEntryId)}>
																	{m.excludeFromStateReports ? <L p={p} t={`Exclude`}/> : <L p={p} t={`Include`}/>}
															 </div>;
					}
					return m;
			})

			let columns = [
				{
					width: 60,
					label: '',
					dataKey: 'icons',
				},
				{
					width: 320,
					label: <L p={p} t={`Name`}/>,
					dataKey: 'name',
				},
				{
					width: 60,
					label: <L p={p} t={`Code`}/>,
					dataKey: 'codeDisplay',
				},
				{
					width: 60,
					label: <L p={p} t={`Content`}/>,
					dataKey: 'content',
				},
				{
					width: 60,
					label: <L p={p} t={`Credits`}/>,
					dataKey: 'creditsDisplay',
				},
				{
					width: 120,
					label: companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Content area`}/> : <L p={p} t={`Discipline`}/>,
					dataKey: 'contentArea',
				}
		];

		if (companyConfig.urlcode !== 'Liahona' && companyConfig.urlcode !== 'Manheim') {
				columns = columns.concat([
						{
								width: 60,
								label: <L p={p} t={`State Id`}/>,
							  dataKey: 'stateId',
						},

						{
								width: 60,
								label: <L p={p} t={`GPA`}/>,
							  dataKey: 'gpa',
						},

						{
								width: 60,
								label: <L p={p} t={`Class rank`}/>,
							  dataKey: 'classRank',
						},

						{
								width: 60,
								label: <L p={p} t={`Honor roll`}/>,
							  dataKey: 'honorRoll',
						},

						{
								width: 60,
								label: <L p={p} t={`Course for lunch`}/>,
							  dataKey: 'courseForLunch',
						},

						{
								width: 60,
								label: <L p={p} t={`Grade report`}/>,
							  dataKey: 'gradeReport',
						},

						{
								width: 60,
								label: <L p={p} t={`State reports`}/>,
							  dataKey: 'stateReports',
						},
				]);
		}



      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
                  	{`Courses`}
                </div>
								<div className={classes(globalStyles.instructionsBigger, styles.strong)}>
										Instructions
								</div>
								<div className={globalStyles.instructionsBigger}>
										<L p={p} t={`1. This record is considered a 'base course' so that it can be rescheduled at different times with different teachers.`}/>
								</div>
								<div className={globalStyles.instructionsBigger}>
										<L p={p} t={`2. An assignment is connected with a 'base course' so that you don't have to enter the same assignment for the repeated classes.`}/>
								</div>
								<div className={classes(globalStyles.instructionsBigger, styles.moreLeft)}>
										<L p={p} t={`a. However, the assignment entry lets you exclude one or more classes in case the assignment is special for a given class.`}/>
								</div>
								<div className={globalStyles.instructionsBigger}>
										<L p={p} t={`3. If the assignments for a similar class are going to vary more often than not, create another base class here.`}/>
								</div>
								<div className={globalStyles.instructionsBigger}>
										<L p={p} t={`4. Schedule at least one class from this base course and you are ready to go!`}/>
								</div>
								<div className={styles.row}>
										{//<a onClick={() => browserHistory.push('/courseLibrary')} className={classes(styles.row, styles.addNew)}>
				               // <L p={p} t={`Go to course library`}/>
				            //</a>
									  }
										{accessRoles.admin &&
												<a onClick={() => browserHistory.push('/courseEntry')} className={classes(styles.row, styles.addNew, styles.moreTop)}>
						                <Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
						                <L p={p} t={`Create a new course`}/>
						            </a>
										}
										{companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor) &&
												<Link to={'/learnerCourseAssign'} className={classes(styles.addNew, styles.row)}>
														<Icon pathName={'presentation'} premium={true} className={styles.icon}/>
														<div className={styles.tabs}><L p={p} t={`Go to`}/><br/><L p={p} t={`Recommend`}/><br/><L p={p} t={`Courses`}/></div>
												</Link>
										}
										<div className={styles.littleLeft}>
												<InputText
														id={"partialNameText"}
														name={"partialNameText"}
														size={"medium"}
														label={<L p={p} t={`Name search`}/>}
                            value={partialNameText || ''}
                            onChange={this.changeSearch}
                            onBlur={() => setPersonConfigChoice(personId, 'CoursePartialNameText', event.target.value)}/>
										</div>
										<div className={styles.moreBottomMargin}>
												<SelectSingleDropDown
														id={`learningPathwayId`}
														name={`learningPathwayId`}
														label={companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Content Area Search`}/> : <L p={p} t={`Discipline Search`}/>}
														options={learningPathways || []}
														height={`medium`}
                            value={learningPathwayId || ''}
                            onChange={this.changeSearch}
                            onBlur={() => setPersonConfigChoice(personId, 'CourseLearningPathwayId', event.target.value)}/>
										</div>
                    <div className={classes(styles.muchTop, styles.muchLeft)}>
                        <a onClick={this.handleResetFilter} className={classes(styles.row, styles.link)}>
    												<Icon pathName={'flashlight'} premium={true} className={styles.iconSmaller}/>
    												Clear search
    										</a>
                    </div>
								</div>
								<div className={styles.widthStop}>
										{filteredCourses && filteredCourses.length > 0 && companyConfig.features && accessRoles.admin &&
												<BaseCourseMenu personId={personId} removeRecord={removeCourse} courseName={courseName} actionType={"BASECOURSE"}
														hideContextCourseActionMenu={this.hideContextCourseActionMenu} courseDuplicate={this.handleDuplicateCourse}
														id={courseEntryId} courseEntryId={courseEntryId} courseScheduledId={courseScheduledId}
														scheduledCourses={scheduledCourses} isAdmin={accessRoles.admin} companyConfig={companyConfig}/>
										}
										<Loading isLoading={fetchingRecord.baseCourses} />
										<Paper style={{ height: 400, width: companyConfig.urlcode === 'Liahona' || companyConfig.urlcode === 'Manheim' ? '700px' : '1260px', marginTop: '8px' }}>
												<TableVirtualFast rowCount={(filteredCourses && filteredCourses.length) || 0}
														rowGetter={({ index }) => (filteredCourses && filteredCourses.length > 0 && filteredCourses[index]) || ''}
														columns={columns} />
										</Paper>
								</div>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Courses (base)`}/>} path={'baseCourses'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
        		<OneFJefFooter />
        </div>
    )};
}

export default withAlert(BaseCoursesView);
