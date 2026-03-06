import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import {browserHistory, Link} from 'react-router';
import styles from './NewSchoolCheckListView.css';
const p = 'NewSchoolCheckListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import FileUploadModal from '../../components/FileUploadModal';
import SchoolSetup from '../../components/SchoolSetup';
import StudentListTable from '../../components/StudentListTable';
import classes from 'classnames';
import { withAlert } from 'react-alert';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

class NewSchoolCheckListView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					isShowingFileUpload: false,
					expanded: '',
					hasChangedExpanded: false,
      }
    }

		componentDidMount() {
				const {personId, getCountsMainMenu} = this.props;
				getCountsMainMenu && this.setState({ countsTimerId: setInterval(() => getCountsMainMenu(personId), 10000), personId });
    }

    componentWillUnmount() {
        this.state.countsTimerId && clearInterval(this.state.countsTimerId);
    }

		fileUploadBuildUrl = () => {
	      const {personId} = this.props;
				this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`If you didn't get an error, the file was sent.  We will be back in touch as early as an hour from now.`}/></div>)
	      return `${apiHost}ebi/studentAdd/fileUpload/help/` + personId;
	  }

		recallAfterFileUpload = () => {
				//const {courseDocumentsInit, assignmentsInit, personId, courseEntryId} = this.props;
				//Some init file here?
		}

		handleFileUploadOpen = () => this.setState({isShowingFileUpload: true })
	  handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
	  handleSubmitFile = () => {
	      //const {courseDocumentsInit, personId, courseEntryId} = this.props;
				//Some init file here?
				this.handleFileUploadClose();
	  }

		handleExpansionChange = panel => (event, expanded) => {
		    this.setState({ expanded: expanded ? panel : false, hasChangedExpanded: true, });
	  };

		render() {
				const {personId, companyConfig={}, counts, schoolYears, setCompanyConfig, showLogout, students, gradeLevels, setStudentsSelected,
								getStudentSchedule, studentAssignmentsInit, studentSchedule, resetUserPersonClipboard, showForceFirstNav} = this.props;
				const {isShowingFileUpload, expanded} = this.state;

		    return (
		        <div className={styles.container}>
		            <div className={globalStyles.pageTitle}>
		              <L p={p} t={`New School Setup Check List`}/>
		            </div>
								<div className={styles.privacyPosition}>
										<Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
								</div>
								{showForceFirstNav &&
										<Link to={'/forceFirstNav'} className={classes(styles.link, styles.linkAlone, styles.row)}>
												<Icon pathName={'clipboard_check'} premium={true}/>
												<span className={styles.menuHeaderGreen}><L p={p} t={`Go to full admin main menu`}/></span>
										</Link>
								}
								<div className={classes(styles.row, styles.space)}>
										<Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={classes(styles.moreLeft, styles.icon)}/>
										<div className={styles.countHeader}></div>
										<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
										<div className={styles.stepCount}>1</div>
										<div className={styles.stepName}><L p={p} t={`Create new school`}/></div>
								</div>
								<ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleExpansionChange('panel1')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
												<div className={classes(styles.row, styles.space)}>
														{counts.learners || counts.uploadedStudentFile
																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
														}
														<div className={styles.countHeader}>{counts.learners}</div>
														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
														<div className={styles.stepCount}>2</div>
														<div className={styles.stepName}><L p={p} t={`Add your students`}/></div>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={styles.subSection}>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>1</div>
																<div className={styles.description}><L p={p} t={`Enter in students manually one-at-a-time`}/></div>
																<div className={styles.buttonPosition}>
																		<Button label={'Go >'} onClick={() => browserHistory.push('/studentAddManual')}/>
																</div>
														</div>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>2</div>
																<div className={styles.description}><L p={p} t={`Parents or guardians will register their children`}/></div>
														</div>
														<a className={classes(styles.link, styles.muchLeft, styles.wordBreak)} href={`https://www.eCademy.app/regLogin/${companyConfig && companyConfig.companyId && companyConfig.companyId.substring(0,6)}`} target={'_blank'}>
																{`https://www.eCademy.app/regLogin/${companyConfig && companyConfig.companyId && companyConfig.companyId.substring(0,6)}`}
														</a>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>3</div>
																<div className={styles.description}><L p={p} t={`Let us take care of it for you`}/></div>
														</div>
														<div className={classes(styles.description, styles.muchLeft)}>
																<L p={p} t={`Upload a list or spreadsheet of student and parent information and we will get all of the information in the right places for you`}/>
																<Button label={<L p={p} t={`Go >`}/>} onClick={this.handleFileUploadOpen}/>
														</div>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>4</div>
																<div className={styles.description}>
																		<L p={p} t={`Upload a comma-delimited file (.csv).  Specify the order of the data. (This is limited only to comma-delimited files.)`}/>
																</div>
														</div>
														<div className={classes(styles.description, styles.muchMoreLeft)}>
																<Button label={<L p={p} t={`Go >`}/>} onClick={() => browserHistory.push('/studentAddBulk')}/>
														</div>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleExpansionChange('panel2')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
												<div className={classes(styles.row, styles.space)}>
														{companyConfig.hasOpenedSettings
																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
														}
														<div className={styles.countHeader}></div>
														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
														<div className={styles.stepCount}>3</div>
														<div className={styles.stepName}><L p={p} t={`School settings`}/></div>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={styles.columns}>
														<div className={styles.instructions}><L p={p} t={`By just clicking on one of these links, we will mark that this step is complete since you at least looked around to see if you wanted to change a setting.`}/></div>
														<SchoolSetup personId={personId} companyConfig={companyConfig} schoolYears={schoolYears} setCompanyConfig={setCompanyConfig} />
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleExpansionChange('panel3')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
												<div className={classes(styles.row, styles.space)}>
														{counts.facilitators || counts.uploadedTeacherFile
																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
														}
														<div className={styles.countHeader}>{counts.facilitators}</div>
														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
														<div className={styles.stepCount}>4</div>
														<div className={styles.stepName}><L p={p} t={`Add teachers`}/></div>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={styles.subSection}>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>1</div>
																<div className={styles.description}><L p={p} t={`Enter in teachers manually one-at-a-time`}/></div>
																<div className={styles.buttonPosition}>
																		<Button label={<L p={p} t={`Go >`}/>} onClick={() => browserHistory.push('/userAdd/facilitator')}/>
																</div>
														</div>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>2</div>
																<div className={styles.description}><L p={p} t={`Let us take care of it for you`}/></div>
														</div>
														<div className={classes(styles.description, styles.muchLeft)}>
																<L p={p} t={`Upload a list or spreadsheet of teacher information and we will get all of the information in the right places for you`}/>
																<Button label={<L p={p} t={`Go >`}/>} onClick={this.handleFileUploadOpen}/>
														</div>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleExpansionChange('panel4')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
												<div className={classes(styles.row, styles.space)}>
														{counts.learningOpportunities || counts.uploadedCourseFile
																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
														}
														<div className={styles.countHeader}>{counts.learningOpportunities}</div>
														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
														<div className={styles.stepCount}>5</div>
														<div className={styles.stepName}><L p={p} t={`Add courses`}/></div>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={styles.subSection}>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>1</div>
																<div className={styles.description}><L p={p} t={`Enter in courses manually one-at-a-time`}/></div>
																<div className={styles.buttonPosition}>
																		<Button label={<L p={p} t={`Go >`}/>} onClick={() => browserHistory.push('/courseEntry')}/>
																</div>
														</div>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
																<div className={styles.optionCount}>2</div>
																<div className={styles.description}><L p={p} t={`Let us take care of it for you`}/></div>
														</div>
														<div className={classes(styles.description, styles.muchLeft)}>
																<L p={p} t={`Upload a list or spreadsheet of course information and we will get all of the information in the right places for you. Be sure to include semester, teacher and class period details.`}/>
																<Button label={<L p={p} t={`Go >`}/>} onClick={this.handleFileUploadOpen}/>
														</div>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel6'} onChange={this.handleExpansionChange('panel6')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
												<div className={classes(styles.row, styles.space)}>
														{counts.learnerCourseAssigns
																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
														}
														<div className={styles.countHeader}>{counts.learnerCourseAssigns}</div>
														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
														<div className={styles.stepCount}>6</div>
														<div className={styles.stepName}><L p={p} t={`Assign students to courses`}/></div>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={styles.subSection}>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.description}><L p={p} t={`Click on the clock icon to the left of the student's name to go to the course assignment page`}/></div>
														</div>
														<div className={styles.moreLeft}>
																<StudentListTable students={students} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
																		setStudentsSelected={setStudentsSelected} getStudentSchedule={getStudentSchedule}
																		personId={personId} studentAssignmentsInit={studentAssignmentsInit} studentSchedule={studentSchedule}
																		resetUserPersonClipboard={resetUserPersonClipboard}/>
														</div>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel7'} onChange={this.handleExpansionChange('panel7')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
												<div className={classes(styles.row, styles.space)}>
														{counts.courseAssignments
																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
														}
														<div className={styles.countHeader}>{counts.courseAssignments}</div>
														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
														<div className={styles.stepCount}>7</div>
														<div className={styles.stepName}><L p={p} t={`Add an assignment to a course`}/></div>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={styles.subSection}>
														<div className={classes(styles.row, styles.space)}>
																<div className={styles.description}>
																		<L p={p} t={`I'm going to send you to the Base Course page.  When you get there, click on the assignment icon that looks like a checklist.`}/>
																		<L p={p} t={`If you have more than one course entered already, click on one of the courses to enable the tool buttons.`}/>
																</div>
														</div>
														<Button label={<L p={p} t={`Go >`}/>} onClick={() => browserHistory.push('/baseCourses')}/>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								{showLogout &&
										<div className={styles.logoutPosition}>
												<Link to={`/myProfile`} className={classes(styles.row, styles.menuItem)}>
														<Icon pathName={'portrait'} premium={true} className={styles.iconBig}/>
														<L p={p} t={`My Profile`}/>
												</Link>
												<Link to={`/logout`} className={classes(styles.row, styles.menuItem)}>
														<Icon pathName={'stop_circle'} premium={true} className={styles.iconBig}/>
														<L p={p} t={`Logout`}/>
												</Link>
										</div>
								}
								<div className={classes(styles.muchTop)}>
										<OneFJefFooter />
								</div>
								{isShowingFileUpload &&
		                <FileUploadModal handleClose={this.handleFileUploadClose} title={<L p={p} t={`Record Upload`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={false}
		                    personId={personId} submitFileUpload={this.handleSubmitFile} sendInBuildUrl={this.fileUploadBuildUrl} handleRecordRecall={this.recallAfterFileUpload}
		                    acceptedFiles={".xls, .xlsx, .csv, .tsv"} iconFiletypes={['.xls', '.xlsx', '.csv', '.tsv']}/>
		            }
		        </div>
		    )
		};
}

export default withAlert(NewSchoolCheckListView);
