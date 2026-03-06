import React, {Component} from 'react';
import styles from './AssessmentSingleEntry.css';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
import TextDisplay from '../TextDisplay';
import ImageDisplay from '../ImageDisplay';
import AudioDisplay from '../AudioDisplay';
import InputText from '../InputText';
import Icon from '../Icon';
import QuestionLabel from '../QuestionLabel'

const p = 'component';
import L from '../../components/PageLanguage';

export default class AssessmentSingleEntry extends Component {
  constructor(props) {
    super(props);

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
    const {updateAssessmentLocalAnswer, question} = this.props;
    updateAssessmentLocalAnswer(question.assessmentId, question.assessmentQuestionId, target.value);
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
      this.setState({errorScore: <L p={p} t={`A score is required`}/>})
    }

    if (!hasError) {
      submitAction(question.assessmentQuestionId, entry)
    }
  }

  sendAssessmentAnswer = (event) => {
    const {personId, onClick, question, assignmentId} = this.props;
    onClick(personId, question.assessmentQuestionId, event.target.value, assignmentId);
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
    } = this.props;
    let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {};

    return (
      <div className={classes(className, styles.container)} key={nameKey}>
        <QuestionLabel label={'Single Entry'}/>
        <div className={classes(styles.row, styles.questionLine)}>
          {correct && correct.assessmentLearnerAnswerId && !correct.pendingCorrection
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
        <div className={styles.answerLeft}>
          <div className={classes(styles.row, styles.moreLeft)}>
            <div className={styles.text}>
              {accessRoles.facilitator || accessRoles.admin
                ? question.learnerAnswer && question.learnerAnswer.isSubmitted
                  ? <div>
                    <TextDisplay label={<L p={p} t={`Student's answer`}/>}
                                 text={
                                   <div
                                     className={classes((bigTextDisplay ? globalStyles.bigText : ''), (assessmentCorrect && assessmentCorrect.length > 0 ? correct.isCorrect ? styles.correctText : styles.wrongText : styles.staticText))}>
                                     {question && question.learnerAnswer && question.learnerAnswer.learnerAnswer}
                                   </div>}
                    />
                    {!correct.isCorrect &&
                      <TextDisplay label={<L p={p} t={`Correct answer`}/>}
                                   text={<div
                                     className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>{question && question.correctAnswer}</div>}
                                   className={styles.staticText}/>
                    }
                  </div>
                  : <TextDisplay label={<L p={p} t={`Correct answer`}/>}
                                 text={<div
                                   className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>{question && question.correctAnswer}</div>}
                                 className={styles.staticText}/>
                : question && question.learnerAnswer && question.learnerAnswer.learnerAnswer && question.learnerAnswer.isSubmitted
                  ? <div>
                    <TextDisplay label={<L p={p} t={`Student's answer`}/>}
                                 text={
                                   <div
                                     className={classes((bigTextDisplay ? globalStyles.bigText : ''), (assessmentCorrect && assessmentCorrect.length > 0 ? correct.isCorrect ? styles.correctText : styles.wrongText : styles.staticText))}>
                                     {question && question.learnerAnswer && question.learnerAnswer.learnerAnswer}
                                   </div>}
                    />
                    {!correct.isCorrect &&
                      <TextDisplay label={<L p={p} t={`Correct answer`}/>}
                                   text={<div
                                     className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>{question && question.correctAnswer}</div>}
                                   className={styles.staticText}/>
                    }
                  </div>
                  : <div>
                    <InputText
                      id={`learnerAnswer`}
                      name={`learnerAnswer`}
                      size={bigTextDisplay
                        ? 'bigtext'
                        : question.answerNumberOnly
                          ? 'super-short'
                          : 'medium'
                      }
                      height={bigTextDisplay ? 'bigtext' : ''}
                      label={<L p={p} t={`Answer`}/>}
                      numberOnly={question.answerNumberOnly}
                      value={(question.learnerAnswer && question.learnerAnswer.learnerAnswer) || ''}
                      onChange={this.handleChange}
                      onBlur={this.sendAssessmentAnswer}
                      required={true}
                      whenFilled={question.learnerAnswer && question.learnerAnswer.learnerAnswer}
                      inputClassName={bigTextDisplay ? globalStyles.bigText : ''}
                      labelClass={bigTextDisplay ? globalStyles.bigText : ''}
                      autoComplete={'dontdoit'}/>
                  </div>
              }
            </div>
          </div>
          {question.answerVariations && question.answerVariations.length > 0 && !question.correctAnswer &&
            <div className={globalStyles.instructionsBig}>
              <L p={p}
                 t={`The student's answer will be accepted if it is the given correct answer or an acceptable variation.`}/>
            </div>
          }
          <div className={styles.rowWrap}>
            {!(accessRoles.observer || accessRoles.learner) &&
              <TextDisplay label={<L p={p} t={`Acceptable answer variations`}/>}
                           text={question.answerVariations && question.answerVariations.length > 0
                             ? question.answerVariations.map((variation, i) =>
                               <div key={i}
                                    className={classes(styles.labelBold, styles.littleLeft)}>{variation}</div>)
                             : <div key={'none'}
                                    className={classes(styles.labelItalicsGray, styles.littleLeft)}>
                               <L p={p} t={`none`}/></div>
                           }
              />
            }
          </div>
          {(question.solutionText || question.solutionFileUrl || question.solutionRecordingFileUrl) && (question.isOwner || (correct && correct.assessmentId)) &&
            <div>
              {!(correct && correct.assessmentId) &&
                <div className={globalStyles.instructions}><L p={p}
                                                              t={`After the quiz is corrected, this explanation or picture will be displayed.`}/>
                </div>
              }
              <div className={styles.row}>
                <div className={classes(styles.marginRight, styles.text)}><L
                  p={p} t={`Solution:`}/></div>
                <div className={styles.text}>{question.solutionText}</div>
              </div>
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
      </div>
    )
  }
}
