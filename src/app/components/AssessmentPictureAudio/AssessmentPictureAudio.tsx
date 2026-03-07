import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import axios from 'axios'
import * as styles from './AssessmentPictureAudio.css'
import * as globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import TextDisplay from '../TextDisplay'
import InputText from '../InputText'
import Checkbox from '../Checkbox'
import ImageDisplay from '../ImageDisplay'
import AudioDisplay from '../AudioDisplay'
import Icon from '../Icon'
import FileUploadModalWithCrop from '../FileUploadModalWithCrop'
import VoiceRecordingModal from '../VoiceRecordingModal'
import QuestionLabel from '../QuestionLabel'

const p = 'component'
import L from '../../components/PageLanguage'

function AssessmentPictureAudio(props) {
  const [selectedFile, setSelectedFile] = useState('')
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(false)
  const [isShowingVoiceRecording, setIsShowingVoiceRecording] = useState(false)
  const [entry, setEntry] = useState({
        essayResponse: '',
        score: '',
        isCorrect: '',
      })
  const [essayResponse, setEssayResponse] = useState('')
  const [score, setScore] = useState('')
  const [isCorrect, setIsCorrect] = useState('')
  const [errorScore, setErrorScore] = useState('')
  const [assessmentQuestionId, setAssessmentQuestionId] = useState('')
  const [record, setRecord] = useState(true)
  const [selectedRecording, setSelectedRecording] = useState(recordedBlob)

  useEffect(() => {
    
        const {accessRoles, assessmentCorrect, question} = props
        let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}
        if (assessmentCorrect !== assessmentCorrect) {
          setAssessmentCorrect(props.assessmentCorrect); setEntry({
              essayResponse: accessRoles.facilitator && assessmentCorrect ? assessmentCorrect.teacherEssayResponse : assessmentCorrect ? assessmentCorrect.learnerAnswer : '',
              score: correct && correct.score,
              isCorrect: correct && correct.isCorrect,
            })
        }
      
  }, [])

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
      } = props
      
      let correct = (assessmentCorrect && assessmentCorrect.length > 0 && assessmentCorrect.filter(m => m.assessmentQuestionId === question.assessmentQuestionId)[0]) || {}
  
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
                 ref={(ref) => (pictureFile = ref)}>
              <div className={globalStyles.instructionsBigger}><L p={p}
                                                                  t={`To answer this question, enter a `}/>
              </div>
              <div className={styles.row}
                   onClick={() => handleFileUploadOpen(question.assessmentQuestionId)}>
                <Icon pathName={'camera2'} premium={true}
                      className={styles.icon}/>
                <div
                  className={classes(globalStyles.link, styles.littleTop, styles.moreRight)}>
                  <L p={p} t={`Picture and / or`}/></div>
              </div>
              <div className={styles.row}
                   onClick={() => handleVoiceRecordingOpen(question.assessmentQuestionId)}>
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
          <img src={''} alt={'New'} ref={(ref) => (imageViewer = ref)}/>
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
                    onChange={handleChange}
                    numberOnly={true}
                    required={true}
                    whenFilled={assessmentCorrect && assessmentCorrect.score}/>
  
                  <div className={styles.checkbox}>
                    <Checkbox
                      id={'isCorrect'}
                      label={<L p={p} t={`Mark this answer as correct`}/>}
                      labelClass={styles.checkboxLabel}
                      checked={(correct && correct.isCorrect) || false}
                      onClick={toggleCheckbox}
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
            <FileUploadModalWithCrop handleClose={handleFileUploadClose}
                                     title={'Choose Picture'}
                                     personId={personId}
                                     submitFileUpload={handleFileUploadSubmit}
                                     file={selectedFile}
                                     handleInputFile={handleInputFile}
                                     acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp"}
                                     handleCancelFile={handleRemoveInputFile}/>
          }
          {isShowingVoiceRecording &&
            <VoiceRecordingModal handleClose={handleVoiceRecordingClose}
                                 title={<L p={p} t={`Assessment Question`}/>}
                                 label={<L p={p} t={`File for`}/>}
                                 personId={personId}
                                 record={record}
                                 submitFileUpload={handleVoiceRecordingSubmit}
                                 recordedBlob={selectedRecording}
                                 handleCancelFile={handleRemoveInputRecording}
                                 startRecording={startRecording}
                                 stopRecording={stopRecording}
                                 onStop={onStop}/>
          }
        </div>
      )
}
export default AssessmentPictureAudio
