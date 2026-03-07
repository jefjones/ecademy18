import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import axios from 'axios'
import * as styles from './AssessmentItemModal.css'
import * as globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'join-classnames'
import InputDataList from '../InputDataList'
import TextDisplay from '../TextDisplay'
import InputText from '../InputText'
import MessageModal from '../MessageModal'
import SelectSingleDropDown from '../SelectSingleDropDown'
import InputTextArea from '../InputTextArea'
import ImageDisplay from '../ImageDisplay'
import AssessmentEssayKeyword from '../AssessmentEssayKeyword'
import AssessmentAnswerVariation from '../AssessmentAnswerVariation'
import AssessmentMatching from '../AssessmentMatching'
import FileUploadModalWithCrop from '../FileUploadModalWithCrop'
import VoiceRecordingModal2 from '../../components/VoiceRecordingModal2'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import RadioGroup from '../RadioGroup'
import Checkbox from '../Checkbox'
import AudioDisplay from '../AudioDisplay'
import Icon from '../Icon'
import {guidEmpty} from '../../utils/guidValidate'
import MicRecorder from 'mic-recorder-to-mp3'
const recorder = new MicRecorder({ bitRate: 128 })
const p = 'component'
import L from '../../components/PageLanguage'

const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

function AssessmentItemModal(props) {
  const [file, setFile] = useState({})
  const [multipleChoiceCorrectAnswer, setMultipleChoiceCorrectAnswer] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFileChosen, setIsFileChosen] = useState(false)
  const [openFileAttach, setOpenFileAttach] = useState(false)
  const [isShowingModal_keywordCount, setIsShowingModal_keywordCount] = useState(false)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(false)
  const [isShowingVoiceRecording, setIsShowingVoiceRecording] = useState(false)
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState(question && question.answers ? question.answers : [{answerText: ''}, {answerText: ''}, {answerText: ''}])
  const [multipleAnswerAnswers, setMultipleAnswerAnswers] = useState(question && question.answers ? question.answers : [{answerText: ''}, {answerText: ''}, {answerText: ''}])
  const [hasOrigUpdate, setHasOrigUpdate] = useState(false)
  const [matchingEntries, setMatchingEntries] = useState(6)
  const [errors, setErrors] = useState({
	            questionTypeCode: '',
	            pointsPossible: '',
	            learnerOutcomeList: '',
	            questionText: '',
	            answers: '',
	            correctAnswer: '',
	            keywordPhrase: '',
	            keywordCountAccuracy: '',
          })
  const [questionTypeCode, setQuestionTypeCode] = useState('')
  const [pointsPossible, setPointsPossible] = useState('')
  const [learnerOutcomeList, setLearnerOutcomeList] = useState([])
  const [questionText, setQuestionText] = useState('')
  const [answers, setAnswers] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [keywordPhrase, setKeywordPhrase] = useState('')
  const [keywordCountAccuracy, setKeywordCountAccuracy] = useState('')
  const [question, setQuestion] = useState(assessmentItem)
  const [standardIds, setStandardIds] = useState(assessmentItem.standards)
  const [isInit, setIsInit] = useState(true)
  const [p, setP] = useState(undefined)
  const [errorTotalPoints, setErrorTotalPoints] = useState("You must choose at least one standard")
  const [isQuestionFile, setIsQuestionFile] = useState('')
  const [answerIndex, setAnswerIndex] = useState('')
  const [isSolutionFile, setIsSolutionFile] = useState('')
  const [isMatchingFile, setIsMatchingFile] = useState('')
  const [onTheAir, setOnTheAir] = useState(true)
  const [selectedRecording_question, setSelectedRecording_question] = useState(blob)
  const [blobUrl, setBlobUrl] = useState(window.URL.createObjectURL(blob))
  const [selectedRecording_solution, setSelectedRecording_solution] = useState(blob)
  const [selectedRecording_toMatch, setSelectedRecording_toMatch] = useState(blob)
  const [multipleMatchingAnswers, setMultipleMatchingAnswers] = useState(undefined)
  const [selectedFile_question, setSelectedFile_question] = useState(isSolutionFile
							? selectedFile_solution
							: isMatchingFile
									? question.matches && question.matches.length > 0 && question.matches[answerIndex].file
									: question.answers && question.answers.length > 0 && question.answers[answerIndex].file)
  const [selectedFile_solution, setSelectedFile_solution] = useState(isMatchingFile
									? question.matches && question.matches.length > 0 && question.matches[answerIndex].file
									: question.answers && question.answers.length > 0 && question.answers[answerIndex].file)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [fillInTheBlankPhrases, setFillInTheBlankPhrases] = useState(undefined)
  const [isShowingModal_removeQuestionRecording, setIsShowingModal_removeQuestionRecording] = useState(true)
  const [assessmentQuestionId, setAssessmentQuestionId] = useState('')
  const [deleted_recordingFileUploadId, setDeleted_recordingFileUploadId] = useState(recordingFileUploadId)
  const [isShowingModal_removeAnswerRecording, setIsShowingModal_removeAnswerRecording] = useState(true)
  const [fileUploadId, setFileUploadId] = useState(undefined)
  const [multipleAnswerType, setMultipleAnswerType] = useState('')
  const [deleted_fileUploadId, setDeleted_fileUploadId] = useState(fileUploadId)
  const [isShowingModal_removeSolutionRecording, setIsShowingModal_removeSolutionRecording] = useState(true)

  useEffect(() => {
    
    			const {assessmentItem} = props
    			setQuestion(assessmentItem)
    			assessmentItem && assessmentItem.questionTypeCode === 'FILLBLANK' && blankOutWord(null, assessmentItem); //This is to set the fillBlanksChosen variable.
    	
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			let assessmentItem = Object.assign({}, props.assessmentItem)
    			
    			if (!isInit && assessmentItem && assessmentItem.assessmentQuestionId && question.assessmentQuestionId) {
    					assessmentItem.questionTypeCode === 'FILLBLANK' && blankOutWord(null, assessmentItem); //This is to set the fillBlanksChosen variable.
    					if (assessmentItem.standards && assessmentItem.standards.length > 0) {
    							assessmentItem['standardIds'] = assessmentItem.standards.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], [])
    					}
    					setQuestion(assessmentItem); setStandardIds(assessmentItem.standards); setIsInit(true)
    			}
    	
  }, [])

  const {personId, handleClose, className, questionTypes, assessment, handleRemoveFileOpen, gradingType, removeAnswerFileOpen, handleRemoveSolutionFileOpen,
                accessRoles, handleSubmit, removeToMatchFileOpen, standards=[]} = props
  			let newState = Object.assign({}, state)
        let multipleCount = newState.multipleCount >= 3 ? newState.multipleCount : 3
  
  			let answerOptions = []
  
  			for (let i = 0; i < matchingEntries; i++) {
  					let option = {id: alpha[i], label: alpha[i]}
  					answerOptions = answerOptions && answerOptions.length > 0 ? answerOptions.concat(option) : [option]
  			}
  
        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.center}>
                            <div className={styles.heading}>
  															{question.assessmentQuestionId && question.assessmentQuestionId !== guidEmpty
  																	? <L p={p} t={`Edit Question`}/>
  																	: <L p={p} t={`Add Question`}/>
  															}
  													</div>
                            <div className={styles.moreTop}>
                                <TextDisplay label={<L p={p} t={`Assessment`}/>} text={assessment && assessment.name} />
                            </div>
                        </div>
                        <ul className={styles.unorderedList}>
                            <li>
  															{question.assessmentQuestionId
  																	? <TextDisplay label={<L p={p} t={`Question Type`}/>} text={questionTypes && questionTypes.length > 0 && questionTypes.filter(m => m.id === question.questionTypeCode)[0].label} />
  																	: <div>
  			                                  <SelectSingleDropDown
  			                                      id={`questionTypeCode`}
  			                                      name={`questionTypeCode`}
  			                                      label={<L p={p} t={`Question Type`}/>}
  			                                      value={question.questionTypeCode || ''}
  			                                      options={questionTypes}
  			                                      className={styles.moreBottomMargin}
  			                                      height={`medium`}
  			                                      onChange={changeItem}
  			                                      disabled={question.assessmentQuestionId}
  																						required={true}
  																						whenFilled={question.questionTypeCode}
  			                                      error={errors.questionTypeCode}/>
  			                              </div>
  															}
                                {question.assessmentQuestionId &&
                                   <div className={classes(styles.instructions, styles.muchLeft)}>If you want to change the question type, delete and start again.</div>
                                }
                            </li>
                            {question.questionTypeCode && question.questionTypeCode !== '0' && question.questionTypeCode !== 'PASSAGE' &&
                                <li>
                                    <InputText
                                        id={`pointsPossible`}
                                        name={`pointsPossible`}
                                        size={'super-short'}
                                        label={<L p={p} t={`Points`}/>}
  																			numberOnly={true}
                                        value={question.pointsPossible || ''}
                                        onChange={changeItem}
  																			required={true}
  																			whenFilled={question.pointsPossible}
  																			autoComplete={'dontdoit'}
                                        error={errors.pointsPossible}/>
                                </li>
                            }
  													{gradingType === 'STANDARDSRATING' && question.questionTypeCode !== 'PASSAGE' &&
  															<li>
  																	<div className={styles.listPosition}>
  																			<InputDataList
  																					label={<L p={p} t={`Standards`}/>}
  																					name={'standardIds'}
  																					options={standards || [{id: '', value: ''}]}
  																					value={standardIds}
  																					multiple={true}
  																					height={`medium`}
  																					className={styles.moreTop}
  																					onChange={chooseStandards}/>
  										              </div>
  															</li>
  													}
                            {question.questionTypeCode && question.questionTypeCode !== '0' && question.questionTypeCode !== 'MATCHING' &&
                                <li>
  																	<InputTextArea
  																			label={question.questionTypeCode === 'PASSAGE' ? <L p={p} t={`Enter the passage`}/> : <L p={p} t={`Enter the question`}/>}
  																			name={'questionText'}
  																			value={question.questionText || ''}
  																			autoComplete={'dontdoit'}
  																			onChange={changeItem}
  																			required={true}
  																			whenFilled={(question.questionTypeCode === 'FILLBLANK' && question.questionText)
  																							|| (question.questionTypeCode !== 'FILLBLANK' && (question.questionText || selectedFile_question || selectedRecording_question))}
  																			error={errors.questionText}/>
  																	<div className={classes(styles.row, styles.includePicture)} ref={(ref) => (questionFile = ref)}>
  																			{/*<div className={globalStyles.instructionsBigger}>Enter a question above and / or</div>*/}
  																			<div className={styles.row} onClick={() => handleFileUploadOpen(true)}>
  																					<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
  																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
  																			</div>
  																			<div className={styles.row} onClick={() => handleVoiceRecordingOpen(true)}>
  																					<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
  																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
  																			</div>
  																	</div>
  																	<img src={''} alt={'New'} ref={(ref) => (imageViewer = ref)} />
  																	{!selectedRecording_question && question.questionRecordingFileUrl &&
  																			<AudioDisplay src={question.questionRecordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
  																					isSmall={true} isOwner={question.isOwner}
  																					deleteFunction={(event) => handleRemoveQuestionRecordingOpen(question.assessmentQuestionId, question.questionRecordingFileUploadId)} />
  																	}
  																	{selectedRecording_question &&
  																			<AudioDisplay src={selectedRecording_question && window.URL.createObjectURL(selectedRecording_question)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
  																					isSmall={true} isOwner={question.isOwner}
  																					deleteFunction={(event) => handleRemoveQuestionRecordingOpen(question.assessmentQuestionId, question.questionRecordingFileUploadId)} />
  																	}
  																	{question.questionFileUrl &&
  																			<ImageDisplay key={'questionFile'} linkText={''} url={question.questionFileUrl} isOwner={question.isOwner}
  																					deleteFunction={() => handleRemoveFileOpen(question.assessmentQuestionId, question.questionFileUploadId)}/>
  																  }
  																	<hr/>
                                </li>
                            }
                            {question.questionTypeCode === 'TRUEFALSE' &&
                              <li>
  	                                <RadioGroup
                                      data={[{ label: <L p={p} t={`True`}/>, id: 'true' }, { label: <L p={p} t={`False`}/>, id: 'false' }, ]}
                                      name={`answerTrueFalse`}
                                      horizontal={true}
                                      className={styles.radio}
                                      initialValue={question.correctAnswer}
                                      onClick={handleTrueFalse}/>
                              </li>
                            }
  													{question.questionTypeCode === 'SINGLEENTRY' &&
                              <li>
  																<Checkbox
  																		id={'answerNumberOnly'}
  																		name={'answerNumberOnly'}
  																		label={<L p={p} t={`Number only`}/>}
  																		labelClass={styles.checkboxLabel}
  																		checked={question.answerNumberOnly || false}
  																		onClick={toggleAnswerNumberOnly}
  																		className={styles.button}/>
  																<InputText
  																		id={`correctAnswer`}
  																		name={`correctAnswer`}
  																		size={question.answerNumberOnly ? 'super-short' : 'medium-long'}
  																		label={<L p={p} t={`Answer`}/>}
  																		value={question.correctAnswer || ''}
  																		onChange={changeItem}
  																		numberOnly={question.answerNumberOnly}
  																		autoComplete={'dontdoit'}
  																		required={true}
  																		whenFilled={question.correctAnswer} />
                              </li>
                            }
  													{question.questionTypeCode === 'SINGLEENTRY' &&
                              <li>
  																<AssessmentAnswerVariation answerVariations={question.answerVariations} addAnswerVariation={handleAddAnswerVariation}
  																		removeAnswerVariation={handleRemoveAnswerVariation} />
                              </li>
                            }
  													{question.questionText && question.questionTypeCode === 'FILLBLANK' &&
                              <li>
  																<TextDisplay label={<L p={p} t={`Full phrase`}/>} text={question.questionText} />
                              </li>
                            }
  													{question.questionText && question.questionTypeCode === 'FILLBLANK' &&
                              <li>
  																<TextDisplay label={
  																				<div className={styles.row}>
  																						<div><L p={p} t={`Blank-out phrase`}/></div>
  																						<div className={classes(globalStyles.instructionsBigger, styles.liftUp)}><L p={p} t={`Click on a word to blank it out`}/></div>
  																				</div>
  																		} text={fillInTheBlankDisplay()} />
                              </li>
                            }
  													{fillInTheBlankPhrases && fillInTheBlankPhrases.length > 0 && question.questionTypeCode === 'FILLBLANK' &&
  															<li>
  																	{fillInTheBlankPhrases.map((m, i) => !m
  																					? null
  																					: <TextDisplay label={fillInTheBlankPhrases.length === 1 ? <L p={p} t={`Answer`}/> : <L p={p} t={`Answer #${i+1*1}`}/>} text={m} key={i} />
  																	)}
  																	<div className={styles.positionVariations}>
  																			<AssessmentAnswerVariation answerVariations={question.answerVariations} addAnswerVariation={handleAddAnswerVariation}
  																					removeAnswerVariation={handleRemoveAnswerVariation} />
  																	</div>
  															</li>
                            }
  													{question.questionTypeCode === 'MATCHING' &&
                              <li>
  																<AssessmentMatching viewMode={'AddOrUpdate'} question={question} accessRoles={accessRoles} handleSubmit={handleSubmit}
  																		removeQuestionFileOpen={handleRemoveQuestionFileOpen}
  																		removeSolutionFileOpen={handleRemoveSolutionFileOpen}
  																		removeAnswerRecordingOpen={handleRemoveAnswerRecordingOpen}
  																		removeSolutionRecordingOpen={handleRemoveSolutionRecordingOpen}
  																		handleMatchingCorrectAnswers={handleMatchingCorrectAnswers}
  																		handleMatchingQuestionText={handleMatchingQuestionText}
  																		handleMatchingToMatchText={handleMatchingToMatchText}
  																		removeMatchingRemoveLine={removeMatchingRemoveLine}
  																		removeAnswerFileOpen={removeAnswerFileOpen}
  																		handleFileUploadOpen={handleFileUploadOpen}
  																		handleVoiceRecordingOpen={handleVoiceRecordingOpen}
  																		removeToMatchFileOpen={removeToMatchFileOpen}
  																		multipleAnswerAnswers={multipleAnswerAnswers}
  																		multipleMatchingAnswers={multipleMatchingAnswers} />
                              </li>
                            }
                            {question.questionTypeCode === 'ESSAY' &&
                              <li>
  																<AssessmentEssayKeyword keywordPhrases={question.keywordPhrases} addKeywordPhrase={handleAddKeywordPhrase}
  																		removeKeywordPhrase={handleRemoveKeywordPhrase} keywordCountAccuracy={question.keywordCountAccuracy}
  																		updateKeywordCountAccuracy={changeItem}/>
                              </li>
                            }
                            {question.questionTypeCode === 'PASSAGE' &&
                              <li>
                                  <span className={styles.labelNotice}><L p={p} t={`This is intended to be a reading or example of a problem which will be followed by two or more questions.`}/></span><br/>
                              </li>
                            }
                            {question.questionTypeCode === 'MULTIPLECHOICE' &&
                              <li>
                                  {alpha.map((alph, index) => {  //eslint-disable-line
                                    if (multipleCount >= index + 1) {
                                      return <div key={index}>
  																							<div className={styles.row}>
  		                                              <input type={`radio`} name={'multipleChoice'} id={'multipleChoice'} value={index}
  																											checked={(multipleChoiceAnswers[index] && multipleChoiceAnswers[index].isCorrect) || false}
  		                                                  onClick={handleMultipleChoiceCorrectAnswer} onChange={() => {}}/>
  		                                              <span className={styles.label}>{alph}</span>
  		                                              <InputTextArea
  																											label={''}
  																											id={alpha[index]}
  		                                                  name={alpha[index]}
  																											value={(multipleChoiceAnswers[index] && multipleChoiceAnswers[index].answerText) || ''}
  																											autoComplete={'dontdoit'}
  																											onChange={(event) => handleMultipleChoiceAnswer(event, index)}/>
  																									{multipleCount > 3 &&
  																											<Icon pathName={`trash2`} premium={true} className={styles.icon} onClick={() => handleRemoveMultipleChoiceAnswer(index)}/>
  																									}
  		                                          </div>
  																							<div className={classes(styles.row, styles.muchMoreLeft)} ref={(ref) => (this[`answerFile${index}`] = ref)}>
  																									{/*<div className={globalStyles.instructionsBigger}>Enter an answer above and / or</div>
                                                    Removed text due to simplicity of page and to clean up modal. It's self explanitory*/}
  																									<div className={styles.row} onClick={() => handleFileUploadOpen(false, index)}>
  																											<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
  																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
  																									</div>
  																									<div className={styles.row} onClick={() => handleVoiceRecordingOpen(false, index)}>
  																											<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
  																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
  																									</div>
  																							</div>
  																							<img src={''} alt={'New'} id={`imageViewer${question.questionTypeCode}${index}`} />
  																							{(!(multipleChoiceAnswers[index] && multipleChoiceAnswers[index].recording)
  																													&& (question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl)) &&
  																									<AudioDisplay src={question.answers[index].recordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
  																											isSmall={true} isOwner={question.isOwner}
  																											deleteFunction={(event) => handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, question.answers[index].recordingFileUploadId, index, 'multipleChoice')} />
  																							}
  																							{multipleChoiceAnswers[index] && multipleChoiceAnswers[index].recording
  																									&& deleted_fileUploadId !== multipleChoiceAnswers[index].recordingFileUploadId &&
  																											<AudioDisplay src={window.URL.createObjectURL(multipleChoiceAnswers[index].recording)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
  																													isSmall={true} isOwner={question.isOwner}
  																													deleteFunction={(event) => handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, multipleChoiceAnswers[index].fileUploadId, index, 'multipleChoice')} />
  																							}
  																							{multipleChoiceAnswers[alpha.indexOf(alph)] && multipleChoiceAnswers[alpha.indexOf(alph)].fileUrl
  																									&& deleted_fileUploadId !== multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId &&
  																											<ImageDisplay linkText={''} url={multipleChoiceAnswers[alpha.indexOf(alph)].fileUrl} isOwner={question.isOwner}
  																													deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId)}/>
  																							}
  																							<hr/>
  																					</div>
                                  }})}
                                  <a onClick={incrementMultipleCount} className={styles.link}><L p={p} t={`Add another multiple choice answer`}/></a>
                              </li>
                            }
                            {question.questionTypeCode === 'MULTIPLEANSWER' &&
                              <li>
                                  {alpha.map((alph, index) => {  //eslint-disable-line
                                    if (multipleCount >= index+1) {
                                      return <div key={index}>
  																							<div className={styles.row}>
  		                                              <input type={`checkbox`} id={alph} name={alph} value={index}
  		                                                  checked={(multipleAnswerAnswers[index] && multipleAnswerAnswers[index].isCorrect) || false}
  		                                                  onClick={handleMultipleAnswerCorrectAnswer} onChange={() => {}}/>
  		                                              <span className={styles.label}>{alph}</span>
  																									<InputTextArea
  																											label={''}
  																											id={alpha[index]}
  		                                                  name={alpha[index]}
  																											autoComplete={'dontdoit'}
  																											value={(multipleAnswerAnswers[alpha.indexOf(alph)] && multipleAnswerAnswers[alpha.indexOf(alph)].answerText) || ''}
  		                                                  onChange={handleMultipleAnswerAnswer}
  																											error={errors.correctAnswer}/>
  																									{multipleCount > 3 &&
  																											<Icon pathName={`trash2`} premium={true} className={styles.icon} onClick={() => handleRemoveMultipleChoiceAnswer(index)}/>
  																									}
  																							</div>
  																							<div className={classes(styles.row, styles.includePicture, styles.muchMoreLeft)} ref={(ref) => (this[`answerFile${index}`] = ref)}>
                                                    {/*<div className={globalStyles.instructionsBigger}>Enter a question above and / or</div>
                                                    Removed text due to simplicity of page and to clean up modal. It's self explanitory*/}
  																									<div className={styles.row} onClick={() => handleFileUploadOpen(false, index)}>
  																											<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
  																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
  																									</div>
  																									<div className={styles.row} onClick={() => handleVoiceRecordingOpen(false, index)}>
  																											<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
  																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
  																									</div>
  																							</div>
  																							<img src={''} alt={'New'} id={`imageViewer${question.questionTypeCode}${index}`} />
  																							{(!(multipleAnswerAnswers[index] && multipleAnswerAnswers[index].recording)
  																													&& (question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl)) &&
  																									<AudioDisplay src={question.answers[index].recordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
  																											deleteFunction={(event) => handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, question.answers[index].recordingFileUploadId, index, 'multipleAnswer')} />
  																							}
  																							{multipleAnswerAnswers[index] && multipleAnswerAnswers[index].recording
  																									&& deleted_fileUploadId !== multipleAnswerAnswers[index].recordingFileUploadId &&
  																											<AudioDisplay src={window.URL.createObjectURL(multipleAnswerAnswers[index].recording)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
  																													deleteFunction={(event) => handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, multipleAnswerAnswers[index].fileUploadId, index, 'multipleAnswer')} />
  																							}
  																							{multipleAnswerAnswers[alpha.indexOf(alph)] && multipleAnswerAnswers[alpha.indexOf(alph)].fileUrl
  																									&& deleted_fileUploadId !== multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId &&
  																											<ImageDisplay linkText={''} url={multipleChoiceAnswers[alpha.indexOf(alph)].fileUrl} isOwner={question.isOwner}
  																													deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId)}/>
  																							}
  																							<hr/>
                                            </div>
                                  }})}
                                  <a onClick={incrementMultipleCount} className={styles.link}><L p={p} t={`Add another multiple choice answer`}/></a>
                              </li>
                            }
  													{question.questionTypeCode && question.questionTypeCode !== 'PASSAGE' &&
  															<li>
  																	<hr/>
  																	<div className={styles.headerLabel}><L p={p} t={`Solution (optional)`}/></div>
  																	<div className={styles.moreTop}>
  																			<InputTextArea
  																					label={<L p={p} t={`After the quiz is corrected, this explanation or picture will be displayed`}/>}
  																					id={'solutionText'}
  																					name={'solutionText'}
  																					value={question.solutionText || ''}
  																					onChange={changeItem}
  																					autoComplete={'dontdoit'}/>
  																	</div>
  																	<div className={classes(styles.row, styles.includePicture)} ref={(ref) => (solutionFile = ref)}>
                                        {/*<div className={globalStyles.instructionsBigger}>Enter a question above and / or</div>*/}
  																			<div className={styles.row} onClick={() => handleFileUploadOpen(false, null, true)}>
  																					<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
  																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
  																			</div>
  																			<div className={styles.row} onClick={() => handleVoiceRecordingOpen(false, null, true)}>
  																					<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
  																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
  																			</div>
  																	</div>
  																	<img src={''} alt={'New'}  ref={(ref) => (imageViewerSolution = ref)}/>
  																	{!selectedRecording_solution && question.solutionRecordingFileUrl &&
  																			<AudioDisplay src={question.solutionRecordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
  																					deleteFunction={(event) => handleRemoveSolutionRecordingOpen(question.assessmentQuestionId, question.solutionRecordingFileUploadId)} />
  																	}
  																	{selectedRecording_solution &&
  																			<AudioDisplay src={window.URL.createObjectURL(selectedRecording_solution)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
  																					deleteFunction={(event) => handleRemoveSolutionRecordingOpen(question.assessmentQuestionId, question.solutionRecordingFileUploadId)} />
  																	}
  																	{question.solutionFileUploadId && question.solutionFileUrl
  																			&& deleted_fileUploadId !== question.solutionFileUploadId &&
  																					<ImageDisplay linkText={''} url={question.solutionFileUrl} isOwner={question.isOwner}
  																							deleteFunction={() => handleRemoveSolutionFileOpen(question.assessmentQuestionId, question.solution.fileUploadId)}/>
  																	}
  																	<hr/>
  															</li>
  													}
                            <li>
                                <span className={styles.error}>{errors.correctAnswer}</span>
                            </li>
                            <li>
  															<div className={classes(styles.rowRight)}>
  																	<div className={styles.cancelLink} onClick={handleClose}>
  																			Close
  																	</div>
  																	<div>
  							                    		<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  																	</div>
  							                </div>
                            </li>
                        </ul>
                    </ModalDialog>
                </ModalContainer>
  							{isShowingModal_keywordCount &&
  									<MessageModal handleClose={handleKeywordCountClose} heading={<L p={p} t={`Missing keyword count accuracy?`}/>}
  										 explainJSX={<L p={p} t={`You have entered a keyword for this essay, but you didn't indicate how many keywords that need to be present in the essay to get full credit. Do you want to save this entry anyway?`}/>} isConfirmType={true}
  										 onClick={handleKeywordCountSave} />
  							}
  							{isShowingFileUpload &&
  									<FileUploadModalWithCrop handleClose={handleFileUploadClose} title={<L p={p} t={`Choose Assessment Picture`}/>}
  											personId={personId} submitFileUpload={handleFileUploadSubmit} answerIndex={answerIndex}
  											file={isQuestionFile
  														? selectedFile_question
  														: isSolutionFile
  																?	selectedFile_solution
  																: isMatchingFile
  																		? question.matches && question.matches.length > 0 && question.matches[answerIndex] && question.matches[answerIndex].file
  																		: question.answers && question.answers.length > 0 && question.answers[answerIndex] && question.answers[answerIndex].file
  											}
  											handleInputFile={isQuestionFile
  														? handleInputFile_question
  														: isSolutionFile
  																? handleInputFile_solution
  																: isMatchingFile
  																		? handleInputFile_toMatch
  																		: handleInputFile_answer}
  											acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf"}
  											handleCancelFile={isQuestionFile
  													? handleRemoveInputFile_question
  													: isSolutionFile
  															? handleRemoveInputFile_solution
  															: isMatchingFile
  																	? handleRemoveInputFile_toMatch
  																	: handleRemoveInputFile_answer
  											}/>
  							}
  							{isShowingVoiceRecording &&
  	                <VoiceRecordingModal2 handleClose={handleVoiceRecordingClose} title={<L p={p} t={`Assessment Question`}/>} label={<L p={p} t={`File for`}/>}
  	                    personId={personId}
  											record={record}
  											submitFileUpload={handleVoiceRecordingSubmit}
  											recordedBlob={isQuestionFile
  														? selectedRecording_question
  														: isSolutionFile
  																?	selectedRecording_solution
  																: isMatchingFile
  																		? question.matches && question.matches.length > 0 && question.matches[answerIndex] && question.matches[answerIndex].recording
  																		: question.answers && question.answers.length > 0 && question.answers[answerIndex] && question.answers[answerIndex].recording
  											}
  											handleCancelFile={isQuestionFile
  													? handleRemoveInputRecording_question
  													: isSolutionFile
  															? handleRemoveInputRecording_solution
  															: isMatchingFile
  																	? handleRemoveInputRecording_toMatch
  																	: handleRemoveInputRecording_answer}
  											startRecording={startRecording}
  										  stopRecording={stopRecording}
  										  blobUrl={blobUrl}
  											onTheAir={onTheAir}/>
  	            }
  							{isShowingModal_missingInfo &&
  									<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  										 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  							}
  							{isShowingModal_removeQuestionRecording &&
  	                <MessageModal handleClose={handleRemoveQuestionRecordingClose} heading={<L p={p} t={`Remove this question recording?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this question recording?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveQuestionRecording} />
  	            }
  							{isShowingModal_removeAnswerRecording &&
  	                <MessageModal handleClose={handleRemoveAnswerRecordingClose} heading={<L p={p} t={`Remove this answer recording?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this answer recording?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveAnswerRecording} />
  	            }
  							{isShowingModal_removeSolutionRecording &&
  	                <MessageModal handleClose={handleRemoveSolutionRecordingClose} heading={<L p={p} t={`Remove this solution recording?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this solution recording?`}/>} isConfirmType={true}
  	                   onClick={handleRemoveSolutionRecording} />
  	            }
            </div>
        )
}
export default AssessmentItemModal
