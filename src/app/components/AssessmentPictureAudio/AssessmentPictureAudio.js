import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import styles from './AssessmentPictureAudio.css';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
import TextDisplay from '../TextDisplay';
import InputText from '../InputText';
import Checkbox from '../Checkbox';
import ImageDisplay from '../ImageDisplay';
import AudioDisplay from '../AudioDisplay';
import Icon from '../Icon';
import FileUploadModalWithCrop from '../FileUploadModalWithCrop';
import VoiceRecordingModal from '../VoiceRecordingModal';
import QuestionLabel from '../QuestionLabel'

const p = 'component';
import L from '../../components/PageLanguage';

export default class AssessmentPictureAudio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: '',
      isShowingFileUpload: false,
      isShowingVoiceRecording: false,
      entry: {
        essayResponse: '',
        score: '',
        isCorrect: '',
      },
      errorScore: '',
    }
  }

  componentDidMount() {
    const {accessRoles, assessmentCorrect, question} = this.props;
    let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {};
    if (this.state.assessmentCorrect !== assessmentCorrect) {
      this.setState({
        assessmentCorrect: this.props.assessmentCorrect,
        entry: {
          essayResponse: accessRoles.facilitator && assessmentCorrect ? assessmentCorrect.teacherEssayResponse : assessmentCorrect ? assessmentCorrect.learnerAnswer : '',
          score: correct && correct.score,
          isCorrect: correct && correct.isCorrect,
        }
      })
    }
  }

  handleChange = ({target}) => {
    const {submitEssayResponse, question} = this.props;
    let entry = Object.assign({}, this.state.entry);
    entry['score'] = target.value === '' ? 'EMPTY' : target.value;
    this.setState({entry});
    submitEssayResponse(question.assessmentQuestionId, entry);
  }

  toggleCheckbox = () => {
    const {submitEssayResponse, question} = this.props;
    let entry = Object.assign({}, this.state.entry);
    entry['isCorrect'] = !entry['isCorrect'];
    this.setState({entry});
    submitEssayResponse(question.assessmentQuestionId, entry);
  }

  handleSubmit = () => {
    const {submitAction, question} = this.props;
    const {entry} = this.state;
    var hasError = false;

    if (!(entry.score === 0 || entry.score > 0)) {
      hasError = true;
      this.setState({errorScore: 'A score is required'})
    }

    if (!hasError) {
      submitAction(question.assessmentQuestionId, entry)
    }
  }

  handleFileUploadOpen = (assessmentQuestionId) => this.setState({
    isShowingFileUpload: true,
    assessmentQuestionId
  })
  handleFileUploadClose = () => this.setState({
    isShowingFileUpload: false,
    assessmentQuestionId: ''
  })
  handleFileUploadSubmit = () => {
    const {personId, assignmentId} = this.props;
    const {selectedFile, assessmentQuestionId} = this.state;
    let data = new FormData();
    data.append('file', selectedFile)

    let url = `${apiHost}ebi/assessmentLearner/pictureUpload/${personId}/${assessmentQuestionId}/${assignmentId}`

    axios.post(url, data,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
          "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
          "Authorization": "Bearer " + localStorage.getItem("authToken"),
        }
      })
      .catch(function (error) {
        //Show error here.
      })
    // .then(response => {
    // 		let assess = this.state.assess;
    // 		if (!assess || !assess.assessmentQuestionId || assess.assessmentQuestionId === guidEmpty) {
    // 				assess.assessmentQuestionId = response.data.assessmentQuestionId;
    // 				this.setState({ assess });
    // 		}
    // })
    this.handleFileUploadClose();
  }

  handleRemoveInputFile = () => {
    this.setState({selectedFile: null});
    var img = this.imageViewer;
    img.src = "";
    this.pictureFile.after(img);
  }

  handleInputFile = (file) => {
    this.setState({selectedFile: file});
    var img = this.imageViewer;
    var reader = new FileReader();
    reader.onloadend = function () {
      img.src = reader.result;
    }
    reader.readAsDataURL(file);
    this.pictureFile.after(img);
  }

  startRecording = () => this.setState({record: true})
  stopRecording = () => this.setState({record: false})
  onStop = (recordedBlob) => this.setState({selectedRecording: recordedBlob})

  handleVoiceRecordingOpen = (assessmentQuestionId) => this.setState({
    isShowingVoiceRecording: true,
    assessmentQuestionId
  })
  handleVoiceRecordingClose = () => this.setState({
    isShowingVoiceRecording: false,
    assessmentQuestionId: ''
  })
  handleVoiceRecordingSubmit = () => {
    const {personId, assignmentId} = this.props;
    const {assessmentQuestionId, selectedRecording} = this.state;
    let data = new FormData();
    data.append('audio', selectedRecording.blob)

    let url = `${apiHost}ebi/assessmentLearner/addRecording/${personId}/${assessmentQuestionId}/${assignmentId}`

    axios.post(url, data,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
          "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
          "Authorization": "Bearer " + localStorage.getItem("authToken"),
        }
      })
      .catch(function (error) {
        //Show error here.
      })
    // .then(response => {
    // 		let assess = this.state.assess;
    // 		if (!assess || !assess.assessmentQuestionId || assess.assessmentQuestionId === guidEmpty) {
    // 				assess.assessmentQuestionId = response.data.assessmentQuestionId;
    // 				this.setState({ assess });
    // 		}
    // })
    this.handleVoiceRecordingClose();
  }


  render() {
    const {
      personId,
      className = "",
      question = {},
      nameKey,
      accessRoles,
      isSubmitted,
      assessmentCorrect,
      removeQuestionFileOpen,
      removeSolutionFileOpen,
      removeQuestionRecordingOpen,
      removeSolutionRecordingOpen,
      handleRemoveFileOpen,
      removeLearnerRecordingOpen,
      isStudent
    } = this.props;
    const {
      isShowingFileUpload,
      isShowingVoiceRecording,
      selectedFile,
      selectedRecording,
      record
    } = this.state;
    let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {};

    return (
      <div className={classes(className, styles.container)} key={nameKey}>
        <QuestionLabel label={'Picture Audio'}/>
        <div className={classes(styles.row, styles.questionLine)}>
          {correct && correct.assessmentLearnerAnswerId && !correct.pendingCorrection
            ? correct.isCorrect
              ? <Icon pathName={'checkmark0'} fillColor={'green'} premium={true}
                      className={styles.icon}/>
              : <Icon pathName={'cross_circle'} fillColor={'red'} premium={true}
                      className={styles.icon}/>
            : ''
          }
          <div className={styles.sequence}>{question.sequence}.</div>
          <div className={styles.question}>{question.questionText}</div>
        </div>
        {question.questionRecordingFileUrl &&
          <AudioDisplay src={question.questionRecordingFileUrl} preload={'auto'}
                        controls="controls" className={styles.audioLeftQuestion}
                        isSmall={true} isOwner={question.isOwner}
                        deleteFunction={(event) => removeQuestionRecordingOpen(event, question.assessmentQuestionId, question.questionRecordingUploadId)}/>
        }
        {question.questionFileUploadId &&
          <ImageDisplay linkText={''} url={question.questionFileUrl}
                        isOwner={question.isOwner}
                        deleteFunction={() => removeQuestionFileOpen(question.assessmentQuestionId, question.questionFileUploadId)}/>
        }
        {isStudent &&
          <div className={classes(styles.row, styles.moreLeft)}
               ref={(ref) => (this.pictureFile = ref)}>
            <div className={globalStyles.instructionsBigger}><L p={p}
                                                                t={`To answer this question, enter a `}/>
            </div>
            <div className={styles.row}
                 onClick={() => this.handleFileUploadOpen(question.assessmentQuestionId)}>
              <Icon pathName={'camera2'} premium={true}
                    className={styles.icon}/>
              <div
                className={classes(globalStyles.link, styles.littleTop, styles.moreRight)}>
                <L p={p} t={`Picture and / or`}/></div>
            </div>
            <div className={styles.row}
                 onClick={() => this.handleVoiceRecordingOpen(question.assessmentQuestionId)}>
              <Icon pathName={'microphone'} premium={true}
                    className={styles.iconPosition}/>
              <div className={classes(globalStyles.link, styles.littleTop)}><L
                p={p} t={`Voice recording`}/></div>
            </div>
          </div>
        }
        {(selectedRecording || (question.learnerAnswer && question.learnerAnswer.recordingFileUrl)) &&
          <AudioDisplay src={question.learnerAnswer.recordingFileUrl}
                        preload={'auto'} controls="controls"
                        className={styles.audioLeftQuestion}
                        isSmall={true} isOwner={question.learnerAnswer.isOwner}
                        deleteFunction={() => removeLearnerRecordingOpen(question.assessmentQuestionId, question.learnerAnswer.recordingFileUrl)}/>
        }
        <img src={''} alt={'New'} ref={(ref) => (this.imageViewer = ref)}/>
        {question.learnerAnswer && question.learnerAnswer.fileUploadId && question.learnerAnswer.fileUrl &&
          <ImageDisplay url={question.learnerAnswer.fileUrl}
                        isOwner={question.learnerAnswer.isOwner}
                        deleteFunction={() => handleRemoveFileOpen(question.assessmentQuestionId, question.learnerAnswer.fileUploadId)}/>
        }
        {correct.teacherEssayResponse &&
          <div>
            <TextDisplay label={<L p={p} t={`Teacher response`}/>}
                         text={(correct && correct.teacherEssayResponse) ||
                           <div className={styles.noAnswer}>no answer</div>}
                         className={styles.staticText}/>
            <TextDisplay label={<L p={p} t={`Score`}/>}
                         text={correct && correct.score}
                         className={styles.staticText}/>
          </div>
        }
        {!correct.teacherEssayResponse && (!isSubmitted || (isSubmitted && accessRoles.facilitator)) &&
          <div className={styles.answerLeft}>
            <hr/>
            <div className={styles.link}>
              <L p={p}
                 t={`The student can respond with a picture or an audio recording or both.`}/>
            </div>
            <hr/>
            {accessRoles.facilitator &&
              <div className={classes(styles.moreBottom, styles.row)}>
                <InputText
                  id={`score`}
                  name={`score`}
                  size={"super-short"}
                  label={correct.pointsPossible ?
                    <L p={p} t={`Score possible: ${correct.pointsPossible}`}/> :
                    <L p={p} t={`Score`}/>}
                  value={((assessmentCorrect && assessmentCorrect.score === 0) || (correct && correct.score === 0)) ? 0 : (assessmentCorrect && assessmentCorrect.score) || (correct && correct.score) || ''}
                  onChange={this.handleChange}
                  numberOnly={true}
                  required={true}
                  whenFilled={assessmentCorrect && assessmentCorrect.score}/>

                <div className={styles.checkbox}>
                  <Checkbox
                    id={'isCorrect'}
                    label={<L p={p} t={`Mark this answer as correct`}/>}
                    labelClass={styles.checkboxLabel}
                    checked={(correct && correct.isCorrect) || false}
                    onClick={this.toggleCheckbox}
                    className={styles.button}/>
                </div>
              </div>
            }
            {(question.solutionText || question.solutionFileUrl || question.solutionRecordingFileUrl) && (question.isOwner || (correct && correct.assessmentId)) &&
              <div className={styles.muchLeft}>
                <div className={styles.row}>
                  <div className={styles.headerLabel}>Solution</div>
                  {!(correct && correct.assessmentId) &&
                    <div className={globalStyles.instructions}><L p={p}
                                                                  t={`(After the quiz is corrected, this explanation or picture will be displayed)`}/>
                    </div>
                  }
                </div>
                <div className={styles.text}>{question.solutionText}</div>
                {question.solutionRecordingFileUrl &&
                  <AudioDisplay src={question.solutionRecordingFileUrl}
                                preload={'auto'} controls="controls"
                                className={styles.audioLeftQuestion}
                                isSmall={true} isOwner={question.isOwner}
                                deleteFunction={() => removeSolutionRecordingOpen(question.assessmentQuestionId, question.questionRecordingUploadId)}/>
                }
                {question.solutionFileUrl && question.solutionFileUploadId &&
                  <ImageDisplay linkText={''} url={question.solutionFileUrl}
                                isOwner={question.isOwner}
                                deleteFunction={() => removeSolutionFileOpen(question.assessmentQuestionId, question.solutionFileUploadId)}/>
                }
              </div>
            }
          </div>
        }
        {isShowingFileUpload &&
          <FileUploadModalWithCrop handleClose={this.handleFileUploadClose}
                                   title={'Choose Picture'}
                                   personId={personId}
                                   submitFileUpload={this.handleFileUploadSubmit}
                                   file={selectedFile}
                                   handleInputFile={this.handleInputFile}
                                   acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp"}
                                   handleCancelFile={this.handleRemoveInputFile}/>
        }
        {isShowingVoiceRecording &&
          <VoiceRecordingModal handleClose={this.handleVoiceRecordingClose}
                               title={<L p={p} t={`Assessment Question`}/>}
                               label={<L p={p} t={`File for`}/>}
                               personId={personId}
                               record={record}
                               submitFileUpload={this.handleVoiceRecordingSubmit}
                               recordedBlob={selectedRecording}
                               handleCancelFile={this.handleRemoveInputRecording}
                               startRecording={this.startRecording}
                               stopRecording={this.stopRecording}
                               onStop={this.onStop}/>
        }
      </div>
    )
  }
}
