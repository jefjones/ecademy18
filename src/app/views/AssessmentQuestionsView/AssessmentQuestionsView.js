import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './AssessmentQuestionsView.css';

const p = 'AssessmentQuestionsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import AssessmentItemModal from '../../components/AssessmentItemModal';
import TextDisplay from '../../components/TextDisplay';
import LinkDisplay from '../../components/LinkDisplay';
import TextareaModal from '../../components/TextareaModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import classes from 'classnames';
import AssessmentTrueFalse from '../../components/AssessmentTrueFalse';
import AssessmentMultipleChoice
  from '../../components/AssessmentMultipleChoice';
import AssessmentMultipleAnswer
  from '../../components/AssessmentMultipleAnswer';
import AssessmentSingleEntry from '../../components/AssessmentSingleEntry';
import AssessmentFillBlank from '../../components/AssessmentFillBlank';
import AssessmentMatching from '../../components/AssessmentMatching';
import AssessmentEssay from '../../components/AssessmentEssay';
import AssessmentPassage from '../../components/AssessmentPassage';
import AssessmentPictureAudio from '../../components/AssessmentPictureAudio';
import StandardDisplay from '../../components/StandardDisplay';
import OneFJefFooter from '../../components/OneFJefFooter';
import {withAlert} from 'react-alert';
import ReactToPrint from "react-to-print";

class AssessmentQuestionsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_addOrUpdate: false,
      isShowingModal_removeQuestion: false,
      isShowingModal_removeWebsiteLink: false,
      isShowingModal_removeFileUpload: false,
      isShowingModal_removeQuestionFile: false,
      isShowingModal_removeAnswerFile: false,
      isShowingModal_removeSolutionFile: false,
      isShowingModal_removeAnswerOption: false,
      isShowingModal_removeQuestionRecording: false,
      isShowingModal_removeAnswerRecording: false,
      isShowingModal_removeSolutionRecording: false,
      isShowingModal_pointsError: false,
      isShowingFileUpload: false,
      isShowingModal_websiteLink: false,
    }
  }

  handleFileUploadOpen = (assessmentQuestionId) => this.setState({
    isShowingFileUpload: true,
    assessmentQuestionId
  })
  handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
  handleSubmitFile = () => {
    const {
      assessmentQuestionsInit,
      personId,
      assessmentId,
      assignmentId
    } = this.props;
    assessmentQuestionsInit(personId, personId, assessmentId, assignmentId);
    this.handleFileUploadClose();
  }

  recallAfterFileUpload = () => {
    const {
      assessmentQuestionsInit,
      personId,
      assessmentId,
      assignmentId
    } = this.props;
    assessmentQuestionsInit(personId, personId, assessmentId, assignmentId);
  }

  // fileUploadBuildUrl = (title) => {
  //     const {personId, assessmentId} = this.props;
  //     const {assessmentQuestionId} = this.state;
  //     return `${apiHost}ebi/assessmentQuestion/fileUpload/` + personId + `/` + assessmentId + `/` + assessmentQuestionId + `/` + encodeURIComponent(title);
  // }

  handleAddOrUpdateQuestionOpen = (assessmentQuestionId, isEditMode = false) =>
    this.setState({
      isShowingModal_addOrUpdate: true,
      assessmentQuestionId,
      isEditMode
    });
  handleAddOrUpdateQuestionClose = () => this.setState({
    isShowingModal_addOrUpdate: false,
    isEditMode: false
  })
  handleAddOrUpdateQuestionSave = (assessmentQuestion) => {
    const {
      addOrUpdateAssessmentItem,
      addOrUpdateAssessmentItemMatching,
      personId,
      assessmentId
    } = this.props;
    if (assessmentQuestion.questionTypeCode === 'MATCHING') {
      addOrUpdateAssessmentItemMatching(personId, assessmentId, assessmentQuestion);
    } else {
      addOrUpdateAssessmentItem(personId, assessmentId, assessmentQuestion);
    }
  }

  handleRemoveQuestionOpen = (assessmentQuestionId) => this.setState({
    isShowingModal_removeQuestion: true,
    assessmentQuestionId
  })
  handleRemoveQuestionClose = () => this.setState({isShowingModal_removeQuestion: false})
  handleRemoveQuestion = () => {
    const {removeAssessmentQuestion, personId, assessmentId} = this.props;
    const {assessmentQuestionId} = this.state;
    removeAssessmentQuestion(personId, assessmentId, assessmentQuestionId);
    this.handleRemoveQuestionClose();
  }

  handleRemoveWebsiteLinkOpen = (assessmentQuestionId, websiteLink) => this.setState({
    isShowingModal_removeWebsiteLink: true,
    assessmentQuestionId,
    websiteLink
  })
  handleRemoveWebsiteLinkClose = () => this.setState({isShowingModal_removeWebsiteLink: false})
  handleRemoveWebsiteLink = () => {
    const {removeAssessmentQuestionWebsiteLink, personId} = this.props;
    const {assessmentQuestionId, websiteLink} = this.state;
    removeAssessmentQuestionWebsiteLink(personId, assessmentQuestionId, websiteLink);
    this.handleRemoveWebsiteLinkClose();
  }

  handleRemoveFileUploadOpen = (assessmentQuestionId, fileUploadId) => this.setState({
    isShowingModal_removeFileUpload: true,
    assessmentQuestionId,
    fileUploadId
  })
  handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeFileUpload: false})
  handleRemoveFileUpload = () => {
    const {removeAssessmentQuestionFileUpload, personId} = this.props;
    const {assessmentQuestionId, fileUploadId} = this.state;
    removeAssessmentQuestionFileUpload(personId, assessmentQuestionId, fileUploadId);
    this.handleRemoveFileUploadClose();
  }

  handleRemoveQuestionFileOpen = (assessmentQuestionId, fileUploadId) => this.setState({
    isShowingModal_removeQuestionFile: true,
    assessmentQuestionId,
    fileUploadId
  })
  handleRemoveQuestionFileClose = () => this.setState({isShowingModal_removeQuestionFile: false})
  handleRemoveQuestionFile = () => {
    const {removeAssessmentQuestionQuestionFile, personId} = this.props;
    const {assessmentQuestionId, fileUploadId} = this.state;
    removeAssessmentQuestionQuestionFile(personId, assessmentQuestionId, fileUploadId);
    this.handleRemoveQuestionFileClose();
    this.setState({deleted_fileUploadId: fileUploadId});
  }

  handleRemoveQuestionRecordingOpen = (event, assessmentQuestionId, recordingFileUploadId) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({
      isShowingModal_removeQuestionRecording: true,
      assessmentQuestionId,
      recordingFileUploadId
    })
  }
  handleRemoveQuestionRecordingClose = () => this.setState({isShowingModal_removeQuestionRecording: false})
  handleRemoveQuestionRecording = () => {
    const {removeAssessmentQuestionQuestionRecording, personId} = this.props;
    const {assessmentQuestionId, recordingFileUploadId} = this.state;
    removeAssessmentQuestionQuestionRecording(personId, assessmentQuestionId, recordingFileUploadId);
    this.handleRemoveQuestionRecordingClose();
    this.setState({deleted_recordingFileUploadId: recordingFileUploadId});
  }

  handleRemoveAnswerFileOpen = (assessmentQuestionId, fileUploadId) => this.setState({
    isShowingModal_removeAnswerFile: true,
    assessmentQuestionId,
    fileUploadId
  })
  handleRemoveAnswerFileClose = () => this.setState({isShowingModal_removeAnswerFile: false})
  handleRemoveAnswerFile = () => {
    const {removeAssessmentQuestionAnswerFile, personId} = this.props;
    const {assessmentQuestionId, fileUploadId} = this.state;
    removeAssessmentQuestionAnswerFile(personId, assessmentQuestionId, fileUploadId);
    this.handleRemoveAnswerFileClose();
    this.setState({deleted_fileUploadId: fileUploadId});
  }

  handleRemoveToMatchFileOpen = (assessmentQuestionId, fileUploadId) => this.setState({
    isShowingModal_removeToMatchFile: true,
    assessmentQuestionId,
    fileUploadId
  })
  handleRemoveToMatchFileClose = () => this.setState({isShowingModal_removeToMatchFile: false})
  handleRemoveToMatchFile = () => {
    const {removeAssessmentQuestionToMatchFile, personId} = this.props;
    const {assessmentQuestionId, fileUploadId} = this.state;
    removeAssessmentQuestionToMatchFile(personId, assessmentQuestionId, fileUploadId);
    this.handleRemoveToMatchFileClose();
    this.setState({deleted_fileUploadId: fileUploadId});
  }

  handleRemoveAnswerOptionOpen = (assessmentQuestionId, answerIndex) => this.setState({
    isShowingModal_removeAnswerOption: true,
    assessmentQuestionId,
    answerIndex
  })
  handleRemoveAnswerOptionClose = () => this.setState({
    isShowingModal_removeAnswerOption: false,
    assessmentQuestionId: '',
    answerIndex: ''
  })
  handleRemoveAnswerOption = () => {
    const {removeAssessmentQuestionAnswerOption, personId} = this.props;
    const {assessmentQuestionId, answerIndex} = this.state;
    removeAssessmentQuestionAnswerOption(personId, assessmentQuestionId, answerIndex); //, () => this.handleAddOrUpdateQuestionOpen(assessmentQuestionId, true)
    this.handleRemoveAnswerOptionClose();
    this.handleAddOrUpdateQuestionClose();
  }

  handleRemoveAnswerRecordingOpen = (assessmentQuestionId, fileUploadId, answerIndex, multipleAnswerType) => this.setState({
    isShowingModal_removeAnswerRecording: true,
    assessmentQuestionId,
    fileUploadId,
    answerIndex,
    multipleAnswerType
  })
  handleRemoveAnswerRecordingClose = () => this.setState({
    isShowingModal_removeAnswerRecording: false,
    answerIndex: '',
    multipleAnswerType: ''
  })
  handleRemoveAnswerRecording = () => {
    const {removeAssessmentQuestionAnswerRecording, personId} = this.props;
    const {assessmentQuestionId, fileUploadId} = this.state;
    removeAssessmentQuestionAnswerRecording(personId, assessmentQuestionId, fileUploadId);
    this.handleRemoveAnswerRecordingClose();
    this.setState({deleted_fileUploadId: fileUploadId});
  }

  handleRemoveSolutionFileOpen = (assessmentQuestionId, fileUploadId) => this.setState({
    isShowingModal_removeSolutionFile: true,
    assessmentQuestionId,
    fileUploadId
  })
  handleRemoveSolutionFileClose = () => this.setState({isShowingModal_removeSolutionFile: false})
  handleRemoveSolutionFile = () => {
    const {removeAssessmentQuestionSolutionFile, personId} = this.props;
    const {assessmentQuestionId, fileUploadId} = this.state;
    removeAssessmentQuestionSolutionFile(personId, assessmentQuestionId, fileUploadId);
    this.handleRemoveSolutionFileClose();
    this.setState({deleted_fileUploadId: fileUploadId});
  }

  handleRemoveSolutionRecordingOpen = (assessmentQuestionId, fileUploadId) => this.setState({
    isShowingModal_removeSolutionRecording: true,
    assessmentQuestionId,
    fileUploadId
  })
  handleRemoveSolutionRecordingClose = () => this.setState({isShowingModal_removeSolutionRecording: false})
  handleRemoveSolutionRecording = () => {
    const {removeAssessmentQuestionSolutionRecording, personId} = this.props;
    const {assessmentQuestionId, fileUploadId} = this.state;
    removeAssessmentQuestionSolutionRecording(personId, assessmentQuestionId, fileUploadId);
    this.handleRemoveSolutionRecordingClose();
    this.setState({deleted_fileUploadId: fileUploadId});
  }

  handleWebsiteLinkOpen = (assessmentQuestionId) => this.setState({
    isShowingModal_websiteLink: true,
    assessmentQuestionId
  })
  handleWebsiteLinkClose = () => this.setState({isShowingModal_websiteLink: false})
  handleWebsiteLinkSave = (websiteLink) => {
    const {saveAssessmentQuestionWebsiteLink, personId} = this.props;
    const {assessmentQuestionId} = this.state;
    saveAssessmentQuestionWebsiteLink(personId, assessmentQuestionId, websiteLink);
    this.handleWebsiteLinkClose();
  }

  handlePointsErrorClose = () => {
    const {personId, togglePublishedAssessment, assessment} = this.props;
    this.setState({isShowingModal_pointsError: false})
    togglePublishedAssessment(personId, assessment.assessmentId);
  }

  handlePointsErrorSave = () => {
    const {
      updateAssessmentTotalPoints,
      personId,
      assessmentId,
      togglePublishedAssessment,
      assessment
    } = this.props;
    const {subTotalPoints} = this.state;
    this.handlePointsErrorClose();
    updateAssessmentTotalPoints(personId, assessmentId, subTotalPoints);
    togglePublishedAssessment(personId, assessment.assessmentId);
    this.setState({replacedTotalPoints: subTotalPoints})
  }

  reorderSequence = (assessmentQuestionId, event) => {
    const {reorderAssessmentQuestions, personId} = this.props;
    reorderAssessmentQuestions(personId, assessmentQuestionId, event.target.value);
  }

  handlePublish = () => {
    const {
      togglePublishedAssessment,
      personId,
      assessment,
      assessmentQuestions
    } = this.props;
    let pointsIntended = assessment && assessment.totalPoints;
    let subTotalPoints = (assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.reduce((acc, m) => acc += m.pointsPossible, 0)) || 0;
    if (pointsIntended !== subTotalPoints && (!assessment || !assessment.isPublished)) {
      let subTotalPoints = (assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.reduce((acc, m) => acc += m.pointsPossible, 0)) || 0;
      this.setState({isShowingModal_pointsError: true, subTotalPoints,});
    }
    togglePublishedAssessment(personId, assessment.assessmentId);
  }

  showViewOnlyMessage = () => {
    this.props.alert.info(<div className={globalStyles.alertText}><L p={p}
                                                                     t={`The controls are for view only to show the correct answers`}/>
    </div>);
  }

  handleCannotChangeOpen = () => this.setState({isShowingModal_cannotChange: true})
  handleCannotChangeClose = () => this.setState({isShowingModal_cannotChange: false})

  toggleCheckbox = (field, event) => {
    const {
      updateAssessmentSettings,
      personId,
      assessmentId,
      assessment
    } = this.props;
    updateAssessmentSettings(personId, assessmentId, field, !assessment[field]);
  }

  handleChange = (event) => {
    const {updateAssessmentSettings, personId, assessmentId} = this.props;
    updateAssessmentSettings(personId, assessmentId, event.target.name, event.target.value);
  }

  render() {
    const {
      personId,
      assessment = {},
      questionTypes,
      assessmentQuestions,
      assessmentId,
      companyConfig = {},
      accessRoles = {},
      sequences,
      courseEntryName,
      removeAssessmentQuestionQuestionRecording,
      removeAssessmentQuestionAnswerRecording,
      standards,
      removeAssessmentQuestionSolutionRecording,
      retakeOptions,
      benchmarkTestId,
      gradingType
    } = this.props;
    const {
      isShowingModal_addOrUpdate,
      isShowingModal_removeQuestion,
      assessmentQuestionId,
      isShowingModal_websiteLink,
      isShowingModal_removeWebsiteLink,
      isShowingModal_removeFileUpload,
      isShowingModal_pointsError,
      subTotalPoints,
      replacedTotalPoints,
      isShowingModal_removeQuestionFile,
      deleted_fileUploadId,
      isShowingModal_removeSolutionFile,
      isShowingModal_removeAnswerFile,
      isShowingModal_removeAnswerOption,
      isShowingModal_removeQuestionRecording,
      isShowingModal_cannotChange,
      isShowingModal_removeAnswerRecording,
      isShowingModal_removeSolutionRecording,
      isShowingModal_removeToMatchFile
    } = this.state;

    let assessmentItem = assessmentQuestionId
      ? assessmentQuestions && assessmentQuestions.length > 0
        ? assessmentQuestions.filter(m => m.assessmentQuestionId === assessmentQuestionId)[0]
        : {}
      : {};
    return (
      <div className={styles.container}>
        <div className={globalStyles.pageTitle}>
          <L p={p} t={`Assessment Questions`}/>
        </div>
        <div className={classes(styles.moreTop, styles.rowWrap)}>
          {courseEntryName &&
            <TextDisplay label={`Course`} text={courseEntryName}
                         clickFunction={() => browserHistory.goBack()}/>}
          <TextDisplay
            label={benchmarkTestId ? <L p={p} t={`Benchmark assessment`}/> :
              <L p={p} t={`Assessment`}/>}
            text={assessment && assessment.name}/>
          <TextDisplay label={<L p={p} t={`Points intended`}/>}
                       text={replacedTotalPoints || (assessment && assessment.totalPoints)}/>
          <TextDisplay label={<L p={p} t={`Points sub total`}/>}
                       text={assessmentQuestions.reduce((acc, m) => acc += m.pointsPossible, 0)}/>
          <div className={styles.printPosition}>
            <ReactToPrint trigger={() => <a href="#"
                                            className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon
              pathName={'printer'} premium={true} className={styles.icon}/><L
              p={p} t={`Print`}/></a>} content={() => this.componentRef}/>
          </div>
        </div>
        <div className={classes(styles.moreTop, styles.rowWrap)}>
          <Checkbox
            id={'bigTextDisplay'}
            name={'bigTextDisplay'}
            label={<L p={p} t={`Big text display`}/>}
            labelClass={styles.checkboxLabel}
            checked={assessment.bigTextDisplay || false}
            onClick={(event) => this.toggleCheckbox('bigTextDisplay', event)}
            className={styles.checkbox}/>
          <Checkbox
            id={'oneAtAtimeView'}
            name={'oneAtAtimeView'}
            label={<L p={p} t={`One question at a time`}/>}
            labelClass={styles.checkboxLabel}
            checked={assessment.oneAtAtimeView || false}
            onClick={(event) => this.toggleCheckbox('oneAtAtimeView', event)}
            className={styles.checkbox}/>
          <Checkbox
            id={'doNotShowAnswersImmediately'}
            name={'doNotShowAnswersImmediately'}
            label={<L p={p}
                      t={`Do not show answers immediately after correction`}/>}
            labelClass={styles.checkboxLabel}
            checked={assessment.doNotShowAnswersImmediately || false}
            onClick={(event) => this.toggleCheckbox('doNotShowAnswersImmediately', event)}
            className={styles.checkbox}/>
          <Checkbox
            id={'forceAllAnswers'}
            name={'forceAllAnswers'}
            label={<L p={p} t={`Student must answer all questions`}/>}
            labelClass={styles.checkboxLabel}
            checked={assessment.forceAllAnswers || false}
            onClick={(event) => this.toggleCheckbox('forceAllAnswers', event)}
            className={styles.checkbox}/>

          <div className={styles.littleLeft}>
            <SelectSingleDropDown
              id={`retakeCount`}
              name={`retakeCount`}
              label={<L p={p} t={`Re-take attempts`}/>}
              value={assessment.retakeCount || ''}
              options={retakeOptions || []}
              className={styles.moreBottomMargin}
              noBlank={true}
              height={`medium`}
              onChange={this.handleChange}/>
          </div>
        </div>
        <div className={styles.row}>
          <ButtonWithIcon icon={'earth'} label={assessment.isPublished ?
            <L p={p} t={`Unpublish`}/> : <L p={p} t={`Publish`}/>}
                          changeRed={assessment.isPublished}
                          onClick={this.handlePublish}
                          disabled={!assessmentQuestions || !assessmentQuestions.length}/>
          <div className={styles.muchLeft}>
            <Checkbox
              id={'doNotShowAnswersImmediately'}
              name={'doNotShowAnswersImmediately'}
              label={<L p={p}
                        t={`Hide answers until I say`}/>} //This is the same checkbox as the "Do not show" but it is an interface trick to be sur that the teacher understands that they can turn this on and off ... but just like the student it not allowed to see answers after they finish the test, this is the same value that doesn't allow the student to see the answers until the teacher wants them to see it on the assessment correct view.
              labelClass={styles.checkboxLabel}
              checked={assessment.doNotShowAnswersImmediately || false}
              onClick={(event) => this.toggleCheckbox('doNotShowAnswersImmediately', event)}
              className={styles.checkbox}/>
          </div>
        </div>
        <hr/>
        {(accessRoles.admin || accessRoles.facilitator) &&
          <a
            onClick={assessment.isPublished ? this.handleCannotChangeOpen : this.handleAddOrUpdateQuestionOpen}
            className={classes(styles.row, styles.addNew)}>
            <Icon pathName={'plus'}
                  className={classes(styles.icon, (assessment.isPublished ? styles.lowOpacity : ''))}
                  fillColor={'green'}/>
            <span
              className={classes(styles.addAnother, (assessment.isPublished ? styles.lowOpacity : ''))}><L
              p={p} t={`Add Another Question`}/></span>
          </a>
        }
        <div ref={el => (this.componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
          {assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.map((m, i) => {
            if (m.questionTypeCode === 'TRUEFALSE') {
              return (
                <div key={i}>
                  <AssessmentTrueFalse nameKey={i} question={m}
                                       personId={personId}
                                       initialValue={m.correctAnswer}
                                       removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                       onClick={this.showViewOnlyMessage}
                                       removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                       removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}
                                       removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}/>
                  <div className={classes(styles.moreLeft, styles.moreTop)}>
                    {m.websiteLinks.length > 0 &&
                      <div>
                        <hr/>
                        <span className={styles.label}>{<L p={p}
                                                           t={`Website Link`}/>}</span>
                        {m.websiteLinks.map((w, i) =>
                          <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                       deleteFunction={this.handleRemoveWebsiteLinkOpen}
                                       deleteId={m.assessmentQuestionId}/>
                        )}
                        <hr/>
                      </div>
                    }
                  </div>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'MULTIPLECHOICE') {
              return (
                <div key={i}>
                  <AssessmentMultipleChoice nameKey={i} question={m}
                                            onClick={this.showViewOnlyMessage}
                                            isOwner={m.isOwner}
                                            removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                            removeAnswerFileOpen={this.handleRemoveAnswerFileOpen}
                                            removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                            removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}
                                            removeAnswerRecordingOpen={this.handleRemoveAnswerRecordingOpen}
                                            removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}
                                            removeWebsiteLinkOpen={this.handleRemoveWebsiteLinkOpen}/>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'MULTIPLEANSWER') {
              return (
                <div key={i}>
                  <AssessmentMultipleAnswer nameKey={i}
                                            isOwnerSetup={this.showViewOnlyMessage}
                                            isSetupList={true} question={m}
                                            removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                            removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                            removeAnswerFileOpen={this.handleRemoveAnswerFileOpen}
                                            removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}
                                            removeAnswerRecordingOpen={this.handleRemoveAnswerRecordingOpen}
                                            removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}
                                            removeWebsiteLinkOpen={this.handleRemoveWebsiteLinkOpen}/>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'ESSAY') {
              return (
                <div key={i}>
                  <AssessmentEssay nameKey={i} question={m}
                                   keywords={m.keywordPhrases}
                                   accessRoles={accessRoles}
                                   removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                   removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                   removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}
                                   removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}/>
                  <div className={styles.littleLeft}>
                    <div className={styles.instructions}>
                      {m.keywordPhrases && m.keywordPhrases.length > 0
                        ? m.keywordCountAccuracy
                          ? `These keywords and/or phrases are used for automated scoring.`
                          : `These keywords and/or phrases may be used for reference, but automated scoring will not occur without setting the keyword accuracy count.`
                        : `Automated scoring will not occur because keywords and/or phrases are not set.`
                      }
                    </div>
                    <div className={styles.rowWrap}>
                      {!(accessRoles.observer || accessRoles.learner) &&
                        <TextDisplay
                          label={<L p={p} t={`Keywords or phrases`}/>}
                          text={m.keywordPhrases && m.keywordPhrases.length > 0
                            ? m.keywordPhrases.map((keywordPhrase, i) =>
                              <div key={i}
                                   className={classes(styles.labelBold, styles.littleLeft)}>{keywordPhrase}</div>)
                            : <div key={i}
                                   className={classes(styles.labelItalicsGray, styles.littleLeft)}>
                              <L p={p} t={`none`}/></div>
                          }
                        />
                      }

                      {!(accessRoles.observer || accessRoles.learner) &&
                        <TextDisplay
                          label={<L p={p} t={`Keyword accuracy count`}/>}
                          text={m.keywordCountAccuracy === 0 || !!m.keywordCountAccuracy
                            ? m.keywordCountAccuracy
                            : <div key={i}
                                   className={classes(styles.labelItalicsGray, styles.littleLeft)}>{'n/a'}</div>
                          }
                        />
                      }
                    </div>
                    <div className={classes(styles.moreLeft, styles.moretop)}>
                      {m.websiteLinks.length > 0 &&
                        <div>
                          <hr/>
                          <span className={styles.label}>{<L p={p}
                                                             t={`Website Link`}/>}</span>
                          {m.websiteLinks.map((w, i) =>
                            <LinkDisplay key={i} linkText={w}
                                         isWebsiteLink={true}
                                         deleteFunction={this.handleRemoveWebsiteLinkOpen}
                                         deleteId={m.assessmentQuestionId}/>
                          )}
                          <hr/>
                        </div>
                      }
                    </div>
                  </div>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'SINGLEENTRY') {
              return (
                <div key={i}>
                  <AssessmentSingleEntry nameKey={i} question={m}
                                         answerVariations={m.answerVariations}
                                         accessRoles={accessRoles}
                                         removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                         removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                         removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}
                                         removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}/>
                  <div className={classes(styles.muchLeft, styles.moreTop)}>
                    {m.websiteLinks.length > 0 &&
                      <div>
                        <hr/>
                        <span className={styles.label}>{<L p={p}
                                                           t={`Website Link`}/>}</span>
                        {m.websiteLinks.map((w, i) =>
                          <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                       deleteFunction={this.handleRemoveWebsiteLinkOpen}
                                       deleteId={m.assessmentQuestionId}/>
                        )}
                        <hr/>
                      </div>
                    }
                  </div>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'FILLBLANK') {
              return (
                <div key={i}>
                  <AssessmentFillBlank nameKey={i} question={m}
                                       answerVariations={m.answerVariations}
                                       accessRoles={accessRoles}
                                       removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                       removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                       removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}
                                       removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}/>
                  <div className={classes(styles.muchLeft, styles.moreTop)}>
                    {m.websiteLinks.length > 0 &&
                      <div>
                        <hr/>
                        <span className={styles.label}>{<L p={p}
                                                           t={`Website Link`}/>}</span>
                        {m.websiteLinks.map((w, i) =>
                          <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                       deleteFunction={this.handleRemoveWebsiteLinkOpen}
                                       deleteId={m.assessmentQuestionId}/>
                        )}
                        <hr/>
                      </div>
                    }
                  </div>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'MATCHING') {
              return (
                <div key={i}>
                  <AssessmentMatching nameKey={i} viewMode={'TeacherView'}
                                      question={m} accessRoles={accessRoles}
                                      removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                      removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                      removeAnswerFileOpen={this.handleRemoveAnswerFileOpen}
                                      removeToMatchFileOpen={this.handleRemoveToMatchFileOpen}
                                      removeAnswerRecordingOpen={this.handleRemoveAnswerRecordingOpen}
                                      removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}
                                      removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}/>
                  <div className={classes(styles.muchLeft, styles.moreTop)}>
                    {m.websiteLinks.length > 0 &&
                      <div>
                        <hr/>
                        <span className={styles.label}>{<L p={p}
                                                           t={`Website Link`}/>}</span>
                        {m.websiteLinks.map((w, i) =>
                          <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                       deleteFunction={this.handleRemoveWebsiteLinkOpen}
                                       deleteId={m.assessmentQuestionId}/>
                        )}
                        <hr/>
                      </div>
                    }
                  </div>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'PICTUREORAUDIO') {
              return (
                <div key={i}>
                  <AssessmentPictureAudio nameKey={i} question={m}
                                          keywords={m.answerVariations}
                                          accessRoles={accessRoles}
                                          removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                          removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                                          removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}
                                          removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}/>
                  <div className={classes(styles.muchLeft, styles.moreTop)}>
                    <div className={styles.instructions}>
                      <L p={p}
                         t={`The student can respond with a picture, an audio recording or both.`}/>
                    </div>
                    {m.websiteLinks.length > 0 &&
                      <div>
                        <hr/>
                        <span className={styles.label}>{<L p={p}
                                                           t={`Website Link`}/>}</span>
                        {m.websiteLinks.map((w, i) =>
                          <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                       deleteFunction={this.handleRemoveWebsiteLinkOpen}
                                       deleteId={m.assessmentQuestionId}/>
                        )}
                        <hr/>
                      </div>
                    }
                  </div>
                  <StandardDisplay standards={m.standards}/>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <div className={styles.littleRight}>
                        <TextDisplay text={m.pointsPossible}
                                     label={<L p={p} t={`Points`}/>}/>
                      </div>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            } else if (m.questionTypeCode === 'PASSAGE') {
              return (
                <div key={i}>
                  <AssessmentPassage nameKey={i} question={m}
                                     isOwner={m.isOwner}
                                     removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
                                     removeQuestionRecordingOpen={this.handleRemoveQuestionRecordingOpen}/>
                  <div className={classes(styles.muchLeft, styles.moreTop)}>
                    {m.websiteLinks.length > 0 &&
                      <div>
                        <hr/>
                        <span className={styles.label}>{<L p={p}
                                                           t={`Website Link`}/>}</span>
                        {m.websiteLinks.map((w, i) =>
                          <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                       deleteFunction={this.handleRemoveWebsiteLinkOpen}
                                       deleteId={m.assessmentQuestionId}/>
                        )}
                        <hr/>
                      </div>
                    }
                  </div>
                  {(accessRoles.admin || accessRoles.facilitator) &&
                    <div className={classes(styles.row, styles.linkRow)}>
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleRemoveQuestionOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`remove`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                        className={styles.link}><L p={p} t={`edit`}/></a> |
                      <a
                        onClick={assessment.isPublished ? this.handleCannotChangeOpen : () => this.handleWebsiteLinkOpen(m.assessmentQuestionId)}
                        className={styles.link}><L p={p} t={`add link`}/></a> |
                      {!assessment.isPublished &&
                        <div>
                          <SelectSingleDropDown
                            id={m.assessmentQuestionId}
                            name={m.assessmentQuestionId}
                            label={<L p={p} t={`Sequence`}/>}
                            labelLeft={true}
                            value={m.sequence}
                            noBlank={true}
                            options={sequences}
                            className={styles.dropdown}
                            onChange={(event) => this.reorderSequence(m.assessmentQuestionId, event)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            }
            return null
          })}
        </div>
        <hr className={styles.hrHeight}/>
        {(accessRoles.admin || accessRoles.facilitator) && assessmentQuestions && assessmentQuestions.length >= 4 &&
          <a onClick={this.handleAddOrUpdateQuestionOpen}
             className={classes(styles.row, styles.addNew)}>
            <Icon pathName={'plus'} className={styles.icon}
                  fillColor={'green'}/>
            <span className={styles.addAnother}><L p={p} t={`Add Another Question`}/></span>
          </a>
        }
        {isShowingModal_addOrUpdate &&
          <AssessmentItemModal handleClose={this.handleAddOrUpdateQuestionClose}
                               showTitle={true}
                               handleSubmit={this.handleAddOrUpdateQuestionSave}
                               questionTypes={questionTypes}
                               assessment={assessment}
                               assessmentItem={assessmentItem}
                               standards={standards} gradingType={gradingType}
                               personId={personId} assessmentId={assessmentId}
                               assessmentQuestionId={assessmentQuestionId}
                               companyConfig={companyConfig}
                               handleRemoveFileOpen={this.handleRemoveQuestionFileOpen}
                               deleted_fileUploadId={deleted_fileUploadId}
                               accessRoles={accessRoles}
                               handleRemoveSolutionFileOpen={this.handleRemoveSolutionFileOpen}
                               removeAnswerOption={this.handleRemoveAnswerOptionOpen}
                               removeAnswerFileOpen={this.handleRemoveAnswerFileOpen}
                               removeAssessmentQuestionQuestionRecording={removeAssessmentQuestionQuestionRecording}
                               removeAssessmentQuestionAnswerRecording={removeAssessmentQuestionAnswerRecording}
                               removeAssessmentQuestionSolutionRecording={removeAssessmentQuestionSolutionRecording}/>
        }
        {isShowingModal_removeQuestion &&
          <MessageModal handleClose={this.handleRemoveQuestionClose}
                        heading={<L p={p}
                                    t={`Remove this question from this assessment content?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this question from this assessment content?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveQuestion}/>
        }
        {isShowingModal_removeWebsiteLink &&
          <MessageModal handleClose={this.handleRemoveWebsiteLinkClose}
                        heading={<L p={p} t={`Remove this website link?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this website link?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveWebsiteLink}/>
        }
        {isShowingModal_removeFileUpload &&
          <MessageModal handleClose={this.handleRemoveFileUploadClose}
                        heading={<L p={p} t={`Remove this file upload?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this file upload?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveFileUpload}/>
        }
        {isShowingModal_removeQuestionFile &&
          <MessageModal handleClose={this.handleRemoveQuestionFileClose}
                        heading={<L p={p} t={`Remove this question picture?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this question picture?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveQuestionFile}/>
        }
        {isShowingModal_removeQuestionRecording &&
          <MessageModal handleClose={this.handleRemoveQuestionRecordingClose}
                        heading={<L p={p}
                                    t={`Remove this question recording?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this question recording?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveQuestionRecording}/>
        }
        {isShowingModal_removeAnswerOption &&
          <MessageModal handleClose={this.handleRemoveAnswerOptionClose}
                        heading={<L p={p} t={`Remove this answer option?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this answer option?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveAnswerOption}/>
        }
        {isShowingModal_removeAnswerFile &&
          <MessageModal handleClose={this.handleRemoveAnswerFileClose}
                        heading={<L p={p} t={`Remove this answer picture?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this answer picture?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveAnswerFile}/>
        }
        {isShowingModal_removeToMatchFile &&
          <MessageModal handleClose={this.handleRemoveToMatchFileClose}
                        heading={<L p={p} t={`Remove this matching picture?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this matching picture?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveToMatchFile}/>
        }
        {isShowingModal_removeAnswerRecording &&
          <MessageModal handleClose={this.handleRemoveAnswerRecordingClose}
                        heading={<L p={p} t={`Remove this answer recording?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this answer recording?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveAnswerRecording}/>
        }
        {isShowingModal_removeSolutionFile &&
          <MessageModal handleClose={this.handleRemoveSolutionFileClose}
                        heading={<L p={p} t={`Remove this solution picture?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this solution picture?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveSolutionFile}/>
        }
        {isShowingModal_removeSolutionRecording &&
          <MessageModal handleClose={this.handleRemoveSolutionRecordingClose}
                        heading={<L p={p}
                                    t={`Remove this solution recording?`}/>}
                        explainJSX={<L p={p}
                                       t={`Are you sure you want to delete this solution recording?`}/>}
                        isConfirmType={true}
                        onClick={this.handleRemoveSolutionRecording}/>
        }
        {isShowingModal_pointsError &&
          <MessageModal handleClose={this.handlePointsErrorClose}
                        heading={<L p={p} t={`Points intended do not match!`}/>}
                        explainJSX={<L p={p}
                                       t={`The points intended for this quiz do not match the total points entered for the assessment questions. Do you want to reset the total points possible to ${subTotalPoints}?`}/>}
                        isConfirmType={true}
                        onClick={this.handlePointsErrorSave}/>
        }
        {isShowingModal_cannotChange &&
          <MessageModal handleClose={this.handleCannotChangeClose}
                        heading={<L p={p} t={`Cannot Change Assignment`}/>}
                        explainJSX={<L p={p}
                                       t={`This assessment is published.  In order to make a change to this assessment, you can choose to unpublish the assessment in order to make the change.  Remember to publish it again when you are ready.`}/>}
                        onClick={this.handleCannotChangeClose}/>
        }
        {/*isShowingFileUpload &&
                <FileUploadModal handleClose={this.handleFileUploadClose} title={'Assessment Question'} label={'File for'}
                    personId={personId} submitFileUpload={this.handleSubmitFile} sendInBuildUrl={this.fileUploadBuildUrl}
                    handleRecordRecall={this.recallAfterFileUpload} showTitleEntry={true}
                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
            */}
        {isShowingModal_websiteLink &&
          <TextareaModal key={'all'} handleClose={this.handleWebsiteLinkClose}
                         heading={<L p={p} t={`Website Link`}/>}
                         explainJSX={<L p={p}
                                        t={`Choose a website link for an assessment question.`}/>}
                         onClick={this.handleWebsiteLinkSave}
                         placeholder={`Website URL?`}/>
        }
        <OneFJefFooter/>
      </div>
    )
  }
};

export default withAlert(AssessmentQuestionsView);
