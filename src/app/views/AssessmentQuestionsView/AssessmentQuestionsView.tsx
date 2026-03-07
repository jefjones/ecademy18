import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './AssessmentQuestionsView.css'

const p = 'AssessmentQuestionsView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import AssessmentItemModal from '../../components/AssessmentItemModal'
import TextDisplay from '../../components/TextDisplay'
import LinkDisplay from '../../components/LinkDisplay'
import TextareaModal from '../../components/TextareaModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Checkbox from '../../components/Checkbox'
import Icon from '../../components/Icon'
import classes from 'classnames'
import AssessmentTrueFalse from '../../components/AssessmentTrueFalse'
import AssessmentMultipleChoice
  from '../../components/AssessmentMultipleChoice'
import AssessmentMultipleAnswer
  from '../../components/AssessmentMultipleAnswer'
import AssessmentSingleEntry from '../../components/AssessmentSingleEntry'
import AssessmentFillBlank from '../../components/AssessmentFillBlank'
import AssessmentMatching from '../../components/AssessmentMatching'
import AssessmentEssay from '../../components/AssessmentEssay'
import AssessmentPassage from '../../components/AssessmentPassage'
import AssessmentPictureAudio from '../../components/AssessmentPictureAudio'
import StandardDisplay from '../../components/StandardDisplay'
import OneFJefFooter from '../../components/OneFJefFooter'
import {withAlert} from 'react-alert'
import ReactToPrint from "react-to-print"

function AssessmentQuestionsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_addOrUpdate, setIsShowingModal_addOrUpdate] = useState(false)
  const [isShowingModal_removeQuestion, setIsShowingModal_removeQuestion] = useState(false)
  const [isShowingModal_removeWebsiteLink, setIsShowingModal_removeWebsiteLink] = useState(false)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(false)
  const [isShowingModal_removeQuestionFile, setIsShowingModal_removeQuestionFile] = useState(false)
  const [isShowingModal_removeAnswerFile, setIsShowingModal_removeAnswerFile] = useState(false)
  const [isShowingModal_removeSolutionFile, setIsShowingModal_removeSolutionFile] = useState(false)
  const [isShowingModal_removeAnswerOption, setIsShowingModal_removeAnswerOption] = useState(false)
  const [isShowingModal_removeQuestionRecording, setIsShowingModal_removeQuestionRecording] = useState(false)
  const [isShowingModal_removeAnswerRecording, setIsShowingModal_removeAnswerRecording] = useState(false)
  const [isShowingModal_removeSolutionRecording, setIsShowingModal_removeSolutionRecording] = useState(false)
  const [isShowingModal_pointsError, setIsShowingModal_pointsError] = useState(false)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(false)
  const [isShowingModal_websiteLink, setIsShowingModal_websiteLink] = useState(false)
  const [assessmentQuestionId, setAssessmentQuestionId] = useState(undefined)
  const [isEditMode, setIsEditMode] = useState(undefined)
  const [deleted_fileUploadId, setDeleted_fileUploadId] = useState(undefined)
  const [deleted_recordingFileUploadId, setDeleted_recordingFileUploadId] = useState(undefined)
  const [isShowingModal_removeToMatchFile, setIsShowingModal_removeToMatchFile] = useState(undefined)
  const [answerIndex, setAnswerIndex] = useState(undefined)
  const [fileUploadId, setFileUploadId] = useState(undefined)
  const [multipleAnswerType, setMultipleAnswerType] = useState(undefined)
  const [replacedTotalPoints, setReplacedTotalPoints] = useState(undefined)
  const [subTotalPoints, setSubTotalPoints] = useState(undefined)
  const [isShowingModal_cannotChange, setIsShowingModal_cannotChange] = useState(undefined)

  const handleFileUploadOpen = (assessmentQuestionId) => {
    return setIsShowingFileUpload(true); setAssessmentQuestionId(assessmentQuestionId)

  }
  const handleFileUploadClose = () => {
    return setIsShowingFileUpload(false)

  }
  const handleSubmitFile = () => {
    
        const {
          assessmentQuestionsInit,
          personId,
          assessmentId,
          assignmentId
        } = props
        assessmentQuestionsInit(personId, personId, assessmentId, assignmentId)
        handleFileUploadClose()
      
  }

  const recallAfterFileUpload = () => {
    
        const {
          assessmentQuestionsInit,
          personId,
          assessmentId,
          assignmentId
        } = props
        assessmentQuestionsInit(personId, personId, assessmentId, assignmentId)
      
  }

  const handleAddOrUpdateQuestionOpen = (assessmentQuestionId, isEditMode = false) => {
    return setIsShowingModal_addOrUpdate(true); setAssessmentQuestionId(assessmentQuestionId); setIsEditMode(isEditMode)
  }

  const handleAddOrUpdateQuestionClose = () => {
    return setIsShowingModal_addOrUpdate(false); setIsEditMode(false)

  }
  const handleAddOrUpdateQuestionSave = (assessmentQuestion) => {
    
        const {
          addOrUpdateAssessmentItem,
          addOrUpdateAssessmentItemMatching,
          personId,
          assessmentId
        } = props
        if (assessmentQuestion.questionTypeCode === 'MATCHING') {
          addOrUpdateAssessmentItemMatching(personId, assessmentId, assessmentQuestion)
        } else {
          addOrUpdateAssessmentItem(personId, assessmentId, assessmentQuestion)
        }
      
  }

  const handleRemoveQuestionOpen = (assessmentQuestionId) => {
    return setIsShowingModal_removeQuestion(true); setAssessmentQuestionId(assessmentQuestionId)

  }
  const handleRemoveQuestionClose = () => {
    return setIsShowingModal_removeQuestion(false)

  }
  const handleRemoveQuestion = () => {
    
        const {removeAssessmentQuestion, personId, assessmentId} = props
        
        removeAssessmentQuestion(personId, assessmentId, assessmentQuestionId)
        handleRemoveQuestionClose()
      
  }

  const handleRemoveWebsiteLinkOpen = (assessmentQuestionId, websiteLink) => {
    return setIsShowingModal_removeWebsiteLink(true); setAssessmentQuestionId(assessmentQuestionId); setWebsiteLink(websiteLink)

  }
  const handleRemoveWebsiteLinkClose = () => {
    return setIsShowingModal_removeWebsiteLink(false)

  }
  const handleRemoveWebsiteLink = () => {
    
        const {removeAssessmentQuestionWebsiteLink, personId} = props
        
        removeAssessmentQuestionWebsiteLink(personId, assessmentQuestionId, websiteLink)
        handleRemoveWebsiteLinkClose()
      
  }

  const handleRemoveFileUploadOpen = (assessmentQuestionId, fileUploadId) => {
    return setIsShowingModal_removeFileUpload(true); setAssessmentQuestionId(assessmentQuestionId); setFileUploadId(fileUploadId)

  }
  const handleRemoveFileUploadClose = () => {
    return setIsShowingModal_removeFileUpload(false)

  }
  const handleRemoveFileUpload = () => {
    
        const {removeAssessmentQuestionFileUpload, personId} = props
        
        removeAssessmentQuestionFileUpload(personId, assessmentQuestionId, fileUploadId)
        handleRemoveFileUploadClose()
      
  }

  const handleRemoveQuestionFileOpen = (assessmentQuestionId, fileUploadId) => {
    return setIsShowingModal_removeQuestionFile(true); setAssessmentQuestionId(assessmentQuestionId); setFileUploadId(fileUploadId)

  }
  const handleRemoveQuestionFileClose = () => {
    return setIsShowingModal_removeQuestionFile(false)

  }
  const handleRemoveQuestionFile = () => {
    
        const {removeAssessmentQuestionQuestionFile, personId} = props
        
        removeAssessmentQuestionQuestionFile(personId, assessmentQuestionId, fileUploadId)
        handleRemoveQuestionFileClose()
        setDeleted_fileUploadId(fileUploadId)
      
  }

  const handleRemoveQuestionRecordingOpen = (event, assessmentQuestionId, recordingFileUploadId) => {
    
        if (event) {
          event.preventDefault()
          event.stopPropagation()
        }
        setIsShowingModal_removeQuestionRecording(true); setAssessmentQuestionId(assessmentQuestionId); setRecordingFileUploadId(recordingFileUploadId)
      
  }

  const handleRemoveQuestionRecordingClose = () => {
    return setIsShowingModal_removeQuestionRecording(false)

  }
  const handleRemoveQuestionRecording = () => {
    
        const {removeAssessmentQuestionQuestionRecording, personId} = props
        
        removeAssessmentQuestionQuestionRecording(personId, assessmentQuestionId, recordingFileUploadId)
        handleRemoveQuestionRecordingClose()
        setDeleted_recordingFileUploadId(recordingFileUploadId)
      
  }

  const handleRemoveAnswerFileOpen = (assessmentQuestionId, fileUploadId) => {
    return setIsShowingModal_removeAnswerFile(true); setAssessmentQuestionId(assessmentQuestionId); setFileUploadId(fileUploadId)

  }
  const handleRemoveAnswerFileClose = () => {
    return setIsShowingModal_removeAnswerFile(false)

  }
  const handleRemoveAnswerFile = () => {
    
        const {removeAssessmentQuestionAnswerFile, personId} = props
        
        removeAssessmentQuestionAnswerFile(personId, assessmentQuestionId, fileUploadId)
        handleRemoveAnswerFileClose()
        setDeleted_fileUploadId(fileUploadId)
      
  }

  const handleRemoveToMatchFileOpen = (assessmentQuestionId, fileUploadId) => {
    return setIsShowingModal_removeToMatchFile(true); setAssessmentQuestionId(assessmentQuestionId); setFileUploadId(fileUploadId)

  }
  const handleRemoveToMatchFileClose = () => {
    return setIsShowingModal_removeToMatchFile(false)

  }
  const handleRemoveToMatchFile = () => {
    
        const {removeAssessmentQuestionToMatchFile, personId} = props
        
        removeAssessmentQuestionToMatchFile(personId, assessmentQuestionId, fileUploadId)
        handleRemoveToMatchFileClose()
        setDeleted_fileUploadId(fileUploadId)
      
  }

  const handleRemoveAnswerOptionOpen = (assessmentQuestionId, answerIndex) => {
    return setIsShowingModal_removeAnswerOption(true); setAssessmentQuestionId(assessmentQuestionId); setAnswerIndex(answerIndex)

  }
  const handleRemoveAnswerOptionClose = () => {
    return setIsShowingModal_removeAnswerOption(false); setAssessmentQuestionId(''); setAnswerIndex('')

  }
  const handleRemoveAnswerOption = () => {
    
        const {removeAssessmentQuestionAnswerOption, personId} = props
        
        removeAssessmentQuestionAnswerOption(personId, assessmentQuestionId, answerIndex); //, () => handleAddOrUpdateQuestionOpen(assessmentQuestionId, true)
        handleRemoveAnswerOptionClose()
        handleAddOrUpdateQuestionClose()
      
  }

  const handleRemoveAnswerRecordingOpen = (assessmentQuestionId, fileUploadId, answerIndex, multipleAnswerType) => {
    return setIsShowingModal_removeAnswerRecording(true); setAssessmentQuestionId(assessmentQuestionId); setFileUploadId(fileUploadId); setAnswerIndex(answerIndex); setMultipleAnswerType(multipleAnswerType)

  }
  const handleRemoveAnswerRecordingClose = () => {
    return setIsShowingModal_removeAnswerRecording(false); setAnswerIndex(''); setMultipleAnswerType('')

  }
  const handleRemoveAnswerRecording = () => {
    
        const {removeAssessmentQuestionAnswerRecording, personId} = props
        
        removeAssessmentQuestionAnswerRecording(personId, assessmentQuestionId, fileUploadId)
        handleRemoveAnswerRecordingClose()
        setDeleted_fileUploadId(fileUploadId)
      
  }

  const handleRemoveSolutionFileOpen = (assessmentQuestionId, fileUploadId) => {
    return setIsShowingModal_removeSolutionFile(true); setAssessmentQuestionId(assessmentQuestionId); setFileUploadId(fileUploadId)

  }
  const handleRemoveSolutionFileClose = () => {
    return setIsShowingModal_removeSolutionFile(false)

  }
  const handleRemoveSolutionFile = () => {
    
        const {removeAssessmentQuestionSolutionFile, personId} = props
        
        removeAssessmentQuestionSolutionFile(personId, assessmentQuestionId, fileUploadId)
        handleRemoveSolutionFileClose()
        setDeleted_fileUploadId(fileUploadId)
      
  }

  const handleRemoveSolutionRecordingOpen = (assessmentQuestionId, fileUploadId) => {
    return setIsShowingModal_removeSolutionRecording(true); setAssessmentQuestionId(assessmentQuestionId); setFileUploadId(fileUploadId)

  }
  const handleRemoveSolutionRecordingClose = () => {
    return setIsShowingModal_removeSolutionRecording(false)

  }
  const handleRemoveSolutionRecording = () => {
    
        const {removeAssessmentQuestionSolutionRecording, personId} = props
        
        removeAssessmentQuestionSolutionRecording(personId, assessmentQuestionId, fileUploadId)
        handleRemoveSolutionRecordingClose()
        setDeleted_fileUploadId(fileUploadId)
      
  }

  const handleWebsiteLinkOpen = (assessmentQuestionId) => {
    return setIsShowingModal_websiteLink(true); setAssessmentQuestionId(assessmentQuestionId)

  }
  const handleWebsiteLinkClose = () => {
    return setIsShowingModal_websiteLink(false)

  }
  const handleWebsiteLinkSave = (websiteLink) => {
    
        const {saveAssessmentQuestionWebsiteLink, personId} = props
        
        saveAssessmentQuestionWebsiteLink(personId, assessmentQuestionId, websiteLink)
        handleWebsiteLinkClose()
      
  }

  const handlePointsErrorClose = () => {
    
        const {personId, togglePublishedAssessment, assessment} = props
        setIsShowingModal_pointsError(false)
        togglePublishedAssessment(personId, assessment.assessmentId)
      
  }

  const handlePointsErrorSave = () => {
    
        const {
          updateAssessmentTotalPoints,
          personId,
          assessmentId,
          togglePublishedAssessment,
          assessment
        } = props
        
        handlePointsErrorClose()
        updateAssessmentTotalPoints(personId, assessmentId, subTotalPoints)
        togglePublishedAssessment(personId, assessment.assessmentId)
        setReplacedTotalPoints(subTotalPoints)
      
  }

  const reorderSequence = (assessmentQuestionId, event) => {
    
        const {reorderAssessmentQuestions, personId} = props
        reorderAssessmentQuestions(personId, assessmentQuestionId, event.target.value)
      
  }

  const handlePublish = () => {
    
        const {
          togglePublishedAssessment,
          personId,
          assessment,
          assessmentQuestions
        } = props
        let pointsIntended = assessment && assessment.totalPoints
        let subTotalPoints = (assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.reduce((acc, m) => acc += m.pointsPossible, 0)) || 0
        if (pointsIntended !== subTotalPoints && (!assessment || !assessment.isPublished)) {
          let subTotalPoints = (assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.reduce((acc, m) => acc += m.pointsPossible, 0)) || 0
          setIsShowingModal_pointsError(true); setSubTotalPoints(subTotalPoints)
        }
        togglePublishedAssessment(personId, assessment.assessmentId)
      
  }

  const showViewOnlyMessage = () => {
    
        props.alert.info(<div className={globalStyles.alertText}><L p={p}
                                                                         t={`The controls are for view only to show the correct answers`}/>
        </div>)
      
  }

  const handleCannotChangeOpen = () => {
    return setIsShowingModal_cannotChange(true)
    

  }
  const handleCannotChangeClose = () => {
    return setIsShowingModal_cannotChange(false)
    

  }
  const toggleCheckbox = (field, event) => {
    
        const {
          updateAssessmentSettings,
          personId,
          assessmentId,
          assessment
        } = props
        updateAssessmentSettings(personId, assessmentId, field, !assessment[field])
      
  }

  const handleChange = (event) => {
    
        const {updateAssessmentSettings, personId, assessmentId} = props
        updateAssessmentSettings(personId, assessmentId, event.target.name, event.target.value)
      
  }

  const {
        personId,
        assessment = {},
        questionTypes,
        assessmentQuestions,
        assessmentId,
        companyConfig = {},
        accessRoles = {},
        sequences,
        courseEntryName,
        removeAssessmentQuestionQuestionRecording,
        removeAssessmentQuestionAnswerRecording,
        standards,
        removeAssessmentQuestionSolutionRecording,
        retakeOptions,
        benchmarkTestId,
        gradingType
      } = props
      
  
      let assessmentItem = assessmentQuestionId
        ? assessmentQuestions && assessmentQuestions.length > 0
          ? assessmentQuestions.filter(m => m.assessmentQuestionId === assessmentQuestionId)[0]
          : {}
        : {}
      return (
        <div className={styles.container}>
          <div className={globalStyles.pageTitle}>
            <L p={p} t={`Assessment Questions`}/>
          </div>
          <div className={classes(styles.moreTop, styles.rowWrap)}>
            {courseEntryName &&
              <TextDisplay label={`Course`} text={courseEntryName}
                           clickFunction={() => goBack()}/>}
            <TextDisplay
              label={benchmarkTestId ? <L p={p} t={`Benchmark assessment`}/> :
                <L p={p} t={`Assessment`}/>}
              text={assessment && assessment.name}/>
            <TextDisplay label={<L p={p} t={`Points intended`}/>}
                         text={replacedTotalPoints || (assessment && assessment.totalPoints)}/>
            <TextDisplay label={<L p={p} t={`Points sub total`}/>}
                         text={assessmentQuestions.reduce((acc, m) => acc += m.pointsPossible, 0)}/>
            <div className={styles.printPosition}>
              <ReactToPrint trigger={() => <a href="#"
                                              className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon
                pathName={'printer'} premium={true} className={styles.icon}/><L
                p={p} t={`Print`}/></a>} content={() => componentRef}/>
            </div>
          </div>
          <div className={classes(styles.moreTop, styles.rowWrap)}>
            <Checkbox
              id={'bigTextDisplay'}
              name={'bigTextDisplay'}
              label={<L p={p} t={`Big text display`}/>}
              labelClass={styles.checkboxLabel}
              checked={assessment.bigTextDisplay || false}
              onClick={(event) => toggleCheckbox('bigTextDisplay', event)}
              className={styles.checkbox}/>
            <Checkbox
              id={'oneAtAtimeView'}
              name={'oneAtAtimeView'}
              label={<L p={p} t={`One question at a time`}/>}
              labelClass={styles.checkboxLabel}
              checked={assessment.oneAtAtimeView || false}
              onClick={(event) => toggleCheckbox('oneAtAtimeView', event)}
              className={styles.checkbox}/>
            <Checkbox
              id={'doNotShowAnswersImmediately'}
              name={'doNotShowAnswersImmediately'}
              label={<L p={p}
                        t={`Do not show answers immediately after correction`}/>}
              labelClass={styles.checkboxLabel}
              checked={assessment.doNotShowAnswersImmediately || false}
              onClick={(event) => toggleCheckbox('doNotShowAnswersImmediately', event)}
              className={styles.checkbox}/>
            <Checkbox
              id={'forceAllAnswers'}
              name={'forceAllAnswers'}
              label={<L p={p} t={`Student must answer all questions`}/>}
              labelClass={styles.checkboxLabel}
              checked={assessment.forceAllAnswers || false}
              onClick={(event) => toggleCheckbox('forceAllAnswers', event)}
              className={styles.checkbox}/>
  
            <div className={styles.littleLeft}>
              <SelectSingleDropDown
                id={`retakeCount`}
                name={`retakeCount`}
                label={<L p={p} t={`Re-take attempts`}/>}
                value={assessment.retakeCount || ''}
                options={retakeOptions || []}
                className={styles.moreBottomMargin}
                noBlank={true}
                height={`medium`}
                onChange={handleChange}/>
            </div>
          </div>
          <div className={styles.row}>
            <ButtonWithIcon icon={'earth'} label={assessment.isPublished ?
              <L p={p} t={`Unpublish`}/> : <L p={p} t={`Publish`}/>}
                            changeRed={assessment.isPublished}
                            onClick={handlePublish}
                            disabled={!assessmentQuestions || !assessmentQuestions.length}/>
            <div className={styles.muchLeft}>
              <Checkbox
                id={'doNotShowAnswersImmediately'}
                name={'doNotShowAnswersImmediately'}
                label={<L p={p}
                          t={`Hide answers until I say`}/>} //This is the same checkbox as the "Do not show" but it is an interface trick to be sur that the teacher understands that they can turn this on and off ... but just like the student it not allowed to see answers after they finish the test, this is the same value that doesn't allow the student to see the answers until the teacher wants them to see it on the assessment correct view.
                labelClass={styles.checkboxLabel}
                checked={assessment.doNotShowAnswersImmediately || false}
                onClick={(event) => toggleCheckbox('doNotShowAnswersImmediately', event)}
                className={styles.checkbox}/>
            </div>
          </div>
          <hr/>
          {(accessRoles.admin || accessRoles.facilitator) &&
            <a
              onClick={assessment.isPublished ? handleCannotChangeOpen : handleAddOrUpdateQuestionOpen}
              className={classes(styles.row, styles.addNew)}>
              <Icon pathName={'plus'}
                    className={classes(styles.icon, (assessment.isPublished ? styles.lowOpacity : ''))}
                    fillColor={'green'}/>
              <span
                className={classes(styles.addAnother, (assessment.isPublished ? styles.lowOpacity : ''))}><L
                p={p} t={`Add Another Question`}/></span>
            </a>
          }
          <div ref={el => (componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
            {assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.map((m, i) => {
              if (m.questionTypeCode === 'TRUEFALSE') {
                return (
                  <div key={i}>
                    <AssessmentTrueFalse nameKey={i} question={m}
                                         personId={personId}
                                         initialValue={m.correctAnswer}
                                         removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                         onClick={showViewOnlyMessage}
                                         removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                         removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}
                                         removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}/>
                    <div className={classes(styles.moreLeft, styles.moreTop)}>
                      {m.websiteLinks.length > 0 &&
                        <div>
                          <hr/>
                          <span className={styles.label}>{<L p={p}
                                                             t={`Website Link`}/>}</span>
                          {m.websiteLinks.map((w, i) =>
                            <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                         deleteFunction={handleRemoveWebsiteLinkOpen}
                                         deleteId={m.assessmentQuestionId}/>
                          )}
                          <hr/>
                        </div>
                      }
                    </div>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'MULTIPLECHOICE') {
                return (
                  <div key={i}>
                    <AssessmentMultipleChoice nameKey={i} question={m}
                                              onClick={showViewOnlyMessage}
                                              isOwner={m.isOwner}
                                              removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                              removeAnswerFileOpen={handleRemoveAnswerFileOpen}
                                              removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                              removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}
                                              removeAnswerRecordingOpen={handleRemoveAnswerRecordingOpen}
                                              removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}
                                              removeWebsiteLinkOpen={handleRemoveWebsiteLinkOpen}/>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'MULTIPLEANSWER') {
                return (
                  <div key={i}>
                    <AssessmentMultipleAnswer nameKey={i}
                                              isOwnerSetup={showViewOnlyMessage}
                                              isSetupList={true} question={m}
                                              removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                              removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                              removeAnswerFileOpen={handleRemoveAnswerFileOpen}
                                              removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}
                                              removeAnswerRecordingOpen={handleRemoveAnswerRecordingOpen}
                                              removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}
                                              removeWebsiteLinkOpen={handleRemoveWebsiteLinkOpen}/>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'ESSAY') {
                return (
                  <div key={i}>
                    <AssessmentEssay nameKey={i} question={m}
                                     keywords={m.keywordPhrases}
                                     accessRoles={accessRoles}
                                     removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                     removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                     removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}
                                     removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}/>
                    <div className={styles.littleLeft}>
                      <div className={styles.instructions}>
                        {m.keywordPhrases && m.keywordPhrases.length > 0
                          ? m.keywordCountAccuracy
                            ? `These keywords and/or phrases are used for automated scoring.`
                            : `These keywords and/or phrases may be used for reference, but automated scoring will not occur without setting the keyword accuracy count.`
                          : `Automated scoring will not occur because keywords and/or phrases are not set.`
                        }
                      </div>
                      <div className={styles.rowWrap}>
                        {!(accessRoles.observer || accessRoles.learner) &&
                          <TextDisplay
                            label={<L p={p} t={`Keywords or phrases`}/>}
                            text={m.keywordPhrases && m.keywordPhrases.length > 0
                              ? m.keywordPhrases.map((keywordPhrase, i) =>
                                <div key={i}
                                     className={classes(styles.labelBold, styles.littleLeft)}>{keywordPhrase}</div>)
                              : <div key={i}
                                     className={classes(styles.labelItalicsGray, styles.littleLeft)}>
                                <L p={p} t={`none`}/></div>
                            }
                          />
                        }
  
                        {!(accessRoles.observer || accessRoles.learner) &&
                          <TextDisplay
                            label={<L p={p} t={`Keyword accuracy count`}/>}
                            text={m.keywordCountAccuracy === 0 || !!m.keywordCountAccuracy
                              ? m.keywordCountAccuracy
                              : <div key={i}
                                     className={classes(styles.labelItalicsGray, styles.littleLeft)}>{'n/a'}</div>
                            }
                          />
                        }
                      </div>
                      <div className={classes(styles.moreLeft, styles.moretop)}>
                        {m.websiteLinks.length > 0 &&
                          <div>
                            <hr/>
                            <span className={styles.label}>{<L p={p}
                                                               t={`Website Link`}/>}</span>
                            {m.websiteLinks.map((w, i) =>
                              <LinkDisplay key={i} linkText={w}
                                           isWebsiteLink={true}
                                           deleteFunction={handleRemoveWebsiteLinkOpen}
                                           deleteId={m.assessmentQuestionId}/>
                            )}
                            <hr/>
                          </div>
                        }
                      </div>
                    </div>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'SINGLEENTRY') {
                return (
                  <div key={i}>
                    <AssessmentSingleEntry nameKey={i} question={m}
                                           answerVariations={m.answerVariations}
                                           accessRoles={accessRoles}
                                           removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                           removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                           removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}
                                           removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}/>
                    <div className={classes(styles.muchLeft, styles.moreTop)}>
                      {m.websiteLinks.length > 0 &&
                        <div>
                          <hr/>
                          <span className={styles.label}>{<L p={p}
                                                             t={`Website Link`}/>}</span>
                          {m.websiteLinks.map((w, i) =>
                            <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                         deleteFunction={handleRemoveWebsiteLinkOpen}
                                         deleteId={m.assessmentQuestionId}/>
                          )}
                          <hr/>
                        </div>
                      }
                    </div>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'FILLBLANK') {
                return (
                  <div key={i}>
                    <AssessmentFillBlank nameKey={i} question={m}
                                         answerVariations={m.answerVariations}
                                         accessRoles={accessRoles}
                                         removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                         removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                         removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}
                                         removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}/>
                    <div className={classes(styles.muchLeft, styles.moreTop)}>
                      {m.websiteLinks.length > 0 &&
                        <div>
                          <hr/>
                          <span className={styles.label}>{<L p={p}
                                                             t={`Website Link`}/>}</span>
                          {m.websiteLinks.map((w, i) =>
                            <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                         deleteFunction={handleRemoveWebsiteLinkOpen}
                                         deleteId={m.assessmentQuestionId}/>
                          )}
                          <hr/>
                        </div>
                      }
                    </div>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'MATCHING') {
                return (
                  <div key={i}>
                    <AssessmentMatching nameKey={i} viewMode={'TeacherView'}
                                        question={m} accessRoles={accessRoles}
                                        removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                        removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                        removeAnswerFileOpen={handleRemoveAnswerFileOpen}
                                        removeToMatchFileOpen={handleRemoveToMatchFileOpen}
                                        removeAnswerRecordingOpen={handleRemoveAnswerRecordingOpen}
                                        removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}
                                        removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}/>
                    <div className={classes(styles.muchLeft, styles.moreTop)}>
                      {m.websiteLinks.length > 0 &&
                        <div>
                          <hr/>
                          <span className={styles.label}>{<L p={p}
                                                             t={`Website Link`}/>}</span>
                          {m.websiteLinks.map((w, i) =>
                            <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                         deleteFunction={handleRemoveWebsiteLinkOpen}
                                         deleteId={m.assessmentQuestionId}/>
                          )}
                          <hr/>
                        </div>
                      }
                    </div>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'PICTUREORAUDIO') {
                return (
                  <div key={i}>
                    <AssessmentPictureAudio nameKey={i} question={m}
                                            keywords={m.answerVariations}
                                            accessRoles={accessRoles}
                                            removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                            removeSolutionFileOpen={handleRemoveSolutionFileOpen}
                                            removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}
                                            removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}/>
                    <div className={classes(styles.muchLeft, styles.moreTop)}>
                      <div className={styles.instructions}>
                        <L p={p}
                           t={`The student can respond with a picture, an audio recording or both.`}/>
                      </div>
                      {m.websiteLinks.length > 0 &&
                        <div>
                          <hr/>
                          <span className={styles.label}>{<L p={p}
                                                             t={`Website Link`}/>}</span>
                          {m.websiteLinks.map((w, i) =>
                            <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                         deleteFunction={handleRemoveWebsiteLinkOpen}
                                         deleteId={m.assessmentQuestionId}/>
                          )}
                          <hr/>
                        </div>
                      }
                    </div>
                    <StandardDisplay standards={m.standards}/>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <div className={styles.littleRight}>
                          <TextDisplay text={m.pointsPossible}
                                       label={<L p={p} t={`Points`}/>}/>
                        </div>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              } else if (m.questionTypeCode === 'PASSAGE') {
                return (
                  <div key={i}>
                    <AssessmentPassage nameKey={i} question={m}
                                       isOwner={m.isOwner}
                                       removeQuestionFileOpen={handleRemoveQuestionFileOpen}
                                       removeQuestionRecordingOpen={handleRemoveQuestionRecordingOpen}/>
                    <div className={classes(styles.muchLeft, styles.moreTop)}>
                      {m.websiteLinks.length > 0 &&
                        <div>
                          <hr/>
                          <span className={styles.label}>{<L p={p}
                                                             t={`Website Link`}/>}</span>
                          {m.websiteLinks.map((w, i) =>
                            <LinkDisplay key={i} linkText={w} isWebsiteLink={true}
                                         deleteFunction={handleRemoveWebsiteLinkOpen}
                                         deleteId={m.assessmentQuestionId}/>
                          )}
                          <hr/>
                        </div>
                      }
                    </div>
                    {(accessRoles.admin || accessRoles.facilitator) &&
                      <div className={classes(styles.row, styles.linkRow)}>
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleRemoveQuestionOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`remove`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleAddOrUpdateQuestionOpen(m.assessmentQuestionId, true)}
                          className={styles.link}><L p={p} t={`edit`}/></a> |
                        <a
                          onClick={assessment.isPublished ? handleCannotChangeOpen : () => handleWebsiteLinkOpen(m.assessmentQuestionId)}
                          className={styles.link}><L p={p} t={`add link`}/></a> |
                        {!assessment.isPublished &&
                          <div>
                            <SelectSingleDropDown
                              id={m.assessmentQuestionId}
                              name={m.assessmentQuestionId}
                              label={<L p={p} t={`Sequence`}/>}
                              labelLeft={true}
                              value={m.sequence}
                              noBlank={true}
                              options={sequences}
                              className={styles.dropdown}
                              onChange={(event) => reorderSequence(m.assessmentQuestionId, event)}/>
                          </div>
                        }
                      </div>
                    }
                  </div>
                )
              }
              return null
            })}
          </div>
          <hr className={styles.hrHeight}/>
          {(accessRoles.admin || accessRoles.facilitator) && assessmentQuestions && assessmentQuestions.length >= 4 &&
            <a onClick={handleAddOrUpdateQuestionOpen}
               className={classes(styles.row, styles.addNew)}>
              <Icon pathName={'plus'} className={styles.icon}
                    fillColor={'green'}/>
              <span className={styles.addAnother}><L p={p} t={`Add Another Question`}/></span>
            </a>
          }
          {isShowingModal_addOrUpdate &&
            <AssessmentItemModal handleClose={handleAddOrUpdateQuestionClose}
                                 showTitle={true}
                                 handleSubmit={handleAddOrUpdateQuestionSave}
                                 questionTypes={questionTypes}
                                 assessment={assessment}
                                 assessmentItem={assessmentItem}
                                 standards={standards} gradingType={gradingType}
                                 personId={personId} assessmentId={assessmentId}
                                 assessmentQuestionId={assessmentQuestionId}
                                 companyConfig={companyConfig}
                                 handleRemoveFileOpen={handleRemoveQuestionFileOpen}
                                 deleted_fileUploadId={deleted_fileUploadId}
                                 accessRoles={accessRoles}
                                 handleRemoveSolutionFileOpen={handleRemoveSolutionFileOpen}
                                 removeAnswerOption={handleRemoveAnswerOptionOpen}
                                 removeAnswerFileOpen={handleRemoveAnswerFileOpen}
                                 removeAssessmentQuestionQuestionRecording={removeAssessmentQuestionQuestionRecording}
                                 removeAssessmentQuestionAnswerRecording={removeAssessmentQuestionAnswerRecording}
                                 removeAssessmentQuestionSolutionRecording={removeAssessmentQuestionSolutionRecording}/>
          }
          {isShowingModal_removeQuestion &&
            <MessageModal handleClose={handleRemoveQuestionClose}
                          heading={<L p={p}
                                      t={`Remove this question from this assessment content?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this question from this assessment content?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveQuestion}/>
          }
          {isShowingModal_removeWebsiteLink &&
            <MessageModal handleClose={handleRemoveWebsiteLinkClose}
                          heading={<L p={p} t={`Remove this website link?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this website link?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveWebsiteLink}/>
          }
          {isShowingModal_removeFileUpload &&
            <MessageModal handleClose={handleRemoveFileUploadClose}
                          heading={<L p={p} t={`Remove this file upload?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this file upload?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveFileUpload}/>
          }
          {isShowingModal_removeQuestionFile &&
            <MessageModal handleClose={handleRemoveQuestionFileClose}
                          heading={<L p={p} t={`Remove this question picture?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this question picture?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveQuestionFile}/>
          }
          {isShowingModal_removeQuestionRecording &&
            <MessageModal handleClose={handleRemoveQuestionRecordingClose}
                          heading={<L p={p}
                                      t={`Remove this question recording?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this question recording?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveQuestionRecording}/>
          }
          {isShowingModal_removeAnswerOption &&
            <MessageModal handleClose={handleRemoveAnswerOptionClose}
                          heading={<L p={p} t={`Remove this answer option?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this answer option?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveAnswerOption}/>
          }
          {isShowingModal_removeAnswerFile &&
            <MessageModal handleClose={handleRemoveAnswerFileClose}
                          heading={<L p={p} t={`Remove this answer picture?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this answer picture?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveAnswerFile}/>
          }
          {isShowingModal_removeToMatchFile &&
            <MessageModal handleClose={handleRemoveToMatchFileClose}
                          heading={<L p={p} t={`Remove this matching picture?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this matching picture?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveToMatchFile}/>
          }
          {isShowingModal_removeAnswerRecording &&
            <MessageModal handleClose={handleRemoveAnswerRecordingClose}
                          heading={<L p={p} t={`Remove this answer recording?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this answer recording?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveAnswerRecording}/>
          }
          {isShowingModal_removeSolutionFile &&
            <MessageModal handleClose={handleRemoveSolutionFileClose}
                          heading={<L p={p} t={`Remove this solution picture?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this solution picture?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveSolutionFile}/>
          }
          {isShowingModal_removeSolutionRecording &&
            <MessageModal handleClose={handleRemoveSolutionRecordingClose}
                          heading={<L p={p}
                                      t={`Remove this solution recording?`}/>}
                          explainJSX={<L p={p}
                                         t={`Are you sure you want to delete this solution recording?`}/>}
                          isConfirmType={true}
                          onClick={handleRemoveSolutionRecording}/>
          }
          {isShowingModal_pointsError &&
            <MessageModal handleClose={handlePointsErrorClose}
                          heading={<L p={p} t={`Points intended do not match!`}/>}
                          explainJSX={<L p={p}
                                         t={`The points intended for this quiz do not match the total points entered for the assessment questions. Do you want to reset the total points possible to ${subTotalPoints}?`}/>}
                          isConfirmType={true}
                          onClick={handlePointsErrorSave}/>
          }
          {isShowingModal_cannotChange &&
            <MessageModal handleClose={handleCannotChangeClose}
                          heading={<L p={p} t={`Cannot Change Assignment`}/>}
                          explainJSX={<L p={p}
                                         t={`This assessment is published.  In order to make a change to this assessment, you can choose to unpublish the assessment in order to make the change.  Remember to publish it again when you are ready.`}/>}
                          onClick={handleCannotChangeClose}/>
          }
          {/*isShowingFileUpload &&
                  <FileUploadModal handleClose={handleFileUploadClose} title={'Assessment Question'} label={'File for'}
                      personId={personId} submitFileUpload={handleSubmitFile} sendInBuildUrl={fileUploadBuildUrl}
                      handleRecordRecall={recallAfterFileUpload} showTitleEntry={true}
                      acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
                      iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
              */}
          {isShowingModal_websiteLink &&
            <TextareaModal key={'all'} handleClose={handleWebsiteLinkClose}
                           heading={<L p={p} t={`Website Link`}/>}
                           explainJSX={<L p={p}
                                          t={`Choose a website link for an assessment question.`}/>}
                           onClick={handleWebsiteLinkSave}
                           placeholder={`Website URL?`}/>
          }
          <OneFJefFooter/>
        </div>
      )
}

export default withAlert(AssessmentQuestionsView)
