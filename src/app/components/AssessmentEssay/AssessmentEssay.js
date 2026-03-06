import React, {Component} from 'react';
import {Link} from 'react-router';
import {penspringHost} from '../../penspring_host.js';
import styles from './AssessmentEssay.css';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
import TextDisplay from '../TextDisplay';
import ImageDisplay from '../ImageDisplay';
import AudioDisplay from '../AudioDisplay';
import Icon from '../Icon';
import QuestionLabel from '../QuestionLabel'
import penspringSmall from '../../assets/Penspring_small.png';
import {guidEmpty} from '../../utils/guidValidate.js';

const p = 'component';
import L from '../../components/PageLanguage';

export default class AssessmentEssay extends Component {
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
    const {accessRoles, assessmentCorrect, question = {}} = this.props;
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
      this.setState({errorScore: <L p={p} t={`A score is required`}/>})
    }

    if (!hasError) {
      submitAction(question.assessmentQuestionId, entry)
    }
  }

  handleNewPenspring = (studentPersonId) => {
    const {
      createWorkAndPenspringTransfer,
      personId,
      question,
      assessmentTitle,
      course
    } = this.props;
    let data = {
      transferCode: 'STARTWRITING',
      ownerPersonId: studentPersonId,
      editorPersonId: course.teachers && course.teachers.length > 0 && course.teachers[0].id,
      studentPersonId: studentPersonId,
      workName: <L p={p}
                   t={`${assessmentTitle} Question #${question.sequence} (an essay)`}/>,
      description: question.questionText,
      languageId: 1,
      assessmentQuestionId: question.assessmentQuestionId,
    }
    createWorkAndPenspringTransfer(personId, data);
  }

  handlePenspringView = () => {
    const {
      question,
      setPenspringTransfer,
      personId,
      accessRoles,
      course,
      assignmentId
    } = this.props;
    let transfer = {
      assessmentQuestionId: question.assessmentQuestionId,
      assignmentId,
      transferCode: 'STARTWRITING',
      workId: question.learnerAnswer.penspringWorkId,
      ownerPersonId: accessRoles.facilitator ? question.learnerAnswer.personId : personId,
      editorPersonId: accessRoles.facilitator ? personId : course.facilitatorPersonId,
      isTeacher: accessRoles.facilitator,
      courseEntryId: course && course.courseEntryId,
    }
    setPenspringTransfer(personId, transfer);
    //wait(1000);
    //document.getElementById('hiddenPenspringLink').click();
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
      bigTextDisplay
    } = this.props;
    let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {};

    return (
      <div className={classes(className, styles.container)} key={nameKey}>
        <QuestionLabel label={'Essay'}/>
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
        {isSubmitted &&
          <TextDisplay label={<L p={p} t={`Student essay`}/>}
                       className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.staticText)}
                       text={question.learnerAnswer && question.learnerAnswer.learnerAnswer === 'PENSPRING'
                         ? question.learnerAnswer && (!question.learnerAnswer.penspringWorkId || question.learnerAnswer.penspringWorkId === guidEmpty)
                           ? <div className={styles.noAnswer}>no answer</div>
                           : <Link to={`${penspringHost}/lms/${personId}`}
                                   onClick={this.handlePenspringView}
                                   className={classes(styles.link, styles.row)}
                                   target={'_penspring'}>
                             <L p={p} t={`Review this essay in`}/>
                             <img
                               className={classes(styles.penspringLogo, styles.pointer)}
                               src={penspringSmall} alt="penspring"/>
                           </Link>
                         : question && question.learnerAnswer && question.learnerAnswer.learnerAnswer
                       }/>
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
            {/*<span className={styles.inputText}>{accessRoles.facilitator ? 'Teacher Response' : 'Answer'}</span><br/>
		                  <textarea rows={5}
		                      id={'essayResponse'}
		                      name={'essayResponse'}
													defaultValue={correct ? accessRoles.facilitator ? correct.teacherEssayResponse : learnerAnswer : ''}
		                      onChange={this.handleChange}
		                      onBlur={accessRoles.facilitator ? () => {} : onChange ? (event) => onChange(personId, question.assessmentQuestionId, entry.essayResponse) : () => {}}
		                      className={styles.commentTextarea}>
		                  </textarea>*/}
            <div className={classes(styles.row, styles.moreLeft)}>
              <div className={styles.penspring}>
                {accessRoles.facilitator || accessRoles.admin
                  ? question.learnerAnswer && question.learnerAnswer.isSubmitted
                    ? <div className={styles.row}>
                      <L p={p}
                         t={`See the student's essays by clicking on this link`}/>
                      <img className={styles.penspringLogo} src={penspringSmall}
                           alt="penspring"/>
                    </div>
                    : <div className={styles.row}>
                      <L p={p} t={`The students' essays will be editable in`}/>
                      <img className={styles.penspringLogo} src={penspringSmall}
                           alt="penspring"/>
                    </div>
                  : question && question.learnerAnswer && question.learnerAnswer.penspringWorkId && question.learnerAnswer.penspringWorkId !== guidEmpty
                    ? <Link to={`${penspringHost}/lms/${personId}`}
                            onClick={this.handlePenspringView}
                            className={classes(styles.link, styles.row)}
                            target={'_penspring'}>
                      <L p={p} t={`Review this essay in`}/>
                      <img
                        className={classes(styles.penspringLogo, styles.pointer)}
                        src={penspringSmall} alt="penspring"/>
                    </Link>
                    : <Link to={`${penspringHost}/lms/${personId}`}
                            onClick={question.isOwner ? () => {
                            } : () => this.handleNewPenspring(personId, correct)}
                            className={classes(styles.link, styles.row)}
                            target={'_penspring'}>
                      <L p={p} t={`Compose this essay in`}/>
                      <img
                        className={classes(styles.penspringLogo, styles.pointer)}
                        src={penspringSmall} alt="penspring"/>
                    </Link>
                }
              </div>
            </div>
            { /*accessRoles.facilitator &&
													<div className={classes(styles.moreBottom, styles.row)}>
															<InputText
																	id={`score`}
																	name={`score`}
																	size={"super-short"}
																	label={"Score" + (correct.pointsPossible ? ` (possible: ${correct.pointsPossible})` : '')}
																	value={((assessmentCorrect && assessmentCorrect.score === 0) || (correct && correct.score === 0)) ? 0 : (assessmentCorrect && assessmentCorrect.score) || (correct && correct.score) || ''}
																	onChange={this.handleChange}
																	numberOnly={true}
																	required={true}
																	whenFilled={assessmentCorrect && assessmentCorrect.score} />

															<div className={styles.checkbox}>
																	<Checkbox
					                            id={'isCorrect'}
					                            label={'Mark this essay as correct'}
																			labelClass={styles.checkboxLabel}
					                            checked={(correct&& correct.isCorrect) || false}
					                            onClick={this.toggleCheckbox}
																			className={styles.button}/>
															</div>
													</div> */
            }
            {(question.solutionText || question.solutionFileUrl || question.solutionRecordingFileUrl) && (question.isOwner || (correct && correct.assessmentId)) &&
              <div>
                {!(correct && correct.assessmentId) &&
                  <div className={globalStyles.instructions}><L p={p}
                                                                t={`After the quiz is corrected, this explanation or picture will be displayed`}/>
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
        }
      </div>
    )
  }
}
