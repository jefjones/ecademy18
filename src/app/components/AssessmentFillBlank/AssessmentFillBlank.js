import React, { Component } from 'react'
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

export default class AssessmentFillBlank extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entry: {
        essayResponse: '',
        score: '',
        isCorrect: '',
      },
      errorScore: '',
    }
  }

  componentDidMount() {
    const {
      accessRoles,
      assessmentCorrect,
      question,
      learnerAnswer
    } = this.props
    let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}

    this.setState({
      assessmentCorrect: this.props.assessmentCorrect,
      answers: learnerAnswer && learnerAnswer.learnerAnswer ? learnerAnswer.learnerAnswer.split('~^') : [],
      entry: {
        essayResponse: accessRoles.facilitator && assessmentCorrect ? assessmentCorrect.teacherEssayResponse : assessmentCorrect ? assessmentCorrect.learnerAnswer : '',
        score: correct && correct.score,
        isCorrect: correct && correct.isCorrect,
      }
    })
    //this.blankOutWord()
  }

  // componentDidUpdate() {
  // 		const {question} = this.props
  // 		const {fillInTheBlankPhrases, hasInit} = this.state
  // 		if ((!fillInTheBlankPhrases || fillInTheBlankPhrases.length === 0) && question && question.assessmentQuestionId && !hasInit)
  // 				this.blankOutWord()
  //
  // }

  handleChange = ({ target }) => {
    const { submitEssayResponse, question } = this.props
    let entry = Object.assign({}, this.state.entry)
    entry['score'] = target.value === '' ? 'EMPTY' : target.value
    this.setState({ entry })
    submitEssayResponse(question.assessmentQuestionId, entry)
  }

  toggleCheckbox = () => {
    const { submitEssayResponse, question } = this.props
    let entry = Object.assign({}, this.state.entry)
    entry['isCorrect'] = !entry['isCorrect']
    this.setState({ entry })
    submitEssayResponse(question.assessmentQuestionId, entry)
  }

  handleSubmit = () => {
    const { submitAction, question } = this.props
    const { entry } = this.state
    var hasError = false

    if (!(entry.score === 0 || entry.score > 0)) {
      hasError = true
      this.setState({ errorScore: <L p={p} t={`A score is required`} /> })
    }

    if (!hasError) {
      submitAction(question.assessmentQuestionId, entry)
    }
  }

  handleAnswerChange = (event, index) => {
    //This particular answer type can have more than one answer.  So we are going to preserve the back-end structure and just create a stopRecording
    //		of answers separated by ~^ so that we just keep moving them out of an array and back into an array on the client-side.
    let answers = Object.assign([], this.state.answers)
    answers[index] = event.target.value
    this.setState({ answers })
  }

  sendAssessmentAnswer = (event) => {
    //This particular answer type can have more than one answer.  So we are going to preserve the back-end structure and just create a stopRecording
    //		of answers separated by ~^ so that we just keep moving them out of an array and back into an array on the client-side.
    const { personId, onClick, question, assignmentId } = this.props
    const { answers } = this.state
    onClick(personId, question.assessmentQuestionId, answers.join('~^'), assignmentId)
  }

  fillInTheBlankDisplay = () => {
    const { question = {}, bigTextDisplay } = this.props
    let arrayWords = question.questionText && question.questionText.split(' ')
    let result = <div className={styles.row}>
      {arrayWords && arrayWords.length > 0 && arrayWords.map((word, index) => {
        if (question.correctAnswer && question.correctAnswer.indexOf(index) > -1) {
          return <input
            key={index}
            type={'text'}
            className={classes(styles.wordSpace, (bigTextDisplay ? styles.longerTextInput : styles.shortTextInput))}
            disabled={true} />
        } else {
          return <div key={index} className={styles.wordSpace}>{word}</div>
        }
      })}
    </div>
    return result
  }

  blankOutWord = (index, assessIncoming) => {
    const question = assessIncoming ? assessIncoming : this.state.question

    let fillBlanksChosen = typeof question.correctAnswer === 'string'
      ? question.correctAnswer.split(',')
      : question.correctAnswer

    //If this index exists, then delete it.
    //Otherwise add it.
    if (fillBlanksChosen && fillBlanksChosen.length > 0 && fillBlanksChosen.indexOf(index) > -1) {
      fillBlanksChosen = fillBlanksChosen.filter(m => m !== index)
    } else {
      fillBlanksChosen = fillBlanksChosen && fillBlanksChosen.length > 0 ? fillBlanksChosen.concat(index) : [index]
    }
    fillBlanksChosen = fillBlanksChosen && fillBlanksChosen.length > 0 && fillBlanksChosen.map(m => !m ? null : Number(m))

    this.setState({
      question: {
        ...this.state.question,
        correctAnswer: fillBlanksChosen
      }
    })
  }

  getFillInTheBlankPhrases = () => {
    const question = this.props.question || {}
    let arrayWords = question.questionText && question.questionText.split(' ')
    let fillBlanksChosen = typeof question.correctAnswer === 'string'
      ? question.correctAnswer.split(',')
      : question.correctAnswer

    let fillInTheBlankPhrases = []

    //Reset the consecutive phrases
    if (fillBlanksChosen && fillBlanksChosen.length > 0) {
      fillBlanksChosen = fillBlanksChosen.sort()
      let phraseCount = ''
      let prevIndex = ''
      let space = ''
      fillBlanksChosen.forEach(m => {
        if (((prevIndex || prevIndex === 0) && m === prevIndex + 1 * 1) || (!prevIndex && prevIndex !== 0)) {
          phraseCount = phraseCount || 0
          fillInTheBlankPhrases[phraseCount] = fillInTheBlankPhrases[phraseCount]
            ? fillInTheBlankPhrases[phraseCount] += space + arrayWords[m]
            : arrayWords[m]
          space = ' '
        } else {
          fillInTheBlankPhrases[++phraseCount] = arrayWords[m]
        }
        prevIndex = m
      })
    }
    return fillInTheBlankPhrases
  }

  getKeywords = (question) => {
    let answers = question.correctAnswer.split(',')
    let arrayWords = question.questionText && question.questionText.split(' ')
    let result = ''
    let comma = ''
    for (let i = 0; i < answers.length; i++) {
      result += comma + arrayWords[Number(answers[i])]
      comma = ', '
    }
    return result
  }

  render() {
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
    } = this.props
    const { answers } = this.state

    let fillInTheBlankPhrases = this.getFillInTheBlankPhrases()

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
            className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.question)}>{accessRoles.learner ? this.fillInTheBlankDisplay() : question.questionText}</div>
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
                  : <TextDisplay label={'Blank-out phrase'} text={this.fillInTheBlankDisplay()} />
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
                          onChange={(event) => this.handleAnswerChange(event, i)}
                          onBlur={this.sendAssessmentAnswer}
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
                <TextDisplay label={<L p={p} t={`Correct answer`} />} text={<div className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>{this.getKeywords(question)}</div>} />
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
}
