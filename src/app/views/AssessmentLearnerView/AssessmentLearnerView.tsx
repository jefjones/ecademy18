import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import styles from './AssessmentLearnerView.css'
const p = 'AssessmentLearnerView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import AssessIncompleteModal from '../../components/AssessIncompleteModal'
import MessageModal from '../../components/MessageModal'
import TextDisplay from '../../components/TextDisplay'
import LinkDisplay from '../../components/LinkDisplay'
import FileUploadModal from '../../components/FileUploadModal'
import AssessmentTrueFalse from '../../components/AssessmentTrueFalse'
import AssessmentMultipleChoice from '../../components/AssessmentMultipleChoice'
import AssessmentMultipleAnswer from '../../components/AssessmentMultipleAnswer'
import AssessmentEssay from '../../components/AssessmentEssay'
import AssessmentPassage from '../../components/AssessmentPassage'
import AssessmentPictureAudio from '../../components/AssessmentPictureAudio'
import AssessmentSingleEntry from '../../components/AssessmentSingleEntry'
import AssessmentFillBlank from '../../components/AssessmentFillBlank'
import AssessmentMatching from '../../components/AssessmentMatching'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import BreadCrumb from '../../components/BreadCrumb'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function AssessmentLearnerView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(false)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(false)
  const [isShowingModal_incomplete, setIsShowingModal_incomplete] = useState(false)
  const [isRecordComplete, setIsRecordComplete] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [assessmentQuestionId, setAssessmentQuestionId] = useState(undefined)
  const [isShowingModal_removeFile, setIsShowingModal_removeFile] = useState(true)
  const [deleted_fileUploadId, setDeleted_fileUploadId] = useState(fileUploadId)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {assessment, assessmentQuestions} = props
    			
    			if (assessment && assessment.assessmentId && assessment.oneAtAtimeView && !isInit && assessmentQuestions && assessmentQuestions.length > 0) {
    					setIsInit(true); setCurrentIndex(1)
    					showOneAtATimeView(1)
    					setBreadCrumb()
    			}
    	
  }, [])

  const {personId, course, assessment, assessmentQuestions, addOrUpdateAssessmentAnswer, accessRoles, setPenspringTransfer, assignmentId,
  						removeLearnerRecordingOpen, updateAssessmentLocalAnswer, courseScheduledId, benchmarkTestId} = props
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <span className={globalStyles.pageTitle}>{(assessment && assessment.courseContentTypeName) || <L p={p} t={`Assessment`}/>}</span>
              </div>
              <div className={classes(styles.moreTop, styles.rowWrap)}>
                  {course && course.courseName &&
  										<TextDisplay label={<L p={p} t={`Course`}/>}
  												text={<Link to={(accessRoles.admin || accessRoles.facilitator) ? `/gradebookEntry/${courseScheduledId}` : `/studentAssignments/${courseScheduledId}`} className={globalStyles.link}>
  																	{course && course.courseName}
  															</Link>} />
  								}
  								<TextDisplay label={benchmarkTestId ? `Benchmark assessment` : `Assessment`} text={assessment && assessment.name} />
              </div>
              <hr />
              {assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.map((m, i) =>
  						  <div id={`question${i+1*1}`} key={i+1*1}>
  								{assessment.oneAtAtimeView &&
  										<div>
  												<div className={styles.row}>
  														<div className={styles.breadCrumbLabel}><L p={p} t={`questions:`}/></div>
  														<BreadCrumb options={breadCrumb} currentIndex={currentIndex} onClick={setNextIndexJump}/>
  												</div>
  												<hr/>
  										</div>
  								}
                  {m.questionTypeCode === 'TRUEFALSE' &&
                      <div key={i}>
                          <AssessmentTrueFalse nameKey={i} question={m} personId={personId} onClick={addOrUpdateAssessmentAnswer} assignmentId={assignmentId}
  														bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
                  }
  								{m.questionTypeCode === 'MULTIPLECHOICE' &&
                      <div key={i}>
                          <AssessmentMultipleChoice nameKey={i} question={m} onClick={addOrUpdateAssessmentAnswer} personId={personId} assignmentId={assignmentId}
  														bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
                  }
  								{m.questionTypeCode === 'MULTIPLEANSWER' &&
                      <div key={i}>
                          <AssessmentMultipleAnswer nameKey={i} question={m} answers={m.answers} onClick={addOrUpdateAssessmentAnswer} personId={personId}
  														learnerAnswer={m.learnerAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                          <hr className={styles.hrHeight}/>
                      </div>
                  }
  								{m.questionTypeCode === 'ESSAY' &&
                      <div key={i}>
                          <AssessmentEssay nameKey={i} question={m} personId={personId} onChange={addOrUpdateAssessmentAnswer}
  														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} course={course} assignmentId={assignmentId}
  														createWorkAndPenspringTransfer={handleCreateWorkAndPenspringTransfer} setPenspringTransfer={setPenspringTransfer}
  														bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
  								}
  								{m.questionTypeCode === 'PICTUREORAUDIO' &&
                      <div key={i}>
                          <AssessmentPictureAudio nameKey={i} question={m} personId={personId} onChange={addOrUpdateAssessmentAnswer}
  														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} course={course} isStudent={true}
  														handleRemoveFileOpen={handleRemoveFileOpen} removeLearnerRecordingOpen={removeLearnerRecordingOpen}
  														assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
                  }
  								{m.questionTypeCode === 'PASSAGE' &&
                      <div key={i}>
                          <AssessmentPassage nameKey={i} question={m} accessRoles={accessRoles} bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
  								}
  								{m.questionTypeCode === 'SINGLEENTRY' &&
                      <div key={i}>
                          <AssessmentSingleEntry nameKey={i} question={m} answers={m.answers} onClick={addOrUpdateAssessmentAnswer} personId={personId}
  														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} learnerAnswer={m.learnerAnswer}
  														updateAssessmentLocalAnswer={updateAssessmentLocalAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
  								}
  								{m.questionTypeCode === 'FILLBLANK' &&
                      <div key={i}>
                          <AssessmentFillBlank nameKey={i} question={m} onClick={addOrUpdateAssessmentAnswer} personId={personId}
  														assessmentTitle={assessment && assessment.name} accessRoles={accessRoles} learnerAnswer={m.learnerAnswer}
  														updateAssessmentLocalAnswer={updateAssessmentLocalAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
  								}
  								{m.questionTypeCode === 'MATCHING' &&
                      <div key={i}>
  												<AssessmentMatching nameKey={i} viewMode={'StudentView'} question={m} accessRoles={accessRoles}
  														onClick={addOrUpdateAssessmentAnswer} personId={personId}  learnerAnswer={m.learnerAnswer}
  														addOrUpdateAssessmentAnswer={addOrUpdateAssessmentAnswer} assignmentId={assignmentId} bigTextDisplay={assessment.bigTextDisplay}/>
                          <div className={classes(styles.moreLeft, styles.moreTop)}>
  														{m.websiteLinks.length > 0 &&
  																<div>
  																		<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  																		{m.websiteLinks.map((w, i) =>
  																				<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																		)}
  																</div>
  														}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
                  }
  								{assessment.oneAtAtimeView &&
  										<div className={styles.buttonPair}>
  												{currentIndex !== 1 &&
  														<a className={styles.prevButton} onClick={() => setNextIndexUpOrDown(-1)}>{`< Previous`}</a>
  												}
  												{currentIndex !== assessmentQuestions.length &&
  														<ButtonWithIcon label={<L p={p} t={`Next >`}/>} icon={'checkmark_circle'} onClick={() => setNextIndexUpOrDown(1)}/>
  												}
  												{currentIndex === assessmentQuestions.length &&
  														<div className={styles.rowRight}>
  																<ButtonWithIcon label={<L p={p} t={`Finish`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  								            </div>
  												}
  										</div>
  								}
  							</div>
              )}
  						{assessmentQuestions && assessmentQuestions.length > 0 && !assessment.oneAtAtimeView &&
  		            <div className={styles.rowRight}>
  										<ButtonWithIcon label={<L p={p} t={`Finish`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  		            </div>
  						}
              {isShowingModal_removeFileUpload &&
                  <MessageModal handleClose={handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file upload?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this file upload?`}/>} isConfirmType={true}
                     onClick={handleRemoveFileUpload} />
              }
              {isShowingModal_incomplete &&
                  <AssessIncompleteModal handleClose={handleIncompleteClose} heading={<L p={p} t={`Incomplete`}/>} notAnswered={notAnswered}
  										onClick={handleIncompleteContinue} forceAllAnswers={assessment.forceAllAnswers}/>
              }
              {isShowingFileUpload &&
                  <FileUploadModal handleClose={handleFileUploadClose} title={<L p={p} t={`Assessment Question`}/>} label={<L p={p} t={`File for`}/>}
                      personId={personId} submitFileUpload={handleSubmitFile} sendInBuildUrl={fileUploadBuildUrl}
                      handleRecordRecall={recallAfterFileUpload} showTitleEntry={true}
                      acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
                      iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
              }
  						{isShowingModal_removeFile &&
                  <MessageModal handleClose={handleRemoveFileClose} heading={<L p={p} t={`Remove this picture?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this picture?`}/>} isConfirmType={true}
                     onClick={handleRemoveFile} />
              }
              <OneFJefFooter />
          </div>
      )
}
export default AssessmentLearnerView
