import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import * as globalStyles from '../../utils/globalStyles.css';
import psPlus from '../../assets/ps_plus.png';
import styles from './AssignmentListMenu.css';
import classes from 'classnames';
import Icon from '../Icon';
import { withAlert } from 'react-alert';
import {guidEmpty} from '../../utils/guidValidate.js';
import FileUploadModal from '../../components/FileUploadModal';
import TextareaModal from '../../components/TextareaModal';
import PenspringFileModal from '../../components/PenspringFileModal';
import MessageModal from '../../components/MessageModal';
const p = 'component';
import L from '../../components/PageLanguage';

class AssignmentListMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

		handlePenspringFileOpen_assignment = (assignment) => this.setState({isShowingPenspringFile_assignment: true, sendAssignment: assignment })
	  handlePenspringFileClose_assignment = () => this.setState({isShowingPenspringFile_assignment: false, assignment: {}})
	  handlePenspringFile_assignment = () => {
	      const {assignmentsInit, personId, assignment} = this.props;
	      assignmentsInit(personId, assignment.courseEntryId)
				this.handlePenspringFileClose_assignment();
	  }

		handleFileUploadOpen_assignment = (assignmentId) => this.setState({isShowingFileUpload_assignment: true, assignmentId })
	  handleFileUploadClose_assignment = () => this.setState({isShowingFileUpload_assignment: false})
	  handleSubmitFile_assignment = () => {
	      const {assignmentsInit, personId, assignment} = this.props;
	      assignmentsInit(personId, assignment.courseEntryId)
				this.handleFileUploadClose_assignment();
	  }

		handleWebsiteLinkOpen_assignment = (assignmentId) => this.setState({isShowingWebsiteLink_assignment: true, assignmentId})
		handleWebsiteLinkClose_assignment = () => this.setState({isShowingWebsiteLink_assignment: false})
		handleWebsiteLinkSave_assignment = (websiteLink) => {
				const {saveAssignmentWebsiteLink, personId} = this.props;
				const {assignmentId} = this.state;
				saveAssignmentWebsiteLink(personId, assignmentId, websiteLink);
				this.handleWebsiteLinkClose_assignment();
		}

		chooseAssignment = () => {
				this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Choose a assignment from the list. Then, choose an action.`}/></div>)
		}

		handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
		handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
		handleDelete = () => {
				const {removeAssignment, personId, assignment} = this.props;
				removeAssignment(personId, assignment.assignmentId); //, () => assignmentsInit(personId, assignment.courseEntryId)
				this.handleDeleteClose();
				//browserHistory.push('/assignmentList/' + assignment.courseEntryId);
		}

    render() {
        const {personId, className="", assignment={}, languageList, createWorkAndPenspringTransfer, companyConfig, accessRoles, course,
								assignmentsInit, sendInBuildUrl, handleRecordRecall} = this.props;
				const {isShowingFileUpload_assignment, isShowingWebsiteLink_assignment, isShowingPenspringFile_assignment, isShowingModal_delete} = this.state;
				let hasRecordChosen = !assignment || !assignment.courseEntryId ? false : true;

        return (
            <div className={classes(styles.container, className)}>
								<a onClick={!hasRecordChosen ? this.chooseAssignment : () => browserHistory.push('/assignmentEntry/' + assignment.courseEntryId + '/' + assignment.assignmentId)}
												data-rh={'Edit assignment'}>
										<Icon pathName={'pencil0'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseAssignment : () => browserHistory.push('/assignmentEntry/' + assignment.courseEntryId + '/' + guidEmpty + '/' + assignment.sequence)}
												data-rh={'Add another assignment before the chosen assignment'}>
										<Icon pathName={'plus'} fillColor={'green'} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseAssignment : () => this.handlePenspringFileOpen_assignment(assignment)} data-rh={'Create a Penspring file'}>
										<img src={psPlus} alt="PS" className={classes(styles.moreLeft, styles.penspringIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseAssignment : () => this.handleFileUploadOpen_assignment(assignment.assignmentId)} data-rh={'Upload a file'}>
										<Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'green'}
												className={classes(styles.imageLessleft, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}
												superScriptClass={classes(styles.addedIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseAssignment : () => this.handleWebsiteLinkOpen_assignment(assignment.assignmentId)} data-rh={'Add a website link'}>
										<Icon pathName={'link2'} premium={true} superscript={'plus'} supFillColor={'green'}
												className={classes(styles.imageLessleft, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}
												superScriptClass={classes(styles.addedIconLessLeft, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseAssignment : this.handleDeleteOpen} data-rh={'Delete this assignment'}>
										<Icon pathName={'trash2'} premium={true} fillColor={hasRecordChosen ? 'maroon' : ''}
												className={classes(styles.imageLessleft, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
								</a>

								{isShowingPenspringFile_assignment &&
		                <PenspringFileModal key={'all'} handleClose={this.handlePenspringFileClose_assignment} onClick={this.handlePenspringFileClose_assignment}
											 languageList={languageList} createWorkAndPenspringTransfer={createWorkAndPenspringTransfer} personId={personId} companyConfig={companyConfig}
											 accessRoles={accessRoles} course={course} assignment={assignment}
											 recallInitRecords={() => {assignmentsInit(personId, assignment.courseEntryId); this.handlePenspringFileClose_assignment();}}/>
		            }
								{isShowingFileUpload_assignment &&
		                <FileUploadModal handleClose={this.handleFileUploadClose_assignment} title={<L p={p} t={`Assigment Attachment`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={true}
		                    personId={personId} submitFileUpload={this.handleSubmitFile_assignment} sendInBuildUrl={sendInBuildUrl}
		                    handleRecordRecall={handleRecordRecall}
		                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
		                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
		            }
								{isShowingWebsiteLink_assignment &&
		                <TextareaModal key={'all'} handleClose={this.handleWebsiteLinkClose_assignment} heading={<L p={p} t={`Website Link`}/>} showTitle={true}
												explainJSX={<L p={p} t={`Choose a website link for an assignment.`}/>} onClick={this.handleWebsiteLinkSave_assignment} placeholder={<L p={p} t={`Website URL?`}/>}/>
		            }
								{isShowingModal_delete &&
		                <MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this assignment?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to remove this assignment? Access to any homeowrk and grades turned in for this homework will be lost.`}/>} isConfirmType={true}
		                   onClick={this.handleDelete} />
		            }
            </div>
        )
    }
};

export default withAlert(AssignmentListMenu);
