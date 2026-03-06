
import styles from './AssessmentTrueFalse.css'
import globalStyles from '../../utils/globalStyles.css'
import RadioGroup from '../RadioGroup'
import Icon from '../Icon'
import ImageDisplay from '../ImageDisplay'
import AudioDisplay from '../AudioDisplay'
import QuestionLabel from '../QuestionLabel'
import classes from 'classnames'

const p = 'component'
import L from '../../components/PageLanguage'

function AssessmentTrueFalse(props) {
  const {
        className = "",
        question,
        initialValue,
        onClick,
        nameKey,
        personId,
        assessmentCorrect,
        removeQuestionFileOpen,
        removeSolutionFileOpen,
        removeQuestionRecordingOpen,
        removeSolutionRecordingOpen,
        bigTextDisplay
      } = props
      let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}
  
      return (
        <div className={classes(className, styles.container)}>
          <QuestionLabel label={'True or False'} />
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
                          deleteFunction={(event) => removeQuestionRecordingOpen(event, question.assessmentQuestionId, question.questionRecordingFileUploadId)}/>
          }
          {question.questionFileUploadId &&
            <ImageDisplay linkText={''} url={question.questionFileUrl}
                          isOwner={question.isOwner}
                          deleteFunction={() => removeQuestionFileOpen(question.assessmentQuestionId, question.questionFileUploadId)}/>
          }
          <RadioGroup
            name={nameKey}
            data={[
              {
                label: <L p={p} t={`True`}/>,
                id: "true",
                correction: correct.isSubmitted
                  ? correct.correctAnswer === "true"
                    ? "correct"
                    : correct.isCorrect
                      ? ""
                      : "wrong"
                  : ''
              },
              {
                label: <L p={p} t={`False`}/>,
                id: "false",
                correction: correct.isSubmitted
                  ? correct.correctAnswer === "false"
                    ? "correct"
                    : correct.isCorrect
                      ? ""
                      : "wrong"
                  : ''
              },
            ]}
            horizontal={true}
            titleClass={bigTextDisplay ? globalStyles.bigText : ''}
            labelClass={bigTextDisplay ? globalStyles.bigText : ''}
            className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.radio)}
            initialValue={initialValue || (question.learnerAnswer && question.learnerAnswer.learnerAnswer) || question.learnerAnswer} //This learnerAnswer could come from the object learnerAnswer or the corrected version 'learnerAnswer' as a string.
            personId={personId}
            onClick={onClick ? sendAssessmentAnswer : () => {
            }}/>
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
                              deleteFunction={() => removeSolutionRecordingOpen(question.assessmentQuestionId, question.solutionRecordingFileUploadId)}/>
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
export default AssessmentTrueFalse
