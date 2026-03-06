
import globalStyles from '../../utils/globalStyles.css'
import styles from './AssessmentMultipleAnswer.css'
import classes from 'classnames'
import Checkbox from '../Checkbox'
import ImageDisplay from '../ImageDisplay'
import AudioDisplay from '../AudioDisplay'
import LinkDisplay from '../LinkDisplay'
import Icon from '../Icon'
import QuestionLabel from '../QuestionLabel'
import {guidEmpty} from '../../utils/guidValidate'

const p = 'component'
import L from '../../components/PageLanguage'

/*
  The learnerAnswer and the correctAnswer should not be used at the same time.  The correctAnswer comes through when it is the content manager.
    The learnerAnswer comes through when it is the learner taking the text.
    But then again, it is going to be necessary to show the correct answer with the learner answer.  In that case, we'll have to use TextDisplay
    such as "[ ANSWER ]" in green to show the correct answer when the learnerAnswer is present.
*/

function AssessmentMultipleAnswer(props) {
  const {
        personId,
        className = '',
        question = {},
        assessmentCorrect,
        removeWebsiteLinkOpen,
        removeQuestionFileOpen,
        removeAnswerFileOpen,
        viewMode,
        removeSolutionFileOpen,
        removeQuestionRecordingOpen,
        removeAnswerRecordingOpen,
        removeSolutionRecordingOpen,
        isOwnerSetup,
        bigTextDisplay
      } = props
  
      let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}
  
      let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  
      let learnerAnswers = (question.learnerAnswer && question.learnerAnswer.learnerAnswer) || []
      if (typeof learnerAnswers === 'string') learnerAnswers = learnerAnswers.split(",")
  
      let correctAnswers = (correct && correct.correctAnswer) || []
      if (typeof correctAnswers === 'string') correctAnswers = correctAnswers.split(",")
  
      return (
        <div className={classes(className, styles.container)}>
          <QuestionLabel label={'Multiple Answer'}/>
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
          {question.answers && question.answers.length > 0 && question.answers.map((m, i) =>
            <div key={i} className={classes(styles.checkbox, (correct.isSubmitted
                ? correctAnswers.indexOf(m.assessmentQuestionAnswerOptionId) > -1
                  ? question.questionRecordingFileUrl || (question.questionFileUploadId && question.questionFileUploadId !== guidEmpty)
                    ? styles.borderCorrect
                    : ''
                  : correct.isCorrect
                    ? ''
                    : question.questionRecordingFileUrl || (question.questionFileUploadId && question.questionFileUploadId !== guidEmpty)
                      ? styles.borderWrong
                      : ''
                : question.isOwner
                  ? m.isCorrect
                    ? question.questionRecordingFileUrl || (question.questionFileUploadId && question.questionFileUploadId !== guidEmpty)
                      ? styles.borderCorrect
                      : ''
                    : ''
                  : learnerAnswers.length > 0 && learnerAnswers.indexOf(m.assessmentQuestionAnswerOptionId) > -1
                    ? question.questionRecordingFileUrl || (question.questionFileUploadId && question.questionFileUploadId !== guidEmpty)
                      ? styles.borderCorrect
                      : ''
                    : ''
            ))}>
              <Checkbox
                id={i}
                label={alpha[i] + '. ' + (m.answerText || '')}
                checked={(question.isOwner && m.isCorrect && viewMode !== 'CorrectedView') || (question.learnerAnswer && question.learnerAnswer.learnerAnswer && question.learnerAnswer.learnerAnswer.indexOf(m.assessmentQuestionAnswerOptionId) > -1) || false}
                onClick={isOwnerSetup
                  ? isOwnerSetup
                  : question.isOwner
                    ? () => toggleCheckbox(i)
                    : (event) => handleAnswer(event, question.learnerAnswer && question.learnerAnswer.learnerAnswer, m.assessmentQuestionAnswerOptionId)
                }
                personId={personId}
                labelClass={classes((bigTextDisplay ? globalStyles.bigText : ''),
                  correct.isSubmitted
                    ? m.isCorrect
                      ? styles.labelCorrect
                      : styles.labelWrong
                    : styles.label
                )}/>
  
              {m.recordingFileUrl &&
                <AudioDisplay src={m.recordingFileUrl} preload={'auto'}
                              controls="controls"
                              className={styles.audioLeftAnswer}
                              isSmall={true} isOwner={question.isOwner}
                              deleteFunction={() => removeAnswerRecordingOpen(question.assessmentQuestionId, m.recordingFileUploadId)}/>
              }
              {m.fileUrl &&
                <ImageDisplay url={m.fileUrl} alt={`Answer ${alpha[i]}`}
                              className={correct.isSubmitted
                                ? correctAnswers.indexOf(m.assessmentQuestionAnswerOptionId) > -1
                                  ? m.recordingFileUrl || m.fileUrl
                                    ? styles.correctBorder
                                    : ''
                                  : correct.isCorrect
                                    ? ''
                                    : m.recordingFileUrl || m.fileUrl
                                      ? styles.wrongBorder
                                      : ''
                                : ''
                              }
                              isOwner={question.isOwner}
                              deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, m.fileUploadId)}
                              onClick={question.isOwner
                                ? () => toggleCheckbox(i)
                                : (event) => handleAnswer(event, question.learnerAnswer && question.learnerAnswer.learnerAnswer, m.assessmentQuestionAnswerOptionId)}/>
              }
            </div>
          )}
          <div className={classes(styles.muchLeft, styles.moreTop)}>
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
                  <div className={globalStyles.instructions}><L p={p}
                                                                t={`(After the quiz is corrected, this explanation or picture will be displayed)`}/>
                  </div>
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

// labelClass={correct.isSubmitted
// 		? correct.correctAnswer === m.assessmentQuestionAnswerOptionId
// 				? styles.labelCorrect
// 				: correct.isCorrect
// 						? ''
// 						: styles.labelWrong
// 		: styles.label}/>
export default AssessmentMultipleAnswer
