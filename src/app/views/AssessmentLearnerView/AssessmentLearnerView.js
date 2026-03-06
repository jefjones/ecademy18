import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {apiHost} from '../../api_host.js';
import styles from './AssessmentLearnerView.css';
const p = 'AssessmentLearnerView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import AssessIncompleteModal from '../../components/AssessIncompleteModal';
import MessageModal from '../../components/MessageModal';
import TextDisplay from '../../components/TextDisplay';
import LinkDisplay from '../../components/LinkDisplay';
import FileUploadModal from '../../components/FileUploadModal';
import AssessmentTrueFalse from '../../components/AssessmentTrueFalse';
import AssessmentMultipleChoice from '../../components/AssessmentMultipleChoice';
import AssessmentMultipleAnswer from '../../components/AssessmentMultipleAnswer';
import AssessmentEssay from '../../components/AssessmentEssay';
import AssessmentPassage from '../../components/AssessmentPassage';
import AssessmentPictureAudio from '../../components/AssessmentPictureAudio';
import AssessmentSingleEntry from '../../components/AssessmentSingleEntry';
import AssessmentFillBlank from '../../components/AssessmentFillBlank';
import AssessmentMatching from '../../components/AssessmentMatching';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import BreadCrumb from '../../components/BreadCrumb';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class AssessmentLearnerView extends Component {
    constructor(props) {
      super(props);

      this.state = {
          isShowingModal_removeFileUpload: false,
          isShowingFileUpload: false,
          isShowingModal_incomplete: false,
          isRecordComplete: false,
      }
  }

	componentDidUpdate() {
			const {assessment, assessmentQuestions} = this.props;
			const {isInit} = this.state;
			if (assessment && assessment.assessmentId && assessment.oneAtAtimeView && !isInit && assessmentQuestions && assessmentQuestions.length > 0) {
					this.setState({ isInit: true, currentIndex: 1 })
					this.showOneAtATimeView(1);
					this.setBreadCrumb();
			}
	}

  processForm = () => {
      //Check to see if all of the answers are complete.  If not, send a message that will explain which ones are not answered yet.
      const {correctAssessment, assessmentQuestions, personId, assessment, courseScheduledId, assignmentId} = this.props;
      let notAnswered = [];
      assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.forEach(m => {
          if (!m.learnerAnswer && m.questionTypeCode !== 'PASSAGE') {
							let incomplete = m.sequence + ' - ' + (m.questionText.length > 35 ? m.questionText.substring(0,35) + '...' : m.questionText);
              notAnswered = notAnswered ? notAnswered.concat(incomplete) : [incomplete]
          }
      });

      if (notAnswered && notAnswered.length > 0) {
          this.setState({ notAnswered });
          this.handleIncompleteOpen();
      } else {
					let runFunction = () => browserHistory.push(`/assessmentCorrect/${assignmentId}/${assessment.assessmentId}/${personId}/${courseScheduledId}`)
		      correctAssessment(personId, personId, assessment.assessmentId, assignmentId, runFunction); //In this case, the personId and studentPersonId are the same.
      }


  }

  handleFileUploadOpen = (assessmentQuestionId) => this.setState({isShowingFileUpload: true, assessmentQuestionId })
  handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
  handleSubmitFile = () => {
      const {assessmentQuestionsInit, personId, assessmentId, assignmentId} = this.props;
      this.handleFileUploadClose();
      assessmentQuestionsInit(personId, personId, assessmentId, assignmentId);
  }

  recallAfterFileUpload = () => {
      const {assessmentQuestionsInit, personId, assessmentId, assignmentId} = this.props;
      assessmentQuestionsInit(personId, personId, assessmentId, assignmentId);
  }

  fileUploadBuildUrl = (title) => {
      const {personId, assessmentId} = this.props;
      const {assessmentQuestionId} = this.state;
      return `${apiHost}ebi/assessmentQuestion/fileUpload/` + personId + `/` + assessmentId + `/` + assessmentQuestionId + `/` + encodeURIComponent(title);
  }

  handleRemoveFileUploadOpen = (assessmentQuestionId, fileUpload) => this.setState({isShowingModal_removeFileUpload: true, assessmentQuestionId, fileUpload })
  handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeFileUpload: false })
  handleRemoveFileUpload = () => {
      const {removeAssessmentQuestionFileUpload, personId} = this.props;
      const {assessmentQuestionId, fileUploadId} = this.state;
      removeAssessmentQuestionFileUpload(personId, assessmentQuestionId, fileUploadId);
      this.handleRemoveFileUploadClose();
  }

  handleIncompleteOpen = () => this.setState({isShowingModal_incomplete: true })
  handleIncompleteClose = () => this.setState({isShowingModal_incomplete: false })
  handleIncompleteContinue = () => {
      const {correctAssessment, personId, assessmentId, courseScheduledId, assignmentId} = this.props;
			let runFunction = () => browserHistory.push(`/assessmentCorrect/${assignmentId}/${assessmentId}/${personId}/${courseScheduledId}`)
      correctAssessment(personId, personId, assessmentId, assignmentId, runFunction); //In this case, the personId and studentPersonId are the same.
      this.handleIncompleteClose();

  }

  reorderSequence = (assessmentQuestionId, event) => {
      const {reorderAssessmentQuestions, personId} = this.props;
      reorderAssessmentQuestions(personId, assessmentQuestionId, event.target.value);
  }

	handleCreateWorkAndPenspringTransfer = (personId, data) => {
			const {createWorkAndPenspringTransfer, assessmentQuestionsInit, assessmentId, assignmentId} = this.props;
			createWorkAndPenspringTransfer(personId, data, () => assessmentQuestionsInit(personId, personId, assessmentId, assignmentId));
	}

	handleRemoveFileOpen = (assessmentQuestionId, fileUploadId) => this.setState({isShowingModal_removeFile: true, assessmentQuestionId, fileUploadId })
  handleRemoveFileClose = () => this.setState({isShowingModal_removeFile: false })
  handleRemoveFile = () => {
      const {removeLearnerAnswerFile, personId} = this.props;
			const {assessmentQuestionId, fileUploadId} = this.state;
      removeLearnerAnswerFile(personId, assessmentQuestionId, fileUploadId);
      this.handleRemoveFileClose();
			this.setState({ deleted_fileUploadId: fileUploadId });
  }

	showOneAtATimeView = (incomingIndex) => {
			const {currentIndex} = this.state;
			this.hideAllViews();
			let nextIndex = incomingIndex ? incomingIndex : currentIndex;
			if (document.getElementById(`question${nextIndex}`)) {
					document.getElementById(`question${nextIndex}`).style.display = 'inline';
					document.getElementById(`question${nextIndex}`).style.visibility = 'visible';
			}
	}

	hideAllViews = () => {
			const {assessmentQuestions} = this.props;
			assessmentQuestions && assessmentQuestions.length > 1 && assessmentQuestions.forEach((m, i) => {
					if (document.getElementById(`question${i+1*1}`)) {
							document.getElementById(`question${i+1*1}`).style.display = 'none';
							document.getElementById(`question${i+1*1}`).style.visibility = 'hidden';
					}
			})
	}

	setNextIndexUpOrDown = (upOrDown) => {
			let nextIndex = this.state.currentIndex + upOrDown * 1;
			this.setState({ currentIndex: nextIndex });
			this.showOneAtATimeView(nextIndex);
			this.setBreadCrumb();
	}

	setNextIndexJump = (index) => {
			this.setState({ currentIndex: index });
			this.showOneAtATimeView(index);
			this.setBreadCrumb(index);
	}

	setBreadCrumb = (incomingIndex) => {
			const {assessmentQuestions} = this.props;
			let breadCrumb = [];
			assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.forEach((m, i) => {
					let index = i+1*1;
					let option = {
							id: index,
							label: index,
							required: true,
							isAnswered: m.learnerAnswer || m.questionTypeCode === 'PASSAGE',
					}
					breadCrumb = breadCrumb && breadCrumb.length > 0 ? breadCrumb.concat(option) : [option];
			});
			this.setState({ breadCrumb });
	}

  render() {
    const {personId, course, assessment, assessmentQuestions, addOrUpdateAssessmentAnswer, accessRoles, setPenspringTransfer, assignmentId,
						removeLearnerRecordingOpen, updateAssessmentLocalAnswer, courseScheduledId, benchmarkTestId} = this.props;
    const { isShowingFileUpload, isShowingModal_removeFileUpload, notAnswered, isShowingModal_incomplete, isShowingModal_removeFile,
							currentIndex, breadCrumb} = this.state;

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <span className={globalStyles.pageTitle}>{(assessment && assessment.courseContentTypeName) || <L p={p} t={`Assessment`}/>}</span>
            </div>
            <div className={classes(styles.moreTop, styles.rowWrap)}>
                {course && course.courseName &&
										<TextDisplay label={<L p={p} t={`Course`}/>}
												text={<Link to={(accessRoles.admin || accessRoles.facilitator) ? `/gradebookEntry/${courseScheduledId}` : `/studentAssignments/${courseScheduledId}`} className={globalStyles.link}>
																	{course && course.courseName}
															</Link>} />
								}
								<TextDisplay label={benchmarkTestId ? `Benchmark assessment` : `Assessment`} text={assessment && assessment.name} />
            </div>
            <hr />
            {assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.map((m, i) =>
						  <div id={`question${i+1*1}`} key={i+1*1}>
								{assessment.oneAtAtimeView &&
										<div>
												<div className={styles.row}>
														<div className={styles.breadCrumbLabel}><L p={p} t={`questions:`}/></div>
														<BreadCrumb options={breadCrumb} currentIndex={currentIndex} onClick={this.setNextIndexJump}/>
												</div>
												<hr/>
										</div>
								}
                {m.questionTypeCode === 'TRUEFALSE' &&
                    <div key={i}>
                        <AssessmentTrueFalse nameKey={i} question={m} personId={personId} onClick={addOrUpdateAssessmentAnswer} assignmentId={assignmentId}
														bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
                }
								{m.questionTypeCode === 'MULTIPLECHOICE' &&
                    <div key={i}>
                        <AssessmentMultipleChoice nameKey={i} question={m} onClick={addOrUpdateAssessmentAnswer} personId={personId} assignmentId={assignmentId}
														bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
                }
								{m.questionTypeCode === 'MULTIPLEANSWER' &&
                    <div key={i}>
                        <AssessmentMultipleAnswer nameKey={i} question={m} answers={m.answers} onClick={addOrUpdateAssessmentAnswer} personId={personId}
														learnerAnswer={m.learnerAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                        <hr className={styles.hrHeight}/>
                    </div>
                }
								{m.questionTypeCode === 'ESSAY' &&
                    <div key={i}>
                        <AssessmentEssay nameKey={i} question={m} personId={personId} onChange={addOrUpdateAssessmentAnswer}
														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} course={course} assignmentId={assignmentId}
														createWorkAndPenspringTransfer={this.handleCreateWorkAndPenspringTransfer} setPenspringTransfer={setPenspringTransfer}
														bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
								}
								{m.questionTypeCode === 'PICTUREORAUDIO' &&
                    <div key={i}>
                        <AssessmentPictureAudio nameKey={i} question={m} personId={personId} onChange={addOrUpdateAssessmentAnswer}
														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} course={course} isStudent={true}
														handleRemoveFileOpen={this.handleRemoveFileOpen} removeLearnerRecordingOpen={removeLearnerRecordingOpen}
														assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
                }
								{m.questionTypeCode === 'PASSAGE' &&
                    <div key={i}>
                        <AssessmentPassage nameKey={i} question={m} accessRoles={accessRoles} bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
								}
								{m.questionTypeCode === 'SINGLEENTRY' &&
                    <div key={i}>
                        <AssessmentSingleEntry nameKey={i} question={m} answers={m.answers} onClick={addOrUpdateAssessmentAnswer} personId={personId}
														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} learnerAnswer={m.learnerAnswer}
														updateAssessmentLocalAnswer={updateAssessmentLocalAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
								}
								{m.questionTypeCode === 'FILLBLANK' &&
                    <div key={i}>
                        <AssessmentFillBlank nameKey={i} question={m} onClick={addOrUpdateAssessmentAnswer} personId={personId}
														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} learnerAnswer={m.learnerAnswer}
														updateAssessmentLocalAnswer={updateAssessmentLocalAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
								}
								{m.questionTypeCode === 'MATCHING' &&
                    <div key={i}>
												<AssessmentMatching nameKey={i} viewMode={'StudentView'} question={m} accessRoles={accessRoles}
														onClick={addOrUpdateAssessmentAnswer} personId={personId}  learnerAnswer={m.learnerAnswer}
														addOrUpdateAssessmentAnswer={addOrUpdateAssessmentAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                        <div className={classes(styles.moreLeft, styles.moreTop)}>
														{m.websiteLinks.length > 0 &&
																<div>
																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
																		{m.websiteLinks.map((w, i) =>
																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
																		)}
																</div>
														}
                        </div>
                        <hr className={styles.hrHeight}/>
                    </div>
                }
								{assessment.oneAtAtimeView &&
										<div className={styles.buttonPair}>
												{currentIndex !== 1 &&
														<a className={styles.prevButton} onClick={() => this.setNextIndexUpOrDown(-1)}>{`< Previous`}</a>
												}
												{currentIndex !== assessmentQuestions.length &&
														<ButtonWithIcon label={<L p={p} t={`Next >`}/>} icon={'checkmark_circle'} onClick={() => this.setNextIndexUpOrDown(1)}/>
												}
												{currentIndex === assessmentQuestions.length &&
														<div className={styles.rowRight}>
																<ButtonWithIcon label={<L p={p} t={`Finish`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
								            </div>
												}
										</div>
								}
							</div>
            )}
						{assessmentQuestions && assessmentQuestions.length > 0 && !assessment.oneAtAtimeView &&
		            <div className={styles.rowRight}>
										<ButtonWithIcon label={<L p={p} t={`Finish`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
		            </div>
						}
            {isShowingModal_removeFileUpload &&
                <MessageModal handleClose={this.handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file upload?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this file upload?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveFileUpload} />
            }
            {isShowingModal_incomplete &&
                <AssessIncompleteModal handleClose={this.handleIncompleteClose} heading={<L p={p} t={`Incomplete`}/>} notAnswered={notAnswered}
										onClick={this.handleIncompleteContinue} forceAllAnswers={assessment.forceAllAnswers}/>
            }
            {isShowingFileUpload &&
                <FileUploadModal handleClose={this.handleFileUploadClose} title={<L p={p} t={`Assessment Question`}/>} label={<L p={p} t={`File for`}/>}
                    personId={personId} submitFileUpload={this.handleSubmitFile} sendInBuildUrl={this.fileUploadBuildUrl}
                    handleRecordRecall={this.recallAfterFileUpload} showTitleEntry={true}
                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
            }
						{isShowingModal_removeFile &&
                <MessageModal handleClose={this.handleRemoveFileClose} heading={<L p={p} t={`Remove this picture?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this picture?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveFile} />
            }
            <OneFJefFooter />
        </div>
    )}
};
