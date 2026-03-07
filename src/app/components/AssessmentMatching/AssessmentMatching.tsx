import { useState } from 'react'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './AssessmentMatching.css'
import classes from 'classnames'
import ImageDisplay from '../ImageDisplay'
import AudioDisplay from '../AudioDisplay'
import LinkDisplay from '../LinkDisplay'
import InputTextArea from '../InputTextArea'
import SelectSingleDropDown from '../SelectSingleDropDown'
import MessageModal from '../MessageModal'
import TextDisplay from '../TextDisplay'
import Icon from '../Icon'
import QuestionLabel from '../QuestionLabel'

const p = 'component'
import L from '../../components/PageLanguage'

const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
/*
  The learnerAnswer and the correctAnswer should not be used at the same time.  The correctAnswer comes through when it is the content manager.
    The learnerAnswer comes through when it is the learner taking the text.
    But then again, it is going to be necessary to show the correct answer with the learner answer.  In that case, we'll have to use TextDisplay
    such as "[ ANSWER ]" in green to show the correct answer when the learnerAnswer is present.
*/

function AssessmentMatching(props) {
  const [displayEntries, setDisplayEntries] = useState((question && question.questionText && question.questionText.length) || 6)
  const [isShowingModal_removeLine, setIsShowingModal_removeLine] = useState(true)

  const {
        assessmentCorrect,
        removeWebsiteLinkOpen,
        removeSolutionFileOpen,
        removeAnswerRecordingOpen,
        removeSolutionRecordingOpen,
        handleMatchingCorrectAnswers,
        handleMatchingQuestionText,
        handleMatchingToMatchText,
        accessRoles,
        viewMode = 'AddOrUpdate',
        removeAnswerFileOpen,
        handleFileUploadOpen,
        handleVoiceRecordingOpen,
        removeToMatchFileOpen,
        multipleAnswerAnswers = [],
        multipleMatchingAnswers = [],
        bigTextDisplay
      } = props
      let question = Object.assign({}, props.question)
      question = question ? question : {}
      
      if (question.correctAnswer && typeof question.correctAnswer === 'string') question.correctAnswer = question.correctAnswer.split(",")
      if (question.questionText && typeof question.questionText === 'string') question.questionText = question.questionText.split("~^")
      if (question.toMatchText && typeof question.toMatchText === 'string') question.toMatchText = question.toMatchText.split("~^")
      if (question.learnerAnswer && typeof question.learnerAnswer.learnerAnswer === 'string') question.learnerAnswer.learnerAnswer = question.learnerAnswer.learnerAnswer.split(",")
  
      let correct = (assessmentCorrect && assessmentCorrect.length > 0 &&
        assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}
  
      let answerOptions = []
      let indexLimit = viewMode === 'StudentView' ? question.questionText && question.questionText.length : displayEntries
      for (let i = 0; i < indexLimit; i++) {
        let option = {id: alpha[i], label: alpha[i]}
        answerOptions = answerOptions && answerOptions.length > 0 ? answerOptions.concat(option) : [option]
      }
  
      let displayOptions = []
      for (let i = 1; i <= 26; i++) {
        let option = {id: i, label: i}
        displayOptions = displayOptions && displayOptions.length > 0 ? displayOptions.concat(option) : [option]
      }
  
      //1. Loop through the matching records (with a starting default of 6)
      //2. Show the answer box on the left, the first list of matching values and the right-side list of values to match.
      //3. Allow each displayEntries to have a picture and/or file.
      let linesToMatch = []
      let linesToMatchLeft = []
      let linesToMatchRight = []
  
      if (viewMode === 'AddOrUpdate') {
        for (let index = 0; index < displayEntries; index++) {
          linesToMatchLeft.push(
            <div key={index}>
              <div className={styles.row}>
                <div>
                  <SelectSingleDropDown
                    label={<L p={p} t={`Answer`}/>}
                    value={question.correctAnswer[index] || ''}
                    options={answerOptions}
                    height={bigTextDisplay ? 'bigtext' : ''}
                    className={classes(styles.moreBottomMargin, bigTextDisplay ? globalStyles.bigText : '')}
                    labelClass={bigTextDisplay ? globalStyles.bigText : ''}
                    selectClass={bigTextDisplay ? globalStyles.bigText : ''}
                    onChange={(event) => handleMatchingCorrectAnswers(event, index)}/>
                  {(accessRoles.facilitator || accessRoles.admin) &&
                    ((question && question.correctAnswer[index]) || (question && question.questionText[index]) || (question && question.toMatchText[index])) &&
                    <div onClick={() => handleRemoveLineOpen(index)}
                         className={classes(globalStyles.link, styles.red, styles.moreTop)}>
                      <L p={p} t={`remove`}/></div>
                  }
                </div>
                <InputTextArea
                  label={`${index + 1 * 1}.`}
                  value={question.questionText[index] || ''}
                  onChange={(event) => handleMatchingQuestionText(event, index)}
                  textareaClass={bigTextDisplay ? globalStyles.bigText : ''}
                  inputClassName={bigTextDisplay ? globalStyles.bigText : ''}
                  labelClass={bigTextDisplay ? globalStyles.bigText : ''}
                  autoComplete={'dontdoit'}/>
              </div>
              <div
                className={classes(styles.row, styles.includePicture, styles.muchMuchMoreLeft)}
                ref={(ref) => (this[`answerFile${index}`] = ref)}>
                <div className={styles.row}
                     onClick={() => handleFileUploadOpen(false, index)}>
                  <Icon pathName={'camera2'} premium={true}
                        className={styles.icon}/>
                  <div className={classes(globalStyles.link, styles.littleTop)}><L
                    p={p} t={`Picture`}/></div>
                </div>
                <div className={styles.row}
                     onClick={() => handleVoiceRecordingOpen(false, index)}>
                  <Icon pathName={'microphone'} premium={true}
                        className={styles.iconPosition}/>
                  <div className={classes(globalStyles.link, styles.littleTop)}><L
                    p={p} t={`Voice recording`}/></div>
                </div>
              </div>
              <img src={''} alt={'New'}
                   id={`imageViewer${question.questionTypeCode}${index}`}/>
              {(!(multipleAnswerAnswers[index] && multipleAnswerAnswers[index].recording)
                  && (question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl)) &&
                <AudioDisplay src={question.answers[index].recordingFileUrl}
                              preload={'auto'} controls="controls"
                              className={styles.audioLeftQuestion}
                              isSmall={true} isOwner={question.isOwner}
                              deleteFunction={(event) => removeAnswerRecordingOpen(question.assessmentQuestionId, question.answers[index].recordingFileUploadId, index, 'multipleAnswer')}/>
              }
              {multipleAnswerAnswers[index] && multipleAnswerAnswers[index].recording &&
                <AudioDisplay
                  src={window.URL.createObjectURL(multipleAnswerAnswers[index].recording)}
                  preload={'auto'} controls="controls"
                  className={styles.audioLeftQuestion}
                  isSmall={true} isOwner={question.isOwner}
                  deleteFunction={(event) => removeAnswerRecordingOpen(question.assessmentQuestionId, multipleAnswerAnswers[index].fileUploadId, index, 'multipleAnswer')}/>
              }
              {question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].fileUrl &&
                <ImageDisplay linkText={''} url={question.answers[index].fileUrl}
                              isOwner={question.isOwner}
                              deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, question.answers[index].fileUploadId)}/>
              }
              <hr/>
            </div>
          )
        }
        for (let index = 0; index < displayEntries; index++) {
          linesToMatchRight.push(
            <div className={styles.muchLeft} key={index}>
              <InputTextArea
                label={`${alpha[index]}.`}
                value={question.toMatchText[index] || ''}
                onChange={(event) => handleMatchingToMatchText(event, index)}
                textareaClass={bigTextDisplay ? globalStyles.bigText : ''}
                inputClassName={bigTextDisplay ? globalStyles.bigText : ''}
                labelClass={bigTextDisplay ? globalStyles.bigText : ''}
                autoComplete={'dontdoit'}/>
              <div
                className={classes(styles.row, styles.includePicture, styles.moreLeft)}
                ref={(ref) => (this[`toMatchFile${index}`] = ref)}>
                <div className={styles.row}
                     onClick={() => handleFileUploadOpen(false, index, false, true)}>
                  <Icon pathName={'camera2'} premium={true}
                        className={styles.icon}/>
                  <div className={classes(globalStyles.link, styles.littleTop)}><L
                    p={p} t={`Picture`}/></div>
                </div>
                <div className={styles.row}
                     onClick={() => handleVoiceRecordingOpen(false, index, false, true)}>
                  <Icon pathName={'microphone'} premium={true}
                        className={styles.iconPosition}/>
                  <div className={classes(globalStyles.link, styles.littleTop)}><L
                    p={p} t={`Voice recording`}/></div>
                </div>
              </div>
              <img src={''} alt={'New'}
                   id={`imageViewerMatch${question.questionTypeCode}${index}`}/>
              {(!(multipleMatchingAnswers[index] && multipleMatchingAnswers[index].recording)
                  && (question && question.matches && question.matches.length > 0 && question.matches[index] && question.matches[index].recordingFileUrl)) &&
                <AudioDisplay src={question.matches[index].recordingFileUrl}
                              preload={'auto'} controls="controls"
                              className={styles.audioLeftQuestion}
                              isSmall={true} isOwner={question.isOwner}
                              deleteFunction={(event) => removeAnswerRecordingOpen(question.assessmentQuestionId, question.matches[index].recordingFileUploadId, index, 'multipleAnswer')}/>
              }
              {multipleMatchingAnswers[index] && multipleMatchingAnswers[index].recording &&
                <AudioDisplay
                  src={window.URL.createObjectURL(multipleMatchingAnswers[index].recording)}
                  preload={'auto'} controls="controls"
                  className={styles.audioLeftQuestion}
                  isSmall={true} isOwner={question.isOwner}
                  deleteFunction={(event) => removeAnswerRecordingOpen(question.assessmentQuestionId, multipleMatchingAnswers[index].fileUploadId, index, 'multipleAnswer')}/>
              }
              {question.matches && question.matches.length > 0 && question.matches[index] && question.matches[index].fileUrl &&
                <ImageDisplay linkText={''} url={question.matches[index].fileUrl}
                              isOwner={question.isOwner}
                              deleteFunction={() => removeToMatchFileOpen(question.assessmentQuestionId, question.matches[index].fileUploadId)}/>
              }
              <hr/>
            </div>
          )
        }
      } else if (viewMode === 'TeacherView') {
        for (let index = 0; index < question.correctAnswer.length; index++) {
          if (question.correctAnswer[index] !== '0') {
            linesToMatchLeft.push(
              <div key={index}>
                <div className={styles.row} key={index}>
                  <div className={styles.text}><L p={p} t={`Answer`}/></div>
                  <div
                    className={classes(styles.overSizeText, styles.littleLeft)}>{question.correctAnswer[index]}</div>
                  <div className={styles.overSizeText}>{index + 1 * 1}</div>
                  <div
                    className={styles.text}>{question.questionText[index]}</div>
                </div>
                {question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl &&
                  <AudioDisplay src={question.answers[index].recordingFileUrl}
                                preload={'auto'} controls="controls"
                                className={styles.audioLeftQuestion}
                                isSmall={true} isOwner={question.isOwner}
                                deleteFunction={(event) => removeAnswerRecordingOpen(question.assessmentQuestionId, question.answers[index].recordingFileUploadId, index, 'multipleAnswer')}/>
                }
                {question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].fileUrl &&
                  <ImageDisplay linkText={''}
                                url={question.answers[index].fileUrl}
                                isOwner={question.isOwner}
                                deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, question.answers[index].fileUploadId)}/>
                }
              </div>
            )
          }
        }
        for (let index = 0; index < question.correctAnswer.length; index++) {
          if (question.correctAnswer[index] !== '0') {
            linesToMatchRight.push(
              <div key={index}>
                <div className={styles.row} key={index}>
                  <div
                    className={classes(styles.overSizeText, styles.moreLeft)}>{alpha[index]}</div>
                  <div className={styles.text}>{question.toMatchText[index]}</div>
                </div>
                {question && question.matches && question.matches.length > 0 && question.matches[index] && question.matches[index].recordingFileUrl &&
                  <AudioDisplay src={question.matches[index].recordingFileUrl}
                                preload={'auto'} controls="controls"
                                className={styles.audioLeftQuestion}
                                isSmall={true} isOwner={question.isOwner}
                                deleteFunction={(event) => removeAnswerRecordingOpen(question.assessmentQuestionId, question.matching[index].recordingFileUploadId, index, 'multipleAnswer')}/>
                }
                {question.matches && question.matches.length > 0 && question.matches[index] && question.matches[index].fileUrl &&
                  <ImageDisplay linkText={''}
                                url={question.matches[index].fileUrl}
                                isOwner={question.isOwner}
                                deleteFunction={() => removeToMatchFileOpen(question.assessmentQuestionId, question.matches[index].fileUploadId)}/>
                }
              </div>
            )
          }
        }
      } else if (viewMode === 'StudentView') {
        for (let index = 0; index < question.correctAnswer.length; index++) {
          if (question.correctAnswer[index] !== '0') {
            linesToMatchLeft.push(
              <div key={index}>
                <div className={styles.row}>
                  <div>
                    <SelectSingleDropDown
                      label={<L p={p} t={`Answer`}/>}
                      value={(question.learnerAnswer && question.learnerAnswer.learnerAnswer && question.learnerAnswer.learnerAnswer.length > 0 && question.learnerAnswer.learnerAnswer[index]) || ''}
                      options={answerOptions}
                      height={bigTextDisplay ? 'bigtext' : ''}
                      className={classes(styles.moreBottomMargin, bigTextDisplay ? globalStyles.bigText : '')}
                      labelClass={bigTextDisplay ? globalStyles.bigText : ''}
                      selectClass={bigTextDisplay ? globalStyles.bigText : ''}
                      required={true}
                      whenFilled={question.learnerAnswer && question.learnerAnswer.learnerAnswer && question.learnerAnswer.learnerAnswer[index]}
                      onChange={(event) => handleLearnerAnswer(event, index)}/>
                  </div>
                  <div className={classes(styles.column, styles.moreTop)}>
                    <div
                      className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.overSizeText)}>{index + 1 * 1}</div>
                    <div
                      className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.text)}>{question.questionText[index]}</div>
                  </div>
                </div>
                {question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl &&
                  <AudioDisplay src={question.answers[index].recordingFileUrl}
                                preload={'auto'} controls="controls"
                                className={styles.audioLeftQuestion}
                                isSmall={true} isOwner={false}/>
                }
                {question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].fileUrl &&
                  <ImageDisplay linkText={''}
                                url={question.answers[index].fileUrl}/>
                }
              </div>
            )
          }
        }
        for (let index = 0; index < question.correctAnswer.length; index++) {
          if (question.correctAnswer[index] !== '0') {
            linesToMatchRight.push(
              <div className={styles.row} key={index}>
                <div
                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.overSizeText, styles.moreLeft)}>{alpha[index]}</div>
                <div
                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.text)}>{question.toMatchText[index]}</div>
                {question && question.matches && question.matches.length > 0 && question.matches[index] && question.matches[index].recordingFileUrl &&
                  <AudioDisplay src={question.matches[index].recordingFileUrl}
                                preload={'auto'} controls="controls"
                                className={styles.audioLeftQuestion}
                                isSmall={true} isOwner={false}/>
                }
                {question.matches && question.matches.length > 0 && question.matches[index] && question.matches[index].fileUrl &&
                  <ImageDisplay linkText={''}
                                url={question.matches[index].fileUrl}
                                isOwner={question.isOwner}
                                deleteFunction={() => removeToMatchFileOpen(question.assessmentQuestionId, question.matches[index].fileUploadId)}/>
                }
              </div>
            )
          }
        }
      } else if (viewMode === 'CorrectedView') {
        for (let index = 0; index < question.correctAnswer.length; index++) {
          let learnerAnswer = question.learnerAnswer && question.learnerAnswer.learnerAnswer && question.learnerAnswer.learnerAnswer[index]
          let correctAnswer = question.correctAnswer && question.correctAnswer[index]
          let isCorrect = learnerAnswer === correctAnswer
  
          if (question.correctAnswer[index] !== '0') {
            linesToMatch.push(
              <div className={styles.rowMatching} key={index}>
                <div>
                  <div className={classes(styles.column, styles.moreTop)}>
                    <div
                      className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.overSizeText)}>{index + 1 * 1}</div>
                    <div
                      className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.text)}>{question.questionText[index]}</div>
                  </div>
                  {question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl &&
                    <AudioDisplay src={question.answers[index].recordingFileUrl}
                                  preload={'auto'} controls="controls"
                                  className={styles.audioLeftQuestion}
                                  isSmall={true} isOwner={false}/>
                  }
                  {question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].fileUrl &&
                    <ImageDisplay linkText={''}
                                  url={question.answers[index].fileUrl}/>
                  }
                </div>
                <div className={isCorrect ? styles.moreRight : ''}>
                  <TextDisplay label={`Student`} text={
                    <div>
                      <div className={styles.row}>
                        <Icon pathName={isCorrect ? 'checkmark0' : 'cross_circle'}
                              fillColor={isCorrect ? 'green' : 'red'}
                              premium={true} className={styles.icon}/>
                        <div
                          className={classes((bigTextDisplay ? globalStyles.bigText : ''), (isCorrect ? styles.correctText : styles.wrongText))}>
                          {`${learnerAnswer}. ${question.toMatchText[alpha.indexOf(learnerAnswer)]}`}
                        </div>
                      </div>
                      {question && question.matches && question.matches.length > 0 && question.matches[alpha.indexOf(learnerAnswer)] && question.matches[alpha.indexOf(learnerAnswer)].recordingFileUrl &&
                        <AudioDisplay
                          src={question.matches[alpha.indexOf(learnerAnswer)].recordingFileUrl}
                          preload={'auto'} controls="controls"
                          className={styles.audioLeftQuestion}
                          isSmall={true} isOwner={false}/>
                      }
                      {question.matches && question.matches.length > 0 && question.matches[alpha.indexOf(learnerAnswer)] && question.matches[alpha.indexOf(learnerAnswer)].fileUrl &&
                        <ImageDisplay linkText={''}
                                      url={question.matches[alpha.indexOf(learnerAnswer)].fileUrl}/>
                      }
                    </div>
                  }/>
                </div>
                {!isCorrect &&
                  <div className={styles.correctPosition}>
                    <TextDisplay label={`Correct`} text={
                      <div>
                        <div
                          className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.correctText)}>
                          {`${correctAnswer}. ${question.toMatchText[alpha.indexOf(correctAnswer)]}`}
                        </div>
                        {question && question.matches && question.matches.length > 0 && question.matches[alpha.indexOf(correctAnswer)] && question.matches[alpha.indexOf(correctAnswer)].recordingFileUrl &&
                          <AudioDisplay
                            src={question.matches[alpha.indexOf(correctAnswer)].recordingFileUrl}
                            preload={'auto'} controls="controls"
                            className={styles.audioLeftQuestion}
                            isSmall={true} isOwner={false}/>
                        }
                        {question.matches && question.matches.length > 0 && question.matches[alpha.indexOf(correctAnswer)] && question.matches[alpha.indexOf(correctAnswer)].fileUrl &&
                          <ImageDisplay linkText={''}
                                        url={question.matches[alpha.indexOf(correctAnswer)].fileUrl}/>
                        }
                      </div>
                    }/>
                  </div>
                }
              </div>
            )
          }
        }
      }
  
      return (
        <div className={styles.container}>
          <QuestionLabel label={'Matching'}/>
          <div className={classes(styles.row, styles.questionLine)}>
            {correct && correct.assessmentLearnerAnswerId
              ? correct.isCorrect
                ? <Icon pathName={'checkmark0'} fillColor={'green'} premium={true}
                        className={styles.icon}/>
                : <Icon pathName={'cross_circle'} fillColor={'red'} premium={true}
                        className={styles.icon}/>
              : ''
            }
            <div className={styles.row}>
              {question.sequence && <div
                className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.sequence)}>{`${question.sequence || ''}. `}</div>}
              <div
                className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.sequence)}>Matching
              </div>
            </div>
          </div>
          {viewMode === 'AddOrUpdate' &&
            <div className={styles.moreLeft}>
              <SelectSingleDropDown
                label={<L p={p} t={`Number of questions`}/>}
                value={displayEntries}
                options={displayOptions}
                height={bigTextDisplay ? 'bigtext' : ''}
                className={classes(styles.moreBottomMargin, bigTextDisplay ? globalStyles.bigText : '')}
                labelClass={bigTextDisplay ? globalStyles.bigText : ''}
                selectClass={bigTextDisplay ? globalStyles.bigText : ''}
                onChange={handleAddMoreEntries}/>
            </div>
          }
          {viewMode !== 'AddOrUpdate' && accessRoles.facilitator &&
            <TextDisplay label={<L p={p} t={`Number of questions`}/>}
                         text={displayEntries}/>
          }
          <div
            className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.row, styles.moreLeft)}>
            {linesToMatch}
            {linesToMatchLeft && linesToMatchLeft.length > 0 &&
              <div className={classes(styles.moreBottom, styles.moreLeft)}>
                <div
                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.headerText, styles.muchMoreLeft)}>
                  <L p={p} t={`Questions:`}/>
                </div>
                <div>
                  {linesToMatchLeft}
                </div>
              </div>
            }
            {linesToMatchRight && linesToMatchRight.length > 0 &&
              <div
                className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.moreLeft)}>
                <div
                  className={classes((bigTextDisplay ? globalStyles.bigText : ''), styles.headerText)}>
                  <L p={p} t={`To Match:`}/>
                </div>
                <div>
                  {linesToMatchRight}
                </div>
              </div>
            }
          </div>
          {/*<div>
  
  												{m.recordingFileUrl &&
  														<AudioDisplay src={m.recordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftAnswer}
  																isSmall={true} isOwner={question.isOwner}
  																deleteFunction={() => removeAnswerRecordingOpen(question.assessmentQuestionId, m.recordingFileUploadId)} />
  												}
  												{m.fileUrl &&
  														<ImageDisplay url={m.fileUrl} alt={`Answer ${alpha[index]}`}
  																className={correct.isSubmitted
  																		? correct.correctAnswer === m.assessmentQuestionAnswerOptionId
  																				? styles.correctBorder
  																				: correct.isCorrect
  																						? ''
  																						: styles.wrongBorder
  																		: ''
  																}
  																isOwner={question.isOwner} deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, m.fileUploadId)} />
  												}
                      </div>
  								*/}
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
          {((question.solutionText && question.solutionText !== 'undefined' && question.solutionText !== 'EMPTY') || question.solutionFileUrl || question.solutionRecordingFileUrl) && (question.isOwner || (correct && correct.assessmentId)) && viewMode !== 'AddOrUpdate' &&
            <div className={classes(styles.muchLeft, styles.moreTop)}>
              <div>
                <div className={styles.row}>
                  <div className={styles.headerLabel}><L p={p} t={`Solution`}/>
                  </div>
                  {!(correct && correct.assessmentId) &&
                    <div className={globalStyles.instructions}><L p={p}
                                                                  t={`After the quiz is corrected, this explanation or picture will be displayed.`}/>
                    </div>
                  }
                </div>
                <div
                  className={styles.solutionText}>{question.solutionText && question.solutionText !== 'undefined' ? question.solutionText : ''}</div>
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
          {isShowingModal_removeLine &&
            <MessageModal handleClose={handleRemoveLineClose}
                          heading={<L p={p} t={`Remove this control line?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to remove this line of the matching assessment question?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveLine}/>
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
export default AssessmentMatching
