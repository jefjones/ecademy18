import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import styles from './AssessmentMultipleChoice.css';
import classes from 'classnames';
import RadioGroup from '../RadioGroup';
import ImageDisplay from '../ImageDisplay';
import AudioDisplay from '../AudioDisplay';
import LinkDisplay from '../LinkDisplay';
import QuestionLabel from '../QuestionLabel'
import Icon from '../Icon';

const p = 'component';
import L from '../../components/PageLanguage';
/*
  The learnerAnswer and the correctAnswer should not be used at the same time.  The correctAnswer comes through when it is the content manager.
    The learnerAnswer comes through when it is the learner taking the text.
    But then again, it is going to be necessary to show the correct answer with the learner answer.  In that case, we'll have to use TextDisplay
    such as "[ ANSWER ]" in green to show the correct answer when the learnerAnswer is present.
*/

export default class AssessmentMultipleChoice extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  sendAssessmentAnswer = (value) => {
    const {personId, onClick, question, assignmentId} = this.props;
    onClick(personId, question.assessmentQuestionId, value, assignmentId);
  }

  handleLearnerAnswer = (value) => {
    const {personId, onClick, question, assignmentId} = this.props;
    onClick(personId, question.assessmentQuestionId, value, assignmentId);
  }

  render() {
    const {
      personId,
      nameKey,
      className = "",
      question = {},
      removeWebsiteLinkOpen,
      assessmentCorrect,
      removeQuestionFileOpen,
      removeAnswerFileOpen,
      removeSolutionFileOpen,
      removeQuestionRecordingOpen,
      removeAnswerRecordingOpen,
      removeSolutionRecordingOpen,
      viewMode,
      bigTextDisplay
    } = this.props;
    let correct = (assessmentCorrect && assessmentCorrect.length > 0 &&
      assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {};

    let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let data = [];
    let correctOne = '';

    question.answers && question.answers.length > 0 && question.answers.forEach((m, i) => {
      if (m.isCorrect) correctOne = m.assessmentQuestionAnswerOptionId;

      data.push({
        label: <div>
          <div>{alpha[i] + '. ' + (m.answerText || '')}</div>
          {m.recordingFileUrl &&
            <AudioDisplay src={m.recordingFileUrl} preload={'auto'}
                          controls="controls" className={styles.audioLeftAnswer}
                          isSmall={true} isOwner={question.isOwner}
                          deleteFunction={() => removeAnswerRecordingOpen(question.assessmentQuestionId, m.recordingUploadId)}/>
          }
          {m.fileUrl &&
            <ImageDisplay url={m.fileUrl} alt={`Answer ${alpha[i]}`}
                          className={correct.isSubmitted
                            ? correct.correctAnswer === m.assessmentQuestionAnswerOptionId
                              ? m.recordingFileUrl || m.fileUrl
                                ? styles.borderCorrect
                                : ''
                              : correct.isCorrect
                                ? ''
                                : m.recordingFileUrl || m.fileUrl
                                  ? styles.borderWrong
                                  : ''
                            : question.isOwner
                              ? m.isCorrect
                                ? m.recordingFileUrl || m.fileUrl
                                  ? styles.borderCorrect
                                  : ''
                                : ''
                              : question.learnerAnswer && question.learnerAnswer.learnerAnswer === m.assessmentQuestionAnswerOptionId
                                ? m.recordingFileUrl || m.fileUrl
                                  ? styles.borderCorrect
                                  : ''
                                : ''
                          }
                          isOwner={question.isOwner}
                          deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, m.fileUploadId)}/>
          }
        </div>,
        id: m.assessmentQuestionAnswerOptionId,
        correction: correct.isSubmitted
          ? correct.correctAnswer === m.assessmentQuestionAnswerOptionId
            ? "correct"
            : correct.isCorrect
              ? ""
              : "wrong"
          : ''
      })
    })

    return (
      <div className={classes(className, styles.container)}>
        <QuestionLabel label={'Multiple Choice'}/>
        <div className={classes(styles.row, styles.questionLine)}>
          {correct && correct.assessmentLearnerAnswerId
            ? correct.isCorrect
              ? <Icon pathName={'checkmark0'} fillColor={'green'} premium={true}
                      className={styles.icon}/>
              : <Icon pathName={'cross_circle'} fillColor={'red'} premium={true}
                      className={styles.icon}/>
            : ''
          }
          <div
            className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.sequence)}>{question.sequence}.
          </div>
          <div
            className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.question)}>{question.questionText}</div>
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
        <RadioGroup
          data={data}
          name={nameKey || `multipleChoice`}
          horizontal={false}
          titleClass={bigTextDisplay ? globalStyles.bigText : ''}
          labelClass={bigTextDisplay ? globalStyles.bigText : ''}
          className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.radio)}
          initialValue={question.isOwner && viewMode !== 'CorrectedView'
            ? correctOne
            : question.learnerAnswer && question.learnerAnswer.learnerAnswer
              ? question.learnerAnswer.learnerAnswer
              : ''
          }
          personId={personId}
          onClick={question.isOwner ? this.sendAssessmentAnswer : this.handleLearnerAnswer}/>
        <div className={classes(styles.moreLeft, styles.moreTop)}>
          {question.websiteLinks && question.websiteLinks.length > 0 &&
            <div>
              <hr/>
              <span className={styles.label}><L p={p}
                                                t={`Website Link`}/></span>
              {question.websiteLinks.map((w, i) =>
                <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                             deleteFunction={removeWebsiteLinkOpen}
                             deleteId={question.assessmentQuestionId}/>
              )}
              <hr/>
            </div>
          }
        </div>
        {(question.solutionText || question.solutionFileUrl || question.solutionRecordingFileUrl) && (question.isOwner || (correct && correct.assessmentId)) &&
          <div className={styles.muchLeft}>
            <div className={styles.row}>
              <div className={styles.headerLabel}><L p={p} t={`Solution:`}/>
              </div>
              {!(correct && correct.assessmentId) &&
                <div className={globalStyles.instructions}> (After the quiz is
                  corrected, this explanation or picture will be
                  displayed)</div>
              }
            </div>
            <div className={styles.solutionText}>{question.solutionText}</div>
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
    )
  }
}
