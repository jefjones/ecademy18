import * as styles from './AssessmentPassage.css'
import * as globalStyles from '../../utils/globalStyles.css'
import ImageDisplay from '../ImageDisplay'
import AudioDisplay from '../AudioDisplay'
import classes from 'classnames'
import QuestionLabel from '../QuestionLabel'

const p = 'component'
import L from '../../components/PageLanguage'

export default ({
                  className = "",
                  question,
                  nameKey,
                  accessRoles = {},
                  removeQuestionFileOpen,
                  removeQuestionRecordingOpen,
                  bigTextDisplay
                }) => {
  return (
    <div className={classes(className, styles.container)}>
      <QuestionLabel label={'Passage'}/>
      <div className={classes(styles.row, styles.questionLine)}>
        <div className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.sequence)}>{question.sequence}.
        </div>
        <div className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.question)}>{question.questionText}</div>
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
      {!accessRoles.learner &&
        <div className={styles.answerLeft}>
          <span className={styles.text}><L p={p} t={`This is intended to be a reading or example of a problem which will be followed by two or more questions.`}/></span><br/>
        </div>
      }
    </div>
  )
}
