import { useEffect, useState } from 'react'
import styles from './AssessmentFillBlank.css'
import globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import TextDisplay from '../TextDisplay'
import ImageDisplay from '../ImageDisplay'
import AudioDisplay from '../AudioDisplay'
import InputText from '../InputText'
import QuestionLabel from '../QuestionLabel'
import Icon from '../Icon'

const p = 'component'
import L from '../../components/PageLanguage'

function AssessmentFillBlank(props) {
  const [entry, setEntry] = useState({
        essayResponse: '',
        score: '',
        isCorrect: '',
      })
  const [essayResponse, setEssayResponse] = useState('')
  const [score, setScore] = useState('')
  const [isCorrect, setIsCorrect] = useState('')
  const [errorScore, setErrorScore] = useState('')
  const [answers, setAnswers] = useState(learnerAnswer && learnerAnswer.learnerAnswer ? learnerAnswer.learnerAnswer.split('~^') : [])
  const [p, setP] = useState(undefined)
  const [correctAnswer, setCorrectAnswer] = useState(fillBlanksChosen)

  useEffect(() => {
    
        const {
          accessRoles,
          assessmentCorrect,
          question,
          learnerAnswer
        } = props
        let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}
    
        setAssessmentCorrect(props.assessmentCorrect); setAnswers(learnerAnswer && learnerAnswer.learnerAnswer ? learnerAnswer.learnerAnswer.split('~^') : []); setEntry({
            essayResponse: accessRoles.facilitator && assessmentCorrect ? assessmentCorrect.teacherEssayResponse : assessmentCorrect ? assessmentCorrect.learnerAnswer : '',
            score: correct && correct.score,
            isCorrect: correct && correct.isCorrect,
          })
        //blankOutWord()
      
  }, [])

  const {
        className = "",
        question = {},
        nameKey,
        accessRoles,
        assessmentCorrect,
        removeQuestionFileOpen,
        removeSolutionFileOpen,
        removeQuestionRecordingOpen,
        removeSolutionRecordingOpen,
        bigTextDisplay
      } = props
      let fillInTheBlankPhrases = getFillInTheBlankPhrases()
  
      let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}
      let learnerAnswers = question.learnerAnswer && question.learnerAnswer.learnerAnswer && typeof question.learnerAnswer.learnerAnswer === 'string'
        ? question.learnerAnswer.learnerAnswer.split('~^')
        : question.learnerAnswer && question.learnerAnswer.learnerAnswer
  
      console.log('question', question)
      return (
        <div className={classes(className, styles.container)} key={nameKey}>
          <QuestionLabel label={'Fill in the Blank'} />
          <div className={classes(styles.row, styles.questionLine)}>
            {assessmentCorrect && assessmentCorrect.length > 0
              ? correct.isCorrect
                ? <Icon pathName={'checkmark0'} fillColor={'green'} premium={true}
                  className={styles.icon} />
                : <Icon pathName={'cross_circle'} fillColor={'red'} premium={true}
                  className={styles.icon} />
              : ''
            }
            <div
              className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.sequence)}>{question.sequence}.
            </div>
            <div
              className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.question)}>{accessRoles.learner ? fillInTheBlankDisplay() : question.questionText}</div>
          </div>
          {question.questionRecordingFileUrl &&
            <AudioDisplay src={question.questionRecordingFileUrl} preload={'auto'}
              controls="controls"
              isSmall={true} isOwner={question.isOwner}
              className={styles.audioLeftQuestion}
              deleteFunction={(event) => removeQuestionRecordingOpen(event, question.assessmentQuestionId, question.questionRecordingUploadId)} />
          }
          {question.questionFileUploadId &&
            <ImageDisplay linkText={''} url={question.questionFileUrl}
              isOwner={question.isOwner}
              deleteFunction={() => removeQuestionFileOpen(question.assessmentQuestionId, question.questionFileUploadId)} />
          }
          <div className={styles.answerLeft}>
            <div className={classes(styles.row, styles.moreLeft)}>
              <div className={styles.text}>
                {accessRoles.facilitator || accessRoles.admin
                  ? question.learnerAnswer && question.learnerAnswer.isSubmitted
                    ? <div>
                      {fillInTheBlankPhrases && fillInTheBlankPhrases.length > 0 && fillInTheBlankPhrases.map((m, i) => {
                        let learnerAnswer = learnerAnswers[i]
  
                        return !m
                          ? null
                          : <div className={styles.row} key={i}>
                            <TextDisplay label={<L p={p} t={`Student's answer`} />}
                              text={
                                <div
                                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), (question.learnerAnswer && (question.learnerAnswer.isCorrect || learnerAnswer === m) ? styles.correctText : styles.wrongText))}>
                                  {learnerAnswer}
                                </div>}
                            />
                            {!(question.learnerAnswer && question.learnerAnswer.isCorrect) &&
                              <TextDisplay label={<L p={p} t={`Correct answer`} />}
                                text={<div
                                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>{m}</div>}
                                className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)} />
                            }
                          </div>
                      })}
                    </div>
                    : <TextDisplay label={'Blank-out phrase'} text={fillInTheBlankDisplay()} />
                  : question && question.learnerAnswer && question.learnerAnswer.learnerAnswer && question.learnerAnswer.isSubmitted
                    ? <div>
                      {fillInTheBlankPhrases && fillInTheBlankPhrases.length > 0 && fillInTheBlankPhrases.map((m, i) => {
                        let learnerAnswer = learnerAnswers[i]
  
                        return !m
                          ? null
                          : <div className={styles.row} key={i}>
                            <TextDisplay label={<L p={p} t={`Student's answer`} />}
                              text={
                                <div
                                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), (question.learnerAnswer && (question.learnerAnswer.isCorrect || learnerAnswer === m) ? styles.correctText : styles.wrongText))}>
                                  {learnerAnswer}
                                </div>}
                            />
                            {!(question.learnerAnswer && question.learnerAnswer.isCorrect) &&
                              <TextDisplay label={<L p={p} t={`Correct answer`} />}
                                text={<div
                                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>{m}</div>}
                                className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)} />
                            }
                          </div>
                      })}
                    </div>
                    : <div>
                      {fillInTheBlankPhrases && fillInTheBlankPhrases.length > 0 && fillInTheBlankPhrases.map((m, i) =>
                        !m
                          ? null
                          : <InputText key={i}
                            id={`learnerAnswer`}
                            name={`learnerAnswer`}
                            size={bigTextDisplay ? 'bigtext' : 'medium'}
                            height={bigTextDisplay ? 'bigtext' : ''}
                            label={fillInTheBlankPhrases && fillInTheBlankPhrases.length > 1 ?
                              <L p={p} t={`Answer #${i + 1 * 1}`} /> :
                              <L p={p} t={`Answer`} />}
                            value={(answers && answers.length > 0 && answers[i]) || ''}
                            onChange={(event) => handleAnswerChange(event, i)}
                            onBlur={sendAssessmentAnswer}
                            required={true}
                            whenFilled={answers && answers.length > 0 && answers[i]}
                            inputClassName={bigTextDisplay ? globalStyles.bigText : ''}
                            labelClass={bigTextDisplay ? globalStyles.bigText : ''}
                            autoComplete={'dontdoit'} />
                      )}
                    </div>
                }
              </div>
            </div>
            {question.answerVariations && question.answerVariations.length > 0 && (accessRoles.admin || accessRoles.facilitator) &&
              <div className={globalStyles.instructionsBig}>
                <L p={p}
                  t={`The student's answer will be accepted if it is the given correct answer or an acceptable variation.`} />
              </div>
            }
            <div className={styles.rowWrap}>
              {!(accessRoles.observer || accessRoles.learner) &&
                <div className={styles.row}>
                  <TextDisplay label={<L p={p} t={`Correct answer`} />} text={<div className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>{getKeywords(question)}</div>} />
                  <TextDisplay label={<L p={p} t={`Acceptable answer variations`} />}
                    text={question.answerVariations && question.answerVariations.length > 0
                      ? question.answerVariations.map((variation, i) =>
                        <div key={i}
                          className={classes(styles.labelBold, styles.littleLeft)}>{variation}</div>)
                      : <div key={'none'}
                        className={classes(styles.labelItalicsGray, styles.littleLeft)}>
                        <L p={p} t={`none`} /></div>
                    } />
                </div>
              }
            </div>
            {(question.solutionText || question.solutionFileUrl || question.solutionRecordingFileUrl) && (question.isOwner || (correct && correct.assessmentId)) &&
              <div>
                {!(correct && correct.assessmentId) &&
                  <div className={globalStyles.instructions}><L p={p}
                    t={`After the quiz is corrected, this explanation or picture will be displayed.`} />
                  </div>
                }
                <div className={styles.row}>
                  <div
                    className={classes(styles.marginRight, styles.text)}>Solution:
                  </div>
                  <div className={styles.text}>{question.solutionText}</div>
                </div>
                {question.solutionRecordingFileUrl &&
                  <AudioDisplay src={question.solutionRecordingFileUrl}
                    preload={'auto'} controls="controls"
                    className={styles.audioLeftQuestion}
                    browserMessage={<L p={p}
                      t={`This browser does not support this audio control`} />}
                    isSmall={true} isOwner={question.isOwner}
                    deleteFunction={() => removeSolutionRecordingOpen(question.assessmentQuestionId, question.questionRecordingUploadId)} />
                }
                {question.solutionFileUrl && question.solutionFileUploadId &&
                  <ImageDisplay linkText={''} url={question.solutionFileUrl}
                    isOwner={question.isOwner}
                    deleteFunction={() => removeSolutionFileOpen(question.assessmentQuestionId, question.solutionFileUploadId)} />
                }
              </div>
            }
          </div>
        </div>
      )
}
export default AssessmentFillBlank
